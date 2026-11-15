
from datetime import datetime, timezone
from typing import Optional
import os

import httpx
import psycopg
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field

load_dotenv()

app = FastAPI(
    title="AI-Powered Smart Irrigation System",
    description="Sensor ingestion and weather integration backend",
    version="1.0.0",
)


# --------------------------------------------------
# DATABASE CONNECTION
# --------------------------------------------------

def get_db_connection():
    return psycopg.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        dbname=os.getenv("DB_NAME", "smart_irrigation_db"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD"),
    )


# --------------------------------------------------
# DATABASE INITIALIZATION
# --------------------------------------------------

@app.on_event("startup")
def create_tables():
    with get_db_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS sensor_readings (
                id BIGSERIAL PRIMARY KEY,
                device_identifier VARCHAR(150) NOT NULL,
                field_id VARCHAR(100) NOT NULL,
                timestamp TIMESTAMPTZ NOT NULL,
                humidity DOUBLE PRECISION,
                temperature DOUBLE PRECISION,
                electrical_conductivity DOUBLE PRECISION,
                battery DOUBLE PRECISION,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            """
        )


# --------------------------------------------------
# SENSOR READING MODEL
# --------------------------------------------------
# --------------------------------------------------
# FIELD CONFIGURATION MODEL
# --------------------------------------------------

class FieldCreate(BaseModel):
    field_name: str = Field(min_length=1, max_length=150)
    location: Optional[str] = Field(default=None, max_length=255)
    area_acres: Optional[float] = Field(default=None, gt=0)
    crop_type: Optional[str] = Field(default=None, max_length=100)


# --------------------------------------------------
# FIELD CONFIGURATION API
# --------------------------------------------------

@app.post("/api/v1/fields", status_code=201)
def create_field(field: FieldCreate):
    try:
        with get_db_connection() as conn:
            row = conn.execute(
                """
                INSERT INTO fields (
                    field_name, location, area_acres, crop_type
                )
                VALUES (%s, %s, %s, %s)
                RETURNING id, field_name, location, area_acres,
                          crop_type, created_at;
                """,
                (
                    field.field_name.strip(),
                    field.location,
                    field.area_acres,
                    field.crop_type,
                ),
            ).fetchone()

        return {
            "id": row[0],
            "field_name": row[1],
            "location": row[2],
            "area_acres": row[3],
            "crop_type": row[4],
            "created_at": row[5],
        }

    except psycopg.Error as exc:
        raise HTTPException(
            status_code=503,
            detail="Could not create field in the database.",
        ) from exc

# LIST CONFIGURED FIELDS
@app.get("/api/v1/fields")
def list_fields():
    try:
        with get_db_connection() as conn:
            rows = conn.execute(
                """
                SELECT id, field_name, location, area_acres,
                       crop_type, created_at
                FROM fields
                ORDER BY id;
                """
            ).fetchall()

        return [
            {
                "id": row[0],
                "field_name": row[1],
                "location": row[2],
                "area_acres": row[3],
                "crop_type": row[4],
                "created_at": row[5],
            }
            for row in rows
        ]

    except psycopg.Error as exc:
        raise HTTPException(
            status_code=503,
            detail="Could not retrieve fields from the database.",
        ) from exc



class SensorReading(BaseModel):
    device_identifier: str = Field(min_length=1, max_length=150)
    field_id: str = Field(min_length=1, max_length=100)

    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    humidity: Optional[float] = Field(default=None, ge=0, le=100)
    temperature: Optional[float] = Field(default=None, ge=-80, le=100)
    electrical_conductivity: Optional[float] = Field(default=None, ge=0)
    battery: Optional[float] = Field(default=None, ge=0)


# --------------------------------------------------
# HOME ENDPOINT
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "project": "AI-Powered Smart Irrigation System",
        "module": "Sensor Data Ingestion & Weather API Integration",
        "status": "running",
    }


# --------------------------------------------------
# APPLICATION HEALTH CHECK
# --------------------------------------------------

@app.get("/health")
def health_check():
    return {"status": "healthy"}


# --------------------------------------------------
# DATABASE HEALTH CHECK
# --------------------------------------------------

@app.get("/health/database")
def database_health():
    try:
        with get_db_connection() as conn:
            conn.execute("SELECT 1")

        return {"database": "connected"}

    except psycopg.Error as exc:
        raise HTTPException(
            status_code=503,
            detail="Database connection failed. Check your .env settings.",
        ) from exc


# --------------------------------------------------
# SENSOR DATA INGESTION
# --------------------------------------------------

@app.post("/api/v1/sensors/readings")
def receive_sensor_reading(reading: SensorReading):
    try:
        with get_db_connection() as conn:
            field_exists = conn.execute(
                "SELECT 1 FROM fields WHERE id::text = %s",
                (reading.field_id,),
            ).fetchone()

            if field_exists is None:
                raise HTTPException(
                    status_code=404,
                    detail="Field ID not found. Create the field first.",
                )

            row = conn.execute(
                """
                INSERT INTO sensor_readings (
                    device_identifier,
                    field_id,
                    timestamp,
                    humidity,
                    temperature,
                    electrical_conductivity,
                    battery
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
                """,
                (
                    reading.device_identifier,
                    reading.field_id,
                    reading.timestamp,
                    reading.humidity,
                    reading.temperature,
                    reading.electrical_conductivity,
                    reading.battery,
                ),
            ).fetchone()

        return {
            "message": "Sensor reading saved successfully",
            "id": row[0],
            "stored": True,
        }

    except psycopg.Error as exc:
        raise HTTPException(
            status_code=503,
            detail="Could not save sensor reading. Check the database connection.",
        ) from exc


# --------------------------------------------------
# OPENWEATHERMAP CURRENT WEATHER
# --------------------------------------------------

@app.get("/api/v1/weather")
def get_weather(
    city: str = Query(default="Hyderabad", min_length=1, max_length=100)
):
    api_key = os.getenv("OPENWEATHER_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="Weather API key is not configured in .env",
        )

    try:
        response = httpx.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={
                "q": city,
                "appid": api_key,
                "units": "metric",
            },
            timeout=10.0,
        )

        if response.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail="City not found. Check the city name.",
            )

        if response.status_code in (401, 403):
            raise HTTPException(
                status_code=502,
                detail="Weather API key is invalid or not activated.",
            )

        response.raise_for_status()
        data = response.json()

        rainfall = data.get("rain", {})

        return {
            "city": data.get("name", city),
            "temperature_celsius": data["main"]["temp"],
            "humidity_percent": data["main"]["humidity"],
            "rainfall_last_1_hour_mm": rainfall.get("1h", 0),
            "weather_description": data["weather"][0]["description"],
            "data_source": "OpenWeatherMap",
            "retrieved_at_utc": datetime.now(timezone.utc).isoformat(),
        }

    except HTTPException:
        raise

    except httpx.TimeoutException as exc:
        raise HTTPException(
            status_code=504,
            detail="Weather service timed out. Please try again later.",
        ) from exc

    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=502,
            detail="Weather service returned an error.",
        ) from exc

    except (httpx.RequestError, ValueError, KeyError, IndexError) as exc:
        raise HTTPException(
            status_code=502,
            detail="Could not retrieve valid weather data.",
        ) from exc

# --------------------------------------------------
# OPENWEATHERMAP 5-DAY FORECAST
# --------------------------------------------------

@app.get("/api/v1/weather/forecast")
def get_weather_forecast(
    city: str = Query(default="Hyderabad", min_length=1, max_length=100)
):
    api_key = os.getenv("OPENWEATHER_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="Weather API key is not configured in .env",
        )

    try:
        response = httpx.get(
            "https://api.openweathermap.org/data/2.5/forecast",
            params={
                "q": city,
                "appid": api_key,
                "units": "metric",
            },
            timeout=10.0,
        )

        if response.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail="City not found. Check the city name.",
            )

        if response.status_code in (401, 403):
            raise HTTPException(
                status_code=502,
                detail="Weather API key is invalid or not activated.",
            )

        response.raise_for_status()
        data = response.json()

        forecasts = []
        for item in data.get("list", []):
            forecasts.append({
                "forecast_at": item.get("dt_txt"),
                "temperature_celsius": item.get("main", {}).get("temp"),
                "humidity_percent": item.get("main", {}).get("humidity"),
                "rainfall_3h_mm": item.get("rain", {}).get("3h", 0),
                "weather_description": item.get("weather", [{}])[0].get(
                    "description"
                ),
            })

        return {
            "city": data.get("city", {}).get("name", city),
            "forecast_count": len(forecasts),
            "forecasts": forecasts,
            "data_source": "OpenWeatherMap",
            "retrieved_at_utc": datetime.now(timezone.utc).isoformat(),
        }

    except HTTPException:
        raise

    except httpx.TimeoutException as exc:
        raise HTTPException(
            status_code=504,
            detail="Weather forecast service timed out.",
        ) from exc

    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=502,
            detail="Weather forecast service returned an error.",
        ) from exc

    except (httpx.RequestError, ValueError, KeyError, IndexError) as exc:
        raise HTTPException(
            status_code=502,
            detail="Could not retrieve valid forecast data.",
        ) from exc

# --------------------------------------------------
# GET SENSOR READINGS
# --------------------------------------------------

@app.get("/api/v1/sensors/readings")
def get_sensor_readings(
    field_id: Optional[str] = Query(default=None),
    limit: int = Query(default=100, ge=1, le=1000),
):
    try:
        with get_db_connection() as conn:
            if field_id is None:
                rows = conn.execute(
                    """
                    SELECT id, device_identifier, field_id, timestamp,
                           humidity, temperature,
                           electrical_conductivity, battery
                    FROM sensor_readings
                    ORDER BY timestamp DESC
                    LIMIT %s;
                    """,
                    (limit,),
                ).fetchall()
            else:
                rows = conn.execute(
                    """
                    SELECT id, device_identifier, field_id, timestamp,
                           humidity, temperature,
                           electrical_conductivity, battery
                    FROM sensor_readings
                    WHERE field_id = %s
                    ORDER BY timestamp DESC
                    LIMIT %s;
                    """,
                    (field_id, limit),
                ).fetchall()

        return [
            {
                "id": row[0],
                "device_identifier": row[1],
                "field_id": row[2],
                "timestamp": row[3],
                "humidity": row[4],
                "temperature": row[5],
                "electrical_conductivity": row[6],
                "battery": row[7],
            }
            for row in rows
        ]

    except psycopg.Error as exc:
        raise HTTPException(
            status_code=503,
            detail="Could not retrieve sensor readings from the database.",
        ) from exc
@app.get("/api/v1/irrigation/recommendation")
def get_irrigation_recommendation(field_id: int = Query(default=1, ge=1)):
    with get_db_connection() as conn:
        field = conn.execute(
            "SELECT id, field_name, crop_type FROM fields WHERE id = %s",
            (field_id,),
        ).fetchone()

        if field is None:
            raise HTTPException(status_code=404, detail="Field not found.")

        reading = conn.execute(
            """
            SELECT humidity, temperature, electrical_conductivity, recorded_at
            FROM soil_readings
            ORDER BY recorded_at DESC
            LIMIT 1
            """
        ).fetchone()

    return {
        "field_id": field[0],
        "field_name": field[1],
        "crop_type": field[2],
        "recommendation": "CHECK SOIL MOISTURE",
        "message": "No dedicated soil-moisture reading is available. Check the soil before irrigating.",
        "latest_reading_at": reading[3].isoformat() if reading else None,
        "sensor_humidity_percent": reading[0] if reading else None,
        "sensor_temperature_celsius": reading[1] if reading else None,
        "electrical_conductivity": reading[2] if reading else None,
        "basis": "Rule-based demonstration, not a trained ML prediction",
    }


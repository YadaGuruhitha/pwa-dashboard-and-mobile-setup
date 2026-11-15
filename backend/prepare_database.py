from dotenv import load_dotenv
import os
import psycopg

# Load database settings from backend/.env
load_dotenv()

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": os.getenv("DB_PORT", "5432"),
    "dbname": os.getenv("DB_NAME", "smart_irrigation_db"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD"),
}

CREATE_TABLES_SQL = """
CREATE TABLE IF NOT EXISTS fields (
    id BIGSERIAL PRIMARY KEY,
    field_name VARCHAR(150) NOT NULL,
    location VARCHAR(255),
    area_acres DOUBLE PRECISION,
    crop_type VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sensor_devices (
    id BIGSERIAL PRIMARY KEY,
    device_identifier VARCHAR(255) NOT NULL UNIQUE,
    field_id BIGINT REFERENCES fields(id) ON DELETE SET NULL,
    device_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS soil_readings (
    id BIGSERIAL PRIMARY KEY,
    source_record_id BIGINT,
    device_identifier VARCHAR(255),
    recorded_at TIMESTAMPTZ NOT NULL,
    line INTEGER,
    electrical_conductivity DOUBLE PRECISION,
    humidity DOUBLE PRECISION,
    temperature DOUBLE PRECISION,
    battery DOUBLE PRECISION,
    source VARCHAR(50) NOT NULL DEFAULT 'historical_csv',
    imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (source_record_id, device_identifier)
);

CREATE TABLE IF NOT EXISTS environmental_readings (
    id BIGSERIAL PRIMARY KEY,
    source_record_id BIGINT,
    device_identifier VARCHAR(255),
    recorded_at TIMESTAMPTZ NOT NULL,
    co2 DOUBLE PRECISION,
    humidity DOUBLE PRECISION,
    pressure DOUBLE PRECISION,
    temperature DOUBLE PRECISION,
    battery DOUBLE PRECISION,
    source VARCHAR(50) NOT NULL DEFAULT 'historical_csv',
    imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (source_record_id, device_identifier)
);

CREATE TABLE IF NOT EXISTS water_meter_readings (
    id BIGSERIAL PRIMARY KEY,
    source_record_id BIGINT,
    device_identifier VARCHAR(255),
    recorded_at TIMESTAMPTZ NOT NULL,
    line INTEGER,
    current_volume DOUBLE PRECISION,
    source VARCHAR(50) NOT NULL DEFAULT 'historical_csv',
    imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (source_record_id, device_identifier)
);

CREATE INDEX IF NOT EXISTS idx_soil_recorded_at
    ON soil_readings(recorded_at);

CREATE INDEX IF NOT EXISTS idx_environment_recorded_at
    ON environmental_readings(recorded_at);

CREATE INDEX IF NOT EXISTS idx_water_recorded_at
    ON water_meter_readings(recorded_at);
"""

def main():
    if not DB_CONFIG["password"]:
        raise RuntimeError(
            "DB_PASSWORD is missing. Check the backend/.env file."
        )

    with psycopg.connect(**DB_CONFIG) as connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_TABLES_SQL)

    print("Database tables created or already exist.")
    print("Existing tables and records were not intentionally deleted.")

if __name__ == "__main__":
    main()
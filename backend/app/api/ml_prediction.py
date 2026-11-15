import os
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.database import get_db
from app.models import Field, SensorReading, IrrigationSchedule
from app.schemas import MLPredictionRequest, MLPredictionResponse
from app.ml.predictor import predictor
from app.services.weather_service import weather_service

router = APIRouter()

@router.post("/predict", response_model=MLPredictionResponse)
def predict_irrigation(request: MLPredictionRequest, db: Session = Depends(get_db)):
    """
    Evaluates ML-based irrigation necessity, volume, duration, and optimal time slot.
    Combines:
      - Crop Type
      - Soil Moisture (from validated sensor telemetry)
      - Crop Growth Stage
      - Forecast Rainfall (from live weather integration)
      - Historical Irrigation Data (days since last watering, cumulative weekly volume)
    """
    field_id = request.field_id
    field_name = "Custom Field"
    crop = request.crop_type or "Tomato"
    stage = request.growth_stage or "Flowering"
    soil = request.soil_type or "Loamy"
    area = request.field_area_acres or 1.5
    moisture = request.soil_moisture
    soil_temp = request.soil_temp or 25.0
    
    historical_summary = {
        "days_since_last_irrigation": 2,
        "completed_schedules_7d_count": 0,
        "cumulative_water_applied_7d_liters": 0.0,
        "last_irrigated_at": None
    }
    sensor_is_simulated = True

    # If field_id is passed, pull live sensor telemetry and historical schedules
    if field_id is not None:
        field = db.query(Field).filter(Field.id == field_id).first()
        if not field:
            raise HTTPException(status_code=404, detail="Field not found")
        field_name = field.name
        crop = field.crop_type
        stage = field.growth_stage
        soil = field.soil_type
        area = field.area_acres

        latest_reading = db.query(SensorReading).filter(
            SensorReading.field_id == field.id
        ).order_by(SensorReading.recorded_at.desc()).first()

        if moisture is None:
            moisture = latest_reading.soil_moisture_pct if latest_reading else 20.0
            soil_temp = latest_reading.soil_temp_c if latest_reading else 25.0
        
        if latest_reading:
            sensor_is_simulated = latest_reading.is_simulated

        # Historical irrigation data
        if field.last_irrigated_at:
            historical_summary["last_irrigated_at"] = field.last_irrigated_at.isoformat()
            historical_summary["days_since_last_irrigation"] = max(
                0, (datetime.utcnow() - field.last_irrigated_at).days
            )

        since_7d = datetime.utcnow() - timedelta(days=7)
        past_schedules = db.query(IrrigationSchedule).filter(
            IrrigationSchedule.field_id == field.id,
            IrrigationSchedule.status == "COMPLETED",
            IrrigationSchedule.scheduled_date >= since_7d.date()
        ).all()

        historical_summary["completed_schedules_7d_count"] = len(past_schedules)
        historical_summary["cumulative_water_applied_7d_liters"] = sum(
            s.water_volume_liters for s in past_schedules
        )

    if moisture is None:
        moisture = 22.0

    # Fetch weather forecast for the area
    weather = weather_service.get_current_and_forecast()
    current_weather = weather.get("current", {})
    air_temp = request.air_temp if request.air_temp is not None else current_weather.get("temperature_c", 30.0)
    air_humidity = request.air_humidity if request.air_humidity is not None else current_weather.get("humidity_pct", 60.0)
    rain_forecast = request.rainfall_forecast if request.rainfall_forecast is not None else current_weather.get("rainfall_forecast_24h_mm", 0.0)
    wind = current_weather.get("wind_speed_kmh", 10.0)
    solar = current_weather.get("solar_radiation_mj", 21.0)
    weather_is_simulated = weather.get("is_simulated", True)

    # Run Random Forest prediction combining all agronomic variables
    result = predictor.predict_field_irrigation(
        soil_moisture=moisture,
        soil_temp=soil_temp,
        air_temp=air_temp,
        air_humidity=air_humidity,
        rainfall_forecast=rain_forecast,
        wind_speed=wind,
        solar_radiation=solar,
        crop_type=crop,
        growth_stage=stage,
        soil_type=soil,
        field_area_acres=area
    )

    data_provenance = {
        "field_id": field_id,
        "crop_type": crop,
        "growth_stage": stage,
        "soil_type": soil,
        "soil_moisture_pct": moisture,
        "sensor_is_simulated": sensor_is_simulated,
        "forecast_rainfall_24h_mm": rain_forecast,
        "weather_data_source": weather.get("data_source", "SIMULATED_DEMO"),
        "weather_is_simulated": weather_is_simulated,
        "days_since_last_irrigation": historical_summary["days_since_last_irrigation"]
    }

    return {
        "field_id": field_id,
        "needs_irrigation": result["needs_irrigation"],
        "confidence_pct": result["confidence_pct"],
        "recommended_volume_l_sqm": result["recommended_volume_l_sqm"],
        "total_field_volume_liters": result["total_field_volume_liters"],
        "duration_minutes": result["duration_minutes"],
        "urgency": result["urgency"],
        "recommended_time_slot": result["recommended_time_slot"],
        "slot_rationale": result["slot_rationale"],
        "explanation": result["explanation"],
        "water_saved_liters_est": result["water_saved_liters_est"],
        "water_savings_pct": result["water_savings_pct"],
        "feature_importances": predictor.feature_importances,
        "data_provenance": data_provenance,
        "historical_irrigation_summary": historical_summary
    }

@router.get("/model-info")
def get_model_info():
    """
    Returns Random Forest model performance metrics, feature importances, and agronomic mapping.
    """
    return {
        "model_type": "Random Forest Multi-Target Pipeline (Classifier + Regressors)",
        "framework": "scikit-learn with FAO-56 Penman-Monteith Agronomic Baseline",
        "metrics": predictor.metrics,
        "feature_importances": predictor.feature_importances,
        "supported_crops": list(predictor.crop_map.keys()),
        "supported_stages": list(predictor.stage_map.keys()),
        "supported_soils": list(predictor.soil_map.keys())
    }

@router.get("/comparison")
def get_model_comparison():
    """
    Returns MLflow tracked multi-model evaluation and comparison results
    (Random Forest Champion, Gradient Boosting Challenger, Baseline Decision Tree).
    """
    comparison_file = os.path.join(os.path.dirname(__file__), "..", "ml", "model_weights", "model_comparison.json")
    if os.path.exists(comparison_file):
        with open(comparison_file, "r") as f:
            return json.load(f)
    return {
        "experiment": "Smart_Irrigation_Optimization",
        "models": [],
        "champion": "Random Forest (Production Champion)"
    }


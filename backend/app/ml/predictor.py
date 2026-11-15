"""
Inference engine and explainability wrapper for the Smart Irrigation System ML models.
"""

import os
import joblib
import pandas as pd
import numpy as np

MODEL_FILE = os.path.join(os.path.dirname(__file__), "model_weights", "random_forest_irrigation.joblib")

class IrrigationMLPredictor:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(IrrigationMLPredictor, cls).__new__(cls)
            cls._instance._load_model()
        return cls._instance

    def _load_model(self):
        if os.path.exists(MODEL_FILE):
            bundle = joblib.load(MODEL_FILE)
            self.classifier = bundle["classifier"]
            self.regressor_volume = bundle["regressor_volume"]
            self.regressor_duration = bundle["regressor_duration"]
            self.feature_cols = bundle["feature_cols"]
            self.crop_map = bundle["crop_map"]
            self.stage_map = bundle["stage_map"]
            self.soil_map = bundle["soil_map"]
            self.feature_importances = bundle["feature_importances"]
            self.metrics = bundle.get("metrics", {})
            self.is_loaded = True
        else:
            self.is_loaded = False
            self.metrics = {}
            self.feature_importances = {}

    def predict_field_irrigation(
        self,
        soil_moisture: float,
        soil_temp: float,
        air_temp: float,
        air_humidity: float,
        rainfall_forecast: float,
        wind_speed: float = 10.0,
        solar_radiation: float = 20.0,
        days_since_irrigation: int = 1,
        crop_type: str = "Tomato",
        growth_stage: str = "Flowering",
        soil_type: str = "Loamy",
        field_area_acres: float = 2.0
    ):
        if not self.is_loaded:
            self._load_model()
            if not self.is_loaded:
                raise RuntimeError("ML Model not trained yet. Run train_model.py first.")

        crop_id = self.crop_map.get(crop_type, 3) # default tomato
        stage_id = self.stage_map.get(growth_stage, 2) # default flowering
        soil_id = self.soil_map.get(soil_type, 1) # default loamy

        # Build feature vector
        features = pd.DataFrame([{
            "soil_moisture": float(soil_moisture),
            "soil_temp": float(soil_temp),
            "air_temp": float(air_temp),
            "air_humidity": float(air_humidity),
            "rainfall_forecast": float(rainfall_forecast),
            "wind_speed": float(wind_speed),
            "solar_radiation": float(solar_radiation),
            "days_since_irrigation": int(days_since_irrigation),
            "crop_type": crop_id,
            "growth_stage": stage_id,
            "soil_type": soil_id
        }])[self.feature_cols]

        prob = self.classifier.predict_proba(features)[0]
        irrigation_prob = float(prob[1])
        needs_irrigation = bool(irrigation_prob >= 0.5)

        # Rain guard heuristic check
        if rainfall_forecast >= 15.0:
            needs_irrigation = False
            urgency = "Delayed (Heavy Rain Forecast)"
            explanation = f"Upcoming rainfall of {rainfall_forecast:.1f} mm detected within 24h. Postponing irrigation to conserve water and prevent nutrient leaching."
            rec_volume_l_sqm = 0.0
            rec_duration_mins = 0
            water_saved_liters = round(field_area_acres * 4046.86 * 12.0) # water saved compared to unnecessary watering
        elif needs_irrigation:
            rec_volume_l_sqm = float(self.regressor_volume.predict(features)[0])
            rec_volume_l_sqm = max(5.0, round(rec_volume_l_sqm, 1))
            rec_duration_mins = int(self.regressor_duration.predict(features)[0])
            rec_duration_mins = max(20, min(rec_duration_mins, 180))

            # Urgency level
            if soil_moisture < 15.0 or (growth_stage == "Flowering" and soil_moisture < 20.0):
                urgency = "Critical (Water Stress Risk)"
            else:
                urgency = "Recommended (Optimal Window)"

            explanation = (
                f"Soil moisture is at {soil_moisture:.1f}% for {crop_type} at {growth_stage} stage in {soil_type} soil. "
                f"Air temperature of {air_temp:.1f}°C and humidity {air_humidity:.0f}% require {rec_volume_l_sqm:.1f} L/m² "
                f"to restore root zone field capacity."
            )
            # Conventional flood irrigation uses ~40% more water
            traditional_liters = rec_volume_l_sqm * 1.45 * (field_area_acres * 4046.86)
            recommended_liters = rec_volume_l_sqm * (field_area_acres * 4046.86)
            water_saved_liters = round(traditional_liters - recommended_liters)
        else:
            rec_volume_l_sqm = 0.0
            rec_duration_mins = 0
            urgency = "Not Needed (Adequate Moisture)"
            explanation = f"Current soil moisture ({soil_moisture:.1f}%) is well within healthy capacity for {crop_type}."
            water_saved_liters = 0

        # Optimal time slot recommendation
        if air_temp > 30.0:
            recommended_slot = "06:00 AM - 07:30 AM (Cool Morning Slot)"
            slot_reason = "Minimizes solar evaporative loss and maximizes deep root percolation."
        else:
            recommended_slot = "05:30 PM - 07:00 PM (Sunset Slot)"
            slot_reason = "Gentle night infiltration with zero daytime transpiration burn."

        # Total field volume in Liters
        total_field_volume_liters = round(rec_volume_l_sqm * (field_area_acres * 4046.86))

        return {
            "needs_irrigation": needs_irrigation,
            "confidence_pct": round(irrigation_prob * 100, 1) if needs_irrigation else round((1 - irrigation_prob) * 100, 1),
            "recommended_volume_l_sqm": rec_volume_l_sqm,
            "total_field_volume_liters": total_field_volume_liters,
            "duration_minutes": rec_duration_mins,
            "urgency": urgency,
            "recommended_time_slot": recommended_slot,
            "slot_rationale": slot_reason,
            "explanation": explanation,
            "water_saved_liters_est": water_saved_liters,
            "water_savings_pct": 32.5 if needs_irrigation else 0.0,
            "input_snapshot": {
                "soil_moisture": soil_moisture,
                "crop": crop_type,
                "stage": growth_stage,
                "soil": soil_type,
                "temp": air_temp,
                "rain_forecast_mm": rainfall_forecast
            }
        }

predictor = IrrigationMLPredictor()

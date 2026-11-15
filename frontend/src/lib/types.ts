export type ScheduledLanguageCode = 
  | 'as'  // Assamese
  | 'bn'  // Bengali
  | 'brx' // Bodo
  | 'doi' // Dogri
  | 'gu'  // Gujarati
  | 'hi'  // Hindi
  | 'kn'  // Kannada
  | 'ks'  // Kashmiri
  | 'kok' // Konkani
  | 'mai' // Maithili
  | 'ml'  // Malayalam
  | 'mni' // Manipuri (Meitei)
  | 'mr'  // Marathi
  | 'ne'  // Nepali
  | 'or'  // Odia
  | 'pa'  // Punjabi
  | 'sa'  // Sanskrit
  | 'sat' // Santali
  | 'sd'  // Sindhi
  | 'ta'  // Tamil
  | 'te'  // Telugu
  | 'ur'; // Urdu

export type RegionalLanguageCode = 
  | 'bho' // Bhojpuri
  | 'tcy' // Tulu
  | 'raj' // Rajasthani
  | 'hne' // Chhattisgarhi
  | 'kha' // Khasi
  | 'grt' // Garo
  | 'lus' // Mizo
  | 'trp' // Kokborok
  | 'gon'; // Gondi

export type SupportedLanguage = 'en' | ScheduledLanguageCode | RegionalLanguageCode;

export interface FarmerProfile {
  id: number;
  name: string;
  phone: string;
  email?: string;
  village: string;
  district: string;
  state: string;
  preferred_language: SupportedLanguage;
  farm_size_acres?: number;
  primary_crops?: string[];
  is_authenticated?: boolean;
}

export type MoistureStatus = 'CRITICAL_DRY' | 'MODERATE' | 'OPTIMAL' | 'OVER_WATERED';

export interface FieldItem {
  id: number;
  farmer_id: number;
  name: string;
  area_acres: number;
  crop_type: string;
  growth_stage: 'Initial' | 'Vegetative' | 'Flowering' | 'Maturity';
  soil_type: 'Sandy' | 'Loamy' | 'Clay';
  irrigation_type: string;
  pump_status: 'ON' | 'OFF' | 'AUTO';
  target_moisture_min: number;
  target_moisture_max: number;
  latest_moisture: number;
  moisture_status: MoistureStatus;
  last_irrigated_at?: string;
  last_sensor_update?: string;
  last_sensor_update_relative?: string;
  sensor_device_status?: string;
  is_sensor_simulated?: boolean;
  sensor_device_id?: string;
  sensors?: {
    id: number;
    device_identifier: string;
    battery_pct: number;
    status: string;
  }[];
}

export interface SensorHistoryPoint {
  timestamp: string;
  soil_moisture: number;
  soil_temp: number;
  air_temp: number;
  humidity: number;
  min_threshold: number;
  max_threshold: number;
  is_simulated: boolean;
}

export interface WeatherDay {
  date: string;
  day_name: string;
  temp_max: number;
  temp_min: number;
  humidity: number;
  rainfall_mm: number;
  condition: string;
  description: string;
  icon: string;
  et0_mm?: number;
}

export interface WeatherHourlyPoint {
  time: string;
  temp_c: number;
  humidity_pct: number;
  rain_prob_pct: number;
  condition: string;
}

export interface WeatherData {
  is_simulated: boolean;
  simulation_note?: string;
  location: string;
  current: {
    temperature_c: number;
    feels_like_c: number;
    humidity_pct: number;
    wind_speed_kmh: number;
    rainfall_forecast_24h_mm: number;
    solar_radiation_mj: number;
    condition: string;
    description: string;
    et0_evapotranspiration_mm: number;
  };
  forecast: WeatherDay[];
  hourly?: WeatherHourlyPoint[];
}

export interface IrrigationScheduleItem {
  id: number;
  field_id: number;
  field_name?: string;
  crop_type?: string;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  water_volume_liters: number;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'SKIPPED';
  triggered_by: string;
  reason?: string;
}

export interface MLPrediction {
  field_id?: number;
  needs_irrigation: boolean;
  confidence_pct: number;
  recommended_volume_l_sqm: number;
  total_field_volume_liters: number;
  duration_minutes: number;
  urgency: string;
  recommended_time_slot: string;
  slot_rationale: string;
  explanation: string;
  water_saved_liters_est: number;
  water_savings_pct: number;
  feature_importances?: Record<string, number>;
}

export interface AlertItem {
  id: number;
  farmer_id: number;
  field_id?: number;
  field_name?: string;
  title: string;
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
  alert_type: string;
  is_read: boolean;
  is_resolved?: boolean;
  resolved_at?: string;
  resolved_by?: string;
  sent_channels: string;
  delivery_status?: string;
  created_at: string;
}

export interface AnalyticsSummary {
  summary: {
    total_water_saved_liters: number;
    savings_percentage: number;
    electricity_saved_kwh: number;
    cost_saved_inr: number;
    carbon_offset_kg: number;
    active_fields: number;
    irrigation_efficiency_score: number;
  };
  daily_trends: {
    date: string;
    water_used: number;
    baseline: number;
    water_saved: number;
    electricity_saved_kwh: number;
  }[];
}

export interface CropConfig {
  crop_name: string;
  stage: 'Initial' | 'Vegetative' | 'Flowering' | 'Maturity';
  soil_type: 'Sandy' | 'Loamy' | 'Clay';
  default_min_moisture: number;
  default_max_moisture: number;
  kc_coefficient: number;
  root_depth_meters: number;
}

export interface GroundedData {
  field_id?: number;
  field_name?: string;
  crop_type?: string;
  soil_moisture_pct?: number;
  target_moisture_min?: number;
  target_moisture_max?: number;
  rainfall_forecast_24h_mm?: number;
  temperature_c?: number;
  active_alerts_count?: number;
  next_schedule_date?: string;
  next_schedule_slot?: string;
  recommended_volume_liters?: number;
  is_sensor_simulated?: boolean;
  is_weather_simulated?: boolean;
}

export interface VoiceQueryResponseData {
  query_recognized: string;
  response_text: string;
  response_audio_base64?: string;
  intent_detected: string;
  language: string;
  is_simulated?: boolean;
  provider?: string;
  grounded_data?: GroundedData;
  action_data?: any;
}


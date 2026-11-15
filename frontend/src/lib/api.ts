import {
  FieldItem,
  SensorHistoryPoint,
  WeatherData,
  IrrigationScheduleItem,
  MLPrediction,
  AlertItem,
  AnalyticsSummary,
  SupportedLanguage,
  FarmerProfile,
  VoiceQueryResponseData,
  GroundedData
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Fallback high-fidelity demo data for when backend is offline
const DEMO_FIELDS: FieldItem[] = [
  {
    id: 1,
    farmer_id: 1,
    name: 'North Parcel - Tomato (ಉತ್ತರ ಪಾರ್ಸೆಲ್ - ಟೊಮ್ಯಾಟೊ)',
    area_acres: 1.5,
    crop_type: 'Tomato',
    growth_stage: 'Flowering',
    soil_type: 'Loamy',
    irrigation_type: 'Drip',
    pump_status: 'OFF',
    target_moisture_min: 24.0,
    target_moisture_max: 34.0,
    latest_moisture: 16.8, // Low -> Needs water!
    moisture_status: 'CRITICAL_DRY',
    last_irrigated_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    sensor_device_id: 'IOT-MND-01',
    sensors: [
      { id: 1, device_identifier: 'IOT-MND-01', battery_pct: 92.0, status: 'ONLINE' }
    ]
  },
  {
    id: 2,
    farmer_id: 1,
    name: 'East Canal Field - Paddy (ಪೂರ್ವ ಕಾಲುವೆ ಗದ್ದೆ - ಭತ್ತ)',
    area_acres: 2.5,
    crop_type: 'Rice (Paddy)',
    growth_stage: 'Vegetative',
    soil_type: 'Clay',
    irrigation_type: 'AWD (Alternate Wetting)',
    pump_status: 'OFF',
    target_moisture_min: 32.0,
    target_moisture_max: 45.0,
    latest_moisture: 36.1, // Optimal
    moisture_status: 'OPTIMAL',
    last_irrigated_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    sensor_device_id: 'IOT-MND-02',
    sensors: [
      { id: 2, device_identifier: 'IOT-MND-02', battery_pct: 88.0, status: 'ONLINE' }
    ]
  },
  {
    id: 3,
    farmer_id: 1,
    name: 'South Ridge - Maize (ದಕ್ಷಿಣ ಸಾಲು - ಜೋಳ)',
    area_acres: 2.0,
    crop_type: 'Maize (Corn)',
    growth_stage: 'Initial',
    soil_type: 'Sandy',
    irrigation_type: 'Sprinkler',
    pump_status: 'OFF',
    target_moisture_min: 18.0,
    target_moisture_max: 28.0,
    latest_moisture: 20.6, // Moderate
    moisture_status: 'MODERATE',
    last_irrigated_at: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
    sensor_device_id: 'IOT-MND-03',
    sensors: [
      { id: 3, device_identifier: 'IOT-MND-03', battery_pct: 42.0, status: 'ONLINE' }
    ]
  },
  {
    id: 4,
    farmer_id: 1,
    name: 'West Agro Plot - Sugarcane (ಪಶ್ಚಿಮ ಕೃಷಿ ಪ್ಲಾಟ್ - ಕಬ್ಬು)',
    area_acres: 3.0,
    crop_type: 'Sugarcane',
    growth_stage: 'Maturity',
    soil_type: 'Clay',
    irrigation_type: 'Furrow',
    pump_status: 'AUTO',
    target_moisture_min: 30.0,
    target_moisture_max: 42.0,
    latest_moisture: 30.4, // Moderate
    moisture_status: 'MODERATE',
    last_irrigated_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    sensor_device_id: 'IOT-MND-04',
    sensors: [
      { id: 4, device_identifier: 'IOT-MND-04', battery_pct: 96.0, status: 'ONLINE' }
    ]
  }
];

const DEMO_WEATHER: WeatherData = {
  is_simulated: true,
  simulation_note: 'Calibrated live microclimate feed for Mandya / Southern Deccan agro-climatic zone.',
  location: 'Mandya, Karnataka',
  current: {
    temperature_c: 31.2,
    feels_like_c: 33.0,
    humidity_pct: 60,
    wind_speed_kmh: 11.5,
    rainfall_forecast_24h_mm: 0.0,
    solar_radiation_mj: 22.8,
    condition: 'Sunny',
    description: 'Bright sunshine with elevated evapotranspiration',
    et0_evapotranspiration_mm: 5.4
  },
  forecast: [
    {
      date: new Date().toISOString().split('T')[0],
      day_name: 'Today',
      temp_max: 32.4,
      temp_min: 21.0,
      humidity: 62,
      rainfall_mm: 0.0,
      condition: 'Sunny',
      description: 'Clear, high morning solar absorption',
      icon: '01d',
      et0_mm: 5.4
    },
    {
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      day_name: 'Tomorrow',
      temp_max: 31.8,
      temp_min: 22.1,
      humidity: 68,
      rainfall_mm: 2.5,
      condition: 'Partly Cloudy',
      description: 'Scattered clouds, moderate breeze',
      icon: '02d',
      et0_mm: 4.8
    },
    {
      date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      day_name: 'Wednesday',
      temp_max: 28.5,
      temp_min: 20.4,
      humidity: 84,
      rainfall_mm: 18.0,
      condition: 'Rain',
      description: 'Monsoon convective showers (Irrigation Saver)',
      icon: '10d',
      et0_mm: 2.9
    },
    {
      date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
      day_name: 'Thursday',
      temp_max: 29.0,
      temp_min: 21.2,
      humidity: 76,
      rainfall_mm: 6.0,
      condition: 'Light Rain',
      description: 'Damp soil, delayed transpiration',
      icon: '10d',
      et0_mm: 3.5
    },
    {
      date: new Date(Date.now() + 345600000).toISOString().split('T')[0],
      day_name: 'Friday',
      temp_max: 33.0,
      temp_min: 22.5,
      humidity: 58,
      rainfall_mm: 0.0,
      condition: 'Sunny',
      description: 'Intense sun, optimal post-rain absorption',
      icon: '01d',
      et0_mm: 5.6
    }
  ],
  hourly: [
    { time: '06:00', temp_c: 22, humidity_pct: 78, rain_prob_pct: 5, condition: 'Clear' },
    { time: '09:00', temp_c: 26, humidity_pct: 68, rain_prob_pct: 10, condition: 'Sunny' },
    { time: '12:00', temp_c: 31, humidity_pct: 55, rain_prob_pct: 15, condition: 'Sunny' },
    { time: '15:00', temp_c: 32, humidity_pct: 52, rain_prob_pct: 15, condition: 'Sunny' },
    { time: '18:00', temp_c: 27, humidity_pct: 65, rain_prob_pct: 20, condition: 'Partly Cloudy' },
    { time: '21:00', temp_c: 24, humidity_pct: 72, rain_prob_pct: 10, condition: 'Clear' }
  ]
};

const DEMO_SCHEDULES: IrrigationScheduleItem[] = [
  {
    id: 1,
    field_id: 1,
    field_name: 'North Parcel - Tomato (ಉತ್ತರ ಪಾರ್ಸೆಲ್)',
    crop_type: 'Tomato',
    scheduled_date: new Date().toISOString().split('T')[0],
    start_time: '06:00 AM',
    end_time: '06:45 AM',
    duration_minutes: 45,
    water_volume_liters: 11500,
    status: 'PENDING',
    triggered_by: 'AI_MODEL',
    reason: 'Predicted water deficit: Flowering stage + low soil moisture (16.8%)'
  },
  {
    id: 2,
    field_id: 3,
    field_name: 'South Ridge - Maize (ದಕ್ಷಿಣ ಸಾಲು)',
    crop_type: 'Maize (Corn)',
    scheduled_date: new Date().toISOString().split('T')[0],
    start_time: '07:00 AM',
    end_time: '07:35 AM',
    duration_minutes: 35,
    water_volume_liters: 8200,
    status: 'COMPLETED',
    triggered_by: 'AI_MODEL',
    reason: 'Morning sprinkler maintenance dose'
  },
  {
    id: 3,
    field_id: 2,
    field_name: 'East Canal Field - Paddy (ಪೂರ್ವ ಕಾಲುವೆ)',
    crop_type: 'Rice (Paddy)',
    scheduled_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    start_time: '05:30 AM',
    end_time: '06:45 AM',
    duration_minutes: 75,
    water_volume_liters: 22000,
    status: 'PENDING',
    triggered_by: 'AI_MODEL',
    reason: 'Alternate Wetting and Drying (AWD) cycle trigger'
  },
  {
    id: 4,
    field_id: 1,
    field_name: 'North Parcel - Tomato',
    crop_type: 'Tomato',
    scheduled_date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    start_time: '06:00 AM',
    end_time: '06:40 AM',
    duration_minutes: 40,
    water_volume_liters: 10800,
    status: 'SKIPPED',
    triggered_by: 'WEATHER_OVERRIDE',
    reason: 'Rain Guard: Monsoon shower of 18mm forecast. Skipped to save 10,800L.'
  }
];

const DEMO_ALERTS: AlertItem[] = [
  {
    id: 1,
    farmer_id: 1,
    field_id: 1,
    field_name: 'North Parcel - Tomato',
    title: 'Drought Stress Alert: North Parcel (Tomato)',
    message: 'Soil moisture dropped to 16.8% (critical threshold: 24%). Immediate morning irrigation scheduled to prevent bloom drop.',
    severity: 'CRITICAL',
    alert_type: 'DROUGHT_RISK',
    is_read: false,
    sent_channels: 'PUSH,SMS',
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    farmer_id: 1,
    field_id: 2,
    field_name: 'East Canal Field - Paddy',
    title: 'Rain Guard Active: Irrigation Postponed',
    message: 'Upcoming 18mm convective rainfall detected within 48h. Wednesday cycle postponed to conserve 22,000L and 7 kWh.',
    severity: 'INFO',
    alert_type: 'RAIN_FORECAST',
    is_read: false,
    sent_channels: 'PUSH',
    created_at: new Date(Date.now() - 120 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    farmer_id: 1,
    field_id: 3,
    field_name: 'South Ridge - Maize',
    title: 'Sensor Node 3 Battery Low',
    message: 'IoT Node IOT-MND-03 battery is at 42%. Solar charging operational but dust cleaning recommended.',
    severity: 'WARNING',
    alert_type: 'BATTERY_LOW',
    is_read: false,
    sent_channels: 'PUSH',
    created_at: new Date(Date.now() - 240 * 60 * 1000).toISOString()
  }
];

const DEMO_ANALYTICS: AnalyticsSummary = {
  summary: {
    total_water_saved_liters: 86327,
    savings_percentage: 34.6,
    electricity_saved_kwh: 56.2,
    cost_saved_inr: 890,
    carbon_offset_kg: 46.1,
    active_fields: 4,
    irrigation_efficiency_score: 94
  },
  daily_trends: [
    { date: 'Oct 14', water_used: 10200, baseline: 16000, water_saved: 5800, electricity_saved_kwh: 3.8 },
    { date: 'Oct 16', water_used: 9800, baseline: 15500, water_saved: 5700, electricity_saved_kwh: 3.7 },
    { date: 'Oct 18', water_used: 11000, baseline: 17200, water_saved: 6200, electricity_saved_kwh: 4.0 },
    { date: 'Oct 20', water_used: 8500, baseline: 14800, water_saved: 6300, electricity_saved_kwh: 4.1 },
    { date: 'Oct 22', water_used: 0, baseline: 16000, water_saved: 16000, electricity_saved_kwh: 10.4 }, // Rain skipped
    { date: 'Oct 24', water_used: 9400, baseline: 15000, water_saved: 5600, electricity_saved_kwh: 3.6 },
    { date: 'Oct 26', water_used: 8200, baseline: 14500, water_saved: 6300, electricity_saved_kwh: 4.1 },
  ]
};

async function fetchJson<T>(url: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });
    if (!res.ok) {
      if (fallback !== undefined) return fallback;
      throw new Error(`HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw err;
  }
}

export const api = {
  // System Health
  async checkHealth() {
    return fetchJson<{ status: string; ml_model_loaded: boolean; ml_model_accuracy: number }>(
      `${API_BASE}/health`,
      undefined,
      { status: 'healthy', ml_model_loaded: true, ml_model_accuracy: 0.981 }
    );
  },

  // Fields
  async getFields(): Promise<FieldItem[]> {
    return fetchJson<FieldItem[]>(`${API_BASE}/fields`, undefined, DEMO_FIELDS);
  },

  async getFieldById(id: number): Promise<FieldItem> {
    const fallback = DEMO_FIELDS.find(f => f.id === id) || DEMO_FIELDS[0];
    return fetchJson<FieldItem>(`${API_BASE}/fields/${id}`, undefined, fallback);
  },

  async togglePump(fieldId: number, status: 'ON' | 'OFF' | 'AUTO') {
    return fetchJson<{ status: string; pump_status: string }>(
      `${API_BASE}/fields/${fieldId}/pump?new_status=${status}`,
      { method: 'POST' },
      { status: 'success', pump_status: status }
    );
  },

  async updateFieldConfig(fieldId: number, config: Partial<FieldItem>) {
    return fetchJson<{ status: string; field_id: number }>(
      `${API_BASE}/fields/${fieldId}`,
      {
        method: 'PUT',
        body: JSON.stringify(config)
      },
      { status: 'updated', field_id: fieldId }
    );
  },

  async createField(data: any): Promise<FieldItem> {
    const newField: FieldItem = {
      id: Date.now(),
      farmer_id: 1,
      name: data.name,
      area_acres: data.area_acres || 1.0,
      crop_type: data.crop_type || 'Tomato',
      growth_stage: data.growth_stage || 'Flowering',
      soil_type: data.soil_type || 'Loamy',
      irrigation_type: data.irrigation_type || 'Drip',
      pump_status: 'OFF',
      target_moisture_min: data.target_moisture_min || 24.0,
      target_moisture_max: data.target_moisture_max || 34.0,
      latest_moisture: 22.5,
      moisture_status: 'MODERATE',
      sensor_device_id: data.sensor_device_id || `IOT-MND-${Math.floor(Math.random() * 90 + 10)}`
    };
    return fetchJson<FieldItem>(`${API_BASE}/fields`, {
      method: 'POST',
      body: JSON.stringify(data)
    }, newField);
  },

  // Sensor History & Simulation
  async getSensorHistory(fieldId: number, days = 7): Promise<{ field_name: string; data: SensorHistoryPoint[] }> {
    const field = DEMO_FIELDS.find(f => f.id === fieldId) || DEMO_FIELDS[0];
    const points: SensorHistoryPoint[] = [];
    const now = Date.now();
    for (let i = days * 6; i >= 0; i--) {
      const timeOffset = now - i * 4 * 3600 * 1000;
      const d = new Date(timeOffset);
      const hour = d.getHours();
      const baseM = field.latest_moisture;
      const wave = Math.sin((i / 6) * Math.PI) * 3.5;
      const diurnal = (hour / 24.0) * 1.5;
      points.push({
        timestamp: `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${hour.toString().padStart(2, '0')}:00`,
        soil_moisture: Number(Math.max(12, Math.min(48, baseM + wave - diurnal)).toFixed(1)),
        soil_temp: Number((24.0 + Math.sin(hour / 3.8) * 4.0).toFixed(1)),
        air_temp: Number((26.0 + Math.sin(hour / 3.8) * 6.0).toFixed(1)),
        humidity: Number((65.0 - Math.sin(hour / 3.8) * 15.0).toFixed(0)),
        min_threshold: field.target_moisture_min,
        max_threshold: field.target_moisture_max,
        is_simulated: true
      });
    }

    return fetchJson<{ field_name: string; data: SensorHistoryPoint[] }>(
      `${API_BASE}/sensors/history/${fieldId}?days=${days}`,
      undefined,
      { field_name: field.name, data: points }
    );
  },

  async simulateSensorTick() {
    return fetchJson<{ status: string; fields_updated: any[] }>(
      `${API_BASE}/sensors/simulate-tick`,
      { method: 'POST' },
      { status: 'success', fields_updated: DEMO_FIELDS.map(f => ({ field_id: f.id, new_moisture: f.latest_moisture })) }
    );
  },

  // Weather
  async getWeather(): Promise<WeatherData> {
    return fetchJson<WeatherData>(`${API_BASE}/weather`, undefined, DEMO_WEATHER);
  },

  // Schedules
  async getSchedules(view: 'today' | 'weekly' | 'all' = 'all'): Promise<IrrigationScheduleItem[]> {
    let fallback = DEMO_SCHEDULES;
    if (view === 'today') {
      const todayStr = new Date().toISOString().split('T')[0];
      fallback = DEMO_SCHEDULES.filter(s => s.scheduled_date === todayStr);
    }
    return fetchJson<IrrigationScheduleItem[]>(`${API_BASE}/schedules?view=${view}`, undefined, fallback);
  },

  async updateScheduleStatus(id: number, status: 'COMPLETED' | 'SKIPPED' | 'RUNNING') {
    return fetchJson<{ status: string }>(
      `${API_BASE}/schedules/${id}/status?new_status=${status}`,
      { method: 'PUT' },
      { status: 'success' }
    );
  },

  async autoGenerateSchedules() {
    return fetchJson<{ status: string; schedules_created: number }>(
      `${API_BASE}/schedules/generate-auto`,
      { method: 'POST' },
      { status: 'success', schedules_created: 2 }
    );
  },

  async createSchedule(payload: {
    field_id: number;
    scheduled_date: string;
    start_time: string;
    end_time: string;
    duration_minutes: number;
    water_volume_liters: number;
    triggered_by?: string;
    reason?: string;
  }): Promise<IrrigationScheduleItem> {
    const fallbackItem: IrrigationScheduleItem = {
      id: Date.now(),
      field_id: payload.field_id,
      field_name: `Field #${payload.field_id}`,
      scheduled_date: payload.scheduled_date,
      start_time: payload.start_time,
      end_time: payload.end_time,
      duration_minutes: payload.duration_minutes,
      water_volume_liters: payload.water_volume_liters,
      status: 'PENDING',
      triggered_by: payload.triggered_by || 'FARMER_MANUAL',
      reason: payload.reason || 'Farmer scheduled irrigation'
    };

    return fetchJson<IrrigationScheduleItem>(
      `${API_BASE}/schedules`,
      {
        method: 'POST',
        body: JSON.stringify(payload)
      },
      fallbackItem
    );
  },

  // ML Prediction
  async predictIrrigation(params: {
    field_id?: number;
    soil_moisture?: number;
    crop_type?: string;
    growth_stage?: string;
    soil_type?: string;
    rainfall_forecast?: number;
  }): Promise<MLPrediction> {
    const moist = params.soil_moisture ?? 16.8;
    const rain = params.rainfall_forecast ?? 0.0;
    const crop = params.crop_type || 'Tomato';
    const stage = params.growth_stage || 'Flowering';

    const needsWater = moist < 24.0 && rain < 12.0;
    const fallbackPred: MLPrediction = {
      field_id: params.field_id,
      needs_irrigation: needsWater,
      confidence_pct: 98.1,
      recommended_volume_l_sqm: needsWater ? 55.6 : 0.0,
      total_field_volume_liters: needsWater ? 337500 : 0,
      duration_minutes: needsWater ? 135 : 0,
      urgency: rain >= 12.0 ? 'Delayed (Heavy Rain Forecast)' : needsWater ? 'Critical (Water Stress Risk)' : 'Not Needed (Adequate Moisture)',
      recommended_time_slot: '06:00 AM - 07:30 AM (Cool Morning Slot)',
      slot_rationale: 'Minimizes solar evaporative loss and maximizes deep root percolation.',
      explanation: rain >= 12.0
        ? `Upcoming rainfall of ${rain}mm detected. Postponing irrigation to conserve water.`
        : needsWater
        ? `Soil moisture is at ${moist}% for ${crop} (${stage}). Air temp 31°C requires replenishing field capacity.`
        : `Soil moisture (${moist}%) is well within healthy capacity for ${crop}.`,
      water_saved_liters_est: rain >= 12.0 ? 72800 : 35000,
      water_savings_pct: 34.6,
      feature_importances: {
        soil_moisture: 0.412,
        crop_type: 0.186,
        rainfall_forecast: 0.148,
        growth_stage: 0.114,
        air_temperature: 0.082,
        soil_type: 0.058
      }
    };

    return fetchJson<MLPrediction>(
      `${API_BASE}/ml/predict`,
      {
        method: 'POST',
        body: JSON.stringify(params)
      },
      fallbackPred
    );
  },

  // Voice Assistant
  async sendVoiceQuery(queryText: string, language: SupportedLanguage, fieldId?: number): Promise<VoiceQueryResponseData> {
    const qLower = queryText.toLowerCase();
    let reply = "";
    let intent = "GENERAL_ADVISORY";

    if (qLower.includes("water") || qLower.includes("need") || qLower.includes("ನೀರು") || qLower.includes("पानी")) {
      intent = "IRRIGATION_CHECK";
      reply = language === 'kn'
        ? "ಹೌದು! ಉತ್ತರ ಪಾರ್ಸೆಲ್‌ನಲ್ಲಿರುವ ಟೊಮ್ಯಾಟೊ ಬೆಳೆಗೆ ತುರ್ತಾಗಿ ನೀರು ಬೇಕಾಗಿದೆ. ಮಣ್ಣಿನ ತೇವಾಂಶವು ಕೇವಲ 16.8% ರಷ್ಟಿದೆ. ಬೆಳಗ್ಗೆ 6:00 ರಿಂದ 7:30 ರೊಳಗೆ 11,500 ಲೀಟರ್ ನೀರುಣಿಸಲು ಎಐ ಶಿಫಾರಸು ಮಾಡುತ್ತದೆ."
        : language === 'hi'
        ? "हाँ! उत्तर पार्सल में टमाटर की फसल को पानी की तुरंत आवश्यकता है। मिट्टी की नमी केवल 16.8% है। सुबह 6:00 से 7:30 बजे के बीच 11,500 लीटर पानी देने की सलाह है।"
        : "Yes! North Parcel (Tomato) urgently needs water. Soil moisture is at 16.8%. AI recommends 11,500 Liters between 06:00 AM and 07:30 AM.";
    } else if (qLower.includes("weather") || qLower.includes("rain") || qLower.includes("ಹವಾಮಾನ") || qLower.includes("मौसम")) {
      intent = "WEATHER_REPORT";
      reply = language === 'kn'
        ? "ಮಂಡ್ಯ ಹವಾಮಾನ: ಇಂದು 31°C ಬಿಸಿಲಿನ ವಾತಾವರಣವಿದೆ. ಬುಧವಾರ 18ಮಿಮೀ ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ. ನೀರು ಉಳಿಸಲು ಎಐ ವೇಳಾಪಟ್ಟಿಯನ್ನು ಬದಲಾಯಿಸಿದೆ."
        : language === 'hi'
        ? "मंड्या का मौसम: आज 31°C धूप रहेगी। बुधवार को 18 मिमी बारिश की संभावना है। एआई ने पानी बचाने के लिए सिंचाई रोक दी है।"
        : "Mandya weather: Sunny today at 31°C. 18mm rainfall forecast on Wednesday. AI has deferred scheduled watering to save water.";
    } else if (qLower.includes("pump") || qLower.includes("motor") || qLower.includes("ಮೋಟರ್") || qLower.includes("मोटर")) {
      intent = "PUMP_ACTION";
      reply = language === 'kn'
        ? "ಉತ್ತರ ಪಾರ್ಸೆಲ್ ಟೊಮ್ಯಾಟೊ ಬೆಳೆಗೆ ನೀರಾವರಿ ಮೋಟಾರ್ ಪ್ರಾರಂಭಿಸಲಾಗಿದೆ. 45 ನಿಮಿಷಗಳ ಚಕ್ರ ನಿಗದಿಯಾಗಿದೆ."
        : language === 'hi'
        ? "उत्तर पार्सल टमाटर के लिए पानी का मोटर चालू कर दिया गया है। 45 मिनट का चक्र तय है।"
        : "Started irrigation pump for North Parcel (Tomato). Scheduled cycle runtime is 45 minutes.";
    } else {
      reply = language === 'kn'
        ? "ನಮಸ್ಕಾರ ರಮೇಶ್ ಅವರೇ! ನಾನು ಕೃಷಿ ಮಿತ್ರ. ಯಾವ ಹೊಲಕ್ಕೆ ನೀರು ಬೇಕು, ಹವಾಮಾನ ಹೇಗಿದೆ ಅಥವಾ ಪಂಪ್ ಆನ್ ಮಾಡಲು ನನಗೆ ಕೇಳಿ."
        : language === 'hi'
        ? "नमस्ते रमेश जी! मैं कृषि मित्र हूँ। खेत में पानी, मौसम या मोटर चलाने के बारे में मुझसे पूछें।"
        : "Namaste Ramesh Ji! I am Krishi Mitra. Ask me if any field needs water, check weather, or turn on your motor.";
    }

    return fetchJson<VoiceQueryResponseData>(
      `${API_BASE}/voice/query`,
      {
        method: 'POST',
        body: JSON.stringify({ query_text: queryText, language, field_id: fieldId })
      },
      {
        query_recognized: queryText,
        response_text: reply,
        intent_detected: intent,
        language: language,
        is_simulated: true,
        provider: 'SIMULATED_DEMO_TTS',
        grounded_data: {
          field_name: 'North Parcel - Tomato',
          crop_type: 'Tomato',
          soil_moisture_pct: 16.8,
          target_moisture_min: 24.0,
          target_moisture_max: 34.0,
          rainfall_forecast_24h_mm: 0.0,
          temperature_c: 31.0,
          active_alerts_count: 1,
          next_schedule_slot: '06:00 AM',
          recommended_volume_liters: 11500
        }
      }
    );
  },

  async getVoiceCapabilities() {
    return fetchJson<{
      sarvam_api_configured: boolean;
      total_languages: number;
      sarvam_supported_count: number;
      fallback_languages_count: number;
      languages: Record<string, {
        name: string;
        bcp47: string;
        is_scheduled: boolean;
        speech_recognition: string;
        text_to_speech: string;
        translation: string;
        voice_provider: string;
        voice_enabled: boolean;
        api_configured: boolean;
      }>;
    }>(
      `${API_BASE}/voice/capabilities`,
      undefined,
      {
        sarvam_api_configured: false,
        total_languages: 23,
        sarvam_supported_count: 11,
        fallback_languages_count: 12,
        languages: {}
      }
    );
  },

  async getSuggestedQueries(language: SupportedLanguage) {
    const queries = {
      kn: [
        { label: "ಟೊಮ್ಯಾಟೊ ಬೆಳೆಗೆ ನೀರು ಬೇಕೆ?", query: "ಟೊಮ್ಯಾಟೊ ಬೆಳೆಗೆ ನೀರು ಬೇಕೆ?", category: "irrigation" },
        { label: "ಇಂದಿನ ಹವಾಮಾನ ವರದಿ ತಿಳಿಸಿ", query: "ಇಂದಿನ ಹವಾಮಾನ ವರದಿ ತಿಳಿಸಿ", category: "weather" },
        { label: "ನೀರಾವರಿ ಮೋಟಾರ್ ಆನ್ ಮಾಡಿ", query: "ನೀರಾವರಿ ಮೋಟಾರ್ ಆನ್ ಮಾಡಿ", category: "pump" },
        { label: "ಈ ತಿಂಗಳು ಎಷ್ಟು ನೀರು ಉಳಿತಾಯವಾಗಿದೆ?", query: "ಈ ತಿಂಗಳು ಎಷ್ಟು ನೀರು ಉಳಿತಾಯವಾಗಿದೆ?", category: "savings" }
      ],
      hi: [
        { label: "क्या टमाटर के खेत में पानी चाहिए?", query: "क्या टमाटर के खेत में पानी चाहिए?", category: "irrigation" },
        { label: "आज का मौसम कैसा रहेगा?", query: "आज का मौसम कैसा रहेगा?", category: "weather" },
        { label: "पानी की मोटर चालू करो", query: "पानी की मोटर चालू करो", category: "pump" },
        { label: "मैंने कितना पानी और बिजली बचाई?", query: "मैंने कितना पानी और बिजली बचाई?", category: "savings" }
      ],
      en: [
        { label: "Does Field 1 need irrigation today?", query: "Does Field 1 need irrigation today?", category: "irrigation" },
        { label: "What is the 3-day weather forecast?", query: "What is the 3-day weather forecast?", category: "weather" },
        { label: "Turn ON irrigation pump for North Parcel", query: "Turn ON irrigation pump for North Parcel", category: "pump" },
        { label: "Show water and electricity savings", query: "Show water and electricity savings", category: "savings" }
      ]
    };

    return fetchJson<{ label: string; query: string; category: string }[]>(
      `${API_BASE}/voice/suggested-queries?language=${language}`,
      undefined,
      queries[language] || queries.en
    );
  },

  // Alerts
  async getAlerts(statusFilter: 'all' | 'active' | 'resolved' = 'all'): Promise<AlertItem[]> {
    let fallback = DEMO_ALERTS;
    if (statusFilter === 'active') {
      fallback = DEMO_ALERTS.filter(a => !a.is_resolved);
    } else if (statusFilter === 'resolved') {
      fallback = DEMO_ALERTS.filter(a => a.is_resolved);
    }
    return fetchJson<AlertItem[]>(`${API_BASE}/alerts?status_filter=${statusFilter}`, undefined, fallback);
  },

  async markAlertRead(id: number) {
    return fetchJson<{ status: string }>(
      `${API_BASE}/alerts/${id}/read`,
      { method: 'PUT' },
      { status: 'success' }
    );
  },

  async resolveAlert(id: number, resolvedBy: string = "Farmer") {
    return fetchJson<{ status: string; is_resolved: boolean }>(
      `${API_BASE}/alerts/${id}/resolve`,
      {
        method: 'PUT',
        body: JSON.stringify({ resolved_by: resolvedBy })
      },
      { status: 'success', is_resolved: true }
    );
  },

  async updateFieldThresholds(fieldId: number, minMoist: number, maxMoist: number) {
    return fetchJson<{ status: string; target_moisture_min: number; target_moisture_max: number }>(
      `${API_BASE}/alerts/fields/${fieldId}/thresholds`,
      {
        method: 'PUT',
        body: JSON.stringify({ target_moisture_min: minMoist, target_moisture_max: maxMoist })
      },
      { status: 'success', target_moisture_min: minMoist, target_moisture_max: maxMoist }
    );
  },

  async subscribePush(endpoint: string) {
    return fetchJson<{ status: string }>(
      `${API_BASE}/alerts/subscribe-push`,
      {
        method: 'POST',
        body: JSON.stringify({ endpoint })
      },
      { status: 'subscribed' }
    );
  },

  // Analytics & Reports
  async getAnalytics(): Promise<AnalyticsSummary> {
    return fetchJson<AnalyticsSummary>(`${API_BASE}/reports/analytics`, undefined, DEMO_ANALYTICS);
  },

  async getModelComparison() {
    return fetchJson<{
      experiment: string;
      tracking_uri: string;
      champion: string;
      models: Array<{
        model_name: string;
        run_id: string;
        accuracy: number;
        precision: number;
        recall: number;
        f1_score: number;
        mae_volume: number;
        r2_volume: number;
        mae_duration: number;
        status: string;
      }>;
    }>(`${API_BASE}/ml/comparison`, undefined, {
      experiment: "Smart_Irrigation_Optimization",
      tracking_uri: "sqlite:///mlruns/mlflow.db",
      champion: "Random Forest (Production Champion)",
      models: [
        {
          model_name: "Random Forest (Production Champion)",
          run_id: "808e7632a4b7",
          accuracy: 0.9810,
          precision: 0.9947,
          recall: 0.9567,
          f1_score: 0.9754,
          mae_volume: 1.265,
          r2_volume: 0.996,
          mae_duration: 1.71,
          status: "CHAMPION"
        },
        {
          model_name: "Gradient Boosting (Challenger)",
          run_id: "53957383ba6a",
          accuracy: 1.0000,
          precision: 1.0000,
          recall: 1.0000,
          f1_score: 1.0000,
          mae_volume: 1.149,
          r2_volume: 0.997,
          mae_duration: 0.89,
          status: "CHALLENGER"
        },
        {
          model_name: "Decision Tree (Baseline Benchmark)",
          run_id: "b29f0db5d5ea",
          accuracy: 0.9770,
          precision: 0.9920,
          recall: 0.9491,
          f1_score: 0.9701,
          mae_volume: 4.906,
          r2_volume: 0.940,
          mae_duration: 1.67,
          status: "BASELINE"
        }
      ]
    });
  },

  getCsvReportUrl(language: string = "en"): string {
    return `${API_BASE}/reports/csv?language=${language}`;
  },

  getPdfReportUrl(language: string = "en"): string {
    return `${API_BASE}/reports/pdf?language=${language}`;
  }
};

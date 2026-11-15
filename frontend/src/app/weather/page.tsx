'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import VoiceAssistantModal from '../../components/VoiceAssistantModal';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../lib/api';
import { WeatherData } from '../../lib/types';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { 
  CloudSun, 
  Sun, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Wind, 
  Info, 
  ShieldCheck, 
  Radio,
  Zap,
  Sparkles
} from 'lucide-react';

export default function WeatherPage() {
  const { t } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  useEffect(() => {
    api.getWeather()
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const current = weather?.current || {
    temperature_c: 31.2,
    feels_like_c: 33.0,
    humidity_pct: 60,
    wind_speed_kmh: 11.5,
    rainfall_forecast_24h_mm: 0.0,
    solar_radiation_mj: 22.8,
    condition: 'Sunny',
    description: 'Bright sunshine with elevated evapotranspiration',
    et0_evapotranspiration_mm: 5.4
  };

  const hourlyData = weather?.hourly || [
    { time: '06:00', temp_c: 22, humidity_pct: 78, rain_prob_pct: 5 },
    { time: '09:00', temp_c: 26, humidity_pct: 68, rain_prob_pct: 10 },
    { time: '12:00', temp_c: 31, humidity_pct: 55, rain_prob_pct: 15 },
    { time: '15:00', temp_c: 32, humidity_pct: 52, rain_prob_pct: 15 },
    { time: '18:00', temp_c: 27, humidity_pct: 65, rain_prob_pct: 20 },
    { time: '21:00', temp_c: 24, humidity_pct: 72, rain_prob_pct: 10 }
  ];

  const forecast = weather?.forecast || [];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar onOpenVoiceModal={() => setIsVoiceOpen(true)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar onOpenVoiceModal={() => setIsVoiceOpen(true)} />

        <main className="max-w-6xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Header Bar */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center">
                <CloudSun className="w-6 h-6 text-amber-500 mr-2" />
                Agro-Meteorological Forecast & Rain Guard
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Mandya, Karnataka • Precision microclimate telemetry for evapotranspiration planning
              </p>
            </div>

            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-300 flex items-center self-start sm:self-auto">
              <Info className="w-3.5 h-3.5 mr-1" />
              Live Agro Microclimate Feed
            </span>
          </div>

          {/* Current Conditions Large Banner */}
          <div className="bg-gradient-to-br from-agri-950 via-agri-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-agri-800 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                  Current Atmospheric State
                </span>
                <div className="flex items-center justify-center md:justify-start space-x-4">
                  <Sun className="w-14 h-14 text-amber-400 animate-spin" style={{ animationDuration: '40s' }} />
                  <div>
                    <div className="text-5xl font-black text-white tracking-tight">
                      {current.temperature_c}°C
                    </div>
                    <span className="text-sm font-semibold text-agri-200">
                      Feels like {current.feels_like_c}°C • {current.condition}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-agri-200/90 max-w-md pt-1">
                  {current.description}. Daily reference evapotranspiration demand: <strong>{current.et0_evapotranspiration_mm} mm/day</strong>.
                </p>
              </div>

              {/* 4 atmospheric metrics */}
              <div className="grid grid-cols-2 gap-3 w-full md:w-auto text-xs">
                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-agri-300 uppercase block font-bold">Relative Humidity</span>
                  <span className="text-lg font-black text-white flex items-center mt-0.5">
                    <Droplets className="w-4 h-4 text-sky-400 mr-1" />
                    {current.humidity_pct}%
                  </span>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-agri-300 uppercase block font-bold">Rainfall 24h</span>
                  <span className="text-lg font-black text-white flex items-center mt-0.5">
                    <CloudRain className="w-4 h-4 text-sky-400 mr-1" />
                    {current.rainfall_forecast_24h_mm} mm
                  </span>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-agri-300 uppercase block font-bold">Wind Speed</span>
                  <span className="text-lg font-black text-white flex items-center mt-0.5">
                    <Wind className="w-4 h-4 text-emerald-400 mr-1" />
                    {current.wind_speed_kmh} km/h
                  </span>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-agri-300 uppercase block font-bold">Solar Irradiance</span>
                  <span className="text-lg font-black text-white flex items-center mt-0.5">
                    <Sun className="w-4 h-4 text-amber-400 mr-1" />
                    {current.solar_radiation_mj} MJ/m²
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rain Guard Advisory Banner */}
          <div className="bg-gradient-to-r from-sky-50 to-emerald-50 p-5 rounded-3xl border border-sky-200 flex items-start space-x-3.5 shadow-2xs">
            <ShieldCheck className="w-6 h-6 text-sky-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-sky-950">
                Rain Guard Forecast Status: 18mm Precipitation Expected in 48h
              </h3>
              <p className="text-xs text-sky-900/80 mt-1 leading-relaxed">
                The ML scheduling engine has detected incoming monsoon showers on Wednesday. Non-critical irrigation cycles on East Canal (Paddy) and South Ridge have been deferred, saving an estimated <strong>22,000 Liters</strong> and protecting crops from root hypoxia.
              </p>
            </div>
          </div>

          {/* Hourly Microclimate Temperature Curve */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1">
              24-Hour Diurnal Temperature & Transpiration Curve
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Early morning (06:00 - 07:30 AM) provides minimum evaporative loss before peak midday solar radiation
            </p>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[18, 36]} unit="°C" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="temp_c"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#tempGrad)"
                    name="Temperature (°C)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 5-Day Outlook Extended Grid */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="text-base sm:text-lg font-black text-slate-900 mb-4">
              5-Day Agro-Meteorological Outlook
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {forecast.map((f, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border flex flex-col items-center text-center ${
                    idx === 0
                      ? 'bg-emerald-50/70 border-emerald-300 font-bold'
                      : f.rainfall_mm > 10
                      ? 'bg-sky-50/70 border-sky-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-800">{f.day_name}</span>
                  <span className="text-[10px] text-slate-400 mb-2">{f.date}</span>

                  {f.rainfall_mm > 5 ? (
                    <CloudRain className="w-8 h-8 text-sky-500 my-1 animate-pulse" />
                  ) : (
                    <Sun className="w-8 h-8 text-amber-500 my-1" />
                  )}

                  <div className="text-base font-black text-slate-900 mt-1">
                    {Math.round(f.temp_max)}°C
                    <span className="text-xs font-normal text-slate-500 ml-1">/ {Math.round(f.temp_min)}°C</span>
                  </div>

                  <span className={`text-xs mt-1 font-bold ${f.rainfall_mm > 0 ? 'text-sky-700' : 'text-slate-500'}`}>
                    {f.rainfall_mm > 0 ? `${f.rainfall_mm} mm rain` : 'No rain'}
                  </span>

                  <span className="text-[10px] text-slate-500 mt-2 line-clamp-2">
                    {f.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
      />
    </div>
  );
}

'use client';

import React from 'react';
import { WeatherData } from '../lib/types';
import { useLanguage } from '../context/LanguageContext';
import { 
  Sun, 
  CloudRain, 
  CloudSun, 
  Wind, 
  Droplets, 
  Thermometer, 
  ShieldAlert,
  Info
} from 'lucide-react';

interface WeatherWidgetProps {
  weather: WeatherData | null;
}

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  const { t } = useLanguage();

  if (!weather) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-20 bg-slate-100 rounded mb-4"></div>
      </div>
    );
  }

  const { current, forecast, is_simulated, location } = weather;

  return (
    <div className="bg-gradient-to-br from-emerald-900 to-agri-950 text-white rounded-3xl p-5 sm:p-6 shadow-lg border border-agri-800 relative overflow-hidden">
      {/* Background Subtle Sun glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header: Title and Simulation Badge */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-black tracking-tight text-white flex items-center">
            <CloudSun className="w-5 h-5 text-amber-400 mr-2" />
            {t('weatherTitle')}
          </h2>
          <span className="text-xs text-agri-200 font-medium">
            {location}
          </span>
        </div>

        {is_simulated && (
          <span className="bg-amber-400/20 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30 flex items-center">
            <Info className="w-3 h-3 mr-1" />
            {t('simulatedTag')}
          </span>
        )}
      </div>

      {/* Current Conditions Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-400/20 flex items-center justify-center">
            <Thermometer className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] text-agri-200 uppercase font-semibold block">{t('temperature')}</span>
            <span className="text-lg sm:text-xl font-black text-white">{current.temperature_c}°C</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-400/20 flex items-center justify-center">
            <Droplets className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <span className="text-[10px] text-agri-200 uppercase font-semibold block">{t('humidity')}</span>
            <span className="text-lg sm:text-xl font-black text-white">{current.humidity_pct}%</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-400/20 flex items-center justify-center">
            <CloudRain className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] text-agri-200 uppercase font-semibold block">{t('rainForecast')}</span>
            <span className="text-lg sm:text-xl font-black text-white">{current.rainfall_forecast_24h_mm} mm</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-400/20 flex items-center justify-center">
            <Wind className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <span className="text-[10px] text-agri-200 uppercase font-semibold block">{t('evapotranspiration')}</span>
            <span className="text-lg sm:text-xl font-black text-white">{current.et0_evapotranspiration_mm} mm/d</span>
          </div>
        </div>
      </div>

      {/* 5-Day Outlook Cards */}
      <div>
        <h4 className="text-xs font-bold text-agri-200 uppercase tracking-wider mb-2">
          5-Day Agricultural Weather Window
        </h4>
        <div className="grid grid-cols-5 gap-2">
          {forecast.map((f, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-2xl flex flex-col items-center text-center transition-all ${
                idx === 0 
                  ? 'bg-white/20 border border-white/30 font-bold' 
                  : 'bg-white/5 border border-white/5 hover:bg-white/10'
              }`}
            >
              <span className="text-xs font-bold text-white mb-1">{f.day_name}</span>
              {f.rainfall_mm > 5 ? (
                <CloudRain className="w-5 h-5 text-sky-300 my-1 animate-pulse" />
              ) : (
                <Sun className="w-5 h-5 text-amber-300 my-1" />
              )}
              <div className="text-xs font-black text-white">
                {Math.round(f.temp_max)}°
                <span className="text-[10px] font-normal text-agri-200 ml-0.5">{Math.round(f.temp_min)}°</span>
              </div>
              <span className={`text-[10px] mt-0.5 ${f.rainfall_mm > 0 ? 'text-sky-300 font-bold' : 'text-agri-300'}`}>
                {f.rainfall_mm > 0 ? `${f.rainfall_mm}mm` : '0mm'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

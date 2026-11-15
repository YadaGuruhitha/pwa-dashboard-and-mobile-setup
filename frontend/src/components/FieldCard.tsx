'use client';

import React, { useState } from 'react';
import { FieldItem, MLPrediction } from '../lib/types';
import { useLanguage } from '../context/LanguageContext';
import MoistureGauge from './MoistureGauge';
import { api } from '../lib/api';
import { 
  Power, 
  Sparkles, 
  Clock, 
  MapPin, 
  Layers, 
  Droplets,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface FieldCardProps {
  field: FieldItem;
  onRefresh?: () => void;
  onOpenPredictionModal?: (prediction: MLPrediction, field: FieldItem) => void;
}

export default function FieldCard({ field, onRefresh, onOpenPredictionModal }: FieldCardProps) {
  const { t } = useLanguage();
  const [isTogglingPump, setIsTogglingPump] = useState(false);
  const [isRunningML, setIsRunningML] = useState(false);
  const [localPumpStatus, setLocalPumpStatus] = useState(field.pump_status);
  const [quickPrediction, setQuickPrediction] = useState<MLPrediction | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle Smart Pump Toggle
  const handleTogglePump = async (newStatus: 'ON' | 'OFF' | 'AUTO') => {
    try {
      setIsTogglingPump(true);
      const res = await api.togglePump(field.id, newStatus);
      setLocalPumpStatus(res.pump_status as any);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to toggle pump:', err);
    } finally {
      setIsTogglingPump(false);
    }
  };

  // Run ML Prediction for this field
  const handleRunML = async () => {
    try {
      setIsRunningML(true);
      const res = await api.predictIrrigation({ field_id: field.id });
      setQuickPrediction(res);
      setIsExpanded(true);
      if (onOpenPredictionModal) {
        onOpenPredictionModal(res, field);
      }
    } catch (err) {
      console.error('Failed to run ML prediction:', err);
    } finally {
      setIsRunningML(false);
    }
  };

  const isPumpActive = localPumpStatus === 'ON';
  const isAutoMode = localPumpStatus === 'AUTO';

  return (
    <div className={`bg-white rounded-3xl shadow-sm border transition-all duration-200 overflow-hidden ${
      field.moisture_status === 'CRITICAL_DRY' 
        ? 'border-red-300 ring-2 ring-red-100' 
        : 'border-slate-200/80 hover:border-agri-300 hover:shadow-md'
    }`}>
      {/* Top Banner & Crop Tag */}
      <div className="bg-gradient-to-r from-agri-50 to-white px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-agri-100 flex items-center justify-center text-agri-800 font-bold text-sm">
            {field.crop_type.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 leading-tight">
              {field.name}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
              <span>{field.crop_type}</span>
              <span>•</span>
              <span className="text-agri-700 font-semibold">{field.growth_stage}</span>
            </div>
          </div>
        </div>

        {/* Area Badge */}
        <div className="bg-white px-2.5 py-1 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 shadow-2xs">
          {field.area_acres} {t('acres')}
        </div>
      </div>

      {/* Main Body: Moisture Gauge & Quick Agronomic Properties */}
      <div className="p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Circular Moisture Gauge */}
          <div className="flex-shrink-0">
            <MoistureGauge
              value={field.latest_moisture}
              minTarget={field.target_moisture_min}
              maxTarget={field.target_moisture_max}
              status={field.moisture_status}
              size={135}
            />
          </div>

          {/* Field Agronomic Metrics */}
          <div className="flex-1 w-full grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
              <span className="text-slate-600 block text-[10px] font-bold uppercase">{t('moistureLevel')}</span>
              <span className="text-sm font-bold text-slate-800 flex items-center mt-0.5">
                <Droplets className="w-3.5 h-3.5 text-blue-500 mr-1" />
                {field.latest_moisture.toFixed(1)}%
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
              <span className="text-slate-600 block text-[10px] font-bold uppercase">Soil Type</span>
              <span className="text-sm font-bold text-slate-800 flex items-center mt-0.5">
                <Layers className="w-3.5 h-3.5 text-amber-600 mr-1" />
                {field.soil_type}
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
              <span className="text-slate-600 block text-[10px] font-bold uppercase">Irrigation System</span>
              <span className="text-xs font-bold text-slate-800 truncate block mt-0.5">
                {field.irrigation_type}
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
              <span className="text-slate-600 block text-[10px] font-bold uppercase">Sensor Telemetry</span>
              <div className="flex items-center space-x-1 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${
                  field.sensor_device_status === 'ONLINE' ? 'bg-emerald-500' :
                  field.sensor_device_status === 'LOW_BATTERY' ? 'bg-amber-500' : 'bg-red-400'
                }`} />
                <span className="text-xs font-bold text-slate-800 truncate">
                  {field.last_sensor_update_relative || 'Live update'}
                </span>
              </div>
              <span className={`text-[10px] block font-semibold ${field.is_sensor_simulated ? 'text-amber-600' : 'text-emerald-700'}`}>
                {field.is_sensor_simulated ? '• Labeled Simulation' : '• Hardware Node'}
              </span>
            </div>
          </div>
        </div>

        {/* Smart Motor Remote Control Row */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Current Motor Status Indicator */}
          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${isPumpActive ? 'bg-emerald-500 animate-ping' : isAutoMode ? 'bg-blue-500' : 'bg-slate-300'}`} />
            <span className="text-xs font-bold text-slate-700">
              {t('pumpStatus')}:{' '}
              <strong className={isPumpActive ? 'text-emerald-700' : isAutoMode ? 'text-blue-700' : 'text-slate-500'}>
                {localPumpStatus}
              </strong>
            </span>
          </div>

          {/* Action Buttons: Pump Controls */}
          <div className="flex items-center space-x-1.5 w-full sm:w-auto">
            {isPumpActive ? (
              <button
                disabled={isTogglingPump}
                onClick={() => handleTogglePump('OFF')}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all"
              >
                <Power className="w-3.5 h-3.5" />
                <span>{t('turnOffPump')}</span>
              </button>
            ) : (
              <button
                disabled={isTogglingPump}
                onClick={() => handleTogglePump('ON')}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all"
              >
                <Power className="w-3.5 h-3.5" />
                <span>{t('turnOnPump')}</span>
              </button>
            )}

            <button
              disabled={isTogglingPump}
              onClick={() => handleTogglePump(isAutoMode ? 'OFF' : 'AUTO')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                isAutoMode 
                  ? 'bg-blue-100 text-blue-800 border-blue-300' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
            >
              {t('pumpAuto')}
            </button>
          </div>
        </div>

        {/* AI Prediction Quick Button */}
        <div className="mt-3">
          <button
            onClick={handleRunML}
            disabled={isRunningML}
            className="w-full bg-gradient-to-r from-agri-700 to-agri-800 hover:from-agri-800 hover:to-agri-900 text-white py-2.5 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>{isRunningML ? 'Analyzing Soil & Weather...' : t('predictWithAi')}</span>
          </button>
        </div>

        {/* Expanded AI Recommendation Box */}
        {quickPrediction && (
          <div className="mt-3 bg-agri-50/70 border border-agri-200 rounded-2xl p-3.5 text-xs text-slate-700 animate-fadeIn">
            <div className="flex items-center justify-between font-bold mb-1.5">
              <span className="flex items-center text-agri-900">
                <Sparkles className="w-3.5 h-3.5 text-agri-600 mr-1" />
                {t('aiAdvisory')}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                quickPrediction.needs_irrigation ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
              }`}>
                {quickPrediction.urgency}
              </span>
            </div>
            <p className="text-slate-600 mb-2 leading-relaxed">
              {quickPrediction.explanation}
            </p>
            {quickPrediction.needs_irrigation ? (
              <div className="grid grid-cols-2 gap-2 bg-white/80 p-2 rounded-xl border border-agri-100 font-medium">
                <div>
                  <span className="text-[10px] text-slate-600 block">{t('recVolume')}</span>
                  <span className="text-agri-900 font-bold">{quickPrediction.total_field_volume_liters.toLocaleString()} L</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-600 block">{t('optimalSlot')}</span>
                  <span className="text-agri-900 font-bold">{quickPrediction.recommended_time_slot.split(' (')[0]}</span>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

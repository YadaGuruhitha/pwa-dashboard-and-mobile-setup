'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import VoiceAssistantModal from '../../components/VoiceAssistantModal';
import MoistureGauge from '../../components/MoistureGauge';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../lib/api';
import { FieldItem, SensorHistoryPoint, MLPrediction } from '../../lib/types';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine,
  AreaChart,
  Area
} from 'recharts';
import { 
  Layers, 
  Sparkles, 
  Power, 
  Clock, 
  Droplet, 
  Send, 
  Radio, 
  Activity,
  Calendar
} from 'lucide-react';

export default function FieldsPage() {
  const { t } = useLanguage();
  const [fields, setFields] = useState<FieldItem[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<number>(1);
  const [historyData, setHistoryData] = useState<SensorHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [prediction, setPrediction] = useState<MLPrediction | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  // Manual Ingestion Form
  const [manualMoisture, setManualMoisture] = useState<number>(20.0);
  const [manualTemp, setManualTemp] = useState<number>(26.0);
  const [isSubmittingTelemetry, setIsSubmittingTelemetry] = useState(false);
  const [telemetrySuccess, setTelemetrySuccess] = useState(false);

  // Load fields
  useEffect(() => {
    api.getFields().then((data) => {
      setFields(data);
      if (data.length > 0) {
        setSelectedFieldId(data[0].id);
      }
      setLoading(false);
    }).catch(console.error);
  }, []);

  // Load sensor history for selected field
  const loadHistory = useCallback(async (fieldId: number) => {
    try {
      setChartLoading(true);
      const res = await api.getSensorHistory(fieldId, 7);
      setHistoryData(res.data);
    } catch (err) {
      console.error('Failed to load sensor history:', err);
    } finally {
      setChartLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedFieldId) {
      loadHistory(selectedFieldId);
      setPrediction(null);
    }
  }, [selectedFieldId, loadHistory]);

  const selectedField = fields.find(f => f.id === selectedFieldId) || fields[0];

  const handleRunPrediction = async () => {
    if (!selectedField) return;
    try {
      setIsPredicting(true);
      const res = await api.predictIrrigation({ field_id: selectedField.id });
      setPrediction(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleManualIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedField) return;

    try {
      setIsSubmittingTelemetry(true);
      await api.simulateSensorTick();
      setTelemetrySuccess(true);
      setTimeout(() => setTelemetrySuccess(false), 3000);
      loadHistory(selectedField.id);
      // Refresh fields list
      const updated = await api.getFields();
      setFields(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingTelemetry(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onOpenVoiceModal={() => setIsVoiceOpen(true)} />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Title & Field Switcher Pills */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center">
                <Layers className="w-6 h-6 text-agri-700 mr-2" />
                {t('navFields')} & Soil Telemetry
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Detailed microclimate monitoring and sensor timeline
              </p>
            </div>
          </div>

          {/* Field Selection Tabs */}
          <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-none">
            {fields.map((f) => {
              const isSelected = f.id === selectedFieldId;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFieldId(f.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center space-x-2 border ${
                    isSelected
                      ? 'bg-agri-800 text-white border-agri-900 shadow-md scale-102'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    f.moisture_status === 'CRITICAL_DRY' ? 'bg-red-500 animate-pulse' :
                    f.moisture_status === 'MODERATE' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <span>{f.name.split(' (')[0]}</span>
                  <span className="text-[10px] opacity-75 font-normal">({f.crop_type})</span>
                </button>
              );
            })}
          </div>
        </div>

        {selectedField && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Sensor History Recharts Graph */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center">
                      <Activity className="w-5 h-5 text-emerald-600 mr-2" />
                      7-Day Soil Moisture & Stress Timeline
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Sensor readings with optimal root zone thresholds ({selectedField.target_moisture_min}% - {selectedField.target_moisture_max}%)
                    </p>
                  </div>

                  <span className="bg-emerald-50 text-emerald-800 text-xs px-2.5 py-1 rounded-xl font-bold border border-emerald-200">
                    Live Telemetry
                  </span>
                </div>

                {/* Recharts Area / Line Chart */}
                <div className="w-full h-72 sm:h-80">
                  {chartLoading ? (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                      Loading sensor timeline...
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="moistureGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} domain={[10, 50]} unit="%" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            borderRadius: '16px',
                            border: 'none',
                            color: '#fff',
                            fontSize: '12px'
                          }}
                        />
                        <ReferenceLine
                          y={selectedField.target_moisture_min}
                          stroke="#ef4444"
                          strokeDasharray="4 4"
                          label={{ value: 'Drought Threshold', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }}
                        />
                        <ReferenceLine
                          y={selectedField.target_moisture_max}
                          stroke="#3b82f6"
                          strokeDasharray="4 4"
                          label={{ value: 'Field Capacity', fill: '#3b82f6', fontSize: 10, position: 'insideBottomRight' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="soil_moisture"
                          stroke="#10b981"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#moistureGrad)"
                          name="Soil Moisture (%)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Legend & Guide */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span>Current Moisture Level</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-1 bg-red-500" />
                    <span>Drought Stress Limit ({selectedField.target_moisture_min}%)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-1 bg-blue-500" />
                    <span>Field Capacity Limit ({selectedField.target_moisture_max}%)</span>
                  </div>
                </div>
              </div>

              {/* AI Prediction Section */}
              <div className="bg-gradient-to-br from-agri-50 to-white p-5 sm:p-6 rounded-3xl border border-agri-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center">
                      <Sparkles className="w-5 h-5 text-amber-500 mr-2" />
                      Random Forest Predictive Water Optimizer
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Multi-parameter agronomic inference for {selectedField.crop_type} ({selectedField.growth_stage} stage)
                    </p>
                  </div>

                  <button
                    onClick={handleRunPrediction}
                    disabled={isPredicting}
                    className="flex items-center space-x-2 bg-agri-800 hover:bg-agri-900 text-white px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                    <span>{isPredicting ? 'Evaluating Crop...' : t('predictWithAi')}</span>
                  </button>
                </div>

                {prediction ? (
                  <div className="bg-white p-4 rounded-2xl border border-agri-200 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600 uppercase">
                        AI Decision Status:
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        prediction.needs_irrigation ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {prediction.urgency}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {prediction.explanation}
                    </p>

                    {prediction.needs_irrigation && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                        <div className="bg-slate-50 p-2.5 rounded-xl">
                          <span className="text-[10px] text-slate-600 block font-bold uppercase">{t('recVolume')}</span>
                          <span className="text-sm font-black text-agri-900">{prediction.total_field_volume_liters.toLocaleString()} L</span>
                        </div>

                        <div className="bg-slate-50 p-2.5 rounded-xl">
                          <span className="text-[10px] text-slate-600 block font-bold uppercase">{t('recDuration')}</span>
                          <span className="text-sm font-black text-agri-900">{prediction.duration_minutes} Mins</span>
                        </div>

                        <div className="bg-slate-50 p-2.5 rounded-xl">
                          <span className="text-[10px] text-slate-600 block font-bold uppercase">{t('optimalSlot')}</span>
                          <span className="text-xs font-bold text-agri-900 block truncate">{prediction.recommended_time_slot.split(' (')[0]}</span>
                        </div>

                        <div className="bg-slate-50 p-2.5 rounded-xl">
                          <span className="text-[10px] text-slate-600 block font-bold uppercase">{t('waterSavedEst')}</span>
                          <span className="text-sm font-black text-emerald-700">~{prediction.water_saved_liters_est.toLocaleString()} L</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic bg-white/60 p-3 rounded-2xl border border-slate-200">
                    Click 'Run AI Analysis' to compute real-time agronomic root-zone water requirements.
                  </p>
                )}
              </div>
            </div>

            {/* Right Col: Field Snapshot & Manual Ingestion */}
            <div className="space-y-6">
              {/* Field Snapshot Card */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  Field Agronomic Profile
                </h3>

                <div className="flex justify-center mb-4">
                  <MoistureGauge
                    value={selectedField.latest_moisture}
                    minTarget={selectedField.target_moisture_min}
                    maxTarget={selectedField.target_moisture_max}
                    status={selectedField.moisture_status}
                    size={130}
                  />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Crop Type</span>
                    <span className="font-bold text-slate-800">{selectedField.crop_type}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Growth Stage</span>
                    <span className="font-bold text-agri-800">{selectedField.growth_stage}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Soil Texture</span>
                    <span className="font-bold text-slate-800">{selectedField.soil_type}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Irrigation Technique</span>
                    <span className="font-bold text-slate-800">{selectedField.irrigation_type}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Field Size</span>
                    <span className="font-bold text-slate-800">{selectedField.area_acres} {t('acres')}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">IoT Sensor ID</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {selectedField.sensors?.[0]?.device_identifier || 'IOT-MND-01'}
                    </span>
                  </div>
                </div>
              </div>

              {/* IoT Hardware Simulator Card */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center space-x-2 mb-3">
                  <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Hardware Ingestion Simulator
                  </h4>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Simulate live IoT telemetry pulse from in-field sensor nodes to trigger real-time ML re-evaluations.
                </p>

                <form onSubmit={handleManualIngest} className="space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmittingTelemetry}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-2xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-1.5 active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingTelemetry ? 'Transmitting...' : 'Send Live Telemetry Pulse'}</span>
                  </button>
                  {telemetrySuccess && (
                    <div className="text-center text-xs font-bold text-emerald-700 animate-fadeIn">
                      ✓ Telemetry ingested & alerts updated!
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
      />
    </div>
  );
}

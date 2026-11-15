'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import VoiceAssistantModal from '../../components/VoiceAssistantModal';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../lib/api';
import { FieldItem } from '../../lib/types';
import { 
  Sliders, 
  Layers, 
  Cpu, 
  Battery, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Radio, 
  Droplet,
  Sparkles,
  Info
} from 'lucide-react';

export default function ConfigPage() {
  const { t } = useLanguage();
  const [fields, setFields] = useState<FieldItem[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [cropType, setCropType] = useState('Tomato');
  const [growthStage, setGrowthStage] = useState<'Initial' | 'Vegetative' | 'Flowering' | 'Maturity'>('Flowering');
  const [soilType, setSoilType] = useState<'Sandy' | 'Loamy' | 'Clay'>('Loamy');
  const [irrigationType, setIrrigationType] = useState('Drip');
  const [minMoisture, setMinMoisture] = useState(24.0);
  const [maxMoisture, setMaxMoisture] = useState(34.0);
  const [sensorId, setSensorId] = useState('IOT-MND-01');

  useEffect(() => {
    api.getFields().then((data) => {
      setFields(data);
      if (data.length > 0) {
        setSelectedFieldId(data[0].id);
        populateForm(data[0]);
      }
      setLoading(false);
    }).catch(console.error);
  }, []);

  const populateForm = (field: FieldItem) => {
    setCropType(field.crop_type);
    setGrowthStage(field.growth_stage);
    setSoilType(field.soil_type);
    setIrrigationType(field.irrigation_type);
    setMinMoisture(field.target_moisture_min);
    setMaxMoisture(field.target_moisture_max);
    setSensorId(field.sensors?.[0]?.device_identifier || field.sensor_device_id || 'IOT-MND-01');
  };

  const handleSelectField = (id: number) => {
    setSelectedFieldId(id);
    const f = fields.find(item => item.id === id);
    if (f) populateForm(f);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateFieldConfig(selectedFieldId, {
        crop_type: cropType,
        growth_stage: growthStage,
        soil_type: soilType,
        irrigation_type: irrigationType,
        target_moisture_min: minMoisture,
        target_moisture_max: maxMoisture
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      const updated = await api.getFields();
      setFields(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const selectedField = fields.find(f => f.id === selectedFieldId) || fields[0];

  // FAO-56 Kc Guide Calculation
  const getKcEstimate = (stage: string, crop: string) => {
    if (crop === 'Rice (Paddy)') return stage === 'Flowering' ? '1.30' : '1.15';
    if (crop === 'Tomato') return stage === 'Flowering' ? '1.15' : stage === 'Vegetative' ? '0.80' : '0.45';
    if (crop === 'Maize (Corn)') return stage === 'Flowering' ? '1.20' : '0.85';
    return '1.00';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar onOpenVoiceModal={() => setIsVoiceOpen(true)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar onOpenVoiceModal={() => setIsVoiceOpen(true)} />

        <main className="max-w-5xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Top Title Bar */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center">
                <Sliders className="w-6 h-6 text-agri-700 mr-2" />
                {t('navConfig')}
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Calibrate root zone moisture limits, crop phenology stages, and IoT telemetry identifiers
              </p>
            </div>
          </div>

          {/* Field Selector Tabs */}
          <div className="flex overflow-x-auto space-x-2 pb-1 scrollbar-none">
            {fields.map((f) => (
              <button
                key={f.id}
                onClick={() => handleSelectField(f.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                  f.id === selectedFieldId
                    ? 'bg-agri-800 text-white border-agri-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f.name.split(' (')[0]} ({f.crop_type})
              </button>
            ))}
          </div>

          {savedSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center space-x-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Agronomic parameters and sensor limits saved successfully!</span>
            </div>
          )}

          {/* Configuration Form Card */}
          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Crop & Moisture Limits */}
            <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center">
                <Layers className="w-5 h-5 text-agri-700 mr-2" />
                Crop Phenology & Soil Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-700 uppercase mb-1">Crop Type</label>
                  <select
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
                  >
                    <option value="Tomato">Tomato (Hybrid Arka Rakshak)</option>
                    <option value="Rice (Paddy)">Rice (Paddy BR-2655)</option>
                    <option value="Maize (Corn)">Maize (African Tall)</option>
                    <option value="Sugarcane">Sugarcane (Co-86032)</option>
                    <option value="Wheat">Wheat (HD-2967)</option>
                    <option value="Cotton">Cotton (Bt Cotton)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 uppercase mb-1">Growth Stage</label>
                  <select
                    value={growthStage}
                    onChange={(e) => setGrowthStage(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-agri-800"
                  >
                    <option value="Initial">Initial (Seedling / Emergence)</option>
                    <option value="Vegetative">Vegetative (Stem & Canopy Growth)</option>
                    <option value="Flowering">Flowering / Fruit Formation (Critical)</option>
                    <option value="Maturity">Maturity / Ripening</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 uppercase mb-1">Soil Texture Class</label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
                  >
                    <option value="Sandy">Sandy Soil (Fast drainage, low retention)</option>
                    <option value="Loamy">Loamy Soil (Ideal agricultural balance)</option>
                    <option value="Clay">Clay Soil (High retention, slow percolation)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 uppercase mb-1">Irrigation Delivery System</label>
                  <select
                    value={irrigationType}
                    onChange={(e) => setIrrigationType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
                  >
                    <option value="Drip">Drip Irrigation (Micro-emitter, high efficiency)</option>
                    <option value="Sprinkler">Sprinkler System (Overhead micro-spray)</option>
                    <option value="AWD (Alternate Wetting)">AWD (Alternate Wetting & Drying - Paddy)</option>
                    <option value="Furrow">Furrow / Basin Irrigation</option>
                  </select>
                </div>
              </div>

              {/* Moisture Threshold Sliders */}
              <div className="pt-3 border-t border-slate-100 space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase">
                  Root Zone Volumetric Moisture Target Bounds (%)
                </h4>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-red-700">Minimum Threshold (Drought Trigger): {minMoisture}%</span>
                    <span className="text-slate-400">Trigger irrigation when below</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="35"
                    step="0.5"
                    value={minMoisture}
                    onChange={(e) => setMinMoisture(Number(e.target.value))}
                    className="w-full accent-red-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-blue-700">Maximum Threshold (Field Capacity): {maxMoisture}%</span>
                    <span className="text-slate-400">Stop irrigation when reached</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="50"
                    step="0.5"
                    value={maxMoisture}
                    onChange={(e) => setMaxMoisture(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* FAO-56 Agronomic Info Box */}
              <div className="p-3.5 rounded-2xl bg-agri-50 border border-agri-200 text-xs text-agri-900 flex items-start space-x-2.5">
                <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold block">FAO-56 Crop Coefficient ($K_c$): {getKcEstimate(growthStage, cropType)}</span>
                  <p className="text-agri-800 text-[11px] mt-0.5 leading-relaxed">
                    At {growthStage} stage, water stress reduces yield significantly. The Random Forest model dynamically accounts for daily solar evaporation demands.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-agri-800 hover:bg-agri-900 text-white py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Updating Configuration...' : 'Save Field Configuration'}</span>
                </button>
              </div>
            </div>

            {/* Right Col: IoT Sensor Hardware Pairing */}
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center">
                  <Cpu className="w-5 h-5 text-emerald-600 mr-2" />
                  IoT Sensor Hardware Node
                </h3>

                <div className="space-y-3 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-700 uppercase mb-1">
                      Sensor Device Identifier
                    </label>
                    <input
                      type="text"
                      value={sensorId}
                      onChange={(e) => setSensorId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-800"
                    />
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Connection Protocol</span>
                      <span className="font-bold text-slate-800">LoRaWAN / WiFi Node</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Node Status</span>
                      <span className="text-emerald-700 font-bold flex items-center">
                        <Radio className="w-3 h-3 text-emerald-500 mr-1 animate-pulse" />
                        Online & Transmitting
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Battery Level</span>
                      <span className="font-bold text-slate-800 flex items-center">
                        <Battery className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                        92.0% (Solar Backed)
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert(`Diagnostics ping sent to sensor ${sensorId}. Latency: 42ms. RSSI: -68 dBm.`)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold transition-all"
                  >
                    Run Sensor Diagnostic Ping
                  </button>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>

      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
      />
    </div>
  );
}

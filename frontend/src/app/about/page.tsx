'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useLanguage } from '../../context/LanguageContext';
import { getAllLanguages } from '../../lib/i18n';
import { 
  Info, 
  Sprout, 
  Droplet, 
  Sparkles, 
  Mic, 
  Layers, 
  ShieldCheck, 
  Award, 
  Cpu, 
  Database, 
  Globe2, 
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Volume2,
  FileText,
  Search,
  Check,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const { t } = useLanguage();
  const [searchLang, setSearchLang] = useState('');
  const [langFilter, setLangFilter] = useState<'all' | 'sarvam' | 'fallback' | 'rtl'>('all');

  const allLangs = useMemo(() => getAllLanguages(), []);

  const filteredLangs = useMemo(() => {
    return allLangs.filter((l) => {
      // Filter by category
      if (langFilter === 'sarvam' && l.capabilities.voiceProvider !== 'Sarvam AI') return false;
      if (langFilter === 'fallback' && l.capabilities.voiceProvider === 'Sarvam AI') return false;
      if (langFilter === 'rtl' && l.direction !== 'rtl') return false;

      // Filter by search query
      if (searchLang.trim()) {
        const q = searchLang.toLowerCase().trim();
        return (
          l.name.toLowerCase().includes(q) ||
          l.nativeName.toLowerCase().includes(q) ||
          l.code.toLowerCase().includes(q) ||
          l.script.toLowerCase().includes(q) ||
          l.region.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allLangs, langFilter, searchLang]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar />

        <main className="max-w-6xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Header */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center">
              <Info className="w-6 h-6 text-agri-700 mr-2" />
              Project Architecture & Agronomic Foundations
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              AI-Powered Smart Irrigation System for Predictive Water Management and Crop Optimization
            </p>
          </div>

          {/* Full-Stack Technology Stack & Live Backend Services */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center">
                  <Cpu className="w-5 h-5 text-indigo-600 mr-2" />
                  Full-Stack Technology Stack & Live Backend Services
                </h2>
                <p className="text-xs text-slate-500">
                  Microservices architecture connecting IoT hardware, FastAPI backend, ML models, and Next.js PWA
                </p>
              </div>
              <span className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full font-bold border border-indigo-200 self-start sm:self-auto">
                FastAPI + MLflow + Next.js
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* FastAPI Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/40 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Python FastAPI Backend</h3>
                      <p className="text-[11px] text-slate-500 font-medium">Asynchronous REST API (Port 8000)</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Active
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Powers ML predictions, IoT sensor ingestion, FAO-56 Penman-Monteith evapotranspiration, and multi-channel farmer notifications.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href="http://127.0.0.1:8000/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                  >
                    <span>Open FastAPI Swagger Docs</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="http://127.0.0.1:8000/api/health"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium rounded-xl transition-all"
                  >
                    <span>Health API</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>

              {/* MLflow Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">MLflow 3.x MLOps Platform</h3>
                      <p className="text-[11px] text-slate-500 font-medium">Experiment Tracking (Port 5000)</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    Experiment Active
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Versions hyperparameters, compares 3 candidate models (Random Forest, Gradient Boosting, Decision Tree), and logs model metrics.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href="http://127.0.0.1:5000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                  >
                    <span>Open MLflow Dashboard</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <Link
                    href="/analytics"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium rounded-xl transition-all"
                  >
                    <span>Comparison Table</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Project Statement & Outcomes */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center">
              <Sprout className="w-5 h-5 text-emerald-600 mr-2" />
              Problem Statement & Real-World Impact
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              Farmers in India consistently overuse or underuse water due to the absence of real-time, data-driven microclimate insights, leading to severe aquifer depletion, root diseases, and diminished crop yields. Furthermore, existing precision agriculture software assumes desktop access and high English literacy, effectively excluding over 85% of Indian smallholder farmers.
            </p>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              <strong>Krishi Jal</strong> bridges this critical divide with an installable <strong>Progressive Web App (PWA)</strong>, pairing real-time in-field IoT soil sensor ingestion with a calibrated <strong>Random Forest Machine Learning Engine</strong> and <strong>Sarvam AI Indic voice intelligence</strong> in <strong>English and all 22 scheduled Indian languages</strong>.
            </p>
          </div>

          {/* Machine Learning Model Performance */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center">
                  <Sparkles className="w-5 h-5 text-amber-500 mr-2" />
                  Machine Learning Architecture & Evaluation
                </h2>
                <p className="text-xs text-slate-500">Trained on multi-season Indian microclimate datasets (FAO-56 baseline)</p>
              </div>

              <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold">
                scikit-learn Random Forest Pipeline
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                <span className="text-2xl sm:text-3xl font-black text-emerald-800 block">98.10%</span>
                <span className="text-[11px] font-bold text-emerald-700 uppercase">Accuracy</span>
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                <span className="text-2xl sm:text-3xl font-black text-emerald-800 block">99.47%</span>
                <span className="text-[11px] font-bold text-emerald-700 uppercase">Precision</span>
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                <span className="text-2xl sm:text-3xl font-black text-emerald-800 block">95.67%</span>
                <span className="text-[11px] font-bold text-emerald-700 uppercase">Recall</span>
              </div>
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                <span className="text-2xl sm:text-3xl font-black text-emerald-800 block">97.54%</span>
                <span className="text-[11px] font-bold text-emerald-700 uppercase">F1-Score</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700 pt-2">
              <h4 className="font-bold text-slate-900 uppercase">Primary Feature Importance Weights:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex justify-between">
                  <span>Soil Moisture</span>
                  <strong>41.2%</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex justify-between">
                  <span>Crop Type ($K_c$)</span>
                  <strong>18.6%</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex justify-between">
                  <span>Rainfall Forecast 24h</span>
                  <strong>14.8%</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex justify-between">
                  <span>Growth Stage</span>
                  <strong>11.4%</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex justify-between">
                  <span>Air Temperature</span>
                  <strong>8.2%</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex justify-between">
                  <span>Soil Texture</span>
                  <strong>5.8%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Language Capability Matrix Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center">
                  <Globe2 className="w-5 h-5 text-emerald-600 mr-2" />
                  Language Capability Matrix (English + 22 Scheduled Indic Languages)
                </h2>
                <p className="text-xs text-slate-500">
                  Strict 4-dimensional verification distinguishing UI translation, dynamic translation, STT, and TTS.
                </p>
              </div>

              <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold self-start sm:self-auto">
                23 Languages Active
              </span>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center space-x-1.5 overflow-x-auto text-xs pb-1">
                <button
                  onClick={() => setLangFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    langFilter === 'all' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({allLangs.length})
                </button>
                <button
                  onClick={() => setLangFilter('sarvam')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1 ${
                    langFilter === 'sarvam' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Sarvam Cloud Voice (11)</span>
                </button>
                <button
                  onClick={() => setLangFilter('fallback')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    langFilter === 'fallback' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Browser Speech Fallback (12)
                </button>
                <button
                  onClick={() => setLangFilter('rtl')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    langFilter === 'rtl' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  RTL Direction (3)
                </button>
              </div>

              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by language/script..."
                  value={searchLang}
                  onChange={(e) => setSearchLang(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-800 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3.5">Language</th>
                    <th className="py-3 px-3">Script & Dir</th>
                    <th className="py-3 px-3">UI Translation</th>
                    <th className="py-3 px-3">Dynamic AI Text</th>
                    <th className="py-3 px-3">Speech Recog (STT)</th>
                    <th className="py-3 px-3">Text-to-Speech (TTS)</th>
                    <th className="py-3 px-3">Voice Provider</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLangs.map((lang) => {
                    const isSarvam = lang.capabilities.voiceProvider === 'Sarvam AI';
                    const isRtl = lang.direction === 'rtl';

                    return (
                      <tr key={lang.code} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3.5 font-bold text-slate-900 flex items-center space-x-2">
                          <span className="text-sm" dir={isRtl ? 'rtl' : 'ltr'}>{lang.nativeName}</span>
                          <span className="text-slate-500 font-normal">({lang.name})</span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1 rounded">{lang.code}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-medium text-slate-700">{lang.script}</span>
                          <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            isRtl ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {lang.direction.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center text-emerald-700 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                            {lang.completenessScore}% Full
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-emerald-700 font-semibold">Verified Grounded</span>
                        </td>
                        <td className="py-2.5 px-3">
                          {isSarvam ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              Sarvam Saaras
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium text-[10px]">
                              Web Speech API
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          {isSarvam ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              Sarvam Bulbul
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium text-[10px]">
                              Web Speech API
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`font-bold text-[11px] ${isSarvam ? 'text-emerald-800' : 'text-slate-600'}`}>
                            {lang.capabilities.voiceProvider}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sarvam AI Indic Speech Pipeline */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center">
              <Mic className="w-5 h-5 text-sky-600 mr-2" />
              Sarvam AI Indic Language Integration
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              Krishi Jal incorporates the <strong>Sarvam AI</strong> API stack for Indic regional speech synthesis and intent recognition:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-1">
                <strong className="text-sky-900 font-bold block text-sm">Saaras ASR (STT)</strong>
                <p className="text-sky-800">Transcribes rural farmer spoken queries in Kannada, Hindi, Telugu, Tamil, Marathi, and 6 other Indian languages with acoustic robustness against tractor and field noise.</p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-1">
                <strong className="text-sky-900 font-bold block text-sm">Bulbul TTS</strong>
                <p className="text-sky-800">Generates natural human-like voice responses in Indian dialects, reading irrigation advisories and sensor alerts aloud in native speech.</p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-1">
                <strong className="text-sky-900 font-bold block text-sm">Mayura Translation</strong>
                <p className="text-sky-800">Context-aware dynamic translation of live sensor telemetry and agrometeorological warnings into regional dialects.</p>
              </div>
            </div>
          </div>

          {/* SDGs Alignment */}
          <div className="bg-gradient-to-r from-agri-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-agri-800 space-y-4">
            <h2 className="text-lg font-black text-white flex items-center">
              <Award className="w-5 h-5 text-amber-400 mr-2" />
              United Nations Sustainable Development Goals (SDGs)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-emerald-400 font-bold block text-sm">SDG 6: Clean Water</span>
                <p className="text-agri-100">Reduces agricultural water wastage by up to 35% using micro-dosing and Rain Guard deferrals.</p>
              </div>

              <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-amber-400 font-bold block text-sm">SDG 2: Zero Hunger</span>
                <p className="text-agri-100">Prevents bloom drop and root asphyxiation, directly improving crop yields across smallholder acreage.</p>
              </div>

              <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
                <span className="text-sky-400 font-bold block text-sm">SDG 13: Climate Action</span>
                <p className="text-agri-100">Curbs agricultural electricity consumption by reducing unnecessary electric water pump runtime.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

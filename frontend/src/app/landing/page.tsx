'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { 
  Sprout, 
  Droplet, 
  Sparkles, 
  Mic, 
  Layers, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  ArrowRight, 
  Globe, 
  Smartphone, 
  CheckCircle,
  CloudSun,
  Award,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-200">
      {/* Top Marketing Header */}
      <header className="sticky top-0 z-40 bg-agri-950/95 backdrop-blur-md border-b border-agri-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-agri-700 flex items-center justify-center shadow-lg border border-emerald-400/30">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {t('appName')}
              </span>
              <span className="text-[10px] text-emerald-400 block font-semibold">
                Predictive Water Management
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <LanguageSwitcher />

            <Link
              href="/login"
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border border-white/20 transition-all"
            >
              {t('signIn')}
            </Link>

            <Link
              href="/"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5"
            >
              <span>{t('navDashboard')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-agri-950 via-agri-900 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/15 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold text-emerald-300">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>98.1% ML Trigger Precision • Sarvam Indic Voice • Low-Bandwidth PWA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white">
            AI-Powered Smart Irrigation for <span className="text-emerald-400">Predictive Water Management</span> & Crop Optimization
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-lg text-agri-200/90 leading-relaxed font-normal">
            Smallholder farmers consistently lose crop yield to water stress or over-watering. Krishi Jal combines in-field soil sensors, agro-weather forecasts, and FAO-56 Penman-Monteith Random Forest AI to recommend precise irrigation runtimes in English and all 22 scheduled Indian languages with Sarvam AI voice assistance.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/"
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-agri-600 hover:from-emerald-400 hover:to-agri-500 text-white px-8 py-4 rounded-2xl text-base font-black shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <span>Launch Farmer Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-2xl text-base font-bold border border-white/20 transition-all flex items-center justify-center space-x-2"
            >
              <Smartphone className="w-5 h-5 text-emerald-300" />
              <span>One-Tap Demo Login</span>
            </Link>

            <Link
              href="/voice"
              className="w-full sm:w-auto bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-6 py-4 rounded-2xl text-base font-bold border border-amber-400/40 transition-all flex items-center justify-center space-x-2"
            >
              <Mic className="w-5 h-5 text-amber-400" />
              <span>Try Krishi Mitra Voice</span>
            </Link>
          </div>

          {/* Quick Metrics Banner */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xs">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">34.6%</span>
              <span className="text-xs text-agri-200">Water Conserved vs Flood</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xs">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 block">98.1%</span>
              <span className="text-xs text-agri-200">ML Decision Accuracy</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xs">
              <span className="text-2xl sm:text-3xl font-black text-sky-400 block">23 Langs</span>
              <span className="text-xs text-agri-200">English + 22 Scheduled Indic</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xs">
              <span className="text-2xl sm:text-3xl font-black text-purple-400 block">100%</span>
              <span className="text-xs text-agri-200">Rural Offline PWA Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-agri-700 bg-agri-100 px-3 py-1 rounded-full">
            Engineered for Rural India
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How Krishi Jal Empowers Smallholder Farmers
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A complete loop from sensor telemetry and predictive modeling to voice-activated pump control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-agri-300 hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Droplet className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">IoT Sensor Ingestion</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Continuously monitors in-field root-zone soil moisture and soil temperatures with automated data cleaning and outlier rejection.
            </p>
            <div className="text-xs text-emerald-700 font-bold flex items-center pt-2">
              <span>Automatic Calibration</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-agri-300 hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Random Forest & Rain Guard</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Trained on FAO-56 Penman-Monteith crop coefficients. Postpones watering when rain is forecast to prevent waterlogging and save electricity.
            </p>
            <div className="text-xs text-amber-700 font-bold flex items-center pt-2">
              <span>Rainfall Guard Algorithm</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-agri-300 hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
              <Mic className="w-6 h-6 text-sky-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Sarvam AI Indic Voice</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enables farmers to ask "Does my field need water?" in Kannada, Hindi, or English, speaking back actionable recommendations aloud.
            </p>
            <div className="text-xs text-sky-700 font-bold flex items-center pt-2">
              <span>Speech-to-Speech Ready</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-agri-300 hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Smartphone className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Rural-Optimized PWA</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Installs without Google Play Store approval. Operates seamlessly offline on low-end Android smartphones under 2G/3G connectivity.
            </p>
            <div className="text-xs text-purple-700 font-bold flex items-center pt-2">
              <span>Zero-Install Friction</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demonstration Section */}
      <section className="bg-gradient-to-br from-agri-900 to-agri-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
              Live Verified Demo Case
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Ramesh Gowda's 8.8-Acre Farm in Mandya, Karnataka
            </h2>
            <p className="text-xs sm:text-sm text-agri-200 leading-relaxed font-normal">
              Managing 4 diverse fields: Hybrid Tomato, BR-2655 Paddy (Alternate Wetting and Drying), African Tall Maize, and Co-86032 Sugarcane. Over the past 14 days, the AI system saved 86,327 Liters of water and 56.2 kWh of pumping electricity.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg inline-flex items-center space-x-2"
              >
                <span>Explore Live Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-white/10 p-6 rounded-3xl border border-white/20 backdrop-blur-md w-full max-w-sm space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center">
              <Award className="w-5 h-5 text-amber-400 mr-2" />
              Agronomic Efficiency Score
            </h4>
            <div className="text-4xl font-black text-emerald-400">
              94 <span className="text-lg text-agri-200 font-normal">/ 100</span>
            </div>
            <div className="space-y-2 text-xs text-agri-100">
              <div className="flex justify-between py-1 border-b border-white/10">
                <span>Total Water Conserved</span>
                <strong className="text-white">86,327 L</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span>Power Conserved</span>
                <strong className="text-white">56.2 kWh</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Rain Guard Savings</span>
                <strong className="text-white">₹890.00</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4 sm:px-6 lg:px-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Sprout className="w-5 h-5 text-emerald-500" />
            <span className="text-white font-bold text-sm">Krishi Jal (ಕೃಷಿ ಜಲ್)</span>
            <span>• Predictive Agricultural Water Management</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/" className="hover:text-white">Dashboard</Link>
            <Link href="/weather" className="hover:text-white">Weather</Link>
            <Link href="/schedule" className="hover:text-white">Schedule</Link>
            <Link href="/voice" className="hover:text-white">Voice</Link>
            <Link href="/about" className="hover:text-white">About Project</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

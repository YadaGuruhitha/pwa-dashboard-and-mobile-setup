'use client';

import React from 'react';
import { AnalyticsSummary } from '../lib/types';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { 
  Droplet, 
  Zap, 
  IndianRupee, 
  Award, 
  Download, 
  FileSpreadsheet, 
  FileText 
} from 'lucide-react';

interface WaterSavingsCardProps {
  analytics: AnalyticsSummary | null;
}

export default function WaterSavingsCard({ analytics }: WaterSavingsCardProps) {
  const { t } = useLanguage();

  const summary = analytics?.summary || {
    total_water_saved_liters: 86327,
    savings_percentage: 34.6,
    electricity_saved_kwh: 56.2,
    cost_saved_inr: 890,
    irrigation_efficiency_score: 94
  };

  return (
    <div className="bg-gradient-to-br from-white to-agri-50 rounded-3xl p-5 sm:p-6 border border-agri-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-2xl bg-emerald-100 text-emerald-800">
              <Award className="w-5 h-5 text-agri-800" />
            </span>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">
              {t('waterSavingsTitle')}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Predictive AI irrigation vs conventional flood watering benchmarks
          </p>
        </div>

        {/* Action Downloads */}
        <div className="flex items-center space-x-2">
          <a
            href={api.getCsvReportUrl()}
            download
            className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold shadow-2xs hover:shadow-xs transition-all"
            title="Download field telemetry as CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>CSV</span>
          </a>

          <a
            href={api.getPdfReportUrl()}
            download
            className="flex items-center space-x-1.5 bg-agri-800 hover:bg-agri-900 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs hover:shadow-xs transition-all"
            title="Download executive PDF report"
          >
            <FileText className="w-3.5 h-3.5 text-agri-200" />
            <span>PDF</span>
          </a>
        </div>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Water Conserved */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-600 uppercase">
              {t('totalWaterSaved')}
            </span>
            <Droplet className="w-4 h-4 text-sky-500" fill="#0ea5e9" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {summary.total_water_saved_liters.toLocaleString()}
            <span className="text-xs font-bold text-slate-500 ml-1">L</span>
          </div>
          <div className="text-[11px] font-bold text-emerald-600 mt-1">
            ↑ {summary.savings_percentage}% water conserved
          </div>
        </div>

        {/* Metric 2: Electricity Saved */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-600 uppercase">
              {t('electricitySaved')}
            </span>
            <Zap className="w-4 h-4 text-amber-500" fill="#f59e0b" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {summary.electricity_saved_kwh}
            <span className="text-xs font-bold text-slate-500 ml-1">kWh</span>
          </div>
          <div className="text-[11px] font-bold text-amber-600 mt-1">
            Pumping energy reduced
          </div>
        </div>

        {/* Metric 3: Financial Benefit */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-600 uppercase">
              {t('moneySaved')}
            </span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            ₹{summary.cost_saved_inr}
          </div>
          <div className="text-[11px] font-bold text-emerald-600 mt-1">
            Power tariff & wear saved
          </div>
        </div>

        {/* Metric 4: Efficiency Score */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-600 uppercase">
              {t('efficiencyScore')}
            </span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {summary.irrigation_efficiency_score}
            <span className="text-xs font-bold text-slate-500 ml-1">/ 100</span>
          </div>
          <div className="text-[11px] font-bold text-purple-600 mt-1">
            Grade A (Sustainable)
          </div>
        </div>
      </div>
    </div>
  );
}

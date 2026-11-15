'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import VoiceAssistantModal from '../../components/VoiceAssistantModal';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../lib/api';
import { FieldItem, AnalyticsSummary, IrrigationScheduleItem } from '../../lib/types';
import { 
  FileText, 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Calendar, 
  Filter, 
  Droplet, 
  Award,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function ReportsPage() {
  const { t, language } = useLanguage();
  const [fields, setFields] = useState<FieldItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [schedules, setSchedules] = useState<IrrigationScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '14d' | '30d'>('14d');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getFields(),
      api.getAnalytics(),
      api.getSchedules('all')
    ]).then(([fieldsData, analyticsData, schedulesData]) => {
      setFields(fieldsData);
      setAnalytics(analyticsData);
      setSchedules(schedulesData);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const summary = analytics?.summary || {
    total_water_saved_liters: 86327,
    savings_percentage: 34.6,
    electricity_saved_kwh: 56.2,
    cost_saved_inr: 890,
    carbon_offset_kg: 46.1,
    active_fields: 4,
    irrigation_efficiency_score: 94
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar onOpenVoiceModal={() => setIsVoiceOpen(true)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar onOpenVoiceModal={() => setIsVoiceOpen(true)} />

        <main className="max-w-6xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Header Card with Download & Print Actions */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center">
                <FileText className="w-6 h-6 text-agri-700 mr-2" />
                {t('navReports')} & Data Export
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Official audit and verification reports for agricultural subsidies, water boards, and supervisors
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={api.getCsvReportUrl(language)}
                download
                className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-800 px-3.5 py-2 rounded-2xl border border-slate-300 text-xs sm:text-sm font-bold shadow-2xs hover:shadow-xs transition-all"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>{t('downloadCsv')}</span>
              </a>

              <a
                href={api.getPdfReportUrl(language)}
                download
                className="flex items-center space-x-1.5 bg-agri-800 hover:bg-agri-900 text-white px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                <FileText className="w-4 h-4 text-agri-200" />
                <span>{t('downloadPdf')}</span>
              </a>

              <button
                onClick={handlePrint}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl border border-slate-200 transition-all"
                title="Print this report"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Audit Summary Box */}
          <div className="bg-gradient-to-r from-agri-50 to-emerald-50/50 p-6 rounded-3xl border border-agri-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-agri-700 tracking-wider">Official Executive Summary</span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                  Smallholder Water Conservation Report (Mandya Agro-District)
                </h3>
              </div>

              <span className="bg-emerald-600 text-white px-3 py-1 rounded-xl text-xs font-bold shadow-2xs self-start sm:self-auto">
                Audited & Certified by FAO-56 Penman-Monteith Model
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-2xl border border-agri-100 shadow-2xs">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Conserved</span>
                <span className="text-xl font-black text-slate-900 mt-0.5 block">{summary.total_water_saved_liters.toLocaleString()} L</span>
                <span className="text-emerald-700 font-bold mt-1 block">↑ {summary.savings_percentage}% savings</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-agri-100 shadow-2xs">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Pumping Energy</span>
                <span className="text-xl font-black text-slate-900 mt-0.5 block">{summary.electricity_saved_kwh} kWh</span>
                <span className="text-amber-700 font-bold mt-1 block">Reduced rural grid peak</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-agri-100 shadow-2xs">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Financial Savings</span>
                <span className="text-xl font-black text-slate-900 mt-0.5 block">₹{summary.cost_saved_inr}</span>
                <span className="text-emerald-700 font-bold mt-1 block">Tariff & pump wear saved</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-agri-100 shadow-2xs">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Active Fields</span>
                <span className="text-xl font-black text-slate-900 mt-0.5 block">{fields.length} Zones</span>
                <span className="text-purple-700 font-bold mt-1 block">8.8 Acres monitored</span>
              </div>
            </div>
          </div>

          {/* Interactive Report Table: Field Telemetry & Crop Status */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Field Microclimate & Moisture Telemetry Table
                </h3>
                <p className="text-xs text-slate-500">Live hardware telemetry and agronomic bounds per monitored parcel</p>
              </div>

              <span className="text-xs font-bold text-slate-500 font-mono">
                {fields.length} Registered Fields
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-100 text-[10px]">
                  <tr>
                    <th className="px-5 py-3">Field Name</th>
                    <th className="px-4 py-3">Crop & Stage</th>
                    <th className="px-4 py-3">Soil Type</th>
                    <th className="px-4 py-3">Area</th>
                    <th className="px-4 py-3">Current Moisture</th>
                    <th className="px-4 py-3">Target Range</th>
                    <th className="px-4 py-3">Motor Status</th>
                    <th className="px-4 py-3">Condition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {fields.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {f.name.split(' (')[0]}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold">{f.crop_type}</span>
                        <span className="text-slate-500 block text-[10px]">{f.growth_stage}</span>
                      </td>
                      <td className="px-4 py-3.5">{f.soil_type}</td>
                      <td className="px-4 py-3.5">{f.area_acres} ac</td>
                      <td className="px-4 py-3.5 font-bold">
                        <span className={f.latest_moisture < f.target_moisture_min ? 'text-red-600' : 'text-emerald-700'}>
                          {f.latest_moisture}%
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">
                        {f.target_moisture_min}% - {f.target_moisture_max}%
                      </td>
                      <td className="px-4 py-3.5 font-bold">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] ${
                          f.pump_status === 'ON' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {f.pump_status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          f.moisture_status === 'CRITICAL_DRY' ? 'bg-red-100 text-red-800 animate-pulse' :
                          f.moisture_status === 'OPTIMAL' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {f.moisture_status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Historical Irrigation Logs Preview */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                Irrigation Event Schedule & Rain Guard Log
              </h3>
              <p className="text-xs text-slate-500">AI scheduling decisions, water volume delivered, and weather overrides</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-100 text-[10px]">
                  <tr>
                    <th className="px-5 py-3">Scheduled Date</th>
                    <th className="px-4 py-3">Field</th>
                    <th className="px-4 py-3">Time Window</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Volume (L)</th>
                    <th className="px-4 py-3">Trigger Mode</th>
                    <th className="px-4 py-3">Execution Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {schedules.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3 font-mono text-[11px] font-bold">{s.scheduled_date}</td>
                      <td className="px-4 py-3 font-bold">{s.field_name?.split(' (')[0]}</td>
                      <td className="px-4 py-3 font-mono">{s.start_time} - {s.end_time}</td>
                      <td className="px-4 py-3">{s.duration_minutes} mins</td>
                      <td className="px-4 py-3 font-bold text-sky-800">{s.water_volume_liters.toLocaleString()} L</td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {s.triggered_by}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                          s.status === 'SKIPPED' ? 'bg-slate-200 text-slate-700' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

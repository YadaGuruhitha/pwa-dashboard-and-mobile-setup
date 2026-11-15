'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import VoiceAssistantModal from '../../components/VoiceAssistantModal';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../lib/api';
import { AlertItem, FieldItem } from '../../lib/types';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Volume2, 
  Check, 
  Send,
  Smartphone,
  Mail,
  Radio,
  Sliders,
  History,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink
} from 'lucide-react';

export default function AlertsPage() {
  const { t, speakText, language } = useLanguage();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [fields, setFields] = useState<FieldItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('active');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isTriggeringTest, setIsTriggeringTest] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedFieldForConfig, setSelectedFieldForConfig] = useState<FieldItem | null>(null);
  const [configMin, setConfigMin] = useState<number>(22);
  const [configMax, setConfigMax] = useState<number>(34);
  const [configSuccess, setConfigSuccess] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [alertsData, fieldsData] = await Promise.all([
        api.getAlerts(statusFilter),
        api.getFields()
      ]);
      setAlerts(alertsData);
      setFields(fieldsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleMarkRead = async (id: number) => {
    try {
      await api.markAlertRead(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolve = async (id: number) => {
    try {
      await api.resolveAlert(id, "Farmer Ramesh");
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerTest = async () => {
    try {
      setIsTriggeringTest(true);
      await fetch('/api/alerts/test-trigger', { method: 'POST' });
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsTriggeringTest(false);
    }
  };

  const handleSaveThresholds = async () => {
    if (!selectedFieldForConfig) return;
    try {
      await api.updateFieldThresholds(selectedFieldForConfig.id, configMin, configMax);
      setConfigSuccess(`Thresholds updated: Min ${configMin}% - Max ${configMax}%`);
      setTimeout(() => {
        setConfigSuccess(null);
        setShowConfigModal(false);
      }, 1500);
      loadData();
    } catch (err) {
      console.error('Threshold update failed:', err);
    }
  };

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onOpenVoiceModal={() => setIsVoiceOpen(true)} />

      <main className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center">
              <Bell className="w-6 h-6 text-agri-700 mr-2" />
              {t('alertsTitle')} & Multi-Channel Delivery
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Automated triggers via Web Push API, Twilio SMS, and SendGrid Email
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (fields.length > 0) {
                  setSelectedFieldForConfig(fields[0]);
                  setConfigMin(fields[0].target_moisture_min);
                  setConfigMax(fields[0].target_moisture_max);
                  setShowConfigModal(true);
                }
              }}
              className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xs"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-600" />
              <span>Configure Thresholds</span>
            </button>

            <button
              onClick={handleTriggerTest}
              disabled={isTriggeringTest}
              className="flex items-center space-x-1.5 bg-agri-800 hover:bg-agri-900 text-white px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5 text-agri-200" />
              <span>{isTriggeringTest ? 'Dispatching...' : 'Dispatch Test Alert'}</span>
            </button>
          </div>
        </div>

        {/* Multi-Channel Protocol Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center space-x-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700 flex-shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Web Push Notifications</span>
              <span className="text-[11px] text-slate-500">ServiceWorker FCM API (PWA Ready)</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center space-x-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Twilio SMS Gateway</span>
              <span className="text-[11px] text-slate-500">+91 Farmer Phone Dispatch</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center space-x-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">SendGrid Email Delivery</span>
              <span className="text-[11px] text-slate-500">Daily Agronomic Audit Logs</span>
            </div>
          </div>
        </div>

        {/* Filter Controls: Active vs Resolved Tabs */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
            {(['active', 'resolved', 'all'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                  statusFilter === tab
                    ? 'bg-agri-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === 'active' ? 'Active Alerts' : tab === 'resolved' ? 'Resolved History' : 'All Alerts'}
              </button>
            ))}
          </div>

          {/* Severity Filter */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-slate-500">Severity:</span>
            {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map(sev => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  severityFilter === sev
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {loading ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400 text-sm">
              Loading alerts and telemetry rules...
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-2">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Alerts Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {statusFilter === 'active' 
                  ? "All field soil moisture and IoT nodes are within optimal agronomic thresholds."
                  : "No resolved historical alerts found matching your filter criteria."}
              </p>
            </div>
          ) : (
            filteredAlerts.map(alert => {
              const isCrit = alert.severity === 'CRITICAL';
              const isWarn = alert.severity === 'WARNING';
              const isResolved = alert.is_resolved;

              return (
                <div 
                  key={alert.id}
                  className={`bg-white rounded-3xl p-5 border transition-all shadow-xs ${
                    isResolved 
                      ? 'border-slate-200/60 opacity-80 bg-slate-50/50'
                      : isCrit 
                      ? 'border-red-200 bg-red-50/30' 
                      : isWarn 
                      ? 'border-amber-200 bg-amber-50/20' 
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start space-x-3.5">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isResolved
                          ? 'bg-slate-200 text-slate-600'
                          : isCrit 
                          ? 'bg-red-100 text-red-600' 
                          : isWarn 
                          ? 'bg-amber-100 text-amber-600' 
                          : 'bg-sky-100 text-sky-600'
                      }`}>
                        {isResolved ? (
                          <ShieldCheck className="w-5 h-5" />
                        ) : isCrit ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : isWarn ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : (
                          <Info className="w-5 h-5" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900">
                            {alert.title}
                          </h3>

                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isResolved
                              ? 'bg-slate-200 text-slate-700'
                              : isCrit 
                              ? 'bg-red-100 text-red-700' 
                              : isWarn 
                              ? 'bg-amber-100 text-amber-700' 
                              : 'bg-sky-100 text-sky-700'
                          }`}>
                            {isResolved ? 'RESOLVED' : alert.severity}
                          </span>

                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            {alert.field_name}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                          {alert.message}
                        </p>

                        {/* Multi-channel dispatch delivery breakdown */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-500">Channels:</span>
                          <span className="bg-sky-50 text-sky-700 font-bold px-2 py-0.5 rounded-md border border-sky-100">
                            Push: Delivered
                          </span>
                          <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-100">
                            SMS: Sent (Twilio)
                          </span>
                          <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-md border border-indigo-100">
                            Email: Sent (SendGrid)
                          </span>
                        </div>

                        {isResolved && alert.resolved_at && (
                          <div className="text-[11px] text-emerald-700 font-semibold pt-1 flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Resolved on {new Date(alert.resolved_at).toLocaleString()} by {alert.resolved_by || 'Farmer'}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                      <span className="text-[10px] text-slate-400">
                        {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                      </span>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => speakText(alert.message, language)}
                          className="p-1.5 text-slate-400 hover:text-agri-700 hover:bg-slate-100 rounded-xl transition-all"
                          title="Read Aloud"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>

                        {!isResolved && (
                          <button
                            onClick={() => handleResolve(alert.id)}
                            className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-xl text-xs font-bold shadow-xs transition-all"
                            title="Mark as Resolved"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Resolve</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Configurable Thresholds Modal */}
        {showConfigModal && selectedFieldForConfig && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-5 h-5 text-agri-700" />
                  <h3 className="text-base font-bold text-slate-900">
                    Configure Field Thresholds
                  </h3>
                </div>
                <button 
                  onClick={() => setShowConfigModal(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Select Field:
                </label>
                <select
                  value={selectedFieldForConfig.id}
                  onChange={(e) => {
                    const f = fields.find(field => field.id === Number(e.target.value));
                    if (f) {
                      setSelectedFieldForConfig(f);
                      setConfigMin(f.target_moisture_min);
                      setConfigMax(f.target_moisture_max);
                    }
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  {fields.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.crop_type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Min Moisture (%):
                  </label>
                  <input
                    type="number"
                    value={configMin}
                    onChange={(e) => setConfigMin(Number(e.target.value))}
                    min={10}
                    max={configMax - 2}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400">Triggers Low Moisture Alert</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Max Moisture (%):
                  </label>
                  <input
                    type="number"
                    value={configMax}
                    onChange={(e) => setConfigMax(Number(e.target.value))}
                    min={configMin + 2}
                    max={60}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400">Triggers Over-watering Alert</span>
                </div>
              </div>

              {configSuccess && (
                <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl text-xs font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{configSuccess}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveThresholds}
                  className="px-5 py-2 bg-agri-800 hover:bg-agri-900 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Save Thresholds
                </button>
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

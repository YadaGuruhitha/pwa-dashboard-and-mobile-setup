'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import VoiceAssistantModal from '../../components/VoiceAssistantModal';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../lib/api';
import { IrrigationScheduleItem, FieldItem } from '../../lib/types';
import { 
  Calendar, 
  Clock, 
  Droplet, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Plus, 
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';

export default function SchedulePage() {
  const { t } = useLanguage();
  const [schedules, setSchedules] = useState<IrrigationScheduleItem[]>([]);
  const [fields, setFields] = useState<FieldItem[]>([]);
  const [viewFilter, setViewFilter] = useState<'today' | 'weekly' | 'all'>('weekly');
  const [loading, setLoading] = useState(true);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Schedule Form State
  const [newFieldId, setNewFieldId] = useState<number>(1);
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newStartTime, setNewStartTime] = useState<string>('06:00 AM');
  const [newDuration, setNewDuration] = useState<number>(45);
  const [newVolume, setNewVolume] = useState<number>(12000);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [schData, fieldsData] = await Promise.all([
        api.getSchedules(viewFilter),
        api.getFields()
      ]);
      setSchedules(schData);
      setFields(fieldsData);
      if (fieldsData.length > 0) {
        setNewFieldId(fieldsData[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [viewFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusChange = async (id: number, status: 'COMPLETED' | 'SKIPPED') => {
    try {
      await api.updateScheduleStatus(id, status);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAutoOptimize = async () => {
    try {
      setIsAutoGenerating(true);
      await api.autoGenerateSchedules();
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAutoGenerating(false);
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endMins = newDuration <= 45 ? '06:45 AM' : '07:15 AM';
      await api.createSchedule({
        field_id: newFieldId,
        scheduled_date: newDate,
        start_time: newStartTime,
        end_time: endMins,
        duration_minutes: newDuration,
        water_volume_liters: newVolume,
        triggered_by: 'FARMER_MANUAL',
        reason: 'Manual schedule created by farmer'
      });
      setShowAddModal(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onOpenVoiceModal={() => setIsVoiceOpen(true)} />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Header Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center">
              <Calendar className="w-6 h-6 text-agri-700 mr-2" />
              {t('navSchedule')}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Time-slotted irrigation plans optimized to prevent evaporation and conserve power
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleAutoOptimize}
              disabled={isAutoGenerating}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-agri-700 hover:from-emerald-700 hover:to-agri-800 text-white px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{isAutoGenerating ? 'Optimizing...' : t('generateAutoSchedule')}</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-2xl text-xs font-bold border border-slate-200 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Plan</span>
            </button>
          </div>
        </div>

        {/* View Filters Tabs */}
        <div className="flex items-center space-x-2">
          {(['today', 'weekly', 'all'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setViewFilter(view)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
                viewFilter === view
                  ? 'bg-agri-800 text-white border-agri-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {view === 'today' ? t('todaysSchedules') : view === 'weekly' ? t('weeklySchedules') : 'All Schedules'}
            </button>
          ))}
        </div>

        {/* Schedules Grid */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 h-28 animate-pulse" />
            ))}
          </div>
        ) : schedules.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No scheduled irrigation for this view</h3>
            <p className="text-xs text-slate-500 mt-1">Click "Auto-Optimize Schedule" to evaluate soil moisture and generate new plans.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedules.map((item) => {
              const isCompleted = item.status === 'COMPLETED';
              const isSkipped = item.status === 'SKIPPED';
              const isPending = item.status === 'PENDING' || item.status === 'RUNNING';

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    isCompleted
                      ? 'bg-emerald-50/50 border-emerald-200 opacity-80'
                      : isSkipped
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200/80 hover:border-agri-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-agri-100 border border-agri-200 flex flex-col items-center justify-center text-agri-900 font-bold flex-shrink-0">
                        <Clock className="w-4 h-4 text-agri-700 mb-0.5" />
                        <span className="text-[10px] leading-tight">{item.start_time.split(' ')[0]}</span>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-base font-bold text-slate-900">
                            {item.field_name}
                          </h3>
                        </div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">
                          Date: <strong className="text-slate-700">{item.scheduled_date}</strong> • {item.start_time} - {item.end_time}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                      isCompleted ? 'bg-emerald-100 text-emerald-800' :
                      isSkipped ? 'bg-slate-200 text-slate-700' :
                      'bg-amber-100 text-amber-900'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Water & Duration Stats */}
                  <div className="grid grid-cols-2 gap-2 my-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-bold uppercase">Volume</span>
                      <span className="text-sm font-black text-sky-800 flex items-center mt-0.5">
                        <Droplet className="w-3.5 h-3.5 mr-1 text-sky-500" />
                        {item.water_volume_liters.toLocaleString()} Liters
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block font-bold uppercase">Duration</span>
                      <span className="text-sm font-black text-slate-800 flex items-center mt-0.5">
                        <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {item.duration_minutes} Mins
                      </span>
                    </div>
                  </div>

                  {item.reason && (
                    <p className="text-xs text-slate-600 mb-3 italic">
                      "{item.reason}"
                    </p>
                  )}

                  {/* Actions */}
                  {isPending && (
                    <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleStatusChange(item.id, 'COMPLETED')}
                        className="flex-1 flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold shadow-2xs transition-all active:scale-95"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{t('markCompleted')}</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange(item.id, 'SKIPPED')}
                        className="flex-1 flex items-center justify-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl text-xs font-bold transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t('skipRain')}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Add Manual Schedule */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <h3 className="text-lg font-black text-slate-900 mb-4">
                Schedule Irrigation Plan
              </h3>
              <form onSubmit={handleCreateSchedule} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Select Field</label>
                  <select
                    value={newFieldId}
                    onChange={(e) => setNewFieldId(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                  >
                    {fields.map(f => (
                      <option key={f.id} value={f.id}>{f.name} ({f.crop_type})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Start Time</label>
                    <input
                      type="text"
                      value={newStartTime}
                      onChange={(e) => setNewStartTime(e.target.value)}
                      placeholder="06:00 AM"
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Duration (Mins)</label>
                    <input
                      type="number"
                      value={newDuration}
                      onChange={(e) => setNewDuration(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Estimated Water Volume (Liters)</label>
                  <input
                    type="number"
                    value={newVolume}
                    onChange={(e) => setNewVolume(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-agri-800 hover:bg-agri-900 text-white py-2.5 rounded-xl font-bold text-xs shadow-md"
                  >
                    Save Schedule
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
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

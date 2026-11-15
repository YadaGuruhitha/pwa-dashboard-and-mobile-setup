'use client';

import React, { useState } from 'react';
import { IrrigationScheduleItem } from '../lib/types';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { 
  Clock, 
  Droplet, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface QuickScheduleCardProps {
  schedules: IrrigationScheduleItem[];
  onRefresh?: () => void;
}

export default function QuickScheduleCard({ schedules, onRefresh }: QuickScheduleCardProps) {
  const { t } = useLanguage();
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStatusUpdate = async (id: number, status: 'COMPLETED' | 'SKIPPED') => {
    try {
      setUpdatingId(id);
      await api.updateScheduleStatus(id, status);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAutoGenerate = async () => {
    try {
      setIsGenerating(true);
      await api.autoGenerateSchedules();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to generate schedules:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center">
            <Calendar className="w-5 h-5 text-agri-700 mr-2" />
            {t('todaysSchedules')}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Time-slotted energy-efficient irrigation plans
          </p>
        </div>

        <button
          onClick={handleAutoGenerate}
          disabled={isGenerating}
          className="flex items-center space-x-1.5 bg-agri-50 hover:bg-agri-100 text-agri-800 px-3 py-1.5 rounded-xl border border-agri-200 text-xs font-bold transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-agri-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{isGenerating ? 'Calculating...' : t('generateAutoSchedule')}</span>
        </button>
      </div>

      {schedules.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm">
          No pending irrigation tasks scheduled for today.
        </div>
      ) : (
        <div className="space-y-3">
          {schedules.map((item) => {
            const isCompleted = item.status === 'COMPLETED';
            const isSkipped = item.status === 'SKIPPED';
            const isPending = item.status === 'PENDING' || item.status === 'RUNNING';

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/60 border-emerald-200 opacity-80'
                    : isSkipped
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200 hover:border-agri-300 shadow-2xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Time & Field */}
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-agri-100/70 border border-agri-200 flex flex-col items-center justify-center text-agri-900 font-bold flex-shrink-0">
                      <Clock className="w-4 h-4 text-agri-700 mb-0.5" />
                      <span className="text-[10px] leading-none">{item.start_time.split(' ')[0]}</span>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-slate-800">
                          {item.field_name}
                        </h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          isCompleted ? 'bg-emerald-100 text-emerald-800' :
                          isSkipped ? 'bg-slate-200 text-slate-700' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center font-medium">
                          <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {item.duration_minutes} mins
                        </span>
                        <span>•</span>
                        <span className="flex items-center font-medium text-sky-700">
                          <Droplet className="w-3.5 h-3.5 mr-1 text-sky-500" />
                          {item.water_volume_liters.toLocaleString()} Liters
                        </span>
                      </div>

                      {item.reason && (
                        <p className="text-[11px] text-slate-500 mt-1 italic">
                          "{item.reason}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  {isPending && (
                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      <button
                        onClick={() => handleStatusUpdate(item.id, 'COMPLETED')}
                        disabled={updatingId === item.id}
                        className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs active:scale-95 transition-all"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{t('markCompleted')}</span>
                      </button>

                      <button
                        onClick={() => handleStatusUpdate(item.id, 'SKIPPED')}
                        disabled={updatingId === item.id}
                        className="flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t('skipRain')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

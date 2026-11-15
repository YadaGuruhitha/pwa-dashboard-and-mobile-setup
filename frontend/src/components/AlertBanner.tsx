'use client';

import React, { useState } from 'react';
import { AlertItem } from '../lib/types';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Radio, 
  X,
  Volume2
} from 'lucide-react';

interface AlertBannerProps {
  alerts: AlertItem[];
  onRefresh?: () => void;
}

export default function AlertBanner({ alerts, onRefresh }: AlertBannerProps) {
  const { t, speakText } = useLanguage();
  const [isSimulating, setIsSimulating] = useState(false);

  // Unread alerts only
  const activeAlerts = alerts.filter(a => !a.is_read).slice(0, 2);

  const handleSimulateTick = async () => {
    try {
      setIsSimulating(true);
      await api.simulateSensorTick();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Simulation tick failed:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleDismiss = async (id: number) => {
    try {
      await api.markAlertRead(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to dismiss alert:', err);
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Simulation Trigger Bar */}
      <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-2 text-xs text-emerald-900 font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>IoT Sensor Telemetry Network Online</span>
          <span className="hidden sm:inline text-emerald-600 font-normal">
            (4 active LoRaWAN & WiFi soil moisture nodes)
          </span>
        </div>

        <button
          onClick={handleSimulateTick}
          disabled={isSimulating}
          className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95"
        >
          <Radio className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
          <span>{isSimulating ? 'Sending Pulse...' : t('simulateTelemetry')}</span>
        </button>
      </div>

      {/* Active High-Priority Alerts */}
      {activeAlerts.map((alert) => {
        const isCritical = alert.severity === 'CRITICAL';
        const isWarning = alert.severity === 'WARNING';

        return (
          <div
            key={alert.id}
            className={`p-3.5 sm:p-4 rounded-2xl border flex items-start justify-between gap-3 shadow-2xs transition-all ${
              isCritical
                ? 'bg-red-50 border-red-300 text-red-900'
                : isWarning
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-sky-50 border-sky-300 text-sky-900'
            }`}
          >
            <div className="flex items-start space-x-3">
              {isCritical ? (
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5 animate-bounce" />
              ) : (
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-bold leading-tight">
                    {alert.title}
                  </h4>
                  <span className="text-[10px] font-mono uppercase bg-white/70 px-1.5 py-0.2 rounded border border-black/10">
                    {alert.sent_channels}
                  </span>
                </div>
                <p className="text-xs mt-1 leading-relaxed opacity-90">
                  {alert.message}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 flex-shrink-0">
              <button
                onClick={() => speakText(alert.message)}
                className="p-1.5 rounded-xl hover:bg-black/5 text-slate-700"
                title="Read aloud alert in your language"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDismiss(alert.id)}
                className="p-1.5 rounded-xl hover:bg-black/5 text-slate-500"
                title="Dismiss alert"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

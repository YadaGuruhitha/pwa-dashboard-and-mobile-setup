'use client';

import React from 'react';
import { MoistureStatus } from '../lib/types';
import { useLanguage } from '../context/LanguageContext';

interface MoistureGaugeProps {
  value: number; // e.g. 18.2%
  minTarget: number; // e.g. 24%
  maxTarget: number; // e.g. 34%
  status: MoistureStatus;
  size?: number;
}

export default function MoistureGauge({
  value,
  minTarget,
  maxTarget,
  status,
  size = 140
}: MoistureGaugeProps) {
  const { t } = useLanguage();

  const radius = size * 0.38;
  const strokeWidth = size * 0.1;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Gauge spans 240 degrees (from 150 deg to 390 deg)
  const angleRange = 240;
  const progressRatio = Math.min(1.0, Math.max(0.0, value / 60.0)); // 0 to 60% max range
  const dashLength = (circumference * angleRange) / 360;
  const strokeDashoffset = dashLength - dashLength * progressRatio;

  // Determine status color scheme
  let strokeColor = '#10b981'; // optimal green
  let statusBadgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  let statusLabelKey = 'optimalMoisture';

  if (status === 'CRITICAL_DRY') {
    strokeColor = '#ef4444'; // critical red
    statusBadgeClass = 'bg-red-100 text-red-800 border-red-300 animate-pulse';
    statusLabelKey = 'criticalDry';
  } else if (status === 'MODERATE') {
    strokeColor = '#f59e0b'; // amber yellow
    statusBadgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
    statusLabelKey = 'moderateMoisture';
  } else if (status === 'OVER_WATERED') {
    strokeColor = '#3b82f6'; // saturated blue
    statusBadgeClass = 'bg-blue-100 text-blue-800 border-blue-300';
    statusLabelKey = 'overWatered';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size * 0.85 }}>
        <svg width={size} height={size} className="transform rotate-[150deg] overflow-visible">
          {/* Background arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Value Progress arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Text Indicator */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            {value.toFixed(1)}
            <span className="text-sm font-semibold text-slate-500 ml-0.5">%</span>
          </div>
          <span className="text-[10px] text-slate-500 uppercase font-semibold">
            {t('moistureLevel')}
          </span>
        </div>
      </div>

      {/* Target Range & Status Badge */}
      <div className="flex flex-col items-center mt-1 text-center">
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${statusBadgeClass}`}>
          {t(statusLabelKey)}
        </span>
        <span className="text-[11px] text-slate-500 font-medium mt-1">
          {t('targetRange')}: <strong className="text-slate-700">{minTarget}% - {maxTarget}%</strong>
        </span>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import {
  AlertTriangle, ChevronRight, CloudRain, Clock, Droplet, Layers, Mic, RefreshCw, Sparkles, Sprout, Sun, Thermometer, TrendingUp, WifiOff,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { useFarmer, personalGreeting } from '../lib/session';
import { AlertItem, AnalyticsSummary, FieldItem, IrrigationScheduleItem, MoistureStatus, WeatherData } from '../lib/types';

interface Props {
  fields: FieldItem[];
  weather: WeatherData | null;
  schedules: IrrigationScheduleItem[];
  alerts: AlertItem[];
  analytics: AnalyticsSummary | null;
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onOpenVoice: () => void;
  onExplain: (fieldId: number) => void;
}

const STATUS: Record<MoistureStatus, { label: string; bar: string; chip: string; ring: string }> = {
  CRITICAL_DRY: { label: 'Needs water', bar: 'bg-red-500', chip: 'bg-red-100 text-red-800', ring: 'ring-red-300' },
  MODERATE: { label: 'Getting dry', bar: 'bg-amber-500', chip: 'bg-amber-100 text-amber-800', ring: 'ring-amber-300' },
  OPTIMAL: { label: 'Healthy', bar: 'bg-emerald-500', chip: 'bg-emerald-100 text-emerald-800', ring: 'ring-emerald-200' },
  OVER_WATERED: { label: 'Too wet', bar: 'bg-sky-500', chip: 'bg-sky-100 text-sky-800', ring: 'ring-sky-300' },
};

const shortName = (n: string) => n.replace(/\s*\(.*$/, '');

/** Pull-to-refresh: only arms when the page is scrolled to the very top. */
function usePullToRefresh(onRefresh: () => void) {
  const [pull, setPull] = useState(0);
  const startY = useRef<number | null>(null);
  useEffect(() => {
    const THRESH = 70;
    const start = (e: TouchEvent) => { startY.current = window.scrollY <= 0 ? e.touches[0].clientY : null; };
    const move = (e: TouchEvent) => {
      if (startY.current == null) return;
      const d = e.touches[0].clientY - startY.current;
      setPull(d > 0 ? Math.min(d * 0.5, 90) : 0);
    };
    const end = () => {
      setPull((p) => { if (p >= THRESH * 0.5) onRefresh(); return 0; });
      startY.current = null;
    };
    window.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('touchend', end);
    return () => {
      window.removeEventListener('touchstart', start);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end);
    };
  }, [onRefresh]);
  return pull;
}

function PumpControl({ field, onDone }: { field: FieldItem; onDone: () => void }) {
  const [status, setStatus] = useState(field.pump_status);
  const [busy, setBusy] = useState(false);
  const [confirmOn, setConfirmOn] = useState(false);
  useEffect(() => setStatus(field.pump_status), [field.pump_status]);

  const set = async (s: 'ON' | 'OFF' | 'AUTO') => {
    setConfirmOn(false);
    setBusy(true);
    try {
      const r = await api.togglePump(field.id, s);
      setStatus(r.pump_status as any);
      onDone();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div role="group" aria-label={`Pump control for ${shortName(field.name)}`} className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl">
        {(['OFF', 'AUTO', 'ON'] as const).map((s) => {
          const active = status === s;
          const color = s === 'ON' ? 'bg-emerald-600 text-white' : s === 'AUTO' ? 'bg-agri-800 text-white' : 'bg-slate-700 text-white';
          return (
            <button
              key={s}
              disabled={busy}
              aria-pressed={active}
              onClick={() => (s === 'ON' && status !== 'ON' ? setConfirmOn(true) : set(s))}
              className={`min-h-[44px] rounded-xl text-sm font-bold transition active:scale-95 disabled:opacity-50 ${active ? color + ' shadow' : 'text-slate-600'}`}
            >
              {s === 'AUTO' ? 'AI Auto' : s}
            </button>
          );
        })}
      </div>
      {confirmOn && (
        <div className="mt-2 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl p-2.5 animate-fadeIn">
          <p className="flex-1 text-xs font-semibold text-amber-900">Start the pump now?</p>
          <button onClick={() => setConfirmOn(false)} className="min-h-[40px] px-3 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200">Cancel</button>
          <button onClick={() => set('ON')} className="min-h-[40px] px-3 rounded-xl text-xs font-bold text-white bg-emerald-600">Start pump</button>
        </div>
      )}
    </div>
  );
}

export default function MobileDashboard({ fields, weather, schedules, alerts, analytics, loading, refreshing, onRefresh, onOpenVoice, onExplain }: Props) {
  const { t } = useLanguage();
  const { farmer } = useFarmer();
  const pull = usePullToRefresh(onRefresh);
  const [offline, setOffline] = useState(false);
  const [openField, setOpenField] = useState<number | null>(null);

  useEffect(() => {
    const up = () => setOffline(false), down = () => setOffline(true);
    setOffline(!navigator.onLine);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', down); };
  }, []);

  const urgent = [...fields].sort((a, b) => a.latest_moisture - b.latest_moisture)[0];
  const needsWater = urgent && (urgent.moisture_status === 'CRITICAL_DRY' || urgent.moisture_status === 'MODERATE');
  const activeAlerts = alerts.filter((a) => !a.is_resolved && (a.severity === 'CRITICAL' || a.severity === 'WARNING'));
  const unread = alerts.filter((a) => !a.is_read).length;
  const avg = fields.length ? fields.reduce((s, f) => s + f.latest_moisture, 0) / fields.length : null;
  const usedToday = schedules.filter((s) => s.status === 'COMPLETED' || s.status === 'RUNNING').reduce((a, s) => a + s.water_volume_liters, 0);
  const next = schedules.find((s) => s.status === 'PENDING');
  const trend = (analytics?.daily_trends || []).map((d) => ({ date: d.date, used: d.water_used, saved: d.water_saved }));
  const savedTotal = trend.reduce((a, d) => a + d.saved, 0);

  const tiles = [
    { icon: <Layers className="w-4 h-4 text-emerald-600" />, label: 'Fields', value: String(fields.length), sub: `${new Set(fields.map((f) => f.crop_type)).size} crops` },
    { icon: <Droplet className="w-4 h-4 text-sky-500" />, label: 'Avg moisture', value: avg == null ? '–' : `${avg.toFixed(1)}%`, sub: urgent ? `Lowest ${urgent.latest_moisture}%` : '' },
    { icon: <TrendingUp className="w-4 h-4 text-sky-600" />, label: 'Water today', value: `${usedToday.toLocaleString()} L`, sub: 'applied so far' },
    { icon: <Clock className="w-4 h-4 text-amber-500" />, label: 'Next run', value: next ? next.start_time : 'None', sub: next ? `${next.duration_minutes} min` : 'nothing pending' },
  ];

  return (
    <div className="lg:hidden">
      {/* pull-to-refresh indicator */}
      <div className="flex justify-center overflow-hidden transition-[height] duration-150" style={{ height: pull }} aria-hidden>
        <RefreshCw className={`w-5 h-5 mt-2 text-agri-700 ${pull > 40 ? 'rotate-180' : ''} transition-transform`} />
      </div>

      <main className="px-4 pt-4 pb-32 space-y-5">
        {/* Greeting */}
        <section className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-black text-slate-900 leading-tight truncate">{personalGreeting(t('welcomeFarmer'), farmer.name)}</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1.5">
              {offline ? (
                <span className="inline-flex items-center gap-1 text-amber-700 font-bold"><WifiOff className="w-3.5 h-3.5" /> Offline · saved data</span>
              ) : (
                <><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Updated {fields[0]?.last_sensor_update_relative || 'just now'}</>
              )}
            </p>
          </div>
          <button
            onClick={onRefresh}
            aria-label="Refresh"
            className="min-w-[44px] min-h-[44px] rounded-2xl bg-white border border-slate-200 flex items-center justify-center active:scale-95"
          >
            <RefreshCw className={`w-5 h-5 text-slate-700 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </section>

        {/* Priority card */}
        {loading ? (
          <div className="h-44 rounded-3xl bg-white border border-slate-200 animate-pulse" />
        ) : urgent ? (
          <section className={`rounded-3xl p-5 text-white shadow-lg ${needsWater ? 'bg-gradient-to-br from-red-600 to-orange-600' : 'bg-gradient-to-br from-agri-800 to-agri-900'}`}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/80">
              {needsWater ? <AlertTriangle className="w-4 h-4" /> : <Sprout className="w-4 h-4" />}
              {needsWater ? 'Needs attention' : 'All fields healthy'}
            </div>
            <div className="mt-2 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-lg font-black leading-tight truncate">{shortName(urgent.name)}</p>
                <p className="text-sm text-white/85 mt-0.5">
                  {needsWater
                    ? `Soil moisture ${urgent.latest_moisture}% (target ${urgent.target_moisture_min}–${urgent.target_moisture_max}%)`
                    : `Lowest field at ${urgent.latest_moisture}%`}
                </p>
              </div>
              <div className="text-4xl font-black tabular-nums leading-none">{urgent.latest_moisture}<span className="text-lg">%</span></div>
            </div>
            <button
              onClick={() => onExplain(urgent.id)}
              className="mt-4 w-full min-h-[48px] rounded-2xl bg-white text-slate-900 font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition"
            >
              <Sparkles className="w-4 h-4 text-agri-700" /> See AI recommendation
            </button>
          </section>
        ) : null}

        {/* Active alerts */}
        {activeAlerts.length > 0 && (
          <Link href="/alerts" className="flex items-center gap-3 bg-white border border-amber-200 rounded-2xl p-3.5 active:bg-amber-50">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0"><AlertTriangle className="w-5 h-5" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{activeAlerts[0].title}</p>
              <p className="text-xs text-slate-500">{activeAlerts.length} active alert{activeAlerts.length > 1 ? 's' : ''}{unread ? ` · ${unread} unread` : ''}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </Link>
        )}

        {/* KPI tiles — swipeable */}
        <section aria-label="Farm summary" className="-mx-4 px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tiles.map((k) => (
            <div key={k.label} className="snap-start flex-shrink-0 w-[42%] min-w-[150px] bg-white rounded-2xl border border-slate-200 p-3.5">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase text-slate-500">{k.label}{k.icon}</div>
              <div className="mt-1 text-2xl font-black text-slate-900 tabular-nums truncate">{k.value}</div>
              <div className="text-xs text-slate-500 truncate">{k.sub}</div>
            </div>
          ))}
        </section>

        {/* Weather strip */}
        {weather && (
          <Link href="/weather" className="flex items-center gap-4 bg-gradient-to-r from-sky-50 to-amber-50 border border-sky-100 rounded-2xl p-4 active:opacity-80">
            <Sun className="w-9 h-9 text-amber-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-black text-slate-900 tabular-nums">{Math.round(weather.current.temperature_c)}°C
                </p>
              <p className="text-sm font-semibold text-slate-700 truncate capitalize">{weather.current.description}</p>
              <p className="text-xs text-slate-600 flex flex-wrap gap-x-3">
                <span className="inline-flex items-center gap-1"><CloudRain className="w-3.5 h-3.5 text-sky-600" />{weather.current.rainfall_forecast_24h_mm} mm / 24h</span>
                <span className="inline-flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-red-500" />{weather.current.humidity_pct}% humidity</span>
              </p>
              {weather.is_simulated && <p className="text-[11px] text-slate-500 mt-0.5">Simulated forecast</p>}
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </Link>
        )}

        {/* Fields */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-black text-slate-900">My fields</h2>
            <Link href="/fields" className="text-xs font-bold text-agri-700 min-h-[44px] flex items-center">View all</Link>
          </div>
          <ul className="space-y-3">
            {loading
              ? [1, 2, 3].map((i) => <li key={i} className="h-24 rounded-2xl bg-white border border-slate-200 animate-pulse" />)
              : fields.map((f) => {
                  const st = STATUS[f.moisture_status] || STATUS.OPTIMAL;
                  const pct = Math.max(0, Math.min(100, (f.latest_moisture / Math.max(f.target_moisture_max * 1.3, 1)) * 100));
                  const lo = (f.target_moisture_min / (f.target_moisture_max * 1.3)) * 100;
                  const hi = (f.target_moisture_max / (f.target_moisture_max * 1.3)) * 100;
                  const open = openField === f.id;
                  return (
                    <li key={f.id} className={`bg-white rounded-2xl border border-slate-200 p-4 ${f.moisture_status === 'CRITICAL_DRY' ? 'ring-2 ' + st.ring : ''}`}>
                      <button className="w-full text-left" aria-expanded={open} onClick={() => setOpenField(open ? null : f.id)}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate">{shortName(f.name)}</p>
                            <p className="text-xs text-slate-500">{f.crop_type} · {f.growth_stage} · {f.area_acres} ac</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xl font-black tabular-nums text-slate-900">{f.latest_moisture}%</p>
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${st.chip}`}>{st.label}</span>
                          </div>
                        </div>
                        {/* moisture bar with target band */}
                        <div className="relative mt-3 h-2.5 rounded-full bg-slate-100" aria-hidden>
                          <div className="absolute top-0 h-full bg-emerald-200/70 rounded-full" style={{ left: `${lo}%`, width: `${hi - lo}%` }} />
                          <div className={`absolute top-0 left-0 h-full rounded-full ${st.bar}`} style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">Target {f.target_moisture_min}–{f.target_moisture_max}% · Pump {f.pump_status}</p>
                      </button>
                      {open && (
                        <div className="mt-3 pt-3 border-t border-slate-100 space-y-3 animate-fadeIn">
                          <PumpControl field={f} onDone={onRefresh} />
                          <button onClick={() => onExplain(f.id)} className="w-full min-h-[44px] rounded-2xl bg-agri-50 border border-agri-200 text-agri-800 text-sm font-bold flex items-center justify-center gap-2">
                            <Sparkles className="w-4 h-4" /> Why this advice?
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
          </ul>
        </section>

        {/* Today's schedule */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-black text-slate-900">{t('todaysSchedules')}</h2>
            <Link href="/schedule" className="text-xs font-bold text-agri-700 min-h-[44px] flex items-center">Open</Link>
          </div>
          {schedules.length === 0 ? (
            <p className="text-sm text-slate-500 bg-white border border-slate-200 rounded-2xl p-4">No irrigation planned for today.</p>
          ) : (
            <ol className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
              {schedules.slice(0, 5).map((s) => (
                <li key={s.id} className="flex items-center gap-3 p-3.5">
                  <div className="w-[4.5rem] flex-shrink-0 text-sm font-black text-slate-900 tabular-nums whitespace-nowrap">{s.start_time}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{shortName(s.field_name || `Field ${s.field_id}`)}</p>
                    <p className="text-xs text-slate-500">{s.duration_minutes} min · {s.water_volume_liters.toLocaleString()} L</p>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    s.status === 'RUNNING' ? 'bg-sky-100 text-sky-800' : s.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : s.status === 'SKIPPED' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-800'
                  }`}>{s.status.toLowerCase()}</span>
                </li>
              ))}
            </ol>
          )}
        </section>

        {/* Water saved */}
        {trend.length > 0 && (
          <section className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-xs font-bold uppercase text-slate-500">Water conserved · last {trend.length} readings</p>
            <p className="text-2xl font-black text-slate-900 tabular-nums">{savedTotal.toLocaleString()} <span className="text-sm text-slate-500">litres vs flood irrigation</span></p>
            <div className="h-24 mt-2" aria-hidden>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="date" hide />
                  <Tooltip formatter={(v: any) => [`${Number(v).toLocaleString()} L`, 'Saved']} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Area type="monotone" dataKey="saved" stroke="#0284c7" fill="#bae6fd" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}
      </main>

      {/* Voice FAB, sits above bottom tab bar */}
      <button
        onClick={onOpenVoice}
        aria-label="Ask Krishi Mitra"
        className="fixed right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-agri-700 text-white shadow-xl flex items-center justify-center active:scale-95"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 84px)' }}
      >
        <Mic className="w-6 h-6" />
      </button>
    </div>
  );
}

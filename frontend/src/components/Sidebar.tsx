'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useFarmer, logout } from '../lib/session';
import { 
  LayoutDashboard, 
  Layers, 
  Sliders, 
  Calendar, 
  CloudSun, 
  BarChart3, 
  Mic, 
  Bell, 
  FileText, 
  Settings, 
  Info, 
  Home, 
  Sprout, 
  Droplet,
  LogOut,
  UserCheck,
  ShieldCheck,
  Cpu,
  Activity,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  unreadAlertsCount?: number;
  onOpenVoiceModal?: () => void;
}

export default function Sidebar({ unreadAlertsCount = 0, onOpenVoiceModal }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { farmer, signedIn, initials } = useFarmer();

  const navigationSections = [
    {
      title: "Core Operations",
      items: [
        { href: '/', labelKey: 'navDashboard', icon: LayoutDashboard },
        { href: '/fields', labelKey: 'navFields', icon: Layers },
        { href: '/config', labelKey: 'navConfig', icon: Sliders },
        { href: '/schedule', labelKey: 'navSchedule', icon: Calendar },
        { href: '/weather', labelKey: 'navWeather', icon: CloudSun },
      ]
    },
    {
      title: "Intelligence & Reports",
      items: [
        { href: '/analytics', labelKey: 'navAnalytics', icon: BarChart3 },
        { href: '/voice', labelKey: 'navVoice', icon: Mic, badgeText: 'Sarvam AI' },
        { href: '/alerts', labelKey: 'navAlerts', icon: Bell, badgeCount: unreadAlertsCount },
        { href: '/reports', labelKey: 'navReports', icon: FileText },
      ]
    },
    {
      title: "System & Info",
      items: [
        { href: '/settings', labelKey: 'navSettings', icon: Settings },
        { href: '/about', labelKey: 'navAbout', icon: Info },
        { href: '/landing', labelKey: 'navLanding', icon: Home },
      ]
    },
    {
      title: "Backend & MLOps",
      items: [
        { href: 'http://127.0.0.1:8000/docs', labelKey: 'FastAPI Swagger', icon: Cpu, isExternal: true },
        { href: 'http://127.0.0.1:5000', labelKey: 'MLflow Dashboard', icon: Activity, isExternal: true },
      ]
    }
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-agri-950 text-white border-r border-agri-800/80 fixed inset-y-0 left-0 z-30 shadow-xl select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-agri-800/80 bg-agri-900/40">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-agri-700 flex items-center justify-center shadow-md border border-emerald-400/30 group-hover:scale-105 transition-transform">
            <div className="relative">
              <Sprout className="w-5 h-5 text-white" />
              <Droplet className="w-3 h-3 text-sky-300 absolute -bottom-1 -right-1" fill="#38bdf8" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-black tracking-tight text-white">
                {t('appName')}
              </span>
              <span className="text-[9px] uppercase font-bold bg-emerald-700/80 text-emerald-100 px-1.5 py-0.2 rounded-full border border-emerald-400/40">
                AI
              </span>
            </div>
            <p className="text-[11px] text-agri-200/80 font-medium">
              Smart Predictive Irrigation
            </p>
          </div>
        </Link>
      </div>

      {/* Farmer Profile Badge */}
      <div className="px-4 py-3 mx-3 my-3 bg-agri-900/60 rounded-2xl border border-agri-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-agri-700 flex items-center justify-center text-white font-bold text-xs border border-agri-500">
            {initials}
          </div>
          <div className="truncate">
            <span className="text-xs font-bold text-white block truncate leading-tight">
              {farmer.name}
            </span>
            <span className="text-[10px] text-agri-300 block truncate">
              {farmer.district}, {farmer.state}
            </span>
          </div>
        </div>
        {signedIn ? (
          <button
            onClick={() => { logout(); window.location.href = '/login'; }}
            className="p-1.5 rounded-lg text-agri-300 hover:text-white hover:bg-agri-800"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        ) : (
          <Link href="/login" className="text-[10px] font-bold text-emerald-300 hover:text-white">Sign in</Link>
        )}
      </div>

      {/* Navigation Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 space-y-5 scrollbar-thin scrollbar-thumb-agri-800">
        {navigationSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-agri-400 px-3">
              {section.title}
            </span>
            {section.items.map((item: any) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              if (item.isExternal) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-agri-200/90 hover:bg-agri-900/80 hover:text-white transition-all group"
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
                      <span className="truncate">{item.labelKey}</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-agri-400 group-hover:text-white" />
                  </a>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-agri-800 text-white shadow-inner font-bold border border-agri-600/60'
                      : 'text-agri-200/90 hover:bg-agri-900/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-300' : 'text-agri-400 group-hover:text-emerald-300'}`} />
                    <span className="truncate">{t(item.labelKey)}</span>
                  </div>

                  {item.badgeCount && item.badgeCount > 0 ? (
                    <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                      {item.badgeCount}
                    </span>
                  ) : item.badgeText ? (
                    <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.2 rounded-md border border-emerald-400/30">
                      {item.badgeText}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}

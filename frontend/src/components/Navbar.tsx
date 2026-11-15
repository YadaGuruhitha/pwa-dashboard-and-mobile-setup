'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useFarmer, logout } from '../lib/session';
import { 
  Sprout, 
  Droplet, 
  Mic, 
  Calendar, 
  BarChart3, 
  Bell, 
  LayoutDashboard,
  Layers,
  Volume2,
  Menu,
  X,
  Sliders,
  CloudSun,
  FileText,
  Settings,
  Info,
  Home
} from 'lucide-react';

interface NavbarProps {
  onOpenVoiceModal?: () => void;
  unreadAlertsCount?: number;
}

export default function Navbar({ onOpenVoiceModal, unreadAlertsCount = 0 }: NavbarProps) {
  const pathname = usePathname();
  const { t, isSpeaking, stopSpeaking } = useLanguage();
  const { farmer, signedIn } = useFarmer();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mobile Bottom Bar Primary Tabs
  const bottomNavItems = [
    { href: '/', labelKey: 'navDashboard', icon: LayoutDashboard },
    { href: '/fields', labelKey: 'navFields', icon: Layers },
    { href: '/schedule', labelKey: 'navSchedule', icon: Calendar },
    { href: '/weather', labelKey: 'navWeather', icon: CloudSun },
    { href: '/voice', labelKey: 'navVoice', icon: Mic },
  ];

  // Full Mobile Drawer Items
  const allNavItems = [
    { href: '/', labelKey: 'navDashboard', icon: LayoutDashboard },
    { href: '/fields', labelKey: 'navFields', icon: Layers },
    { href: '/config', labelKey: 'navConfig', icon: Sliders },
    { href: '/schedule', labelKey: 'navSchedule', icon: Calendar },
    { href: '/weather', labelKey: 'navWeather', icon: CloudSun },
    { href: '/analytics', labelKey: 'navAnalytics', icon: BarChart3 },
    { href: '/voice', labelKey: 'navVoice', icon: Mic },
    { href: '/alerts', labelKey: 'navAlerts', icon: Bell, badge: unreadAlertsCount },
    { href: '/reports', labelKey: 'navReports', icon: FileText },
    { href: '/settings', labelKey: 'navSettings', icon: Settings },
    { href: '/about', labelKey: 'navAbout', icon: Info },
    { href: '/landing', labelKey: 'navLanding', icon: Home },
  ];

  return (
    <>
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-agri-900 border-b border-agri-800 text-white shadow-md pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20">
            {/* Left: Mobile Menu Toggle & Brand */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-agri-200 hover:text-white hover:bg-agri-800 transition-colors"
                aria-label="Toggle Navigation Drawer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link href="/" className="flex items-center space-x-2.5 group">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-agri-600 to-agri-800 flex items-center justify-center shadow-lg border border-agri-400/30 group-hover:scale-105 transition-transform">
                  <div className="relative">
                    <Sprout className="w-6 h-6 text-agri-100" />
                    <Droplet className="w-3.5 h-3.5 text-sky-300 absolute -bottom-1 -right-1" fill="#38bdf8" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-lg sm:text-2xl font-black tracking-tight text-white whitespace-nowrap">
                      {t('appName')}
                    </span>
                    <span className="hidden sm:inline text-[10px] uppercase font-bold bg-agri-700/80 text-agri-100 px-1.5 py-0.5 rounded-full border border-agri-400/40">
                      PWA
                    </span>
                  </div>
                  <span className="text-xs text-agri-200/90 hidden sm:inline font-medium">
                    {farmer.district}, {farmer.state}
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Top Shortcuts */}
            <div className="hidden lg:flex items-center space-x-3 text-xs text-agri-200">
              <span className="flex items-center space-x-1.5 bg-agri-950/50 px-3 py-1.5 rounded-full border border-agri-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-white">{farmer.name} Farm</span>
                <span>• {farmer.district}</span>
              </span>

              <Link
                href="/weather"
                className="hover:text-white flex items-center space-x-1 transition-colors"
              >
                <CloudSun className="w-4 h-4 text-amber-300" />
                <span>31°C Sunny</span>
              </Link>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Speaker Stop Button if Voice is reading */}
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="animate-pulse bg-amber-500 text-white px-2.5 py-1.5 rounded-xl flex items-center space-x-1 text-xs font-bold shadow-md"
                  title="Stop audio playback"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Mute Voice</span>
                </button>
              )}

              {/* Krishi Mitra Voice Quick Launch */}
              <button
                onClick={onOpenVoiceModal}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-agri-600 hover:from-emerald-400 hover:to-agri-500 text-white px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 border border-emerald-300/40"
              >
                <Mic className="w-4 h-4 text-white animate-bounce" />
                <span className="hidden sm:inline">Krishi Mitra</span>
              </button>

              {/* Alerts Bell */}
              <Link
                href="/alerts"
                className="relative p-2 rounded-xl bg-agri-800/80 hover:bg-agri-700 text-agri-100 hover:text-white transition-colors border border-agri-700"
                title="View Alerts"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {unreadAlertsCount}
                  </span>
                )}
              </Link>

              {/* Language Switcher (desktop top bar; mobile uses the menu drawer) */}
              <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (When Hamburger is clicked) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-agri-950 text-white h-full p-5 flex flex-col justify-between shadow-2xl animate-fadeIn">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-agri-800">
                <div className="flex items-center space-x-2">
                  <Sprout className="w-6 h-6 text-emerald-400" />
                  <span className="text-lg font-black">{t('appName')}</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl text-agri-300 hover:text-white bg-agri-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-1 overflow-y-auto max-h-[70vh]">
                {allNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-agri-800 text-white border border-agri-600'
                          : 'text-agri-200/90 hover:bg-agri-900 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-agri-400'}`} />
                        <span>{t(item.labelKey)}</span>
                      </div>
                      {item.badge && item.badge > 0 ? (
                        <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-agri-800">
              <LanguageSwitcher />
              {signedIn ? (
                <button
                  onClick={() => { logout(); window.location.href = '/login'; }}
                  className="mt-3 w-full min-h-[44px] rounded-2xl bg-agri-900 text-agri-100 text-sm font-bold"
                >
                  Sign out ({farmer.name})
                </button>
              ) : (
                <Link href="/login" className="mt-3 flex min-h-[44px] items-center justify-center rounded-2xl bg-agri-900 text-agri-100 text-sm font-bold">Sign in</Link>
              )}
            </div>

          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Large tap-friendly buttons) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-agri-950/95 backdrop-blur-md border-t border-agri-800 px-2 pt-1.5 shadow-2xl safe-bottom" aria-label="Primary">
        <div className="grid grid-cols-5 gap-1">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center min-h-[52px] py-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-emerald-300 bg-agri-800/80 font-bold shadow-xs'
                    : 'text-agri-300/70 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] tracking-tight truncate max-w-[62px] text-center">
                  {t(item.labelKey)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

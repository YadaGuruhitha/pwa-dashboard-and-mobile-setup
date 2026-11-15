'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare } from 'lucide-react';

const DISMISS_KEY = 'krishi-install-dismissed-at';
const DISMISS_DAYS = 14;

function recentlyDismissed(): boolean {
  try {
    const t = Number(localStorage.getItem(DISMISS_KEY) || 0);
    return !!t && Date.now() - t < DISMISS_DAYS * 86400000;
  } catch {
    return false;
  }
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [mode, setMode] = useState<'none' | 'android' | 'ios'>('none');

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
    if (standalone || recentlyDismissed()) return;

    const ua = navigator.userAgent;
    const isIos = /iphone|ipad|ipod/i.test(ua) || (ua.includes('Mac') && navigator.maxTouchPoints > 1);
    if (isIos) {
      const t = setTimeout(() => setMode('ios'), 4000);
      return () => clearTimeout(t);
    }

    const onPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setMode('android');
    };
    const onInstalled = () => setMode('none');
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {}
    setMode('none');
  };

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setMode('none');
  };

  if (mode === 'none') return null;

  return (
    <div
      role="dialog"
      aria-label="Install Krishi Jal"
      className="fixed left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-[60] bg-agri-900 text-white p-4 rounded-3xl shadow-2xl border border-agri-700 animate-slideUp"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 84px)' }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <Download className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold leading-tight">Install Krishi Jal</h4>
          {mode === 'android' ? (
            <p className="text-xs text-agri-200 mt-0.5">Add to your home screen. Opens fast and keeps working with weak network.</p>
          ) : (
            <p className="text-xs text-agri-200 mt-0.5 leading-relaxed">
              Tap <Share className="inline w-3.5 h-3.5 -mt-0.5" aria-label="Share" /> then{' '}
              <span className="font-semibold">Add to Home Screen</span> <PlusSquare className="inline w-3.5 h-3.5 -mt-0.5" />.
            </p>
          )}
        </div>
        <button onClick={dismiss} aria-label="Dismiss" className="p-2 -m-1 text-agri-300 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
      {mode === 'android' && (
        <button
          onClick={install}
          className="mt-3 w-full min-h-[44px] bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-sm font-bold active:scale-[0.98] transition"
        >
          Install app
        </button>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { loginLocal } from '../../lib/session';
import { 
  Sprout, 
  Droplet, 
  Phone, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Smartphone
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      setError('Please provide phone number and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Check accounts saved on this device (registered here, or the demo account)
      const farmer = await loginLocal(phone, password);
      if (!farmer) {
        setError('Phone number or password is incorrect. Register first, or use the demo login.');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 700);
    } catch (err: any) {
      setError('Invalid login credentials. Please try demo credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setPhone('9876543210');
    setPassword('krishi123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-agri-950 via-agri-900 to-slate-900 flex flex-col justify-between p-4 sm:p-6 text-white selection:bg-emerald-200">
      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between py-2">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-agri-700 flex items-center justify-center shadow-md">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-white">{t('appName')}</span>
        </Link>
        <LanguageSwitcher />
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full mx-auto bg-white text-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 animate-fadeIn my-auto">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 mx-auto mb-3 shadow-inner">
            <Smartphone className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {t('loginTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Access field telemetry, soil moisture alerts, and smart motor controls
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2 animate-fadeIn font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2 animate-fadeIn font-bold">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>Login successful! Opening dashboard...</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('phonePlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:border-agri-600 focus:ring-2 focus:ring-agri-100 outline-none text-xs sm:text-sm font-semibold transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('passwordPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:border-agri-600 focus:ring-2 focus:ring-agri-100 outline-none text-xs sm:text-sm font-semibold transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-agri-800 hover:from-emerald-700 hover:to-agri-900 text-white py-3 rounded-2xl font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : t('signIn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Tap Demo Login Button */}
        <div className="mt-5 pt-5 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{t('quickDemoLogin')}</span>
          </button>
          <span className="text-[10px] text-slate-400 block mt-1">
            (Ramesh Gowda • 9876543210 • krishi123)
          </span>
        </div>

        {/* Navigation to Register */}
        <div className="mt-4 text-center">
          <Link
            href="/register"
            className="text-xs font-bold text-agri-700 hover:text-agri-900 transition-colors"
          >
            {t('dontHaveAccount')}
          </Link>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-agri-300/80 py-2">
        Krishi Jal • Secure Smallholder Precision Agriculture Portal
      </div>
    </div>
  );
}

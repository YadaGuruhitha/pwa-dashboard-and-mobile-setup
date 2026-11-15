'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { registerLocal } from '../../lib/session';
import { 
  Sprout, 
  User, 
  Phone, 
  MapPin, 
  Layers, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { t, setLanguage } = useLanguage();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('Rampur');
  const [district, setDistrict] = useState('Mandya');
  const [state, setState] = useState('Karnataka');
  const [farmAcres, setFarmAcres] = useState('5.0');
  const [prefLang, setPrefLang] = useState<'kn' | 'hi' | 'te' | 'en'>('kn');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !password) {
      setError('Please fill in your name, phone number, and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setLanguage(prefLang);

      // Attempt registration API or fallback
      try {
        await fetch('http://127.0.0.1:8000/api/auth/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            phone,
            village,
            district,
            state,
            preferred_language: prefLang,
            password
          })
        });
      } catch (e) {
        console.warn('Backend registration fallback used');
      }

      // Remember this farmer on this device so the whole app shows their name
      await registerLocal(
        {
          name: name.trim(),
          phone,
          village: village.trim(),
          district: district.trim(),
          state: state.trim(),
          acres: Number(farmAcres) || undefined,
          language: prefLang,
        },
        password
      );

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 800);
    } catch (err: any) {
      setError('Could not register account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-agri-950 via-agri-900 to-slate-900 flex flex-col justify-between p-4 sm:p-6 text-white selection:bg-emerald-200">
      <div className="max-w-lg w-full mx-auto flex items-center justify-between py-2">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-agri-700 flex items-center justify-center shadow-md">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-white">{t('appName')}</span>
        </Link>
        <LanguageSwitcher />
      </div>

      <div className="max-w-lg w-full mx-auto bg-white text-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 animate-fadeIn my-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {t('registerTitle')}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Join thousands of smallholder farmers saving water and optimizing crop yields
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2 font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2 font-bold">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>Registration complete! Setting up your smart irrigation dashboard...</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Farmer Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Gowda"
                className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-300 focus:border-agri-600 focus:ring-2 focus:ring-agri-100 outline-none text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full pl-10 pr-3 py-2 rounded-2xl border border-slate-300 focus:border-agri-600 focus:ring-2 focus:ring-agri-100 outline-none text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Farm Area (Acres)
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="number"
                  step="0.5"
                  value={farmAcres}
                  onChange={(e) => setFarmAcres(e.target.value)}
                  placeholder="e.g. 5.0"
                  className="w-full pl-10 pr-3 py-2 rounded-2xl border border-slate-300 focus:border-agri-600 focus:ring-2 focus:ring-agri-100 outline-none text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Village</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl border border-slate-300 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl border border-slate-300 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl border border-slate-300 text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Preferred Voice & Dashboard Language
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
                { code: 'hi', label: 'हिन्दी (Hindi)' },
                { code: 'te', label: 'తెలుగు (Telugu)' },
                { code: 'en', label: 'English' },
              ].map(item => (
                <button
                  type="button"
                  key={item.code}
                  onClick={() => setPrefLang(item.code as any)}
                  className={`py-2 px-1 text-center rounded-xl font-bold border transition-all ${
                    prefLang === item.code
                      ? 'bg-agri-800 text-white border-agri-900 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Create Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a safe password"
                className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-300 focus:border-agri-600 focus:ring-2 focus:ring-agri-100 outline-none text-xs font-semibold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-agri-800 hover:from-emerald-700 hover:to-agri-900 text-white py-3 rounded-2xl font-black text-sm shadow-md transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Registering Farm...' : t('signUp')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            href="/login"
            className="text-xs font-bold text-agri-700 hover:text-agri-900 transition-colors"
          >
            {t('alreadyHaveAccount')}
          </Link>
        </div>
      </div>

      <div className="text-center text-xs text-agri-300/80 py-2">
        Empowering farmers across Karnataka, Maharashtra, and India with AI Smart Irrigation
      </div>
    </div>
  );
}

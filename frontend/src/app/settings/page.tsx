'use client';
import { useFarmer, updateFarmer } from '../../lib/session';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import LanguageSelectorModal from '../../components/LanguageSelectorModal';
import { useLanguage } from '../../context/LanguageContext';
import { SupportedLanguage } from '../../lib/types';
import { 
  Settings, 
  Globe, 
  Mic, 
  Wifi, 
  WifiOff, 
  HardDrive, 
  User, 
  CheckCircle2, 
  Volume2, 
  Save,
  Search,
  Check,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function SettingsPage() {
  const { 
    language, 
    setLanguage, 
    languageMeta, 
    isRTL, 
    t, 
    speakText, 
    voiceNotice, 
    clearVoiceNotice 
  } = useLanguage();

  const [modalOpen, setModalOpen] = useState(false);
  const [ruralMode, setRuralMode] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.95);
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [farmerName, setFarmerName] = useState('Ramesh Gowda');
  const [village, setVillage] = useState('Rampur');
  const [district, setDistrict] = useState('Mandya');
  const [phone, setPhone] = useState('9876543210');
  const { farmer: me, signedIn } = useFarmer();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  useEffect(() => {
    setFarmerName(me.name); setPhone(me.phone); setVillage(me.village); setDistrict(me.district);
  }, [me]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (signedIn) updateFarmer({ name: farmerName.trim(), phone, village: village.trim(), district: district.trim() });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestVoice = () => {
    speakText(languageMeta.samplePhrase, language);
  };

  const handleClearCache = async () => {
    if (typeof window !== 'undefined' && 'caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
      setCacheCleared(true);
      setTimeout(() => setCacheCleared(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar onOpenVoiceModal={handleTestVoice} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar />

        <main className="max-w-4xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Header */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center">
              <Settings className="w-6 h-6 text-agri-700 mr-2" />
              {t('navSettings')}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Customize regional Indian language, Sarvam Voice AI synthesis, and rural connectivity preferences
            </p>
          </div>

          {/* Voice Notice Toast */}
          {voiceNotice && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-bold flex items-center justify-between animate-fadeIn">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>{voiceNotice}</span>
              </div>
              <button onClick={clearVoiceNotice} className="text-amber-700 hover:text-amber-900 text-xs underline font-semibold ml-2">
                Dismiss
              </button>
            </div>
          )}

          {/* Success Banner */}
          {savedSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center space-x-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Preferences and settings saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6 text-xs font-semibold">
            {/* 1. Comprehensive Regional Language Selection */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-black text-slate-900 uppercase flex items-center">
                  <Globe className="w-4 h-4 text-emerald-600 mr-2" />
                  {t('selectLanguage') || 'Farmer Language & Script'}
                </h3>

                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="flex items-center space-x-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-bold bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search All 22 Languages</span>
                </button>
              </div>

              {/* Active Language Detailed Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/70 to-teal-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span 
                      className="text-2xl font-black text-slate-900"
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      {languageMeta.nativeName}
                    </span>
                    <span className="text-sm font-bold text-slate-600">
                      ({languageMeta.name})
                    </span>
                    <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Region: <span className="font-semibold">{languageMeta.region}</span> &bull; Script: <span className="font-semibold">{languageMeta.script}</span>
                  </p>
                  <p className="text-xs text-emerald-800 italic" dir={isRTL ? 'rtl' : 'ltr'}>
                    Sample: &ldquo;{languageMeta.samplePhrase}&rdquo;
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-1.5">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-800 font-bold flex items-center space-x-1">
                      <Mic className="w-3 h-3 text-emerald-600" />
                      <span>{languageMeta.capabilities.voiceProvider}</span>
                    </span>
                    <span className="bg-white px-2 py-1 rounded-lg border border-slate-200 text-slate-700 font-bold">
                      {isRTL ? 'RTL Layout' : 'LTR'}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center">
                    <Check className="w-3.5 h-3.5 mr-0.5 text-emerald-600" />
                    100% Interface Verified
                  </span>
                </div>
              </div>

              {/* Quick Switcher Grid for Top Languages */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {[
                  { code: 'kn', name: 'ಕನ್ನಡ', sub: 'Kannada' },
                  { code: 'hi', name: 'हिन्दी', sub: 'Hindi' },
                  { code: 'te', name: 'తెలుగు', sub: 'Telugu' },
                  { code: 'ta', name: 'தமிழ்', sub: 'Tamil' },
                  { code: 'mr', name: 'मराठी', sub: 'Marathi' },
                  { code: 'bn', name: 'বাংলা', sub: 'Bengali' },
                  { code: 'ur', name: 'اردو', sub: 'Urdu (RTL)' },
                  { code: 'en', name: 'English', sub: 'Indian English' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.code}
                    onClick={() => setLanguage(item.code as any)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      language === item.code
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm ring-2 ring-emerald-500'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-sm font-black block">{item.name}</span>
                    <span className={`text-[10px] block mt-0.5 ${language === item.code ? 'text-emerald-100' : 'text-slate-500'}`}>
                      {item.sub}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-300 text-xs transition-colors inline-flex items-center justify-center space-x-1.5"
                >
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span>Browse All 22 Scheduled Languages + Regional Dialects &rarr;</span>
                </button>
              </div>
            </div>

            {/* 2. Rural Low-Bandwidth Mode */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900 flex items-center">
                  {ruralMode ? <WifiOff className="w-4 h-4 text-amber-600 mr-2" /> : <Wifi className="w-4 h-4 text-emerald-600 mr-2" />}
                  {t('ruralModeLabel')}
                </h3>
                <p className="text-slate-500 text-[11px] font-normal max-w-lg leading-relaxed">
                  {t('ruralModeDesc')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRuralMode(!ruralMode)}
                className={`w-14 h-8 rounded-full p-1 transition-all ${
                  ruralMode ? 'bg-emerald-700' : 'bg-slate-200'
                }`}
              >
                <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                  ruralMode ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* 3. AI Voice Assistant Controls */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-black text-slate-900 uppercase flex items-center">
                  <Mic className="w-4 h-4 text-emerald-600 mr-2" />
                  {t('voiceSettings')} &bull; {languageMeta.capabilities.voiceProvider}
                </h3>

                <button
                  type="button"
                  onClick={handleTestVoice}
                  className="flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl text-xs font-bold border border-emerald-200 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Test {languageMeta.name} Audio</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 uppercase mb-1">
                    Speech Rate: {speechRate}x
                  </label>
                  <input
                    type="range"
                    min="0.7"
                    max="1.3"
                    step="0.05"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(Number(e.target.value))}
                    className="w-full accent-emerald-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Slower (Clearer for rural farmers)</span>
                    <span>Faster</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 uppercase mb-1">
                    Voice Pitch: {speechPitch}x
                  </label>
                  <input
                    type="range"
                    min="0.8"
                    max="1.2"
                    step="0.05"
                    value={speechPitch}
                    onChange={(e) => setSpeechPitch(Number(e.target.value))}
                    className="w-full accent-emerald-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Deeper</span>
                    <span>Higher</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Farmer Profile Information */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase border-b border-slate-100 pb-2 flex items-center">
                <User className="w-4 h-4 text-emerald-600 mr-2" />
                {t('profileInfo')}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 uppercase mb-1">Farmer Name</label>
                  <input
                    type="text"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 uppercase mb-1">Village</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 uppercase mb-1">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* 5. Offline Storage & Cache Control */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center">
                  <HardDrive className="w-4 h-4 text-slate-600 mr-2" />
                  {t('clearCache')}
                </h3>
                <p className="text-slate-500 text-[11px] font-normal mt-0.5">
                  Local cache ensures full offline access to soil readings and irrigation schedules.
                </p>
                {cacheCleared && (
                  <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                    ✓ Cache purged successfully.
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleClearCache}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 transition-all flex-shrink-0"
              >
                Clear Offline Cache
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 rounded-2xl text-xs sm:text-sm font-black shadow-md transition-all flex items-center justify-center space-x-2 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{t('saveSettings')}</span>
            </button>
          </form>
        </main>
      </div>

      <LanguageSelectorModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

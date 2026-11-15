'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  getAllLanguages, 
  LanguageMeta, 
  isRTL as checkIsRTL, 
  isSarvamVoiceSupported 
} from '../lib/i18n';
import { SupportedLanguage } from '../lib/types';
import { 
  Search, 
  X, 
  Check, 
  Mic, 
  Volume2, 
  FileText, 
  Globe, 
  Sparkles, 
  AlertCircle,
  Compass,
  ArrowRight
} from 'lucide-react';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterTab = 'all' | 'scheduled' | 'voice' | 'rtl' | 'regional';

export default function LanguageSelectorModal({ isOpen, onClose }: LanguageSelectorModalProps) {
  const { language, setLanguage, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const allLangs = useMemo(() => getAllLanguages(), []);

  // Filtered languages based on search query and category tab
  const filteredLanguages = useMemo(() => {
    let list = allLangs;

    // Filter by tab
    if (activeTab === 'scheduled') {
      list = list.filter((l) => l.isScheduled);
    } else if (activeTab === 'voice') {
      list = list.filter((l) => isSarvamVoiceSupported(l.code) || l.capabilities.speechRecognition !== 'unavailable');
    } else if (activeTab === 'rtl') {
      list = list.filter((l) => l.direction === 'rtl');
    } else if (activeTab === 'regional') {
      list = list.filter((l) => l.isRegional);
    }

    // Filter by search string
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.nativeName.toLowerCase().includes(q) ||
          l.code.toLowerCase().includes(q) ||
          l.script.toLowerCase().includes(q) ||
          l.region.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allLangs, activeTab, searchQuery]);

  if (!isOpen) return null;

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col border border-emerald-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-4 sm:p-6 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-200">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {t('selectLanguage') || 'Select Farmer Language'}
                </h2>
                <span className="bg-emerald-500/30 text-emerald-100 text-xs px-2.5 py-0.5 rounded-full font-medium border border-emerald-400/30">
                  22 Scheduled + Regional
                </span>
              </div>
              <p className="text-emerald-100/90 text-xs sm:text-sm mt-0.5">
                Indian multilingual support with Unicode scripts, Sarvam Voice AI, and RTL layout.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by language (e.g. Kannada, ಕನ್ನಡ, Hindi, Urdu, Bengali, Tamil, etc.)..."
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-slate-900 placeholder:text-slate-400"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Languages ({allLangs.length})
            </button>
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === 'scheduled'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              22 Scheduled Languages
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center space-x-1 ${
                activeTab === 'voice'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-emerald-400" />
              <span>Voice AI (Sarvam / Browser)</span>
            </button>
            <button
              onClick={() => setActiveTab('rtl')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === 'rtl'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              RTL Direction (Urdu/Kashmiri/Sindhi)
            </button>
            <button
              onClick={() => setActiveTab('regional')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === 'regional'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Regional Dialects
            </button>
          </div>
        </div>

        {/* Language Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-slate-100">
          {filteredLanguages.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <AlertCircle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-700">No matching languages found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for a different keyword, script, or state name.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredLanguages.map((meta) => {
                const isSelected = language === meta.code;
                const isRtlLang = meta.direction === 'rtl';
                const isSarvam = isSarvamVoiceSupported(meta.code);

                return (
                  <div
                    key={meta.code}
                    onClick={() => handleSelect(meta.code)}
                    className={`relative p-3.5 sm:p-4 rounded-xl border text-left cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/30 shadow-sm'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20'
                    }`}
                  >
                    <div>
                      {/* Top Row: Native Name & Active Checkmark */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline space-x-2">
                          <span 
                            className="text-lg sm:text-xl font-bold text-slate-900"
                            dir={isRtlLang ? 'rtl' : 'ltr'}
                          >
                            {meta.nativeName}
                          </span>
                          <span className="text-sm font-semibold text-slate-600">
                            ({meta.name})
                          </span>
                        </div>
                        {isSelected ? (
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="text-xs font-mono font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                            {meta.code}
                          </span>
                        )}
                      </div>

                      {/* Region & Script */}
                      <p className="text-xs text-slate-500 mt-1 truncate">
                        {meta.region} &bull; <span className="font-medium text-slate-600">{meta.script}</span>
                      </p>

                      {/* Sample Vernacular Phrase */}
                      <div 
                        className="mt-2 text-xs text-emerald-800 bg-emerald-100/50 px-2.5 py-1.5 rounded-lg border border-emerald-200/50 truncate font-medium"
                        dir={isRtlLang ? 'rtl' : 'ltr'}
                      >
                        &ldquo;{meta.samplePhrase}&rdquo;
                      </div>
                    </div>

                    {/* Capability Badges */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[10px]">
                      {/* Voice Provider Badge */}
                      {isSarvam ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                          <Mic className="w-3 h-3 text-emerald-600" />
                          <span>Sarvam AI Voice</span>
                        </span>
                      ) : meta.capabilities.speechRecognition === 'web_speech' ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold border border-blue-200">
                          <Volume2 className="w-3 h-3 text-blue-600" />
                          <span>Browser Speech</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                          <FileText className="w-3 h-3 text-slate-400" />
                          <span>Text Fallback</span>
                        </span>
                      )}

                      {/* RTL Badge if applicable */}
                      {isRtlLang && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-semibold border border-purple-200">
                          RTL Layout
                        </span>
                      )}

                      {/* Scheduled or Regional status */}
                      {meta.isScheduled ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          8th Schedule
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                          Regional
                        </span>
                      )}

                      {/* Completeness Badge */}
                      <span className="ml-auto inline-flex items-center text-emerald-700 font-semibold">
                        <Check className="w-3 h-3 mr-0.5 text-emerald-600" />
                        {meta.completenessScore}% Translated
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-slate-500">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Language switching applies instantly and preserves your active field selections & telemetry.
            </span>
          </div>
          <div className="text-right shrink-0">
            <span className="font-semibold text-slate-700">Active:</span>{' '}
            <span className="font-bold text-emerald-700">{allLangs.find(l => l.code === language)?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

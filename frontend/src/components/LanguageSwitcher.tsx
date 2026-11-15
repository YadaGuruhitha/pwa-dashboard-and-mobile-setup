'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../lib/types';
import LanguageSelectorModal from './LanguageSelectorModal';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage, languageMeta, isRTL } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  // Quick primary access pills
  const primaryQuickCodes: SupportedLanguage[] = ['kn', 'hi', 'en'];

  // If active language is not among the 3 quick codes, show it as an additional pill
  const activeIsNonQuick = !primaryQuickCodes.includes(language);

  return (
    <>
      <div className="flex items-center space-x-1.5 bg-agri-950/50 p-1 rounded-xl border border-agri-700/50 backdrop-blur-md shadow-sm">
        {/* Globe button that triggers full 22-language modal */}
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-agri-100 hover:bg-agri-800/80 hover:text-white transition-all duration-150"
          title="Search all 22 Indian languages and regional dialects"
          aria-label="Open language selector"
        >
          <Globe className="w-4 h-4 text-emerald-300" />
          <span className="hidden sm:inline font-bold">22+ Languages</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-70" />
        </button>

        <div className="h-4 w-px bg-agri-700/60 hidden sm:block" />

        {/* Primary Quick Access Buttons */}
        <div className="flex items-center space-x-1">
          {primaryQuickCodes.map((code) => {
            const isActive = language === code;
            const labels: Record<string, string> = {
              kn: 'ಕನ್ನಡ',
              hi: 'हिन्दी',
              en: 'EN',
            };

            return (
              <button
                key={code}
                onClick={() => setLanguage(code)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm scale-105'
                    : 'text-agri-200/90 hover:bg-agri-800/60 hover:text-white'
                }`}
                title={`Switch to ${code.toUpperCase()}`}
              >
                {labels[code]}
              </button>
            );
          })}

          {/* Active non-quick language indicator pill */}
          {activeIsNonQuick && (
            <button
              onClick={() => setModalOpen(true)}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow-sm flex items-center space-x-1 animate-fadeIn"
              title={`Active language: ${languageMeta.name}`}
            >
              <span>{languageMeta.nativeName}</span>
              <Check className="w-3 h-3 text-emerald-200" />
            </button>
          )}
        </div>
      </div>

      {/* Full 22-Language Searchable Selector Modal */}
      <LanguageSelectorModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

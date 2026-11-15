'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { SupportedLanguage } from '../lib/types';
import { 
  LOCALES, 
  getLanguageMeta, 
  isRTL as checkIsRTL, 
  isSarvamVoiceSupported, 
  LanguageMeta,
  resolveTranslation,
  formatNumber,
  formatDate,
  formatTime,
  formatCurrency,
  formatMeasurement
} from '../lib/i18n';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  languageMeta: LanguageMeta;
  isRTL: boolean;
  t: (key: string) => string;
  speakText: (text: string, customLang?: SupportedLanguage) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
  voiceNotice: string | null;
  clearVoiceNotice: () => void;
  // Formatting helpers
  formatNum: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDateStr: (date: string | Date | number, options?: Intl.DateTimeFormatOptions) => string;
  formatTimeStr: (date: string | Date | number) => string;
  formatMoney: (amount: number, showSymbol?: boolean) => string;
  formatMeasure: (value: number, unit: 'liters' | 'acres' | 'mm' | 'celsius' | 'kwh') => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('kn'); // Default to Kannada as in project spec
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Sync HTML tag direction and lang attributes
  const updateHtmlAttributes = useCallback((lang: SupportedLanguage) => {
    if (typeof document !== 'undefined') {
      const meta = getLanguageMeta(lang);
      const isRtlLang = checkIsRTL(lang);
      document.documentElement.dir = isRtlLang ? 'rtl' : 'ltr';
      document.documentElement.lang = meta.bcp47 || lang;
      
      // Update body class for RTL specific font styling
      if (isRtlLang) {
        document.body.classList.add('rtl-mode');
      } else {
        document.body.classList.remove('rtl-mode');
      }
    }
  }, []);

  // Hydrate persisted language preference
  useEffect(() => {
    try {
      // 1. Check localStorage
      const saved = localStorage.getItem('krishi_language') as SupportedLanguage;
      if (saved && LOCALES[saved]) {
        setLanguageState(saved);
        updateHtmlAttributes(saved);
        return;
      }

      // 2. Check Cookie fallback
      const match = document.cookie.match(/(?:^|; )krishi_language=([^;]*)/);
      if (match && match[1] && LOCALES[match[1] as SupportedLanguage]) {
        const cookieLang = match[1] as SupportedLanguage;
        setLanguageState(cookieLang);
        updateHtmlAttributes(cookieLang);
        return;
      }

      // Default attributes
      updateHtmlAttributes('kn');
    } catch {
      // Fallback in restricted storage environments
      updateHtmlAttributes('kn');
    }
  }, [updateHtmlAttributes]);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    if (!LOCALES[lang]) {
      console.warn(`Unsupported language requested: ${lang}, falling back to English.`);
      lang = 'en';
    }

    setLanguageState(lang);
    updateHtmlAttributes(lang);

    try {
      localStorage.setItem('krishi_language', lang);
      document.cookie = `krishi_language=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (err) {
      console.warn('Could not persist language preference:', err);
    }
  }, [updateHtmlAttributes]);

  // Robust safe translation with 4-tier fallback: Target -> Hindi -> English -> Clean Title
  const t = useCallback((key: string): string => {
    return resolveTranslation(key, LOCALES[language], LOCALES['hi'], LOCALES['en']);
  }, [language]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const clearVoiceNotice = useCallback(() => {
    setVoiceNotice(null);
  }, []);

  const speakText = useCallback((text: string, customLang?: SupportedLanguage) => {
    if (typeof window === 'undefined') return;

    stopSpeaking();
    const targetLang = customLang || language;
    const meta = getLanguageMeta(targetLang);

    // Check voice support accurately
    const hasSarvam = isSarvamVoiceSupported(targetLang);
    const hasWebSpeech = meta.capabilities.speechRecognition !== 'unavailable';

    if (!('speechSynthesis' in window)) {
      setVoiceNotice('Browser speech synthesis is not supported on this device. Displaying text response.');
      return;
    }

    // If language is marked as text-only fallback (e.g. Bodo, Dogri, Santali)
    if (meta.capabilities.textToSpeech === 'text_only') {
      setVoiceNotice(
        `${meta.name} voice synthesis is currently in text-only mode. Audio response will be available in the next release.`
      );
      // Auto-clear notice after 5 seconds
      setTimeout(() => setVoiceNotice(null), 5000);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = meta.bcp47 || 'en-IN';

    // Try finding matching voice for the target script/language
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(
      (v) => v.lang === utterance.lang || v.lang.startsWith(meta.bcp47.split('-')[0]) || v.lang.includes(targetLang)
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setVoiceNotice(null);
    };
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      setIsSpeaking(false);
      setVoiceNotice(`Audio output unavailable for ${meta.name}. Showing text response.`);
      setTimeout(() => setVoiceNotice(null), 5000);
    };

    window.speechSynthesis.speak(utterance);
  }, [language, stopSpeaking]);

  const languageMeta = useMemo(() => getLanguageMeta(language), [language]);
  const isRTL = useMemo(() => checkIsRTL(language), [language]);

  // Bound formatting helpers
  const formatNum = useCallback((val: number, options?: Intl.NumberFormatOptions) => {
    return formatNumber(val, language, options);
  }, [language]);

  const formatDateStr = useCallback((date: string | Date | number, options?: Intl.DateTimeFormatOptions) => {
    return formatDate(date, language, options);
  }, [language]);

  const formatTimeStr = useCallback((date: string | Date | number) => {
    return formatTime(date, language);
  }, [language]);

  const formatMoney = useCallback((amount: number, showSymbol: boolean = true) => {
    return formatCurrency(amount, language, showSymbol);
  }, [language]);

  const formatMeasure = useCallback((value: number, unit: 'liters' | 'acres' | 'mm' | 'celsius' | 'kwh') => {
    return formatMeasurement(value, unit, language);
  }, [language]);

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        languageMeta, 
        isRTL, 
        t, 
        speakText, 
        isSpeaking, 
        stopSpeaking,
        voiceNotice,
        clearVoiceNotice,
        formatNum,
        formatDateStr,
        formatTimeStr,
        formatMoney,
        formatMeasure
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

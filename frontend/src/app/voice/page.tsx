'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import LanguageSelectorModal from '../../components/LanguageSelectorModal';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../lib/api';
import { FieldItem, GroundedData, SupportedLanguage } from '../../lib/types';
import { 
  getLanguageMeta, 
  isSarvamVoiceSupported, 
  isRTL as checkIsRTL, 
  SARVAM_VOICE_SUPPORTED_CODES,
  LOCALES
} from '../../lib/i18n';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Send, 
  AlertTriangle, 
  Droplets, 
  CloudRain, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  ArrowRight,
  Globe,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  Info
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'farmer' | 'ai';
  text: string;
  timestamp: string;
  intent?: string;
  grounded_data?: GroundedData;
  is_simulated?: boolean;
  provider?: string;
  audio_base64?: string;
}

export default function VoiceAssistantPage() {
  const { language, setLanguage, t, speakText, isSpeaking, stopSpeaking, voiceNotice } = useLanguage();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [fields, setFields] = useState<FieldItem[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<number | undefined>(undefined);
  const [suggestions, setSuggestions] = useState<{ label: string; query: string; category?: string }[]>([]);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [capabilities, setCapabilities] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const currentMeta = getLanguageMeta(language);
  const isSarvamVoice = isSarvamVoiceSupported(language);
  const isRtl = checkIsRTL(language);

  // Load fields and capabilities on mount
  useEffect(() => {
    api.getFields().then(setFields).catch(console.error);
    api.getVoiceCapabilities().then(setCapabilities).catch(console.error);
  }, []);

  // Update suggestions and welcome message on language change
  useEffect(() => {
    const welcome = language === 'kn'
      ? "ನಮಸ್ಕಾರ ರಮೇಶ್ ಅವರೇ! ನಾನು ಕೃಷಿ ಮಿತ್ರ, ನಿಮ್ಮ ಎಐ ಸ್ಮಾರ್ಟ್ ನೀರಾವರಿ ಸಹಾಯಕ. ಹೊಲದ ತೇವಾಂಶ, ಮಳೆ ಮುನ್ಸೂಚನೆ, ಅಥವಾ ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿಯ ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಿ."
      : language === 'hi'
      ? "नमस्ते रमेश जी! मैं कृषि मित्र हूँ, आपका एआई स्मार्ट सिंचाई सहायक। मुझसे खेत में पानी, बारिश के अनुमान या सिंचाई समय के बारे में पूछें।"
      : "Namaste Farmer! I am Krishi Mitra, your Smart Irrigation AI Assistant. Ask me if your crop needs water, today's rain forecast, or how much water to apply.";

    setMessages([
      {
        id: 'msg-welcome',
        sender: 'ai',
        text: welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        is_simulated: true,
        provider: 'KRISHI_MITRA_GROUNDED'
      }
    ]);

    api.getSuggestedQueries(language)
      .then(setSuggestions)
      .catch(() => {
        setSuggestions([
          { label: "Should I water my crop today?", query: "Should I water my crop today?" },
          { label: "How much water does my field need?", query: "How much water does my field need?" },
          { label: "Will it rain today?", query: "Will it rain today?" },
          { label: "Why is my field showing a warning?", query: "Why is my field showing a warning?" },
          { label: "When should I irrigate next?", query: "When should I irrigate next?" }
        ]);
      });
  }, [language]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Play audio from base64 or fallback to browser synthesis
  const playAudio = (audioBase64?: string, text?: string) => {
    if (audioBase64) {
      try {
        if (audioPlayerRef.current) {
          audioPlayerRef.current.pause();
        }
        const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
        audioPlayerRef.current = audio;
        audio.play().catch(() => {
          if (text) speakText(text, language);
        });
        return;
      } catch {
        if (text) speakText(text, language);
        return;
      }
    }
    if (text) {
      speakText(text, language);
    }
  };

  const handleSend = async (queryText: string) => {
    if (!queryText.trim()) return;

    setMicError(null);
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'farmer',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsProcessing(true);

    try {
      const res = await api.sendVoiceQuery(queryText, language, selectedFieldId);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.response_text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: res.intent_detected,
        grounded_data: res.grounded_data,
        is_simulated: res.is_simulated,
        provider: res.provider,
        audio_base64: res.response_audio_base64
      };
      setMessages(prev => [...prev, aiMsg]);
      playAudio(res.response_audio_base64, res.response_text);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: language === 'kn'
          ? "ಕ್ಷಮಿಸಿ, ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ."
          : language === 'hi'
          ? "क्षमा करें, जानकारी लोड नहीं हो सकी। कृपया पुनः प्रयास करें।"
          : "Sorry, could not connect to irrigation telemetry. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        is_simulated: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleMic = () => {
    setMicError(null);

    if (isListening) {
      setIsListening(false);
      return;
    }

    // Check browser SpeechRecognition support
    const SpeechRecognition = typeof window !== 'undefined'
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;

    if (!SpeechRecognition) {
      setMicError(
        language === 'kn'
          ? "ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಕೆಳಗೆ ಟೈಪ್ ಮಾಡಿ."
          : language === 'hi'
          ? "आपके ब्राउज़र में आवाज पहचान उपलब्ध नहीं है। कृपया नीचे लिखकर प्रश्न पूछें।"
          : "Browser speech recognition is not supported on this device. Please use text input below."
      );
      inputRef.current?.focus();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = currentMeta.bcp47 || 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setMicError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleSend(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setMicError(
            language === 'kn'
              ? "ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್ಸ್‌ನಲ್ಲಿ ಮೈಕ್ ಆನ್ ಮಾಡಿ."
              : language === 'hi'
              ? "माइक्रोफ़ोन की अनुमति अस्वीकृत है। कृपया ब्राउज़र में माइक की अनुमति दें।"
              : "Microphone permission was denied. Please allow microphone access or type your question."
          );
        } else if (event.error === 'no-speech') {
          // Silent timeout, no error necessary
        } else {
          setMicError(`Voice capture: ${event.error || 'Network error'}. Please type your question.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setMicError("Microphone initialization error. Please type your query below.");
      inputRef.current?.focus();
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col ${isRtl ? 'rtl' : 'ltr'}`}>
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-3 sm:px-6 py-4 flex-1 flex flex-col">
        {/* Top Control Card: Title, Language & Field Context Selector */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-agri-800 flex items-center justify-center text-white shadow-md flex-shrink-0">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>{t('voiceTitle')}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-agri-100 text-agri-800">
                    Krishi Mitra AI
                  </span>
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  {currentMeta.nativeName} ({currentMeta.name}) • {isSarvamVoice ? 'Sarvam AI Speech Engine' : 'Browser Web Speech & Text Fallback'}
                </p>
              </div>
            </div>

            {/* Language Switch Button */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsLangModalOpen(true)}
                className="px-3 py-1.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center space-x-1.5 transition-all shadow-2xs"
              >
                <Globe className="w-3.5 h-3.5 text-agri-700" />
                <span>{currentMeta.nativeName}</span>
                <span className="text-slate-400 text-[10px]">({currentMeta.code.toUpperCase()})</span>
              </button>

              {/* Status Pill */}
              <div 
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center space-x-1 ${
                  isSarvamVoice 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
                title={isSarvamVoice ? "Sarvam Saaras ASR + Bulbul TTS verified" : "Text Input with Browser Speech Fallback"}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isSarvamVoice ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span>{isSarvamVoice ? 'Voice Active' : 'Text / Fallback'}</span>
              </div>
            </div>
          </div>

          {/* Field Selection Filter Bar */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-500 flex-shrink-0">
              {t('fieldLabel')}:
            </span>

            <button
              onClick={() => setSelectedFieldId(undefined)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFieldId === undefined
                  ? 'bg-agri-800 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🌱 {t('allFields') || 'All Fields (Auto-Detect)'}
            </button>

            {fields.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFieldId(f.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  selectedFieldId === f.id
                    ? 'bg-agri-800 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{f.name.split('(')[0].trim()}</span>
                <span className="text-[10px] opacity-75 font-normal">({f.crop_type})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Microphone / Notice Banners */}
        {micError && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2.5 rounded-2xl text-xs font-medium mb-3 flex items-center justify-between shadow-2xs">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>{micError}</span>
            </div>
            <button 
              onClick={() => setMicError(null)}
              className="text-amber-700 hover:text-amber-950 font-bold ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {voiceNotice && (
          <div className="bg-sky-50 border border-sky-200 text-sky-900 px-4 py-2.5 rounded-2xl text-xs font-medium mb-3 flex items-center space-x-2 shadow-2xs">
            <Info className="w-4 h-4 text-sky-600 flex-shrink-0" />
            <span>{voiceNotice}</span>
          </div>
        )}

        {/* Conversation Message List */}
        <div className="flex-1 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs overflow-y-auto space-y-4 mb-3 min-h-[320px]">
          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            return (
              <div
                key={m.id}
                className={`flex items-start space-x-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded-xl bg-agri-100 flex items-center justify-center text-agri-800 font-bold text-xs flex-shrink-0 mt-1 shadow-2xs">
                    <Sparkles className="w-4 h-4 text-agri-700" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[78%] p-4 rounded-3xl text-sm leading-relaxed ${
                    isAi
                      ? 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-sm'
                      : 'bg-agri-800 text-white rounded-tr-sm shadow-sm'
                  }`}
                >
                  <p className="font-medium whitespace-pre-wrap">{m.text}</p>

                  {/* Grounded Agricultural Telemetry Badges */}
                  {isAi && m.grounded_data && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-wrap gap-1.5 text-[10px]">
                      {m.grounded_data.soil_moisture_pct !== undefined && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                          <Droplets className="w-3 h-3 text-emerald-600" />
                          <span>Moisture: {m.grounded_data.soil_moisture_pct}%</span>
                        </span>
                      )}

                      {m.grounded_data.rainfall_forecast_24h_mm !== undefined && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-sky-100 text-sky-800 font-bold">
                          <CloudRain className="w-3 h-3 text-sky-600" />
                          <span>Rain: {m.grounded_data.rainfall_forecast_24h_mm} mm</span>
                        </span>
                      )}

                      {m.grounded_data.next_schedule_slot && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 font-bold">
                          <Clock className="w-3 h-3 text-amber-700" />
                          <span>Next: {m.grounded_data.next_schedule_slot}</span>
                        </span>
                      )}

                      {m.grounded_data.recommended_volume_liters !== undefined && m.grounded_data.recommended_volume_liters > 0 && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-purple-100 text-purple-800 font-bold">
                          <span>Volume: {m.grounded_data.recommended_volume_liters.toLocaleString()} L</span>
                        </span>
                      )}

                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-slate-200/70 text-slate-600 font-medium ml-auto">
                        <span>{m.is_simulated ? '• Labeled Simulation' : '• Sarvam AI Verified'}</span>
                      </span>
                    </div>
                  )}

                  {/* Message Bottom Action & Timestamp */}
                  <div className="flex items-center justify-between mt-2 pt-1.5 text-[10px] text-slate-400">
                    <span>{m.timestamp}</span>
                    {isAi && (
                      <button
                        onClick={() => playAudio(m.audio_base64, m.text)}
                        className="text-agri-700 hover:text-agri-900 font-bold flex items-center space-x-1 px-2 py-0.5 rounded-md hover:bg-agri-50 transition-colors"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex items-center space-x-2 text-xs font-bold text-agri-800 bg-agri-50 p-3 rounded-2xl w-fit border border-agri-100">
              <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
              <span>{t('processingVoice') || 'Analyzing field sensors & weather data...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="flex items-center space-x-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 flex-shrink-0 uppercase tracking-wider">
            Quick Ask:
          </span>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s.query)}
              className="bg-white hover:bg-agri-50 text-slate-700 hover:text-agri-900 px-3.5 py-1.5 rounded-2xl text-xs font-semibold border border-slate-200/80 whitespace-nowrap shadow-2xs transition-all flex items-center space-x-1"
            >
              <span>{s.label}</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          ))}
        </div>

        {/* Farmer Input & Microphone Control Bar */}
        <div className="bg-white p-2.5 sm:p-3 rounded-3xl border border-slate-200/80 shadow-md flex items-center space-x-2">
          {/* Big Tap Mic with Active State Pulse */}
          <button
            onClick={toggleMic}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all transform active:scale-95 shadow-md flex-shrink-0 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 animate-pulse ring-4 ring-red-200'
                : 'bg-gradient-to-tr from-emerald-600 to-agri-800 hover:from-emerald-700 hover:to-agri-900'
            }`}
            title={isListening ? "Listening... Tap to stop" : "Tap to speak question"}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input with Multilingual Placeholder */}
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend(inputText);
            }}
            placeholder={
              language === 'kn'
                ? "ಇಲ್ಲಿ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ ಅಥವಾ ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ..."
                : language === 'hi'
                ? "यहाँ प्रश्न लिखें या माइक दबाकर बोलें..."
                : "Ask about watering, moisture, rainfall, or pump..."
            }
            className="flex-1 px-3 sm:px-4 py-2.5 text-xs sm:text-sm bg-transparent outline-none font-medium text-slate-800 placeholder-slate-400"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSend(inputText)}
            disabled={!inputText.trim() || isProcessing}
            className="w-10 h-10 rounded-2xl bg-agri-800 hover:bg-agri-900 disabled:opacity-40 text-white flex items-center justify-center transition-all flex-shrink-0 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Language Selection Modal */}
      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
      />
    </div>
  );
}

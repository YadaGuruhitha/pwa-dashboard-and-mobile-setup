'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';
import { SupportedLanguage } from '../lib/types';
import { isSarvamVoiceSupported, getLanguageMeta } from '../lib/i18n';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  X, 
  CheckCircle2, 
  MessageSquare,
  Radio,
  ArrowRight,
  AlertCircle,
  FileText,
  Send
} from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActionComplete?: () => void;
}

export default function VoiceAssistantModal({
  isOpen,
  onClose,
  onActionComplete
}: VoiceAssistantModalProps) {
  const { language, languageMeta, isRTL, t, speakText, isSpeaking, stopSpeaking } = useLanguage();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [intent, setIntent] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<{ label: string; query: string }[]>([]);

  const isSarvam = isSarvamVoiceSupported(language);
  const isTextFallback = languageMeta.capabilities.textToSpeech === 'text_only';

  // Load localized suggestions when opened or language changes
  useEffect(() => {
    if (isOpen) {
      api.getSuggestedQueries(language)
        .then(data => setSuggestions(data))
        .catch(() => {
          if (language === 'kn') {
            setSuggestions([
              { label: "ಟೊಮ್ಯಾಟೊ ಬೆಳೆಗೆ ನೀರು ಬೇಕೆ?", query: "ಟೊಮ್ಯಾಟೊ ಬೆಳೆಗೆ ನೀರು ಬೇಕೆ?" },
              { label: "ಇಂದಿನ ಹವಾಮಾನ ವರದಿ ತಿಳಿಸಿ", query: "ಇಂದಿನ ಹವಾಮಾನ ವರದಿ ತಿಳಿಸಿ" },
              { label: "ನೀರಾವರಿ ಮೋಟಾರ್ ಆನ್ ಮಾಡಿ", query: "ನೀರಾವರಿ ಮೋಟಾರ್ ಆನ್ ಮಾಡಿ" }
            ]);
          } else if (language === 'hi') {
            setSuggestions([
              { label: "क्या टमाटर में पानी चाहिए?", query: "क्या टमाटर में पानी चाहिए?" },
              { label: "आज का मौसम कैसा रहेगा?", query: "आज का मौसम कैसा रहेगा?" },
              { label: "पानी की मोटर चालू करो", query: "पानी की मोटर चालू करो" }
            ]);
          } else if (language === 'te') {
            setSuggestions([
              { label: "పొలానికి నీరు అవసరమా?", query: "పొలానికి నీరు అవసరమా?" },
              { label: "ఈరోజు వాతావరణం ఎలా ఉంటుంది?", query: "ఈరోజు వాతావరణం ఎలా ఉంటుంది?" },
              { label: "మోటార్ పంప్ ప్రారంభించండి", query: "మోటార్ పంప్ ప్రారంభించండి" }
            ]);
          } else if (language === 'ta') {
            setSuggestions([
              { label: "நிலத்திற்கு தண்ணீர் தேவையா?", query: "நிலத்திற்கு தண்ணீர் தேவையா?" },
              { label: "இன்றைய வானிலை எப்படி உள்ளது?", query: "இன்றைய வானிலை எப்படி உள்ளது?" },
              { label: "மோட்டார் பம்பை இயக்கவும்", query: "மோட்டார் பம்பை இயக்கவும்" }
            ]);
          } else if (language === 'ur') {
            setSuggestions([
              { label: "کیا فصل کو پانی کی ضرورت ہے؟", query: "کیا فصل کو پانی کی ضرورت ہے؟" },
              { label: "آج موسم کیسا رہے گا؟", query: "آج موسم کیسا رہے گا؟" },
              { label: "پانی کی موٹر چالو کریں", query: "پانی کی موٹر چالو کریں" }
            ]);
          } else {
            setSuggestions([
              { label: "Does Field 1 need water?", query: "Does Field 1 need water?" },
              { label: "What is today's weather forecast?", query: "What is today's weather forecast?" },
              { label: "Turn ON irrigation pump", query: "Turn ON irrigation pump" }
            ]);
          }
        });
    }
  }, [isOpen, language]);

  if (!isOpen) return null;

  // Process a text or speech query through the backend
  const submitQuery = async (queryToSubmit: string) => {
    if (!queryToSubmit.trim()) return;

    try {
      setIsProcessing(true);
      setTranscript(queryToSubmit);
      setResponse(null);

      const res = await api.sendVoiceQuery(queryToSubmit, language);
      setResponse(res.response_text);
      setIntent(res.intent_detected);

      // Play audio response if not in text-only mode
      if (!isTextFallback) {
        speakText(res.response_text, language);
      }

      if (res.action_data?.pump_action && onActionComplete) {
        onActionComplete();
      }
    } catch (err) {
      console.error('Voice query error:', err);
      const fallbackMsg = language === 'kn' 
        ? "ಕ್ಷಮಿಸಿ, ಸಂಪರ್ಕ ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ."
        : language === 'hi'
        ? "क्षमा करें, संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।"
        : language === 'ur'
        ? "معذرت، آواز کی پروسیسنگ نہیں ہو سکی۔ براہ کرم دوبارہ کوشش کریں۔"
        : "Sorry, could not process voice query. Please retry.";
      setResponse(fallbackMsg);
      if (!isTextFallback) {
        speakText(fallbackMsg, language);
      }
    } finally {
      setIsProcessing(false);
      setIsListening(false);
      setTextInput('');
    }
  };

  // Toggle speech recognition
  const toggleSpeechRecognition = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    if (isTextFallback) {
      // In text fallback mode, focus input
      return;
    }

    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = languageMeta.bcp47 || 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcript) {
          submitQuery(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      // Fallback: submit first suggestion
      const defaultQ = suggestions[0]?.query || "Does field need water?";
      submitQuery(defaultQ);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-agri-200 relative overflow-hidden"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {t('voiceTitle')}
              </h3>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {languageMeta.nativeName} ({languageMeta.name})
                </span>
                {isSarvam ? (
                  <span className="text-[10px] bg-emerald-600 text-white font-semibold px-2 py-0.5 rounded-full">
                    Sarvam AI ASR
                  </span>
                ) : isTextFallback ? (
                  <span className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-full flex items-center">
                    <FileText className="w-2.5 h-2.5 mr-0.5" />
                    Text-Only Mode
                  </span>
                ) : (
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                    Browser Web Speech
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Text Fallback Alert Note */}
        {isTextFallback && (
          <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Voice synthesis is in text mode for {languageMeta.name}. Tap suggestions or type below for instant advisory.
            </span>
          </div>
        )}

        {/* Speech / Output Visualizer */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/30 border border-slate-200/80 min-h-[110px] flex flex-col justify-center items-center text-center">
          {isProcessing ? (
            <div className="space-y-2 animate-pulse">
              <Radio className="w-8 h-8 text-emerald-600 mx-auto animate-spin" />
              <p className="text-xs font-bold text-slate-600">{t('processingVoice')}</p>
            </div>
          ) : isListening ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-1">
                <span className="w-2 h-6 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-10 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-6 bg-emerald-500 rounded-full animate-bounce"></span>
              </div>
              <p className="text-xs font-bold text-emerald-800">{t('listening')}</p>
              {transcript && <p className="text-xs text-slate-600 italic">&ldquo;{transcript}&rdquo;</p>}
            </div>
          ) : response ? (
            <div className="space-y-2 text-left w-full">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold border-b border-slate-200/60 pb-1">
                <span>{transcript ? `"${transcript}"` : 'Question'}</span>
                {intent && (
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    Intent: {intent}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                {response}
              </p>
              {isSpeaking && (
                <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-bold">
                  <Volume2 className="w-4 h-4 animate-bounce" />
                  <span>Speaking in {languageMeta.name}...</span>
                  <button onClick={stopSpeaking} className="underline text-slate-500 ml-2">
                    Stop
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <MessageSquare className="w-6 h-6 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">
                {t('voiceSubtitle')}
              </p>
            </div>
          )}
        </div>

        {/* Action Controls: Mic button + Type query input */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            {!isTextFallback && (
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md transition-all active:scale-95 ${
                  isListening
                    ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isListening ? 'Stop Listening' : t('speakNow')}</span>
              </button>
            )}

            {isSpeaking && (
              <button
                type="button"
                onClick={stopSpeaking}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-3 rounded-2xl text-xs font-bold transition-colors"
                title="Mute audio output"
              >
                <Volume2 className="w-4 h-4 text-emerald-600" />
              </button>
            )}
          </div>

          {/* Text Input Row (useful for text fallback or quiet environments) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (textInput.trim()) submitQuery(textInput);
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={`Ask in ${languageMeta.nativeName} or English...`}
              className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
            />
            <button
              type="submit"
              disabled={!textInput.trim() || isProcessing}
              className="p-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 text-white rounded-xl transition-colors shadow-sm"
              title="Send question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Quick Tap Suggested Questions */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            {t('suggestedQueries')}
          </p>
          <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => submitQuery(item.query)}
                className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/60 hover:border-emerald-200 text-xs font-semibold text-slate-700 hover:text-emerald-900 transition-all flex items-center justify-between group"
              >
                <span className="truncate">{item.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0 ml-1 transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer info note */}
        <div className="mt-4 pt-2 border-t border-slate-100 text-center text-[10px] text-slate-400">
          Powered by Sarvam AI Indic Saaras & Bulbul with multi-tiered regional language fallback.
        </div>
      </div>
    </div>
  );
}

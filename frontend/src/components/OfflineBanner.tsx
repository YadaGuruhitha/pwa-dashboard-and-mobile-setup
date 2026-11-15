'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function OfflineBanner() {
  const { language } = useLanguage();
  const [isOffline, setIsOffline] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  const handleRetry = async () => {
    setIsChecking(true);
    try {
      // Ping health check or simple head request
      await fetch('/api/health', { cache: 'no-store', method: 'HEAD' });
      setIsOffline(false);
    } catch {
      setIsOffline(true);
    } finally {
      setIsChecking(false);
    }
  };

  if (!isOffline) return null;

  const messages: Record<string, { title: string; desc: string; retry: string }> = {
    kn: {
      title: "ಆಫ್‌ಲೈನ್ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ",
      desc: "ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕವಿಲ್ಲ. ಸಂಗ್ರಹಿಸಿದ ಹಳೆಯ ಡೇಟಾವನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ. ಇದು ಲೈವ್ ಸೆನ್ಸಾರ್ ಡೇಟಾ ಅಲ್ಲ.",
      retry: "ಮರುಪ್ರಯತ್ನಿಸಿ"
    },
    hi: {
      title: "ऑफ़लाइन मोड सक्रिय है",
      desc: "इंटरनेट कनेक्शन नहीं है। कैश्ड डेटा दिखाया जा रहा है। यह लाइव सेंसर डेटा नहीं है।",
      retry: "पुनः प्रयास"
    },
    en: {
      title: "Offline Mode Active",
      desc: "No internet connection. Displaying cached data. Do NOT treat as live sensor telemetry.",
      retry: "Retry"
    }
  };

  const msg = messages[language] || messages.en;

  return (
    <div className="bg-amber-600 text-white px-4 py-2 text-xs font-semibold shadow-md flex items-center justify-between gap-3 sticky top-0 z-50">
      <div className="flex items-center space-x-2">
        <WifiOff className="w-4 h-4 flex-shrink-0 animate-pulse text-amber-200" />
        <div>
          <span className="font-bold underline mr-1">{msg.title}:</span>
          <span>{msg.desc}</span>
        </div>
      </div>

      <button
        onClick={handleRetry}
        disabled={isChecking}
        className="bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white px-3 py-1 rounded-xl text-xs flex items-center space-x-1 flex-shrink-0 transition-all shadow-xs"
      >
        <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
        <span>{msg.retry}</span>
      </button>
    </div>
  );
}

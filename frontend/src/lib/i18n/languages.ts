import { SupportedLanguage, ScheduledLanguageCode, RegionalLanguageCode } from '../types';

export interface LanguageCapabilities {
  staticUI: 'full' | 'partial' | 'in_review';
  dynamicTranslation: 'available' | 'backend_ready' | 'fallback';
  speechRecognition: 'sarvam_saaras' | 'web_speech' | 'unavailable';
  textToSpeech: 'sarvam_bulbul' | 'web_speech' | 'text_only';
  voiceProvider: 'Sarvam AI' | 'Browser Web Speech' | 'Text-Only Fallback';
}

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  script: string;
  direction: 'ltr' | 'rtl';
  bcp47: string;
  isScheduled: boolean;
  isRegional?: boolean;
  region: string;
  capabilities: LanguageCapabilities;
  completenessScore: number; // percentage
  fontFamily?: string;
  samplePhrase: string; // "Smart Irrigation" or "Soil Moisture"
  notes?: string;
}

/**
 * Sarvam AI officially supports 11 languages for Saaras ASR and Bulbul TTS:
 * en-IN, hi-IN, bn-IN, kn-IN, te-IN, ta-IN, mr-IN, gu-IN, ml-IN, or-IN, pa-IN.
 * 
 * Other languages use Web Speech API where available or elegant text-based fallback.
 */
export const SARVAM_VOICE_SUPPORTED_CODES = new Set<string>([
  'en', 'hi', 'bn', 'kn', 'te', 'ta', 'mr', 'gu', 'ml', 'or', 'pa'
]);

export const RTL_LANGUAGE_CODES = new Set<string>(['ur', 'ks', 'sd']);

export const LANGUAGES: Record<SupportedLanguage, LanguageMeta> = {
  // English (Universal agricultural reference)
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
    direction: 'ltr',
    bcp47: 'en-IN',
    isScheduled: false,
    region: 'Pan-India / Administrative',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'available',
      speechRecognition: 'sarvam_saaras',
      textToSpeech: 'sarvam_bulbul',
      voiceProvider: 'Sarvam AI',
    },
    completenessScore: 100,
    fontFamily: 'Inter, system-ui, sans-serif',
    samplePhrase: 'Smart Irrigation & Water Management',
    notes: 'Reference language with complete static keys and full voice support.',
  },

  // 1. Assamese (অসমীয়া)
  as: {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    script: 'Bengali-Assamese',
    direction: 'ltr',
    bcp47: 'as-IN',
    isScheduled: true,
    region: 'Assam, Northeast India',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'available',
      speechRecognition: 'unavailable',
      textToSpeech: 'text_only',
      voiceProvider: 'Text-Only Fallback',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Bengali", sans-serif',
    samplePhrase: 'স্মাৰ্ট জলসিঞ্চন আৰু মাটিৰ আৰ্দ্ৰতা',
    notes: 'Static UI fully translated. Voice fallback active (Sarvam voice in roadmap).',
  },

  // 2. Bengali (বাংলা)
  bn: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    direction: 'ltr',
    bcp47: 'bn-IN',
    isScheduled: true,
    region: 'West Bengal, Tripura, Barak Valley',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'available',
      speechRecognition: 'sarvam_saaras',
      textToSpeech: 'sarvam_bulbul',
      voiceProvider: 'Sarvam AI',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Bengali", sans-serif',
    samplePhrase: 'স্মার্ট সেচ এবং মাটির আর্দ্রতা',
    notes: 'Full voice integration via Sarvam Saaras & Bulbul.',
  },

  // 3. Bodo (बड़ो / बर')
  brx: {
    code: 'brx',
    name: 'Bodo',
    nativeName: 'बड़ो',
    script: 'Devanagari',
    direction: 'ltr',
    bcp47: 'brx-IN',
    isScheduled: true,
    region: 'Bodoland, Assam',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'backend_ready',
      speechRecognition: 'unavailable',
      textToSpeech: 'text_only',
      voiceProvider: 'Text-Only Fallback',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Devanagari", sans-serif',
    samplePhrase: 'स्मार्ट दै रोगानाय आरो हा रोगानाय',
    notes: 'Devanagari script UI. Voice fallback with clear textual guidance.',
  },

  // 4. Dogri (डोगरी)
  doi: {
    code: 'doi',
    name: 'Dogri',
    nativeName: 'डोगरी',
    script: 'Devanagari',
    direction: 'ltr',
    bcp47: 'doi-IN',
    isScheduled: true,
    region: 'Jammu & Kashmir, Himachal Pradesh',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'backend_ready',
      speechRecognition: 'unavailable',
      textToSpeech: 'text_only',
      voiceProvider: 'Text-Only Fallback',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Devanagari", sans-serif',
    samplePhrase: 'स्मार्ट सिंचाई ते नमी प्रबंधन',
    notes: 'Devanagari script UI for Duggar agricultural belts.',
  },

  // 5. Gujarati (ગુજરાતી)
  gu: {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    direction: 'ltr',
    bcp47: 'gu-IN',
    isScheduled: true,
    region: 'Gujarat, Dadra & Nagar Haveli',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'available',
      speechRecognition: 'sarvam_saaras',
      textToSpeech: 'sarvam_bulbul',
      voiceProvider: 'Sarvam AI',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Gujarati", sans-serif',
    samplePhrase: 'સ્માર્ટ પિયત અને જમીનનો ભેજ',
    notes: 'Full voice integration via Sarvam Saaras & Bulbul.',
  },

  // 6. Hindi (हिन्दी)
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    direction: 'ltr',
    bcp47: 'hi-IN',
    isScheduled: true,
    region: 'North & Central India (UP, MP, Bihar, Rajasthan, Haryana)',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'available',
      speechRecognition: 'sarvam_saaras',
      textToSpeech: 'sarvam_bulbul',
      voiceProvider: 'Sarvam AI',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Devanagari", sans-serif',
    samplePhrase: 'स्मार्ट सिंचाई और मिट्टी की नमी',
    notes: 'Full static UI and full voice integration via Sarvam AI.',
  },

  // 7. Kannada (ಕನ್ನಡ)
  kn: {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    direction: 'ltr',
    bcp47: 'kn-IN',
    isScheduled: true,
    region: 'Karnataka (Mandya, Mysuru, Belagavi, etc.)',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'available',
      speechRecognition: 'sarvam_saaras',
      textToSpeech: 'sarvam_bulbul',
      voiceProvider: 'Sarvam AI',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Kannada", sans-serif',
    samplePhrase: 'ಸ್ಮಾರ್ಟ್ ನೀರಾವರಿ ಮತ್ತು ಮಣ್ಣಿನ ತೇವಾಂಶ',
    notes: 'Default application language matching local farmer persona (Ramesh Gowda).',
  },

  // 8. Kashmiri (کٲشُر / कॉशुर)
  ks: {
    code: 'ks',
    name: 'Kashmiri',
    nativeName: 'کٲشُر',
    script: 'Perso-Arabic (Nastaliq)',
    direction: 'rtl',
    bcp47: 'ks-IN',
    isScheduled: true,
    region: 'Kashmir Valley, Jammu & Kashmir',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'backend_ready',
      speechRecognition: 'unavailable',
      textToSpeech: 'text_only',
      voiceProvider: 'Text-Only Fallback',
    },
    completenessScore: 100,
    fontFamily: '"Noto Naskh Arabic", "Noto Nastaliq Urdu", sans-serif',
    samplePhrase: 'سمارٹ آبپاشی تہ مٕژ منٛز آبٕچ مقدار',
    notes: 'Right-to-Left (RTL) Nastaliq script layout enabled.',
  },

  // 9. Konkani (कोंकणी)
  kok: {
    code: 'kok',
    name: 'Konkani',
    nativeName: 'कोंकणी',
    script: 'Devanagari',
    direction: 'ltr',
    bcp47: 'kok-IN',
    isScheduled: true,
    region: 'Goa, Coastal Karnataka, Maharashtra',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'backend_ready',
      speechRecognition: 'web_speech',
      textToSpeech: 'web_speech',
      voiceProvider: 'Browser Web Speech',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Devanagari", sans-serif',
    samplePhrase: 'स्मार्ट शिंपणे आणि मातीची ओल',
    notes: 'Devanagari script UI with coastal agriculture terms.',
  },

  // 10. Maithili (मैथिली)
  mai: {
    code: 'mai',
    name: 'Maithili',
    nativeName: 'मैथिली',
    script: 'Devanagari',
    direction: 'ltr',
    bcp47: 'mai-IN',
    isScheduled: true,
    region: 'Mithila region, Bihar, Jharkhand',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'backend_ready',
      speechRecognition: 'unavailable',
      textToSpeech: 'text_only',
      voiceProvider: 'Text-Only Fallback',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Devanagari", sans-serif',
    samplePhrase: 'स्मार्ट पटौनी आ माटिक नमी',
    notes: 'Complete Devanagari agricultural UI for Mithila region.',
  },

  // 11. Malayalam (മലയാളം)
  ml: {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    direction: 'ltr',
    bcp47: 'ml-IN',
    isScheduled: true,
    region: 'Kerala, Lakshadweep',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'available',
      speechRecognition: 'sarvam_saaras',
      textToSpeech: 'sarvam_bulbul',
      voiceProvider: 'Sarvam AI',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Malayalam", sans-serif',
    samplePhrase: 'സ്മാർട്ട് ജലസേചനവും മണ്ണിലെ ഈർപ്പവും',
    notes: 'Full voice integration via Sarvam Saaras & Bulbul.',
  },

  // 12. Manipuri / Meitei (মৈতৈলোন্)
  mni: {
    code: 'mni',
    name: 'Manipuri (Meitei)',
    nativeName: 'মৈতৈলোন্',
    script: 'Bengali / Meetei Mayek',
    direction: 'ltr',
    bcp47: 'mni-IN',
    isScheduled: true,
    region: 'Manipur, Northeast India',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'backend_ready',
      speechRecognition: 'unavailable',
      textToSpeech: 'text_only',
      voiceProvider: 'Text-Only Fallback',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Bengali", sans-serif',
    samplePhrase: 'স্মার্ট ঈথৈ অমসুং লৈবাক্কী ঈশিং ফীভম',
    notes: 'Bengali script representation widely used in administration.',
  },

  // 13. Marathi (मराठी)
  mr: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    direction: 'ltr',
    bcp47: 'mr-IN',
    isScheduled: true,
    region: 'Maharashtra, Goa',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'available',
      speechRecognition: 'sarvam_saaras',
      textToSpeech: 'sarvam_bulbul',
      voiceProvider: 'Sarvam AI',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Devanagari", sans-serif',
    samplePhrase: 'स्मार्ट सिंचन आणि जमिनीतील ओलावा',
    notes: 'Full voice integration via Sarvam Saaras & Bulbul.',
  },

  // 14. Nepali (नेपाली)
  ne: {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    script: 'Devanagari',
    direction: 'ltr',
    bcp47: 'ne-NP',
    isScheduled: true,
    region: 'Sikkim, Darjeeling, West Bengal, Assam',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'backend_ready',
      speechRecognition: 'web_speech',
      textToSpeech: 'web_speech',
      voiceProvider: 'Browser Web Speech',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Devanagari", sans-serif',
    samplePhrase: 'स्मार्ट सिँचाइ र माटोको चिस्यान',
    notes: 'Supported by Web Speech synthesis in modern browsers.',
  },

  // 15. Odia (ଓଡ଼ିଆ)
  or: {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    script: 'Odia',
    direction: 'ltr',
    bcp47: 'or-IN',
    isScheduled: true,
    region: 'Odisha',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'available',
      speechRecognition: 'sarvam_saaras',
      textToSpeech: 'sarvam_bulbul',
      voiceProvider: 'Sarvam AI',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Oriya", sans-serif',
    samplePhrase: 'ସ୍ମାର୍ଟ ଜଳସେଚନ ଓ ମାଟିର ଆର୍ଦ୍ରତା',
    notes: 'Full voice integration via Sarvam Saaras & Bulbul.',
  },

  // 16. Punjabi (ਪੰਜਾਬੀ)
  pa: {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    direction: 'ltr',
    bcp47: 'pa-IN',
    isScheduled: true,
    region: 'Punjab, Haryana, Delhi, Chandigarh',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'available',
      speechRecognition: 'sarvam_saaras',
      textToSpeech: 'sarvam_bulbul',
      voiceProvider: 'Sarvam AI',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Gurmukhi", sans-serif',
    samplePhrase: 'ਸਮਾਰਟ ਸਿੰਚਾਈ ਅਤੇ ਮਿੱਟੀ ਦੀ ਨਮੀ',
    notes: 'Full voice integration via Sarvam Saaras & Bulbul.',
  },

  // 17. Sanskrit (संस्कृतम्)
  sa: {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    script: 'Devanagari',
    direction: 'ltr',
    bcp47: 'sa-IN',
    isScheduled: true,
    region: 'Pan-India / Classical Agricultural Texts (Krishi Parashara)',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'backend_ready',
      speechRecognition: 'unavailable',
      textToSpeech: 'text_only',
      voiceProvider: 'Text-Only Fallback',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Devanagari", sans-serif',
    samplePhrase: 'सूक्ष्म जलसेचनम् मृत्तिका आर्द्रता च',
    notes: 'Classical Vedic & Krishi Parashara terminology representation.',
  },

  // 18. Santali (ᱥᱟᱱᱛᱟᱲᱤ)
  sat: {
    code: 'sat',
    name: 'Santali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',
    script: 'Ol Chiki',
    direction: 'ltr',
    bcp47: 'sat-IN',
    isScheduled: true,
    region: 'Jharkhand, Odisha, West Bengal, Bihar',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'backend_ready',
      speechRecognition: 'unavailable',
      textToSpeech: 'text_only',
      voiceProvider: 'Text-Only Fallback',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Ol Chiki", sans-serif',
    samplePhrase: 'ᱥᱢᱟᱨᱴ ᱫᱟᱜ ᱫᱩᱞ ᱟᱨ ᱦᱟᱥᱟ ᱨᱮᱱᱟᱜ ᱟᱞᱟ',
    notes: 'Official Ol Chiki script rendering supported with fallback.',
  },

  // 19. Sindhi (سنڌي / सिन्धी)
  sd: {
    code: 'sd',
    name: 'Sindhi',
    nativeName: 'سنڌي',
    script: 'Perso-Arabic',
    direction: 'rtl',
    bcp47: 'sd-IN',
    isScheduled: true,
    region: 'Gujarat, Rajasthan, Maharashtra',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'backend_ready',
      speechRecognition: 'unavailable',
      textToSpeech: 'text_only',
      voiceProvider: 'Text-Only Fallback',
    },
    completenessScore: 100,
    fontFamily: '"Noto Naskh Arabic", sans-serif',
    samplePhrase: 'سمارٽ آبپاشي ۽ مٽي جي آبپاشي',
    notes: 'Right-to-Left (RTL) Arabic script layout supported.',
  },

  // 20. Tamil (தமிழ்)
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    direction: 'ltr',
    bcp47: 'ta-IN',
    isScheduled: true,
    region: 'Tamil Nadu, Puducherry',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'available',
      speechRecognition: 'sarvam_saaras',
      textToSpeech: 'sarvam_bulbul',
      voiceProvider: 'Sarvam AI',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Tamil", sans-serif',
    samplePhrase: 'ஸ்மார்ட் பாசனம் மற்றும் மண் ஈரப்பதம்',
    notes: 'Full voice integration via Sarvam Saaras & Bulbul.',
  },

  // 21. Telugu (తెలుగు)
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    direction: 'ltr',
    bcp47: 'te-IN',
    isScheduled: true,
    region: 'Andhra Pradesh, Telangana',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'available',
      speechRecognition: 'sarvam_saaras',
      textToSpeech: 'sarvam_bulbul',
      voiceProvider: 'Sarvam AI',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Telugu", sans-serif',
    samplePhrase: 'స్మార్ట్ సాగునీరు మరియు నేల తేమ',
    notes: 'Full voice integration via Sarvam Saaras & Bulbul.',
  },

  // 22. Urdu (اردو)
  ur: {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    script: 'Perso-Arabic (Nastaliq)',
    direction: 'rtl',
    bcp47: 'ur-IN',
    isScheduled: true,
    region: 'Telangana, UP, Bihar, Delhi, Kashmir',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'available',
      speechRecognition: 'web_speech',
      textToSpeech: 'web_speech',
      voiceProvider: 'Browser Web Speech',
    },
    completenessScore: 100,
    fontFamily: '"Noto Nastaliq Urdu", "Noto Naskh Arabic", sans-serif',
    samplePhrase: 'اسمارٹ آبپاشی اور مٹی کی نمی',
    notes: 'Full Right-to-Left (RTL) layout mirroring and Nastaliq typography.',
  },

  // --- Extensible Regional Varieties ---
  bho: {
    code: 'bho',
    name: 'Bhojpuri',
    nativeName: 'भोजपुरी',
    script: 'Devanagari',
    direction: 'ltr',
    bcp47: 'bho-IN',
    isScheduled: false,
    isRegional: true,
    region: 'Eastern UP, Western Bihar',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'backend_ready',
      speechRecognition: 'unavailable',
      textToSpeech: 'text_only',
      voiceProvider: 'Text-Only Fallback',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Devanagari", sans-serif',
    samplePhrase: 'स्मार्ट पटवनी आ खेत के नमी',
    notes: 'Regional variety widely spoken in Purvanchal and Bhojpur.',
  },

  tcy: {
    code: 'tcy',
    name: 'Tulu',
    nativeName: 'ತುಳು',
    script: 'Kannada',
    direction: 'ltr',
    bcp47: 'tcy-IN',
    isScheduled: false,
    isRegional: true,
    region: 'Dakshina Kannada, Udupi (Karnataka)',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'backend_ready',
      speechRecognition: 'unavailable',
      textToSpeech: 'text_only',
      voiceProvider: 'Text-Only Fallback',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Kannada", sans-serif',
    samplePhrase: 'ಸ್ಮಾರ್ಟ್ ನೀರ್ ಪಾರಾವಣೆ ಬೊಕ್ಕ ಮಣ್ಣ್‌ದ ತೇವ',
    notes: 'Coastal Karnataka agricultural variety.',
  },

  raj: {
    code: 'raj',
    name: 'Rajasthani',
    nativeName: 'राजस्थानी',
    script: 'Devanagari',
    direction: 'ltr',
    bcp47: 'raj-IN',
    isScheduled: false,
    isRegional: true,
    region: 'Rajasthan, Malwa',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'backend_ready',
      speechRecognition: 'unavailable',
      textToSpeech: 'text_only',
      voiceProvider: 'Text-Only Fallback',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Devanagari", sans-serif',
    samplePhrase: 'स्मार्ट सिंच्यो अर माटी री नमी',
    notes: 'Arid and semi-arid crop water management dialect.',
  },

  hne: {
    code: 'hne',
    name: 'Chhattisgarhi',
    nativeName: 'छत्तीसगढ़ी',
    script: 'Devanagari',
    direction: 'ltr',
    bcp47: 'hne-IN',
    isScheduled: false,
    isRegional: true,
    region: 'Chhattisgarh (Rice Bowl of Central India)',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'backend_ready',
      speechRecognition: 'unavailable',
      textToSpeech: 'text_only',
      voiceProvider: 'Text-Only Fallback',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Devanagari", sans-serif',
    samplePhrase: 'स्मार्ट सिंचई अउ माटी के तरी',
    notes: 'Central India paddy belt agricultural dialect.',
  },

  kha: {
    code: 'kha',
    name: 'Khasi',
    nativeName: 'Ka Ktien Khasi',
    script: 'Latin',
    direction: 'ltr',
    bcp47: 'kha-IN',
    isScheduled: false,
    isRegional: true,
    region: 'Meghalaya (Khasi Hills)',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'backend_ready',
      speechRecognition: 'unavailable',
      textToSpeech: 'text_only',
      voiceProvider: 'Text-Only Fallback',
    },
    completenessScore: 100,
    fontFamily: 'system-ui, sans-serif',
    samplePhrase: 'Ka Ai Um Shai bad Ka Jingthiah Ka Khyndew',
    notes: 'Indigenous Northeast hill terrace farming variety.',
  },

  grt: {
    code: 'grt',
    name: 'Garo',
    nativeName: 'A·chik',
    script: 'Latin',
    direction: 'ltr',
    bcp47: 'grt-IN',
    isScheduled: false,
    isRegional: true,
    region: 'Meghalaya (Garo Hills)',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'backend_ready',
      speechRecognition: 'unavailable',
      textToSpeech: 'text_only',
      voiceProvider: 'Text-Only Fallback',
    },
    completenessScore: 100,
    fontFamily: 'system-ui, sans-serif',
    samplePhrase: 'Chi On·ani Aro A·ani Bi·ap',
    notes: 'Garo hills agro-ecological zone.',
  },

  lus: {
    code: 'lus',
    name: 'Mizo',
    nativeName: 'Mizo ṭawng',
    script: 'Latin',
    direction: 'ltr',
    bcp47: 'lus-IN',
    isScheduled: false,
    isRegional: true,
    region: 'Mizoram',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'backend_ready',
      speechRecognition: 'unavailable',
      textToSpeech: 'text_only',
      voiceProvider: 'Text-Only Fallback',
    },
    completenessScore: 100,
    fontFamily: 'system-ui, sans-serif',
    samplePhrase: 'Tui Pek Fing leh Lei Hnawng',
    notes: 'Hill agriculture and bamboo drip irrigation zone.',
  },

  trp: {
    code: 'trp',
    name: 'Kokborok',
    nativeName: 'Kokborok',
    script: 'Latin / Bengali',
    direction: 'ltr',
    bcp47: 'trp-IN',
    isScheduled: false,
    isRegional: true,
    region: 'Tripura',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'backend_ready',
      speechRecognition: 'unavailable',
      textToSpeech: 'text_only',
      voiceProvider: 'Text-Only Fallback',
    },
    completenessScore: 100,
    fontFamily: 'system-ui, sans-serif',
    samplePhrase: 'Smart Twisa Kwlaimung tei Hani Simung',
    notes: 'Indigenous horticultural variety in Tripura.',
  },

  gon: {
    code: 'gon',
    name: 'Gondi',
    nativeName: 'गोंडी',
    script: 'Devanagari',
    direction: 'ltr',
    bcp47: 'gon-IN',
    isScheduled: false,
    isRegional: true,
    region: 'Madhya Pradesh, Maharashtra, Chhattisgarh, Telangana',
    capabilities: {
      staticUI: 'full',
      dynamicTranslation: 'backend_ready',
      speechRecognition: 'unavailable',
      textToSpeech: 'text_only',
      voiceProvider: 'Text-Only Fallback',
    },
    completenessScore: 100,
    fontFamily: '"Noto Sans Devanagari", sans-serif',
    samplePhrase: 'स्मार्ट येर तासी कना अनि मट्टी ता ओल',
    notes: 'Tribal agricultural belt central Indian variety.',
  },
};

/** Get list of all registered languages */
export function getAllLanguages(): LanguageMeta[] {
  return Object.values(LANGUAGES);
}

/** Get all 22 Eighth Schedule languages */
export function getScheduledLanguages(): LanguageMeta[] {
  return Object.values(LANGUAGES).filter((l) => l.isScheduled);
}

/** Get regional and local extension languages */
export function getRegionalLanguages(): LanguageMeta[] {
  return Object.values(LANGUAGES).filter((l) => l.isRegional);
}

/** Get languages with Voice AI (Sarvam / Browser) */
export function getVoiceSupportedLanguages(): LanguageMeta[] {
  return Object.values(LANGUAGES).filter(
    (l) => l.capabilities.speechRecognition !== 'unavailable'
  );
}

/** Lookup language metadata with safe English fallback */
export function getLanguageMeta(code: string): LanguageMeta {
  const meta = LANGUAGES[code as SupportedLanguage];
  if (meta) return meta;
  return LANGUAGES['en'];
}

/** Check if language uses Right-to-Left (RTL) text direction */
export function isRTL(code: string): boolean {
  return RTL_LANGUAGE_CODES.has(code);
}

/** Check if Sarvam AI natively provides voice for this language */
export function isSarvamVoiceSupported(code: string): boolean {
  return SARVAM_VOICE_SUPPORTED_CODES.has(code);
}

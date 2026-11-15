/**
 * Agricultural Terminology Glossary for Smart Irrigation
 * Ensures consistent technical and vernacular translations across all Indian languages.
 */

export interface GlossaryTerm {
  termKey: string;
  en: string;
  hi: string;
  kn: string;
  te: string;
  ta: string;
  mr: string;
  bn: string;
  gu: string;
  ml: string;
  pa: string;
  ur: string;
  category: 'irrigation' | 'soil' | 'meteorology' | 'crop_biology';
  definitionEn: string;
  practicalFarmerGuidance: string;
}

export const AGRICULTURAL_GLOSSARY: Record<string, GlossaryTerm> = {
  soilMoisture: {
    termKey: 'soilMoisture',
    en: 'Soil Moisture',
    hi: 'मिट्टी की नमी',
    kn: 'ಮಣ್ಣಿನ ತೇವಾಂಶ',
    te: 'నేల తేమ',
    ta: 'மண் ஈரப்பதம்',
    mr: 'मातीतील ओलावा',
    bn: 'মাটির আর্দ্রতা',
    gu: 'જમીનનો ભેજ',
    ml: 'മണ്ണിലെ ഈർപ്പം',
    pa: 'ਮਿੱਟੀ ਦੀ ਨਮੀ',
    ur: 'مٹی کی نمی',
    category: 'soil',
    definitionEn: 'The percentage of volumetric water content present in the active root zone.',
    practicalFarmerGuidance: 'Keep between 40% and 75% for optimal root aeration and transpiration.',
  },

  fieldCapacity: {
    termKey: 'fieldCapacity',
    en: 'Field Capacity',
    hi: 'खेत की जल धारण क्षमता',
    kn: 'ಕ್ಷೇತ್ರದ ನೀರು ಹಿಡಿದಿಡುವ ಸಾಮರ್ಥ್ಯ',
    te: 'క్షేత్ర సామర్థ్యం',
    ta: 'நிலக் கொள்ளளவு',
    mr: 'शेत जलधारण क्षमता',
    bn: 'ক্ষেত্রের জলধারণ ক্ষমতা',
    gu: 'ક્ષેત્રિય જળ સંગ્રહ ક્ષમતા',
    ml: 'ഫീൽഡ് കപ്പാസിറ്റി',
    pa: 'ਖੇਤ ਦੀ ਪਾਣੀ ਸੰਭਾਲ ਸਮਰੱਥਾ',
    ur: 'کھیت کی پانی جذب کرنے کی صلاحیت',
    category: 'soil',
    definitionEn: 'The amount of soil moisture held in the soil after excess water has drained away (usually 2-3 days after rain).',
    practicalFarmerGuidance: 'Upper limit of beneficial water. Applying more water causes runoff and nutrient leaching.',
  },

  wiltingPoint: {
    termKey: 'wiltingPoint',
    en: 'Permanent Wilting Point',
    hi: 'स्थाई मुरझान बिंदु',
    kn: 'ಶಾಶ್ವತ ಬಾಡುವ ಹಂತ',
    te: 'శాశ్వత వాడిపోయే స్థానం',
    ta: 'நிரந்தர வாடல் புள்ளி',
    mr: 'कायमस्वरूपी सुकण्याचा बिंदू',
    bn: 'স্থায়ী নেতিয়ে পড়ার বিন্দু',
    gu: 'કાયમી કરમાવ બિંદુ',
    ml: 'വാടൽ നിലവാരം',
    pa: 'ਪੱਕੇ ਤੌਰ ਤੇ ਮੁਰਝਾਉਣ ਦਾ ਪੁਆਇੰਟ',
    ur: 'پودوں کے مستقل مرجھانے کا نقطہ',
    category: 'soil',
    definitionEn: 'The minimal point of soil moisture the plant requires not to wilt irreversibly.',
    practicalFarmerGuidance: 'Trigger pump before reaching this point (typically below 30% moisture).',
  },

  evapotranspiration: {
    termKey: 'evapotranspiration',
    en: 'Evapotranspiration (ET₀)',
    hi: 'वाष्पीकरण-उत्सर्जन दर (ET₀)',
    kn: 'ಭಾಷ್ಪೀಕರಣ ದರ (ET₀)',
    te: 'భాష్పీభవనం మరియు బాష్పోత్సేకం (ET₀)',
    ta: 'ஆவியாதல் மற்றும் நீராவிப்போக்கு (ET₀)',
    mr: 'बाष्पीभवन आणि वनस्पती उत्सर्जन (ET₀)',
    bn: 'বাষ্পীভবন ও প্রস্বেদন (ET₀)',
    gu: 'બાષ્પીભવન અને ઉત્સર્જન દર (ET₀)',
    ml: 'ബാഷ്പീകരണ നിരക്ക് (ET₀)',
    pa: 'ਵਾਸ਼ਪੀਕਰਨ ਦਰ (ET₀)',
    ur: 'بخارات بن کر اڑنے کی شرح (ET₀)',
    category: 'meteorology',
    definitionEn: 'Sum of evaporation from soil and transpiration from crop canopy in mm/day.',
    practicalFarmerGuidance: 'High ET₀ on sunny windy days means crops need replenishment sooner.',
  },

  dripIrrigation: {
    termKey: 'dripIrrigation',
    en: 'Drip Irrigation',
    hi: 'ड्रिप (टपक) सिंचाई',
    kn: 'ಹನಿ ನೀರಾವರಿ',
    te: 'బిందు సేద్యం',
    ta: 'சொட்டு நீர் பாசனம்',
    mr: 'ठिबक सिंचन',
    bn: 'ড্রিপ (ফোঁটা ফোঁটা) সেচ',
    gu: 'ટપક પિયત పદ્ધતિ',
    ml: 'തുള്ളിനന',
    pa: 'ਤੁਪਕਾ ਸਿੰਚਾਈ',
    ur: 'قطرہ قطرہ آبپاشی (ڈرپ)',
    category: 'irrigation',
    definitionEn: 'Targeted micro-irrigation delivering water directly to plant root zones with 90%+ efficiency.',
    practicalFarmerGuidance: 'Saves 40-50% water compared to furrow flooding and minimizes weed growth.',
  },

  sprinklerIrrigation: {
    termKey: 'sprinklerIrrigation',
    en: 'Sprinkler Irrigation',
    hi: 'स्प्रिंकलर (फव्वारा) सिंचाई',
    kn: 'ತುಂತುರು ನೀರಾವರಿ',
    te: 'తుంపర సేద్యం',
    ta: 'தெளிப்பு நீர் பாசனம்',
    mr: 'तुषार सिंचन',
    bn: 'স্প্রিংকলার (ফোয়ারা) সেচ',
    gu: 'ફુવારા પિયત પદ્ધતિ',
    ml: 'തുഷാരനന',
    pa: 'ਫੁਹਾਰਾ ਸਿੰਚਾਈ',
    ur: 'فوارہ آبپاشی',
    category: 'irrigation',
    definitionEn: 'Pressurized overhead spray distribution simulating rainfall for row crops.',
    practicalFarmerGuidance: 'Operate during morning or dusk to minimize evaporative wind drift losses.',
  },

  rainGuard: {
    termKey: 'rainGuard',
    en: 'AI Rain Guard',
    hi: 'एआई बारिश सुरक्षा कवच',
    kn: 'ಎಐ ಮಳೆ ರಕ್ಷಣಾ ಕವಚ',
    te: 'ఏఐ వర్ష రక్షణ కవచం',
    ta: 'ஏஐ மழைப் பாதுகாப்பு',
    mr: 'एआय पाऊस संरक्षण कवच',
    bn: 'এআই বৃষ্টি সুরক্ষা গার্ড',
    gu: 'એઆઈ વરસાદ સુરક્ષા કવચ',
    ml: 'എഐ മഴ സുരക്ഷാ ഗാർഡ്',
    pa: 'ਏਆਈ ਮੀਂਹ ਸੁਰੱਖਿਆ ਕਵਚ',
    ur: 'اے آئی بارش پروٹیکشن گارڈ',
    category: 'irrigation',
    definitionEn: 'Predictive algorithm that suspends planned irrigation when significant rainfall is forecast.',
    practicalFarmerGuidance: 'Prevents wasteful pumping and protects roots from waterlogging.',
  },

  waterDebit: {
    termKey: 'waterDebit',
    en: 'Discharge Volume (Liters)',
    hi: 'पानी की मात्रा (लीटर)',
    kn: 'ನೀರಿನ ಹೊರಹರಿವು (ಲೀಟರ್)',
    te: 'నీటి విడుదల పరిమాణం (లీటర్లు)',
    ta: 'நீர் வெளியேற்ற அளவு (லிட்டர்)',
    mr: 'पाण्याचा विसर्ग (लिटर)',
    bn: 'জলের নির্গমন পরিমাণ (লিটার)',
    gu: 'પાણીનો પ્રવાહ (લીટર)',
    ml: 'ജല പുറന്തള്ളൽ അളവ് (ലിറ്റർ)',
    pa: 'ਪਾਣੀ ਦਾ ਨਿਕਾਸ (ਲਿਟਰ)',
    ur: 'پانی کے اخراج کا حجم (لیٹر)',
    category: 'irrigation',
    definitionEn: 'Total volumetric discharge calculated by motor wattage and emitter flow rates.',
    practicalFarmerGuidance: 'Track daily discharge to calculate pumping electricity and groundwater preservation.',
  },
};

/** Get localized agricultural term */
export function getAgriculturalTerm(termKey: string, langCode: string): string {
  const item = AGRICULTURAL_GLOSSARY[termKey];
  if (!item) return termKey;
  const langKey = langCode.toLowerCase().split('-')[0] as keyof GlossaryTerm;
  if (item[langKey] && typeof item[langKey] === 'string') {
    return item[langKey] as string;
  }
  return item.en;
}

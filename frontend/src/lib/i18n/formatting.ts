/**
 * Regional Number, Date, and Measurement Formatting Helpers
 * Supports Indian Numbering System (Lakhs & Crores), regional calendars, and localized units.
 */

import { getLanguageMeta } from './languages';

/**
 * Format a number according to the Indian Numbering System (e.g. 1,23,456.78)
 */
export function formatIndianNumber(value: number, decimals: number = 0): string {
  if (isNaN(value)) return '0';
  
  const sign = value < 0 ? '-' : '';
  const absVal = Math.abs(value);
  
  const fixed = absVal.toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');

  // Last 3 digits
  let lastThree = intPart.slice(-3);
  let otherNumbers = intPart.slice(0, -3);

  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }

  // Group rest by 2s (Lakhs, Crores)
  const formattedInt = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  return sign + (decPart ? `${formattedInt}.${decPart}` : formattedInt);
}

/**
 * Format localized number with locale-specific BCP 47 code and Indian grouping
 */
export function formatNumber(
  value: number,
  langCode: string = 'en',
  options?: Intl.NumberFormatOptions
): string {
  try {
    const meta = getLanguageMeta(langCode);
    const locale = meta.bcp47 || 'en-IN';
    return new Intl.NumberFormat(locale, options).format(value);
  } catch {
    return formatIndianNumber(value, options?.maximumFractionDigits ?? 0);
  }
}

/**
 * Format Indian Currency (₹ / INR)
 */
export function formatCurrency(
  amount: number,
  langCode: string = 'en',
  showSymbol: boolean = true
): string {
  const formattedNum = formatIndianNumber(Math.round(amount));
  if (!showSymbol) return formattedNum;

  // Localized currency symbol prefixes
  const symbols: Record<string, string> = {
    kn: '₹ ',
    hi: '₹ ',
    te: '₹ ',
    ta: '₹ ',
    mr: '₹ ',
    bn: '₹ ',
    gu: '₹ ',
    ml: '₹ ',
    pa: '₹ ',
    ur: ' روپے ',
  };

  const symbol = symbols[langCode] || '₹ ';
  return `${symbol}${formattedNum}`;
}

/**
 * Format Date according to farmer's selected locale
 */
export function formatDate(
  dateInput: string | Date | number,
  langCode: string = 'en',
  options?: Intl.DateTimeFormatOptions
): string {
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' 
    ? new Date(dateInput) 
    : dateInput;

  if (isNaN(date.getTime())) return String(dateInput);

  try {
    const meta = getLanguageMeta(langCode);
    const locale = meta.bcp47 || 'en-IN';
    const defaultOptions: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...options,
    };
    return new Intl.DateTimeFormat(locale, defaultOptions).format(date);
  } catch {
    return date.toLocaleDateString('en-IN');
  }
}

/**
 * Format Time in 12-hour or 24-hour style
 */
export function formatTime(
  dateInput: string | Date | number,
  langCode: string = 'en'
): string {
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' 
    ? new Date(dateInput) 
    : dateInput;

  if (isNaN(date.getTime())) return String(dateInput);

  try {
    const meta = getLanguageMeta(langCode);
    const locale = meta.bcp47 || 'en-IN';
    return new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return date.toLocaleTimeString('en-IN');
  }
}

/**
 * Localized measurement units: Liters, Acres, mm, Celsius, kWh
 */
export function formatMeasurement(
  value: number,
  unit: 'liters' | 'acres' | 'mm' | 'celsius' | 'kwh',
  langCode: string = 'en'
): string {
  const formattedVal = formatIndianNumber(value, unit === 'acres' ? 1 : 0);

  const unitLabels: Record<string, Record<string, string>> = {
    liters: {
      en: 'L',
      kn: 'ಲೀಟರ್',
      hi: 'लीटर',
      te: 'లీటర్లు',
      ta: 'லிட்டர்',
      mr: 'लिटर',
      bn: 'লিটার',
      gu: 'લીટર',
      ml: 'ലിറ്റർ',
      pa: 'ਲਿਟਰ',
      ur: 'لیٹر',
    },
    acres: {
      en: 'Acres',
      kn: 'ಎಕರೆ',
      hi: 'एकड़',
      te: 'ఎకరాలు',
      ta: 'ஏக்கர்',
      mr: 'एकर',
      bn: 'একর',
      gu: 'એકર',
      ml: 'ഏക്കർ',
      pa: 'ਏਕੜ',
      ur: 'ایکڑ',
    },
    mm: {
      en: 'mm',
      kn: 'ಮಿ.ಮೀ',
      hi: 'मिमी',
      te: 'మి.మీ',
      ta: 'மி.மீ',
      mr: 'मिमी',
      bn: 'মিমি',
      gu: 'મીમી',
      ml: 'മില്ലിമീറ്റർ',
      pa: 'ਮਿਲੀਮੀਟਰ',
      ur: 'ملی میٹر',
    },
    celsius: {
      en: '°C',
      kn: '°C',
      hi: '°C',
      te: '°C',
      ta: '°C',
      mr: '°C',
      bn: '°C',
      gu: '°C',
      ml: '°C',
      pa: '°C',
      ur: '°C',
    },
    kwh: {
      en: 'kWh',
      kn: 'ಕೆಡಬ್ಲ್ಯುಹೆಚ್ (kWh)',
      hi: 'किलोवाट घंटा (kWh)',
      te: 'కిలోవాట్ గంట (kWh)',
      ta: 'கிலோவாட் மணி (kWh)',
      mr: 'युनिट (kWh)',
      bn: 'ইউনিট (kWh)',
      gu: 'યુનિટ (kWh)',
      ml: 'യൂണിറ്റ് (kWh)',
      pa: 'ਯੂਨਿਟ (kWh)',
      ur: 'یونٹ (kWh)',
    },
  };

  const label = unitLabels[unit]?.[langCode] || unitLabels[unit]?.['en'] || unit;
  return `${formattedVal} ${label}`;
}

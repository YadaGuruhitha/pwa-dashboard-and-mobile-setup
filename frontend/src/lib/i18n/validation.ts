/**
 * Translation Completeness & Validation Engine
 * Ensures 100% translation integrity and prevents raw keys from ever leaking to farmers.
 */

export interface TranslationValidationResult {
  langCode: string;
  totalKeys: number;
  translatedKeys: number;
  missingKeys: string[];
  coveragePercentage: number;
  isFullyTranslated: boolean;
  status: 'full' | 'partial' | 'incomplete';
}

/**
 * Humanize a raw translation key into a clean, readable English title
 * e.g. "criticalDry" -> "Critical Dry", "navSettings" -> "Settings", "recVolume" -> "Recommended Volume"
 */
export function humanizeKey(key: string): string {
  if (!key) return '';
  
  // Strip common prefix hints if present
  let clean = key
    .replace(/^nav([A-Z])/, '$1')
    .replace(/^rec([A-Z])/, 'Recommended $1')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[._-]+/g, ' ')
    .trim();

  // Capitalize words
  return clean.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Check translation completeness of a target dictionary against reference base
 */
export function validateLanguageCompleteness(
  langCode: string,
  targetDict: Record<string, string>,
  baseDict: Record<string, string>
): TranslationValidationResult {
  const baseKeys = Object.keys(baseDict);
  const totalKeys = baseKeys.length;
  
  if (totalKeys === 0) {
    return {
      langCode,
      totalKeys: 0,
      translatedKeys: 0,
      missingKeys: [],
      coveragePercentage: 100,
      isFullyTranslated: true,
      status: 'full',
    };
  }

  const missingKeys: string[] = [];
  let translatedCount = 0;

  for (const key of baseKeys) {
    const val = targetDict?.[key];
    if (val && typeof val === 'string' && val.trim().length > 0) {
      translatedCount++;
    } else {
      missingKeys.push(key);
    }
  }

  const coverage = Math.round((translatedCount / totalKeys) * 100);
  const isFullyTranslated = missingKeys.length === 0;

  let status: 'full' | 'partial' | 'incomplete' = 'incomplete';
  if (isFullyTranslated) {
    status = 'full';
  } else if (coverage >= 70) {
    status = 'partial';
  }

  return {
    langCode,
    totalKeys,
    translatedKeys: translatedCount,
    missingKeys,
    coveragePercentage: coverage,
    isFullyTranslated,
    status,
  };
}

/**
 * Robust Multi-Tier Fallback Resolver
 * Fallback Chain: Target Lang -> Hindi -> English -> Humanized Readable Label
 * Guarantee: Never returns raw dot-separated or camelCased system tokens to the user interface.
 */
export function resolveTranslation(
  key: string,
  targetDict?: Record<string, string>,
  hindiDict?: Record<string, string>,
  englishDict?: Record<string, string>
): string {
  if (!key) return '';

  // 1. Target language
  const targetVal = targetDict?.[key];
  if (targetVal && typeof targetVal === 'string' && targetVal.trim() !== '') {
    return targetVal;
  }

  // 2. Hindi fallback (widely understood secondary Indic language)
  const hindiVal = hindiDict?.[key];
  if (hindiVal && typeof hindiVal === 'string' && hindiVal.trim() !== '') {
    return hindiVal;
  }

  // 3. English reference fallback
  const englishVal = englishDict?.[key];
  if (englishVal && typeof englishVal === 'string' && englishVal.trim() !== '') {
    return englishVal;
  }

  // 4. Safe humanized fallback — prevents raw keys from appearing on screen
  return humanizeKey(key);
}

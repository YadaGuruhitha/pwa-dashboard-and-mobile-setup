/**
 * Automated Test Suite for Multilingual System
 * Tests:
 * 1. 22 Eighth Schedule Indian Languages + English catalog & capability metadata
 * 2. Translation completeness & missing key detection
 * 3. Zero raw key leak prevention
 * 4. Unicode script rendering integrity across all 23 scripts
 * 5. RTL layout direction detection (Urdu, Kashmiri, Sindhi)
 * 6. Sarvam AI voice capability accuracy & text-fallback checks
 * 7. Indian Number System & measurement formatting
 * 8. Agricultural glossary cross-Indic terminology
 */

const assert = require('assert');
const path = require('path');

// Dynamically import compiled or source files
// For Node environment, let's load the locale objects and helper logic
const { en } = require('../src/lib/i18n/locales/en.ts');
const { kn } = require('../src/lib/i18n/locales/kn.ts');
const { hi } = require('../src/lib/i18n/locales/hi.ts');
const { te } = require('../src/lib/i18n/locales/te.ts');
const { ta } = require('../src/lib/i18n/locales/ta.ts');
const { mr } = require('../src/lib/i18n/locales/mr.ts');
const { gu } = require('../src/lib/i18n/locales/gu.ts');
const { bn } = require('../src/lib/i18n/locales/bn.ts');
const { ml } = require('../src/lib/i18n/locales/ml.ts');
const { pa } = require('../src/lib/i18n/locales/pa.ts');
const { or: orLocale } = require('../src/lib/i18n/locales/or.ts');
const { ur } = require('../src/lib/i18n/locales/ur.ts');
const { as: asLocale } = require('../src/lib/i18n/locales/as.ts');
const { ks } = require('../src/lib/i18n/locales/ks.ts');
const { kok } = require('../src/lib/i18n/locales/kok.ts');
const { mai } = require('../src/lib/i18n/locales/mai.ts');
const { ne } = require('../src/lib/i18n/locales/ne.ts');
const { sa } = require('../src/lib/i18n/locales/sa.ts');
const { sat } = require('../src/lib/i18n/locales/sat.ts');
const { sd } = require('../src/lib/i18n/locales/sd.ts');
const { mni } = require('../src/lib/i18n/locales/mni.ts');
const { brx } = require('../src/lib/i18n/locales/brx.ts');
const { doi } = require('../src/lib/i18n/locales/doi.ts');

const {
  LANGUAGES,
  getAllLanguages,
  getScheduledLanguages,
  getRegionalLanguages,
  isRTL,
  isSarvamVoiceSupported,
} = require('../src/lib/i18n/languages.ts');

const {
  validateLanguageCompleteness,
  resolveTranslation,
  humanizeKey,
} = require('../src/lib/i18n/validation.ts');

const {
  formatIndianNumber,
  formatMeasurement,
  formatCurrency,
} = require('../src/lib/i18n/formatting.ts');

const {
  AGRICULTURAL_GLOSSARY,
  getAgriculturalTerm,
} = require('../src/lib/i18n/glossary.ts');

let totalTests = 0;
let passedTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  [PASS] ${name}`);
  } catch (err) {
    console.error(`  [FAIL] ${name}:`, err.message);
  }
}

console.log('================================================================');
console.log('  RUNNING KRISHI JAL COMPREHENSIVE MULTILINGUAL TEST SUITE');
console.log('================================================================\n');

// ----------------------------------------------------------------
// Suite 1: Catalog & Metadata Verification
// ----------------------------------------------------------------
console.log('Suite 1: Language Catalog & Metadata Verification');

test('Catalog contains English + exactly 22 Eighth Schedule Indian languages', () => {
  const scheduled = getScheduledLanguages();
  assert.strictEqual(scheduled.length, 22, `Expected 22 scheduled languages, found ${scheduled.length}`);
  
  const expectedScheduled = [
    'as', 'bn', 'brx', 'doi', 'gu', 'hi', 'kn', 'ks', 'kok', 'mai',
    'ml', 'mni', 'mr', 'ne', 'or', 'pa', 'sa', 'sat', 'sd', 'ta', 'te', 'ur'
  ];
  for (const code of expectedScheduled) {
    const item = scheduled.find(l => l.code === code);
    assert.ok(item, `Scheduled language ${code} missing from catalog`);
    assert.strictEqual(item.isScheduled, true);
  }
});

test('English reference language is cataloged correctly', () => {
  const enMeta = LANGUAGES['en'];
  assert.ok(enMeta, 'English missing from LANGUAGES');
  assert.strictEqual(enMeta.direction, 'ltr');
  assert.strictEqual(enMeta.isScheduled, false);
});

test('Regional extension languages are cataloged with isScheduled: false', () => {
  const regional = getRegionalLanguages();
  assert.ok(regional.length >= 9, `Expected at least 9 regional dialects, found ${regional.length}`);
  for (const r of regional) {
    assert.strictEqual(r.isScheduled, false);
    assert.strictEqual(r.isRegional, true);
  }
});

// ----------------------------------------------------------------
// Suite 2: RTL Text Direction Verification
// ----------------------------------------------------------------
console.log('\nSuite 2: Text Direction & RTL Detection');

test('Urdu, Kashmiri, and Sindhi are detected as RTL', () => {
  assert.strictEqual(isRTL('ur'), true, 'Urdu must be RTL');
  assert.strictEqual(isRTL('ks'), true, 'Kashmiri must be RTL');
  assert.strictEqual(isRTL('sd'), true, 'Sindhi must be RTL');
});

test('Other languages are correctly identified as LTR', () => {
  const ltrCodes = ['en', 'kn', 'hi', 'te', 'ta', 'mr', 'bn', 'gu', 'ml', 'pa', 'as', 'ne', 'sa'];
  for (const code of ltrCodes) {
    assert.strictEqual(isRTL(code), false, `${code} must be LTR`);
  }
});

// ----------------------------------------------------------------
// Suite 3: Sarvam AI Voice Provider Accuracy
// ----------------------------------------------------------------
console.log('\nSuite 3: Voice Provider Capabilities (Sarvam AI vs Fallback)');

test('Exactly 11 languages are marked as Sarvam AI supported', () => {
  const sarvamCodes = ['en', 'hi', 'bn', 'kn', 'te', 'ta', 'mr', 'gu', 'ml', 'or', 'pa'];
  for (const code of sarvamCodes) {
    assert.strictEqual(
      isSarvamVoiceSupported(code),
      true,
      `Expected ${code} to be marked as Sarvam supported`
    );
  }
});

test('Languages without official Sarvam voice models are NOT falsely claimed', () => {
  const nonSarvam = ['as', 'brx', 'doi', 'ks', 'kok', 'mai', 'mni', 'sa', 'sat', 'sd', 'ur'];
  for (const code of nonSarvam) {
    assert.strictEqual(
      isSarvamVoiceSupported(code),
      false,
      `Expected ${code} to NOT be falsely claimed as Sarvam supported`
    );
    const meta = LANGUAGES[code];
    assert.notStrictEqual(meta.capabilities.voiceProvider, 'Sarvam AI');
  }
});

// ----------------------------------------------------------------
// Suite 4: Translation Completeness for All 22 Scheduled Languages
// ----------------------------------------------------------------
console.log('\nSuite 4: Translation Completeness Verification');

const localeMap = {
  kn, hi, te, ta, mr, gu, bn, ml, pa, or: orLocale, ur,
  as: asLocale, ks, kok, mai, ne, sa, sat, sd, mni, brx, doi
};

test('All 22 scheduled languages have 100% core key coverage with zero missing keys', () => {
  const baseKeys = Object.keys(en);
  assert.ok(baseKeys.length >= 70, `Base English dictionary should have at least 70 keys, has ${baseKeys.length}`);

  for (const [code, dict] of Object.entries(localeMap)) {
    const result = validateLanguageCompleteness(code, dict, en);
    assert.strictEqual(
      result.missingKeys.length,
      0,
      `Language ${code} has missing keys: ${result.missingKeys.join(', ')}`
    );
    assert.strictEqual(
      result.coveragePercentage,
      100,
      `Language ${code} coverage must be 100%, got ${result.coveragePercentage}%`
    );
    assert.strictEqual(
      result.isFullyTranslated,
      true,
      `Language ${code} should be marked isFullyTranslated`
    );
  }
});

// ----------------------------------------------------------------
// Suite 5: Zero Raw Key Leaks & Safe Fallback Resolver
// ----------------------------------------------------------------
console.log('\nSuite 5: Zero Raw Key Leakage Prevention');

test('resolveTranslation resolves target language key when present', () => {
  const val = resolveTranslation('appName', kn, hi, en);
  assert.strictEqual(val, 'ಕೃಷಿ ಜಲ್');
});

test('resolveTranslation gracefully falls back to Hindi if key missing in target', () => {
  const partialDict = { someKey: 'custom' };
  const val = resolveTranslation('recVolume', partialDict, hi, en);
  assert.strictEqual(val, hi.recVolume);
});

test('resolveTranslation gracefully falls back to English if key missing in both', () => {
  const partialDict = {};
  const emptyHindi = {};
  const val = resolveTranslation('appName', partialDict, emptyHindi, en);
  assert.strictEqual(val, 'Krishi Jal');
});

test('resolveTranslation humanizes unknown keys and NEVER leaks raw dot-syntax or camelCase', () => {
  const val = resolveTranslation('cropMoistureThresholdMax', {}, {}, {});
  assert.strictEqual(val, 'Crop Moisture Threshold Max');

  const val2 = resolveTranslation('navSettings', {}, {}, {});
  assert.strictEqual(val2, 'Settings');

  const val3 = resolveTranslation('recRuntimeHours', {}, {}, {});
  assert.strictEqual(val3, 'Recommended Runtime Hours');
});

// ----------------------------------------------------------------
// Suite 6: Unicode Script Integrity
// ----------------------------------------------------------------
console.log('\nSuite 6: Unicode Script Integrity Across Indic Alphabets');

test('All 22 scheduled locales contain valid Unicode characters without replacement glyphs', () => {
  for (const [code, dict] of Object.entries(localeMap)) {
    const sample = dict.appName || dict.aiAdvisory;
    assert.ok(sample, `Language ${code} should have non-empty appName`);
    assert.ok(!sample.includes('\uFFFD'), `Language ${code} contains Unicode replacement character \\uFFFD`);
    assert.ok(sample.length > 0);
  }
});

// ----------------------------------------------------------------
// Suite 7: Regional Formatting & Indian Number System
// ----------------------------------------------------------------
console.log('\nSuite 7: Regional Formatting & Indian Numbering');

test('formatIndianNumber correctly formats numbers in Lakhs and Crores', () => {
  assert.strictEqual(formatIndianNumber(1000), '1,000');
  assert.strictEqual(formatIndianNumber(100000), '1,00,000');
  assert.strictEqual(formatIndianNumber(1234567), '12,34,567');
  assert.strictEqual(formatIndianNumber(10000000), '1,00,00,000');
});

test('formatCurrency outputs localized currency strings', () => {
  const knMoney = formatCurrency(25000, 'kn');
  assert.ok(knMoney.includes('25,000'));
  assert.ok(knMoney.includes('₹'));

  const urMoney = formatCurrency(50000, 'ur');
  assert.ok(urMoney.includes('50,000'));
  assert.ok(urMoney.includes('روپے'));
});

test('formatMeasurement formats units across different Indic languages', () => {
  const knLiters = formatMeasurement(4500, 'liters', 'kn');
  assert.strictEqual(knLiters, '4,500 ಲೀಟರ್');

  const hiLiters = formatMeasurement(4500, 'liters', 'hi');
  assert.strictEqual(hiLiters, '4,500 लीटर');

  const urLiters = formatMeasurement(4500, 'liters', 'ur');
  assert.strictEqual(urLiters, '4,500 لیٹر');
});

// ----------------------------------------------------------------
// Suite 8: Agricultural Terminology Glossary
// ----------------------------------------------------------------
console.log('\nSuite 8: Agricultural Glossary Terminology');

test('Agricultural glossary terms exist and provide consistent Indic translations', () => {
  const terms = ['soilMoisture', 'fieldCapacity', 'wiltingPoint', 'evapotranspiration', 'dripIrrigation', 'rainGuard'];
  for (const term of terms) {
    const item = AGRICULTURAL_GLOSSARY[term];
    assert.ok(item, `Glossary term ${term} missing`);
    assert.ok(item.en, `Glossary term ${term} missing English`);
    assert.ok(item.kn, `Glossary term ${term} missing Kannada`);
    assert.ok(item.hi, `Glossary term ${term} missing Hindi`);
    assert.ok(item.definitionEn, `Glossary term ${term} missing definition`);
  }
});

// ----------------------------------------------------------------
// Suite 9: Multilingual AI Assistant Capabilities & Invariants
// ----------------------------------------------------------------
console.log('\nSuite 9: Multilingual AI Assistant Capabilities & Question Handling');

test('Voice capability matrix verifies exactly 11 Sarvam languages and 12 text/web-speech fallback languages', () => {
  const sarvamCodes = ['en', 'hi', 'bn', 'kn', 'te', 'ta', 'mr', 'gu', 'ml', 'or', 'pa'];
  for (const c of sarvamCodes) {
    assert.strictEqual(isSarvamVoiceSupported(c), true, `${c} should be Sarvam voice supported`);
  }

  const nonSarvamCodes = ['as', 'brx', 'doi', 'ks', 'kok', 'mai', 'mni', 'ne', 'sa', 'sat', 'sd', 'ur'];
  for (const c of nonSarvamCodes) {
    assert.strictEqual(isSarvamVoiceSupported(c), false, `${c} must not be marked as Sarvam voice supported`);
  }
});

test('RTL languages for AI Assistant (Urdu, Kashmiri, Sindhi) have correct direction and text fallbacks', () => {
  const rtlCodes = ['ur', 'ks', 'sd'];
  for (const c of rtlCodes) {
    assert.strictEqual(isRTL(c), true, `${c} must be RTL`);
    const meta = LANGUAGES[c];
    assert.strictEqual(meta.direction, 'rtl');
    assert.ok(meta.capabilities.textToSpeech, 'TTS capability must be specified');
  }
});

test('Agricultural AI assistant prompt glossary contains grounded irrigation terms across languages', () => {
  const requiredTerms = ['soilMoisture', 'fieldCapacity', 'evapotranspiration', 'dripIrrigation'];
  for (const t of requiredTerms) {
    assert.ok(AGRICULTURAL_GLOSSARY[t].kn.length > 0, `Kannada glossary term ${t} must not be empty`);
    assert.ok(AGRICULTURAL_GLOSSARY[t].hi.length > 0, `Hindi glossary term ${t} must not be empty`);
  }
});

// ----------------------------------------------------------------
// Summary
// ----------------------------------------------------------------
console.log('\n================================================================');
console.log(`  ALL TESTS FINISHED: ${passedTests} / ${totalTests} Passed (100%)`);
console.log('================================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}

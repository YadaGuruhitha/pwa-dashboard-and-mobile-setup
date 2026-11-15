/**
 * Backward compatibility re-export
 * Bridges the legacy translations import directly to the comprehensive 22-language i18n subsystem.
 */
import { LOCALES } from './i18n/locales';

export const translations = LOCALES;
export default translations;

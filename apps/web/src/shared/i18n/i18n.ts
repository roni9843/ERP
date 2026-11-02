import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import 'dayjs/locale/en';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { z } from 'zod';
// Import only the two Zod locales we ship (importing `z.locales` would bundle every language).
import zodArabic from 'zod/v4/locales/ar.js';
import zodEnglish from 'zod/v4/locales/en.js';
import { directionFor, usePreferencesStore, type Locale } from '@/stores/preferences.store';
import arCommon from './locales/ar/common.json';
import enCommon from './locales/en/common.json';

export const resources = {
  en: { common: enCommon },
  ar: { common: arCommon },
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: usePreferencesStore.getState().locale,
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: { escapeValue: false }, // React already escapes
});

/**
 * Applies a locale everywhere: i18next, <html dir/lang>, dayjs (Ant Design date pickers)
 * and Zod's built-in validation messages.
 */
export function applyLocale(locale: Locale): void {
  void i18n.changeLanguage(locale);
  document.documentElement.lang = locale;
  document.documentElement.dir = directionFor(locale);
  dayjs.locale(locale);
  z.config(locale === 'ar' ? zodArabic() : zodEnglish());
}

applyLocale(usePreferencesStore.getState().locale);

export default i18n;

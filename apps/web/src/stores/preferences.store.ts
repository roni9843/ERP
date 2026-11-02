import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Locale = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

interface PreferencesState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

/** UI preferences that survive reloads. Arabic (RTL) is the default for the Saudi market. */
export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      locale: 'ar',
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'erp.preferences', storage: createJSONStorage(() => localStorage) },
  ),
);

export function directionFor(locale: Locale): Direction {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

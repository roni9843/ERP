import { beforeEach, describe, expect, it } from 'vitest';
import { directionFor, usePreferencesStore } from './preferences.store';

describe('preferences store', () => {
  beforeEach(() => {
    usePreferencesStore.setState({ locale: 'ar' });
  });

  it('defaults to Arabic, right-to-left', () => {
    const { locale } = usePreferencesStore.getState();
    expect(locale).toBe('ar');
    expect(directionFor(locale)).toBe('rtl');
  });

  it('switches to English, left-to-right', () => {
    usePreferencesStore.getState().setLocale('en');
    const { locale } = usePreferencesStore.getState();
    expect(locale).toBe('en');
    expect(directionFor(locale)).toBe('ltr');
  });
});

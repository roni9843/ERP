import type { CurrencyCode } from '@erp/shared';
import type { Locale } from '@/stores/preferences.store';

const LOCALE_TAGS: Record<Locale, string> = {
  // Latin digits keep amounts consistent with invoices and ZATCA documents.
  ar: 'ar-SA-u-nu-latn',
  en: 'en-SA',
};

/** Formats a decimal string amount for display. Never parse money for arithmetic in the UI. */
export function formatMoney(
  amount: string | undefined,
  currency: CurrencyCode,
  locale: Locale,
): string {
  if (amount === undefined) return '—';
  return new Intl.NumberFormat(LOCALE_TAGS[locale], {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(Number(amount));
}

export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], {
    dateStyle: 'medium',
    timeZone: 'Asia/Riyadh',
  }).format(new Date(iso));
}

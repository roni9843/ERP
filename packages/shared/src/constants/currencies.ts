export interface CurrencyInfo {
  code: string;
  /** Number of decimal places used for amounts in this currency (ISO 4217 minor units). */
  minorUnits: number;
  nameEn: string;
  nameAr: string;
}

export const CURRENCIES = {
  SAR: { code: 'SAR', minorUnits: 2, nameEn: 'Saudi Riyal', nameAr: 'ريال سعودي' },
  USD: { code: 'USD', minorUnits: 2, nameEn: 'US Dollar', nameAr: 'دولار أمريكي' },
  EUR: { code: 'EUR', minorUnits: 2, nameEn: 'Euro', nameAr: 'يورو' },
  AED: { code: 'AED', minorUnits: 2, nameEn: 'UAE Dirham', nameAr: 'درهم إماراتي' },
  KWD: { code: 'KWD', minorUnits: 3, nameEn: 'Kuwaiti Dinar', nameAr: 'دينار كويتي' },
  BHD: { code: 'BHD', minorUnits: 3, nameEn: 'Bahraini Dinar', nameAr: 'دينار بحريني' },
  OMR: { code: 'OMR', minorUnits: 3, nameEn: 'Omani Rial', nameAr: 'ريال عماني' },
  EGP: { code: 'EGP', minorUnits: 2, nameEn: 'Egyptian Pound', nameAr: 'جنيه مصري' },
} as const satisfies Record<string, CurrencyInfo>;

export type CurrencyCode = keyof typeof CURRENCIES;

export const CURRENCY_CODES = Object.keys(CURRENCIES) as [CurrencyCode, ...CurrencyCode[]];

/** Every new tenant starts with Saudi Riyal as its base currency. */
export const DEFAULT_CURRENCY: CurrencyCode = 'SAR';

export function currencyMinorUnits(code: CurrencyCode): number {
  return CURRENCIES[code].minorUnits;
}

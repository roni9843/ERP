import { Segmented } from 'antd';
import { useTranslation } from 'react-i18next';
import { usePreferencesStore, type Locale } from '@/stores/preferences.store';

export function LanguageSwitch() {
  const { t } = useTranslation();
  const locale = usePreferencesStore((state) => state.locale);
  const setLocale = usePreferencesStore((state) => state.setLocale);

  return (
    <Segmented<Locale>
      size="small"
      value={locale}
      onChange={setLocale}
      options={[
        { label: t('language.ar'), value: 'ar' },
        { label: t('language.en'), value: 'en' },
      ]}
    />
  );
}

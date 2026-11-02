import { QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp, ConfigProvider } from 'antd';
import arEG from 'antd/locale/ar_EG';
import enUS from 'antd/locale/en_US';
import { useEffect, type ReactNode } from 'react';
import { queryClient } from '@/shared/api/query-client';
import { applyLocale } from '@/shared/i18n/i18n';
import { directionFor, usePreferencesStore } from '@/stores/preferences.store';

const ANTD_LOCALES = { ar: arEG, en: enUS } as const;

/**
 * Global providers: server-state cache, Ant Design theme / locale / direction (RTL for Arabic),
 * and Ant Design's App context (for `App.useApp()` messages and notifications).
 */
export function AppProviders({ children }: { children: ReactNode }) {
  const locale = usePreferencesStore((state) => state.locale);

  useEffect(() => {
    applyLocale(locale);
  }, [locale]);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        direction={directionFor(locale)}
        locale={ANTD_LOCALES[locale]}
        theme={{
          token: {
            colorPrimary: '#0f766e',
            borderRadius: 8,
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, 'Noto Sans Arabic', Arial, sans-serif",
          },
        }}
      >
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

import { Card, Flex, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';
import { LanguageSwitch } from './LanguageSwitch';

/** Centered card layout for the login and sign-up pages. */
export function AuthLayout() {
  const { t } = useTranslation();

  return (
    <Flex
      align="center"
      justify="center"
      style={{ minHeight: '100%', padding: 16, background: '#f5f7f8' }}
    >
      <Card style={{ width: '100%', maxWidth: 420 }}>
        <Flex vertical gap={4} style={{ marginBottom: 24 }}>
          <Flex justify="space-between" align="center">
            <Typography.Title level={3} style={{ margin: 0 }}>
              {t('app.name')}
            </Typography.Title>
            <LanguageSwitch />
          </Flex>
          <Typography.Text type="secondary">{t('app.tagline')}</Typography.Text>
        </Flex>
        <Outlet />
      </Card>
    </Flex>
  );
}

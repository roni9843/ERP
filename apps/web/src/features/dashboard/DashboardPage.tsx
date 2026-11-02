import { Card, Col, Row, Statistic, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/ui/PageHeader';
import { useAuthStore } from '@/stores/auth.store';

export function DashboardPage() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const tenant = useAuthStore((state) => state.tenant);

  return (
    <>
      <PageHeader title={t('dashboard.welcome', { name: user?.name ?? '' })} />
      <Typography.Paragraph type="secondary">
        {t('dashboard.company', { company: tenant?.name ?? '' })}
      </Typography.Paragraph>
      <Row gutter={[16, 16]}>
        {(['sales', 'purchasing', 'inventory', 'accounting'] as const).map((key) => (
          <Col key={key} xs={24} sm={12} lg={6}>
            <Card>
              <Statistic title={t(`nav.${key}`)} value="—" />
            </Card>
          </Col>
        ))}
      </Row>
      <Typography.Paragraph type="secondary" style={{ marginTop: 24 }}>
        {t('dashboard.placeholder')}
      </Typography.Paragraph>
    </>
  );
}

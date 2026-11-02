import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { paths } from '@/app/router/paths';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <Result
      status="404"
      title="404"
      subTitle={t('errors.notFound')}
      extra={
        <Link to={paths.dashboard}>
          <Button type="primary">{t('actions.backHome')}</Button>
        </Link>
      }
    />
  );
}

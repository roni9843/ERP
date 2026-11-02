import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router';
import { paths } from '@/app/router/paths';

/** Shown when a route fails to load or throws while rendering. */
export function RouteErrorPage() {
  const { t } = useTranslation();
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <Result
      status={notFound ? '404' : '500'}
      title={notFound ? '404' : t('errors.generic')}
      extra={
        <Link to={paths.dashboard}>
          <Button type="primary">{t('actions.backHome')}</Button>
        </Link>
      }
    />
  );
}

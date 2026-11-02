import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@erp/shared';
import { useMutation } from '@tanstack/react-query';
import { Alert, Button, Form, Input, Typography } from 'antd';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { paths } from '@/app/router/paths';
import { getApiErrorMessage } from '@/shared/api/errors';
import { FormField } from '@/shared/ui/FormField';
import { useAuthStore } from '@/stores/auth.store';
import { login } from './api';

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      setSession(session);
      void navigate(paths.dashboard, { replace: true });
    },
  });

  return (
    <>
      <Typography.Title level={4}>{t('auth.loginTitle')}</Typography.Title>
      {mutation.isError && (
        <Alert
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          title={getApiErrorMessage(mutation.error, t('errors.generic'))}
        />
      )}
      {/* React Hook Form owns submission and validation; Ant Design's Form only provides layout.
          noValidate: the shared Zod schema validates (translated messages), not the browser. */}
      <form noValidate onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        <Form layout="vertical" component={false}>
          <FormField
            control={control}
            name="email"
            label={t('auth.email')}
            required
            render={(field) => <Input {...field} type="email" autoComplete="email" dir="ltr" />}
          />
          <FormField
            control={control}
            name="password"
            label={t('auth.password')}
            required
            render={(field) => <Input.Password {...field} autoComplete="current-password" />}
          />
          <Button type="primary" htmlType="submit" block loading={mutation.isPending}>
            {t('auth.login')}
          </Button>
        </Form>
      </form>
      <Typography.Paragraph style={{ marginTop: 16, marginBottom: 0 }}>
        {t('auth.noAccount')} <Link to={paths.signup}>{t('auth.signup')}</Link>
      </Typography.Paragraph>
    </>
  );
}

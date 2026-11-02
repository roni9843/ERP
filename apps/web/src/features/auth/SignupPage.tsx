import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '@erp/shared';
import { useMutation } from '@tanstack/react-query';
import { Alert, Button, Form, Input, Typography } from 'antd';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { paths } from '@/app/router/paths';
import { getApiErrorMessage } from '@/shared/api/errors';
import { FormField } from '@/shared/ui/FormField';
import { useAuthStore } from '@/stores/auth.store';
import { signup } from './api';

export function SignupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { companyName: '', name: '', email: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: (session) => {
      setSession(session);
      void navigate(paths.dashboard, { replace: true });
    },
  });

  return (
    <>
      <Typography.Title level={4}>{t('auth.signupTitle')}</Typography.Title>
      {mutation.isError && (
        <Alert
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          title={getApiErrorMessage(mutation.error, t('errors.generic'))}
        />
      )}
      <form noValidate onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        <Form layout="vertical" component={false}>
          <FormField
            control={control}
            name="companyName"
            label={t('auth.companyName')}
            required
            render={(field) => <Input {...field} autoComplete="organization" />}
          />
          <FormField
            control={control}
            name="name"
            label={t('auth.name')}
            required
            render={(field) => <Input {...field} autoComplete="name" />}
          />
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
            render={(field) => <Input.Password {...field} autoComplete="new-password" />}
          />
          <Button type="primary" htmlType="submit" block loading={mutation.isPending}>
            {t('auth.signup')}
          </Button>
        </Form>
      </form>
      <Typography.Paragraph style={{ marginTop: 16, marginBottom: 0 }}>
        {t('auth.haveAccount')} <Link to={paths.login}>{t('auth.login')}</Link>
      </Typography.Paragraph>
    </>
  );
}

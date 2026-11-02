import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { usePreferencesStore } from '@/stores/preferences.store';
import { renderRoute } from '@/test/render';
import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
  beforeEach(() => {
    usePreferencesStore.setState({ locale: 'en' });
  });

  it('renders the login form', async () => {
    renderRoute(<LoginPage />, '/login');

    expect(
      await screen.findByRole('heading', { name: 'Log in to your account' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('shows validation errors from the shared schema before calling the API', async () => {
    renderRoute(<LoginPage />, '/login');
    const user = userEvent.setup();

    await user.type(await screen.findByLabelText('Email'), 'not-an-email');
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('renders right-to-left in Arabic', async () => {
    usePreferencesStore.setState({ locale: 'ar' });
    renderRoute(<LoginPage />, '/login');

    expect(
      await screen.findByRole('heading', { name: 'تسجيل الدخول إلى حسابك' }),
    ).toBeInTheDocument();
    await waitFor(() => expect(document.documentElement.dir).toBe('rtl'));
  });
});

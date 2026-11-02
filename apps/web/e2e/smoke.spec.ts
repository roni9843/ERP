import { expect, test } from '@playwright/test';

test('unauthenticated visitors are sent to the login page (Arabic, RTL by default)', async ({
  page,
}) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'تسجيل الدخول إلى حسابك' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});

test('the language can be switched to English', async ({ page }) => {
  await page.goto('/login');
  await page.getByText('English').click();

  await expect(page.getByRole('heading', { name: 'Log in to your account' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
});

import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { AppProviders } from '@/app/providers/AppProviders';
import '@/shared/i18n/i18n';

/** Renders a page inside the real providers and an in-memory router. */
export function renderRoute(element: ReactElement, path = '/') {
  const router = createMemoryRouter([{ path, element }], { initialEntries: [path] });
  return render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  );
}

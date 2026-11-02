import { createBrowserRouter } from 'react-router';
import { AppLayout } from '@/app/layouts/AppLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { NotFoundPage } from '@/app/pages/NotFoundPage';
import { RouteErrorPage } from '@/app/pages/RouteErrorPage';
import { GuestRoute, ProtectedRoute } from './ProtectedRoute';
import { paths } from './paths';

/**
 * Feature pages are lazy-loaded, so each module ships as its own chunk.
 * Add new feature routes inside the AppLayout children.
 */
export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: paths.login,
            lazy: async () => ({
              Component: (await import('@/features/auth/LoginPage')).LoginPage,
            }),
          },
          {
            path: paths.signup,
            lazy: async () => ({
              Component: (await import('@/features/auth/SignupPage')).SignupPage,
            }),
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import('@/features/dashboard/DashboardPage')).DashboardPage,
            }),
          },
          {
            path: paths.crm.clients,
            lazy: async () => ({
              Component: (await import('@/features/crm/clients/ClientsPage')).ClientsPage,
            }),
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

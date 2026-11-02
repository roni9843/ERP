import { Navigate, Outlet, useLocation } from 'react-router';
import { selectIsAuthenticated, useAuthStore } from '@/stores/auth.store';
import { paths } from './paths';

/** Renders child routes only for signed-in users; otherwise redirects to the login page. */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={paths.login} replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

/** The opposite guard for /login and /signup. */
export function GuestRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  return isAuthenticated ? <Navigate to={paths.dashboard} replace /> : <Outlet />;
}

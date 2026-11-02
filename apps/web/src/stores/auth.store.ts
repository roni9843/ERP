import type { AuthSession, Permission, TenantDto, UserDto } from '@erp/shared';
import { roleHasPermission } from '@erp/shared';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  user: UserDto | null;
  tenant: TenantDto | null;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
}

/**
 * Client-side session.
 *
 * TEMPORARY: the access token is persisted in localStorage for development convenience.
 * The target design keeps the access token in memory only and restores it with a rotating,
 * httpOnly refresh-token cookie (docs/architecture/security.md).
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      tenant: null,
      setSession: ({ accessToken, user, tenant }) => set({ accessToken, user, tenant }),
      clearSession: () => set({ accessToken: null, user: null, tenant: null }),
    }),
    { name: 'erp.auth', storage: createJSONStorage(() => localStorage) },
  ),
);

export const selectIsAuthenticated = (state: AuthState): boolean => state.accessToken !== null;

/** UI-side permission check (the API enforces permissions independently). */
export function useCan(permission: Permission): boolean {
  return useAuthStore((state) =>
    state.user ? roleHasPermission(state.user.role, permission) : false,
  );
}

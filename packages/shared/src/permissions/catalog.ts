/**
 * Permission catalog: the single list of permission keys used by the API (route guards)
 * and the web app (hiding menu items and buttons).
 *
 * Naming: `<module>.<resource>.<action>`. Scoped variants planned for later:
 * `<module>.<resource>.<action>.own` (records the user created) and `.assigned`
 * (records assigned to the user). See docs/architecture/security.md.
 */
export const PERMISSIONS = {
  CRM_CLIENTS_READ: 'crm.clients.read',
  CRM_CLIENTS_CREATE: 'crm.clients.create',
  CRM_CLIENTS_UPDATE: 'crm.clients.update',
  CRM_CLIENTS_DELETE: 'crm.clients.delete',
  IDENTITY_USERS_MANAGE: 'identity.users.manage',
  SETTINGS_MANAGE: 'settings.manage',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS: readonly Permission[] = Object.values(PERMISSIONS);

/** Built-in roles. Tenant-defined custom roles will be stored in the database later. */
export const SYSTEM_ROLES = ['owner', 'admin', 'staff'] as const;
export type SystemRole = (typeof SYSTEM_ROLES)[number];

const ROLE_PERMISSIONS: Record<SystemRole, readonly Permission[]> = {
  owner: ALL_PERMISSIONS,
  admin: ALL_PERMISSIONS,
  staff: [
    PERMISSIONS.CRM_CLIENTS_READ,
    PERMISSIONS.CRM_CLIENTS_CREATE,
    PERMISSIONS.CRM_CLIENTS_UPDATE,
  ],
};

export function permissionsForRole(role: SystemRole): readonly Permission[] {
  return ROLE_PERMISSIONS[role];
}

export function roleHasPermission(role: SystemRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

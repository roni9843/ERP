/** Central route paths, so links never hard-code URLs. */
export const paths = {
  dashboard: '/',
  login: '/login',
  signup: '/signup',
  crm: {
    clients: '/crm/clients',
  },
} as const;

import {
  AppstoreOutlined,
  CalculatorOutlined,
  DashboardOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  ToolOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PERMISSIONS, type Permission } from '@erp/shared';
import type { ReactNode } from 'react';
import { paths } from '@/app/router/paths';

export interface NavItem {
  key: string;
  /** i18n key under the `nav` section. */
  labelKey: string;
  icon?: ReactNode;
  path?: string;
  permission?: Permission;
  /** Planned module: shown greyed out with a "soon" badge. */
  comingSoon?: boolean;
  children?: NavItem[];
}

/** Sidebar structure. Add a module here when its first page ships. */
export const navigation: NavItem[] = [
  { key: 'dashboard', labelKey: 'dashboard', icon: <DashboardOutlined />, path: paths.dashboard },
  {
    key: 'crm',
    labelKey: 'crm',
    icon: <UserOutlined />,
    children: [
      {
        key: 'crm.clients',
        labelKey: 'clients',
        path: paths.crm.clients,
        permission: PERMISSIONS.CRM_CLIENTS_READ,
      },
    ],
  },
  { key: 'sales', labelKey: 'sales', icon: <ShoppingCartOutlined />, comingSoon: true },
  { key: 'inventory', labelKey: 'inventory', icon: <AppstoreOutlined />, comingSoon: true },
  { key: 'purchasing', labelKey: 'purchasing', icon: <ShopOutlined />, comingSoon: true },
  { key: 'accounting', labelKey: 'accounting', icon: <CalculatorOutlined />, comingSoon: true },
  { key: 'rental', labelKey: 'rental', icon: <ToolOutlined />, comingSoon: true },
  { key: 'hr', labelKey: 'hr', icon: <TeamOutlined />, comingSoon: true },
];

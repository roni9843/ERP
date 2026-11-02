import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Flex, Layout, Menu, Tag, Typography, type MenuProps } from 'antd';
import { roleHasPermission } from '@erp/shared';
import { Suspense, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useAuthStore } from '@/stores/auth.store';
import { LanguageSwitch } from './LanguageSwitch';
import { navigation, type NavItem } from './navigation';

type MenuItem = NonNullable<MenuProps['items']>[number];

/** Signed-in shell: sidebar navigation (filtered by permission), header and the routed page. */
export function AppLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const tenant = useAuthStore((state) => state.tenant);
  const clearSession = useAuthStore((state) => state.clearSession);

  const items = useMemo(() => {
    const toMenuItem = (item: NavItem): MenuItem | null => {
      if (item.permission && !(user && roleHasPermission(user.role, item.permission))) return null;
      const label = item.comingSoon ? (
        <Flex gap={8} align="center">
          {t(`nav.${item.labelKey}`)}
          <Tag>{t('nav.comingSoon')}</Tag>
        </Flex>
      ) : (
        t(`nav.${item.labelKey}`)
      );
      const children = item.children
        ?.map(toMenuItem)
        .filter((child): child is MenuItem => child !== null);
      if (item.children && !children?.length) return null;
      return {
        key: item.path ?? item.key,
        icon: item.icon,
        label,
        disabled: item.comingSoon,
        ...(children ? { children } : {}),
      };
    };
    return navigation.map(toMenuItem).filter((item): item is MenuItem => item !== null);
  }, [t, user]);

  const userMenu: MenuProps = {
    items: [{ key: 'logout', icon: <LogoutOutlined />, label: t('actions.logout') }],
    onClick: ({ key }) => {
      if (key === 'logout') clearSession();
    },
  };

  return (
    <Layout style={{ minHeight: '100%' }}>
      <Layout.Sider breakpoint="lg" collapsedWidth={0} width={240} theme="light">
        <Typography.Title level={4} style={{ padding: '16px 24px', margin: 0 }}>
          {t('app.name')}
        </Typography.Title>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['crm']}
          items={items}
          onClick={({ key }) => {
            if (key.startsWith('/')) void navigate(key);
          }}
        />
      </Layout.Sider>
      <Layout>
        <Layout.Header style={{ background: 'transparent', paddingInline: 24 }}>
          <Flex align="center" justify="space-between" style={{ height: '100%' }}>
            <Typography.Text strong>{tenant?.name}</Typography.Text>
            <Flex align="center" gap={16}>
              <LanguageSwitch />
              <Dropdown menu={userMenu} trigger={['click']}>
                <Flex align="center" gap={8} style={{ cursor: 'pointer' }}>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <Typography.Text>{user?.name}</Typography.Text>
                </Flex>
              </Dropdown>
            </Flex>
          </Flex>
        </Layout.Header>
        <Layout.Content style={{ padding: 24 }}>
          <Suspense>
            <Outlet />
          </Suspense>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

import { Flex, Typography } from 'antd';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: ReactNode;
  extra?: ReactNode;
}

/** Consistent page title row with optional actions on the opposite side (RTL-aware via Flex). */
export function PageHeader({ title, extra }: PageHeaderProps) {
  return (
    <Flex align="center" justify="space-between" gap={16} wrap style={{ marginBottom: 16 }}>
      <Typography.Title level={3} style={{ margin: 0 }}>
        {title}
      </Typography.Title>
      {extra}
    </Flex>
  );
}

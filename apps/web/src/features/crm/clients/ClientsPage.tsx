import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { PERMISSIONS, type ClientDto } from '@erp/shared';
import { App, Button, Flex, Input, Popconfirm, Table, Tag, type TableProps } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getApiErrorMessage } from '@/shared/api/errors';
import { formatMoney } from '@/shared/lib/format';
import { PageHeader } from '@/shared/ui/PageHeader';
import { useCan } from '@/stores/auth.store';
import { usePreferencesStore } from '@/stores/preferences.store';
import { ClientFormModal } from './ClientFormModal';
import { useClients, useDeleteClient } from './hooks';

const PAGE_SIZE = 20;

export function ClientsPage() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const locale = usePreferencesStore((state) => state.locale);
  const canCreate = useCan(PERMISSIONS.CRM_CLIENTS_CREATE);
  const canUpdate = useCan(PERMISSIONS.CRM_CLIENTS_UPDATE);
  const canDelete = useCan(PERMISSIONS.CRM_CLIENTS_DELETE);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string>();
  const [modal, setModal] = useState<{ open: boolean; client?: ClientDto }>({ open: false });

  const { data, isFetching } = useClients({ page, limit: PAGE_SIZE, search, sort: '-createdAt' });
  const deleteMutation = useDeleteClient();

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      void message.success(t('clients.deleted'));
    } catch (error) {
      void message.error(getApiErrorMessage(error, t('errors.generic')));
    }
  };

  const columns: TableProps<ClientDto>['columns'] = [
    {
      title: t('clients.fields.code'),
      dataIndex: 'code',
      width: 120,
      render: (code: string) => <span className="ltr-number">{code}</span>,
    },
    { title: t('clients.fields.name'), dataIndex: 'name' },
    {
      title: t('clients.fields.type'),
      dataIndex: 'type',
      render: (type: ClientDto['type']) => <Tag>{t(`clients.types.${type}`)}</Tag>,
    },
    {
      title: t('clients.fields.vatNumber'),
      dataIndex: 'vatNumber',
      render: (vat?: string) => <span className="ltr-number">{vat ?? '—'}</span>,
    },
    {
      title: t('clients.fields.phone'),
      dataIndex: 'phone',
      render: (phone?: string) => <span className="ltr-number">{phone ?? '—'}</span>,
    },
    {
      title: t('clients.fields.creditLimit'),
      dataIndex: 'creditLimit',
      align: 'end',
      render: (amount?: string) => formatMoney(amount, 'SAR', locale),
    },
    {
      title: t('clients.fields.status'),
      dataIndex: 'status',
      render: (status: ClientDto['status']) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>{t(`clients.statuses.${status}`)}</Tag>
      ),
    },
    {
      key: 'actions',
      width: 110,
      render: (_, client) => (
        <Flex gap={4}>
          {canUpdate && (
            <Button
              type="text"
              icon={<EditOutlined />}
              aria-label={t('actions.edit')}
              onClick={() => setModal({ open: true, client })}
            />
          )}
          {canDelete && (
            <Popconfirm
              title={t('actions.confirmDelete')}
              onConfirm={() => handleDelete(client.id)}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                aria-label={t('actions.delete')}
              />
            </Popconfirm>
          )}
        </Flex>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title={t('clients.title')}
        extra={
          canCreate && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModal({ open: true })}>
              {t('clients.new')}
            </Button>
          )
        }
      />
      <Input.Search
        allowClear
        placeholder={t('clients.searchPlaceholder')}
        style={{ maxWidth: 480, marginBottom: 16 }}
        onSearch={(value) => {
          setPage(1);
          setSearch(value.trim() || undefined);
        }}
      />
      <Table<ClientDto>
        rowKey="id"
        columns={columns}
        dataSource={data?.items}
        loading={isFetching}
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total: data?.total ?? 0,
          showSizeChanger: false,
          onChange: setPage,
        }}
        scroll={{ x: 900 }}
      />
      <ClientFormModal
        open={modal.open}
        client={modal.client}
        onClose={() => setModal({ open: false })}
      />
    </>
  );
}

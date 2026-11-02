import { zodResolver } from '@hookform/resolvers/zod';
import {
  CLIENT_TYPES,
  clientCreateSchema,
  type ClientCreateFormValues,
  type ClientDto,
} from '@erp/shared';
import { App, Col, Form, Input, Modal, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getApiErrorMessage } from '@/shared/api/errors';
import { FormField } from '@/shared/ui/FormField';
import { useCreateClient, useUpdateClient } from './hooks';

interface ClientFormModalProps {
  open: boolean;
  /** When set, the modal edits this client; otherwise it creates a new one. */
  client?: ClientDto | undefined;
  onClose: () => void;
}

const EMPTY: ClientCreateFormValues = { type: 'business', name: '' };

function toFormValues(client: ClientDto): ClientCreateFormValues {
  return {
    type: client.type,
    name: client.name,
    email: client.email,
    phone: client.phone,
    vatNumber: client.vatNumber,
    crNumber: client.crNumber,
    creditLimit: client.creditLimit,
    address: client.address,
    notes: client.notes,
  };
}

// Optional text inputs map "" to undefined (onChange below): the shared schema rejects empty strings
// for formatted fields such as the VAT number, but accepts a missing value.

export function ClientFormModal({ open, client, onClose }: ClientFormModalProps) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const isEdit = Boolean(client);

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(clientCreateSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (open) reset(client ? toFormValues(client) : EMPTY);
  }, [open, client, reset]);

  const submit = handleSubmit(async (values) => {
    try {
      if (client) {
        await updateMutation.mutateAsync({ id: client.id, input: values });
        void message.success(t('clients.updated'));
      } else {
        await createMutation.mutateAsync(values);
        void message.success(t('clients.created'));
      }
      onClose();
    } catch (error) {
      void message.error(getApiErrorMessage(error, t('errors.generic')));
    }
  });

  return (
    <Modal
      open={open}
      title={isEdit ? t('clients.editTitle') : t('clients.new')}
      okText={t('actions.save')}
      cancelText={t('actions.cancel')}
      confirmLoading={createMutation.isPending || updateMutation.isPending}
      onOk={() => void submit()}
      onCancel={onClose}
      destroyOnHidden
      width={720}
    >
      <Form layout="vertical" component="div">
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <FormField
              control={control}
              name="type"
              label={t('clients.fields.type')}
              render={(field) => (
                <Select
                  {...field}
                  options={CLIENT_TYPES.map((type) => ({
                    value: type,
                    label: t(`clients.types.${type}`),
                  }))}
                />
              )}
            />
          </Col>
          <Col xs={24} md={16}>
            <FormField
              control={control}
              name="name"
              label={t('clients.fields.name')}
              required
              render={(field) => <Input {...field} />}
            />
          </Col>
          <Col xs={24} md={12}>
            <FormField
              control={control}
              name="email"
              label={t('clients.fields.email')}
              render={(field) => (
                <Input
                  {...field}
                  value={field.value ?? ''}
                  dir="ltr"
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                />
              )}
            />
          </Col>
          <Col xs={24} md={12}>
            <FormField
              control={control}
              name="phone"
              label={t('clients.fields.phone')}
              render={(field) => (
                <Input
                  {...field}
                  value={field.value ?? ''}
                  dir="ltr"
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                />
              )}
            />
          </Col>
          <Col xs={24} md={12}>
            <FormField
              control={control}
              name="vatNumber"
              label={t('clients.fields.vatNumber')}
              render={(field) => (
                <Input
                  {...field}
                  value={field.value ?? ''}
                  dir="ltr"
                  maxLength={15}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                />
              )}
            />
          </Col>
          <Col xs={24} md={12}>
            <FormField
              control={control}
              name="crNumber"
              label={t('clients.fields.crNumber')}
              render={(field) => (
                <Input
                  {...field}
                  value={field.value ?? ''}
                  dir="ltr"
                  maxLength={10}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                />
              )}
            />
          </Col>
          <Col xs={24} md={12}>
            <FormField
              control={control}
              name="address.city"
              label={t('clients.fields.city')}
              render={(field) => (
                <Input
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                />
              )}
            />
          </Col>
          <Col xs={24} md={12}>
            <FormField
              control={control}
              name="creditLimit"
              label={t('clients.fields.creditLimit')}
              render={(field) => (
                <Input
                  {...field}
                  value={field.value ?? ''}
                  dir="ltr"
                  inputMode="decimal"
                  addonAfter="SAR"
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                />
              )}
            />
          </Col>
          <Col span={24}>
            <FormField
              control={control}
              name="notes"
              label={t('clients.fields.notes')}
              render={(field) => (
                <Input.TextArea
                  {...field}
                  value={field.value ?? ''}
                  rows={3}
                  onChange={(e) => field.onChange(e.target.value || undefined)}
                />
              )}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

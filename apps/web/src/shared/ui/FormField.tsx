import { Form } from 'antd';
import { useId, type ReactNode } from 'react';
import {
  Controller,
  type Control,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

interface FormFieldProps<TValues extends FieldValues, TName extends FieldPath<TValues>> {
  control: Control<TValues>;
  /** Field path, including nested paths such as "address.city". */
  name: TName;
  label: ReactNode;
  required?: boolean;
  /** Spread the received props onto the input: they include `id`, which links it to the label. */
  render: (field: ControllerRenderProps<TValues, TName> & { id: string }) => ReactNode;
}

/**
 * Binds a React Hook Form field to an Ant Design Form.Item, so validation errors from the shared
 * Zod schema show up under the input, and the label is associated with the input (accessibility).
 * Use inside `<Form layout="vertical">`.
 */
export function FormField<TValues extends FieldValues, TName extends FieldPath<TValues>>({
  control,
  name,
  label,
  required,
  render,
}: FormFieldProps<TValues, TName>) {
  const id = useId();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Form.Item
          label={label}
          htmlFor={id}
          required={required}
          validateStatus={fieldState.error ? 'error' : undefined}
          help={fieldState.error?.message}
        >
          {render({ ...field, id })}
        </Form.Item>
      )}
    />
  );
}

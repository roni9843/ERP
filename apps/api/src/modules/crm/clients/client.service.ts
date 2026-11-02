import type {
  ClientCreateInput,
  ClientDto,
  ClientListQuery,
  ClientUpdateInput,
  Paginated,
} from '@erp/shared';
import { Types, type QueryFilter } from 'mongoose';
import { AppError } from '../../../core/errors/app-error';
import { escapeRegex, paginate, parseSort } from '../../../core/http/query';
import { formatDocumentNumber, nextSequenceValue } from '../../../core/numbering/sequence';
import { ClientModel, type Client, type ClientDocument } from './client.model';

const SORTABLE_FIELDS = ['name', 'code', 'createdAt', 'updatedAt'] as const;

/** Business logic for clients. Framework-free: no Express types, only plain inputs and DTOs. */

export function toClientDto(client: ClientDocument): ClientDto {
  const address = client.address;
  return {
    id: client._id.toString(),
    code: client.code,
    type: client.type,
    name: client.name,
    email: client.email ?? undefined,
    phone: client.phone ?? undefined,
    vatNumber: client.vatNumber ?? undefined,
    crNumber: client.crNumber ?? undefined,
    address: address
      ? {
          buildingNumber: address.buildingNumber ?? undefined,
          street: address.street ?? undefined,
          district: address.district ?? undefined,
          city: address.city ?? undefined,
          postalCode: address.postalCode ?? undefined,
          additionalNumber: address.additionalNumber ?? undefined,
          countryCode: address.countryCode ?? 'SA',
        }
      : undefined,
    creditLimit: client.creditLimit?.toString(),
    notes: client.notes ?? undefined,
    status: client.status,
    createdAt: client.createdAt.toISOString(),
    updatedAt: client.updatedAt.toISOString(),
  };
}

function toDecimal128(value: string | undefined): Types.Decimal128 | undefined {
  return value === undefined ? undefined : Types.Decimal128.fromString(value);
}

export async function listClients(query: ClientListQuery): Promise<Paginated<ClientDto>> {
  const filter: QueryFilter<Client> = {};
  if (query.type) filter.type = query.type;
  if (query.status) filter.status = query.status;
  if (query.search) {
    const pattern = new RegExp(escapeRegex(query.search), 'i');
    filter.$or = [
      { name: pattern },
      { code: pattern },
      { email: pattern },
      { phone: pattern },
      { vatNumber: pattern },
    ];
  }

  const { skip, limit } = paginate(query.page, query.limit);
  const [clients, total] = await Promise.all([
    ClientModel.find(filter)
      .sort(parseSort(query.sort, SORTABLE_FIELDS, { createdAt: -1 }))
      .skip(skip)
      .limit(limit),
    ClientModel.countDocuments(filter),
  ]);

  return {
    items: clients.map(toClientDto),
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.ceil(total / query.limit),
  };
}

export async function getClient(id: string): Promise<ClientDto> {
  const client = await ClientModel.findById(id);
  if (!client) throw AppError.notFound('Client');
  return toClientDto(client);
}

export async function createClient(input: ClientCreateInput): Promise<ClientDto> {
  const code = formatDocumentNumber('C-', await nextSequenceValue('client'));
  const client = await new ClientModel({
    ...input,
    code,
    creditLimit: toDecimal128(input.creditLimit),
  }).save();
  return toClientDto(client);
}

export async function updateClient(id: string, input: ClientUpdateInput): Promise<ClientDto> {
  const { creditLimit, ...rest } = input;
  const client = await ClientModel.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        ...rest,
        ...(creditLimit === undefined ? {} : { creditLimit: toDecimal128(creditLimit) }),
      },
    },
    { returnDocument: 'after', runValidators: true },
  );
  if (!client) throw AppError.notFound('Client');
  return toClientDto(client);
}

/**
 * Hard delete for now. Once invoices reference clients, switch to: block deletion when the
 * client has transactions, otherwise move to the recycle bin (see docs/domain/reference-rules.md).
 */
export async function deleteClient(id: string): Promise<void> {
  const client = await ClientModel.findOneAndDelete({ _id: id });
  if (!client) throw AppError.notFound('Client');
}

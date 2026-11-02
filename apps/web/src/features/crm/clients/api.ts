import type {
  ClientCreateInput,
  ClientDto,
  ClientListQuery,
  ClientUpdateInput,
  Paginated,
} from '@erp/shared';
import { http } from '@/shared/api/http';

const BASE = '/crm/clients';

export async function listClients(query: Partial<ClientListQuery>): Promise<Paginated<ClientDto>> {
  const { data } = await http.get<Paginated<ClientDto>>(BASE, { params: query });
  return data;
}

export async function createClient(input: ClientCreateInput): Promise<ClientDto> {
  const { data } = await http.post<ClientDto>(BASE, input);
  return data;
}

export async function updateClient(id: string, input: ClientUpdateInput): Promise<ClientDto> {
  const { data } = await http.patch<ClientDto>(`${BASE}/${id}`, input);
  return data;
}

export async function deleteClient(id: string): Promise<void> {
  await http.delete(`${BASE}/${id}`);
}

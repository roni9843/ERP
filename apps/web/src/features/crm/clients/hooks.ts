import type { ClientListQuery, ClientUpdateInput } from '@erp/shared';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient, deleteClient, listClients, updateClient } from './api';

/** Query keys in one place, so invalidation is consistent. */
export const clientKeys = {
  all: ['crm', 'clients'] as const,
  list: (query: Partial<ClientListQuery>) => [...clientKeys.all, 'list', query] as const,
};

export function useClients(query: Partial<ClientListQuery>) {
  return useQuery({
    queryKey: clientKeys.list(query),
    queryFn: () => listClients(query),
    placeholderData: keepPreviousData,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: clientKeys.all }),
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ClientUpdateInput }) =>
      updateClient(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: clientKeys.all }),
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: clientKeys.all }),
  });
}

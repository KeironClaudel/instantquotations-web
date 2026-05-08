import { apiClient } from "@/lib/api/apiClient";
import type { ClientRecord, UpsertClientRequest } from "@/types/client";

export async function getClients(): Promise<ClientRecord[]> {
  const { data } = await apiClient.get<ClientRecord[]>("/api/clients");
  return data;
}

export async function createClient(request: UpsertClientRequest): Promise<ClientRecord> {
  const { data } = await apiClient.post<ClientRecord>("/api/clients", request);
  return data;
}

export async function updateClient(clientId: string, request: UpsertClientRequest): Promise<ClientRecord> {
  const { data } = await apiClient.put<ClientRecord>(`/api/clients/${clientId}`, request);
  return data;
}

export async function deleteClient(clientId: string): Promise<void> {
  await apiClient.delete(`/api/clients/${clientId}`);
}

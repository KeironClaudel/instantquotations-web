import { apiClient } from "@/lib/api/apiClient";
import type { ProformDetails, ProformListItem } from "@/types/proformHistory";

export type PagedResult<T> = {
  items: T[];
  page?: number;
  pageSize?: number;
  totalCount?: number;
};

export type GetProformsFilters = {
  page?: number;
  pageSize?: number;
  clientName?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
};

type GetProformsOptions = {
  signal?: AbortSignal;
};

export async function getProforms(
  filters?: GetProformsFilters,
  options?: GetProformsOptions,
): Promise<PagedResult<ProformListItem>> {
  const { data } = await apiClient.get<ProformListItem[] | PagedResult<ProformListItem>>("/api/Proforms", {
    params: {
      page: filters?.page,
      pageSize: filters?.pageSize,
      clientName: filters?.clientName,
      status: filters?.status,
      fromDate: filters?.fromDate,
      toDate: filters?.toDate,
    },
    signal: options?.signal,
  });

  if (Array.isArray(data)) {
    return {
      items: data,
      page: filters?.page ?? 1,
      pageSize: data.length,
      totalCount: data.length,
    };
  }

  return data;
}

export async function getProformById(proformId: string): Promise<ProformDetails> {
  const { data } = await apiClient.get<ProformDetails>(`/api/Proforms/${proformId}`);
  return data;
}

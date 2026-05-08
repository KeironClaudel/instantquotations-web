import type { ClientIdentificationType } from "@/types/client";
import type { ProformCurrency } from "@/lib/utils/proformCurrency";

export type ProformItemDraft = {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
};

export type CreateProformRequestItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type CreateProformRequest = {
  clientId: string | null;
  clientName: string;
  clientEmail: string | null;
  clientPhone: string | null;
  clientIdentificationType: ClientIdentificationType | null;
  clientIdentificationNumber: string | null;
  currency: ProformCurrency;
  location: string | null;
  internalNotes: string | null;
  serviceDescription: string | null;
  scopeOfWork: string | null;
  serviceConditions: string | null;
  paymentConditions: string | null;
  items: CreateProformRequestItem[];
};

export type CreateProformResponse = {
  proformId: string;
  number: string;
  currency: ProformCurrency;
  status: string;
  subtotal: number;
  taxPercentage: number;
  taxAmount: number;
  total: number;
};

export type CreateProformResult =
  | {
      type: "created";
      response: CreateProformResponse;
    }
  | {
      type: "queued";
      queueId: string;
    };

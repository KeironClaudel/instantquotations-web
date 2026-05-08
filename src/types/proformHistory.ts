import type { ClientIdentificationType } from "@/types/client";
import type { ProformCurrency } from "@/lib/utils/proformCurrency";

export type ProformListItem = {
  id: string;
  number: string;
  currency: ProformCurrency;
  status?: string;
  clientName: string;
  clientEmail: string | null;
  clientPhone: string | null;
  issuedAtUtc: string;
  subtotal: number;
  taxPercentage: number;
  taxAmount: number;
  total: number;
};

export type ProformDetailsItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  sortOrder: number;
};

export type ProformDetails = {
  id: string;
  number: string;
  clientId: string | null;
  currency: ProformCurrency;
  status: string;
  clientName: string;
  clientEmail: string | null;
  clientPhone: string | null;
  clientIdentificationType: ClientIdentificationType | null;
  clientIdentificationNumber: string | null;
  issuedAtUtc: string;
  notes: string | null;
  location: string | null;
  internalNotes: string | null;
  serviceDescription: string | null;
  scopeOfWork: string | null;
  serviceConditions: string | null;
  paymentConditions: string | null;
  subtotal: number;
  taxPercentage: number;
  taxAmount: number;
  total: number;
  items: ProformDetailsItem[];
};

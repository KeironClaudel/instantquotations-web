export type ClientIdentificationType = "PhysicalId" | "LegalEntityId";

export type ClientRecord = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  identificationType: ClientIdentificationType | null;
  identificationNumber: string | null;
};

export type UpsertClientRequest = {
  name: string;
  email: string | null;
  phone: string | null;
  identificationType: ClientIdentificationType | null;
  identificationNumber: string | null;
};

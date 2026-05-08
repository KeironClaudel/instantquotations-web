import type { ClientIdentificationType } from "@/types/client";

export type ProformCurrency = "Colones" | "Dollars";

export function getProformCurrencySymbol(currency: string | null | undefined): string {
  return currency === "Dollars" ? "$" : "₡";
}

export function getProformCurrencyLabel(currency: ProformCurrency, locale: "es" | "en"): string {
  if (locale === "es") {
    return currency === "Dollars" ? "Dolares" : "Colones";
  }

  return currency === "Dollars" ? "Dollars" : "Colones";
}

export function getClientIdentificationTypeLabel(
  identificationType: ClientIdentificationType | string | null | undefined,
  locale: "es" | "en",
): string {
  switch (identificationType) {
    case "PhysicalId":
      return locale === "es" ? "Cedula fisica" : "Physical ID";
    case "LegalEntityId":
      return locale === "es" ? "Cedula juridica" : "Legal Entity ID";
    default:
      return locale === "es" ? "Identificacion" : "Identification";
  }
}

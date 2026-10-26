import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createClient } from "@/lib/api/clientApi";
import { getClientIdentificationTypeLabel } from "@/lib/utils/proformCurrency";
import type { ClientIdentificationType } from "@/types/client";

export function NewClientPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const es = i18n.resolvedLanguage?.startsWith("es");
  const [form, setForm] = useState({ name: "", email: "", phone: "", identificationType: "" as ClientIdentificationType | "", identificationNumber: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: "name" | "email" | "phone" | "identificationNumber", value: string) {
    setForm(current => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setError(null);
    if (!form.name.trim()) {
      setError(t("pages.clients.feedback.nameRequired"));
      return;
    }
    if (!form.identificationType || !form.identificationNumber.trim()) {
      setError(t("pages.clients.feedback.identificationRequired"));
      return;
    }
    setSaving(true);
    try {
      await createClient({ name: form.name.trim(), email: form.email.trim() || null, phone: form.phone.trim() || null, identificationType: form.identificationType, identificationNumber: form.identificationNumber.trim() });
      navigate("/app/clients", { replace: true });
    } catch {
      setError(t("pages.clients.feedback.saveFailed"));
      setSaving(false);
    }
  }

  return (
    <div className="new-client-page">
      <header className="new-client-heading">
        <Link to="/app/clients" className="app-button-secondary client-back" aria-label={es ? "Volver a clientes" : "Back to clients"}>←</Link>
        <div><h1>{t("pages.clients.newClient")}</h1><p>{es ? "Registra un nuevo cliente para crear cotizaciones." : "Add a new client to create quotations."}</p></div>
      </header>
      <form className="app-card new-client-form" onSubmit={submit}>
        <h2 className="app-section-heading">{t("pages.newProform.clientInformation")}</h2>
        <p className="app-helper">{es ? "Los campos con * son obligatorios." : "Fields marked * are required."}</p>
        <div className="client-fields">
          <div className="client-full-width">
            <label className="app-label" htmlFor="new-client-name">{es ? "Nombre completo" : "Full name"} <span className="required-mark" aria-hidden="true">*</span></label>
            <input id="new-client-name" className="app-input" value={form.name} onChange={event => update("name", event.target.value)} placeholder={t("pages.clients.clientName")} autoComplete="name" required />
          </div>
          <div>
            <label className="app-label" htmlFor="new-client-email">{t("common.labels.email")}</label>
            <input id="new-client-email" className="app-input" type="email" value={form.email} onChange={event => update("email", event.target.value)} placeholder={es ? "correo@ejemplo.com" : "you@example.com"} autoComplete="email" />
          </div>
          <div>
            <label className="app-label" htmlFor="new-client-phone">{t("common.labels.phone")}</label>
            <input id="new-client-phone" className="app-input" type="tel" value={form.phone} onChange={event => update("phone", event.target.value)} placeholder="8888-8888" autoComplete="tel" />
          </div>
          <div>
            <label className="app-label" htmlFor="new-client-id-type">{t("pages.clients.identificationType")} <span className="required-mark" aria-hidden="true">*</span></label>
            <select id="new-client-id-type" className="app-select" value={form.identificationType} onChange={event => setForm(current => ({ ...current, identificationType: event.target.value as ClientIdentificationType | "", identificationNumber: "" }))} required>
              <option value="">{es ? "Selecciona un tipo" : "Select a type"}</option>
              <option value="PhysicalId">{getClientIdentificationTypeLabel("PhysicalId", es ? "es" : "en")}</option>
              <option value="LegalEntityId">{getClientIdentificationTypeLabel("LegalEntityId", es ? "es" : "en")}</option>
            </select>
          </div>
          <div>
            <label className="app-label" htmlFor="new-client-id-number">{t("pages.clients.identificationNumber")} <span className="required-mark" aria-hidden="true">*</span></label>
            <input id="new-client-id-number" className="app-input" value={form.identificationNumber} onChange={event => update("identificationNumber", event.target.value)} placeholder={es ? "Número de identificación" : "Identification number"} disabled={!form.identificationType} required aria-describedby="client-identification-help" />
          </div>
        </div>
        <p id="client-identification-help" className="app-helper">{t("pages.clients.formDescription")}</p>
        {error ? <div className="app-feedback-error mt-5" role="alert">{error}</div> : null}
        <div className="new-client-actions">
          <button className="app-button-primary" type="submit" disabled={saving}>{saving ? t("pages.clients.saving") : t("pages.clients.createClient")}<span aria-hidden="true">→</span></button>
          <Link to="/app/clients" className="app-button-secondary">{t("common.actions.cancel")}</Link>
        </div>
      </form>
    </div>
  );
}

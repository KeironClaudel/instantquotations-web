import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoader } from "@/components/ui/PageLoader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createClient, deleteClient, getClients, updateClient } from "@/lib/api/clientApi";
import { createErrorFeedback, createSuccessFeedback, type FeedbackState } from "@/lib/utils/feedback";
import { getClientIdentificationTypeLabel } from "@/lib/utils/proformCurrency";
import type { ClientIdentificationType, ClientRecord } from "@/types/client";

const inputClassName =
  "app-input";

type ClientFormState = {
  name: string;
  email: string;
  phone: string;
  identificationType: ClientIdentificationType | "";
  identificationNumber: string;
};

const emptyFormState: ClientFormState = {
  name: "",
  email: "",
  phone: "",
  identificationType: "",
  identificationNumber: "",
};

function createFormState(client: ClientRecord | null): ClientFormState {
  if (!client) {
    return emptyFormState;
  }

  return {
    name: client.name,
    email: client.email ?? "",
    phone: client.phone ?? "",
    identificationType: client.identificationType ?? "",
    identificationNumber: client.identificationNumber ?? "",
  };
}

export function ClientsPage() {
  const { i18n, t } = useTranslation();
  const locale = i18n.resolvedLanguage?.startsWith("es") ? "es" : "en";

  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [form, setForm] = useState<ClientFormState>(emptyFormState);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const deferredSearch = useDeferredValue(search);
  const selectedClient = useMemo(
    () => clients.find((client) => client.id === selectedClientId) ?? null,
    [clients, selectedClientId],
  );

  const filteredClients = useMemo(() => {
    const normalizedSearch = deferredSearch.trim().toLowerCase();

    return clients.filter((client) => {
      if (!normalizedSearch) {
        return true;
      }

      return (
        client.name.toLowerCase().includes(normalizedSearch) ||
        (client.email ?? "").toLowerCase().includes(normalizedSearch) ||
        (client.identificationNumber ?? "").toLowerCase().includes(normalizedSearch)
      );
    });
  }, [clients, deferredSearch]);

  useEffect(() => {
    async function loadClients() {
      try {
        setIsLoading(true);
        const data = await getClients();
        setClients(data);
      } catch {
        setFeedback(createErrorFeedback(t("pages.clients.feedback.loadFailed")));
      } finally {
        setIsLoading(false);
      }
    }

    void loadClients();
  }, [t]);

  function handleSelectClient(client: ClientRecord) {
    setSelectedClientId(client.id);
    setForm(createFormState(client));
    setFeedback(null);
  }

  function handleNewClient() {
    setSelectedClientId(null);
    setForm(emptyFormState);
    setFeedback(null);
  }

  function updateForm<K extends keyof ClientFormState>(field: K, value: ClientFormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSave() {
    setFeedback(null);

    if (!form.name.trim()) {
      setFeedback(createErrorFeedback(t("pages.clients.feedback.nameRequired")));
      return;
    }

    if ((form.identificationType && !form.identificationNumber.trim()) || (!form.identificationType && form.identificationNumber.trim())) {
      setFeedback(createErrorFeedback(t("pages.clients.feedback.identificationRequired")));
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        identificationType: form.identificationType || null,
        identificationNumber: form.identificationNumber.trim() || null,
      };

      if (selectedClientId) {
        const updatedClient = await updateClient(selectedClientId, payload);
        setClients((current) =>
          current.map((client) => (client.id === updatedClient.id ? updatedClient : client)),
        );
        setSelectedClientId(updatedClient.id);
        setForm(createFormState(updatedClient));
        setFeedback(createSuccessFeedback(t("pages.clients.feedback.updateSuccess")));
        return;
      }

      const createdClient = await createClient(payload);
      setClients((current) => [...current, createdClient].sort((left, right) => left.name.localeCompare(right.name)));
      setSelectedClientId(createdClient.id);
      setForm(createFormState(createdClient));
      setFeedback(createSuccessFeedback(t("pages.clients.feedback.createSuccess")));
    } catch {
      setFeedback(createErrorFeedback(t("pages.clients.feedback.saveFailed")));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedClientId) {
      return;
    }

    setFeedback(null);
    setIsDeleting(true);

    try {
      await deleteClient(selectedClientId);
      setClients((current) => current.filter((client) => client.id !== selectedClientId));
      setSelectedClientId(null);
      setForm(emptyFormState);
      setFeedback(createSuccessFeedback(t("pages.clients.feedback.deleteSuccess")));
    } catch {
      setFeedback(createErrorFeedback(t("pages.clients.feedback.deleteFailed")));
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return <PageLoader message={t("pages.clients.loading")} />;
  }

  return (
    <div className="mx-auto max-w-6xl px-1 sm:px-0">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="app-page-head mb-0">
          <div className="app-page-badge">{t("components.appShell.clients")}</div>
          <div className="mt-3">
            <SectionHeader
              title={t("pages.clients.title")}
              description={t("pages.clients.description")}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleNewClient}
          className="app-button-primary"
        >
          {t("pages.clients.newClient")}
        </button>
      </div>

      {feedback ? (
        <div
          className={`mb-6 rounded-2xl px-4 py-3.5 text-sm shadow-sm ${
            feedback.type === "success"
              ? "app-feedback-success"
              : "app-feedback-error"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="app-card p-5 sm:p-6">
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{t("pages.clients.search")}</label>
            <input
              className={inputClassName}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("pages.clients.searchPlaceholder")}
              autoComplete="off"
            />
          </div>

          {filteredClients.length === 0 ? (
            <EmptyState
              title={t("pages.clients.emptyTitle")}
              description={t("pages.clients.emptyDescription")}
            />
          ) : (
            <div className="space-y-3">
              {filteredClients.map((client) => {
                const isSelected = client.id === selectedClientId;

                return (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => handleSelectClient(client)}
                    className={`w-full rounded-3xl border p-4 text-left shadow-sm transition ${
                      isSelected
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-slate-50 hover:bg-white dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className={`font-semibold ${isSelected ? "text-white" : "text-slate-900 dark:text-slate-100"}`}>
                          {client.name}
                        </div>
                        <div className={`mt-1 text-sm ${isSelected ? "text-slate-200" : "text-slate-500 dark:text-slate-400"}`}>
                          {client.email || t("common.defaults.noEmail")}
                        </div>
                        <div className={`mt-1 text-sm ${isSelected ? "text-slate-200" : "text-slate-500 dark:text-slate-400"}`}>
                          {client.phone || t("common.defaults.noPhone")}
                        </div>
                      </div>

                      {client.identificationNumber ? (
                        <div className={`text-xs ${isSelected ? "text-slate-200" : "text-slate-500 dark:text-slate-400"}`}>
                          {client.identificationNumber}
                        </div>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="app-card p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {selectedClient ? t("pages.clients.editClient") : t("pages.clients.createClient")}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {t("pages.clients.formDescription")}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">{t("pages.clients.clientName")}</label>
              <input
                className={inputClassName}
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
                autoComplete="name"
                autoCorrect="on"
                spellCheck
                lang="es"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">{t("pages.clients.clientEmail")}</label>
              <input
                type="email"
                className={inputClassName}
                value={form.email}
                onChange={(event) => updateForm("email", event.target.value)}
                autoComplete="email"
                spellCheck={false}
                autoCorrect="off"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">{t("pages.clients.clientPhone")}</label>
              <input
                className={inputClassName}
                value={form.phone}
                onChange={(event) => updateForm("phone", event.target.value)}
                autoComplete="tel"
                spellCheck={false}
                autoCorrect="off"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">{t("pages.clients.identificationType")}</label>
              <select
                className={inputClassName}
                value={form.identificationType}
                onChange={(event) =>
                  updateForm("identificationType", event.target.value as ClientIdentificationType | "")
                }
              >
                <option value="">{t("pages.clients.identificationTypePlaceholder")}</option>
                <option value="PhysicalId">
                  {getClientIdentificationTypeLabel("PhysicalId", locale)}
                </option>
                <option value="LegalEntityId">
                  {getClientIdentificationTypeLabel("LegalEntityId", locale)}
                </option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">{t("pages.clients.identificationNumber")}</label>
              <input
                className={inputClassName}
                value={form.identificationNumber}
                onChange={(event) => updateForm("identificationNumber", event.target.value)}
                disabled={!form.identificationType}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={isSaving}
              className="app-button-primary"
            >
              {isSaving ? t("pages.clients.saving") : selectedClient ? t("pages.clients.saveChanges") : t("pages.clients.createClient")}
            </button>

            <button
              type="button"
              onClick={handleNewClient}
              className="app-button-secondary"
            >
              {t("common.actions.cancel")}
            </button>

            {selectedClient ? (
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={isDeleting}
                className="app-button-danger"
              >
                {isDeleting ? t("pages.clients.deleting") : t("pages.clients.deleteClient")}
              </button>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}

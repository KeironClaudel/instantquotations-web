import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/app/providers/useAuth";
import { getClients } from "@/lib/api/clientApi";
import { createProform } from "@/lib/api/proformApi";
import { createProformShareLink, downloadProformPdf, sendProformByEmail } from "@/lib/api/proformActionsApi";
import { copyTextToClipboard } from "@/lib/utils/clipboard";
import { downloadBlobFile } from "@/lib/utils/fileDownload";
import { createErrorFeedback, createSuccessFeedback } from "@/lib/utils/feedback";
import { isCompanySetupComplete } from "@/lib/utils/companySetup";
import {
  calculateSubtotal,
  calculateTaxAmount,
  calculateTotal,
} from "@/lib/utils/proformCalculations";
import { getProformCurrencySymbol, type ProformCurrency } from "@/lib/utils/proformCurrency";
import { shareFile, shareUrl } from "@/lib/utils/share";
import type { ClientIdentificationType, ClientRecord } from "@/types/client";
import type { CreatedProformSummary } from "@/types/proformActions";
import type { ProformItemDraft } from "@/types/proform";

type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

type QueueNotice = {
  queueId: string;
  clientName: string;
} | null;

function createEmptyItem(): ProformItemDraft {
  return {
    description: "",
    id: crypto.randomUUID(),
    quantity: "1",
    unitPrice: "",
  };
}

function normalizeClientText(value: string): string {
  return value.trim().toLowerCase();
}

export function useNewProformPage() {
  const { t } = useTranslation();
  const { companySettings, companySettingsSource, user } = useAuth();

  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientIdentificationType, setClientIdentificationType] = useState<ClientIdentificationType | "">("");
  const [clientIdentificationNumber, setClientIdentificationNumber] = useState("");
  const [currency, setCurrency] = useState<ProformCurrency>("Colones");
  const [location, setLocation] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [scopeOfWork, setScopeOfWork] = useState("");
  const [serviceConditions, setServiceConditions] = useState("");
  const [paymentConditions, setPaymentConditions] = useState("");
  const [items, setItems] = useState<ProformItemDraft[]>([createEmptyItem()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [createdProform, setCreatedProform] = useState<CreatedProformSummary | null>(null);
  const [shareUrlValue, setShareUrlValue] = useState<string | null>(null);
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isCreatingShareLink, setIsCreatingShareLink] = useState(false);
  const [isCopyingShareLink, setIsCopyingShareLink] = useState(false);
  const [queuedNotice, setQueuedNotice] = useState<QueueNotice>(null);

  useEffect(() => {
    async function loadClients() {
      try {
        const data = await getClients();
        setClients(data);
      } catch {
        setClients([]);
      }
    }

    void loadClients();
  }, []);

  const taxPercentage = companySettings?.taxPercentage ?? 0;
  const subtotal = useMemo(() => calculateSubtotal(items), [items]);
  const taxAmount = useMemo(() => calculateTaxAmount(subtotal, taxPercentage), [subtotal, taxPercentage]);
  const total = useMemo(() => calculateTotal(subtotal, taxAmount), [subtotal, taxAmount]);
  const currencySymbol = getProformCurrencySymbol(currency);

  const filteredClients = useMemo(() => {
    const normalizedQuery = normalizeClientText(clientName);

    if (normalizedQuery.length < 2) {
      return [];
    }

    return clients
      .filter((client) => normalizeClientText(client.name).includes(normalizedQuery))
      .slice(0, 6);
  }, [clientName, clients]);

  const selectedClient = useMemo(
    () => clients.find((client) => client.id === selectedClientId) ?? null,
    [clients, selectedClientId],
  );

  const showClientSuggestions =
    selectedClientId === null &&
    filteredClients.length > 0 &&
    normalizeClientText(clientName).length >= 2;
  const canPerformQuotationActions =
    companySettingsSource === "remote" && isCompanySetupComplete(companySettings);

  function clearFeedback() {
    setFeedback(null);
  }

  function updateItem(itemId: string, field: keyof Omit<ProformItemDraft, "id">, value: string) {
    setItems((current) =>
      current.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  function addItem() {
    setItems((current) => [...current, createEmptyItem()]);
  }

  function removeItem(itemId: string) {
    setItems((current) => (current.length === 1 ? current : current.filter((item) => item.id !== itemId)));
  }

  function applyClientSnapshot(client: ClientRecord) {
    setSelectedClientId(client.id);
    setClientName(client.name);
    setClientEmail(client.email ?? "");
    setClientPhone(client.phone ?? "");
    setClientIdentificationType(client.identificationType ?? "");
    setClientIdentificationNumber(client.identificationNumber ?? "");
  }

  function clearSelectedClient() {
    setSelectedClientId(null);
  }

  function resetDraftForm() {
    setSelectedClientId(null);
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setClientIdentificationType("");
    setClientIdentificationNumber("");
    setCurrency("Colones");
    setLocation("");
    setInternalNotes("");
    setServiceDescription("");
    setScopeOfWork("");
    setServiceConditions("");
    setPaymentConditions("");
    setItems([createEmptyItem()]);
  }

  function resetCreatedProform() {
    setCreatedProform(null);
    setShareUrlValue(null);
    clearFeedback();
  }

  async function handleCopyShareLink() {
    clearFeedback();
    setQueuedNotice(null);

    if (!shareUrlValue) {
      setFeedback(createErrorFeedback(t("pages.newProform.feedback.noShareLink")));
      return;
    }

    try {
      setIsCopyingShareLink(true);

      const copied = await copyTextToClipboard(shareUrlValue);

      if (!copied) {
        setFeedback(createErrorFeedback(t("pages.newProform.feedback.copyLinkFailed")));
        return;
      }

      setFeedback(createSuccessFeedback(t("pages.newProform.feedback.copyLinkSuccess")));
    } catch {
      setFeedback(createErrorFeedback(t("pages.newProform.feedback.copyLinkFailed")));
    } finally {
      setIsCopyingShareLink(false);
    }
  }

  async function handleDownloadPdf() {
    clearFeedback();

    if (!canPerformQuotationActions) {
      setFeedback(createErrorFeedback(t("pages.newProform.feedback.realSettingsRequired")));
      return;
    }

    if (!createdProform?.id) {
      setFeedback(createErrorFeedback(t("pages.newProform.feedback.missingProformId")));
      return;
    }

    setIsDownloading(true);

    try {
      const blob = await downloadProformPdf(createdProform.id);
      downloadBlobFile(blob, `${createdProform.number}.pdf`);
      setFeedback(createSuccessFeedback(t("pages.newProform.feedback.downloadSuccess")));
    } catch {
      setFeedback(createErrorFeedback(t("pages.newProform.feedback.downloadFailed")));
    } finally {
      setIsDownloading(false);
    }
  }

  async function handleCreateShareLink() {
    clearFeedback();

    if (!canPerformQuotationActions) {
      setFeedback(createErrorFeedback(t("pages.newProform.feedback.realSettingsRequired")));
      return;
    }

    if (!createdProform?.id) {
      setFeedback(createErrorFeedback(t("pages.newProform.feedback.missingProformId")));
      return;
    }

    setIsCreatingShareLink(true);

    try {
      const response = await createProformShareLink(createdProform.id);
      setShareUrlValue(response.shareUrl);
      setFeedback(createSuccessFeedback(t("pages.newProform.feedback.createLinkSuccess")));
    } catch {
      setFeedback(createErrorFeedback(t("pages.newProform.feedback.createLinkFailed")));
    } finally {
      setIsCreatingShareLink(false);
    }
  }

  async function handleNativeShare() {
    clearFeedback();

    if (!canPerformQuotationActions) {
      setFeedback(createErrorFeedback(t("pages.newProform.feedback.realSettingsRequired")));
      return;
    }

    if (!createdProform?.id) {
      setFeedback(createErrorFeedback(t("pages.newProform.feedback.missingProformId")));
      return;
    }

    try {
      setIsSharing(true);

      const pdfBlob = await downloadProformPdf(createdProform.id);
      const pdfFile = new File([pdfBlob], `${createdProform.number}.pdf`, {
        type: pdfBlob.type || "application/pdf",
      });
      const sharedAsFile = await shareFile(pdfFile, {
        text: `Quotation ${createdProform.number}`,
        title: `Quotation ${createdProform.number}`,
      });

      if (sharedAsFile) {
        setFeedback(createSuccessFeedback(t("pages.newProform.feedback.sharePdfSuccess")));
        return;
      }

      let finalUrl = shareUrlValue;

      if (!finalUrl) {
        const response = await createProformShareLink(createdProform.id);
        finalUrl = response.shareUrl;
        setShareUrlValue(finalUrl);
      }

      const shared = await shareUrl(`Quotation ${createdProform.number}`, finalUrl);

      if (!shared) {
        setFeedback(createErrorFeedback(t("pages.newProform.feedback.nativeShareUnavailable")));
        return;
      }

      setFeedback(createSuccessFeedback(t("pages.newProform.feedback.shareSuccess")));
    } catch {
      setFeedback(createErrorFeedback(t("pages.newProform.feedback.shareFailed")));
    } finally {
      setIsSharing(false);
    }
  }

  async function handleSendByEmail() {
    clearFeedback();

    if (!canPerformQuotationActions) {
      setFeedback(createErrorFeedback(t("pages.newProform.feedback.realSettingsRequired")));
      return;
    }

    if (!createdProform?.id) {
      setFeedback(createErrorFeedback(t("pages.newProform.feedback.missingProformId")));
      return;
    }

    if (!emailTo.trim()) {
      setFeedback(createErrorFeedback(t("pages.newProform.feedback.recipientRequired")));
      return;
    }

    setIsSendingEmail(true);

    try {
      const response = await sendProformByEmail({
        message: emailMessage.trim() || null,
        proformId: createdProform.id,
        subject: emailSubject.trim() || null,
        toEmail: emailTo.trim(),
      });

      setCreatedProform((current) =>
        current
          ? {
              ...current,
              status: response.status,
            }
          : current,
      );
      setFeedback(
        createSuccessFeedback(
          t("pages.newProform.feedback.sendSuccess", { number: createdProform.number }),
        ),
      );
    } catch {
      setFeedback(createErrorFeedback(t("pages.newProform.feedback.sendFailed")));
    } finally {
      setIsSendingEmail(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    clearFeedback();

    if (!canPerformQuotationActions) {
      setFeedback(createErrorFeedback(t("pages.newProform.feedback.realSettingsRequired")));
      return;
    }

    const normalizedItems = items
      .map((item) => ({
        description: item.description.trim(),
        quantity: Number(item.quantity.trim()),
        unitPrice: Number(item.unitPrice.trim()),
      }))
      .filter(
        (item) =>
          item.description.length > 0 &&
          Number.isFinite(item.quantity) &&
          Number.isFinite(item.unitPrice),
      );

    if (clientName.trim().length === 0) {
      setFeedback(createErrorFeedback(t("pages.newProform.feedback.clientNameRequired")));
      return;
    }

    if ((clientIdentificationType && !clientIdentificationNumber.trim()) || (!clientIdentificationType && clientIdentificationNumber.trim())) {
      setFeedback(createErrorFeedback(t("pages.newProform.feedback.clientIdentificationRequired")));
      return;
    }

    if (normalizedItems.length === 0) {
      setFeedback(createErrorFeedback(t("pages.newProform.feedback.atLeastOneItem")));
      return;
    }

    const hasInvalidNumbers = normalizedItems.some((item) => item.quantity <= 0 || item.unitPrice < 0);

    if (hasInvalidNumbers) {
      setFeedback(createErrorFeedback(t("pages.newProform.feedback.invalidItemNumbers")));
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createProform(
        {
          clientId: selectedClientId,
          clientEmail: clientEmail.trim() || null,
          clientIdentificationNumber: clientIdentificationNumber.trim() || null,
          clientIdentificationType: clientIdentificationType || null,
          clientName: clientName.trim(),
          clientPhone: clientPhone.trim() || null,
          currency,
          internalNotes: internalNotes.trim() || null,
          items: normalizedItems,
          location: location.trim() || null,
          paymentConditions: paymentConditions.trim() || null,
          scopeOfWork: scopeOfWork.trim() || null,
          serviceConditions: serviceConditions.trim() || null,
          serviceDescription: serviceDescription.trim() || null,
        },
        user
          ? {
              queueContext: {
                companyId: user.companyId,
                userId: user.userId,
              },
            }
          : undefined,
      );

      if (result.type === "queued") {
        setCreatedProform(null);
        setShareUrlValue(null);
        setQueuedNotice({
          clientName: clientName.trim(),
          queueId: result.queueId,
        });
        setFeedback(createSuccessFeedback(t("pages.newProform.feedback.queued")));
        resetDraftForm();
        return;
      }

      const response = result.response;

      setFeedback(
        createSuccessFeedback(
          t("pages.newProform.feedback.createdSuccess", { number: response.number }),
        ),
      );
      setQueuedNotice(null);
      setCreatedProform({
        id: response.proformId,
        number: response.number,
        currency: response.currency,
        status: response.status,
        subtotal: response.subtotal,
        taxAmount: response.taxAmount,
        taxPercentage: response.taxPercentage,
        total: response.total,
      });
      setShareUrlValue(null);
      setEmailTo(clientEmail.trim());
      setEmailSubject(`Quotation ${response.number}`);
      setEmailMessage("");
      resetDraftForm();
    } catch {
      setFeedback(createErrorFeedback(t("pages.newProform.feedback.createFailed")));
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    addItem,
    applyClientSnapshot,
    clientEmail,
    clientIdentificationNumber,
    clientIdentificationType,
    clientName,
    clientPhone,
    clients,
    companySettings,
    canPerformQuotationActions,
    createdProform,
    currency,
    currencySymbol,
    emailMessage,
    emailSubject,
    emailTo,
    feedback,
    filteredClients,
    handleCopyShareLink,
    handleCreateShareLink,
    handleDownloadPdf,
    handleNativeShare,
    handleSendByEmail,
    handleSubmit,
    internalNotes,
    isCopyingShareLink,
    isCreatingShareLink,
    isDownloading,
    isSendingEmail,
    isSharing,
    isSubmitting,
    items,
    location,
    paymentConditions,
    queuedNotice,
    removeItem,
    resetCreatedProform,
    scopeOfWork,
    selectedClient,
    selectedClientId,
    serviceConditions,
    serviceDescription,
    setClientEmail,
    setClientIdentificationNumber,
    setClientIdentificationType,
    setClientName,
    setClientPhone,
    setCurrency,
    setEmailMessage,
    setEmailSubject,
    setEmailTo,
    setInternalNotes,
    setLocation,
    setPaymentConditions,
    setScopeOfWork,
    setServiceConditions,
    setServiceDescription,
    shareUrlValue,
    showClientSuggestions,
    subtotal,
    taxAmount,
    taxPercentage,
    total,
    updateItem,
    clearSelectedClient,
  };
}

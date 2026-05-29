import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/app/providers/useAuth";
import { getProforms } from "@/lib/api/proformHistoryApi";
import { createErrorFeedback, type FeedbackState } from "@/lib/utils/feedback";
import type { ProformListItem } from "@/types/proformHistory";

const statusOptions = ["All", "Draft", "Sent", "Accepted", "Rejected", "Cancelled"] as const;
const pageSizeOptions = [10, 20, 50] as const;

function toDateInputValue(value: Date): string {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function useProformsListPage() {
  const { t } = useTranslation();
  const { companySettings } = useAuth();
  const [proforms, setProforms] = useState<ProformListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [clientFilter, setClientFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>("All");
  const [fromDateFilter, setFromDateFilter] = useState("");
  const [toDateFilter, setToDateFilter] = useState("");
  const [debouncedClientFilter, setDebouncedClientFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof pageSizeOptions)[number]>(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedClientFilter(clientFilter.trim());
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [clientFilter]);

  useEffect(() => {
    setPage(1);
  }, [debouncedClientFilter, fromDateFilter, statusFilter, toDateFilter]);

  useEffect(() => {
    let isCancelled = false;

    async function loadProforms() {
      try {
        setIsLoading(true);
        setFeedback(null);

        const data = await getProforms({
          page,
          pageSize,
          clientName: debouncedClientFilter || undefined,
          status: statusFilter === "All" ? undefined : statusFilter,
          fromDate: fromDateFilter || undefined,
          toDate: toDateFilter || undefined,
        });

        if (!isCancelled) {
          setProforms(data.items);
          setTotalCount(data.totalCount ?? data.items.length);
        }
      } catch {
        if (!isCancelled) {
          setFeedback(createErrorFeedback(t("pages.proformsList.issueLoadFailed")));
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadProforms();

    return () => {
      isCancelled = true;
    };
  }, [debouncedClientFilter, fromDateFilter, page, pageSize, statusFilter, t, toDateFilter]);

  const hasActiveFilters =
    clientFilter.trim().length > 0 ||
    statusFilter !== "All" ||
    fromDateFilter.length > 0 ||
    toDateFilter.length > 0;

  function clearFilters() {
    setClientFilter("");
    setStatusFilter("All");
    setFromDateFilter("");
    setToDateFilter("");
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = totalCount === 0 ? 0 : Math.min(currentPage * pageSize, totalCount);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  function updatePageSize(nextPageSize: (typeof pageSizeOptions)[number]) {
    setPageSize(nextPageSize);
    setPage(1);
  }

  function goToPreviousPage() {
    setPage((currentValue) => Math.max(1, currentValue - 1));
  }

  function goToNextPage() {
    setPage((currentValue) => Math.min(totalPages, currentValue + 1));
  }

  return {
    clearFilters,
    clientFilter,
    currentPage,
    companySettings,
    endItem,
    feedback,
    filteredProforms: proforms,
    fromDateFilter,
    goToNextPage,
    goToPreviousPage,
    hasActiveFilters,
    isLoading,
    isOnFirstPage: currentPage <= 1,
    isOnLastPage: currentPage >= totalPages,
    proforms,
    pageSize,
    pageSizeOptions,
    setClientFilter,
    setFromDateFilter,
    setPageSize: updatePageSize,
    setStatusFilter,
    setToDateFilter,
    startItem,
    statusFilter,
    statusOptions,
    toDateFilter,
    todayDateValue: toDateInputValue(new Date()),
    totalCount,
    totalPages,
  };
}

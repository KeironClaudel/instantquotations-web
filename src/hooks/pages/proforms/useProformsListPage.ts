import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/app/providers/useAuth";
import { getProforms } from "@/lib/api/proformHistoryApi";
import { toApiClientError } from "@/lib/api/apiErrors";
import { createErrorFeedback, type FeedbackState } from "@/lib/utils/feedback";
import type { ProformListItem } from "@/types/proformHistory";

const statusOptions = ["All", "Draft", "Sent", "Accepted", "Rejected", "Cancelled"] as const;
const pageSizeOptions = [10, 20, 50] as const;
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

type StatusFilter = (typeof statusOptions)[number];
type PageSizeOption = (typeof pageSizeOptions)[number];

function toDateInputValue(value: Date): string {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isStatusFilter(value: string | null): value is StatusFilter {
  return value !== null && statusOptions.includes(value as StatusFilter);
}

function isPageSizeOption(value: number): value is PageSizeOption {
  return pageSizeOptions.includes(value as PageSizeOption);
}

function parsePositiveInteger(value: string | null, fallback: number): number {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return parsedValue;
}

function parseDateQueryValue(value: string | null): string {
  if (!value) {
    return "";
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return "";
  }

  const parsedDate = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return toDateInputValue(parsedDate) === value ? value : "";
}

function buildSearchParams(input: {
  clientFilter: string;
  statusFilter: StatusFilter;
  fromDateFilter: string;
  toDateFilter: string;
  page: number;
  pageSize: PageSizeOption;
}): URLSearchParams {
  const nextParams = new URLSearchParams();

  const normalizedClientFilter = input.clientFilter.trim();

  if (normalizedClientFilter) {
    nextParams.set("client", normalizedClientFilter);
  }

  if (input.statusFilter !== "All") {
    nextParams.set("status", input.statusFilter);
  }

  if (input.fromDateFilter) {
    nextParams.set("from", input.fromDateFilter);
  }

  if (input.toDateFilter) {
    nextParams.set("to", input.toDateFilter);
  }

  if (input.page !== DEFAULT_PAGE) {
    nextParams.set("page", String(input.page));
  }

  if (input.pageSize !== DEFAULT_PAGE_SIZE) {
    nextParams.set("pageSize", String(input.pageSize));
  }

  return nextParams;
}

export function useProformsListPage() {
  const { t } = useTranslation();
  const { companySettings } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsKey = searchParams.toString();
  const initialClientFilter = searchParams.get("client") ?? "";
  const initialStatusFilter = isStatusFilter(searchParams.get("status"))
    ? (searchParams.get("status") as StatusFilter)
    : "All";
  const initialFromDateFilter = parseDateQueryValue(searchParams.get("from"));
  const initialToDateFilter = parseDateQueryValue(searchParams.get("to"));
  const initialPage = parsePositiveInteger(searchParams.get("page"), DEFAULT_PAGE);
  const initialPageSizeValue = parsePositiveInteger(searchParams.get("pageSize"), DEFAULT_PAGE_SIZE);
  const initialPageSize = isPageSizeOption(initialPageSizeValue)
    ? initialPageSizeValue
    : DEFAULT_PAGE_SIZE;
  const [proforms, setProforms] = useState<ProformListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedAtLeastOnce, setHasLoadedAtLeastOnce] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [clientFilter, setClientFilter] = useState(initialClientFilter);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatusFilter);
  const [fromDateFilter, setFromDateFilter] = useState(initialFromDateFilter);
  const [toDateFilter, setToDateFilter] = useState(initialToDateFilter);
  const [debouncedClientFilter, setDebouncedClientFilter] = useState(initialClientFilter.trim());
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState<PageSizeOption>(initialPageSize);
  const [totalCount, setTotalCount] = useState(0);
  const [reloadVersion, setReloadVersion] = useState(0);
  const latestRequestRef = useRef(0);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedClientFilter(clientFilter.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [clientFilter]);

  useEffect(() => {
    const client = searchParams.get("client") ?? "";
    const status = isStatusFilter(searchParams.get("status"))
      ? (searchParams.get("status") as StatusFilter)
      : "All";
    const from = parseDateQueryValue(searchParams.get("from"));
    const to = parseDateQueryValue(searchParams.get("to"));
    const nextPage = parsePositiveInteger(searchParams.get("page"), DEFAULT_PAGE);
    const nextPageSizeValue = parsePositiveInteger(searchParams.get("pageSize"), DEFAULT_PAGE_SIZE);
    const nextPageSize = isPageSizeOption(nextPageSizeValue)
      ? nextPageSizeValue
      : DEFAULT_PAGE_SIZE;

    if (client !== clientFilter) {
      setClientFilter(client);
    }

    if (status !== statusFilter) {
      setStatusFilter(status);
    }

    if (from !== fromDateFilter) {
      setFromDateFilter(from);
    }

    if (to !== toDateFilter) {
      setToDateFilter(to);
    }

    if (nextPage !== page) {
      setPage(nextPage);
    }

    if (nextPageSize !== pageSize) {
      setPageSize(nextPageSize);
    }
  }, [searchParamsKey]);

  const requestFilters = useMemo(
    () => ({
      clientName: debouncedClientFilter || undefined,
      fromDate: fromDateFilter || undefined,
      page,
      pageSize,
      status: statusFilter === "All" ? undefined : statusFilter,
      toDate: toDateFilter || undefined,
    }),
    [debouncedClientFilter, fromDateFilter, page, pageSize, statusFilter, toDateFilter],
  );

  useEffect(() => {
    const nextParams = buildSearchParams({
      clientFilter,
      statusFilter,
      fromDateFilter,
      toDateFilter,
      page,
      pageSize,
    });
    const nextQueryString = nextParams.toString();

    if (nextQueryString === searchParamsKey) {
      return;
    }

    setSearchParams(nextParams, { replace: true, preventScrollReset: true });
  }, [
    clientFilter,
    fromDateFilter,
    page,
    pageSize,
    searchParamsKey,
    setSearchParams,
    statusFilter,
    toDateFilter,
  ]);

  useEffect(() => {
    const abortController = new AbortController();
    const requestId = latestRequestRef.current + 1;
    latestRequestRef.current = requestId;

    async function loadProforms() {
      try {
        setIsLoading(true);
        setFeedback(null);

        const data = await getProforms(requestFilters, { signal: abortController.signal });

        if (latestRequestRef.current === requestId) {
          setProforms(data.items);
          setTotalCount(data.totalCount ?? data.items.length);
          setHasLoadedAtLeastOnce(true);
        }
      } catch (error) {
        const apiError = toApiClientError(error);

        if (apiError.kind === "canceled" || abortController.signal.aborted) {
          return;
        }

        if (latestRequestRef.current === requestId) {
          setFeedback(createErrorFeedback(t("pages.proformsList.issueLoadFailed")));
        }
      } finally {
        if (latestRequestRef.current === requestId) {
          setIsLoading(false);
        }
      }
    }

    void loadProforms();

    return () => {
      abortController.abort();
    };
  }, [reloadVersion, requestFilters, t]);

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
    setPage(DEFAULT_PAGE);
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
    setPage(DEFAULT_PAGE);
  }

  function goToPreviousPage() {
    setPage((currentValue) => Math.max(1, currentValue - 1));
  }

  function goToNextPage() {
    setPage((currentValue) => Math.min(totalPages, currentValue + 1));
  }

  function retryLoad() {
    setReloadVersion((currentValue) => currentValue + 1);
  }

  function updateClientFilter(nextValue: string) {
    setClientFilter(nextValue);
    setPage(DEFAULT_PAGE);
  }

  function updateStatusFilter(nextValue: StatusFilter) {
    setStatusFilter(nextValue);
    setPage(DEFAULT_PAGE);
  }

  function updateFromDateFilter(nextValue: string) {
    setFromDateFilter(nextValue);
    setPage(DEFAULT_PAGE);
  }

  function updateToDateFilter(nextValue: string) {
    setToDateFilter(nextValue);
    setPage(DEFAULT_PAGE);
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
    hasLoadedAtLeastOnce,
    isLoading,
    isOnFirstPage: currentPage <= 1,
    isOnLastPage: currentPage >= totalPages,
    isRefreshingResults: isLoading && hasLoadedAtLeastOnce,
    proforms,
    pageSize,
    pageSizeOptions,
    retryLoad,
    setClientFilter: updateClientFilter,
    setFromDateFilter: updateFromDateFilter,
    setPageSize: updatePageSize,
    setStatusFilter: updateStatusFilter,
    setToDateFilter: updateToDateFilter,
    startItem,
    statusFilter,
    statusOptions,
    toDateFilter,
    todayDateValue: toDateInputValue(new Date()),
    totalCount,
    totalPages,
  };
}

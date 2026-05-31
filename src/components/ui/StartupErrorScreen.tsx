import { useMemo, useState } from "react";
import { copyTextToClipboard } from "@/lib/utils/clipboard";
import { formatApiDiagnostics, type ApiClientError } from "@/lib/api/apiErrors";

type StartupErrorScreenProps = {
  error: ApiClientError;
  onRetry: () => Promise<void> | void;
  onContinue?: () => void;
  showDeveloperDiagnostics?: boolean;
};

function getUserFacingSubtitle(error: ApiClientError): string {
  if (
    error.kind === "network" ||
    error.kind === "timeout" ||
    error.kind === "canceled" ||
    error.kind === "invalid-content-type"
  ) {
    return "Your browser, antivirus, VPN, or network may be blocking the connection.";
  }

  if (error.statusCode === 401) {
    return "Your session expired. Please sign in again.";
  }

  if (error.statusCode === 403) {
    return "You do not have permission to access this information.";
  }

  if (error.statusCode === 404) {
    return "We could not find the required company settings.";
  }

  if ((error.statusCode !== null && error.statusCode >= 500) || error.kind === "http") {
    return "The server had a temporary problem. Please try again.";
  }

  return "We could not load the required startup information.";
}

export function StartupErrorScreen({
  error,
  onRetry,
  onContinue,
  showDeveloperDiagnostics = false,
}: StartupErrorScreenProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle");

  const diagnostics = useMemo(() => formatApiDiagnostics(error), [error]);
  const userFacingSubtitle = useMemo(() => getUserFacingSubtitle(error), [error]);

  async function handleRetry() {
    setIsRetrying(true);

    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  }

  async function handleCopyDiagnostics() {
    try {
      const copied = await copyTextToClipboard(diagnostics);
      setCopyState(copied ? "success" : "error");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <div className="app-system-screen">
      <div className="app-system-card">
        <span className="app-page-badge">Startup issue detected</span>

        <h1 className="app-page-title">We couldn&apos;t load the company settings.</h1>

        <p className="app-page-copy">{userFacingSubtitle}</p>

        <p className="app-helper mt-4">
          You can retry now, or continue with safe defaults while protected actions remain unavailable.
        </p>

        {showDeveloperDiagnostics ? (
          <div className="app-feedback-warning mt-5">
            <strong className="block text-sm font-semibold">Technical summary</strong>
            <span className="mt-1 block text-sm">{error.message}</span>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void handleRetry()}
            className="app-button-primary"
            disabled={isRetrying}
          >
            {isRetrying ? "Retrying..." : "Retry"}
          </button>

          <button
            type="button"
            onClick={() => void handleCopyDiagnostics()}
            className="app-button-secondary"
          >
            Copy diagnostics
          </button>

          {onContinue ? (
            <button
              type="button"
              onClick={onContinue}
              className="app-button-ghost"
            >
              Continue with defaults
            </button>
          ) : null}
        </div>

        {showDeveloperDiagnostics ? (
          <details className="app-system-dev-panel">
            <summary>Developer diagnostics</summary>
            <pre className="app-system-diagnostics">{diagnostics}</pre>
          </details>
        ) : null}

        {copyState !== "idle" ? (
          <p className="mt-4 text-sm text-[var(--ip-text-soft)]">
            {copyState === "success"
              ? "Diagnostics copied to clipboard."
              : "We could not copy the diagnostics from this browser."}
          </p>
        ) : null}
      </div>
    </div>
  );
}

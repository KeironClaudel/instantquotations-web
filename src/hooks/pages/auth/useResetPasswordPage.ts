import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "@/lib/api/authApi";
import { createErrorFeedback, createSuccessFeedback } from "@/lib/utils/feedback";

type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

export function useResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token] = useState(() => searchParams.get("token")?.trim() ?? "");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.location.search || !token) {
      return;
    }

    const cleanUrl = `${window.location.pathname}${window.location.hash}`;
    window.history.replaceState(window.history.state, "", cleanUrl);
  }, [token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    if (!token) {
      setFeedback(createErrorFeedback(t("pages.resetPassword.feedback.missingToken")));
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback(createErrorFeedback(t("pages.resetPassword.feedback.passwordMismatch")));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await resetPassword({
        token,
        newPassword,
      });

      setFeedback(createSuccessFeedback(response.message));

      window.setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch {
      setFeedback(createErrorFeedback(t("pages.resetPassword.feedback.failed")));
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    confirmPassword,
    feedback,
    handleSubmit,
    isSubmitting,
    newPassword,
    setConfirmPassword,
    setNewPassword,
    token,
  };
}

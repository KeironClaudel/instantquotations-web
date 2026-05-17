import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { forgotPassword } from "@/lib/api/authApi";
import { createErrorFeedback, createSuccessFeedback } from "@/lib/utils/feedback";

type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

export function useForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    try {
      const response = await forgotPassword({
        email: email.trim(),
      });

      setFeedback(createSuccessFeedback(response.message));
    } catch {
      setFeedback(createErrorFeedback(t("pages.forgotPassword.feedbackError")));
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    email,
    feedback,
    handleSubmit,
    isSubmitting,
    setEmail,
  };
}

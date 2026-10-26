import type { PropsWithChildren } from "react";
import { PageLoader } from "@/components/ui/PageLoader";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/app/providers/useAuth";

export function PlatformAdminRoute({ children }: PropsWithChildren) {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <PageLoader variant="settings" />;
  }

  if (!user?.isPlatformAdmin) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}

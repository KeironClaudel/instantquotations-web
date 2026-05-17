import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/app/providers/useAuth";

export function PlatformAdminRoute({ children }: PropsWithChildren) {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user?.isPlatformAdmin) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}

"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { routes } from "@/lib/routes";

/**
 * Legacy reset-password redirect content
 */
function LegacyResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Preserve any query params (like token)
    const queryString = searchParams.toString();
    router.replace(`${routes.auth.resetPassword}${queryString ? `?${queryString}` : ""}`);
  }, [router, searchParams]);

  return (
    <div className="w-8 h-8 border-2 border-dark/20 border-t-dark rounded-full animate-spin" />
  );
}

/**
 * Legacy reset-password page - redirects to new /auth/reset-password route
 */
export default function LegacyResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Suspense fallback={
        <div className="w-8 h-8 border-2 border-dark/20 border-t-dark rounded-full animate-spin" />
      }>
        <LegacyResetPasswordContent />
      </Suspense>
    </div>
  );
}

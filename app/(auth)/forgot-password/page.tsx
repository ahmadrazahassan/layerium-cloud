"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";

/**
 * Legacy forgot-password page - redirects to new /auth/forgot-password route
 */
export default function LegacyForgotPasswordPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace(routes.auth.forgotPassword);
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-dark/20 border-t-dark rounded-full animate-spin" />
    </div>
  );
}

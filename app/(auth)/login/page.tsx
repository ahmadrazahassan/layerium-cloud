"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { routes } from "@/lib/routes";

/**
 * Legacy login redirect content
 */
function LegacyLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Build new URL with all existing params
    const params = new URLSearchParams(searchParams.toString());
    
    // Convert old 'tab=signup' to new 'mode=signup'
    if (params.get("tab") === "signup") {
      params.delete("tab");
      params.set("mode", "signup");
    }
    
    // Convert old 'next' to 'redirect'
    const next = params.get("next");
    if (next) {
      params.delete("next");
      params.set("redirect", next);
    }
    
    const queryString = params.toString();
    router.replace(`${routes.auth.login}${queryString ? `?${queryString}` : ""}`);
  }, [router, searchParams]);

  return (
    <div className="w-8 h-8 border-2 border-white/20 border-t-primary rounded-full animate-spin" />
  );
}

/**
 * Legacy login page - redirects to new /auth/login route
 * Preserves all query parameters for backwards compatibility
 */
export default function LegacyLoginPage() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <Suspense fallback={
        <div className="w-8 h-8 border-2 border-white/20 border-t-primary rounded-full animate-spin" />
      }>
        <LegacyLoginContent />
      </Suspense>
    </div>
  );
}

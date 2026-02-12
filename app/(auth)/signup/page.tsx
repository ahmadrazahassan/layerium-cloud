"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { routes } from "@/lib/routes";

/**
 * Legacy signup redirect content
 */
function LegacySignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("mode", "signup");
    
    // Preserve redirect parameter
    const redirect = searchParams.get("redirect") || searchParams.get("next");
    if (redirect) {
      params.set("redirect", redirect);
    }
    
    router.replace(`${routes.auth.login}?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="w-8 h-8 border-2 border-white/20 border-t-primary rounded-full animate-spin" />
  );
}

/**
 * Legacy signup page - redirects to new /auth/login?mode=signup route
 */
export default function LegacySignupPage() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <Suspense fallback={
        <div className="w-8 h-8 border-2 border-white/20 border-t-primary rounded-full animate-spin" />
      }>
        <LegacySignupContent />
      </Suspense>
    </div>
  );
}

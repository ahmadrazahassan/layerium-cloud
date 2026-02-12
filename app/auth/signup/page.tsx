"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { routes } from "@/lib/routes";

/**
 * Signup redirect content component
 * Separated to allow Suspense boundary for useSearchParams
 */
function SignupRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Preserve any redirect parameters
    const redirect = searchParams.get("redirect") || searchParams.get("next");
    const params = new URLSearchParams();
    params.set("mode", "signup");
    if (redirect) params.set("redirect", redirect);
    
    router.replace(`${routes.auth.login}?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="w-8 h-8 border-2 border-white/20 border-t-primary rounded-full animate-spin" />
  );
}

/**
 * Signup page - redirects to login with signup mode
 * This provides a clean /auth/signup URL while using the unified auth page
 */
export default function SignupPage() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <Suspense fallback={
        <div className="w-8 h-8 border-2 border-white/20 border-t-primary rounded-full animate-spin" />
      }>
        <SignupRedirectContent />
      </Suspense>
    </div>
  );
}

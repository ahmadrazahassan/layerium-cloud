"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { buildDeployUrl } from "@/lib/routes";

/**
 * Deploy redirect content component
 * Separated to allow Suspense boundary for useSearchParams
 */
function DeployRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Build deploy URL with all query params
    const plan = searchParams.get("plan");
    const type = searchParams.get("type") as "vps" | "rdp" | null;
    const region = searchParams.get("region");
    const os = searchParams.get("os");
    
    const deployUrl = buildDeployUrl({
      plan: plan || undefined,
      type: type || undefined,
      region: region || undefined,
      os: os || undefined,
    });
    
    router.replace(deployUrl);
  }, [router, searchParams]);

  return (
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-dark/20 border-t-dark rounded-full animate-spin mx-auto mb-4" />
      <p className="font-outfit text-dark-muted">Redirecting to deploy...</p>
    </div>
  );
}

/**
 * Deploy redirect page
 * 
 * This page handles the /deploy route which is protected.
 * If user is authenticated (handled by middleware), redirects to dashboard deploy.
 * If not authenticated, middleware will redirect to login with proper redirect param.
 */
export default function DeployRedirect() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Suspense fallback={
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-dark/20 border-t-dark rounded-full animate-spin mx-auto mb-4" />
          <p className="font-outfit text-dark-muted">Loading...</p>
        </div>
      }>
        <DeployRedirectContent />
      </Suspense>
    </div>
  );
}

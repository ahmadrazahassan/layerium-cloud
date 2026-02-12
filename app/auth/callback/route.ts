import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { routes, isInternalUrl } from "@/lib/routes";

/**
 * OAuth Callback Handler
 * 
 * Handles authentication callbacks from OAuth providers (Google, GitHub)
 * and email confirmation links.
 * 
 * Query Parameters:
 * - code: Authorization code from OAuth provider
 * - next: Redirect destination after successful auth (default: /dashboard)
 * - error: Error code from OAuth provider
 * - error_description: Human-readable error message
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Determine redirect destination (with security check)
  const redirectTo = next && isInternalUrl(next) ? next : routes.dashboard.home;

  // Handle OAuth errors
  if (error) {
    console.error("[Auth Callback] OAuth error:", error, errorDescription);
    const errorUrl = new URL(routes.auth.login, origin);
    errorUrl.searchParams.set("error", errorDescription || error);
    if (next) errorUrl.searchParams.set("redirect", redirectTo);
    return NextResponse.redirect(errorUrl);
  }

  // Exchange code for session
  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error("[Auth Callback] Code exchange error:", exchangeError);
      const errorUrl = new URL(routes.auth.login, origin);
      errorUrl.searchParams.set("error", exchangeError.message);
      if (next) errorUrl.searchParams.set("redirect", redirectTo);
      return NextResponse.redirect(errorUrl);
    }

    // Successful authentication - redirect to intended destination
    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";
    
    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${redirectTo}`);
    } else {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  // No code provided - redirect to login
  console.warn("[Auth Callback] No code provided, redirecting to login");
  return NextResponse.redirect(new URL(routes.auth.login, origin));
}

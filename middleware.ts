// CRITICAL: Import localStorage polyfill FIRST
import "@/lib/polyfills/localStorage";

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/middleware";
import { 
  routes, 
  isProtectedRoute, 
  isAuthRoute, 
  getLegacyRedirect,
  isInternalUrl 
} from "@/lib/routes";

// Countries that use PKR currency
const PKR_COUNTRIES = ["PK"];

// Countries that use USD currency
const USD_COUNTRIES = [
  "US", "GB", "CA", "DE", "FR", "NL", "AU", "SG", "AE",
  "AT", "BE", "CH", "DK", "ES", "FI", "IE", "IT", "NO", "SE"
];

/**
 * Determine currency and region based on country code
 */
function determineCurrencyAndRegion(country: string): { currency: "USD" | "PKR"; region: string } {
  if (PKR_COUNTRIES.includes(country)) {
    return { currency: "PKR", region: "PK" };
  }
  
  if (USD_COUNTRIES.includes(country)) {
    const region = country === "US" ? "US" : "EU";
    return { currency: "USD", region };
  }
  
  return { currency: "USD", region: "OTHER" };
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  
  // Create Supabase client and get response
  const { supabase, response } = createClient(request);

  // Refresh session if expired - required for Server Components
  const { data: { user } } = await supabase.auth.getUser();
  
  // =========================================================================
  // LEGACY ROUTE REDIRECTS
  // =========================================================================
  const legacyRedirect = getLegacyRedirect(pathname);
  if (legacyRedirect) {
    const redirectUrl = new URL(legacyRedirect, request.url);
    // Preserve query parameters
    redirectUrl.search = search;
    return NextResponse.redirect(redirectUrl, { status: 301 });
  }
  
  // =========================================================================
  // AUTHENTICATION ROUTING
  // =========================================================================
  
  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute(pathname) && !user) {
    const loginUrl = new URL(routes.auth.login, request.url);
    // Preserve the full intended destination (path + query params)
    const intendedDestination = pathname + search;
    loginUrl.searchParams.set("redirect", intendedDestination);
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect authenticated users from auth routes to dashboard or redirect param
  if (isAuthRoute(pathname) && user) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    // Security: Only allow internal redirects
    const destination = redirectParam && isInternalUrl(redirectParam) 
      ? redirectParam 
      : routes.dashboard.home;
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // =========================================================================
  // GEO-LOCATION & CURRENCY
  // =========================================================================
  
  // Get country from Vercel's geo headers (available on Vercel Edge)
  const geo = (request as NextRequest & { geo?: { country?: string } }).geo;
  const country = geo?.country || "US";
  
  // Determine currency and region
  const { currency, region } = determineCurrencyAndRegion(country);
  
  // Set headers for server components
  response.headers.set("x-user-country", country);
  response.headers.set("x-user-currency", currency);
  response.headers.set("x-user-region", region);
  
  // Set cookies for client-side access
  const cookieOptions = {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  };
  
  response.cookies.set("user-currency", currency, cookieOptions);
  response.cookies.set("user-region", region, cookieOptions);
  response.cookies.set("user-country", country, cookieOptions);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
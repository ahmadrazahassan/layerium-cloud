/**
 * Centralized Route Configuration
 * 
 * Enterprise-grade URL management system for Layerium Cloud
 * All routes are defined here for consistency and maintainability
 */

// ============================================================================
// ROUTE DEFINITIONS
// ============================================================================

export const routes = {
  // Public Marketing Pages
  home: "/",
  vps: "/vps",
  rdp: "/rdp",
  pricing: "/pricing",
  features: "/#features",
  datacenters: "/#locations",
  faq: "/#faq",
  contact: "/contact",
  about: "/about",
  
  // Legal Pages
  terms: "/terms",
  privacy: "/privacy",
  
  // Authentication Routes
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    callback: "/auth/callback",
    logout: "/auth/logout",
  },
  
  // Dashboard Routes
  dashboard: {
    home: "/dashboard",
    servers: {
      list: "/dashboard/servers",
      detail: (id: string) => `/dashboard/servers/${id}`,
      console: (id: string) => `/dashboard/servers/${id}/console`,
    },
    deploy: {
      index: "/dashboard/deploy",
      withPlan: (planId: string) => `/dashboard/deploy?plan=${planId}`,
      withType: (type: "vps" | "rdp") => `/dashboard/deploy?type=${type}`,
    },
    billing: {
      index: "/dashboard/billing",
      invoices: "/dashboard/billing?tab=invoices",
      payment: "/dashboard/billing?tab=payment",
    },
    support: {
      index: "/dashboard/support",
      newTicket: "/dashboard/support/new",
      ticket: (id: string) => `/dashboard/support/tickets/${id}`,
    },
    settings: {
      index: "/dashboard/settings",
      profile: "/dashboard/settings?tab=profile",
      security: "/dashboard/settings?tab=security",
      notifications: "/dashboard/settings?tab=notifications",
    },
  },
  
  // Admin Routes
  admin: {
    home: "/admin",
    users: {
      list: "/admin/users",
      detail: (id: string) => `/admin/users/${id}`,
    },
    servers: {
      list: "/admin/servers",
      detail: (id: string) => `/admin/servers/${id}`,
    },
    orders: {
      list: "/admin/orders",
      detail: (id: string) => `/admin/orders/${id}`,
    },
    tickets: {
      list: "/admin/tickets",
      detail: (id: string) => `/admin/tickets/${id}`,
    },
    plans: {
      list: "/admin/plans",
      create: "/admin/plans/new",
      edit: (id: string) => `/admin/plans/${id}`,
    },
    settings: "/admin/settings",
  },
  
  // API Routes
  api: {
    auth: {
      session: "/api/auth/session",
      refresh: "/api/auth/refresh",
    },
    servers: {
      list: "/api/servers",
      detail: (id: string) => `/api/servers/${id}`,
      actions: (id: string) => `/api/servers/${id}/actions`,
    },
    billing: {
      invoices: "/api/billing/invoices",
      payment: "/api/billing/payment-methods",
    },
  },
} as const;

// ============================================================================
// URL BUILDER UTILITIES
// ============================================================================

/**
 * Build authentication URL with redirect
 * Used when user needs to login before accessing a protected resource
 */
export function buildAuthUrl(
  action: "login" | "signup" = "login",
  options?: {
    redirect?: string;
    plan?: string;
    type?: "vps" | "rdp";
    tab?: string;
  }
): string {
  const params = new URLSearchParams();
  
  if (action === "signup") {
    params.set("mode", "signup");
  }
  
  if (options?.redirect) {
    params.set("redirect", options.redirect);
  }
  
  if (options?.plan) {
    // Build the deploy URL with plan and set as redirect
    const deployUrl = `${routes.dashboard.deploy.index}?plan=${options.plan}`;
    params.set("redirect", deployUrl);
  }
  
  if (options?.type) {
    const deployUrl = `${routes.dashboard.deploy.index}?type=${options.type}`;
    params.set("redirect", deployUrl);
  }
  
  if (options?.tab) {
    params.set("tab", options.tab);
  }
  
  const queryString = params.toString();
  return `${routes.auth.login}${queryString ? `?${queryString}` : ""}`;
}

/**
 * Build deploy URL with plan selection
 */
export function buildDeployUrl(options?: {
  plan?: string;
  type?: "vps" | "rdp";
  region?: string;
  os?: string;
}): string {
  const params = new URLSearchParams();
  
  if (options?.plan) params.set("plan", options.plan);
  if (options?.type) params.set("type", options.type);
  if (options?.region) params.set("region", options.region);
  if (options?.os) params.set("os", options.os);
  
  const queryString = params.toString();
  return `${routes.dashboard.deploy.index}${queryString ? `?${queryString}` : ""}`;
}

/**
 * Build OAuth callback URL
 */
export function buildCallbackUrl(redirect?: string): string {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const callbackUrl = `${baseUrl}${routes.auth.callback}`;
  
  if (redirect) {
    return `${callbackUrl}?next=${encodeURIComponent(redirect)}`;
  }
  
  return `${callbackUrl}?next=${encodeURIComponent(routes.dashboard.home)}`;
}

/**
 * Build pricing action URL (for deploy buttons on pricing page)
 * Redirects to auth if not logged in, otherwise to deploy
 */
export function buildPricingActionUrl(planId: string): string {
  const deployUrl = buildDeployUrl({ plan: planId });
  return buildAuthUrl("login", { redirect: deployUrl });
}

/**
 * Parse redirect URL from search params safely
 */
export function getRedirectUrl(searchParams: URLSearchParams): string {
  const redirect = searchParams.get("redirect") || searchParams.get("next");
  
  // Security: Only allow internal redirects
  if (redirect && redirect.startsWith("/")) {
    return redirect;
  }
  
  return routes.dashboard.home;
}

/**
 * Check if URL is an internal route
 */
export function isInternalUrl(url: string): boolean {
  return url.startsWith("/") && !url.startsWith("//");
}

/**
 * Get absolute URL for a route
 */
export function getAbsoluteUrl(path: string): string {
  const baseUrl = typeof window !== "undefined" 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}${path}`;
}

// ============================================================================
// ROUTE PROTECTION CONFIGURATION
// ============================================================================

/**
 * Routes that require authentication
 */
export const protectedRoutes = [
  "/dashboard",
  "/dashboard/servers",
  "/dashboard/deploy",
  "/dashboard/billing",
  "/dashboard/support",
  "/dashboard/settings",
  "/admin",
] as const;

/**
 * Routes that require admin role
 */
export const adminRoutes = [
  "/admin",
] as const;

/**
 * Routes that should redirect to dashboard if user is authenticated
 */
export const authRoutes = [
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
  // Note: reset-password should be accessible even when logged in
] as const;

/**
 * Public routes that don't require authentication
 */
export const publicRoutes = [
  "/",
  "/pricing",
  "/contact",
  "/about",
  "/terms",
  "/privacy",
  "/auth/callback",
  "/auth/reset-password",
] as const;

/**
 * Check if a path is a protected route
 */
export function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

/**
 * Check if a path is an admin route
 */
export function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some(route => pathname.startsWith(route));
}

/**
 * Check if a path is an auth route
 */
export function isAuthRoute(pathname: string): boolean {
  return authRoutes.some(route => pathname.startsWith(route));
}

/**
 * Check if a path is a public route
 */
export function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname === route || pathname.startsWith(route));
}

// ============================================================================
// LEGACY ROUTE REDIRECTS
// ============================================================================

/**
 * Map of old routes to new routes for backwards compatibility
 */
export const legacyRouteRedirects: Record<string, string> = {
  "/login": routes.auth.login,
  "/signup": routes.auth.signup,
  "/register": routes.auth.signup,
  "/forgot-password": routes.auth.forgotPassword,
  "/reset-password": routes.auth.resetPassword,
  "/deploy": routes.dashboard.deploy.index,
  "/servers": routes.dashboard.servers.list,
  "/billing": routes.dashboard.billing.index,
  "/support": routes.dashboard.support.index,
  "/settings": routes.dashboard.settings.index,
  "/account": routes.dashboard.settings.index,
  "/profile": routes.dashboard.settings.profile,
};

/**
 * Get redirect for legacy route
 */
export function getLegacyRedirect(pathname: string): string | null {
  return legacyRouteRedirects[pathname] || null;
}

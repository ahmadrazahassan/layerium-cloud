import { cookies, headers } from "next/headers";

export type Currency = "USD" | "PKR";
export type Region = "US" | "EU" | "PK" | "OTHER";

export interface GeoInfo {
  country: string;
  region: Region;
  currency: Currency;
}

// Countries that use PKR currency
const PKR_COUNTRIES = ["PK"];

// Countries that use USD currency
const USD_COUNTRIES = [
  "US", "GB", "CA", "DE", "FR", "NL", "AU", "SG", "AE",
  "AT", "BE", "CH", "DK", "ES", "FI", "IE", "IT", "NO", "SE"
];

/**
 * Determine currency based on country code
 * Used for property-based testing and middleware
 */
export function determineCurrency(country: string): GeoInfo {
  if (PKR_COUNTRIES.includes(country)) {
    return { country, currency: "PKR", region: "PK" };
  }
  
  if (USD_COUNTRIES.includes(country)) {
    const region: Region = country === "US" ? "US" : "EU";
    return { country, currency: "USD", region };
  }
  
  // Default to USD for unknown countries
  return { country, currency: "USD", region: "OTHER" };
}

/**
 * Get geo info from request headers (server-side)
 * Uses headers set by Edge Middleware
 */
export async function getGeoFromHeaders(): Promise<GeoInfo> {
  const headersList = await headers();
  
  const country = headersList.get("x-user-country") || "US";
  const currency = (headersList.get("x-user-currency") as Currency) || "USD";
  const region = (headersList.get("x-user-region") as Region) || "OTHER";
  
  return { country, currency, region };
}

/**
 * Get geo info from cookies (server-side)
 * Fallback when headers are not available
 */
export async function getGeoFromCookies(): Promise<GeoInfo> {
  const cookieStore = await cookies();
  
  const country = cookieStore.get("user-country")?.value || "US";
  const currency = (cookieStore.get("user-currency")?.value as Currency) || "USD";
  const region = (cookieStore.get("user-region")?.value as Region) || "OTHER";
  
  return { country, currency, region };
}

/**
 * Get geo info - tries headers first, then cookies
 */
export async function getGeoInfo(): Promise<GeoInfo> {
  try {
    const headerGeo = await getGeoFromHeaders();
    if (headerGeo.country !== "US" || headerGeo.currency !== "USD") {
      return headerGeo;
    }
    return await getGeoFromCookies();
  } catch {
    // Fallback for client-side or when headers/cookies unavailable
    return { country: "US", currency: "USD", region: "OTHER" };
  }
}

/**
 * Currency symbols mapping
 */
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  PKR: "Rs",
};

/**
 * Currency names mapping
 */
export const CURRENCY_NAMES: Record<Currency, string> = {
  USD: "US Dollar",
  PKR: "Pakistani Rupee",
};

/**
 * Pricing and Geo-detection Types
 */

export type Currency = "USD" | "PKR";
export type Region = "US" | "EU" | "PK" | "OTHER";

export interface GeoInfo {
  country: string;
  region: Region;
  currency: Currency;
}

export interface PricingContext {
  currency: Currency;
  region: Region;
  symbol: string;
}

/**
 * Currency configuration
 */
export const CURRENCY_CONFIG: Record<Currency, { symbol: string; locale: string }> = {
  USD: { symbol: "$", locale: "en-US" },
  PKR: { symbol: "Rs", locale: "en-PK" },
};

/**
 * Countries that use USD pricing
 */
export const USD_COUNTRIES = [
  "US", // United States
  "GB", // United Kingdom
  "CA", // Canada
  "DE", // Germany
  "FR", // France
  "NL", // Netherlands
  "AU", // Australia
  "SG", // Singapore
  "AE", // UAE
];

/**
 * Countries that use PKR pricing
 */
export const PKR_COUNTRIES = ["PK"]; // Pakistan

/**
 * Datacenter locations
 */
export interface DatacenterLocation {
  id: string;
  name: string;
  country: string;
  flag: string;
  latency?: string;
}

export const DATACENTER_LOCATIONS: DatacenterLocation[] = [
  { id: "us-east", name: "New York", country: "USA", flag: "🇺🇸", latency: "~20ms" },
  { id: "eu-west", name: "Frankfurt", country: "Germany", flag: "🇩🇪", latency: "~30ms" },
  { id: "ap-south", name: "Singapore", country: "Singapore", flag: "🇸🇬", latency: "~50ms" },
  { id: "eu-central", name: "Amsterdam", country: "Netherlands", flag: "🇳🇱", latency: "~25ms" },
  { id: "me-south", name: "Dubai", country: "UAE", flag: "🇦🇪", latency: "~40ms" },
  { id: "pk-south", name: "Karachi", country: "Pakistan", flag: "🇵🇰", latency: "~10ms" },
];

/**
 * OS Templates
 */
export interface OSTemplate {
  id: string;
  name: string;
  category: "linux" | "windows";
  icon: string;
}

export const OS_TEMPLATES: OSTemplate[] = [
  { id: "ubuntu-22.04", name: "Ubuntu 22.04 LTS", category: "linux", icon: "🐧" },
  { id: "ubuntu-20.04", name: "Ubuntu 20.04 LTS", category: "linux", icon: "🐧" },
  { id: "debian-12", name: "Debian 12", category: "linux", icon: "🐧" },
  { id: "centos-9", name: "CentOS Stream 9", category: "linux", icon: "🐧" },
  { id: "rocky-9", name: "Rocky Linux 9", category: "linux", icon: "🐧" },
  { id: "almalinux-9", name: "AlmaLinux 9", category: "linux", icon: "🐧" },
  { id: "windows-2022", name: "Windows Server 2022", category: "windows", icon: "🪟" },
  { id: "windows-2019", name: "Windows Server 2019", category: "windows", icon: "🪟" },
  { id: "windows-10", name: "Windows 10 Pro", category: "windows", icon: "🪟" },
  { id: "windows-11", name: "Windows 11 Pro", category: "windows", icon: "🪟" },
];

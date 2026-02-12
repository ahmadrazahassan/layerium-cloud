import { type Currency, CURRENCY_SYMBOLS } from "./geo";

export interface PricingPlan {
  id: string;
  name: string;
  type: "VPS" | "RDP";
  cpu_cores: number;
  ram_gb: number;
  storage_gb: number;
  bandwidth_tb: number;
  price_usd: number;
  price_pkr: number;
  locations: string[];
  features: string[];
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface FormattedPrice {
  amount: number;
  formatted: string;
  currency: Currency;
  symbol: string;
}

/**
 * Get the price for a plan based on currency
 */
export function getPlanPrice(plan: PricingPlan, currency: Currency): number {
  return currency === "PKR" ? plan.price_pkr : plan.price_usd;
}

/**
 * Format a price with currency symbol
 */
export function formatPrice(amount: number, currency: Currency): FormattedPrice {
  const symbol = CURRENCY_SYMBOLS[currency];
  
  // Format based on currency
  const formatted = currency === "PKR"
    ? `${symbol} ${amount.toLocaleString("en-PK")}`
    : `${symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  
  return {
    amount,
    formatted,
    currency,
    symbol,
  };
}

/**
 * Format a plan's price based on currency
 */
export function formatPlanPrice(plan: PricingPlan, currency: Currency): FormattedPrice {
  const amount = getPlanPrice(plan, currency);
  return formatPrice(amount, currency);
}

/**
 * Calculate monthly price from different billing periods
 */
export function calculateMonthlyPrice(
  amount: number,
  period: "monthly" | "quarterly" | "yearly"
): number {
  switch (period) {
    case "quarterly":
      return amount / 3;
    case "yearly":
      return amount / 12;
    default:
      return amount;
  }
}

/**
 * Calculate discount percentage for longer billing periods
 */
export function getDiscountPercentage(period: "monthly" | "quarterly" | "yearly"): number {
  switch (period) {
    case "quarterly":
      return 5;
    case "yearly":
      return 15;
    default:
      return 0;
  }
}

/**
 * Apply discount to a price
 */
export function applyDiscount(amount: number, discountPercent: number): number {
  return amount * (1 - discountPercent / 100);
}

/**
 * Format storage size for display
 */
export function formatStorage(gb: number): string {
  if (gb >= 1000) {
    return `${(gb / 1000).toFixed(gb % 1000 === 0 ? 0 : 1)} TB`;
  }
  return `${gb} GB`;
}

/**
 * Format bandwidth for display
 */
export function formatBandwidth(tb: number): string {
  if (tb >= 1000) {
    return `${(tb / 1000).toFixed(0)} PB`;
  }
  return `${tb} TB`;
}

/**
 * Format RAM for display
 */
export function formatRAM(gb: number): string {
  return `${gb} GB`;
}

/**
 * Format CPU cores for display
 */
export function formatCPU(cores: number): string {
  return `${cores} vCPU${cores > 1 ? "s" : ""}`;
}

/**
 * Get plan specs as formatted strings
 */
export function getFormattedSpecs(plan: PricingPlan) {
  return {
    cpu: formatCPU(plan.cpu_cores),
    ram: formatRAM(plan.ram_gb),
    storage: formatStorage(plan.storage_gb),
    bandwidth: formatBandwidth(plan.bandwidth_tb),
  };
}

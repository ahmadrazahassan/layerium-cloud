"use client";

import { useState, useEffect, useCallback } from "react";
import type { Currency, Region } from "@/lib/utils/geo";

export interface PricingContext {
  currency: Currency;
  region: Region;
  country: string;
  isLoading: boolean;
}

/**
 * Get cookie value by name
 */
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }
  return undefined;
}

/**
 * Hook to access pricing context (currency, region) on client-side
 * Reads from cookies set by Edge Middleware
 */
export function usePricing(): PricingContext {
  const [context, setContext] = useState<PricingContext>({
    currency: "USD",
    region: "OTHER",
    country: "US",
    isLoading: true,
  });

  useEffect(() => {
    const currency = (getCookie("user-currency") as Currency) || "USD";
    const region = (getCookie("user-region") as Region) || "OTHER";
    const country = getCookie("user-country") || "US";

    setContext({
      currency,
      region,
      country,
      isLoading: false,
    });
  }, []);

  return context;
}

/**
 * Hook to format prices based on current currency
 */
export function usePriceFormatter() {
  const { currency } = usePricing();

  const formatPrice = useCallback(
    (usdPrice: number, pkrPrice: number): string => {
      const amount = currency === "PKR" ? pkrPrice : usdPrice;
      const symbol = currency === "PKR" ? "Rs" : "$";

      if (currency === "PKR") {
        return `${symbol} ${amount.toLocaleString("en-PK")}`;
      }
      return `${symbol}${amount.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}`;
    },
    [currency]
  );

  const getPrice = useCallback(
    (usdPrice: number, pkrPrice: number): number => {
      return currency === "PKR" ? pkrPrice : usdPrice;
    },
    [currency]
  );

  const getCurrencySymbol = useCallback((): string => {
    return currency === "PKR" ? "Rs" : "$";
  }, [currency]);

  return {
    currency,
    formatPrice,
    getPrice,
    getCurrencySymbol,
  };
}

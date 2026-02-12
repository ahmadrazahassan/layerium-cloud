"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-11 w-full appearance-none rounded-input border bg-surface-1 px-4 py-2 pr-10 text-sm font-outfit text-dark transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-error focus-visible:ring-error"
              : "border-border hover:border-border-strong",
            className
          )}
          ref={ref}
          aria-invalid={error}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-muted pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-pill font-dm-sans font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-surface-2 text-dark",
        primary: "bg-primary text-dark",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        error: "bg-error/10 text-error",
        info: "bg-info/10 text-info",
        outline: "border border-border text-dark",
      },
      size: {
        default: "px-3 py-1 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

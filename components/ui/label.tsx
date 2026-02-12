"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const labelVariants = cva(
  "font-dm-sans font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, size, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(labelVariants({ size }), "text-dark", className)}
      {...props}
    >
      {children}
      {required && <span className="text-error ml-1">*</span>}
    </label>
  )
);
Label.displayName = "Label";

export { Label, labelVariants };

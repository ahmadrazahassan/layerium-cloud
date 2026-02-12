"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full font-outfit text-dark bg-surface-1 border transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-dark placeholder:text-dark-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-border hover:border-border-strong",
        error: "border-error focus-visible:ring-error",
      },
      inputSize: {
        default: "h-11 px-4 py-2 text-sm rounded-input",
        sm: "h-9 px-3 py-1 text-xs rounded-sm",
        lg: "h-13 px-5 py-3 text-base rounded-input",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, inputSize, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          inputVariants({
            variant: error ? "error" : variant,
            inputSize,
            className,
          })
        )}
        ref={ref}
        aria-invalid={error}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };

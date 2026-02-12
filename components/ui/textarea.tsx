"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-input border bg-surface-1 px-4 py-3 text-sm font-outfit text-dark transition-all placeholder:text-dark-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 resize-none",
          error
            ? "border-error focus-visible:ring-error"
            : "border-border hover:border-border-strong",
          className
        )}
        ref={ref}
        aria-invalid={error}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };

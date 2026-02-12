"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, htmlFor, error, description, required, children, className }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        {label && (
          <Label htmlFor={htmlFor} required={required}>
            {label}
          </Label>
        )}
        {children}
        {description && !error && (
          <p className="text-xs text-dark-muted font-outfit">{description}</p>
        )}
        {error && (
          <p className="text-xs text-error font-outfit" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
FormField.displayName = "FormField";

export { FormField };

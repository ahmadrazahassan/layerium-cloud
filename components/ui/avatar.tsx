"use client";

import * as React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, getInitials } from "@/lib/utils";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full bg-surface-2",
  {
    variants: {
      size: {
        default: "h-10 w-10",
        sm: "h-8 w-8",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  fallback?: string;
}

function Avatar({ className, size, src, alt, fallback, ...props }: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  return (
    <div className={cn(avatarVariants({ size }), className)} {...props}>
      {src && !hasError ? (
        <Image
          src={src}
          alt={alt || "Avatar"}
          fill
          className="object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-surface-2 text-dark-muted font-dm-sans font-medium text-sm">
          {fallback ? getInitials(fallback) : "?"}
        </div>
      )}
    </div>
  );
}

export { Avatar, avatarVariants };

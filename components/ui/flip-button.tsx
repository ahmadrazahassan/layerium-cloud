"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FlipButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "dark" | "white" | "ghost";
  className?: string;
  icon?: React.ReactNode;
  external?: boolean;
}

export function FlipButton({ 
  href, 
  children, 
  variant = "dark",
  className,
  icon,
  external = false,
}: FlipButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-dm-sans font-semibold text-[15px] overflow-hidden transition-colors duration-300";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    dark: "bg-dark text-white hover:bg-primary",
    white: "bg-white text-dark hover:bg-primary hover:text-white",
    ghost: "bg-white/[0.08] text-white hover:bg-white/[0.15]",
  };

  const content = (
    <motion.span
      className="relative block overflow-hidden"
      initial="initial"
      whileHover="hovered"
    >
      {/* Original text */}
      <motion.span
        className="inline-flex items-center gap-2"
        variants={{
          initial: { y: 0 },
          hovered: { y: "-100%" },
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
        {icon}
      </motion.span>
      
      {/* Duplicate text for flip effect */}
      <motion.span
        className="absolute inset-0 inline-flex items-center justify-center gap-2"
        variants={{
          initial: { y: "100%" },
          hovered: { y: 0 },
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
        {icon}
      </motion.span>
    </motion.span>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(baseStyles, variants[variant], className)}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={cn(baseStyles, variants[variant], className)}
    >
      {content}
    </Link>
  );
}

// Arrow icon for buttons
export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

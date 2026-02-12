"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FlipButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "dark" | "white" | "ghost" | "green";
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
    primary: "bg-primary text-white hover:bg-dark",
    dark: "bg-dark text-white hover:bg-primary",
    white: "bg-white text-dark hover:bg-dark hover:text-white",
    ghost: "bg-white/[0.08] text-white hover:bg-white/[0.15]",
    green: "bg-[#BEFF00] text-dark hover:bg-[#a8e600] shadow-[0_0_20px_rgba(190,255,0,0.15)]",
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

// Green split trial button — matches brand CTA design
interface GreenTrialButtonProps {
  href: string;
  children?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function GreenTrialButton({
  href,
  children = "Start Free Trial",
  className,
  size = "md",
}: GreenTrialButtonProps) {
  const sizes = {
    sm: { text: "text-[12px] px-4 py-2", icon: "w-8 h-8", arrow: "w-3 h-3" },
    md: { text: "text-[13.5px] px-6 py-3", icon: "w-10 h-10", arrow: "w-3.5 h-3.5" },
    lg: { text: "text-[15px] px-7 py-3.5", icon: "w-11 h-11", arrow: "w-4 h-4" },
  };
  const s = sizes[size];

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center rounded-lg bg-[#BEFF00] border border-[#a0d600] transition-all duration-300 hover:bg-[#b0f000] hover:shadow-[0_0_24px_rgba(190,255,0,0.25)]",
        className
      )}
    >
      <span className={cn("font-dm-sans font-semibold text-dark", s.text)}>
        {children}
      </span>
      <span className="w-px self-stretch bg-[#a0d600]/60" />
      <span className={cn("flex items-center justify-center text-dark", s.icon)}>
        <svg
          viewBox="0 0 14 14"
          fill="none"
          className={cn(s.arrow, "group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200")}
        >
          <path d="M4 10L10 4M10 4H5M10 4V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}

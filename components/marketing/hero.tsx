"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Globe, ArrowRight } from "lucide-react";
import { routes } from "@/lib/routes";

// Flip text animation component
function FlipText({ children, className }: { children: string; className?: string }) {
  return (
    <span className={`relative inline-flex overflow-hidden ${className}`}>
      <span className="group-hover:-translate-y-full transition-transform duration-300 ease-[0.16,1,0.3,1]">
        {children}
      </span>
      <span className="absolute left-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[0.16,1,0.3,1]">
        {children}
      </span>
    </span>
  );
}

// Premium easing - same as Linear/Vercel
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// More impactful words for VPS/RDP
const words = ["deliver", "perform", "scale", "dominate"];

// Staggered word animation
function AnimatedHeadline() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <h1 ref={ref} className="text-[2.5rem] sm:text-5xl lg:text-6xl xl:text-7xl font-google-sans font-bold text-dark leading-[1.1] tracking-tight mb-6">
      <span className="block overflow-hidden">
        <motion.span
          className="block"
          initial={{ y: "100%", opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          VPS & RDP servers
        </motion.span>
      </span>
      <span className="block overflow-hidden">
        <motion.span
          className="inline"
          initial={{ y: "100%", opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
        >
          built to{" "}
        </motion.span>
        <RotatingWord />
      </span>
    </h1>
  );
}

function RotatingWord() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Get the longest word for consistent width
  const longestWord = words.reduce((a, b) => a.length > b.length ? a : b);

  return (
    <span className="relative inline-block">
      {/* Invisible placeholder for width */}
      <span className="invisible">{longestWord}</span>
      {/* Animated word */}
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.4, ease }}
          className="absolute left-0 text-primary"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function TerminalWindow() {
  const [step, setStep] = React.useState(0);
  const lines = [
    { type: "command", text: "layerium deploy --region us-east-1" },
    { type: "output", text: "→ Creating instance..." },
    { type: "output", text: "→ Allocating resources (4 vCPU, 8GB RAM)" },
    { type: "output", text: "→ Configuring network..." },
    { type: "success", text: "✓ Server deployed in 47 seconds" },
    { type: "info", text: "  IP: 192.168.1.100 | Status: Running" },
  ];

  React.useEffect(() => {
    if (step < lines.length) {
      const timer = setTimeout(() => setStep(step + 1), step === 0 ? 800 : 600);
      return () => clearTimeout(timer);
    }
  }, [step, lines.length]);

  return (
    <div className="bg-[#1a1b1e] rounded-xl overflow-hidden shadow-elevated border border-white/[0.06]">
      <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="ml-2 font-mono text-[11px] text-white/40">terminal — layerium-cli</span>
      </div>
      
      <div className="p-4 font-mono text-[13px] leading-relaxed min-h-[200px]">
        {lines.slice(0, step).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`${
              line.type === "command" ? "text-white" :
              line.type === "success" ? "text-[#28c840]" :
              line.type === "info" ? "text-white/50" :
              "text-white/60"
            }`}
          >
            {line.type === "command" && <span className="text-primary mr-2">$</span>}
            {line.text}
          </motion.div>
        ))}
        {step < lines.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-primary ml-1"
          />
        )}
      </div>
    </div>
  );
}

function StatsCard() {
  return (
    <div className="bg-surface-1 rounded-xl border border-border p-4 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <span className="font-dm-sans text-xs font-semibold text-dark-muted uppercase tracking-wider">Live Metrics</span>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-success">
          <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
          Real-time
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Uptime", value: "99.99%", color: "text-success" },
          { label: "Latency", value: "12ms", color: "text-dark" },
          { label: "Requests", value: "2.4M", color: "text-dark" },
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <div className={`font-work-sans font-bold text-xl ${stat.color}`}>{stat.value}</div>
            <div className="font-outfit text-[10px] text-dark-muted mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegionCard() {
  const regions = [
    { name: "US East", flag: "🇺🇸", latency: "12ms" },
    { name: "EU West", flag: "🇪🇺", latency: "24ms" },
    { name: "Asia", flag: "🇸🇬", latency: "45ms" },
  ];

  return (
    <div className="bg-surface-1 rounded-xl border border-border p-4 shadow-card">
      <div className="flex items-center gap-2 mb-3">
        <Globe className="w-4 h-4 text-primary" />
        <span className="font-dm-sans text-xs font-semibold text-dark">Global Regions</span>
      </div>
      <div className="space-y-2">
        {regions.map((region, i) => (
          <div key={i} className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-2">
              <span className="text-sm">{region.flag}</span>
              <span className="font-outfit text-xs text-dark">{region.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-dark-muted">{region.latency}</span>
              <span className="w-1.5 h-1.5 bg-success rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Logo marquee
function LogoMarquee() {
  const brands = [
    { name: "Vercel", logo: "https://cdn.simpleicons.org/vercel/000000" },
    { name: "Linear", logo: "https://cdn.simpleicons.org/linear/5E6AD2" },
    { name: "Notion", logo: "https://cdn.simpleicons.org/notion/000000" },
    { name: "Figma", logo: "https://cdn.simpleicons.org/figma/F24E1E" },
    { name: "Stripe", logo: "https://cdn.simpleicons.org/stripe/635BFF" },
    { name: "Discord", logo: "https://cdn.simpleicons.org/discord/5865F2" },
    { name: "GitHub", logo: "https://cdn.simpleicons.org/github/181717" },
    { name: "GitLab", logo: "https://cdn.simpleicons.org/gitlab/FC6D26" },
    { name: "Dropbox", logo: "https://cdn.simpleicons.org/dropbox/0061FF" },
    { name: "Airbnb", logo: "https://cdn.simpleicons.org/airbnb/FF5A5F" },
  ];

  return (
    <div className="relative overflow-hidden py-8">
      <div className="absolute left-0 top-0 bottom-0 w-24 lg:w-40 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 lg:w-40 bg-gradient-to-l from-background to-transparent z-10" />
      
      <motion.div
        className="flex gap-16"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ x: { duration: 30, repeat: Infinity, ease: "linear" } }}
      >
        {[...brands, ...brands].map((brand, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0 group">
            <img 
              src={brand.logo} 
              alt={brand.name} 
              className="h-7 w-auto opacity-30 group-hover:opacity-70 transition-opacity duration-500 grayscale group-hover:grayscale-0"
            />
            <span className="font-dm-sans font-semibold text-sm text-dark/30 group-hover:text-dark/60 transition-colors duration-500 whitespace-nowrap">
              {brand.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen pt-32 lg:pt-40 pb-20 overflow-hidden">
      {/* Simple static background grid - no parallax */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[1400px] opacity-[0.03]" viewBox="0 0 1400 1400">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e1f26" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-20">
            <AnimatedHeadline />

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="font-outfit text-lg lg:text-xl text-dark-muted leading-relaxed mb-10 max-w-2xl mx-auto"
            >
              Deploy production-ready Windows RDP and Linux VPS in under 60 seconds. 
              NVMe storage, 15+ global locations, and enterprise-grade DDoS protection included.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link
                href={routes.pricing}
                className="group inline-flex items-center justify-center gap-2.5 h-11 px-8 bg-dark text-white font-dm-sans text-[15px] font-medium rounded-lg hover:bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm"
              >
                <FlipText>Pricing</FlipText>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="#faq"
                className="group inline-flex items-center justify-center h-11 px-8 bg-white text-dark font-dm-sans text-[15px] font-medium rounded-lg border border-dark/10 hover:border-dark/20 hover:bg-surface-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm"
              >
                <FlipText>FAQ</FlipText>
              </Link>
            </motion.div>
          </div>

          {/* Dashboard Preview - simple fade in, no parallax */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-3xl" />
            
            <div className="relative bg-surface-1 rounded-2xl border border-border shadow-elevated overflow-hidden">
              {/* Browser Chrome */}
              <div className="flex items-center gap-3 px-4 py-3 bg-surface-2/50 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-dark/10" />
                  <div className="w-3 h-3 rounded-full bg-dark/10" />
                  <div className="w-3 h-3 rounded-full bg-dark/10" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-surface-1 rounded-lg border border-border">
                    <div className="w-3 h-3 rounded-full bg-success/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    </div>
                    <span className="font-mono text-[11px] text-dark-muted">cloud.layerium.com/dashboard</span>
                  </div>
                </div>
                <div className="w-16" />
              </div>

              {/* Dashboard Content */}
              <div className="p-6 lg:p-8">
                <div className="grid lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-3">
                    <TerminalWindow />
                  </div>
                  <div className="lg:col-span-2 space-y-4">
                    <StatsCard />
                    <RegionCard />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Logos Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-24 lg:mt-32"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3">
                <span className="h-px w-8 bg-border-strong" />
                <span className="font-dm-sans text-[10px] font-semibold text-dark-muted uppercase tracking-[0.2em]">
                  Trusted by industry leaders
                </span>
                <span className="h-px w-8 bg-border-strong" />
              </div>
            </div>
            
            <LogoMarquee />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

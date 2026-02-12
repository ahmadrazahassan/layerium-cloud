"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { 
  Check, 
  ArrowRight, 
  Cpu, 
  HardDrive, 
  Gauge,
  Shield,
  Monitor,
  Globe,
  Users,
  Clock,
  Lock,
  Wifi
} from "lucide-react";
import { Header, Footer } from "@/components/marketing";
import { buildPricingActionUrl } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { WireframeDottedGlobe } from "@/components/ui/wireframe-dotted-globe";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const rdpPlans = [
  { id: "rdp-basic", name: "Basic", price: 15, cpu: 2, ram: 4, storage: 60, bandwidth: 2 },
  { id: "rdp-standard", name: "Standard", price: 30, cpu: 4, ram: 8, storage: 120, bandwidth: 3, isPopular: true },
  { id: "rdp-pro", name: "Pro", price: 50, cpu: 6, ram: 12, storage: 200, bandwidth: 4 },
  { id: "rdp-enterprise", name: "Enterprise", price: 80, cpu: 8, ram: 16, storage: 320, bandwidth: 5 },
  { id: "rdp-ultimate", name: "Ultimate", price: 120, cpu: 12, ram: 32, storage: 500, bandwidth: 8 },
];

const windowsVersions = [
  { name: "Windows 11", version: "23H2" },
  { name: "Windows 10", version: "22H2" },
  { name: "Server 2022", version: "Latest" },
];

const useCases = ["Remote Work", "Trading", "Development", "Automation", "Gaming", "Business"];

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 2, ease });
      return controls.stop;
    }
  }, [isInView, value, count]);

  React.useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => setDisplayValue(latest));
    return unsubscribe;
  }, [rounded]);

  return <span ref={ref}>{displayValue.toLocaleString()}{suffix}</span>;
}


// Compact Windows Version Selector - Pill Design
function WindowsShowcase() {
  const [activeVersion, setActiveVersion] = React.useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease }}
      className="relative"
    >
      {/* Compact glassmorphism container */}
      <div className="relative bg-dark/[0.02] backdrop-blur-sm rounded-full border border-dark/[0.06] p-2 inline-flex items-center gap-2">
        {windowsVersions.map((win, i) => (
          <motion.button
            key={`${win.name}-${win.version}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            onClick={() => setActiveVersion(i)}
            className={cn(
              "relative flex items-center gap-2.5 px-5 py-2.5 rounded-full transition-all duration-300",
              activeVersion === i
                ? "bg-surface-1 shadow-soft"
                : "hover:bg-surface-1/60"
            )}
          >
            {activeVersion === i && (
              <motion.div
                layoutId="activeWinPill"
                className="absolute inset-0 bg-surface-1 rounded-full shadow-soft"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            
            <img 
              src="/windows logo.png" 
              alt="Windows" 
              className={cn(
                "relative w-4 h-4 transition-transform duration-300",
                activeVersion === i && "scale-110"
              )} 
            />
            <span className={cn(
              "relative font-dm-sans font-semibold text-sm transition-colors duration-300",
              activeVersion === i ? "text-dark" : "text-dark-muted"
            )}>
              {win.name}
            </span>
            <span className="relative font-outfit text-xs text-dark-muted">
              {win.version}
            </span>
          </motion.button>
        ))}
        
        {/* Status indicator */}
        <div className="flex items-center gap-1.5 px-4 py-2 ml-2 border-l border-border">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="font-dm-sans text-xs font-semibold text-blue-600">Licensed</span>
        </div>
      </div>
    </motion.div>
  );
}


// Modern Pricing Cards - Framer Inspired
// Interactive Plan Selector - Same as VPS Style
function PricingSection() {
  const [selectedPlan, setSelectedPlan] = React.useState(1); // Default to Standard
  const [selectedWin, setSelectedWin] = React.useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const plan = rdpPlans[selectedPlan];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Plan Selector Strip */}
      <div className="relative mb-8">
        <div className="flex items-stretch bg-surface-1 rounded-2xl border border-border p-1.5 overflow-hidden">
          {rdpPlans.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlan(i)}
              className={cn(
                "relative flex-1 py-4 px-3 rounded-xl transition-all duration-300",
                selectedPlan === i 
                  ? "bg-dark" 
                  : "hover:bg-surface-2"
              )}
            >
              {p.isPopular && (
                <span className={cn(
                  "absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[9px] font-dm-sans font-bold uppercase tracking-wider rounded-full transition-colors",
                  selectedPlan === i 
                    ? "bg-primary text-white" 
                    : "bg-primary/10 text-primary"
                )}>
                  Popular
                </span>
              )}
              <div className={cn(
                "font-google-sans font-semibold text-sm mb-1 transition-colors",
                selectedPlan === i ? "text-white" : "text-dark"
              )}>
                {p.name}
              </div>
              <div className={cn(
                "font-work-sans font-bold text-xl transition-colors",
                selectedPlan === i ? "text-white" : "text-dark"
              )}>
                ${p.price}
                <span className={cn(
                  "text-xs font-normal ml-0.5",
                  selectedPlan === i ? "text-white/50" : "text-dark-muted"
                )}>/mo</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Plan Details */}
      <motion.div
        key={selectedPlan}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-surface-1 rounded-3xl border border-border overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 pb-0">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-google-sans font-bold text-3xl text-dark">
                  {plan.name}
                </h3>
                {plan.isPopular && (
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-dm-sans font-semibold rounded-full">
                    Most Popular
                  </span>
                )}
              </div>
              <p className="font-outfit text-dark-muted">
                Perfect for {plan.name === "Basic" ? "personal use and light tasks" : 
                            plan.name === "Standard" ? "professionals and businesses" :
                            plan.name === "Pro" ? "power users and heavy workloads" :
                            plan.name === "Enterprise" ? "maximum performance" : "demanding applications"}
              </p>
            </div>
            <div className="text-right">
              <div className="font-work-sans font-bold text-4xl text-dark">
                ${plan.price}
                <span className="text-lg font-normal text-dark-muted">/mo</span>
              </div>
              <div className="font-outfit text-sm text-dark-muted">
                Billed monthly
              </div>
            </div>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-surface-2 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-primary" />
                </div>
                <span className="font-outfit text-sm text-dark-muted">vCPU</span>
              </div>
              <div className="font-work-sans font-bold text-2xl text-dark">
                {plan.cpu}
                <span className="text-sm font-normal text-dark-muted ml-1">
                  {plan.cpu > 1 ? "Cores" : "Core"}
                </span>
              </div>
            </div>
            <div className="bg-surface-2 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Gauge className="w-4 h-4 text-primary" />
                </div>
                <span className="font-outfit text-sm text-dark-muted">Memory</span>
              </div>
              <div className="font-work-sans font-bold text-2xl text-dark">
                {plan.ram}
                <span className="text-sm font-normal text-dark-muted ml-1">GB RAM</span>
              </div>
            </div>
            <div className="bg-surface-2 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HardDrive className="w-4 h-4 text-primary" />
                </div>
                <span className="font-outfit text-sm text-dark-muted">Storage</span>
              </div>
              <div className="font-work-sans font-bold text-2xl text-dark">
                {plan.storage}
                <span className="text-sm font-normal text-dark-muted ml-1">GB NVMe</span>
              </div>
            </div>
            <div className="bg-surface-2 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Wifi className="w-4 h-4 text-primary" />
                </div>
                <span className="font-outfit text-sm text-dark-muted">Transfer</span>
              </div>
              <div className="font-work-sans font-bold text-2xl text-dark">
                {plan.bandwidth}
                <span className="text-sm font-normal text-dark-muted ml-1">TB/mo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Windows Selection & CTA */}
        <div className="px-8 pb-8">
          <div className="flex items-center justify-between gap-6 p-6 bg-dark rounded-2xl">
            {/* Windows Selector */}
            <div className="flex items-center gap-4">
              <span className="font-dm-sans text-xs font-semibold text-white/40 uppercase tracking-wider">
                Windows
              </span>
              <div className="flex gap-2">
                {windowsVersions.map((win, i) => (
                  <button
                    key={win.name}
                    onClick={() => setSelectedWin(i)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200",
                      selectedWin === i 
                        ? "bg-white/15 border border-white/20" 
                        : "border border-white/5 hover:border-white/15"
                    )}
                  >
                    <img src="/windows logo.png" alt={win.name} className="w-4 h-4" />
                    <span className="font-dm-sans text-sm font-medium text-white">
                      {win.name.replace("Windows ", "")}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Deploy Button */}
            <Link
              href={buildPricingActionUrl(plan.id)}
              className="flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-full font-dm-sans font-semibold transition-all duration-200 hover:bg-primary-hover hover:scale-[1.02]"
            >
              Deploy Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Features */}
      <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
        {["Windows Licensed", "Full Admin Access", "24/7 Support", "99.9% Uptime", "Free Setup"].map((feature) => (
          <span key={feature} className="flex items-center gap-2 text-sm font-outfit text-dark-muted">
            <Check className="w-4 h-4 text-emerald-500" strokeWidth={2.5} />
            {feature}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// Windows Desktop Preview
function WindowsPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-dark/5 rounded-[40px] blur-3xl" />
      <div className="relative bg-dark rounded-[24px] overflow-hidden border border-white/10 shadow-elevated">
        <div className="flex items-center justify-between px-5 py-4 bg-[#2d2e36] border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="font-mono text-xs text-white/40">Remote Desktop</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 rounded-full">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs font-dm-sans font-medium text-emerald-400">Connected</span>
          </div>
        </div>
        
        <div className="relative aspect-[16/10] bg-[#0078d4]">
          <div className="absolute top-4 left-4 space-y-4">
            {[
              { name: "This PC", icon: Monitor },
              { name: "Browser", icon: Globe },
              { name: "Files", icon: HardDrive },
            ].map((item) => (
              <motion.div 
                key={item.name} 
                className="flex flex-col items-center gap-1 w-14 cursor-pointer"
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] text-white/90">{item.name}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute top-8 right-8 w-48 bg-white rounded-lg shadow-2xl overflow-hidden"
          >
            <div className="h-6 bg-gray-100 flex items-center px-2 gap-1">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <div className="p-3 space-y-2">
              <div className="h-2 bg-gray-200 rounded w-full" />
              <div className="h-2 bg-gray-200 rounded w-3/4" />
              <div className="h-2 bg-gray-200 rounded w-1/2" />
            </div>
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 h-10 bg-black/60 backdrop-blur-sm flex items-center justify-between px-3">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
                </svg>
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 bg-white/10 rounded" />
              ))}
            </div>
            <div className="flex items-center gap-3 text-white/60 text-[11px] pr-2">
              <Wifi className="w-3.5 h-3.5" />
              <span className="font-mono">12:34 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// Feature Bento Card
function FeatureBento({ 
  icon: Icon, 
  title, 
  description, 
  visual,
  className = "",
  index 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  visual?: React.ReactNode;
  className?: string;
  index: number;
}) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease }}
      className={cn("group", className)}
    >
      <div className="relative h-full bg-surface-1 rounded-[28px] border border-border overflow-hidden hover:border-primary/20 hover:shadow-[0_20px_60px_-15px_rgba(255,85,51,0.08)] transition-all duration-500">
        <div className="p-7">
          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-400">
              <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-400" strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="font-google-sans font-semibold text-xl text-dark mb-2">{title}</h3>
          <p className="font-outfit text-[15px] text-dark-muted leading-relaxed">{description}</p>
        </div>
        {visual && <div className="px-7 pb-7">{visual}</div>}
      </div>
    </motion.div>
  );
}

// Multi-user visualization with real avatars
function MultiUserViz() {
  const users = [
    { name: "Sarah", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
    { name: "Mike", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    { name: "Emma", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
    { name: "John", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  ];

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-3">
        {users.map((user, i) => (
          <motion.div
            key={user.name}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative"
          >
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-surface-1 object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-surface-1" />
          </motion.div>
        ))}
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-2 rounded-full">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span className="font-outfit text-sm text-dark-muted">4 active</span>
      </div>
    </div>
  );
}

// Connection status
function ConnectionStatus() {
  const metrics = [
    { label: "Latency", value: "12ms" },
    { label: "Quality", value: "1080p" },
    { label: "FPS", value: "60" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-2 px-4 py-2 bg-surface-2 rounded-full"
        >
          <span className="w-2 h-2 bg-emerald-500 rounded-full" />
          <span className="font-outfit text-sm text-dark-muted">{m.label}</span>
          <span className="font-work-sans font-semibold text-sm text-dark">{m.value}</span>
        </motion.div>
      ))}
    </div>
  );
}

// Globe Visualization using WireframeDottedGlobe
function GlobeViz() {
  return (
    <div className="relative h-44 flex items-center justify-center overflow-hidden">
      <WireframeDottedGlobe size={160} rotationSpeed={0.004} />
    </div>
  );
}

// Device grid
function DeviceGrid() {
  const devices = [
    { icon: Monitor, label: "Desktop" },
    { icon: Users, label: "Mobile" },
    { icon: Globe, label: "Tablet" },
    { icon: Wifi, label: "Browser" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {devices.map((d, i) => (
        <motion.div
          key={d.label}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-col items-center gap-2 p-3 bg-surface-2 rounded-xl hover:bg-primary/10 transition-colors cursor-pointer"
        >
          <d.icon className="w-5 h-5 text-dark-muted" />
          <span className="font-outfit text-[11px] text-dark-muted">{d.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

// Security badges
function SecurityBadges() {
  return (
    <div className="flex flex-wrap gap-2">
      {["256-bit SSL", "2FA Ready", "Firewall"].map((badge, i) => (
        <motion.span
          key={badge}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-full text-sm font-dm-sans font-medium"
        >
          {badge}
        </motion.span>
      ))}
    </div>
  );
}


export default function RDPPage() {
  const headerRef = React.useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 lg:pt-36">
        {/* Hero */}
        <section className="relative pb-20 lg:pb-28 overflow-hidden">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div ref={headerRef}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, ease }}
                  className="mb-6"
                >
                  <span className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-surface-1 rounded-full border border-border text-sm font-dm-sans font-semibold text-dark-muted shadow-xs">
                    <Monitor className="w-4 h-4 text-primary" />
                    Windows RDP Hosting
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.1, ease }}
                  className="text-4xl sm:text-5xl lg:text-[3.75rem] font-google-sans font-bold text-dark tracking-tight leading-[1.08] mb-6"
                >
                  Premium Windows
                  <br />
                  <span className="text-primary">RDP Servers</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.2, ease }}
                  className="font-outfit text-lg lg:text-xl text-dark-muted leading-relaxed mb-10"
                >
                  Full Windows desktop experience from anywhere. Run any application, 
                  access from any device, with enterprise-grade security.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.3, ease }}
                  className="flex flex-wrap gap-8 mb-10"
                >
                  {[
                    { value: 99.99, suffix: "%", label: "Uptime SLA" },
                    { value: 15, suffix: "+", label: "Locations" },
                    { value: 10, suffix: "+", label: "Users/Server" },
                  ].map((stat, i) => (
                    <div key={i}>
                      <div className="font-work-sans font-bold text-3xl text-dark">
                        <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="font-outfit text-sm text-dark-muted">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.4, ease }}
                  className="flex flex-wrap gap-3"
                >
                  <Link
                    href="#plans"
                    className="inline-flex items-center gap-2.5 px-8 py-4 bg-dark text-white font-dm-sans font-semibold rounded-full hover:bg-primary hover:scale-[1.02] transition-all duration-300 shadow-soft"
                  >
                    View Plans
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="#features"
                    className="inline-flex items-center gap-2.5 px-8 py-4 bg-surface-1 text-dark font-dm-sans font-semibold rounded-full border border-border hover:border-dark/20 hover:shadow-soft transition-all duration-300"
                  >
                    Explore Features
                  </Link>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isHeaderInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ duration: 0.8, delay: 0.3, ease }}
              >
                <WindowsPreview />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Windows Showcase - Compact Pill */}
        <section className="py-10 lg:py-12">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 flex justify-center">
            <WindowsShowcase />
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-8 border-y border-border bg-surface-1/50">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-6">
              <span className="font-dm-sans text-[11px] font-semibold text-dark-muted uppercase tracking-widest">
                Perfect for
              </span>
              {useCases.map((use, i) => (
                <motion.span
                  key={use}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="px-5 py-2.5 bg-surface-2 rounded-full font-outfit text-sm text-dark-muted hover:text-dark hover:bg-primary/10 transition-all duration-300 cursor-default"
                >
                  {use}
                </motion.span>
              ))}
            </div>
          </div>
        </section>

        {/* Plans */}
        <section id="plans" className="py-20 lg:py-28">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-google-sans font-semibold text-dark tracking-tight mb-3">
                Simple, transparent pricing
              </h2>
              <p className="font-outfit text-lg text-dark-muted">
                Licensed Windows included. Cancel anytime.
              </p>
            </motion.div>

            <PricingSection />
          </div>
        </section>

        {/* Features Bento */}
        <section id="features" className="py-24 lg:py-32 bg-background">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-google-sans font-semibold text-dark tracking-tight mb-4">
                The complete RDP experience
              </h2>
              <p className="font-outfit text-lg text-dark-muted max-w-lg mx-auto">
                Everything you need for seamless remote desktop access.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              <FeatureBento
                icon={Users}
                title="Multi-Session Support"
                description="Multiple users can connect simultaneously to the same server with isolated sessions."
                visual={<MultiUserViz />}
                className="lg:col-span-2"
                index={0}
              />

              <FeatureBento
                icon={Wifi}
                title="Crystal Clear Quality"
                description="Low latency, high FPS streaming for the smoothest experience."
                visual={<ConnectionStatus />}
                index={1}
              />

              <FeatureBento
                icon={Globe}
                title="15+ Global Locations"
                description="Connect from any device, any browser, anywhere in the world."
                visual={<GlobeViz />}
                index={2}
              />

              <FeatureBento
                icon={Shield}
                title="Enterprise Security"
                description="Bank-grade encryption, DDoS protection, and secure authentication."
                visual={<SecurityBadges />}
                index={3}
              />

              <FeatureBento
                icon={Lock}
                title="Full Admin Access"
                description="Complete administrator privileges. Install anything, configure everything."
                index={4}
              />

              <FeatureBento
                icon={Clock}
                title="60 Second Setup"
                description="Your Windows server is ready in under a minute. No waiting, no delays."
                visual={
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-surface-2 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease }}
                      />
                    </div>
                    <span className="font-work-sans font-bold text-emerald-500">Ready!</span>
                  </div>
                }
                className="lg:col-span-2"
                index={5}
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="relative bg-dark rounded-[36px] p-12 lg:p-16 overflow-hidden"
            >
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full">
                  <defs>
                    <pattern id="rdp-cta-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="white" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#rdp-cta-dots)" />
                </svg>
              </div>
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-google-sans font-bold text-white mb-5">
                  Ready to deploy?
                </h2>
                <p className="font-outfit text-lg text-white/60 mb-10 max-w-lg mx-auto">
                  Get started in under 60 seconds. No credit card required.
                </p>
                <Link
                  href={buildPricingActionUrl("rdp-standard")}
                  className="inline-flex items-center gap-2.5 px-10 py-5 bg-primary text-white font-dm-sans font-semibold text-lg rounded-full hover:bg-primary-hover hover:scale-[1.02] transition-all duration-300 shadow-soft"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

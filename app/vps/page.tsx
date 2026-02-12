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
  Server,
  Globe,
  Terminal,
  Clock,
  Activity
} from "lucide-react";
import { Header, Footer } from "@/components/marketing";
import { buildPricingActionUrl } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { GreenTrialButton } from "@/components/ui/flip-button";
import { WireframeDottedGlobe } from "@/components/ui/wireframe-dotted-globe";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const vpsPlans = [
  { id: "vps-starter", name: "Starter", price: 5, cpu: 1, ram: 1, storage: 25, bandwidth: 1 },
  { id: "vps-basic", name: "Basic", price: 10, cpu: 2, ram: 2, storage: 50, bandwidth: 2 },
  { id: "vps-standard", name: "Standard", price: 20, cpu: 2, ram: 4, storage: 80, bandwidth: 3, isPopular: true },
  { id: "vps-pro", name: "Pro", price: 40, cpu: 4, ram: 8, storage: 160, bandwidth: 4 },
  { id: "vps-enterprise", name: "Enterprise", price: 80, cpu: 8, ram: 16, storage: 320, bandwidth: 6 },
];

const operatingSystems = [
  { name: "Windows", logo: "/windows logo.png", type: "windows" },
  { name: "Ubuntu", logo: "https://cdn.simpleicons.org/ubuntu/E95420", type: "linux" },
  { name: "Linux", logo: "https://cdn.simpleicons.org/linux/FCC624", type: "linux" },
];

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


// Glassmorphism OS Selector - Compact Pill Design
function OSShowcase() {
  const [activeOS, setActiveOS] = React.useState(0);
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
        {operatingSystems.map((os, i) => (
          <motion.button
            key={os.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            onClick={() => setActiveOS(i)}
            className={cn(
              "relative flex items-center gap-2.5 px-5 py-2.5 rounded-full transition-all duration-300",
              activeOS === i
                ? "bg-surface-1 shadow-soft"
                : "hover:bg-surface-1/60"
            )}
          >
            {activeOS === i && (
              <motion.div
                layoutId="activeOSPill"
                className="absolute inset-0 bg-surface-1 rounded-full shadow-soft"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            
            <img 
              src={os.logo} 
              alt={os.name} 
              className={cn(
                "relative w-5 h-5 transition-transform duration-300",
                activeOS === i && "scale-110"
              )} 
            />
            <span className={cn(
              "relative font-dm-sans font-semibold text-sm transition-colors duration-300",
              activeOS === i ? "text-dark" : "text-dark-muted"
            )}>
              {os.name}
            </span>
          </motion.button>
        ))}
        
        {/* Status indicator */}
        <div className="flex items-center gap-1.5 px-4 py-2 ml-2 border-l border-border">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="font-dm-sans text-xs font-semibold text-dark-muted">Ready</span>
        </div>
      </div>
    </motion.div>
  );
}


// Interactive Plan Selector - Vercel/Stripe Inspired
function PricingSection() {
  const [selectedPlan, setSelectedPlan] = React.useState(2); // Default to Standard
  const [selectedOS, setSelectedOS] = React.useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const plan = vpsPlans[selectedPlan];

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
          {vpsPlans.map((p, i) => (
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
                Perfect for {plan.name === "Starter" ? "testing and small projects" : 
                            plan.name === "Basic" ? "personal websites" :
                            plan.name === "Standard" ? "growing businesses" :
                            plan.name === "Pro" ? "high-traffic applications" : "enterprise workloads"}
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
                  <Activity className="w-4 h-4 text-primary" />
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

        {/* OS Selection & CTA */}
        <div className="px-8 pb-8">
          <div className="flex items-center justify-between gap-6 p-6 bg-dark rounded-2xl">
            {/* OS Selector */}
            <div className="flex items-center gap-4">
              <span className="font-dm-sans text-xs font-semibold text-white/40 uppercase tracking-wider">
                OS
              </span>
              <div className="flex gap-2">
                {operatingSystems.map((os, i) => (
                  <button
                    key={os.name}
                    onClick={() => setSelectedOS(i)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200",
                      selectedOS === i 
                        ? "bg-white/15 border border-white/20" 
                        : "border border-white/5 hover:border-white/15"
                    )}
                  >
                    <img src={os.logo} alt={os.name} className="w-4 h-4" />
                    <span className="font-dm-sans text-sm font-medium text-white">
                      {os.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Buy Button */}
            <GreenTrialButton href={buildPricingActionUrl(plan.id)} size="md">
              Buy Now
            </GreenTrialButton>
          </div>
        </div>
      </motion.div>

      {/* Features */}
      <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
        {["DDoS Protection", "Full Root Access", "24/7 Support", "99.9% Uptime", "Free Setup"].map((feature) => (
          <span key={feature} className="flex items-center gap-2 text-sm font-outfit text-dark-muted">
            <Check className="w-4 h-4 text-emerald-500" strokeWidth={2.5} />
            {feature}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// Terminal Demo
function TerminalDemo() {
  const [step, setStep] = React.useState(0);
  const lines = [
    { type: "command", text: "ssh root@vps.layerium.com" },
    { type: "output", text: "Welcome to Ubuntu 22.04 LTS" },
    { type: "command", text: "apt update && apt upgrade -y" },
    { type: "output", text: "Reading package lists... Done" },
    { type: "success", text: "✓ System updated successfully" },
  ];

  React.useEffect(() => {
    if (step < lines.length) {
      const timer = setTimeout(() => setStep(step + 1), step === 0 ? 600 : 500);
      return () => clearTimeout(timer);
    }
  }, [step, lines.length]);

  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-dark/5 rounded-[32px] blur-2xl" />
      <div className="relative bg-dark rounded-[24px] overflow-hidden border border-white/10 shadow-elevated">
        <div className="flex items-center gap-2 px-5 py-4 bg-white/[0.03] border-b border-white/5">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="ml-3 font-mono text-xs text-white/40">terminal — layerium-vps</span>
        </div>
        <div className="p-6 font-mono text-sm leading-relaxed min-h-[200px]">
          {lines.slice(0, step).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "mb-1.5",
                line.type === "command" && "text-white",
                line.type === "output" && "text-white/50",
                line.type === "success" && "text-emerald-400"
              )}
            >
              {line.type === "command" && <span className="text-primary mr-2">$</span>}
              {line.text}
            </motion.div>
          ))}
          {step < lines.length && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-2.5 h-5 bg-primary rounded-sm"
            />
          )}
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

// Performance Visualization
function PerformanceViz() {
  const metrics = [
    { label: "CPU", value: 18, color: "bg-primary" },
    { label: "RAM", value: 42, color: "bg-emerald-500" },
    { label: "I/O", value: 12, color: "bg-blue-500" },
  ];

  return (
    <div className="space-y-3">
      {metrics.map((m, i) => (
        <div key={m.label} className="flex items-center gap-3">
          <span className="w-10 font-mono text-xs text-dark-muted">{m.label}</span>
          <div className="flex-1 h-2 bg-surface-2 rounded-full overflow-hidden">
            <motion.div
              className={cn("h-full rounded-full", m.color)}
              initial={{ width: 0 }}
              whileInView={{ width: `${m.value}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.15, ease }}
            />
          </div>
          <span className="w-10 font-mono text-xs text-dark-muted text-right">{m.value}%</span>
        </div>
      ))}
    </div>
  );
}

// Deploy Timeline
function DeployTimeline() {
  const steps = [
    { label: "Config", time: "0s" },
    { label: "Provision", time: "15s" },
    { label: "Install", time: "35s" },
    { label: "Ready", time: "47s", active: true },
  ];

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, i) => (
        <React.Fragment key={step.label}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="flex flex-col items-center"
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center mb-2",
              step.active ? "bg-emerald-500 text-white" : "bg-surface-2 text-dark-muted"
            )}>
              {step.active ? <Check className="w-5 h-5" strokeWidth={3} /> : <span className="font-mono text-xs">{i + 1}</span>}
            </div>
            <span className="font-outfit text-[11px] text-dark-muted">{step.label}</span>
            <span className={cn("font-mono text-[10px]", step.active ? "text-emerald-500" : "text-dark-muted/50")}>{step.time}</span>
          </motion.div>
          {i < steps.length - 1 && (
            <div className="flex-1 h-0.5 bg-surface-2 mx-2 mt-[-20px]">
              <motion.div
                className="h-full bg-emerald-500"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
              />
            </div>
          )}
        </React.Fragment>
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


export default function VPSPage() {
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
                    <Server className="w-4 h-4 text-primary" />
                    VPS Hosting
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.1, ease }}
                  className="text-4xl sm:text-5xl lg:text-[3.75rem] font-google-sans font-bold text-dark tracking-tight leading-[1.08] mb-6"
                >
                  High-Performance
                  <br />
                  <span className="text-primary">VPS Servers</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.2, ease }}
                  className="font-outfit text-lg lg:text-xl text-dark-muted leading-relaxed mb-10"
                >
                  Deploy blazing-fast Windows & Linux VPS with NVMe storage, full root access, 
                  and enterprise-grade DDoS protection. Ready in under 60 seconds.
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
                    { value: 60, suffix: "s", label: "Deploy" },
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
                  <GreenTrialButton href="#plans" size="lg">
                    View Plans
                  </GreenTrialButton>
                  <Link
                    href="#features"
                    className="inline-flex items-center gap-2.5 px-8 py-4 bg-surface-1 text-dark font-dm-sans font-semibold rounded-lg border border-border hover:border-dark/20 hover:shadow-soft transition-all duration-300"
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
                <TerminalDemo />
              </motion.div>
            </div>
          </div>
        </section>

        {/* OS Showcase - Compact Pill */}
        <section className="py-10 lg:py-12">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 flex justify-center">
            <OSShowcase />
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
                No hidden fees. Cancel anytime.
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
                Why developers love us
              </h2>
              <p className="font-outfit text-lg text-dark-muted max-w-lg mx-auto">
                Enterprise-grade infrastructure designed for modern workloads.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              <FeatureBento
                icon={Clock}
                title="Deploy in 60 Seconds"
                description="From checkout to production-ready server. Automated provisioning with zero manual setup."
                visual={<DeployTimeline />}
                className="lg:col-span-2"
                index={0}
              />

              <FeatureBento
                icon={Activity}
                title="Live Monitoring"
                description="Real-time CPU, RAM, and disk metrics with instant alerts."
                visual={<PerformanceViz />}
                index={1}
              />

              <FeatureBento
                icon={Terminal}
                title="Full Root Access"
                description="Complete control over your server. Install any software, configure anything you need."
                index={2}
              />

              <FeatureBento
                icon={HardDrive}
                title="NVMe Storage"
                description="Enterprise SSDs with up to 7GB/s read speeds for blazing performance."
                visual={
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-surface-2 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: "85%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease }}
                      />
                    </div>
                    <span className="font-work-sans font-bold text-primary">7GB/s</span>
                  </div>
                }
                index={3}
              />

              <FeatureBento
                icon={Globe}
                title="15+ Global Locations"
                description="Deploy closer to your users with strategically located datacenters worldwide."
                visual={<GlobeViz />}
                index={4}
              />

              <FeatureBento
                icon={Shield}
                title="DDoS Protection"
                description="Enterprise-grade protection included free with every server. Always on, always protecting."
                visual={
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-full text-sm font-dm-sans font-semibold">
                      Active
                    </span>
                    <span className="px-4 py-2 bg-surface-2 text-dark-muted rounded-full text-sm font-outfit">
                      0 threats blocked
                    </span>
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
                    <pattern id="cta-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="white" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#cta-dots)" />
                </svg>
              </div>
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-google-sans font-bold text-white mb-5">
                  Ready to deploy?
                </h2>
                <p className="font-outfit text-lg text-white/60 mb-10 max-w-lg mx-auto">
                  Get started in under 60 seconds. No credit card required.
                </p>
                <GreenTrialButton href={buildPricingActionUrl("vps-standard")} size="lg">
                  Start Free Trial
                </GreenTrialButton>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

"use client";

import * as React from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { 
  Monitor, 
  HardDrive, 
  Globe, 
  Shield, 
  Clock,
  Activity,
  Users,
  Lock,
  Gauge,
  Check,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { WireframeDottedGlobe } from "@/components/ui/wireframe-dotted-globe";

// Premium easing
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Animated Counter
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 2, ease: [0.16, 1, 0.3, 1] });
      return controls.stop;
    }
  }, [isInView, value, count]);

  React.useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => setDisplayValue(latest));
    return unsubscribe;
  }, [rounded]);

  return (
    <span ref={ref}>
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
}

// Clean Feature Card - Light theme
function FeatureCard({ 
  icon: Icon,
  title,
  description,
  stat,
  statLabel,
  index,
  className = ""
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
  stat?: string;
  statLabel?: string;
  index: number;
  className?: string;
}) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease }}
      className={`group ${className}`}
    >
      <div className="relative h-full bg-surface-1 rounded-[24px] border border-border p-6 lg:p-7 hover:border-dark/15 hover:shadow-card transition-all duration-400">
        {/* Icon */}
        <div className="w-11 h-11 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mb-5 group-hover:bg-dark group-hover:border-dark transition-all duration-400">
          <Icon className="w-5 h-5 text-dark-muted group-hover:text-white transition-colors duration-400" strokeWidth={1.5} />
        </div>
        
        {/* Content */}
        <h3 className="font-google-sans font-semibold text-lg text-dark mb-2">
          {title}
        </h3>
        <p className="font-outfit text-sm text-dark-muted leading-relaxed">
          {description}
        </p>
        
        {/* Stat */}
        {stat && (
          <div className="mt-5 pt-5 border-t border-border">
            <div className="font-work-sans font-bold text-2xl text-primary">{stat}</div>
            {statLabel && <div className="font-outfit text-xs text-dark-muted mt-0.5">{statLabel}</div>}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Large Hero Feature Card - Light theme
function HeroFeatureCard({ 
  icon: Icon,
  title,
  description,
  children,
  index
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
  children?: React.ReactNode;
  index: number;
}) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease }}
      className="group"
    >
      <div className="relative h-full bg-surface-1 rounded-[28px] border border-border overflow-hidden hover:border-dark/15 hover:shadow-card transition-all duration-400">
        {/* Header */}
        <div className="p-7 lg:p-8">
          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 rounded-2xl bg-surface-2 border border-border flex items-center justify-center group-hover:bg-dark group-hover:border-dark transition-all duration-400">
              <Icon className="w-6 h-6 text-dark-muted group-hover:text-white transition-colors duration-400" strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="font-google-sans font-semibold text-xl text-dark mb-2">
            {title}
          </h3>
          <p className="font-outfit text-[15px] text-dark-muted leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* Visual content */}
        {children && (
          <div className="px-7 lg:px-8 pb-7 lg:pb-8">
            {children}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Windows Desktop Preview - Clean version
function WindowsPreview() {
  return (
    <div className="relative aspect-[16/10] bg-dark rounded-xl overflow-hidden border border-dark/10">
      {/* Desktop background */}
      <div className="absolute inset-0 bg-[#1e1f26]" />
      
      {/* Desktop Icons */}
      <div className="absolute top-3 left-3 space-y-2">
        {["This PC", "Browser", "Terminal"].map((name, i) => (
          <div key={i} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/10 cursor-pointer">
            <div className="w-5 h-5 bg-white/20 rounded" />
            <span className="text-[9px] text-white/70 font-outfit">{name}</span>
          </div>
        ))}
      </div>

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-7 bg-black/50 flex items-center justify-center gap-1 px-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-5 h-5 rounded bg-white/10" />
        ))}
      </div>

      {/* Connection badge */}
      <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-black/40 rounded-full">
        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
        <span className="text-[8px] text-white/80 font-medium font-outfit">RDP Connected</span>
      </div>
    </div>
  );
}

// Performance Bars - Light theme
function PerformanceBars() {
  const metrics = [
    { label: "CPU Usage", value: 24, color: "bg-primary" },
    { label: "Memory", value: 52, color: "bg-blue-500" },
    { label: "Disk I/O", value: 18, color: "bg-emerald-500" },
  ];

  return (
    <div className="space-y-4">
      {metrics.map((metric, i) => (
        <div key={metric.label}>
          <div className="flex justify-between mb-2">
            <span className="text-xs font-medium text-dark font-dm-sans">{metric.label}</span>
            <span className="text-xs font-mono text-dark-muted font-work-sans">{metric.value}%</span>
          </div>
          <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${metric.color}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${metric.value}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.15, ease }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Deployment Timeline - Clean version
function DeploymentTimeline() {
  const steps = [
    { label: "Select configuration", done: true },
    { label: "Choose datacenter", done: true },
    { label: "Install operating system", done: true },
    { label: "Configure network", done: true },
    { label: "Server ready", done: true, highlight: true },
  ];

  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className={`flex items-center gap-3 py-2.5 px-3 rounded-xl ${step.highlight ? 'bg-emerald-50 border border-emerald-100' : 'bg-surface-2'}`}
        >
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${step.highlight ? 'bg-emerald-500' : 'bg-dark'}`}>
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </div>
          <span className={`text-sm font-outfit ${step.highlight ? 'text-emerald-700 font-medium' : 'text-dark-muted'}`}>
            {step.label}
          </span>
          {step.highlight && (
            <span className="ml-auto text-xs font-work-sans font-semibold text-emerald-600">47s</span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// Globe visualization using WireframeDottedGlobe
function GlobeVisualization() {
  return (
    <div className="relative w-full aspect-square max-w-[180px] mx-auto flex items-center justify-center">
      <WireframeDottedGlobe size={160} rotationSpeed={0.003} />
    </div>
  );
}

export function Features() {
  const headerRef = React.useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section id="features" className="py-24 lg:py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14 lg:mb-16">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-1 rounded-full border border-border text-[11px] font-dm-sans font-semibold text-dark-muted uppercase tracking-wider mb-5">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                Platform Features
              </span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="text-[2.5rem] sm:text-5xl lg:text-[3.25rem] font-google-sans font-semibold text-dark tracking-tight leading-[1.08]"
            >
              Built for
              <br />
              <span className="text-dark-muted">performance.</span>
            </motion.h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            <Link
              href="#pricing"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-dark text-white font-dm-sans text-sm font-semibold rounded-full hover:bg-primary transition-colors duration-300"
            >
              View Pricing
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Hero Feature Cards - 2 large */}
        <div className="grid lg:grid-cols-2 gap-5 mb-5">
          <HeroFeatureCard
            icon={Monitor}
            title="Full Windows Experience"
            description="Access a complete Windows desktop from any device. Run any application, anywhere in the world with full RDP access."
            index={0}
          >
            <WindowsPreview />
          </HeroFeatureCard>

          <HeroFeatureCard
            icon={Clock}
            title="Deploy in Under 60 Seconds"
            description="From checkout to production-ready server. Automated provisioning with zero manual setup required."
            index={1}
          >
            <DeploymentTimeline />
          </HeroFeatureCard>
        </div>

        {/* Feature Grid - 4 columns */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
          <FeatureCard
            icon={Activity}
            title="Live Monitoring"
            description="Real-time CPU, RAM, and disk metrics with instant alerts."
            index={2}
          />
          <FeatureCard
            icon={HardDrive}
            title="NVMe Storage"
            description="Enterprise SSDs delivering blazing fast read and write speeds."
            stat="7GB/s"
            statLabel="Read Speed"
            index={3}
          />
          <FeatureCard
            icon={Shield}
            title="DDoS Protection"
            description="Enterprise-grade protection included at no additional cost."
            stat="Free"
            statLabel="Always On"
            index={4}
          />
          <FeatureCard
            icon={Users}
            title="Multi-Session RDP"
            description="Multiple concurrent users on a single Windows server."
            stat="10+"
            statLabel="Concurrent Users"
            index={5}
          />
        </div>

        {/* Bottom row - 3 columns */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <HeroFeatureCard
            icon={Globe}
            title="15+ Global Locations"
            description="Deploy closer to your users with strategically located datacenters worldwide."
            index={6}
          >
            <GlobeVisualization />
          </HeroFeatureCard>

          <HeroFeatureCard
            icon={Gauge}
            title="Resource Monitoring"
            description="Track server performance in real-time with our intuitive dashboard."
            index={7}
          >
            <PerformanceBars />
          </HeroFeatureCard>

          <div className="sm:col-span-2 lg:col-span-1">
            <FeatureCard
              icon={Lock}
              title="Full Root Access"
              description="Complete administrative control. Install anything, configure everything."
              stat="Full"
              statLabel="Admin Control"
              index={8}
              className="h-full"
            />
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="mt-16 lg:mt-20 pt-12 border-t border-border"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { value: 99.99, suffix: "%", label: "Uptime SLA" },
              { value: 30, suffix: "ms", label: "Avg Latency", prefix: "<" },
              { value: 24, suffix: "/7", label: "Expert Support" },
              { value: 15, suffix: "+", label: "Datacenters" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1, ease }}
                className="text-center lg:text-left"
              >
                <div className="text-3xl lg:text-4xl font-work-sans font-bold text-dark mb-1">
                  {stat.prefix || ""}<AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-outfit text-dark-muted">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { 
  Server, 
  Clock, 
  Shield, 
  Globe2, 
  Headphones,
  HardDrive,
  ArrowRight,
  Check,
  Activity
} from "lucide-react";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { GreenTrialButton } from "@/components/ui/flip-button";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Animated number component
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

const features = [
  {
    id: "hardware",
    icon: Server,
    label: "Enterprise Hardware",
    title: "Latest generation processors",
    description: "Intel Xeon & AMD EPYC with ECC memory",
    visual: (
      <div className="flex items-center gap-3">
        {["Intel", "AMD", "NVIDIA"].map((brand) => (
          <span key={brand} className="px-3 py-1.5 bg-dark/5 rounded-full text-xs font-dm-sans font-medium text-dark-muted">
            {brand}
          </span>
        ))}
      </div>
    ),
  },
  {
    id: "storage",
    icon: HardDrive,
    label: "NVMe Storage",
    title: "7GB/s read speeds",
    description: "Pure SSD storage for blazing performance",
    visual: (
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-dark/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: "85%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease }}
          />
        </div>
        <span className="font-work-sans font-bold text-sm text-primary">7GB/s</span>
      </div>
    ),
  },
  {
    id: "security",
    icon: Shield,
    label: "DDoS Protection",
    title: "Always-on protection",
    description: "Enterprise security at no extra cost",
    visual: (
      <div className="flex gap-2">
        {["Layer 3", "Layer 4", "Layer 7"].map((layer) => (
          <span key={layer} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 rounded-full text-xs font-dm-sans font-medium text-emerald-600">
            <Check className="w-3 h-3" />
            {layer}
          </span>
        ))}
      </div>
    ),
  },
  {
    id: "network",
    icon: Globe2,
    label: "Global Network",
    title: "15+ locations worldwide",
    description: "Deploy closer to your users",
    visual: (
      <div className="flex items-center gap-2">
        {["US", "EU", "APAC", "SA"].map((region, i) => (
          <motion.div
            key={region}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="w-10 h-10 rounded-full bg-dark flex items-center justify-center"
          >
            <span className="font-dm-sans text-[10px] font-bold text-white">{region}</span>
          </motion.div>
        ))}
        <span className="px-3 py-1.5 bg-dark/5 rounded-full text-xs font-dm-sans font-medium text-dark-muted">
          +11 more
        </span>
      </div>
    ),
  },
  {
    id: "speed",
    icon: Clock,
    label: "Instant Deploy",
    title: "Ready in 60 seconds",
    description: "From checkout to production",
    visual: (
      <div className="flex items-center gap-4">
        {[
          { step: "Order", time: "0s" },
          { step: "Provision", time: "30s" },
          { step: "Ready", time: "60s", active: true },
        ].map((item, i) => (
          <React.Fragment key={item.step}>
            <div className="text-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center mb-1",
                item.active ? "bg-emerald-500 text-white" : "bg-dark/10 text-dark-muted"
              )}>
                {item.active ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
              </div>
              <span className="font-outfit text-[10px] text-dark-muted">{item.step}</span>
            </div>
            {i < 2 && <div className="flex-1 h-px bg-dark/10" />}
          </React.Fragment>
        ))}
      </div>
    ),
  },
  {
    id: "support",
    icon: Headphones,
    label: "24/7 Support",
    title: "Real engineers, always",
    description: "Average response under 5 minutes",
    visual: (
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {[
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
          ].map((avatar, i) => (
            <img key={i} src={avatar} alt="" className="w-8 h-8 rounded-full border-2 border-surface-1 object-cover" />
          ))}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 rounded-full">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-dm-sans font-medium text-emerald-600">Online now</span>
        </div>
      </div>
    ),
  },
];

export function WhyChooseUs() {
  const [activeFeature, setActiveFeature] = React.useState("hardware");
  const sectionRef = React.useRef(null);
  const isInView = useInView(sectionRef, { once: true });
  const tabRefs = React.useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [indicatorStyle, setIndicatorStyle] = React.useState({ left: 0, width: 0 });

  const currentFeature = features.find(f => f.id === activeFeature) || features[0];

  // Update indicator position when active tab changes
  React.useEffect(() => {
    const activeTab = tabRefs.current[activeFeature];
    if (activeTab) {
      setIndicatorStyle({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
      });
    }
  }, [activeFeature]);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-dark text-white rounded-full text-sm font-dm-sans font-semibold">
              <Activity className="w-3.5 h-3.5" />
              Why Layerium
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="text-3xl sm:text-4xl lg:text-5xl font-google-sans font-bold text-dark tracking-tight mb-4"
          >
            Infrastructure that
            <br />
            <span className="text-primary">just works</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            className="font-outfit text-lg text-dark-muted max-w-lg mx-auto"
          >
            Enterprise-grade features without the enterprise complexity
          </motion.p>
        </div>

        {/* Interactive Feature Selector */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          className="mb-16"
        >
          {/* Glassmorphism Tab Bar - iOS 18 Style */}
          <div className="flex justify-center mb-10">
            <div className="relative inline-flex backdrop-blur-xl bg-white/40 border border-white/20 rounded-[20px] p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              {/* Active Tab Background */}
              <motion.div
                className="absolute top-1.5 bg-white rounded-[16px] shadow-[0_2px_16px_rgba(0,0,0,0.08),0_0_0_0.5px_rgba(0,0,0,0.04)]"
                animate={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                }}
                initial={false}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                style={{ height: 'calc(100% - 12px)' }}
              />
              
              {/* Tab Buttons */}
              <div className="relative flex gap-1">
                {features.map((feature) => (
                  <button
                    key={feature.id}
                    ref={(el) => {
                      tabRefs.current[feature.id] = el;
                    }}
                    onClick={() => setActiveFeature(feature.id)}
                    className={cn(
                      "relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-[16px] font-dm-sans text-[13px] font-medium transition-colors duration-200 whitespace-nowrap",
                      activeFeature === feature.id
                        ? "text-dark"
                        : "text-dark/50 hover:text-dark/70"
                    )}
                  >
                    <feature.icon className="w-[15px] h-[15px]" />
                    <span>{feature.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Feature Detail Card */}
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-surface-1 rounded-[32px] border border-border p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                {/* Left - Icon & Text */}
                <div className="flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-dark flex items-center justify-center mb-6">
                    <currentFeature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-google-sans font-bold text-2xl lg:text-3xl text-dark mb-3">
                    {currentFeature.title}
                  </h3>
                  <p className="font-outfit text-dark-muted text-lg mb-6">
                    {currentFeature.description}
                  </p>
                  {currentFeature.visual}
                </div>

                {/* Right - Stats */}
                <div className="lg:w-48 flex lg:flex-col gap-4">
                  <div className="flex-1 p-5 bg-dark/[0.03] rounded-2xl text-center">
                    <div className="font-work-sans font-bold text-3xl text-dark mb-1">
                      {activeFeature === "hardware" && "Latest"}
                      {activeFeature === "storage" && "7GB/s"}
                      {activeFeature === "security" && "Free"}
                      {activeFeature === "network" && "15+"}
                      {activeFeature === "speed" && "<60s"}
                      {activeFeature === "support" && "24/7"}
                    </div>
                    <div className="font-outfit text-sm text-dark-muted">
                      {activeFeature === "hardware" && "Generation"}
                      {activeFeature === "storage" && "Read Speed"}
                      {activeFeature === "security" && "Included"}
                      {activeFeature === "network" && "Locations"}
                      {activeFeature === "speed" && "Deploy Time"}
                      {activeFeature === "support" && "Available"}
                    </div>
                  </div>
                  <div className="flex-1 p-5 bg-primary/10 rounded-2xl text-center">
                    <div className="font-work-sans font-bold text-3xl text-primary mb-1">
                      100%
                    </div>
                    <div className="font-outfit text-sm text-dark-muted">
                      Satisfaction
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="relative bg-dark rounded-[36px] p-10 lg:p-14 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="why-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#why-dots)" />
              </svg>
            </div>

            <div className="relative">
              {/* Stats Row */}
              <div className="flex flex-wrap justify-center gap-6 lg:gap-0 lg:justify-between items-center mb-10">
                {[
                  { value: 99.99, suffix: "%", label: "Uptime SLA" },
                  { value: 50000, suffix: "+", label: "Customers" },
                  { value: 15, suffix: "+", label: "Locations" },
                  { value: 5, suffix: "min", label: "Avg Response" },
                ].map((stat, i) => (
                  <React.Fragment key={stat.label}>
                    <div className="text-center px-6">
                      <div className="font-work-sans font-bold text-4xl lg:text-5xl text-white mb-1">
                        <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="font-outfit text-sm text-white/50">
                        {stat.label}
                      </div>
                    </div>
                    {i < 3 && <div className="hidden lg:block w-px h-16 bg-white/10" />}
                  </React.Fragment>
                ))}
              </div>

              {/* CTA Row */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <GreenTrialButton href="/pricing" size="lg">
                  View Pricing
                </GreenTrialButton>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-dm-sans font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  Talk to Sales
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-3 mt-10">
                {["SOC 2 Compliant", "GDPR Ready", "99.99% SLA", "24/7 Support"].map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-sm font-outfit text-white/60 border border-white/10"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";

// Premium easing curve
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
import { 
  Check, 
  ArrowRight, 
  Cpu, 
  HardDrive, 
  Gauge,
  Shield,
  Server,
  Monitor,
  Headphones,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buildPricingActionUrl } from "@/lib/routes";

type ServiceType = "RDP" | "VPS";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  cpu: number;
  ram: number;
  storage: number;
  bandwidth: number;
  isPopular?: boolean;
}

const rdpPlans: Plan[] = [
  { id: "rdp-basic", name: "Basic", description: "For personal use", price: 15, cpu: 2, ram: 4, storage: 60, bandwidth: 2 },
  { id: "rdp-standard", name: "Standard", description: "For professionals", price: 30, cpu: 4, ram: 8, storage: 120, bandwidth: 3, isPopular: true },
  { id: "rdp-pro", name: "Pro", description: "For power users", price: 50, cpu: 6, ram: 12, storage: 200, bandwidth: 4 },
  { id: "rdp-enterprise", name: "Enterprise", description: "Maximum power", price: 80, cpu: 8, ram: 16, storage: 320, bandwidth: 5 },
];

const vpsPlans: Plan[] = [
  { id: "vps-starter", name: "Starter", description: "Small projects", price: 5, cpu: 1, ram: 1, storage: 25, bandwidth: 1 },
  { id: "vps-basic", name: "Basic", description: "Growing apps", price: 10, cpu: 2, ram: 2, storage: 50, bandwidth: 2 },
  { id: "vps-standard", name: "Standard", description: "Production ready", price: 20, cpu: 2, ram: 4, storage: 80, bandwidth: 3, isPopular: true },
  { id: "vps-pro", name: "Pro", description: "High performance", price: 40, cpu: 4, ram: 8, storage: 160, bandwidth: 4 },
];

// Framer-style animated pill tab switcher
function ServiceTabs({ active, onChange }: { active: ServiceType; onChange: (t: ServiceType) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="inline-flex p-1.5 bg-surface-1 rounded-full border border-border shadow-soft"
    >
      {(["RDP", "VPS"] as ServiceType[]).map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "relative px-8 py-3 rounded-full font-dm-sans text-sm font-semibold transition-all duration-300",
            active === tab ? "text-white" : "text-dark-muted hover:text-dark"
          )}
        >
          {active === tab && (
            <motion.div
              layoutId="servicePill"
              className="absolute inset-0 bg-dark rounded-full"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {tab === "RDP" ? <Monitor className="w-4 h-4" /> : <Server className="w-4 h-4" />}
            {tab} Servers
          </span>
        </button>
      ))}
    </motion.div>
  );
}

// Spec item for cards
function SpecItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 text-dark-muted" />
        <span className="font-outfit text-sm text-dark-muted">{label}</span>
      </div>
      <span className="font-work-sans text-sm font-semibold text-dark">{value}</span>
    </div>
  );
}

// Modern pricing card with enhanced animations
function PricingCard({ plan, index }: { plan: Plan; index: number }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease }}
      whileHover={{ y: -10, transition: { duration: 0.4, ease } }}
      className="group relative"
    >
      <div className={cn(
        "relative h-full bg-surface-1 rounded-[32px] border transition-all duration-500",
        plan.isPopular 
          ? "border-primary shadow-[0_0_0_1px_rgba(255,85,51,0.1),0_24px_48px_-12px_rgba(255,85,51,0.12)]" 
          : "border-border hover:border-dark/20 hover:shadow-elevated"
      )}>
        {/* Popular badge */}
        {plan.isPopular && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute -top-3 left-1/2 -translate-x-1/2"
          >
            <span className="inline-flex items-center px-4 py-1.5 bg-primary text-white text-xs font-dm-sans font-semibold rounded-full shadow-soft">
              Most Popular
            </span>
          </motion.div>
        )}

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h4 className="font-google-sans font-semibold text-xl text-dark mb-1">{plan.name}</h4>
            <p className="font-outfit text-sm text-dark-muted">{plan.description}</p>
          </div>

          {/* Price */}
          <div className="text-center mb-8">
            <div className="flex items-baseline justify-center gap-1">
              <span className="font-work-sans font-bold text-5xl text-dark">${plan.price}</span>
              <span className="font-outfit text-dark-muted">/mo</span>
            </div>
          </div>

          {/* Specs */}
          <div className="mb-6 divide-y divide-border/50">
            <SpecItem icon={Cpu} label="vCPU" value={`${plan.cpu} Core${plan.cpu > 1 ? "s" : ""}`} />
            <SpecItem icon={Gauge} label="Memory" value={`${plan.ram} GB`} />
            <SpecItem icon={HardDrive} label="NVMe Storage" value={`${plan.storage} GB`} />
            <SpecItem icon={Globe} label="Bandwidth" value={`${plan.bandwidth} TB`} />
          </div>

          {/* Features */}
          <div className="space-y-2.5 mb-8">
            {["DDoS Protection", "24/7 Support", "Full Root Access"].map((feature) => (
              <div key={feature} className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-success" strokeWidth={3} />
                <span className="font-outfit text-sm text-dark-muted">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href={buildPricingActionUrl(plan.id)}
            className={cn(
              "flex items-center justify-center gap-2 w-full py-4 rounded-full font-dm-sans font-semibold text-[15px] transition-all duration-300",
              plan.isPopular
                ? "bg-primary text-white hover:bg-primary-hover shadow-soft"
                : "bg-dark text-white hover:bg-primary"
            )}
          >
            Deploy Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// Animated table row
function TableRow({ 
  children, 
  index,
  className,
  style
}: { 
  children: React.ReactNode; 
  index: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      style={style}
      className={cn("grid border-b border-border/50 hover:bg-surface-2/30 transition-colors", className)}
    >
      {children}
    </motion.div>
  );
}

// Horizontal comparison table for large screens
function ComparisonTable({ plans }: { plans: Plan[] }) {
  const containerRef = React.useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      className="hidden lg:block bg-surface-1 rounded-[40px] border border-border overflow-hidden shadow-soft"
    >
      {/* Header */}
      <div className="grid border-b border-border" style={{ gridTemplateColumns: `220px repeat(${plans.length}, 1fr)` }}>
        <div className="p-6 flex items-end">
          <span className="font-dm-sans text-sm font-medium text-dark-muted">Compare plans</span>
        </div>
        {plans.map((plan, i) => (
          <motion.div 
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
            className={cn(
              "p-6 text-center border-l border-border",
              plan.isPopular && "bg-primary/[0.03]"
            )}
          >
            {plan.isPopular && (
              <span className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-dm-sans font-semibold rounded-full mb-3">
                Popular
              </span>
            )}
            <h4 className="font-google-sans font-semibold text-lg text-dark">{plan.name}</h4>
            <p className="font-outfit text-xs text-dark-muted">{plan.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Pricing row */}
      <TableRow index={0} style={{ gridTemplateColumns: `220px repeat(${plans.length}, 1fr)` }}>
        <div className="p-5 flex items-center gap-3">
          <span className="font-outfit text-sm font-semibold text-dark">Monthly Price</span>
        </div>
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={cn(
              "p-5 flex justify-center border-l border-border/50",
              plan.isPopular && "bg-primary/[0.02]"
            )}
          >
            <span className="font-work-sans text-lg font-bold text-primary">${plan.price}/mo</span>
          </div>
        ))}
      </TableRow>

      {/* Specs */}
      {[
        { label: "vCPU Cores", icon: Cpu, getValue: (p: Plan) => `${p.cpu} Core${p.cpu > 1 ? "s" : ""}` },
        { label: "Memory", icon: Gauge, getValue: (p: Plan) => `${p.ram} GB RAM` },
        { label: "NVMe Storage", icon: HardDrive, getValue: (p: Plan) => `${p.storage} GB` },
        { label: "Bandwidth", icon: Globe, getValue: (p: Plan) => `${p.bandwidth} TB` },
      ].map((row, rowIndex) => (
        <TableRow 
          key={row.label} 
          index={rowIndex + 1}
          style={{ gridTemplateColumns: `220px repeat(${plans.length}, 1fr)` }}
        >
          <div className="p-5 flex items-center gap-3">
            <row.icon className="w-4 h-4 text-dark-muted" />
            <span className="font-outfit text-sm text-dark-muted">{row.label}</span>
          </div>
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={cn(
                "p-5 flex justify-center border-l border-border/50",
                plan.isPopular && "bg-primary/[0.02]"
              )}
            >
              <span className="font-work-sans text-sm font-semibold text-dark">
                {row.getValue(plan)}
              </span>
            </div>
          ))}
        </TableRow>
      ))}

      {/* Features */}
      {[
        { label: "DDoS Protection", icon: Shield },
        { label: "24/7 Support", icon: Headphones },
      ].map((feature, featureIndex) => (
        <TableRow 
          key={feature.label}
          index={featureIndex + 5}
          style={{ gridTemplateColumns: `220px repeat(${plans.length}, 1fr)` }}
        >
          <div className="p-5 flex items-center gap-3">
            <feature.icon className="w-4 h-4 text-dark-muted" />
            <span className="font-outfit text-sm text-dark-muted">{feature.label}</span>
          </div>
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={cn(
                "p-5 flex justify-center items-center gap-1.5 border-l border-border/50",
                plan.isPopular && "bg-primary/[0.02]"
              )}
            >
              <Check className="w-4 h-4 text-success" strokeWidth={3} />
              <span className="font-outfit text-sm text-success font-medium">Included</span>
            </div>
          ))}
        </TableRow>
      ))}

      {/* CTA Row */}
      <div 
        className="grid"
        style={{ gridTemplateColumns: `220px repeat(${plans.length}, 1fr)` }}
      >
        <div className="p-6" />
        {plans.map((plan, i) => (
          <motion.div 
            key={plan.id}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
            className={cn(
              "p-6 border-l border-border/50",
              plan.isPopular && "bg-primary/[0.02]"
            )}
          >
            <Link
              href={buildPricingActionUrl(plan.id)}
              className={cn(
                "flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-dm-sans font-semibold text-sm transition-all duration-300",
                plan.isPopular
                  ? "bg-primary text-white hover:bg-primary-hover"
                  : "bg-dark text-white hover:bg-primary"
              )}
            >
              Deploy Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function Pricing() {
  const [activeTab, setActiveTab] = React.useState<ServiceType>("RDP");
  const plans = activeTab === "RDP" ? rdpPlans : vpsPlans;

  return (
    <section id="pricing" className="py-28 lg:py-40 bg-background relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/[0.02] rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-info/[0.02] rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-1 rounded-full border border-border text-sm font-dm-sans font-medium text-dark-muted mb-6"
          >
            <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
            Pricing
          </motion.span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-google-sans font-semibold text-dark tracking-tight leading-[1.1] mb-6">
            Simple, transparent
            <br />
            <span className="text-dark-muted">pricing.</span>
          </h2>
          <p className="font-outfit text-lg text-dark-muted">
            No hidden fees. No surprises. Scale up or down anytime.
          </p>
        </motion.div>

        {/* Service Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-14"
        >
          <ServiceTabs active={activeTab} onChange={setActiveTab} />
        </motion.div>

        {/* Comparison Table - Large screens */}
        <motion.div
          key={`table-${activeTab}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ComparisonTable plans={plans} />
        </motion.div>

        {/* Cards Grid - Small/Medium screens */}
        <motion.div
          key={`cards-${activeTab}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {plans.map((plan, index) => (
            <PricingCard key={plan.id} plan={plan} index={index} />
          ))}
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 flex flex-wrap justify-center gap-3"
        >
          {[
            "Free Setup",
            "7-Day Money Back",
            "No Hidden Fees",
            "Cancel Anytime",
          ].map((item, i) => (
            <motion.span 
              key={item}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface-1 rounded-full border border-border text-sm font-outfit text-dark-muted"
            >
              <Check className="w-3.5 h-3.5 text-success" strokeWidth={3} />
              {item}
            </motion.span>
          ))}
        </motion.div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-20 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-8 bg-surface-1 rounded-[32px] border border-border shadow-soft">
            <div className="text-center sm:text-left">
              <p className="font-google-sans font-semibold text-dark text-lg mb-1">Need custom resources?</p>
              <p className="font-outfit text-sm text-dark-muted">Contact us for enterprise solutions with dedicated support.</p>
            </div>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-7 py-3.5 bg-dark text-white rounded-full font-dm-sans font-semibold text-sm hover:bg-primary transition-all duration-300 whitespace-nowrap"
            >
              Contact Sales
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

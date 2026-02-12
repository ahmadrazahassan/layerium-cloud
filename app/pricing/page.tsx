"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Server, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { Header, Footer } from "@/components/marketing";
import { FlipButton, ArrowIcon } from "@/components/ui/flip-button";
import { buildPricingActionUrl, routes } from "@/lib/routes";

interface Plan {
  id: string;
  name: string;
  price: number;
  specs: { cpu: string; ram: string; storage: string; bandwidth: string };
  isPopular?: boolean;
}

const vpsPlans: Plan[] = [
  { id: "vps-starter", name: "Starter", price: 5, specs: { cpu: "1 vCPU", ram: "1 GB", storage: "25 GB", bandwidth: "1 TB" } },
  { id: "vps-basic", name: "Basic", price: 10, specs: { cpu: "2 vCPU", ram: "2 GB", storage: "50 GB", bandwidth: "2 TB" } },
  { id: "vps-standard", name: "Standard", price: 20, specs: { cpu: "2 vCPU", ram: "4 GB", storage: "80 GB", bandwidth: "3 TB" }, isPopular: true },
  { id: "vps-pro", name: "Pro", price: 40, specs: { cpu: "4 vCPU", ram: "8 GB", storage: "160 GB", bandwidth: "4 TB" } },
  { id: "vps-business", name: "Business", price: 60, specs: { cpu: "6 vCPU", ram: "16 GB", storage: "240 GB", bandwidth: "5 TB" } },
  { id: "vps-enterprise", name: "Enterprise", price: 100, specs: { cpu: "8 vCPU", ram: "32 GB", storage: "400 GB", bandwidth: "8 TB" } },
];

const rdpPlans: Plan[] = [
  { id: "rdp-basic", name: "Basic", price: 15, specs: { cpu: "2 vCPU", ram: "4 GB", storage: "60 GB", bandwidth: "2 TB" } },
  { id: "rdp-standard", name: "Standard", price: 30, specs: { cpu: "4 vCPU", ram: "8 GB", storage: "120 GB", bandwidth: "3 TB" }, isPopular: true },
  { id: "rdp-pro", name: "Pro", price: 50, specs: { cpu: "6 vCPU", ram: "12 GB", storage: "200 GB", bandwidth: "4 TB" } },
  { id: "rdp-enterprise", name: "Enterprise", price: 80, specs: { cpu: "8 vCPU", ram: "16 GB", storage: "320 GB", bandwidth: "5 TB" } },
];

// Framer-style interactive plan selector
function PlanSelector({ 
  plans, 
  selected, 
  onSelect 
}: { 
  plans: Plan[]; 
  selected: Plan; 
  onSelect: (plan: Plan) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {plans.map((plan) => (
        <motion.button
          key={plan.id}
          onClick={() => onSelect(plan)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "relative px-5 py-3 rounded-full font-dm-sans text-sm font-medium transition-colors duration-200",
            selected.id === plan.id
              ? "bg-dark text-white"
              : "bg-surface-1 text-dark-muted hover:text-dark border border-border"
          )}
        >
          {plan.isPopular && selected.id !== plan.id && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
          )}
          <span className="flex items-center gap-2">
            {plan.name}
            <span className={cn(
              "font-work-sans",
              selected.id === plan.id ? "text-white/60" : "text-dark-muted"
            )}>
              ${plan.price}
            </span>
          </span>
        </motion.button>
      ))}
    </div>
  );
}

// Large plan display - Framer style
function PlanDisplay({ plan, type }: { plan: Plan; type: "VPS" | "RDP" }) {
  return (
    <motion.div
      key={plan.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-surface-1 rounded-[32px] border border-border p-8 lg:p-10"
    >
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left - Plan Details */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            {plan.isPopular && (
              <span className="px-3 py-1 bg-primary text-white text-xs font-dm-sans font-semibold rounded-full">
                Most Popular
              </span>
            )}
          </div>

          <h3 className="font-google-sans font-bold text-4xl lg:text-5xl text-dark mb-2">
            {plan.name}
          </h3>
          
          <div className="flex items-baseline gap-2 mb-8">
            <span className="font-work-sans font-bold text-5xl lg:text-6xl text-dark">
              ${plan.price}
            </span>
            <span className="font-outfit text-dark-muted text-lg">/month</span>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-surface-2/50 rounded-2xl p-5">
              <div className="font-outfit text-sm text-dark-muted mb-1">CPU</div>
              <div className="font-work-sans font-semibold text-xl text-dark">{plan.specs.cpu}</div>
            </div>
            <div className="bg-surface-2/50 rounded-2xl p-5">
              <div className="font-outfit text-sm text-dark-muted mb-1">Memory</div>
              <div className="font-work-sans font-semibold text-xl text-dark">{plan.specs.ram}</div>
            </div>
            <div className="bg-surface-2/50 rounded-2xl p-5">
              <div className="font-outfit text-sm text-dark-muted mb-1">NVMe Storage</div>
              <div className="font-work-sans font-semibold text-xl text-dark">{plan.specs.storage}</div>
            </div>
            <div className="bg-surface-2/50 rounded-2xl p-5">
              <div className="font-outfit text-sm text-dark-muted mb-1">Bandwidth</div>
              <div className="font-work-sans font-semibold text-xl text-dark">{plan.specs.bandwidth}</div>
            </div>
          </div>

          <Link
            href={buildPricingActionUrl(plan.id)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-dark text-white rounded-full font-dm-sans font-semibold text-[15px] hover:bg-primary transition-colors duration-300"
          >
            Deploy {plan.name}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Right - Features */}
        <div className="lg:w-80 lg:border-l lg:border-border lg:pl-10">
          <div className="font-dm-sans font-semibold text-dark mb-5">Included</div>
          <div className="space-y-4">
            {[
              "DDoS Protection",
              "Full Root Access",
              "24/7 Support",
              "99.99% Uptime SLA",
              "Free Setup",
              type === "RDP" ? "Windows Server 2022" : "Choice of Linux OS",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-dark rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <span className="font-outfit text-dark-muted">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Quick view grid for all plans
function PlansGrid({ plans, type }: { plans: Plan[]; type: "VPS" | "RDP" }) {
  return (
    <div className={cn(
      "grid gap-4",
      type === "VPS" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" : "grid-cols-2 lg:grid-cols-4"
    )}>
      {plans.map((plan, i) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          whileHover={{ y: -4 }}
          className={cn(
            "relative rounded-[24px] border transition-all duration-300",
            plan.isPopular 
              ? "bg-dark border-dark" 
              : "bg-surface-1 border-border hover:border-dark/20 hover:shadow-card"
          )}
        >
          {/* Popular Badge */}
          {plan.isPopular && (
            <div className="absolute -top-3 left-5">
              <span className="px-3 py-1 bg-primary text-white text-[11px] font-dm-sans font-semibold rounded-full">
                Popular
              </span>
            </div>
          )}

          <div className="p-6">
            {/* Plan Name */}
            <div className={cn(
              "font-google-sans font-semibold text-lg mb-4",
              plan.isPopular ? "text-white" : "text-dark"
            )}>
              {plan.name}
            </div>

            {/* Price */}
            <div className="mb-5">
              <span className={cn(
                "font-work-sans font-bold text-4xl",
                plan.isPopular ? "text-white" : "text-dark"
              )}>
                ${plan.price}
              </span>
              <span className={cn(
                "font-outfit text-sm",
                plan.isPopular ? "text-white/50" : "text-dark-muted"
              )}>
                /mo
              </span>
            </div>

            {/* Specs */}
            <div className={cn(
              "space-y-3 mb-6",
              plan.isPopular ? "text-white/70" : "text-dark-muted"
            )}>
              <div className="flex items-center justify-between">
                <span className="font-outfit text-sm">CPU</span>
                <span className={cn(
                  "font-work-sans text-sm font-semibold",
                  plan.isPopular ? "text-white" : "text-dark"
                )}>{plan.specs.cpu}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-outfit text-sm">RAM</span>
                <span className={cn(
                  "font-work-sans text-sm font-semibold",
                  plan.isPopular ? "text-white" : "text-dark"
                )}>{plan.specs.ram}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-outfit text-sm">Storage</span>
                <span className={cn(
                  "font-work-sans text-sm font-semibold",
                  plan.isPopular ? "text-white" : "text-dark"
                )}>{plan.specs.storage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-outfit text-sm">Bandwidth</span>
                <span className={cn(
                  "font-work-sans text-sm font-semibold",
                  plan.isPopular ? "text-white" : "text-dark"
                )}>{plan.specs.bandwidth}</span>
              </div>
            </div>

            {/* Purchase Button */}
            <Link
              href={buildPricingActionUrl(plan.id)}
              className={cn(
                "flex items-center justify-center gap-2 w-full py-3 rounded-full font-dm-sans font-semibold text-sm transition-all duration-300",
                plan.isPopular
                  ? "bg-primary text-white hover:bg-primary-hover"
                  : "bg-primary text-white hover:bg-primary-hover"
              )}
            >
              Purchase Now
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function PricingPage() {
  const [selectedVPS, setSelectedVPS] = React.useState(vpsPlans[2]);
  const [selectedRDP, setSelectedRDP] = React.useState(rdpPlans[1]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="pt-32 lg:pt-40 pb-20 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-google-sans font-bold text-5xl sm:text-6xl lg:text-7xl text-dark tracking-tight leading-[1.05] mb-6">
              Pricing
            </h1>
            <p className="font-outfit text-xl text-dark-muted max-w-lg mx-auto">
              Simple, transparent pricing for VPS and RDP servers. No hidden fees.
            </p>
          </motion.div>
        </section>

        {/* VPS Section */}
        <section className="pb-24 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-dark rounded-2xl flex items-center justify-center">
                <Server className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-google-sans font-bold text-2xl text-dark">VPS Servers</h2>
                <p className="font-outfit text-dark-muted">Linux virtual servers with full root access</p>
              </div>
            </div>

            {/* Plan Selector */}
            <div className="mb-8">
              <PlanSelector plans={vpsPlans} selected={selectedVPS} onSelect={setSelectedVPS} />
            </div>

            {/* Selected Plan Display */}
            <AnimatePresence mode="wait">
              <PlanDisplay plan={selectedVPS} type="VPS" />
            </AnimatePresence>

            {/* Quick View Grid */}
            <div className="mt-12">
              <div className="font-dm-sans text-sm text-dark-muted mb-4">All VPS Plans</div>
              <PlansGrid plans={vpsPlans} type="VPS" />
            </div>
          </motion.div>
        </section>

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="h-px bg-border" />
        </div>

        {/* RDP Section */}
        <section className="py-24 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-google-sans font-bold text-2xl text-dark">RDP Servers</h2>
                <p className="font-outfit text-dark-muted">Windows remote desktop with full GUI access</p>
              </div>
            </div>

            {/* Plan Selector */}
            <div className="mb-8">
              <PlanSelector plans={rdpPlans} selected={selectedRDP} onSelect={setSelectedRDP} />
            </div>

            {/* Selected Plan Display */}
            <AnimatePresence mode="wait">
              <PlanDisplay plan={selectedRDP} type="RDP" />
            </AnimatePresence>

            {/* Quick View Grid */}
            <div className="mt-12">
              <div className="font-dm-sans text-sm text-dark-muted mb-4">All RDP Plans</div>
              <PlansGrid plans={rdpPlans} type="RDP" />
            </div>
          </motion.div>
        </section>

        {/* Enterprise CTA */}
        <section className="py-20 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-dark rounded-[32px] p-10 lg:p-14"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-lg">
                <h2 className="font-google-sans font-bold text-3xl lg:text-4xl text-white mb-3">
                  Need Custom Resources?
                </h2>
                <p className="font-outfit text-white/50 text-lg">
                  Contact us for dedicated servers, custom configurations, and volume discounts.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <FlipButton href="/contact" variant="white" icon={<ArrowIcon />}>
                  Contact Sales
                </FlipButton>
              </div>
            </div>
          </motion.div>
        </section>

        {/* FAQ */}
        <section className="py-16 pb-24 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-outfit text-dark-muted text-lg mb-6">
              Have questions? Check out our FAQ.
            </p>
            <FlipButton href="/#faq" variant="dark" icon={<ArrowIcon />}>
              View FAQ
            </FlipButton>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}

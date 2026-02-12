"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { 
  Shield, 
  ArrowRight,
  Check,
  Globe,
  Activity,
  Lock,
  Server,
  Clock
} from "lucide-react";
import { Header, Footer } from "@/components/marketing";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const features = [
  {
    icon: Shield,
    title: "Always-On Protection",
    description: "24/7 monitoring and automatic mitigation of DDoS attacks without any action required from you."
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Distributed across 15+ locations to absorb attacks close to their source."
  },
  {
    icon: Activity,
    title: "Real-Time Analytics",
    description: "Monitor attack traffic and mitigation in real-time through your dashboard."
  },
  {
    icon: Lock,
    title: "Layer 3-7 Protection",
    description: "Comprehensive protection against volumetric, protocol, and application layer attacks."
  },
];

const stats = [
  { value: "10+ Tbps", label: "Network Capacity" },
  { value: "<10ms", label: "Mitigation Time" },
  { value: "100%", label: "Attack Blocked" },
  { value: "0", label: "False Positives" },
];

const attackTypes = [
  "UDP Flood",
  "SYN Flood",
  "HTTP Flood",
  "DNS Amplification",
  "NTP Amplification",
  "Slowloris",
  "ICMP Flood",
  "Application Layer",
];

export default function DDoSProtectionPage() {
  const headerRef = React.useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 lg:pt-36 pb-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Hero */}
          <div ref={headerRef} className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-dark/[0.03] backdrop-blur-sm rounded-full border border-dark/[0.06] text-sm font-dm-sans font-semibold text-dark-muted">
                <Shield className="w-4 h-4 text-primary" />
                Enterprise Security
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
              className="text-4xl sm:text-5xl lg:text-6xl font-google-sans font-bold text-dark tracking-tight mb-6"
            >
              DDoS Protection
              <br />
              <span className="text-primary">Built In</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2, ease }}
              className="font-outfit text-lg text-dark-muted max-w-2xl mx-auto mb-10"
            >
              Every server comes with enterprise-grade DDoS protection at no extra cost. 
              Stay online even during the largest attacks.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3, ease }}
              className="flex flex-wrap justify-center gap-3"
            >
              <Link
                href="/vps"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-dark text-white font-dm-sans font-semibold rounded-full hover:bg-primary hover:scale-[1.02] transition-all duration-300"
              >
                Get Protected
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-surface-1 text-dark font-dm-sans font-semibold rounded-full border border-border hover:border-dark/20 transition-all duration-300"
              >
                Contact Sales
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-24"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 bg-surface-1 rounded-[24px] border border-border"
              >
                <div className="font-work-sans font-bold text-3xl lg:text-4xl text-dark mb-2">
                  {stat.value}
                </div>
                <div className="font-outfit text-dark-muted">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Features */}
          <div className="mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-google-sans font-bold text-3xl text-dark mb-3">
                How It Works
              </h2>
              <p className="font-outfit text-dark-muted max-w-lg mx-auto">
                Our multi-layered approach ensures your services stay online
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-5">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-8 bg-surface-1 rounded-[24px] border border-border hover:border-primary/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-google-sans font-semibold text-xl text-dark mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-outfit text-dark-muted leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Attack Types */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="bg-surface-1 rounded-[32px] border border-border p-10 lg:p-14">
              <h2 className="font-google-sans font-bold text-2xl text-dark mb-8 text-center">
                Protected Against All Attack Types
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {attackTypes.map((attack, i) => (
                  <motion.span
                    key={attack}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-surface-2 rounded-full font-outfit text-dark-muted"
                  >
                    <Check className="w-4 h-4 text-emerald-500" />
                    {attack}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Included Free */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center p-10 bg-emerald-500/10 rounded-[32px] border border-emerald-500/20">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-emerald-600" strokeWidth={2.5} />
              </div>
              <h2 className="font-google-sans font-bold text-2xl text-dark mb-3">
                Included Free with Every Server
              </h2>
              <p className="font-outfit text-dark-muted max-w-lg mx-auto">
                No additional fees, no setup required. DDoS protection is automatically enabled 
                on all VPS and RDP servers from the moment you deploy.
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden bg-dark rounded-[32px] p-10 lg:p-14"
          >
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="ddos-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#ddos-dots)" />
              </svg>
            </div>

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h3 className="font-google-sans font-bold text-2xl lg:text-3xl text-white mb-2">
                  Ready to stay protected?
                </h3>
                <p className="font-outfit text-white/60 max-w-md">
                  Deploy a server today and get enterprise DDoS protection included.
                </p>
              </div>
              <Link
                href="/vps"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-dark font-dm-sans font-semibold rounded-full hover:bg-primary hover:text-white hover:scale-[1.02] transition-all duration-300"
              >
                View Plans
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

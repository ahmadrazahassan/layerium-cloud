"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { 
  Activity, 
  Check,
  AlertTriangle,
  Clock,
  Server,
  Globe,
  Shield,
  Database
} from "lucide-react";
import { Header, Footer } from "@/components/marketing";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const services = [
  { name: "VPS Servers", status: "operational", icon: Server },
  { name: "RDP Servers", status: "operational", icon: Server },
  { name: "API", status: "operational", icon: Activity },
  { name: "Dashboard", status: "operational", icon: Globe },
  { name: "DDoS Protection", status: "operational", icon: Shield },
  { name: "Database", status: "operational", icon: Database },
];

const regions = [
  { name: "US East", location: "New York", status: "operational", latency: "12ms" },
  { name: "US West", location: "Los Angeles", status: "operational", latency: "18ms" },
  { name: "Europe", location: "Amsterdam", status: "operational", latency: "24ms" },
  { name: "Asia Pacific", location: "Singapore", status: "operational", latency: "45ms" },
  { name: "Australia", location: "Sydney", status: "operational", latency: "52ms" },
];

const incidents = [
  {
    date: "Dec 28, 2025",
    title: "Scheduled Maintenance - US East",
    status: "completed",
    description: "Routine maintenance completed successfully with no service interruption.",
  },
  {
    date: "Dec 20, 2025",
    title: "Network Optimization",
    status: "completed",
    description: "Network infrastructure upgraded for improved performance.",
  },
];

const uptimeData = Array.from({ length: 90 }, (_, i) => ({
  day: i,
  status: Math.random() > 0.02 ? "operational" : "degraded",
}));

export default function StatusPage() {
  const headerRef = React.useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
    operational: { bg: "bg-emerald-500/10", text: "text-emerald-600", dot: "bg-emerald-500" },
    degraded: { bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500" },
    outage: { bg: "bg-red-500/10", text: "text-red-600", dot: "bg-red-500" },
    completed: { bg: "bg-blue-500/10", text: "text-blue-600", dot: "bg-blue-500" },
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 lg:pt-36 pb-20">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Hero */}
          <div ref={headerRef} className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-sm font-dm-sans font-semibold text-emerald-600">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                All Systems Operational
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
              className="text-4xl sm:text-5xl lg:text-6xl font-google-sans font-bold text-dark tracking-tight mb-4"
            >
              System Status
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2, ease }}
              className="font-outfit text-lg text-dark-muted"
            >
              Real-time status of all Layerium services
            </motion.p>
          </div>

          {/* Uptime Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-google-sans font-semibold text-lg text-dark">
                90-Day Uptime
              </h2>
              <span className="font-work-sans font-bold text-2xl text-emerald-600">
                99.99%
              </span>
            </div>
            <div className="flex gap-0.5">
              {uptimeData.map((day, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 h-10 rounded-sm transition-colors",
                    day.status === "operational" ? "bg-emerald-500" : "bg-amber-500"
                  )}
                  title={`Day ${90 - i}: ${day.status}`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs font-outfit text-dark-muted">
              <span>90 days ago</span>
              <span>Today</span>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-google-sans font-semibold text-lg text-dark mb-4">
              Services
            </h2>
            <div className="bg-surface-1 rounded-[24px] border border-border overflow-hidden">
              {services.map((service, i) => (
                <div
                  key={service.name}
                  className={cn(
                    "flex items-center justify-between p-5",
                    i !== services.length - 1 && "border-b border-border"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center">
                      <service.icon className="w-5 h-5 text-dark-muted" />
                    </div>
                    <span className="font-outfit font-medium text-dark">
                      {service.name}
                    </span>
                  </div>
                  <span className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-dm-sans font-medium",
                    statusColors[service.status].bg,
                    statusColors[service.status].text
                  )}>
                    <span className={cn("w-2 h-2 rounded-full", statusColors[service.status].dot)} />
                    Operational
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Regions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-google-sans font-semibold text-lg text-dark mb-4">
              Regions
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {regions.map((region) => (
                <div
                  key={region.name}
                  className="p-5 bg-surface-1 rounded-2xl border border-border"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-google-sans font-semibold text-dark">
                      {region.name}
                    </h3>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  </div>
                  <p className="font-outfit text-sm text-dark-muted mb-2">
                    {region.location}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-outfit text-dark-muted">
                    <Clock className="w-3 h-3" />
                    {region.latency} latency
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Incidents */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-google-sans font-semibold text-lg text-dark mb-4">
              Recent Incidents
            </h2>
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div
                  key={incident.title}
                  className="p-6 bg-surface-1 rounded-2xl border border-border"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-google-sans font-semibold text-dark mb-1">
                        {incident.title}
                      </h3>
                      <span className="font-outfit text-sm text-dark-muted">
                        {incident.date}
                      </span>
                    </div>
                    <span className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-dm-sans font-medium",
                      statusColors[incident.status].bg,
                      statusColors[incident.status].text
                    )}>
                      <Check className="w-3 h-3" />
                      Completed
                    </span>
                  </div>
                  <p className="font-outfit text-sm text-dark-muted">
                    {incident.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Subscribe */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center p-8 bg-surface-1 rounded-[24px] border border-border"
          >
            <h3 className="font-google-sans font-semibold text-xl text-dark mb-2">
              Get notified of incidents
            </h3>
            <p className="font-outfit text-dark-muted mb-6">
              Subscribe to receive status updates via email
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 bg-surface-2 border-0 rounded-full font-outfit text-dark placeholder:text-dark-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#BEFF00] text-dark font-dm-sans font-semibold rounded-lg border border-[#a0d600] hover:bg-[#b0f000] transition-colors"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

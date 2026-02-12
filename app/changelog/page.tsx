"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { 
  History, 
  Rocket,
  Bug,
  Wrench,
  Star
} from "lucide-react";
import { Header, Footer } from "@/components/marketing";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const changelog = [
  {
    version: "2.4.0",
    date: "December 28, 2025",
    changes: [
      { type: "feature", text: "NVMe storage now included in all plans" },
      { type: "feature", text: "New Singapore datacenter" },
      { type: "improvement", text: "Dashboard performance improvements" },
      { type: "fix", text: "Fixed timezone display in server logs" },
    ],
  },
  {
    version: "2.3.0",
    date: "December 15, 2025",
    changes: [
      { type: "feature", text: "Windows Server 2022 support" },
      { type: "feature", text: "API rate limiting dashboard" },
      { type: "improvement", text: "Faster server provisioning" },
      { type: "fix", text: "Resolved billing calculation edge case" },
    ],
  },
  {
    version: "2.2.0",
    date: "December 1, 2025",
    changes: [
      { type: "feature", text: "Two-factor authentication" },
      { type: "feature", text: "Server snapshots" },
      { type: "improvement", text: "Improved DDoS detection" },
      { type: "fix", text: "Fixed SSH key upload on Safari" },
    ],
  },
  {
    version: "2.1.0",
    date: "November 15, 2025",
    changes: [
      { type: "feature", text: "Custom ISO uploads" },
      { type: "improvement", text: "Redesigned server console" },
      { type: "improvement", text: "Better error messages" },
      { type: "fix", text: "Fixed password reset email delivery" },
    ],
  },
  {
    version: "2.0.0",
    date: "November 1, 2025",
    changes: [
      { type: "feature", text: "Complete dashboard redesign" },
      { type: "feature", text: "New API v2 with improved performance" },
      { type: "feature", text: "Team collaboration features" },
      { type: "improvement", text: "50% faster page loads" },
    ],
  },
];

const typeConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  feature: { icon: Star, color: "text-primary bg-primary/10", label: "New" },
  improvement: { icon: Rocket, color: "text-blue-600 bg-blue-500/10", label: "Improved" },
  fix: { icon: Bug, color: "text-emerald-600 bg-emerald-500/10", label: "Fixed" },
};

export default function ChangelogPage() {
  const headerRef = React.useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 lg:pt-36 pb-20">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Hero */}
          <div ref={headerRef} className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-dark/[0.03] backdrop-blur-sm rounded-full border border-dark/[0.06] text-sm font-dm-sans font-semibold text-dark-muted">
                <History className="w-4 h-4 text-primary" />
                Changelog
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
              className="text-4xl sm:text-5xl lg:text-6xl font-google-sans font-bold text-dark tracking-tight mb-4"
            >
              What's New
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2, ease }}
              className="font-outfit text-lg text-dark-muted"
            >
              All the latest updates, improvements, and fixes.
            </motion.p>
          </div>

          {/* Changelog */}
          <div className="space-y-8">
            {changelog.map((release, i) => (
              <motion.div
                key={release.version}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative"
              >
                {/* Timeline line */}
                {i !== changelog.length - 1 && (
                  <div className="absolute left-[19px] top-16 bottom-0 w-0.5 bg-border" />
                )}

                <div className="flex gap-6">
                  {/* Version badge */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-dark flex items-center justify-center">
                      <span className="font-mono text-xs font-bold text-white">
                        {release.version.split('.')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <h2 className="font-google-sans font-bold text-xl text-dark">
                        v{release.version}
                      </h2>
                      <span className="px-3 py-1 bg-surface-2 rounded-full text-xs font-outfit text-dark-muted">
                        {release.date}
                      </span>
                    </div>

                    <div className="bg-surface-1 rounded-2xl border border-border p-6">
                      <ul className="space-y-3">
                        {release.changes.map((change, j) => {
                          const config = typeConfig[change.type];
                          return (
                            <li key={j} className="flex items-start gap-3">
                              <span className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-dm-sans font-medium flex-shrink-0",
                                config.color
                              )}>
                                <config.icon className="w-3 h-3" />
                                {config.label}
                              </span>
                              <span className="font-outfit text-dark-muted pt-0.5">
                                {change.text}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Subscribe */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center p-8 bg-surface-1 rounded-[24px] border border-border"
          >
            <h3 className="font-google-sans font-semibold text-xl text-dark mb-2">
              Stay updated
            </h3>
            <p className="font-outfit text-dark-muted mb-6">
              Get notified when we ship new features
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 bg-surface-2 border-0 rounded-full font-outfit text-dark placeholder:text-dark-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-dark text-white font-dm-sans font-semibold rounded-full hover:bg-primary transition-colors"
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

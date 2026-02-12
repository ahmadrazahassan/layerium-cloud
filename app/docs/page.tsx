"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { 
  BookOpen, 
  Search,
  ArrowRight,
  Server,
  Monitor,
  Shield,
  Terminal,
  Settings,
  HelpCircle,
  FileText,
  Code
} from "lucide-react";
import { Header, Footer } from "@/components/marketing";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const categories = [
  {
    icon: Server,
    title: "VPS Servers",
    description: "Setup, configuration, and management guides",
    articles: 12,
    href: "#",
  },
  {
    icon: Monitor,
    title: "RDP Servers",
    description: "Windows remote desktop documentation",
    articles: 8,
    href: "#",
  },
  {
    icon: Shield,
    title: "Security",
    description: "DDoS protection and security best practices",
    articles: 6,
    href: "#",
  },
  {
    icon: Terminal,
    title: "API Reference",
    description: "Complete API documentation and examples",
    articles: 15,
    href: "/api",
  },
  {
    icon: Settings,
    title: "Account & Billing",
    description: "Manage your account and payments",
    articles: 5,
    href: "#",
  },
  {
    icon: HelpCircle,
    title: "Troubleshooting",
    description: "Common issues and solutions",
    articles: 10,
    href: "#",
  },
];

const popularArticles = [
  { title: "Getting Started with Your First VPS", category: "VPS Servers", href: "#" },
  { title: "How to Connect via SSH", category: "VPS Servers", href: "#" },
  { title: "Setting Up Windows RDP", category: "RDP Servers", href: "#" },
  { title: "Configuring Firewall Rules", category: "Security", href: "#" },
  { title: "API Authentication Guide", category: "API Reference", href: "#" },
  { title: "Resetting Your Password", category: "Account & Billing", href: "#" },
];

export default function DocsPage() {
  const headerRef = React.useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 lg:pt-36 pb-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Hero */}
          <div ref={headerRef} className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-dark/[0.03] backdrop-blur-sm rounded-full border border-dark/[0.06] text-sm font-dm-sans font-semibold text-dark-muted">
                <BookOpen className="w-4 h-4 text-primary" />
                Documentation
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
              className="text-4xl sm:text-5xl lg:text-6xl font-google-sans font-bold text-dark tracking-tight mb-4"
            >
              How can we help?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2, ease }}
              className="font-outfit text-lg text-dark-muted max-w-lg mx-auto mb-10"
            >
              Find guides, tutorials, and API references to help you get the most out of Layerium.
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3, ease }}
              className="max-w-xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search documentation..."
                  className="w-full pl-14 pr-6 py-4 bg-surface-1 border border-border rounded-full font-outfit text-dark placeholder:text-dark-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                />
              </div>
            </motion.div>
          </div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16"
          >
            {categories.map((cat, i) => (
              <motion.a
                key={cat.title}
                href={cat.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="group p-6 bg-surface-1 rounded-[24px] border border-border hover:border-primary/20 hover:shadow-soft transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <cat.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-google-sans font-semibold text-lg text-dark mb-1 group-hover:text-primary transition-colors">
                  {cat.title}
                </h3>
                <p className="font-outfit text-sm text-dark-muted mb-3">
                  {cat.description}
                </p>
                <span className="font-outfit text-xs text-dark-muted">
                  {cat.articles} articles
                </span>
              </motion.a>
            ))}
          </motion.div>

          {/* Popular Articles */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-google-sans font-bold text-2xl text-dark mb-6">
              Popular Articles
            </h2>
            <div className="bg-surface-1 rounded-[24px] border border-border overflow-hidden">
              {popularArticles.map((article, i) => (
                <a
                  key={article.title}
                  href={article.href}
                  className={cn(
                    "group flex items-center justify-between p-5 hover:bg-surface-2 transition-colors",
                    i !== popularArticles.length - 1 && "border-b border-border"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <FileText className="w-5 h-5 text-dark-muted group-hover:text-primary transition-colors" />
                    <div>
                      <h3 className="font-outfit font-medium text-dark group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <span className="font-outfit text-sm text-dark-muted">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-dark-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center p-10 bg-surface-1 rounded-[32px] border border-border"
          >
            <h3 className="font-google-sans font-bold text-2xl text-dark mb-3">
              Can't find what you're looking for?
            </h3>
            <p className="font-outfit text-dark-muted mb-6 max-w-md mx-auto">
              Our support team is available 24/7 to help you with any questions.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-dark text-white font-dm-sans font-semibold rounded-full hover:bg-primary hover:scale-[1.02] transition-all duration-300"
            >
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { 
  Mail, 
  MessageSquare, 
  Send,
  ArrowRight,
  Headphones,
  Globe,
  Check,
  Clock,
  MapPin
} from "lucide-react";
import { Header, Footer } from "@/components/marketing";
import { cn } from "@/lib/utils";
import { GreenTrialButton } from "@/components/ui/flip-button";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const contactMethods = [
  { 
    icon: Mail, 
    title: "Email", 
    value: "support@layerium.com",
    action: "mailto:support@layerium.com"
  },
  { 
    icon: MessageSquare, 
    title: "Live Chat", 
    value: "Start conversation",
    action: "#"
  },
  { 
    icon: Headphones, 
    title: "Phone", 
    value: "+1 (555) 123-4567",
    action: "tel:+15551234567"
  },
];

const departments = [
  { label: "General Inquiry", value: "general" },
  { label: "Sales", value: "sales" },
  { label: "Technical Support", value: "support" },
  { label: "Billing", value: "billing" },
  { label: "Partnerships", value: "partnerships" },
];

export default function ContactPage() {
  const headerRef = React.useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });
  const [selectedDept, setSelectedDept] = React.useState("general");
  const [formState, setFormState] = React.useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({ name: "", email: "", message: "" });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 lg:pt-36 pb-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div ref={headerRef} className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-dark/[0.03] backdrop-blur-sm rounded-full border border-dark/[0.06] text-sm font-dm-sans font-semibold text-dark-muted">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Online now
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
              className="text-4xl sm:text-5xl lg:text-6xl font-google-sans font-bold text-dark tracking-tight mb-4"
            >
              Let's talk
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2, ease }}
              className="font-outfit text-lg text-dark-muted max-w-md mx-auto"
            >
              Questions, feedback, or just want to say hi? We'd love to hear from you.
            </motion.p>
          </div>

          {/* Contact Methods - Pill Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mb-14"
          >
            {contactMethods.map((method, i) => (
              <motion.a
                key={method.title}
                href={method.action}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 px-6 py-4 bg-surface-1 rounded-full border border-border hover:border-primary/30 hover:shadow-soft transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <method.icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                  <div className="font-dm-sans text-xs font-semibold text-dark-muted uppercase tracking-wider">
                    {method.title}
                  </div>
                  <div className="font-outfit text-sm font-medium text-dark">
                    {method.value}
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Main Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative bg-surface-1 rounded-[32px] border border-border overflow-hidden">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 px-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="w-10 h-10 text-emerald-500" strokeWidth={2.5} />
                  </motion.div>
                  <h3 className="font-google-sans font-bold text-2xl text-dark mb-2">
                    Message sent!
                  </h3>
                  <p className="font-outfit text-dark-muted mb-8 max-w-sm mx-auto">
                    Thanks for reaching out. We'll get back to you within 2 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#BEFF00] text-dark font-dm-sans font-semibold rounded-lg border border-[#a0d600] hover:bg-[#b0f000] transition-all duration-300"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <div className="p-8 lg:p-12">
                  {/* Department Selector - Pill Style */}
                  <div className="mb-10">
                    <label className="block font-dm-sans text-xs font-semibold text-dark-muted uppercase tracking-wider mb-4">
                      What can we help with?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {departments.map((dept) => (
                        <button
                          key={dept.value}
                          type="button"
                          onClick={() => setSelectedDept(dept.value)}
                          className={cn(
                            "px-5 py-2.5 rounded-full font-outfit text-sm font-medium transition-all duration-300",
                            selectedDept === dept.value
                              ? "bg-dark text-white"
                              : "bg-surface-2 text-dark-muted hover:text-dark hover:bg-surface-2/80"
                          )}
                        >
                          {dept.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block font-dm-sans text-sm font-medium text-dark mb-3">
                          Your name
                        </label>
                        <input
                          type="text"
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          className="w-full px-6 py-4 bg-surface-2 border-0 rounded-full font-outfit text-dark placeholder:text-dark-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-dm-sans text-sm font-medium text-dark mb-3">
                          Email address
                        </label>
                        <input
                          type="email"
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          className="w-full px-6 py-4 bg-surface-2 border-0 rounded-full font-outfit text-dark placeholder:text-dark-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-dm-sans text-sm font-medium text-dark mb-3">
                        Your message
                      </label>
                      <textarea
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        rows={5}
                        className="w-full px-6 py-4 bg-surface-2 border-0 rounded-[24px] font-outfit text-dark placeholder:text-dark-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 resize-none"
                        placeholder="Tell us how we can help..."
                        required
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-dark/[0.03] rounded-full">
                          <Clock className="w-4 h-4 text-dark-muted" />
                          <span className="font-outfit text-sm text-dark-muted">
                            <span className="font-work-sans font-semibold text-dark">2hr</span> response
                          </span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-dark/[0.03] rounded-full">
                          <Globe className="w-4 h-4 text-dark-muted" />
                          <span className="font-outfit text-sm text-dark-muted">
                            <span className="font-work-sans font-semibold text-dark">24/7</span> support
                          </span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-[#BEFF00] text-dark font-dm-sans font-semibold rounded-lg border border-[#a0d600] hover:bg-[#b0f000] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send message
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </motion.div>

          {/* Bottom Info Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mt-10"
          >
            <div className="flex items-center gap-2 px-5 py-3 bg-surface-1 rounded-full border border-border">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-outfit text-sm text-dark-muted">
                Based in <span className="font-semibold text-dark">San Francisco</span>
              </span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-surface-1 rounded-full border border-border">
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="font-outfit text-sm text-dark-muted">
                <span className="font-semibold text-dark">10,000+</span> happy customers
              </span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-surface-1 rounded-full border border-border">
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="font-outfit text-sm text-dark-muted">
                <span className="font-semibold text-dark">99.9%</span> satisfaction rate
              </span>
            </div>
          </motion.div>

          {/* FAQ CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            <div className="relative overflow-hidden bg-dark rounded-[32px] p-10 lg:p-12">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full">
                  <defs>
                    <pattern id="contact-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="white" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#contact-dots)" />
                </svg>
              </div>

              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h3 className="font-google-sans font-bold text-2xl lg:text-3xl text-white mb-2">
                    Need quick answers?
                  </h3>
                  <p className="font-outfit text-white/60 max-w-md">
                    Browse our FAQ for instant answers to common questions.
                  </p>
                </div>
                <GreenTrialButton href="/#faq" size="lg">
                  View FAQ
                </GreenTrialButton>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

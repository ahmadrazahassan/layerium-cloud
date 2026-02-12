"use client";

import * as React from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Plus } from "lucide-react";
import { GreenTrialButton } from "@/components/ui/flip-button";

// Premium easing
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const faqs = [
  {
    question: "What's the difference between VPS and RDP?",
    answer: "VPS gives you full root access to a virtualized server, ideal for developers. RDP provides a Windows desktop environment for remote access, perfect for running Windows applications.",
  },
  {
    question: "How fast is server deployment?",
    answer: "Our automated system deploys servers in under 60 seconds. Once you complete your order, credentials are sent immediately and your server is ready to use.",
  },
  {
    question: "Is DDoS protection included?",
    answer: "Yes, all servers include enterprise-grade DDoS protection at no extra cost. Our network automatically detects and mitigates attacks.",
  },
  {
    question: "Can I upgrade my server later?",
    answer: "Absolutely. Upgrade RAM, CPU, and storage anytime through your dashboard. Changes apply instantly with minimal downtime.",
  },
  {
    question: "What operating systems are available?",
    answer: "We offer Ubuntu, Debian, CentOS, AlmaLinux, Rocky Linux, Windows Server 2019/2022, and Windows 10/11 for RDP.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, PayPal, and cryptocurrency. For Pakistan customers, we also support JazzCash and EasyPaisa.",
  },
  {
    question: "Is there a money-back guarantee?",
    answer: "Yes, we offer a 7-day money-back guarantee on all new orders. Contact support within 7 days for a full refund.",
  },
  {
    question: "Do you offer managed services?",
    answer: "We offer both unmanaged and managed options. Managed services include monitoring, security updates, backups, and 24/7 support.",
  },
];

function FAQItem({ 
  faq, 
  index, 
  isOpen, 
  onToggle 
}: { 
  faq: typeof faqs[0]; 
  index: number; 
  isOpen: boolean;
  onToggle: () => void;
}) {
  const ref = React.useRef(null);
  const itemInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={itemInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease }}
    >
      <button
        onClick={onToggle}
        className="w-full group"
      >
        <motion.div 
          className={`flex items-start justify-between gap-4 p-6 rounded-2xl transition-all duration-400 ${isOpen ? 'bg-surface-1 shadow-card' : 'hover:bg-surface-1'}`}
          whileHover={{ x: isOpen ? 0 : 4 }}
          transition={{ duration: 0.2 }}
        >
          <span className="font-outfit text-[17px] text-dark text-left leading-relaxed">
            {faq.question}
          </span>
          <motion.div 
            className={`w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 transition-colors duration-300 ${isOpen ? 'bg-dark' : 'bg-surface-2 group-hover:bg-dark/5'}`}
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <Plus className={`w-4 h-4 transition-colors duration-300 ${isOpen ? 'text-white' : 'text-dark-muted'}`} strokeWidth={2} />
          </motion.div>
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2">
              <p className="font-outfit text-[15px] text-dark-muted leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <section id="faq" className="py-28 lg:py-36 bg-background">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left - Header */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:sticky lg:top-32"
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-surface-1 rounded-full border border-border text-[13px] font-dm-sans font-medium text-dark-muted mb-5">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                faq
              </span>
              
              <h2 className="text-[2.5rem] sm:text-5xl font-google-sans font-semibold text-dark tracking-tight leading-[1.08] mb-5">
                questions?
                <br />
                <span className="text-dark-muted">answers.</span>
              </h2>
              
              <p className="font-outfit text-dark-muted leading-relaxed mb-8">
                can't find what you're looking for? reach out to our support team.
              </p>
              
              <GreenTrialButton href="/contact">
                Contact Support
              </GreenTrialButton>
            </motion.div>
          </div>

          {/* Right - FAQ Items */}
          <div className="lg:col-span-8">
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  faq={faq}
                  index={index}
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

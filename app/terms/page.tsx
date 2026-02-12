"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { FileText } from "lucide-react";
import { Header, Footer } from "@/components/marketing";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function TermsPage() {
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
                <FileText className="w-4 h-4 text-primary" />
                Legal
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
              className="text-4xl sm:text-5xl font-google-sans font-bold text-dark tracking-tight mb-4"
            >
              Terms of Service
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2, ease }}
              className="font-outfit text-dark-muted"
            >
              Last updated: December 31, 2025
            </motion.p>
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
          >
            <div className="bg-surface-1 rounded-[24px] border border-border p-8 lg:p-10 space-y-8">
              <section>
                <h2 className="font-google-sans font-semibold text-xl text-dark mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="font-outfit text-dark-muted leading-relaxed">
                  By accessing or using Layerium's services, you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="font-google-sans font-semibold text-xl text-dark mb-4">
                  2. Description of Services
                </h2>
                <p className="font-outfit text-dark-muted leading-relaxed">
                  Layerium provides cloud infrastructure services including Virtual Private Servers (VPS), 
                  Remote Desktop Protocol (RDP) servers, and related services. We reserve the right to 
                  modify, suspend, or discontinue any part of our services at any time.
                </p>
              </section>

              <section>
                <h2 className="font-google-sans font-semibold text-xl text-dark mb-4">
                  3. Account Responsibilities
                </h2>
                <p className="font-outfit text-dark-muted leading-relaxed mb-4">
                  You are responsible for:
                </p>
                <ul className="space-y-2 font-outfit text-dark-muted">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 flex-shrink-0" />
                    Maintaining the confidentiality of your account credentials
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 flex-shrink-0" />
                    All activities that occur under your account
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 flex-shrink-0" />
                    Notifying us immediately of any unauthorized use
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 flex-shrink-0" />
                    Ensuring your use complies with all applicable laws
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-google-sans font-semibold text-xl text-dark mb-4">
                  4. Acceptable Use Policy
                </h2>
                <p className="font-outfit text-dark-muted leading-relaxed mb-4">
                  You agree not to use our services for:
                </p>
                <ul className="space-y-2 font-outfit text-dark-muted">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0" />
                    Any illegal activities or purposes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0" />
                    Distributing malware or engaging in hacking activities
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0" />
                    Sending spam or unsolicited communications
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0" />
                    Infringing on intellectual property rights
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-google-sans font-semibold text-xl text-dark mb-4">
                  5. Payment Terms
                </h2>
                <p className="font-outfit text-dark-muted leading-relaxed">
                  All fees are due in advance and are non-refundable unless otherwise stated. We reserve 
                  the right to change our pricing at any time with 30 days notice. Failure to pay may 
                  result in suspension or termination of services.
                </p>
              </section>

              <section>
                <h2 className="font-google-sans font-semibold text-xl text-dark mb-4">
                  6. Service Level Agreement
                </h2>
                <p className="font-outfit text-dark-muted leading-relaxed">
                  Our SLA guarantees 99.9% uptime for all services. Please refer to our{" "}
                  <a href="/sla" className="text-primary hover:underline">
                    SLA page
                  </a>{" "}
                  for detailed terms and compensation policies.
                </p>
              </section>

              <section>
                <h2 className="font-google-sans font-semibold text-xl text-dark mb-4">
                  7. Limitation of Liability
                </h2>
                <p className="font-outfit text-dark-muted leading-relaxed">
                  Layerium shall not be liable for any indirect, incidental, special, consequential, or 
                  punitive damages resulting from your use of our services. Our total liability shall not 
                  exceed the amount paid by you in the 12 months preceding the claim.
                </p>
              </section>

              <section>
                <h2 className="font-google-sans font-semibold text-xl text-dark mb-4">
                  8. Termination
                </h2>
                <p className="font-outfit text-dark-muted leading-relaxed">
                  Either party may terminate this agreement at any time. Upon termination, your right to 
                  use our services will immediately cease. We may terminate or suspend your account 
                  immediately for violations of these terms.
                </p>
              </section>

              <section>
                <h2 className="font-google-sans font-semibold text-xl text-dark mb-4">
                  9. Contact
                </h2>
                <p className="font-outfit text-dark-muted leading-relaxed">
                  For questions about these Terms of Service, please contact us at{" "}
                  <a href="mailto:legal@layerium.com" className="text-primary hover:underline">
                    legal@layerium.com
                  </a>
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Check, Clock, Server } from "lucide-react";
import { Header, Footer } from "@/components/marketing";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const uptimeCredits = [
  { uptime: "99.9% - 99.99%", credit: "10%" },
  { uptime: "99.0% - 99.9%", credit: "25%" },
  { uptime: "95.0% - 99.0%", credit: "50%" },
  { uptime: "Below 95.0%", credit: "100%" },
];

const guarantees = [
  { icon: Server, title: "99.99% Uptime", description: "Network and infrastructure availability" },
  { icon: Shield, title: "DDoS Protection", description: "Always-on attack mitigation" },
  { icon: Clock, title: "15min Response", description: "Critical issue response time" },
];

export default function SLAPage() {
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
                <Shield className="w-4 h-4 text-primary" />
                Legal
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
              className="text-4xl sm:text-5xl font-google-sans font-bold text-dark tracking-tight mb-4"
            >
              Service Level Agreement
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

          {/* Guarantees */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-3 gap-4 mb-12"
          >
            {guarantees.map((item, i) => (
              <div
                key={item.title}
                className="text-center p-6 bg-surface-1 rounded-2xl border border-border"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-google-sans font-semibold text-dark mb-1">
                  {item.title}
                </h3>
                <p className="font-outfit text-sm text-dark-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-surface-1 rounded-[24px] border border-border p-8 lg:p-10 space-y-8">
              <section>
                <h2 className="font-google-sans font-semibold text-xl text-dark mb-4">
                  1. Uptime Guarantee
                </h2>
                <p className="font-outfit text-dark-muted leading-relaxed">
                  Layerium guarantees 99.99% uptime for all VPS and RDP services. This guarantee covers 
                  network availability, hardware functionality, and core infrastructure services. Scheduled 
                  maintenance windows are excluded from uptime calculations and will be announced at least 
                  72 hours in advance.
                </p>
              </section>

              <section>
                <h2 className="font-google-sans font-semibold text-xl text-dark mb-4">
                  2. Service Credits
                </h2>
                <p className="font-outfit text-dark-muted leading-relaxed mb-6">
                  If we fail to meet our uptime guarantee, you are eligible for service credits based on 
                  the following schedule:
                </p>
                <div className="bg-surface-2 rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-2 gap-px bg-border">
                    <div className="bg-dark p-4">
                      <span className="font-dm-sans text-sm font-semibold text-white">
                        Monthly Uptime
                      </span>
                    </div>
                    <div className="bg-dark p-4">
                      <span className="font-dm-sans text-sm font-semibold text-white">
                        Service Credit
                      </span>
                    </div>
                    {uptimeCredits.map((row) => (
                      <React.Fragment key={row.uptime}>
                        <div className="bg-surface-1 p-4">
                          <span className="font-outfit text-dark-muted">{row.uptime}</span>
                        </div>
                        <div className="bg-surface-1 p-4">
                          <span className="font-work-sans font-semibold text-primary">{row.credit}</span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-google-sans font-semibold text-xl text-dark mb-4">
                  3. Exclusions
                </h2>
                <p className="font-outfit text-dark-muted leading-relaxed mb-4">
                  The following are not covered by this SLA:
                </p>
                <ul className="space-y-2 font-outfit text-dark-muted">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-dark-muted rounded-full mt-2.5 flex-shrink-0" />
                    Scheduled maintenance announced in advance
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-dark-muted rounded-full mt-2.5 flex-shrink-0" />
                    Issues caused by customer actions or configurations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-dark-muted rounded-full mt-2.5 flex-shrink-0" />
                    Force majeure events beyond our control
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-dark-muted rounded-full mt-2.5 flex-shrink-0" />
                    Third-party service outages
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-dark-muted rounded-full mt-2.5 flex-shrink-0" />
                    Accounts in violation of our Terms of Service
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-google-sans font-semibold text-xl text-dark mb-4">
                  4. Support Response Times
                </h2>
                <p className="font-outfit text-dark-muted leading-relaxed mb-4">
                  We commit to the following response times based on issue severity:
                </p>
                <ul className="space-y-2 font-outfit text-dark-muted">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0" />
                    <span><strong className="text-dark">Critical:</strong> 15 minutes (service down)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2.5 flex-shrink-0" />
                    <span><strong className="text-dark">High:</strong> 1 hour (major functionality impaired)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2.5 flex-shrink-0" />
                    <span><strong className="text-dark">Medium:</strong> 4 hours (minor functionality impaired)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2.5 flex-shrink-0" />
                    <span><strong className="text-dark">Low:</strong> 24 hours (general inquiries)</span>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-google-sans font-semibold text-xl text-dark mb-4">
                  5. Claiming Credits
                </h2>
                <p className="font-outfit text-dark-muted leading-relaxed">
                  To claim service credits, submit a support ticket within 30 days of the incident. Include 
                  the affected services, time period, and any relevant details. Credits will be applied to 
                  your next billing cycle and cannot be exchanged for cash.
                </p>
              </section>

              <section>
                <h2 className="font-google-sans font-semibold text-xl text-dark mb-4">
                  6. Contact
                </h2>
                <p className="font-outfit text-dark-muted leading-relaxed">
                  For SLA-related inquiries, please contact us at{" "}
                  <a href="mailto:sla@layerium.com" className="text-primary hover:underline">
                    sla@layerium.com
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

"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { Shield } from "lucide-react";
import { Header, Footer } from "@/components/marketing";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function PrivacyPage() {
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
              Privacy Policy
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
                  1. Information We Collect
                </h2>
                <p className="font-outfit text-dark-muted leading-relaxed">
                  We collect information you provide directly to us, such as when you create an account, 
                  make a purchase, or contact us for support. This may include your name, email address, 
                  billing information, and any other information you choose to provide.
                </p>
              </section>

              <section>
                <h2 className="font-google-sans font-semibold text-xl text-dark mb-4">
                  2. How We Use Your Information
                </h2>
                <p className="font-outfit text-dark-muted leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="space-y-2 font-outfit text-dark-muted">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 flex-shrink-0" />
                    Provide, maintain, and improve our services
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 flex-shrink-0" />
                    Process transactions and send related information
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 flex-shrink-0" />
                    Send technical notices and support messages
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 flex-shrink-0" />
                    Respond to your comments and questions
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-google-sans font-semibold text-xl text-dark mb-4">
                  3. Information Sharing
                </h2>
                <p className="font-outfit text-dark-muted leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to third parties. 
                  We may share information with trusted service providers who assist us in operating our 
                  website and conducting our business, as long as they agree to keep this information confidential.
                </p>
              </section>

              <section>
                <h2 className="font-google-sans font-semibold text-xl text-dark mb-4">
                  4. Data Security
                </h2>
                <p className="font-outfit text-dark-muted leading-relaxed">
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. All data is encrypted in 
                  transit and at rest using industry-standard encryption protocols.
                </p>
              </section>

              <section>
                <h2 className="font-google-sans font-semibold text-xl text-dark mb-4">
                  5. Cookies
                </h2>
                <p className="font-outfit text-dark-muted leading-relaxed">
                  We use cookies to enhance your experience on our website. You can choose to disable 
                  cookies through your browser settings, but this may affect some functionality of our services.
                </p>
              </section>

              <section>
                <h2 className="font-google-sans font-semibold text-xl text-dark mb-4">
                  6. Your Rights
                </h2>
                <p className="font-outfit text-dark-muted leading-relaxed">
                  You have the right to access, correct, or delete your personal information at any time. 
                  You can do this through your account settings or by contacting our support team.
                </p>
              </section>

              <section>
                <h2 className="font-google-sans font-semibold text-xl text-dark mb-4">
                  7. Contact Us
                </h2>
                <p className="font-outfit text-dark-muted leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:privacy@layerium.com" className="text-primary hover:underline">
                    privacy@layerium.com
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

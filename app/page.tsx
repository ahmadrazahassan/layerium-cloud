"use client";

import { motion } from "framer-motion";
import {
  Header,
  Hero,
  Features,
  Pricing,
  WhyChooseUs,
  Datacenters,
  Testimonials,
  FAQ,
  Footer,
} from "@/components/marketing";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header />
        <main className="min-h-screen">
          <Hero />
          <Pricing />
          <Features />
          <WhyChooseUs />
          <Datacenters />
          <Testimonials />
          <FAQ />
        </main>
        <Footer />
      </motion.div>
    </SmoothScrollProvider>
  );
}

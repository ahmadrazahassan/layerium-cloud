"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { GreenTrialButton } from "@/components/ui/flip-button";
import { SplineScene } from "@/components/ui/splite";
import { routes } from "@/lib/routes";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero() {
  const sectionRef = React.useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[100svh] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        <div className="flex flex-col lg:flex-row items-center min-h-[100svh] pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 lg:pb-20 gap-8 lg:gap-0">

          {/* Left content */}
          <div className="flex-1 flex flex-col justify-center">

            {/* Heading */}
            <h1 className="font-google-sans text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] xl:text-[4rem] font-bold leading-[1.05] tracking-[-0.035em]">
              <span className="block overflow-hidden">
                <motion.span
                  className="block text-dark"
                  initial={{ y: "110%" }}
                  animate={isInView ? { y: 0 } : { y: "110%" }}
                  transition={{ duration: 0.9, ease }}
                >
                  Deploy faster.
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={isInView ? { y: 0 } : { y: "110%" }}
                  transition={{ duration: 0.9, delay: 0.06, ease }}
                >
                  <span className="text-dark">Scale </span>
                  <span className="text-dark/25 italic font-light font-[Georgia,_'Times_New_Roman',serif]">
                    without
                  </span>
                  <span className="text-dark"> limits.</span>
                </motion.span>
              </span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15, ease }}
              className="font-outfit text-[14px] sm:text-[15px] text-dark-muted/70 leading-[1.8] mt-6 mb-10 max-w-[440px]"
            >
              Premium VPS & RDP servers with NVMe storage, dedicated resources, and instant provisioning across 6 global regions.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25, ease }}
              className="flex flex-wrap items-center gap-3"
            >
              <GreenTrialButton
                href={routes.auth.signup}
                size="lg"
              >
                Start Free Trial
              </GreenTrialButton>
              <Link
                href={routes.pricing}
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-dm-sans text-[13px] font-medium text-dark-muted hover:text-dark border border-dark/[0.08] hover:border-dark/[0.15] hover:bg-dark/[0.02] transition-all duration-200"
              >
                View pricing
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </div>

          {/* Right content — 3D Scene */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease }}
            className="flex-1 relative w-full h-[400px] sm:h-[500px] lg:h-[600px]"
          >
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </motion.div>

        </div>
      </div>

    </section>
  );
}

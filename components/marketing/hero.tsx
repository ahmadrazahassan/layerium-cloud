"use client";

import * as React from "react";
import { motion, useInView, type UseInViewOptions } from "framer-motion";
import { FlipButton, GreenTrialButton } from "@/components/ui/flip-button";
import { routes } from "@/lib/routes";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

function useStaggerInView(margin: UseInViewOptions["margin"] = "-80px") {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin });
  return { ref, inView };
}

function IsometricIllustration() {
  const grid = useStaggerInView("-40px");
  const platform = useStaggerInView("-60px");
  const board = useStaggerInView("-80px");
  const details = useStaggerInView("-100px");
  const fan = useStaggerInView("-110px");
  const lid = useStaggerInView("-120px");
  const storage = useStaggerInView("-130px");
  const cube = useStaggerInView("-130px");
  const docPanel = useStaggerInView("-90px");
  const chartPanel = useStaggerInView("-90px");
  const connections = useStaggerInView("-70px");
  const uiCard = useStaggerInView("-60px");
  const typo = useStaggerInView("-50px");
  const pie = useStaggerInView("-50px");
  const dots = useStaggerInView("-40px");

  return (
    <svg
      viewBox="0 0 800 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      {/* Grid lines */}
      <motion.g
        ref={grid.ref}
        initial={{ opacity: 0 }}
        animate={grid.inView ? { opacity: 0.06 } : { opacity: 0 }}
        transition={{ duration: 1.5, ease }}
        stroke="#1e1f26"
        strokeWidth="0.5"
      >
        <line x1="200" y1="600" x2="750" y2="320" />
        <line x1="180" y1="560" x2="730" y2="280" />
        <line x1="160" y1="520" x2="710" y2="240" />
        <line x1="140" y1="480" x2="690" y2="200" />
        <line x1="120" y1="440" x2="670" y2="160" />
        <line x1="250" y1="280" x2="250" y2="620" />
        <line x1="350" y1="230" x2="350" y2="570" />
        <line x1="450" y1="180" x2="450" y2="520" />
        <line x1="550" y1="130" x2="550" y2="470" />
        <line x1="650" y1="80" x2="650" y2="420" />
        <line x1="100" y1="400" x2="500" y2="600" />
        <line x1="200" y1="300" x2="600" y2="500" />
        <line x1="300" y1="200" x2="700" y2="400" />
        <line x1="400" y1="100" x2="800" y2="300" />
      </motion.g>

      {/* LAYER 1: Base platform */}
      <motion.g
        ref={platform.ref}
        initial={{ opacity: 0, y: 60 }}
        animate={platform.inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 0.9, ease }}
      >
        <path d="M400 520 L600 405 L400 290 L200 405 Z" fill="#f5f0ec" stroke="#1e1f26" strokeWidth="1.5" />
        <path d="M400 520 L400 545 L200 430 L200 405 Z" fill="#e8e3df" stroke="#1e1f26" strokeWidth="1" />
        <path d="M400 520 L400 545 L600 430 L600 405 Z" fill="#ddd8d4" stroke="#1e1f26" strokeWidth="1" />
      </motion.g>

      {/* LAYER 2: Motherboard */}
      <motion.g
        ref={board.ref}
        initial={{ opacity: 0, y: 50 }}
        animate={board.inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.85, delay: 0.1, ease }}
      >
        <path d="M400 400 L580 290 L400 180 L220 290 Z" fill="#1e1f26" stroke="#1e1f26" strokeWidth="1.5" />
        <path d="M400 400 L400 420 L220 310 L220 290 Z" fill="#15161c" stroke="#1e1f26" strokeWidth="1" />
        <path d="M400 400 L400 420 L580 310 L580 290 Z" fill="#0f1015" stroke="#1e1f26" strokeWidth="1" />
      </motion.g>

      {/* LAYER 2b: Board details */}
      <motion.g
        ref={details.ref}
        initial={{ opacity: 0 }}
        animate={details.inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease }}
      >
        <g stroke="#ff5533" strokeWidth="0.8" opacity="0.4">
          <line x1="300" y1="310" x2="350" y2="285" />
          <line x1="350" y1="285" x2="350" y2="260" />
          <line x1="350" y1="260" x2="420" y2="225" />
          <line x1="450" y1="280" x2="500" y2="255" />
          <line x1="500" y1="255" x2="500" y2="240" />
          <line x1="320" y1="340" x2="380" y2="310" />
          <line x1="380" y1="310" x2="440" y2="280" />
        </g>
        <path d="M380 310 L430 285 L400 268 L350 293 Z" fill="#2a2b33" stroke="#ff5533" strokeWidth="0.8" />
        <path d="M380 310 L380 316 L350 299 L350 293 Z" fill="#22232a" stroke="#ff5533" strokeWidth="0.5" />
        <path d="M380 310 L380 316 L430 291 L430 285 Z" fill="#1a1b22" stroke="#ff5533" strokeWidth="0.5" />
        <g stroke="#64656d" strokeWidth="0.5">
          <line x1="358" y1="296" x2="348" y2="302" />
          <line x1="365" y1="292" x2="355" y2="298" />
          <line x1="372" y1="288" x2="362" y2="294" />
          <line x1="412" y1="278" x2="422" y2="284" />
          <line x1="419" y1="274" x2="429" y2="280" />
        </g>
        <rect x="460" y="260" width="60" height="8" rx="1" transform="rotate(-30 460 260)" fill="#2a2b33" stroke="#64656d" strokeWidth="0.5" />
        <rect x="465" y="250" width="60" height="8" rx="1" transform="rotate(-30 465 250)" fill="#2a2b33" stroke="#64656d" strokeWidth="0.5" />
        <circle cx="310" cy="330" r="4" fill="#2a2b33" stroke="#64656d" strokeWidth="0.5" />
        <circle cx="325" cy="322" r="3" fill="#2a2b33" stroke="#64656d" strokeWidth="0.5" />
        <rect x="480" y="300" width="10" height="6" rx="1" transform="rotate(-30 480 300)" fill="#2a2b33" stroke="#64656d" strokeWidth="0.5" />
      </motion.g>

      {/* LAYER 2c: Cooling fan */}
      <motion.g
        ref={fan.ref}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={fan.inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
        transition={{ duration: 0.6, ease }}
        style={{ transformOrigin: "490px 316px" }}
      >
        <ellipse cx="490" cy="320" rx="28" ry="16" fill="#2a2b33" stroke="#64656d" strokeWidth="0.8" transform="rotate(-30 490 320)" />
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "490px 316px" }}
        >
          <line x1="490" y1="304" x2="490" y2="328" stroke="#64656d" strokeWidth="1" />
          <line x1="476" y1="316" x2="504" y2="316" stroke="#64656d" strokeWidth="1" />
          <line x1="480" y1="306" x2="500" y2="326" stroke="#64656d" strokeWidth="1" />
          <line x1="500" y1="306" x2="480" y2="326" stroke="#64656d" strokeWidth="1" />
        </motion.g>
        <circle cx="490" cy="316" r="3" fill="#1e1f26" stroke="#64656d" strokeWidth="0.5" />
      </motion.g>

      {/* LAYER 3: Server lid */}
      <motion.g
        ref={lid.ref}
        initial={{ opacity: 0, y: 45 }}
        animate={lid.inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 45 }}
        transition={{ duration: 0.85, delay: 0.08, ease }}
      >
        <path d="M400 330 L570 225 L400 120 L230 225 Z" fill="#1e1f26" stroke="#1e1f26" strokeWidth="1.5" />
        <path d="M400 330 L400 345 L230 240 L230 225 Z" fill="#15161c" stroke="#1e1f26" strokeWidth="1" />
        <path d="M400 330 L400 345 L570 240 L570 225 Z" fill="#0f1015" stroke="#1e1f26" strokeWidth="1" />
        <g stroke="#2a2b33" strokeWidth="2.5" opacity="0.6">
          <line x1="310" y1="260" x2="370" y2="228" />
          <line x1="320" y1="270" x2="380" y2="238" />
          <line x1="330" y1="280" x2="390" y2="248" />
          <line x1="340" y1="290" x2="400" y2="258" />
        </g>
        <circle cx="480" cy="250" r="4" fill="#ff5533" opacity="0.9" />
        <circle cx="480" cy="250" r="7" fill="none" stroke="#ff5533" strokeWidth="0.5" opacity="0.4" />
        <circle cx="500" cy="240" r="5" fill="none" stroke="#64656d" strokeWidth="1" />
        <path d="M500 236 L500 240" stroke="#64656d" strokeWidth="1" />
      </motion.g>

      {/* LAYER 4: Storage block */}
      <motion.g
        ref={storage.ref}
        initial={{ opacity: 0, y: 40 }}
        animate={storage.inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease }}
      >
        <motion.g
          animate={storage.inView ? { y: [0, -5, 0] } : {}}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          <path d="M420 110 L490 70 L420 30 L350 70 Z" fill="#1e1f26" stroke="#1e1f26" strokeWidth="1.2" />
          <path d="M420 110 L420 135 L350 95 L350 70 Z" fill="#15161c" stroke="#1e1f26" strokeWidth="1" />
          <path d="M420 110 L420 135 L490 95 L490 70 Z" fill="#0f1015" stroke="#1e1f26" strokeWidth="1" />
          <rect x="425" y="98" width="20" height="3" rx="0.5" fill="#ff5533" opacity="0.6" transform="rotate(-30 425 98)" />
          <rect x="425" y="106" width="20" height="3" rx="0.5" fill="#64656d" opacity="0.4" transform="rotate(-30 425 106)" />
          <rect x="425" y="114" width="20" height="3" rx="0.5" fill="#64656d" opacity="0.3" transform="rotate(-30 425 114)" />
        </motion.g>
      </motion.g>

      {/* LAYER 5: Floating cube */}
      <motion.g
        ref={cube.ref}
        initial={{ opacity: 0, y: 35 }}
        animate={cube.inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
        transition={{ duration: 0.8, delay: 0.1, ease }}
      >
        <motion.g
          animate={cube.inView ? { y: [0, -7, 0] } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <path d="M280 160 L320 138 L280 116 L240 138 Z" fill="#f5f0ec" stroke="#1e1f26" strokeWidth="1.2" />
          <path d="M280 160 L280 190 L240 168 L240 138 Z" fill="#e8e3df" stroke="#1e1f26" strokeWidth="1" />
          <path d="M280 160 L280 190 L320 168 L320 138 Z" fill="#ddd8d4" stroke="#1e1f26" strokeWidth="1" />
        </motion.g>
      </motion.g>

      {/* Document panel — slides from right */}
      <motion.g
        ref={docPanel.ref}
        initial={{ opacity: 0, x: 50 }}
        animate={docPanel.inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
        transition={{ duration: 0.8, ease }}
      >
        <path d="M560 380 L680 310 L680 210 L560 280 Z" fill="white" stroke="#1e1f26" strokeWidth="1.2" />
        <path d="M560 280 L680 210 L620 175 L500 245 Z" fill="#f5f0ec" stroke="#1e1f26" strokeWidth="1.2" />
        <path d="M560 380 L500 345 L500 245 L560 280 Z" fill="#f0ebe7" stroke="#1e1f26" strokeWidth="1.2" />
        <motion.line x1="575" y1="300" x2="650" y2="260" stroke="#1e1f26" strokeWidth="2" opacity="0.3"
          initial={{ pathLength: 0 }} animate={docPanel.inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease }} />
        <motion.line x1="575" y1="315" x2="640" y2="280" stroke="#1e1f26" strokeWidth="2" opacity="0.2"
          initial={{ pathLength: 0 }} animate={docPanel.inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease }} />
        <motion.line x1="575" y1="330" x2="630" y2="300" stroke="#1e1f26" strokeWidth="2" opacity="0.15"
          initial={{ pathLength: 0 }} animate={docPanel.inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease }} />
        <motion.line x1="575" y1="345" x2="620" y2="320" stroke="#1e1f26" strokeWidth="2" opacity="0.1"
          initial={{ pathLength: 0 }} animate={docPanel.inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.4, delay: 0.5, ease }} />
      </motion.g>

      {/* Bar chart panel — slides from left */}
      <motion.g
        ref={chartPanel.ref}
        initial={{ opacity: 0, x: -50 }}
        animate={chartPanel.inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        transition={{ duration: 0.8, ease }}
      >
        <path d="M180 420 L300 350 L300 270 L180 340 Z" fill="white" stroke="#1e1f26" strokeWidth="1.2" />
        <path d="M180 340 L300 270 L240 235 L120 305 Z" fill="#f5f0ec" stroke="#1e1f26" strokeWidth="1.2" />
        <path d="M180 420 L120 385 L120 305 L180 340 Z" fill="#f0ebe7" stroke="#1e1f26" strokeWidth="1.2" />
        <motion.rect x="200" y="370" width="12" height="30" rx="1" transform="skewY(-30)" fill="#1e1f26" opacity="0.7"
          initial={{ scaleY: 0 }} animate={chartPanel.inView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease }} style={{ transformOrigin: "206px 400px" }} />
        <motion.rect x="220" y="358" width="12" height="42" rx="1" transform="skewY(-30)" fill="#1e1f26" opacity="0.5"
          initial={{ scaleY: 0 }} animate={chartPanel.inView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease }} style={{ transformOrigin: "226px 400px" }} />
        <motion.rect x="240" y="350" width="12" height="50" rx="1" transform="skewY(-30)" fill="#ff5533" opacity="0.8"
          initial={{ scaleY: 0 }} animate={chartPanel.inView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease }} style={{ transformOrigin: "246px 400px" }} />
        <motion.rect x="260" y="362" width="12" height="38" rx="1" transform="skewY(-30)" fill="#1e1f26" opacity="0.4"
          initial={{ scaleY: 0 }} animate={chartPanel.inView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.4, delay: 0.5, ease }} style={{ transformOrigin: "266px 400px" }} />
      </motion.g>

      {/* Connection lines */}
      <motion.g
        ref={connections.ref}
        initial={{ opacity: 0 }}
        animate={connections.inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, ease }}
      >
        <g stroke="#1e1f26" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.15">
          <line x1="420" y1="135" x2="420" y2="180" />
          <line x1="280" y1="190" x2="300" y2="250" />
          <line x1="580" y1="290" x2="620" y2="280" />
          <line x1="620" y1="280" x2="620" y2="350" />
          <line x1="220" y1="290" x2="180" y2="280" />
          <line x1="180" y1="280" x2="180" y2="340" />
        </g>
        <g fill="#1e1f26" opacity="0.2">
          <circle cx="620" cy="280" r="2.5" />
          <circle cx="180" cy="280" r="2.5" />
          <circle cx="620" cy="350" r="2.5" />
          <circle cx="180" cy="340" r="2.5" />
        </g>
      </motion.g>

      {/* Floating UI card */}
      <motion.g
        ref={uiCard.ref}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={uiCard.inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.7, ease }}
      >
        <motion.g
          animate={uiCard.inView ? { y: [0, -6, 0] } : {}}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <rect x="620" y="400" width="120" height="80" rx="6" fill="white" stroke="#1e1f26" strokeWidth="1" opacity="0.9" />
          <motion.line x1="635" y1="450" x2="725" y2="415" stroke="#ff5533" strokeWidth="1.5"
            initial={{ pathLength: 0 }} animate={uiCard.inView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }} />
          <rect x="635" y="410" width="40" height="4" rx="2" fill="#1e1f26" opacity="0.15" />
          <rect x="635" y="460" width="55" height="3" rx="1.5" fill="#1e1f26" opacity="0.1" />
          <rect x="635" y="468" width="35" height="3" rx="1.5" fill="#1e1f26" opacity="0.07" />
        </motion.g>
      </motion.g>

      {/* Typography element */}
      <motion.g
        ref={typo.ref}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={typo.inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.6, ease }}
      >
        <circle cx="560" cy="460" r="22" fill="white" stroke="#1e1f26" strokeWidth="1" />
        <text x="560" y="468" textAnchor="middle" fontFamily="serif" fontSize="24" fontWeight="700" fill="#1e1f26" opacity="0.8">A</text>
      </motion.g>

      {/* Pie chart */}
      <motion.g
        ref={pie.ref}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={pie.inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.6, delay: 0.1, ease }}
      >
        <circle cx="680" cy="500" r="18" fill="white" stroke="#1e1f26" strokeWidth="1" />
        <path d="M680 500 L680 482 A18 18 0 0 1 696 494 Z" fill="#1e1f26" opacity="0.7" />
        <path d="M680 500 L696 494 A18 18 0 0 1 688 516 Z" fill="#ff5533" opacity="0.6" />
      </motion.g>

      {/* Decorative elements */}
      <motion.g
        ref={dots.ref}
        initial={{ opacity: 0 }}
        animate={dots.inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, ease }}
      >
        <g fill="#1e1f26" opacity="0.12">
          <circle cx="620" cy="140" r="2" />
          <circle cx="635" cy="132" r="2" />
          <circle cx="620" cy="155" r="2" />
          <circle cx="635" cy="147" r="2" />
          <circle cx="650" cy="124" r="2" />
          <circle cx="650" cy="139" r="2" />
        </g>
        <rect x="150" y="220" width="16" height="16" fill="#1e1f26" opacity="0.08" transform="rotate(45 158 228)" />
        <circle cx="660" cy="200" r="8" fill="none" stroke="#1e1f26" strokeWidth="0.8" opacity="0.1" />
        <circle cx="660" cy="200" r="3" fill="#1e1f26" opacity="0.1" />
        <g transform="translate(640, 370) rotate(-30)">
          <rect x="0" y="0" width="6" height="40" rx="1" fill="#1e1f26" opacity="0.15" />
          <polygon points="0,40 6,40 3,48" fill="#1e1f26" opacity="0.15" />
        </g>
      </motion.g>

      {/* LED pulse */}
      <motion.circle
        cx="480" cy="250" r="10"
        fill="none" stroke="#ff5533" strokeWidth="0.5"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={lid.inView ? { opacity: [0, 0.4, 0], scale: [0.5, 1.8, 2.5] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
        style={{ transformOrigin: "480px 250px" }}
      />
    </svg>
  );
}

export function Hero() {
  const textRef = React.useRef(null);
  const textInView = useInView(textRef, { once: true, margin: "-60px" });
  const subtitleRef = React.useRef(null);
  const subtitleInView = useInView(subtitleRef, { once: true, margin: "-40px" });
  const ctaRef = React.useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-30px" });

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-16 items-center min-h-[100svh] pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 lg:pb-20">

          {/* Left — vertically centered */}
          <div>

            {/* Heading */}
            <h1
              ref={textRef}
              className="font-google-sans text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] xl:text-[3.85rem] font-bold text-dark leading-[1.05] tracking-[-0.035em]"
            >
              <span className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={textInView ? { y: 0 } : { y: "110%" }}
                  transition={{ duration: 0.9, ease }}
                >
                  Deploy faster.
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={textInView ? { y: 0 } : { y: "110%" }}
                  transition={{ duration: 0.9, delay: 0.06, ease }}
                >
                  Scale{" "}
                  <span className="text-dark/25 italic font-light font-[Georgia,_'Times_New_Roman',serif]">
                    without
                  </span>{" "}
                  limits.
                </motion.span>
              </span>
            </h1>

            {/* Subtitle */}
            <motion.p
              ref={subtitleRef}
              initial={{ opacity: 0, y: 8 }}
              animate={subtitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.7, delay: 0.05, ease }}
              className="font-outfit text-[14px] sm:text-[15px] text-dark-muted/70 leading-[1.7] mt-6 mb-10 max-w-[420px]"
            >
              Premium VPS & RDP servers with NVMe storage, dedicated resources, and instant provisioning across 6 global regions.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              ref={ctaRef}
              initial={{ opacity: 0, y: 10 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="flex items-center gap-3"
            >
              <GreenTrialButton
                href={routes.auth.signup}
                size="lg"
              >
                Sign up
              </GreenTrialButton>
              <FlipButton
                href={routes.pricing}
                variant="white"
                className="px-8 py-4 text-[13px] border border-dark/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
              >
                View pricing
              </FlipButton>
            </motion.div>
          </div>

          {/* Right — Illustration */}
          <div className="relative flex items-center justify-center">
            <div className="w-full max-w-[520px] lg:max-w-[580px] xl:max-w-[620px]">
              <IsometricIllustration />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

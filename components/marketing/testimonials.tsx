"use client";

import * as React from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Star, ArrowRight, Quote } from "lucide-react";
import Link from "next/link";
import { routes } from "@/lib/routes";

// Premium easing
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Animated counter component
function AnimatedCounter({ 
  value, 
  suffix = "", 
  decimals = 0 
}: { 
  value: number; 
  suffix?: string; 
  decimals?: number;
}) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (decimals > 0) {
      return latest.toFixed(decimals);
    }
    return Math.round(latest).toString();
  });
  const [displayValue, setDisplayValue] = React.useState("0");

  React.useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { 
        duration: 2,
        ease: [0.16, 1, 0.3, 1]
      });
      return controls.stop;
    }
  }, [isInView, value, count]);

  React.useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => setDisplayValue(latest));
    return unsubscribe;
  }, [rounded]);

  return (
    <span ref={ref}>
      {displayValue}{suffix}
    </span>
  );
}

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "CTO",
    company: "TechFlow",
    avatar: "https://i.pravatar.cc/150?img=1",
    text: "Layerium has been a game-changer for our infrastructure. The NVMe performance is incredible.",
    rating: 5,
  },
  {
    id: 2,
    name: "Marcus Weber",
    role: "DevOps Lead",
    company: "DataSync",
    avatar: "https://i.pravatar.cc/150?img=3",
    text: "We migrated from AWS and cut costs by 40% while improving performance significantly.",
    rating: 5,
  },
  {
    id: 3,
    name: "Ahmed Hassan",
    role: "Founder",
    company: "CloudPak",
    avatar: "https://i.pravatar.cc/150?img=4",
    text: "Finally, a cloud provider with local presence. Low latency made a huge difference for us.",
    rating: 5,
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    role: "Engineer",
    company: "ScaleUp",
    avatar: "https://i.pravatar.cc/150?img=5",
    text: "Instant deployment is exactly what we needed. Spinning up servers takes seconds.",
    rating: 5,
  },
  {
    id: 5,
    name: "James Liu",
    role: "CTO",
    company: "Nexus Labs",
    avatar: "https://i.pravatar.cc/150?img=7",
    text: "The DDoS protection alone is worth it. Zero downtime since switching to Layerium.",
    rating: 5,
  },
  {
    id: 6,
    name: "Priya Sharma",
    role: "Lead Dev",
    company: "Quantum",
    avatar: "https://i.pravatar.cc/150?img=9",
    text: "Best developer experience I've had with any cloud provider. Dashboard is blazing fast.",
    rating: 5,
  },
  {
    id: 7,
    name: "Alex Thompson",
    role: "SRE",
    company: "Fintech Co",
    avatar: "https://i.pravatar.cc/150?img=11",
    text: "99.99% uptime isn't just marketing speak here. Our monitoring confirms it daily.",
    rating: 5,
  },
  {
    id: 8,
    name: "Nina Patel",
    role: "VP Engineering",
    company: "StartupX",
    avatar: "https://i.pravatar.cc/150?img=16",
    text: "Scaled from 2 to 50 servers seamlessly. The API is well-documented and helpful.",
    rating: 5,
  },
];

// Minimal glassmorphism card - Framer inspired
function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="group relative w-[320px] shrink-0">
      <div className="relative h-full bg-white/[0.04] backdrop-blur-md rounded-[20px] border border-white/[0.06] p-6 hover:bg-white/[0.07] hover:border-white/[0.1] transition-all duration-400">
        {/* Quote icon */}
        <Quote className="w-8 h-8 text-white/10 mb-4" strokeWidth={1} />
        
        {/* Quote text */}
        <p className="font-outfit text-[15px] text-white/70 leading-relaxed mb-6">
          {testimonial.text}
        </p>

        {/* Author row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={testimonial.avatar} 
              alt={testimonial.name}
              className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10"
            />
            <div>
              <div className="font-dm-sans font-medium text-[13px] text-white/90">
                {testimonial.name}
              </div>
              <div className="font-outfit text-[11px] text-white/40">
                {testimonial.role}, {testimonial.company}
              </div>
            </div>
          </div>
          
          {/* Stars */}
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-primary/80 text-primary/80" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Infinite marquee
function TestimonialMarquee({ direction = "left", speed = 35 }: { direction?: "left" | "right"; speed?: number }) {
  const items = direction === "left" 
    ? [...testimonials.slice(0, 4), ...testimonials.slice(0, 4)]
    : [...testimonials.slice(4), ...testimonials.slice(4)];

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex gap-4"
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ 
          x: { 
            duration: speed, 
            repeat: Infinity, 
            ease: "linear",
          } 
        }}
      >
        {items.map((testimonial, i) => (
          <TestimonialCard key={`${testimonial.id}-${i}`} testimonial={testimonial} />
        ))}
      </motion.div>
    </div>
  );
}

export function Testimonials() {
  const headerRef = React.useRef(null);
  const isInView = useInView(headerRef, { once: true });

  return (
    <section className="relative bg-background">
      {/* Dark section with rounded top corners */}
      <div className="relative bg-dark rounded-t-[48px] lg:rounded-t-[64px] pt-20 lg:pt-28 pb-20 lg:pb-28 overflow-hidden">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full">
            <defs>
              <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Header */}
          <div ref={headerRef} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.06] rounded-full border border-white/[0.08] text-[11px] font-dm-sans font-semibold text-white/50 uppercase tracking-wider mb-5">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                Testimonials
              </span>
              
              <h2 className="text-[2.5rem] sm:text-5xl lg:text-[3.5rem] font-google-sans font-semibold text-white tracking-tight leading-[1.05]">
                Trusted by
                <br />
                <span className="text-white/30">developers.</span>
              </h2>
            </motion.div>
            
            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="flex items-center gap-8 lg:gap-12"
            >
              <div>
                <div className="font-work-sans font-bold text-3xl lg:text-4xl text-white">
                  <AnimatedCounter value={500} suffix="+" />
                </div>
                <div className="font-outfit text-xs text-white/40 mt-0.5">Customers</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="font-work-sans font-bold text-3xl lg:text-4xl text-white">
                  <AnimatedCounter value={4.9} decimals={1} />
                </div>
                <div className="font-outfit text-xs text-white/40 mt-0.5">Avg Rating</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="font-work-sans font-bold text-3xl lg:text-4xl text-white">
                  <AnimatedCounter value={99.99} suffix="%" decimals={2} />
                </div>
                <div className="font-outfit text-xs text-white/40 mt-0.5">Uptime</div>
              </div>
            </motion.div>
          </div>

          {/* Testimonial Marquees */}
          <div className="space-y-4 mb-16">
            {/* Fade masks */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-20 lg:w-32 bg-gradient-to-r from-dark to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 lg:w-32 bg-gradient-to-l from-dark to-transparent z-10 pointer-events-none" />
              <TestimonialMarquee direction="left" speed={40} />
            </div>
            
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-20 lg:w-32 bg-gradient-to-r from-dark to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 lg:w-32 bg-gradient-to-l from-dark to-transparent z-10 pointer-events-none" />
              <TestimonialMarquee direction="right" speed={45} />
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="text-center"
          >
            <Link
              href={routes.auth.signup}
              className="group inline-flex items-center gap-2.5 px-7 py-4 bg-white text-dark font-dm-sans text-[15px] font-semibold rounded-full hover:bg-primary hover:text-white transition-all duration-300"
            >
              Join 500+ Happy Customers
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

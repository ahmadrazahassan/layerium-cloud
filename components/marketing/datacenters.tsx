"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Globe } from "@/components/ui/globe";
import { GreenTrialButton } from "@/components/ui/flip-button";
import { Check } from "lucide-react";
import type { COBEOptions } from "cobe";

// Premium easing
const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const locations = [
  { 
    city: "New York", 
    country: "USA", 
    code: "us",
    latency: "12ms",
    coords: [40.7128, -74.006] as [number, number],
  },
  { 
    city: "Frankfurt", 
    country: "Germany", 
    code: "de",
    latency: "18ms",
    coords: [50.1109, 8.6821] as [number, number],
  },
  { 
    city: "Singapore", 
    country: "Singapore", 
    code: "sg",
    latency: "45ms",
    coords: [1.3521, 103.8198] as [number, number],
  },
  { 
    city: "Amsterdam", 
    country: "Netherlands", 
    code: "nl",
    latency: "15ms",
    coords: [52.3676, 4.9041] as [number, number],
  },
  { 
    city: "Dubai", 
    country: "UAE", 
    code: "ae",
    latency: "35ms",
    coords: [25.2048, 55.2708] as [number, number],
  },
  { 
    city: "Karachi", 
    country: "Pakistan", 
    code: "pk",
    latency: "8ms",
    coords: [24.8607, 67.0011] as [number, number],
  },
  { 
    city: "London", 
    country: "UK", 
    code: "gb",
    latency: "14ms",
    coords: [51.5074, -0.1278] as [number, number],
  },
  { 
    city: "Tokyo", 
    country: "Japan", 
    code: "jp",
    latency: "52ms",
    coords: [35.6762, 139.6503] as [number, number],
  },
  { 
    city: "Sydney", 
    country: "Australia", 
    code: "au",
    latency: "68ms",
    coords: [-33.8688, 151.2093] as [number, number],
  },
  { 
    city: "Toronto", 
    country: "Canada", 
    code: "ca",
    latency: "22ms",
    coords: [43.6532, -79.3832] as [number, number],
  },
  { 
    city: "Mumbai", 
    country: "India", 
    code: "in",
    latency: "28ms",
    coords: [19.076, 72.8777] as [number, number],
  },
  { 
    city: "São Paulo", 
    country: "Brazil", 
    code: "br",
    latency: "85ms",
    coords: [-23.5505, -46.6333] as [number, number],
  },
];

const features = [
  "Tier IV datacenters",
  "Redundant power",
  "24/7 monitoring",
  "DDoS protection",
];

// Custom globe config
const globeConfig: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [0.96, 0.96, 0.96],
  markerColor: [255 / 255, 85 / 255, 51 / 255],
  glowColor: [0.96, 0.96, 0.96],
  markers: locations.map(loc => ({
    location: loc.coords,
    size: 0.1,
  })),
};

function LocationCard({ 
  location, 
  index 
}: { 
  location: typeof locations[0]; 
  index: number;
}) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.6, delay: index * 0.05, ease }}
      whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.3, ease } }}
      className="group"
    >
      <div className="bg-white/60 backdrop-blur-xl rounded-[24px] border border-white/80 p-5 hover:bg-white/80 hover:shadow-card transition-all duration-400">
        <div className="flex items-center gap-3 mb-5">
          <img 
            src={`https://flagcdn.com/w40/${location.code}.png`}
            alt={location.country}
            className="w-10 h-7 object-cover rounded-md shadow-xs"
          />
          <div>
            <div className="font-dm-sans font-semibold text-dark text-[15px]">
              {location.city}
            </div>
            <div className="font-outfit text-xs text-dark-muted">
              {location.country}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.span 
              className="w-2 h-2 bg-success rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="font-outfit text-xs text-dark-muted">latency</span>
          </div>
          <span className="font-work-sans text-sm font-bold text-dark">
            {location.latency}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function Datacenters() {
  return (
    <section id="locations" className="py-28 lg:py-40 bg-surface-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-surface-1 rounded-full border border-border text-[13px] font-dm-sans font-medium text-dark-muted mb-5">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              datacenters
            </span>
            
            <h2 className="text-[2.5rem] sm:text-5xl lg:text-[3.5rem] font-google-sans font-semibold text-dark tracking-tight leading-[1.08] mb-5">
              Global infrastructure.
            </h2>
            
            <p className="font-outfit text-lg text-dark-muted leading-relaxed">
              deploy closer to your users with strategically located datacenters worldwide.
            </p>
          </motion.div>
        </div>

        {/* Globe Section */}
        <div className="relative mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative h-[350px] sm:h-[400px] lg:h-[500px] mx-auto max-w-2xl"
          >
            <Globe config={globeConfig} />
          </motion.div>
          
          {/* Stats overlay - Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-6 sm:gap-10 bg-white/70 backdrop-blur-xl rounded-full px-8 py-4 border border-white/50 shadow-elevated"
          >
            <div className="text-center">
              <div className="font-work-sans font-bold text-2xl sm:text-3xl text-dark">15+</div>
              <div className="font-outfit text-xs text-dark-muted">locations</div>
            </div>
            <div className="w-px h-10 bg-dark/10" />
            <div className="text-center">
              <div className="font-work-sans font-bold text-2xl sm:text-3xl text-dark">99.99%</div>
              <div className="font-outfit text-xs text-dark-muted">uptime</div>
            </div>
            <div className="w-px h-10 bg-dark/10" />
            <div className="text-center">
              <div className="font-work-sans font-bold text-2xl sm:text-3xl text-dark">&lt;50ms</div>
              <div className="font-outfit text-xs text-dark-muted">latency</div>
            </div>
          </motion.div>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-16">
          {locations.map((location, index) => (
            <LocationCard
              key={location.city}
              location={location}
              index={index}
            />
          ))}
        </div>

        {/* Features Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {features.map((feature) => (
            <span 
              key={feature}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-xl rounded-full border border-white/80 text-sm font-outfit text-dark"
            >
              <Check className="w-4 h-4 text-success" strokeWidth={2.5} />
              {feature}
            </span>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 text-center"
        >
          <GreenTrialButton href="#pricing" size="lg">
            Start Deploying Now
          </GreenTrialButton>
        </motion.div>
      </div>
    </section>
  );
}

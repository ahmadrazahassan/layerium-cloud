"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Monitor,
  Check,
  Shield,
  Tag,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Clock,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

// Types
type PlanType = "VPS" | "RDP";
type BillingPeriod = "monthly" | "quarterly" | "yearly";
type Step = 1 | 2 | 3 | 4 | 5;

interface Plan {
  id: string;
  name: string;
  type: PlanType;
  price: number;
  specs: { cpu: number; ram: number; storage: number; bandwidth: number };
  isPopular?: boolean;
}

interface Location {
  id: string;
  city: string;
  country: string;
  code: string;
  latency: string;
  available: boolean;
}

interface OSTemplate {
  id: string;
  name: string;
  version: string;
  family: "linux" | "windows";
  minRam: number;
}

// Data
const vpsPlans: Plan[] = [
  { id: "vps-starter", name: "Starter", type: "VPS", price: 5, specs: { cpu: 1, ram: 1, storage: 25, bandwidth: 1 } },
  { id: "vps-basic", name: "Basic", type: "VPS", price: 10, specs: { cpu: 2, ram: 2, storage: 50, bandwidth: 2 } },
  { id: "vps-standard", name: "Standard", type: "VPS", price: 20, specs: { cpu: 2, ram: 4, storage: 80, bandwidth: 3 }, isPopular: true },
  { id: "vps-pro", name: "Pro", type: "VPS", price: 40, specs: { cpu: 4, ram: 8, storage: 160, bandwidth: 4 } },
  { id: "vps-business", name: "Business", type: "VPS", price: 60, specs: { cpu: 6, ram: 16, storage: 240, bandwidth: 5 } },
  { id: "vps-enterprise", name: "Enterprise", type: "VPS", price: 100, specs: { cpu: 8, ram: 32, storage: 400, bandwidth: 8 } },
];

const rdpPlans: Plan[] = [
  { id: "rdp-basic", name: "Basic", type: "RDP", price: 15, specs: { cpu: 2, ram: 4, storage: 60, bandwidth: 2 } },
  { id: "rdp-standard", name: "Standard", type: "RDP", price: 30, specs: { cpu: 4, ram: 8, storage: 120, bandwidth: 3 }, isPopular: true },
  { id: "rdp-pro", name: "Pro", type: "RDP", price: 50, specs: { cpu: 6, ram: 12, storage: 200, bandwidth: 4 } },
  { id: "rdp-enterprise", name: "Enterprise", type: "RDP", price: 80, specs: { cpu: 8, ram: 16, storage: 320, bandwidth: 5 } },
];

const locations: Location[] = [
  { id: "us-ny", city: "New York", country: "USA", code: "us", latency: "12ms", available: true },
  { id: "us-la", city: "Los Angeles", country: "USA", code: "us", latency: "18ms", available: true },
  { id: "ca-to", city: "Toronto", country: "Canada", code: "ca", latency: "22ms", available: true },
  { id: "br-sp", city: "São Paulo", country: "Brazil", code: "br", latency: "85ms", available: true },
  { id: "gb-lo", city: "London", country: "UK", code: "gb", latency: "14ms", available: true },
  { id: "de-fr", city: "Frankfurt", country: "Germany", code: "de", latency: "18ms", available: true },
  { id: "nl-am", city: "Amsterdam", country: "Netherlands", code: "nl", latency: "15ms", available: true },
  { id: "fr-pa", city: "Paris", country: "France", code: "fr", latency: "16ms", available: true },
  { id: "ae-du", city: "Dubai", country: "UAE", code: "ae", latency: "35ms", available: true },
  { id: "pk-ka", city: "Karachi", country: "Pakistan", code: "pk", latency: "8ms", available: true },
  { id: "in-mu", city: "Mumbai", country: "India", code: "in", latency: "28ms", available: true },
  { id: "sg-sg", city: "Singapore", country: "Singapore", code: "sg", latency: "45ms", available: true },
  { id: "jp-to", city: "Tokyo", country: "Japan", code: "jp", latency: "52ms", available: false },
  { id: "au-sy", city: "Sydney", country: "Australia", code: "au", latency: "68ms", available: true },
  { id: "kr-se", city: "Seoul", country: "South Korea", code: "kr", latency: "48ms", available: true },
];

const linuxTemplates: OSTemplate[] = [
  { id: "ubuntu-24.04", name: "Ubuntu", version: "24.04 LTS", family: "linux", minRam: 1 },
  { id: "ubuntu-22.04", name: "Ubuntu", version: "22.04 LTS", family: "linux", minRam: 1 },
  { id: "debian-12", name: "Debian", version: "12", family: "linux", minRam: 1 },
  { id: "centos-9", name: "CentOS", version: "Stream 9", family: "linux", minRam: 1 },
  { id: "rocky-9", name: "Rocky Linux", version: "9", family: "linux", minRam: 1 },
  { id: "almalinux-9", name: "AlmaLinux", version: "9", family: "linux", minRam: 1 },
];

const windowsTemplates: OSTemplate[] = [
  { id: "windows-2022", name: "Windows Server", version: "2022", family: "windows", minRam: 4 },
  { id: "windows-2019", name: "Windows Server", version: "2019", family: "windows", minRam: 4 },
  { id: "windows-11", name: "Windows 11", version: "Pro", family: "windows", minRam: 4 },
  { id: "windows-10", name: "Windows 10", version: "Pro", family: "windows", minRam: 2 },
];

const billingOptions = [
  { id: "monthly" as BillingPeriod, label: "Monthly", shortLabel: "1 Month", discount: 0, months: 1, desc: "Pay as you go" },
  { id: "quarterly" as BillingPeriod, label: "Quarterly", shortLabel: "3 Months", discount: 5, months: 3, desc: "Save 5%" },
  { id: "yearly" as BillingPeriod, label: "Annual", shortLabel: "12 Months", discount: 15, months: 12, desc: "Best value" },
];

const stepLabels = ["Type", "Plan", "Region", "System", "Checkout"];

// OS Logo Components
const UbuntuLogo = () => (
  <svg viewBox="0 0 256 256" className="w-8 h-8">
    <circle cx="128" cy="128" r="128" fill="#E95420"/>
    <g fill="#fff">
      <circle cx="128" cy="36" r="16"/>
      <circle cx="48" cy="176" r="16"/>
      <circle cx="208" cy="176" r="16"/>
    </g>
    <circle cx="128" cy="128" r="40" fill="none" stroke="#fff" strokeWidth="12"/>
  </svg>
);

const DebianLogo = () => (
  <svg viewBox="0 0 256 256" className="w-8 h-8">
    <circle cx="128" cy="128" r="128" fill="#A81D33"/>
    <path fill="#fff" d="M128 60c37 0 68 31 68 68s-31 68-68 68-68-31-68-68 31-68 68-68zm0 20c-26 0-48 22-48 48s22 48 48 48 48-22 48-48-22-48-48-48z"/>
  </svg>
);

const RockyLogo = () => (
  <svg viewBox="0 0 256 256" className="w-8 h-8">
    <circle cx="128" cy="128" r="128" fill="#10B981"/>
    <path fill="#fff" d="M128 56c40 0 72 32 72 72s-32 72-72 72-72-32-72-72 32-72 72-72zm0 24c-26 0-48 22-48 48s22 48 48 48 48-22 48-48-22-48-48-48z"/>
  </svg>
);

const AlmaLinuxLogo = () => (
  <svg viewBox="0 0 256 256" className="w-8 h-8">
    <circle cx="128" cy="128" r="128" fill="#0F4266"/>
    <path fill="#FF6600" d="M128 48l64 37v74l-64 37-64-37V85l64-37z"/>
    <path fill="#fff" d="M128 80l32 18v37l-32 18-32-18v-37l32-18z"/>
  </svg>
);

const WindowsLogo = () => (
  <svg viewBox="0 0 256 256" className="w-8 h-8">
    <rect width="256" height="256" rx="40" fill="#00ADEF"/>
    <path fill="#fff" d="M40 72l72-10v66H40V72zm0 112V118h72v66l-72-10zm80-122l88-12v78h-88V62zm0 132V140h88v78l-88-12z"/>
  </svg>
);

const getOSLogo = (id: string) => {
  if (id.includes("ubuntu")) return <UbuntuLogo />;
  if (id.includes("debian")) return <DebianLogo />;
  if (id.includes("centos") || id.includes("rocky")) return <RockyLogo />;
  if (id.includes("alma")) return <AlmaLinuxLogo />;
  if (id.includes("windows")) return <WindowsLogo />;
  return <Server className="w-8 h-8 text-dark-muted" />;
};

// Modern Horizontal Pill Step Navigator
function StepNavigator({ currentStep, onStepClick }: { currentStep: Step; onStepClick: (step: Step) => void }) {
  return (
    <div className="flex justify-center mb-12">
      <div className="inline-flex items-center gap-1 p-1.5 bg-surface-1 rounded-full border border-border">
        {stepLabels.map((label, i) => {
          const stepNum = (i + 1) as Step;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;
          const isClickable = stepNum <= currentStep;
          
          return (
            <button
              key={label}
              onClick={() => isClickable && onStepClick(stepNum)}
              disabled={!isClickable}
              className={cn(
                "relative flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-dm-sans text-sm font-semibold transition-all duration-300",
                isActive && "text-white",
                isCompleted && "text-dark cursor-pointer hover:bg-surface-2",
                !isActive && !isCompleted && "text-dark-muted/40 cursor-not-allowed"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeStepBg"
                  className="absolute inset-0 bg-dark rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className={cn(
                "relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                isActive && "bg-white/20 text-white",
                isCompleted && "bg-emerald-500 text-white",
                !isActive && !isCompleted && "bg-dark/5 text-dark-muted/40"
              )}>
                {isCompleted ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : stepNum}
              </span>
              <span className="relative z-10 hidden sm:block">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Step 1: Server Type
function Step1({ selected, onSelect }: { selected: PlanType | null; onSelect: (type: PlanType) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-10">
        <h2 className="font-google-sans font-semibold text-3xl sm:text-4xl text-dark mb-2">
          Choose server type
        </h2>
        <p className="font-outfit text-dark-muted">
          Select the type of server you want to deploy
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <motion.button
          onClick={() => onSelect("VPS")}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "relative p-7 rounded-[32px] border-2 text-left transition-all duration-300",
            selected === "VPS"
              ? "border-blue-500 bg-blue-500"
              : "border-border bg-white hover:border-blue-300"
          )}
        >
          <div className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center mb-5",
            selected === "VPS" ? "bg-white/20" : "bg-blue-500/10"
          )}>
            <Server className={cn("w-6 h-6", selected === "VPS" ? "text-white" : "text-blue-500")} />
          </div>
          <h3 className={cn(
            "font-google-sans font-semibold text-xl mb-1.5",
            selected === "VPS" ? "text-white" : "text-dark"
          )}>
            VPS Server
          </h3>
          <p className={cn(
            "font-outfit text-sm mb-4",
            selected === "VPS" ? "text-white/70" : "text-dark-muted"
          )}>
            Linux virtual private server with full root access
          </p>
          <div className={cn(
            "inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-work-sans font-bold text-sm",
            selected === "VPS" ? "bg-white/20 text-white" : "bg-blue-500/10 text-blue-600"
          )}>
            From $5/mo
          </div>
          {selected === "VPS" && (
            <div className="absolute top-5 right-5 w-7 h-7 bg-white rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-blue-500" strokeWidth={3} />
            </div>
          )}
        </motion.button>

        <motion.button
          onClick={() => onSelect("RDP")}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "relative p-7 rounded-[32px] border-2 text-left transition-all duration-300",
            selected === "RDP"
              ? "border-purple-500 bg-purple-500"
              : "border-border bg-white hover:border-purple-300"
          )}
        >
          <div className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center mb-5",
            selected === "RDP" ? "bg-white/20" : "bg-purple-500/10"
          )}>
            <Monitor className={cn("w-6 h-6", selected === "RDP" ? "text-white" : "text-purple-500")} />
          </div>
          <h3 className={cn(
            "font-google-sans font-semibold text-xl mb-1.5",
            selected === "RDP" ? "text-white" : "text-dark"
          )}>
            RDP Server
          </h3>
          <p className={cn(
            "font-outfit text-sm mb-4",
            selected === "RDP" ? "text-white/70" : "text-dark-muted"
          )}>
            Windows remote desktop with full GUI access
          </p>
          <div className={cn(
            "inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-work-sans font-bold text-sm",
            selected === "RDP" ? "bg-white/20 text-white" : "bg-purple-500/10 text-purple-600"
          )}>
            From $15/mo
          </div>
          {selected === "RDP" && (
            <div className="absolute top-5 right-5 w-7 h-7 bg-white rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-purple-500" strokeWidth={3} />
            </div>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

// Step 2: Plan Selection
function Step2({ serverType, selected, onSelect }: { serverType: PlanType; selected: Plan | null; onSelect: (plan: Plan) => void }) {
  const plans = serverType === "VPS" ? vpsPlans : rdpPlans;
  const accentColor = serverType === "VPS" ? "blue" : "purple";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-10">
        <h2 className="font-google-sans font-semibold text-3xl sm:text-4xl text-dark mb-2">
          Select your plan
        </h2>
        <p className="font-outfit text-dark-muted">
          Choose the resources that fit your needs
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {plans.map((plan, i) => (
          <motion.button
            key={plan.id}
            onClick={() => onSelect(plan)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "relative p-5 rounded-[28px] border-2 text-left transition-all duration-300",
              selected?.id === plan.id
                ? "border-dark bg-dark"
                : "border-border bg-white hover:border-dark/30"
            )}
          >
            {plan.isPopular && (
              <span className={cn(
                "absolute -top-2.5 left-5 px-3 py-1 text-white text-[10px] font-dm-sans font-bold rounded-full uppercase",
                accentColor === "blue" ? "bg-blue-500" : "bg-purple-500"
              )}>
                Popular
              </span>
            )}
            
            <div className="flex items-center justify-between mb-4">
              <h3 className={cn(
                "font-google-sans font-semibold text-lg",
                selected?.id === plan.id ? "text-white" : "text-dark"
              )}>
                {plan.name}
              </h3>
              {selected?.id === plan.id && (
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </div>
              )}
            </div>

            <div className="flex items-baseline gap-1 mb-4">
              <span className={cn(
                "font-work-sans font-bold text-2xl",
                selected?.id === plan.id ? "text-white" : "text-dark"
              )}>
                ${plan.price}
              </span>
              <span className={cn(
                "font-outfit text-sm",
                selected?.id === plan.id ? "text-white/50" : "text-dark-muted"
              )}>
                /mo
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "vCPU", value: plan.specs.cpu },
                { label: "RAM", value: `${plan.specs.ram}GB` },
                { label: "NVMe", value: `${plan.specs.storage}GB` },
                { label: "BW", value: `${plan.specs.bandwidth}TB` },
              ].map((spec) => (
                <div key={spec.label} className={cn(
                  "px-3 py-2 rounded-full text-center",
                  selected?.id === plan.id ? "bg-white/10" : "bg-surface-1"
                )}>
                  <div className={cn(
                    "font-work-sans font-bold text-sm",
                    selected?.id === plan.id ? "text-white" : "text-dark"
                  )}>
                    {spec.value}
                  </div>
                  <div className={cn(
                    "font-outfit text-[10px] uppercase",
                    selected?.id === plan.id ? "text-white/50" : "text-dark-muted"
                  )}>
                    {spec.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// Step 3: Location
function Step3({ selected, onSelect }: { selected: Location | null; onSelect: (loc: Location) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-10">
        <h2 className="font-google-sans font-semibold text-3xl sm:text-4xl text-dark mb-2">
          Choose datacenter
        </h2>
        <p className="font-outfit text-dark-muted">
          Deploy closer to your users for best performance
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
        {locations.map((loc, i) => (
          <motion.button
            key={loc.id}
            onClick={() => loc.available && onSelect(loc)}
            disabled={!loc.available}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
            whileHover={loc.available ? { scale: 1.03 } : {}}
            whileTap={loc.available ? { scale: 0.97 } : {}}
            className={cn(
              "relative p-4 rounded-[20px] border-2 text-center transition-all duration-200",
              !loc.available && "opacity-40 cursor-not-allowed",
              selected?.id === loc.id
                ? "border-dark bg-dark"
                : "border-border bg-white hover:border-dark/30"
            )}
          >
            {!loc.available && (
              <span className="absolute top-1.5 right-1.5 px-2 py-0.5 bg-dark/80 text-white text-[8px] font-dm-sans font-bold rounded-full">
                Soon
              </span>
            )}
            
            <img 
              src={`https://flagcdn.com/w80/${loc.code}.png`}
              alt={loc.country}
              className="w-10 h-7 object-cover rounded-lg mx-auto mb-2"
            />
            <div className={cn(
              "font-dm-sans font-semibold text-sm",
              selected?.id === loc.id ? "text-white" : "text-dark"
            )}>
              {loc.city}
            </div>
            <div className={cn(
              "font-outfit text-[10px]",
              selected?.id === loc.id ? "text-white/50" : "text-dark-muted"
            )}>
              {loc.latency}
            </div>
            
            {selected?.id === loc.id && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// Step 4: System
function Step4({ 
  serverType, 
  selectedPlan,
  selectedOS, 
  onSelectOS, 
  hostname, 
  onHostnameChange 
}: { 
  serverType: PlanType;
  selectedPlan: Plan | null;
  selectedOS: OSTemplate | null; 
  onSelectOS: (os: OSTemplate) => void;
  hostname: string;
  onHostnameChange: (v: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-10">
        <h2 className="font-google-sans font-semibold text-3xl sm:text-4xl text-dark mb-2">
          Configure system
        </h2>
        <p className="font-outfit text-dark-muted">
          Select OS and set your hostname
        </p>
      </div>

      {/* OS Selection */}
      <div className="mb-8">
        {serverType === "VPS" && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 bg-[#E95420] rounded-full" />
              <span className="font-dm-sans font-semibold text-dark">Linux</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {linuxTemplates.map((os) => {
                const disabled = selectedPlan ? os.minRam > selectedPlan.specs.ram : false;
                return (
                  <motion.button
                    key={os.id}
                    onClick={() => !disabled && onSelectOS(os)}
                    disabled={disabled}
                    whileHover={!disabled ? { scale: 1.03 } : {}}
                    whileTap={!disabled ? { scale: 0.97 } : {}}
                    className={cn(
                      "relative p-4 rounded-[20px] border-2 text-center transition-all",
                      disabled && "opacity-30 cursor-not-allowed",
                      selectedOS?.id === os.id
                        ? "border-dark bg-dark"
                        : "border-border bg-white hover:border-dark/30"
                    )}
                  >
                    <div className="flex justify-center mb-2">{getOSLogo(os.id)}</div>
                    <div className={cn(
                      "font-dm-sans font-semibold text-xs",
                      selectedOS?.id === os.id ? "text-white" : "text-dark"
                    )}>
                      {os.name}
                    </div>
                    <div className={cn(
                      "font-outfit text-[10px]",
                      selectedOS?.id === os.id ? "text-white/50" : "text-dark-muted"
                    )}>
                      {os.version}
                    </div>
                    {selectedOS?.id === os.id && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 bg-[#00ADEF] rounded-full" />
            <span className="font-dm-sans font-semibold text-dark">Windows</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {windowsTemplates.map((os) => {
              const disabled = selectedPlan ? os.minRam > selectedPlan.specs.ram : false;
              return (
                <motion.button
                  key={os.id}
                  onClick={() => !disabled && onSelectOS(os)}
                  disabled={disabled}
                  whileHover={!disabled ? { scale: 1.03 } : {}}
                  whileTap={!disabled ? { scale: 0.97 } : {}}
                  className={cn(
                    "relative p-4 rounded-[20px] border-2 text-center transition-all",
                    disabled && "opacity-30 cursor-not-allowed",
                    selectedOS?.id === os.id
                      ? "border-dark bg-dark"
                      : "border-border bg-white hover:border-dark/30"
                  )}
                >
                  <div className="flex justify-center mb-2">{getOSLogo(os.id)}</div>
                  <div className={cn(
                    "font-dm-sans font-semibold text-xs",
                    selectedOS?.id === os.id ? "text-white" : "text-dark"
                  )}>
                    {os.name}
                  </div>
                  <div className={cn(
                    "font-outfit text-[10px]",
                    selectedOS?.id === os.id ? "text-white/50" : "text-dark-muted"
                  )}>
                    {os.version}
                  </div>
                  {selectedOS?.id === os.id && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hostname */}
      <div className="bg-white rounded-[24px] border-2 border-border p-5 max-w-md">
        <label className="block font-dm-sans font-semibold text-dark mb-2">Hostname</label>
        <input
          type="text"
          value={hostname}
          onChange={(e) => onHostnameChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
          placeholder="my-server"
          className="w-full h-12 px-5 bg-surface-1 border-2 border-border rounded-full font-mono text-dark placeholder:text-dark-muted/40 focus:outline-none focus:border-dark transition-all"
        />
        <p className="font-outfit text-xs text-dark-muted mt-2 pl-2">
          Lowercase letters, numbers, hyphens. Min 3 characters.
        </p>
      </div>
    </motion.div>
  );
}

// Premium Billing Period Selector
function BillingPeriodSelector({ 
  plan,
  billingPeriod, 
  setBillingPeriod 
}: { 
  plan: Plan;
  billingPeriod: BillingPeriod; 
  setBillingPeriod: (p: BillingPeriod) => void;
}) {
  return (
    <div className="space-y-3">
      {billingOptions.map((opt) => {
        const isSelected = billingPeriod === opt.id;
        const totalPrice = plan.price * opt.months;
        const discountedPrice = totalPrice * (1 - opt.discount / 100);
        const savings = totalPrice - discountedPrice;
        
        return (
          <motion.button
            key={opt.id}
            onClick={() => setBillingPeriod(opt.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
              "relative w-full flex items-center justify-between p-4 rounded-[20px] border-2 transition-all duration-300 text-left",
              isSelected
                ? "border-dark bg-dark"
                : "border-border bg-white hover:border-dark/30"
            )}
          >
            {/* Left side */}
            <div className="flex items-center gap-4">
              {/* Radio indicator */}
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                isSelected ? "border-primary bg-primary" : "border-dark/20"
              )}>
                {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-dm-sans font-semibold",
                    isSelected ? "text-white" : "text-dark"
                  )}>
                    {opt.label}
                  </span>
                  {opt.discount > 0 && (
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-dm-sans font-bold",
                      isSelected ? "bg-emerald-500 text-white" : "bg-emerald-500/10 text-emerald-600"
                    )}>
                      <Percent className="w-2.5 h-2.5" />
                      {opt.discount}% OFF
                    </span>
                  )}
                </div>
                <span className={cn(
                  "font-outfit text-xs",
                  isSelected ? "text-white/60" : "text-dark-muted"
                )}>
                  {opt.desc}
                </span>
              </div>
            </div>

            {/* Right side - Price */}
            <div className="text-right">
              <div className={cn(
                "font-work-sans font-bold text-lg",
                isSelected ? "text-white" : "text-dark"
              )}>
                ${discountedPrice.toFixed(2)}
              </div>
              {opt.discount > 0 && (
                <div className={cn(
                  "font-outfit text-xs",
                  isSelected ? "text-emerald-400" : "text-emerald-600"
                )}>
                  Save ${savings.toFixed(2)}
                </div>
              )}
            </div>

            {/* Best value badge */}
            {opt.id === "yearly" && (
              <div className={cn(
                "absolute -top-2.5 right-4 px-3 py-1 rounded-full text-[10px] font-dm-sans font-bold uppercase",
                isSelected ? "bg-primary text-white" : "bg-primary text-white"
              )}>
                Best Value
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// Step 5: Checkout
function Step5({ 
  serverType, plan, location, os, hostname,
  billingPeriod, setBillingPeriod,
  promoCode, setPromoCode, promoDiscount, validatePromo, promoLoading, promoError, promoSuccess,
  onSubmit, isSubmitting
}: { 
  serverType: PlanType; plan: Plan; location: Location; os: OSTemplate; hostname: string;
  billingPeriod: BillingPeriod; setBillingPeriod: (p: BillingPeriod) => void;
  promoCode: string; setPromoCode: (c: string) => void; promoDiscount: number;
  validatePromo: () => void; promoLoading: boolean; promoError: string; promoSuccess: boolean;
  onSubmit: () => void; isSubmitting: boolean;
}) {
  const period = billingOptions.find(p => p.id === billingPeriod)!;
  const subtotal = plan.price * period.months;
  const periodDiscount = subtotal * (period.discount / 100);
  const promoAmount = (subtotal - periodDiscount) * (promoDiscount / 100);
  const total = subtotal - periodDiscount - promoAmount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-10">
        <h2 className="font-google-sans font-semibold text-3xl sm:text-4xl text-dark mb-2">
          Complete order
        </h2>
        <p className="font-outfit text-dark-muted">
          Review and finalize your deployment
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Configuration */}
        <div className="lg:col-span-3 space-y-5">
          {/* Server Summary Card */}
          <div className="bg-white rounded-[24px] border-2 border-border p-5">
            <div className="flex items-center gap-4 mb-5">
              <div className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center",
                serverType === "VPS" ? "bg-blue-500/10" : "bg-purple-500/10"
              )}>
                {serverType === "VPS" ? (
                  <Server className="w-6 h-6 text-blue-500" />
                ) : (
                  <Monitor className="w-6 h-6 text-purple-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-google-sans font-semibold text-lg text-dark">{serverType} {plan.name}</div>
                <div className="font-work-sans font-bold text-primary">${plan.price}/mo</div>
              </div>
              <span className={cn(
                "px-3 py-1.5 rounded-full text-xs font-dm-sans font-bold uppercase",
                serverType === "VPS" ? "bg-blue-500/10 text-blue-600" : "bg-purple-500/10 text-purple-600"
              )}>
                {serverType}
              </span>
            </div>
            
            {/* Specs Pills */}
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                { label: "vCPU", value: plan.specs.cpu },
                { label: "RAM", value: `${plan.specs.ram}GB` },
                { label: "NVMe", value: `${plan.specs.storage}GB` },
                { label: "Bandwidth", value: `${plan.specs.bandwidth}TB` },
              ].map((spec) => (
                <div key={spec.label} className="inline-flex items-center gap-2 px-4 py-2 bg-surface-1 rounded-full">
                  <span className="font-outfit text-xs text-dark-muted">{spec.label}</span>
                  <span className="font-work-sans font-bold text-sm text-dark">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2.5 px-4 bg-surface-1 rounded-full">
                <span className="font-outfit text-sm text-dark-muted">Location</span>
                <div className="flex items-center gap-2">
                  <img src={`https://flagcdn.com/w40/${location.code}.png`} alt="" className="w-5 h-3.5 rounded" />
                  <span className="font-dm-sans font-semibold text-sm text-dark">{location.city}</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2.5 px-4 bg-surface-1 rounded-full">
                <span className="font-outfit text-sm text-dark-muted">Operating System</span>
                <span className="font-dm-sans font-semibold text-sm text-dark">{os.name} {os.version}</span>
              </div>
              <div className="flex items-center justify-between py-2.5 px-4 bg-surface-1 rounded-full">
                <span className="font-outfit text-sm text-dark-muted">Hostname</span>
                <span className="font-mono font-semibold text-sm text-dark">{hostname}</span>
              </div>
            </div>
          </div>

          {/* Billing Period - Premium Design */}
          <div className="bg-white rounded-[24px] border-2 border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="font-dm-sans font-semibold text-dark">Billing Period</div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-dm-sans font-semibold">
                Save up to 15%
              </span>
            </div>
            <BillingPeriodSelector plan={plan} billingPeriod={billingPeriod} setBillingPeriod={setBillingPeriod} />
          </div>

          {/* Promo Code */}
          <div className="bg-white rounded-[24px] border-2 border-border p-5">
            <div className="font-dm-sans font-semibold text-dark mb-4">Promo Code</div>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  className="w-full h-12 pl-11 pr-4 bg-surface-1 border-2 border-border rounded-full font-mono text-sm text-dark placeholder:text-dark-muted/40 focus:outline-none focus:border-dark transition-all"
                />
              </div>
              <button
                onClick={validatePromo}
                disabled={promoLoading || !promoCode}
                className="px-6 h-12 bg-dark hover:bg-primary disabled:bg-dark/30 text-white rounded-full font-dm-sans font-semibold text-sm transition-all"
              >
                {promoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
              </button>
            </div>
            {promoError && (
              <p className="flex items-center gap-1.5 mt-3 text-red-500 text-sm font-outfit pl-2">
                <AlertCircle className="w-3.5 h-3.5" /> {promoError}
              </p>
            )}
            {promoSuccess && (
              <p className="flex items-center gap-1.5 mt-3 text-emerald-600 text-sm font-outfit pl-2">
                <Check className="w-3.5 h-3.5" /> {promoDiscount}% discount applied!
              </p>
            )}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-dark rounded-[24px] p-6 text-white sticky top-6">
            <div className="font-google-sans font-semibold text-xl mb-6">Order Summary</div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-outfit text-white/60">{plan.name} Plan</span>
                <span className="font-work-sans font-semibold">${plan.price}/mo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-outfit text-white/60">Duration</span>
                <span className="font-work-sans font-semibold">{period.months} month{period.months > 1 ? "s" : ""}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-outfit text-white/60">Subtotal</span>
                <span className="font-work-sans font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              {period.discount > 0 && (
                <div className="flex justify-between items-center text-emerald-400">
                  <span className="font-outfit">Period Discount ({period.discount}%)</span>
                  <span className="font-work-sans font-semibold">-${periodDiscount.toFixed(2)}</span>
                </div>
              )}
              {promoDiscount > 0 && (
                <div className="flex justify-between items-center text-emerald-400">
                  <span className="font-outfit">Promo ({promoDiscount}%)</span>
                  <span className="font-work-sans font-semibold">-${promoAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="h-px bg-white/20 mb-6" />

            <div className="flex justify-between items-center mb-6">
              <span className="font-dm-sans font-semibold text-lg">Total</span>
              <div className="text-right">
                <span className="font-work-sans font-bold text-3xl">${total.toFixed(2)}</span>
                {period.months > 1 && (
                  <div className="font-outfit text-xs text-white/50">
                    ${(total / period.months).toFixed(2)}/mo effective
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white rounded-full font-dm-sans font-semibold transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Complete Order <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-5 mt-5">
              <div className="flex items-center gap-1.5 text-white/50 text-xs font-outfit">
                <Shield className="w-3.5 h-3.5" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/50 text-xs font-outfit">
                <Clock className="w-3.5 h-3.5" />
                <span>Instant Deploy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Main Page
export default function DeployPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planParam = searchParams.get("plan");

  const [step, setStep] = React.useState<Step>(1);
  const [serverType, setServerType] = React.useState<PlanType | null>(null);
  const [selectedPlan, setSelectedPlan] = React.useState<Plan | null>(null);
  const [selectedLocation, setSelectedLocation] = React.useState<Location | null>(null);
  const [selectedOS, setSelectedOS] = React.useState<OSTemplate | null>(null);
  const [hostname, setHostname] = React.useState("");
  const [billingPeriod, setBillingPeriod] = React.useState<BillingPeriod>("monthly");
  const [promoCode, setPromoCode] = React.useState("");
  const [promoDiscount, setPromoDiscount] = React.useState(0);
  const [promoError, setPromoError] = React.useState("");
  const [promoLoading, setPromoLoading] = React.useState(false);
  const [promoSuccess, setPromoSuccess] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (planParam) {
      const allPlans = [...vpsPlans, ...rdpPlans];
      const plan = allPlans.find(p => p.id === planParam);
      if (plan) {
        setServerType(plan.type);
        setSelectedPlan(plan);
        setStep(3);
      }
    }
  }, [planParam]);

  const validatePromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError("");
    setPromoSuccess(false);
    await new Promise(r => setTimeout(r, 800));
    const code = promoCode.toUpperCase();
    if (code === "WELCOME10") { setPromoDiscount(10); setPromoSuccess(true); }
    else if (code === "SAVE20") { setPromoDiscount(20); setPromoSuccess(true); }
    else { setPromoError("Invalid promo code"); setPromoDiscount(0); }
    setPromoLoading(false);
  };

  const handleSubmit = async () => {
    if (!selectedPlan || !selectedLocation || !selectedOS || hostname.length < 3) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    router.push(routes.dashboard.servers.list);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!serverType;
      case 2: return !!selectedPlan;
      case 3: return !!selectedLocation;
      case 4: return !!selectedOS && hostname.length >= 3;
      case 5: return true;
      default: return false;
    }
  };

  const nextStep = () => { if (canProceed() && step < 5) setStep((step + 1) as Step); };
  const prevStep = () => { if (step > 1) setStep((step - 1) as Step); };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <p className="font-outfit text-dark-muted mb-2">Deploy Server</p>
        <h1 className="font-google-sans font-semibold text-4xl sm:text-5xl text-dark tracking-tight">
          Launch your server
        </h1>
      </motion.div>

      {/* Horizontal Pill Step Navigator */}
      <StepNavigator currentStep={step} onStepClick={setStep} />

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <Step1 key="s1" selected={serverType} onSelect={(t) => { setServerType(t); setSelectedPlan(null); setSelectedOS(null); }} />
          )}
          {step === 2 && serverType && (
            <Step2 key="s2" serverType={serverType} selected={selectedPlan} onSelect={setSelectedPlan} />
          )}
          {step === 3 && (
            <Step3 key="s3" selected={selectedLocation} onSelect={setSelectedLocation} />
          )}
          {step === 4 && serverType && (
            <Step4 key="s4" serverType={serverType} selectedPlan={selectedPlan} selectedOS={selectedOS} onSelectOS={setSelectedOS} hostname={hostname} onHostnameChange={setHostname} />
          )}
          {step === 5 && selectedPlan && selectedLocation && selectedOS && serverType && (
            <Step5
              key="s5"
              serverType={serverType}
              plan={selectedPlan}
              location={selectedLocation}
              os={selectedOS}
              hostname={hostname}
              billingPeriod={billingPeriod}
              setBillingPeriod={setBillingPeriod}
              promoCode={promoCode}
              setPromoCode={(c) => { setPromoCode(c); setPromoError(""); setPromoSuccess(false); setPromoDiscount(0); }}
              promoDiscount={promoDiscount}
              validatePromo={validatePromo}
              promoLoading={promoLoading}
              promoError={promoError}
              promoSuccess={promoSuccess}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-4 mt-12"
        >
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={cn(
              "flex items-center gap-2 px-6 py-3.5 rounded-full font-dm-sans font-semibold text-sm transition-all",
              step === 1 
                ? "text-dark-muted/30 cursor-not-allowed" 
                : "bg-surface-1 text-dark hover:bg-surface-2 border border-border"
            )}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {step < 5 && (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={cn(
                "flex items-center gap-2 px-8 py-3.5 rounded-full font-dm-sans font-semibold transition-all",
                canProceed()
                  ? "bg-dark hover:bg-primary text-white"
                  : "bg-dark/20 text-dark/30 cursor-not-allowed"
              )}
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}

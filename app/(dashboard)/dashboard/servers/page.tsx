"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Server,
  Plus,
  Search,
  Play,
  Square,
  RotateCcw,
  Copy,
  Check,
  ArrowRight,
  Terminal,
  Trash2,
  Cpu,
  Gauge,
  HardDrive,
  Globe,
  Shield,
  Key,
  Download,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import { getUserServers, performServerAction } from "@/lib/data/servers";
import type { ServerWithPlan, ServerStatus } from "@/types/database";

// OS Icons
const WindowsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <path fill="#00ADEF" d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
  </svg>
);

const UbuntuIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <circle cx="12" cy="12" r="12" fill="#E95420"/>
    <circle cx="12" cy="5.5" r="2" fill="white"/>
    <circle cx="6" cy="15" r="2" fill="white"/>
    <circle cx="18" cy="15" r="2" fill="white"/>
    <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="1.5"/>
  </svg>
);

const DebianIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <circle cx="12" cy="12" r="11" fill="#A81D33"/>
    <path fill="white" d="M13.5 6c1.5.5 2.5 2 2.5 3.5 0 2-1.5 3.5-3.5 3.5S9 11.5 9 9.5c0-1.5 1-3 2.5-3.5m1 1c-.8.3-1.5 1.2-1.5 2.5 0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5c0-1.3-.7-2.2-1.5-2.5"/>
  </svg>
);

const CentOSIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6">
    <path fill="#932279" d="M12 0L0 6.9v10.2L12 24V12L0 5.1"/>
    <path fill="#EFA724" d="M12 0l12 6.9L12 12V0"/>
    <path fill="#9CCD2A" d="M24 6.9v10.2L12 24V12l12-5.1"/>
    <path fill="#262577" d="M0 6.9L12 12 0 17.1V6.9"/>
  </svg>
);

const USFlag = () => (
  <svg viewBox="0 0 24 16" className="w-5 h-3.5 rounded-sm overflow-hidden">
    <rect width="24" height="16" fill="#B22234"/>
    <rect y="1.23" width="24" height="1.23" fill="white"/>
    <rect y="3.69" width="24" height="1.23" fill="white"/>
    <rect y="6.15" width="24" height="1.23" fill="white"/>
    <rect y="8.62" width="24" height="1.23" fill="white"/>
    <rect y="11.08" width="24" height="1.23" fill="white"/>
    <rect y="13.54" width="24" height="1.23" fill="white"/>
    <rect width="9.6" height="8.62" fill="#3C3B6E"/>
  </svg>
);

const NLFlag = () => (
  <svg viewBox="0 0 24 16" className="w-5 h-3.5 rounded-sm overflow-hidden">
    <rect width="24" height="5.33" fill="#AE1C28"/>
    <rect y="5.33" width="24" height="5.33" fill="white"/>
    <rect y="10.67" width="24" height="5.33" fill="#21468B"/>
  </svg>
);

const SGFlag = () => (
  <svg viewBox="0 0 24 16" className="w-5 h-3.5 rounded-sm overflow-hidden">
    <rect width="24" height="8" fill="#ED2939"/>
    <rect y="8" width="24" height="8" fill="white"/>
    <circle cx="5" cy="5" r="2.5" fill="white"/>
    <circle cx="5.5" cy="5" r="2" fill="#ED2939"/>
  </svg>
);

const GBFlag = () => (
  <svg viewBox="0 0 24 16" className="w-5 h-3.5 rounded-sm overflow-hidden">
    <rect width="24" height="16" fill="#012169"/>
    <path d="M0 0L24 16M24 0L0 16" stroke="white" strokeWidth="3"/>
    <path d="M0 0L24 16M24 0L0 16" stroke="#C8102E" strokeWidth="1.5"/>
    <path d="M12 0V16M0 8H24" stroke="white" strokeWidth="5"/>
    <path d="M12 0V16M0 8H24" stroke="#C8102E" strokeWidth="3"/>
  </svg>
);

const DEFlag = () => (
  <svg viewBox="0 0 24 16" className="w-5 h-3.5 rounded-sm overflow-hidden">
    <rect width="24" height="5.33" fill="#000"/>
    <rect y="5.33" width="24" height="5.33" fill="#DD0000"/>
    <rect y="10.67" width="24" height="5.33" fill="#FFCE00"/>
  </svg>
);

const getCountryFlag = (location: string) => {
  const loc = location.toLowerCase();
  if (loc.includes("new york") || loc.includes("us") || loc.includes("america")) return USFlag;
  if (loc.includes("amsterdam") || loc.includes("netherlands") || loc.includes("nl")) return NLFlag;
  if (loc.includes("singapore") || loc.includes("sg")) return SGFlag;
  if (loc.includes("london") || loc.includes("uk") || loc.includes("britain")) return GBFlag;
  if (loc.includes("frankfurt") || loc.includes("germany") || loc.includes("de")) return DEFlag;
  return () => <Globe className="w-4 h-4 text-dark-muted" />;
};

const getOSInfo = (os: string) => {
  const osLower = os.toLowerCase();
  if (osLower.includes("windows")) return { Icon: WindowsIcon, bg: "bg-[#00ADEF]/10", isWindows: true };
  if (osLower.includes("ubuntu")) return { Icon: UbuntuIcon, bg: "bg-[#E95420]/10", isWindows: false };
  if (osLower.includes("debian")) return { Icon: DebianIcon, bg: "bg-[#A81D33]/10", isWindows: false };
  if (osLower.includes("centos")) return { Icon: CentOSIcon, bg: "bg-[#262577]/10", isWindows: false };
  return { Icon: () => <Server className="w-6 h-6 text-dark-muted" />, bg: "bg-surface-2", isWindows: false };
};

type FilterType = "all" | "running" | "stopped";

function FilterTabs({ active, onChange }: { active: FilterType; onChange: (f: FilterType) => void }) {
  return (
    <div className="inline-flex p-1.5 bg-surface-1 rounded-full border border-border shadow-soft">
      {(["all", "running", "stopped"] as FilterType[]).map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "relative px-6 py-2.5 rounded-full font-dm-sans text-sm font-semibold transition-all duration-300 capitalize",
            active === tab ? "text-white" : "text-dark-muted hover:text-dark"
          )}
        >
          {active === tab && (
            <motion.div
              layoutId="filterPill"
              className="absolute inset-0 bg-dark rounded-full"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10">{tab === "all" ? "All Servers" : tab}</span>
        </button>
      ))}
    </div>
  );
}

function SpecItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 text-dark-muted" />
        <span className="font-outfit text-sm text-dark-muted">{label}</span>
      </div>
      <span className="font-work-sans text-sm font-semibold text-dark">{value}</span>
    </div>
  );
}


function ServerCard({ server, index, onAction }: { 
  server: ServerWithPlan; 
  index: number;
  onAction: (serverId: string, action: "start" | "stop" | "restart") => Promise<void>;
}) {
  const [copied, setCopied] = React.useState(false);
  const [showCredentials, setShowCredentials] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  
  const isRunning = server.status === "running";
  const osInfo = getOSInfo(server.os_template || "");
  const FlagIcon = getCountryFlag(server.location || "");

  const copyIP = (e: React.MouseEvent) => {
    e.preventDefault();
    if (server.ip_address) {
      navigator.clipboard.writeText(server.ip_address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyField = (field: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAction = async (action: "start" | "stop" | "restart") => {
    setActionLoading(action);
    await onAction(server.id, action);
    setActionLoading(null);
  };

  const downloadRDP = () => {
    const rdpContent = `full address:s:${server.ip_address}:${server.rdp_port || 3389}
username:s:${server.username || "Administrator"}
prompt for credentials:i:1
administrative session:i:1
screen mode id:i:2
desktopwidth:i:1920
desktopheight:i:1080
session bpp:i:32`;
    const blob = new Blob([rdpContent], { type: "application/x-rdp" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${server.hostname}.rdp`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const plan = server.plan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative"
    >
      <div className={cn(
        "relative h-full bg-surface-1 rounded-[32px] border transition-all duration-500",
        isRunning
          ? "border-emerald-200 shadow-[0_0_0_1px_rgba(16,185,129,0.1),0_24px_48px_-12px_rgba(16,185,129,0.1)]"
          : "border-red-200 shadow-[0_0_0_1px_rgba(239,68,68,0.1),0_24px_48px_-12px_rgba(239,68,68,0.05)]"
      )}>
        <div className="absolute -top-3 left-6">
          <span className={cn(
            "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-dm-sans font-semibold shadow-soft",
            isRunning ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full bg-white", isRunning && "animate-pulse")} />
            {isRunning ? "Running" : server.status}
          </span>
        </div>

        <div className="p-8 pt-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", osInfo.bg)}>
                <osInfo.Icon />
              </div>
              <div>
                <h4 className="font-google-sans font-semibold text-xl text-dark mb-1">{server.hostname}</h4>
                <p className="font-outfit text-sm text-dark-muted">{server.os_template}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-surface-2/60 rounded-full text-sm font-outfit text-dark-muted">
              <FlagIcon /> {server.location}
            </span>
            {server.ip_address && (
              <button
                onClick={copyIP}
                className="inline-flex items-center gap-2 px-4 py-2 bg-surface-2/60 hover:bg-primary/10 rounded-full text-sm font-mono text-dark-muted hover:text-primary transition-colors"
              >
                {server.ip_address}
                {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            )}
            {plan && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-surface-2/60 rounded-full text-sm font-outfit text-dark-muted">
                {plan.name}
              </span>
            )}
          </div>

          {/* Credentials */}
          <div className="mb-6">
            <button
              onClick={() => setShowCredentials(!showCredentials)}
              className="w-full flex items-center justify-between p-4 bg-dark/[0.03] hover:bg-dark/[0.06] rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-dark-muted" />
                <span className="font-dm-sans text-sm font-semibold text-dark">Server Credentials</span>
              </div>
              <motion.div animate={{ rotate: showCredentials ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ArrowRight className="w-4 h-4 text-dark-muted rotate-90" />
              </motion.div>
            </button>
            
            {showCredentials && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-4 bg-surface-2/40 rounded-2xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-outfit text-xs text-dark-muted">Username</span>
                  <button
                    onClick={() => copyField("username", server.username || "root")}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full text-xs font-mono text-dark hover:bg-primary/10 transition-colors"
                  >
                    {server.username || "root"}
                    {copiedField === "username" ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3 text-dark-muted" />}
                  </button>
                </div>
                
                {server.password && (
                  <div className="flex items-center justify-between">
                    <span className="font-outfit text-xs text-dark-muted">Password</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setShowPassword(!showPassword)} className="p-1.5 hover:bg-white rounded-lg transition-colors">
                        {showPassword ? <EyeOff className="w-3.5 h-3.5 text-dark-muted" /> : <Eye className="w-3.5 h-3.5 text-dark-muted" />}
                      </button>
                      <button
                        onClick={() => copyField("password", server.password || "")}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full text-xs font-mono text-dark hover:bg-primary/10 transition-colors"
                      >
                        {showPassword ? server.password : "••••••••••••"}
                        {copiedField === "password" ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3 text-dark-muted" />}
                      </button>
                    </div>
                  </div>
                )}

                {osInfo.isWindows && (
                  <button
                    onClick={downloadRDP}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-dark text-white rounded-full text-xs font-dm-sans font-semibold hover:bg-primary transition-colors mt-2"
                  >
                    <Download className="w-3.5 h-3.5" /> Download RDP File
                  </button>
                )}
              </motion.div>
            )}
          </div>

          {/* Specs */}
          <div className="mb-6 divide-y divide-border/50">
            <SpecItem icon={Cpu} label="vCPU" value={`${plan?.cpu_cores || server.cpu_usage || 0} Core${(plan?.cpu_cores || 0) > 1 ? "s" : ""}`} />
            <SpecItem icon={Gauge} label="Memory" value={`${plan?.ram_gb || 0} GB`} />
            <SpecItem icon={HardDrive} label="NVMe Storage" value={`${plan?.storage_gb || 0} GB`} />
            <SpecItem icon={Globe} label="Bandwidth" value={`${plan?.bandwidth_tb || 0} TB`} />
          </div>

          <div className="flex items-center gap-2 mb-8 flex-wrap">
            {["DDoS Protected", "Full Access"].map((feature) => (
              <span key={feature} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-2/40 rounded-full text-xs font-outfit text-dark-muted">
                <Shield className="w-3 h-3 text-emerald-500" /> {feature}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isRunning ? (
              <button 
                onClick={() => handleAction("stop")}
                disabled={!!actionLoading}
                className="inline-flex items-center gap-2 px-5 py-3 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors disabled:opacity-50"
              >
                {actionLoading === "stop" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />} Stop
              </button>
            ) : (
              <button 
                onClick={() => handleAction("start")}
                disabled={!!actionLoading}
                className="inline-flex items-center gap-2 px-5 py-3 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors disabled:opacity-50"
              >
                {actionLoading === "start" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} Start
              </button>
            )}
            <button 
              onClick={() => handleAction("restart")}
              disabled={!!actionLoading}
              className="inline-flex items-center gap-2 px-5 py-3 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors disabled:opacity-50"
            >
              {actionLoading === "restart" ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />} Restart
            </button>
            <button className="inline-flex items-center gap-2 px-5 py-3 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors">
              <Terminal className="w-4 h-4" /> Console
            </button>
            <button className="inline-flex items-center justify-center w-12 h-12 bg-surface-2 hover:bg-red-50 text-dark-muted hover:text-red-500 rounded-full transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <Link
            href={routes.dashboard.servers.detail(server.id)}
            className="flex items-center justify-center gap-2 w-full mt-4 py-4 bg-surface-2/50 hover:bg-primary/10 rounded-2xl text-sm font-dm-sans font-semibold text-dark-muted hover:text-primary transition-colors"
          >
            Manage Server <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}


export default function ServersPage() {
  const [servers, setServers] = React.useState<ServerWithPlan[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<FilterType>("all");

  const fetchServers = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await getUserServers({
        status: filter === "all" ? "all" : filter as ServerStatus,
        search: search || undefined,
        limit: 50,
      });
      setServers(result.servers);
    } catch (error) {
      console.error("Error fetching servers:", error);
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  React.useEffect(() => {
    fetchServers();
  }, [fetchServers]);

  const handleServerAction = async (serverId: string, action: "start" | "stop" | "restart") => {
    await performServerAction(serverId, action);
    fetchServers();
  };

  const filtered = servers.filter((s) => {
    const matchSearch = s.hostname.toLowerCase().includes(search.toLowerCase()) || 
      (s.ip_address && s.ip_address.includes(search));
    return matchSearch;
  });

  const running = servers.filter(s => s.status === "running").length;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="mb-14">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 bg-surface-1 rounded-full border border-border"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-dm-sans text-sm font-medium text-dark-muted">
              {running} of {servers.length} online
            </span>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}>
            <Link
              href={routes.dashboard.deploy.index}
              className="group inline-flex items-center gap-2.5 px-6 py-3 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-all duration-200 hover:shadow-[0_4px_12px_rgba(255,85,51,0.3)]"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" /> Deploy Server
            </Link>
          </motion.div>
        </div>

        <div className="max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-[clamp(2.5rem,8vw,5rem)] font-google-sans font-semibold text-dark tracking-[-0.03em] leading-[0.95] mb-5"
          >
            Your Servers
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="font-outfit text-xl text-dark-muted leading-relaxed"
          >
            Manage, monitor, and control your cloud infrastructure
            <span className="text-dark-muted/40">—</span>
            <span className="text-dark"> all in one place.</span>
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12"
      >
        <FilterTabs active={filter} onChange={setFilter} />
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted" />
          <input
            type="text"
            placeholder="Search servers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 h-12 pl-12 pr-4 bg-surface-1 border border-border rounded-full font-outfit text-sm text-dark placeholder:text-dark-muted/50 focus:outline-none focus:border-primary/30 transition-colors"
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-dark-muted" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-8">
          {filtered.map((server, i) => (
            <ServerCard key={server.id} server={server} index={i} onAction={handleServerAction} />
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-surface-1 rounded-[40px] border border-border">
          <div className="w-20 h-20 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-6">
            <Server className="w-10 h-10 text-dark-muted" />
          </div>
          <h3 className="font-google-sans font-semibold text-2xl text-dark mb-3">
            {search || filter !== "all" ? "No servers found" : "No servers yet"}
          </h3>
          <p className="font-outfit text-dark-muted mb-8 max-w-md mx-auto">
            {search || filter !== "all" ? "Try adjusting your search or filter criteria" : "Deploy your first server to get started with Layerium Cloud"}
          </p>
          {!search && filter === "all" && (
            <Link
              href={routes.dashboard.deploy.index}
              className="inline-flex items-center gap-2 px-8 py-4 bg-dark hover:bg-primary text-white rounded-full font-dm-sans font-semibold transition-colors"
            >
              <Plus className="w-5 h-5" /> Deploy Your First Server
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Square,
  RotateCcw,
  RefreshCw,
  Settings,
  Terminal,
  Globe,
  Cpu,
  HardDrive,
  Network,
  Activity,
  Copy,
  Check,
  Trash2,
  Shield,
  Clock,
  Gauge,
  Key,
  Download,
  Upload,
  Power,
  Eye,
  EyeOff,
  User,
  Lock,
  MonitorDown,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchServerById, fetchServerActivityLogs, executeServerAction } from "./actions";
import type { ServerWithPlan } from "@/types/database";

// OS Icons with real colors
const WindowsIcon = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClass = size === "sm" ? "w-5 h-5" : size === "lg" ? "w-10 h-10" : "w-7 h-7";
  return (
    <svg viewBox="0 0 24 24" className={sizeClass}>
      <path fill="#00ADEF" d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
    </svg>
  );
};

const UbuntuIcon = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClass = size === "sm" ? "w-5 h-5" : size === "lg" ? "w-10 h-10" : "w-7 h-7";
  return (
    <svg viewBox="0 0 24 24" className={sizeClass}>
      <circle cx="12" cy="12" r="12" fill="#E95420"/>
      <circle cx="12" cy="5.5" r="2" fill="white"/>
      <circle cx="6" cy="15" r="2" fill="white"/>
      <circle cx="18" cy="15" r="2" fill="white"/>
      <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="1.5"/>
    </svg>
  );
};

const DebianIcon = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClass = size === "sm" ? "w-5 h-5" : size === "lg" ? "w-10 h-10" : "w-7 h-7";
  return (
    <svg viewBox="0 0 24 24" className={sizeClass}>
      <circle cx="12" cy="12" r="11" fill="#A81D33"/>
      <path fill="white" d="M13.5 6c1.5.5 2.5 2 2.5 3.5 0 2-1.5 3.5-3.5 3.5S9 11.5 9 9.5c0-1.5 1-3 2.5-3.5m1 1c-.8.3-1.5 1.2-1.5 2.5 0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5c0-1.3-.7-2.2-1.5-2.5"/>
    </svg>
  );
};

const CentOSIcon = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClass = size === "sm" ? "w-5 h-5" : size === "lg" ? "w-10 h-10" : "w-7 h-7";
  return (
    <svg viewBox="0 0 24 24" className={sizeClass}>
      <path fill="#932279" d="M12 0L0 6.9v10.2L12 24V12L0 5.1"/>
      <path fill="#EFA724" d="M12 0l12 6.9L12 12V0"/>
      <path fill="#9CCD2A" d="M24 6.9v10.2L12 24V12l12-5.1"/>
      <path fill="#262577" d="M0 6.9L12 12 0 17.1V6.9"/>
    </svg>
  );
};

// Country Flag SVGs
const USFlag = () => (
  <svg viewBox="0 0 24 16" className="w-6 h-4 rounded-sm overflow-hidden">
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
  <svg viewBox="0 0 24 16" className="w-6 h-4 rounded-sm overflow-hidden">
    <rect width="24" height="5.33" fill="#AE1C28"/>
    <rect y="5.33" width="24" height="5.33" fill="white"/>
    <rect y="10.67" width="24" height="5.33" fill="#21468B"/>
  </svg>
);

const GBFlag = () => (
  <svg viewBox="0 0 24 16" className="w-6 h-4 rounded-sm overflow-hidden">
    <rect width="24" height="16" fill="#012169"/>
    <path d="M0 0L24 16M24 0L0 16" stroke="white" strokeWidth="3"/>
    <path d="M0 0L24 16M24 0L0 16" stroke="#C8102E" strokeWidth="1.5"/>
    <path d="M12 0V16M0 8H24" stroke="white" strokeWidth="5"/>
    <path d="M12 0V16M0 8H24" stroke="#C8102E" strokeWidth="3"/>
  </svg>
);

const getCountryFlag = (location: string) => {
  const loc = location.toLowerCase();
  if (loc.includes("us") || loc.includes("east") || loc.includes("west") || loc.includes("america")) return USFlag;
  if (loc.includes("amsterdam") || loc.includes("netherlands") || loc.includes("nl")) return NLFlag;
  if (loc.includes("london") || loc.includes("uk") || loc.includes("britain")) return GBFlag;
  return () => <Globe className="w-5 h-5 text-dark-muted" />;
};

const getOSInfo = (os: string) => {
  const osLower = os.toLowerCase();
  if (osLower.includes("windows")) return { Icon: WindowsIcon, bg: "bg-[#00ADEF]/10", color: "#00ADEF", isWindows: true };
  if (osLower.includes("ubuntu")) return { Icon: UbuntuIcon, bg: "bg-[#E95420]/10", color: "#E95420", isWindows: false };
  if (osLower.includes("debian")) return { Icon: DebianIcon, bg: "bg-[#A81D33]/10", color: "#A81D33", isWindows: false };
  if (osLower.includes("centos")) return { Icon: CentOSIcon, bg: "bg-[#262577]/10", color: "#262577", isWindows: false };
  return { Icon: () => <Cpu className="w-7 h-7 text-dark-muted" />, bg: "bg-surface-2", color: "#666", isWindows: false };
};

// Activity log type
interface ActivityLog {
  id: string;
  action: string;
  description?: string;
  ip_address?: string;
  created_at: string;
}

type TabType = "overview" | "credentials" | "network" | "activity" | "settings";

function TabNav({ active, onChange }: { active: TabType; onChange: (t: TabType) => void }) {
  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: Gauge },
    { id: "credentials", label: "Credentials", icon: Key },
    { id: "network", label: "Network", icon: Globe },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="inline-flex p-1.5 bg-surface-1 rounded-full border border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative flex items-center gap-2 px-5 py-2.5 rounded-full font-dm-sans text-sm font-semibold transition-all duration-300",
            active === tab.id ? "text-white" : "text-dark-muted hover:text-dark"
          )}
        >
          {active === tab.id && (
            <motion.div
              layoutId="tabPill"
              className="absolute inset-0 bg-dark rounded-full"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
          <tab.icon className="relative z-10 w-4 h-4" />
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

// Credential field with copy and show/hide
function CredentialField({ 
  label, 
  value, 
  icon: Icon, 
  isPassword = false,
  mono = false 
}: { 
  label: string; 
  value: string; 
  icon: React.ElementType;
  isPassword?: boolean;
  mono?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);
  const [showValue, setShowValue] = React.useState(!isPassword);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayValue = isPassword && !showValue ? "••••••••••••••••" : value;

  return (
    <div className="p-5 bg-surface-1 rounded-[20px] border border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-surface-2/60 flex items-center justify-center">
            <Icon className="w-4 h-4 text-dark-muted" />
          </div>
          <span className="font-dm-sans text-sm font-medium text-dark-muted">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {isPassword && (
            <button
              onClick={() => setShowValue(!showValue)}
              className="inline-flex items-center justify-center w-9 h-9 bg-surface-2/60 hover:bg-surface-2 rounded-xl text-dark-muted hover:text-dark transition-colors"
            >
              {showValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-2/60 hover:bg-primary/10 rounded-full text-xs font-dm-sans font-semibold text-dark-muted hover:text-primary transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <p className={cn(
        "text-dark font-medium text-lg truncate",
        mono ? "font-mono" : "font-outfit"
      )}>
        {displayValue}
      </p>
    </div>
  );
}

// Generate and download RDP file
function generateRDPFile(ip: string, username: string, port: number = 3389): string {
  const rdpContent = `full address:s:${ip}:${port}
username:s:${username}
prompt for credentials:i:1
administrative session:i:1
screen mode id:i:2
use multimon:i:0
desktopwidth:i:1920
desktopheight:i:1080
session bpp:i:32
compression:i:1
keyboardhook:i:2
audiocapturemode:i:0
videoplaybackmode:i:1
connection type:i:7
networkautodetect:i:1
bandwidthautodetect:i:1
displayconnectionbar:i:1
enableworkspacereconnect:i:0
disable wallpaper:i:0
allow font smoothing:i:1
allow desktop composition:i:1
disable full window drag:i:0
disable menu anims:i:0
disable themes:i:0
disable cursor setting:i:0
bitmapcachepersistenable:i:1
audiomode:i:0
redirectprinters:i:1
redirectcomports:i:0
redirectsmartcards:i:1
redirectclipboard:i:1
redirectposdevices:i:0
autoreconnection enabled:i:1
authentication level:i:2
negotiate security layer:i:1
remoteapplicationmode:i:0
alternate shell:s:
shell working directory:s:
gatewayhostname:s:
gatewayusagemethod:i:4
gatewaycredentialssource:i:4
gatewayprofileusagemethod:i:0
promptcredentialonce:i:0
gatewaybrokeringtype:i:0
use redirection server name:i:0
rdgiskdcproxy:i:0
kdcproxyname:s:`;
  return rdpContent;
}

function downloadRDPFile(hostname: string, ip: string, username: string, port: number = 3389) {
  const rdpContent = generateRDPFile(ip, username, port);
  const blob = new Blob([rdpContent], { type: "application/x-rdp" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${hostname}.rdp`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function UsageRing({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center p-6 bg-surface-1 rounded-[24px] border border-border">
      <div className="relative w-20 h-20 mb-4">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="none" className="text-surface-2" />
          <motion.circle
            cx="40" cy="40" r="36"
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-work-sans font-bold text-xl text-dark">{value}%</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-dark-muted" />
        <span className="font-dm-sans text-sm font-semibold text-dark">{label}</span>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, subtext }: { icon: React.ElementType; label: string; value: string; subtext?: string }) {
  return (
    <div className="p-5 bg-surface-1 rounded-[20px] border border-border">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-surface-2/60 flex items-center justify-center">
          <Icon className="w-5 h-5 text-dark-muted" />
        </div>
        <span className="font-outfit text-sm text-dark-muted">{label}</span>
      </div>
      <p className="font-work-sans font-bold text-2xl text-dark">{value}</p>
      {subtext && <p className="font-outfit text-xs text-dark-muted mt-1">{subtext}</p>}
    </div>
  );
}

function CopyPill({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="p-5 bg-surface-1 rounded-[20px] border border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="font-outfit text-sm text-dark-muted">{label}</span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-2/60 hover:bg-primary/10 rounded-full text-xs font-dm-sans font-medium text-dark-muted hover:text-primary transition-colors"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="font-mono text-dark font-medium truncate">{text}</p>
    </div>
  );
}

function SpecRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-dark-muted" />
        <span className="font-outfit text-sm text-dark-muted">{label}</span>
      </div>
      <span className="font-work-sans text-sm font-semibold text-dark">{value}</span>
    </div>
  );
}

function formatRelativeTime(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function ServerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const serverId = params.id as string;
  
  const [activeTab, setActiveTab] = React.useState<TabType>("overview");
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [server, setServer] = React.useState<ServerWithPlan | null>(null);
  const [activityLogs, setActivityLogs] = React.useState<ActivityLog[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch server data
  React.useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [serverData, logsData] = await Promise.all([
          fetchServerById(serverId),
          fetchServerActivityLogs(serverId),
        ]);
        
        if (!serverData) {
          setError("Server not found");
          return;
        }
        
        setServer(serverData);
        setActivityLogs(logsData);
      } catch (err) {
        console.error("Error fetching server:", err);
        setError("Failed to load server data");
      } finally {
        setLoading(false);
      }
    }
    
    if (serverId) {
      fetchData();
    }
  }, [serverId]);

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="font-outfit text-dark-muted">Loading server details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !server) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="font-google-sans font-semibold text-xl text-dark">{error || "Server not found"}</h2>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    );
  }
  
  const isRunning = server.status === "running";
  const osInfo = getOSInfo(server.os_template || "");
  const FlagIcon = getCountryFlag(server.location || "");
  const isWindows = osInfo.isWindows;

  // Server credentials from database
  const serverCredentials = {
    ip_address: server.ip_address || "—",
    ipv6_address: (server as any).ipv6_address || "—",
    username: (server as any).username || (isWindows ? "Administrator" : "root"),
    password: (server as any).password || "Contact support for credentials",
    rdp_port: (server as any).rdp_port || 3389,
    ssh_port: (server as any).ssh_port || 22,
    reverse_dns: (server as any).reverse_dns || `${server.hostname}.layerium.cloud`,
  };

  const handleServerAction = async (action: "start" | "stop" | "restart") => {
    setActionLoading(action);
    try {
      const result = await executeServerAction(serverId, action);
      if (result.success) {
        // Refresh server data
        const updatedServer = await fetchServerById(serverId);
        if (updatedServer) {
          setServer(updatedServer);
        }
      }
    } catch (err) {
      console.error("Server action failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDownloadRDP = () => {
    downloadRDPFile(server.hostname, serverCredentials.ip_address, serverCredentials.username, serverCredentials.rdp_port);
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-surface-1 hover:bg-surface-2 rounded-full text-sm font-dm-sans font-medium text-dark-muted hover:text-dark transition-colors border border-border"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Servers
        </button>
      </motion.div>

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-surface-1 rounded-[32px] border border-border p-8 lg:p-10 mb-10"
      >
        {/* Status Badge */}
        <div className="absolute -top-3 left-8">
          <span className={cn(
            "inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-dm-sans font-semibold shadow-soft",
            isRunning ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
          )}>
            <span className={cn("w-2 h-2 rounded-full bg-white", isRunning && "animate-pulse")} />
            {isRunning ? "Running" : "Stopped"}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 pt-4">
          {/* Server Info */}
          <div className="flex items-center gap-5">
            <div className={cn("w-20 h-20 rounded-[20px] flex items-center justify-center", osInfo.bg)}>
              <osInfo.Icon size="lg" />
            </div>
            <div>
              <h1 className="font-google-sans font-semibold text-3xl lg:text-4xl text-dark mb-2">{server.hostname}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-surface-2/60 rounded-full text-sm font-outfit text-dark-muted">
                  {server.os_template}
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-surface-2/60 rounded-full text-sm font-outfit text-dark-muted">
                  <FlagIcon /> {server.location}
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-surface-2/60 rounded-full text-sm font-outfit text-dark-muted">
                  {server.plan?.name || "Standard"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            {isRunning ? (
              <button
                onClick={() => handleServerAction("stop")}
                disabled={actionLoading !== null}
                className="inline-flex items-center gap-2 px-6 py-3 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors disabled:opacity-50"
              >
                {actionLoading === "stop" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Square className="w-4 h-4" />}
                Stop
              </button>
            ) : (
              <button
                onClick={() => handleServerAction("start")}
                disabled={actionLoading !== null}
                className="inline-flex items-center gap-2 px-6 py-3 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors disabled:opacity-50"
              >
                {actionLoading === "start" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Start
              </button>
            )}
            <button
              onClick={() => handleServerAction("restart")}
              disabled={actionLoading !== null || !isRunning}
              className="inline-flex items-center gap-2 px-6 py-3 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors disabled:opacity-50"
            >
              {actionLoading === "restart" ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
              Restart
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors">
              <Terminal className="w-4 h-4" /> Console
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex justify-center mb-10"
      >
        <TabNav active={activeTab} onChange={setActiveTab} />
      </motion.div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Resource Usage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <UsageRing label="CPU Usage" value={Number(server.cpu_usage) || 0} icon={Cpu} color="#3B82F6" />
            <UsageRing label="Memory" value={Number(server.ram_usage) || 0} icon={Gauge} color="#10B981" />
            <UsageRing label="Disk" value={Number(server.disk_usage) || 0} icon={HardDrive} color="#F59E0B" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Clock} label="Uptime" value="—" />
            <StatCard icon={Download} label="Network In" value={`${Number(server.bandwidth_used_gb) || 0} GB`} subtext="This month" />
            <StatCard icon={Upload} label="Network Out" value="—" subtext="This month" />
            <StatCard icon={Power} label="Status" value={isRunning ? "Online" : "Offline"} />
          </div>

          {/* Specifications Card */}
          <div className="bg-surface-1 rounded-[32px] border border-border p-8">
            <h3 className="font-google-sans font-semibold text-xl text-dark mb-6">Server Specifications</h3>
            <div className="grid md:grid-cols-2 gap-x-12">
              <div className="divide-y divide-border/50">
                <SpecRow icon={Cpu} label="vCPU Cores" value={`${server.plan?.cpu_cores || 0} Cores`} />
                <SpecRow icon={Gauge} label="Memory" value={`${server.plan?.ram_gb || 0} GB RAM`} />
              </div>
              <div className="divide-y divide-border/50">
                <SpecRow icon={HardDrive} label="NVMe Storage" value={`${server.plan?.storage_gb || 0} GB`} />
                <SpecRow icon={Network} label="Bandwidth" value={`${server.plan?.bandwidth_tb || 0} TB`} />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border/50 flex-wrap">
              {["DDoS Protected", "Full Root Access", "24/7 Support"].map((feature) => (
                <span key={feature} className="inline-flex items-center gap-2 px-4 py-2 bg-surface-2/40 rounded-full text-sm font-outfit text-dark-muted">
                  <Shield className="w-4 h-4 text-emerald-500" /> {feature}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* CREDENTIALS TAB - New */}
      {activeTab === "credentials" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Quick Connect Card */}
          <div className="bg-dark rounded-[32px] p-8 lg:p-10 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="cred-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cred-dots)" />
              </svg>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  {isWindows ? <MonitorDown className="w-6 h-6 text-primary" /> : <Terminal className="w-6 h-6 text-primary" />}
                </div>
                <div>
                  <h3 className="font-google-sans font-semibold text-xl">Quick Connect</h3>
                  <p className="font-outfit text-sm text-white/60">
                    {isWindows ? "Download RDP file to connect instantly" : "Use SSH to connect to your server"}
                  </p>
                </div>
              </div>

              {isWindows ? (
                <button
                  onClick={handleDownloadRDP}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-dark font-dm-sans font-semibold rounded-full hover:bg-primary hover:text-white hover:scale-[1.02] transition-all duration-300"
                >
                  <Download className="w-5 h-5" />
                  Download RDP File
                </button>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl">
                    <code className="font-mono text-sm text-white/90 flex-1">
                      ssh {serverCredentials.username}@{serverCredentials.ip_address} -p {serverCredentials.ssh_port}
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(`ssh ${serverCredentials.username}@${serverCredentials.ip_address} -p ${serverCredentials.ssh_port}`)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-dm-sans font-semibold transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Credentials Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <CredentialField 
              label="IP Address" 
              value={serverCredentials.ip_address} 
              icon={Globe}
              mono
            />
            <CredentialField 
              label={isWindows ? "RDP Port" : "SSH Port"} 
              value={String(isWindows ? serverCredentials.rdp_port : serverCredentials.ssh_port)} 
              icon={Network}
              mono
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <CredentialField 
              label="Username" 
              value={serverCredentials.username} 
              icon={User}
            />
            <CredentialField 
              label="Password" 
              value={serverCredentials.password} 
              icon={Lock}
              isPassword
              mono
            />
          </div>

          {/* Connection Instructions */}
          <div className="bg-surface-1 rounded-[32px] border border-border p-8">
            <h3 className="font-google-sans font-semibold text-xl text-dark mb-6">
              {isWindows ? "How to Connect via RDP" : "How to Connect via SSH"}
            </h3>
            <div className="space-y-4">
              {isWindows ? (
                <>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-dark flex items-center justify-center flex-shrink-0">
                      <span className="font-work-sans font-bold text-xs text-white">1</span>
                    </div>
                    <div>
                      <p className="font-dm-sans font-semibold text-dark mb-1">Download the RDP file</p>
                      <p className="font-outfit text-sm text-dark-muted">Click the "Download RDP File" button above to get your connection file</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-dark flex items-center justify-center flex-shrink-0">
                      <span className="font-work-sans font-bold text-xs text-white">2</span>
                    </div>
                    <div>
                      <p className="font-dm-sans font-semibold text-dark mb-1">Open the RDP file</p>
                      <p className="font-outfit text-sm text-dark-muted">Double-click the downloaded .rdp file to open Remote Desktop Connection</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-dark flex items-center justify-center flex-shrink-0">
                      <span className="font-work-sans font-bold text-xs text-white">3</span>
                    </div>
                    <div>
                      <p className="font-dm-sans font-semibold text-dark mb-1">Enter your password</p>
                      <p className="font-outfit text-sm text-dark-muted">When prompted, enter the password shown above and click Connect</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-dark flex items-center justify-center flex-shrink-0">
                      <span className="font-work-sans font-bold text-xs text-white">1</span>
                    </div>
                    <div>
                      <p className="font-dm-sans font-semibold text-dark mb-1">Open your terminal</p>
                      <p className="font-outfit text-sm text-dark-muted">On Mac/Linux use Terminal, on Windows use PowerShell or WSL</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-dark flex items-center justify-center flex-shrink-0">
                      <span className="font-work-sans font-bold text-xs text-white">2</span>
                    </div>
                    <div>
                      <p className="font-dm-sans font-semibold text-dark mb-1">Run the SSH command</p>
                      <p className="font-outfit text-sm text-dark-muted">Copy and paste the SSH command from the Quick Connect section above</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-dark flex items-center justify-center flex-shrink-0">
                      <span className="font-work-sans font-bold text-xs text-white">3</span>
                    </div>
                    <div>
                      <p className="font-dm-sans font-semibold text-dark mb-1">Enter your password</p>
                      <p className="font-outfit text-sm text-dark-muted">When prompted, enter the password shown above to authenticate</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-4 p-5 bg-amber-50 border border-amber-200 rounded-[20px]">
            <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-dm-sans font-semibold text-amber-800 mb-1">Security Recommendation</p>
              <p className="font-outfit text-sm text-amber-700">
                For enhanced security, we recommend changing your password after your first login and enabling two-factor authentication if available.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "network" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <CopyPill label="IPv4 Address" text={serverCredentials.ip_address} />
            <CopyPill label="IPv6 Address" text={serverCredentials.ipv6_address} />
          </div>
          <CopyPill label="Reverse DNS" text={serverCredentials.reverse_dns} />
          
          <div className="bg-surface-1 rounded-[32px] border border-border p-8">
            <h3 className="font-google-sans font-semibold text-xl text-dark mb-6">Network Statistics</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-5 bg-surface-2/40 rounded-[20px]">
                <div className="flex items-center gap-3 mb-3">
                  <Download className="w-5 h-5 text-emerald-500" />
                  <span className="font-outfit text-sm text-dark-muted">Inbound Traffic</span>
                </div>
                <p className="font-work-sans font-bold text-3xl text-dark">{Number(server.bandwidth_used_gb) || 0} GB</p>
                <p className="font-outfit text-xs text-dark-muted mt-1">of {server.plan?.bandwidth_tb || 0} TB bandwidth</p>
              </div>
              <div className="p-5 bg-surface-2/40 rounded-[20px]">
                <div className="flex items-center gap-3 mb-3">
                  <Upload className="w-5 h-5 text-blue-500" />
                  <span className="font-outfit text-sm text-dark-muted">Outbound Traffic</span>
                </div>
                <p className="font-work-sans font-bold text-3xl text-dark">—</p>
                <p className="font-outfit text-xs text-dark-muted mt-1">of {server.plan?.bandwidth_tb || 0} TB bandwidth</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "activity" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-surface-1 rounded-[32px] border border-border p-8">
            <h3 className="font-google-sans font-semibold text-xl text-dark mb-6">Recent Activity</h3>
            {activityLogs.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-dark-muted/30 mx-auto mb-4" />
                <p className="font-outfit text-dark-muted">No activity logs yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activityLogs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-5 bg-surface-2/40 rounded-[20px]"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 shadow-soft">
                      <Activity className="w-5 h-5 text-dark-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <p className="font-dm-sans font-semibold text-dark">{log.action}</p>
                        <span className="px-3 py-1 bg-surface-1 rounded-full text-xs font-outfit text-dark-muted whitespace-nowrap">
                          {formatRelativeTime(log.created_at)}
                        </span>
                      </div>
                      <p className="font-outfit text-sm text-dark-muted">{log.description || "—"}</p>
                      {log.ip_address && (
                        <p className="font-mono text-xs text-dark-muted/60 mt-2">IP: {log.ip_address}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {activeTab === "settings" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Server Info */}
          <div className="bg-surface-1 rounded-[32px] border border-border p-8">
            <h3 className="font-google-sans font-semibold text-xl text-dark mb-6">Server Information</h3>
            <div className="divide-y divide-border/50">
              <div className="flex items-center justify-between py-4">
                <span className="font-outfit text-sm text-dark-muted">Operating System</span>
                <span className="font-dm-sans text-sm font-semibold text-dark">{server.os_template}</span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="font-outfit text-sm text-dark-muted">Created</span>
                <span className="font-dm-sans text-sm font-semibold text-dark">{formatDate(server.created_at)}</span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="font-outfit text-sm text-dark-muted">Last Updated</span>
                <span className="font-dm-sans text-sm font-semibold text-dark">{formatDate(server.updated_at)}</span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="font-outfit text-sm text-dark-muted">Plan</span>
                <span className="font-dm-sans text-sm font-semibold text-dark">{server.plan?.name || "Standard"}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-surface-1 rounded-[32px] border border-border p-8">
            <h3 className="font-google-sans font-semibold text-xl text-dark mb-6">Quick Actions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <button className="flex items-center gap-4 p-5 bg-surface-2/40 hover:bg-surface-2 rounded-[20px] transition-colors text-left">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-soft">
                  <Key className="w-5 h-5 text-dark-muted" />
                </div>
                <div>
                  <p className="font-dm-sans font-semibold text-dark">Reset Password</p>
                  <p className="font-outfit text-sm text-dark-muted">Generate new root password</p>
                </div>
              </button>
              <button className="flex items-center gap-4 p-5 bg-surface-2/40 hover:bg-surface-2 rounded-[20px] transition-colors text-left">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-soft">
                  <RefreshCw className="w-5 h-5 text-dark-muted" />
                </div>
                <div>
                  <p className="font-dm-sans font-semibold text-dark">Rebuild Server</p>
                  <p className="font-outfit text-sm text-dark-muted">Reinstall operating system</p>
                </div>
              </button>
              <button className="flex items-center gap-4 p-5 bg-surface-2/40 hover:bg-surface-2 rounded-[20px] transition-colors text-left">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-soft">
                  <Settings className="w-5 h-5 text-dark-muted" />
                </div>
                <div>
                  <p className="font-dm-sans font-semibold text-dark">Upgrade Plan</p>
                  <p className="font-outfit text-sm text-dark-muted">Scale your server resources</p>
                </div>
              </button>
              <button className="flex items-center gap-4 p-5 bg-red-50 hover:bg-red-100 rounded-[20px] transition-colors text-left group">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-soft">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="font-dm-sans font-semibold text-red-600">Delete Server</p>
                  <p className="font-outfit text-sm text-red-400">Permanently remove this server</p>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

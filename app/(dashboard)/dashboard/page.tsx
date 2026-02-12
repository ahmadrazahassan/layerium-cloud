"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Server, 
  Plus,
  ArrowRight,
  ArrowUpRight,
  Copy,
  Check,
  Cpu,
  HardDrive,
  Play,
  Square,
  Terminal,
  RotateCcw,
  Globe,
  RefreshCw,
  Clock,
  Activity,
  Box,
  Layers,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import { getUserServers, performServerAction, type ServerWithPlan } from "@/lib/data/servers";

// Linux Icon SVG
const LinuxIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("w-5 h-5", className)} fill="currentColor">
    <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139z"/>
  </svg>
);

const getStatusConfig = (status: string) => {
  switch (status) {
    case "running": return { dot: "bg-emerald-500", bg: "bg-emerald-500/10", text: "text-emerald-600", label: "Online" };
    case "stopped": return { dot: "bg-dark-muted/40", bg: "bg-dark-muted/10", text: "text-dark-muted", label: "Offline" };
    case "restarting": return { dot: "bg-amber-500", bg: "bg-amber-500/10", text: "text-amber-600", label: "Restarting" };
    case "provisioning": return { dot: "bg-blue-500", bg: "bg-blue-500/10", text: "text-blue-600", label: "Provisioning" };
    case "error": return { dot: "bg-red-500", bg: "bg-red-500/10", text: "text-red-600", label: "Error" };
    default: return { dot: "bg-dark-muted/40", bg: "bg-dark-muted/10", text: "text-dark-muted", label: status };
  }
};

// Bento stat component
function BentoStat({ 
  value, 
  label, 
  sublabel,
  size = "default",
  className
}: { 
  value: string | number;
  label: string;
  sublabel?: string;
  size?: "default" | "large";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <span className={cn(
        "font-work-sans font-semibold text-dark tabular-nums",
        size === "large" ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"
      )}>
        {value}
      </span>
      <span className="font-outfit text-sm text-dark-muted mt-1">{label}</span>
      {sublabel && (
        <span className="inline-flex items-center gap-1.5 font-outfit text-xs mt-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-full w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {sublabel}
        </span>
      )}
    </div>
  );
}

// Quick link component
function QuickLink({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3.5 rounded-full",
        "bg-surface-1 border border-border",
        "hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-200",
        "group"
      )}
    >
      <div className="w-9 h-9 rounded-full bg-dark/[0.04] flex items-center justify-center group-hover:bg-primary/10 transition-colors">
        <Icon className="w-4 h-4 text-dark-muted group-hover:text-primary transition-colors" />
      </div>
      <span className="font-dm-sans text-sm font-medium text-dark">{label}</span>
      <ArrowUpRight className="w-3.5 h-3.5 text-dark-muted/40 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}

// Server Table Row Component - Framer inspired
function ServerTableRow({ 
  server, 
  index,
  onAction 
}: { 
  server: ServerWithPlan; 
  index: number;
  onAction: (serverId: string, action: "start" | "stop" | "restart") => void;
}) {
  const [copied, setCopied] = React.useState<string | null>(null);
  const [showMenu, setShowMenu] = React.useState(false);
  const status = getStatusConfig(server.status);
  const isRunning = server.status === "running";
  const isStopped = server.status === "stopped";
  const isWindows = server.os_template.toLowerCase().includes("windows");

  const copyToClipboard = (text: string, field: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group"
    >
      <div className={cn(
        "flex items-center gap-5 px-4 py-3.5",
        "bg-surface-1 border border-border rounded-2xl",
        "hover:border-dark/10 hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-200"
      )}>
        {/* OS Icon */}
        <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center flex-shrink-0">
          {isWindows ? (
            <Image 
              src="/windows logo.png" 
              alt="Windows" 
              width={22} 
              height={22}
              className="object-contain"
            />
          ) : (
            <LinuxIcon className="text-dark/60" />
          )}
        </div>

        {/* Server Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <Link 
              href={routes.dashboard.servers.detail(server.id)}
              className="font-dm-sans font-semibold text-sm text-dark hover:text-primary transition-colors truncate"
            >
              {server.hostname}
            </Link>
            <div className={cn(
              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-dm-sans font-semibold uppercase tracking-wide",
              status.bg, status.text
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full", status.dot, 
                (server.status === "restarting" || server.status === "provisioning") && "animate-pulse"
              )} />
              {status.label}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-outfit text-xs text-dark-muted">{server.os_template}</span>
            <span className="text-dark-muted/30">•</span>
            <span className="font-outfit text-xs text-dark-muted">{server.location}</span>
          </div>
        </div>

        {/* Specs - Hidden on mobile */}
        <div className="hidden lg:flex items-center gap-1.5">
          <span className="px-2.5 py-1 bg-surface-2 rounded-full text-[11px] font-outfit text-dark-muted">
            {server.plan?.cpu_cores || 0} vCPU
          </span>
          <span className="px-2.5 py-1 bg-surface-2 rounded-full text-[11px] font-outfit text-dark-muted">
            {server.plan?.ram_gb || 0} GB
          </span>
          <span className="px-2.5 py-1 bg-surface-2 rounded-full text-[11px] font-outfit text-dark-muted">
            {server.plan?.storage_gb || 0} GB
          </span>
        </div>

        {/* IP Address */}
        {server.ip_address && (
          <button
            onClick={copyToClipboard(server.ip_address, 'ip')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-dark/[0.03] hover:bg-dark/[0.06] rounded-full font-mono text-[11px] text-dark transition-colors"
          >
            {server.ip_address}
            {copied === 'ip' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-dark-muted" />}
          </button>
        )}

        {/* Quick Actions with Labels */}
        <div className="flex items-center gap-1">
          {isRunning && (
            <button 
              onClick={() => onAction(server.id, "stop")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-red-500/10 transition-colors group/btn"
            >
              <Square className="w-3.5 h-3.5 text-dark-muted group-hover/btn:text-red-500 transition-colors" />
              <span className="text-[11px] font-dm-sans font-medium text-dark-muted group-hover/btn:text-red-500 transition-colors hidden xl:inline">Stop</span>
            </button>
          )}
          {isStopped && (
            <button 
              onClick={() => onAction(server.id, "start")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-emerald-500/10 transition-colors group/btn"
            >
              <Play className="w-3.5 h-3.5 text-dark-muted group-hover/btn:text-emerald-500 transition-colors" />
              <span className="text-[11px] font-dm-sans font-medium text-dark-muted group-hover/btn:text-emerald-500 transition-colors hidden xl:inline">Start</span>
            </button>
          )}
          <button 
            onClick={() => onAction(server.id, "restart")}
            disabled={!isRunning}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors group/btn",
              isRunning ? "hover:bg-amber-500/10" : "opacity-30 cursor-not-allowed"
            )}
          >
            <RotateCcw className={cn("w-3.5 h-3.5 text-dark-muted", isRunning && "group-hover/btn:text-amber-500 transition-colors")} />
            <span className={cn("text-[11px] font-dm-sans font-medium text-dark-muted hidden xl:inline", isRunning && "group-hover/btn:text-amber-500 transition-colors")}>Restart</span>
          </button>
          <button 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors group/btn"
          >
            <Terminal className="w-3.5 h-3.5 text-dark-muted group-hover/btn:text-primary transition-colors" />
            <span className="text-[11px] font-dm-sans font-medium text-dark-muted group-hover/btn:text-primary transition-colors hidden xl:inline">Console</span>
          </button>
          
          {/* More Menu - Only Manage */}
          <div className="relative ml-1">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full hover:bg-dark/[0.04] transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-dark-muted" />
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-surface-1 border border-border rounded-xl shadow-elevated z-20 py-1.5 overflow-hidden">
                  <Link
                    href={routes.dashboard.servers.detail(server.id)}
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] font-dm-sans font-medium text-dark hover:bg-dark/[0.04] transition-colors"
                  >
                    <Settings className="w-4 h-4 text-dark-muted" />
                    Manage Server
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Empty state
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative overflow-hidden rounded-[28px] border border-dashed border-dark/10 bg-dark/[0.01]">
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="w-14 h-14 rounded-full bg-dark/[0.04] border border-dark/[0.06] flex items-center justify-center mb-4">
            <Server className="w-6 h-6 text-dark/40" />
          </div>
          <h3 className="font-google-sans font-semibold text-lg text-dark mb-1.5">
            No servers yet
          </h3>
          <p className="font-outfit text-sm text-dark-muted text-center max-w-xs mb-5">
            Deploy your first cloud server in under 60 seconds
          </p>
          <Link
            href={routes.dashboard.deploy.index}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-dark text-white text-sm font-dm-sans font-medium hover:bg-primary transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            Deploy Server
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-2.5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-5 px-4 py-3.5 bg-surface-1 border border-border rounded-2xl animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-dark/[0.04]" />
          <div className="flex-1">
            <div className="h-4 w-32 bg-dark/[0.04] rounded-full mb-2" />
            <div className="h-3 w-44 bg-dark/[0.04] rounded-full" />
          </div>
          <div className="hidden lg:flex items-center gap-1.5">
            <div className="h-6 w-16 bg-dark/[0.04] rounded-full" />
            <div className="h-6 w-14 bg-dark/[0.04] rounded-full" />
            <div className="h-6 w-16 bg-dark/[0.04] rounded-full" />
          </div>
          <div className="hidden sm:block h-7 w-28 bg-dark/[0.04] rounded-full" />
          <div className="flex items-center gap-1">
            <div className="w-16 h-7 bg-dark/[0.04] rounded-full" />
            <div className="w-16 h-7 bg-dark/[0.04] rounded-full" />
            <div className="w-8 h-8 bg-dark/[0.04] rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { profile } = useAuth();
  const [servers, setServers] = React.useState<ServerWithPlan[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  
  const firstName = profile?.full_name?.split(" ")[0] || profile?.email?.split("@")[0] || "there";
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const fetchServers = React.useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const result = await getUserServers({ limit: 10 });
      setServers(result.servers);
    } catch (error) {
      console.error("Failed to fetch servers:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchServers();
  }, [fetchServers]);

  const handleServerAction = async (serverId: string, action: "start" | "stop" | "restart") => {
    try {
      const result = await performServerAction(serverId, action);
      if (result.success) {
        fetchServers(true);
      }
    } catch (error) {
      console.error(`Failed to ${action} server:`, error);
    }
  };

  // Calculate stats
  const totalServers = servers.length;
  const runningServers = servers.filter(s => s.status === "running").length;
  const totalCores = servers.reduce((acc, s) => acc + (s.plan?.cpu_cores || 0), 0);
  const totalRam = servers.reduce((acc, s) => acc + (s.plan?.ram_gb || 0), 0);
  const totalStorage = servers.reduce((acc, s) => acc + (s.plan?.storage_gb || 0), 0);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="font-outfit text-dark-muted text-sm mb-2">{greeting},</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-google-sans font-semibold text-dark tracking-tight leading-none">
              {firstName}
            </h1>
          </div>
          <Link
            href={routes.dashboard.deploy.index}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-dark text-white text-sm font-dm-sans font-medium hover:bg-primary transition-colors duration-200 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Deploy Server
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
      >
        <div className="col-span-2 p-6 bg-surface-1 border border-border rounded-[28px]">
          <div className="flex items-start justify-between">
            <BentoStat 
              value={totalServers} 
              label="Total Servers" 
              sublabel={runningServers > 0 ? `${runningServers} currently active` : undefined}
              size="large"
            />
            <div className="w-12 h-12 rounded-full bg-dark/[0.04] flex items-center justify-center">
              <Server className="w-5 h-5 text-dark/40" />
            </div>
          </div>
        </div>
        
        <div className="p-5 bg-surface-1 border border-border rounded-[28px]">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-full bg-dark/[0.04] flex items-center justify-center">
              <Cpu className="w-4 h-4 text-dark-muted/60" />
            </div>
          </div>
          <BentoStat value={totalCores} label="vCPU Cores" />
        </div>
        
        <div className="p-5 bg-surface-1 border border-border rounded-[28px]">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-full bg-dark/[0.04] flex items-center justify-center">
              <Layers className="w-4 h-4 text-dark-muted/60" />
            </div>
          </div>
          <BentoStat value={`${totalRam} GB`} label="Memory" />
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
      >
        <QuickLink href={routes.dashboard.servers.list} icon={Server} label="All Servers" />
        <QuickLink href={routes.dashboard.billing.index} icon={Activity} label="Billing" />
        <QuickLink href={routes.dashboard.support.index} icon={Globe} label="Support" />
        <QuickLink href={routes.dashboard.settings.index} icon={Box} label="Settings" />
      </motion.div>

      {/* Servers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <h2 className="font-google-sans font-semibold text-lg text-dark">Your Servers</h2>
            {!loading && servers.length > 0 && (
              <span className="px-2.5 py-1 bg-dark/[0.04] rounded-full text-xs font-dm-sans font-medium text-dark-muted">
                {servers.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchServers(true)}
              disabled={refreshing}
              className={cn(
                "p-2.5 rounded-full transition-colors",
                refreshing ? "opacity-50" : "hover:bg-dark/[0.04]"
              )}
            >
              <RefreshCw className={cn("w-4 h-4 text-dark-muted", refreshing && "animate-spin")} />
            </button>
            {servers.length > 0 && (
              <Link
                href={routes.dashboard.servers.list}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-dm-sans font-medium text-dark-muted hover:text-dark hover:bg-dark/[0.04] transition-colors"
              >
                View all
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Table Header - Desktop only */}
        {!loading && servers.length > 0 && (
          <div className="hidden lg:flex items-center gap-5 px-4 py-2 mb-1">
            <div className="w-10" />
            <div className="flex-1">
              <span className="font-outfit text-[10px] font-medium text-dark-muted/50 uppercase tracking-wider">Server</span>
            </div>
            <div className="w-[156px]">
              <span className="font-outfit text-[10px] font-medium text-dark-muted/50 uppercase tracking-wider">Specs</span>
            </div>
            <div className="w-[120px]">
              <span className="font-outfit text-[10px] font-medium text-dark-muted/50 uppercase tracking-wider">IP Address</span>
            </div>
            <div className="w-[220px]">
              <span className="font-outfit text-[10px] font-medium text-dark-muted/50 uppercase tracking-wider">Actions</span>
            </div>
          </div>
        )}

        {/* Server Rows */}
        <div className="space-y-2.5">
          {loading ? (
            <LoadingSkeleton />
          ) : servers.length > 0 ? (
            servers.map((server, i) => (
              <ServerTableRow 
                key={server.id} 
                server={server} 
                index={i} 
                onAction={handleServerAction}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </motion.div>

      {/* Footer */}
      {!loading && servers.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-dark/[0.04]"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-dark/[0.02] rounded-full text-xs font-outfit text-dark-muted/60">
            <Clock className="w-3.5 h-3.5" />
            <span>Updated just now</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-dark/[0.02] rounded-full text-xs font-outfit text-dark-muted/60">
            <HardDrive className="w-3.5 h-3.5" />
            <span>{totalStorage} GB total storage</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

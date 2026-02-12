"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Server,
  ShoppingCart,
  LifeBuoy,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ArrowUpRight,
  RefreshCw,
  Clock,
  FileText,
  Settings,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import { getAdminDashboardStats, getServerLocations, getRecentOrders, getRecentTickets } from "@/lib/data";
import type { DashboardStats, ServerLocation } from "@/lib/data";

// Bento Stat Card
function BentoStat({ 
  value, 
  label, 
  change,
  trend,
  icon: Icon,
  href,
  size = "default"
}: { 
  value: string | number;
  label: string;
  change?: string;
  trend?: "up" | "down";
  icon: React.ElementType;
  href: string;
  size?: "default" | "large";
}) {
  return (
    <Link href={href} className="group">
      <div className={cn(
        "bg-surface-1 border border-border rounded-[28px] transition-all duration-200",
        "hover:border-dark/10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]",
        size === "large" ? "p-6" : "p-5"
      )}>
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "rounded-full bg-dark/[0.04] flex items-center justify-center",
            size === "large" ? "w-12 h-12" : "w-10 h-10"
          )}>
            <Icon className={cn("text-dark/50", size === "large" ? "w-5 h-5" : "w-4 h-4")} />
          </div>
          {change && trend && (
            <div className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-dm-sans font-semibold",
              trend === "up" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
            )}>
              {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {change}
            </div>
          )}
        </div>
        <p className={cn(
          "font-work-sans font-semibold text-dark tabular-nums mb-1",
          size === "large" ? "text-4xl" : "text-2xl"
        )}>
          {value}
        </p>
        <div className="flex items-center justify-between">
          <p className="font-outfit text-sm text-dark-muted">{label}</p>
          <ArrowUpRight className="w-4 h-4 text-dark-muted/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </Link>
  );
}

// Quick Link
function QuickLink({ href, icon: Icon, label, description }: { href: string; icon: React.ElementType; label: string; description: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 px-4 py-3.5 rounded-2xl",
        "bg-surface-1 border border-border",
        "hover:border-dark/10 hover:shadow-sm transition-all duration-200",
        "group"
      )}
    >
      <div className="w-10 h-10 rounded-full bg-dark/[0.04] flex items-center justify-center group-hover:bg-primary/10 transition-colors">
        <Icon className="w-4 h-4 text-dark-muted group-hover:text-primary transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-dm-sans text-sm font-semibold text-dark">{label}</p>
        <p className="font-outfit text-xs text-dark-muted">{description}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-dark-muted/40 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}

// Activity Row
function ActivityRow({ 
  type, 
  title, 
  subtitle, 
  time, 
  status,
  index 
}: { 
  type: "order" | "ticket";
  title: string;
  subtitle: string;
  time: string;
  status?: string;
  index: number;
}) {
  const icons = { order: ShoppingCart, ticket: LifeBuoy };
  const Icon = icons[type];

  const statusStyles: Record<string, string> = {
    completed: "bg-emerald-500/10 text-emerald-600",
    processing: "bg-blue-500/10 text-blue-600",
    pending: "bg-amber-500/10 text-amber-600",
    failed: "bg-red-500/10 text-red-600",
    open: "bg-blue-500/10 text-blue-600",
    in_progress: "bg-amber-500/10 text-amber-600",
    resolved: "bg-emerald-500/10 text-emerald-600",
    urgent: "bg-red-500 text-white",
    high: "bg-orange-500/10 text-orange-600",
    medium: "bg-amber-500/10 text-amber-600",
    low: "bg-slate-500/10 text-slate-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-dark/[0.02] transition-colors"
    >
      <div className={cn(
        "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
        type === "order" ? "bg-blue-500/10" : "bg-amber-500/10"
      )}>
        <Icon className={cn("w-4 h-4", type === "order" ? "text-blue-600" : "text-amber-600")} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-dm-sans text-sm font-medium text-dark truncate">{title}</p>
        <p className="font-outfit text-xs text-dark-muted truncate">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {status && (
          <span className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-dm-sans font-semibold capitalize",
            statusStyles[status] || "bg-slate-500/10 text-slate-600"
          )}>
            {status.replace("_", " ")}
          </span>
        )}
        <span className="font-outfit text-[11px] text-dark-muted/60">{time}</span>
      </div>
    </motion.div>
  );
}

// Server Location Row
function LocationRow({ location, count, status, index }: { location: string; count: number; status: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-dark/[0.02] transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-2 h-2 rounded-full",
          status === "operational" ? "bg-emerald-500" : status === "degraded" ? "bg-amber-500" : "bg-red-500"
        )} />
        <span className="font-dm-sans text-sm font-medium text-dark">{location}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-outfit text-xs text-dark-muted">{count} servers</span>
        <span className={cn(
          "px-2 py-0.5 rounded-full text-[10px] font-dm-sans font-semibold capitalize",
          status === "operational" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
        )}>
          {status}
        </span>
      </div>
    </motion.div>
  );
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 bg-surface-1 border border-border rounded-[28px] animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-dark/[0.04]" />
              <div className="w-14 h-5 rounded-full bg-dark/[0.04]" />
            </div>
            <div className="h-8 w-20 bg-dark/[0.04] rounded-full mb-2" />
            <div className="h-4 w-24 bg-dark/[0.04] rounded-full" />
          </div>
        ))}
      </div>
      {/* Activity skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {[1, 2].map((i) => (
          <div key={i} className="p-5 bg-surface-1 border border-border rounded-[28px] animate-pulse">
            <div className="h-5 w-32 bg-dark/[0.04] rounded-full mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center gap-4 px-4 py-3">
                  <div className="w-9 h-9 rounded-full bg-dark/[0.04]" />
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-dark/[0.04] rounded-full mb-2" />
                    <div className="h-3 w-24 bg-dark/[0.04] rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Format currency
function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

// Format relative time
function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function AdminDashboard() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [locations, setLocations] = React.useState<ServerLocation[]>([]);
  const [recentOrders, setRecentOrders] = React.useState<any[]>([]);
  const [recentTickets, setRecentTickets] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchData = React.useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const [statsData, locationsData, ordersData, ticketsData] = await Promise.all([
        getAdminDashboardStats(),
        getServerLocations(),
        getRecentOrders(5),
        getRecentTickets(4),
      ]);
      setStats(statsData);
      setLocations(locationsData);
      setRecentOrders(ordersData);
      setRecentTickets(ticketsData);
    } catch (error) {
      console.error("Failed to fetch admin dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <div className="h-4 w-24 bg-dark/[0.04] rounded-full mb-3 animate-pulse" />
          <div className="h-12 w-48 bg-dark/[0.04] rounded-full animate-pulse" />
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

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
              Admin
            </h1>
          </div>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-dark/[0.04] text-dark text-sm font-dm-sans font-medium hover:bg-dark/[0.08] transition-colors self-start sm:self-auto",
              refreshing && "opacity-50"
            )}
          >
            <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
      >
        <BentoStat
          value={stats?.totalUsers || 0}
          label="Total Users"
          change={stats?.userGrowth ? `${stats.userGrowth > 0 ? "+" : ""}${stats.userGrowth}%` : undefined}
          trend={stats?.userGrowth && stats.userGrowth >= 0 ? "up" : "down"}
          icon={Users}
          href={routes.admin.users.list}
        />
        <BentoStat
          value={stats?.activeServers || 0}
          label="Active Servers"
          change={stats?.serverGrowth ? `${stats.serverGrowth > 0 ? "+" : ""}${stats.serverGrowth}%` : undefined}
          trend={stats?.serverGrowth && stats.serverGrowth >= 0 ? "up" : "down"}
          icon={Server}
          href={routes.admin.servers.list}
        />
        <BentoStat
          value={formatCurrency(stats?.monthlyRevenue || 0)}
          label="Monthly Revenue"
          change={stats?.revenueGrowth ? `${stats.revenueGrowth > 0 ? "+" : ""}${stats.revenueGrowth}%` : undefined}
          trend={stats?.revenueGrowth && stats.revenueGrowth >= 0 ? "up" : "down"}
          icon={ShoppingCart}
          href={routes.admin.orders.list}
        />
        <BentoStat
          value={stats?.openTickets || 0}
          label="Open Tickets"
          change={stats?.ticketChange ? `${stats.ticketChange > 0 ? "+" : ""}${stats.ticketChange}%` : undefined}
          trend={stats?.ticketChange && stats.ticketChange <= 0 ? "up" : "down"}
          icon={LifeBuoy}
          href={routes.admin.tickets.list}
        />
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10"
      >
        <QuickLink href={routes.admin.users.list} icon={Users} label="Manage Users" description="View all users" />
        <QuickLink href={routes.admin.servers.list} icon={Server} label="All Servers" description="Server management" />
        <QuickLink href={routes.admin.plans.list} icon={Package} label="Pricing Plans" description="Manage plans" />
        <QuickLink href={routes.admin.settings} icon={Settings} label="Settings" description="System config" />
      </motion.div>

      {/* Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-surface-1 border border-border rounded-[28px] overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
            <h2 className="font-google-sans font-semibold text-base text-dark">Recent Orders</h2>
            <Link
              href={routes.admin.orders.list}
              className="inline-flex items-center gap-1.5 text-xs font-dm-sans font-medium text-dark-muted hover:text-primary transition-colors"
            >
              View all
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border/30">
            {recentOrders.length > 0 ? (
              recentOrders.map((order, i) => (
                <ActivityRow
                  key={order.id}
                  type="order"
                  title={order.order_number}
                  subtitle={order.user?.full_name || order.user?.email || "Unknown user"}
                  time={formatRelativeTime(order.created_at)}
                  status={order.status}
                  index={i}
                />
              ))
            ) : (
              <div className="px-5 py-8 text-center">
                <p className="font-outfit text-sm text-dark-muted">No recent orders</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Tickets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="bg-surface-1 border border-border rounded-[28px] overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
            <h2 className="font-google-sans font-semibold text-base text-dark">Open Tickets</h2>
            <Link
              href={routes.admin.tickets.list}
              className="inline-flex items-center gap-1.5 text-xs font-dm-sans font-medium text-dark-muted hover:text-primary transition-colors"
            >
              View all
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-border/30">
            {recentTickets.length > 0 ? (
              recentTickets.map((ticket, i) => (
                <ActivityRow
                  key={ticket.id}
                  type="ticket"
                  title={ticket.subject}
                  subtitle={ticket.user?.full_name || ticket.user?.email || "Unknown user"}
                  time={formatRelativeTime(ticket.updated_at)}
                  status={ticket.priority}
                  index={i}
                />
              ))
            ) : (
              <div className="px-5 py-8 text-center">
                <p className="font-outfit text-sm text-dark-muted">No open tickets</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Server Locations */}
      {locations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-surface-1 border border-border rounded-[28px] overflow-hidden mb-8"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
            <h2 className="font-google-sans font-semibold text-base text-dark">Server Locations</h2>
            <span className="px-2.5 py-1 bg-dark/[0.04] rounded-full text-xs font-dm-sans font-medium text-dark-muted">
              {locations.length} regions
            </span>
          </div>
          <div className="divide-y divide-border/30">
            {locations.map((loc, i) => (
              <LocationRow
                key={loc.location}
                location={loc.location}
                count={loc.count}
                status={loc.status}
                index={i}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex items-center justify-center gap-4 pt-6 border-t border-dark/[0.04]"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-dark/[0.02] rounded-full text-xs font-outfit text-dark-muted/60">
          <Clock className="w-3.5 h-3.5" />
          <span>Updated just now</span>
        </div>
        <Link
          href={routes.admin.settings}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-dark/[0.02] hover:bg-dark/[0.04] rounded-full text-xs font-outfit text-dark-muted/60 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>System Logs</span>
        </Link>
      </motion.div>
    </div>
  );
}

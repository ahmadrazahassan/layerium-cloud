"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Receipt,
  Wallet,
  Download,
  Plus,
  Check,
  Trash2,
  Edit3,
  Server,
  Monitor,
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  MoreHorizontal,
  RefreshCw,
  FileText,
  Calendar,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUserOrders } from "@/lib/data/orders";
import { getUserServers } from "@/lib/data/servers";
import type { OrderWithDetails, ServerWithPlan } from "@/types/database";

type TabType = "overview" | "invoices" | "payment";
type InvoiceFilter = "all" | "VPS" | "RDP";

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: Wallet },
  { id: "invoices", label: "Invoices", icon: Receipt },
  { id: "payment", label: "Payment", icon: CreditCard },
];

const paymentMethods = [
  { id: 1, type: "visa" as const, last4: "4242", expiry: "12/26", isDefault: true, brand: "Visa" },
  { id: 2, type: "mastercard" as const, last4: "8888", expiry: "08/25", isDefault: false, brand: "Mastercard" },
];

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function PillTabs({ activeTab, onTabChange, invoiceCount }: { activeTab: TabType; onTabChange: (tab: TabType) => void; invoiceCount: number }) {
  return (
    <div className="relative inline-flex items-center p-1.5 bg-dark/[0.03] backdrop-blur-sm rounded-full border border-border">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn("relative flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-dm-sans font-semibold transition-all duration-300", isActive ? "text-white" : "text-dark-muted hover:text-dark")}
          >
            {isActive && <motion.div layoutId="billingActivePill" className="absolute inset-0 bg-dark rounded-full shadow-elevated" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
            <tab.icon className={cn("relative z-10 w-4 h-4 transition-transform duration-300", isActive && "scale-110")} />
            <span className="relative z-10">{tab.label}</span>
            {tab.id === "invoices" && (
              <span className={cn("relative z-10 ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors", isActive ? "bg-white/20 text-white" : "bg-dark/5 text-dark-muted")}>
                {invoiceCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function FilterPills({ active, onChange, orders }: { active: InvoiceFilter; onChange: (filter: InvoiceFilter) => void; orders: OrderWithDetails[] }) {
  const filters: { id: InvoiceFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: orders.length },
    { id: "VPS", label: "VPS", count: orders.filter(o => o.plan?.type === "VPS").length },
    { id: "RDP", label: "RDP", count: orders.filter(o => o.plan?.type === "RDP").length },
  ];

  return (
    <div className="inline-flex items-center p-1 bg-surface-2/60 rounded-full">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onChange(filter.id)}
          className={cn("relative px-4 py-2 rounded-full text-xs font-dm-sans font-semibold transition-all duration-200", active === filter.id ? "bg-white text-dark shadow-soft" : "text-dark-muted hover:text-dark")}
        >
          {filter.label}
          <span className={cn("ml-1.5 px-1.5 py-0.5 rounded-full text-[10px]", active === filter.id ? "bg-dark/10" : "bg-dark/5")}>{filter.count}</span>
        </button>
      ))}
    </div>
  );
}

function StatCard({ label, value, suffix, sub, icon: Icon, color = "default", delay = 0 }: { label: string; value: string | number; suffix?: string; sub: string; icon: React.ElementType; color?: "default" | "blue" | "purple" | "green"; delay?: number }) {
  const colorClasses = { default: "bg-dark/5", blue: "bg-blue-500/10", purple: "bg-purple-500/10", green: "bg-emerald-500/10" };
  const iconColors = { default: "text-dark-muted", blue: "text-blue-500", purple: "text-purple-500", green: "text-emerald-500" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group bg-surface-1 rounded-[28px] border border-border p-6 hover:shadow-elevated hover:border-border-strong transition-all duration-300 cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center", colorClasses[color])}>
          <Icon className={cn("w-5 h-5", iconColors[color])} />
        </div>
        <ChevronRight className="w-4 h-4 text-dark-muted/30 group-hover:text-dark-muted group-hover:translate-x-0.5 transition-all" />
      </div>
      <p className="font-outfit text-sm text-dark-muted mb-1">{label}</p>
      <p className="font-work-sans text-3xl font-bold text-dark tracking-tight">
        {value}{suffix && <span className="text-dark-muted/40 text-xl ml-0.5">{suffix}</span>}
      </p>
      <p className="font-outfit text-sm text-dark-muted mt-1">{sub}</p>
    </motion.div>
  );
}


function ServerRow({ server, index }: { server: ServerWithPlan; index: number }) {
  const isVPS = server.plan?.type === "VPS";
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
      className="px-6 py-5 flex items-center justify-between hover:bg-surface-2/40 transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105", isVPS ? "bg-blue-500/10" : "bg-purple-500/10")}>
          {isVPS ? <Server className="w-5 h-5 text-blue-500" /> : <Monitor className="w-5 h-5 text-purple-500" />}
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-dm-sans font-semibold text-dark">{server.hostname}</span>
            <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-dm-sans font-bold uppercase tracking-wider", isVPS ? "bg-blue-500/10 text-blue-600" : "bg-purple-500/10 text-purple-600")}>
              {server.plan?.type || "VPS"}
            </span>
            <span className={cn("w-2 h-2 rounded-full", server.status === "running" ? "bg-emerald-500" : "bg-red-500")} />
          </div>
          <span className="font-outfit text-sm text-dark-muted">{server.location} • {server.plan?.name}</span>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="text-right">
          <p className="font-work-sans text-lg font-bold text-dark">{formatCurrency(server.plan?.price_usd_cents || 0)}</p>
          <p className="font-outfit text-xs text-dark-muted">per month</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="font-dm-sans text-sm font-medium text-dark">{server.next_billing_date ? formatDate(server.next_billing_date) : "N/A"}</p>
          <p className="font-outfit text-xs text-dark-muted">next billing</p>
        </div>
        <button className="p-2.5 hover:bg-surface-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
          <MoreHorizontal className="w-4 h-4 text-dark-muted" />
        </button>
      </div>
    </motion.div>
  );
}

function InvoiceRow({ order, index, copiedId, onCopy }: { order: OrderWithDetails; index: number; copiedId: string | null; onCopy: (id: string) => void }) {
  const isVPS = order.plan?.type === "VPS";
  const isPaid = order.status === "completed";
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="px-6 py-5 flex items-center justify-between hover:bg-surface-2/40 transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", isVPS ? "bg-blue-500/10" : "bg-purple-500/10")}>
          {isVPS ? <Server className="w-5 h-5 text-blue-500" /> : <Monitor className="w-5 h-5 text-purple-500" />}
        </div>
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-dm-sans font-semibold text-dark">{order.plan?.name || "Order"}</span>
            <button
              onClick={() => onCopy(order.order_number)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-surface-2/60 hover:bg-surface-2 rounded-lg text-[11px] font-mono text-dark-muted hover:text-dark transition-colors"
            >
              {order.order_number}
              {copiedId === order.order_number ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <span className="font-outfit text-sm text-dark-muted">{formatDate(order.created_at)}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="font-work-sans text-lg font-bold text-dark">{formatCurrency(order.total_cents)}</span>
        <span className={cn("hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-dm-sans font-semibold", isPaid ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600")}>
          {isPaid ? <Check className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
          {isPaid ? "Paid" : order.status}
        </span>
        <button className="p-2.5 hover:bg-surface-2 rounded-xl transition-colors">
          <Download className="w-4 h-4 text-dark-muted hover:text-primary transition-colors" />
        </button>
      </div>
    </motion.div>
  );
}

function PaymentCard({ method, index, onSetDefault, onDelete }: { method: typeof paymentMethods[0]; index: number; onSetDefault: (id: number) => void; onDelete: (id: number) => void }) {
  const isVisa = method.type === "visa";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.01 }}
      className={cn("relative flex items-center justify-between p-6 rounded-[24px] border-2 transition-all cursor-pointer", method.isDefault ? "border-primary bg-primary/[0.02] shadow-soft" : "border-border hover:border-dark/20")}
    >
      {method.isDefault && (
        <div className="absolute -top-3 left-6">
          <span className="px-3 py-1 bg-primary text-white text-[10px] font-dm-sans font-bold rounded-full uppercase tracking-wider">Default</span>
        </div>
      )}
      <div className="flex items-center gap-5">
        <div className={cn("w-16 h-11 rounded-xl flex items-center justify-center", isVisa ? "bg-[#1A1F71]" : "bg-[#1A1A1A]")}>
          {isVisa ? (
            <span className="font-bold text-white text-sm italic tracking-wide">VISA</span>
          ) : (
            <div className="flex -space-x-1.5">
              <div className="w-5 h-5 rounded-full bg-[#EB001B]" />
              <div className="w-5 h-5 rounded-full bg-[#F79E1B]" />
            </div>
          )}
        </div>
        <div>
          <p className="font-dm-sans font-semibold text-dark">•••• •••• •••• {method.last4}</p>
          <p className="font-outfit text-sm text-dark-muted">Expires {method.expiry}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!method.isDefault && (
          <button onClick={() => onSetDefault(method.id)} className="px-4 py-2 text-xs font-dm-sans font-semibold text-dark-muted hover:text-dark hover:bg-surface-2 rounded-full transition-colors">
            Set default
          </button>
        )}
        <button onClick={() => onDelete(method.id)} className="p-2.5 hover:bg-red-50 rounded-xl text-dark-muted hover:text-red-500 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}


export default function BillingPage() {
  const [servers, setServers] = React.useState<ServerWithPlan[]>([]);
  const [orders, setOrders] = React.useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<TabType>("overview");
  const [filterType, setFilterType] = React.useState<InvoiceFilter>("all");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [methods, setMethods] = React.useState(paymentMethods);
  const [autoRenewal, setAutoRenewal] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [serversResult, ordersResult] = await Promise.all([
          getUserServers({ limit: 50 }),
          getUserOrders({ limit: 50 }),
        ]);
        setServers(serversResult.servers);
        setOrders(ordersResult.orders);
      } catch (error) {
        console.error("Error fetching billing data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const monthlyTotal = servers.reduce((sum, s) => sum + (s.plan?.price_usd_cents || 0), 0);
  const vpsTotal = servers.filter(s => s.plan?.type === "VPS").reduce((sum, s) => sum + (s.plan?.price_usd_cents || 0), 0);
  const rdpTotal = servers.filter(s => s.plan?.type === "RDP").reduce((sum, s) => sum + (s.plan?.price_usd_cents || 0), 0);
  const lastMonthTotal = monthlyTotal * 0.9; // Simulated
  const percentChange = lastMonthTotal > 0 ? ((monthlyTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(0) : "0";

  const filteredOrders = filterType === "all" ? orders : orders.filter(o => o.plan?.type === filterType);

  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSetDefault = (id: number) => {
    setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
  };

  const handleDeleteMethod = (id: number) => {
    if (methods.length > 1) {
      setMethods(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleExport = () => {
    const data = orders.map(o => ({
      id: o.order_number,
      date: o.created_at,
      plan: o.plan?.name,
      amount: o.total_cents / 100,
      status: o.status,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invoices.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-dark-muted" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="font-outfit text-dark-muted mb-3">
            Billing & Invoices
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-4xl sm:text-5xl lg:text-6xl font-google-sans font-bold text-dark tracking-tight">
            {formatCurrency(monthlyTotal)}<span className="text-dark-muted/30 text-3xl sm:text-4xl">/mo</span>
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-3 mt-3">
            <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-dm-sans font-semibold", Number(percentChange) >= 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-500")}>
              {Number(percentChange) >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {Math.abs(Number(percentChange))}%
            </span>
            <span className="text-sm font-outfit text-dark-muted">vs last month</span>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }} className="flex items-center gap-3">
          <button onClick={handleExport} className="inline-flex items-center gap-2 px-5 py-3 bg-surface-1 border border-border hover:border-dark/20 text-dark rounded-full text-sm font-dm-sans font-semibold transition-all hover:shadow-soft">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="inline-flex items-center gap-2 px-5 py-3 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors shadow-soft">
            <Plus className="w-4 h-4" /> Add Funds
          </button>
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex justify-center mb-12">
        <PillTabs activeTab={activeTab} onTabChange={setActiveTab} invoiceCount={orders.length} />
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Active Servers" value={servers.length} sub={`${servers.filter(s => s.status === "running").length} running`} icon={Server} color="default" delay={0.1} />
              <StatCard label="VPS Servers" value={servers.filter(s => s.plan?.type === "VPS").length} sub={formatCurrency(vpsTotal)} icon={Server} color="blue" delay={0.15} />
              <StatCard label="RDP Servers" value={servers.filter(s => s.plan?.type === "RDP").length} sub={formatCurrency(rdpTotal)} icon={Monitor} color="purple" delay={0.2} />
              <StatCard label="Next Payment" value={servers[0]?.next_billing_date ? formatDate(servers[0].next_billing_date).split(",")[0] : "N/A"} sub={servers[0] ? formatCurrency(servers[0].plan?.price_usd_cents || 0) + " due" : "No servers"} icon={Calendar} color="green" delay={0.25} />
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-surface-1 rounded-[32px] border border-border overflow-hidden">
              <div className="px-6 py-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-google-sans font-semibold text-xl text-dark">Active Servers</h3>
                  <p className="font-outfit text-sm text-dark-muted">Monthly billing breakdown by server</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-4 py-2 bg-surface-2/60 rounded-full text-xs font-dm-sans font-semibold text-dark-muted">{servers.length} servers</span>
                  <span className="px-4 py-2 bg-primary/10 rounded-full text-xs font-dm-sans font-semibold text-primary">{formatCurrency(monthlyTotal)}/mo total</span>
                </div>
              </div>
              {servers.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {servers.map((server, i) => <ServerRow key={server.id} server={server} index={i} />)}
                </div>
              ) : (
                <div className="px-6 py-16 text-center">
                  <Server className="w-12 h-12 text-dark-muted mx-auto mb-4" />
                  <p className="font-dm-sans font-semibold text-dark mb-1">No active servers</p>
                  <p className="font-outfit text-sm text-dark-muted">Deploy a server to see billing information</p>
                </div>
              )}
            </motion.div>

            {orders.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-surface-1 rounded-[32px] border border-border overflow-hidden">
                <div className="px-6 py-6 border-b border-border flex items-center justify-between">
                  <div>
                    <h3 className="font-google-sans font-semibold text-xl text-dark">Recent Payments</h3>
                    <p className="font-outfit text-sm text-dark-muted">Your latest transactions</p>
                  </div>
                  <button onClick={() => setActiveTab("invoices")} className="inline-flex items-center gap-1.5 text-sm font-dm-sans font-semibold text-primary hover:text-primary-hover transition-colors">
                    View all <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="divide-y divide-border/50">
                  {orders.slice(0, 3).map((order, i) => (
                    <div key={order.id} className="px-6 py-5 flex items-center justify-between hover:bg-surface-2/40 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                          <Check className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <span className="font-dm-sans font-semibold text-dark">{order.plan?.name || "Order"}</span>
                          <p className="font-outfit text-sm text-dark-muted">{formatDate(order.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-work-sans text-lg font-bold text-dark">{formatCurrency(order.total_cents)}</span>
                        <button className="p-2.5 hover:bg-surface-2 rounded-xl transition-colors">
                          <Download className="w-4 h-4 text-dark-muted hover:text-primary transition-colors" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === "invoices" && (
          <motion.div key="invoices" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <div className="bg-surface-1 rounded-[32px] border border-border overflow-hidden">
              <div className="px-6 py-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-google-sans font-semibold text-xl text-dark">All Invoices</h3>
                  <p className="font-outfit text-sm text-dark-muted">{filteredOrders.length} invoices found</p>
                </div>
                <div className="flex items-center gap-3">
                  <FilterPills active={filterType} onChange={setFilterType} orders={orders} />
                  <button onClick={handleExport} className="inline-flex items-center justify-center w-11 h-11 bg-dark hover:bg-primary text-white rounded-full transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {filteredOrders.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {filteredOrders.map((order, i) => <InvoiceRow key={order.id} order={order} index={i} copiedId={copiedId} onCopy={copyOrderId} />)}
                </div>
              ) : (
                <div className="px-6 py-16 text-center">
                  <FileText className="w-12 h-12 text-dark-muted mx-auto mb-4" />
                  <p className="font-dm-sans font-semibold text-dark mb-1">No invoices found</p>
                  <p className="font-outfit text-sm text-dark-muted">Try changing your filter</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "payment" && (
          <motion.div key="payment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-6">
            <div className="bg-surface-1 rounded-[32px] border border-border p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-google-sans font-semibold text-xl text-dark">Payment Methods</h3>
                  <p className="font-outfit text-sm text-dark-muted">Manage your payment options</p>
                </div>
                <button className="inline-flex items-center gap-2 px-5 py-3 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors">
                  <Plus className="w-4 h-4" /> Add Card
                </button>
              </div>
              <div className="space-y-4">
                {methods.map((method, i) => <PaymentCard key={method.id} method={method} index={i} onSetDefault={handleSetDefault} onDelete={handleDeleteMethod} />)}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-surface-1 rounded-[32px] border border-border p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-google-sans font-semibold text-xl text-dark">Billing Address</h3>
                  <button className="p-2.5 hover:bg-surface-2 rounded-xl transition-colors">
                    <Edit3 className="w-4 h-4 text-dark-muted" />
                  </button>
                </div>
                <div className="space-y-1.5">
                  <p className="font-dm-sans font-semibold text-dark">Not configured</p>
                  <p className="font-outfit text-dark-muted">Add your billing address</p>
                </div>
                <button className="mt-6 inline-flex items-center gap-2 text-sm font-dm-sans font-semibold text-primary hover:text-primary-hover transition-colors">
                  <Edit3 className="w-4 h-4" /> Add Address
                </button>
              </div>

              <div className="bg-surface-1 rounded-[32px] border border-border p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-google-sans font-semibold text-xl text-dark">Auto-Renewal</h3>
                  <button
                    onClick={() => setAutoRenewal(!autoRenewal)}
                    className={cn("relative w-14 h-8 rounded-full transition-colors duration-300", autoRenewal ? "bg-emerald-500" : "bg-surface-2")}
                  >
                    <motion.div animate={{ x: autoRenewal ? 26 : 4 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-soft" />
                  </button>
                </div>
                <p className="font-outfit text-dark-muted mb-6">
                  {autoRenewal ? "Your servers will automatically renew using your default payment method." : "Auto-renewal is disabled. You'll need to manually renew your servers."}
                </p>
                <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-dm-sans font-semibold", autoRenewal ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600")}>
                  {autoRenewal ? <Check className="w-3 h-3" /> : <RefreshCw className="w-3 h-3" />}
                  {autoRenewal ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

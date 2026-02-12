"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Download,
  DollarSign,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  X,
  Save,
  FileText,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import { getAllOrders, updateOrderStatus, getOrderStats } from "@/lib/data/orders";
import type { OrderWithDetails, OrderStatus } from "@/types/database";

type FilterStatus = "all" | "pending" | "processing" | "completed" | "failed" | "refunded" | "cancelled";

const statusConfig: Record<OrderStatus, { bg: string; text: string; icon: React.ElementType }> = {
  pending: { bg: "bg-amber-500/10", text: "text-amber-600", icon: Clock },
  processing: { bg: "bg-blue-500/10", text: "text-blue-600", icon: RefreshCw },
  completed: { bg: "bg-emerald-500/10", text: "text-emerald-600", icon: CheckCircle2 },
  failed: { bg: "bg-red-500/10", text: "text-red-600", icon: XCircle },
  refunded: { bg: "bg-purple-500/10", text: "text-purple-600", icon: RefreshCw },
  cancelled: { bg: "bg-slate-500/10", text: "text-slate-600", icon: XCircle },
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatCurrency(cents: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

function OrderModal({ order, isOpen, onClose, onSave }: {
  order: OrderWithDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { status: OrderStatus; admin_notes: string }) => void;
}) {
  const [formData, setFormData] = React.useState({ status: "pending" as OrderStatus, admin_notes: "" });
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (order) {
      setFormData({ status: order.status, admin_notes: order.admin_notes || "" });
    }
  }, [order]);

  const handleSave = async () => {
    setSaving(true);
    await onSave(formData);
    setSaving(false);
    onClose();
  };

  if (!isOpen || !order) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-white rounded-[28px] shadow-elevated overflow-hidden">
          <div className="px-8 py-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-google-sans font-semibold text-xl text-dark">Update Order</h2>
                <p className="font-outfit text-sm text-dark-muted mt-1">{order.order_number}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-surface-2 rounded-xl transition-colors"><X className="w-5 h-5 text-dark-muted" /></button>
            </div>
          </div>
          <div className="px-8 py-4 bg-surface-1 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-dm-sans text-sm font-semibold text-dark">{order.user?.full_name || order.user?.email || "Unknown"}</p>
                <p className="font-outfit text-xs text-dark-muted">{order.plan?.name || "N/A"}</p>
              </div>
              <p className="font-work-sans font-bold text-xl text-dark">{formatCurrency(order.total_cents, order.currency)}</p>
            </div>
          </div>
          <div className="px-8 py-6 space-y-5">
            <div>
              <label className="block font-dm-sans text-sm font-medium text-dark mb-2">Order Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as OrderStatus })} className="w-full px-4 py-3 bg-surface-1 border border-border rounded-xl font-outfit text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block font-dm-sans text-sm font-medium text-dark mb-2">Admin Notes</label>
              <textarea value={formData.admin_notes} onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })} rows={4} className="w-full px-4 py-3 bg-surface-1 border border-border rounded-xl font-outfit text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" placeholder="Add internal notes about this order..." />
            </div>
          </div>
          <div className="px-8 py-5 bg-surface-1 border-t border-border flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-6 py-2.5 bg-white border border-border hover:bg-surface-2 rounded-full text-sm font-dm-sans font-semibold text-dark-muted transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors disabled:opacity-50">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : "Update Order"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<FilterStatus>("all");
  const [dropdownOpen, setDropdownOpen] = React.useState<string | null>(null);
  const [editingOrder, setEditingOrder] = React.useState<OrderWithDetails | null>(null);
  const [stats, setStats] = React.useState({ totalRevenue: 0, totalOrders: 0, pendingOrders: 0, completedOrders: 0 });

  const fetchOrders = React.useCallback(async () => {
    setLoading(true);
    try {
      const [ordersResult, statsResult] = await Promise.all([
        getAllOrders({ search: searchQuery || undefined, status: statusFilter === "all" ? "all" : statusFilter as OrderStatus, page, limit: 10 }),
        getOrderStats(),
      ]);
      setOrders(ordersResult.orders);
      setTotal(ordersResult.total);
      setTotalPages(ordersResult.totalPages);
      setStats(statsResult);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, page]);

  React.useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleSaveOrder = async (data: { status: OrderStatus; admin_notes: string }) => {
    if (!editingOrder) return;
    const result = await updateOrderStatus(editingOrder.id, data.status, data.admin_notes);
    if (result.success) fetchOrders();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <OrderModal order={editingOrder} isOpen={!!editingOrder} onClose={() => setEditingOrder(null)} onSave={handleSaveOrder} />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-google-sans font-semibold text-3xl text-dark mb-2">Orders</h1>
          <p className="font-outfit text-dark-muted">Manage customer orders and payments</p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-1 hover:bg-surface-2 border border-border rounded-full text-sm font-dm-sans font-semibold text-dark-muted hover:text-dark transition-colors">
          <Download className="w-4 h-4" /> Export
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface-1 rounded-[20px] border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><DollarSign className="w-5 h-5 text-emerald-500" /></div>
            <span className="font-outfit text-sm text-dark-muted">Total Revenue</span>
          </div>
          <p className="font-work-sans font-bold text-2xl text-dark">{formatCurrency(stats.totalRevenue)}</p>
        </div>
        <div className="bg-surface-1 rounded-[20px] border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><ShoppingCart className="w-5 h-5 text-blue-500" /></div>
            <span className="font-outfit text-sm text-dark-muted">Total Orders</span>
          </div>
          <p className="font-work-sans font-bold text-2xl text-dark">{stats.totalOrders}</p>
        </div>
        <div className="bg-surface-1 rounded-[20px] border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center"><Clock className="w-5 h-5 text-amber-500" /></div>
            <span className="font-outfit text-sm text-dark-muted">Pending</span>
          </div>
          <p className="font-work-sans font-bold text-2xl text-dark">{stats.pendingOrders}</p>
        </div>
        <div className="bg-surface-1 rounded-[20px] border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-primary" /></div>
            <span className="font-outfit text-sm text-dark-muted">Completed</span>
          </div>
          <p className="font-work-sans font-bold text-2xl text-dark">{stats.completedOrders}</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface-1 rounded-[24px] border border-border p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-border">
            <Search className="w-4 h-4 text-dark-muted" />
            <input type="text" placeholder="Search by order number, name, or email..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} className="flex-1 bg-transparent font-outfit text-sm text-dark placeholder:text-dark-muted/50 focus:outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-dark-muted" />
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as FilterStatus); setPage(1); }} className="px-4 py-2.5 bg-white rounded-xl border border-border font-outfit text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-surface-1 rounded-[24px] border border-border overflow-hidden">
        <div className="hidden lg:grid lg:grid-cols-[1.5fr_2fr_1fr_1fr_1.5fr_auto] gap-4 px-6 py-4 bg-surface-2/40 border-b border-border">
          <span className="font-dm-sans text-xs font-semibold text-dark-muted uppercase tracking-wider">Order</span>
          <span className="font-dm-sans text-xs font-semibold text-dark-muted uppercase tracking-wider">Customer</span>
          <span className="font-dm-sans text-xs font-semibold text-dark-muted uppercase tracking-wider">Amount</span>
          <span className="font-dm-sans text-xs font-semibold text-dark-muted uppercase tracking-wider">Status</span>
          <span className="font-dm-sans text-xs font-semibold text-dark-muted uppercase tracking-wider">Date</span>
          <span className="font-dm-sans text-xs font-semibold text-dark-muted uppercase tracking-wider">Actions</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : orders.length > 0 ? (
          <div className="divide-y divide-border/50">
            {orders.map((order) => {
              const statusStyle = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = statusStyle.icon;
              const user = order.user as { email: string; full_name: string | null } | undefined;
              const plan = order.plan as { name: string } | undefined;

              return (
                <div key={order.id} className="grid grid-cols-1 lg:grid-cols-[1.5fr_2fr_1fr_1fr_1.5fr_auto] gap-4 px-6 py-5 hover:bg-surface-2/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-surface-2/60 flex items-center justify-center"><ShoppingCart className="w-5 h-5 text-dark-muted" /></div>
                    <div className="min-w-0">
                      <p className="font-dm-sans text-sm font-semibold text-dark">{order.order_number}</p>
                      <p className="font-outfit text-xs text-dark-muted">{plan?.name || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="min-w-0">
                      <p className="font-dm-sans text-sm font-medium text-dark truncate">{user?.full_name || "Unknown"}</p>
                      <p className="font-outfit text-xs text-dark-muted truncate">{user?.email || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <p className="font-work-sans font-semibold text-dark">{formatCurrency(order.total_cents, order.currency)}</p>
                  </div>
                  <div className="flex items-center">
                    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-dm-sans font-semibold capitalize", statusStyle.bg, statusStyle.text)}>
                      <StatusIcon className="w-3 h-3" />{order.status}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-outfit text-sm text-dark">{formatDate(order.created_at)}</p>
                    {order.admin_notes && <p className="font-outfit text-xs text-dark-muted truncate mt-0.5"><FileText className="w-3 h-3 inline mr-1" />{order.admin_notes}</p>}
                  </div>
                  <div className="flex items-center justify-end gap-2 relative">
                    <button onClick={() => setEditingOrder(order)} className="p-2 hover:bg-primary/10 rounded-xl transition-colors group" title="Edit Order">
                      <Edit className="w-4 h-4 text-dark-muted group-hover:text-primary" />
                    </button>
                    <button onClick={() => setDropdownOpen(dropdownOpen === order.id ? null : order.id)} className="p-2 hover:bg-surface-2 rounded-xl transition-colors">
                      <MoreVertical className="w-4 h-4 text-dark-muted" />
                    </button>
                    {dropdownOpen === order.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-border shadow-elevated z-10 overflow-hidden">
                        <Link href={routes.admin.orders.detail(order.id)} className="flex items-center gap-2.5 px-4 py-3 font-outfit text-sm text-dark hover:bg-surface-2 transition-colors">
                          <Eye className="w-4 h-4" /> View Details
                        </Link>
                        <button className="flex items-center gap-2.5 w-full px-4 py-3 font-outfit text-sm text-dark hover:bg-surface-2 transition-colors">
                          <FileText className="w-4 h-4" /> View Invoice
                        </button>
                        <button className="flex items-center gap-2.5 w-full px-4 py-3 font-outfit text-sm text-dark hover:bg-surface-2 transition-colors">
                          <User className="w-4 h-4" /> View Customer
                        </button>
                        {order.status === "completed" && (
                          <button className="flex items-center gap-2.5 w-full px-4 py-3 font-outfit text-sm text-amber-600 hover:bg-amber-50 transition-colors">
                            <RefreshCw className="w-4 h-4" /> Process Refund
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <ShoppingCart className="w-12 h-12 text-dark-muted mx-auto mb-4" />
            <p className="font-dm-sans font-semibold text-dark mb-1">No orders found</p>
            <p className="font-outfit text-sm text-dark-muted">Try adjusting your search or filter criteria</p>
          </div>
        )}

        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-surface-2/20">
          <p className="font-outfit text-sm text-dark-muted">Showing <span className="font-semibold text-dark">{orders.length}</span> of <span className="font-semibold text-dark">{total}</span> orders</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 hover:bg-surface-2 rounded-xl transition-colors disabled:opacity-50"><ChevronLeft className="w-4 h-4 text-dark-muted" /></button>
            <span className="px-4 py-2 bg-dark text-white rounded-xl text-sm font-dm-sans font-semibold">{page}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 hover:bg-surface-2 rounded-xl transition-colors disabled:opacity-50"><ChevronRight className="w-4 h-4 text-dark-muted" /></button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

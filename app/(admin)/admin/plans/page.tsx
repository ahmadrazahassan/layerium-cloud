"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Cpu,
  HardDrive,
  Network,
  CheckCircle2,
  X,
  Save,
  RefreshCw,
  Server,
  Monitor,
  Star,
  GripVertical,
  Loader2,
  Gauge,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllPlans, createPlan, updatePlan, deletePlan, getPlanStats } from "@/lib/data";
import type { PricingPlan, PlanType, BillingPeriod } from "@/types/database";

type FilterType = "all" | "VPS" | "RDP";
type FilterStatus = "all" | "active" | "inactive";

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

function PlanModal({
  plan,
  isOpen,
  onClose,
  onSave,
}: {
  plan: PricingPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<PricingPlan>) => Promise<void>;
}) {
  const isEditing = !!plan;
  const [formData, setFormData] = React.useState({
    name: "",
    slug: "",
    type: "VPS" as PlanType,
    cpu_cores: 2,
    ram_gb: 4,
    storage_gb: 80,
    bandwidth_tb: 2,
    price_usd_cents: 1499,
    price_pkr_paisa: 500000,
    billing_period: "monthly" as BillingPeriod,
    is_popular: false,
    is_active: true,
    features: [] as string[],
    locations: [] as string[],
  });
  const [newFeature, setNewFeature] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        slug: plan.slug,
        type: plan.type,
        cpu_cores: plan.cpu_cores,
        ram_gb: plan.ram_gb,
        storage_gb: plan.storage_gb,
        bandwidth_tb: plan.bandwidth_tb,
        price_usd_cents: plan.price_usd_cents,
        price_pkr_paisa: plan.price_pkr_paisa,
        billing_period: plan.billing_period,
        is_popular: plan.is_popular,
        is_active: plan.is_active,
        features: plan.features || [],
        locations: plan.locations || [],
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        type: "VPS",
        cpu_cores: 2,
        ram_gb: 4,
        storage_gb: 80,
        bandwidth_tb: 2,
        price_usd_cents: 1499,
        price_pkr_paisa: 500000,
        billing_period: "monthly",
        is_popular: false,
        is_active: true,
        features: [],
        locations: [],
      });
    }
  }, [plan]);

  const handleSave = async () => {
    setSaving(true);
    await onSave(formData);
    setSaving(false);
    onClose();
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl bg-white rounded-[28px] shadow-elevated overflow-hidden max-h-[90vh] flex flex-col">
          <div className="px-8 py-6 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-google-sans font-semibold text-xl text-dark">{isEditing ? "Edit Plan" : "Create New Plan"}</h2>
                <p className="font-outfit text-sm text-dark-muted mt-1">{isEditing ? `Editing ${plan?.name}` : "Add a new pricing plan"}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-surface-2 rounded-xl transition-colors"><X className="w-5 h-5 text-dark-muted" /></button>
            </div>
          </div>
          <div className="px-8 py-6 space-y-5 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-dm-sans text-sm font-medium text-dark mb-2">Plan Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-surface-1 border border-border rounded-xl font-outfit text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Pro VPS" />
              </div>
              <div>
                <label className="block font-dm-sans text-sm font-medium text-dark mb-2">Slug</label>
                <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-3 bg-surface-1 border border-border rounded-xl font-mono text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="pro-vps" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-dm-sans text-sm font-medium text-dark mb-2">Type</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as PlanType })} className="w-full px-4 py-3 bg-surface-1 border border-border rounded-xl font-outfit text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="VPS">VPS</option>
                  <option value="RDP">RDP</option>
                </select>
              </div>
              <div>
                <label className="block font-dm-sans text-sm font-medium text-dark mb-2">Price (USD cents)</label>
                <input type="number" value={formData.price_usd_cents} onChange={(e) => setFormData({ ...formData, price_usd_cents: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 bg-surface-1 border border-border rounded-xl font-mono text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block font-dm-sans text-sm font-medium text-dark mb-2">Billing</label>
                <select value={formData.billing_period} onChange={(e) => setFormData({ ...formData, billing_period: e.target.value as BillingPeriod })} className="w-full px-4 py-3 bg-surface-1 border border-border rounded-xl font-outfit text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block font-dm-sans text-sm font-medium text-dark mb-2">CPU Cores</label>
                <input type="number" value={formData.cpu_cores} onChange={(e) => setFormData({ ...formData, cpu_cores: parseInt(e.target.value) || 1 })} className="w-full px-4 py-3 bg-surface-1 border border-border rounded-xl font-mono text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block font-dm-sans text-sm font-medium text-dark mb-2">RAM (GB)</label>
                <input type="number" value={formData.ram_gb} onChange={(e) => setFormData({ ...formData, ram_gb: parseInt(e.target.value) || 1 })} className="w-full px-4 py-3 bg-surface-1 border border-border rounded-xl font-mono text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block font-dm-sans text-sm font-medium text-dark mb-2">Storage (GB)</label>
                <input type="number" value={formData.storage_gb} onChange={(e) => setFormData({ ...formData, storage_gb: parseInt(e.target.value) || 10 })} className="w-full px-4 py-3 bg-surface-1 border border-border rounded-xl font-mono text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block font-dm-sans text-sm font-medium text-dark mb-2">Bandwidth (TB)</label>
                <input type="number" value={formData.bandwidth_tb} onChange={(e) => setFormData({ ...formData, bandwidth_tb: parseInt(e.target.value) || 1 })} className="w-full px-4 py-3 bg-surface-1 border border-border rounded-xl font-mono text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div>
              <label className="block font-dm-sans text-sm font-medium text-dark mb-2">Features</label>
              <div className="space-y-2 mb-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 px-4 py-2.5 bg-surface-1 rounded-xl">
                    <GripVertical className="w-4 h-4 text-dark-muted" />
                    <span className="flex-1 font-outfit text-sm text-dark">{feature}</span>
                    <button onClick={() => removeFeature(index)} className="p-1 hover:bg-red-50 rounded-lg transition-colors"><X className="w-4 h-4 text-red-500" /></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())} className="flex-1 px-4 py-2.5 bg-surface-1 border border-border rounded-xl font-outfit text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Add a feature..." />
                <button onClick={addFeature} className="px-4 py-2.5 bg-dark hover:bg-primary text-white rounded-xl text-sm font-dm-sans font-semibold transition-colors">Add</button>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20" />
                <span className="font-outfit text-sm text-dark">Active</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.is_popular} onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })} className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20" />
                <span className="font-outfit text-sm text-dark">Mark as Popular</span>
              </label>
            </div>
          </div>
          <div className="px-8 py-5 bg-surface-1 border-t border-border flex items-center justify-end gap-3 flex-shrink-0">
            <button onClick={onClose} className="px-6 py-2.5 bg-white border border-border hover:bg-surface-2 rounded-full text-sm font-dm-sans font-semibold text-dark-muted transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving || !formData.name || !formData.slug} className="inline-flex items-center gap-2 px-6 py-2.5 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors disabled:opacity-50">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : isEditing ? "Update Plan" : "Create Plan"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


export default function AdminPlansPage() {
  const [plans, setPlans] = React.useState<PricingPlan[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<FilterType>("all");
  const [statusFilter, setStatusFilter] = React.useState<FilterStatus>("all");
  const [dropdownOpen, setDropdownOpen] = React.useState<string | null>(null);
  const [editingPlan, setEditingPlan] = React.useState<PricingPlan | null>(null);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [stats, setStats] = React.useState({ totalPlans: 0, activePlans: 0, vpsPlans: 0, rdpPlans: 0 });

  const fetchPlans = React.useCallback(async () => {
    setLoading(true);
    try {
      const [plansResult, statsResult] = await Promise.all([
        getAllPlans({ search: searchQuery || undefined, type: typeFilter === "all" ? undefined : typeFilter, status: statusFilter === "all" ? undefined : statusFilter, page, limit: 10 }),
        getPlanStats(),
      ]);
      setPlans(plansResult.plans);
      setTotal(plansResult.total);
      setTotalPages(plansResult.totalPages);
      setStats(statsResult);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, typeFilter, statusFilter, page]);

  React.useEffect(() => { fetchPlans(); }, [fetchPlans]);

  const handleCreatePlan = async (data: Partial<PricingPlan>) => {
    const result = await createPlan(data as any);
    if (result.success) fetchPlans();
  };

  const handleUpdatePlan = async (data: Partial<PricingPlan>) => {
    if (!editingPlan) return;
    const result = await updatePlan(editingPlan.id, data);
    if (result.success) fetchPlans();
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    const result = await deletePlan(planId);
    if (result.success) fetchPlans();
    setDropdownOpen(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PlanModal plan={editingPlan} isOpen={!!editingPlan} onClose={() => setEditingPlan(null)} onSave={handleUpdatePlan} />
      <PlanModal plan={null} isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSave={handleCreatePlan} />

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-google-sans font-semibold text-3xl text-dark mb-2">Pricing Plans</h1>
          <p className="font-outfit text-dark-muted">Manage VPS and RDP hosting plans</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors">
          <Plus className="w-4 h-4" /> Create Plan
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface-1 rounded-[20px] border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Package className="w-5 h-5 text-blue-500" /></div>
            <span className="font-outfit text-sm text-dark-muted">Total Plans</span>
          </div>
          <p className="font-work-sans font-bold text-2xl text-dark">{stats.totalPlans}</p>
        </div>
        <div className="bg-surface-1 rounded-[20px] border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-emerald-500" /></div>
            <span className="font-outfit text-sm text-dark-muted">Active</span>
          </div>
          <p className="font-work-sans font-bold text-2xl text-dark">{stats.activePlans}</p>
        </div>
        <div className="bg-surface-1 rounded-[20px] border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Server className="w-5 h-5 text-primary" /></div>
            <span className="font-outfit text-sm text-dark-muted">VPS Plans</span>
          </div>
          <p className="font-work-sans font-bold text-2xl text-dark">{stats.vpsPlans}</p>
        </div>
        <div className="bg-surface-1 rounded-[20px] border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center"><Monitor className="w-5 h-5 text-purple-500" /></div>
            <span className="font-outfit text-sm text-dark-muted">RDP Plans</span>
          </div>
          <p className="font-work-sans font-bold text-2xl text-dark">{stats.rdpPlans}</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface-1 rounded-[24px] border border-border p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-border">
            <Search className="w-4 h-4 text-dark-muted" />
            <input type="text" placeholder="Search plans..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} className="flex-1 bg-transparent font-outfit text-sm text-dark placeholder:text-dark-muted/50 focus:outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value as FilterType); setPage(1); }} className="px-4 py-2.5 bg-white rounded-xl border border-border font-outfit text-sm text-dark focus:outline-none">
              <option value="all">All Types</option>
              <option value="VPS">VPS</option>
              <option value="RDP">RDP</option>
            </select>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as FilterStatus); setPage(1); }} className="px-4 py-2.5 bg-white rounded-xl border border-border font-outfit text-sm text-dark focus:outline-none">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-surface-1 rounded-[24px] border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : plans.length > 0 ? (
          <div className="divide-y divide-border/50">
            {plans.map((plan) => (
              <div key={plan.id} className="px-6 py-5 hover:bg-surface-2/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", plan.type === "VPS" ? "bg-blue-500/10" : "bg-purple-500/10")}>
                      {plan.type === "VPS" ? <Server className="w-5 h-5 text-blue-500" /> : <Monitor className="w-5 h-5 text-purple-500" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-dm-sans font-semibold text-dark">{plan.name}</p>
                        {plan.is_popular && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-dm-sans font-semibold", plan.is_active ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-500/10 text-slate-600")}>{plan.is_active ? "Active" : "Inactive"}</span>
                      </div>
                      <p className="font-mono text-xs text-dark-muted">{plan.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-dark-muted" /><span className="font-mono text-dark">{plan.cpu_cores}</span></div>
                      <div className="flex items-center gap-1.5"><Gauge className="w-4 h-4 text-dark-muted" /><span className="font-mono text-dark">{plan.ram_gb}GB</span></div>
                      <div className="flex items-center gap-1.5"><HardDrive className="w-4 h-4 text-dark-muted" /><span className="font-mono text-dark">{plan.storage_gb}GB</span></div>
                      <div className="flex items-center gap-1.5"><Network className="w-4 h-4 text-dark-muted" /><span className="font-mono text-dark">{plan.bandwidth_tb}TB</span></div>
                    </div>
                    <p className="font-work-sans font-bold text-lg text-dark">{formatCurrency(plan.price_usd_cents)}<span className="text-dark-muted text-sm font-normal">/mo</span></p>
                    <div className="flex items-center gap-2 relative">
                      <button onClick={() => setEditingPlan(plan)} className="p-2 hover:bg-primary/10 rounded-xl transition-colors"><Edit className="w-4 h-4 text-dark-muted hover:text-primary" /></button>
                      <button onClick={() => setDropdownOpen(dropdownOpen === plan.id ? null : plan.id)} className="p-2 hover:bg-surface-2 rounded-xl transition-colors"><MoreVertical className="w-4 h-4 text-dark-muted" /></button>
                      {dropdownOpen === plan.id && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl border border-border shadow-elevated z-10 overflow-hidden">
                          <button onClick={() => { setEditingPlan(plan); setDropdownOpen(null); }} className="flex items-center gap-2.5 w-full px-4 py-3 font-outfit text-sm text-dark hover:bg-surface-2 transition-colors"><Edit className="w-4 h-4" /> Edit</button>
                          <button onClick={() => handleDeletePlan(plan.id)} className="flex items-center gap-2.5 w-full px-4 py-3 font-outfit text-sm text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /> Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-dark-muted mx-auto mb-4" />
            <p className="font-dm-sans font-semibold text-dark mb-1">No plans found</p>
            <p className="font-outfit text-sm text-dark-muted">Create your first pricing plan</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

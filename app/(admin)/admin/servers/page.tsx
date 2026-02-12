"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Search,
  MoreVertical,
  Globe,
  Cpu,
  HardDrive,
  Play,
  Square,
  RotateCcw,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  User,
  Lock,
  Network,
  Copy,
  Check,
  X,
  Save,
  EyeOff,
  Loader2,
  Plus,
  Key,
  Monitor,
  CheckCircle2,
  AlertCircle,
  Clock,
  Users,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import { 
  getAllServers, 
  updateServerCredentials, 
  updateServerStatus, 
  deleteServer,
  allocateServerToUser,
  getUsersForAllocation,
  getPlansForAllocation,
  getDatacentersForAllocation,
  getOSTemplatesForAllocation,
} from "@/lib/data/servers";
import type { ServerWithPlan, ServerStatus } from "@/types/database";

type FilterStatus = "all" | "running" | "stopped" | "error";

// IP Address validation helper
function isValidIPAddress(ip: string): boolean {
  if (!ip) return false;
  const parts = ip.split(".");
  if (parts.length !== 4) return false;
  return parts.every(part => {
    const num = parseInt(part, 10);
    return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString();
  });
}

const statusColors: Record<ServerStatus, { bg: string; text: string; dot: string }> = {
  running: { bg: "bg-emerald-500/10", text: "text-emerald-600", dot: "bg-emerald-500" },
  stopped: { bg: "bg-slate-500/10", text: "text-slate-600", dot: "bg-slate-500" },
  provisioning: { bg: "bg-blue-500/10", text: "text-blue-600", dot: "bg-blue-500" },
  restarting: { bg: "bg-amber-500/10", text: "text-amber-600", dot: "bg-amber-500" },
  error: { bg: "bg-red-500/10", text: "text-red-600", dot: "bg-red-500" },
  suspended: { bg: "bg-orange-500/10", text: "text-orange-600", dot: "bg-orange-500" },
};

// Modern Pill Button
function PillButton({ 
  children, 
  variant = "default", 
  size = "md",
  icon: Icon,
  onClick,
  disabled,
  className,
}: { 
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ElementType;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const variants = {
    default: "bg-surface-2/60 hover:bg-surface-2 text-dark-muted hover:text-dark border border-transparent",
    primary: "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-[0_4px_14px_rgba(255,85,51,0.25)] hover:shadow-[0_6px_20px_rgba(255,85,51,0.35)]",
    success: "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-[0_4px_14px_rgba(16,185,129,0.25)]",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-[0_4px_14px_rgba(239,68,68,0.25)]",
    ghost: "bg-transparent hover:bg-surface-2/60 text-dark-muted hover:text-dark",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-sm gap-2.5",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center font-dm-sans font-semibold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {Icon && <Icon className={cn(size === "sm" ? "w-3 h-3" : "w-4 h-4")} />}
      {children}
    </button>
  );
}

// Filter Pills Component
function FilterPills<T extends string>({ 
  options, 
  value, 
  onChange,
  labels,
}: { 
  options: T[];
  value: T;
  onChange: (v: T) => void;
  labels?: Record<T, string>;
}) {
  return (
    <div className="inline-flex p-1 bg-surface-1 rounded-full border border-border/50">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={cn(
            "relative px-4 py-2 rounded-full text-xs font-dm-sans font-semibold transition-all duration-300",
            value === option ? "text-white" : "text-dark-muted hover:text-dark"
          )}
        >
          {value === option && (
            <motion.div
              layoutId="serverFilterPill"
              className="absolute inset-0 bg-dark rounded-full"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10 capitalize">{labels?.[option] || option}</span>
        </button>
      ))}
    </div>
  );
}

// Credential Edit Modal
function CredentialModal({ server, isOpen, onClose, onSave }: {
  server: ServerWithPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { ip_address: string; username: string; password: string; rdp_port: number; ssh_port: number }) => Promise<void>;
}) {
  const [formData, setFormData] = React.useState({ ip_address: "", username: "", password: "", rdp_port: 3389, ssh_port: 22 });
  const [showPassword, setShowPassword] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (server) {
      setFormData({
        ip_address: server.ip_address || "",
        username: server.username || "Administrator",
        password: server.password || "",
        rdp_port: server.rdp_port || 3389,
        ssh_port: server.ssh_port || 22,
      });
    }
  }, [server]);

  const handleSave = async () => {
    setSaving(true);
    await onSave(formData);
    setSaving(false);
    onClose();
  };

  if (!isOpen || !server) return null;
  const isWindows = server.os_template.toLowerCase().includes("windows");

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-white rounded-[32px] shadow-elevated overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-blue-500/5 to-primary/5 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Key className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-google-sans font-semibold text-xl text-dark">Edit Credentials</h2>
                  <p className="font-outfit text-sm text-dark-muted">{server.hostname}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2.5 hover:bg-surface-2 rounded-xl transition-colors"><X className="w-5 h-5 text-dark-muted" /></button>
            </div>
          </div>
          <div className="px-8 py-6 space-y-5">
            <div>
              <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">IP Address</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                <input type="text" value={formData.ip_address} onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-surface-1 border border-border rounded-xl font-mono text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="192.168.1.1" />
              </div>
            </div>
            <div>
              <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-surface-1 border border-border rounded-xl font-outfit text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Administrator" />
              </div>
            </div>
            <div>
              <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                <input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full pl-11 pr-12 py-3 bg-surface-1 border border-border rounded-xl font-mono text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Enter password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-surface-2 rounded-lg transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4 text-dark-muted" /> : <Eye className="w-4 h-4 text-dark-muted" />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">{isWindows ? "RDP Port" : "SSH Port"}</label>
                <div className="relative">
                  <Network className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                  <input type="number" value={isWindows ? formData.rdp_port : formData.ssh_port} onChange={(e) => setFormData({ ...formData, [isWindows ? "rdp_port" : "ssh_port"]: parseInt(e.target.value) || 0 })} className="w-full pl-11 pr-4 py-3 bg-surface-1 border border-border rounded-xl font-mono text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
              </div>
              <div>
                <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">{isWindows ? "SSH Port" : "RDP Port"}</label>
                <div className="relative">
                  <Network className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                  <input type="number" value={isWindows ? formData.ssh_port : formData.rdp_port} onChange={(e) => setFormData({ ...formData, [isWindows ? "ssh_port" : "rdp_port"]: parseInt(e.target.value) || 0 })} className="w-full pl-11 pr-4 py-3 bg-surface-1 border border-border rounded-xl font-mono text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
              </div>
            </div>
          </div>
          <div className="px-8 py-5 bg-surface-1 border-t border-border flex items-center justify-end gap-3">
            <PillButton variant="ghost" onClick={onClose}>Cancel</PillButton>
            <PillButton variant="primary" icon={saving ? Loader2 : Save} onClick={handleSave} disabled={saving} className={saving ? "[&>svg]:animate-spin" : ""}>
              {saving ? "Saving..." : "Save Changes"}
            </PillButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


// Server Allocation Modal
function AllocateServerModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [users, setUsers] = React.useState<Array<{ id: string; email: string; full_name: string | null }>>([]);
  const [plans, setPlans] = React.useState<Array<{ id: string; name: string; type: string; cpu_cores: number; ram_gb: number; storage_gb: number }>>([]);
  const [datacenters, setDatacenters] = React.useState<Array<{ code: string; name: string; country: string }>>([]);
  const [osTemplates, setOsTemplates] = React.useState<Array<{ code: string; full_name: string; family: string }>>([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [step, setStep] = React.useState(1);
  
  const [formData, setFormData] = React.useState({
    user_id: "",
    plan_id: "",
    hostname: "",
    ip_address: "",
    location: "",
    os_template: "",
    username: "",
    password: "",
    rdp_port: 3389,
    ssh_port: 22,
  });

  React.useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setStep(1);
      Promise.all([
        getUsersForAllocation(),
        getPlansForAllocation(),
        getDatacentersForAllocation(),
      ]).then(([usersData, plansData, dcData]) => {
        setUsers(usersData);
        setPlans(plansData);
        setDatacenters(dcData);
        setLoading(false);
      });
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (formData.plan_id) {
      const plan = plans.find(p => p.id === formData.plan_id);
      if (plan) {
        getOSTemplatesForAllocation(plan.type).then(setOsTemplates);
        setFormData(prev => ({
          ...prev,
          username: plan.type === "RDP" ? "Administrator" : "root",
        }));
      }
    }
  }, [formData.plan_id, plans]);

  const selectedUser = users.find(u => u.id === formData.user_id);
  const selectedPlan = plans.find(p => p.id === formData.plan_id);

  const handleSubmit = async () => {
    if (!formData.user_id || !formData.plan_id || !formData.hostname || !formData.ip_address || !formData.location || !formData.os_template) {
      return;
    }
    
    setSaving(true);
    const result = await allocateServerToUser({
      user_id: formData.user_id,
      plan_id: formData.plan_id,
      hostname: formData.hostname,
      ip_address: formData.ip_address,
      location: formData.location,
      os_template: formData.os_template,
      username: formData.username,
      password: formData.password,
      rdp_port: formData.rdp_port,
      ssh_port: formData.ssh_port,
    });
    
    setSaving(false);
    
    if (result.success) {
      onSuccess();
      onClose();
      setFormData({
        user_id: "",
        plan_id: "",
        hostname: "",
        ip_address: "",
        location: "",
        os_template: "",
        username: "",
        password: "",
        rdp_port: 3389,
        ssh_port: 22,
      });
      setStep(1);
    } else {
      alert(result.error || "Failed to allocate server");
    }
  };

  const canProceedStep1 = formData.user_id && formData.plan_id;
  const canProceedStep2 = formData.hostname && formData.ip_address && isValidIPAddress(formData.ip_address) && formData.location && formData.os_template;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl bg-white rounded-[32px] shadow-elevated overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-primary/5 to-emerald-500/5 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                  <Server className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="font-google-sans font-semibold text-xl text-dark">Allocate New Server</h2>
                  <p className="font-outfit text-sm text-dark-muted">
                    Provision a server for a user
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2.5 hover:bg-surface-2 rounded-xl transition-colors">
                <X className="w-5 h-5 text-dark-muted" />
              </button>
            </div>
            
            {/* Step Indicator */}
            <div className="flex items-center gap-3 mt-6">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-dm-sans font-semibold transition-all",
                    step >= s ? "bg-dark text-white" : "bg-surface-2 text-dark-muted"
                  )}>
                    {step > s ? <Check className="w-4 h-4" /> : s}
                  </div>
                  <span className={cn(
                    "font-outfit text-sm hidden sm:block",
                    step >= s ? "text-dark" : "text-dark-muted"
                  )}>
                    {s === 1 ? "User & Plan" : s === 2 ? "Server Details" : "Credentials"}
                  </span>
                  {s < 3 && <div className={cn("w-8 h-0.5 rounded-full", step > s ? "bg-dark" : "bg-surface-2")} />}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6 space-y-6 overflow-y-auto flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Step 1: User & Plan Selection */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* User Selection */}
                    <div>
                      <label className="block font-dm-sans text-sm font-semibold text-dark mb-3">Select User</label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                        <select
                          value={formData.user_id}
                          onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                          className="w-full pl-11 pr-4 py-3.5 bg-surface-1 border border-border rounded-xl font-outfit text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Choose a user...</option>
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.full_name || user.email} ({user.email})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Plan Selection */}
                    <div>
                      <label className="block font-dm-sans text-sm font-semibold text-dark mb-3">Select Plan</label>
                      <div className="grid grid-cols-2 gap-3">
                        {plans.map((plan) => (
                          <button
                            key={plan.id}
                            onClick={() => setFormData({ ...formData, plan_id: plan.id })}
                            className={cn(
                              "p-4 rounded-2xl border-2 text-left transition-all duration-300",
                              formData.plan_id === plan.id
                                ? "border-primary bg-primary/5 shadow-[0_0_0_4px_rgba(255,85,51,0.1)]"
                                : "border-border hover:border-primary/30 hover:bg-surface-1"
                            )}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                plan.type === "VPS" ? "bg-blue-500/10" : "bg-purple-500/10"
                              )}>
                                {plan.type === "VPS" ? <Server className="w-5 h-5 text-blue-500" /> : <Monitor className="w-5 h-5 text-purple-500" />}
                              </div>
                              <div>
                                <span className="font-dm-sans font-semibold text-dark block">{plan.name}</span>
                                <span className="font-outfit text-xs text-dark-muted">{plan.type}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-outfit text-dark-muted mt-3 pt-3 border-t border-border/50">
                              <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5" />{plan.cpu_cores} vCPU</span>
                              <span className="flex items-center gap-1"><HardDrive className="w-3.5 h-3.5" />{plan.ram_gb}GB RAM</span>
                              <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" />{plan.storage_gb}GB</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Server Details */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    {/* Summary */}
                    <div className="p-4 bg-surface-1 rounded-2xl border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-dm-sans text-sm font-semibold text-dark">{selectedUser?.full_name || selectedUser?.email}</p>
                          <p className="font-outfit text-xs text-dark-muted">{selectedPlan?.name} • {selectedPlan?.type}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">Hostname</label>
                        <input
                          type="text"
                          value={formData.hostname}
                          onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
                          className="w-full px-4 py-3 bg-surface-1 border border-border rounded-xl font-outfit text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          placeholder="my-server"
                        />
                      </div>
                      <div>
                        <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">IP Address</label>
                        <input
                          type="text"
                          value={formData.ip_address}
                          onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                          className={cn(
                            "w-full px-4 py-3 bg-surface-1 border rounded-xl font-mono text-sm text-dark focus:outline-none focus:ring-2 transition-all",
                            formData.ip_address && !isValidIPAddress(formData.ip_address)
                              ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                              : "border-border focus:ring-primary/20 focus:border-primary"
                          )}
                          placeholder="192.168.1.1"
                        />
                        {formData.ip_address && !isValidIPAddress(formData.ip_address) && (
                          <p className="mt-1.5 text-xs font-outfit text-red-500">Invalid IP address (each octet must be 0-255)</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">Location</label>
                        <select
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full px-4 py-3 bg-surface-1 border border-border rounded-xl font-outfit text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        >
                          <option value="">Select location...</option>
                          {datacenters.map((dc) => (
                            <option key={dc.code} value={dc.name}>{dc.name}, {dc.country}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">OS Template</label>
                        <select
                          value={formData.os_template}
                          onChange={(e) => setFormData({ ...formData, os_template: e.target.value })}
                          className="w-full px-4 py-3 bg-surface-1 border border-border rounded-xl font-outfit text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          disabled={!formData.plan_id}
                        >
                          <option value="">Select OS...</option>
                          {osTemplates.map((os) => (
                            <option key={os.code} value={os.full_name}>{os.full_name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Credentials */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    {/* Summary */}
                    <div className="p-4 bg-gradient-to-r from-surface-1 to-surface-2/50 rounded-2xl border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <Server className="w-5 h-5 text-emerald-500" />
                          </div>
                          <div>
                            <p className="font-dm-sans text-sm font-semibold text-dark">{formData.hostname}</p>
                            <p className="font-mono text-xs text-dark-muted">{formData.ip_address} • {formData.location}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-dm-sans font-semibold">
                          {formData.os_template}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 bg-surface-1 rounded-2xl border border-border">
                      <div className="flex items-center gap-2 mb-4">
                        <Key className="w-4 h-4 text-primary" />
                        <span className="font-dm-sans text-sm font-semibold text-dark">Server Credentials</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-outfit text-xs text-dark-muted mb-1.5">Username</label>
                          <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full px-3 py-2.5 bg-white border border-border rounded-xl font-mono text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder={selectedPlan?.type === "RDP" ? "Administrator" : "root"}
                          />
                        </div>
                        <div>
                          <label className="block font-outfit text-xs text-dark-muted mb-1.5">Password</label>
                          <input
                            type="text"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-3 py-2.5 bg-white border border-border rounded-xl font-mono text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="Enter password"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <label className="block font-outfit text-xs text-dark-muted mb-1.5">
                            {selectedPlan?.type === "RDP" ? "RDP Port" : "SSH Port"}
                          </label>
                          <input
                            type="number"
                            value={selectedPlan?.type === "RDP" ? formData.rdp_port : formData.ssh_port}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              [selectedPlan?.type === "RDP" ? "rdp_port" : "ssh_port"]: parseInt(e.target.value) || 0 
                            })}
                            className="w-full px-3 py-2.5 bg-white border border-border rounded-xl font-mono text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div>
                          <label className="block font-outfit text-xs text-dark-muted mb-1.5">
                            {selectedPlan?.type === "RDP" ? "SSH Port" : "RDP Port"}
                          </label>
                          <input
                            type="number"
                            value={selectedPlan?.type === "RDP" ? formData.ssh_port : formData.rdp_port}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              [selectedPlan?.type === "RDP" ? "ssh_port" : "rdp_port"]: parseInt(e.target.value) || 0 
                            })}
                            className="w-full px-3 py-2.5 bg-white border border-border rounded-xl font-mono text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-dm-sans text-sm font-semibold text-amber-800">Important</p>
                        <p className="font-outfit text-xs text-amber-700">The server will be immediately available to the user after allocation. Make sure all credentials are correct.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-5 bg-surface-1 border-t border-border flex items-center justify-between">
            <div>
              {step > 1 && (
                <PillButton variant="ghost" icon={ChevronLeft} onClick={() => setStep(s => s - 1)}>
                  Back
                </PillButton>
              )}
            </div>
            <div className="flex items-center gap-3">
              <PillButton variant="ghost" onClick={onClose}>Cancel</PillButton>
              {step < 3 ? (
                <PillButton 
                  variant="primary" 
                  icon={ChevronRight}
                  onClick={() => setStep(s => s + 1)}
                  disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
                >
                  Continue
                </PillButton>
              ) : (
                <PillButton 
                  variant="success" 
                  icon={saving ? Loader2 : CheckCircle2}
                  onClick={handleSubmit}
                  disabled={saving || !formData.username}
                  className={saving ? "[&>svg]:animate-spin" : ""}
                >
                  {saving ? "Allocating..." : "Allocate Server"}
                </PillButton>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


// Main Admin Servers Page
export default function AdminServersPage() {
  const [servers, setServers] = React.useState<ServerWithPlan[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<FilterStatus>("all");
  const [dropdownOpen, setDropdownOpen] = React.useState<string | null>(null);
  const [editingServer, setEditingServer] = React.useState<ServerWithPlan | null>(null);
  const [showAllocateModal, setShowAllocateModal] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  const fetchServers = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllServers({
        search: searchQuery || undefined,
        status: statusFilter === "all" ? "all" : statusFilter as ServerStatus,
        page,
        limit: 10,
      });
      setServers(result.servers);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Error fetching servers:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, page]);

  React.useEffect(() => { fetchServers(); }, [fetchServers]);

  const handleCopyIP = async (id: string, ip: string) => {
    await navigator.clipboard.writeText(ip);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveCredentials = async (data: { ip_address: string; username: string; password: string; rdp_port: number; ssh_port: number }) => {
    if (!editingServer) return;
    const result = await updateServerCredentials(editingServer.id, data);
    if (result.success) fetchServers();
  };

  const handleStatusChange = async (serverId: string, newStatus: ServerStatus) => {
    setActionLoading(serverId);
    const result = await updateServerStatus(serverId, newStatus);
    if (result.success) fetchServers();
    setDropdownOpen(null);
    setActionLoading(null);
  };

  const handleDelete = async (serverId: string) => {
    if (!confirm("Are you sure you want to delete this server? This action cannot be undone.")) return;
    setActionLoading(serverId);
    const result = await deleteServer(serverId);
    if (result.success) fetchServers();
    setDropdownOpen(null);
    setActionLoading(null);
  };

  // Stats
  const runningCount = servers.filter(s => s.status === "running").length;
  const stoppedCount = servers.filter(s => s.status === "stopped").length;
  const errorCount = servers.filter(s => s.status === "error" || s.status === "suspended").length;

  return (
    <div className="max-w-7xl mx-auto">
      <CredentialModal server={editingServer} isOpen={!!editingServer} onClose={() => setEditingServer(null)} onSave={handleSaveCredentials} />
      <AllocateServerModal isOpen={showAllocateModal} onClose={() => setShowAllocateModal(false)} onSuccess={fetchServers} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-google-sans font-semibold text-3xl text-dark mb-2">Server Management</h1>
            <p className="font-outfit text-dark-muted">Manage all servers, credentials, and allocations</p>
          </div>
          <div className="flex items-center gap-3">
            <PillButton variant="ghost" icon={Download}>Export</PillButton>
            <PillButton variant="primary" icon={Plus} onClick={() => setShowAllocateModal(true)}>
              Allocate Server
            </PillButton>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-surface-1 rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Server className="w-5 h-5 text-blue-500" />
            </div>
            <span className="font-outfit text-sm text-dark-muted">Total Servers</span>
          </div>
          <p className="font-work-sans font-bold text-2xl text-dark">{total}</p>
        </div>
        <div className="bg-surface-1 rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="font-outfit text-sm text-dark-muted">Running</span>
          </div>
          <p className="font-work-sans font-bold text-2xl text-dark">{runningCount}</p>
        </div>
        <div className="bg-surface-1 rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-slate-500" />
            </div>
            <span className="font-outfit text-sm text-dark-muted">Stopped</span>
          </div>
          <p className="font-work-sans font-bold text-2xl text-dark">{stoppedCount}</p>
        </div>
        <div className="bg-surface-1 rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <span className="font-outfit text-sm text-dark-muted">Issues</span>
          </div>
          <p className="font-work-sans font-bold text-2xl text-dark">{errorCount}</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }}
        className="bg-surface-1 rounded-[24px] border border-border p-6 mb-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search by hostname, IP, or user..."
              className="w-full pl-11 pr-4 py-3 bg-surface-2/60 border border-transparent focus:border-primary/30 rounded-xl font-outfit text-sm text-dark placeholder:text-dark-muted focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center gap-3">
            <span className="font-dm-sans text-xs font-semibold text-dark-muted">Status:</span>
            <FilterPills
              options={["all", "running", "stopped", "error"] as FilterStatus[]}
              value={statusFilter}
              onChange={(v) => { setStatusFilter(v); setPage(1); }}
              labels={{ all: "All", running: "Running", stopped: "Stopped", error: "Error" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Servers Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }}
        className="bg-surface-1 rounded-[24px] border border-border overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : servers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Server className="w-12 h-12 text-dark-muted/30 mb-4" />
            <p className="font-dm-sans font-semibold text-dark mb-1">No servers found</p>
            <p className="font-outfit text-sm text-dark-muted mb-6">Try adjusting your search or allocate a new server</p>
            <PillButton variant="primary" icon={Plus} onClick={() => setShowAllocateModal(true)}>
              Allocate Server
            </PillButton>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="hidden lg:grid lg:grid-cols-[2fr_1.5fr_1fr_1fr_1.5fr_auto] gap-4 px-6 py-4 bg-surface-2/40 border-b border-border">
              <span className="font-dm-sans text-xs font-semibold text-dark-muted uppercase tracking-wider">Server</span>
              <span className="font-dm-sans text-xs font-semibold text-dark-muted uppercase tracking-wider">IP / Credentials</span>
              <span className="font-dm-sans text-xs font-semibold text-dark-muted uppercase tracking-wider">Status</span>
              <span className="font-dm-sans text-xs font-semibold text-dark-muted uppercase tracking-wider">Specs</span>
              <span className="font-dm-sans text-xs font-semibold text-dark-muted uppercase tracking-wider">Owner</span>
              <span className="font-dm-sans text-xs font-semibold text-dark-muted uppercase tracking-wider">Actions</span>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border/50">
              {servers.map((server) => {
                const statusStyle = statusColors[server.status] || statusColors.stopped;
                const isWindows = server.os_template.toLowerCase().includes("windows");
                const user = server.user as { id: string; email: string; full_name: string | null } | undefined;

                return (
                  <div key={server.id} className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr_1fr_1fr_1.5fr_auto] gap-4 px-6 py-5 hover:bg-surface-2/30 transition-colors">
                    {/* Server Info */}
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center",
                        isWindows ? "bg-blue-500/10" : "bg-orange-500/10"
                      )}>
                        {isWindows ? <Monitor className="w-5 h-5 text-blue-500" /> : <Server className="w-5 h-5 text-orange-500" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-dm-sans text-sm font-semibold text-dark truncate">{server.hostname}</p>
                        <p className="font-outfit text-xs text-dark-muted truncate">{server.os_template} • {server.location}</p>
                      </div>
                    </div>

                    {/* IP / Credentials */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-sm text-dark">{server.ip_address || "Not assigned"}</code>
                        {server.ip_address && (
                          <button onClick={() => handleCopyIP(server.id, server.ip_address!)} className="p-1 hover:bg-surface-2 rounded-lg transition-colors">
                            {copiedId === server.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-dark-muted" />}
                          </button>
                        )}
                      </div>
                      <p className="font-outfit text-xs text-dark-muted">{server.username || "N/A"} • {isWindows ? `RDP:${server.rdp_port || 3389}` : `SSH:${server.ssh_port || 22}`}</p>
                    </div>

                    {/* Status */}
                    <div className="flex items-center">
                      <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-dm-sans font-semibold capitalize", statusStyle.bg, statusStyle.text)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", statusStyle.dot, server.status === "running" && "animate-pulse")} />
                        {server.status}
                      </span>
                    </div>

                    {/* Specs */}
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 text-xs font-outfit text-dark-muted"><Cpu className="w-3.5 h-3.5" /> {server.plan?.cpu_cores || 0}</span>
                      <span className="inline-flex items-center gap-1 text-xs font-outfit text-dark-muted"><HardDrive className="w-3.5 h-3.5" /> {server.plan?.ram_gb || 0}GB</span>
                    </div>

                    {/* Owner */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="font-dm-sans font-bold text-xs text-primary">
                          {(user?.full_name || user?.email || "?").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-dm-sans text-sm font-medium text-dark truncate">{user?.full_name || "Unknown"}</p>
                        <p className="font-outfit text-xs text-dark-muted truncate">{user?.email || "N/A"}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 relative">
                      {actionLoading === server.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      ) : (
                        <>
                          <button onClick={() => setEditingServer(server)} className="p-2 hover:bg-primary/10 rounded-xl transition-colors group" title="Edit Credentials">
                            <Edit className="w-4 h-4 text-dark-muted group-hover:text-primary" />
                          </button>
                          <button onClick={() => setDropdownOpen(dropdownOpen === server.id ? null : server.id)} className="p-2 hover:bg-surface-2 rounded-xl transition-colors">
                            <MoreVertical className="w-4 h-4 text-dark-muted" />
                          </button>
                        </>
                      )}
                      
                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {dropdownOpen === server.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-border shadow-elevated z-50 overflow-hidden"
                          >
                            <div className="p-2">
                              <Link href={routes.admin.servers.detail(server.id)} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-1 rounded-xl transition-colors">
                                <Eye className="w-4 h-4 text-dark-muted" />
                                <span className="font-dm-sans text-sm text-dark">View Details</span>
                              </Link>
                              <button onClick={() => handleStatusChange(server.id, server.status === "running" ? "stopped" : "running")} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-1 rounded-xl transition-colors text-left">
                                {server.status === "running" ? <Square className="w-4 h-4 text-amber-500" /> : <Play className="w-4 h-4 text-emerald-500" />}
                                <span className="font-dm-sans text-sm text-dark">{server.status === "running" ? "Stop Server" : "Start Server"}</span>
                              </button>
                              <button onClick={() => handleStatusChange(server.id, "restarting")} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-1 rounded-xl transition-colors text-left">
                                <RotateCcw className="w-4 h-4 text-blue-500" />
                                <span className="font-dm-sans text-sm text-dark">Restart</span>
                              </button>
                              <div className="h-px bg-border my-2" />
                              <button onClick={() => handleDelete(server.id)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl transition-colors text-left">
                                <Trash2 className="w-4 h-4 text-red-500" />
                                <span className="font-dm-sans text-sm text-red-600">Delete Server</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <p className="font-outfit text-sm text-dark-muted">
                Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, total)} of {total} servers
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 hover:bg-surface-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 text-dark-muted" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={cn(
                          "w-9 h-9 rounded-xl font-dm-sans text-sm font-semibold transition-all",
                          page === pageNum
                            ? "bg-dark text-white"
                            : "hover:bg-surface-2 text-dark-muted"
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 hover:bg-surface-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4 text-dark-muted" />
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

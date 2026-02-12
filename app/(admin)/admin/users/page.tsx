"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  MoreVertical,
  Mail,
  ShieldCheck,
  ShieldOff,
  Ban,
  CheckCircle2,
  Server,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Download,
  Loader2,
  X,
  Plus,
  Cpu,
  HardDrive,
  Globe,
  Key,
  Activity,
  Clock,
  Phone,
  Building2,
  Save,
  AlertCircle,
  User,
  Monitor,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUsers, updateUser } from "@/lib/data/users";
import { 
  allocateServerToUser, 
  getPlansForAllocation, 
  getDatacentersForAllocation, 
  getOSTemplatesForAllocation 
} from "@/lib/data/servers";
import type { ProfileWithUser } from "@/types/database";

type FilterStatus = "all" | "active" | "inactive";
type FilterRole = "all" | "USER" | "ADMIN";

// IP validation helper
function isValidIPAddress(ip: string): boolean {
  if (!ip) return false;
  const parts = ip.split(".");
  if (parts.length !== 4) return false;
  return parts.every(part => {
    const num = parseInt(part, 10);
    return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString();
  });
}

function formatRelativeTime(dateString: string | null) {
  if (!dateString) return "Never";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

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
    primary: "bg-dark hover:bg-primary text-white",
    success: "bg-emerald-500 hover:bg-emerald-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
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
              layoutId="userFilterPill"
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


// Edit User Modal
function EditUserModal({ user, isOpen, onClose, onSave }: {
  user: ProfileWithUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ProfileWithUser>) => Promise<void>;
}) {
  const [formData, setFormData] = React.useState({ full_name: "", phone: "", company_name: "", notes: "" });
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (user) setFormData({ 
      full_name: user.full_name || "", 
      phone: user.phone || "", 
      company_name: user.company_name || "", 
      notes: user.notes || "" 
    });
  }, [user]);

  const handleSave = async () => { 
    setSaving(true); 
    await onSave(formData); 
    setSaving(false); 
    onClose(); 
  };

  if (!isOpen || !user) return null;

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
          className="w-full max-w-lg bg-white rounded-[24px] shadow-elevated overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Edit className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="font-google-sans font-semibold text-xl text-dark">Edit User</h2>
                  <p className="font-outfit text-sm text-dark-muted">{user.email}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2.5 hover:bg-surface-2 rounded-xl transition-colors">
                <X className="w-5 h-5 text-dark-muted" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                <input 
                  type="text" 
                  value={formData.full_name} 
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} 
                  className="w-full pl-11 pr-4 py-3 bg-surface-1 border border-border rounded-xl font-outfit text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                  placeholder="John Doe" 
                />
              </div>
            </div>
            <div>
              <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                <input 
                  type="tel" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                  className="w-full pl-11 pr-4 py-3 bg-surface-1 border border-border rounded-xl font-outfit text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                  placeholder="+1 234 567 8900" 
                />
              </div>
            </div>
            <div>
              <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">Company</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                <input 
                  type="text" 
                  value={formData.company_name} 
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} 
                  className="w-full pl-11 pr-4 py-3 bg-surface-1 border border-border rounded-xl font-outfit text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                  placeholder="Acme Inc." 
                />
              </div>
            </div>
            <div>
              <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">Admin Notes</label>
              <textarea 
                value={formData.notes} 
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })} 
                rows={3} 
                className="w-full px-4 py-3 bg-surface-1 border border-border rounded-xl font-outfit text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" 
                placeholder="Internal notes..." 
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-surface-1 border-t border-border flex items-center justify-end gap-3">
            <PillButton variant="ghost" onClick={onClose}>Cancel</PillButton>
            <PillButton 
              variant="primary" 
              icon={saving ? Loader2 : Save} 
              onClick={handleSave} 
              disabled={saving}
              className={saving ? "[&>svg]:animate-spin" : ""}
            >
              {saving ? "Saving..." : "Save Changes"}
            </PillButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


// Server Allocation Modal
function AllocateServerModal({ user, isOpen, onClose, onSuccess }: {
  user: ProfileWithUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [plans, setPlans] = React.useState<Array<{ id: string; name: string; type: string; cpu_cores: number; ram_gb: number; storage_gb: number }>>([]);
  const [datacenters, setDatacenters] = React.useState<Array<{ code: string; name: string; country: string }>>([]);
  const [osTemplates, setOsTemplates] = React.useState<Array<{ code: string; full_name: string; family: string }>>([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({ 
    plan_id: "", hostname: "", ip_address: "", location: "", os_template: "", 
    username: "", password: "", rdp_port: 3389, ssh_port: 22 
  });

  React.useEffect(() => {
    if (isOpen) {
      setLoading(true); 
      setStep(1);
      Promise.all([getPlansForAllocation(), getDatacentersForAllocation()])
        .then(([p, d]) => { setPlans(p); setDatacenters(d); setLoading(false); });
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (formData.plan_id) {
      const plan = plans.find(p => p.id === formData.plan_id);
      if (plan) {
        getOSTemplatesForAllocation(plan.type).then(setOsTemplates);
        setFormData(prev => ({ ...prev, username: plan.type === "RDP" ? "Administrator" : "root" }));
      }
    }
  }, [formData.plan_id, plans]);

  const selectedPlan = plans.find(p => p.id === formData.plan_id);
  const isValidIP = !formData.ip_address || isValidIPAddress(formData.ip_address);

  const handleSubmit = async () => {
    if (!user || !formData.plan_id || !formData.hostname || !formData.ip_address || !formData.location || !formData.os_template) return;
    if (!isValidIPAddress(formData.ip_address)) { alert("Please enter a valid IP address"); return; }
    setSaving(true);
    const result = await allocateServerToUser({ 
      user_id: user.id, plan_id: formData.plan_id, hostname: formData.hostname, 
      ip_address: formData.ip_address, location: formData.location, os_template: formData.os_template, 
      username: formData.username, password: formData.password, rdp_port: formData.rdp_port, ssh_port: formData.ssh_port 
    });
    setSaving(false);
    if (result.success) { 
      onSuccess(); 
      onClose(); 
      setFormData({ plan_id: "", hostname: "", ip_address: "", location: "", os_template: "", username: "", password: "", rdp_port: 3389, ssh_port: 22 }); 
      setStep(1); 
    } else {
      alert(result.error || "Failed to allocate server");
    }
  };

  const canProceedStep1 = formData.plan_id;
  const canProceedStep2 = formData.hostname && formData.ip_address && isValidIPAddress(formData.ip_address) && formData.location && formData.os_template;

  if (!isOpen || !user) return null;

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
          className="w-full max-w-2xl bg-white rounded-[24px] shadow-elevated overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Server className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-google-sans font-semibold text-xl text-dark">Allocate Server</h2>
                  <p className="font-outfit text-sm text-dark-muted">For {user.full_name || user.email}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2.5 hover:bg-surface-2 rounded-xl transition-colors">
                <X className="w-5 h-5 text-dark-muted" />
              </button>
            </div>
            
            {/* Step Indicator */}
            <div className="flex items-center gap-3 mt-5">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-dm-sans font-semibold transition-all",
                    step >= s ? "bg-dark text-white" : "bg-surface-2 text-dark-muted"
                  )}>
                    {step > s ? <Check className="w-4 h-4" /> : s}
                  </div>
                  <span className={cn("font-outfit text-sm hidden sm:block", step >= s ? "text-dark" : "text-dark-muted")}>
                    {s === 1 ? "Plan" : s === 2 ? "Details" : "Credentials"}
                  </span>
                  {s < 3 && <div className={cn("w-8 h-0.5 rounded-full", step > s ? "bg-dark" : "bg-surface-2")} />}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Step 1: Plan Selection */}
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <p className="font-dm-sans text-sm font-semibold text-dark">Select a Plan</p>
                    <div className="grid grid-cols-2 gap-3">
                      {plans.map((plan) => (
                        <button 
                          key={plan.id} 
                          onClick={() => setFormData({ ...formData, plan_id: plan.id })} 
                          className={cn(
                            "p-4 rounded-2xl border-2 text-left transition-all duration-300", 
                            formData.plan_id === plan.id 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/30 hover:bg-surface-1"
                          )}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", plan.type === "VPS" ? "bg-blue-500/10" : "bg-purple-500/10")}>
                              {plan.type === "VPS" ? <Server className="w-5 h-5 text-blue-500" /> : <Monitor className="w-5 h-5 text-purple-500" />}
                            </div>
                            <div>
                              <p className="font-dm-sans font-semibold text-dark">{plan.name}</p>
                              <p className="font-outfit text-xs text-dark-muted">{plan.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-xs font-outfit text-dark-muted">
                            <span className="flex items-center gap-1"><Cpu className="w-3 h-3" />{plan.cpu_cores}C</span>
                            <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" />{plan.ram_gb}GB</span>
                            <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{plan.storage_gb}GB</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Server Details */}
                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
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
                            !isValidIP ? "border-red-300 focus:ring-red-200" : "border-border focus:ring-primary/20 focus:border-primary"
                          )} 
                          placeholder="192.168.1.1" 
                        />
                        {!isValidIP && <p className="mt-1 text-xs text-red-500">Invalid IP (each octet 0-255)</p>}
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
                          <option value="">Select...</option>
                          {datacenters.map((dc) => <option key={dc.code} value={dc.name}>{dc.name}, {dc.country}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">OS Template</label>
                        <select 
                          value={formData.os_template} 
                          onChange={(e) => setFormData({ ...formData, os_template: e.target.value })} 
                          className="w-full px-4 py-3 bg-surface-1 border border-border rounded-xl font-outfit text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        >
                          <option value="">Select...</option>
                          {osTemplates.map((os) => <option key={os.code} value={os.full_name}>{os.full_name}</option>)}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Credentials */}
                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div className="p-4 bg-surface-1 rounded-2xl border border-border">
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
                          <label className="block font-outfit text-xs text-dark-muted mb-1.5">{selectedPlan?.type === "RDP" ? "RDP Port" : "SSH Port"}</label>
                          <input 
                            type="number" 
                            value={selectedPlan?.type === "RDP" ? formData.rdp_port : formData.ssh_port} 
                            onChange={(e) => setFormData({ ...formData, [selectedPlan?.type === "RDP" ? "rdp_port" : "ssh_port"]: parseInt(e.target.value) || 0 })} 
                            className="w-full px-3 py-2.5 bg-white border border-border rounded-xl font-mono text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20" 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="font-outfit text-xs text-amber-700">Server will be immediately available to the user after allocation.</p>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-surface-1 border-t border-border flex items-center justify-between flex-shrink-0">
            <div>
              {step > 1 && (
                <PillButton variant="ghost" icon={ChevronLeft} onClick={() => setStep(s => s - 1)}>Back</PillButton>
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


// Main Admin Users Page
export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<ProfileWithUser[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<FilterStatus>("all");
  const [roleFilter, setRoleFilter] = React.useState<FilterRole>("all");
  const [dropdownOpen, setDropdownOpen] = React.useState<string | null>(null);
  const [editingUser, setEditingUser] = React.useState<ProfileWithUser | null>(null);
  const [allocatingUser, setAllocatingUser] = React.useState<ProfileWithUser | null>(null);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await getUsers({
        search: searchQuery || undefined,
        status: statusFilter,
        role: roleFilter,
        page,
        limit: 10,
      });
      setUsers(result.users);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, roleFilter, page]);

  React.useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSaveUser = async (data: Partial<ProfileWithUser>) => {
    if (!editingUser) return;
    await updateUser(editingUser.id, data);
    fetchUsers();
  };

  const handleChangeRole = async (userId: string, currentRole: string) => {
    setActionLoading(userId);
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    await updateUser(userId, { role: newRole as "USER" | "ADMIN" });
    fetchUsers();
    setDropdownOpen(null);
    setActionLoading(null);
  };

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    setActionLoading(userId);
    await updateUser(userId, { is_active: !isActive });
    fetchUsers();
    setDropdownOpen(null);
    setActionLoading(null);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    setActionLoading(userId);
    await updateUser(userId, { is_active: false });
    fetchUsers();
    setDropdownOpen(null);
    setActionLoading(null);
  };

  // Stats
  const activeCount = users.filter(u => u.is_active).length;
  const adminCount = users.filter(u => u.role === "ADMIN").length;
  const totalServers = users.reduce((acc, u) => acc + (u.servers_count || 0), 0);

  return (
    <div className="max-w-7xl mx-auto">
      <EditUserModal user={editingUser} isOpen={!!editingUser} onClose={() => setEditingUser(null)} onSave={handleSaveUser} />
      <AllocateServerModal user={allocatingUser} isOpen={!!allocatingUser} onClose={() => setAllocatingUser(null)} onSuccess={fetchUsers} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-google-sans font-semibold text-3xl text-dark mb-2">User Management</h1>
            <p className="font-outfit text-dark-muted">Manage users, roles, and server allocations</p>
          </div>
          <div className="flex items-center gap-3">
            <PillButton variant="ghost" icon={Download}>Export</PillButton>
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
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <span className="font-outfit text-sm text-dark-muted">Total Users</span>
          </div>
          <p className="font-work-sans font-bold text-2xl text-dark">{total}</p>
        </div>
        <div className="bg-surface-1 rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="font-outfit text-sm text-dark-muted">Active</span>
          </div>
          <p className="font-work-sans font-bold text-2xl text-dark">{activeCount}</p>
        </div>
        <div className="bg-surface-1 rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
            </div>
            <span className="font-outfit text-sm text-dark-muted">Admins</span>
          </div>
          <p className="font-work-sans font-bold text-2xl text-dark">{adminCount}</p>
        </div>
        <div className="bg-surface-1 rounded-2xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Server className="w-5 h-5 text-purple-500" />
            </div>
            <span className="font-outfit text-sm text-dark-muted">Total Servers</span>
          </div>
          <p className="font-work-sans font-bold text-2xl text-dark">{totalServers}</p>
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
              placeholder="Search by name or email..."
              className="w-full pl-11 pr-4 py-3 bg-surface-2/60 border border-transparent focus:border-primary/30 rounded-xl font-outfit text-sm text-dark placeholder:text-dark-muted focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center gap-3">
            <span className="font-dm-sans text-xs font-semibold text-dark-muted">Status:</span>
            <FilterPills
              options={["all", "active", "inactive"] as FilterStatus[]}
              value={statusFilter}
              onChange={(v) => { setStatusFilter(v); setPage(1); }}
              labels={{ all: "All", active: "Active", inactive: "Inactive" }}
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-3">
            <span className="font-dm-sans text-xs font-semibold text-dark-muted">Role:</span>
            <FilterPills
              options={["all", "USER", "ADMIN"] as FilterRole[]}
              value={roleFilter}
              onChange={(v) => { setRoleFilter(v); setPage(1); }}
              labels={{ all: "All", USER: "User", ADMIN: "Admin" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
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
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Users className="w-12 h-12 text-dark-muted/30 mb-4" />
            <p className="font-dm-sans font-semibold text-dark mb-1">No users found</p>
            <p className="font-outfit text-sm text-dark-muted">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="hidden lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 bg-surface-2/40 border-b border-border">
              <span className="font-dm-sans text-xs font-semibold text-dark-muted uppercase tracking-wider">User</span>
              <span className="font-dm-sans text-xs font-semibold text-dark-muted uppercase tracking-wider">Role</span>
              <span className="font-dm-sans text-xs font-semibold text-dark-muted uppercase tracking-wider">Status</span>
              <span className="font-dm-sans text-xs font-semibold text-dark-muted uppercase tracking-wider">Resources</span>
              <span className="font-dm-sans text-xs font-semibold text-dark-muted uppercase tracking-wider">Last Active</span>
              <span className="font-dm-sans text-xs font-semibold text-dark-muted uppercase tracking-wider">Actions</span>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border/50">
              {users.map((user) => {
                const userInitial = (user.full_name || user.email).charAt(0).toUpperCase();
                const colors = ["bg-blue-500/10 text-blue-600", "bg-purple-500/10 text-purple-600", "bg-emerald-500/10 text-emerald-600", "bg-amber-500/10 text-amber-600"];
                const colorIndex = user.email.charCodeAt(0) % colors.length;

                return (
                  <div key={user.id} className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-5 hover:bg-surface-2/30 transition-colors">
                    {/* User Info */}
                    <div className="flex items-center gap-4">
                      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", colors[colorIndex].split(" ")[0])}>
                        <span className={cn("font-dm-sans font-bold text-sm", colors[colorIndex].split(" ")[1])}>{userInitial}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-dm-sans text-sm font-semibold text-dark truncate">{user.full_name || "No name"}</p>
                        <p className="font-outfit text-xs text-dark-muted truncate">{user.email}</p>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="flex items-center">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-dm-sans font-semibold",
                        user.role === "ADMIN" ? "bg-amber-500/10 text-amber-600" : "bg-slate-500/10 text-slate-600"
                      )}>
                        {user.role === "ADMIN" ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-dm-sans font-semibold",
                        user.is_active ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", user.is_active ? "bg-emerald-500" : "bg-red-500")} />
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Resources */}
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-outfit text-dark-muted">
                        <Server className="w-3.5 h-3.5" /> {user.servers_count || 0} servers
                      </span>
                    </div>

                    {/* Last Active */}
                    <div className="flex items-center">
                      <span className="inline-flex items-center gap-1.5 text-xs font-outfit text-dark-muted">
                        <Clock className="w-3.5 h-3.5" /> {formatRelativeTime(user.last_login_at)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 relative">
                      {actionLoading === user.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      ) : (
                        <>
                          <button 
                            onClick={() => setAllocatingUser(user)} 
                            className="p-2 hover:bg-primary/10 rounded-xl transition-colors group" 
                            title="Allocate Server"
                          >
                            <Plus className="w-4 h-4 text-dark-muted group-hover:text-primary" />
                          </button>
                          <button 
                            onClick={() => setEditingUser(user)} 
                            className="p-2 hover:bg-blue-500/10 rounded-xl transition-colors group" 
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4 text-dark-muted group-hover:text-blue-500" />
                          </button>
                          <button 
                            onClick={() => setDropdownOpen(dropdownOpen === user.id ? null : user.id)} 
                            className="p-2 hover:bg-surface-2 rounded-xl transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-dark-muted" />
                          </button>
                        </>
                      )}
                      
                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {dropdownOpen === user.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-border shadow-elevated z-50 overflow-hidden"
                          >
                            <div className="p-2">
                              <button 
                                onClick={() => { setAllocatingUser(user); setDropdownOpen(null); }} 
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-1 rounded-xl transition-colors text-left"
                              >
                                <Server className="w-4 h-4 text-primary" />
                                <span className="font-dm-sans text-sm text-dark">Allocate Server</span>
                              </button>
                              <button 
                                onClick={() => handleChangeRole(user.id, user.role)} 
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-1 rounded-xl transition-colors text-left"
                              >
                                {user.role === "ADMIN" ? (
                                  <><ShieldOff className="w-4 h-4 text-amber-500" /><span className="font-dm-sans text-sm text-dark">Demote to User</span></>
                                ) : (
                                  <><ShieldCheck className="w-4 h-4 text-blue-500" /><span className="font-dm-sans text-sm text-dark">Promote to Admin</span></>
                                )}
                              </button>
                              <button 
                                onClick={() => handleToggleStatus(user.id, user.is_active)} 
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-1 rounded-xl transition-colors text-left"
                              >
                                {user.is_active ? (
                                  <><Ban className="w-4 h-4 text-amber-500" /><span className="font-dm-sans text-sm text-dark">Suspend User</span></>
                                ) : (
                                  <><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span className="font-dm-sans text-sm text-dark">Activate User</span></>
                                )}
                              </button>
                              <div className="h-px bg-border my-2" />
                              <button 
                                onClick={() => handleDeleteUser(user.id)} 
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl transition-colors text-left"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                                <span className="font-dm-sans text-sm text-red-600">Delete User</span>
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
                Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, total)} of {total} users
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
                          page === pageNum ? "bg-dark text-white" : "hover:bg-surface-2 text-dark-muted"
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

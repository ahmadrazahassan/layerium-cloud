"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Bell,
  Shield,
  Key,
  Globe,
  Smartphone,
  LogOut,
  Trash2,
  Check,
  Eye,
  EyeOff,
  Camera,
  Copy,
  Plus,
  Monitor,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { 
  updateCurrentUser, 
  updateUserPassword,
  getUserSSHKeys,
  getUserSessions,
  addSSHKey,
  removeSSHKey,
} from "@/lib/data/users";

type TabType = "profile" | "security" | "notifications";

interface SSHKey {
  id: number;
  name: string;
  fingerprint: string;
  created_at: string;
}

interface Session {
  id: number;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
];

function Toggle({ enabled, onChange, disabled }: { enabled: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={cn(
        "relative w-12 h-7 rounded-full transition-colors duration-300",
        enabled ? "bg-emerald-500" : "bg-surface-2",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <motion.div
        animate={{ x: enabled ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-soft"
      />
    </button>
  );
}

function SettingRow({ 
  icon: Icon, 
  title, 
  description, 
  children,
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-surface-2/60 flex items-center justify-center">
          <Icon className="w-5 h-5 text-dark-muted" />
        </div>
        <div>
          <p className="font-dm-sans font-semibold text-dark">{title}</p>
          <p className="font-outfit text-sm text-dark-muted">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = React.useState<TabType>("profile");
  const [showPassword, setShowPassword] = React.useState(false);
  const [copied, setCopied] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Form state
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [timezone, setTimezone] = React.useState("UTC");
  
  // Notification preferences
  const [emailNotifs, setEmailNotifs] = React.useState(true);
  const [securityAlerts, setSecurityAlerts] = React.useState(true);
  const [pushNotifs, setPushNotifs] = React.useState(true);
  const [marketingNotifs, setMarketingNotifs] = React.useState(false);
  
  // SSH Keys and Sessions
  const [sshKeys, setSSHKeys] = React.useState<SSHKey[]>([]);
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [loadingKeys, setLoadingKeys] = React.useState(true);
  
  // Password change
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = React.useState(false);
  
  // New SSH Key modal
  const [showAddKeyModal, setShowAddKeyModal] = React.useState(false);
  const [newKeyName, setNewKeyName] = React.useState("");
  const [newKeyValue, setNewKeyValue] = React.useState("");

  // Initialize form with profile data
  React.useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setCompanyName(profile.company_name || "");
      setTimezone(profile.timezone || "UTC");
      setEmailNotifs(profile.email_notifications ?? true);
      setMarketingNotifs(profile.marketing_emails ?? false);
    }
  }, [profile]);

  // Fetch SSH keys and sessions
  React.useEffect(() => {
    const fetchData = async () => {
      setLoadingKeys(true);
      try {
        const [keys, sess] = await Promise.all([
          getUserSSHKeys(),
          getUserSessions(),
        ]);
        setSSHKeys(keys);
        setSessions(sess);
      } catch (err) {
        console.error("Error fetching settings data:", err);
      } finally {
        setLoadingKeys(false);
      }
    };
    fetchData();
  }, []);

  const copyFingerprint = (id: string, fingerprint: string) => {
    navigator.clipboard.writeText(fingerprint);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);
    
    try {
      const result = await updateCurrentUser({
        full_name: fullName,
        phone: phone || undefined,
        company_name: companyName || undefined,
        timezone,
        email_notifications: emailNotifs,
        marketing_emails: marketingNotifs,
      });
      
      if (result.success) {
        setSaveSuccess(true);
        await refreshProfile();
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(result.error || "Failed to save changes");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(false);
    
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    
    setSaving(true);
    try {
      const result = await updateUserPassword(newPassword);
      if (result.success) {
        setPasswordSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        setPasswordError(result.error || "Failed to update password");
      }
    } catch (err) {
      setPasswordError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSSHKey = async () => {
    if (!newKeyName.trim() || !newKeyValue.trim()) return;
    
    setSaving(true);
    try {
      const result = await addSSHKey(newKeyName, newKeyValue);
      if (result.success) {
        const keys = await getUserSSHKeys();
        setSSHKeys(keys);
        setShowAddKeyModal(false);
        setNewKeyName("");
        setNewKeyValue("");
      }
    } catch (err) {
      console.error("Error adding SSH key:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveSSHKey = async (keyId: number) => {
    try {
      const result = await removeSSHKey(keyId);
      if (result.success) {
        setSSHKeys(prev => prev.filter(k => k.id !== keyId));
      }
    } catch (err) {
      console.error("Error removing SSH key:", err);
    }
  };

  const userInitial = profile?.full_name?.charAt(0) || profile?.email?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-google-sans font-semibold text-dark tracking-tight leading-[1.1] mb-6">
          Settings
        </h1>
        <p className="font-outfit text-lg text-dark-muted">
          Manage your account settings and preferences.
        </p>
      </motion.div>

      {/* Modern Pill Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex justify-center mb-14"
      >
        <div className="relative inline-flex items-center p-1.5 bg-dark/[0.03] backdrop-blur-sm rounded-full border border-border">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-dm-sans font-semibold transition-all duration-300",
                  isActive ? "text-white" : "text-dark-muted hover:text-dark"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="settingsActivePill"
                    className="absolute inset-0 bg-dark rounded-full shadow-elevated"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <tab.icon className={cn(
                  "relative z-10 w-4 h-4 transition-transform duration-300",
                  isActive && "scale-110"
                )} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Profile Card */}
            <div className="bg-surface-1 rounded-[32px] border border-border p-8">
              <h3 className="font-google-sans font-semibold text-xl text-dark mb-8">Profile Information</h3>
              
              {/* Avatar */}
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-dark flex items-center justify-center">
                    <span className="font-google-sans font-bold text-3xl text-white">
                      {userInitial}
                    </span>
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary hover:bg-primary-hover text-white rounded-full flex items-center justify-center transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <p className="font-google-sans font-semibold text-xl text-dark">
                    {profile?.full_name || "User"}
                  </p>
                  <p className="font-outfit text-dark-muted">{profile?.email || "user@example.com"}</p>
                </div>
              </div>

              {/* Success/Error Messages */}
              {saveSuccess && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span className="font-outfit text-emerald-700">Changes saved successfully!</span>
                </div>
              )}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="font-outfit text-red-700">{error}</span>
                </div>
              )}

              {/* Form */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full h-12 px-5 bg-surface-2/60 border border-border rounded-full font-outfit text-dark placeholder:text-dark-muted/50 focus:outline-none focus:border-primary/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profile?.email || ""}
                    disabled
                    className="w-full h-12 px-5 bg-surface-2/60 border border-border rounded-full font-outfit text-dark-muted cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone"
                    className="w-full h-12 px-5 bg-surface-2/60 border border-border rounded-full font-outfit text-dark placeholder:text-dark-muted/50 focus:outline-none focus:border-primary/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company name"
                    className="w-full h-12 px-5 bg-surface-2/60 border border-border rounded-full font-outfit text-dark placeholder:text-dark-muted/50 focus:outline-none focus:border-primary/30 transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">Timezone</label>
                  <div className="relative">
                    <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted" />
                    <select 
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full h-12 pl-14 pr-5 bg-surface-2/60 border border-border rounded-full font-outfit text-dark appearance-none focus:outline-none focus:border-primary/30 transition-colors cursor-pointer"
                    >
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="America/New_York">EST (Eastern Standard Time)</option>
                      <option value="America/Los_Angeles">PST (Pacific Standard Time)</option>
                      <option value="Europe/London">GMT (Greenwich Mean Time)</option>
                      <option value="Asia/Karachi">PKT (Pakistan Standard Time)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSaveProfile}
                disabled={saving}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} 
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-surface-1 rounded-[32px] border-2 border-red-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="font-google-sans font-semibold text-xl text-red-600">Danger Zone</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-5 bg-red-50/50 rounded-[20px]">
                  <div className="flex items-center gap-4">
                    <LogOut className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-dm-sans font-semibold text-dark">Sign Out Everywhere</p>
                      <p className="font-outfit text-sm text-dark-muted">Sign out from all devices</p>
                    </div>
                  </div>
                  <button className="px-5 py-2.5 bg-white hover:bg-red-500 hover:text-white text-red-600 border border-red-200 rounded-full text-sm font-dm-sans font-semibold transition-colors">
                    Sign Out All
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-5 bg-red-50/50 rounded-[20px]">
                  <div className="flex items-center gap-4">
                    <Trash2 className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-dm-sans font-semibold text-dark">Delete Account</p>
                      <p className="font-outfit text-sm text-dark-muted">Permanently delete your account</p>
                    </div>
                  </div>
                  <button className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-dm-sans font-semibold transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "security" && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Password */}
            <div className="bg-surface-1 rounded-[32px] border border-border p-8">
              <h3 className="font-google-sans font-semibold text-xl text-dark mb-6">Change Password</h3>
              
              {passwordSuccess && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <span className="font-outfit text-emerald-700">Password updated successfully!</span>
                </div>
              )}
              {passwordError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="font-outfit text-red-700">{passwordError}</span>
                </div>
              )}
              
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full h-12 px-5 pr-12 bg-surface-2/60 border border-border rounded-full font-outfit text-dark placeholder:text-dark-muted/50 focus:outline-none focus:border-primary/30 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full h-12 px-5 bg-surface-2/60 border border-border rounded-full font-outfit text-dark placeholder:text-dark-muted/50 focus:outline-none focus:border-primary/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full h-12 px-5 bg-surface-2/60 border border-border rounded-full font-outfit text-dark placeholder:text-dark-muted/50 focus:outline-none focus:border-primary/30 transition-colors"
                  />
                </div>
              </div>
              <button 
                onClick={handleChangePassword}
                disabled={saving || !newPassword || !confirmPassword}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />} 
                Update Password
              </button>
            </div>

            {/* Two-Factor */}
            <div className="bg-surface-1 rounded-[32px] border border-border p-8">
              <h3 className="font-google-sans font-semibold text-xl text-dark mb-6">Two-Factor Authentication</h3>
              <div className="divide-y divide-border">
                <SettingRow icon={Smartphone} title="Authenticator App" description="Use Google Authenticator or similar">
                  <button className="px-5 py-2.5 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors">
                    Enable
                  </button>
                </SettingRow>
                <SettingRow icon={Mail} title="Email Verification" description="Receive codes via email">
                  <button className="px-5 py-2.5 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors">
                    Enable
                  </button>
                </SettingRow>
              </div>
            </div>

            {/* SSH Keys */}
            <div className="bg-surface-1 rounded-[32px] border border-border p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-google-sans font-semibold text-xl text-dark">SSH Keys</h3>
                <button 
                  onClick={() => setShowAddKeyModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Key
                </button>
              </div>
              
              {loadingKeys ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-dark-muted" />
                </div>
              ) : sshKeys.length > 0 ? (
                <div className="space-y-3">
                  {sshKeys.map((key) => (
                    <div key={key.id} className="flex items-center justify-between p-5 bg-surface-2/40 rounded-[20px]">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center">
                          <Key className="w-5 h-5 text-dark-muted" />
                        </div>
                        <div>
                          <p className="font-dm-sans font-semibold text-dark">{key.name}</p>
                          <p className="font-mono text-xs text-dark-muted truncate max-w-[200px] sm:max-w-[300px]">
                            {key.fingerprint}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyFingerprint(String(key.id), key.fingerprint)}
                          className="p-2.5 hover:bg-surface-2 rounded-xl text-dark-muted hover:text-dark transition-colors"
                        >
                          {copied === String(key.id) ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => handleRemoveSSHKey(key.id)}
                          className="p-2.5 hover:bg-red-50 rounded-xl text-dark-muted hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Key className="w-10 h-10 text-dark-muted mx-auto mb-3" />
                  <p className="font-outfit text-dark-muted">No SSH keys added yet</p>
                </div>
              )}
            </div>

            {/* Sessions */}
            <div className="bg-surface-1 rounded-[32px] border border-border p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-google-sans font-semibold text-xl text-dark">Active Sessions</h3>
                <button className="text-sm font-dm-sans font-semibold text-red-500 hover:text-red-600 transition-colors">
                  Revoke All
                </button>
              </div>
              
              {loadingKeys ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-dark-muted" />
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-5 bg-surface-2/40 rounded-[20px]">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          session.current ? "bg-emerald-100" : "bg-surface-2"
                        )}>
                          <Monitor className={cn("w-5 h-5", session.current ? "text-emerald-600" : "text-dark-muted")} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-dm-sans font-semibold text-dark">{session.device}</p>
                            {session.current && (
                              <span className="px-2 py-0.5 bg-emerald-100 rounded-full text-[10px] font-dm-sans font-semibold text-emerald-600">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="font-outfit text-sm text-dark-muted">{session.location} • {session.lastActive}</p>
                        </div>
                      </div>
                      {!session.current && (
                        <button className="px-4 py-2 text-sm font-dm-sans font-semibold text-red-500 hover:bg-red-50 rounded-full transition-colors">
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "notifications" && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Email Notifications */}
            <div className="bg-surface-1 rounded-[32px] border border-border p-8">
              <h3 className="font-google-sans font-semibold text-xl text-dark mb-2">Email Notifications</h3>
              <p className="font-outfit text-dark-muted mb-6">Choose what emails you want to receive</p>
              
              <div className="divide-y divide-border">
                <SettingRow icon={Mail} title="Account Updates" description="Important updates about your account">
                  <Toggle enabled={emailNotifs} onChange={setEmailNotifs} />
                </SettingRow>
                <SettingRow icon={Shield} title="Security Alerts" description="Get notified about security events">
                  <Toggle enabled={securityAlerts} onChange={setSecurityAlerts} />
                </SettingRow>
                <SettingRow icon={Bell} title="Server Alerts" description="Notifications when servers go down">
                  <Toggle enabled={true} onChange={() => {}} />
                </SettingRow>
              </div>
            </div>

            {/* Push Notifications */}
            <div className="bg-surface-1 rounded-[32px] border border-border p-8">
              <h3 className="font-google-sans font-semibold text-xl text-dark mb-2">Push Notifications</h3>
              <p className="font-outfit text-dark-muted mb-6">Browser and mobile notifications</p>
              
              <div className="divide-y divide-border">
                <SettingRow icon={Bell} title="Push Notifications" description="Receive browser push notifications">
                  <Toggle enabled={pushNotifs} onChange={setPushNotifs} />
                </SettingRow>
                <SettingRow icon={AlertTriangle} title="Critical Alerts" description="Always notify for critical issues">
                  <Toggle enabled={true} onChange={() => {}} />
                </SettingRow>
              </div>
            </div>

            {/* Marketing */}
            <div className="bg-surface-1 rounded-[32px] border border-border p-8">
              <h3 className="font-google-sans font-semibold text-xl text-dark mb-2">Marketing</h3>
              <p className="font-outfit text-dark-muted mb-6">Product news and promotional content</p>
              
              <div className="divide-y divide-border">
                <SettingRow icon={Mail} title="Product Updates" description="New features and improvements">
                  <Toggle enabled={marketingNotifs} onChange={setMarketingNotifs} />
                </SettingRow>
                <SettingRow icon={Globe} title="Newsletter" description="Monthly newsletter with tips">
                  <Toggle enabled={false} onChange={() => {}} />
                </SettingRow>
              </div>
              
              <button 
                onClick={handleSaveProfile}
                disabled={saving}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} 
                Save Preferences
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add SSH Key Modal */}
      <AnimatePresence>
        {showAddKeyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowAddKeyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-[32px] p-8"
            >
              <h3 className="font-google-sans font-semibold text-xl text-dark mb-6">Add SSH Key</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">Key Name</label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., My Laptop"
                    className="w-full h-12 px-5 bg-surface-2/60 border border-border rounded-full font-outfit text-dark placeholder:text-dark-muted/50 focus:outline-none focus:border-primary/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-dm-sans text-sm font-semibold text-dark mb-2">Public Key</label>
                  <textarea
                    value={newKeyValue}
                    onChange={(e) => setNewKeyValue(e.target.value)}
                    placeholder="ssh-rsa AAAA..."
                    rows={4}
                    className="w-full px-5 py-4 bg-surface-2/60 border border-border rounded-2xl font-mono text-sm text-dark placeholder:text-dark-muted/50 focus:outline-none focus:border-primary/30 transition-colors resize-none"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddKeyModal(false)}
                  className="px-6 py-3 text-dark-muted hover:text-dark rounded-full text-sm font-dm-sans font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSSHKey}
                  disabled={saving || !newKeyName.trim() || !newKeyValue.trim()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Add Key
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
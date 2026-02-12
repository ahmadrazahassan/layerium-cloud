"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Mail,
  Bell,
  Shield,
  CreditCard,
  Server,
  Save,
  RefreshCw,
  Check,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllSettings, updateSettings, type SettingsCategory } from "@/lib/data";

type Setting = SettingsCategory["settings"][0];

const tabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "email", label: "Email", icon: Mail },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "maintenance", label: "Maintenance", icon: Server },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = React.useState("general");
  const [settingsData, setSettingsData] = React.useState<SettingsCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [localValues, setLocalValues] = React.useState<Record<string, unknown>>({});

  React.useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await getAllSettings();
        setSettingsData(data);
        // Initialize local values from fetched settings
        const values: Record<string, unknown> = {};
        data.forEach((cat: SettingsCategory) => {
          cat.settings.forEach((s: Setting) => {
            values[s.key] = s.value;
          });
        });
        setLocalValues(values);
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(localValues).map(([key, value]) => ({ key, value }));
      await updateSettings(updates);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateLocalValue = (key: string, value: unknown) => {
    setLocalValues((prev) => ({ ...prev, [key]: value }));
  };

  const getSettingsForCategory = (category: string): Setting[] => {
    const cat = settingsData.find((c) => c.category === category);
    return cat?.settings || [];
  };

  const renderSettingInput = (setting: SettingsCategory["settings"][0]) => {
    const value = localValues[setting.key] ?? setting.value;

    if (setting.value_type === "boolean") {
      return (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={value as boolean}
            onChange={(e) => updateLocalValue(setting.key, e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-surface-2 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      );
    }

    if (setting.value_type === "number") {
      return (
        <input
          type="number"
          value={value as number}
          onChange={(e) => updateLocalValue(setting.key, parseInt(e.target.value) || 0)}
          className="w-full px-4 py-3 bg-white border border-border rounded-xl font-mono text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      );
    }

    return (
      <input
        type={setting.key.includes("password") ? "password" : "text"}
        value={value as string}
        onChange={(e) => updateLocalValue(setting.key, e.target.value)}
        className="w-full px-4 py-3 bg-white border border-border rounded-xl font-outfit text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
    );
  };


  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-dark-muted" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="font-google-sans font-semibold text-3xl text-dark mb-2">Settings</h1>
          <p className="font-outfit text-dark-muted">Configure your platform settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-dm-sans font-semibold transition-all",
            saved ? "bg-emerald-500 text-white" : "bg-dark hover:bg-primary text-white"
          )}
        >
          {saving ? (
            <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</>
          ) : saved ? (
            <><Check className="w-4 h-4" /> Saved!</>
          ) : (
            <><Save className="w-4 h-4" /> Save Changes</>
          )}
        </button>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:w-64 flex-shrink-0"
        >
          <div className="bg-surface-1 rounded-[24px] border border-border p-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-dm-sans text-sm transition-colors",
                  activeTab === tab.id
                    ? "bg-dark text-white"
                    : "text-dark-muted hover:bg-surface-2 hover:text-dark"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1"
        >
          <div className="bg-surface-1 rounded-[24px] border border-border p-8">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-google-sans font-semibold text-xl text-dark mb-1">General Settings</h2>
                  <p className="font-outfit text-sm text-dark-muted">Basic platform configuration</p>
                </div>
                <div className="grid gap-5">
                  {getSettingsForCategory("general").map((setting) => (
                    <div key={setting.key}>
                      {setting.value_type === "boolean" ? (
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-border">
                          <div>
                            <p className="font-dm-sans text-sm font-medium text-dark">{setting.label}</p>
                            {setting.description && (
                              <p className="font-outfit text-xs text-dark-muted">{setting.description}</p>
                            )}
                          </div>
                          {renderSettingInput(setting)}
                        </div>
                      ) : (
                        <div>
                          <label className="block font-dm-sans text-sm font-medium text-dark mb-2">{setting.label}</label>
                          {setting.description && (
                            <p className="font-outfit text-xs text-dark-muted mb-2">{setting.description}</p>
                          )}
                          {renderSettingInput(setting)}
                        </div>
                      )}
                    </div>
                  ))}
                  {getSettingsForCategory("general").length === 0 && (
                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        <div>
                          <p className="font-dm-sans text-sm font-medium text-dark">No settings configured</p>
                          <p className="font-outfit text-xs text-dark-muted">Run database seed to initialize settings</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === "email" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-google-sans font-semibold text-xl text-dark mb-1">Email Settings</h2>
                  <p className="font-outfit text-sm text-dark-muted">Configure SMTP and email delivery</p>
                </div>
                <div className="grid gap-5">
                  {getSettingsForCategory("email").map((setting) => (
                    <div key={setting.key}>
                      {setting.value_type === "boolean" ? (
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-border">
                          <div>
                            <p className="font-dm-sans text-sm font-medium text-dark">{setting.label}</p>
                            {setting.description && (
                              <p className="font-outfit text-xs text-dark-muted">{setting.description}</p>
                            )}
                          </div>
                          {renderSettingInput(setting)}
                        </div>
                      ) : (
                        <div>
                          <label className="block font-dm-sans text-sm font-medium text-dark mb-2">{setting.label}</label>
                          {setting.description && (
                            <p className="font-outfit text-xs text-dark-muted mb-2">{setting.description}</p>
                          )}
                          {renderSettingInput(setting)}
                        </div>
                      )}
                    </div>
                  ))}
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-2 hover:bg-dark hover:text-white rounded-full text-sm font-dm-sans font-semibold text-dark-muted transition-colors">
                    <Mail className="w-4 h-4" /> Send Test Email
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-google-sans font-semibold text-xl text-dark mb-1">Notification Settings</h2>
                  <p className="font-outfit text-sm text-dark-muted">Configure admin notifications</p>
                </div>
                <div className="space-y-4">
                  {getSettingsForCategory("notifications").map((setting) => (
                    <div key={setting.key}>
                      {setting.value_type === "boolean" ? (
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-border">
                          <div>
                            <p className="font-dm-sans text-sm font-medium text-dark">{setting.label}</p>
                            {setting.description && (
                              <p className="font-outfit text-xs text-dark-muted">{setting.description}</p>
                            )}
                          </div>
                          {renderSettingInput(setting)}
                        </div>
                      ) : (
                        <div>
                          <label className="block font-dm-sans text-sm font-medium text-dark mb-2">{setting.label}</label>
                          {setting.description && (
                            <p className="font-outfit text-xs text-dark-muted mb-2">{setting.description}</p>
                          )}
                          {renderSettingInput(setting)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-google-sans font-semibold text-xl text-dark mb-1">Security Settings</h2>
                  <p className="font-outfit text-sm text-dark-muted">Configure authentication and security</p>
                </div>
                <div className="space-y-5">
                  {getSettingsForCategory("security").map((setting) => (
                    <div key={setting.key}>
                      {setting.value_type === "boolean" ? (
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-border">
                          <div>
                            <p className="font-dm-sans text-sm font-medium text-dark">{setting.label}</p>
                            {setting.description && (
                              <p className="font-outfit text-xs text-dark-muted">{setting.description}</p>
                            )}
                          </div>
                          {renderSettingInput(setting)}
                        </div>
                      ) : (
                        <div>
                          <label className="block font-dm-sans text-sm font-medium text-dark mb-2">{setting.label}</label>
                          {setting.description && (
                            <p className="font-outfit text-xs text-dark-muted mb-2">{setting.description}</p>
                          )}
                          {renderSettingInput(setting)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Billing Settings */}
            {activeTab === "billing" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-google-sans font-semibold text-xl text-dark mb-1">Billing Settings</h2>
                  <p className="font-outfit text-sm text-dark-muted">Configure payment and billing options</p>
                </div>
                <div className="space-y-5">
                  {getSettingsForCategory("billing").map((setting) => (
                    <div key={setting.key}>
                      {setting.value_type === "boolean" ? (
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-border">
                          <div>
                            <p className="font-dm-sans text-sm font-medium text-dark">{setting.label}</p>
                            {setting.description && (
                              <p className="font-outfit text-xs text-dark-muted">{setting.description}</p>
                            )}
                          </div>
                          {renderSettingInput(setting)}
                        </div>
                      ) : (
                        <div>
                          <label className="block font-dm-sans text-sm font-medium text-dark mb-2">{setting.label}</label>
                          {setting.description && (
                            <p className="font-outfit text-xs text-dark-muted mb-2">{setting.description}</p>
                          )}
                          {renderSettingInput(setting)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Maintenance Settings */}
            {activeTab === "maintenance" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-google-sans font-semibold text-xl text-dark mb-1">Maintenance Settings</h2>
                  <p className="font-outfit text-sm text-dark-muted">Configure backups and system maintenance</p>
                </div>
                <div className="space-y-5">
                  {getSettingsForCategory("maintenance").map((setting) => (
                    <div key={setting.key}>
                      {setting.value_type === "boolean" ? (
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-border">
                          <div>
                            <p className="font-dm-sans text-sm font-medium text-dark">{setting.label}</p>
                            {setting.description && (
                              <p className="font-outfit text-xs text-dark-muted">{setting.description}</p>
                            )}
                          </div>
                          {renderSettingInput(setting)}
                        </div>
                      ) : (
                        <div>
                          <label className="block font-dm-sans text-sm font-medium text-dark mb-2">{setting.label}</label>
                          {setting.description && (
                            <p className="font-outfit text-xs text-dark-muted mb-2">{setting.description}</p>
                          )}
                          {renderSettingInput(setting)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

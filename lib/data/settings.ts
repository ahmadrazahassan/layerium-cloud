"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AppSetting } from "@/types/database";

export interface SettingsCategory {
  category: string;
  settings: AppSetting[];
}

/**
 * Get all app settings (admin only)
 */
export async function getAllSettings(): Promise<SettingsCategory[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("app_settings")
    .select("*")
    .order("category")
    .order("key");

  if (error) {
    console.error("Error fetching settings:", error);
    return [];
  }

  // Group by category
  const grouped: Record<string, AppSetting[]> = {};
  const settings = (data || []) as unknown as AppSetting[];
  settings.forEach((setting) => {
    if (!grouped[setting.category]) {
      grouped[setting.category] = [];
    }
    grouped[setting.category].push(setting);
  });

  return Object.entries(grouped).map(([category, settings]) => ({
    category,
    settings,
  }));
}

/**
 * Get settings by category
 */
export async function getSettingsByCategory(category: string): Promise<AppSetting[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("app_settings")
    .select("*")
    .eq("category", category)
    .order("key");

  if (error) {
    console.error("Error fetching settings:", error);
    return [];
  }

  return (data || []) as unknown as AppSetting[];
}

/**
 * Get a single setting by key
 */
export async function getSetting(key: string): Promise<AppSetting | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("app_settings")
    .select("*")
    .eq("key", key)
    .single();

  if (error) {
    console.error("Error fetching setting:", error);
    return null;
  }

  return data as unknown as AppSetting;
}

/**
 * Get public settings (no auth required)
 */
export async function getPublicSettings(): Promise<Record<string, unknown>> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("app_settings")
    .select("key, value")
    .eq("is_public", true);

  if (error) {
    console.error("Error fetching public settings:", error);
    return {};
  }

  const settings: Record<string, unknown> = {};
  const settingsData = (data || []) as unknown as Array<{ key: string; value: unknown }>;
  settingsData.forEach((s) => {
    settings[s.key] = s.value;
  });

  return settings;
}

/**
 * Update a setting (admin only)
 */
export async function updateSetting(
  key: string,
  value: unknown
): Promise<{ success: boolean; error?: string }> {
  const adminClient = createAdminClient();
  
  const { data: { user } } = await (await createClient()).auth.getUser();
  
  const { error } = await (adminClient as any)
    .from("app_settings")
    .update({
      value,
      updated_at: new Date().toISOString(),
      updated_by: user?.id || null,
    })
    .eq("key", key);

  if (error) {
    console.error("Error updating setting:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Update multiple settings at once (admin only)
 */
export async function updateSettings(
  settings: Array<{ key: string; value: unknown }>
): Promise<{ success: boolean; error?: string }> {
  const adminClient = createAdminClient();
  const { data: { user } } = await (await createClient()).auth.getUser();
  
  // Update each setting
  for (const setting of settings) {
    const { error } = await (adminClient as any)
      .from("app_settings")
      .update({
        value: setting.value,
        updated_at: new Date().toISOString(),
        updated_by: user?.id || null,
      })
      .eq("key", setting.key);

    if (error) {
      console.error(`Error updating setting ${setting.key}:`, error);
      return { success: false, error: `Failed to update ${setting.key}: ${error.message}` };
    }
  }

  return { success: true };
}

/**
 * Create a new setting (admin only)
 */
export async function createSetting(data: {
  key: string;
  category: string;
  value: unknown;
  value_type: "string" | "number" | "boolean" | "json";
  label: string;
  description?: string;
  is_public?: boolean;
  is_editable?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  const adminClient = createAdminClient();
  
  const insertData = {
    key: data.key,
    category: data.category,
    value: data.value,
    value_type: data.value_type,
    label: data.label,
    description: data.description || null,
    is_public: data.is_public || false,
    is_editable: data.is_editable !== false,
  };

  const { error } = await (adminClient as any)
    .from("app_settings")
    .insert(insertData);

  if (error) {
    console.error("Error creating setting:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Delete a setting (admin only)
 */
export async function deleteSetting(key: string): Promise<{ success: boolean; error?: string }> {
  const adminClient = createAdminClient();
  
  const { error } = await adminClient
    .from("app_settings")
    .delete()
    .eq("key", key);

  if (error) {
    console.error("Error deleting setting:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Initialize default settings if they don't exist
 */
export async function initializeDefaultSettings(): Promise<{ success: boolean; error?: string }> {
  const adminClient = createAdminClient();
  
  const defaultSettings = [
    // General
    { key: "site_name", category: "general", value: "Layerium Cloud", value_type: "string" as const, label: "Site Name", description: "The name of your hosting platform", is_public: true },
    { key: "site_description", category: "general", value: "Premium VPS & RDP Hosting", value_type: "string" as const, label: "Site Description", description: "Short description for SEO", is_public: true },
    { key: "support_email", category: "general", value: "support@layerium.com", value_type: "string" as const, label: "Support Email", description: "Primary support email address", is_public: true },
    { key: "maintenance_mode", category: "general", value: false, value_type: "boolean" as const, label: "Maintenance Mode", description: "Enable to show maintenance page to users", is_public: true },
    
    // Email
    { key: "smtp_host", category: "email", value: "", value_type: "string" as const, label: "SMTP Host", description: "SMTP server hostname", is_public: false },
    { key: "smtp_port", category: "email", value: 587, value_type: "number" as const, label: "SMTP Port", description: "SMTP server port", is_public: false },
    { key: "smtp_user", category: "email", value: "", value_type: "string" as const, label: "SMTP Username", description: "SMTP authentication username", is_public: false },
    { key: "smtp_from_email", category: "email", value: "noreply@layerium.com", value_type: "string" as const, label: "From Email", description: "Default sender email address", is_public: false },
    { key: "smtp_from_name", category: "email", value: "Layerium Cloud", value_type: "string" as const, label: "From Name", description: "Default sender name", is_public: false },
    
    // Notifications
    { key: "notify_new_order", category: "notifications", value: true, value_type: "boolean" as const, label: "New Order Notifications", description: "Send email on new orders", is_public: false },
    { key: "notify_new_ticket", category: "notifications", value: true, value_type: "boolean" as const, label: "New Ticket Notifications", description: "Send email on new support tickets", is_public: false },
    { key: "notify_server_status", category: "notifications", value: true, value_type: "boolean" as const, label: "Server Status Notifications", description: "Send email on server status changes", is_public: false },
    
    // Security
    { key: "max_login_attempts", category: "security", value: 5, value_type: "number" as const, label: "Max Login Attempts", description: "Maximum failed login attempts before lockout", is_public: false },
    { key: "lockout_duration_minutes", category: "security", value: 30, value_type: "number" as const, label: "Lockout Duration", description: "Account lockout duration in minutes", is_public: false },
    { key: "require_email_verification", category: "security", value: true, value_type: "boolean" as const, label: "Require Email Verification", description: "Require email verification for new accounts", is_public: false },
    { key: "session_timeout_hours", category: "security", value: 24, value_type: "number" as const, label: "Session Timeout", description: "Session timeout in hours", is_public: false },
    
    // Billing
    { key: "default_currency", category: "billing", value: "USD", value_type: "string" as const, label: "Default Currency", description: "Default currency for pricing", is_public: true },
    { key: "tax_rate_percent", category: "billing", value: 0, value_type: "number" as const, label: "Tax Rate (%)", description: "Default tax rate percentage", is_public: false },
    { key: "invoice_prefix", category: "billing", value: "INV", value_type: "string" as const, label: "Invoice Prefix", description: "Prefix for invoice numbers", is_public: false },
    { key: "payment_grace_days", category: "billing", value: 3, value_type: "number" as const, label: "Payment Grace Period", description: "Days before suspension for non-payment", is_public: false },
  ];

  for (const setting of defaultSettings) {
    // Check if setting exists
    const { data: existing } = await adminClient
      .from("app_settings")
      .select("id")
      .eq("key", setting.key)
      .single();

    if (!existing) {
      const { error } = await (adminClient as any)
        .from("app_settings")
        .insert(setting);

      if (error) {
        console.error(`Error creating setting ${setting.key}:`, error);
      }
    }
  }

  return { success: true };
}

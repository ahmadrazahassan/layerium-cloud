"use server";

import { createClient } from "@/lib/supabase/server";
import type { Server, ServerWithPlan, ServerStatus, PricingPlan } from "@/types/database";

export interface GetServersParams {
  status?: ServerStatus | "all";
  search?: string;
  limit?: number;
  offset?: number;
}

export interface GetServersResult {
  servers: ServerWithPlan[];
  total: number;
}

/**
 * Get servers for the current authenticated user
 */
export async function getUserServers(params: GetServersParams = {}): Promise<GetServersResult> {
  const { status = "all", search, limit = 50, offset = 0 } = params;
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error("Auth error:", authError);
    return { servers: [], total: 0 };
  }

  // Build query
  let query = supabase
    .from("servers")
    .select(`
      *,
      plan:pricing_plans(*)
    `, { count: "exact" })
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  // Apply status filter
  if (status !== "all") {
    query = query.eq("status", status);
  }

  // Apply search filter
  if (search) {
    query = query.or(`hostname.ilike.%${search}%,ip_address.ilike.%${search}%`);
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching servers:", error);
    return { servers: [], total: 0 };
  }

  // Transform data to match ServerWithPlan type
  const servers: ServerWithPlan[] = (data || []).map((server: any) => ({
    ...server,
    plan: server.plan as PricingPlan,
    // Ensure all required fields have defaults
    cpu_cores: server.plan?.cpu_cores || 0,
    ram_gb: server.plan?.ram_gb || 0,
    storage_gb: server.plan?.storage_gb || 0,
    bandwidth_tb: server.plan?.bandwidth_tb || 0,
  }));

  return { servers, total: count || 0 };
}

/**
 * Get a single server by ID
 */
export async function getServerById(serverId: string): Promise<ServerWithPlan | null> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("servers")
    .select(`
      *,
      plan:pricing_plans(*)
    `)
    .eq("id", serverId)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .single() as { data: any; error: any };

  if (error || !data) {
    console.error("Error fetching server:", error);
    return null;
  }

  return {
    ...data,
    plan: data.plan as PricingPlan,
  } as ServerWithPlan;
}

/**
 * Perform an action on a server (start, stop, restart)
 */
export async function performServerAction(
  serverId: string,
  action: "start" | "stop" | "restart"
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  // Verify ownership
  const { data: server, error: fetchError } = await supabase
    .from("servers")
    .select("id, status, user_id")
    .eq("id", serverId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !server) {
    return { success: false, error: "Server not found" };
  }

  // Determine new status based on action
  let newStatus: ServerStatus;
  switch (action) {
    case "start":
      newStatus = "running";
      break;
    case "stop":
      newStatus = "stopped";
      break;
    case "restart":
      newStatus = "restarting";
      break;
    default:
      return { success: false, error: "Invalid action" };
  }

  // Update server status
  const { error: updateError } = await (supabase.from("servers") as any)
    .update({
      status: newStatus,
      last_status_change: new Date().toISOString(),
    })
    .eq("id", serverId);

  if (updateError) {
    console.error("Error updating server:", updateError);
    return { success: false, error: updateError.message };
  }

  // For restart, set back to running after a short delay (simulated)
  if (action === "restart") {
    // In a real implementation, this would be handled by a background job
    setTimeout(async () => {
      const supabaseDelayed = await createClient();
      await (supabaseDelayed.from("servers") as any)
        .update({ status: "running" as ServerStatus })
        .eq("id", serverId);
    }, 3000);
  }

  // Log the activity
  await (supabase.from("activity_logs") as any).insert({
    user_id: user.id,
    entity_type: "server",
    entity_id: serverId,
    action: `server_${action}`,
    description: `Server ${action} action performed`,
    new_values: { status: newStatus },
  });

  return { success: true };
}

/**
 * Update server details (hostname, label, etc.)
 */
export async function updateServer(
  serverId: string,
  updates: { hostname?: string; label?: string; reverse_dns?: string }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await (supabase.from("servers") as any)
    .update(updates)
    .eq("id", serverId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating server:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Get server activity logs
 */
export async function getServerActivityLogs(
  serverId: string,
  limit: number = 20
): Promise<any[]> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("entity_type", "server")
    .eq("entity_id", serverId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching activity logs:", error);
    return [];
  }

  return data || [];
}


// ============================================================================
// ADMIN FUNCTIONS
// ============================================================================

import { createAdminClient } from "@/lib/supabase/admin";

export interface GetAllServersParams {
  search?: string;
  status?: ServerStatus | "all";
  page?: number;
  limit?: number;
}

export interface GetAllServersResult {
  servers: ServerWithPlan[];
  total: number;
  totalPages: number;
}

/**
 * Get all servers (admin only)
 */
export async function getAllServers(params: GetAllServersParams = {}): Promise<GetAllServersResult> {
  const { search, status = "all", page = 1, limit = 10 } = params;
  const adminClient = createAdminClient();
  const offset = (page - 1) * limit;

  let query = (adminClient as any)
    .from("servers")
    .select(`
      *,
      plan:pricing_plans(*),
      user:profiles!servers_user_id_fkey(id, email, full_name)
    `, { count: "exact" })
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  // Apply filters
  if (search) {
    query = query.or(`hostname.ilike.%${search}%,ip_address.ilike.%${search}%`);
  }
  if (status !== "all") {
    query = query.eq("status", status);
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching servers:", error);
    return { servers: [], total: 0, totalPages: 0 };
  }

  const servers: ServerWithPlan[] = (data || []).map((server: any) => ({
    ...server,
    plan: server.plan as PricingPlan,
  }));

  return {
    servers,
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

/**
 * Update server credentials (admin only)
 */
export async function updateServerCredentials(
  serverId: string,
  credentials: {
    ip_address?: string;
    username?: string;
    password?: string;
    rdp_port?: number;
    ssh_port?: number;
  }
): Promise<{ success: boolean; error?: string }> {
  const adminClient = createAdminClient();

  const { error } = await (adminClient as any)
    .from("servers")
    .update({
      ...credentials,
      updated_at: new Date().toISOString(),
    })
    .eq("id", serverId);

  if (error) {
    console.error("Error updating server credentials:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Update server status (admin only)
 */
export async function updateServerStatus(
  serverId: string,
  status: ServerStatus
): Promise<{ success: boolean; error?: string }> {
  const adminClient = createAdminClient();

  const { error } = await (adminClient as any)
    .from("servers")
    .update({
      status,
      last_status_change: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", serverId);

  if (error) {
    console.error("Error updating server status:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Delete a server (admin only - soft delete)
 */
export async function deleteServer(
  serverId: string
): Promise<{ success: boolean; error?: string }> {
  const adminClient = createAdminClient();

  const { error } = await (adminClient as any)
    .from("servers")
    .update({
      deleted_at: new Date().toISOString(),
      status: "stopped" as ServerStatus,
    })
    .eq("id", serverId);

  if (error) {
    console.error("Error deleting server:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Allocate/provision a server to a user (admin only)
 */
export async function allocateServerToUser(data: {
  user_id: string;
  plan_id: string;
  hostname: string;
  ip_address: string;
  location: string;
  os_template: string;
  username?: string;
  password?: string;
  rdp_port?: number;
  ssh_port?: number;
}): Promise<{ success: boolean; server?: ServerWithPlan; error?: string }> {
  const adminClient = createAdminClient();

  // Get plan details
  const { data: plan, error: planError } = await (adminClient as any)
    .from("pricing_plans")
    .select("*")
    .eq("id", data.plan_id)
    .single();

  if (planError || !plan) {
    return { success: false, error: "Plan not found" };
  }

  // Create the server
  const { data: server, error } = await (adminClient as any)
    .from("servers")
    .insert({
      user_id: data.user_id,
      plan_id: data.plan_id,
      hostname: data.hostname,
      ip_address: data.ip_address,
      location: data.location,
      os_template: data.os_template,
      username: data.username || (plan.type === "RDP" ? "Administrator" : "root"),
      password: data.password || null,
      rdp_port: data.rdp_port || 3389,
      ssh_port: data.ssh_port || 22,
      status: "running" as ServerStatus,
      // Specs from plan (required NOT NULL fields)
      cpu_cores: plan.cpu_cores,
      ram_gb: plan.ram_gb,
      storage_gb: plan.storage_gb,
      bandwidth_tb: plan.bandwidth_tb,
      // Usage metrics
      cpu_usage: 0,
      ram_usage: 0,
      disk_usage: 0,
      bandwidth_used_gb: 0,
      // Billing info
      billing_amount_cents: plan.price_usd_cents,
      billing_currency: "USD",
      billing_period: plan.billing_period,
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      auto_renew: true,
      provisioned_at: new Date().toISOString(),
    })
    .select(`*, plan:pricing_plans(*)`)
    .single();

  if (error) {
    console.error("Error allocating server:", error);
    return { success: false, error: error.message };
  }

  return { success: true, server: server as ServerWithPlan };
}

/**
 * Get users for server allocation dropdown (admin only)
 */
export async function getUsersForAllocation(): Promise<Array<{ id: string; email: string; full_name: string | null }>> {
  const adminClient = createAdminClient();

  const { data, error } = await (adminClient as any)
    .from("profiles")
    .select("id, email, full_name")
    .eq("is_active", true)
    .order("email", { ascending: true })
    .limit(100);

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return data || [];
}

/**
 * Get plans for server allocation dropdown (admin only)
 */
export async function getPlansForAllocation(): Promise<Array<{ id: string; name: string; type: string; cpu_cores: number; ram_gb: number; storage_gb: number }>> {
  const adminClient = createAdminClient();

  const { data, error } = await (adminClient as any)
    .from("pricing_plans")
    .select("id, name, type, cpu_cores, ram_gb, storage_gb")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching plans:", error);
    return [];
  }

  return data || [];
}

/**
 * Get datacenters for server allocation dropdown (admin only)
 */
export async function getDatacentersForAllocation(): Promise<Array<{ code: string; name: string; country: string }>> {
  const adminClient = createAdminClient();

  const { data, error } = await (adminClient as any)
    .from("datacenters")
    .select("code, name, country")
    .eq("is_active", true)
    .eq("is_available", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching datacenters:", error);
    return [];
  }

  return data || [];
}

/**
 * Get OS templates for server allocation dropdown (admin only)
 */
export async function getOSTemplatesForAllocation(planType?: string): Promise<Array<{ code: string; full_name: string; family: string }>> {
  const adminClient = createAdminClient();

  let query = (adminClient as any)
    .from("os_templates")
    .select("code, full_name, family")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (planType) {
    query = query.contains("plan_types", [planType]);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching OS templates:", error);
    return [];
  }

  return data || [];
}

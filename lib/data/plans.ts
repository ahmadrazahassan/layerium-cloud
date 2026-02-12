"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { PricingPlan, PlanType } from "@/types/database";

export interface GetAllPlansParams {
  search?: string;
  type?: PlanType | "all";
  status?: "all" | "active" | "inactive";
  page?: number;
  limit?: number;
}

export interface GetAllPlansResult {
  plans: PricingPlan[];
  total: number;
  totalPages: number;
}

/**
 * Get all pricing plans (admin only)
 */
export async function getAllPlans(params: GetAllPlansParams = {}): Promise<GetAllPlansResult> {
  const { search, type = "all", status = "all", page = 1, limit = 20 } = params;
  const adminClient = createAdminClient();
  const offset = (page - 1) * limit;

  let query = (adminClient as any)
    .from("pricing_plans")
    .select("*", { count: "exact" })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  // Apply filters
  if (search) {
    query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
  }
  if (type !== "all") {
    query = query.eq("type", type);
  }
  if (status === "active") {
    query = query.eq("is_active", true);
  } else if (status === "inactive") {
    query = query.eq("is_active", false);
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching plans:", error);
    return { plans: [], total: 0, totalPages: 0 };
  }

  return {
    plans: (data || []) as PricingPlan[],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
  };
}


/**
 * Create a new pricing plan (admin only)
 */
export async function createPlan(
  data: Partial<PricingPlan>
): Promise<{ success: boolean; plan?: PricingPlan; error?: string }> {
  const adminClient = createAdminClient();

  const { data: plan, error } = await (adminClient as any)
    .from("pricing_plans")
    .insert({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      type: data.type || "VPS",
      cpu_cores: data.cpu_cores || 1,
      ram_gb: data.ram_gb || 1,
      storage_gb: data.storage_gb || 20,
      bandwidth_tb: data.bandwidth_tb || 1,
      price_usd_cents: data.price_usd_cents || 0,
      price_pkr_paisa: data.price_pkr_paisa || 0,
      billing_period: data.billing_period || "monthly",
      setup_fee_usd_cents: data.setup_fee_usd_cents || 0,
      setup_fee_pkr_paisa: data.setup_fee_pkr_paisa || 0,
      locations: data.locations || [],
      features: data.features || [],
      os_templates: data.os_templates || [],
      is_popular: data.is_popular || false,
      is_active: data.is_active !== false,
      is_visible: data.is_visible !== false,
      sort_order: data.sort_order || 0,
      metadata: data.metadata || {},
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating plan:", error);
    return { success: false, error: error.message };
  }

  return { success: true, plan: plan as PricingPlan };
}

/**
 * Update a pricing plan (admin only)
 */
export async function updatePlan(
  planId: string,
  data: Partial<PricingPlan>
): Promise<{ success: boolean; error?: string }> {
  const adminClient = createAdminClient();

  const { error } = await (adminClient as any)
    .from("pricing_plans")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", planId);

  if (error) {
    console.error("Error updating plan:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Delete a pricing plan (admin only)
 */
export async function deletePlan(
  planId: string
): Promise<{ success: boolean; error?: string }> {
  const adminClient = createAdminClient();

  // Check if plan is in use by any servers
  const { count } = await (adminClient as any)
    .from("servers")
    .select("id", { count: "exact", head: true })
    .eq("plan_id", planId)
    .is("deleted_at", null);

  if (count && count > 0) {
    return { success: false, error: `Cannot delete plan: ${count} server(s) are using this plan` };
  }

  const { error } = await (adminClient as any)
    .from("pricing_plans")
    .delete()
    .eq("id", planId);

  if (error) {
    console.error("Error deleting plan:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Get plan statistics (admin only)
 */
export async function getPlanStats(): Promise<{
  totalPlans: number;
  activePlans: number;
  vpsPlans: number;
  rdpPlans: number;
}> {
  const adminClient = createAdminClient();

  const [totalResult, activeResult, vpsResult, rdpResult] = await Promise.all([
    (adminClient as any).from("pricing_plans").select("id", { count: "exact", head: true }),
    (adminClient as any).from("pricing_plans").select("id", { count: "exact", head: true }).eq("is_active", true),
    (adminClient as any).from("pricing_plans").select("id", { count: "exact", head: true }).eq("type", "VPS"),
    (adminClient as any).from("pricing_plans").select("id", { count: "exact", head: true }).eq("type", "RDP"),
  ]);

  return {
    totalPlans: totalResult.count || 0,
    activePlans: activeResult.count || 0,
    vpsPlans: vpsResult.count || 0,
    rdpPlans: rdpResult.count || 0,
  };
}

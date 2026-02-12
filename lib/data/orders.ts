"use server";

import { createClient } from "@/lib/supabase/server";
import type { Order, OrderWithDetails, OrderStatus, PricingPlan, Server } from "@/types/database";

export type { Order, OrderWithDetails, OrderStatus };

export interface GetOrdersParams {
  status?: OrderStatus | "all";
  search?: string;
  limit?: number;
  offset?: number;
}

export interface GetOrdersResult {
  orders: OrderWithDetails[];
  total: number;
}

/**
 * Get orders for the current authenticated user
 */
export async function getUserOrders(params: GetOrdersParams = {}): Promise<GetOrdersResult> {
  const { status = "all", search, limit = 50, offset = 0 } = params;
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error("Auth error:", authError);
    return { orders: [], total: 0 };
  }

  // Build query
  let query = supabase
    .from("orders")
    .select(`
      *,
      plan:pricing_plans(*),
      server:servers(*)
    `, { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Apply status filter
  if (status !== "all") {
    query = query.eq("status", status);
  }

  // Apply search filter
  if (search) {
    query = query.or(`order_number.ilike.%${search}%`);
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching orders:", error);
    return { orders: [], total: 0 };
  }

  // Transform data to match OrderWithDetails type
  const orders: OrderWithDetails[] = (data || []).map((order: any) => ({
    ...order,
    plan: order.plan as PricingPlan,
    server: order.server as Server | undefined,
  }));

  return { orders, total: count || 0 };
}

/**
 * Get a single order by ID
 */
export async function getOrderById(orderId: string): Promise<OrderWithDetails | null> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      plan:pricing_plans(*),
      server:servers(*)
    `)
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    console.error("Error fetching order:", error);
    return null;
  }

  const orderData = data as any;
  return {
    ...orderData,
    plan: orderData.plan as PricingPlan,
    server: orderData.server as Server | undefined,
  } as OrderWithDetails;
}

/**
 * Get order by order number
 */
export async function getOrderByNumber(orderNumber: string): Promise<OrderWithDetails | null> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      plan:pricing_plans(*),
      server:servers(*)
    `)
    .eq("order_number", orderNumber)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    console.error("Error fetching order:", error);
    return null;
  }

  const orderData = data as any;
  return {
    ...orderData,
    plan: orderData.plan as PricingPlan,
    server: orderData.server as Server | undefined,
  } as OrderWithDetails;
}

/**
 * Get billing summary for the current user
 */
export async function getBillingSummary(): Promise<{
  totalSpent: number;
  monthlyRecurring: number;
  pendingPayments: number;
  currency: string;
}> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { totalSpent: 0, monthlyRecurring: 0, pendingPayments: 0, currency: "USD" };
  }

  // Get completed orders total
  const { data: completedOrders } = await supabase
    .from("orders")
    .select("total_cents")
    .eq("user_id", user.id)
    .eq("status", "completed");

  const totalSpent = (completedOrders as any[] || []).reduce((sum, o) => sum + (o.total_cents || 0), 0);

  // Get active servers for monthly recurring
  const { data: activeServers } = await supabase
    .from("servers")
    .select(`
      plan:pricing_plans(price_usd_cents)
    `)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .in("status", ["running", "stopped"]);

  const monthlyRecurring = (activeServers || []).reduce(
    (sum, s: any) => sum + (s.plan?.price_usd_cents || 0),
    0
  );

  // Get pending orders
  const { data: pendingOrders } = await supabase
    .from("orders")
    .select("total_cents")
    .eq("user_id", user.id)
    .eq("status", "pending");

  const pendingPayments = (pendingOrders as any[] || []).reduce((sum, o) => sum + (o.total_cents || 0), 0);

  return {
    totalSpent,
    monthlyRecurring,
    pendingPayments,
    currency: "USD",
  };
}


// ============================================================================
// ADMIN FUNCTIONS
// ============================================================================

import { createAdminClient } from "@/lib/supabase/admin";
import type { Profile } from "@/types/database";

export interface GetAllOrdersParams {
  search?: string;
  status?: OrderStatus | "all";
  page?: number;
  limit?: number;
}

export interface GetAllOrdersResult {
  orders: OrderWithDetails[];
  total: number;
  totalPages: number;
}

/**
 * Get all orders (admin only)
 */
export async function getAllOrders(params: GetAllOrdersParams = {}): Promise<GetAllOrdersResult> {
  const { search, status = "all", page = 1, limit = 10 } = params;
  const adminClient = createAdminClient();
  const offset = (page - 1) * limit;

  let query = (adminClient as any)
    .from("orders")
    .select(`
      *,
      plan:pricing_plans(*),
      server:servers(*),
      user:profiles!orders_user_id_fkey(id, email, full_name)
    `, { count: "exact" })
    .order("created_at", { ascending: false });

  // Apply filters
  if (search) {
    query = query.or(`order_number.ilike.%${search}%`);
  }
  if (status !== "all") {
    query = query.eq("status", status);
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching orders:", error);
    return { orders: [], total: 0, totalPages: 0 };
  }

  const orders: OrderWithDetails[] = (data || []).map((order: any) => ({
    ...order,
    plan: order.plan as PricingPlan,
    server: order.server as Server | undefined,
    user: order.user as Profile | undefined,
  }));

  return {
    orders,
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

/**
 * Update order status (admin only)
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  adminNotes?: string
): Promise<{ success: boolean; error?: string }> {
  const adminClient = createAdminClient();

  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (adminNotes !== undefined) {
    updateData.admin_notes = adminNotes;
  }

  if (status === "completed") {
    updateData.paid_at = new Date().toISOString();
  }

  const { error } = await (adminClient as any)
    .from("orders")
    .update(updateData)
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Get order statistics (admin only)
 */
export async function getOrderStats(): Promise<{
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
}> {
  const adminClient = createAdminClient();

  const [totalResult, pendingResult, completedResult, revenueResult] = await Promise.all([
    (adminClient as any).from("orders").select("id", { count: "exact", head: true }),
    (adminClient as any).from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    (adminClient as any).from("orders").select("id", { count: "exact", head: true }).eq("status", "completed"),
    (adminClient as any).from("orders").select("total_cents").eq("status", "completed"),
  ]);

  const totalRevenue = (revenueResult.data || []).reduce((sum: number, o: any) => sum + (o.total_cents || 0), 0);

  return {
    totalRevenue,
    totalOrders: totalResult.count || 0,
    pendingOrders: pendingResult.count || 0,
    completedOrders: completedResult.count || 0,
  };
}

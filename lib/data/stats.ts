"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export interface DashboardStats {
  totalUsers: number;
  activeServers: number;
  monthlyRevenue: number;
  openTickets: number;
  userGrowth: number;
  serverGrowth: number;
  revenueGrowth: number;
  ticketChange: number;
}

export interface ServerLocation {
  location: string;
  count: number;
  status: "operational" | "degraded" | "down";
  latency: string;
}

/**
 * Get admin dashboard statistics
 */
export async function getAdminDashboardStats(): Promise<DashboardStats> {
  const adminClient = createAdminClient();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    usersResult,
    lastMonthUsersResult,
    serversResult,
    lastMonthServersResult,
    revenueResult,
    lastMonthRevenueResult,
    ticketsResult,
    lastMonthTicketsResult,
  ] = await Promise.all([
    // Current counts
    (adminClient as any).from("profiles").select("id", { count: "exact", head: true }),
    (adminClient as any).from("profiles").select("id", { count: "exact", head: true }).lt("created_at", startOfMonth.toISOString()),
    (adminClient as any).from("servers").select("id", { count: "exact", head: true }).eq("status", "running").is("deleted_at", null),
    (adminClient as any).from("servers").select("id", { count: "exact", head: true }).eq("status", "running").is("deleted_at", null).lt("created_at", startOfMonth.toISOString()),
    // Revenue this month
    (adminClient as any).from("orders").select("total_cents").eq("status", "completed").gte("created_at", startOfMonth.toISOString()),
    // Revenue last month
    (adminClient as any).from("orders").select("total_cents").eq("status", "completed").gte("created_at", startOfLastMonth.toISOString()).lte("created_at", endOfLastMonth.toISOString()),
    // Open tickets
    (adminClient as any).from("tickets").select("id", { count: "exact", head: true }).in("status", ["open", "in_progress"]),
    (adminClient as any).from("tickets").select("id", { count: "exact", head: true }).in("status", ["open", "in_progress"]).lt("created_at", startOfMonth.toISOString()),
  ]);

  const totalUsers = usersResult.count || 0;
  const lastMonthUsers = lastMonthUsersResult.count || 0;
  const activeServers = serversResult.count || 0;
  const lastMonthServers = lastMonthServersResult.count || 0;
  const openTickets = ticketsResult.count || 0;
  const lastMonthTickets = lastMonthTicketsResult.count || 0;

  const monthlyRevenue = (revenueResult.data || []).reduce((sum: number, o: any) => sum + (o.total_cents || 0), 0);
  const lastMonthRevenue = (lastMonthRevenueResult.data || []).reduce((sum: number, o: any) => sum + (o.total_cents || 0), 0);

  // Calculate growth percentages
  const calcGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  return {
    totalUsers,
    activeServers,
    monthlyRevenue,
    openTickets,
    userGrowth: calcGrowth(totalUsers, lastMonthUsers),
    serverGrowth: calcGrowth(activeServers, lastMonthServers),
    revenueGrowth: calcGrowth(monthlyRevenue, lastMonthRevenue),
    ticketChange: calcGrowth(openTickets, lastMonthTickets),
  };
}


/**
 * Get server locations with counts and status
 */
export async function getServerLocations(): Promise<ServerLocation[]> {
  const adminClient = createAdminClient();

  const { data, error } = await (adminClient as any)
    .from("servers")
    .select("location")
    .is("deleted_at", null);

  if (error) {
    console.error("Error fetching server locations:", error);
    return [];
  }

  // Group by location
  const locationCounts: Record<string, number> = {};
  (data || []).forEach((server: any) => {
    const loc = server.location || "Unknown";
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  });

  // Convert to array - latency would need real monitoring integration
  return Object.entries(locationCounts)
    .map(([location, count]) => ({
      location,
      count,
      status: "operational" as const,
      latency: "—", // Real latency requires monitoring integration
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

/**
 * Get recent orders for admin dashboard
 */
export async function getRecentOrders(limit: number = 5): Promise<any[]> {
  const adminClient = createAdminClient();

  const { data, error } = await (adminClient as any)
    .from("orders")
    .select(`
      id,
      order_number,
      total_cents,
      currency,
      status,
      created_at,
      user:profiles!orders_user_id_fkey(email, full_name),
      plan:pricing_plans!orders_plan_id_fkey(name, type)
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent orders:", error);
    return [];
  }

  return data || [];
}

/**
 * Get recent tickets for admin dashboard
 */
export async function getRecentTickets(limit: number = 4): Promise<any[]> {
  const adminClient = createAdminClient();

  const { data, error } = await (adminClient as any)
    .from("tickets")
    .select(`
      id,
      ticket_number,
      subject,
      priority,
      status,
      updated_at,
      user:profiles!tickets_user_id_fkey(email, full_name)
    `)
    .in("status", ["open", "in_progress", "waiting_customer"])
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent tickets:", error);
    return [];
  }

  return data || [];
}

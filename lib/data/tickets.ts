"use server";

import { createClient } from "@/lib/supabase/server";
import type { 
  Ticket, 
  TicketWithMessages, 
  TicketMessage, 
  TicketStatus, 
  TicketPriority, 
  TicketCategory 
} from "@/types/database";

export interface GetTicketsParams {
  status?: TicketStatus | "all";
  priority?: TicketPriority | "all";
  category?: TicketCategory | "all";
  search?: string;
  limit?: number;
  offset?: number;
}

export interface GetTicketsResult {
  tickets: TicketWithMessages[];
  total: number;
}

export interface CreateTicketParams {
  subject: string;
  message: string;
  category: TicketCategory;
  priority: TicketPriority;
  server_id?: string;
}

/**
 * Get tickets for the current authenticated user
 */
export async function getUserTickets(params: GetTicketsParams = {}): Promise<GetTicketsResult> {
  const { status = "all", priority = "all", category = "all", search, limit = 50, offset = 0 } = params;
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error("Auth error:", authError);
    return { tickets: [], total: 0 };
  }

  // Build query
  let query = supabase
    .from("tickets")
    .select(`
      *,
      messages:ticket_messages(*)
    `, { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Apply filters
  if (status !== "all") {
    query = query.eq("status", status);
  }
  if (priority !== "all") {
    query = query.eq("priority", priority);
  }
  if (category !== "all") {
    query = query.eq("category", category);
  }

  // Apply search filter
  if (search) {
    query = query.or(`subject.ilike.%${search}%,ticket_number.ilike.%${search}%`);
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching tickets:", error);
    return { tickets: [], total: 0 };
  }

  // Transform data to match TicketWithMessages type
  const tickets: TicketWithMessages[] = (data || []).map((ticket: any) => ({
    ...ticket,
    messages: (ticket.messages || []).filter((m: any) => !m.is_internal_note) as TicketMessage[],
  }));

  return { tickets, total: count || 0 };
}

/**
 * Get a single ticket by ID with all messages
 */
export async function getTicketById(ticketId: string): Promise<TicketWithMessages | null> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("tickets")
    .select(`
      *,
      messages:ticket_messages(*)
    `)
    .eq("id", ticketId)
    .eq("user_id", user.id)
    .single() as { data: (Ticket & { messages: TicketMessage[] }) | null; error: unknown };

  if (error || !data) {
    console.error("Error fetching ticket:", error);
    return null;
  }

  return {
    ...data,
    messages: (data.messages || [])
      .filter((m) => !m.is_internal_note)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
  } as TicketWithMessages;
}

/**
 * Create a new support ticket
 */
export async function createTicket(params: CreateTicketParams): Promise<{ success: boolean; ticket?: Ticket; error?: string }> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  // Create the ticket
  const { data: ticket, error: ticketError } = await supabase
    .from("tickets")
    .insert({
      user_id: user.id,
      subject: params.subject,
      category: params.category,
      priority: params.priority,
      server_id: params.server_id || null,
      status: "open" as TicketStatus,
    } as any)
    .select()
    .single() as { data: Ticket | null; error: { message: string } | null };

  if (ticketError || !ticket) {
    console.error("Error creating ticket:", ticketError);
    return { success: false, error: ticketError?.message || "Failed to create ticket" };
  }

  // Add the initial message
  const { error: messageError } = await supabase
    .from("ticket_messages")
    .insert({
      ticket_id: ticket.id,
      user_id: user.id,
      message: params.message,
      is_staff_reply: false,
      is_internal_note: false,
    } as any);

  if (messageError) {
    console.error("Error creating ticket message:", messageError);
    // Ticket was created but message failed - still return success
  }

  // Log the activity
  await supabase.from("activity_logs").insert({
    user_id: user.id,
    entity_type: "ticket",
    entity_id: ticket.id,
    action: "ticket_created",
    description: `Support ticket created: ${params.subject}`,
  } as any);

  return { success: true, ticket: ticket as Ticket };
}

/**
 * Add a reply to an existing ticket
 */
export async function addTicketReply(
  ticketId: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  // Verify ticket ownership
  const { data: ticket, error: ticketError } = await supabase
    .from("tickets")
    .select("id, status")
    .eq("id", ticketId)
    .eq("user_id", user.id)
    .single() as { data: { id: string; status: TicketStatus } | null; error: unknown };

  if (ticketError || !ticket) {
    return { success: false, error: "Ticket not found" };
  }

  // Don't allow replies to closed tickets
  if (ticket.status === "closed") {
    return { success: false, error: "Cannot reply to a closed ticket" };
  }

  // Add the message
  const { error: messageError } = await supabase
    .from("ticket_messages")
    .insert({
      ticket_id: ticketId,
      user_id: user.id,
      message,
      is_staff_reply: false,
      is_internal_note: false,
    } as any);

  if (messageError) {
    console.error("Error adding ticket reply:", messageError);
    return { success: false, error: messageError.message };
  }

  return { success: true };
}

/**
 * Close a ticket
 */
export async function closeTicket(ticketId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await (supabase.from("tickets") as any)
    .update({
      status: "closed" as TicketStatus,
      closed_at: new Date().toISOString(),
    })
    .eq("id", ticketId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error closing ticket:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Reopen a closed ticket
 */
export async function reopenTicket(ticketId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await (supabase.from("tickets") as any)
    .update({
      status: "open" as TicketStatus,
      closed_at: null,
    })
    .eq("id", ticketId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error reopening ticket:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}


// ============================================================================
// ADMIN FUNCTIONS
// ============================================================================

import { createAdminClient } from "@/lib/supabase/admin";

export interface GetAllTicketsParams {
  search?: string;
  status?: TicketStatus | "all";
  priority?: TicketPriority | "all";
  page?: number;
  limit?: number;
}

export interface GetAllTicketsResult {
  tickets: TicketWithMessages[];
  total: number;
  totalPages: number;
}

/**
 * Get all tickets (admin only)
 */
export async function getAllTickets(params: GetAllTicketsParams = {}): Promise<GetAllTicketsResult> {
  const { search, status = "all", priority = "all", page = 1, limit = 10 } = params;
  const adminClient = createAdminClient();
  const offset = (page - 1) * limit;

  let query = (adminClient as any)
    .from("tickets")
    .select(`
      *,
      messages:ticket_messages(*),
      user:profiles!tickets_user_id_fkey(id, email, full_name),
      assigned_user:profiles!tickets_assigned_to_fkey(id, full_name)
    `, { count: "exact" })
    .order("updated_at", { ascending: false });

  // Apply filters
  if (search) {
    query = query.or(`subject.ilike.%${search}%,ticket_number.ilike.%${search}%`);
  }
  if (status !== "all") {
    query = query.eq("status", status);
  }
  if (priority !== "all") {
    query = query.eq("priority", priority);
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching tickets:", error);
    return { tickets: [], total: 0, totalPages: 0 };
  }

  const tickets: TicketWithMessages[] = (data || []).map((ticket: any) => ({
    ...ticket,
    messages: ticket.messages || [],
  }));

  return {
    tickets,
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

/**
 * Update ticket status (admin only)
 */
export async function updateTicketStatus(
  ticketId: string,
  status: TicketStatus
): Promise<{ success: boolean; error?: string }> {
  const adminClient = createAdminClient();

  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === "resolved") {
    updateData.resolved_at = new Date().toISOString();
  } else if (status === "closed") {
    updateData.closed_at = new Date().toISOString();
  }

  const { error } = await (adminClient as any)
    .from("tickets")
    .update(updateData)
    .eq("id", ticketId);

  if (error) {
    console.error("Error updating ticket status:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Add a message to a ticket (admin only - staff reply)
 */
export async function addTicketMessage(
  ticketId: string,
  message: string,
  isStaffReply: boolean = true
): Promise<{ success: boolean; error?: string }> {
  const adminClient = createAdminClient();
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await (adminClient as any)
    .from("ticket_messages")
    .insert({
      ticket_id: ticketId,
      user_id: user?.id || null,
      message,
      is_staff_reply: isStaffReply,
      is_internal_note: false,
    });

  if (error) {
    console.error("Error adding ticket message:", error);
    return { success: false, error: error.message };
  }

  // Update ticket's updated_at and first_response_at if this is first staff reply
  const { data: ticket } = await (adminClient as any)
    .from("tickets")
    .select("first_response_at")
    .eq("id", ticketId)
    .single();

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (isStaffReply && !ticket?.first_response_at) {
    updateData.first_response_at = new Date().toISOString();
  }

  await (adminClient as any)
    .from("tickets")
    .update(updateData)
    .eq("id", ticketId);

  return { success: true };
}

/**
 * Get ticket statistics (admin only)
 */
export async function getTicketStats(): Promise<{
  openTickets: number;
  urgentTickets: number;
  inProgressTickets: number;
  resolvedToday: number;
}> {
  const adminClient = createAdminClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [openResult, urgentResult, inProgressResult, resolvedTodayResult] = await Promise.all([
    (adminClient as any).from("tickets").select("id", { count: "exact", head: true }).eq("status", "open"),
    (adminClient as any).from("tickets").select("id", { count: "exact", head: true }).eq("priority", "urgent").neq("status", "closed").neq("status", "resolved"),
    (adminClient as any).from("tickets").select("id", { count: "exact", head: true }).eq("status", "in_progress"),
    (adminClient as any).from("tickets").select("id", { count: "exact", head: true }).eq("status", "resolved").gte("resolved_at", today.toISOString()),
  ]);

  return {
    openTickets: openResult.count || 0,
    urgentTickets: urgentResult.count || 0,
    inProgressTickets: inProgressResult.count || 0,
    resolvedToday: resolvedTodayResult.count || 0,
  };
}

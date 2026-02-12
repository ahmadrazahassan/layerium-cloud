"use server";

import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export interface UpdateProfileParams {
  full_name?: string;
  phone?: string;
  company_name?: string;
  timezone?: string;
  email_notifications?: boolean;
  marketing_emails?: boolean;
}

/**
 * Get the current user's profile
 */
export async function getCurrentUserProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data as Profile;
}

/**
 * Update the current user's profile
 */
export async function updateCurrentUser(
  updates: UpdateProfileParams
): Promise<{ success: boolean; profile?: Profile; error?: string }> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  // Use type assertion to bypass strict typing - Supabase types may not match schema
  const client = supabase as any;
  const { data, error } = await client
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: error.message };
  }

  // Log the activity
  try {
    await client.from("activity_logs").insert({
      user_id: user.id,
      entity_type: "profile",
      entity_id: user.id,
      action: "profile_updated",
      description: "Profile settings updated",
      new_values: updates,
    });
  } catch (logError) {
    console.warn("Failed to log activity:", logError);
  }

  return { success: true, profile: data as Profile };
}

/**
 * Update user's email (requires re-authentication)
 */
export async function updateUserEmail(
  newEmail: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ email: newEmail });

  if (error) {
    console.error("Error updating email:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Update user's password
 */
export async function updateUserPassword(
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    console.error("Error updating password:", error);
    return { success: false, error: error.message };
  }

  // Log the activity
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    try {
      await (supabase.from("activity_logs").insert({
        user_id: user.id,
        entity_type: "profile",
        entity_id: user.id,
        action: "password_changed",
        description: "Password was changed",
      } as any) as any);
    } catch (logError) {
      console.warn("Failed to log activity:", logError);
    }
  }

  return { success: true };
}

/**
 * Get user's activity logs
 */
export async function getUserActivityLogs(limit: number = 50): Promise<any[]> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching activity logs:", error);
    return [];
  }

  return data || [];
}

/**
 * Get user's active sessions (placeholder - would need Supabase Auth Admin API)
 */
export async function getUserSessions(): Promise<any[]> {
  // This would require Supabase Auth Admin API access
  // Return empty array until session tracking is implemented
  return [];
}

/**
 * Get user's SSH keys (stored in profile metadata)
 */
export async function getUserSSHKeys(): Promise<Array<{ id: number; name: string; fingerprint: string; created_at: string }>> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("metadata")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    return [];
  }

  const metadata = (data as any).metadata as Record<string, unknown>;
  return (metadata?.ssh_keys as any[]) || [];
}

/**
 * Add an SSH key
 */
export async function addSSHKey(
  name: string,
  publicKey: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const client = supabase as any;

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  // Get current profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("metadata")
    .eq("id", user.id)
    .single();

  if (profileError) {
    return { success: false, error: profileError.message };
  }

  const metadata = ((profile as any)?.metadata as Record<string, unknown>) || {};
  const sshKeys = (metadata.ssh_keys as any[]) || [];

  // Generate a simple fingerprint (in production, use proper SSH key parsing)
  const fingerprint = `SHA256:${Buffer.from(publicKey.slice(0, 32)).toString("base64").slice(0, 43)}`;

  const newKey = {
    id: Date.now(),
    name,
    fingerprint,
    created_at: new Date().toISOString(),
  };

  sshKeys.push(newKey);

  const { error: updateError } = await client
    .from("profiles")
    .update({
      metadata: { ...metadata, ssh_keys: sshKeys },
    })
    .eq("id", user.id);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return { success: true };
}

/**
 * Remove an SSH key
 */
export async function removeSSHKey(keyId: number): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const client = supabase as any;

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("metadata")
    .eq("id", user.id)
    .single();

  if (profileError) {
    return { success: false, error: profileError.message };
  }

  const metadata = ((profile as any)?.metadata as Record<string, unknown>) || {};
  const sshKeys = ((metadata.ssh_keys as any[]) || []).filter((k: any) => k.id !== keyId);

  const { error: updateError } = await client
    .from("profiles")
    .update({
      metadata: { ...metadata, ssh_keys: sshKeys },
    })
    .eq("id", user.id);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return { success: true };
}


// ============================================================================
// ADMIN FUNCTIONS
// ============================================================================

import { createAdminClient } from "@/lib/supabase/admin";
import type { ProfileWithUser, UserRole } from "@/types/database";

export interface GetUsersParams {
  search?: string;
  role?: UserRole | "all";
  status?: "all" | "active" | "inactive" | "verified" | "unverified";
  page?: number;
  limit?: number;
}

export interface GetUsersResult {
  users: ProfileWithUser[];
  total: number;
  totalPages: number;
}

/**
 * Get all users (admin only)
 */
export async function getUsers(params: GetUsersParams = {}): Promise<GetUsersResult> {
  const { search, role = "all", status = "all", page = 1, limit = 10 } = params;
  const adminClient = createAdminClient();
  const offset = (page - 1) * limit;

  let query = (adminClient as any)
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  // Apply filters
  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }
  if (role !== "all") {
    query = query.eq("role", role);
  }
  if (status === "active") {
    query = query.eq("is_active", true);
  } else if (status === "inactive") {
    query = query.eq("is_active", false);
  } else if (status === "verified") {
    query = query.eq("email_verified", true);
  } else if (status === "unverified") {
    query = query.eq("email_verified", false);
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching users:", error);
    return { users: [], total: 0, totalPages: 0 };
  }

  // Get server and order counts for each user
  const users: ProfileWithUser[] = await Promise.all(
    (data || []).map(async (user: Profile) => {
      const [serversResult, ordersResult] = await Promise.all([
        (adminClient as any).from("servers").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        (adminClient as any).from("orders").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);

      return {
        ...user,
        servers_count: serversResult.count || 0,
        orders_count: ordersResult.count || 0,
      } as ProfileWithUser;
    })
  );

  return {
    users,
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

/**
 * Update a user (admin only)
 */
export async function updateUser(
  userId: string,
  updates: Partial<Profile>
): Promise<{ success: boolean; error?: string }> {
  const adminClient = createAdminClient();

  const { error } = await (adminClient as any)
    .from("profiles")
    .update(updates)
    .eq("id", userId);

  if (error) {
    console.error("Error updating user:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

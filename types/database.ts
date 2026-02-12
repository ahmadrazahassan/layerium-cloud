/**
 * Layerium Cloud - Database Types
 * Auto-generated types matching Supabase schema
 */

// ============================================================================
// ENUMS
// ============================================================================

export type UserRole = 'USER' | 'ADMIN';

export type ServerStatus = 'provisioning' | 'running' | 'stopped' | 'restarting' | 'error' | 'suspended';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';

export type TicketStatus = 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketCategory = 'billing' | 'technical' | 'sales' | 'abuse' | 'other';

export type PlanType = 'VPS' | 'RDP';

export type CurrencyType = 'USD' | 'PKR' | 'EUR' | 'GBP';

export type BillingPeriod = 'monthly' | 'quarterly' | 'yearly';

// ============================================================================
// TABLE TYPES
// ============================================================================

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  company_name: string | null;
  role: UserRole;
  is_active: boolean;
  email_verified: boolean;
  timezone: string | null;
  email_notifications: boolean;
  marketing_emails: boolean;
  notes: string | null;
  last_login_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: PlanType;
  cpu_cores: number;
  ram_gb: number;
  storage_gb: number;
  bandwidth_tb: number;
  price_usd_cents: number;
  price_pkr_paisa: number;
  billing_period: BillingPeriod;
  setup_fee_usd_cents: number;
  setup_fee_pkr_paisa: number;
  locations: string[];
  features: string[];
  os_templates: string[];
  is_popular: boolean;
  is_active: boolean;
  is_visible: boolean;
  sort_order: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Server {
  id: string;
  user_id: string;
  plan_id: string;
  order_id: string | null;
  hostname: string;
  label: string | null;
  ip_address: string | null;
  ipv6_address: string | null;
  reverse_dns: string | null;
  status: ServerStatus;
  status_message: string | null;
  last_status_change: string | null;
  os_template: string;
  location: string;
  root_password_hash: string | null;
  // Admin-provided credentials
  username: string;
  password: string | null;
  rdp_port: number;
  ssh_port: number;
  // Resource usage
  cpu_usage: number;
  ram_usage: number;
  disk_usage: number;
  bandwidth_used_gb: number;
  next_billing_date: string | null;
  is_suspended: boolean;
  suspension_reason: string | null;
  provider_server_id: string | null;
  provider_name: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  plan_id: string;
  server_id: string | null;
  amount_cents: number;
  currency: CurrencyType;
  setup_fee_cents: number;
  discount_cents: number;
  tax_cents: number;
  total_cents: number;
  status: OrderStatus;
  status_history: Array<{ status: OrderStatus; timestamp: string; note?: string }>;
  payment_method: string | null;
  payment_intent_id: string | null;
  payment_provider: string | null;
  paid_at: string | null;
  billing_period_start: string | null;
  billing_period_end: string | null;
  plan_snapshot: PricingPlan;
  admin_notes: string | null;
  customer_notes: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  user_id: string;
  order_id: string | null;
  subtotal_cents: number;
  tax_cents: number;
  discount_cents: number;
  total_cents: number;
  currency: CurrencyType;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  issue_date: string;
  due_date: string;
  paid_at: string | null;
  line_items: Array<{
    description: string;
    quantity: number;
    unit_price_cents: number;
    total_cents: number;
  }>;
  pdf_url: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: string;
  ticket_number: string;
  user_id: string;
  assigned_to: string | null;
  server_id: string | null;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  first_response_at: string | null;
  resolved_at: string | null;
  closed_at: string | null;
  tags: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_staff_reply: boolean;
  is_internal_note: boolean;
  attachments: Array<{
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  entity_type: string;
  entity_id: string | null;
  action: string;
  description: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Datacenter {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
  country_code: string;
  is_active: boolean;
  is_available: boolean;
  total_capacity: number | null;
  used_capacity: number;
  avg_latency_ms: number | null;
  flag_emoji: string | null;
  sort_order: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface OsTemplate {
  id: string;
  code: string;
  name: string;
  version: string | null;
  family: 'linux' | 'windows';
  plan_types: PlanType[];
  min_ram_gb: number;
  min_storage_gb: number;
  is_active: boolean;
  icon_url: string | null;
  sort_order: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AppSetting {
  id: string;
  key: string;
  category: string;
  value: unknown;
  value_type: 'string' | 'number' | 'boolean' | 'json';
  label: string;
  description: string | null;
  is_public: boolean;
  is_editable: boolean;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// SUPABASE DATABASE TYPE
// ============================================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      pricing_plans: {
        Row: PricingPlan;
        Insert: Omit<PricingPlan, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<PricingPlan, 'id' | 'created_at'>>;
      };
      servers: {
        Row: Server;
        Insert: Omit<Server, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Server, 'id' | 'created_at'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'> & {
          id?: string;
          order_number?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Order, 'id' | 'order_number' | 'created_at'>>;
      };
      invoices: {
        Row: Invoice;
        Insert: Omit<Invoice, 'id' | 'invoice_number' | 'created_at' | 'updated_at'> & {
          id?: string;
          invoice_number?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Invoice, 'id' | 'invoice_number' | 'created_at'>>;
      };
      tickets: {
        Row: Ticket;
        Insert: Omit<Ticket, 'id' | 'ticket_number' | 'created_at' | 'updated_at'> & {
          id?: string;
          ticket_number?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Ticket, 'id' | 'ticket_number' | 'created_at'>>;
      };
      ticket_messages: {
        Row: TicketMessage;
        Insert: Omit<TicketMessage, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<TicketMessage, 'id' | 'created_at'>>;
      };
      activity_logs: {
        Row: ActivityLog;
        Insert: Omit<ActivityLog, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: never; // Activity logs should not be updated
      };
      datacenters: {
        Row: Datacenter;
        Insert: Omit<Datacenter, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Datacenter, 'id' | 'created_at'>>;
      };
      os_templates: {
        Row: OsTemplate;
        Insert: Omit<OsTemplate, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<OsTemplate, 'id' | 'created_at'>>;
      };
      app_settings: {
        Row: AppSetting;
        Insert: Omit<AppSetting, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<AppSetting, 'id' | 'created_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      get_user_role: {
        Args: Record<string, never>;
        Returns: UserRole;
      };
      log_activity: {
        Args: {
          p_user_id: string;
          p_entity_type: string;
          p_entity_id: string;
          p_action: string;
          p_description?: string;
          p_old_values?: Record<string, unknown>;
          p_new_values?: Record<string, unknown>;
          p_ip_address?: string;
          p_metadata?: Record<string, unknown>;
        };
        Returns: string;
      };
    };
    Enums: {
      user_role: UserRole;
      server_status: ServerStatus;
      order_status: OrderStatus;
      ticket_status: TicketStatus;
      ticket_priority: TicketPriority;
      ticket_category: TicketCategory;
      plan_type: PlanType;
      currency_type: CurrencyType;
    };
  };
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/** Profile with user data for display */
export type ProfileWithUser = Profile & {
  servers_count?: number;
  orders_count?: number;
  tickets_count?: number;
};

/** Server with related data */
export type ServerWithPlan = Server & {
  plan: PricingPlan;
  user?: Profile;
};

/** Order with related data */
export type OrderWithDetails = Order & {
  plan: PricingPlan;
  server?: Server;
  user?: Profile;
};

/** Ticket with messages and user */
export type TicketWithMessages = Ticket & {
  messages: TicketMessage[];
  user?: Profile;
  assigned_user?: Profile;
};

/** Pricing plan formatted for display */
export type PricingPlanDisplay = PricingPlan & {
  price_usd: number; // Formatted price (e.g., 9.99)
  price_pkr: number; // Formatted price (e.g., 999.00)
  setup_fee_usd: number;
  setup_fee_pkr: number;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/** Convert cents to dollars/rupees */
export function centsToAmount(cents: number): number {
  return cents / 100;
}

/** Convert dollars/rupees to cents */
export function amountToCents(amount: number): number {
  return Math.round(amount * 100);
}

/** Format pricing plan for display */
export function formatPricingPlan(plan: PricingPlan): PricingPlanDisplay {
  return {
    ...plan,
    price_usd: centsToAmount(plan.price_usd_cents),
    price_pkr: centsToAmount(plan.price_pkr_paisa),
    setup_fee_usd: centsToAmount(plan.setup_fee_usd_cents),
    setup_fee_pkr: centsToAmount(plan.setup_fee_pkr_paisa),
  };
}

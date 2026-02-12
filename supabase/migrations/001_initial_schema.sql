-- ============================================================================
-- LAYERIUM CLOUD - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- Migration: 001_initial_schema.sql
-- Version: 1.0.0
-- Description: Complete database schema for Layerium Cloud VPS/RDP hosting
-- Author: Layerium Cloud Engineering Team
-- Created: 2024-12-29
-- 
-- This migration creates:
-- - All custom types (enums)
-- - All tables with proper constraints
-- - All indexes for performance
-- - All functions and triggers
-- - Automatic profile creation on signup
-- ============================================================================

-- ============================================================================
-- SECTION 1: EXTENSIONS
-- ============================================================================

-- UUID generation for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Fuzzy text search for admin search functionality
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Cryptographic functions (for password hashing if needed)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- SECTION 2: DROP EXISTING OBJECTS (for clean reinstall)
-- ============================================================================
-- This section safely drops existing objects if they exist
-- Uses DO blocks to handle cases where tables don't exist yet

-- Drop auth trigger (this one is safe as auth.users always exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop functions first (CASCADE will handle dependent triggers)
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.generate_order_number() CASCADE;
DROP FUNCTION IF EXISTS public.generate_invoice_number() CASCADE;
DROP FUNCTION IF EXISTS public.generate_ticket_number() CASCADE;
DROP FUNCTION IF EXISTS public.log_activity() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.is_staff() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_role() CASCADE;
DROP FUNCTION IF EXISTS public.log_server_changes() CASCADE;
DROP FUNCTION IF EXISTS public.update_ticket_on_new_message() CASCADE;
DROP FUNCTION IF EXISTS public.generate_referral_code() CASCADE;

-- Drop tables (CASCADE handles foreign keys and triggers)
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.ticket_messages CASCADE;
DROP TABLE IF EXISTS public.tickets CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.servers CASCADE;
DROP TABLE IF EXISTS public.payment_methods CASCADE;
DROP TABLE IF EXISTS public.pricing_plans CASCADE;
DROP TABLE IF EXISTS public.os_templates CASCADE;
DROP TABLE IF EXISTS public.datacenters CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.app_settings CASCADE;

-- Drop types
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.server_status CASCADE;
DROP TYPE IF EXISTS public.order_status CASCADE;
DROP TYPE IF EXISTS public.ticket_status CASCADE;
DROP TYPE IF EXISTS public.ticket_priority CASCADE;
DROP TYPE IF EXISTS public.ticket_category CASCADE;
DROP TYPE IF EXISTS public.plan_type CASCADE;
DROP TYPE IF EXISTS public.currency_type CASCADE;
DROP TYPE IF EXISTS public.billing_period CASCADE;
DROP TYPE IF EXISTS public.payment_method_type CASCADE;
DROP TYPE IF EXISTS public.invoice_status CASCADE;

-- ============================================================================
-- SECTION 3: CUSTOM TYPES (ENUMS)
-- ============================================================================

-- User roles
CREATE TYPE public.user_role AS ENUM ('USER', 'ADMIN', 'SUPPORT');

-- Server lifecycle status
CREATE TYPE public.server_status AS ENUM (
    'pending',        -- Order placed, awaiting payment
    'provisioning',   -- Being set up
    'running',        -- Active and running
    'stopped',        -- Manually stopped
    'restarting',     -- In restart process
    'rebuilding',     -- OS reinstall in progress
    'suspended',      -- Suspended for non-payment or abuse
    'error',          -- Error state
    'terminated'      -- Permanently deleted
);

-- Order status
CREATE TYPE public.order_status AS ENUM (
    'pending',        -- Awaiting payment
    'processing',     -- Payment received, processing
    'completed',      -- Successfully completed
    'failed',         -- Payment or provisioning failed
    'refunded',       -- Money returned
    'cancelled'       -- Cancelled by user or admin
);

-- Invoice status
CREATE TYPE public.invoice_status AS ENUM (
    'draft',          -- Not yet sent
    'sent',           -- Sent to customer
    'paid',           -- Payment received
    'overdue',        -- Past due date
    'cancelled',      -- Cancelled
    'refunded'        -- Refunded
);

-- Support ticket status
CREATE TYPE public.ticket_status AS ENUM (
    'open',              -- New ticket
    'in_progress',       -- Being worked on
    'waiting_customer',  -- Waiting for customer response
    'waiting_staff',     -- Waiting for staff response
    'resolved',          -- Issue resolved
    'closed'             -- Ticket closed
);

-- Ticket priority
CREATE TYPE public.ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Ticket category
CREATE TYPE public.ticket_category AS ENUM (
    'billing',
    'technical',
    'sales',
    'abuse',
    'account',
    'other'
);

-- Plan type
CREATE TYPE public.plan_type AS ENUM ('VPS', 'RDP');

-- Supported currencies
CREATE TYPE public.currency_type AS ENUM ('USD', 'PKR', 'EUR', 'GBP');

-- Billing periods
CREATE TYPE public.billing_period AS ENUM ('monthly', 'quarterly', 'semi_annual', 'yearly');

-- Payment method types
CREATE TYPE public.payment_method_type AS ENUM ('card', 'bank_transfer', 'paypal', 'crypto');


-- ============================================================================
-- SECTION 4: CORE TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 4.1 PROFILES TABLE
-- Extends Supabase auth.users with application-specific data
-- This is the MOST IMPORTANT table - created automatically on signup
-- ----------------------------------------------------------------------------
CREATE TABLE public.profiles (
    -- Primary key links to Supabase auth
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic info
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    
    -- Business info
    company_name TEXT,
    tax_id TEXT,                    -- VAT/Tax ID for invoicing
    
    -- Address (for billing)
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    country TEXT,
    country_code TEXT,
    
    -- Role and status
    role public.user_role NOT NULL DEFAULT 'USER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Preferences
    preferred_currency public.currency_type DEFAULT 'USD',
    timezone TEXT DEFAULT 'UTC',
    locale TEXT DEFAULT 'en',
    
    -- Notifications
    email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    marketing_emails BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Security
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    last_login_ip INET,
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ,
    
    -- Account balance (for prepaid credits)
    balance_usd_cents INTEGER NOT NULL DEFAULT 0,
    balance_pkr_paisa INTEGER NOT NULL DEFAULT 0,
    
    -- Referral system
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES public.profiles(id),
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    notes TEXT,                     -- Admin notes about user
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT profiles_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT profiles_phone_format CHECK (phone IS NULL OR phone ~* '^\+?[0-9]{10,15}$'),
    CONSTRAINT profiles_balance_positive CHECK (balance_usd_cents >= 0 AND balance_pkr_paisa >= 0)
);

-- Indexes for profiles
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_is_active ON public.profiles(is_active);
CREATE INDEX idx_profiles_referral_code ON public.profiles(referral_code) WHERE referral_code IS NOT NULL;
CREATE INDEX idx_profiles_referred_by ON public.profiles(referred_by) WHERE referred_by IS NOT NULL;
CREATE INDEX idx_profiles_created_at ON public.profiles(created_at DESC);
CREATE INDEX idx_profiles_full_name_trgm ON public.profiles USING gin(full_name gin_trgm_ops);
CREATE INDEX idx_profiles_email_trgm ON public.profiles USING gin(email gin_trgm_ops);

-- Comments
COMMENT ON TABLE public.profiles IS 'User profiles - extends Supabase auth.users with app-specific data';
COMMENT ON COLUMN public.profiles.balance_usd_cents IS 'Prepaid account balance in USD cents';
COMMENT ON COLUMN public.profiles.referral_code IS 'Unique code for referral program';

-- ----------------------------------------------------------------------------
-- 4.2 DATACENTERS TABLE
-- Available server locations
-- ----------------------------------------------------------------------------
CREATE TABLE public.datacenters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identification
    code TEXT NOT NULL UNIQUE,      -- 'us-east-1', 'eu-west-1', etc.
    name TEXT NOT NULL,             -- 'US East (New York)'
    short_name TEXT NOT NULL,       -- 'US East'
    
    -- Location
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    country_code TEXT NOT NULL,     -- ISO 3166-1 alpha-2
    region TEXT NOT NULL,           -- 'north-america', 'europe', 'asia', etc.
    
    -- Display
    flag_emoji TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,  -- Can accept new servers
    
    -- Capacity tracking
    total_capacity INTEGER,
    used_capacity INTEGER DEFAULT 0,
    
    -- Network info
    avg_latency_ms INTEGER,
    network_speed_gbps INTEGER DEFAULT 1,
    
    -- Features
    features TEXT[] DEFAULT '{}',   -- ['nvme', 'ddos-protection', 'ipv6']
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_datacenters_code ON public.datacenters(code);
CREATE INDEX idx_datacenters_is_active ON public.datacenters(is_active);
CREATE INDEX idx_datacenters_region ON public.datacenters(region);
CREATE INDEX idx_datacenters_sort_order ON public.datacenters(sort_order);

COMMENT ON TABLE public.datacenters IS 'Available datacenter locations for server deployment';

-- ----------------------------------------------------------------------------
-- 4.3 OS TEMPLATES TABLE
-- Available operating systems
-- ----------------------------------------------------------------------------
CREATE TABLE public.os_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identification
    code TEXT NOT NULL UNIQUE,      -- 'ubuntu-24.04', 'windows-2022'
    name TEXT NOT NULL,             -- 'Ubuntu'
    version TEXT,                   -- '24.04 LTS'
    full_name TEXT NOT NULL,        -- 'Ubuntu 24.04 LTS'
    
    -- Classification
    family TEXT NOT NULL,           -- 'linux', 'windows'
    distribution TEXT,              -- 'debian', 'rhel', 'windows'
    
    -- Compatibility
    plan_types public.plan_type[] NOT NULL DEFAULT '{VPS}',
    min_ram_gb INTEGER NOT NULL DEFAULT 1,
    min_storage_gb INTEGER NOT NULL DEFAULT 20,
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,  -- Default for plan type
    
    -- Display
    icon_url TEXT,
    logo_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_os_templates_code ON public.os_templates(code);
CREATE INDEX idx_os_templates_family ON public.os_templates(family);
CREATE INDEX idx_os_templates_is_active ON public.os_templates(is_active);
CREATE INDEX idx_os_templates_plan_types ON public.os_templates USING gin(plan_types);

COMMENT ON TABLE public.os_templates IS 'Available operating system templates for servers';

-- ----------------------------------------------------------------------------
-- 4.4 PRICING PLANS TABLE
-- VPS and RDP hosting plans
-- ----------------------------------------------------------------------------
CREATE TABLE public.pricing_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identification
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    short_description TEXT,
    
    -- Type
    type public.plan_type NOT NULL,
    
    -- Specifications
    cpu_cores INTEGER NOT NULL CHECK (cpu_cores > 0),
    ram_gb INTEGER NOT NULL CHECK (ram_gb > 0),
    storage_gb INTEGER NOT NULL CHECK (storage_gb > 0),
    storage_type TEXT NOT NULL DEFAULT 'nvme',  -- 'nvme', 'ssd', 'hdd'
    bandwidth_tb INTEGER NOT NULL CHECK (bandwidth_tb >= 0),
    
    -- Network
    ipv4_included INTEGER NOT NULL DEFAULT 1,
    ipv6_included BOOLEAN NOT NULL DEFAULT TRUE,
    dedicated_ip BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Pricing (stored in smallest unit for precision)
    price_usd_cents INTEGER NOT NULL CHECK (price_usd_cents >= 0),
    price_pkr_paisa INTEGER NOT NULL CHECK (price_pkr_paisa >= 0),
    price_eur_cents INTEGER NOT NULL DEFAULT 0,
    price_gbp_pence INTEGER NOT NULL DEFAULT 0,
    
    -- Setup fees
    setup_fee_usd_cents INTEGER NOT NULL DEFAULT 0,
    setup_fee_pkr_paisa INTEGER NOT NULL DEFAULT 0,
    
    -- Billing
    billing_period public.billing_period NOT NULL DEFAULT 'monthly',
    
    -- Discounts for longer terms (percentage)
    quarterly_discount INTEGER NOT NULL DEFAULT 0,
    semi_annual_discount INTEGER NOT NULL DEFAULT 5,
    yearly_discount INTEGER NOT NULL DEFAULT 10,
    
    -- Availability
    locations TEXT[] NOT NULL DEFAULT '{}',
    os_templates TEXT[] NOT NULL DEFAULT '{}',
    
    -- Features list for display
    features TEXT[] NOT NULL DEFAULT '{}',
    
    -- Stock management
    stock_available INTEGER,        -- NULL = unlimited
    stock_sold INTEGER NOT NULL DEFAULT 0,
    
    -- Display
    is_popular BOOLEAN NOT NULL DEFAULT FALSE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    badge_text TEXT,                -- 'Best Value', 'Most Popular'
    sort_order INTEGER NOT NULL DEFAULT 0,
    
    -- Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,  -- Show on website
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pricing_plans_slug ON public.pricing_plans(slug);
CREATE INDEX idx_pricing_plans_type ON public.pricing_plans(type);
CREATE INDEX idx_pricing_plans_is_active ON public.pricing_plans(is_active);
CREATE INDEX idx_pricing_plans_is_visible ON public.pricing_plans(is_visible);
CREATE INDEX idx_pricing_plans_sort_order ON public.pricing_plans(sort_order);
CREATE INDEX idx_pricing_plans_locations ON public.pricing_plans USING gin(locations);

COMMENT ON TABLE public.pricing_plans IS 'VPS and RDP hosting plans with pricing';
COMMENT ON COLUMN public.pricing_plans.price_usd_cents IS 'Monthly price in USD cents (999 = $9.99)';
COMMENT ON COLUMN public.pricing_plans.price_pkr_paisa IS 'Monthly price in PKR paisa (99900 = ₨999)';


-- ----------------------------------------------------------------------------
-- 4.5 PAYMENT METHODS TABLE
-- Saved payment methods for users
-- ----------------------------------------------------------------------------
CREATE TABLE public.payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Type
    type public.payment_method_type NOT NULL,
    
    -- Card details (masked)
    card_brand TEXT,                -- 'visa', 'mastercard', 'amex'
    card_last4 TEXT,
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    
    -- Provider reference
    provider TEXT,                  -- 'stripe', 'paypal'
    provider_payment_method_id TEXT,
    provider_customer_id TEXT,
    
    -- Status
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Billing address
    billing_name TEXT,
    billing_email TEXT,
    billing_address JSONB,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payment_methods_user_id ON public.payment_methods(user_id);
CREATE INDEX idx_payment_methods_is_default ON public.payment_methods(user_id, is_default) WHERE is_default = TRUE;
CREATE INDEX idx_payment_methods_provider ON public.payment_methods(provider, provider_customer_id);

COMMENT ON TABLE public.payment_methods IS 'Saved payment methods for users';

-- ----------------------------------------------------------------------------
-- 4.6 SERVERS TABLE
-- Provisioned VPS/RDP servers
-- ----------------------------------------------------------------------------
CREATE TABLE public.servers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Ownership
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.pricing_plans(id) ON DELETE RESTRICT,
    
    -- Identification
    hostname TEXT NOT NULL,
    label TEXT,                     -- User-friendly display name
    
    -- Network
    ip_address INET,
    ipv6_address INET,
    reverse_dns TEXT,
    mac_address TEXT,
    
    -- Status
    status public.server_status NOT NULL DEFAULT 'pending',
    status_message TEXT,
    last_status_change TIMESTAMPTZ DEFAULT NOW(),
    
    -- Configuration
    os_template TEXT NOT NULL,
    os_template_name TEXT,          -- Cached name for display
    location TEXT NOT NULL,
    location_name TEXT,             -- Cached name for display
    datacenter_id UUID REFERENCES public.datacenters(id),
    
    -- Specifications (snapshot at creation)
    cpu_cores INTEGER NOT NULL,
    ram_gb INTEGER NOT NULL,
    storage_gb INTEGER NOT NULL,
    bandwidth_tb INTEGER NOT NULL,
    
    -- Credentials (encrypted)
    root_password_encrypted TEXT,
    ssh_keys TEXT[],
    
    -- Resource usage (updated by monitoring)
    cpu_usage DECIMAL(5, 2) DEFAULT 0,
    ram_usage DECIMAL(5, 2) DEFAULT 0,
    disk_usage DECIMAL(5, 2) DEFAULT 0,
    bandwidth_used_gb DECIMAL(12, 2) DEFAULT 0,
    last_metrics_update TIMESTAMPTZ,
    
    -- Billing
    billing_amount_cents INTEGER NOT NULL,
    billing_currency public.currency_type NOT NULL,
    billing_period public.billing_period NOT NULL DEFAULT 'monthly',
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    next_billing_date TIMESTAMPTZ,
    auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Suspension
    is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
    suspension_reason TEXT,
    suspended_at TIMESTAMPTZ,
    
    -- Provider integration
    provider_name TEXT,             -- 'vultr', 'digitalocean', 'custom'
    provider_server_id TEXT,
    provider_data JSONB DEFAULT '{}',
    
    -- Metadata
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    notes TEXT,                     -- Admin notes
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    provisioned_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,         -- Soft delete
    
    -- Constraints
    CONSTRAINT servers_hostname_format CHECK (hostname ~* '^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$'),
    CONSTRAINT servers_usage_range CHECK (
        cpu_usage >= 0 AND cpu_usage <= 100 AND
        ram_usage >= 0 AND ram_usage <= 100 AND
        disk_usage >= 0 AND disk_usage <= 100
    )
);

CREATE INDEX idx_servers_user_id ON public.servers(user_id);
CREATE INDEX idx_servers_plan_id ON public.servers(plan_id);
CREATE INDEX idx_servers_status ON public.servers(status);
CREATE INDEX idx_servers_location ON public.servers(location);
CREATE INDEX idx_servers_datacenter_id ON public.servers(datacenter_id);
CREATE INDEX idx_servers_ip_address ON public.servers(ip_address) WHERE ip_address IS NOT NULL;
CREATE INDEX idx_servers_hostname ON public.servers(hostname);
CREATE INDEX idx_servers_created_at ON public.servers(created_at DESC);
CREATE INDEX idx_servers_next_billing ON public.servers(next_billing_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_servers_active ON public.servers(user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_servers_provider ON public.servers(provider_name, provider_server_id) WHERE provider_server_id IS NOT NULL;
CREATE INDEX idx_servers_tags ON public.servers USING gin(tags);

COMMENT ON TABLE public.servers IS 'Provisioned VPS and RDP servers';
COMMENT ON COLUMN public.servers.deleted_at IS 'Soft delete - NULL means active';

-- ----------------------------------------------------------------------------
-- 4.7 ORDERS TABLE
-- Purchase orders
-- ----------------------------------------------------------------------------
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identification
    order_number TEXT NOT NULL UNIQUE,
    
    -- Ownership
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- What was ordered
    plan_id UUID NOT NULL REFERENCES public.pricing_plans(id) ON DELETE RESTRICT,
    server_id UUID REFERENCES public.servers(id) ON DELETE SET NULL,
    
    -- Order type
    order_type TEXT NOT NULL DEFAULT 'new' CHECK (order_type IN ('new', 'renewal', 'upgrade', 'addon')),
    
    -- Pricing (at time of order)
    subtotal_cents INTEGER NOT NULL CHECK (subtotal_cents >= 0),
    setup_fee_cents INTEGER NOT NULL DEFAULT 0,
    discount_cents INTEGER NOT NULL DEFAULT 0,
    discount_code TEXT,
    tax_cents INTEGER NOT NULL DEFAULT 0,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
    currency public.currency_type NOT NULL,
    
    -- Status
    status public.order_status NOT NULL DEFAULT 'pending',
    status_history JSONB DEFAULT '[]',
    
    -- Payment
    payment_method_id UUID REFERENCES public.payment_methods(id),
    payment_provider TEXT,
    payment_intent_id TEXT,
    payment_method_type TEXT,
    paid_at TIMESTAMPTZ,
    
    -- Billing period
    billing_period public.billing_period NOT NULL DEFAULT 'monthly',
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    
    -- Configuration snapshot
    plan_snapshot JSONB NOT NULL,
    server_config JSONB,            -- hostname, location, os, etc.
    
    -- Notes
    customer_notes TEXT,
    admin_notes TEXT,
    
    -- Refund info
    refunded_at TIMESTAMPTZ,
    refund_amount_cents INTEGER,
    refund_reason TEXT,
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_plan_id ON public.orders(plan_id);
CREATE INDEX idx_orders_server_id ON public.orders(server_id) WHERE server_id IS NOT NULL;
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_orders_payment_intent ON public.orders(payment_intent_id) WHERE payment_intent_id IS NOT NULL;
CREATE INDEX idx_orders_user_status ON public.orders(user_id, status);

COMMENT ON TABLE public.orders IS 'Purchase orders for hosting plans';
COMMENT ON COLUMN public.orders.plan_snapshot IS 'Complete plan details at time of purchase';

-- ----------------------------------------------------------------------------
-- 4.8 INVOICES TABLE
-- Generated invoices
-- ----------------------------------------------------------------------------
CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identification
    invoice_number TEXT NOT NULL UNIQUE,
    
    -- Ownership
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    
    -- Amounts
    subtotal_cents INTEGER NOT NULL,
    discount_cents INTEGER NOT NULL DEFAULT 0,
    tax_cents INTEGER NOT NULL DEFAULT 0,
    total_cents INTEGER NOT NULL,
    currency public.currency_type NOT NULL,
    
    -- Status
    status public.invoice_status NOT NULL DEFAULT 'draft',
    
    -- Dates
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    paid_at TIMESTAMPTZ,
    
    -- Line items
    line_items JSONB NOT NULL DEFAULT '[]',
    
    -- Billing info snapshot
    billing_name TEXT,
    billing_email TEXT,
    billing_address JSONB,
    
    -- Payment info
    payment_method TEXT,
    payment_reference TEXT,
    
    -- PDF
    pdf_url TEXT,
    pdf_generated_at TIMESTAMPTZ,
    
    -- Notes
    notes TEXT,
    footer_text TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_invoice_number ON public.invoices(invoice_number);
CREATE INDEX idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX idx_invoices_order_id ON public.invoices(order_id) WHERE order_id IS NOT NULL;
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX idx_invoices_created_at ON public.invoices(created_at DESC);

COMMENT ON TABLE public.invoices IS 'Generated invoices for billing';


-- ----------------------------------------------------------------------------
-- 4.9 TICKETS TABLE
-- Support tickets
-- ----------------------------------------------------------------------------
CREATE TABLE public.tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identification
    ticket_number TEXT NOT NULL UNIQUE,
    
    -- Ownership
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    -- Related entities
    server_id UUID REFERENCES public.servers(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    
    -- Ticket details
    subject TEXT NOT NULL,
    category public.ticket_category NOT NULL DEFAULT 'other',
    priority public.ticket_priority NOT NULL DEFAULT 'medium',
    status public.ticket_status NOT NULL DEFAULT 'open',
    
    -- Department routing
    department TEXT DEFAULT 'support',
    
    -- Tracking
    first_response_at TIMESTAMPTZ,
    last_customer_reply_at TIMESTAMPTZ,
    last_staff_reply_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    
    -- SLA tracking
    sla_due_at TIMESTAMPTZ,
    sla_breached BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Tags and labels
    tags TEXT[] DEFAULT '{}',
    
    -- Satisfaction
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    satisfaction_comment TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tickets_ticket_number ON public.tickets(ticket_number);
CREATE INDEX idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX idx_tickets_assigned_to ON public.tickets(assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX idx_tickets_server_id ON public.tickets(server_id) WHERE server_id IS NOT NULL;
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE INDEX idx_tickets_priority ON public.tickets(priority);
CREATE INDEX idx_tickets_category ON public.tickets(category);
CREATE INDEX idx_tickets_created_at ON public.tickets(created_at DESC);
CREATE INDEX idx_tickets_open ON public.tickets(status, priority) WHERE status IN ('open', 'in_progress', 'waiting_staff');
CREATE INDEX idx_tickets_tags ON public.tickets USING gin(tags);

COMMENT ON TABLE public.tickets IS 'Customer support tickets';

-- ----------------------------------------------------------------------------
-- 4.10 TICKET MESSAGES TABLE
-- Messages within tickets
-- ----------------------------------------------------------------------------
CREATE TABLE public.ticket_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Parent ticket
    ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
    
    -- Author
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Content
    message TEXT NOT NULL,
    message_html TEXT,              -- Rendered HTML version
    
    -- Type flags
    is_staff_reply BOOLEAN NOT NULL DEFAULT FALSE,
    is_internal_note BOOLEAN NOT NULL DEFAULT FALSE,
    is_system_message BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Attachments
    attachments JSONB DEFAULT '[]',
    
    -- Email tracking
    email_message_id TEXT,
    sent_via_email BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    edited_at TIMESTAMPTZ
);

CREATE INDEX idx_ticket_messages_ticket_id ON public.ticket_messages(ticket_id);
CREATE INDEX idx_ticket_messages_user_id ON public.ticket_messages(user_id);
CREATE INDEX idx_ticket_messages_created_at ON public.ticket_messages(created_at);
CREATE INDEX idx_ticket_messages_is_staff ON public.ticket_messages(ticket_id, is_staff_reply);

COMMENT ON TABLE public.ticket_messages IS 'Messages within support tickets';
COMMENT ON COLUMN public.ticket_messages.is_internal_note IS 'Internal notes only visible to staff';

-- ----------------------------------------------------------------------------
-- 4.11 ACTIVITY LOGS TABLE
-- Comprehensive audit trail
-- ----------------------------------------------------------------------------
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Who
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_email TEXT,                -- Cached for when user is deleted
    user_role public.user_role,
    
    -- What
    entity_type TEXT NOT NULL,      -- 'server', 'order', 'ticket', 'profile', etc.
    entity_id UUID,
    entity_name TEXT,               -- Cached name for display
    
    -- Action
    action TEXT NOT NULL,           -- 'created', 'updated', 'deleted', 'login', etc.
    action_category TEXT,           -- 'auth', 'billing', 'server', 'support', 'admin'
    description TEXT,
    
    -- Changes
    old_values JSONB,
    new_values JSONB,
    changes_summary TEXT,           -- Human-readable summary
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    request_id TEXT,                -- For tracing
    
    -- Severity
    severity TEXT DEFAULT 'info' CHECK (severity IN ('debug', 'info', 'warning', 'error', 'critical')),
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Partition-friendly indexes
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_action ON public.activity_logs(action);
CREATE INDEX idx_activity_logs_action_category ON public.activity_logs(action_category) WHERE action_category IS NOT NULL;
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_severity ON public.activity_logs(severity) WHERE severity IN ('warning', 'error', 'critical');
CREATE INDEX idx_activity_logs_ip ON public.activity_logs(ip_address) WHERE ip_address IS NOT NULL;

COMMENT ON TABLE public.activity_logs IS 'Comprehensive audit trail for all system actions';

-- ----------------------------------------------------------------------------
-- 4.12 APP SETTINGS TABLE
-- Application-wide settings
-- ----------------------------------------------------------------------------
CREATE TABLE public.app_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Setting identification
    key TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL DEFAULT 'general',
    
    -- Value (stored as JSONB for flexibility)
    value JSONB NOT NULL,
    value_type TEXT NOT NULL DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
    
    -- Description
    label TEXT NOT NULL,
    description TEXT,
    
    -- Validation
    is_required BOOLEAN NOT NULL DEFAULT FALSE,
    validation_rules JSONB,
    
    -- Access
    is_public BOOLEAN NOT NULL DEFAULT FALSE,  -- Can be read without auth
    is_editable BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES public.profiles(id)
);

CREATE INDEX idx_app_settings_key ON public.app_settings(key);
CREATE INDEX idx_app_settings_category ON public.app_settings(category);
CREATE INDEX idx_app_settings_is_public ON public.app_settings(is_public);

COMMENT ON TABLE public.app_settings IS 'Application-wide configuration settings';


-- ============================================================================
-- SECTION 5: FUNCTIONS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 5.1 Auto-update updated_at timestamp
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 5.2 Generate order number (ORD-YYYYMMDD-XXXXXXXX)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number = 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                           UPPER(SUBSTRING(REPLACE(NEW.id::TEXT, '-', '') FROM 1 FOR 8));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 5.3 Generate invoice number (INV-YYYYMMDD-XXXXXXXX)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL THEN
        NEW.invoice_number = 'INV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                             UPPER(SUBSTRING(REPLACE(NEW.id::TEXT, '-', '') FROM 1 FOR 8));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 5.4 Generate ticket number (TKT-YYYYMMDD-XXXXXXXX)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ticket_number IS NULL THEN
        NEW.ticket_number = 'TKT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                            UPPER(SUBSTRING(REPLACE(NEW.id::TEXT, '-', '') FROM 1 FOR 8));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 5.5 Generate referral code
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || SUBSTR(chars, FLOOR(RANDOM() * LENGTH(chars) + 1)::INTEGER, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 5.6 Handle new user signup - CREATE PROFILE AUTOMATICALLY
-- This is the KEY function that creates a profile when a user signs up
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    ref_code TEXT;
BEGIN
    -- Generate unique referral code
    LOOP
        ref_code := public.generate_referral_code();
        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = ref_code);
    END LOOP;

    -- Insert new profile
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        avatar_url,
        referral_code,
        is_email_verified,
        metadata
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            SPLIT_PART(NEW.email, '@', 1)
        ),
        NEW.raw_user_meta_data->>'avatar_url',
        ref_code,
        COALESCE((NEW.email_confirmed_at IS NOT NULL), FALSE),
        COALESCE(NEW.raw_user_meta_data, '{}'::JSONB)
    );
    
    -- Log the signup
    INSERT INTO public.activity_logs (
        user_id,
        user_email,
        entity_type,
        entity_id,
        action,
        action_category,
        description,
        new_values
    ) VALUES (
        NEW.id,
        NEW.email,
        'profile',
        NEW.id,
        'signup',
        'auth',
        'New user registered',
        jsonb_build_object(
            'email', NEW.email,
            'provider', NEW.raw_app_meta_data->>'provider'
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 5.7 Check if current user is admin
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('ADMIN', 'SUPPORT')
        AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ----------------------------------------------------------------------------
-- 5.8 Check if current user is staff (admin or support)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('ADMIN', 'SUPPORT')
        AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ----------------------------------------------------------------------------
-- 5.9 Get current user's role
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS public.user_role AS $$
BEGIN
    RETURN (
        SELECT role FROM public.profiles
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ----------------------------------------------------------------------------
-- 5.10 Log activity helper function
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.log_activity(
    p_user_id UUID DEFAULT NULL,
    p_entity_type TEXT DEFAULT NULL,
    p_entity_id UUID DEFAULT NULL,
    p_action TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_action_category TEXT DEFAULT NULL,
    p_severity TEXT DEFAULT 'info',
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
    v_user_email TEXT;
    v_user_role public.user_role;
BEGIN
    -- Get user info if user_id provided
    IF p_user_id IS NOT NULL THEN
        SELECT email, role INTO v_user_email, v_user_role
        FROM public.profiles WHERE id = p_user_id;
    END IF;

    INSERT INTO public.activity_logs (
        user_id, user_email, user_role,
        entity_type, entity_id, action, action_category,
        description, old_values, new_values,
        ip_address, severity, metadata
    ) VALUES (
        p_user_id, v_user_email, v_user_role,
        p_entity_type, p_entity_id, p_action, p_action_category,
        p_description, p_old_values, p_new_values,
        p_ip_address, p_severity, p_metadata
    )
    RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 5.11 Update ticket on new message
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_ticket_on_new_message()
RETURNS TRIGGER AS $$
BEGIN
    -- Update ticket timestamps based on message type
    IF NEW.is_staff_reply THEN
        UPDATE public.tickets SET
            last_staff_reply_at = NEW.created_at,
            first_response_at = COALESCE(first_response_at, NEW.created_at),
            status = CASE 
                WHEN status = 'open' THEN 'in_progress'::public.ticket_status
                WHEN status = 'waiting_staff' THEN 'waiting_customer'::public.ticket_status
                ELSE status
            END,
            updated_at = NOW()
        WHERE id = NEW.ticket_id;
    ELSE
        UPDATE public.tickets SET
            last_customer_reply_at = NEW.created_at,
            status = CASE 
                WHEN status = 'waiting_customer' THEN 'waiting_staff'::public.ticket_status
                WHEN status = 'resolved' THEN 'open'::public.ticket_status
                ELSE status
            END,
            updated_at = NOW()
        WHERE id = NEW.ticket_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 5.12 Log server status changes
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.log_server_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Log status changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        NEW.last_status_change = NOW();
        
        PERFORM public.log_activity(
            p_user_id := NEW.user_id,
            p_entity_type := 'server',
            p_entity_id := NEW.id,
            p_action := 'status_changed',
            p_action_category := 'server',
            p_description := 'Server status changed from ' || OLD.status || ' to ' || NEW.status,
            p_old_values := jsonb_build_object('status', OLD.status),
            p_new_values := jsonb_build_object('status', NEW.status)
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- SECTION 6: TRIGGERS
-- ============================================================================

-- Updated_at triggers for all tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pricing_plans_updated_at
    BEFORE UPDATE ON public.pricing_plans
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_servers_updated_at
    BEFORE UPDATE ON public.servers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON public.tickets
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ticket_messages_updated_at
    BEFORE UPDATE ON public.ticket_messages
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_datacenters_updated_at
    BEFORE UPDATE ON public.datacenters
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_os_templates_updated_at
    BEFORE UPDATE ON public.os_templates
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at
    BEFORE UPDATE ON public.payment_methods
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at
    BEFORE UPDATE ON public.app_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-generate numbers
CREATE TRIGGER generate_order_number_trigger
    BEFORE INSERT ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();

CREATE TRIGGER generate_invoice_number_trigger
    BEFORE INSERT ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION public.generate_invoice_number();

CREATE TRIGGER generate_ticket_number_trigger
    BEFORE INSERT ON public.tickets
    FOR EACH ROW EXECUTE FUNCTION public.generate_ticket_number();

-- Server status logging
CREATE TRIGGER log_server_changes
    BEFORE UPDATE ON public.servers
    FOR EACH ROW EXECUTE FUNCTION public.log_server_changes();

-- Ticket message handling
CREATE TRIGGER update_ticket_on_message
    AFTER INSERT ON public.ticket_messages
    FOR EACH ROW EXECUTE FUNCTION public.update_ticket_on_new_message();

-- ============================================================================
-- SECTION 7: AUTH TRIGGER (MOST IMPORTANT!)
-- This creates a profile automatically when a user signs up
-- ============================================================================

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- END OF MIGRATION 001
-- ============================================================================

-- Verification query (run after migration)
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Migration 001 completed successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Tables created: profiles, pricing_plans, servers, orders, invoices, tickets, ticket_messages, activity_logs, datacenters, os_templates, payment_methods, app_settings';
    RAISE NOTICE 'Auth trigger created: on_auth_user_created';
    RAISE NOTICE '========================================';
END $$;

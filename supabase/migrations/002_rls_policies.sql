-- ============================================================================
-- LAYERIUM CLOUD - ROW LEVEL SECURITY POLICIES
-- ============================================================================
-- Migration: 002_rls_policies.sql
-- Version: 1.0.0
-- Description: Comprehensive RLS policies for secure data access
-- Author: Layerium Cloud Engineering Team
-- Created: 2024-12-29
--
-- Security Model:
-- - Users can only access their own data
-- - Admins/Support can access all data
-- - Public data (plans, datacenters, OS templates) readable by anyone
-- - Activity logs are append-only
-- ============================================================================

-- ============================================================================
-- SECTION 1: ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.datacenters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.os_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SECTION 2: PROFILES POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "profiles_select_own"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Users can update their own profile (with restrictions)
CREATE POLICY "profiles_update_own"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        -- Cannot change own role
        AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    );

-- Staff can view all profiles
CREATE POLICY "profiles_select_staff"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (public.is_staff());

-- Admins can update any profile
CREATE POLICY "profiles_update_admin"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ============================================================================
-- SECTION 3: PRICING PLANS POLICIES (PUBLIC READ)
-- ============================================================================

-- Anyone can view active and visible pricing plans
CREATE POLICY "pricing_plans_select_public"
    ON public.pricing_plans FOR SELECT
    TO anon, authenticated
    USING (is_active = TRUE AND is_visible = TRUE);

-- Staff can view all pricing plans
CREATE POLICY "pricing_plans_select_staff"
    ON public.pricing_plans FOR SELECT
    TO authenticated
    USING (public.is_staff());

-- Admins can manage pricing plans
CREATE POLICY "pricing_plans_insert_admin"
    ON public.pricing_plans FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "pricing_plans_update_admin"
    ON public.pricing_plans FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "pricing_plans_delete_admin"
    ON public.pricing_plans FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ============================================================================
-- SECTION 4: DATACENTERS POLICIES (PUBLIC READ)
-- ============================================================================

-- Anyone can view active datacenters
CREATE POLICY "datacenters_select_public"
    ON public.datacenters FOR SELECT
    TO anon, authenticated
    USING (is_active = TRUE);

-- Staff can view all datacenters
CREATE POLICY "datacenters_select_staff"
    ON public.datacenters FOR SELECT
    TO authenticated
    USING (public.is_staff());

-- Admins can manage datacenters
CREATE POLICY "datacenters_all_admin"
    ON public.datacenters FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ============================================================================
-- SECTION 5: OS TEMPLATES POLICIES (PUBLIC READ)
-- ============================================================================

-- Anyone can view active OS templates
CREATE POLICY "os_templates_select_public"
    ON public.os_templates FOR SELECT
    TO anon, authenticated
    USING (is_active = TRUE);

-- Staff can view all OS templates
CREATE POLICY "os_templates_select_staff"
    ON public.os_templates FOR SELECT
    TO authenticated
    USING (public.is_staff());

-- Admins can manage OS templates
CREATE POLICY "os_templates_all_admin"
    ON public.os_templates FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ============================================================================
-- SECTION 6: SERVERS POLICIES
-- ============================================================================

-- Users can view their own active servers
CREATE POLICY "servers_select_own"
    ON public.servers FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Users can update their own servers (limited fields via application)
CREATE POLICY "servers_update_own"
    ON public.servers FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id AND deleted_at IS NULL)
    WITH CHECK (auth.uid() = user_id);

-- Staff can view all servers
CREATE POLICY "servers_select_staff"
    ON public.servers FOR SELECT
    TO authenticated
    USING (public.is_staff());

-- Admins can manage all servers
CREATE POLICY "servers_insert_admin"
    ON public.servers FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "servers_update_admin"
    ON public.servers FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "servers_delete_admin"
    ON public.servers FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ============================================================================
-- SECTION 7: ORDERS POLICIES
-- ============================================================================

-- Users can view their own orders
CREATE POLICY "orders_select_own"
    ON public.orders FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "orders_insert_own"
    ON public.orders FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Staff can view all orders
CREATE POLICY "orders_select_staff"
    ON public.orders FOR SELECT
    TO authenticated
    USING (public.is_staff());

-- Admins can manage all orders
CREATE POLICY "orders_update_admin"
    ON public.orders FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "orders_insert_admin"
    ON public.orders FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- ============================================================================
-- SECTION 8: INVOICES POLICIES
-- ============================================================================

-- Users can view their own invoices
CREATE POLICY "invoices_select_own"
    ON public.invoices FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Staff can view all invoices
CREATE POLICY "invoices_select_staff"
    ON public.invoices FOR SELECT
    TO authenticated
    USING (public.is_staff());

-- Admins can manage invoices
CREATE POLICY "invoices_insert_admin"
    ON public.invoices FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "invoices_update_admin"
    ON public.invoices FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ============================================================================
-- SECTION 9: PAYMENT METHODS POLICIES
-- ============================================================================

-- Users can view their own payment methods
CREATE POLICY "payment_methods_select_own"
    ON public.payment_methods FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Users can manage their own payment methods
CREATE POLICY "payment_methods_insert_own"
    ON public.payment_methods FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "payment_methods_update_own"
    ON public.payment_methods FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "payment_methods_delete_own"
    ON public.payment_methods FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Staff can view all payment methods
CREATE POLICY "payment_methods_select_staff"
    ON public.payment_methods FOR SELECT
    TO authenticated
    USING (public.is_staff());

-- ============================================================================
-- SECTION 10: TICKETS POLICIES
-- ============================================================================

-- Users can view their own tickets
CREATE POLICY "tickets_select_own"
    ON public.tickets FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Users can create their own tickets
CREATE POLICY "tickets_insert_own"
    ON public.tickets FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own tickets (limited - mainly for closing)
CREATE POLICY "tickets_update_own"
    ON public.tickets FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Staff can view all tickets
CREATE POLICY "tickets_select_staff"
    ON public.tickets FOR SELECT
    TO authenticated
    USING (public.is_staff());

-- Staff can update all tickets
CREATE POLICY "tickets_update_staff"
    ON public.tickets FOR UPDATE
    TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

-- ============================================================================
-- SECTION 11: TICKET MESSAGES POLICIES
-- ============================================================================

-- Users can view messages on their own tickets (excluding internal notes)
CREATE POLICY "ticket_messages_select_own"
    ON public.ticket_messages FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.tickets
            WHERE tickets.id = ticket_messages.ticket_id
            AND tickets.user_id = auth.uid()
        )
        AND is_internal_note = FALSE
    );

-- Users can create messages on their own tickets
CREATE POLICY "ticket_messages_insert_own"
    ON public.ticket_messages FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.tickets
            WHERE tickets.id = ticket_id
            AND tickets.user_id = auth.uid()
        )
        AND is_internal_note = FALSE
        AND is_staff_reply = FALSE
    );

-- Staff can view all ticket messages (including internal notes)
CREATE POLICY "ticket_messages_select_staff"
    ON public.ticket_messages FOR SELECT
    TO authenticated
    USING (public.is_staff());

-- Staff can create ticket messages (including internal notes)
CREATE POLICY "ticket_messages_insert_staff"
    ON public.ticket_messages FOR INSERT
    TO authenticated
    WITH CHECK (public.is_staff());

-- Staff can update ticket messages
CREATE POLICY "ticket_messages_update_staff"
    ON public.ticket_messages FOR UPDATE
    TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

-- ============================================================================
-- SECTION 12: ACTIVITY LOGS POLICIES
-- ============================================================================

-- Users can view their own activity logs
CREATE POLICY "activity_logs_select_own"
    ON public.activity_logs FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Staff can view all activity logs
CREATE POLICY "activity_logs_select_staff"
    ON public.activity_logs FOR SELECT
    TO authenticated
    USING (public.is_staff());

-- System can insert activity logs (via SECURITY DEFINER function)
CREATE POLICY "activity_logs_insert_system"
    ON public.activity_logs FOR INSERT
    TO authenticated
    WITH CHECK (TRUE);

-- ============================================================================
-- SECTION 13: APP SETTINGS POLICIES
-- ============================================================================

-- Anyone can view public settings
CREATE POLICY "app_settings_select_public"
    ON public.app_settings FOR SELECT
    TO anon, authenticated
    USING (is_public = TRUE);

-- Staff can view all settings
CREATE POLICY "app_settings_select_staff"
    ON public.app_settings FOR SELECT
    TO authenticated
    USING (public.is_staff());

-- Admins can manage settings
CREATE POLICY "app_settings_all_admin"
    ON public.app_settings FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ============================================================================
-- END OF MIGRATION 002
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Migration 002 completed successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'RLS enabled on all tables';
    RAISE NOTICE 'Policies created for all access patterns';
    RAISE NOTICE '========================================';
END $$;

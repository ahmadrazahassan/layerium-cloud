# Layerium Cloud - Supabase Database Setup

This guide walks you through setting up the complete database schema for Layerium Cloud in your Supabase project.

## Prerequisites

- Supabase project created (you already have this: `kloulvvrigcsrkdmhemj`)
- Access to Supabase Dashboard

## Database Overview

The schema includes:
- **12 Tables**: profiles, datacenters, os_templates, pricing_plans, payment_methods, servers, orders, invoices, tickets, ticket_messages, activity_logs, app_settings
- **11 Custom Enums**: user_role, server_status, order_status, invoice_status, ticket_status, ticket_priority, ticket_category, plan_type, currency_type, billing_period, payment_method_type
- **12 Functions**: Auto-profile creation, number generators, activity logging, role checks
- **15 Triggers**: Auto-timestamps, auto-numbering, status logging, ticket updates
- **Row Level Security**: Complete RLS policies for all tables

## Step-by-Step Setup Instructions

### Step 1: Open Supabase SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **kloulvvrigcsrkdmhemj**
3. Click **SQL Editor** in the left sidebar
4. Click **+ New query** button

### Step 2: Run Migration 001 (Schema)

1. Open the file: `supabase/migrations/001_initial_schema.sql`
2. Copy the ENTIRE contents of the file
3. Paste into the SQL Editor
4. Click **Run** (or press Ctrl+Enter / Cmd+Enter)
5. Wait for completion - you should see:
   ```
   Migration 001 completed successfully!
   Tables created: profiles, pricing_plans, servers, orders, invoices, tickets, ticket_messages, activity_logs, datacenters, os_templates, payment_methods, app_settings
   Auth trigger created: on_auth_user_created
   ```

### Step 3: Run Migration 002 (RLS Policies)

1. Click **+ New query** to create a new query tab
2. Open the file: `supabase/migrations/002_rls_policies.sql`
3. Copy the ENTIRE contents of the file
4. Paste into the SQL Editor
5. Click **Run**
6. Wait for completion - you should see:
   ```
   Migration 002 completed successfully!
   RLS enabled on all tables
   Policies created for all access patterns
   ```

### Step 4: Run Seed Data

1. Click **+ New query** to create a new query tab
2. Open the file: `supabase/seed.sql`
3. Copy the ENTIRE contents of the file
4. Paste into the SQL Editor
5. Click **Run**
6. Wait for completion - you should see:
   ```
   SEED DATA LOADED SUCCESSFULLY!
   Datacenters: 11
   OS Templates: 15
   VPS Plans: 6
   RDP Plans: 5
   App Settings: 16
   ```

### Step 5: Verify Setup

Run this verification query to confirm everything is set up:

```sql
-- Verification Query
SELECT 
    'profiles' as table_name, COUNT(*) as count FROM public.profiles
UNION ALL SELECT 'datacenters', COUNT(*) FROM public.datacenters
UNION ALL SELECT 'os_templates', COUNT(*) FROM public.os_templates
UNION ALL SELECT 'pricing_plans', COUNT(*) FROM public.pricing_plans
UNION ALL SELECT 'app_settings', COUNT(*) FROM public.app_settings;
```

Expected output:
| table_name | count |
|------------|-------|
| profiles | 0 |
| datacenters | 11 |
| os_templates | 15 |
| pricing_plans | 11 |
| app_settings | 16 |

## Testing the Auth Trigger

The most important feature is the automatic profile creation on signup. To test:

1. Go to **Authentication** > **Users** in Supabase Dashboard
2. Click **Add user** > **Create new user**
3. Enter an email and password
4. Click **Create user**
5. Go to **Table Editor** > **profiles**
6. You should see a new profile automatically created!

Or test via your app:
1. Go to your signup page
2. Create a new account
3. Check the `profiles` table - a profile should be auto-created

## What Happens on User Signup

When a user signs up (via email/password or OAuth):

1. Supabase creates a record in `auth.users`
2. The `on_auth_user_created` trigger fires
3. The `handle_new_user()` function runs:
   - Creates a profile in `public.profiles`
   - Generates a unique referral code
   - Extracts name from metadata or email
   - Logs the signup in `activity_logs`

## Troubleshooting

### Error: "relation already exists"
This is fine - the migration uses `DROP IF EXISTS` to handle re-runs.

### Error: "permission denied for schema auth"
Make sure you're running the SQL as the `postgres` user (default in SQL Editor).

### Error: "function auth.uid() does not exist"
This shouldn't happen in Supabase. If it does, ensure you're in the correct project.

### Profile not created on signup
1. Check if the trigger exists:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```
2. Check if the function exists:
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
   ```

## Schema Details

### Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profiles (extends auth.users) |
| `datacenters` | Server locations (11 global locations) |
| `os_templates` | Operating systems (15 Linux/Windows options) |
| `pricing_plans` | VPS and RDP plans with multi-currency pricing |
| `payment_methods` | Saved payment methods |
| `servers` | Provisioned VPS/RDP servers |
| `orders` | Purchase orders |
| `invoices` | Generated invoices |
| `tickets` | Support tickets |
| `ticket_messages` | Messages within tickets |
| `activity_logs` | Audit trail |
| `app_settings` | Application configuration |

### Key Features

- **Multi-currency pricing**: USD, PKR, EUR, GBP
- **Auto-generated numbers**: ORD-YYYYMMDD-XXXXXXXX, INV-..., TKT-...
- **Referral system**: Unique codes for each user
- **Activity logging**: Complete audit trail
- **Soft deletes**: Servers use `deleted_at` for soft deletion
- **SLA tracking**: Tickets track response times

## Environment Variables

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://kloulvvrigcsrkdmhemj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_anon_key
```

## Next Steps

After running the migrations:

1. ✅ Test user signup to verify profile creation
2. ✅ Check that pricing plans appear on your website
3. ✅ Verify datacenters load in location selectors
4. ✅ Test RLS by trying to access other users' data (should fail)

## Support

If you encounter issues, check:
1. Supabase Dashboard > Logs > Postgres logs
2. Browser console for API errors
3. Network tab for failed requests

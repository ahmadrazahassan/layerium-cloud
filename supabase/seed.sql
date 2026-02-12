-- ============================================================================
-- LAYERIUM CLOUD - SEED DATA
-- ============================================================================
-- File: seed.sql
-- Version: 1.0.0
-- Description: Production-ready seed data for Layerium Cloud
-- Author: Layerium Cloud Engineering Team
-- Created: 2024-12-29
--
-- This file contains:
-- - Datacenter locations
-- - OS templates
-- - VPS pricing plans
-- - RDP pricing plans
-- - App settings
-- ============================================================================

-- ============================================================================
-- SECTION 1: DATACENTERS
-- ============================================================================

INSERT INTO public.datacenters (
    code, name, short_name, city, country, country_code, region,
    flag_emoji, avg_latency_ms, network_speed_gbps, features, sort_order, is_active, is_available
) VALUES
    -- North America
    ('us-east-1', 'US East (New York)', 'US East', 'New York', 'United States', 'US', 'north-america',
     '🇺🇸', 15, 10, ARRAY['nvme', 'ddos-protection', 'ipv6', 'backup'], 1, TRUE, TRUE),
    ('us-west-1', 'US West (Los Angeles)', 'US West', 'Los Angeles', 'United States', 'US', 'north-america',
     '🇺🇸', 20, 10, ARRAY['nvme', 'ddos-protection', 'ipv6', 'backup'], 2, TRUE, TRUE),
    ('us-central-1', 'US Central (Dallas)', 'US Central', 'Dallas', 'United States', 'US', 'north-america',
     '🇺🇸', 18, 10, ARRAY['nvme', 'ddos-protection', 'ipv6'], 3, TRUE, TRUE),
    
    -- Europe
    ('eu-west-1', 'EU West (Amsterdam)', 'EU West', 'Amsterdam', 'Netherlands', 'NL', 'europe',
     '🇳🇱', 25, 10, ARRAY['nvme', 'ddos-protection', 'ipv6', 'backup'], 10, TRUE, TRUE),
    ('eu-central-1', 'EU Central (Frankfurt)', 'EU Central', 'Frankfurt', 'Germany', 'DE', 'europe',
     '🇩🇪', 22, 10, ARRAY['nvme', 'ddos-protection', 'ipv6', 'backup'], 11, TRUE, TRUE),
    ('eu-north-1', 'EU North (London)', 'EU North', 'London', 'United Kingdom', 'GB', 'europe',
     '🇬🇧', 28, 10, ARRAY['nvme', 'ddos-protection', 'ipv6'], 12, TRUE, TRUE),
    
    -- Asia Pacific
    ('ap-southeast-1', 'Asia Pacific (Singapore)', 'Singapore', 'Singapore', 'Singapore', 'SG', 'asia-pacific',
     '🇸🇬', 45, 10, ARRAY['nvme', 'ddos-protection', 'ipv6', 'backup'], 20, TRUE, TRUE),
    ('ap-south-1', 'Asia Pacific (Mumbai)', 'Mumbai', 'Mumbai', 'India', 'IN', 'asia-pacific',
     '🇮🇳', 50, 5, ARRAY['nvme', 'ddos-protection', 'ipv6'], 21, TRUE, TRUE),
    ('ap-east-1', 'Asia Pacific (Tokyo)', 'Tokyo', 'Tokyo', 'Japan', 'JP', 'asia-pacific',
     '🇯🇵', 55, 10, ARRAY['nvme', 'ddos-protection', 'ipv6'], 22, TRUE, TRUE),
    
    -- Middle East
    ('me-south-1', 'Middle East (Dubai)', 'Dubai', 'Dubai', 'United Arab Emirates', 'AE', 'middle-east',
     '🇦🇪', 60, 5, ARRAY['nvme', 'ddos-protection', 'ipv6'], 30, TRUE, TRUE),
    
    -- South Asia
    ('pk-south-1', 'Pakistan (Karachi)', 'Pakistan', 'Karachi', 'Pakistan', 'PK', 'south-asia',
     '🇵🇰', 35, 5, ARRAY['nvme', 'ddos-protection', 'ipv6'], 40, TRUE, TRUE)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    short_name = EXCLUDED.short_name,
    city = EXCLUDED.city,
    avg_latency_ms = EXCLUDED.avg_latency_ms,
    network_speed_gbps = EXCLUDED.network_speed_gbps,
    features = EXCLUDED.features,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    is_available = EXCLUDED.is_available,
    updated_at = NOW();

-- ============================================================================
-- SECTION 2: OS TEMPLATES
-- ============================================================================

INSERT INTO public.os_templates (
    code, name, version, full_name, family, distribution,
    plan_types, min_ram_gb, min_storage_gb, sort_order, is_active, is_default
) VALUES
    -- Ubuntu (Most Popular)
    ('ubuntu-24.04', 'Ubuntu', '24.04 LTS', 'Ubuntu 24.04 LTS (Noble Numbat)', 'linux', 'debian',
     '{VPS}', 1, 20, 1, TRUE, TRUE),
    ('ubuntu-22.04', 'Ubuntu', '22.04 LTS', 'Ubuntu 22.04 LTS (Jammy Jellyfish)', 'linux', 'debian',
     '{VPS}', 1, 20, 2, TRUE, FALSE),
    ('ubuntu-20.04', 'Ubuntu', '20.04 LTS', 'Ubuntu 20.04 LTS (Focal Fossa)', 'linux', 'debian',
     '{VPS}', 1, 20, 3, TRUE, FALSE),
    
    -- Debian
    ('debian-12', 'Debian', '12', 'Debian 12 (Bookworm)', 'linux', 'debian',
     '{VPS}', 1, 20, 10, TRUE, FALSE),
    ('debian-11', 'Debian', '11', 'Debian 11 (Bullseye)', 'linux', 'debian',
     '{VPS}', 1, 20, 11, TRUE, FALSE),
    
    -- CentOS / RHEL Family
    ('centos-stream-9', 'CentOS Stream', '9', 'CentOS Stream 9', 'linux', 'rhel',
     '{VPS}', 1, 20, 20, TRUE, FALSE),
    ('rocky-9', 'Rocky Linux', '9', 'Rocky Linux 9', 'linux', 'rhel',
     '{VPS}', 1, 20, 21, TRUE, FALSE),
    ('almalinux-9', 'AlmaLinux', '9', 'AlmaLinux 9', 'linux', 'rhel',
     '{VPS}', 1, 20, 22, TRUE, FALSE),
    
    -- Other Linux
    ('fedora-40', 'Fedora', '40', 'Fedora 40', 'linux', 'rhel',
     '{VPS}', 2, 25, 30, TRUE, FALSE),
    ('arch-latest', 'Arch Linux', 'Latest', 'Arch Linux (Rolling)', 'linux', 'arch',
     '{VPS}', 1, 20, 31, TRUE, FALSE),
    ('opensuse-15', 'openSUSE', '15', 'openSUSE Leap 15', 'linux', 'suse',
     '{VPS}', 2, 25, 32, TRUE, FALSE),
    
    -- Windows Server (RDP)
    ('windows-2022', 'Windows Server', '2022', 'Windows Server 2022 Standard', 'windows', 'windows',
     '{RDP}', 4, 50, 50, TRUE, TRUE),
    ('windows-2019', 'Windows Server', '2019', 'Windows Server 2019 Standard', 'windows', 'windows',
     '{RDP}', 4, 50, 51, TRUE, FALSE),
    
    -- Windows Desktop (RDP)
    ('windows-11-pro', 'Windows 11', 'Pro', 'Windows 11 Pro', 'windows', 'windows',
     '{RDP}', 4, 60, 60, TRUE, FALSE),
    ('windows-10-pro', 'Windows 10', 'Pro', 'Windows 10 Pro', 'windows', 'windows',
     '{RDP}', 4, 50, 61, TRUE, FALSE)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    version = EXCLUDED.version,
    full_name = EXCLUDED.full_name,
    family = EXCLUDED.family,
    distribution = EXCLUDED.distribution,
    plan_types = EXCLUDED.plan_types,
    min_ram_gb = EXCLUDED.min_ram_gb,
    min_storage_gb = EXCLUDED.min_storage_gb,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active,
    is_default = EXCLUDED.is_default,
    updated_at = NOW();


-- ============================================================================
-- SECTION 3: VPS PRICING PLANS
-- ============================================================================

INSERT INTO public.pricing_plans (
    name, slug, description, short_description, type,
    cpu_cores, ram_gb, storage_gb, storage_type, bandwidth_tb,
    ipv4_included, ipv6_included, dedicated_ip,
    price_usd_cents, price_pkr_paisa, price_eur_cents, price_gbp_pence,
    setup_fee_usd_cents, setup_fee_pkr_paisa,
    billing_period, quarterly_discount, semi_annual_discount, yearly_discount,
    locations, os_templates, features,
    is_popular, is_featured, badge_text, sort_order, is_active, is_visible
) VALUES
    -- VPS Starter
    (
        'VPS Starter',
        'vps-starter',
        'Perfect for small projects, development environments, and learning. Ideal for personal websites, small blogs, and testing.',
        'Entry-level VPS for small projects',
        'VPS',
        1, 1, 25, 'nvme', 1,
        1, TRUE, FALSE,
        500, 140000, 450, 400,  -- $5/mo, ₨1,400/mo
        0, 0,
        'monthly', 0, 5, 10,
        ARRAY['us-east-1', 'us-west-1', 'eu-west-1', 'eu-central-1', 'ap-southeast-1', 'pk-south-1'],
        ARRAY['ubuntu-24.04', 'ubuntu-22.04', 'debian-12', 'centos-stream-9', 'rocky-9'],
        ARRAY['1 vCPU Core', '1 GB RAM', '25 GB NVMe SSD', '1 TB Bandwidth', 'IPv4 + IPv6', 'Root Access', 'Full SSH Access'],
        FALSE, FALSE, NULL, 1, TRUE, TRUE
    ),
    
    -- VPS Basic
    (
        'VPS Basic',
        'vps-basic',
        'Great for personal websites, small applications, and WordPress sites. Suitable for low to medium traffic websites.',
        'Balanced VPS for personal use',
        'VPS',
        1, 2, 50, 'nvme', 2,
        1, TRUE, FALSE,
        1000, 280000, 900, 800,  -- $10/mo, ₨2,800/mo
        0, 0,
        'monthly', 0, 5, 10,
        ARRAY['us-east-1', 'us-west-1', 'us-central-1', 'eu-west-1', 'eu-central-1', 'ap-southeast-1', 'pk-south-1'],
        ARRAY['ubuntu-24.04', 'ubuntu-22.04', 'ubuntu-20.04', 'debian-12', 'debian-11', 'centos-stream-9', 'rocky-9', 'almalinux-9'],
        ARRAY['1 vCPU Core', '2 GB RAM', '50 GB NVMe SSD', '2 TB Bandwidth', 'IPv4 + IPv6', 'Root Access', 'Weekly Backups', 'DDoS Protection'],
        FALSE, FALSE, NULL, 2, TRUE, TRUE
    ),
    
    -- VPS Standard (POPULAR)
    (
        'VPS Standard',
        'vps-standard',
        'Ideal for growing businesses, e-commerce sites, and medium-traffic applications. Perfect balance of performance and price.',
        'Best value for growing businesses',
        'VPS',
        2, 4, 80, 'nvme', 3,
        1, TRUE, FALSE,
        2000, 560000, 1800, 1600,  -- $20/mo, ₨5,600/mo
        0, 0,
        'monthly', 5, 10, 15,
        ARRAY['us-east-1', 'us-west-1', 'us-central-1', 'eu-west-1', 'eu-central-1', 'eu-north-1', 'ap-southeast-1', 'me-south-1', 'pk-south-1'],
        ARRAY['ubuntu-24.04', 'ubuntu-22.04', 'ubuntu-20.04', 'debian-12', 'debian-11', 'centos-stream-9', 'rocky-9', 'almalinux-9', 'fedora-40'],
        ARRAY['2 vCPU Cores', '4 GB RAM', '80 GB NVMe SSD', '3 TB Bandwidth', 'IPv4 + IPv6', 'Root Access', 'Daily Backups', 'DDoS Protection', 'Free SSL'],
        TRUE, TRUE, 'Most Popular', 3, TRUE, TRUE
    ),
    
    -- VPS Pro
    (
        'VPS Pro',
        'vps-pro',
        'High performance for demanding workloads, databases, and high-traffic websites. Excellent for production applications.',
        'High performance for demanding apps',
        'VPS',
        4, 8, 160, 'nvme', 4,
        1, TRUE, FALSE,
        4000, 1120000, 3600, 3200,  -- $40/mo, ₨11,200/mo
        0, 0,
        'monthly', 5, 10, 15,
        ARRAY['us-east-1', 'us-west-1', 'us-central-1', 'eu-west-1', 'eu-central-1', 'eu-north-1', 'ap-southeast-1', 'ap-east-1', 'me-south-1', 'pk-south-1'],
        ARRAY['ubuntu-24.04', 'ubuntu-22.04', 'ubuntu-20.04', 'debian-12', 'debian-11', 'centos-stream-9', 'rocky-9', 'almalinux-9', 'fedora-40', 'arch-latest'],
        ARRAY['4 vCPU Cores', '8 GB RAM', '160 GB NVMe SSD', '4 TB Bandwidth', 'IPv4 + IPv6', 'Root Access', 'Daily Backups', 'Advanced DDoS Protection', 'Priority Support', 'Free SSL'],
        FALSE, FALSE, 'Best Value', 4, TRUE, TRUE
    ),
    
    -- VPS Business
    (
        'VPS Business',
        'vps-business',
        'Enterprise-grade performance for mission-critical applications. Ideal for large databases, high-traffic sites, and business applications.',
        'Enterprise performance for business',
        'VPS',
        6, 16, 320, 'nvme', 5,
        1, TRUE, TRUE,
        8000, 2240000, 7200, 6400,  -- $80/mo, ₨22,400/mo
        0, 0,
        'monthly', 5, 10, 20,
        ARRAY['us-east-1', 'us-west-1', 'us-central-1', 'eu-west-1', 'eu-central-1', 'eu-north-1', 'ap-southeast-1', 'ap-east-1', 'me-south-1', 'pk-south-1'],
        ARRAY['ubuntu-24.04', 'ubuntu-22.04', 'ubuntu-20.04', 'debian-12', 'debian-11', 'centos-stream-9', 'rocky-9', 'almalinux-9', 'fedora-40', 'arch-latest', 'opensuse-15'],
        ARRAY['6 vCPU Cores', '16 GB RAM', '320 GB NVMe SSD', '5 TB Bandwidth', 'Dedicated IPv4', 'IPv6 Included', 'Root Access', 'Hourly Backups', 'Advanced DDoS Protection', '24/7 Priority Support', 'Free SSL', 'Monitoring'],
        FALSE, FALSE, NULL, 5, TRUE, TRUE
    ),
    
    -- VPS Enterprise
    (
        'VPS Enterprise',
        'vps-enterprise',
        'Maximum power for enterprise applications, large-scale deployments, and resource-intensive workloads. Our most powerful VPS offering.',
        'Maximum power for enterprise',
        'VPS',
        8, 32, 640, 'nvme', 10,
        2, TRUE, TRUE,
        16000, 4480000, 14400, 12800,  -- $160/mo, ₨44,800/mo
        0, 0,
        'monthly', 10, 15, 25,
        ARRAY['us-east-1', 'us-west-1', 'us-central-1', 'eu-west-1', 'eu-central-1', 'eu-north-1', 'ap-southeast-1', 'ap-east-1', 'me-south-1', 'pk-south-1'],
        ARRAY['ubuntu-24.04', 'ubuntu-22.04', 'ubuntu-20.04', 'debian-12', 'debian-11', 'centos-stream-9', 'rocky-9', 'almalinux-9', 'fedora-40', 'arch-latest', 'opensuse-15'],
        ARRAY['8 vCPU Cores', '32 GB RAM', '640 GB NVMe SSD', '10 TB Bandwidth', '2x Dedicated IPv4', 'IPv6 Included', 'Root Access', 'Hourly Backups', 'Enterprise DDoS Protection', '24/7 Priority Support', 'Free SSL', 'Advanced Monitoring', 'SLA Guarantee'],
        FALSE, TRUE, 'Enterprise', 6, TRUE, TRUE
    )
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    short_description = EXCLUDED.short_description,
    cpu_cores = EXCLUDED.cpu_cores,
    ram_gb = EXCLUDED.ram_gb,
    storage_gb = EXCLUDED.storage_gb,
    bandwidth_tb = EXCLUDED.bandwidth_tb,
    price_usd_cents = EXCLUDED.price_usd_cents,
    price_pkr_paisa = EXCLUDED.price_pkr_paisa,
    price_eur_cents = EXCLUDED.price_eur_cents,
    price_gbp_pence = EXCLUDED.price_gbp_pence,
    locations = EXCLUDED.locations,
    os_templates = EXCLUDED.os_templates,
    features = EXCLUDED.features,
    is_popular = EXCLUDED.is_popular,
    is_featured = EXCLUDED.is_featured,
    badge_text = EXCLUDED.badge_text,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();


-- ============================================================================
-- SECTION 4: RDP PRICING PLANS
-- ============================================================================

INSERT INTO public.pricing_plans (
    name, slug, description, short_description, type,
    cpu_cores, ram_gb, storage_gb, storage_type, bandwidth_tb,
    ipv4_included, ipv6_included, dedicated_ip,
    price_usd_cents, price_pkr_paisa, price_eur_cents, price_gbp_pence,
    setup_fee_usd_cents, setup_fee_pkr_paisa,
    billing_period, quarterly_discount, semi_annual_discount, yearly_discount,
    locations, os_templates, features,
    is_popular, is_featured, badge_text, sort_order, is_active, is_visible
) VALUES
    -- RDP Basic
    (
        'RDP Basic',
        'rdp-basic',
        'Entry-level Windows remote desktop for basic tasks. Perfect for remote work, browsing, and light office applications.',
        'Entry-level Windows RDP',
        'RDP',
        2, 4, 60, 'nvme', 2,
        1, TRUE, FALSE,
        1500, 420000, 1350, 1200,  -- $15/mo, ₨4,200/mo
        0, 0,
        'monthly', 0, 5, 10,
        ARRAY['us-east-1', 'us-west-1', 'eu-west-1', 'eu-central-1'],
        ARRAY['windows-2022', 'windows-2019', 'windows-10-pro'],
        ARRAY['2 vCPU Cores', '4 GB RAM', '60 GB NVMe SSD', '2 TB Bandwidth', 'Windows Server 2022', 'Full Admin Access', 'RDP Access', 'Dedicated IP'],
        FALSE, FALSE, NULL, 10, TRUE, TRUE
    ),
    
    -- RDP Standard (POPULAR)
    (
        'RDP Standard',
        'rdp-standard',
        'Balanced Windows remote desktop for everyday tasks. Ideal for office work, development, and moderate multitasking.',
        'Balanced Windows RDP for work',
        'RDP',
        4, 8, 120, 'nvme', 3,
        1, TRUE, FALSE,
        3000, 840000, 2700, 2400,  -- $30/mo, ₨8,400/mo
        0, 0,
        'monthly', 5, 10, 15,
        ARRAY['us-east-1', 'us-west-1', 'us-central-1', 'eu-west-1', 'eu-central-1', 'ap-southeast-1'],
        ARRAY['windows-2022', 'windows-2019', 'windows-11-pro', 'windows-10-pro'],
        ARRAY['4 vCPU Cores', '8 GB RAM', '120 GB NVMe SSD', '3 TB Bandwidth', 'Windows Server 2022', 'Full Admin Access', 'RDP Access', 'Dedicated IP', 'Daily Backups', 'DDoS Protection'],
        TRUE, TRUE, 'Most Popular', 11, TRUE, TRUE
    ),
    
    -- RDP Pro
    (
        'RDP Pro',
        'rdp-pro',
        'High-performance Windows workstation for demanding applications. Perfect for development, design, and resource-intensive tasks.',
        'High-performance Windows workstation',
        'RDP',
        6, 16, 200, 'nvme', 4,
        1, TRUE, TRUE,
        5000, 1400000, 4500, 4000,  -- $50/mo, ₨14,000/mo
        0, 0,
        'monthly', 5, 10, 15,
        ARRAY['us-east-1', 'us-west-1', 'us-central-1', 'eu-west-1', 'eu-central-1', 'eu-north-1', 'ap-southeast-1', 'me-south-1'],
        ARRAY['windows-2022', 'windows-2019', 'windows-11-pro', 'windows-10-pro'],
        ARRAY['6 vCPU Cores', '16 GB RAM', '200 GB NVMe SSD', '4 TB Bandwidth', 'Windows Server 2022', 'Full Admin Access', 'RDP Access', 'Dedicated IP', 'Daily Backups', 'DDoS Protection', 'Priority Support'],
        FALSE, FALSE, 'Best Value', 12, TRUE, TRUE
    ),
    
    -- RDP Business
    (
        'RDP Business',
        'rdp-business',
        'Enterprise Windows workstation for business applications. Ideal for heavy multitasking, databases, and business software.',
        'Enterprise Windows for business',
        'RDP',
        8, 32, 400, 'nvme', 5,
        1, TRUE, TRUE,
        10000, 2800000, 9000, 8000,  -- $100/mo, ₨28,000/mo
        0, 0,
        'monthly', 5, 10, 20,
        ARRAY['us-east-1', 'us-west-1', 'us-central-1', 'eu-west-1', 'eu-central-1', 'eu-north-1', 'ap-southeast-1', 'ap-east-1', 'me-south-1'],
        ARRAY['windows-2022', 'windows-2019', 'windows-11-pro', 'windows-10-pro'],
        ARRAY['8 vCPU Cores', '32 GB RAM', '400 GB NVMe SSD', '5 TB Bandwidth', 'Windows Server 2022', 'Full Admin Access', 'RDP Access', 'Dedicated IP', 'Hourly Backups', 'Advanced DDoS Protection', '24/7 Priority Support', 'SLA Guarantee'],
        FALSE, FALSE, NULL, 13, TRUE, TRUE
    ),
    
    -- RDP Enterprise
    (
        'RDP Enterprise',
        'rdp-enterprise',
        'Maximum power Windows workstation for enterprise needs. Our most powerful RDP offering for the most demanding workloads.',
        'Maximum power for enterprise',
        'RDP',
        12, 64, 800, 'nvme', 10,
        2, TRUE, TRUE,
        20000, 5600000, 18000, 16000,  -- $200/mo, ₨56,000/mo
        0, 0,
        'monthly', 10, 15, 25,
        ARRAY['us-east-1', 'us-west-1', 'eu-west-1', 'eu-central-1', 'ap-southeast-1'],
        ARRAY['windows-2022', 'windows-2019', 'windows-11-pro'],
        ARRAY['12 vCPU Cores', '64 GB RAM', '800 GB NVMe SSD', '10 TB Bandwidth', 'Windows Server 2022', 'Full Admin Access', 'RDP Access', '2x Dedicated IP', 'Hourly Backups', 'Enterprise DDoS Protection', '24/7 Priority Support', 'SLA Guarantee', 'Dedicated Account Manager'],
        FALSE, TRUE, 'Enterprise', 14, TRUE, TRUE
    )
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    short_description = EXCLUDED.short_description,
    cpu_cores = EXCLUDED.cpu_cores,
    ram_gb = EXCLUDED.ram_gb,
    storage_gb = EXCLUDED.storage_gb,
    bandwidth_tb = EXCLUDED.bandwidth_tb,
    price_usd_cents = EXCLUDED.price_usd_cents,
    price_pkr_paisa = EXCLUDED.price_pkr_paisa,
    price_eur_cents = EXCLUDED.price_eur_cents,
    price_gbp_pence = EXCLUDED.price_gbp_pence,
    locations = EXCLUDED.locations,
    os_templates = EXCLUDED.os_templates,
    features = EXCLUDED.features,
    is_popular = EXCLUDED.is_popular,
    is_featured = EXCLUDED.is_featured,
    badge_text = EXCLUDED.badge_text,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();

-- ============================================================================
-- SECTION 5: APP SETTINGS
-- ============================================================================

INSERT INTO public.app_settings (key, category, value, value_type, label, description, is_public, is_editable) VALUES
    -- General Settings
    ('site_name', 'general', '"Layerium Cloud"', 'string', 'Site Name', 'The name of the website', TRUE, TRUE),
    ('site_description', 'general', '"High-Performance VPS & RDP Hosting"', 'string', 'Site Description', 'Site meta description', TRUE, TRUE),
    ('support_email', 'general', '"support@layerium.cloud"', 'string', 'Support Email', 'Customer support email address', TRUE, TRUE),
    ('sales_email', 'general', '"sales@layerium.cloud"', 'string', 'Sales Email', 'Sales inquiries email address', TRUE, TRUE),
    
    -- Currency Settings
    ('default_currency', 'billing', '"USD"', 'string', 'Default Currency', 'Default currency for pricing', TRUE, TRUE),
    ('supported_currencies', 'billing', '["USD", "PKR", "EUR", "GBP"]', 'json', 'Supported Currencies', 'List of supported currencies', TRUE, FALSE),
    ('usd_to_pkr_rate', 'billing', '280', 'number', 'USD to PKR Rate', 'Exchange rate for USD to PKR', FALSE, TRUE),
    
    -- Tax Settings
    ('tax_enabled', 'billing', 'false', 'boolean', 'Tax Enabled', 'Whether to charge tax', FALSE, TRUE),
    ('tax_rate', 'billing', '0', 'number', 'Tax Rate', 'Tax rate percentage', FALSE, TRUE),
    
    -- Server Settings
    ('auto_provision', 'servers', 'true', 'boolean', 'Auto Provision', 'Automatically provision servers after payment', FALSE, TRUE),
    ('default_os', 'servers', '"ubuntu-24.04"', 'string', 'Default OS', 'Default operating system for new servers', FALSE, TRUE),
    
    -- Support Settings
    ('ticket_auto_close_days', 'support', '7', 'number', 'Auto Close Days', 'Days of inactivity before auto-closing tickets', FALSE, TRUE),
    ('sla_response_hours', 'support', '24', 'number', 'SLA Response Hours', 'Target response time in hours', FALSE, TRUE),
    
    -- Feature Flags
    ('maintenance_mode', 'features', 'false', 'boolean', 'Maintenance Mode', 'Enable maintenance mode', TRUE, TRUE),
    ('registration_enabled', 'features', 'true', 'boolean', 'Registration Enabled', 'Allow new user registrations', TRUE, TRUE),
    ('referral_program_enabled', 'features', 'true', 'boolean', 'Referral Program', 'Enable referral program', TRUE, TRUE)
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = NOW();

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
DECLARE
    v_datacenters INTEGER;
    v_os_templates INTEGER;
    v_vps_plans INTEGER;
    v_rdp_plans INTEGER;
    v_settings INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_datacenters FROM public.datacenters;
    SELECT COUNT(*) INTO v_os_templates FROM public.os_templates;
    SELECT COUNT(*) INTO v_vps_plans FROM public.pricing_plans WHERE type = 'VPS';
    SELECT COUNT(*) INTO v_rdp_plans FROM public.pricing_plans WHERE type = 'RDP';
    SELECT COUNT(*) INTO v_settings FROM public.app_settings;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'SEED DATA LOADED SUCCESSFULLY!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Datacenters: %', v_datacenters;
    RAISE NOTICE 'OS Templates: %', v_os_templates;
    RAISE NOTICE 'VPS Plans: %', v_vps_plans;
    RAISE NOTICE 'RDP Plans: %', v_rdp_plans;
    RAISE NOTICE 'App Settings: %', v_settings;
    RAISE NOTICE '========================================';
END $$;

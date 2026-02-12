-- ============================================================================
-- LAYERIUM CLOUD - SERVER CREDENTIALS MIGRATION
-- ============================================================================
-- Migration: 003_server_credentials.sql
-- Description: Add username and plaintext password fields for admin-provided credentials
-- Author: Layerium Cloud Engineering Team
-- Created: 2024-12-31
-- ============================================================================

-- Add username column with default 'Administrator' for RDP, 'root' for VPS
ALTER TABLE public.servers 
ADD COLUMN IF NOT EXISTS username TEXT DEFAULT 'Administrator';

-- Add password column (admin-provided, stored securely)
-- Note: In production, this should be encrypted at rest
ALTER TABLE public.servers 
ADD COLUMN IF NOT EXISTS password TEXT;

-- Add RDP port column (default 3389 for Windows)
ALTER TABLE public.servers 
ADD COLUMN IF NOT EXISTS rdp_port INTEGER DEFAULT 3389;

-- Add SSH port column (default 22 for Linux)
ALTER TABLE public.servers 
ADD COLUMN IF NOT EXISTS ssh_port INTEGER DEFAULT 22;

-- Update existing servers to have appropriate default usernames based on OS
UPDATE public.servers 
SET username = CASE 
    WHEN os_template ILIKE '%windows%' THEN 'Administrator'
    ELSE 'root'
END
WHERE username IS NULL OR username = '';

-- Add comment for documentation
COMMENT ON COLUMN public.servers.username IS 'Login username - Administrator for Windows RDP, root for Linux VPS';
COMMENT ON COLUMN public.servers.password IS 'Admin-provided password for server access';
COMMENT ON COLUMN public.servers.rdp_port IS 'RDP port for Windows servers (default 3389)';
COMMENT ON COLUMN public.servers.ssh_port IS 'SSH port for Linux servers (default 22)';

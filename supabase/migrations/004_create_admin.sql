-- ============================================================================
-- LAYERIUM CLOUD - CREATE ADMIN USER
-- ============================================================================
-- Migration: 004_create_admin.sql
-- Description: SQL to promote a user to admin role
-- 
-- USAGE:
-- 1. First, find the user's ID by their email:
--    SELECT id, email, role FROM profiles WHERE email = 'user@example.com';
--
-- 2. Then update their role to ADMIN:
--    UPDATE profiles SET role = 'ADMIN' WHERE email = 'your-email@example.com';
--
-- Or use the function below for a safer approach.
-- ============================================================================

-- Function to promote a user to admin by email
CREATE OR REPLACE FUNCTION promote_to_admin(p_email TEXT)
RETURNS TABLE(
  user_id UUID,
  email TEXT,
  old_role user_role,
  new_role user_role,
  success BOOLEAN
) AS $$
DECLARE
  v_user_id UUID;
  v_old_role user_role;
  v_email TEXT;
BEGIN
  -- Find the user
  SELECT p.id, p.role, p.email INTO v_user_id, v_old_role, v_email
  FROM profiles p
  WHERE p.email = p_email;
  
  IF v_user_id IS NULL THEN
    RETURN QUERY SELECT 
      NULL::UUID,
      p_email,
      NULL::user_role,
      NULL::user_role,
      FALSE;
    RETURN;
  END IF;
  
  -- Update to admin
  UPDATE profiles
  SET role = 'ADMIN', updated_at = NOW()
  WHERE id = v_user_id;
  
  -- Return result
  RETURN QUERY SELECT 
    v_user_id,
    v_email,
    v_old_role,
    'ADMIN'::user_role,
    TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to demote an admin back to user
CREATE OR REPLACE FUNCTION demote_to_user(p_email TEXT)
RETURNS TABLE(
  user_id UUID,
  email TEXT,
  old_role user_role,
  new_role user_role,
  success BOOLEAN
) AS $$
DECLARE
  v_user_id UUID;
  v_old_role user_role;
  v_email TEXT;
BEGIN
  -- Find the user
  SELECT p.id, p.role, p.email INTO v_user_id, v_old_role, v_email
  FROM profiles p
  WHERE p.email = p_email;
  
  IF v_user_id IS NULL THEN
    RETURN QUERY SELECT 
      NULL::UUID,
      p_email,
      NULL::user_role,
      NULL::user_role,
      FALSE;
    RETURN;
  END IF;
  
  -- Update to user
  UPDATE profiles
  SET role = 'USER', updated_at = NOW()
  WHERE id = v_user_id;
  
  -- Return result
  RETURN QUERY SELECT 
    v_user_id,
    v_email,
    v_old_role,
    'USER'::user_role,
    TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION promote_to_admin(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION demote_to_user(TEXT) TO service_role;

-- ============================================================================
-- QUICK ADMIN CREATION EXAMPLES
-- ============================================================================
-- 
-- To make a user an admin, run one of these in Supabase SQL Editor:
--
-- Option 1: Direct UPDATE (simplest - RECOMMENDED)
-- UPDATE profiles SET role = 'ADMIN' WHERE email = 'your-email@example.com';
--
-- Option 2: Using the function
-- SELECT * FROM promote_to_admin('your-email@example.com');
--
-- To verify:
-- SELECT id, email, role, full_name FROM profiles WHERE role = 'ADMIN';
--
-- ============================================================================

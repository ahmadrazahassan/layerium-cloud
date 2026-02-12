-- ============================================================================
-- Migration 005: Add INSERT policy for profiles table
-- 
-- The on_auth_user_created trigger should create profiles automatically,
-- but as a safety net, allow users to insert their own profile row.
-- This handles cases where the trigger didn't fire or wasn't deployed.
-- ============================================================================

-- Allow authenticated users to insert their own profile
CREATE POLICY "profiles_insert_own"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Recreate the auth trigger in case it wasn't deployed
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
        email_verified,
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

    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- Profile already exists, ignore
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

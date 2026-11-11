-- =============================================================================
-- AGRISMART AI — AUTHENTICATION & PHONE UNIQUENESS HARDENING
-- Migration Version: 20261112_003_auth_phone_unique.sql
-- =============================================================================

-- Ensure phone numbers are unique when present to prevent duplicate mobile registrations
CREATE UNIQUE INDEX IF NOT EXISTS profiles_phone_unique_idx 
ON public.profiles (phone) 
WHERE phone IS NOT NULL AND phone != '';

-- Add validation check on phone number format (must be 10 digits or null/empty)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_phone_format_check'
  ) THEN
    ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_phone_format_check
    CHECK (phone IS NULL OR phone = '' OR phone ~ '^[0-9]{10}$');
  END IF;
END $$;


-- =============================================================================
-- AGRISMART AI — SUPABASE CLOUD HARDENING MIGRATION
-- Migration Version: 20261111_002_auth_storage_and_rls_hardening.sql
-- 
-- Summary of Additions:
-- 1. Automated Supabase Auth (auth.users) -> public.profiles sync trigger
-- 2. Idempotent re-run safety for all Row Level Security (RLS) policies
-- 3. Private 'crop-images' Supabase Storage bucket and ownership policies
-- =============================================================================

-- =============================================================================
-- 1. AUTH USER PROFILE AUTO-SYNC TRIGGER
-- When a user registers via Supabase Auth, securely initialize their profile.
-- Existing profiles are NEVER overwritten (ON CONFLICT DO NOTHING).
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    phone,
    role,
    preferred_language,
    state,
    district,
    mandal,
    village,
    soil_type,
    irrigation_type,
    land_area,
    land_unit,
    farming_experience
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1),
      'Farmer'
    ),
    COALESCE(NEW.email, ''),
    NEW.raw_user_meta_data->>'phone',
    'farmer', -- Enforce default 'farmer' role; never allow unprivileged client escalation
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en'),
    COALESCE(NEW.raw_user_meta_data->>'state', 'Andhra Pradesh'),
    COALESCE(NEW.raw_user_meta_data->>'district', 'Guntur'),
    NEW.raw_user_meta_data->>'mandal',
    NEW.raw_user_meta_data->>'village',
    COALESCE((NEW.raw_user_meta_data->>'soil_type')::soil_type_enum, 'black_cotton'),
    COALESCE((NEW.raw_user_meta_data->>'irrigation_type')::irrigation_type_enum, 'borewell'),
    COALESCE((NEW.raw_user_meta_data->>'land_area')::numeric, 2.0),
    COALESCE(NEW.raw_user_meta_data->>'land_unit', 'acre'),
    COALESCE((NEW.raw_user_meta_data->>'farming_experience')::integer, 5)
  )
  ON CONFLICT (id) DO NOTHING; -- Preserves existing user profiles

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Safely attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 2. PRIVATE CROP-IMAGES STORAGE BUCKET & RLS POLICIES
-- Configures secure bucket for disease scan leaf specimens (max 8MB, JPEG/PNG/WebP)
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'crop-images',
  'crop-images',
  false,
  8388608, -- 8 MB maximum
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 8388608,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Storage Object Ownership Policies (Idempotent)
DROP POLICY IF EXISTS "crop_images_owner_select" ON storage.objects;
CREATE POLICY "crop_images_owner_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'crop-images' AND (auth.uid() = owner OR public.is_admin()));

DROP POLICY IF EXISTS "crop_images_owner_insert" ON storage.objects;
CREATE POLICY "crop_images_owner_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'crop-images' AND auth.uid() = owner);

DROP POLICY IF EXISTS "crop_images_owner_update" ON storage.objects;
CREATE POLICY "crop_images_owner_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'crop-images' AND auth.uid() = owner)
  WITH CHECK (bucket_id = 'crop-images' AND auth.uid() = owner);

DROP POLICY IF EXISTS "crop_images_owner_delete" ON storage.objects;
CREATE POLICY "crop_images_owner_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'crop-images' AND (auth.uid() = owner OR public.is_admin()));

-- =============================================================================
-- 3. IDEMPOTENT RLS POLICY REFRESH FOR CORE TABLES
-- Ensures policies can be safely rerun anytime without "policy already exists" errors
-- =============================================================================

-- 3.1 PROFILES
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND (role = (SELECT role FROM public.profiles WHERE id = auth.uid())));

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- 3.2 CROPS & VARIETIES
DROP POLICY IF EXISTS "crops_read_authenticated" ON public.crops;
CREATE POLICY "crops_read_authenticated" ON public.crops
  FOR SELECT TO authenticated
  USING (is_active = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "crops_admin_all" ON public.crops;
CREATE POLICY "crops_admin_all" ON public.crops
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "crop_varieties_read_authenticated" ON public.crop_varieties;
CREATE POLICY "crop_varieties_read_authenticated" ON public.crop_varieties
  FOR SELECT TO authenticated
  USING (TRUE);

DROP POLICY IF EXISTS "crop_varieties_admin_all" ON public.crop_varieties;
CREATE POLICY "crop_varieties_admin_all" ON public.crop_varieties
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3.3 FARMER FIELDS
DROP POLICY IF EXISTS "farmer_fields_select" ON public.farmer_fields;
CREATE POLICY "farmer_fields_select" ON public.farmer_fields
  FOR SELECT TO authenticated
  USING (farmer_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "farmer_fields_insert" ON public.farmer_fields;
CREATE POLICY "farmer_fields_insert" ON public.farmer_fields
  FOR INSERT TO authenticated
  WITH CHECK (farmer_id = auth.uid());

DROP POLICY IF EXISTS "farmer_fields_update" ON public.farmer_fields;
CREATE POLICY "farmer_fields_update" ON public.farmer_fields
  FOR UPDATE TO authenticated
  USING (farmer_id = auth.uid())
  WITH CHECK (farmer_id = auth.uid());

DROP POLICY IF EXISTS "farmer_fields_delete" ON public.farmer_fields;
CREATE POLICY "farmer_fields_delete" ON public.farmer_fields
  FOR DELETE TO authenticated
  USING (farmer_id = auth.uid());

-- 3.4 FARMER CROPS
DROP POLICY IF EXISTS "farmer_crops_select" ON public.farmer_crops;
CREATE POLICY "farmer_crops_select" ON public.farmer_crops
  FOR SELECT TO authenticated
  USING (farmer_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "farmer_crops_insert" ON public.farmer_crops;
CREATE POLICY "farmer_crops_insert" ON public.farmer_crops
  FOR INSERT TO authenticated
  WITH CHECK (farmer_id = auth.uid());

DROP POLICY IF EXISTS "farmer_crops_update" ON public.farmer_crops;
CREATE POLICY "farmer_crops_update" ON public.farmer_crops
  FOR UPDATE TO authenticated
  USING (farmer_id = auth.uid())
  WITH CHECK (farmer_id = auth.uid());

DROP POLICY IF EXISTS "farmer_crops_delete" ON public.farmer_crops;
CREATE POLICY "farmer_crops_delete" ON public.farmer_crops
  FOR DELETE TO authenticated
  USING (farmer_id = auth.uid());

-- 3.5 ADVISORIES
DROP POLICY IF EXISTS "advisories_select" ON public.advisories;
CREATE POLICY "advisories_select" ON public.advisories
  FOR SELECT TO authenticated
  USING (farmer_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "advisories_insert" ON public.advisories;
CREATE POLICY "advisories_insert" ON public.advisories
  FOR INSERT TO authenticated
  WITH CHECK (farmer_id = auth.uid());

DROP POLICY IF EXISTS "advisories_delete" ON public.advisories;
CREATE POLICY "advisories_delete" ON public.advisories
  FOR DELETE TO authenticated
  USING (farmer_id = auth.uid());

-- 3.6 DISEASE REPORTS
DROP POLICY IF EXISTS "disease_reports_select" ON public.disease_reports;
CREATE POLICY "disease_reports_select" ON public.disease_reports
  FOR SELECT TO authenticated
  USING (farmer_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "disease_reports_insert" ON public.disease_reports;
CREATE POLICY "disease_reports_insert" ON public.disease_reports
  FOR INSERT TO authenticated
  WITH CHECK (farmer_id = auth.uid());

DROP POLICY IF EXISTS "disease_reports_delete" ON public.disease_reports;
CREATE POLICY "disease_reports_delete" ON public.disease_reports
  FOR DELETE TO authenticated
  USING (farmer_id = auth.uid());

-- 3.7 CHAT CONVERSATIONS & MESSAGES
DROP POLICY IF EXISTS "chat_conv_select" ON public.chat_conversations;
CREATE POLICY "chat_conv_select" ON public.chat_conversations
  FOR SELECT TO authenticated
  USING (farmer_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "chat_conv_insert" ON public.chat_conversations;
CREATE POLICY "chat_conv_insert" ON public.chat_conversations
  FOR INSERT TO authenticated
  WITH CHECK (farmer_id = auth.uid());

DROP POLICY IF EXISTS "chat_conv_delete" ON public.chat_conversations;
CREATE POLICY "chat_conv_delete" ON public.chat_conversations
  FOR DELETE TO authenticated
  USING (farmer_id = auth.uid());

DROP POLICY IF EXISTS "chat_msg_select" ON public.chat_messages;
CREATE POLICY "chat_msg_select" ON public.chat_messages
  FOR SELECT TO authenticated
  USING (farmer_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "chat_msg_insert" ON public.chat_messages;
CREATE POLICY "chat_msg_insert" ON public.chat_messages
  FOR INSERT TO authenticated
  WITH CHECK (farmer_id = auth.uid());

-- 3.8 RECORDS, LOGS & NOTIFICATIONS
DROP POLICY IF EXISTS "fertilizer_records_all" ON public.fertilizer_records;
CREATE POLICY "fertilizer_records_all" ON public.fertilizer_records
  FOR ALL TO authenticated
  USING (farmer_id = auth.uid() OR public.is_admin())
  WITH CHECK (farmer_id = auth.uid());

DROP POLICY IF EXISTS "irrigation_records_all" ON public.irrigation_records;
CREATE POLICY "irrigation_records_all" ON public.irrigation_records
  FOR ALL TO authenticated
  USING (farmer_id = auth.uid() OR public.is_admin())
  WITH CHECK (farmer_id = auth.uid());

DROP POLICY IF EXISTS "weather_records_all" ON public.weather_records;
CREATE POLICY "weather_records_all" ON public.weather_records
  FOR ALL TO authenticated
  USING (farmer_id = auth.uid() OR public.is_admin())
  WITH CHECK (farmer_id = auth.uid());

DROP POLICY IF EXISTS "notifications_all" ON public.notifications;
CREATE POLICY "notifications_all" ON public.notifications
  FOR ALL TO authenticated
  USING (farmer_id = auth.uid() OR public.is_admin())
  WITH CHECK (farmer_id = auth.uid());

-- 3.9 KNOWLEDGE BASE & SOURCES
DROP POLICY IF EXISTS "agricultural_sources_read" ON public.agricultural_sources;
CREATE POLICY "agricultural_sources_read" ON public.agricultural_sources
  FOR SELECT TO authenticated
  USING (is_active = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "agricultural_sources_admin" ON public.agricultural_sources;
CREATE POLICY "agricultural_sources_admin" ON public.agricultural_sources
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "knowledge_documents_read" ON public.knowledge_documents;
CREATE POLICY "knowledge_documents_read" ON public.knowledge_documents
  FOR SELECT TO authenticated
  USING (is_verified = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "knowledge_documents_admin" ON public.knowledge_documents;
CREATE POLICY "knowledge_documents_admin" ON public.knowledge_documents
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


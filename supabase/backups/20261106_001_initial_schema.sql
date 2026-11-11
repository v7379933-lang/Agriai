-- =============================================================================
-- AGRISMART AI — POSTGRESQL PRODUCTION DATABASE MIGRATION
-- Migration Version: 20261106_001_initial_schema.sql
-- =============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('farmer', 'agronomist', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE soil_type_enum AS ENUM (
      'sandy', 'sandy_loam', 'loamy', 'clay', 'clay_loam', 
      'silty', 'black_cotton', 'red_soil', 'alluvial', 'laterite'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE irrigation_type_enum AS ENUM (
      'drip', 'sprinkler', 'flood', 'furrow', 'borewell', 'canal', 'rainfed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE crop_season_enum AS ENUM (
      'kharif', 'rabi', 'zaid', 'perennial'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE crop_growth_stage_enum AS ENUM (
      'land_preparation', 'sowing', 'germination', 'seedling', 
      'vegetative', 'flowering', 'fruiting', 'grain_filling', 'maturity', 'harvesting'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE advisory_severity_enum AS ENUM (
      'low', 'medium', 'high', 'critical'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE diagnostic_type_enum AS ENUM (
      'disease', 'pest', 'nutrient_deficiency', 'environmental_stress', 'unknown'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- 3. CORE TABLES
-- =============================================================================

-- 3.1 PROFILES TABLE (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role user_role_enum DEFAULT 'farmer' NOT NULL,
  state TEXT DEFAULT 'Andhra Pradesh',
  district TEXT,
  mandal TEXT,
  village TEXT,
  pincode TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  preferred_language TEXT DEFAULT 'en' NOT NULL,
  land_area NUMERIC(10, 2) DEFAULT 2.0 CHECK (land_area >= 0),
  land_unit TEXT DEFAULT 'acre',
  soil_type soil_type_enum DEFAULT 'black_cotton',
  irrigation_type irrigation_type_enum DEFAULT 'borewell',
  farming_experience INTEGER DEFAULT 5 CHECK (farming_experience >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.2 CROPS MASTER TABLE
CREATE TABLE IF NOT EXISTS public.crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  scientific_name TEXT,
  category TEXT NOT NULL,
  description TEXT,
  crop_duration_days INTEGER,
  suitable_seasons TEXT[] NOT NULL DEFAULT '{}',
  suitable_soil_types TEXT[] NOT NULL DEFAULT '{}',
  water_requirement TEXT,
  climate_requirement JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.3 CROP VARIETIES TABLE
CREATE TABLE IF NOT EXISTS public.crop_varieties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id UUID NOT NULL REFERENCES public.crops(id) ON DELETE CASCADE,
  variety_name TEXT NOT NULL,
  variety_code TEXT,
  release_year INTEGER,
  maturity_days INTEGER,
  suitable_regions TEXT[] DEFAULT '{}',
  recommended_seasons TEXT[] DEFAULT '{}',
  characteristics JSONB DEFAULT '{}'::jsonb,
  source_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.4 FARMER FIELDS TABLE
CREATE TABLE IF NOT EXISTS public.farmer_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  area NUMERIC(10, 2) NOT NULL CHECK (area > 0),
  area_unit TEXT DEFAULT 'acre',
  state TEXT,
  district TEXT,
  mandal TEXT,
  village TEXT,
  soil_type soil_type_enum,
  soil_ph NUMERIC(3, 1) CHECK (soil_ph BETWEEN 0.0 AND 14.0),
  nitrogen NUMERIC(8, 2) CHECK (nitrogen >= 0),
  phosphorus NUMERIC(8, 2) CHECK (phosphorus >= 0),
  potassium NUMERIC(8, 2) CHECK (potassium >= 0),
  irrigation_type irrigation_type_enum,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.5 FARMER CROPS (Active & Past Cultivated Crops)
CREATE TABLE IF NOT EXISTS public.farmer_crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  field_id UUID REFERENCES public.farmer_fields(id) ON DELETE SET NULL,
  crop_id UUID REFERENCES public.crops(id) ON DELETE RESTRICT,
  variety_id UUID REFERENCES public.crop_varieties(id) ON DELETE SET NULL,
  season crop_season_enum DEFAULT 'kharif',
  sowing_date DATE NOT NULL,
  expected_harvest_date DATE,
  current_growth_stage crop_growth_stage_enum DEFAULT 'sowing',
  area NUMERIC(10, 2) CHECK (area > 0),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'harvested', 'abandoned')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.6 AGRICULTURAL SOURCES TABLE
CREATE TABLE IF NOT EXISTS public.agricultural_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name TEXT NOT NULL,
  organization TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_url TEXT,
  region TEXT,
  crop_id UUID REFERENCES public.crops(id) ON DELETE SET NULL,
  publication_date DATE,
  last_verified_at TIMESTAMPTZ,
  reliability_level TEXT DEFAULT 'high',
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.7 ADVISORIES TABLE (AI Generated Recommendations)
CREATE TABLE IF NOT EXISTS public.advisories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  farmer_crop_id UUID REFERENCES public.farmer_crops(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  input_data JSONB NOT NULL,
  result JSONB NOT NULL,
  confidence advisory_severity_enum DEFAULT 'high',
  severity advisory_severity_enum DEFAULT 'low',
  language TEXT DEFAULT 'en',
  model_name TEXT DEFAULT 'gemini-2.5-flash',
  source_ids UUID[] DEFAULT '{}',
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.8 DISEASE REPORTS (Pest & Disease Diagnosis Scans)
CREATE TABLE IF NOT EXISTS public.disease_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  farmer_crop_id UUID REFERENCES public.farmer_crops(id) ON DELETE SET NULL,
  crop_name TEXT NOT NULL,
  plant_part TEXT,
  symptoms TEXT,
  image_path TEXT,
  possible_diagnosis JSONB NOT NULL,
  recommended_actions JSONB NOT NULL,
  confidence NUMERIC(4, 3),
  status TEXT DEFAULT 'analyzed',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.9 CHAT CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Agricultural Conversation',
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.10 CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.11 FERTILIZER RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.fertilizer_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  farmer_crop_id UUID NOT NULL REFERENCES public.farmer_crops(id) ON DELETE CASCADE,
  fertilizer_name TEXT NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL CHECK (quantity >= 0),
  quantity_unit TEXT DEFAULT 'kg',
  application_date DATE DEFAULT CURRENT_DATE NOT NULL,
  application_method TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.12 IRRIGATION RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.irrigation_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  farmer_crop_id UUID NOT NULL REFERENCES public.farmer_crops(id) ON DELETE CASCADE,
  irrigation_date DATE DEFAULT CURRENT_DATE NOT NULL,
  water_quantity NUMERIC(10, 2),
  water_unit TEXT DEFAULT 'liters',
  irrigation_method TEXT,
  rainfall_mm NUMERIC(8, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.13 WEATHER RECORDS TABLE (Caching meteorological data)
CREATE TABLE IF NOT EXISTS public.weather_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  temperature NUMERIC(4, 1),
  humidity NUMERIC(4, 1),
  rainfall_mm NUMERIC(6, 2),
  wind_speed NUMERIC(5, 1),
  forecast JSONB,
  provider TEXT DEFAULT 'open-meteo',
  observed_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '3 hours'),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.14 KNOWLEDGE DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES public.agricultural_sources(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  crop_id UUID REFERENCES public.crops(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  region TEXT,
  language TEXT DEFAULT 'en',
  metadata JSONB DEFAULT '{}'::jsonb,
  is_verified BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.15 NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  severity advisory_severity_enum DEFAULT 'low',
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =============================================================================
-- 4. PERFORMANCE INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_farmer_fields_farmer ON public.farmer_fields(farmer_id);
CREATE INDEX IF NOT EXISTS idx_farmer_crops_farmer ON public.farmer_crops(farmer_id);
CREATE INDEX IF NOT EXISTS idx_farmer_crops_crop ON public.farmer_crops(crop_id);
CREATE INDEX IF NOT EXISTS idx_advisories_farmer ON public.advisories(farmer_id);
CREATE INDEX IF NOT EXISTS idx_advisories_created ON public.advisories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_disease_reports_farmer ON public.disease_reports(farmer_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conv ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_fertilizer_records_crop ON public.fertilizer_records(farmer_crop_id);
CREATE INDEX IF NOT EXISTS idx_irrigation_records_crop ON public.irrigation_records(farmer_crop_id);
CREATE INDEX IF NOT EXISTS idx_weather_records_geo ON public.weather_records(latitude, longitude, expires_at);
CREATE INDEX IF NOT EXISTS idx_notifications_farmer ON public.notifications(farmer_id, is_read);
CREATE INDEX IF NOT EXISTS idx_knowledge_docs_category ON public.knowledge_documents(category, crop_id);

-- =============================================================================
-- 5. AUTOMATED UPDATED_AT TRIGGER
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_crops_updated_at ON public.crops;
CREATE TRIGGER trg_crops_updated_at BEFORE UPDATE ON public.crops
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_farmer_fields_updated_at ON public.farmer_fields;
CREATE TRIGGER trg_farmer_fields_updated_at BEFORE UPDATE ON public.farmer_fields
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_farmer_crops_updated_at ON public.farmer_crops;
CREATE TRIGGER trg_farmer_crops_updated_at BEFORE UPDATE ON public.farmer_crops
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_chat_conv_updated_at ON public.chat_conversations;
CREATE TRIGGER trg_chat_conv_updated_at BEFORE UPDATE ON public.chat_conversations
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_knowledge_docs_updated_at ON public.knowledge_documents;
CREATE TRIGGER trg_knowledge_docs_updated_at BEFORE UPDATE ON public.knowledge_documents
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_varieties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agricultural_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fertilizer_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.irrigation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6.1 PROFILES POLICIES
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND (role = (SELECT role FROM public.profiles WHERE id = auth.uid()))); -- prevent self-privilege escalation

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- 6.2 CROPS & VARIETIES (Publicly readable by authenticated, admin writable)
CREATE POLICY "crops_read_authenticated" ON public.crops
  FOR SELECT TO authenticated
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "crops_admin_all" ON public.crops
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "crop_varieties_read_authenticated" ON public.crop_varieties
  FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "crop_varieties_admin_all" ON public.crop_varieties
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 6.3 FARMER FIELDS POLICIES
CREATE POLICY "farmer_fields_select" ON public.farmer_fields
  FOR SELECT TO authenticated
  USING (farmer_id = auth.uid() OR public.is_admin());

CREATE POLICY "farmer_fields_insert" ON public.farmer_fields
  FOR INSERT TO authenticated
  WITH CHECK (farmer_id = auth.uid());

CREATE POLICY "farmer_fields_update" ON public.farmer_fields
  FOR UPDATE TO authenticated
  USING (farmer_id = auth.uid())
  WITH CHECK (farmer_id = auth.uid());

CREATE POLICY "farmer_fields_delete" ON public.farmer_fields
  FOR DELETE TO authenticated
  USING (farmer_id = auth.uid());

-- 6.4 FARMER CROPS POLICIES
CREATE POLICY "farmer_crops_select" ON public.farmer_crops
  FOR SELECT TO authenticated
  USING (farmer_id = auth.uid() OR public.is_admin());

CREATE POLICY "farmer_crops_insert" ON public.farmer_crops
  FOR INSERT TO authenticated
  WITH CHECK (farmer_id = auth.uid());

CREATE POLICY "farmer_crops_update" ON public.farmer_crops
  FOR UPDATE TO authenticated
  USING (farmer_id = auth.uid())
  WITH CHECK (farmer_id = auth.uid());

CREATE POLICY "farmer_crops_delete" ON public.farmer_crops
  FOR DELETE TO authenticated
  USING (farmer_id = auth.uid());

-- 6.5 ADVISORIES POLICIES
CREATE POLICY "advisories_select" ON public.advisories
  FOR SELECT TO authenticated
  USING (farmer_id = auth.uid() OR public.is_admin());

CREATE POLICY "advisories_insert" ON public.advisories
  FOR INSERT TO authenticated
  WITH CHECK (farmer_id = auth.uid());

CREATE POLICY "advisories_delete" ON public.advisories
  FOR DELETE TO authenticated
  USING (farmer_id = auth.uid());

-- 6.6 DISEASE REPORTS POLICIES
CREATE POLICY "disease_reports_select" ON public.disease_reports
  FOR SELECT TO authenticated
  USING (farmer_id = auth.uid() OR public.is_admin());

CREATE POLICY "disease_reports_insert" ON public.disease_reports
  FOR INSERT TO authenticated
  WITH CHECK (farmer_id = auth.uid());

CREATE POLICY "disease_reports_delete" ON public.disease_reports
  FOR DELETE TO authenticated
  USING (farmer_id = auth.uid());

-- 6.7 CHAT CONVERSATIONS & MESSAGES
CREATE POLICY "chat_conv_select" ON public.chat_conversations
  FOR SELECT TO authenticated
  USING (farmer_id = auth.uid() OR public.is_admin());

CREATE POLICY "chat_conv_insert" ON public.chat_conversations
  FOR INSERT TO authenticated
  WITH CHECK (farmer_id = auth.uid());

CREATE POLICY "chat_conv_delete" ON public.chat_conversations
  FOR DELETE TO authenticated
  USING (farmer_id = auth.uid());

CREATE POLICY "chat_msg_select" ON public.chat_messages
  FOR SELECT TO authenticated
  USING (farmer_id = auth.uid() OR public.is_admin());

CREATE POLICY "chat_msg_insert" ON public.chat_messages
  FOR INSERT TO authenticated
  WITH CHECK (farmer_id = auth.uid());

-- 6.8 FERTILIZER & IRRIGATION RECORDS
CREATE POLICY "fertilizer_records_all" ON public.fertilizer_records
  FOR ALL TO authenticated
  USING (farmer_id = auth.uid() OR public.is_admin())
  WITH CHECK (farmer_id = auth.uid());

CREATE POLICY "irrigation_records_all" ON public.irrigation_records
  FOR ALL TO authenticated
  USING (farmer_id = auth.uid() OR public.is_admin())
  WITH CHECK (farmer_id = auth.uid());

-- 6.9 WEATHER & NOTIFICATIONS
CREATE POLICY "weather_records_all" ON public.weather_records
  FOR ALL TO authenticated
  USING (farmer_id = auth.uid() OR public.is_admin())
  WITH CHECK (farmer_id = auth.uid());

CREATE POLICY "notifications_all" ON public.notifications
  FOR ALL TO authenticated
  USING (farmer_id = auth.uid() OR public.is_admin())
  WITH CHECK (farmer_id = auth.uid());

-- 6.10 KNOWLEDGE BASE & SOURCES (Public authenticated read, Admin write)
CREATE POLICY "agricultural_sources_read" ON public.agricultural_sources
  FOR SELECT TO authenticated
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "agricultural_sources_admin" ON public.agricultural_sources
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "knowledge_documents_read" ON public.knowledge_documents
  FOR SELECT TO authenticated
  USING (is_verified = TRUE OR public.is_admin());

CREATE POLICY "knowledge_documents_admin" ON public.knowledge_documents
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


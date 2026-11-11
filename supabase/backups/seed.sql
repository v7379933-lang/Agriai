-- =============================================================================
-- AGRISMART AI — PRODUCTION INITIAL SEED DATA
-- Verified Indian Crops, Agro-Climatic Varieties, Sources & Cultivation Guides
-- =============================================================================

-- 1. AGRICULTURAL SOURCES
INSERT INTO public.agricultural_sources (id, source_name, organization, source_type, source_url, region, reliability_level)
VALUES 
  ('a1111111-1111-1111-1111-111111111111', 'ICAR Package of Practices', 'Indian Council of Agricultural Research', 'Government Research Institute', 'https://icar.org.in', 'All India', 'high'),
  ('a2222222-2222-2222-2222-222222222222', 'ANGRAU Crop Production Guide', 'Acharya N.G. Ranga Agricultural University', 'State Agricultural University', 'https://angrau.ac.in', 'Andhra Pradesh', 'high'),
  ('a3333333-3333-3333-3333-333333333333', 'PJTSAU Vyavasaya Panchangam', 'Professor Jayashankar Telangana State Agricultural University', 'State Agricultural University', 'https://pjtsau.edu.in', 'Telangana', 'high'),
  ('a4444444-4444-4444-4444-444444444444', 'KVK Advisory Bulletins', 'Krishi Vigyan Kendra Network', 'Extension Center', 'https://kvk.icar.gov.in', 'Regional', 'high')
ON CONFLICT (id) DO NOTHING;

-- 2. MASTER CROPS
INSERT INTO public.crops (id, name, scientific_name, category, description, crop_duration_days, suitable_seasons, suitable_soil_types, water_requirement, climate_requirement)
VALUES 
  (
    'c1111111-1111-1111-1111-111111111111',
    'Rice (Paddy)',
    'Oryza sativa',
    'Cereals and Millets',
    'Staple grain crop across Andhra Pradesh, Telangana, and coastal belts. High water and heat requirement.',
    130,
    ARRAY['kharif', 'rabi'],
    ARRAY['clay', 'clay_loam', 'alluvial', 'black_cotton'],
    'High (1200-1400 mm)',
    '{"temperature_range_c": [20, 38], "optimum_ph": [5.5, 7.0], "humidity_percent": [70, 90]}'::jsonb
  ),
  (
    'c2222222-2222-2222-2222-222222222222',
    'Cotton',
    'Gossypium hirsutum',
    'Commercial Crops',
    'Major cash crop in Telangana (Adilabad, Warangal) and Rayalaseema. Requires deep black soil and dry harvest period.',
    165,
    ARRAY['kharif'],
    ARRAY['black_cotton', 'clay_loam', 'alluvial'],
    'Medium (600-800 mm)',
    '{"temperature_range_c": [21, 35], "optimum_ph": [6.5, 8.0], "humidity_percent": [50, 75]}'::jsonb
  ),
  (
    'c3333333-3333-3333-3333-333333333333',
    'Chilli (Mirchi)',
    'Capsicum annuum',
    'Horticultural Crops',
    'Prominent spice crop in Guntur, Khammam, and Warangal. Highly sensitive to waterlogging and thrips/mites.',
    150,
    ARRAY['kharif', 'rabi'],
    ARRAY['black_cotton', 'red_soil', 'loamy'],
    'Medium (600-750 mm)',
    '{"temperature_range_c": [18, 32], "optimum_ph": [6.0, 7.5], "humidity_percent": [60, 75]}'::jsonb
  ),
  (
    'c4444444-4444-4444-4444-444444444444',
    'Groundnut (Peanut)',
    'Arachis hypogaea',
    'Oilseeds',
    'Leading oilseed in Anantapur, Kurnool, and Mahbubnagar. Requires well-drained sandy loam or red soils for easy pod pegging.',
    110,
    ARRAY['kharif', 'rabi'],
    ARRAY['sandy_loam', 'red_soil', 'loamy'],
    'Medium (450-600 mm)',
    '{"temperature_range_c": [22, 30], "optimum_ph": [6.0, 7.0], "humidity_percent": [50, 70]}'::jsonb
  ),
  (
    'c5555555-5555-5555-5555-555555555555',
    'Maize (Corn)',
    'Zea mays',
    'Cereals and Millets',
    'Highly versatile cereal with excellent yield potential in Nizamabad, Karimnagar, and West Godavari.',
    105,
    ARRAY['kharif', 'rabi', 'zaid'],
    ARRAY['loamy', 'sandy_loam', 'black_cotton', 'alluvial'],
    'Medium (500-700 mm)',
    '{"temperature_range_c": [18, 35], "optimum_ph": [6.0, 7.5], "humidity_percent": [55, 75]}'::jsonb
  ),
  (
    'c6666666-6666-6666-6666-666666666666',
    'Bengal Gram (Chickpea)',
    'Cicer arietinum',
    'Pulses',
    'Major winter pulse in Prakasam, Kurnool, and Telangana. Excellent nitrogen-fixing crop for residual moisture.',
    100,
    ARRAY['rabi'],
    ARRAY['black_cotton', 'clay_loam', 'loamy'],
    'Low (250-400 mm)',
    '{"temperature_range_c": [15, 28], "optimum_ph": [6.5, 7.8], "humidity_percent": [40, 60]}'::jsonb
  ),
  (
    'c7777777-7777-7777-7777-777777777777',
    'Tomato',
    'Solanum lycopersicum',
    'Horticultural Crops',
    'Widely grown in Chittoor (Madanapalle), Rangareddy. Continuous harvest crop susceptible to late blight and whiteflies.',
    120,
    ARRAY['kharif', 'rabi', 'zaid'],
    ARRAY['sandy_loam', 'red_soil', 'loamy'],
    'Medium (500-650 mm)',
    '{"temperature_range_c": [18, 30], "optimum_ph": [6.0, 7.0], "humidity_percent": [55, 70]}'::jsonb
  ),
  (
    'c8888888-8888-8888-8888-888888888888',
    'Red Gram (Pigeonpea)',
    'Cajanus cajan',
    'Pulses',
    'Essential pulse often intercropped with cotton or groundnut. Deep taproot system withstands dry spells.',
    170,
    ARRAY['kharif'],
    ARRAY['black_cotton', 'red_soil', 'loamy'],
    'Low to Medium (400-550 mm)',
    '{"temperature_range_c": [20, 35], "optimum_ph": [6.5, 7.5], "humidity_percent": [50, 70]}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

-- 3. CROP VARIETIES
INSERT INTO public.crop_varieties (crop_id, variety_name, variety_code, maturity_days, suitable_regions, recommended_seasons, characteristics)
VALUES
  ('c1111111-1111-1111-1111-111111111111', 'BPT 5204 (Samba Mahsuri)', 'BPT-5204', 145, ARRAY['Andhra Pradesh', 'Telangana'], ARRAY['kharif'], '{"cooking_quality": "Superfine", "blast_resistance": "Moderate"}'::jsonb),
  ('c1111111-1111-1111-1111-111111111111', 'MTU 1010 (Cottondora Sannalu)', 'MTU-1010', 120, ARRAY['Andhra Pradesh', 'Telangana'], ARRAY['rabi', 'kharif'], '{"grain_type": "Short slender", "salinity_tolerance": "Good"}'::jsonb),
  ('c1111111-1111-1111-1111-111111111111', 'KNM 118', 'KNM-118', 125, ARRAY['Telangana'], ARRAY['rabi'], '{"grain_type": "Medium slender", "yield_potential": "High"}'::jsonb),
  ('c2222222-2222-2222-2222-222222222222', 'RCH 659 BG-II', 'RCH-659', 160, ARRAY['Telangana', 'Andhra Pradesh'], ARRAY['kharif'], '{"bollworm_resistance": "Bollgard II", "boll_size": "Large"}'::jsonb),
  ('c3333333-3333-3333-3333-333333333333', 'Guntur Hope (LCA 625)', 'LCA-625', 140, ARRAY['Guntur', 'Khammam'], ARRAY['kharif'], '{"pungency": "High", "virus_tolerance": "Tolerant"}'::jsonb),
  ('c4444444-4444-4444-4444-444444444444', 'Kadiri 6 (K-6)', 'K-6', 105, ARRAY['Anantapur', 'Chittoor'], ARRAY['kharif', 'rabi'], '{"drought_tolerance": "High", "shelling_outturn": "73%"}'::jsonb),
  ('c5555555-5555-5555-5555-555555555555', 'DHM 121 (Telangana Maize)', 'DHM-121', 100, ARRAY['Telangana'], ARRAY['kharif', 'rabi'], '{"yield_potential": "7.5-8.5 t/ha", "stay_green": "Excellent"}'::jsonb),
  ('c6666666-6666-6666-6666-666666666666', 'JG 11', 'JG-11', 95, ARRAY['Andhra Pradesh', 'Telangana'], ARRAY['rabi'], '{"wilt_resistance": "Resistant", "seed_type": "Desi"}'::jsonb)
ON CONFLICT DO NOTHING;

-- 4. KNOWLEDGE BASE CULTIVATION DOCUMENTS
INSERT INTO public.knowledge_documents (source_id, title, crop_id, category, region, language, content)
VALUES
  (
    'a2222222-2222-2222-2222-222222222222',
    'ANGRAU Scientific Nutrient Management for Rice (Paddy)',
    'c1111111-1111-1111-1111-111111111111',
    'Fertilizer Management',
    'Andhra Pradesh',
    'en',
    'For semi-dwarf rice varieties in black clay soils, recommended N:P:K is 120:60:40 kg/ha. Apply entire P2O5 as Single Super Phosphate (SSP) or DAP and 1/3rd K2O basally. Apply Nitrogen in 3 equal splits: basal, maximum tillering (21-25 DAT), and panicle initiation (40-45 DAT). Zinc deficiency is common in submerged soils; apply Zinc Sulphate @ 50 kg/ha once every 3 seasons.'
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    'PJTSAU Cotton Integrated Pest Management (IPM)',
    'c2222222-2222-2222-2222-222222222222',
    'Pest Management',
    'Telangana',
    'en',
    'For sucking pests (aphids, jassids, thrips), install yellow/blue sticky traps @ 10-15 per acre. Spray Neem Seed Kernel Extract (NSKE 5%) or Neem oil 1500 ppm @ 5 ml/L at early vegetative stage. For Pink Bollworm monitoring, erect pheromone traps @ 4 per acre from 45 DAS. Chemical intervention threshold: 8 moths/trap/night for 3 consecutive days or 10% damaged green bolls.'
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    'Chilli Thrips and Mite Management in Guntur Region',
    'c3333333-3333-3333-3333-333333333333',
    'Disease & Pest Management',
    'Andhra Pradesh',
    'en',
    'Chilli leaf curl caused by Scirtothrips dorsalis exhibits upward leaf curling; yellow mite (Polyphagotarsonemus latus) causes downward leaf curling with bronzing. Grow barrier crops of 3 rows of Maize or Sorghum around chilli plot. Spray Diafenthiuron 50% WP @ 1.25 g/L or Spiromesifen 22.9% SC @ 1 ml/L. Strictly observe 7-day Pre-Harvest Interval (PHI).'
  )
ON CONFLICT DO NOTHING;


import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

// Fallback in-memory catalog for development or offline testing
let inMemoryFarmerCrops = [
  {
    id: 'fc-1',
    farmer_id: 'f1111111-1111-1111-1111-111111111111',
    crop_id: 'c1111111-1111-1111-1111-111111111111',
    crop_name: 'Rice (Paddy)',
    variety_name: 'BPT 5204 (Samba Mahsuri)',
    season: 'kharif',
    sowing_date: '2026-07-15',
    expected_harvest_date: '2026-11-25',
    current_growth_stage: 'grain_filling',
    area: 2.5,
    status: 'active',
    notes: 'Transplanted after thorough puddling with green manure incorporation.'
  },
  {
    id: 'fc-2',
    farmer_id: 'f1111111-1111-1111-1111-111111111111',
    crop_id: 'c3333333-3333-3333-3333-333333333333',
    crop_name: 'Chilli (Mirchi)',
    variety_name: 'Guntur Hope (LCA 625)',
    season: 'kharif',
    sowing_date: '2026-08-10',
    expected_harvest_date: '2027-01-15',
    current_growth_stage: 'flowering',
    area: 1.0,
    status: 'active',
    notes: 'Raised bed drip irrigation with silver-black mulch.'
  }
];

const MASTER_CROPS = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Rice (Paddy)',
    scientific_name: 'Oryza sativa',
    category: 'Cereals and Millets',
    description: 'Major staple grain of South India; requires flooded or controlled irrigation.',
    crop_duration_days: 130,
    suitable_seasons: ['kharif', 'rabi'],
    suitable_soil_types: ['clay', 'clay_loam', 'alluvial', 'black_cotton'],
    water_requirement: 'High (1200-1400 mm)'
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    name: 'Cotton',
    scientific_name: 'Gossypium hirsutum',
    category: 'Commercial Crops',
    description: 'Premier fiber crop in black soil tracts; highly vulnerable to bollworms.',
    crop_duration_days: 165,
    suitable_seasons: ['kharif'],
    suitable_soil_types: ['black_cotton', 'clay_loam', 'alluvial'],
    water_requirement: 'Medium (600-800 mm)'
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Chilli (Mirchi)',
    scientific_name: 'Capsicum annuum',
    category: 'Horticultural Crops',
    description: 'Key commercial spice crop; requires well drained loam/red soil.',
    crop_duration_days: 150,
    suitable_seasons: ['kharif', 'rabi'],
    suitable_soil_types: ['black_cotton', 'red_soil', 'loamy'],
    water_requirement: 'Medium (600-750 mm)'
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    name: 'Groundnut (Peanut)',
    scientific_name: 'Arachis hypogaea',
    category: 'Oilseeds',
    description: 'Important oilseed requiring sandy loam or red soil for pod pegging.',
    crop_duration_days: 110,
    suitable_seasons: ['kharif', 'rabi'],
    suitable_soil_types: ['sandy_loam', 'red_soil', 'loamy'],
    water_requirement: 'Medium (450-600 mm)'
  },
  {
    id: 'c5555555-5555-5555-5555-555555555555',
    name: 'Maize (Corn)',
    scientific_name: 'Zea mays',
    category: 'Cereals and Millets',
    description: 'High-yielding cereal grown across all seasons with excellent silage and grain yield.',
    crop_duration_days: 105,
    suitable_seasons: ['kharif', 'rabi', 'zaid'],
    suitable_soil_types: ['loamy', 'sandy_loam', 'black_cotton', 'alluvial'],
    water_requirement: 'Medium (500-700 mm)'
  },
  {
    id: 'c6666666-6666-6666-6666-666666666666',
    name: 'Bengal Gram (Chickpea)',
    scientific_name: 'Cicer arietinum',
    category: 'Pulses',
    description: 'Rabi season pulse that thrives on residual soil moisture in black soils.',
    crop_duration_days: 100,
    suitable_seasons: ['rabi'],
    suitable_soil_types: ['black_cotton', 'clay_loam', 'loamy'],
    water_requirement: 'Low (250-400 mm)'
  },
  {
    id: 'c7777777-7777-7777-7777-777777777777',
    name: 'Tomato',
    scientific_name: 'Solanum lycopersicum',
    category: 'Horticultural Crops',
    description: 'High value vegetable crop with continuous harvesting cycle.',
    crop_duration_days: 120,
    suitable_seasons: ['kharif', 'rabi', 'zaid'],
    suitable_soil_types: ['sandy_loam', 'red_soil', 'loamy'],
    water_requirement: 'Medium (500-650 mm)'
  }
];

export class CropService {
  static async getAllCrops() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseAdmin
          .from('crops')
          .select('*')
          .eq('is_active', true)
          .order('name');
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('DB error fetching crops, using master list:', err.message);
      }
    }
    return MASTER_CROPS;
  }

  static async getCropById(cropId) {
    if (isSupabaseConfigured()) {
      const { data } = await supabaseAdmin.from('crops').select('*').eq('id', cropId).single();
      if (data) return data;
    }
    return MASTER_CROPS.find(c => c.id === cropId) || null;
  }

  static async getFarmerCrops(farmerId) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabaseAdmin
          .from('farmer_crops')
          .select('*, crops(name, scientific_name, category)')
          .eq('farmer_id', farmerId)
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('DB error fetching farmer crops:', err.message);
      }
    }
    return inMemoryFarmerCrops.filter(fc => fc.farmer_id === farmerId);
  }

  static async registerFarmerCrop(farmerId, payload) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('farmer_crops')
        .insert({
          farmer_id: farmerId,
          crop_id: payload.cropId,
          variety_id: payload.varietyId || null,
          season: payload.season,
          sowing_date: payload.sowingDate,
          expected_harvest_date: payload.expectedHarvestDate || null,
          current_growth_stage: payload.currentGrowthStage || 'sowing',
          area: payload.area,
          notes: payload.notes || ''
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    }

    const matchedCrop = MASTER_CROPS.find(c => c.id === payload.cropId);
    const newCrop = {
      id: `fc-${Date.now()}`,
      farmer_id: farmerId,
      crop_id: payload.cropId,
      crop_name: matchedCrop ? matchedCrop.name : 'Registered Crop',
      variety_name: payload.varietyName || 'Local Selection',
      season: payload.season,
      sowing_date: payload.sowingDate,
      expected_harvest_date: payload.expectedHarvestDate || '',
      current_growth_stage: payload.currentGrowthStage || 'sowing',
      area: payload.area,
      status: 'active',
      notes: payload.notes || ''
    };
    inMemoryFarmerCrops.unshift(newCrop);
    return newCrop;
  }

  static async updateFarmerCropStage(farmerId, cropRecordId, growthStage) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('farmer_crops')
        .update({ current_growth_stage: growthStage })
        .eq('id', cropRecordId)
        .eq('farmer_id', farmerId)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    }

    const index = inMemoryFarmerCrops.findIndex(c => c.id === cropRecordId && c.farmer_id === farmerId);
    if (index !== -1) {
      inMemoryFarmerCrops[index].current_growth_stage = growthStage;
      return inMemoryFarmerCrops[index];
    }
    throw new Error('Crop record not found');
  }
}


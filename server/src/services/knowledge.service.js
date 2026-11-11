import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

// Fallback verified in-memory agricultural knowledge base (ICAR / ANGRAU / PJTSAU)
const FALLBACK_KNOWLEDGE_DOCUMENTS = [
  {
    id: 'k1',
    title: 'ANGRAU Package of Practices: Paddy (Rice) Nutrient Management',
    crop_name: 'Rice (Paddy)',
    category: 'Fertilizer Management',
    region: 'Andhra Pradesh',
    content: 'For semi-dwarf high yielding rice varieties in black clay soils, recommended N:P:K is 120:60:40 kg/ha. Apply entire P2O5 as Single Super Phosphate (SSP) or DAP and 1/3rd K2O basally. Apply Nitrogen in 3 equal splits: basal, maximum tillering (21-25 DAT), and panicle initiation (40-45 DAT). Zinc deficiency is common in submerged soils; apply Zinc Sulphate @ 50 kg/ha once every 3 seasons.'
  },
  {
    id: 'k2',
    title: 'PJTSAU Cotton Integrated Pest Management (IPM)',
    crop_name: 'Cotton',
    category: 'Pest Management',
    region: 'Telangana',
    content: 'For sucking pests (aphids, jassids, thrips), install yellow/blue sticky traps @ 10-15 per acre. Spray Neem Seed Kernel Extract (NSKE 5%) or Neem oil 1500 ppm @ 5 ml/L at early vegetative stage. For Pink Bollworm monitoring, erect pheromone traps @ 4 per acre from 45 DAS. Chemical intervention threshold: 8 moths/trap/night for 3 consecutive days or 10% damaged green bolls.'
  },
  {
    id: 'k3',
    title: 'Chilli Thrips and Mite Management in Guntur/Warangal Belts',
    crop_name: 'Chilli (Mirchi)',
    category: 'Disease & Pest Management',
    region: 'Andhra Pradesh / Telangana',
    content: 'Chilli leaf curl caused by Scirtothrips dorsalis exhibits upward leaf curling; yellow mite causes downward curling with bronzing. Grow barrier crops of 3 rows of Maize or Sorghum around chilli plot. Spray Diafenthiuron 50% WP @ 1.25 g/L or Spiromesifen 22.9% SC @ 1 ml/L. Strictly observe 7-day Pre-Harvest Interval (PHI).'
  },
  {
    id: 'k4',
    title: 'Groundnut Gypsum Application and Pegging Stage Care',
    crop_name: 'Groundnut (Peanut)',
    category: 'Nutrient & Water Management',
    region: 'Rayalaseema / Mahbubnagar',
    content: 'Apply Gypsum @ 200 kg/acre at 40-45 days after sowing (flowering/pegging initiation) around the root zone. Calcium is essential for pod development and reducing "pops" (empty shells), while Sulfur increases oil content.'
  },
  {
    id: 'k5',
    title: 'Tomato Early and Late Blight Management (ICAR-IIHR)',
    crop_name: 'Tomato',
    category: 'Crop Disease',
    region: 'South India',
    content: 'Early blight (Alternaria solani) shows concentric target-board rings on lower leaves; Late blight (Phytophthora infestans) shows water-soaked lesions under high humidity. Ensure wide spacing (60x45cm) for air movement. Preventative spray: Mancozeb 75% WP @ 2g/L. Curative spray during severe outbreaks: Cymoxanil 8% + Mancozeb 64% WP @ 2g/L.'
  }
];

export class KnowledgeService {
  /**
   * Retrieves relevant knowledge documents matching crop, category, or keywords.
   */
  static async searchKnowledge({ cropName, category, region, query }) {
    if (isSupabaseConfigured()) {
      try {
        let dbQuery = supabaseAdmin
          .from('knowledge_documents')
          .select('*, crops(name), agricultural_sources(source_name, organization)')
          .eq('is_verified', true);

        if (category) {
          dbQuery = dbQuery.ilike('category', `%${category}%`);
        }
        if (region) {
          dbQuery = dbQuery.ilike('region', `%${region}%`);
        }

        const { data, error } = await dbQuery.limit(5);
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Knowledge DB query failed, falling back to verified memory repository:', err.message);
      }
    }

    // Filter in-memory verified documents
    return FALLBACK_KNOWLEDGE_DOCUMENTS.filter(doc => {
      if (cropName && !doc.crop_name.toLowerCase().includes(cropName.toLowerCase())) {
        return false;
      }
      if (category && !doc.category.toLowerCase().includes(category.toLowerCase())) {
        return false;
      }
      return true;
    });
  }

  static async getAllSources() {
    if (isSupabaseConfigured()) {
      const { data } = await supabaseAdmin.from('agricultural_sources').select('*');
      if (data && data.length > 0) return data;
    }
    return [
      {
        id: 's1',
        source_name: 'ICAR Package of Practices',
        organization: 'Indian Council of Agricultural Research',
        region: 'All India',
        reliability_level: 'high'
      },
      {
        id: 's2',
        source_name: 'ANGRAU Crop Production Guide',
        organization: 'Acharya N.G. Ranga Agricultural University',
        region: 'Andhra Pradesh',
        reliability_level: 'high'
      },
      {
        id: 's3',
        source_name: 'PJTSAU Vyavasaya Panchangam',
        organization: 'Professor Jayashankar Telangana State Agricultural University',
        region: 'Telangana',
        reliability_level: 'high'
      }
    ];
  }
}


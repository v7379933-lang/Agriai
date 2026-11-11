const CULTIVATION_GUIDES = [
  {
    slug: 'rice-paddy',
    crop_name: 'Rice (Paddy)',
    scientific_name: 'Oryza sativa',
    category: 'Cereals and Millets',
    duration_days: 130,
    sections: {
      introduction: 'Rice is the primary cereal crop of Andhra Pradesh and Telangana, predominantly grown in delta and canal ayacut areas.',
      suitable_climate: 'Warm and humid climate with temperatures between 21°C and 37°C. High solar radiation during grain filling enhances yield.',
      suitable_soil: 'Heavy clay, clay loam, and black cotton soils with slow drainage to hold standing water.',
      recommended_varieties: ['BPT 5204 (Samba Mahsuri)', 'MTU 1010', 'KNM 118', 'RGL 2537'],
      sowing_season: 'Kharif: June 15 - July 15; Rabi: November 15 - December 15',
      seed_selection: 'Use certified foundation seed with > 80% germination percentage. Eliminate chaffy grains via salt water test (10% brine).',
      seed_treatment: 'Treat seeds with Carbendazim 50% WP @ 2g/kg seed or Pseudomonas fluorescens @ 10g/kg seed.',
      land_preparation: 'Plough field 2-3 times dry, then puddle thoroughly twice with standing water to destroy weed seeds and create impervious hard pan.',
      sowing_method: 'Transplanting 25-30 day old nursery seedlings @ 2-3 seedlings per hill at 2-3 cm depth.',
      seed_rate: '20-25 kg/acre for transplanting; 12-15 kg/acre for drum seeder / Direct Seeded Rice (DSR).',
      spacing: '20 cm x 15 cm for Kharif; 15 cm x 15 cm for Rabi.',
      fertilizer_management: 'Recommended N:P:K is 50:24:16 kg/acre. Apply all P2O5 and 50% K2O basally. Apply Nitrogen in 3 splits (basal, tillering, panicle initiation).',
      irrigation_management: 'Maintain 2 cm standing water during early tillering, increase to 5 cm during panicle initiation to flowering. Drain field 10 days before harvest.',
      weed_management: 'Pre-emergence spray of Pretilachlor 50% EC @ 500 ml/acre within 3 days of transplanting.',
      pest_management: 'Install pheromone traps for Yellow Stem Borer @ 4/acre. Spray Cartap Hydrochloride 50% SP @ 2g/L if ETL crossed.',
      disease_management: 'For blast, spray Tricyclazole 75% WP @ 0.6g/L; for sheath blight, spray Hexaconazole 5% EC @ 2ml/L.',
      harvesting: 'Harvest when 80-85% of grains in the panicle turn golden straw yellow and grain moisture is around 20%.',
      post_harvest: 'Thresh cleanly and dry grain under shade or gentle sun to bring moisture down to 12-14% for storage.'
    }
  },
  {
    slug: 'cotton',
    crop_name: 'Cotton',
    scientific_name: 'Gossypium hirsutum',
    category: 'Commercial Crops',
    duration_days: 165,
    sections: {
      introduction: 'Cotton (White Gold) is the prime commercial cash crop in Telangana (Adilabad, Warangal, Khammam) and Rayalaseema.',
      suitable_climate: 'Tropical to subtropical. Requires minimum 180 frost-free days with warm days and cool nights during boll development.',
      suitable_soil: 'Deep black cotton soils (Vertisols) with high water retention capacity and pH 6.5 to 8.0.',
      recommended_varieties: ['RCH 659 BG-II', 'Mallika BG-II', 'First Class BG-II'],
      sowing_season: 'Kharif: With onset of monsoon (June 15 - July 15).',
      seed_selection: 'Use certified BG-II hybrid seeds with non-Bt refuge seeds packed together.',
      seed_treatment: 'Treat with Imidacloprid 70% WS @ 5g/kg seed for protection against early sucking pests.',
      land_preparation: 'Deep summer ploughing followed by 2 harrowings. Form ridges and furrows at 90 cm intervals.',
      sowing_method: 'Dibbling 1 seed per hill on side of ridge at 3-5 cm depth.',
      seed_rate: '1.5 - 2.0 kg per acre.',
      spacing: '90 cm x 60 cm in light soils; 120 cm x 60 cm in deep black soils.',
      fertilizer_management: 'Recommended N:P:K is 60:30:30 kg/acre. Apply all P2O5 basally; split Nitrogen and Potash in 3 doses at 30, 60, and 90 DAS.',
      irrigation_management: 'Critical stages are square formation, flowering, and boll development. Avoid water stagnation.',
      weed_management: 'Pre-emergence Pendimethalin 30% EC @ 1.3 L/acre within 48 hours of sowing. Hand hoeing at 20 and 45 DAS.',
      pest_management: 'Install 4 pheromone traps/acre from 45 DAS for Pink Bollworm monitoring. Spray Emamectin Benzoate 5% SG @ 0.5g/L if required.',
      disease_management: 'For Bacterial leaf blight, spray Copper Oxychloride 50% WP @ 3g/L + Streptocycline @ 0.1g/L.',
      harvesting: 'Pick mature, fully opened clean dry bolls in morning hours. Do not pick stained or trash-mixed bolls.',
      post_harvest: 'Dry picked seed cotton on clean tarpaulins to reduce moisture below 8% before selling in market.'
    }
  },
  {
    slug: 'chilli-mirchi',
    crop_name: 'Chilli (Mirchi)',
    scientific_name: 'Capsicum annuum',
    category: 'Horticultural Crops',
    duration_days: 150,
    sections: {
      introduction: 'Chilli is a premier spice crop with major trading hubs in Guntur and Warangal.',
      suitable_climate: 'Warm and dry climate during fruit ripening. Optimum temperature is 20°C to 30°C.',
      suitable_soil: 'Well-drained black cotton, red loamy, or alluvial soils with pH 6.5 to 7.5.',
      recommended_varieties: ['Guntur Hope (LCA 625)', 'LCA 334', 'Teja', 'Indam 5'],
      sowing_season: 'Nursery sowing: July; Field transplanting: August - September.',
      seed_selection: 'High-purity hybrid seeds treated against seed-borne damping off.',
      seed_treatment: 'Thiram @ 3g/kg or Trichoderma viride @ 4g/kg seed.',
      land_preparation: 'Incorporate 10 tonnes of FYM per acre. Prepare raised beds with drip irrigation and plastic mulch.',
      sowing_method: 'Transplant 35-40 day old healthy sturdy nursery seedlings in evening hours.',
      seed_rate: '200 - 250 grams per acre for hybrids.',
      spacing: '60 cm between rows and 45 cm between plants on raised beds.',
      fertilizer_management: 'Apply 120:60:60 kg NPK per acre via fertigation schedule across vegetative and fruit picking stages.',
      irrigation_management: 'Drip irrigation at 2-3 day intervals based on tensiometer readings. Never flood raised beds.',
      weed_management: 'Silver-black reflective mulch (25 micron) suppresses weeds and repels vector thrips.',
      pest_management: 'Install blue sticky traps for Thrips. Spray Spinetoram 11.7% SC @ 1 ml/L or Diafenthiuron @ 1.25 g/L.',
      disease_management: 'For Anthracnose fruit rot (die-back), spray Azoxystrobin 23% SC @ 1 ml/L.',
      harvesting: 'Pick ripe deep red pods when firm for dry chilli; harvest at 10-15 day intervals.',
      post_harvest: 'Sun-dry on elevated cemented drying floors or poly-houses until pods rattle and moisture drops to 10%.'
    }
  }
];

export class GuideController {
  static async getGuides(req, res, next) {
    try {
      const { search, category } = req.query;
      let list = CULTIVATION_GUIDES;

      if (category) {
        list = list.filter(g => g.category.toLowerCase().includes(category.toLowerCase()));
      }
      if (search) {
        list = list.filter(g => 
          g.crop_name.toLowerCase().includes(search.toLowerCase()) || 
          g.slug.includes(search.toLowerCase())
        );
      }

      res.status(200).json({ success: true, data: list });
    } catch (err) {
      next(err);
    }
  }

  static async getGuideBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const guide = CULTIVATION_GUIDES.find(g => g.slug === slug);
      if (!guide) {
        return res.status(404).json({ success: false, message: 'Cultivation guide not found' });
      }
      res.status(200).json({ success: true, data: guide });
    } catch (err) {
      next(err);
    }
  }
}


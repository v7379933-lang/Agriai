import { z } from 'zod';

export const CropRecommendationInputSchema = z.object({
  cropCategory: z.string().optional(),
  state: z.string().default('Andhra Pradesh'),
  district: z.string().min(2, 'District is required'),
  mandal: z.string().optional().default(''),
  village: z.string().optional().default(''),
  season: z.enum(['kharif', 'rabi', 'zaid', 'perennial']).default('kharif'),
  soilType: z.enum([
    'sandy', 'sandy_loam', 'loamy', 'clay', 'clay_loam', 
    'silty', 'black_cotton', 'red_soil', 'alluvial', 'laterite'
  ]),
  soilPh: z.number().min(3.0).max(11.0).optional().nullable(),
  nitrogenLevel: z.enum(['low', 'medium', 'high']).optional().nullable(),
  phosphorusLevel: z.enum(['low', 'medium', 'high']).optional().nullable(),
  potassiumLevel: z.enum(['low', 'medium', 'high']).optional().nullable(),
  landArea: z.number().positive(),
  landUnit: z.enum(['acre', 'hectare', 'gunta']).default('acre'),
  irrigationAvailability: z.enum(['assured', 'partial', 'rainfed']),
  irrigationType: z.enum(['drip', 'sprinkler', 'flood', 'furrow', 'borewell', 'canal', 'rainfed']).optional(),
  previousCrop: z.string().optional().default(''),
  farmingObjective: z.enum(['maximum_yield', 'low_water_cost', 'soil_regeneration', 'high_market_value']).default('maximum_yield'),
  additionalNotes: z.string().max(500).optional().default('')
});

export const CropRecommendationOutputSchema = z.object({
  analysis_summary: z.string(),
  input_assessment: z.object({
    location: z.string(),
    soil_suitability: z.string(),
    season_suitability: z.string(),
    water_availability: z.string(),
    missing_information: z.array(z.string())
  }),
  recommendations: z.array(
    z.object({
      crop_name: z.string(),
      scientific_name: z.string().nullable().optional(),
      suitability_score: z.number().min(0).max(100),
      suitability_level: z.enum(['high', 'medium', 'low', 'insufficient_data']),
      recommended_season: z.string(),
      duration_days: z.number(),
      soil_compatibility: z.string(),
      water_requirement: z.string(),
      advantages: z.array(z.string()),
      risks: z.array(z.string()),
      cultivation_notes: z.array(z.string()),
      reason: z.string()
    })
  ),
  general_recommendations: z.array(z.string()),
  confidence: z.enum(['high', 'medium', 'low']),
  requires_expert_review: z.boolean(),
  source_references: z.array(
    z.object({
      title: z.string(),
      organization: z.string(),
      url: z.string().nullable().optional()
    })
  )
});


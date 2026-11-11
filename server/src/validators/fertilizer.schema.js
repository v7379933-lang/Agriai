import { z } from 'zod';

export const FertilizerInputSchema = z.object({
  cropName: z.string().min(2),
  cropVariety: z.string().optional().default(''),
  growthStage: z.enum([
    'land_preparation', 'sowing', 'germination', 'seedling', 
    'vegetative', 'flowering', 'fruiting', 'grain_filling', 'maturity', 'harvesting'
  ]),
  landArea: z.number().positive(),
  landUnit: z.enum(['acre', 'hectare', 'gunta']).default('acre'),
  soilType: z.enum([
    'sandy', 'sandy_loam', 'loamy', 'clay', 'clay_loam', 
    'silty', 'black_cotton', 'red_soil', 'alluvial', 'laterite'
  ]),
  soilPh: z.number().min(3.0).max(11.0).optional().nullable(),
  nitrogenLevel: z.enum(['low', 'medium', 'high']).default('medium'),
  phosphorusLevel: z.enum(['low', 'medium', 'high']).default('medium'),
  potassiumLevel: z.enum(['low', 'medium', 'high']).default('medium'),
  observedSymptoms: z.array(z.string()).optional().default([]),
  previousFertilizers: z.string().optional().default(''),
  irrigationMethod: z.enum(['drip', 'sprinkler', 'flood', 'furrow', 'borewell', 'canal', 'rainfed']).default('borewell')
});

export const FertilizerOutputSchema = z.object({
  summary: z.string(),
  soil_assessment: z.object({
    soil_ph: z.number().nullable().optional(),
    nutrient_status: z.object({
      nitrogen: z.string(),
      phosphorus: z.string(),
      potassium: z.string()
    })
  }),
  recommendations: z.array(
    z.object({
      nutrient: z.string(),
      fertilizer_name: z.string(),
      quantity: z.number(),
      unit: z.string(),
      application_method: z.string(),
      application_timing: z.string(),
      reason: z.string()
    })
  ),
  missing_information: z.array(z.string()),
  precautions: z.array(z.string()),
  confidence: z.enum(['high', 'medium', 'low']),
  requires_expert_review: z.boolean(),
  source_references: z.array(z.any()).optional().default([])
});


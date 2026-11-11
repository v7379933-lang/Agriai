import { z } from 'zod';

export const IrrigationInputSchema = z.object({
  cropName: z.string().min(2),
  growthStage: z.enum([
    'land_preparation', 'sowing', 'germination', 'seedling', 
    'vegetative', 'flowering', 'fruiting', 'grain_filling', 'maturity', 'harvesting'
  ]),
  soilType: z.enum([
    'sandy', 'sandy_loam', 'loamy', 'clay', 'clay_loam', 
    'silty', 'black_cotton', 'red_soil', 'alluvial', 'laterite'
  ]),
  irrigationMethod: z.enum(['drip', 'sprinkler', 'flood', 'furrow', 'borewell', 'canal', 'rainfed']),
  waterAvailability: z.enum(['surplus', 'adequate', 'scarce', 'critical']).default('adequate'),
  lastIrrigationDaysAgo: z.number().int().min(0).max(60).default(3),
  recentRainfallMm: z.number().min(0).default(0),
  temperatureC: z.number().optional().default(30),
  fieldObservations: z.string().max(300).optional().default('')
});

export const IrrigationOutputSchema = z.object({
  summary: z.string(),
  crop_context: z.object({
    crop_name: z.string(),
    growth_stage: z.string()
  }),
  irrigation_assessment: z.object({
    water_stress_risk: z.enum(['low', 'medium', 'high', 'unknown']),
    waterlogging_risk: z.enum(['low', 'medium', 'high', 'unknown']),
    soil_considerations: z.array(z.string())
  }),
  recommendations: z.array(
    z.object({
      action: z.string(),
      timing: z.string(),
      quantity: z.number().nullable().optional(),
      unit: z.string().nullable().optional(),
      reason: z.string()
    })
  ),
  weather_considerations: z.array(z.string()),
  precautions: z.array(z.string()),
  confidence: z.enum(['high', 'medium', 'low']),
  source_references: z.array(z.any()).optional().default([])
});


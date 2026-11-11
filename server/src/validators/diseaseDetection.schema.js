import { z } from 'zod';

export const DiseaseDetectionInputSchema = z.object({
  cropName: z.string().min(2, 'Crop name is required'),
  cropVariety: z.string().optional().default(''),
  growthStage: z.enum([
    'land_preparation', 'sowing', 'germination', 'seedling', 
    'vegetative', 'flowering', 'fruiting', 'grain_filling', 'maturity', 'harvesting'
  ]),
  affectedPlantPart: z.enum(['leaf', 'stem', 'root', 'fruit', 'flower', 'whole_plant']),
  observedSymptoms: z.array(z.string()).min(1, 'Select at least one observed symptom'),
  symptomOnsetDays: z.number().int().min(1).max(120).default(3),
  affectedAreaPercentage: z.number().min(1).max(100).default(10),
  recentWeather: z.string().optional().default('Normal'),
  recentChemicalApplication: z.string().optional().default('None')
});

export const DiseaseDetectionOutputSchema = z.object({
  crop_identification: z.object({
    crop_name: z.string(),
    confidence: z.enum(['high', 'medium', 'low'])
  }),
  observations: z.array(z.string()),
  possible_diagnoses: z.array(
    z.object({
      name: z.string(),
      type: z.enum(['disease', 'pest', 'nutrient_deficiency', 'environmental_stress', 'unknown']),
      likelihood: z.enum(['high', 'medium', 'low']),
      supporting_symptoms: z.array(z.string()),
      alternative_explanations: z.array(z.string())
    })
  ),
  additional_information_needed: z.array(z.string()),
  recommended_next_steps: z.array(z.string()),
  management_recommendations: z.array(
    z.object({
      action: z.string(),
      timing: z.string(),
      precautions: z.array(z.string())
    })
  ),
  chemical_management: z.object({
    recommended: z.boolean(),
    details: z.string().nullable().optional(),
    requires_label_verification: z.boolean()
  }),
  requires_expert_review: z.boolean(),
  confidence: z.enum(['high', 'medium', 'low']),
  disclaimer: z.string()
});


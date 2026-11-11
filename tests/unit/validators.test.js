import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { ProfileUpdateSchema } from '../../server/src/validators/profile.schema.js';
import {
  CropRecommendationInputSchema,
  CropRecommendationOutputSchema
} from '../../server/src/validators/cropRecommendation.schema.js';
import {
  DiseaseDetectionInputSchema,
  DiseaseDetectionOutputSchema
} from '../../server/src/validators/diseaseDetection.schema.js';
import {
  FertilizerInputSchema,
  FertilizerOutputSchema
} from '../../server/src/validators/fertilizer.schema.js';
import {
  IrrigationInputSchema,
  IrrigationOutputSchema
} from '../../server/src/validators/irrigation.schema.js';
import {
  ChatMessageInputSchema,
  ChatMessageOutputSchema
} from '../../server/src/validators/chat.schema.js';

describe('Validator Unit Tests', () => {
  describe('ProfileUpdateSchema', () => {
    it('should validate a correct farmer profile', () => {
      const validProfile = {
        fullName: 'Venkat Rao',
        phone: '9848012345',
        state: 'Andhra Pradesh',
        district: 'Guntur',
        mandal: 'Tenali',
        village: 'Angalakuduru',
        pincode: '522211',
        preferredLanguage: 'te',
        landArea: 4.5,
        landUnit: 'acre',
        soilType: 'black_cotton',
        irrigationType: 'borewell',
        farmingExperience: 15
      };

      const result = ProfileUpdateSchema.safeParse(validProfile);
      assert.equal(result.success, true);
    });

    it('should reject invalid mobile number or negative land area', () => {
      const invalidProfile = {
        fullName: 'V', // too short (< 2)
        phone: '12345', // invalid phone
        district: 'Guntur',
        mandal: 'Tenali',
        village: 'Village',
        landArea: -2, // negative area
        soilType: 'unknown_soil', // invalid enum
        irrigationType: 'borewell'
      };

      const result = ProfileUpdateSchema.safeParse(invalidProfile);
      assert.equal(result.success, false);
      assert.ok(result.error.errors.length >= 3);
    });
  });

  describe('CropRecommendationSchemas', () => {
    it('should validate crop recommendation input within biological bounds', () => {
      const input = {
        district: 'Warangal',
        state: 'Telangana',
        season: 'kharif',
        soilType: 'red_soil',
        soilPh: 6.5,
        landArea: 2.0,
        irrigationAvailability: 'assured',
        farmingObjective: 'maximum_yield'
      };

      const parsed = CropRecommendationInputSchema.safeParse(input);
      assert.equal(parsed.success, true);
      assert.equal(parsed.data.season, 'kharif');
    });

    it('should validate structured crop recommendation output', () => {
      const output = {
        analysis_summary: 'Soil and seasonal factors align with cotton and red gram.',
        input_assessment: {
          location: 'Warangal, Telangana',
          soil_suitability: 'Red chalka soil provides adequate drainage.',
          season_suitability: 'Kharif monsoon matches vegetative duration.',
          water_availability: 'Assured borewell irrigation available.',
          missing_information: []
        },
        recommendations: [
          {
            crop_name: 'Cotton',
            scientific_name: 'Gossypium hirsutum',
            suitability_score: 90,
            suitability_level: 'high',
            recommended_season: 'Kharif',
            duration_days: 160,
            soil_compatibility: 'Optimal',
            water_requirement: 'Medium',
            advantages: ['High market demand'],
            risks: ['Pink bollworm'],
            cultivation_notes: ['90x60cm spacing'],
            reason: 'High yield potential in district'
          }
        ],
        general_recommendations: ['Treat seeds with Trichoderma'],
        confidence: 'high',
        requires_expert_review: false,
        source_references: [
          {
            title: 'PJTSAU Crop Guide',
            organization: 'PJTSAU',
            url: 'https://pjtsau.edu.in'
          }
        ]
      };

      const result = CropRecommendationOutputSchema.safeParse(output);
      assert.equal(result.success, true);
    });
  });

  describe('DiseaseDetectionSchemas', () => {
    it('should validate disease scan payload', () => {
      const input = {
        cropName: 'Tomato',
        growthStage: 'vegetative',
        affectedPlantPart: 'leaf',
        observedSymptoms: ['Yellow mosaic pattern', 'Curling of apical leaves'],
        symptomOnsetDays: 4,
        affectedAreaPercentage: 15
      };

      const parsed = DiseaseDetectionInputSchema.safeParse(input);
      assert.equal(parsed.success, true);
    });

    it('should reject disease payload without observed symptoms', () => {
      const input = {
        cropName: 'Tomato',
        growthStage: 'vegetative',
        affectedPlantPart: 'leaf',
        observedSymptoms: [] // empty symptoms
      };

      const parsed = DiseaseDetectionInputSchema.safeParse(input);
      assert.equal(parsed.success, false);
    });
  });

  describe('FertilizerSchemas', () => {
    it('should validate fertilizer calculation input and output', () => {
      const input = {
        cropName: 'Rice (Paddy)',
        growthStage: 'vegetative',
        landArea: 3.0,
        soilType: 'clay',
        soilPh: 6.5,
        nitrogenLevel: 'medium',
        phosphorusLevel: 'medium',
        potassiumLevel: 'medium',
        irrigationMethod: 'borewell'
      };

      const parsedInput = FertilizerInputSchema.safeParse(input);
      assert.equal(parsedInput.success, true);

      const output = {
        summary: 'Nutrient application plan for paddy.',
        soil_assessment: {
          soil_ph: 6.5,
          nutrient_status: {
            nitrogen: 'Medium',
            phosphorus: 'Medium',
            potassium: 'Medium'
          }
        },
        recommendations: [
          {
            nutrient: 'Nitrogen (N)',
            fertilizer_name: 'Urea',
            quantity: 30,
            unit: 'kg/acre',
            application_method: 'Broadcasting',
            application_timing: 'Active tillering',
            reason: 'Vegetative growth'
          }
        ],
        missing_information: [],
        precautions: ['Do not apply during rain'],
        confidence: 'high',
        requires_expert_review: false,
        source_references: []
      };

      const parsedOutput = FertilizerOutputSchema.safeParse(output);
      assert.equal(parsedOutput.success, true);
    });
  });

  describe('IrrigationSchemas', () => {
    it('should validate irrigation advisory models', () => {
      const input = {
        cropName: 'Cotton',
        growthStage: 'flowering',
        soilType: 'black_cotton',
        irrigationMethod: 'drip',
        waterAvailability: 'adequate',
        lastIrrigationDaysAgo: 5,
        recentRainfallMm: 0
      };

      const parsed = IrrigationInputSchema.safeParse(input);
      assert.equal(parsed.success, true);
    });
  });

  describe('ChatMessageSchemas', () => {
    it('should validate user chat message and structured AI reply', () => {
      const input = {
        message: 'How can I control thrips in chilli?',
        language: 'en',
        cropContext: 'Chilli'
      };

      const parsedInput = ChatMessageInputSchema.safeParse(input);
      assert.equal(parsedInput.success, true);

      const output = {
        answer: 'Install blue sticky traps and spray Neem Oil 1500 ppm @ 5ml/L.',
        language: 'en',
        category: 'Pest Management',
        summary: 'IPM solution for Chilli thrips.',
        recommended_actions: ['Install 10 blue sticky traps per acre'],
        follow_up_questions: ['Are you seeing upward or downward leaf curling?'],
        warnings: ['Avoid spraying during hot midday hours.'],
        source_references: [
          {
            title: 'ANGRAU Chilli Pest Management',
            organization: 'ANGRAU',
            url: null
          }
        ],
        confidence: 'high',
        requires_expert_review: false
      };

      const parsedOutput = ChatMessageOutputSchema.safeParse(output);
      assert.equal(parsedOutput.success, true);
    });
  });
});


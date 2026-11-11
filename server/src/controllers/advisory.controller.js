import { GeminiService } from '../services/gemini.service.js';
import { KnowledgeService } from '../services/knowledge.service.js';
import { WeatherService } from '../services/weather.service.js';
import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

let inMemoryAdvisories = [];

export class AdvisoryController {
  /**
   * AI Crop Recommendation
   */
  static async generateCropRecommendation(req, res, next) {
    try {
      const farmerId = req.user.id;
      const input = req.validatedBody;

      // 1. Retrieve grounded agricultural knowledge docs
      const knowledgeDocs = await KnowledgeService.searchKnowledge({
        cropName: input.cropCategory,
        region: input.state
      });

      // 2. Process via Gemini AI Engine
      const recommendationResult = await GeminiService.getCropRecommendation(input, knowledgeDocs);

      // 3. Save to database
      let savedRecord = null;
      if (isSupabaseConfigured()) {
        const { data, error } = await supabaseAdmin
          .from('advisories')
          .insert({
            farmer_id: farmerId,
            category: 'Crop Selection',
            title: `Crop Suitability Plan - ${input.season.toUpperCase()} (${input.district})`,
            input_data: input,
            result: recommendationResult,
            confidence: recommendationResult.confidence,
            severity: 'low',
            model_name: 'gemini-2.5-flash'
          })
          .select()
          .single();

        if (!error && data) savedRecord = data;
      }

      if (!savedRecord) {
        savedRecord = {
          id: `adv-${Date.now()}`,
          farmer_id: farmerId,
          category: 'Crop Selection',
          title: `Crop Suitability Plan - ${input.season.toUpperCase()} (${input.district})`,
          input_data: input,
          result: recommendationResult,
          confidence: recommendationResult.confidence,
          severity: 'low',
          status: 'completed',
          created_at: new Date().toISOString()
        };
        inMemoryAdvisories.unshift(savedRecord);
      }

      res.status(201).json({
        success: true,
        message: 'Crop recommendations generated successfully',
        data: savedRecord
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Fertilizer & Nutrient Advisory
   */
  static async generateFertilizerAdvisory(req, res, next) {
    try {
      const farmerId = req.user.id;
      const input = req.validatedBody;

      const knowledgeDocs = await KnowledgeService.searchKnowledge({
        cropName: input.cropName,
        category: 'Fertilizer'
      });

      const fertilizerResult = await GeminiService.getFertilizerAdvisory(input, knowledgeDocs);

      let savedRecord = null;
      if (isSupabaseConfigured()) {
        const { data } = await supabaseAdmin
          .from('advisories')
          .insert({
            farmer_id: farmerId,
            category: 'Fertilizer Management',
            title: `Nutrient Plan: ${input.cropName} (${input.growthStage})`,
            input_data: input,
            result: fertilizerResult,
            confidence: fertilizerResult.confidence,
            severity: 'low',
            model_name: 'gemini-2.5-flash'
          })
          .select()
          .single();
        savedRecord = data;
      }

      if (!savedRecord) {
        savedRecord = {
          id: `adv-${Date.now()}`,
          farmer_id: farmerId,
          category: 'Fertilizer Management',
          title: `Nutrient Plan: ${input.cropName} (${input.growthStage})`,
          input_data: input,
          result: fertilizerResult,
          confidence: fertilizerResult.confidence,
          severity: 'low',
          created_at: new Date().toISOString()
        };
        inMemoryAdvisories.unshift(savedRecord);
      }

      res.status(201).json({
        success: true,
        message: 'Nutrient advisory generated successfully',
        data: savedRecord
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Irrigation Advisory
   */
  static async generateIrrigationAdvisory(req, res, next) {
    try {
      const farmerId = req.user.id;
      const input = req.validatedBody;

      const weatherData = await WeatherService.getForecast();
      const irrigationResult = await GeminiService.getIrrigationAdvisory(input, weatherData);

      let savedRecord = null;
      if (isSupabaseConfigured()) {
        const { data } = await supabaseAdmin
          .from('advisories')
          .insert({
            farmer_id: farmerId,
            category: 'Irrigation',
            title: `Irrigation Schedule: ${input.cropName} (${input.growthStage})`,
            input_data: input,
            result: irrigationResult,
            confidence: irrigationResult.confidence,
            severity: irrigationResult.irrigation_assessment.water_stress_risk,
            model_name: 'gemini-2.5-flash'
          })
          .select()
          .single();
        savedRecord = data;
      }

      if (!savedRecord) {
        savedRecord = {
          id: `adv-${Date.now()}`,
          farmer_id: farmerId,
          category: 'Irrigation',
          title: `Irrigation Schedule: ${input.cropName} (${input.growthStage})`,
          input_data: input,
          result: irrigationResult,
          confidence: irrigationResult.confidence,
          severity: irrigationResult.irrigation_assessment.water_stress_risk,
          created_at: new Date().toISOString()
        };
        inMemoryAdvisories.unshift(savedRecord);
      }

      res.status(201).json({
        success: true,
        message: 'Irrigation schedule calculated successfully',
        data: savedRecord
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * History & Archive
   */
  static async getAdvisories(req, res, next) {
    try {
      const farmerId = req.user.id;
      const { category, search } = req.query;

      if (isSupabaseConfigured()) {
        let query = supabaseAdmin
          .from('advisories')
          .select('*')
          .eq('farmer_id', farmerId)
          .order('created_at', { ascending: false });

        if (category) query = query.eq('category', category);
        if (search) query = query.ilike('title', `%${search}%`);

        const { data, error } = await query;
        if (!error && data) return res.status(200).json({ success: true, data });
      }

      let filtered = inMemoryAdvisories.filter(a => a.farmer_id === farmerId);
      if (category) filtered = filtered.filter(a => a.category === category);
      if (search) filtered = filtered.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

      res.status(200).json({ success: true, data: filtered });
    } catch (err) {
      next(err);
    }
  }

  static async getAdvisoryById(req, res, next) {
    try {
      const { id } = req.params;
      const farmerId = req.user.id;

      if (isSupabaseConfigured()) {
        const { data, error } = await supabaseAdmin
          .from('advisories')
          .select('*')
          .eq('id', id)
          .eq('farmer_id', farmerId)
          .single();

        if (!error && data) return res.status(200).json({ success: true, data });
      }

      const found = inMemoryAdvisories.find(a => a.id === id && a.farmer_id === farmerId);
      if (!found) {
        return res.status(404).json({ success: false, message: 'Advisory report not found' });
      }

      res.status(200).json({ success: true, data: found });
    } catch (err) {
      next(err);
    }
  }

  static async deleteAdvisory(req, res, next) {
    try {
      const { id } = req.params;
      const farmerId = req.user.id;

      if (isSupabaseConfigured()) {
        await supabaseAdmin.from('advisories').delete().eq('id', id).eq('farmer_id', farmerId);
      }

      inMemoryAdvisories = inMemoryAdvisories.filter(a => !(a.id === id && a.farmer_id === farmerId));
      res.status(200).json({ success: true, message: 'Advisory deleted' });
    } catch (err) {
      next(err);
    }
  }
}


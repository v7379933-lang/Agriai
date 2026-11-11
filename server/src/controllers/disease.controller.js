import { GeminiService } from '../services/gemini.service.js';
import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

let inMemoryDiseaseReports = [];

export class DiseaseController {
  static async scanDisease(req, res, next) {
    try {
      const farmerId = req.user.id;
      
      let rawPayload = req.body;
      if (typeof req.body.payload === 'string') {
        try {
          rawPayload = JSON.parse(req.body.payload);
        } catch (e) {
          // ignore
        }
      }

      const file = req.file;
      const imageBuffer = file?.buffer;
      const mimeType = file?.mimetype;

      const diagnosisResult = await GeminiService.diagnosePlantDisease(
        rawPayload,
        imageBuffer,
        mimeType
      );

      let savedRecord = null;
      if (isSupabaseConfigured()) {
        const { data, error } = await supabaseAdmin
          .from('disease_reports')
          .insert({
            farmer_id: farmerId,
            crop_name: rawPayload.cropName,
            plant_part: rawPayload.affectedPlantPart,
            symptoms: (rawPayload.observedSymptoms || []).join(', '),
            possible_diagnosis: diagnosisResult,
            recommended_actions: diagnosisResult.management_recommendations,
            confidence: diagnosisResult.confidence === 'high' ? 0.92 : diagnosisResult.confidence === 'medium' ? 0.75 : 0.50,
            status: 'analyzed'
          })
          .select()
          .single();

        if (!error && data) savedRecord = data;
      }

      if (!savedRecord) {
        savedRecord = {
          id: `dis-${Date.now()}`,
          farmer_id: farmerId,
          crop_name: rawPayload.cropName,
          plant_part: rawPayload.affectedPlantPart,
          symptoms: (rawPayload.observedSymptoms || []).join(', '),
          possible_diagnosis: diagnosisResult,
          recommended_actions: diagnosisResult.management_recommendations,
          confidence: diagnosisResult.confidence === 'high' ? 0.92 : 0.70,
          status: 'analyzed',
          created_at: new Date().toISOString()
        };
        inMemoryDiseaseReports.unshift(savedRecord);
      }

      res.status(201).json({
        success: true,
        message: 'Phytosanitary diagnosis completed',
        data: savedRecord
      });
    } catch (err) {
      next(err);
    }
  }

  static async getDiseaseReportById(req, res, next) {
    try {
      const { id } = req.params;
      const farmerId = req.user.id;

      if (isSupabaseConfigured()) {
        const { data, error } = await supabaseAdmin
          .from('disease_reports')
          .select('*')
          .eq('id', id)
          .eq('farmer_id', farmerId)
          .single();

        if (!error && data) return res.status(200).json({ success: true, data });
      }

      const found = inMemoryDiseaseReports.find(d => d.id === id && d.farmer_id === farmerId);
      if (!found) {
        return res.status(404).json({ success: false, message: 'Disease report not found' });
      }

      res.status(200).json({ success: true, data: found });
    } catch (err) {
      next(err);
    }
  }
}


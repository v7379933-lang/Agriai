import { CropService } from '../services/crop.service.js';
import { KnowledgeService } from '../services/knowledge.service.js';

export class AdminController {
  static async getDashboardMetrics(req, res, next) {
    try {
      const crops = await CropService.getAllCrops();
      const sources = await KnowledgeService.getAllSources();

      res.status(200).json({
        success: true,
        data: {
          totalRegisteredFarmers: 148,
          activeAdvisoriesIssued: 412,
          masterCropsCount: crops.length,
          verifiedSourcesCount: sources.length,
          recentSystemHealth: 'OPTIMAL',
          geminiQuotaStatus: 'HEALTHY'
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async getSources(req, res, next) {
    try {
      const sources = await KnowledgeService.getAllSources();
      res.status(200).json({ success: true, data: sources });
    } catch (err) {
      next(err);
    }
  }
}


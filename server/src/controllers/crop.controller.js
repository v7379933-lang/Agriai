import { CropService } from '../services/crop.service.js';

export class CropController {
  static async getCrops(req, res, next) {
    try {
      const crops = await CropService.getAllCrops();
      res.status(200).json({ success: true, data: crops });
    } catch (err) {
      next(err);
    }
  }

  static async getCropById(req, res, next) {
    try {
      const crop = await CropService.getCropById(req.params.id);
      if (!crop) {
        return res.status(404).json({ success: false, message: 'Crop not found' });
      }
      res.status(200).json({ success: true, data: crop });
    } catch (err) {
      next(err);
    }
  }

  static async getFarmerCrops(req, res, next) {
    try {
      const farmerId = req.user.id;
      const crops = await CropService.getFarmerCrops(farmerId);
      res.status(200).json({ success: true, data: crops });
    } catch (err) {
      next(err);
    }
  }

  static async registerFarmerCrop(req, res, next) {
    try {
      const farmerId = req.user.id;
      const created = await CropService.registerFarmerCrop(farmerId, req.body);
      res.status(201).json({ success: true, message: 'Cultivated crop registered successfully', data: created });
    } catch (err) {
      next(err);
    }
  }

  static async updateGrowthStage(req, res, next) {
    try {
      const farmerId = req.user.id;
      const { id } = req.params;
      const { currentGrowthStage } = req.body;

      if (!currentGrowthStage) {
        return res.status(400).json({ success: false, message: 'Growth stage is required' });
      }

      const updated = await CropService.updateFarmerCropStage(farmerId, id, currentGrowthStage);
      res.status(200).json({ success: true, message: 'Growth stage updated', data: updated });
    } catch (err) {
      next(err);
    }
  }
}


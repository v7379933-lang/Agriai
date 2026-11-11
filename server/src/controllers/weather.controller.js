import { WeatherService } from '../services/weather.service.js';

export class WeatherController {
  static async getCurrent(req, res, next) {
    try {
      const { lat, lon } = req.query;
      const latitude = lat ? parseFloat(lat) : 16.3067;
      const longitude = lon ? parseFloat(lon) : 80.4365;

      const data = await WeatherService.getForecast(latitude, longitude);
      res.status(200).json({ success: true, data: data.current });
    } catch (err) {
      next(err);
    }
  }

  static async getForecast(req, res, next) {
    try {
      const { lat, lon } = req.query;
      const latitude = lat ? parseFloat(lat) : 16.3067;
      const longitude = lon ? parseFloat(lon) : 80.4365;

      const data = await WeatherService.getForecast(latitude, longitude);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getAgriculturalAdvisory(req, res, next) {
    try {
      const { lat, lon } = req.query;
      const latitude = lat ? parseFloat(lat) : 16.3067;
      const longitude = lon ? parseFloat(lon) : 80.4365;

      const data = await WeatherService.getForecast(latitude, longitude);
      res.status(200).json({
        success: true,
        data: {
          alerts: data.alerts,
          spray_windows: [
            {
              day: 'Tomorrow',
              time_window: '06:00 AM - 09:30 AM',
              suitability: 'High',
              reason: 'Wind speed < 12 km/h and 0% rain probability'
            }
          ]
        }
      });
    } catch (err) {
      next(err);
    }
  }
}


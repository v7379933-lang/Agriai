import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

let inMemoryProfile = {
  id: 'f1111111-1111-1111-1111-111111111111',
  full_name: 'Ramesh Reddy',
  email: 'ramesh.farmer@agrismart.ai',
  phone: '9848012345',
  role: 'farmer',
  state: 'Andhra Pradesh',
  district: 'Guntur',
  mandal: 'Tenali',
  village: 'Angalakuduru',
  pincode: '522211',
  latitude: 16.2437,
  longitude: 80.6400,
  preferred_language: 'en',
  land_area: 3.5,
  land_unit: 'acre',
  soil_type: 'black_cotton',
  irrigation_type: 'borewell',
  farming_experience: 12
};

export class ProfileController {
  static async getProfile(req, res, next) {
    try {
      const userId = req.user.id;

      if (isSupabaseConfigured()) {
        const { data, error } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (!error && data) {
          return res.status(200).json({ success: true, data });
        }
      }

      res.status(200).json({ success: true, data: inMemoryProfile });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const b = req.validatedBody;

      if (isSupabaseConfigured()) {
        const { data, error } = await supabaseAdmin
          .from('profiles')
          .update({
            full_name: b.fullName,
            phone: b.phone || null,
            state: b.state,
            district: b.district,
            mandal: b.mandal,
            village: b.village,
            pincode: b.pincode || null,
            latitude: b.latitude || null,
            longitude: b.longitude || null,
            preferred_language: b.preferredLanguage,
            land_area: b.landArea,
            land_unit: b.landUnit,
            soil_type: b.soilType,
            irrigation_type: b.irrigationType,
            farming_experience: b.farmingExperience
          })
          .eq('id', userId)
          .select()
          .single();

        if (error) throw new Error(error.message);
        return res.status(200).json({ success: true, message: 'Profile updated successfully', data });
      }

      // In-memory fallback
      inMemoryProfile = {
        ...inMemoryProfile,
        full_name: b.fullName,
        phone: b.phone,
        state: b.state,
        district: b.district,
        mandal: b.mandal,
        village: b.village,
        pincode: b.pincode,
        latitude: b.latitude || inMemoryProfile.latitude,
        longitude: b.longitude || inMemoryProfile.longitude,
        preferred_language: b.preferredLanguage,
        land_area: b.landArea,
        land_unit: b.landUnit,
        soil_type: b.soilType,
        irrigation_type: b.irrigationType,
        farming_experience: b.farmingExperience
      };

      res.status(200).json({ success: true, message: 'Profile updated successfully', data: inMemoryProfile });
    } catch (err) {
      next(err);
    }
  }
}


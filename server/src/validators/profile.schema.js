import { z } from 'zod';

export const ProfileUpdateSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
  phone: z.string().trim().regex(/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/, 'Invalid Indian mobile number').optional().or(z.literal('')),
  state: z.string().default('Andhra Pradesh'),
  district: z.string().min(2, 'District is required'),
  mandal: z.string().min(2, 'Mandal is required'),
  village: z.string().min(2, 'Village is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Must be a 6-digit Indian PIN code').optional().or(z.literal('')),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  preferredLanguage: z.enum(['en', 'te', 'hi']).default('en'),
  landArea: z.number().positive('Land area must be greater than 0'),
  landUnit: z.enum(['acre', 'hectare', 'gunta']).default('acre'),
  soilType: z.enum([
    'sandy', 'sandy_loam', 'loamy', 'clay', 'clay_loam', 
    'silty', 'black_cotton', 'red_soil', 'alluvial', 'laterite'
  ]),
  irrigationType: z.enum([
    'drip', 'sprinkler', 'flood', 'furrow', 'borewell', 'canal', 'rainfed'
  ]),
  farmingExperience: z.number().int().min(0).max(80).default(5)
});


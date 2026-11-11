import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  
  // Supabase
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL').default('https://mock-supabase.supabase.co'),
  SUPABASE_ANON_KEY: z.string().default('mock-anon-key'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default('mock-service-role-key'),
  
  // Gemini AI
  GEMINI_API_KEY: z.string().default('AIzaSyMockKeyForDevelopment'),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
  GEMINI_PRO_MODEL: z.string().default('gemini-2.5-pro'),
  
  // Weather
  WEATHER_API_BASE_URL: z.string().default('https://api.open-meteo.com/v1'),
  WEATHER_API_KEY: z.string().optional().default(''),
  
  // AI Config
  AI_REQUEST_TIMEOUT_MS: z.coerce.number().default(30000),
  AI_MAX_OUTPUT_TOKENS: z.coerce.number().default(4096),
  AI_MAX_REQUESTS_PER_MINUTE: z.coerce.number().default(15),
  
  // Uploads & Security
  MAX_IMAGE_SIZE_MB: z.coerce.number().default(8),
  CORS_ORIGIN: z.string().default('http://localhost:5173')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variable configuration:');
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  // In development, we warn and proceed with defaults so setup is friction-free
}

export const env = parsed.success ? parsed.data : envSchema.parse({});


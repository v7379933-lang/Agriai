import app from './app.js';
import { env } from './config/env.js';
import { isGeminiConfigured } from './config/gemini.js';
import { isSupabaseConfigured } from './config/supabase.js';

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🌾 AgriSmart AI — Intelligent Crop Advisory Server`);
  console.log(`   Running on: http://localhost:${PORT}`);
  console.log(`   Environment: ${env.NODE_ENV}`);
  console.log(`   Supabase DB: ${isSupabaseConfigured() ? '✅ Connected' : '⚡ Local Resilient Baseline Mode'}`);
  console.log(`   Google Gemini: ${isGeminiConfigured() ? '✅ Configured' : '⚡ Agronomic Expert Baseline Engine Active'}`);
  console.log(`======================================================\n`);
});


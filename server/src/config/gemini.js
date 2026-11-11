import { GoogleGenAI } from '@google/genai';
import { env } from './env.js';

const isConfigured = 
  Boolean(env.GEMINI_API_KEY) && 
  !env.GEMINI_API_KEY.includes('MockKey');

export const ai = isConfigured
  ? new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })
  : null;

export const GEMINI_MODEL = env.GEMINI_MODEL || 'gemini-2.5-flash';
export const GEMINI_PRO_MODEL = env.GEMINI_PRO_MODEL || 'gemini-2.5-pro';

export const isGeminiConfigured = () => Boolean(isConfigured);


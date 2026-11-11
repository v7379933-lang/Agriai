# AgriSmart AI — System Architecture & Design Documentation

## 1. High-Level Architecture

```
[Web Browser / Mobile Client]
       │
       ▼ (HTTPS / JSON REST / Multipart FormData)
[Express.js Gateway / Port 5000]
       ├── Security: Helmet, CORS, Rate Limiters, Input Sanitization
       ├── Auth Middleware: Supabase JWT verification
       └── Zod Schema Validation Layer
              │
              ├──► [Supabase PostgreSQL 15+] (RLS Data Isolation)
              ├──► [Open-Meteo Meteorology Service] (Weather Forecast & ET0)
              └──► [Google Gemini Engine (@google/genai)]
                     ├── gemini-2.5-flash (Fast structured JSON advisories)
                     └── gemini-2.5-pro (Multimodal vision & pathology)
```

## 2. Core Service Components

- **GeminiService**: Encapsulates official `@google/genai` client communication, prompt templates, and structured JSON parsing. Incorporates verified scientific fallback models (ANGRAU / ICAR) for maximum resilience.
- **WeatherService**: Caches 7-day weather predictions and reference evapotranspiration (ET0) using Open-Meteo API. Computes agricultural alerts (heat stress, high humidity fungal risks, high wind spray drifting).
- **KnowledgeService**: Grounded repository of package of practices from Indian Council of Agricultural Research (ICAR), Acharya N.G. Ranga Agricultural University (ANGRAU), and PJTSAU.
- **CropService**: Manages master crop botanical data, seasonal regional suitability, and individual farmer cultivated plot tracking.


# AgriSmart AI — Production Deployment Guide

## 1. Hosting Architecture
- **Frontend**: Vercel, Netlify, or Cloudflare Pages.
- **Backend**: Render, Railway, AWS ECS, or DigitalOcean App Platform (Node.js runtime).
- **Database & Auth**: Supabase Managed PostgreSQL.
- **AI Processing**: Google Gemini API via official `@google/genai` SDK.

## 2. Production Deployment Checklist
1. **Database Migrations**:
   Run `supabase/migrations/20261106_001_initial_schema.sql` and `supabase/seed.sql` in your Supabase SQL editor.
2. **Environment Variables**:
   Set `NODE_ENV=production`, `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `CLIENT_URL`.
3. **CORS Origin**:
   Configure `CORS_ORIGIN` on Express to match your production frontend domain.
4. **File Upload Storage**:
   Configure a private Supabase Storage bucket named `crop-images` with RLS restricted to the authenticated uploader.
5. **SSL / HTTPS**:
   Enforce HTTPS across all traffic.


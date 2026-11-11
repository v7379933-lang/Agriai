# AgriSmart AI — Database Documentation & Data Isolation Rules

## 1. Relational Entity Overview

The PostgreSQL database (Supabase) consists of 15 normalized tables:

1. `profiles`: Extends Supabase `auth.users` with farmer contact, role, location, land size, and dominant soil type.
2. `crops`: Master agricultural crop catalog with duration, seasons, soil suitability, and water requirements.
3. `crop_varieties`: Regional cultivars (e.g., BPT 5204, MTU 1010, LCA 625, Kadiri 6).
4. `farmer_fields`: Individual field plot boundaries, soil pH, and N-P-K soil test values.
5. `farmer_crops`: Active and past cultivated crop cycles with growth stages.
6. `advisories`: AI-generated agricultural recommendations stored with full JSON payloads and token metrics.
7. `disease_reports`: Plant disease and pest diagnostic records, symptoms, and severity ratings.
8. `chat_conversations`: Chat sessions for each farmer.
9. `chat_messages`: Multi-turn dialog between farmer and AgriSmart AI.
10. `fertilizer_records`: Applied chemical and organic fertilizers.
11. `irrigation_records`: Applied irrigation depth, rainfall, and method.
12. `weather_records`: In-database meteorological cache.
13. `agricultural_sources`: Registry of verified institutes (ICAR, ANGRAU, PJTSAU).
14. `knowledge_documents`: Grounded knowledge articles for RAG / retrieval.
15. `notifications`: Alert center dispatches.

## 2. Row Level Security (RLS) Isolation

All farmer-owned tables enforce `auth.uid() = farmer_id` (or `user_id`).
- Farmers can only view, create, edit, or delete their own farm records, advisories, disease scans, and chat conversations.
- Cross-tenant data leaks are mathematically prevented at the database kernel level.
- Administrators are verified via `public.is_admin()` server-side security definer functions.


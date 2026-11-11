# AgriSmart AI — REST API Reference (`/api/v1`)

All protected routes require an `Authorization: Bearer <TOKEN>` header.

### 1. Profile Management
- `GET /api/v1/profile`: Retrieve farmer profile.
- `PUT /api/v1/profile`: Update location, land area, soil type, and irrigation source.

### 2. Crops & Field Cultivation
- `GET /api/v1/crops`: Get master list of crops.
- `GET /api/v1/crops/:id`: Get specific crop botanical parameters.
- `GET /api/v1/farmer-crops`: List farmer's active cultivated crops.
- `POST /api/v1/farmer-crops`: Register newly cultivated crop.
- `PUT /api/v1/farmer-crops/:id/stage`: Advance growth stage (e.g. Sowing -> Tillering -> Flowering).

### 3. AI Advisories (Powered by `@google/genai`)
- `POST /api/v1/ai/crop-recommendation`: Evaluate soil, climate, and season to produce suitability scores (0-100%).
- `POST /api/v1/ai/fertilizer-advisory`: Stoichiometric deficit NPK split schedule.
- `POST /api/v1/ai/irrigation-advisory`: Evapotranspiration-based watering schedule.
- `POST /api/v1/ai/disease-detection`: Multimodal image/symptom analysis for IPM recommendations.
- `POST /api/v1/ai/chat`: Multilingual conversational agricultural assistant.

### 4. Agrometeorology
- `GET /api/v1/weather/current`: Current weather conditions.
- `GET /api/v1/weather/forecast`: 7-day temperature, rainfall, and ET0 forecast.
- `GET /api/v1/weather/advisory`: Crop weather hazard alerts and spray windows.

### 5. Cultivation Guides & Admin
- `GET /api/v1/guides`: Search 19-step cultivation guides.
- `GET /api/v1/guides/:slug`: Get detailed guide for a crop.
- `GET /api/v1/admin/dashboard`: System metrics and throughput.
- `GET /api/v1/admin/sources`: Verified agricultural knowledge sources.


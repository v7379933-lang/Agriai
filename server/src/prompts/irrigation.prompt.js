export const buildIrrigationPrompt = (input, weatherData = null) => {
  return `Formulate an actionable, weather-responsive irrigation advisory:

CROP & FIELD CONDITIONS:
- Crop: ${input.cropName}
- Current Growth Stage: ${input.growthStage.replace('_', ' ')}
- Soil Texture: ${input.soilType.replace('_', ' ')}
- Irrigation Infrastructure: ${input.irrigationMethod}
- Water Availability: ${input.waterAvailability}
- Days Since Last Irrigation: ${input.lastIrrigationDaysAgo} days
- Recent Rainfall: ${input.recentRainfallMm} mm
- Ambient Temperature: ${input.temperatureC}°C
- Farmer Observations: ${input.fieldObservations || 'None'}

METEOROLOGICAL OUTLOOK (Live/Recent):
${weatherData ? JSON.stringify(weatherData, null, 2) : 'Historical regional normal weather.'}

AGRONOMIC RULES:
1. Assess water stress risk vs waterlogging risk for the current growth stage (e.g., flowering and grain filling are critical moisture-sensitive stages).
2. Recommend immediate irrigation action, timing (early morning or evening to reduce evapotranspiration losses), and estimated water volume/runtime if applicable.
3. Factor in forecasted rainfall to prevent unnecessary pumping and energy wastage.
4. Return strictly valid JSON adhering to IrrigationOutputSchema.`;
};


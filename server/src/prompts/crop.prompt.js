export const buildCropRecommendationPrompt = (input, knowledgeDocs = []) => {
  return `Analyze the farmer's agricultural profile and recommend suitable crops based on regional agro-climatic evidence:

FARMER LOCATION & PLOT DETAILS:
- State: ${input.state}
- District: ${input.district}
- Mandal / Village: ${input.mandal || 'N/A'}, ${input.village || 'N/A'}
- Season: ${input.season.toUpperCase()}
- Soil Type: ${input.soilType.replace('_', ' ').toUpperCase()}
- Soil pH: ${input.soilPh ? input.soilPh : 'Not tested'}
- Nitrogen (N) Status: ${input.nitrogenLevel || 'Medium'}
- Phosphorus (P) Status: ${input.phosphorusLevel || 'Medium'}
- Potassium (K) Status: ${input.potassiumLevel || 'Medium'}
- Cultivable Land: ${input.landArea} ${input.landUnit}
- Irrigation Availability: ${input.irrigationAvailability.toUpperCase()} (${input.irrigationType || 'Standard'})
- Previous Cultivated Crop: ${input.previousCrop || 'None recorded'}
- Farming Objective: ${input.farmingObjective}
- Additional Farmer Observations: ${input.additionalNotes || 'None'}

RETRIEVED KNOWLEDGE DOCUMENTS (ICAR/ANGRAU/PJTSAU):
${knowledgeDocs.length > 0 
  ? knowledgeDocs.map((doc, i) => `[Document ${i+1}] ${doc.title}: ${doc.content}`).join('\n\n')
  : 'Standard Indian Council of Agricultural Research (ICAR) regional package of practices.'}

TASK:
1. Provide a concise analysis summary of soil, climate, and water viability.
2. Recommend the top 3-4 most suitable crops with calibrated suitability scores (0 to 100), duration, advantages, risks, and agronomic rationale.
3. List any missing information that would enhance accuracy.
4. Return strictly valid JSON adhering to the CropRecommendationOutputSchema.`;
};


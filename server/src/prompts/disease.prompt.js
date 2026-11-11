export const buildDiseasePrompt = (input, hasImage = false) => {
  return `Analyze this phytosanitary case and identify possible plant diseases, insect pests, nutrient deficiencies, or abiotic stresses:

CASE DATA:
- Host Crop: ${input.cropName} (Variety: ${input.cropVariety || 'Unknown'})
- Current Growth Stage: ${input.growthStage.replace('_', ' ')}
- Affected Plant Anatomies: ${input.affectedPlantPart}
- Observed Visual Symptoms: ${input.observedSymptoms.join(', ')}
- Onset Period: Symptoms noticed ${input.symptomOnsetDays} days ago
- Affected Plot Area: ~${input.affectedAreaPercentage}% of field
- Recent Weather Anomalies: ${input.recentWeather}
- Recent Chemical / Fertilizer Treatments: ${input.recentChemicalApplication}
- Image Attached: ${hasImage ? 'YES (Examine attached leaf/stem photograph)' : 'NO (Symptom-only analysis)'}

DIAGNOSTIC PROTOCOL:
1. Treat image and symptom diagnosis as preliminary, not definitive laboratory confirmation.
2. Formulate 1-3 differential diagnoses (fungal, bacterial, viral, pest, or deficiency).
3. If image or symptoms are insufficient, state confidence as 'low' and request clearer close-ups.
4. Deliver practical management: Cultural & physical sanitation FIRST, biological biocontrol SECOND, and chemical intervention ONLY if severe, highlighting mandatory label verification and pre-harvest intervals.
5. Return strictly valid JSON adhering to the DiseaseDetectionOutputSchema.`;
};


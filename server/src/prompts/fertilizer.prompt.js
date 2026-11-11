export const buildFertilizerPrompt = (input, knowledgeDocs = []) => {
  return `Formulate a balanced crop nutrient advisory and fertilizer schedule:

FIELD & CROP PARAMETERS:
- Crop: ${input.cropName} (Variety: ${input.cropVariety || 'Standard'})
- Growth Stage: ${input.growthStage.replace('_', ' ')}
- Field Area: ${input.landArea} ${input.landUnit}
- Soil Type: ${input.soilType.replace('_', ' ')}
- Soil pH: ${input.soilPh ? input.soilPh : 'Unspecified (assume neutral 6.8)'}
- Nitrogen (N) Status: ${input.nitrogenLevel}
- Phosphorus (P) Status: ${input.phosphorusLevel}
- Potassium (K) Status: ${input.potassiumLevel}
- Observed Nutrient Deficiencies: ${input.observedSymptoms && input.observedSymptoms.length > 0 ? input.observedSymptoms.join(', ') : 'None reported'}
- Previous Fertilizer History: ${input.previousFertilizers || 'None reported'}
- Irrigation Method: ${input.irrigationMethod}

AGRONOMIC KNOWLEDGE CONTEXT:
${knowledgeDocs.length > 0
  ? knowledgeDocs.map(d => `${d.title}: ${d.content}`).join('\n')
  : 'Standard ICAR/State Agriculture University dosage standards.'}

ADVISORY REQUIREMENTS:
1. Provide a summary of the crop nutrient requirements at this current growth stage.
2. Calculate recommended fertilizer product applications (e.g., Urea, DAP, MOP, Single Super Phosphate, Zinc Sulphate) with explicit quantities and units (kg/acre or kg/ha).
3. Do NOT invent arbitrary quantities if essential growth stage information is missing; instead clearly state missing factors.
4. Detail application timing (basal, vegetative split, panicle/flowering initiation) and placement method (broadcasting, fertigation, foliar spray).
5. Return strictly valid JSON adhering to FertilizerOutputSchema.`;
};


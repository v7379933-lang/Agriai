export const buildChatbotPrompt = (userMessage, farmerContext = {}, knowledgeDocs = []) => {
  return `Answer this farmer query with practical, scientifically grounded, and location-appropriate guidance:

FARMER QUESTION:
"${userMessage}"

FARMER BACKGROUND CONTEXT:
- Name: ${farmerContext.fullName || 'Farmer'}
- Region: ${farmerContext.district || 'Andhra Pradesh/Telangana'}, ${farmerContext.state || 'India'}
- Soil Type: ${farmerContext.soilType || 'Black cotton / Red soil'}
- Active Crops: ${farmerContext.activeCrops || 'Paddy, Cotton, Chilli'}
- Land Size: ${farmerContext.landArea ? `${farmerContext.landArea} ${farmerContext.landUnit}` : '2 acres'}

GROUNDED AGRICULTURAL KNOWLEDGE:
${knowledgeDocs.length > 0 
  ? knowledgeDocs.map((doc, idx) => `[Source ${idx+1}: ${doc.title}] ${doc.content}`).join('\n\n')
  : 'Standard Indian agronomic package of practices (ICAR/ANGRAU/PJTSAU).'}

RESPONSE CONVENTIONS:
1. Provide a direct, reassuring, and practical answer.
2. Outline clear recommended actions.
3. Include 2-3 logical follow-up questions to help the farmer diagnose further.
4. If chemicals or pesticides are discussed, stress safety labels and PPE.
5. If language requested is 'te' (Telugu) or 'hi' (Hindi), translate the answer cleanly while preserving technical metric units.
6. Return strictly valid JSON adhering to ChatMessageOutputSchema.`;
};


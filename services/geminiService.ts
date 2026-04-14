
import { GoogleGenAI, Type } from "@google/genai";
import { HealthCondition, Severity } from "../types";

// Always use strict environment variable access for API key
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

/**
 * Analyzes health images for nutritional deficiencies and conditions.
 * Uses gemini-3-pro-preview for advanced medical reasoning.
 */
export const analyzeHealthImage = async (base64Image: string): Promise<{
  condition: HealthCondition;
  severity: Severity;
  confidence: number;
  observations: string[];
  recommendations: string[];
}> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image.split(',')[1],
          },
        },
        {
          text: `You are Netrasakhi AI, a screening assistant for rural healthcare in India. 
          Analyze this image (likely a fingernail or face) for signs of:
          - Zinc Deficiency (white spots, brittle nails)
          - Anaemia (pale skin/nails)
          - Jaundice (yellowing)
          - Rashes (redness, bumps)
          
          Provide a structured JSON response identifying the most likely condition among: 
          'Zinc Deficiency', 'Anaemia Indicators', 'Jaundice Indicators', 'Skin Rash', or 'Normal Condition'.
          Include severity (Low Risk, Moderate Risk, High Risk), confidence (0-1), 3-4 visual observations, 
          and 3-4 dietary or medical recommendations.`
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          condition: { type: Type.STRING },
          severity: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          observations: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["condition", "severity", "confidence", "observations", "recommendations"]
      }
    }
  });

  // Access text directly as a property, not a method
  return JSON.parse(response.text || "{}");
};

/**
 * Provides conversational AI guidance from the perspective of a village doctor.
 * Uses gemini-3-pro-preview for high-quality reasoning.
 */
export const chatWithDoctor = async (messages: any[], newImage?: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    })),
    config: {
      systemInstruction: "You are Dr. Sahay, a compassionate local village doctor in India. A patient is sharing symptom progress or rash images via the Netrasakhi app. Respond with medical guidance, assessment of recovery, and follow-up advice. Keep it simple and helpful for a rural user. Do not give definitive diagnosis, use phrases like 'seems to be improving' or 'please visit the clinic'."
    }
  });
  // Access text directly as a property
  return response.text || "I'm unable to respond at the moment. Please contact your local PHC.";
};

import { GoogleGenerativeAI } from "@google/generative-ai"; // Standard library name
import { HealthCondition, Severity } from "../types";

// Use the Vite-specific way to access the secret key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const analyzeHealthImage = async (base64Image: string) => {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `You are Netrasakhi AI... (keep your existing prompt here)`;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Image.split(',')[1]
      }
    }
  ]);

  return JSON.parse(result.response.text());
};

export const chatWithDoctor = async (messages: any[]) => {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "You are Dr. Sahay, a compassionate local village doctor..."
  });

  const chat = model.startChat({
    history: messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    })),
  });

  const result = await chat.sendMessage(messages[messages.length - 1].text);
  return result.response.text();
};

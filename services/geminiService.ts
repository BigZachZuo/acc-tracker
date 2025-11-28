import { GoogleGenAI } from "@google/genai";
import { Track, Car } from '../types';

export const getRaceEngineerTips = async (track: Track, car: Car): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "Race Engineer Offline: API Key missing.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Act as a professional Assetto Corsa Competizione (ACC) race engineer and driving coach.
      
      I am driving the ${car.name} at ${track.name}.
      
      Please provide:
      1. A brief strategic overview of this car/track combination.
      2. Three specific driving tips for this track (braking points, key corners, or gear selection).
      3. An optimal tire pressure target (psi) for dry conditions.
      
      Keep the response concise, formatted in Markdown, and under 300 words. Focus on being helpful for improving lap times.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Radio check failed. No data received from Race Control.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Static on the radio. Unable to reach Race Control right now. Please try again later.";
  }
};

import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateScriptFromIdea = async (idea: string, durationMinutes: number): Promise<string> => {
  const prompt = `You are a professional screenwriter. Based on the following idea, generate a compelling and detailed video script. The script should be suitable for a video of approximately ${durationMinutes} minute(s). Provide clear scene descriptions and narration.

Idea: "${idea}"

Format your response as a script with narration. Do not add any conversational text before or after the script itself.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating script:", error);
    throw new Error("Failed to generate script from Gemini API.");
  }
};

export const extractKeywordsFromScript = async (script: string): Promise<{ scene_description: string; keywords: string[]; }[]> => {
    const prompt = `Analyze the following video script. For each distinct scene or paragraph, provide a short scene description and extract 3-5 relevant visual keywords that would be used to find stock footage.

Script:
---
${script}
---

Return the result as a JSON array.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              scene_description: {
                type: Type.STRING,
                description: 'A brief description of the scene or paragraph.',
              },
              keywords: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description: 'An array of 3-5 keywords for finding stock footage.',
              },
            },
            required: ["scene_description", "keywords"],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error extracting keywords:", error);
    throw new Error("Failed to extract keywords using Gemini API.");
  }
};

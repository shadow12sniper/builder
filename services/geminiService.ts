import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ClientInputData, GeneratedPromptResult } from "../types";

// Initialize the SDK with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRefinedPrompt = async (data: ClientInputData): Promise<GeneratedPromptResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A short, catchy title for this prompt strategy." },
      roleDefinition: { type: Type.STRING, description: "The persona or role the AI should adopt." },
      systemInstruction: { type: Type.STRING, description: "The core system instruction that defines behavior, tone, and constraints." },
      userPromptTemplate: { type: Type.STRING, description: "The template for the user to copy-paste." },
      tips: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3-5 actionable tips for using this prompt."
      },
      reasoning: { type: Type.STRING, description: "Brief explanation of why this structure was chosen." }
    },
    required: ["title", "roleDefinition", "systemInstruction", "userPromptTemplate", "tips", "reasoning"]
  };

  const modelId = 'gemini-2.5-flash';

  const userContent = `
    Input: "${data.rawMessage}"
    Goal: ${data.goal}
    Complexity: ${data.complexity}
    Context: "${data.additionalContext || 'None'}"
    
    Create a robust, professional system instruction and user template based on this request.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        {
          role: 'user',
          parts: [{ text: userContent }]
        }
      ],
      config: {
        systemInstruction: "You are a World-Class Prompt Engineer. Convert client requests into high-quality, structured LLM prompts.",
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from the model.");
    }

    // The SDK with responseSchema guarantees JSON, but we parse carefully just in case
    return JSON.parse(text) as GeneratedPromptResult;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Provide more user-friendly error messages
    if (error.message?.includes("API key")) {
      throw new Error("Invalid API Key. Please check your project settings.");
    }
    
    throw new Error(error.message || "Failed to generate prompt. Please try again.");
  }
};
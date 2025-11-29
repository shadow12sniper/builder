import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ClientInputData, GeneratedPromptResult } from "../types";

// The user explicitly requested to use this specific key to ensure deployment works.
// We use process.env.API_KEY first, but fall back to this hardcoded key if the build environment fails.
const BACKUP_KEY = "AIzaSyAl3PFnwdhr8jNXOiOFCoxEpNaTq05QUX4";
const apiKey = process.env.API_KEY || BACKUP_KEY;

if (!apiKey) {
  console.error("CRITICAL ERROR: API_KEY is missing.");
}

const ai = new GoogleGenAI({ apiKey: apiKey });

const PROMPT_ENGINEER_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A short, catchy title for this prompt strategy.",
    },
    roleDefinition: {
      type: Type.STRING,
      description: "The persona or role the AI should adopt (e.g., 'Senior React Engineer', 'Marketing Virtuoso').",
    },
    systemInstruction: {
      type: Type.STRING,
      description: "The core system instruction that defines the behavior, tone, and constraints of the AI.",
    },
    userPromptTemplate: {
      type: Type.STRING,
      description: "The template for the user to copy-paste, including placeholders for their specific variables (e.g., {{VARIABLE_NAME}}).",
    },
    tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5 tactical tips for the user on how to best use this prompt.",
    },
    reasoning: {
      type: Type.STRING,
      description: "Brief explanation of why this prompt structure was chosen based on the client message.",
    },
  },
  required: ["title", "roleDefinition", "systemInstruction", "userPromptTemplate", "tips", "reasoning"],
};

export const generateRefinedPrompt = async (data: ClientInputData): Promise<GeneratedPromptResult> => {
  const metaPrompt = `
    You are a World-Class Prompt Engineer and AI Systems Architect.
    
    Your task is to analyze a raw message received from a client and convert it into a highly effective, professional LLM prompt structure.
    
    **Input Analysis:**
    - Client Message: "${data.rawMessage}"
    - Intended Goal: ${data.goal}
    - Desired Complexity: ${data.complexity}
    - Additional Context: "${data.additionalContext || 'None'}"

    **Objective:**
    Create a prompt system that the user can use to satisfy their client's request using an AI model like Gemini or GPT-4.
    
    **Guidelines:**
    1. **System Instruction:** Create a robust system instruction that sets constraints, style, format, and avoids common pitfalls.
    2. **User Prompt Template:** Create a template where the user just needs to plug in specific details. Use {{handlebars}} style for placeholders.
    3. **Tone:** Professional, precise, and optimized for the specific goal selected.
    4. **Optimization:** 
       - If coding: emphasize clean code, typescript, error handling, and best practices.
       - If writing: emphasize voice, tone, engagement, and structure.
       - If analysis: emphasize clarity, data structuring, and insight generation.

    Generate the response strictly in JSON format matching the provided schema.
  `;

  // Attempt 1: Try with the Pro model (best quality)
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: metaPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: PROMPT_ENGINEER_SCHEMA,
        systemInstruction: "You are a meta-prompting expert. You build tools for other developers. You always output valid JSON.",
        temperature: 0.5,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response generated");
    return JSON.parse(text) as GeneratedPromptResult;

  } catch (error) {
    console.warn("Gemini 3.0 Pro failed, falling back to Flash...", error);

    // Attempt 2: Fallback to Flash model (more stable/faster) if Pro fails
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: metaPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: PROMPT_ENGINEER_SCHEMA,
          systemInstruction: "You are a meta-prompting expert. You build tools for other developers. You always output valid JSON.",
        },
      });

      const text = response.text;
      if (!text) throw new Error("No response generated from fallback model");
      return JSON.parse(text) as GeneratedPromptResult;
      
    } catch (fallbackError) {
      console.error("Critical Failure:", fallbackError);
      throw fallbackError;
    }
  }
};
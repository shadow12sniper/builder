import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ClientInputData, GeneratedPromptResult } from "../types";

// Initialize the Gemini AI client
// The API key is obtained exclusively from the environment variable.
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("CRITICAL ERROR: API_KEY is missing. Please check your .env file or deployment settings.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'MISSING_KEY' });

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
  // Using gemini-3-pro-preview for complex reasoning and high-quality generation
  const modelId = "gemini-3-pro-preview"; 

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

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: metaPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: PROMPT_ENGINEER_SCHEMA,
        systemInstruction: "You are a meta-prompting expert. You build tools for other developers. You always output valid JSON.",
        temperature: 0.5, // Reduced temperature for more stable JSON structure
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response generated");

    return JSON.parse(text) as GeneratedPromptResult;
  } catch (error) {
    console.error("Error generating prompt:", error);
    throw error;
  }
};
export enum PromptGoal {
  CODING = 'Coding & Development',
  CONTENT = 'Content Creation',
  DATA_ANALYSIS = 'Data Analysis',
  CREATIVE_WRITING = 'Creative Writing',
  BUSINESS_STRATEGY = 'Business Strategy',
  IMAGE_GENERATION = 'Image Generation Prompt',
  OTHER = 'General Assistance'
}

export enum ComplexityLevel {
  BASIC = 'Basic (Direct answer)',
  INTERMEDIATE = 'Intermediate (Step-by-step)',
  ADVANCED = 'Advanced (Deep reasoning/CoT)'
}

export interface ClientInputData {
  rawMessage: string;
  goal: PromptGoal;
  complexity: ComplexityLevel;
  additionalContext?: string;
}

export interface GeneratedPromptResult {
  title: string;
  roleDefinition: string;
  systemInstruction: string;
  userPromptTemplate: string;
  tips: string[];
  reasoning: string;
}

export interface PromptHistoryItem {
  id: string;
  timestamp: number;
  input: ClientInputData;
  output: GeneratedPromptResult;
}
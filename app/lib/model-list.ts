export interface ModelConfig {
  id: string;
  provider: "openai" | "google" | "anthropic";
  modelId: string;
}

export const modelList: ModelConfig[] = [
  // OpenAI Models
  {
    id: "gpt-4.1",
    provider: "openai",
    modelId: "gpt-4.1",
  },
  {
    id: "o4-mini",
    provider: "openai",
    modelId: "o4-mini",
  },

  // Google Models
  {
    id: "gemini-2.5-pro",
    provider: "google",
    modelId: "gemini-2.5-pro",
  },
  {
    id: "gemini-2.5-flash",
    provider: "google",
    modelId: "gemini-2.5-flash",
  },

  // Anthropic Models
  {
    id: "claude-4-sonnet",
    provider: "anthropic",
    modelId: "claude-sonnet-4-20250514",
  },
];

export const defaultModelId = "gemini-2.5-flash";

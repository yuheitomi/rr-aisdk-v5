export interface ModelConfig {
	id: string;
	provider: "openai" | "google" | "anthropic" | "mistral";
	modelId: string;
}

export const modelList: ModelConfig[] = [
	// OpenAI Models
	{
		id: "gpt-4o-mini",
		provider: "openai",
		modelId: "gpt-4o-mini",
	},
	{
		id: "gpt-4.1",
		provider: "openai",
		modelId: "gpt-4-turbo",
	},

	// Google Models
	{
		id: "gemini-2.5-flash",
		provider: "google",
		modelId: "gemini-2.5-flash",
	},
	{
		id: "gemini-2.5-pro",
		provider: "google",
		modelId: "gemini-2.5-pro",
	},

	// Anthropic Models
	{
		id: "claude-4.0-sonnet",
		provider: "anthropic",
		modelId: "claude-4-sonnet-20240229",
	},
	{
		id: "claude-3.5-haiku",
		provider: "anthropic",
		modelId: "claude-3-5-haiku-20241022",
	},
];

export const defaultModelId = "gemini-2.5-flash";

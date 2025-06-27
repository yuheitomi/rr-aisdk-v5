import { anthropic } from "@ai-sdk/anthropic";
import { type GoogleGenerativeAIProviderOptions, google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { defaultModelId, modelList } from "~/lib/model-list";
import type { Route } from "./+types/chat";

export async function action({ request }: Route.ActionArgs) {
  const { messages, modelId }: { messages: UIMessage[]; modelId?: string } = await request.json();
  console.log(`/api/chat called with modelId: ${modelId}`);

  const selectedModelId = modelId || defaultModelId;
  const modelConfig = modelList.find((model) => model.id === selectedModelId);

  if (!modelConfig) {
    throw new Error(`Model ${selectedModelId} not found`);
  }

  const modelMessages = convertToModelMessages(messages);

  let streamResult: ReturnType<typeof streamText>;

  switch (modelConfig.provider) {
    case "openai":
      streamResult = streamText({
        model: openai(modelConfig.modelId),
        messages: modelMessages,
      });
      break;
    case "google":
      streamResult = streamText({
        model: google(modelConfig.modelId),
        messages: modelMessages,
        providerOptions: {
          thinkingConfig: {
            includeThoughts: true,
          },
        } satisfies GoogleGenerativeAIProviderOptions,
      });
      break;
    case "anthropic":
      streamResult = streamText({
        model: anthropic(modelConfig.modelId),
        messages: modelMessages,
      });
      break;
    default:
      throw new Error(`Unsupported provider: ${modelConfig.provider}`);
  }

  return streamResult.toUIMessageStreamResponse();
}

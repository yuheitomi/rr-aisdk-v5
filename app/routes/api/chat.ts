import { anthropic } from "@ai-sdk/anthropic";
import { type GoogleGenerativeAIProviderOptions, google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { addCORSHeaders, createCORSErrorResponse, handleCORS } from "~/lib/cors";
import { defaultModelId, modelList } from "~/lib/model-list";
import type { Route } from "./+types/chat";
import { currentTimeTool } from "./tools";

export async function action({ request }: Route.ActionArgs) {
  const origin = request.headers.get("origin");
  console.log(`/api/chat called with origin: ${origin}`);

  // Handle CORS preflight and origin validation
  const corsResponse = handleCORS(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const { messages, modelId }: { messages: UIMessage[]; modelId?: string } = await request.json();
    console.log(`/api/chat called with modelId: ${modelId}`);

    const selectedModelId = modelId || defaultModelId;
    const modelConfig = modelList.find((model) => model.id === selectedModelId);

    if (!modelConfig) {
      return createCORSErrorResponse(`Model ${selectedModelId} not found`, 400, origin);
    }

    const modelMessages = convertToModelMessages(messages);
    const tools = {
      currentTime: currentTimeTool,
    };

    let streamResult: ReturnType<typeof streamText<typeof tools>>;
    switch (modelConfig.provider) {
      case "openai":
        streamResult = streamText({
          model: openai(modelConfig.modelId),
          messages: modelMessages,
          tools,
        });
        break;
      case "google":
        streamResult = streamText({
          model: google(modelConfig.modelId),
          messages: modelMessages,
          tools,
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
        return createCORSErrorResponse(
          `Unsupported provider: ${modelConfig.provider}`,
          400,
          origin,
        );
    }

    const response = streamResult.toUIMessageStreamResponse();
    return addCORSHeaders(response, origin);
  } catch (error) {
    console.error("Chat API error:", error);
    return createCORSErrorResponse(
      error instanceof Error ? error.message : "Internal server error",
      500,
      origin,
    );
  }
}

// Handle OPTIONS preflight requests
export async function loader({ request }: Route.LoaderArgs) {
  console.log(`/api/chat loader called with origin: ${request.headers.get("origin")}`);
  const corsResponse = handleCORS(request);
  if (corsResponse) {
    return corsResponse;
  }

  // This endpoint only supports POST requests
  const origin = request.headers.get("origin");
  return createCORSErrorResponse("Method not allowed", 405, origin);
}

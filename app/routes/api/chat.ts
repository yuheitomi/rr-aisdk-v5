import { type GoogleGenerativeAIProviderOptions, google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import type { Route } from "./+types/chat";

export async function action({ request }: Route.ActionArgs) {
	const { messages }: { messages: UIMessage[] } = await request.json();
	const modelMessages = convertToModelMessages(messages);
	const result = streamText({
		model: google("gemini-2.5-flash"),
		messages: modelMessages,
		providerOptions: {
			thinkingConfig: {
				includeThoughts: true,
			},
		} satisfies GoogleGenerativeAIProviderOptions,
	});

	return result.toUIMessageStreamResponse();
}

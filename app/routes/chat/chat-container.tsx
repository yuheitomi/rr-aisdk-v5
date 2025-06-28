import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef } from "react";
import { Spinner } from "~/components/ui/spinner";
import { InputForm } from "./input-form";
import { MessageContainer } from "./messages";

export function ChatContainer() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onFinish: (message) => {
      console.log(message);
    },
  });

  const isLoading = status === "streaming";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: correct usage
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      {/* Messages Container - Full screen with bottom padding for input */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-40">
        <div className="mx-auto max-w-3xl space-y-4">
          <MessageContainer messages={messages} />

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-center py-4">
              <Spinner className="h-5 w-5" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed Input Form at Bottom */}
      <div className="fixed right-0 bottom-0 left-0 bg-gray-50 p-4">
        <div className="mx-auto max-w-3xl">
          <InputForm
            status={status}
            onSubmit={(message, modelId) => sendMessage({ text: message }, { body: { modelId } })}
          />
        </div>
      </div>
    </>
  );
}

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Send } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { ModelSelector } from "~/components/model-selector";
import { Button } from "~/components/ui/button";

import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import { defaultModelId } from "~/lib/model-list";

export default function ChatRoute() {
  const [input, setInput] = useState("");
  const [selectedModelId, setSelectedModelId] = useState(defaultModelId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onFinish: (message) => {
      console.log(message);
    },
  });

  const isLoading = status === "streaming";

  // biome-ignore lint/correctness/useExhaustiveDependencies: correct usage
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Keep focus on input when streaming stops
  useEffect(() => {
    if (status !== "streaming") {
      inputRef.current?.focus();
    }
  }, [status]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input }, { body: { modelId: selectedModelId } });
    setInput("");
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Messages Container - Full screen with bottom padding for input */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32">
        <div className="mx-auto max-w-4xl space-y-4">
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
      <div className="fixed right-0 bottom-0 left-0 border-gray-200 border-t bg-gray-50 p-4">
        <div className="mx-auto max-w-4xl">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <ModelSelector selectedModelId={selectedModelId} onModelChange={setSelectedModelId} />
            <Input
              ref={inputRef}
              type="text"
              className="flex-1"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()} className="px-3">
              {isLoading ? <Spinner className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function MessageContainer({ messages }: { messages: UIMessage[] }) {
  return messages.map((message) => {
    if (message.role === "user") {
      return <UserMessage key={message.id} message={message} />;
    }
    return <AIMessage key={message.id} message={message} />;
  });
}

function UserMessage({ message }: { message: UIMessage }) {
  return (
    <div className="mb-4 flex justify-end">
      <div className="max-w-md lg:max-w-xl xl:max-w-2xl">
        <div className="whitespace-pre-wrap px-3 py-1 text-sm text-stone-500">
          <UserMessageText message={message} />
        </div>
      </div>
    </div>
  );
}

function AIMessage({ message }: { message: UIMessage }) {
  return (
    <div className="mb-4 flex justify-start">
      <div className="max-w-[85%]">
        <div className="px-3 py-1 text-sm text-stone-800">
          <AIMessageText message={message} />
        </div>
      </div>
    </div>
  );
}

const UserMessageText = memo(({ message }: { message: UIMessage }) => {
  return (
    <>
      {message.parts.map((part, i) => {
        if (part.type === "text") {
          return <span key={`${message.id}-part-${i}`}>{part.text}</span>;
        }
        return null;
      })}
    </>
  );
});

UserMessageText.displayName = "UserMessageText";

const AIMessageText = memo(({ message }: { message: UIMessage }) => {
  return (
    <>
      {message.parts.map((part, i) => {
        switch (part.type) {
          case "reasoning":
            return (
              <div key={`${message.id}-part-${i}`} className="whitespace-pre-wrap text-sm">
                {part.text}
              </div>
            );
          case "text":
            return (
              <div
                key={`${message.id}-part-${i}`}
                className="whitespace-pre-wrap font-mono text-sm"
              >
                {part.text}
              </div>
            );
          case "step-start":
            return (
              <div key={`${message.id}-part-${i}`} className="whitespace-pre-wrap text-sm">
                Step Start
              </div>
            );
          default:
            return (
              <div key={`${message.id}-part-${i}`} className="whitespace-pre-wrap text-sm">
                {part.type}
              </div>
            );
        }
      })}
    </>
  );
});

AIMessageText.displayName = "AIMessageText";

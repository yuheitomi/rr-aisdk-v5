import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ModelSelector } from "~/components/model-selector";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import { defaultModelId } from "~/lib/model-list";
import { MessageContainer } from "./messages";

export default function ChatRoute() {
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Messages Container - Full screen with bottom padding for input */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-40">
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
          <InputForm
            status={status}
            onSubmit={(message, modelId) => sendMessage({ text: message }, { body: { modelId } })}
          />
        </div>
      </div>
    </div>
  );
}

interface InputFormProps {
  status: string;
  onSubmit: (message: string, modelId: string) => void;
}

function InputForm({ status, onSubmit }: InputFormProps) {
  const [input, setInput] = useState("");
  const [selectedModelId, setSelectedModelId] = useState(defaultModelId);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = status === "streaming";

  // Keep focus on input when streaming stops
  useEffect(() => {
    if (status !== "streaming") {
      inputRef.current?.focus();
    }
  }, [status]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSubmit(input, selectedModelId);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Textarea
        ref={inputRef}
        className="w-full pr-12 pb-12"
        placeholder="Type your message... (Ctrl+Enter to send)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />

      {/* Model Selector - Left Bottom Corner */}
      <div className="absolute bottom-2 left-2">
        <ModelSelector selectedModelId={selectedModelId} onModelChange={setSelectedModelId} />
      </div>

      {/* Submit Button - Right Bottom Corner */}
      <Button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="absolute right-2 bottom-2 h-8 w-8 rounded-full p-0"
      >
        {isLoading ? <Spinner className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
      </Button>
    </form>
  );
}

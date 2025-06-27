import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ModelSelector } from "~/components/model-selector";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
      body: () => ({ modelId: selectedModelId }),
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
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50 p-4">
      <div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col">
        <Card className="flex min-h-0 flex-1 flex-col border-0 bg-white shadow-sm">
          <CardHeader className="flex-shrink-0 pb-4">
            <CardTitle className="text-center font-semibold text-xl">AI Chat</CardTitle>
          </CardHeader>

          <CardContent className="flex min-h-0 flex-1 flex-col pt-0">
            {/* Messages Container */}
            <div className="mb-6 min-h-0 flex-1 space-y-4 overflow-y-auto">
              <MessageContainer messages={messages} />
              {isLoading && (
                <div className="flex justify-center py-4">
                  <Spinner className="h-5 w-5" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="flex-shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <ModelSelector
                  selectedModelId={selectedModelId}
                  onModelChange={setSelectedModelId}
                />
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ConversationStarter() {
  return (
    <div className="mt-20 text-center text-gray-500">
      <div className="mb-4 text-6xl">💬</div>
      <p className="text-sm">Start a conversation with AI</p>
    </div>
  );
}

function MessageContainer({ messages }: { messages: UIMessage[] }) {
  return messages.length === 0 ? (
    <ConversationStarter />
  ) : (
    messages.map((message) => (
      <div
        key={message.id}
        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
      >
        <div
          className={`max-w-md lg:max-w-xl xl:max-w-2xl ${
            message.role === "user" ? "ml-auto" : "mr-auto"
          }`}
        >
          <div className="mb-1 px-1 font-medium text-gray-600 text-xs capitalize">
            {message.role === "user" ? "You" : "AI"}
          </div>
          <div
            className={`rounded-lg p-3 ${
              message.role === "user"
                ? "bg-blue-600 text-white"
                : "border bg-gray-100 text-gray-900"
            }`}
          >
            {message.parts.map((part, i) => {
              if (part.type === "reasoning") {
                return (
                  <div key={`${message.id}-part-${i}`} className="whitespace-pre-wrap text-sm">
                    {part.text}
                  </div>
                );
              }
              if (part.type === "text") {
                return (
                  <div key={`${message.id}-part-${i}`} className="whitespace-pre-wrap text-sm">
                    {part.text}
                  </div>
                );
              }
              return (
                <div key={`${message.id}-part-${i}`} className="whitespace-pre-wrap text-sm">
                  {part.type === "step-start" ? "Step Start" : "Step End"}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    ))
  );
}

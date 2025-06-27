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
    <div className="h-screen bg-gray-50 p-4 flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col min-h-0">
        <Card className="flex-1 flex flex-col min-h-0 shadow-sm border-0 bg-white">
          <CardHeader className="flex-shrink-0 pb-4">
            <CardTitle className="text-center text-xl font-semibold">AI Chat</CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col min-h-0 pt-0">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto mb-6 space-y-4 min-h-0">
              <MessageContainer messages={messages} />
              {isLoading && (
                <div className="flex justify-center py-4">
                  <Spinner className="w-5 h-5" />
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
                  {isLoading ? <Spinner className="w-4 h-4" /> : <Send className="w-4 h-4" />}
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
    <div className="text-center text-gray-500 mt-20">
      <div className="text-6xl mb-4">💬</div>
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
          <div className="text-xs font-medium mb-1 px-1 text-gray-600 capitalize">
            {message.role === "user" ? "You" : "AI"}
          </div>
          <div
            className={`p-3 rounded-lg ${
              message.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-900 border"
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

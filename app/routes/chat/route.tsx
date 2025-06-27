import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ChatRoute() {
  const [input, setInput] = useState("");
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
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="h-screen bg-base-200 p-4 flex flex-col">
      <div className="flex-1 max-w-6xl mx-auto w-full flex flex-col min-h-0">
        <div className="card bg-base-100 shadow-xl flex-1 flex flex-col min-h-0">
          <div className="card-body flex-1 flex flex-col min-h-0">
            <h2 className="card-title justify-center mb-6 flex-shrink-0">AI Chat</h2>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto mb-6 space-y-4 min-h-0 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent max-h-full">
              <MessageContainer messages={messages} />
              {isLoading && <div className="flex justify-center mb-4">Loading...</div>}
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="flex-shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  className="input input-bordered flex-1"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <Send className="w-5 h-5" aria-hidden="true" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversationStarter() {
  return (
    <div className="text-center text-base-content/60 mt-20">
      <div className="text-6xl mb-4">💬</div>
      <p>Start a conversation with AI</p>
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
          <div className="text-sm font-medium mb-1 px-1 capitalize">
            {message.role === "user" ? "You" : "AI"}
          </div>
          <div
            className={`p-3 rounded-md ${
              message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
            }`}
          >
            {message.parts.map((part, i) => {
              if (part.type === "reasoning") {
                return (
                  <div key={`${message.id}-part-${i}`} className="whitespace-pre-wrap">
                    {part.text}
                  </div>
                );
              }
              if (part.type === "text") {
                return (
                  <div key={`${message.id}-part-${i}`} className="whitespace-pre-wrap">
                    {part.text}
                  </div>
                );
              }
              return (
                <div key={`${message.id}-part-${i}`} className="whitespace-pre-wrap">
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

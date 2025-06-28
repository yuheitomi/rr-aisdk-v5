import type { UIMessage } from "ai";
import { memo } from "react";

export function MessageContainer({ messages }: { messages: UIMessage[] }) {
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
    <div className="flex flex-col gap-1">
      {message.parts.map((part, i) => {
        switch (part.type) {
          case "reasoning":
            return (
              <div
                key={`${message.id}-part-${i}-type`}
                className="flex flex-col gap-1 whitespace-pre-wrap font-mono text-sm"
              >
                <span className="font-mono text-stone-600 text-xs">{part.type}</span>
                {part.text}
              </div>
            );
          case "text":
            return (
              <div
                key={`${message.id}-part-${i}`}
                className="flex flex-col gap-1 whitespace-pre-wrap font-mono text-sm"
              >
                <span className="font-mono text-stone-600 text-xs">{part.type}</span>
                {part.text}
              </div>
            );
          case "tool-currentTime":
            return (
              <div
                key={`${message.id}-part-${i}`}
                className="flex flex-col gap-1 whitespace-pre-wrap font-mono text-sm"
              >
                <span className="font-mono text-stone-600 text-xs">{part.type}</span>
                Getting current time...
              </div>
            );
          default:
            return (
              <div
                key={`${message.id}-part-${i}`}
                className="flex flex-col gap-1 whitespace-pre-wrap font-mono text-sm"
              >
                <span className="font-mono text-stone-600 text-xs">{part.type}</span>
                {""}
              </div>
            );
        }
      })}
    </div>
  );
});

AIMessageText.displayName = "AIMessageText";

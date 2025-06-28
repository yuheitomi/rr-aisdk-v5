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
              <div
                key={`${message.id}-part-${i}`}
                className="whitespace-pre-wrap font-mono text-gray-500 text-xs"
              >
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

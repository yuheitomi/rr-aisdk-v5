import type { ChatStatus } from "ai";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ModelSelector } from "~/components/model-selector";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import { defaultModelId } from "~/lib/model-list";

interface InputFormProps {
  status: ChatStatus;
  onSubmit: (message: string, modelId: string) => void;
}

export function InputForm({ status, onSubmit }: InputFormProps) {
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

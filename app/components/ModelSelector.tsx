import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { defaultModelId, type ModelConfig, modelList } from "~/lib/model-list";

interface ModelSelectorProps {
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
}

export function ModelSelector({ selectedModelId, onModelChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedModel =
    modelList.find((model) => model.id === selectedModelId) ||
    modelList.find((model) => model.id === defaultModelId);
  if (!selectedModel) {
    throw new Error(`Model ${selectedModelId} not found`);
  }

  const groupedModels = modelList.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  }, {} as Record<string, ModelConfig[]>);

  // Convert provider key to display name (e.g., "openai" -> "OpenAI")
  const getProviderLabel = (provider: string) => {
    switch (provider) {
      case "openai":
        return "OpenAI";
      case "google":
        return "Google";
      case "anthropic":
        return "Anthropic";
      default:
        // Fallback: capitalize first letter for unknown providers
        return provider.charAt(0).toUpperCase() + provider.slice(1);
    }
  };

  const handleModelSelect = (modelId: string) => {
    onModelChange(modelId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-outline btn-sm flex items-center gap-2 min-w-[140px] justify-between"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">{selectedModel.id}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsOpen(false);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Close model selector"
          />

          {/* Dropdown menu */}
          <div className="absolute top-full left-0 mt-1 w-64 bg-base-100 border border-base-300 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
            {Object.entries(groupedModels).map(([provider, models]) => (
              <div key={provider} className="py-2">
                <div className="px-3 py-1 text-xs font-semibold text-base-content/60 uppercase tracking-wide">
                  {getProviderLabel(provider)}
                </div>
                {models.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => handleModelSelect(model.id)}
                    className={`w-full text-left px-3 py-2 hover:bg-base-200 ${
                      selectedModel.id === model.id ? "bg-primary/10 text-primary" : ""
                    }`}
                  >
                    <div className="font-medium">{model.id}</div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

import { ChevronDown } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { defaultModelId, type ModelConfig, modelList } from "~/lib/model-list";

interface ModelSelectorProps {
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
}

export function ModelSelector({ selectedModelId, onModelChange }: ModelSelectorProps) {
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
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="min-w-[140px] justify-between">
          <span className="truncate">{selectedModel.id}</span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 max-h-80 overflow-y-auto">
        {Object.entries(groupedModels).map(([provider, models]) => (
          <DropdownMenuGroup key={provider}>
            <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wide">
              {getProviderLabel(provider)}
            </DropdownMenuLabel>
            {models.map((model) => (
              <DropdownMenuItem
                key={model.id}
                onSelect={() => handleModelSelect(model.id)}
                className={selectedModel.id === model.id ? "bg-accent text-accent-foreground" : ""}
              >
                <div className="font-medium">{model.id}</div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

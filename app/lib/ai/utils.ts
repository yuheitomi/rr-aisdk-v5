import { writeFileSync } from "node:fs";
import { join } from "node:path";
import type { UIMessage } from "ai";

export function saveMessagesLog(messages: UIMessage[], chatId: string) {
  if (process.env.NODE_ENV === "production") {
    // TODO: set up appropriate storage
    return;
  }

  // Just save to local file for now
  const filePath = join(process.cwd(), "log", `${chatId}.json`);
  writeFileSync(filePath, JSON.stringify(messages, null, 2));
}

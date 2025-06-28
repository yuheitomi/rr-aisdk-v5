import { tool } from "ai";
import { z } from "zod";

const currentTimeTool = tool({
  description: "Get the current time",
  inputSchema: z.object({
    timezone: z.string().optional(),
  }),
  outputSchema: z.object({
    time: z.string(),
  }),
  execute: async ({ timezone }) => {
    const time = new Date().toLocaleString("ja-JP", { timeZone: timezone });
    return { time };
  },
});

export { currentTimeTool };

import { getMcpClient, getOrCreateSessionId, resetMcpClientIfStale } from "$lib/common/server/mcp";
import { json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ cookies }: RequestEvent) {
  const sessionId = getOrCreateSessionId(cookies);
  resetMcpClientIfStale(sessionId);
  const client = await getMcpClient(sessionId);
  const { tools } = await client.listTools();
  return json(tools);
}

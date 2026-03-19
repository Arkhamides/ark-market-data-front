import { getMcpClient, getOrCreateSessionId } from "$lib/common/server/mcp";
import { json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET({ cookies }: RequestEvent) {
  const sessionId = getOrCreateSessionId(cookies);
  const client = await getMcpClient(sessionId);
  const { tools } = await client.listTools();
  return json(tools);
}

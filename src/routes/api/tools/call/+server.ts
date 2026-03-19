import { getMcpClient, getOrCreateSessionId } from "$lib/common/server/mcp";
import { json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";

export async function POST({ request, cookies }: RequestEvent) {
  try {
    const { toolName, arguments: toolArgs } = await request.json();
    const sessionId = getOrCreateSessionId(cookies);
    const client = await getMcpClient(sessionId);
    const result = await client.callTool({
      name: toolName,
      arguments: toolArgs || {},
    });
    return json(result);
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

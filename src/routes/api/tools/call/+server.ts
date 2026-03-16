import { getMcpClient } from "$lib/common/server/mcp";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
  try {
    const { toolName, arguments: toolArgs } = await request.json();

    const client = await getMcpClient();
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

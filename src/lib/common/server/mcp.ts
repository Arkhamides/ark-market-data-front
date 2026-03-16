import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { env } from "$env/dynamic/private";

let client: Client | null = null;

export async function getMcpClient(): Promise<Client> {
    if (client) return client;

    client = new Client({ name: "sveltekit-app", version: "1.0.0" });
    const transport = new StreamableHTTPClientTransport(
        new URL(env.MCP_SERVER_URL ?? "http://localhost:3001/mcp")
    );
    await client.connect(transport);
    return client;
}
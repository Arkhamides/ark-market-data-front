import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { env } from "$env/dynamic/private";

let client: Client | null = null;

export async function getMcpClient(): Promise<Client> {
    if (client) return client;

    const newClient = new Client({ name: "sveltekit-app", version: "1.0.0" });

    newClient.onclose = () => {
        console.warn("MCP client connection closed — will reconnect on next request");
        client = null;
    };

    newClient.onerror = (error: Error) => {
        console.error("MCP client error:", error.message);
        client = null;
    };

    const transport = new StreamableHTTPClientTransport(
        new URL(env.MCP_SERVER_URL ?? "http://localhost:3001/mcp")
    );

    try {
        await newClient.connect(transport);
    } catch (error) {
        client = null;
        throw error;
    }

    client = newClient;
    return client;
}
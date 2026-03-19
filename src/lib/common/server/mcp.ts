import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { env } from "$env/dynamic/private";
import { randomUUID } from "crypto";
import type { Cookies } from "@sveltejs/kit";

const SESSION_COOKIE = "mcp_session";
const clients = new Map<string, Client>();
const pending = new Map<string, Promise<Client>>();

export function getOrCreateSessionId(cookies: Cookies): string {
    let sessionId = cookies.get(SESSION_COOKIE);
    if (!sessionId) {
        sessionId = randomUUID();
        cookies.set(SESSION_COOKIE, sessionId, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 24 hours
        });
    }
    return sessionId;
}

export async function getMcpClient(sessionId: string): Promise<Client> {
    const existing = clients.get(sessionId);
    if (existing) return existing;

    const inFlight = pending.get(sessionId);
    if (inFlight) return inFlight;

    const connectPromise = (async () => {
        const newClient = new Client({ name: "sveltekit-app", version: "1.0.0" });

        newClient.onclose = () => {
            console.warn(`MCP client [${sessionId}] connection closed — will reconnect on next request`);
            clients.delete(sessionId);
        };

        newClient.onerror = (error: Error) => {
            console.error(`MCP client [${sessionId}] error:`, error.message);
            clients.delete(sessionId);
        };

        const transport = new StreamableHTTPClientTransport(
            new URL(env.MCP_SERVER_URL ?? "http://localhost:3001/mcp")
        );

        try {
            await newClient.connect(transport);
            clients.set(sessionId, newClient);
            return newClient;
        } catch (error) {
            clients.delete(sessionId);
            throw error;
        } finally {
            pending.delete(sessionId);
        }
    })();

    pending.set(sessionId, connectPromise);
    return connectPromise;
}

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { env } from "$env/dynamic/private";
import { randomUUID } from "crypto";
import type { Cookies } from "@sveltejs/kit";

const SESSION_COOKIE = "mcp_session";
const clients = new Map<string, Client>();
const clientTimestamps = new Map<string, number>();
const pending = new Map<string, Promise<Client>>();
const CLIENT_TTL_MS = 5 * 60 * 1000; // 5 minutes

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

function evictClient(sessionId: string) {
    clients.delete(sessionId);
    clientTimestamps.delete(sessionId);
}

export function resetMcpClientIfStale(sessionId: string): void {
    const existing = clients.get(sessionId);
    if (!existing) return;
    const age = Date.now() - (clientTimestamps.get(sessionId) ?? 0);
    if (age >= CLIENT_TTL_MS) {
        existing.close();
        evictClient(sessionId);
    }
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
            evictClient(sessionId);
        };

        newClient.onerror = (error: Error) => {
            console.error(`MCP client [${sessionId}] error:`, error.message);
            evictClient(sessionId);
        };

        const transport = new StreamableHTTPClientTransport(
            new URL(env.MCP_SERVER_URL ?? "http://localhost:3001/mcp")
        );

        try {
            await newClient.connect(transport);
            clients.set(sessionId, newClient);
            clientTimestamps.set(sessionId, Date.now());
            return newClient;
        } catch (error) {
            evictClient(sessionId);
            throw error;
        } finally {
            pending.delete(sessionId);
        }
    })();

    pending.set(sessionId, connectPromise);
    return connectPromise;
}

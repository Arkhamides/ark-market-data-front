<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { connectToMCP } from "$lib/common/mcpClient";

  let status = { connected: false, initialized: false };
  let loading = false;
  let error: string | null = null;
  let toolResult: any = null;
  let notifications: any[] = [];
  let sessionReady = false;

  const MCP_URL = "http://localhost:8000/sse";

  let events: string[] = [];
  let tools: any[] = [];
  let sessionId: string | null = null;
  let endpoint: string;

  onMount(() => {
    connectToMCP(handleMCPEvent);
  });

  function handleMCPEvent(type: any, data: any) {
    events = [...events, `${type}: ${data}`];

    if (type === "endpoint") {
      const url = new URL(data, "http://localhost:8000");
      sessionId = url.searchParams.get("session_id");
      endpoint = data;
      console.log("Endpoint received:", endpoint);

      // Wait a bit for server to finish initialization
      setTimeout(() => {
        sessionReady = true;
        console.log("Initialized!");
      }, 500);
    }

    if (type === "message") {
      const msg = JSON.parse(data);

      if (msg.id === "1" && msg.result?.tools) {
        tools = msg.result.tools;
      }
    }
  }

  async function requestTools() {
    if (!sessionId) {
      console.warn("Not ready yet");
      return;
    }

    const body = {
      jsonrpc: "2.0",
      id: "1",
      method: "tools/list",
      params: { cursor: null },
    };

    await fetch(`http://localhost:8000/messages/?session_id=${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }
</script>

<div class="space-y-4 p-4 bg-gray-800">
  <!-- Status -->
  <div class="border rounded p-4">
    <h3 class="font-bold mb-2">MCP Server Status</h3>
    <div class="space-y-1 text-sm">
      <div>
        Connected: <span
          class={status.connected ? "text-green-600" : "text-red-600"}
        >
          {status.connected ? "✓ Yes" : "✗ No"}
        </span>
      </div>
    </div>
  </div>

  <!-- Error Display -->
  {#if error}
    <div class="border border-red-500 rounded p-4 bg-red-50">
      <h4 class="font-bold text-red-700">Error</h4>
      <p class="text-sm text-red-600">{error}</p>
    </div>
  {/if}

  <!-- Tool Calling -->
  <div class="border rounded p-4">
    <h3 class="font-bold mb-2">Tool Calling</h3>
    <div class="space-y-2">
      <button
        class="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
        disabled={!status.initialized || loading}
      >
        {loading ? "Loading..." : "Call Custom Tool"}
      </button>
    </div>
  </div>

  <!-- Tool Result -->
  {#if toolResult}
    <div class="border rounded p-4">
      <h3 class="font-bold mb-2">Tool Result</h3>
      <pre class="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-64">
        {JSON.stringify(toolResult, null, 2)}
      </pre>
    </div>
  {/if}

  <!-- Notifications -->
  {#if notifications.length > 0}
    <div class="border rounded p-4">
      <h3 class="font-bold mb-2">Notifications ({notifications.length})</h3>
      <div class="space-y-2 max-h-64 overflow-auto">
        {#each notifications as notif, idx (idx)}
          <div class="bg-gray-100 p-2 rounded text-xs">
            <pre>{JSON.stringify(notif, null, 2)}</pre>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <button on:click={requestTools} disabled={!sessionReady}> Load Tools </button>

  <div>
    <h2>Events</h2>
    {#each events as e}
      <div>{e}</div>
    {/each}

    <h2>Tools</h2>
    {#each tools as t}
      <div>{t.name}</div>
    {/each}
  </div>
</div>

<style>
  div {
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }
</style>

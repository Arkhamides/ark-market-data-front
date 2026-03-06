<script lang="ts">
  let status = { connected: false, initialized: false };
  let loading = false;
  let error: string | null = null;
  let tools: any[] = [];
  let toolResults: { [key: string]: any } = {};
  let callingTool: string | null = null;

  async function requestTools() {
    loading = true;
    error = null;
    try {
      const response = await fetch("/api/tools");
      if (!response.ok) throw new Error("Failed to load tools");
      const toolsData = await response.json();
      tools = toolsData;
      status.connected = true;
      status.initialized = true;
      console.log(toolsData);
    } catch (err) {
      error = err instanceof Error ? err.message : "Unknown error";
      status.connected = false;
    } finally {
      loading = false;
    }
  }

  async function callTool(toolName: string) {
    callingTool = toolName;
    error = null;
    try {
      const response = await fetch("/api/tools/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolName, arguments: {} }),
      });
      if (!response.ok) throw new Error("Failed to call tool");
      const result = await response.json();
      toolResults[toolName] = result;
      console.log(`Tool ${toolName} result:`, result);
    } catch (err) {
      error = err instanceof Error ? err.message : "Unknown error";
      toolResults[toolName] = { error };
    } finally {
      callingTool = null;
    }
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

  <!-- Load Tools -->
  <div class="border rounded p-4">
    <h3 class="font-bold mb-2">Tools</h3>
    <div class="space-y-2">
      <button
        on:click={requestTools}
        class="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Loading..." : "Load Tools"}
      </button>
    </div>
    {#if tools.length > 0}
      <div class="mt-4 space-y-3">
        {#each tools as tool}
          <div class="bg-gray-100 p-3 rounded text-sm">
            <div class="flex items-center justify-between gap-2">
              <div class="flex-1">
                <div class="font-semibold">{tool.name}</div>
                {#if tool.description}
                  <div class="text-xs text-gray-600">{tool.description}</div>
                {/if}
              </div>
              <button
                on:click={() => callTool(tool.name)}
                disabled={callingTool !== null}
                class="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 disabled:opacity-50 whitespace-nowrap"
              >
                {callingTool === tool.name ? "Calling..." : "Call"}
              </button>
            </div>
            {#if toolResults[tool.name]}
              <div class="mt-2 bg-white p-2 rounded text-xs border border-gray-200">
                <pre class="overflow-auto max-h-40">{JSON.stringify(
                  toolResults[tool.name],
                  null,
                  2
                )}</pre>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
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

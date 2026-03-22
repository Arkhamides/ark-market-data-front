<script lang="ts">
  import { onMount } from "svelte";
  import { marked } from "marked";
  import { alertsStore } from "$lib/stores/alerts";

  interface Message {
    role: "user" | "assistant";
    content: string;
    toolCalls?: {
      name: string;
      input: Record<string, unknown>;
      result: unknown;
    }[];
  }

  interface Tool {
    name: string;
    description?: string;
  }

  let messages: Message[] = [];
  let input: string = "";
  let loading: boolean = false;
  let messagesContainer: HTMLDivElement;
  let tools: Tool[] = [];
  let showTools: boolean = true;

  async function loadTools() {
    loading = true;
    try {
      const response = await fetch("/api/tools");
      const data = await response.json();
      tools = data;

      // Send discovery message automatically
      if (tools.length > 0) {
        const discoveryMessage = "What tools do you have available?";
        messages = [...messages, { role: "user", content: discoveryMessage }];

        const chatResponse = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        const chatData = await chatResponse.json();

        if (chatData.error) {
          messages = [
            ...messages,
            {
              role: "assistant",
              content: `Error: ${chatData.error}`,
            },
          ];
        } else {
          messages = [
            ...messages,
            {
              role: "assistant",
              content: chatData.reply,
              toolCalls: chatData.toolCalls || [],
            },
          ];

          // Refresh alerts if alert tools were called
          if (
            chatData.toolCalls?.some(
              (call: { name: string }) =>
                call.name === "get_alerts" ||
                call.name === "set_price_alert" ||
                call.name === "set_percent_change_alert"
            )
          ) {
            await alertsStore.refresh();
          }
        }

        // Scroll to bottom
        setTimeout(() => {
          if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
        }, 0);
      }
    } catch (error) {
      console.error("Failed to load tools:", error);
    } finally {
      loading = false;
    }
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = input.trim();
    input = "";
    loading = true;

    // Add user message to display
    messages = [...messages, { role: "user", content: userMessage }];

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (data.error) {
        messages = [
          ...messages,
          {
            role: "assistant",
            content: `Error: ${data.error}`,
          },
        ];
      } else {
        messages = [
          ...messages,
          {
            role: "assistant",
            content: data.reply,
            toolCalls: data.toolCalls || [],
          },
        ];

        // Refresh alerts if get_alerts or alert-setting tools were called
        if (
          data.toolCalls?.some(
            (call: { name: string }) =>
              call.name === "get_alerts" ||
              call.name === "set_price_alert" ||
              call.name === "set_percent_change_alert" ||
              call.name === "clear_buffer"
          )
        ) {
          await alertsStore.refresh();
        }
      }
    } catch (error) {
      messages = [
        ...messages,
        {
          role: "assistant",
          content: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ];
    } finally {
      loading = false;
      // Scroll to bottom
      setTimeout(() => {
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 0);
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }
</script>

<div class="chatbot-wrapper">
  <div class="chatbot-layout">
    {#if showTools && tools.length > 0}
      <div class="tools-sidebar">
        <div class="sidebar-header">
          <h3>Available Tools</h3>
          <button class="close-btn" on:click={() => (showTools = false)}
            >✕</button
          >
        </div>
        <div class="tools-list">
          {#each tools as tool}
            <div class="tool-item">
              <p class="tool-name">{tool.name}</p>
              {#if tool.description}
                <p class="tool-desc">{tool.description}</p>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <div class="chatbot-container">
      <div class="chatbot-header">
        <div class="header-content">
          <div>
            <h2>Trading Assistant</h2>
            <p class="subtitle">Chat with your AI assistant about available tools</p>
          </div>
          <button
            class="load-tools-btn"
            on:click={loadTools}
            disabled={loading}
          >
            Load Tools
          </button>
        </div>
      </div>

      <div class="messages-container" bind:this={messagesContainer}>
        {#if messages.length === 0}
          <div class="empty-state">
            <p>Start a conversation to discover and use MCP tools</p>
          </div>
        {/if}

        {#each messages as message (message)}
          <div class={`message message-${message.role}`}>
            <div class="message-bubble">
              {#if message.role === "assistant"}
                <div class="markdown-content">
                  {@html marked(message.content)}
                </div>
              {:else}
                <p>{message.content}</p>
              {/if}
              {#if message.toolCalls && message.toolCalls.length > 0}
                <div class="tool-calls">
                  {#each message.toolCalls as toolCall}
                    <div class="tool-badge">
                      <span class="tool-name">{toolCall.name}</span>
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        {/each}

        {#if loading}
          <div class="message message-assistant">
            <div class="message-bubble loading">
              <span class="dots">●●●</span>
            </div>
          </div>
        {/if}
      </div>

      <div class="input-area">
        <textarea
          bind:value={input}
          on:keydown={handleKeyDown}
          disabled={loading}
          placeholder="Ask a question..."
          rows="3"
        />
        <button on:click={sendMessage} disabled={loading || !input.trim()}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .chatbot-wrapper {
    background: rgba(20, 20, 20, 0.8);
    border: 1px solid rgba(100, 100, 100, 0.2);
    border-radius: 4px;
    margin-top: 2rem;
    backdrop-filter: blur(5px);
    overflow: hidden;
  }

  .chatbot-layout {
    display: flex;
    height: 600px;
    gap: 1px;
  }

  .tools-sidebar {
    width: 220px;
    background: rgba(10, 10, 10, 0.6);
    border-right: 1px solid rgba(100, 100, 100, 0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .sidebar-header {
    padding: 1rem;
    border-bottom: 1px solid rgba(100, 100, 100, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .sidebar-header h3 {
    margin: 0;
    font-size: 0.9rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .close-btn {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    font-size: 1rem;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
  }

  .close-btn:hover {
    color: #888;
  }

  .tools-list {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem;
  }

  .tool-item {
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    background: rgba(50, 50, 50, 0.3);
    border: 1px solid rgba(100, 100, 100, 0.1);
    border-radius: 4px;
    font-size: 0.8rem;
  }

  .tool-name {
    margin: 0 0 0.25rem 0;
    color: #60a5fa;
    font-weight: 600;
  }

  .tool-desc {
    margin: 0;
    color: #888;
    font-size: 0.75rem;
    line-height: 1.3;
  }

  .chatbot-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .chatbot-header {
    background: rgba(0, 0, 0, 0.5);
    padding: 1.5rem;
    border-bottom: 1px solid rgba(100, 100, 100, 0.2);
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .chatbot-header h2 {
    margin: 0;
    font-size: 1.2rem;
    color: #fff;
  }

  .chatbot-header .subtitle {
    margin: 0.5rem 0 0 0;
    font-size: 0.85rem;
    color: #888;
  }

  .load-tools-btn {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
    border: 1px solid rgba(34, 197, 94, 0.3);
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .load-tools-btn:hover:not(:disabled) {
    background: rgba(34, 197, 94, 0.3);
    border-color: rgba(34, 197, 94, 0.5);
  }

  .load-tools-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #666;
  }

  .message {
    display: flex;
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .message-user {
    justify-content: flex-end;
  }

  .message-assistant {
    justify-content: flex-start;
  }

  .message-bubble {
    max-width: 70%;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .message-user .message-bubble {
    background: rgba(34, 197, 94, 0.2);
    border: 1px solid rgba(34, 197, 94, 0.3);
    color: #fff;
  }

  .message-assistant .message-bubble {
    background: rgba(100, 100, 100, 0.1);
    border: 1px solid rgba(100, 100, 100, 0.2);
    color: #e0e0e0;
  }

  .message-bubble p {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .markdown-content {
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .markdown-content :global(p) {
    margin: 0.5rem 0;
  }

  .markdown-content :global(strong) {
    color: #22c55e;
    font-weight: 600;
  }

  .markdown-content :global(ul),
  .markdown-content :global(ol) {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  .markdown-content :global(li) {
    margin: 0.25rem 0;
  }

  .markdown-content :global(code) {
    background: rgba(100, 100, 100, 0.2);
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: "Courier New", monospace;
    font-size: 0.85rem;
  }

  .message-bubble.loading {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dots {
    font-size: 1.5rem;
    letter-spacing: 2px;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
  }

  .tool-calls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  .tool-badge {
    display: inline-flex;
    align-items: center;
    background: rgba(59, 130, 246, 0.2);
    border: 1px solid rgba(59, 130, 246, 0.3);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
  }

  .tool-name {
    color: #60a5fa;
    font-weight: 500;
  }

  .input-area {
    display: flex;
    gap: 0.75rem;
    padding: 1.5rem;
    border-top: 1px solid rgba(100, 100, 100, 0.2);
    background: rgba(0, 0, 0, 0.3);
  }

  textarea {
    flex: 1;
    background: rgba(50, 50, 50, 0.5);
    border: 1px solid rgba(100, 100, 100, 0.2);
    color: #e0e0e0;
    padding: 0.75rem;
    border-radius: 4px;
    font-family: inherit;
    font-size: 0.9rem;
    resize: none;
    transition: border-color 0.2s;
  }

  textarea:focus {
    outline: none;
    border-color: rgba(34, 197, 94, 0.5);
  }

  textarea:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button {
    background: #22c55e;
    color: #000;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    align-self: flex-end;
    font-size: 0.9rem;
  }

  button:hover:not(:disabled) {
    background: #16a34a;
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Scrollbar styling */
  .messages-container::-webkit-scrollbar {
    width: 6px;
  }

  .messages-container::-webkit-scrollbar-track {
    background: rgba(100, 100, 100, 0.1);
  }

  .messages-container::-webkit-scrollbar-thumb {
    background: rgba(100, 100, 100, 0.3);
    border-radius: 3px;
  }

  .messages-container::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 100, 100, 0.5);
  }
</style>

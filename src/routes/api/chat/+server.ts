import { getMcpClient, getOrCreateSessionId } from "$lib/common/server/mcp";
import { json } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "$env/dynamic/private";

interface ToolCall {
  name: string;
  input: Record<string, unknown>;
  result: unknown;
}

export async function POST({ request, cookies }: RequestEvent) {
  const anthropic = new Anthropic({
    apiKey: env.PRIVATE_ANTHROPIC_API_KEY,
  });
  try {
    const { messages, userMessage: currentUserMessage } = await request.json();

    // Fetch MCP tools and convert to Anthropic format
    const sessionId = getOrCreateSessionId(cookies);
    const client = await getMcpClient(sessionId);
    const { tools: mcpTools } = await client.listTools();

    const anthropicTools = mcpTools.map((tool) => ({
      name: tool.name,
      description: tool.description ?? "",
      input_schema: tool.inputSchema ?? { type: "object", properties: {} },
    }));

    // Agentic loop
    let conversationMessages: Anthropic.MessageParam[] = messages;
    const toolCalls: ToolCall[] = [];

    while (true) {
      const response = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        tools: anthropicTools as Anthropic.Tool[],
        messages: conversationMessages,
      });

      // Check if response contains tool uses
      if (response.stop_reason === "end_turn") {
        // Extract final text response
        const textContent = response.content.find(
          (block) => block.type === "text"
        );
        const reply = textContent && "text" in textContent ? textContent.text : "";

        // Log to Google Sheets (fire-and-forget)
        if (env.PRIVATE_SHEETS_WEBHOOK_URL) {
          fetch(env.PRIVATE_SHEETS_WEBHOOK_URL, {
            method: "POST",
            body: JSON.stringify({
              timestamp: new Date().toISOString(),
              userMessage: currentUserMessage ?? "",
              reply,
              sessionId,
            }),
          }).catch(() => {}); // swallow errors — don't block the response
        }

        return json({
          reply,
          toolCalls,
        });
      }

      // Process tool_use blocks
      const toolUseBlocks = response.content.filter(
        (block) => block.type === "tool_use"
      );

      if (toolUseBlocks.length === 0) {
        // No tool use and no text response, return error
        return json(
          { error: "Unexpected response from Claude" },
          { status: 500 }
        );
      }

      // Add assistant message with all content
      conversationMessages.push({
        role: "assistant",
        content: response.content as Anthropic.ContentBlockParam[],
      });

      // Process each tool call
      const toolResults = await Promise.all(
        toolUseBlocks.map(async (block) => {
          if (block.type !== "tool_use") return null;

          const toolName = block.name;
          const toolInput = block.input as Record<string, unknown>;

          try {
            const result = await client.callTool({
              name: toolName,
              arguments: toolInput,
            });

            toolCalls.push({
              name: toolName,
              input: toolInput,
              result: result.content,
            });

            return {
              type: "tool_result" as const,
              tool_use_id: block.id,
              content: JSON.stringify(result.content),
            };
          } catch (error) {
            const errorMsg =
              error instanceof Error ? error.message : "Unknown error";
            return {
              type: "tool_result" as const,
              tool_use_id: block.id,
              content: `Error: ${errorMsg}`,
              is_error: true,
            };
          }
        })
      );

      // Add user message with tool results
      conversationMessages.push({
        role: "user",
        content: toolResults.filter((r) => r !== null) as Anthropic.ToolResultBlockParam[],
      });
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return json({ error: errorMsg }, { status: 500 });
  }
}

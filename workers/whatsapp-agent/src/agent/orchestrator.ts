// Builds prompt, calls LLM, handles tool_use loop
import type { Env } from "../env";
import type { Session, SessionMessage } from "../session/types";
import { buildSystemPrompt } from "./system-prompt";
import { TOOL_DEFINITIONS, executeTool } from "./tools";

const CLAUDE_MODEL = "claude-sonnet-4-6";
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const MAX_TOOL_ROUNDS = 4; // guards against a runaway tool_use loop

export interface TurnInput {
  text?: string;
  image?: { base64: string; mediaType: string };
}

/** Runs one full conversational turn: user message in, assistant reply out (with any tool calls resolved). */
export async function runAgentTurn(env: Env, session: Session, input: TurnInput): Promise<string> {
  const userContent = buildUserContent(input);
  session.history.push({ role: "user", content: userContent, timestamp: Date.now() });

  const systemPrompt = await buildSystemPrompt(env);
  let response = await callClaude(env, systemPrompt, session.history);

  let rounds = 0;
  while (response.stop_reason === "tool_use" && rounds < MAX_TOOL_ROUNDS) {
    rounds++;
    const toolUseBlocks = response.content.filter((c: any) => c.type === "tool_use");

    session.history.push({ role: "assistant", content: response.content, timestamp: Date.now() });

    const toolResultBlocks = [];
    let handedOff = false;

    for (const block of toolUseBlocks) {
      const { tool_result, handedOff: didHandoff } = await executeTool(env, session, block.name, block.input);
      toolResultBlocks.push({
        type: "tool_result",
        tool_use_id: block.id,
        content: JSON.stringify(tool_result),
      });
      if (didHandoff) handedOff = true;
    }

    session.history.push({ role: "user", content: toolResultBlocks, timestamp: Date.now() });

    if (handedOff) {
      // Let the model produce one final "connecting you now" style reply, then stop —
      // further messages on this thread are staff-owned until returned to the bot.
      response = await callClaude(env, systemPrompt, session.history);
      break;
    }

    response = await callClaude(env, systemPrompt, session.history);
  }

  const replyText = extractText(response.content);
  session.history.push({ role: "assistant", content: response.content, timestamp: Date.now() });
  return replyText;
}

function buildUserContent(input: TurnInput): Record<string, unknown>[] {
  const blocks: Record<string, unknown>[] = [];
  if (input.image) {
    blocks.push({
      type: "image",
      source: { type: "base64", media_type: input.image.mediaType, data: input.image.base64 },
    });
  }
  if (input.text) {
    blocks.push({ type: "text", text: input.text });
  }
  return blocks;
}

async function callClaude(env: Env, system: string, history: SessionMessage[]): Promise<any> {
  const res = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system,
      tools: TOOL_DEFINITIONS,
      messages: history.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!res.ok) {
    throw new Error(`Claude API error: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

function extractText(content: Record<string, unknown>[]): string {
  return content
    .filter((c) => c.type === "text")
    .map((c) => c.text as string)
    .join("\n")
    .trim();
}
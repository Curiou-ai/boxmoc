export type SessionStatus = "agent_owned" | "human_owned";

export interface SessionMessage {
  role: "user" | "assistant";
  // string for plain text; array form mirrors Anthropic's content-block shape
  // for tool_use / tool_result turns so the full exchange can be replayed.
  content: string | Record<string, unknown>[];
  timestamp: number;
}

export interface DraftQuote {
  box_type_id: string;
  quantity: number;
  modifiers: string[];
  image_keys: string[]; // R2 object keys
  computed_price_cents?: number;
}

export interface Session {
  wa_id: string;
  customer_name?: string;
  history: SessionMessage[];
  status: SessionStatus;
  current_draft_quote?: DraftQuote;
  last_active: number;
}

/** Cap on turns kept verbatim in KV before older turns should be summarized. */
export const MAX_HISTORY_MESSAGES = 24;
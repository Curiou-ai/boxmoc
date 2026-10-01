export interface Env {
    // Bindings
    DB: D1Database;
    SESSIONS: KVNamespace;
    MEDIA: R2Bucket;
    MESSAGE_QUEUE: Queue<QueueMessage>;
  
    // Vars (wrangler.toml [vars])
    WHATSAPP_PHONE_NUMBER_ID: string;
    WHATSAPP_API_VERSION: string;
    WEBAPP_HANDOFF_WEBHOOK_URL: string;
  
    // Secrets (wrangler secret put)
    WHATSAPP_ACCESS_TOKEN: string;
    WHATSAPP_APP_SECRET: string;
    WHATSAPP_VERIFY_TOKEN: string;
    ANTHROPIC_API_KEY: string;
    WEBAPP_HANDOFF_WEBHOOK_SECRET: string;
    INTERNAL_API_KEY: string;
  }
  
  /** Shape of the message placed on the queue by the webhook receiver. */
  export interface QueueMessage {
    wa_id: string;
    customer_name?: string;
    received_at: number;
    message: InboundMessage;
  }
  
  export type InboundMessage =
    | { type: "text"; text: string }
    | { type: "image"; media_id: string; caption?: string }
    | { type: "unsupported"; raw: unknown };
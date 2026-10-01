// Whatsapp payload types
/** Minimal typing of Meta's WhatsApp Cloud API webhook payload — only the fields this project uses. */

export interface WhatsAppWebhookPayload {
    object: string;
    entry: WhatsAppEntry[];
  }
  
  export interface WhatsAppEntry {
    id: string;
    changes: WhatsAppChange[];
  }
  
  export interface WhatsAppChange {
    field: string;
    value: {
      messaging_product: "whatsapp";
      metadata: { display_phone_number: string; phone_number_id: string };
      contacts?: { profile: { name: string }; wa_id: string }[];
      messages?: WhatsAppMessage[];
      statuses?: WhatsAppStatus[];
    };
  }
  
  export interface WhatsAppMessage {
    from: string; // wa_id
    id: string;
    timestamp: string;
    type: "text" | "image" | "document" | "audio" | "video" | "interactive" | string;
    text?: { body: string };
    image?: { id: string; mime_type: string; sha256: string; caption?: string };
  }
  
  export interface WhatsAppStatus {
    id: string;
    status: "sent" | "delivered" | "read" | "failed";
    timestamp: string;
    recipient_id: string;
  }
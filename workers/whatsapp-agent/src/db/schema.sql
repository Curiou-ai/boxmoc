--D1 Schema (migrations)

-- Box product definitions (the catalog)

CREATE TABLE box_types (
  id TEXT PRIMARY KEY,           -- 'small', 'medium', 'large', 'custom-xl'
  name TEXT NOT NULL,
  base_price_cents INTEGER NOT NULL,
  dimensions_cm TEXT,            -- '20x20x10'
  max_print_area_cm2 INTEGER,
  active BOOLEAN DEFAULT 1
);

-- Modifiers: material, finish, print complexity — each adds/multiplies
CREATE TABLE price_modifiers (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,        -- 'material' | 'finish' | 'print_complexity' | 'rush'
  option_key TEXT NOT NULL,      -- 'kraft', 'glossy', 'full_color', 'express_48h'
  label TEXT NOT NULL,
  adjustment_type TEXT NOT NULL, -- 'flat_cents' | 'percent'
  adjustment_value INTEGER NOT NULL,
  UNIQUE(category, option_key)
);

-- Quantity breaks
CREATE TABLE quantity_tiers (
  box_type_id TEXT NOT NULL,
  min_qty INTEGER NOT NULL,
  discount_percent INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (box_type_id) REFERENCES box_types(id)
);

-- Every quote generated gets logged — both for handoff and for auditing
-- what the agent told a customer
CREATE TABLE quotes (
  id TEXT PRIMARY KEY,
  wa_id TEXT NOT NULL,           -- WhatsApp user id, links to session
  box_type_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  selected_modifiers TEXT NOT NULL, -- JSON array of option_keys
  image_refs TEXT,               -- JSON array of R2 object keys
  custom_text TEXT,
  computed_price_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  created_at INTEGER NOT NULL,
  status TEXT DEFAULT 'draft'    -- 'draft' | 'handed_off' | 'confirmed' | 'expired'
);

CREATE TABLE whatsapp_conversations (
  wa_id TEXT PRIMARY KEY,
  customer_name TEXT,
  status TEXT NOT NULL,          -- 'agent_owned' | 'human_owned' | 'closed'
  assigned_to TEXT,              -- staff user id, once claimed
  last_message_at INTEGER,
  handed_off_at INTEGER,
  created_at INTEGER
);

CREATE TABLE whatsapp_messages (
  id TEXT PRIMARY KEY,
  wa_id TEXT NOT NULL,
  sender TEXT NOT NULL,          -- 'customer' | 'agent_bot' | 'human:{staff_id}'
  content TEXT,
  media_url TEXT,                -- R2 signed URL if it's an image
  created_at INTEGER,
  FOREIGN KEY (wa_id) REFERENCES whatsapp_conversations(wa_id)
);

CREATE TABLE staff_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,           -- 'support_agent' | 'support_lead' | 'admin'
  active BOOLEAN DEFAULT 1,
  created_at INTEGER
);

CREATE TABLE role_permissions (
  role TEXT NOT NULL,
  permission TEXT NOT NULL,     -- 'view_conversations' | 'reply' | 'claim' |
                                 -- 'view_all_conversations' | 'manage_staff' | 'view_pricing_config'
  PRIMARY KEY (role, permission)
);

CREATE TABLE staff_audit_log (
  id TEXT PRIMARY KEY,
  staff_id TEXT NOT NULL,
  action TEXT NOT NULL,          -- 'viewed_conversation' | 'sent_reply' | 'claimed'
  wa_id TEXT,
  created_at INTEGER
);
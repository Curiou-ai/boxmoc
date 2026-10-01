import type { Env } from "../env";
import { loadCatalog } from "./catalog";

export interface PriceInput {
  box_type_id: string;
  quantity: number;
  modifiers?: string[];
}

export interface PriceBreakdownLine {
  label: string;
  delta_cents: number;
}

export interface PriceResult {
  total_cents: number;
  currency: string;
  unit_price_cents: number;
  quantity: number;
  breakdown: PriceBreakdownLine[];
  quantity_discount_percent: number;
}

export class PricingError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

/**
 * Pure, deterministic price calculation — this is what the LLM's `get_price`
 * tool calls into. Numbers never come from the model itself, so the agent
 * cannot hallucinate a price.
 */
export async function computePrice(env: Env, input: PriceInput): Promise<PriceResult> {
  if (!input.quantity || input.quantity < 1) {
    throw new PricingError("invalid_quantity", "Quantity must be at least 1");
  }

  const { boxTypes, modifiers } = await loadCatalog(env);
  const boxType = boxTypes.find((b) => b.id === input.box_type_id);
  if (!boxType) {
    throw new PricingError("unknown_box_type", `No active box type '${input.box_type_id}'`);
  }

  let unitCents = boxType.base_price_cents;
  const breakdown: PriceBreakdownLine[] = [{ label: boxType.name, delta_cents: boxType.base_price_cents }];

  for (const key of input.modifiers ?? []) {
    const mod = modifiers.find((m) => m.option_key === key);
    if (!mod) continue; // unknown modifier key — ignore rather than fail the whole quote

    if (mod.adjustment_type === "flat_cents") {
      unitCents += mod.adjustment_value;
      breakdown.push({ label: mod.label, delta_cents: mod.adjustment_value });
    } else {
      const delta = Math.round(unitCents * (mod.adjustment_value / 100));
      unitCents += delta;
      breakdown.push({ label: `${mod.label} (+${mod.adjustment_value}%)`, delta_cents: delta });
    }
  }

  let totalCents = unitCents * input.quantity;

  const tier = await env.DB.prepare(
    `SELECT * FROM quantity_tiers WHERE box_type_id = ?1 AND min_qty <= ?2 ORDER BY min_qty DESC LIMIT 1`
  )
    .bind(input.box_type_id, input.quantity)
    .first<{ discount_percent: number; min_qty: number }>();

  const discountPercent = tier?.discount_percent ?? 0;
  if (discountPercent > 0) {
    totalCents = Math.round(totalCents * (1 - discountPercent / 100));
  }

  return {
    total_cents: totalCents,
    currency: "USD",
    unit_price_cents: unitCents,
    quantity: input.quantity,
    breakdown,
    quantity_discount_percent: discountPercent,
  };
}

/** Persists a quote so it can be surfaced in the admin dashboard on handoff. */
export async function saveQuote(
  env: Env,
  wa_id: string,
  input: PriceInput,
  result: PriceResult,
  imageKeys: string[],
  customText?: string
): Promise<string> {
  const id = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO quotes (id, wa_id, box_type_id, quantity, selected_modifiers, image_refs, custom_text, computed_price_cents, currency, created_at, status)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, 'draft')`
  )
    .bind(
      id,
      wa_id,
      input.box_type_id,
      input.quantity,
      JSON.stringify(input.modifiers ?? []),
      JSON.stringify(imageKeys),
      customText ?? null,
      result.total_cents,
      result.currency,
      Date.now()
    )
    .run();
  return id;
}
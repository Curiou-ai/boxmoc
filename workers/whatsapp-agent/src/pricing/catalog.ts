// Catalog read/cache helpers

import type { Env } from "../env";

export interface BoxType {
  id: string;
  name: string;
  base_price_cents: number;
  dimensions_cm: string | null;
  max_print_area_cm2: number | null;
  active: number;
}

export interface PriceModifier {
  id: string;
  category: string;
  option_key: string;
  label: string;
  adjustment_type: "flat_cents" | "percent";
  adjustment_value: number;
}

const CATALOG_CACHE_KEY = "catalog:v1";
const CATALOG_CACHE_TTL_MS = 5 * 60 * 1000;

let memoryCache: { boxTypes: BoxType[]; modifiers: PriceModifier[]; cachedAt: number } | null = null;

/**
 * Catalog changes rarely relative to conversation volume, so cache it in-memory
 * per Worker isolate (cheap, resets on redeploy/cold start) rather than hitting
 * D1 on every single tool call.
 */
export async function loadCatalog(env: Env): Promise<{ boxTypes: BoxType[]; modifiers: PriceModifier[] }> {
  if (memoryCache && Date.now() - memoryCache.cachedAt < CATALOG_CACHE_TTL_MS) {
    return memoryCache;
  }

  const [boxTypesResult, modifiersResult] = await Promise.all([
    env.DB.prepare("SELECT * FROM box_types WHERE active = 1").all<BoxType>(),
    env.DB.prepare("SELECT * FROM price_modifiers").all<PriceModifier>(),
  ]);

  memoryCache = {
    boxTypes: boxTypesResult.results,
    modifiers: modifiersResult.results,
    cachedAt: Date.now(),
  };
  return memoryCache;
}

/** Renders the catalog as compact text for the LLM's system prompt. */
export async function catalogAsPromptText(env: Env): Promise<string> {
  const { boxTypes, modifiers } = await loadCatalog(env);

  const boxLines = boxTypes.map(
    (b) => `- ${b.id}: "${b.name}", base price $${(b.base_price_cents / 100).toFixed(2)}, dimensions ${b.dimensions_cm ?? "n/a"}`
  );
  const modLines = modifiers.map((m) => {
    const delta =
      m.adjustment_type === "flat_cents"
        ? `+$${(m.adjustment_value / 100).toFixed(2)}`
        : `+${m.adjustment_value}%`;
    return `- ${m.category}/${m.option_key}: "${m.label}" (${delta})`;
  });

  return [
    "Available box types:",
    ...boxLines,
    "",
    "Available modifiers (material, finish, print complexity, rush):",
    ...modLines,
  ].join("\n");
}

export function invalidateCatalogCache(): void {
  memoryCache = null;
}
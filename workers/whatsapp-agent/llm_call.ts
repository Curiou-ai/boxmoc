// Tool definition passed to Claude
{
    name: "get_price",
    description: "Compute the price for a custom box configuration",
    input_schema: {
      type: "object",
      properties: {
        box_type_id: { type: "string" },
        quantity: { type: "integer", minimum: 1 },
        modifiers: {
          type: "array",
          items: { type: "string" },
          description: "option_keys, e.g. ['kraft','glossy','full_color']"
        }
      },
      required: ["box_type_id", "quantity"]
    }
}
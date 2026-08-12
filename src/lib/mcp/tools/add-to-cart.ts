import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "add_to_cart",
  title: "Add to cart",
  description: "Add a product to the signed-in user's shopping cart.",
  inputSchema: {
    product_id: z.string().uuid().describe("The product id to add."),
    quantity: z.number().int().min(1).max(1000).optional().describe("Quantity to add (default 1)."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ product_id, quantity }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const userId = ctx.getUserId();
    const { data, error } = await supabase
      .from("cart_items")
      .insert({ user_id: userId, product_id, quantity: quantity ?? 1 })
      .select("id,product_id,quantity");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data?.[0] ?? {}) }], structuredContent: { item: data?.[0] } };
  },
});

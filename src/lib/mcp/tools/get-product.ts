import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "get_product",
  title: "Get product",
  description: "Fetch a single product by its id, including price, stock and description.",
  inputSchema: { product_id: z.string().uuid().describe("The product id.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ product_id }) => {
    const { data, error } = await supabaseAnon()
      .from("products")
      .select("id,name,category,description,price,stock,image_url")
      .eq("id", product_id)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: "Product not found" }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: { product: data } };
  },
});

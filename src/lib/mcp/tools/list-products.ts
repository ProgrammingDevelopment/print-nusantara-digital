import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_products",
  title: "List products",
  description: "List printing products in the catalog, optionally filtered by category or search text.",
  inputSchema: {
    search: z.string().trim().min(1).optional().describe("Text to match against product name."),
    category: z.string().trim().min(1).optional().describe("Filter by product category."),
    limit: z.number().int().min(1).max(50).optional().describe("Maximum products to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ search, category, limit }) => {
    let query = supabaseAnon()
      .from("products")
      .select("id,name,category,description,price,stock,image_url")
      .order("name")
      .limit(limit ?? 20);
    if (category) query = query.eq("category", category);
    if (search) query = query.ilike("name", `%${search}%`);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { products: data ?? [] },
    };
  },
});

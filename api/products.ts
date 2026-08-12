import { z } from "zod";
import {
  getPagination,
  getQueryValue,
  handleOptions,
  readBody,
  rejectMethod,
  sendJson,
  setCorsHeaders,
} from "./_lib/http";
import { requireToken } from "./_lib/security";
import { getSupabaseAdmin, getSupabaseServer } from "./_lib/supabase-admin";
import type { ApiHandler } from "./_lib/types";

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().nullable().optional(),
  category: z.string().min(2),
  price: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative().optional(),
  image_url: z.string().url().nullable().optional(),
});

const productUpdateSchema = productSchema.partial().extend({
  id: z.string().uuid(),
});

const requireAdmin = (request: Parameters<ApiHandler>[0], response: Parameters<ApiHandler>[1]) =>
  requireToken(request, response, process.env.ADMIN_API_TOKEN, "x-admin-token");

const handler: ApiHandler = async (request, response) => {
  if (handleOptions(request, response)) return;
  setCorsHeaders(response);

  try {
    if (request.method === "GET") {
      const supabase = getSupabaseServer();
      const { offset, rangeEnd } = getPagination(request);
      const category = getQueryValue(request, "category");
      const search = getQueryValue(request, "search").trim();

      let query = supabase
        .from("products")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, rangeEnd);

      if (category && category !== "all") {
        query = query.eq("category", category);
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error, count } = await query;
      if (error) throw error;

      sendJson(response, 200, {
        data: data ?? [],
        meta: {
          count: count ?? 0,
          complexity: "O(pageSize) with indexed filters; avoids N+1 by reading products in one query.",
        },
      });
      return;
    }

    if (!requireAdmin(request, response)) return;
    const supabase = getSupabaseAdmin();

    if (request.method === "POST") {
      const body = productSchema.parse(await readBody(request));
      const { data, error } = await supabase
        .from("products")
        .insert(body)
        .select("*")
        .single();

      if (error) throw error;
      sendJson(response, 201, { data });
      return;
    }

    if (request.method === "PUT" || request.method === "PATCH") {
      const { id, ...body } = productUpdateSchema.parse(await readBody(request));
      const { data, error } = await supabase
        .from("products")
        .update(body)
        .eq("id", id)
        .select("*")
        .single();

      if (error) throw error;
      sendJson(response, 200, { data });
      return;
    }

    if (request.method === "DELETE") {
      const id = z.string().uuid().parse(getQueryValue(request, "id"));
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;
      sendJson(response, 200, { data: { id } });
      return;
    }

    rejectMethod(response, ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected API error";
    sendJson(response, 400, { error: message });
  }
};

export default handler;

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
import { publish } from "./_lib/event-bus";
import { requireToken } from "./_lib/security";
import { getSupabaseAdmin } from "./_lib/supabase-admin";
import type { ApiHandler } from "./_lib/types";

const orderItemSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().positive(),
  price: z.number().int().nonnegative(),
});

const createOrderSchema = z.object({
  user_id: z.string().uuid(),
  phone: z.string().min(6),
  shipping_address: z.string().min(5),
  shipping_city: z.string().min(2),
  items: z.array(orderItemSchema).min(1),
});

const updateOrderSchema = z.object({
  id: z.string().uuid(),
  status: z.string().min(2).optional(),
  phone: z.string().min(6).optional(),
  shipping_address: z.string().min(5).optional(),
  shipping_city: z.string().min(2).optional(),
});

const requireAdmin = (request: Parameters<ApiHandler>[0], response: Parameters<ApiHandler>[1]) =>
  requireToken(request, response, process.env.ADMIN_API_TOKEN, "x-admin-token");

const handler: ApiHandler = async (request, response) => {
  if (handleOptions(request, response)) return;
  setCorsHeaders(response);

  if (!requireAdmin(request, response)) return;

  try {
    const supabase = getSupabaseAdmin();

    if (request.method === "GET") {
      const { offset, rangeEnd } = getPagination(request);
      const id = getQueryValue(request, "id");
      const userId = getQueryValue(request, "user_id");
      const status = getQueryValue(request, "status");

      let query = supabase
        .from("orders")
        .select("*, order_items(*, products(*))", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, rangeEnd);

      if (id) query = query.eq("id", id);
      if (userId) query = query.eq("user_id", userId);
      if (status) query = query.eq("status", status);

      const { data, error, count } = await query;
      if (error) throw error;

      sendJson(response, 200, {
        data: data ?? [],
        meta: {
          count: count ?? 0,
          complexity: "O(orders + orderItems) in one nested query; avoids N+1 per-order item fetches.",
        },
      });
      return;
    }

    if (request.method === "POST") {
      const body = createOrderSchema.parse(await readBody(request));
      const totalAmount = body.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: body.user_id,
          phone: body.phone,
          shipping_address: body.shipping_address,
          shipping_city: body.shipping_city,
          total_amount: totalAmount,
        })
        .select("*")
        .single();

      if (orderError) throw orderError;

      const { error: itemsError } = await supabase.from("order_items").insert(
        body.items.map((item) => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })),
      );

      if (itemsError) {
        await supabase.from("orders").delete().eq("id", order.id);
        throw itemsError;
      }

      const event = publish("order.created", { orderId: order.id, totalAmount });
      sendJson(response, 201, { data: order, event });
      return;
    }

    if (request.method === "PUT" || request.method === "PATCH") {
      const { id, ...body } = updateOrderSchema.parse(await readBody(request));
      const { data, error } = await supabase
        .from("orders")
        .update(body)
        .eq("id", id)
        .select("*")
        .single();

      if (error) throw error;
      const event = publish("order.updated", { orderId: id, status: data.status });
      sendJson(response, 200, { data, event });
      return;
    }

    if (request.method === "DELETE") {
      const id = z.string().uuid().parse(getQueryValue(request, "id"));
      const { error } = await supabase.from("orders").delete().eq("id", id);

      if (error) throw error;
      const event = publish("order.deleted", { orderId: id });
      sendJson(response, 200, { data: { id }, event });
      return;
    }

    rejectMethod(response, ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected API error";
    sendJson(response, 400, { error: message });
  }
};

export default handler;

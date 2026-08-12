import { z } from "zod";
import { handleOptions, readBody, rejectMethod, sendJson, setCorsHeaders } from "../_lib/http";
import { publish } from "../_lib/event-bus";
import { requireToken } from "../_lib/security";
import type { ApiHandler } from "../_lib/types";

const webhookPayloadSchema = z
  .object({
    type: z.string().optional(),
    table: z.string().optional(),
    eventType: z.string().optional(),
    record: z.unknown().optional(),
    old_record: z.unknown().optional(),
  })
  .passthrough();

const handler: ApiHandler = async (request, response) => {
  if (handleOptions(request, response)) return;
  setCorsHeaders(response);

  if (request.method !== "POST") {
    rejectMethod(response, ["POST", "OPTIONS"]);
    return;
  }

  if (!requireToken(request, response, process.env.WEBHOOK_SECRET, "x-webhook-token")) {
    return;
  }

  try {
    const payload = webhookPayloadSchema.parse(await readBody(request));
    const table = payload.table ?? "unknown";
    const eventType = payload.eventType ?? payload.type ?? "changed";
    const event = publish(`db.${table}.${eventType}`.toLowerCase(), payload);

    sendJson(response, 202, { accepted: true, event });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook payload";
    sendJson(response, 400, { error: message });
  }
};

export default handler;

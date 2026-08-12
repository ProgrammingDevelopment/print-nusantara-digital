import { handleOptions, sendJson, setCorsHeaders } from "./_lib/http";
import { serializeSseEvent, subscribe } from "./_lib/event-bus";
import { getQueryValue } from "./_lib/http";
import type { ApiHandler } from "./_lib/types";

export const config = {
  maxDuration: 60,
};

const handler: ApiHandler = (request, response) => {
  if (handleOptions(request, response)) return;

  if (request.method !== "GET") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  const clientToken = process.env.EVENTS_CLIENT_TOKEN;
  if (clientToken && getQueryValue(request, "token") !== clientToken) {
    setCorsHeaders(response);
    sendJson(response, 401, { error: "Unauthorized" });
    return;
  }

  setCorsHeaders(response);
  response.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  response.write(": connected\n\n");
  response.write(
    serializeSseEvent({
      id: "ready",
      type: "system.ready",
      createdAt: new Date().toISOString(),
      payload: { message: "SSE stream ready" },
    }),
  );

  const unsubscribe = subscribe((event) => {
    response.write(serializeSseEvent(event));
  });

  const heartbeat = setInterval(() => {
    response.write(": heartbeat\n\n");
  }, 25_000);

  request.on("close", () => {
    clearInterval(heartbeat);
    unsubscribe();
    response.end();
  });
};

export default handler;

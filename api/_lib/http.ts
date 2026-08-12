import type { ApiRequest, ApiResponse } from "./types";

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 100;

export const setCorsHeaders = (response: ApiResponse) => {
  response.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN ?? "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Admin-Token, X-Webhook-Token");
};

export const sendJson = (
  response: ApiResponse,
  statusCode: number,
  body: unknown,
) => {
  response.status(statusCode).json(body);
};

export const rejectMethod = (response: ApiResponse, allowedMethods: string[]) => {
  response.setHeader("Allow", allowedMethods.join(", "));
  sendJson(response, 405, { error: "Method not allowed" });
};

export const getQueryValue = (
  request: ApiRequest,
  key: string,
  fallback = "",
) => {
  const value = request.query?.[key];
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
};

export const getPagination = (request: ApiRequest) => {
  const rawLimit = Number(getQueryValue(request, "limit", String(DEFAULT_LIMIT)));
  const rawOffset = Number(getQueryValue(request, "offset", "0"));
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(Math.trunc(rawLimit), 1), MAX_LIMIT)
    : DEFAULT_LIMIT;
  const offset = Number.isFinite(rawOffset) ? Math.max(Math.trunc(rawOffset), 0) : 0;

  return {
    limit,
    offset,
    rangeEnd: offset + limit - 1,
  };
};

export const handleOptions = (request: ApiRequest, response: ApiResponse) => {
  setCorsHeaders(response);
  if (request.method === "OPTIONS") {
    response.status(204).end();
    return true;
  }

  return false;
};

export const readBody = async <TBody>(request: ApiRequest<TBody>) => {
  if (request.body && typeof request.body === "object") {
    return request.body;
  }

  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  if (!rawBody) return {} as TBody;

  return JSON.parse(rawBody) as TBody;
};

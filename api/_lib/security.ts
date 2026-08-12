import { timingSafeEqual } from "node:crypto";
import type { ApiRequest, ApiResponse } from "./types";
import { sendJson } from "./http";

const safeCompare = (actual: string, expected: string) => {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
};

const getHeader = (request: ApiRequest, name: string) => {
  const value = request.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
};

export const getBearerToken = (request: ApiRequest) => {
  const authorization = getHeader(request, "authorization");
  if (!authorization?.startsWith("Bearer ")) return "";
  return authorization.slice("Bearer ".length);
};

export const requireToken = (
  request: ApiRequest,
  response: ApiResponse,
  expectedToken: string | undefined,
  headerName: "x-admin-token" | "x-webhook-token",
) => {
  if (!expectedToken) {
    sendJson(response, 500, { error: "Server token is not configured" });
    return false;
  }

  const headerToken = getHeader(request, headerName) ?? "";
  const bearerToken = getBearerToken(request);
  const providedToken = headerToken || bearerToken;

  if (!providedToken || !safeCompare(providedToken, expectedToken)) {
    sendJson(response, 401, { error: "Unauthorized" });
    return false;
  }

  return true;
};

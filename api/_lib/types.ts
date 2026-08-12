import type { IncomingMessage, ServerResponse } from "node:http";

export type ApiRequest<TBody = unknown> = IncomingMessage & {
  body?: TBody;
  query?: Record<string, string | string[] | undefined>;
  method?: string;
};

export type ApiResponse = ServerResponse & {
  status: (statusCode: number) => ApiResponse;
  json: (body: unknown) => void;
};

export type ApiHandler<TBody = unknown> = (
  request: ApiRequest<TBody>,
  response: ApiResponse,
) => Promise<void> | void;

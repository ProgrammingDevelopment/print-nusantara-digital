import { getErrorMessage } from "@/lib/errors";

type ApiEnvelope<TData> = {
  data: TData;
  meta?: {
    count?: number;
    complexity?: string;
  };
};

export async function fetchJson<TData>(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  const response = await fetch(input, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      getErrorMessage(payload, `Request failed with ${response.status}`),
    );
  }

  return payload as ApiEnvelope<TData>;
}

export const buildQueryString = (
  params: Record<string, string | number | undefined>,
) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

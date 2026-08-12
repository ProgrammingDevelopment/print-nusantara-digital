import { getErrorMessage } from "@/lib/errors";
import { getApiUrl } from "@/lib/load-balancer";

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
  const resolvedInput =
    typeof input === "string" && input.startsWith("/") && import.meta.env.VITE_API_REGIONS
      ? await getApiUrl(input)
      : input;

  const response = await fetch(resolvedInput, {
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

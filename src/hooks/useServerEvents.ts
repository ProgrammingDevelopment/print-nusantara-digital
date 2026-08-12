import { useEffect } from "react";

type ServerEventHandler = (event: MessageEvent) => void;

export function useServerEvents(
  eventHandlers: Record<string, ServerEventHandler>,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled || typeof EventSource === "undefined") return;

    const token = import.meta.env.VITE_EVENTS_CLIENT_TOKEN;
    const url = token ? `/api/events?token=${encodeURIComponent(token)}` : "/api/events";
    const source = new EventSource(url);

    Object.entries(eventHandlers).forEach(([eventName, handler]) => {
      source.addEventListener(eventName, handler);
    });

    return () => {
      Object.entries(eventHandlers).forEach(([eventName, handler]) => {
        source.removeEventListener(eventName, handler);
      });
      source.close();
    };
  }, [enabled, eventHandlers]);
}

export type ServerEvent = {
  id: string;
  type: string;
  createdAt: string;
  payload: unknown;
};

type Listener = (event: ServerEvent) => void;

const listeners = new Set<Listener>();

export const subscribe = (listener: Listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const publish = (type: string, payload: unknown) => {
  const event: ServerEvent = {
    id: randomUUID(),
    type,
    createdAt: new Date().toISOString(),
    payload,
  };

  listeners.forEach((listener) => listener(event));
  return event;
};

export const serializeSseEvent = (event: ServerEvent) =>
  `id: ${event.id}\nevent: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
import { randomUUID } from "node:crypto";

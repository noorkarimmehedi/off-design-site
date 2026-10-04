import type { Selection } from "./catalog"

// Per-client order links: /order/<slug>. Add an entry here to send a client a pre-filled order.
// Unknown slugs still work — the client simply types their business name.
export type ClientPreset = { name: string; selection?: Selection }

export const CLIENTS: Record<string, ClientPreset> = {
  "sera-khabar": { name: "সেরা খাবার", selection: { landing: 5 } },
}

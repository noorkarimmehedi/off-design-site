// In-memory sliding-window limiter, keyed by client IP. Counts live in the server instance's
// memory, so on serverless each warm instance keeps its own tally: good enough to stop casual
// abuse of /api/ask, not a hard global cap. Swap for a shared store (Upstash, KV) if that's needed.

type Window = { limit: number; ms: number }

const hits = new Map<string, number[]>()
const MAX_KEYS = 10_000

export function clientIp(req: Request): string {
  const h = req.headers
  return (
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  )
}

/** Records a hit for `key` unless a window is full. Returns seconds to wait when limited, else 0. */
export function rateLimit(key: string, windows: Window[]): number {
  const now = Date.now()
  const longest = Math.max(...windows.map((w) => w.ms))
  const times = (hits.get(key) ?? []).filter((t) => now - t < longest)

  for (const w of windows) {
    const inWindow = times.filter((t) => now - t < w.ms)
    if (inWindow.length >= w.limit) {
      hits.set(key, times)
      return Math.ceil((inWindow[0] + w.ms - now) / 1000)
    }
  }

  times.push(now)
  hits.delete(key) // re-insert so the Map stays in least-recently-used order
  hits.set(key, times)
  if (hits.size > MAX_KEYS) hits.delete(hits.keys().next().value!)
  return 0
}

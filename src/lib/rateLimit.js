// Sliding-window limit per visitor, kept in this server instance's memory. Vercel can run several instances, so it
// is a soft cap that stops one visitor from draining the free AI quota, not a hard guarantee.
export function createRateLimiter({ limit, windowMs, now = Date.now, maxKeys = 5000 }) {
  const hits = new Map();
  return (key) => {
    const time = now();
    const recent = (hits.get(key) ?? []).filter((hit) => time - hit < windowMs);
    const allowed = recent.length < limit;
    if (allowed) recent.push(time);
    if (!hits.has(key) && hits.size >= maxKeys) hits.clear();
    hits.set(key, recent);
    return allowed;
  };
}

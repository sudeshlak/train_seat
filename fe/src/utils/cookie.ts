export function bumpRouteClick(routeId: number) {
    const counts = readFrequentCookie(); // parse JSON or {}
    counts[routeId] = (counts[routeId] ?? 0) + 1;
    document.cookie = `frequentRoutes=${JSON.stringify(counts)}; path=/; max-age=2592000; samesite=lax`;
}

export function readFrequentCookie(): Record<number, number> {
  const match = document.cookie.match(/(^|;)frequentRoutes=([^;]*)/);
  if (!match) return {};
  try {
    return JSON.parse(decodeURIComponent(match[2]));
  } catch {
    return {};
  }
}
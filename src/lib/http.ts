export async function fetchJson<T = any>(
  url: string,
  { timeoutMs = 8000 }: { timeoutMs?: number } = {},
): Promise<T> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) {
    throw new Error(`Request to ${url} failed with status ${response.status}`);
  }
  return response.json();
}
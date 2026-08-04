export async function fetchJson(
  url: string,
  options?: { timeoutMs?: number },
): Promise<unknown>;
export async function fetchJson<T>(
  url: string,
  options?: { timeoutMs?: number },
): Promise<T>;
export async function fetchJson(
  url: string,
  { timeoutMs = 8000 }: { timeoutMs?: number } = {},
): Promise<unknown> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new Error(`Request to ${url} failed with status ${response.status}`);
  }

  return response.json() as Promise<unknown>;
}

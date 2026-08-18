const REQUEST_TIMEOUT_MS = 9000;

const APPROVED_OPEN_METEO_HOSTS = new Set([
  "geocoding-api.open-meteo.com",
  "api.open-meteo.com",
]);

export async function fetchJson(
  url: string | URL,
  options?: { timeoutMs?: number },
): Promise<unknown>;

export async function fetchJson<T>(
  url: string | URL,
  options?: { timeoutMs?: number },
): Promise<T>;

export async function fetchJson(
  url: string | URL,
  { timeoutMs = REQUEST_TIMEOUT_MS }: { timeoutMs?: number } = {},
): Promise<unknown> {
  let requestUrl: URL;

  try {
    requestUrl = typeof url === "string" ? new URL(url) : url;
  } catch {
    throw new Error("WEATHER_API_ERROR");
  }

  if (
    requestUrl.protocol !== "https:" ||
    !APPROVED_OPEN_METEO_HOSTS.has(requestUrl.hostname)
  ) {
    throw new Error("WEATHER_API_ERROR");
  }

  let response: Response;

  try {
    response = await fetch(requestUrl, {
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "TimeoutError" ||
        error.name === "AbortError")
    ) {
      throw new Error("REQUEST_TIMEOUT");
    }

    throw new Error("WEATHER_API_ERROR");
  }

  if (!response.ok) {
    throw new Error("WEATHER_API_ERROR");
  }

  try {
    return (await response.json()) as unknown;
  } catch {
    throw new Error("WEATHER_API_ERROR");
  }
}
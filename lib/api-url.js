import { getAuthTokenFromStore } from "@/lib/auth";

export function getApiUrl(path) {
  const base = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "").trim();

  if (!base) {
    throw new Error("API_URL is not set");
  }

  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  return new URL(path.replace(/^\//, ""), normalizedBase).toString();
}

function withSecretKey(initHeaders) {
  const secret = (process.env.API_SECRET_KEY || "").trim();

  if (!secret) {
    throw new Error("API_SECRET_KEY is not set");
  }

  const headers = new Headers(initHeaders);
  headers.set("X-Secret-Key", secret);
  return headers;
}

export async function fetchApi(path, init = {}) {
  return fetch(getApiUrl(path), {
    ...init,
    headers: withSecretKey(init.headers),
    cache: init.cache ?? "no-store",
  });
}

export async function forwardApiResponse(response) {
  const text = await response.text().catch(() => "");
  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  return Response.json(data, { status: response.status });
}

export async function fetchWithAuth(cookieStore, path, init = {}) {
  const token = getAuthTokenFromStore(cookieStore);

  if (!token) {
    return { unauthorized: true };
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);

  const response = await fetchApi(path, {
    ...init,
    headers,
  });

  return { response };
}

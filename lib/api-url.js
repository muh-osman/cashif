import { getAuthTokenFromStore } from "@/lib/auth";

export function getApiUrl(path) {
  const base = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "").trim();

  if (!base) {
    throw new Error("API_URL is not set");
  }

  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  return new URL(path.replace(/^\//, ""), normalizedBase).toString();
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

  const response = await fetch(getApiUrl(path), {
    ...init,
    headers,
    cache: "no-store",
  });

  return { response };
}

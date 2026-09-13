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

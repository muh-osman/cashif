export function getApiUrl(path) {
  const base = (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "").trim();

  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  return new URL(path.replace(/^\//, ""), normalizedBase).toString();
}

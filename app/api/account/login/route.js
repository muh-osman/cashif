import { getApiUrl } from "@/lib/api-url";

export async function POST(request) {
  const body = await request.json();

  try {
    const response = await fetch(getApiUrl("api/Account/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json-patch+json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));
    return Response.json(data, { status: response.ok ? 200 : response.status });
  } catch (error) {
    return Response.json({ message: error.message || "حدث خطأ" }, { status: 500 });
  }
}

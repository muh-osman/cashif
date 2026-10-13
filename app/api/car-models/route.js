import { getApiUrl } from "@/lib/api-url";

export async function GET() {
  try {
    const response = await fetch(getApiUrl("api/CarMark"), { cache: "no-store" });
    const data = await response.json().catch(() => []);

    if (!response.ok) {
      return Response.json({ message: "تعذر تحميل موديلات السيارات" }, { status: response.status });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ message: error.message || "تعذر تحميل موديلات السيارات" }, { status: 500 });
  }
}

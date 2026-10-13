import { getApiUrl } from "@/lib/api-url";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");
  const markId = searchParams.get("markId");

  if (!year || !markId) {
    return Response.json({ message: "السنة والموديل مطلوبان" }, { status: 400 });
  }

  try {
    const response = await fetch(
      getApiUrl(`api/ServicePrices/ByYearAndMark?year=${encodeURIComponent(year)}&markId=${encodeURIComponent(markId)}`),
      { cache: "no-store" }
    );
    const data = await response.json().catch(() => []);

    if (!response.ok) {
      return Response.json({ message: "تعذر تحميل أسعار الباقات" }, { status: response.status });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ message: error.message || "تعذر تحميل أسعار الباقات" }, { status: 500 });
  }
}

const DISCOUNTS_API = "https://cashif.online/back-end/public/api/service-discounts";

export async function GET() {
  try {
    const response = await fetch(DISCOUNTS_API, { cache: "no-store" });
    const data = await response.json().catch(() => []);

    if (!response.ok) {
      return Response.json({ message: "تعذر تحميل الخصومات" }, { status: response.status });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ message: error.message || "تعذر تحميل الخصومات" }, { status: 500 });
  }
}

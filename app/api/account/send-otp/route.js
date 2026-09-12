import { getApiUrl } from "@/lib/api-url";

export async function GET(request) {
  const phoneNumber = request.nextUrl.searchParams.get("phoneNumber") ?? "";

  try {
    const response = await fetch(getApiUrl(`api/Account/sendOtp?phoneNumber=${encodeURIComponent(phoneNumber)}`), {
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));
    return Response.json(data, { status: response.ok ? 200 : response.status });
  } catch (error) {
    return Response.json({ message: error.message || "حدث خطأ" }, { status: 500 });
  }
}

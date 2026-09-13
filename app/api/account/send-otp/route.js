import { forwardApiResponse, getApiUrl } from "@/lib/api-url";

export async function GET(request) {
  const phoneNumber = request.nextUrl.searchParams.get("phoneNumber") ?? "";

  if (!phoneNumber) {
    return Response.json({ message: "رقم الجوال مطلوب" }, { status: 400 });
  }

  try {
    const response = await fetch(getApiUrl(`api/Account/sendOtp?phoneNumber=${encodeURIComponent(phoneNumber)}`), {
      cache: "no-store",
    });
    return forwardApiResponse(response);
  } catch (error) {
    return Response.json({ message: error.message || "حدث خطأ" }, { status: 500 });
  }
}

import { cookies } from "next/headers";
import { fetchWithAuth, forwardApiResponse } from "@/lib/api-url";
import { hasAuthCookieFromStore } from "@/lib/auth";

export async function GET(request) {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    return Response.json({ message: "سجّل دخولك للوصول إلى فالك" }, { status: 401 });
  }

  const marketerId = request.nextUrl.searchParams.get("marketerId");

  if (!marketerId) {
    return Response.json({ message: "معرف المسوق مطلوب." }, { status: 400 });
  }

  try {
    const { unauthorized, response } = await fetchWithAuth(
      cookieStore,
      `api/TransferRequests/CheckWattingRequest?marketerId=${encodeURIComponent(marketerId)}`
    );

    if (unauthorized) {
      return Response.json({ message: "سجّل دخولك للوصول إلى فالك" }, { status: 401 });
    }

    return forwardApiResponse(response);
  } catch (error) {
    return Response.json({ message: error.message || "تعذر التحقق من طلب التحويل" }, { status: 500 });
  }
}

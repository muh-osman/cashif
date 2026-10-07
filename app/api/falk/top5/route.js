import { cookies } from "next/headers";
import { fetchWithAuth, forwardApiResponse } from "@/lib/api-url";
import { hasAuthCookieFromStore } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    return Response.json({ message: "سجّل دخولك للوصول إلى فالك" }, { status: 401 });
  }

  try {
    const { unauthorized, response } = await fetchWithAuth(cookieStore, "api/Marketers/GetTopMarketers");

    if (unauthorized) {
      return Response.json({ message: "سجّل دخولك للوصول إلى فالك" }, { status: 401 });
    }

    return forwardApiResponse(response);
  } catch (error) {
    return Response.json({ message: error.message || "تعذر تحميل قائمة أفضل المسوقين" }, { status: 500 });
  }
}

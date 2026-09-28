import { cookies } from "next/headers";
import { fetchWithAuth, forwardApiResponse } from "@/lib/api-url";
import { hasAuthCookieFromStore } from "@/lib/auth";

export async function GET(_request, { params }) {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    return Response.json({ message: "سجّل دخولك لعرض بيانات الشحن" }, { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return Response.json({ message: "رقم التقرير مطلوب" }, { status: 400 });
  }

  try {
    const { unauthorized, response } = await fetchWithAuth(cookieStore, `api/Card/${encodeURIComponent(id)}`);

    if (unauthorized) {
      return Response.json({ message: "سجّل دخولك لعرض بيانات الشحن" }, { status: 401 });
    }

    return forwardApiResponse(response);
  } catch (error) {
    console.error("Card fetch failed", error?.cause || error);
    return Response.json({ message: "خطأ في الشبكة" }, { status: 500 });
  }
}

import { cookies } from "next/headers";
import { fetchWithAuth, forwardApiResponse } from "@/lib/api-url";
import { getUserIdFromStore, hasAuthCookieFromStore } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    return Response.json({ message: "سجّل دخولك لعرض التقارير" }, { status: 401 });
  }

  const userId = getUserIdFromStore(cookieStore);

  if (!userId) {
    return Response.json({ message: "لم يتم العثور على حساب المستخدم." }, { status: 400 });
  }

  try {
    const { unauthorized, response } = await fetchWithAuth(cookieStore, `api/Card/GetCardbyClientId?id=${encodeURIComponent(userId)}`, {
      method: "POST",
    });

    if (unauthorized) {
      return Response.json({ message: "سجّل دخولك لعرض التقارير" }, { status: 401 });
    }

    return forwardApiResponse(response);
  } catch (error) {
    return Response.json({ message: error.message || "تعذر تحميل التقارير" }, { status: 500 });
  }
}

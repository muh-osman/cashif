import { cookies } from "next/headers";
import { fetchWithAuth, forwardApiResponse } from "@/lib/api-url";
import { getUserIdFromStore, hasAuthCookieFromStore } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    return Response.json({ message: "سجّل دخولك للوصول إلى فالك" }, { status: 401 });
  }

  const userId = getUserIdFromStore(cookieStore);

  if (!userId) {
    return Response.json({ message: "لم يتم العثور على معرف المستخدم." }, { status: 400 });
  }

  try {
    const { unauthorized, response } = await fetchWithAuth(
      cookieStore,
      `api/Marketers/GetByClientId/${encodeURIComponent(userId)}`
    );

    if (unauthorized) {
      return Response.json({ message: "سجّل دخولك للوصول إلى فالك" }, { status: 401 });
    }

    return forwardApiResponse(response);
  } catch (error) {
    return Response.json({ message: error.message || "تعذر تحميل بيانات المسوق" }, { status: 500 });
  }
}

export async function POST(request) {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    return Response.json({ message: "سجّل دخولك للوصول إلى فالك" }, { status: 401 });
  }

  const userId = getUserIdFromStore(cookieStore);

  if (!userId) {
    return Response.json({ message: "لم يتم العثور على معرف المستخدم." }, { status: 400 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const payload = {
      clientId: userId,
      isActive: true,
      specialCode: body.specialCode ?? null,
    };

    const { unauthorized, response } = await fetchWithAuth(cookieStore, "api/Marketers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json-patch+json",
      },
      body: JSON.stringify(payload),
    });

    if (unauthorized) {
      return Response.json({ message: "سجّل دخولك للوصول إلى فالك" }, { status: 401 });
    }

    return forwardApiResponse(response);
  } catch (error) {
    return Response.json({ message: error.message || "تعذر إنشاء حساب المسوق" }, { status: 500 });
  }
}

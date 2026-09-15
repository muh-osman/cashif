import { cookies } from "next/headers";
import { hasAuthCookieFromStore } from "@/lib/auth";

const VIDEOS_CHECK_API = "https://cashif.online/back-end/public/api/new-check-if-cards-have-videos";

export async function POST(request) {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    return Response.json({ message: "سجّل دخولك لعرض التقارير" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const cardIds = Array.isArray(body?.card_ids) ? body.card_ids : [];

  if (cardIds.length === 0) {
    return Response.json({ data: {} });
  }

  try {
    const response = await fetch(VIDEOS_CHECK_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ card_ids: cardIds }),
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return Response.json({ message: "تعذر التحقق من وجود الفيديو", data: {} }, { status: response.status });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ message: error.message || "تعذر التحقق من وجود الفيديو" }, { status: 500 });
  }
}

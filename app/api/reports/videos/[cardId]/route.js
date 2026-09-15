import { cookies } from "next/headers";
import { hasAuthCookieFromStore } from "@/lib/auth";

export async function GET(_request, { params }) {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    return Response.json({ message: "سجّل دخولك لعرض الفيديو" }, { status: 401 });
  }

  const { cardId } = await params;

  if (!cardId) {
    return Response.json({ message: "رقم التقرير مطلوب" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://cashif.online/back-end/public/api/new-show-videos-links/${encodeURIComponent(cardId)}`, {
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return Response.json({ message: "تعذر تحميل روابط الفيديو", success: false }, { status: response.status });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ message: error.message || "تعذر تحميل روابط الفيديو", success: false }, { status: 500 });
  }
}

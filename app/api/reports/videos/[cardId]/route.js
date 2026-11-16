import { cookies } from "next/headers";
import { fetchWithAuth } from "@/lib/api-url";
import { getUserIdFromStore, hasAuthCookieFromStore } from "@/lib/auth";

function toList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function videoUrl(video) {
  if (typeof video === "string") return video;
  return video?.video_url || video?.url || "";
}

async function cardVideoUrls(cookieStore, cardId) {
  try {
    const userId = getUserIdFromStore(cookieStore);
    if (!userId) return [];

    const { unauthorized, response } = await fetchWithAuth(cookieStore, `api/Card/GetCardbyClientId?id=${encodeURIComponent(userId)}`, {
      method: "POST",
    });

    if (unauthorized || !response?.ok) return [];

    const data = await response.json().catch(() => null);
    const card = toList(data).find((item) => String(item?.cardNumber) === String(cardId) || String(item?.id) === String(cardId));

    if (!Array.isArray(card?.videos)) return [];

    return card.videos.map(videoUrl).filter(Boolean);
  } catch {
    return [];
  }
}

export async function GET(_request, { params }) {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    return Response.json({ message: "سجّل دخولك لعرض الفيديو" }, { status: 401 });
  }

  const { cardId } = await params;

  if (!cardId) {
    return Response.json({ message: "رقم التقرير مطلوب" }, { status: 400 });
  }

  const urls = new Set(await cardVideoUrls(cookieStore, cardId));
  let legacyError = "";

  try {
    const response = await fetch(`https://cashif.online/back-end/public/api/new-show-videos-links/${encodeURIComponent(cardId)}`, {
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      const videos = Array.isArray(data?.data?.videos) ? data.data.videos : [];
      videos.map(videoUrl).filter(Boolean).forEach((url) => urls.add(url));
    } else {
      legacyError = "تعذر تحميل روابط الفيديو";
    }
  } catch (error) {
    legacyError = error.message || "تعذر تحميل روابط الفيديو";
  }

  if (urls.size === 0 && legacyError) {
    return Response.json({ message: legacyError, success: false }, { status: 502 });
  }

  return Response.json({
    success: true,
    data: {
      videos: [...urls].map((video_url) => ({ video_url })),
    },
  });
}

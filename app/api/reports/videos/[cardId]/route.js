import { cookies } from "next/headers";
import { fetchWithAuth } from "@/lib/api-url";
import { getUserIdFromStore, hasAuthCookieFromStore } from "@/lib/auth";

function toList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeVideo(video) {
  if (typeof video === "string") {
    return video ? { video_url: video, title: "", subtitle: "" } : null;
  }

  const video_url = video?.video_url || video?.url || "";
  if (!video_url) return null;

  return {
    video_url,
    title: text(video.documentTypeNameAr),
    subtitle: text(video.damageAr),
  };
}

function addVideos(videosByUrl, videos) {
  for (const video of videos) {
    const item = normalizeVideo(video);
    if (!item) continue;

    const existing = videosByUrl.get(item.video_url);
    if (!existing) {
      videosByUrl.set(item.video_url, item);
      continue;
    }

    if (!existing.title && item.title) existing.title = item.title;
    if (!existing.subtitle && item.subtitle) existing.subtitle = item.subtitle;
  }
}

async function cardVideos(cookieStore, cardId) {
  try {
    const userId = getUserIdFromStore(cookieStore);
    if (!userId) return [];

    const { unauthorized, response } = await fetchWithAuth(cookieStore, `api/Card/GetCardbyClientId?id=${encodeURIComponent(userId)}`, {
      method: "POST",
    });

    if (unauthorized || !response?.ok) return [];

    const data = await response.json().catch(() => null);
    const card = toList(data).find((item) => String(item?.cardNumber) === String(cardId) || String(item?.id) === String(cardId));

    return Array.isArray(card?.videos) ? card.videos : [];
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

  const videosByUrl = new Map();
  addVideos(videosByUrl, await cardVideos(cookieStore, cardId));
  let legacyError = "";

  try {
    const response = await fetch(`https://cashif.online/back-end/public/api/new-show-videos-links/${encodeURIComponent(cardId)}`, {
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      addVideos(videosByUrl, Array.isArray(data?.data?.videos) ? data.data.videos : []);
    } else {
      legacyError = "تعذر تحميل روابط الفيديو";
    }
  } catch (error) {
    legacyError = error.message || "تعذر تحميل روابط الفيديو";
  }

  if (videosByUrl.size === 0 && legacyError) {
    return Response.json({ message: legacyError, success: false }, { status: 502 });
  }

  return Response.json({
    success: true,
    data: {
      videos: [...videosByUrl.values()],
    },
  });
}

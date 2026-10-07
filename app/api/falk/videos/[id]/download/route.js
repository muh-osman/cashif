import { cookies } from "next/headers";
import { hasAuthCookieFromStore } from "@/lib/auth";

const DOWNLOAD_API = "https://cashif.online/back-end/public/api/download-falak-video";

export async function GET(_request, { params }) {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    return Response.json({ message: "سجّل دخولك للوصول إلى فالك" }, { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return Response.json({ message: "معرف الفيديو مطلوب." }, { status: 400 });
  }

  try {
    const response = await fetch(`${DOWNLOAD_API}/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return Response.json({ message: "تعذر تحميل الفيديو" }, { status: response.status });
    }

    const blob = await response.arrayBuffer();

    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "video/mp4",
        "Content-Disposition": `attachment; filename="falak-video-${id}.mp4"`,
      },
    });
  } catch (error) {
    return Response.json({ message: error.message || "تعذر تحميل الفيديو" }, { status: 500 });
  }
}

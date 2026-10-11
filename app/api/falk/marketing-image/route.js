import { cookies } from "next/headers";
import { hasAuthCookieFromStore } from "@/lib/auth";

const ALLOWED_PREFIX = "https://cashif.online/back-end/public/images/";

export async function GET(request) {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    return Response.json({ message: "سجّل دخولك للوصول إلى فالك" }, { status: 401 });
  }

  const src = request.nextUrl.searchParams.get("src");

  if (!src || !src.startsWith(ALLOWED_PREFIX)) {
    return Response.json({ message: "رابط الصورة غير صالح" }, { status: 400 });
  }

  try {
    const response = await fetch(src, {
      next: { revalidate: 604800 },
    });

    if (!response.ok) {
      return Response.json({ message: "تعذر تحميل الصورة" }, { status: response.status });
    }

    const bytes = await response.arrayBuffer();

    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=604800, immutable",
      },
    });
  } catch (error) {
    return Response.json({ message: error.message || "تعذر تحميل الصورة" }, { status: 500 });
  }
}

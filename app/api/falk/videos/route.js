import { cookies } from "next/headers";
import { hasAuthCookieFromStore } from "@/lib/auth";

const VIDEOS_API = "https://cashif.online/back-end/public/api/get-all-falak-videos";

export async function GET() {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    return Response.json({ message: "سجّل دخولك للوصول إلى فالك" }, { status: 401 });
  }

  try {
    const response = await fetch(VIDEOS_API, { cache: "no-store" });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return Response.json({ message: data?.message || "تعذر تحميل الفيديوهات" }, { status: response.status });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ message: error.message || "تعذر تحميل الفيديوهات" }, { status: 500 });
  }
}

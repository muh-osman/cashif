import { cookies } from "next/headers";
import { hasAuthCookieFromStore } from "@/lib/auth";

const MARKETING_POSTS_API = "https://cashif.online/back-end/public/api/get-all/marketing-posts";

export async function GET() {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    return Response.json({ message: "سجّل دخولك للوصول إلى فالك" }, { status: 401 });
  }

  try {
    const response = await fetch(MARKETING_POSTS_API, {
      next: { revalidate: 300 },
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return Response.json({ message: data?.message || "تعذر تحميل المحتوى التسويقي" }, { status: response.status });
    }

    const posts = Array.isArray(data?.data)
      ? data.data
          .filter((post) => post?.image_url)
          .map((post) => ({
            id: post.id,
            title: post.title,
            image_url: `/api/falk/marketing-image?src=${encodeURIComponent(post.image_url)}`,
          }))
      : [];

    return Response.json({ success: Boolean(data?.success), data: posts });
  } catch (error) {
    return Response.json({ message: error.message || "تعذر تحميل المحتوى التسويقي" }, { status: 500 });
  }
}

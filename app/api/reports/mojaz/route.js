import { cookies } from "next/headers";
import { getUserIdFromStore, hasAuthCookieFromStore } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    return Response.json({ message: "سجّل دخولك لعرض تقارير موجز" }, { status: 401 });
  }

  const userId = getUserIdFromStore(cookieStore);

  if (!userId) {
    return Response.json({ message: "لم يتم العثور على حساب المستخدم." }, { status: 400 });
  }

  try {
    const response = await fetch(`https://cashif.cc/payment-system/back-end/public/api/mojaz/orders/${encodeURIComponent(userId)}`, {
    // const response = await fetch(`https://cashif.cc/payment-system/back-end/public/api/mojaz/orders/95332`, {
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));

    if (response.status === 404) {
      return Response.json({ data: [] });
    }

    if (!response.ok) {
      return Response.json({ message: "تعذر تحميل تقارير موجز", data: [] }, { status: response.status });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ message: error.message || "تعذر تحميل تقارير موجز" }, { status: 500 });
  }
}

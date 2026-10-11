import { cookies } from "next/headers";
import { hasAuthCookieFromStore } from "@/lib/auth";
import { isLookupType } from "@/lib/mojaz";

const INQUIRY_URL = "https://cashif.cc/payment-system/back-end/public/api/mojaz/inquiry";

export async function POST(request) {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    return Response.json({ message: "سجّل دخولك لطلب تقرير موجز" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "بيانات غير صالحة" }, { status: 400 });
  }

  const lookupType = String(body?.lookup_type ?? "").trim();
  const lookupValue = String(body?.lookup_value ?? "").trim();

  if (!isLookupType(lookupType) || !lookupValue) {
    return Response.json({ message: "يرجى ادخال بيانات صحيحة" }, { status: 400 });
  }

  try {
    const response = await fetch(INQUIRY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lookup_type: lookupType,
        lookup_value: lookupValue,
      }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("Mojaz inquiry failed", error?.cause || error);
    return Response.json({ message: "حدث خطأ أثناء الاتصال بالخادم" }, { status: 500 });
  }
}

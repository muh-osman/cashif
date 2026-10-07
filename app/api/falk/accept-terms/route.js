import { cookies } from "next/headers";
import { getPhoneNumberFromStore, hasAuthCookieFromStore } from "@/lib/auth";

const ACCEPT_TERMS_API = "https://cashif.online/back-end/public/api/i-accept-terms";

export async function POST() {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    return Response.json({ message: "سجّل دخولك للوصول إلى فالك" }, { status: 401 });
  }

  const phoneNumber = getPhoneNumberFromStore(cookieStore);

  if (!phoneNumber) {
    return Response.json({ message: "لم يتم العثور على رقم الجوال." }, { status: 400 });
  }

  try {
    const response = await fetch(`${ACCEPT_TERMS_API}/${encodeURIComponent(phoneNumber)}`, {
      method: "POST",
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.status === "error") {
      return Response.json({ message: data?.message || "تعذر تسجيل الموافقة على الشروط" }, { status: response.status || 400 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ message: error.message || "تعذر تسجيل الموافقة على الشروط" }, { status: 500 });
  }
}

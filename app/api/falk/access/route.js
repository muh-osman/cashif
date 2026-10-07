import { cookies } from "next/headers";
import { getPhoneNumberFromStore, hasAuthCookieFromStore } from "@/lib/auth";

const ACCESS_API = "https://cashif.online/back-end/public/api/check-if-phone-numbers-exist-in-db";

export async function GET() {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    return Response.json({ message: "سجّل دخولك للوصول إلى فالك" }, { status: 401 });
  }

  const phoneNumber = getPhoneNumberFromStore(cookieStore);

  if (!phoneNumber) {
    return Response.json({ message: "لم يتم العثور على رقم الجوال." }, { status: 400 });
  }

  try {
    const response = await fetch(`${ACCESS_API}/${encodeURIComponent(phoneNumber)}`, {
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return Response.json({ message: data?.message || "تعذر التحقق من صلاحية فالك" }, { status: response.status });
    }

    return Response.json({
      exists: Boolean(data.exists),
      specialCode: data.special_code ?? null,
      isAcceptTerms: Boolean(data.is_accept_terms),
    });
  } catch (error) {
    return Response.json({ message: error.message || "تعذر التحقق من صلاحية فالك" }, { status: 500 });
  }
}

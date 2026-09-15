import { cookies } from "next/headers";
import { fetchWithAuth, forwardApiResponse } from "@/lib/api-url";
import { getPhoneNumberFromStore, hasAuthCookieFromStore } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    return Response.json({ message: "سجّل دخولك لعرض النقاط" }, { status: 401 });
  }

  const phoneNumber = getPhoneNumberFromStore(cookieStore);

  if (!phoneNumber) {
    return Response.json({ message: "لم يتم العثور على رقم الجوال." }, { status: 400 });
  }

  try {
    const { unauthorized, response } = await fetchWithAuth(
      cookieStore,
      `api/ClientPoint/GetClientPoints?clienttPhoneNumber=${encodeURIComponent(phoneNumber)}`
    );

    if (unauthorized) {
      return Response.json({ message: "سجّل دخولك لعرض النقاط" }, { status: 401 });
    }

    return forwardApiResponse(response);
  } catch (error) {
    return Response.json({ message: error.message || "تعذر تحميل النقاط" }, { status: 500 });
  }
}

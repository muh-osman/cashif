import { cookies } from "next/headers";
import { fetchWithAuth, forwardApiResponse } from "@/lib/api-url";
import { hasAuthCookieFromStore } from "@/lib/auth";

const NOTIFY_API = "https://cashif.online/back-end/public/api/send-withdraw-notification";

export async function POST(request) {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    return Response.json({ message: "سجّل دخولك للوصول إلى فالك" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const payload = {
      marketerId: body.marketerId,
      point: Math.floor(Number(body.point) || 0),
      tranferPaymentTypeId: body.tranferPaymentTypeId,
      accountNumber: body.accountNumber,
      actionDate: null,
      marketerName: body.marketerName,
      marketerCode: body.marketerCode,
    };

    const { unauthorized, response } = await fetchWithAuth(cookieStore, "api/TransferRequests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json-patch+json",
      },
      body: JSON.stringify(payload),
    });

    if (unauthorized) {
      return Response.json({ message: "سجّل دخولك للوصول إلى فالك" }, { status: 401 });
    }

    if (!response.ok) {
      return forwardApiResponse(response);
    }

    const data = await response.json().catch(() => ({}));

    try {
      await fetch(NOTIFY_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountNumber: payload.accountNumber,
          marketerId: payload.marketerId,
          point: payload.point,
          tranferPaymentTypeId: payload.tranferPaymentTypeId,
          marketerName: payload.marketerName,
          marketerCode: payload.marketerCode,
        }),
        cache: "no-store",
      });
    } catch {
      // Notification failure should not block a successful transfer request.
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ message: error.message || "تعذر إرسال طلب السحب" }, { status: 500 });
  }
}

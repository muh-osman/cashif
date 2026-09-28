import { cookies } from "next/headers";
import { fetchWithAuth } from "@/lib/api-url";
import { hasAuthCookieFromStore } from "@/lib/auth";
import {
  CITIES,
  DELIVERY_OWNER,
  SHIPPING_TYPE_PRIVATE,
  SHIPPING_TYPE_PUBLIC,
  buildShippingOrder,
  calculateShippingPrice,
  isAvailablePrice,
  normalizeCard,
  shippingBranchError,
} from "@/lib/shipping";

const STORE_ORDER_URL = "https://cashif.cc/payment-system/back-end/public/api/store-shipping-car-order";

export async function POST(request) {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    return Response.json({ message: "سجّل دخولك لطلب الشحن" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const cardId = String(body?.cardId || "").trim();
  const to = String(body?.to || "").trim();
  const shippingType = String(body?.shippingType || "").trim();
  const deliveryMethod = String(body?.deliveryMethod || "").trim();

  if (!cardId || !CITIES.some((city) => city.nameAr === to)) {
    return Response.json({ message: "جميع البيانات مطلوبة." }, { status: 400 });
  }

  if (shippingType !== SHIPPING_TYPE_PUBLIC && shippingType !== SHIPPING_TYPE_PRIVATE) {
    return Response.json({ message: "نوع الشحن غير صالح" }, { status: 400 });
  }

  if (deliveryMethod !== DELIVERY_OWNER) {
    return Response.json({ message: "طريقة التسليم غير صالحة لهذا الطلب" }, { status: 400 });
  }

  try {
    const { unauthorized, response } = await fetchWithAuth(cookieStore, `api/Card/${encodeURIComponent(cardId)}`);

    if (unauthorized) {
      return Response.json({ message: "سجّل دخولك لطلب الشحن" }, { status: 401 });
    }

    const cardPayload = await response.json().catch(() => null);

    if (!response.ok) {
      return Response.json({ message: "تعذر تحميل بيانات السيارة" }, { status: response.status });
    }

    const card = normalizeCard(cardPayload);
    const branchError = shippingBranchError(card?.branchNameAr);

    if (!card || branchError) {
      return Response.json({ message: branchError || "تعذر تحميل بيانات السيارة" }, { status: 400 });
    }

    const price = calculateShippingPrice(card.branchNameAr, to, shippingType);

    if (!isAvailablePrice(price)) {
      return Response.json({ message: "الشحن غير متاح لهذا المسار" }, { status: 400 });
    }

    const order = buildShippingOrder(card, { to, shippingType, deliveryMethod, price });

    if (!order.name || !order.phoneNumber || !order.reportNumber || !order.model || !order.from) {
      return Response.json({ message: "بيانات التقرير غير مكتملة لطلب الشحن" }, { status: 400 });
    }

    const storeResponse = await fetch(STORE_ORDER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(order),
      cache: "no-store",
    });
    const storeData = await storeResponse.json().catch(() => ({}));

    if (!storeResponse.ok || !storeData?.database_id) {
      return Response.json({ message: "تعذر إرسال طلب الشحن" }, { status: storeResponse.status || 502 });
    }

    return Response.json({ database_id: storeData.database_id });
  } catch (error) {
    return Response.json({ message: error.message || "تعذر إرسال طلب الشحن" }, { status: 500 });
  }
}

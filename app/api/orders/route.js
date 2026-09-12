import { cookies } from "next/headers";
import { getPhoneNumberFromStore, hasAuthCookieFromStore } from "@/lib/auth";

const ORDERS_API = "https://cashif.cc/payment-system/back-end/public/api/my-orders";

function toOrdersPhone(phoneNumber) {
  let digits = String(phoneNumber).replace(/\D/g, "");
  if (digits.startsWith("966")) digits = digits.slice(3);
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (/^5\d{8}$/.test(digits)) return `0${digits}`;
  return String(phoneNumber);
}

export async function GET() {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    return Response.json({ message: "سجّل دخولك لعرض الطلبات" }, { status: 401 });
  }

  const phoneNumber = toOrdersPhone(getPhoneNumberFromStore(cookieStore));

  if (!phoneNumber) {
    return Response.json({ message: "لم يتم العثور على رقم الجوال." }, { status: 400 });
  }

  try {
    const response = await fetch(`${ORDERS_API}/${encodeURIComponent(phoneNumber)}`, {
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));

    if (response.status === 404) {
      return Response.json({ data: [] });
    }

    if (!response.ok) {
      return Response.json({ message: "تعذر تحميل الطلبات", data: [] }, { status: response.status });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ message: error.message || "تعذر تحميل الطلبات" }, { status: 500 });
  }
}

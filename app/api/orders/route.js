import { cookies } from "next/headers";
import { getPhoneNumberFromStore, hasAuthCookieFromStore } from "@/lib/auth";
import { getApiUrl } from "@/lib/api-url";
import { buildManufacturerIndex, manufacturerForModel } from "@/lib/car-manufacturer";

const ORDERS_API = "https://cashif.cc/payment-system/back-end/public/api/my-orders";
const CATALOG_TTL_MS = 60 * 60 * 1000;

let manufacturerIndex = null;
let manufacturerIndexAt = 0;

async function loadManufacturerIndex() {
  if (manufacturerIndex && Date.now() - manufacturerIndexAt < CATALOG_TTL_MS) {
    return manufacturerIndex;
  }

  const [marksResponse, manufacturersResponse] = await Promise.all([
    fetch(getApiUrl("api/CarMark"), { cache: "no-store" }),
    fetch(getApiUrl("api/CarManufacturer"), { cache: "no-store" }),
  ]);

  if (!marksResponse.ok || !manufacturersResponse.ok) {
    throw new Error("تعذر تحميل شركات السيارات");
  }

  const [marks, manufacturers] = await Promise.all([marksResponse.json(), manufacturersResponse.json()]);
  manufacturerIndex = buildManufacturerIndex(marks, manufacturers);
  manufacturerIndexAt = Date.now();
  return manufacturerIndex;
}

async function withManufacturers(orders) {
  if (!Array.isArray(orders) || orders.length === 0) return orders;

  try {
    const index = await loadManufacturerIndex();

    return orders.map((order) => ({
      ...order,
      manufacturerNameEn: manufacturerForModel(order.model, index),
    }));
  } catch {
    return orders;
  }
}

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

    if (Array.isArray(data?.data)) {
      data.data = await withManufacturers(data.data);
    }

    if (Array.isArray(data?.shipping_orders)) {
      data.shipping_orders = await withManufacturers(data.shipping_orders);
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ message: error.message || "تعذر تحميل الطلبات" }, { status: 500 });
  }
}

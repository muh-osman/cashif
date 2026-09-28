import shippingPrices from "@/data/shipping-prices.json";

export const RECEIVE_AND_SEND_FEE = 115;

export const CITIES = [
  { id: 1, nameAr: "الرياض", nameEn: "Riyadh" },
  { id: 2, nameAr: "الدمام", nameEn: "Dammam" },
  { id: 3, nameAr: "جدة", nameEn: "Jeddah" },
  { id: 4, nameAr: "ابها", nameEn: "Abha" },
  { id: 5, nameAr: "الطائف", nameEn: "Taif" },
  { id: 6, nameAr: "تبوك", nameEn: "Tabuk" },
  { id: 7, nameAr: "القريات", nameEn: "Al-Qurayyat" },
  { id: 8, nameAr: "مكة المكرمة", nameEn: "Makkah" },
  { id: 9, nameAr: "المدينة المنورة", nameEn: "Madinah" },
  { id: 10, nameAr: "جيزان", nameEn: "Jizan" },
  { id: 11, nameAr: "نجران", nameEn: "Najran" },
  { id: 12, nameAr: "القصيم", nameEn: "Al Qassim" },
  { id: 13, nameAr: "بيشة", nameEn: "Bisha" },
  { id: 14, nameAr: "عرعر", nameEn: "Arar" },
  { id: 15, nameAr: "سكاكا الجوف", nameEn: "Sakaka" },
  { id: 16, nameAr: "حفر الباطن", nameEn: "Hafar Al-Batin" },
  { id: 17, nameAr: "حائل", nameEn: "Hail" },
  { id: 18, nameAr: "الجبيل", nameEn: "Al-Jubail" },
  { id: 19, nameAr: "ينبع", nameEn: "Yanbu" },
  { id: 20, nameAr: "شرورة", nameEn: "Sharorah" },
  { id: 21, nameAr: "النماص", nameEn: "Al-Namas" },
  { id: 22, nameAr: "الهفوف", nameEn: "Al Hofuf" },
  { id: 23, nameAr: "ضبا", nameEn: "Duba" },
  { id: 24, nameAr: "الباحة", nameEn: "Al-Baha" },
  { id: 25, nameAr: "الخفجي", nameEn: "Al-Khafji" },
];

export const ALBASAMI_BRANCHES = [
  {
    nameAr: "القادسية",
    address: "الرياض - القادسية",
    link: "https://maps.app.goo.gl/P4b9rnktgWAAGen4A",
  },
  {
    nameAr: "الشفا",
    address: "الرياض - الشفا",
    link: "https://maps.app.goo.gl/PRmnNYrGhBCXgvxV8",
  },
  {
    nameAr: "جدة",
    address: "جدة - الجوهرة",
    link: "https://maps.app.goo.gl/eHeFLRxzLAf4TBQJ8",
  },
  {
    nameAr: "الدمام",
    address: "الدمام - ضاحية الملك فهد",
    link: "https://maps.app.goo.gl/mkjAu3KRDBWnLFgz6",
  },
  {
    nameAr: "القصيم",
    address: "بريدة - شارع قرطبة",
    link: "https://maps.app.goo.gl/ooynnSB14yZQjUvaA",
  },
  {
    nameAr: "خميس مشيط",
    address: "خميس مشيط",
    link: "https://maps.app.goo.gl/6dMQqyhHiKgmrP6b7",
  },
];

export const SHIPPING_TYPE_PUBLIC = "نقل عام";
export const SHIPPING_TYPE_PRIVATE = "سطحة خاصة";

export const DELIVERY_OWNER = "1";
export const DELIVERY_FLATBED = "2";

export const DELIVERY_LABELS = {
  [DELIVERY_OWNER]: "ذهاب صاحب السيارة إلى شركة الشحن",
  [DELIVERY_FLATBED]: "سطحة من مركز الفحص إلى شركة الشحن",
};

const CITY_NAMES = new Set(CITIES.map((city) => city.nameAr));

export function normalizeCard(data) {
  if (!data || typeof data !== "object") return null;
  if (data.carModelNameAr || data.cardNumber || data.branchNameAr) return data;
  if (data.data && typeof data.data === "object") return normalizeCard(data.data);
  return null;
}

export function priceOrigin(branchNameAr) {
  if (branchNameAr === "القادسية" || branchNameAr === "الشفا") return "الرياض";
  return branchNameAr || "";
}

export function findAlbasamiBranch(branchNameAr) {
  return ALBASAMI_BRANCHES.find((branch) => branch.nameAr === branchNameAr) || null;
}

export function shippingBranchError(branchNameAr) {
  if (!branchNameAr) return "تعذر تحديد فرع الفحص";
  if (branchNameAr === "افتراضي") return "الفرع 'افتراضي' غير مدعوم";
  if (!shippingPrices.from[priceOrigin(branchNameAr)]) return "الفرع غير مدعوم للشحن";
  return "";
}

export function calculateShippingPrice(fromBranch, toCity, shippingType) {
  if (!fromBranch || !toCity) return null;
  if (shippingType !== SHIPPING_TYPE_PUBLIC && shippingType !== SHIPPING_TYPE_PRIVATE) return null;
  if (!CITY_NAMES.has(toCity)) return null;

  const cityData = shippingPrices.from[priceOrigin(fromBranch)];
  if (!cityData) return null;

  const table = shippingType === SHIPPING_TYPE_PUBLIC ? cityData.public : cityData.private;
  const price = table?.[toCity];
  return typeof price === "number" ? price : null;
}

export function isAvailablePrice(price) {
  return typeof price === "number" && Number.isFinite(price) && price > 0 && price < 99999;
}

export function isDeliveryMethod(value) {
  return value === DELIVERY_OWNER || value === DELIVERY_FLATBED;
}

export function buildShippingOrder(card, { to, shippingType, deliveryMethod, price }) {
  return {
    payment_id: "N/A",
    name: String(card?.clientName || "").trim(),
    reportNumber: String(card?.cardNumber || "").trim(),
    model: String(card?.carModelNameAr || "").trim(),
    modelCategory: DELIVERY_LABELS[String(deliveryMethod)] || "",
    plateNumber: String(card?.plateNumber || "").trim() || "N/A",
    from: String(card?.branchNameAr || "").trim(),
    to,
    shippingType,
    price: Number(price),
    phoneNumber: String(card?.clientPhoneNumber || "").trim(),
    status: "الدفع عند الاستلام",
    isShipped: false,
    accountant_status: false,
  };
}

export function buildMoyasarMetadata(card, details) {
  const order = buildShippingOrder(card, details);

  return {
    flag: "shipping",
    payment_id: order.payment_id,
    name: order.name,
    reportNumber: order.reportNumber,
    model: order.model,
    modelCategory: order.modelCategory,
    plateNumber: order.plateNumber,
    from: order.from,
    to: order.to,
    shippingType: order.shippingType,
    price: String(order.price),
    phoneNumber: order.phoneNumber,
    status: order.status,
    isShipped: "false",
    accountant_status: "false",
  };
}

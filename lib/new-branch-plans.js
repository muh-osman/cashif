export const DISCOUNT_RATE = 0.25;
export const DISCOUNT_PERCENT = 25;

export const CHECKLIST_ITEMS = [
  { text: "المحرك", tooltip: "فحص الأداء، مستوى الزيت، والصوت" },
  { text: "ناقل الحركة", tooltip: "اختبار سلاسة التبديل والأداء" },
  { text: "الدفرنس", tooltip: "فحص الأصوات والتسربات" },
  {
    text: "ميكانيكا أسفل السيارة",
    tooltip:
      "فحص ميكانيكا أسفل السيارة: الأجزاء المتحركة: فحص الأجزاء المتحركة والتأكد من عدم وجود تلف أو تآكل الهيكل السفلي: التحقق من عدم وجود أي صدأ أو تلف في الهيكل السفلي",
  },
  { text: "الكمبيوتر والحساسات", tooltip: "استخدام أجهزة التشخيص لفحص الأنظمة الإلكترونية" },
  {
    text: "الهيكل الداخلي",
    tooltip: "التحقق من شاص السيارة: الصدمات، الصدأ، اللحامات، نقاط التثبيت، والاتصالات الميكانيكية لضمان السلامة الهيكلية والسيارة",
  },
  { text: "تجربة السيارة", tooltip: "تجربة القيادة للتحقق من الأداء العام" },
  { text: "الهيكل الخارجي", tooltip: "فحص البودي، الدهان، الصدمات، والخدوش" },
  { text: "الوسائد الهوائية", tooltip: "التحقق من سلامة وعمل الوسائد الهوائية (الايرباق)" },
  { text: "الديكورات الداخلية", tooltip: "فحص سلامة المقاعد والأزرار والأجهزة الداخلية" },
  { text: "المزايا المخصصة للسيارة", tooltip: "التحقق من نظام الملاحة، الكاميرات، والمستشعرات. وغيرها" },
  { text: "الملحقات الخارجية للسيارة", tooltip: "فحص المرايا والأضواء الخارجية" },
  { text: "الزجاج", tooltip: "التحقق من سلامة الزجاج" },
  { text: "الكفرات والجنوط", tooltip: "فحص تآكل الكفرات وتوازن الجنوط" },
  { text: "الشمعات والأسطبات", tooltip: "فحص عمل وسلامة الشمعات والأسطبات" },
];

export const PLANS = [
  {
    key: "basic",
    serviceId: 9,
    title: "الأساسي",
    checkedCount: 9,
    featured: false,
  },
  {
    key: "full",
    serviceId: 8,
    title: "الشامل",
    checkedCount: CHECKLIST_ITEMS.length,
    featured: true,
  },
  {
    key: "engines",
    serviceId: 10,
    title: "المحركات",
    checkedCount: 7,
    featured: false,
  },
];

export const YEARS = Array.from({ length: 29 }, (_, i) => 2027 - i);

export function isDiscountActive(discount) {
  if (!discount || Number(discount.is_active) !== 1) return false;
  if (!discount.expires_at) return true;
  const expiresAt = new Date(discount.expires_at);
  return !Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() > Date.now();
}

export function getServiceDiscountPercent(discounts, serviceId) {
  if (!Array.isArray(discounts) || !serviceId) return 0;

  const discount = discounts.find((item) => Number(item.service_id) === Number(serviceId));
  if (!isDiscountActive(discount)) return 0;

  const unit = String(discount.discount_unit || "%").trim();
  if (unit !== "%") return 0;

  return Math.max(0, Number(discount.discount_value) || 0);
}

export function applyBranchDiscount(originalPrice, discountPercent = 0) {
  const original = Math.floor(Number(originalPrice) || 0);
  const rate = Math.min(100, Math.max(0, Number(discountPercent) || 0)) / 100;
  const price = Math.floor(original * (1 - rate));

  return {
    price,
    originalPrice: original,
    youSave: Math.max(0, original - price),
    discountPercent: Math.min(100, Math.max(0, Number(discountPercent) || 0)),
  };
}

export function buildPlansFromPrices(prices, discounts = []) {
  if (!Array.isArray(prices) || prices.length === 0) return [];

  return PLANS.map((plan) => {
    const record = prices.find((item) => item.serviceId === plan.serviceId);
    const discountPercent = getServiceDiscountPercent(discounts, plan.serviceId);
    const discounted = applyBranchDiscount(record?.price ?? record?.original_price ?? 0, discountPercent);
    return {
      ...plan,
      ...discounted,
    };
  }).filter((plan) => plan.originalPrice > 0);
}

/** Static 25% discount for the new-branch kiosk (not API-driven). */
export function buildNewBranchPlansFromPrices(prices) {
  if (!Array.isArray(prices) || prices.length === 0) return [];

  return PLANS.map((plan) => {
    const record = prices.find((item) => item.serviceId === plan.serviceId);
    const discounted = applyBranchDiscount(record?.price ?? record?.original_price ?? 0, DISCOUNT_PERCENT);
    return {
      ...plan,
      ...discounted,
    };
  }).filter((plan) => plan.originalPrice > 0);
}

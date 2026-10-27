import { CHECKLIST_ITEMS, PLANS, YEARS } from "@/lib/new-branch-plans";

export { CHECKLIST_ITEMS, PLANS, YEARS };

/** year ≤ 2009 → 15% all plans; year ≥ 2010 → 10% الشامل only */
export function getGalleryDiscountPercent(planKey, year) {
  const yearNum = Number(year);
  const isOldYear = yearNum > 0 && yearNum <= 2009;

  if (isOldYear) return 15;
  if (planKey === "full") return 10;
  return 0;
}

export function applyGalleryDiscount(originalPrice, discountPercent) {
  const original = Math.floor(Number(originalPrice) || 0);
  const rate = (Number(discountPercent) || 0) / 100;
  const price = Math.floor(original * (1 - rate));

  return {
    price,
    originalPrice: original,
    youSave: Math.max(0, original - price),
    discountPercent: Number(discountPercent) || 0,
  };
}

export function buildGalleryPlansFromPrices(prices, year) {
  if (!Array.isArray(prices) || prices.length === 0) return [];

  return PLANS.map((plan) => {
    const record = prices.find((item) => item.serviceId === plan.serviceId);
    const discountPercent = getGalleryDiscountPercent(plan.key, year);
    const discounted = applyGalleryDiscount(
      record?.price ?? record?.original_price ?? 0,
      discountPercent
    );

    return {
      ...plan,
      ...discounted,
    };
  }).filter((plan) => plan.originalPrice > 0);
}

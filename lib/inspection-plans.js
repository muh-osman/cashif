import { buildPlansFromPrices } from "@/lib/new-branch-plans";

let pendingSearch = null;

export async function fetchInspectionPlans(modelId, year) {
  const [pricesResponse, discountsResponse] = await Promise.all([
    fetch(`/api/service-prices?year=${encodeURIComponent(year)}&markId=${encodeURIComponent(modelId)}`),
    fetch("/api/service-discounts"),
  ]);

  const data = await pricesResponse.json().catch(() => []);
  const discounts = discountsResponse.ok ? await discountsResponse.json().catch(() => []) : [];

  if (!pricesResponse.ok) {
    const error = new Error(data?.message || "تعذر تحميل أسعار الباقات");
    error.code = "fetch-failed";
    error.messageAr = data?.message || "تعذر تحميل أسعار الباقات";
    throw error;
  }

  return buildPlansFromPrices(data, Array.isArray(discounts) ? discounts : []);
}

export function stashPendingPricesSearch(payload) {
  pendingSearch = payload;
}

/** Read without clearing — survives React Strict Mode remounts. */
export function getPendingPricesSearch({ modelId, year, service }) {
  if (!pendingSearch) return null;

  const matches =
    String(pendingSearch.model?.id) === String(modelId) &&
    String(pendingSearch.year) === String(year) &&
    String(pendingSearch.service || "") === String(service || "");

  return matches ? pendingSearch : null;
}

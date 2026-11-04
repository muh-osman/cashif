"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CarModelSearch } from "@/components/car-model-search";
import { InspectionPlansGrid } from "@/components/inspection-plan-card";
import { buildPlansFromPrices, YEARS } from "@/lib/new-branch-plans";

const SERVICE_LABELS = {
  purchaseInspection: "فحص الشراء",
  checkit: "فحص مخدوم",
  passengerCheck: "فحص المسافر",
};

const OLDEST_YEAR = String(YEARS[YEARS.length - 1]);
const DEFAULT_SUBTITLE = "اطلع على أسعار فحص السيارات حسب الموديل وسنة الصنع";

function formatSelectedSearch(selection) {
  if (!selection?.model) return null;

  const { model, year, service } = selection;
  const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
  const modelLabel = [model.nameAr, model.nameEn].map(clean).filter(Boolean).join(" - ");
  const yearLabel = String(year) === OLDEST_YEAR ? "أقدم" : String(year ?? "");
  const serviceLabel = SERVICE_LABELS[service] || "";

  const label = [modelLabel, yearLabel, serviceLabel].filter(Boolean).join(" | ");
  return label || null;
}

export default function PricesPage() {
  const [plans, setPlans] = useState([]);
  const [showPlans, setShowPlans] = useState(false);
  const [selection, setSelection] = useState(null);
  const [reopenKey, setReopenKey] = useState(0);

  function clearResults() {
    setShowPlans(false);
    setPlans([]);
    setSelection(null);
  }

  async function handleSearch({ model, year, service }) {
    if (!model?.id || !year) {
      toast.warning("الرجاء ادخال جميع البيانات");
      throw new Error("incomplete");
    }

    try {
      const [pricesResponse, discountsResponse] = await Promise.all([
        fetch(
          `/api/service-prices?year=${encodeURIComponent(year)}&markId=${encodeURIComponent(model.id)}`
        ),
        fetch("/api/service-discounts"),
      ]);

      const data = await pricesResponse.json().catch(() => []);
      const discounts = discountsResponse.ok
        ? await discountsResponse.json().catch(() => [])
        : [];

      if (!pricesResponse.ok) {
        toast.error(data?.message || "تعذر تحميل أسعار الباقات");
        clearResults();
        throw new Error("fetch-failed");
      }

      const nextPlans = buildPlansFromPrices(data, Array.isArray(discounts) ? discounts : []);
      setPlans(nextPlans);
      setShowPlans(nextPlans.length > 0);
      setSelection(nextPlans.length > 0 ? { model, year, service } : null);

      if (nextPlans.length === 0) {
        toast.warning("لا توجد أسعار متاحة لهذا الموديل");
        throw new Error("empty");
      }
    } catch (error) {
      if (error?.message === "fetch-failed" || error?.message === "empty" || error?.message === "incomplete") {
        throw error;
      }
      toast.error("تعذر تحميل أسعار الباقات");
      clearResults();
      throw error;
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          الأسعار
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
        <p className="text-[#757575]">{formatSelectedSearch(selection) ?? DEFAULT_SUBTITLE}</p>
        {selection ? (
          <button
            type="button"
            onClick={() => setReopenKey((key) => key + 1)}
            className="cursor-pointer text-sm font-medium text-[#174545] underline-offset-4 hover:underline"
          >
            تعديل
          </button>
        ) : null}
      </div>

      <CarModelSearch hideTrigger onSearch={handleSearch} prefill={selection} reopenKey={reopenKey} />

      {showPlans ? <InspectionPlansGrid plans={plans} /> : null}
    </main>
  );
}

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CarModelSearch } from "@/components/car-model-search";
import { InspectionPlansGrid } from "@/components/inspection-plan-card";
import { buildPlansFromPrices } from "@/lib/new-branch-plans";

export default function PricesPage() {
  const [plans, setPlans] = useState([]);
  const [showPlans, setShowPlans] = useState(false);

  async function handleSearch({ model, year }) {
    if (!model?.id || !year) {
      toast.warning("الرجاء ادخال جميع البيانات");
      throw new Error("incomplete");
    }

    try {
      const response = await fetch(
        `/api/service-prices?year=${encodeURIComponent(year)}&markId=${encodeURIComponent(model.id)}`
      );
      const data = await response.json().catch(() => []);

      if (!response.ok) {
        toast.error(data?.message || "تعذر تحميل أسعار الباقات");
        setShowPlans(false);
        setPlans([]);
        throw new Error("fetch-failed");
      }

      const nextPlans = buildPlansFromPrices(data);
      setPlans(nextPlans);
      setShowPlans(nextPlans.length > 0);

      if (nextPlans.length === 0) {
        toast.warning("لا توجد أسعار متاحة لهذا الموديل");
        throw new Error("empty");
      }
    } catch (error) {
      if (error?.message === "fetch-failed" || error?.message === "empty" || error?.message === "incomplete") {
        throw error;
      }
      toast.error("تعذر تحميل أسعار الباقات");
      setShowPlans(false);
      setPlans([]);
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
        <p className="text-[#757575]">اطلع على أسعار فحص السيارات حسب الموديل وسنة الصنع</p>
      </div>

      <CarModelSearch hideTrigger onSearch={handleSearch} />

      {showPlans ? <InspectionPlansGrid plans={plans} /> : null}
    </main>
  );
}

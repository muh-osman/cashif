"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CarModelSearch } from "@/components/car-model-search";
import { InspectionPlansGrid } from "@/components/inspection-plan-card";
import { loadCarCatalog } from "@/lib/car-catalog";
import { fetchInspectionPlans, getPendingPricesSearch } from "@/lib/inspection-plans";
import { YEARS } from "@/lib/new-branch-plans";

const SERVICE_KEYS = ["purchaseInspection", "checkit", "passengerCheck"];

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

function serviceFromSearchParams(searchParams) {
  return SERVICE_KEYS.find((key) => searchParams.get(key) === "true") || "purchaseInspection";
}

export default function PricesPage() {
  const searchParams = useSearchParams();
  const modelId = searchParams.get("modelId");
  const year = searchParams.get("year");
  const service = serviceFromSearchParams(searchParams);
  const queryKey = modelId && year ? `${modelId}|${year}|${service}` : "";

  const pending = queryKey ? getPendingPricesSearch({ modelId, year, service }) : null;

  const [plans, setPlans] = useState(() => pending?.plans ?? []);
  const [showPlans, setShowPlans] = useState(() => (pending?.plans?.length ?? 0) > 0);
  const [selection, setSelection] = useState(() =>
    pending?.plans?.length ? { model: pending.model, year: pending.year, service: pending.service } : null
  );
  const [loading, setLoading] = useState(() => Boolean(queryKey) && !(pending?.plans?.length > 0));
  const [reopenKey, setReopenKey] = useState(0);
  const [bootKey, setBootKey] = useState(() => (pending?.plans?.length ? queryKey : ""));
  const appliedQueryRef = useRef(pending?.plans?.length ? queryKey : "");

  // Keep UI in sync if the URL query changes after mount.
  if (pending?.plans?.length && bootKey !== queryKey) {
    setBootKey(queryKey);
    setPlans(pending.plans);
    setShowPlans(true);
    setLoading(false);
    setSelection({ model: pending.model, year: pending.year, service: pending.service });
    appliedQueryRef.current = queryKey;
  }

  function applyResult({ model, year: nextYear, service: nextService, plans: nextPlans }) {
    setPlans(nextPlans);
    setShowPlans(nextPlans.length > 0);
    setSelection(nextPlans.length > 0 ? { model, year: nextYear, service: nextService } : null);
  }

  function clearResults() {
    setShowPlans(false);
    setPlans([]);
    setSelection(null);
  }

  async function handleSearch({ model, year: nextYear, service: nextService }) {
    if (!model?.id || !nextYear) {
      toast.warning("الرجاء ادخال جميع البيانات");
      throw new Error("incomplete");
    }

    try {
      const nextPlans = await fetchInspectionPlans(model.id, nextYear);
      applyResult({ model, year: nextYear, service: nextService, plans: nextPlans });

      if (nextPlans.length === 0) {
        toast.warning("لا توجد أسعار متاحة لهذا الموديل");
        throw new Error("empty");
      }
    } catch (error) {
      if (error?.message === "empty" || error?.message === "incomplete") {
        throw error;
      }
      if (error?.code === "fetch-failed") {
        toast.error(error.messageAr || error.message);
        clearResults();
        throw error;
      }
      toast.error(error?.messageAr || error?.message || "تعذر تحميل أسعار الباقات");
      clearResults();
      throw error;
    }
  }

  // Direct visits / refresh: no prefetch stash — load from URL params.
  useEffect(() => {
    if (!queryKey) {
      setLoading(false);
      return;
    }
    if (appliedQueryRef.current === queryKey) return;
    if (pending?.plans?.length) {
      appliedQueryRef.current = queryKey;
      setLoading(false);
      return;
    }

    appliedQueryRef.current = queryKey;
    setLoading(true);
    let active = true;

    (async () => {
      try {
        const catalog = await loadCarCatalog();
        if (!active) return;

        const model = catalog.models.find((item) => String(item.id) === String(modelId));
        if (!model) {
          toast.error("تعذر العثور على الموديل المحدد");
          setLoading(false);
          return;
        }

        const nextPlans = await fetchInspectionPlans(model.id, year);
        if (!active) return;

        applyResult({ model, year, service, plans: nextPlans });

        if (nextPlans.length === 0) {
          toast.warning("لا توجد أسعار متاحة لهذا الموديل");
        }
      } catch (error) {
        if (!active) return;
        toast.error(error?.messageAr || error?.message || "تعذر تحميل أسعار الباقات");
        clearResults();
        if (appliedQueryRef.current === queryKey) appliedQueryRef.current = "";
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [queryKey, modelId, year, service, pending]);

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
            className="cursor-pointer text-sm font-medium text-[#174545] underline underline-offset-4"
          >
            تعديل
          </button>
        ) : null}
      </div>

      <CarModelSearch hideTrigger onSearch={handleSearch} prefill={selection} reopenKey={reopenKey} />

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
          <Loader2 className="h-10 w-10 animate-spin text-[#174545]" />
          <span className="sr-only">جاري تحميل الأسعار</span>
        </div>
      ) : showPlans ? (
        <InspectionPlansGrid plans={plans} />
      ) : null}
    </main>
  );
}

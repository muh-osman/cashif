"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, ChevronsUpDown, Delete, Info, Loader2, SaudiRiyal, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  CHECKLIST_ITEMS,
  YEARS,
  buildGalleryPlansFromPrices,
} from "@/lib/plans-gallery-plans";

const RESET_MS = 2 * 60 * 1000;

function ChecklistItem({ checked, text, tooltip }) {
  return (
    <li
      className={cn(
        "flex items-start gap-1.5 text-[11px] leading-snug sm:text-xs",
        checked ? "text-[#002623]" : "text-[#b0b0b0]"
      )}
    >
      {checked ? (
        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#25d366]" strokeWidth={3} />
      ) : (
        <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#b0b0b0]" strokeWidth={3} />
      )}
      <span className="min-w-0 flex-1">{text}</span>
      <Popover>
        <PopoverTrigger
          className={cn(
            "mt-0.5 inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full transition hover:bg-[#174545]/10 hover:text-[#174545]",
            checked ? "text-[#757575]" : "text-[#b0b0b0]"
          )}
          aria-label={`معلومات عن ${text}`}
        >
          <Info className="h-3.5 w-3.5" />
        </PopoverTrigger>
        <PopoverContent align="center" side="top" className="w-56 p-3 text-right text-xs leading-relaxed text-[#002623]">
          {tooltip}
        </PopoverContent>
      </Popover>
    </li>
  );
}

function PlanCard({ plan }) {
  const showDiscount = plan.discountPercent > 0;

  return (
    <Card
      className={cn(
        "relative min-w-0 flex-1 gap-0 overflow-hidden rounded-3xl py-0 shadow-md ring-1 ring-[#002623]/8",
        plan.featured && "ring-2 ring-[#174545]"
      )}
    >
      <div
        className={cn(
          "flex h-14 shrink-0 items-center justify-center border-b border-[#002623]/8 px-2 text-center sm:px-3",
          plan.featured ? "bg-[#174545] text-white" : "bg-[#f7f7f8] text-[#002623]"
        )}
      >
        <h3 className="font-display text-sm leading-none sm:text-base">{plan.title}</h3>
      </div>

      <CardContent className="flex flex-col gap-3 px-2 py-4 sm:px-3">
        <div className="text-center">
          {showDiscount ? (
            <div className="mb-2 flex justify-end" dir="rtl">
              <span className="inline-flex items-center rounded-full bg-[#e5484d] px-2.5 py-[6px] text-[10px] font-bold leading-none text-white sm:text-xs">
                خصم {plan.discountPercent}%
              </span>
            </div>
          ) : null}

          <p className="flex items-center justify-center gap-1 text-2xl font-bold text-[#174545] sm:text-3xl">
            <span>{plan.price}</span>
            <SaudiRiyal className="h-5 w-5 sm:h-6 sm:w-6" />
          </p>

          {plan.youSave > 0 && (
            <div className="mt-2 inline-flex max-w-full overflow-hidden rounded-full text-[11px] font-bold sm:text-xs">
              <span className="inline-flex shrink-0 items-center justify-center gap-0.5 whitespace-nowrap bg-[#fce8e8] px-2 py-1 text-[#d32f2f] line-through sm:px-2.5">
                {plan.originalPrice}
                <SaudiRiyal className="h-3 w-3 shrink-0" />
              </span>
              <span className="inline-flex shrink-0 items-center justify-center gap-0.5 whitespace-nowrap bg-[#dff1d9] px-2 py-1 text-[#25d366] sm:px-2.5">
                وفر {plan.youSave}
                <SaudiRiyal className="h-3 w-3 shrink-0" />
              </span>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] font-semibold text-[#002623] sm:text-xs">تشمل فحص:</p>

        <ul className="space-y-1.5">
          {CHECKLIST_ITEMS.map((item, index) => (
            <ChecklistItem
              key={item.text}
              checked={index < plan.checkedCount}
              text={item.text}
              tooltip={item.tooltip}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ModelCombobox({ models, manufacturersById, selectedModel, onSelect, loading }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "flex h-14 w-full cursor-pointer items-center justify-between rounded-full border border-[#002623]/10 bg-[#f7f7f8] px-5 text-base font-medium text-[#002623] outline-none transition focus:border-[#174545]",
          !selectedModel && "text-[#757575]"
        )}
      >
        <span className="truncate">
          {selectedModel
            ? `${selectedModel.nameAr} - ${selectedModel.nameEn}${
                manufacturersById.get(selectedModel.carManufacturerId)
                  ? ` | ${manufacturersById.get(selectedModel.carManufacturerId)}`
                  : ""
              }`
            : "بحث"}
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>

      <PopoverContent align="center" className="w-[min(92vw,40rem)] p-0 sm:w-[var(--anchor-width)]" sideOffset={8}>
        <Command>
          <CommandInput placeholder="ابحث بالاسم أو الشركة المصنعة..." className="h-12 text-base" />
          <CommandList className="max-h-80">
            <CommandEmpty>
              <span className="block px-4 py-3 text-center text-sm text-[#757575]">
                {loading ? "جاري التحميل.." : "موديل غير موجود"}
              </span>
            </CommandEmpty>
            <CommandGroup>
              {models.map((model) => {
                const manufacturerName = manufacturersById.get(model.carManufacturerId) || "";
                return (
                  <CommandItem
                    key={model.id}
                    value={`${model.nameAr} ${model.nameEn} ${manufacturerName}`}
                    data-checked={selectedModel?.id === model.id || undefined}
                    onSelect={() => {
                      onSelect(model);
                      setOpen(false);
                    }}
                    className="min-h-12 cursor-pointer py-3 text-base"
                  >
                    <span>
                      {model.nameAr} - {model.nameEn}
                    </span>
                    {manufacturerName ? <span className="mr-2 text-xs text-[#888]">| {manufacturerName}</span> : null}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function PlansGalleryKiosk() {
  const [models, setModels] = useState([]);
  const [manufacturersById, setManufacturersById] = useState(() => new Map());
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [plans, setPlans] = useState([]);
  const [showPlans, setShowPlans] = useState(false);
  const [fetchingPrices, setFetchingPrices] = useState(false);
  const searchBtnRef = useRef(null);
  const resetTimerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      setCatalogLoading(true);
      try {
        const [modelsRes, manufacturersRes] = await Promise.all([
          fetch("/api/car-models"),
          fetch("/api/car-manufacturers"),
        ]);

        const [modelsData, manufacturersData] = await Promise.all([
          modelsRes.json().catch(() => []),
          manufacturersRes.json().catch(() => []),
        ]);

        if (cancelled) return;

        const map = new Map();
        for (const manufacturer of Array.isArray(manufacturersData) ? manufacturersData : []) {
          if (manufacturer?.id != null) {
            map.set(manufacturer.id, manufacturer.nameAr || manufacturer.nameEn || "");
          }
        }

        setManufacturersById(map);
        setModels(Array.isArray(modelsData) ? modelsData : []);
      } catch {
        if (!cancelled) {
          setModels([]);
          setManufacturersById(new Map());
        }
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
    }

    loadCatalog();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  function clearResetTimer() {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }

  function handleBack() {
    clearResetTimer();
    setShowPlans(false);
    setPlans([]);
    setSelectedModel(null);
    setSelectedYear("");
  }

  function scheduleReset() {
    clearResetTimer();
    resetTimerRef.current = setTimeout(() => {
      handleBack();
    }, RESET_MS);
  }

  async function handleSubmit() {
    if (!selectedModel?.id || !selectedYear) {
      toast.warning("الرجاء ادخال جميع البيانات");
      return;
    }

    setFetchingPrices(true);
    try {
      const response = await fetch(
        `/api/service-prices?year=${encodeURIComponent(selectedYear)}&markId=${encodeURIComponent(selectedModel.id)}`
      );
      const data = await response.json().catch(() => []);

      if (!response.ok) {
        toast.error(data?.message || "تعذر تحميل أسعار الباقات");
        setShowPlans(false);
        setPlans([]);
        return;
      }

      const nextPlans = buildGalleryPlansFromPrices(data, selectedYear);
      setPlans(nextPlans);
      setShowPlans(nextPlans.length > 0);

      if (nextPlans.length === 0) {
        toast.warning("لا توجد أسعار متاحة لهذا الموديل");
        return;
      }

      scheduleReset();

      setTimeout(() => {
        searchBtnRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      toast.error("تعذر تحميل أسعار الباقات");
      setShowPlans(false);
      setPlans([]);
    } finally {
      setFetchingPrices(false);
    }
  }

  return (
    <div className="min-h-dvh bg-background text-[#002623]">
      <header>
        <div className="relative flex h-24 items-center justify-center rounded-b-[40px] bg-[#174545] px-4">
          <button
            type="button"
            onClick={handleBack}
            aria-label="مسح"
            className="absolute left-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-white transition duration-200 hover:scale-105 hover:bg-white/15 active:scale-95 active:bg-white/25"
          >
            <Delete className="h-8 w-8" />
          </button>
          <div className="h-20 w-36">
            <Image src="/images/logo.webp" alt="كاشف" width={144} height={80} className="h-full w-full object-contain" priority />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8">
        <div className="mb-8 text-center">
          <h1 className="font-display relative z-0 inline-block text-3xl text-[#002623]">
            حدد نوع السيارة
            <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
          </h1>
        </div>

        <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
          <ModelCombobox
            models={models}
            manufacturersById={manufacturersById}
            selectedModel={selectedModel}
            onSelect={setSelectedModel}
            loading={catalogLoading}
          />

          <label className="block w-full">
            <span className="mb-2 block text-sm font-semibold text-[#002623]">سنة الصنع</span>
            <span className="relative block">
              <select
                value={selectedYear}
                onChange={(event) => setSelectedYear(event.target.value)}
                className="h-14 w-full cursor-pointer appearance-none rounded-full border border-[#002623]/10 bg-[#f7f7f8] px-5 pe-10 text-base font-medium outline-none focus:border-[#174545]"
              >
                <option value="">سنة الصنع</option>
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year === 1999 ? "أقدم" : year}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-xs text-[#757575]">▾</span>
            </span>
          </label>

          <div ref={searchBtnRef} className="pt-2">
            <Button
              type="button"
              size="icon-lg"
              onClick={handleSubmit}
              disabled={fetchingPrices}
              aria-label="بحث"
              className="h-20 w-20 cursor-pointer rounded-full border border-[#002623]/10 bg-[#f7f7f8] text-[#174545] shadow-md hover:bg-[#174545] hover:text-white"
            >
              {fetchingPrices ? <Loader2 className="size-12 animate-spin" /> : <Search className="size-12" />}
            </Button>
          </div>
        </div>

        {!showPlans && (
          <div className="mt-16 select-none text-center font-display font-bold leading-none text-[#bdbdbd]">
            <p className="text-[clamp(4rem,18vw,9rem)]">أسعار</p>
            <p className="text-[clamp(4rem,18vw,9rem)]">الفحص</p>
          </div>
        )}

        {showPlans && (
          <section className="mt-10">
            <h2 className="mb-6 text-center font-display text-xl text-[#002623] sm:text-2xl">اختر الباقة المناسبة</h2>
            <div className="flex flex-nowrap items-start gap-2 sm:gap-3">
              {plans.map((plan) => (
                <PlanCard key={plan.key} plan={plan} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

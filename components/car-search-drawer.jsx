"use client";

import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";
import { Check, Minus, Plus, Search, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { SERVICES } from "@/components/services-grid";
import { cn } from "@/lib/utils";
import { YEARS } from "@/lib/new-branch-plans";

const SERVICE_SHORT_DESCRIPTIONS = {
  purchaseInspection: "فحص جميع أنواع السيارات المستعملة مع تجربة ميدانية وتقرير مفصل يوضح الحالة والعيوب قبل اتخاذ قرار الشراء",
  checkit: "نتولى فحص السيارة وتوثيق حالتها ونقل ملكيتها وشحنها دون الحاجة الى حضورك",
  passengerCheck: "فحص مخصص قبل السفر للتأكد من سلامة السيارة وجاهزيتها لرحلة آمنة ومريحة",
};

const DRAWER_SERVICES = [
  SERVICES.find((service) => service.param === "purchaseInspection"),
  SERVICES.find((service) => service.param === "checkit"),
  SERVICES.find((service) => service.param === "passengerCheck"),
]
  .filter(Boolean)
  .map((service) => ({
    ...service,
    description: SERVICE_SHORT_DESCRIPTIONS[service.param] ?? service.description,
  }));

const MAX_YEAR = YEARS[0];
const MIN_YEAR = YEARS[YEARS.length - 1];
const DEFAULT_YEAR = "2024";

export function CarSearchDrawer({
  open,
  onOpenChange,
  model,
  onModelChange,
  models = [],
  manufacturersById = new Map(),
  catalogLoading = false,
  onSearch,
}) {
  const [selectedYear, setSelectedYear] = useState(DEFAULT_YEAR);
  const [selectedService, setSelectedService] = useState("purchaseInspection");

  useEffect(() => {
    if (!open) return;
    setSelectedYear(DEFAULT_YEAR);
    setSelectedService("purchaseInspection");
  }, [open]);

  const yearValue = Number(selectedYear) || MAX_YEAR;
  const canDecreaseYear = yearValue > MIN_YEAR;
  const canIncreaseYear = yearValue < MAX_YEAR;

  function changeYear(nextYear) {
    const clamped = Math.min(MAX_YEAR, Math.max(MIN_YEAR, nextYear));
    setSelectedYear(String(clamped));
  }

  const modelLabel = model
    ? `${model.nameAr}${model.nameEn ? ` - ${model.nameEn}` : ""}`
    : "";
  const canSearch = Boolean(model?.id && selectedYear && selectedService);
  const selectedIndex = DRAWER_SERVICES.findIndex((service) => service.param === selectedService);
  const activeService = selectedIndex >= 0 ? DRAWER_SERVICES[selectedIndex] : null;

  function handleSearch() {
    if (!canSearch) {
      toast.warning("الرجاء ادخال جميع البيانات");
      return;
    }

    onSearch?.({
      model,
      year: selectedYear,
      service: selectedService,
    });
    onOpenChange?.(false);
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent
        className="sm:mx-auto sm:w-[450px] sm:[--drawer-content-width:450px] sm:data-[swipe-axis=y]:inset-x-0"
        style={{
          "--drawer-content-height": "calc(100dvh - 1rem)",
          "--drawer-content-max-height": "calc(100dvh - 1rem)",
        }}
      >
        <DrawerHeader className="text-right md:text-right">
          <DrawerTitle className="font-display text-[#002623]">اختر التفاصيل</DrawerTitle>
          <DrawerDescription className="text-[#757575]">
            {modelLabel || "اختر الموديل وسنة الصنع والخدمة"}
          </DrawerDescription>
        </DrawerHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 pt-3 pb-6 text-right">
          <div>
            <span className="mb-2 block text-sm font-semibold text-[#002623]">الخدمة</span>

            <div className="relative overflow-hidden rounded-[24px] bg-white shadow-[0_7px_29px_0_rgba(100,100,111,0.12)]">
              <span
                className={cn(
                  "pointer-events-none absolute inset-y-0 right-0 w-1/3 rounded-[24px] border-4 border-white bg-[#f0f1f3] transition-transform duration-300 ease-out",
                  selectedIndex === 1 && "-translate-x-full",
                  selectedIndex === 2 && "-translate-x-[200%]"
                )}
              />
              <div className="relative z-10 grid h-13 grid-cols-3">
                {DRAWER_SERVICES.map((service) => (
                  <button
                    key={service.param}
                    type="button"
                    onClick={() => setSelectedService(service.param)}
                    className={cn(
                      "flex h-full cursor-pointer items-center justify-center px-1 text-center text-[11px] font-medium leading-4 text-[#174545] sm:text-sm sm:leading-5",
                      selectedService === service.param && "font-semibold"
                    )}
                  >
                    {service.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <Card
                key={activeService?.param}
                className="animate-in fade-in-0 slide-in-from-top-1 overflow-visible rounded-[40px] border-none py-0 ring-0 shadow-[0_7px_29px_0_rgba(100,100,111,0.2)] duration-300"
              >
                <CardContent className="space-y-3 p-5 text-right">
                  {activeService ? (
                    <>
                      <p className="text-center text-sm leading-relaxed text-[#757575]">{activeService.description}</p>
                      <ul className="space-y-2">
                        {activeService.points.map((point, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm font-medium text-[#002623]">
                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#4caf50]" />
                            <span className="min-w-0">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <span className="mb-2 block text-sm font-semibold text-[#002623]">سنة الصنع</span>
            <div
              dir="ltr"
              className="mx-auto flex h-13 w-full max-w-[220px] items-center justify-between rounded-full border border-[#002623]/10 bg-secondary p-1 text-[#174545] shadow-[0_7px_29px_0_rgba(100,100,111,0.12)]"
            >
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="سنة أقدم"
                disabled={!canDecreaseYear}
                onClick={() => changeYear(yearValue - 1)}
                className="size-11 shrink-0 cursor-pointer rounded-full border-[#002623]/10 bg-white text-[#174545] hover:bg-[#f0f1f3] disabled:cursor-not-allowed"
              >
                <Minus className="size-4" />
              </Button>

              <div className="flex min-w-0 flex-1 items-center justify-center px-2 text-center text-base font-semibold tabular-nums">
                {yearValue === MIN_YEAR ? (
                  <span>أقدم</span>
                ) : (
                  <NumberFlow
                    value={yearValue}
                    locales="en-US"
                    format={{ useGrouping: false, maximumFractionDigits: 0 }}
                    style={{ fontVariantNumeric: "tabular-nums", lineHeight: 0.85 }}
                  />
                )}
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="سنة أحدث"
                disabled={!canIncreaseYear}
                onClick={() => changeYear(yearValue + 1)}
                className="size-11 shrink-0 cursor-pointer rounded-full border-[#002623]/10 bg-white text-[#174545] hover:bg-[#f0f1f3] disabled:cursor-not-allowed"
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          <div>
            <span className="mb-2 block text-sm font-semibold text-[#002623]">الموديل</span>
            <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_7px_29px_0_rgba(100,100,111,0.12)]">
              <Command dir="rtl" className="rounded-[24px] bg-transparent">
                <CommandInput placeholder="ابحث بالاسم أو الشركة المصنعة..." />
                <CommandList className="max-h-48">
                  <CommandEmpty>
                    {catalogLoading ? (
                      <span className="block px-4 py-3 text-center text-sm text-[#757575]">جاري التحميل..</span>
                    ) : (
                      <a
                        href="https://wa.me/966920019948?text=استعلام عن موديل غير موجود"
                        target="_blank"
                        rel="noreferrer"
                        className="block px-4 py-3 text-center text-sm text-[#0b6bcb] underline"
                      >
                        لم تجد موديلك؟ تواصل معنا
                      </a>
                    )}
                  </CommandEmpty>
                  <CommandGroup>
                    {models.map((item) => {
                      const manufacturerName = manufacturersById.get(item.carManufacturerId) || "";

                      return (
                        <CommandItem
                          key={item.id}
                          value={`${item.nameAr} ${item.nameEn} ${manufacturerName}`}
                          onSelect={() => onModelChange?.(item)}
                          className="flex items-center"
                        >
                          <Check className={cn("ml-2 h-4 w-4", model?.id === item.id ? "opacity-100" : "opacity-0")} />
                          <span>
                            {item.nameAr} - {item.nameEn}
                          </span>
                          {manufacturerName ? <span className="mr-2 text-xs text-[#888]">| {manufacturerName}</span> : null}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </div>
        </div>

        <DrawerFooter className="pt-2 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <Button
            type="button"
            size="lg"
            onClick={handleSearch}
            disabled={!canSearch}
            className="w-full cursor-pointer rounded-4xl bg-[#174545] text-white hover:bg-[#174545]/90 disabled:cursor-not-allowed"
          >
            <Search className="size-5" />
            بحث
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

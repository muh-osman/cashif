"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { YEARS } from "@/lib/new-branch-plans";

const DRAWER_SERVICES = [
  { param: "purchaseInspection", title: "فحص الشراء", number: 1 },
  { param: "checkit", title: "خدمة مخدوم", number: 2 },
  { param: "passengerCheck", title: "فحص المسافر", number: 3 },
];

export function CarSearchDrawer({ open, onOpenChange, model, onSearch }) {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setSelectedYear("");
    setSelectedService(null);
  }, [open, model?.id]);

  const modelLabel = model
    ? `${model.nameAr}${model.nameEn ? ` - ${model.nameEn}` : ""}`
    : "";
  const canSearch = Boolean(model?.id && selectedYear && selectedService);

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
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      showSwipeHandle
      modal={false}
      disablePointerDismissal
    >
      {mounted && open
        ? createPortal(
            <div aria-hidden className="pointer-events-none fixed inset-0 z-[55] bg-black/30" />,
            document.body
          )
        : null}
      <DrawerContent className="sm:mx-auto sm:w-[450px] sm:[--drawer-content-width:450px] sm:data-[swipe-axis=y]:inset-x-0">
        <DrawerHeader className="text-right md:text-right">
          <DrawerTitle className="font-display text-[#002623]">اختر التفاصيل</DrawerTitle>
          <DrawerDescription className={cn("text-[#757575]", !modelLabel && "sr-only")}>
            {modelLabel || "حدد سنة الصنع والخدمة"}
          </DrawerDescription>
        </DrawerHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 pt-3 pb-2 text-right">
          <label className="block w-full">
            <span className="mb-2 block text-sm font-semibold text-[#002623]">سنة الصنع</span>
            <span className="relative block">
              <select
                value={selectedYear}
                onChange={(event) => setSelectedYear(event.target.value)}
                className="h-12 w-full cursor-pointer appearance-none rounded-full border border-[#002623]/10 bg-[#f7f7f8] px-5 pe-10 text-base font-medium text-[#002623] outline-none focus:border-[#174545]"
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

          <div>
            <span className="mb-2 block text-sm font-semibold text-[#002623]">الخدمة</span>
            <div className="grid grid-cols-3 gap-2">
              {DRAWER_SERVICES.map((service) => {
                const selected = selectedService === service.param;

                return (
                  <button
                    key={service.param}
                    type="button"
                    onClick={() => setSelectedService(service.param)}
                    className={cn(
                      "flex cursor-pointer flex-col items-center gap-2 rounded-3xl border-2 bg-white px-2 py-3 text-center transition",
                      selected
                        ? "border-[#174545] bg-[#174545]/5"
                        : "border-[#002623]/8 hover:border-[#174545]/40"
                    )}
                  >
                    <span className="relative h-14 w-14">
                      <Image
                        src={`/images/wheel-${service.number}.jpg`}
                        alt={service.title}
                        width={56}
                        height={56}
                        className="h-full w-full object-contain"
                      />
                    </span>
                    <span className="text-xs font-bold leading-snug text-[#002623] sm:text-sm">{service.title}</span>
                  </button>
                );
              })}
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

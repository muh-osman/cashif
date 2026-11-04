"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERVICES } from "@/components/services-grid";
import { cn } from "@/lib/utils";
import { YEARS } from "@/lib/new-branch-plans";

const SERVICE_SHORT_DESCRIPTIONS = {
  purchaseInspection: "فحص جميع أنواع السيارات المستعملة مع تجربة ميدانية وتقرير مفصل يوضح الحالة والعيوب قبل اتخاذ قرار الشراء",
  checkit: "نتولى فحص السيارة وتوثيق حالتها ونقل ملكيتها وشحنها دون الحاجة الى حضورك",
  passengerCheck: "فحص مخصص قبل السفر للتأكد من سلامة السيارة وجاهزيتها لرحلة آمنة ومريحة",
};

const SERVICE_DRAWER_TITLES = {
  checkit: "فحص مخدوم",
};

const DRAWER_SERVICES = [
  SERVICES.find((service) => service.param === "purchaseInspection"),
  SERVICES.find((service) => service.param === "checkit"),
  SERVICES.find((service) => service.param === "passengerCheck"),
]
  .filter(Boolean)
  .map((service) => ({
    ...service,
    title: SERVICE_DRAWER_TITLES[service.param] ?? service.title,
    description: SERVICE_SHORT_DESCRIPTIONS[service.param] ?? service.description,
  }));

const MAX_YEAR = YEARS[0];
const MIN_YEAR = YEARS[YEARS.length - 1];
const DEFAULT_YEAR = 2024;
const YEAR_ITEM_HEIGHT = 32;
const HOLD_START_MS = 300;
const HOLD_REPEAT_MS = 70;
// cmdk auto-highlights the first item; keep a non-matching value so nothing looks selected until the user interacts.
const COMMAND_NONE = "__none__";
const MODEL_LIST_MAX_HEIGHT = 192; // max-h-48
const MODEL_LIST_LOADING_HEIGHT = 72;
const YEAR_SELECT_ITEMS = YEARS.map((itemYear) => ({
  value: String(itemYear),
  label: itemYear === MIN_YEAR ? "أقدم" : String(itemYear),
}));

function clampYear(year) {
  return Math.min(MAX_YEAR, Math.max(MIN_YEAR, year));
}

function YearStepper({ resetKey, onYearChange }) {
  const [year, setYear] = useState(DEFAULT_YEAR);
  const [motion, setMotion] = useState("ready"); // ready | instant | hold
  const [pressedDelta, setPressedDelta] = useState(0);
  const [selectOpen, setSelectOpen] = useState(false);
  const yearRef = useRef(DEFAULT_YEAR);
  const onYearChangeRef = useRef(onYearChange);
  const holdTimerRef = useRef(null);
  const holdIntervalRef = useRef(null);
  const pointerHandledRef = useRef(false);
  onYearChangeRef.current = onYearChange;

  useEffect(() => {
    yearRef.current = DEFAULT_YEAR;
    setMotion("instant");
    setPressedDelta(0);
    setSelectOpen(false);
    setYear(DEFAULT_YEAR);
    onYearChangeRef.current?.(String(DEFAULT_YEAR));
    const id = requestAnimationFrame(() => setMotion("ready"));
    return () => cancelAnimationFrame(id);
  }, [resetKey]);

  useEffect(() => {
    return () => {
      clearTimeout(holdTimerRef.current);
      clearInterval(holdIntervalRef.current);
    };
  }, []);

  function applyYear(nextYear, { instant = false } = {}) {
    const next = clampYear(nextYear);
    if (next === yearRef.current) return false;
    yearRef.current = next;
    setMotion(instant ? "instant" : "ready");
    setYear(next);
    onYearChangeRef.current?.(String(next));
    if (instant) {
      requestAnimationFrame(() => setMotion("ready"));
    }
    return true;
  }

  function applyStep(delta) {
    // Close the select so the highlight/check don't drift apart while stepping.
    setSelectOpen(false);
    return applyYear(yearRef.current + delta);
  }

  function stopHold() {
    clearTimeout(holdTimerRef.current);
    clearInterval(holdIntervalRef.current);
    holdTimerRef.current = null;
    holdIntervalRef.current = null;
    setPressedDelta(0);
    setMotion("ready");
  }

  function startHold(delta, event) {
    if (event.button != null && event.button !== 0) return;
    event.preventDefault();
    pointerHandledRef.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    stopHold();
    setPressedDelta(delta);
    setMotion("ready");
    applyStep(delta);
    holdTimerRef.current = setTimeout(() => {
      setMotion("hold");
      holdIntervalRef.current = setInterval(() => {
        if (!applyStep(delta)) stopHold();
      }, HOLD_REPEAT_MS);
    }, HOLD_START_MS);
  }

  function handleClick(delta) {
    if (pointerHandledRef.current) {
      pointerHandledRef.current = false;
      return;
    }
    applyStep(delta);
  }

  function handleSelectYear(value) {
    if (value == null) return;
    applyYear(Number(value), { instant: true });
  }

  const yearIndex = MAX_YEAR - year;
  const canDecrement = year > MIN_YEAR;
  const canIncrement = year < MAX_YEAR;

  function buttonClassName(delta) {
    const pressed = pressedDelta === delta;

    return cn(
      "flex size-11 shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-full border border-[#002623]/10 bg-white text-[#174545] [-webkit-tap-highlight-color:transparent]",
      "transition-[transform,background-color,box-shadow,color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]",
      pressed
        ? "translate-y-px scale-90 bg-[#e8e9eb] text-[#002623] shadow-inner"
        : "shadow-sm hover:bg-[#f0f1f3]",
      "disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
    );
  }

  return (
    <div
      dir="ltr"
      className="mx-auto flex h-13 w-full max-w-[220px] items-center justify-between rounded-full border border-[#002623]/10 bg-secondary p-1 text-[#174545] shadow-[0_7px_29px_0_rgba(100,100,111,0.12)]"
    >
      <button
        type="button"
        aria-label="سنة أقدم"
        disabled={!canDecrement}
        onPointerDown={(event) => startHold(-1, event)}
        onPointerUp={stopHold}
        onPointerCancel={stopHold}
        onLostPointerCapture={stopHold}
        onClick={() => handleClick(-1)}
        onContextMenu={(event) => event.preventDefault()}
        className={buttonClassName(-1)}
      >
        <Minus className={cn("size-4 transition-transform duration-150", pressedDelta === -1 && "scale-90")} />
      </button>

      <div
        aria-live="polite"
        aria-atomic="true"
        className="font-display relative h-8 min-w-0 flex-1 select-none overflow-hidden px-2 text-center text-base tabular-nums"
      >
        <div
          className={cn(
            "pointer-events-none will-change-transform",
            motion === "ready" && "transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
            motion === "hold" && "transition-transform duration-75 ease-linear"
          )}
          style={{
            transform: `translate3d(0, ${-yearIndex * YEAR_ITEM_HEIGHT}px, 0)`,
          }}
        >
          {YEARS.map((itemYear) => (
            <div
              key={itemYear}
              className="flex h-8 items-center justify-center leading-none"
              aria-hidden={itemYear !== year}
            >
              {itemYear === MIN_YEAR ? "أقدم" : itemYear}
            </div>
          ))}
        </div>

        <Select
          items={YEAR_SELECT_ITEMS}
          value={String(year)}
          open={selectOpen}
          onOpenChange={setSelectOpen}
          onValueChange={handleSelectYear}
        >
          <SelectTrigger
            aria-label="سنة الصنع"
            className="absolute inset-0 z-10 h-auto w-full min-w-0 cursor-pointer justify-center rounded-none border-0 bg-transparent p-0 shadow-none ring-0 focus-visible:border-transparent focus-visible:ring-0 data-[size=default]:h-full [&>svg]:hidden *:data-[slot=select-value]:sr-only"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            align="center"
            alignItemWithTrigger={false}
            sideOffset={8}
            positionerClassName="z-[70]"
            className="max-h-60 w-[220px] min-w-[220px] rounded-2xl font-display tabular-nums"
          >
            {YEAR_SELECT_ITEMS.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className="justify-center text-center [&>div:first-child]:justify-center"
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <button
        type="button"
        aria-label="سنة أحدث"
        disabled={!canIncrement}
        onPointerDown={(event) => startHold(1, event)}
        onPointerUp={stopHold}
        onPointerCancel={stopHold}
        onLostPointerCapture={stopHold}
        onClick={() => handleClick(1)}
        onContextMenu={(event) => event.preventDefault()}
        className={buttonClassName(1)}
      >
        <Plus className={cn("size-4 transition-transform duration-150", pressedDelta === 1 && "scale-90")} />
      </button>
    </div>
  );
}

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
  const selectedYearRef = useRef(String(DEFAULT_YEAR));
  const [selectedService, setSelectedService] = useState("purchaseInspection");
  const [serviceDetailsOpen, setServiceDetailsOpen] = useState(false);
  const [commandValue, setCommandValue] = useState(COMMAND_NONE);
  // Collapsed while fetching; expands after the first paint so height can animate.
  const [listReveal, setListReveal] = useState(false);

  useEffect(() => {
    if (!open) {
      setServiceDetailsOpen(false);
      return;
    }
    selectedYearRef.current = String(DEFAULT_YEAR);
    setSelectedService("purchaseInspection");
    setServiceDetailsOpen(false);
    setCommandValue(COMMAND_NONE);
  }, [open]);

  useLayoutEffect(() => {
    if (!open) {
      setListReveal(false);
      return;
    }
    // Before paint: cached data opens fully, in-flight fetch stays collapsed.
    setListReveal(!catalogLoading);
  }, [open]);

  useEffect(() => {
    if (open && catalogLoading) setListReveal(false);
  }, [open, catalogLoading]);

  useEffect(() => {
    setServiceDetailsOpen(false);
  }, [selectedService]);

  useEffect(() => {
    if (!open || catalogLoading || listReveal) return;

    // Wait until the collapsed loading height is painted, then expand.
    let outerFrame = 0;
    let innerFrame = 0;
    outerFrame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => {
        setListReveal(true);
      });
    });
    return () => {
      cancelAnimationFrame(outerFrame);
      cancelAnimationFrame(innerFrame);
    };
  }, [open, catalogLoading, listReveal]);

  const selectedIndex = DRAWER_SERVICES.findIndex((service) => service.param === selectedService);
  const activeService = selectedIndex >= 0 ? DRAWER_SERVICES[selectedIndex] : null;
  const fullService = SERVICES.find((service) => service.param === selectedService) ?? null;

  function handleSearch() {
    if (!model?.id || !selectedYearRef.current || !selectedService) {
      toast.warning("الرجاء ادخال جميع البيانات");
      return;
    }

    onSearch?.({
      model,
      year: selectedYearRef.current,
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
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 pt-3 pb-6 text-right">
          <div>
            <span className="mb-2 block text-sm font-semibold text-[#002623]">اختر الموديل</span>
            <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_7px_29px_0_rgba(100,100,111,0.12)]">
              <Command
                dir="rtl"
                value={commandValue}
                onValueChange={setCommandValue}
                disablePointerSelection
                className="rounded-[24px] bg-transparent [&_[data-slot=input-group]]:h-13 [&_[data-slot=command-input]]:text-base"
              >
                <CommandInput
                  name="car-model-search"
                  aria-label="ابحث عن موديل السيارة"
                  placeholder="ابحث بالاسم أو الشركة المصنعة..."
                />
                {catalogLoading || !listReveal ? (
                  <div
                    className="overflow-hidden"
                    style={{ height: MODEL_LIST_LOADING_HEIGHT }}
                  >
                    <div className="px-4 py-6 text-center text-sm text-[#757575]">جاري التحميل..</div>
                  </div>
                ) : (
                  <CommandList
                    className="max-h-none overflow-y-auto transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                      // cmdk sets --cmdk-list-height from the visible results sizer.
                      height: `min(var(--cmdk-list-height, ${MODEL_LIST_LOADING_HEIGHT}px), ${MODEL_LIST_MAX_HEIGHT}px)`,
                    }}
                    onPointerLeave={() => {
                      if (!model) {
                        setCommandValue(COMMAND_NONE);
                        return;
                      }
                      const manufacturerName = manufacturersById.get(model.carManufacturerId) || "";
                      setCommandValue(`${model.nameAr} ${model.nameEn} ${manufacturerName}`);
                    }}
                  >
                    <CommandEmpty>
                      <a
                        href="https://wa.me/966920019948?text=استعلام عن موديل غير موجود"
                        target="_blank"
                        rel="noreferrer"
                        className="block px-4 py-3 text-center text-sm text-[#0b6bcb] underline"
                      >
                        لم تجد موديلك؟ تواصل معنا
                      </a>
                    </CommandEmpty>
                    <CommandGroup>
                      {models.map((item) => {
                        const manufacturerName = manufacturersById.get(item.carManufacturerId) || "";
                        const itemValue = `${item.nameAr} ${item.nameEn} ${manufacturerName}`;
                        const isChosen = model?.id === item.id;

                        return (
                          <CommandItem
                            key={item.id}
                            value={itemValue}
                            onSelect={() => {
                              setCommandValue(itemValue);
                              onModelChange?.(item);
                            }}
                            className={cn(
                              "flex items-center hover:bg-muted",
                              isChosen && "bg-[#f0f1f3] hover:bg-[#e8e9eb] data-selected:bg-[#e8e9eb]"
                            )}
                          >
                            <Check className={cn("ml-2 h-4 w-4", isChosen ? "opacity-100" : "opacity-0")} />
                            <span>
                              {item.nameAr} - {item.nameEn}
                            </span>
                            {manufacturerName ? <span className="mr-2 text-xs text-[#888]">| {manufacturerName}</span> : null}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                )}
              </Command>
            </div>
          </div>

          <div>
            <span className="mb-2 block text-sm font-semibold text-[#002623]">سنة الصنع</span>
            <YearStepper
              resetKey={open}
              onYearChange={(year) => {
                selectedYearRef.current = year;
              }}
            />
          </div>

          <div>
            <span className="mb-2 block text-sm font-semibold text-[#002623]">اختر الخدمة</span>

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

            <div className="mt-3 rounded-[40px] shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
              <Card className="rounded-[40px] border-none py-0 shadow-none ring-0">
                <CardContent className="p-5 text-center">
                  {activeService ? (
                    <p className="text-sm leading-relaxed text-[#757575]">
                      {activeService.description}
                      <button
                        type="button"
                        onClick={() => setServiceDetailsOpen(true)}
                        className="ms-1 inline align-middle cursor-pointer text-sm font-medium text-[#174545] underline underline-offset-4 transition hover:text-[#002623]"
                      >
                        المزيد
                      </button>
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <DrawerFooter className="pt-2 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <Button
            type="button"
            size="lg"
            onClick={handleSearch}
            className="w-full cursor-pointer rounded-4xl bg-[#174545] text-white hover:bg-[#174545]/90"
          >
            <Search className="size-5" />
            بحث
          </Button>
        </DrawerFooter>

        <Drawer open={serviceDetailsOpen} onOpenChange={setServiceDetailsOpen} showSwipeHandle>
          <DrawerContent className="sm:mx-auto sm:w-[450px] sm:[--drawer-content-width:450px] sm:data-[swipe-axis=y]:inset-x-0">
            <DrawerHeader className="text-right md:text-right">
              <DrawerTitle className="font-display text-[#002623]">
                {fullService?.title || "تفاصيل الخدمة"}
              </DrawerTitle>
              <DrawerDescription className="sr-only">
                {fullService?.title || "تفاصيل الخدمة"}
              </DrawerDescription>
            </DrawerHeader>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pt-3 pb-6 text-right">
              {fullService ? (
                <>
                  <p className="text-sm leading-relaxed text-[#757575]">{fullService.description}</p>
                  <ul className="space-y-3">
                    {fullService.points.map((point, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm font-medium text-[#002623]">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#4caf50]" />
                        <span className="min-w-0">{point}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>

            <DrawerFooter className="pt-2 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
              <Button
                type="button"
                size="lg"
                onClick={() => setServiceDetailsOpen(false)}
                className="w-full cursor-pointer rounded-4xl bg-[#174545] text-white hover:bg-[#174545]/90"
              >
                حسناً
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </DrawerContent>
    </Drawer>
  );
}

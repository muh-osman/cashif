"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
import { CarSearchDrawer } from "@/components/car-search-drawer";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getCachedCarCatalog, loadCarCatalog } from "@/lib/car-catalog";
import { cn } from "@/lib/utils";

const PLACEHOLDERS = ["أسعار الفحص...", "كامري | تويوتا", "أكورد | هوندا", "التيما | نيسان"];

export function CarModelSearch({ className, isStuck }) {
  const cachedCatalog = getCachedCarCatalog();
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [models, setModels] = useState(() => cachedCatalog?.models ?? []);
  const [manufacturersById, setManufacturersById] = useState(() => cachedCatalog?.manufacturersById ?? new Map());
  const [catalogLoading, setCatalogLoading] = useState(() => !cachedCatalog);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isPricesPage = pathname === "/prices" || pathname.startsWith("/prices/");

  useEffect(() => {
    let cancelled = false;

    if (cachedCatalog) {
      setModels(cachedCatalog.models);
      setManufacturersById(cachedCatalog.manufacturersById);
      setCatalogLoading(false);
      return;
    }

    setCatalogLoading(true);
    loadCarCatalog()
      .then((catalog) => {
        if (cancelled) return;
        setModels(catalog.models);
        setManufacturersById(catalog.manufacturersById);
      })
      .catch(() => {
        if (cancelled) return;
        setModels([]);
        setManufacturersById(new Map());
      })
      .finally(() => {
        if (!cancelled) setCatalogLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [cachedCatalog]);

  useEffect(() => {
    if (!isPricesPage || drawerOpen) return;

    const timer = setTimeout(() => setOpen(true), 0);
    return () => clearTimeout(timer);
  }, [isPricesPage, drawerOpen]);

  useEffect(() => {
    if (selected) return;

    const interval = setInterval(() => {
      setIsTransitioning(true); // start exit animation (old text slides down)

      setTimeout(() => {
        setCurrentPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setIsTransitioning(false); // start enter animation (new text slides down from above)
      }, 300); // must match exit animation duration below
    }, 3000); // change every 3 seconds

    return () => clearInterval(interval);
  }, [selected]);

  function handleSelect(model) {
    setSelected(model);
    setOpen(false);
    setDrawerOpen(true);
  }

  function handleSearch({ model, year, service }) {
    if (!model?.id || !year || !service) return;

    const params = new URLSearchParams({
      modelId: String(model.id),
      year: String(year),
      [service]: "true",
    });

    router.push(`/prices?${params}`);
  }

  return (
    <div
      className="flex w-full justify-center"
      data-car-search-drawer={drawerOpen ? "open" : undefined}
    >
      {/* Keyframes for the placeholder slide animation */}
      <style>{`
        @keyframes placeholderSlideOutDown {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(16px); opacity: 0; }
        }
        @keyframes placeholderSlideInDown {
          from { transform: translateY(-16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      <Popover open={open} onOpenChange={setOpen} className="w-full sm:w-auto">
        <PopoverTrigger
          className={cn(
            "flex h-16 cursor-pointer items-center justify-between rounded-full border-none bg-[#f0f1f3cf] backdrop-saturate-150 backdrop-blur-xl px-6 text-base font-normal text-[#002623] shadow-xl sm:text-lg",
            "transition-[width] duration-300 ease-out",
            isStuck ? "w-full" : "w-[92%] sm:w-full",
            "mx-auto",
            className
          )}
        >
          <span className="flex items-center gap-2 overflow-hidden text-[#757575]">
            <span className="relative flex items-center h-8 min-w-[140px]">
              {/* Placeholder text with slide animation */}
              {!selected && (
                <span
                  key={isTransitioning ? `out-${currentPlaceholderIndex}` : `in-${currentPlaceholderIndex}`}
                  className="absolute inset-0 flex items-center whitespace-nowrap"
                  style={{
                    animation: isTransitioning ? "placeholderSlideOutDown 300ms ease-in forwards" : "placeholderSlideInDown 300ms ease-out forwards",
                  }}
                >
                  {PLACEHOLDERS[currentPlaceholderIndex]}
                </span>
              )}

              {/* Selected value text with animation */}
              <span
                className={cn(
                  "absolute inset-0 flex items-center whitespace-nowrap transition-all duration-300",
                  selected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                )}
              >
                {selected && `${selected.nameAr} - ${selected.nameEn}`}
              </span>
            </span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>

        <PopoverContent
          dir="rtl"
          align="center"
          positionerClassName="z-[80]"
          className="w-[var(--anchor-width)] p-0"
        >
          <Command>
            <CommandInput placeholder="ابحث بالاسم أو الشركة المصنعة..." />
            <CommandList>
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
                {models.map((model) => {
                  const manufacturerName = manufacturersById.get(model.carManufacturerId) || "";

                  return (
                    <CommandItem
                      key={model.id}
                      value={`${model.nameAr} ${model.nameEn} ${manufacturerName}`}
                      onSelect={() => handleSelect(model)}
                      className="flex items-center"
                    >
                      <Check className={cn("ml-2 h-4 w-4", selected?.id === model.id ? "opacity-100" : "opacity-0")} />
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

      <CarSearchDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        model={selected}
        onSearch={handleSearch}
      />
    </div>
  );
}

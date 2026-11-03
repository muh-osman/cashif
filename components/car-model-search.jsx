"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronsUpDown } from "lucide-react";
import { CarSearchDrawer } from "@/components/car-search-drawer";
import { getCachedCarCatalog, loadCarCatalog } from "@/lib/car-catalog";
import { cn } from "@/lib/utils";

const PLACEHOLDERS = ["أسعار الفحص...", "كامري | تويوتا", "أكورد | هوندا", "التيما | نيسان"];

export function CarModelSearch({ className, isStuck, hideTrigger = false }) {
  const cachedCatalog = getCachedCarCatalog();
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
    if (!isPricesPage) {
      setDrawerOpen(false);
      return;
    }

    const timer = setTimeout(() => setDrawerOpen(true), 0);
    return () => clearTimeout(timer);
  }, [isPricesPage]);

  useEffect(() => {
    if (selected) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setIsTransitioning(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [selected]);

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
      className={cn("flex w-full justify-center", hideTrigger && "contents")}
      data-car-search-drawer={drawerOpen ? "open" : undefined}
    >
      {!hideTrigger ? (
        <>
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

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className={cn(
              "flex h-16 cursor-pointer items-center justify-between rounded-full border-none bg-[#f0f1f3cf] backdrop-saturate-150 backdrop-blur-xl px-6 text-base font-normal text-[#002623] shadow-xl sm:text-lg",
              "transition-[width] duration-300 ease-out",
              isStuck ? "w-full" : "w-[92%] sm:w-full",
              "mx-auto",
              className
            )}
          >
            <span className="flex items-center gap-2 overflow-hidden text-[#757575]">
              <span className="relative flex h-8 min-w-[140px] items-center">
                {!selected && (
                  <span
                    key={isTransitioning ? `out-${currentPlaceholderIndex}` : `in-${currentPlaceholderIndex}`}
                    className="absolute inset-0 flex items-center whitespace-nowrap"
                    style={{
                      animation: isTransitioning
                        ? "placeholderSlideOutDown 300ms ease-in forwards"
                        : "placeholderSlideInDown 300ms ease-out forwards",
                    }}
                  >
                    {PLACEHOLDERS[currentPlaceholderIndex]}
                  </span>
                )}

                <span
                  className={cn(
                    "absolute inset-0 flex items-center whitespace-nowrap transition-all duration-300",
                    selected ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
                  )}
                >
                  {selected && `${selected.nameAr} - ${selected.nameEn}`}
                </span>
              </span>
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </button>
        </>
      ) : null}

      <CarSearchDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        model={selected}
        onModelChange={setSelected}
        models={models}
        manufacturersById={manufacturersById}
        catalogLoading={catalogLoading}
        onSearch={handleSearch}
      />
    </div>
  );
}

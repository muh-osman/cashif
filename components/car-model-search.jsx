"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronsUpDown } from "lucide-react";
import { CarSearchDrawer } from "@/components/car-search-drawer";
import { loadCarCatalog } from "@/lib/car-catalog";
import { fetchInspectionPlans, stashPendingPricesSearch } from "@/lib/inspection-plans";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PLACEHOLDERS = ["أسعار الفحص...", "كامري | تويوتا", "أكورد | هوندا", "التيما | نيسان"];
const DEFAULT_SERVICE = "purchaseInspection";
const OPEN_SEARCH_PARAM = "openSearch";
const OPEN_PRICE_DRAWER_EVENT = "cashif:open-price-drawer";

export function openPriceDrawer() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_PRICE_DRAWER_EVENT));
}

export function CarModelSearch({
  className,
  isStuck,
  hideTrigger = false,
  onSearch,
  prefill = null,
  reopenKey = 0,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [defaultService, setDefaultService] = useState(DEFAULT_SERVICE);
  const [defaultYear, setDefaultYear] = useState(null);
  const [selected, setSelected] = useState(null);
  const [models, setModels] = useState([]);
  const [manufacturersById, setManufacturersById] = useState(() => new Map());
  // Idle until the drawer opens — don't fetch catalog on page load.
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPricesPage = pathname === "/prices" || pathname.startsWith("/prices/");
  const openSearchService = searchParams.get(OPEN_SEARCH_PARAM);
  const hasCompletedSearchParams = Boolean(searchParams.get("modelId") && searchParams.get("year"));

  const prefillRef = useRef(prefill);
  const [prevReopenKey, setPrevReopenKey] = useState(0);
  prefillRef.current = prefill;

  function rememberSelection(next) {
    if (!next?.model?.id) return;
    setSelected(next.model);
    setDefaultYear(next.year != null ? String(next.year) : null);
    setDefaultService(next.service || DEFAULT_SERVICE);
  }

  // Apply prefill + open in the same render pass so the drawer never mounts empty.
  if (reopenKey !== prevReopenKey) {
    setPrevReopenKey(reopenKey);
    if (reopenKey > 0) {
      if (prefill?.model?.id) {
        setSelected(prefill.model);
        setDefaultYear(prefill.year != null ? String(prefill.year) : null);
        setDefaultService(prefill.service || DEFAULT_SERVICE);
      }
      setDrawerOpen(true);
    }
  }

  useEffect(() => {
    if (!drawerOpen) return;

    let cancelled = false;
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
  }, [drawerOpen]);

  useEffect(() => {
    if (!openSearchService) return;

    setDefaultService(openSearchService);
    setDrawerOpen(true);

    const next = new URLSearchParams(searchParams.toString());
    next.delete(OPEN_SEARCH_PARAM);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [openSearchService, pathname, router, searchParams]);

  useEffect(() => {
    // Empty /prices opens the drawer. Arriving with modelId+year means the search
    // already happened elsewhere — show plans, don't reopen the drawer.
    if (!isPricesPage || hasCompletedSearchParams || openSearchService) return;

    const timer = setTimeout(() => setDrawerOpen(true), 0);
    return () => clearTimeout(timer);
  }, [isPricesPage, hasCompletedSearchParams, openSearchService]);

  useEffect(() => {
    rememberSelection(prefill);
  }, [prefill]);

  useEffect(() => {
    function handleOpenPriceDrawer() {
      const next = prefillRef.current;
      if (next?.model?.id) {
        setSelected(next.model);
        setDefaultYear(next.year != null ? String(next.year) : null);
        setDefaultService(next.service || DEFAULT_SERVICE);
      }
      setDrawerOpen(true);
    }

    window.addEventListener(OPEN_PRICE_DRAWER_EVENT, handleOpenPriceDrawer);
    return () => window.removeEventListener(OPEN_PRICE_DRAWER_EVENT, handleOpenPriceDrawer);
  }, []);

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

  async function handleSearch(payload) {
    const { model, year, service } = payload ?? {};
    if (!model?.id || !year || !service) return;

    if (onSearch) {
      await onSearch(payload);
      rememberSelection(payload);
      return;
    }

    // Fetch before navigating so /prices can render plans immediately.
    try {
      const plans = await fetchInspectionPlans(model.id, year);
      if (plans.length === 0) {
        toast.warning("لا توجد أسعار متاحة لهذا الموديل");
        throw new Error("empty");
      }

      rememberSelection(payload);
      stashPendingPricesSearch({ model, year, service, plans });

      const params = new URLSearchParams({
        modelId: String(model.id),
        year: String(year),
        [service]: "true",
      });

      router.push(`/prices?${params}`);
    } catch (error) {
      if (error?.message !== "empty") {
        toast.error(error?.messageAr || error?.message || "تعذر تحميل أسعار الباقات");
      }
      throw error;
    }
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
            onClick={() => {
              setDefaultService(DEFAULT_SERVICE);
              setDrawerOpen(true);
            }}
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
        defaultService={defaultService}
        defaultYear={defaultYear ?? undefined}
        onSearch={handleSearch}
      />
    </div>
  );
}

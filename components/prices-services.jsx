"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { SERVICES, ServiceCard, ServicesGrid } from "@/components/services-grid";

const SERVICE_PARAMS = SERVICES.map((service) => service.param);
const DEFAULT_PARAM = "purchaseInspection";

const CAROUSEL_SERVICES = [
  SERVICES.find((service) => service.param === "checkit"),
  SERVICES.find((service) => service.param === "purchaseInspection"),
  SERVICES.find((service) => service.param === "passengerCheck"),
];

const DEFAULT_CAROUSEL_INDEX = CAROUSEL_SERVICES.findIndex((service) => service.param === DEFAULT_PARAM);

function getSelectedParam(searchParams) {
  return SERVICE_PARAMS.find((param) => searchParams.get(param) === "true") ?? DEFAULT_PARAM;
}

function withServiceParam(searchParams, param) {
  const next = new URLSearchParams(searchParams.toString());

  for (const key of SERVICE_PARAMS) {
    next.delete(key);
  }

  next.set(param, "true");
  return next;
}

export function PricesServices() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedParam = getSelectedParam(searchParams);
  const [api, setApi] = useState(null);

  useEffect(() => {
    const hasServiceParam = SERVICE_PARAMS.some((param) => searchParams.get(param) === "true");
    if (hasServiceParam) return;

    const next = withServiceParam(searchParams, DEFAULT_PARAM);
    router.replace(`${pathname}?${next}`, { scroll: false });
  }, [pathname, router, searchParams]);

  function handleSelect(param) {
    if (param === selectedParam && searchParams.get(param) === "true") return;

    const next = withServiceParam(searchParams, param);
    router.replace(`${pathname}?${next}`, { scroll: false });
  }

  useEffect(() => {
    if (!api) return;

    const index = CAROUSEL_SERVICES.findIndex((service) => service.param === selectedParam);
    if (index < 0 || api.selectedScrollSnap() === index) return;

    api.scrollTo(index);
  }, [api, selectedParam]);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const service = CAROUSEL_SERVICES[api.selectedScrollSnap()];
      if (!service) return;

      const next = withServiceParam(searchParams, service.param);
      if (next.toString() === searchParams.toString()) return;
      router.replace(`${pathname}?${next}`, { scroll: false });
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, pathname, router, searchParams]);

  return (
    <>
      <div className="lg:hidden">
        <Carousel
          className="-mx-4"
          dir="rtl"
          setApi={setApi}
          opts={{
            align: "center",
            startIndex: DEFAULT_CAROUSEL_INDEX,
            direction: "rtl",
            containScroll: false,
          }}
        >
          <CarouselContent className="ml-0 gap-3">
            {CAROUSEL_SERVICES.map((service) => (
              <CarouselItem key={service.id} className="flex basis-[calc(50%-12px)] pl-0">
                <ServiceCard
                  service={service}
                  ctaLabel="اختيار الخدمة"
                  selected={selectedParam === service.param}
                  onSelect={handleSelect}
                  compact
                  preview
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="hidden lg:block">
        <ServicesGrid ctaLabel="اختيار الخدمة" selectedParam={selectedParam} onSelect={handleSelect} preview />
      </div>
    </>
  );
}

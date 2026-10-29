import { CarModelSearch } from "@/components/car-model-search";

export function StickySearch() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-[16px] z-30 has-[[data-car-search-drawer=open]]:z-[70]">
      <div className="pointer-events-auto relative mx-auto w-full max-w-xl px-4">
        <CarModelSearch isStuck />
      </div>
    </div>
  );
}

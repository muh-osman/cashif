import { CarModelSearch } from "@/components/car-model-search";

export function StickySearch() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-[16px] z-30">
      <div className="pointer-events-auto relative mx-auto w-full max-w-xl px-4">
        <CarModelSearch isStuck />
      </div>
    </div>
  );
}

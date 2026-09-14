import { Suspense } from "react";
import { PricesServices } from "@/components/prices-services";

export default function PricesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          الأسعار
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
        <p className="text-[#757575]">حدد الخدمة المناسبة، ثم أكمل الحجز.</p>
      </div>

      <Suspense>
        <PricesServices />
      </Suspense>
    </main>
  );
}

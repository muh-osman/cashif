import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ThanksPayMojaz } from "@/components/thanks-pay-mojaz";

export const metadata = {
  title: "نتيجة دفع تقرير موجز | كاشف لفحص السيارات",
};

function ThanksFallback() {
  return (
    <div className="flex justify-center py-24 text-[#174545]">
      <Loader2 className="h-9 w-9 animate-spin" />
    </div>
  );
}

export default function ThanksPayMojazPage() {
  return (
    <Suspense fallback={<ThanksFallback />}>
      <ThanksPayMojaz />
    </Suspense>
  );
}

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ShippingThanks } from "@/components/shipping-thanks";

export const metadata = {
  title: "نتيجة دفع الشحن | كاشف لفحص السيارات",
};

function ThanksFallback() {
  return (
    <div className="flex justify-center py-24 text-[#174545]">
      <Loader2 className="h-9 w-9 animate-spin" />
    </div>
  );
}

export default function ShippingThanksPage() {
  return (
    <Suspense fallback={<ThanksFallback />}>
      <ShippingThanks />
    </Suspense>
  );
}

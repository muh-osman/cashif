"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, SaudiRiyal, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import {
  CITIES,
  DELIVERY_FLATBED,
  DELIVERY_LABELS,
  DELIVERY_OWNER,
  RECEIVE_AND_SEND_FEE,
  SHIPPING_TYPE_PRIVATE,
  SHIPPING_TYPE_PUBLIC,
  calculateShippingPrice,
  findAlbasamiBranch,
  isAvailablePrice,
  normalizeCard,
  shippingBranchError,
} from "@/lib/shipping";
const SHIPPING_OPTIONS = [
  {
    type: SHIPPING_TYPE_PUBLIC,
    image: "/images/shipping/public.png",
    label: "نقل عام",
  },
  {
    type: SHIPPING_TYPE_PRIVATE,
    image: "/images/shipping/private.png",
    label: "سطحة خاصة",
  },
];

function PageTitle({ subtitle }) {
  return (
    <div className="mb-8 space-y-3 text-center">
      <h1 className="font-display relative inline-block text-3xl text-[#002623]">
        شحن السيارة
        <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
      </h1>
      {subtitle ? <p className="text-sm leading-relaxed text-[#757575]">{subtitle}</p> : null}
    </div>
  );
}

function Notice() {
  return (
    <div className="rounded-[28px] bg-[#fbf6ea] px-4 py-4 text-sm leading-7 text-[#002623]">
      <p className="font-semibold">تنويه هام</p>
      <p>مركز كاشف لا يقدم خدمة الشحن، بل يعمل كوسيط فقط بالتعاون مع شركة البسامي للنقل، ولا يتحمل أي مسؤولية عن عملية الشحن أو التأخير أو الأضرار الناتجة عنها.</p>
    </div>
  );
}

function SummaryRow({ label, value, dir }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#002623]/8 py-3">
      <span className="text-sm font-semibold text-[#002623]">{label}</span>
      <span dir={dir} className="truncate text-sm text-[#757575]">
        {value || "—"}
      </span>
    </div>
  );
}

export function ShippingForm({ cardId }) {
  const router = useRouter();
  const acceptedTerms = useRef(false);
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [shippingType, setShippingType] = useState("");
  const [termsOpen, setTermsOpen] = useState(false);

  useEffect(() => {
    if (!cardId) return;

    let cancelled = false;

    async function loadCard() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/reports/cards/${encodeURIComponent(cardId)}`, { cache: "no-store" });
        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
          router.replace(`/login?from=${encodeURIComponent(`/shipping/${cardId}`)}`);
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "خطأ في الشبكة");
        }

        const nextCard = normalizeCard(data);
        if (!nextCard) throw new Error("خطأ في الشبكة");
        if (!cancelled) setCard(nextCard);
      } catch (err) {
        if (!cancelled) setError(err.message || "خطأ في الشبكة");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCard();
    return () => {
      cancelled = true;
    };
  }, [cardId, router]);

  const branchError = card ? shippingBranchError(card.branchNameAr) : "";
  const branch = findAlbasamiBranch(card?.branchNameAr);
  const price = calculateShippingPrice(card?.branchNameAr, selectedCity, shippingType);
  const visibleOptions = SHIPPING_OPTIONS.filter((option) => isAvailablePrice(calculateShippingPrice(card?.branchNameAr, selectedCity, option.type)));

  function handleCityChange(event) {
    setSelectedCity(event.target.value);
    setShippingType("");
  }

  function submitForm() {
    if (!selectedCity || !shippingType) {
      toast.warning("جميع البيانات مطلوبة.");
      return;
    }

    if (!isAvailablePrice(price)) {
      toast.warning("الشحن غير متاح لهذا المسار");
      return;
    }

    setTermsOpen(true);
  }

  function handleTermsOpenChange(open) {
    setTermsOpen(open);
    if (!open && !acceptedTerms.current) {
      toast.warning("يجب الموافقة على اقرار اخلاء المسؤولية للمتابعة");
    }
    acceptedTerms.current = false;
  }

  function acceptTerms() {
    acceptedTerms.current = true;
    setTermsOpen(false);

    const params = new URLSearchParams({
      to: selectedCity,
      shipping_type: shippingType,
      delivery_method: deliveryMethod,
    });

    router.push(`/shipping/${cardId}/pay?${params.toString()}`);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <PageTitle subtitle="هذه الخدمة متاحة لعملاء مركز كاشف الذين لديهم تقرير فحص" />

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-16 text-[#174545]">
          <Loader2 className="h-9 w-9 animate-spin" />
          <p className="text-sm">جاري تحميل البيانات...</p>
        </div>
      ) : null}

      {!loading && error ? (
        <div className="mx-auto flex max-w-lg items-start gap-3 rounded-[28px] bg-[#fff7ed] px-4 py-4 text-[#9a3412] shadow-[0_7px_29px_0_rgba(100,100,111,0.12)]">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : null}

      {!loading && !error && branchError ? (
        <Card className="mx-auto max-w-lg rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <TriangleAlert className="h-10 w-10 text-[#9a3412]" />
            <p className="text-lg font-semibold">{branchError}</p>
            <Button
              type="button"
              size="lg"
              onClick={() => router.push("/reports")}
              className="mt-2 cursor-pointer rounded-full bg-[#002623] px-8 text-white hover:bg-[#1a292e]"
            >
              عودة
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {!loading && !error && card && !branchError && !deliveryMethod ? (
        <div className="mx-auto max-w-5xl space-y-6">
          <h2 className="text-center text-2xl font-bold text-[#174545]">اختر طريقة تسليم السيارة للشحن</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <DeliveryCard
              number="1"
              title={DELIVERY_LABELS[DELIVERY_OWNER]}
              body="سوف يُطلب من صاحب السيارة التوجه مباشرة إلى فرع البسامي لتسليم السيارة."
              note="فرع البسامي يبعد حوالي 7 دقائق عن مركز الفحص."
              onSelect={() => setDeliveryMethod(DELIVERY_OWNER)}
            >
              {branch ? (
                <a
                  href={branch.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1 text-sm font-medium text-[#1976d2]"
                >
                  <span>{branch.address}</span>
                  <MapPin className="h-4 w-4" />
                </a>
              ) : null}
            </DeliveryCard>

            <DeliveryCard
              number="2"
              title={DELIVERY_LABELS[DELIVERY_FLATBED]}
              body="تصل سطحة تستلم السيارة من مركز كاشف وتنقلها إلى فرع البسامي لشحنها."
              note={`رسوم منفصلة عن قيمة شحن البسامي بـ ${RECEIVE_AND_SEND_FEE} ريال`}
              noteClassName="text-[#d32f2f]"
              onSelect={() => setDeliveryMethod(DELIVERY_FLATBED)}
            />
          </div>
        </div>
      ) : null}

      {!loading && !error && card && !branchError && deliveryMethod ? (
        <div className="mx-auto max-w-md space-y-5">
          <div className="flex flex-col items-center gap-3">
            <span className="rounded-full border border-[#174545]/20 bg-white px-4 py-1.5 text-center text-sm font-medium text-[#174545]">
              {DELIVERY_LABELS[deliveryMethod]}
            </span>
            <button type="button" onClick={() => setDeliveryMethod("")} className="cursor-pointer text-sm font-medium text-[#757575] underline-offset-4 hover:underline">
              تغيير طريقة التسليم
            </button>
          </div>

          <Notice />

          <Card className="rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
            <CardContent className="space-y-5">
              <div>
                <SummaryRow label="السيارة" value={card.carModelNameAr} />
                <SummaryRow label="رقم اللوحة" value={card.plateNumber} dir="ltr" />
                <SummaryRow label="شحن السيارة من" value={card.branchNameAr} />
                <label className="block pt-3">
                <span className="block pb-3 text-sm font-semibold">شحن السيارة الى</span>
                <span className="relative block">
                  <select
                    required
                    value={selectedCity}
                    onChange={handleCityChange}
                    className="h-12 w-full appearance-none rounded-2xl border border-[#002623]/10 bg-white px-4 pe-10 text-sm font-medium outline-none focus:border-[#174545]"
                  >
                    <option value="">اختر المدينة</option>
                    {CITIES.map((city) => (
                      <option key={city.id} value={city.nameAr}>
                        {city.nameAr}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-xs text-[#757575]">▾</span>
                </span>
              </label>
              </div>

              {selectedCity ? (
                visibleOptions.length > 0 ? (
                  <div role="radiogroup" aria-label="نوع الشحن" className="flex flex-nowrap justify-center gap-3">
                    {visibleOptions.map((option) => {
                      const selected = shippingType === option.type;
                      return (
                        <button
                          key={option.type}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setShippingType(option.type)}
                          className={cn(
                            "w-full min-w-0 max-w-[148px] flex-1 cursor-pointer rounded-[28px] border-2 bg-white p-2 text-center transition-colors sm:p-3",
                            selected ? "border-[#174545]" : "border-transparent shadow-[0_7px_29px_0_rgba(100,100,111,0.12)]"
                          )}
                        >
                          <span className="block min-w-0 overflow-hidden rounded-2xl bg-[#f4f6f5]">
                            <Image src={option.image} alt="" width={280} height={180} className="h-auto w-full object-contain" />
                          </span>
                          <span className="mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold sm:mt-3 sm:gap-2 sm:text-sm">
                            <span className={cn("h-3.5 w-3.5 rounded-full border-2", selected ? "border-[#174545] bg-[#174545]" : "border-[#c5c5c5]")} />
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-sm text-[#757575]">لا تتوفر خدمة شحن إلى هذه المدينة.</p>
                )
              ) : null}

              <Button
                type="button"
                size="lg"
                onClick={submitForm}
                className="h-12 w-full cursor-pointer rounded-full bg-[#002623] text-base text-white hover:bg-[#1a292e]"
              >
                {selectedCity && shippingType && isAvailablePrice(price) ? (
                  <span className="inline-flex items-center gap-1 font-bold">
                    <span>{price}.00</span>
                    <SaudiRiyal className="h-4 w-4" />
                  </span>
                ) : (
                  "أطلب الآن"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <Drawer open={termsOpen} onOpenChange={handleTermsOpenChange} showSwipeHandle>
        <DrawerContent className="sm:mx-auto sm:w-[450px] sm:[--drawer-content-width:450px] sm:data-[swipe-axis=y]:inset-x-0">
          <DrawerHeader className="text-center md:text-center">
            <DrawerTitle className="text-lg font-bold text-[#002623]">اقرار اخلاء المسؤولية</DrawerTitle>
            <DrawerDescription className="text-center text-sm leading-7 text-[#757575]">
              أقرّ بأن مركز كاشف وسيط فقط في خدمة الشحن بالتعاون مع شركة البسامي للنقل، ولا يتحمل أي مسؤولية عن عملية التسليم أو الاستلام أو أي التزامات أو مسؤوليات أخرى ناتجة عن الشحن.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <Button type="button" size="lg" onClick={acceptTerms} className="w-full cursor-pointer rounded-full bg-[#002623] text-white hover:bg-[#1a292e]">
              أوافق
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </main>
  );
}

function DeliveryCard({ number, title, body, note, noteClassName, onSelect, children }) {
  return (
    <Card className="rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
      <CardContent className="flex h-full flex-col items-center gap-4 py-2 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#174545] font-display text-3xl text-[#e6d39c]">{number}</span>
        <h3 className="text-xl font-bold text-[#174545]">{title}</h3>
        <p className="text-sm leading-7 text-[#757575]">{body}</p>
        <p className="text-sm font-semibold">تنويه</p>
        <p className={cn("text-sm leading-7 text-[#757575]", noteClassName)}>{note}</p>
        {children}
        <Button type="button" size="lg" onClick={onSelect} className="mt-auto w-full cursor-pointer rounded-full bg-[#002623] text-white hover:bg-[#1a292e]">
          اختيار
        </Button>
      </CardContent>
    </Card>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { CreditCard, Info, Landmark, Loader2, SaudiRiyal, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  DELIVERY_FLATBED,
  DELIVERY_OWNER,
  RECEIVE_AND_SEND_FEE,
  buildMoyasarMetadata,
  calculateShippingPrice,
  isAvailablePrice,
  isDeliveryMethod,
  normalizeCard,
  shippingBranchError,
} from "@/lib/shipping";

const MOYASAR_CSS = "https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.2.4/dist/moyasar.css";
const MOYASAR_JS = "https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.2.4/dist/moyasar.umd.min.js";

function moyasarKey() {
  const host = window.location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1";
  return isLocal ? process.env.NEXT_PUBLIC_SHIPPING_MOYASAR_TEST_KEY : process.env.NEXT_PUBLIC_SHIPPING_MOYASAR_LIVE_KEY;
}

const FLATBED_FEE_TOOLTIP = "رسوم استلام السيارة في مركز الفحص ونقلها إلى شركة الشحن (شامل الضريبة)";

function FlatbedFeeInfo() {
  return (
    <Popover>
      <PopoverTrigger
        type="button"
        openOnHover
        delay={0}
        closeDelay={80}
        aria-label={FLATBED_FEE_TOOLTIP}
        className="inline-flex size-6 shrink-0 cursor-pointer touch-manipulation items-center justify-center border-0 bg-transparent p-0 text-[#757575]"
      >
        <Info className="h-3.5 w-3.5" />
      </PopoverTrigger>
      <PopoverContent
        side="top"
        sideOffset={6}
        positionMethod="fixed"
        collisionPadding={8}
        className="w-auto max-w-[min(14rem,calc(100vw-1.5rem))] gap-0 rounded-2xl bg-[#002623] px-3 py-2 text-center text-xs leading-5 text-white shadow-lg ring-0 duration-0 data-open:animate-none data-closed:animate-none data-[side=top]:slide-in-from-bottom-0"
      >
        {FLATBED_FEE_TOOLTIP}
      </PopoverContent>
    </Popover>
  );
}

function Money({ amount, iconClassName = "h-4 w-4" }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span>{amount}</span>
      <SaudiRiyal className={iconClassName} />
    </span>
  );
}

function DetailRow({ label, value, hint, children, dir }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#ececec] py-3">
      <div className="text-sm font-semibold text-[#747a79]">
        <p>{label}</p>
        {hint ? <p className="mt-1 text-xs font-semibold text-[#d32f2f]">{hint}</p> : null}
      </div>
      <div dir={dir} className="text-sm font-semibold text-[#002623]">
        {children || value || "—"}
      </div>
    </div>
  );
}

export function ShippingPay({ cardId, to, shippingType, deliveryMethod }) {
  const router = useRouter();
  const cardRef = useRef(null);
  const priceRef = useRef(null);
  const moyasarReady = useRef(false);
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scriptReady, setScriptReady] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const paramsLookValid = Boolean(to && shippingType && isDeliveryMethod(deliveryMethod));

  useEffect(() => {
    if (!cardId || !paramsLookValid) return;

    let cancelled = false;

    async function loadCard() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/reports/cards/${encodeURIComponent(cardId)}`, { cache: "no-store" });
        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
          const from = `/shipping/${cardId}/pay?${new URLSearchParams({
            to,
            shipping_type: shippingType,
            delivery_method: deliveryMethod,
          }).toString()}`;
          router.replace(`/login?from=${encodeURIComponent(from)}`);
          return;
        }

        if (!response.ok) throw new Error(data.message || "خطأ في الشبكة");

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
  }, [cardId, deliveryMethod, paramsLookValid, router, shippingType, to]);

  const branchError = card ? shippingBranchError(card.branchNameAr) : "";
  const price = card ? calculateShippingPrice(card.branchNameAr, to, shippingType) : null;
  const priceReady = isAvailablePrice(price);
  const shippingFee = deliveryMethod === DELIVERY_FLATBED ? RECEIVE_AND_SEND_FEE : 0;
  const totalPrice = priceReady ? price + shippingFee : null;

  cardRef.current = card;
  priceRef.current = price;

  useEffect(() => {
    if (deliveryMethod !== DELIVERY_FLATBED || !scriptReady || !card || !priceReady || moyasarReady.current) return;
    if (!window.Moyasar) return;

    const key = moyasarKey();
    if (!key) {
      setPaymentError("تعذر تحميل بوابة الدفع");
      return;
    }

    const form = document.getElementById("shipping-moyasar-form");
    if (!form) return;

    form.innerHTML = "";
    moyasarReady.current = true;

    window.Moyasar.init({
      element: "#shipping-moyasar-form",
      amount: RECEIVE_AND_SEND_FEE * 100,
      currency: "SAR",
      language: "ar",
      description: "Cashif for car inspection",
      publishable_api_key: key,
      callback_url: `${window.location.origin}/shipping/thanks`,
      supported_networks: ["visa", "mastercard", "mada"],
      methods: ["creditcard", "applepay"],
      apple_pay: {
        country: "SA",
        label: "Cashif for car inspection",
        validate_merchant_url: "https://api.moyasar.com/v1/applepay/initiate",
      },
      metadata: buildMoyasarMetadata(cardRef.current, {
        to,
        shippingType,
        deliveryMethod,
        price: priceRef.current,
      }),
      on_failure: async function () {
        toast.error("تعذر إتمام الدفع");
      },
      on_initiating: async function () {
        const currentCard = cardRef.current;
        const currentPrice = priceRef.current;
        if (!currentCard || !isAvailablePrice(currentPrice)) return false;

        return {
          amount: RECEIVE_AND_SEND_FEE * 100,
          metadata: buildMoyasarMetadata(currentCard, {
            to,
            shippingType,
            deliveryMethod,
            price: currentPrice,
          }),
        };
      },
    });
  }, [card, deliveryMethod, priceReady, scriptReady, shippingType, to]);

  async function confirmOrder() {
    setConfirming(true);

    try {
      const response = await fetch("/api/shipping/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId, to, shippingType, deliveryMethod }),
      });
      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        router.replace(`/login?from=${encodeURIComponent(`/shipping/${cardId}`)}`);
        return;
      }

      if (!response.ok || !data.database_id) {
        throw new Error(data.message || "تعذر إرسال طلب الشحن");
      }

      toast.success("تم الطلب");
      window.location.replace(`https://cashif.online/shipping-client/${data.database_id}`);
    } catch (err) {
      toast.error(err.message || "تعذر إرسال طلب الشحن");
      setConfirming(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      {deliveryMethod === DELIVERY_FLATBED ? (
        <>
          <link rel="stylesheet" href={MOYASAR_CSS} />
          <Script src={MOYASAR_JS} strategy="afterInteractive" onReady={() => setScriptReady(true)} />
        </>
      ) : null}

      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          تفاصيل الطلب
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
        <Link href={`/shipping/${cardId}`} className="text-sm font-medium text-[#174545] underline-offset-4 hover:underline">
          تعديل الطلب
        </Link>
      </div>

      {loading && paramsLookValid ? (
        <div className="flex flex-col items-center gap-3 py-16 text-[#174545]">
          <Loader2 className="h-9 w-9 animate-spin" />
          <p className="text-sm">جاري تحميل البيانات...</p>
        </div>
      ) : null}

      {!paramsLookValid || (!loading && (error || branchError || (card && !priceReady))) ? (
        <div className="mx-auto flex max-w-lg items-start gap-3 rounded-[28px] bg-[#fff7ed] px-4 py-4 text-[#9a3412] shadow-[0_7px_29px_0_rgba(100,100,111,0.12)]">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error || branchError || "بيانات الطلب غير مكتملة أو الشحن غير متاح لهذا المسار"}</p>
        </div>
      ) : null}

      {!loading && card && !branchError && priceReady ? (
        <div className="mx-auto max-w-md space-y-4">
          <Card className="rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
            <CardContent>
              <DetailRow label="موديل" value={card.carModelNameAr} />
              <DetailRow dir="ltr" label="رقم اللوحة" value={card.plateNumber} />
              <DetailRow label="شحن من" value={card.branchNameAr} />
              <DetailRow label="شحن الى" value={to} />
              <DetailRow label="نوع الشحن" value={shippingType} />
              <DetailRow label="شحن السيارة" hint="تدفع عند الاستلام">
                <Money amount={price} />
              </DetailRow>
              {deliveryMethod === DELIVERY_FLATBED ? (
                <DetailRow label="سطحة الى شركة الشحن" hint="تدفع الآن">
                  <span className="flex flex-col items-end gap-1">
                    <Money amount={RECEIVE_AND_SEND_FEE} />
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#757575]">
                      <FlatbedFeeInfo />
                      شامل الضريبة
                    </span>
                  </span>
                </DetailRow>
              ) : null}
              <div className="flex items-center justify-between pt-4">
                <span className="text-base font-bold">الاجمالي</span>
                <span className="inline-flex items-center gap-1 text-xl font-bold">
                  <span>{totalPrice}</span>
                  <SaudiRiyal className="h-5 w-5" />
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
            <CardContent className="space-y-4">
              {deliveryMethod === DELIVERY_OWNER ? (
                <>
                  <div className="flex items-center gap-2">
                    <Landmark className="h-5 w-5 text-[#174545]" />
                    <h2 className="text-base font-bold">الدفع عند الاستلام</h2>
                  </div>
                  <Button
                    type="button"
                    size="lg"
                    disabled={confirming}
                    onClick={confirmOrder}
                    className="h-12 w-full cursor-pointer rounded-full bg-[#174545] text-base font-bold text-white hover:bg-[#002623]"
                  >
                    {confirming ? <Loader2 className="animate-spin" /> : "تأكيد الطلب"}
                  </Button>
                </>
              ) : (
                <>
                  <div className="mb-6!">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-[#174545]" />
                      <h2 className="text-base font-bold">دفع الكتروني</h2>
                    </div>
                    <p className="mt-1 text-xs text-[#747a79]">ادفع باستخدام بطاقة الإئتمان, Mada, Visa, MasterCard</p>
                  </div>
                  {paymentError ? <p className="text-sm font-medium text-[#9a3412]">{paymentError}</p> : null}
                  <div id="shipping-moyasar-form" className={cn("mysr-form", paymentError && "hidden")} />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </main>
  );
}

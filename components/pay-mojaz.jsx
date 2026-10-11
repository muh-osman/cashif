"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, SaudiRiyal, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { MojazStepper } from "@/components/mojaz-stepper";
import {
  MOJAZ_PRICE,
  buildMojazMoyasarMetadata,
  isLookupType,
  lookupLabel,
} from "@/lib/mojaz";
import { normalizeCard } from "@/lib/shipping";
import { cn } from "@/lib/utils";

const MOYASAR_CSS = "https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.2.4/dist/moyasar.css";
const MOYASAR_JS = "https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.2.4/dist/moyasar.umd.min.js";

function moyasarKey() {
  const host = window.location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1";
  return isLocal ? process.env.NEXT_PUBLIC_SHIPPING_MOYASAR_TEST_KEY : process.env.NEXT_PUBLIC_SHIPPING_MOYASAR_LIVE_KEY;
}

function DetailRow({ label, value, dir, children }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#ececec] py-3">
      <div className="text-sm font-semibold text-[#747a79]">
        <p>{label}</p>
      </div>
      <div dir={dir} className="text-sm font-semibold text-[#002623]">
        {children || value || "—"}
      </div>
    </div>
  );
}

export function PayMojaz({ lookupType, lookupValue, mainReportNumber, user }) {
  const router = useRouter();
  const metadataRef = useRef(null);
  const moyasarReady = useRef(false);
  const [branchNameAr, setBranchNameAr] = useState("");
  const [cardReady, setCardReady] = useState(!mainReportNumber);
  const [scriptReady, setScriptReady] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const paramsLookValid = isLookupType(lookupType) && Boolean(lookupValue) && Boolean(mainReportNumber) && Boolean(user?.userId);

  metadataRef.current = buildMojazMoyasarMetadata({
    lookupType,
    lookupValue,
    name: user?.name,
    phone: user?.phone,
    userId: user?.userId,
    branchNameAr,
    mainReportNumber,
  });

  useEffect(() => {
    if (!mainReportNumber || !paramsLookValid) {
      setCardReady(true);
      return;
    }

    let cancelled = false;

    async function loadCard() {
      setCardReady(false);

      try {
        const response = await fetch(`/api/reports/cards/${encodeURIComponent(mainReportNumber)}`, {
          cache: "no-store",
        });
        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
          const from = `/pay-mojaz?${new URLSearchParams({
            lookup_type: lookupType,
            lookup_value: lookupValue,
            main_report_number: mainReportNumber,
          }).toString()}`;
          router.replace(`/login?from=${encodeURIComponent(from)}`);
          return;
        }

        const card = normalizeCard(data);
        if (!cancelled) setBranchNameAr(card?.branchNameAr || "");
      } catch {
        // Branch is optional metadata; payment can continue without it.
      } finally {
        if (!cancelled) setCardReady(true);
      }
    }

    loadCard();
    return () => {
      cancelled = true;
    };
  }, [lookupType, lookupValue, mainReportNumber, paramsLookValid, router]);

  useEffect(() => {
    if (!scriptReady || !paramsLookValid || !cardReady || moyasarReady.current) return;
    if (!window.Moyasar) return;

    const key = moyasarKey();
    if (!key) {
      setPaymentError("تعذر تحميل بوابة الدفع");
      return;
    }

    const form = document.getElementById("mojaz-moyasar-form");
    if (!form) return;

    form.innerHTML = "";
    moyasarReady.current = true;

    window.Moyasar.init({
      element: "#mojaz-moyasar-form",
      amount: MOJAZ_PRICE * 100,
      currency: "SAR",
      language: "ar",
      description: "Cashif for car inspection (Mojaz report)",
      publishable_api_key: key,
      callback_url: `${window.location.origin}/pay-mojaz/thanks`,
      supported_networks: ["visa", "mastercard", "mada"],
      methods: ["creditcard", "applepay"],
      apple_pay: {
        country: "SA",
        label: "Cashif for car inspection",
        validate_merchant_url: "https://api.moyasar.com/v1/applepay/initiate",
      },
      metadata: metadataRef.current,
      on_failure: async function () {
        toast.error("تعذر إتمام الدفع");
      },
      on_initiating: async function () {
        return {
          amount: MOJAZ_PRICE * 100,
          metadata: metadataRef.current,
        };
      },
    });
  }, [cardReady, paramsLookValid, scriptReady]);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <link rel="stylesheet" href={MOYASAR_CSS} />
      <Script src={MOYASAR_JS} strategy="afterInteractive" onReady={() => setScriptReady(true)} />

      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          تفاصيل الطلب
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
        {mainReportNumber ? (
          <Link
            href={`/ask-mojaz-report/${mainReportNumber}`}
            className="text-sm font-medium text-[#174545] underline-offset-4 hover:underline"
          >
            تعديل البيانات
          </Link>
        ) : null}
      </div>

      <div className="mx-auto max-w-md space-y-4">
        <Card className="rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
          <CardContent>
            <MojazStepper activeStep={1} />
          </CardContent>
        </Card>

        {!paramsLookValid ? (
          <div className="flex items-start gap-3 rounded-[28px] bg-[#fff7ed] px-4 py-4 text-[#9a3412] shadow-[0_7px_29px_0_rgba(100,100,111,0.12)]">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">بيانات الطلب غير مكتملة</p>
          </div>
        ) : !cardReady ? (
          <div className="flex flex-col items-center gap-3 py-16 text-[#174545]">
            <Loader2 className="h-9 w-9 animate-spin" />
            <p className="text-sm">جاري تحميل البيانات...</p>
          </div>
        ) : (
          <>
            <Card className="rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
              <CardContent>
                <DetailRow label="نوع التقرير" value="موجز" />
                <DetailRow dir="ltr" label={lookupLabel(lookupType)} value={lookupValue} />
                <div className="flex items-center justify-between pt-4">
                  <span className="text-base font-bold">الاجمالي</span>
                  <span className="inline-flex items-center gap-1 text-xl font-bold">
                    <span>{MOJAZ_PRICE}</span>
                    <SaudiRiyal className="h-5 w-5" />
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
              <CardContent className="space-y-4">
                <div className="mb-6!">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-[#174545]" />
                    <h2 className="text-base font-bold">دفع الكتروني</h2>
                  </div>
                  <p className="mt-1 text-xs text-[#747a79]">ادفع باستخدام بطاقة الإئتمان, Mada, Visa, MasterCard</p>
                </div>
                {paymentError ? <p className="text-sm font-medium text-[#9a3412]">{paymentError}</p> : null}
                <div id="mojaz-moyasar-form" className={cn("mysr-form", paymentError && "hidden")} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}

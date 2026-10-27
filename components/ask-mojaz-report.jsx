"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle2, CircleHelp, Loader2, SaudiRiyal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { MojazStepper } from "@/components/mojaz-stepper";
import {
  LOOKUP_SEQUENCE,
  LOOKUP_VIN,
  MOJAZ_PRICE,
  isLookupType,
  lookupMaxLength,
} from "@/lib/mojaz";
import { cn } from "@/lib/utils";

const FEATURES = ["عدد الملاك السابقين", "سجل الحوادث المسجلة", "تفاصيل الفحص الدوري"];

const VIN_HINTS = [
  "يمكنك العثور عليه على عتبة الباب الأمامي.",
  "يمكنك العثور عليه تحت الزجاج الأمامي.",
  "يمكنك العثور عليه على محرك المركبة.",
  "يمكنك العثور عليه في وثائق تسجيل المركبة.",
];

const LOOKUP_OPTIONS = [
  { value: LOOKUP_SEQUENCE, label: "رقم التسلسلي" },
  { value: LOOKUP_VIN, label: "رقم الهيكل" },
];

export function AskMojazReport({ cardId, user }) {
  const router = useRouter();
  const [lookupType, setLookupType] = useState("");
  const [lookupValue, setLookupValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    setLookupValue("");
  }, [lookupType]);

  const maxLength = isLookupType(lookupType) ? lookupMaxLength(lookupType) : 17;
  const isTooLong = lookupValue.length > maxLength;
  const canSubmit =
    Boolean(lookupType && lookupValue && user?.userId && !isTooLong && !loading);

  async function handleNext() {
    if (!canSubmit) return;

    setLoading(true);

    try {
      const response = await fetch("/api/mojaz/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lookup_type: lookupType,
          lookup_value: lookupValue,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        router.replace(`/login?from=${encodeURIComponent(`/ask-mojaz-report/${cardId}`)}`);
        return;
      }

      if (data?.data === null) {
        toast.warning("يرجى ادخال بيانات صحيحة");
        return;
      }

      if (data?.data?.resultObject === false) {
        toast.warning(data.data.resultMessage || "تعذر التحقق من المركبة");
        return;
      }

      if (!response.ok || data?.data?.status === 400) {
        toast.warning(data?.data?.message || data?.message || "فشل التحقق من المركبة");
        return;
      }

      const params = new URLSearchParams({
        lookup_type: lookupType,
        lookup_value: lookupValue,
        name: user?.name || "",
        phone: user?.phone || "",
        user_id: String(user?.userId || ""),
        main_report_number: String(cardId || ""),
      });

      router.push(`/pay-mojaz?${params.toString()}`);
    } catch {
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          طلب تقرير موجز
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
        <p className="text-sm text-[#757575]">تاريخ السيارة الكامل في تقرير واحد</p>
      </div>

      <div className="mx-auto max-w-md space-y-4">
        <Card className="rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
          <CardContent>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">طلب تقرير موجز</h2>
                <p className="mt-1 text-sm text-[#757575]">تاريخ السيارة الكامل في تقرير واحد</p>
              </div>
              <div className="size-12 shrink-0 overflow-hidden rounded-xl">
                <Image src="/images/reports/mojaz-logo.webp" alt="موجز" width={48} height={48} className="h-full w-full object-cover" />
              </div>
            </div>

            <div className="mt-5 flex flex-row-reverse items-stretch justify-between gap-3">
              <div className="relative flex flex-col justify-center pr-3 text-right">
                <span className="absolute inset-y-2 right-0 w-[3px] rounded-full bg-[#be1e2d]" />
                <p className="mb-1.5 text-sm text-[#555]">سعر التقرير</p>
                <p className="inline-flex items-center justify-end gap-1 text-[28px] font-bold leading-none text-[#1a1a2e]">
                  <span>{MOJAZ_PRICE}</span>
                  <SaudiRiyal className="h-5 w-5" />
                </p>
              </div>

              <div className="flex-1 space-y-2">
                {FEATURES.map((feature) => (
                  <div key={feature} className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-5 shrink-0 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
          <CardContent>
            <MojazStepper activeStep={0} />
          </CardContent>
        </Card>

        <Card className="rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
          <CardContent className="space-y-5">
            <h2 className="text-center text-2xl font-bold text-[#164544]">نوع البحث</h2>

            <div role="radiogroup" aria-label="نوع البحث" className="flex justify-center gap-3">
              {LOOKUP_OPTIONS.map((option) => {
                const selected = lookupType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={loading}
                    onClick={() => setLookupType(option.value)}
                    className={cn(
                      "flex min-w-[133px] cursor-pointer items-center justify-center rounded-full border-2 px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                      selected ? "border-[#174545] bg-[#174545]/5 text-[#174545]" : "border-[#e5e7eb] text-[#002623]"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div
              className={cn(
                "transition-all duration-200",
                lookupType ? "max-h-36 opacity-100" : "max-h-0 overflow-hidden opacity-0"
              )}
            >
              <div className="relative p-1">
                <Input
                  dir="ltr"
                  name="lookup_value"
                  value={lookupValue}
                  disabled={!lookupType || loading}
                  type={lookupType === LOOKUP_SEQUENCE ? "number" : "text"}
                  inputMode={lookupType === LOOKUP_SEQUENCE ? "numeric" : "text"}
                  placeholder={
                    lookupType === LOOKUP_SEQUENCE
                      ? "مثال: 0487635336"
                      : lookupType === LOOKUP_VIN
                        ? "JE4LR33M21J704303 :مثال"
                        : ""
                  }
                  aria-invalid={isTooLong || undefined}
                  onChange={(event) => setLookupValue(event.target.value)}
                  className="border border-[#002623]/10 bg-white pr-12 text-base [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setInfoOpen(true)}
                  aria-label="أين يمكنني العثور على الرقم التسلسلي؟"
                  className="absolute top-1/2 right-3 inline-flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[#164544] hover:bg-[#174545]/8 disabled:opacity-50"
                >
                  <CircleHelp className="size-5" />
                </button>
              </div>
              {isTooLong ? <p className="mt-1 px-1 text-right text-xs text-red-600">الحد الأقصى {maxLength} أحرف</p> : null}
            </div>

            <Button
              type="button"
              size="lg"
              disabled={!canSubmit}
              onClick={handleNext}
              className="w-full cursor-pointer rounded-full bg-[#174545] text-base font-bold text-white hover:bg-[#002623]"
            >
              {loading ? (
                <>
                  جاري التحقق...
                  <Loader2 className="animate-spin" />
                </>
              ) : (
                "التالي"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Drawer open={infoOpen} onOpenChange={setInfoOpen} showSwipeHandle>
        <DrawerContent className="sm:mx-auto sm:w-[450px] sm:[--drawer-content-width:450px] sm:data-[swipe-axis=y]:inset-x-0">
          <DrawerHeader className="!pb-5 text-right md:text-right">
            <DrawerTitle className="font-display text-[#002623]">أين يمكنني العثور على الرقم التسلسلي؟</DrawerTitle>
            <DrawerDescription className="sr-only">أماكن العثور على الرقم التسلسلي أو رقم الهيكل</DrawerDescription>
          </DrawerHeader>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pt-1 pb-2 text-right">
            <div className="rounded-2xl bg-[#e8f0fe] px-3.5 py-3 text-sm leading-6 text-[#002623]">
              يمكنك العثور على الرقم التسلسلي (رقم تعريف المركبة) في أحد هذه الأماكن، وقد يتغير ذلك اعتمادًا على نموذج المركبة.
            </div>

            <div className="overflow-hidden rounded-2xl">
              <Image
                src="/images/reports/mojaz-info-modal.webp"
                alt="أماكن الرقم التسلسلي"
                width={720}
                height={480}
                className="h-auto w-full object-cover"
              />
            </div>

            <div className="space-y-2.5">
              {VIN_HINTS.map((text, index) => (
                <div key={text} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#174545] text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-[#002623]">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <DrawerFooter className="pt-2 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <Button
              type="button"
              size="lg"
              onClick={() => setInfoOpen(false)}
              className="w-full cursor-pointer rounded-full bg-[#174545] text-base font-bold text-white hover:bg-[#002623]"
            >
              حسنًا
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </main>
  );
}

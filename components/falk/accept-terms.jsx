"use client";

import { useEffect, useState } from "react";
import { Handshake, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FalkTermsContent } from "@/components/falk/terms-content";

export function FalkAcceptTerms({ onAccepted }) {
  const [step, setStep] = useState(1);
  const [checked, setChecked] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const handleFinish = async () => {
    setIsAccepting(true);
    setError("");

    try {
      const response = await fetch("/api/falk/accept-terms", {
        method: "POST",
        cache: "no-store",
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "تعذر تسجيل الموافقة على الشروط");
      }

      await onAccepted?.();
    } catch (err) {
      setError(err.message || "تعذر تسجيل الموافقة على الشروط");
      setIsAccepting(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          فالك
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
        <p className="text-[#757575]">
          {step === 1 ? "'فالك' للتسويق بالعمولة" : step === 2 ? "الشروط والأحكام" : "كيفية العمل"}
        </p>
      </div>

      <Card className="mx-auto max-w-3xl rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#174545]/10">
                <Handshake className="h-7 w-7 text-[#174545]" />
              </span>
              <h2 className="text-xl font-semibold">{"'فالك' للتسويق بالعمولة"}</h2>
              <p className="text-[15px] leading-relaxed text-[#757575]">
                {"برنامج 'فالك' للتسويق بالعمولة هو منصة تتيح لك كمسوق فرصة ربح المال بسهولة من خلال الترويج لخدمات مركز كاشف لفحص السيارات عبر الإنترنت او من خلال التوصية المباشرة لدوائر المعارف والأصدقاء والمقربين."}
              </p>
              <p className="text-[15px] leading-relaxed text-[#757575]">
                {"من خلال الانضمام إلى البرنامج، تحصل على 'كود' تسويقي خاص بك للترويج لمنتجات الفحص، وعندما يقوم الأشخاص بزيارة مراكز كاشف لفحص السيارت والحصول على احد منتجات الفحص عبر 'الكود'، تكسب عمولة على كل عملية فحص."}
              </p>
              <p className="text-[15px] leading-relaxed text-[#757575]">
                {"انضم إلى 'فالك' اليوم وابدأ رحلتك في عالم التسويق بالعمولة. "}
                <span className="font-semibold text-[#002623]">وفالك التوفيق!</span>
              </p>
              <Button
                className="mt-2 w-full rounded-4xl bg-[#174545] text-white hover:bg-[#174545]/90"
                size="lg"
                onClick={() => setStep(2)}
              >
                انضم الآن
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <FalkTermsContent interactive />
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-[#002623]/5 p-3 text-sm text-[#002623]">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => setChecked(event.target.checked)}
                  className="mt-1 size-4 accent-[#174545]"
                />
                <span>أوافق على الشروط والأحكام, وأقر بأنني قرأتها وفهمتها بالكامل</span>
              </label>
              <Button
                className="mt-2 w-full rounded-4xl bg-[#174545] text-white hover:bg-[#174545]/90"
                size="lg"
                disabled={!checked}
                onClick={() => setStep(3)}
              >
                موافق
              </Button>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold">{"نحن سعداء لانضمامك إلى برنامج 'فالك'!"}</h2>
              <p className="text-[15px] leading-relaxed text-[#757575]">
                باستخدام الصورة التسويقية التي تحتوي على 
                <span className="font-semibold text-[#002623]">كودك الخاص</span>
                ، يمكنك الترويج لخدمة فحص السيارات.
              </p>
              <p className="text-[15px] leading-relaxed text-[#757575]">
                الكود يمنح العملاء 
                <span className="font-semibold text-[#002623]">خصم 20%</span>
                ، بينما تحصل أنت على 
                <span className="font-semibold text-[#002623]">عمولة 10%</span> 
                عن كل عملية حجز تتم باستخدام الكود.
              </p>
              <h3 className="font-semibold">كيفية العمل:</h3>
              <ol className="list-decimal space-y-2 pr-5 text-[15px] leading-relaxed text-[#757575]">
                <li>
                  <span className="font-semibold text-[#002623]">استخدم الصورة والكود</span> 
                  للترويج عبر منصاتك الإلكترونية.
                </li>
                <li>
                  <span className="font-semibold text-[#002623]">شارك مع جمهورك</span> 
                  بأن الكود يتيح لهم خصم 20% عند حجز خدمة فحص السيارات.
                </li>
                <li>
                  <span className="font-semibold text-[#002623]">احصل على عمولة 10%</span> 
                  عن كل حجز يتم باستخدام كودك.
                </li>
              </ol>
              <p className="text-[15px] leading-relaxed text-[#757575]">
                انطلق في الترويج الآن وابدأ في جني الأرباح!
              </p>
              <p className="font-semibold">وفالك التوفيق!</p>
              <Button
                className="mt-2 w-full rounded-4xl bg-[#174545] text-white hover:bg-[#174545]/90"
                size="lg"
                disabled={isAccepting}
                onClick={handleFinish}
              >
                {isAccepting ? <Loader2 className="h-5 w-5 animate-spin" /> : "استمرار"}
              </Button>
              {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Handshake, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { FalkTermsContent } from "@/components/falk/terms-content";

const drawerContentClass =
  "sm:mx-auto sm:w-[450px] sm:[--drawer-content-width:450px] sm:data-[swipe-axis=y]:inset-x-0";

export function FalkAcceptTermsDrawer({ open, onOpenChange, onAccepted }) {
  const [step2Open, setStep2Open] = useState(false);
  const [step3Open, setStep3Open] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) return;
    setStep2Open(false);
    setStep3Open(false);
    setChecked(false);
    setIsAccepting(false);
    setError("");
  }, [open]);

  const handleRootOpenChange = (nextOpen) => {
    if (!nextOpen) {
      setStep2Open(false);
      setStep3Open(false);
    }
    onOpenChange?.(nextOpen);
  };

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

      setStep3Open(false);
      setStep2Open(false);
      onOpenChange?.(false);
      await onAccepted?.();
    } catch (err) {
      setError(err.message || "تعذر تسجيل الموافقة على الشروط");
      setIsAccepting(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={handleRootOpenChange} showSwipeHandle>
      <DrawerContent className={drawerContentClass}>
        <DrawerHeader className="text-right md:text-right">
          <DrawerTitle className="font-display text-[#002623]">{"'فالك' للتسويق بالعمولة"}</DrawerTitle>
          <DrawerDescription className="sr-only">{"'فالك' للتسويق بالعمولة"}</DrawerDescription>
        </DrawerHeader>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pt-3 pb-2 text-right">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-[#174545]/10">
            <Handshake className="h-7 w-7 text-[#174545]" />
          </span>
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
        </div>

        <DrawerFooter className="pt-2 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <Button
            className="w-full cursor-pointer rounded-4xl bg-[#174545] text-white hover:bg-[#174545]/90"
            size="lg"
            onClick={() => setStep2Open(true)}
          >
            استمرار
          </Button>
        </DrawerFooter>

        <Drawer
          open={step2Open}
          onOpenChange={(nextOpen) => {
            setStep2Open(nextOpen);
            if (!nextOpen) setStep3Open(false);
          }}
          showSwipeHandle
        >
          <DrawerContent className={drawerContentClass}>
            <DrawerHeader className="text-right md:text-right">
              <DrawerTitle className="font-display text-[#002623]">الشروط والأحكام</DrawerTitle>
              <DrawerDescription className="sr-only">الشروط والأحكام</DrawerDescription>
            </DrawerHeader>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pt-3 pb-2 text-right">
              <FalkTermsContent interactive />
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-[#002623]/5 p-3 text-sm text-[#002623]">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => setChecked(event.target.checked)}
                  className="size-4 shrink-0 accent-[#174545]"
                />
                <span>أوافق على الشروط والأحكام, وأقر بأنني قرأتها وفهمتها بالكامل</span>
              </label>
            </div>

            <DrawerFooter className="pt-2 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
              <Button
                className="w-full cursor-pointer rounded-4xl bg-[#174545] text-white hover:bg-[#174545]/90 disabled:cursor-not-allowed"
                size="lg"
                disabled={!checked}
                onClick={() => setStep3Open(true)}
              >
                استمرار
              </Button>
            </DrawerFooter>

            <Drawer open={step3Open} onOpenChange={setStep3Open} showSwipeHandle>
              <DrawerContent className={drawerContentClass}>
                <DrawerHeader className="text-right md:text-right">
                  <DrawerTitle className="font-display text-[#002623]">كيفية العمل</DrawerTitle>
                  <DrawerDescription className="sr-only">كيفية العمل</DrawerDescription>
                </DrawerHeader>

                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pt-3 pb-2 text-right">
                  <p className="text-[15px] font-semibold leading-relaxed text-[#002623]">
                    {"نحن سعداء لانضمامك إلى برنامج 'فالك'!"}
                  </p>
                  <p className="text-[15px] leading-relaxed text-[#757575]">
                    {"باستخدام الصورة التسويقية التي تحتوي على كودك الخاص، يمكنك الترويج لخدمة فحص السيارات."}
                  </p>
                  <p className="text-[15px] leading-relaxed text-[#757575]">
                    {"الكود يمنح العملاء خصم 20%، بينما تحصل أنت على عمولة 10% عن كل عملية حجز تتم باستخدام الكود."}
                  </p>
                  <p className="text-[15px] font-semibold leading-relaxed text-[#002623]">كيفية العمل:</p>
                  <ol className="list-decimal space-y-2 pr-5 text-[15px] leading-relaxed text-[#757575]">
                    <li>{"استخدم الصورة والكود للترويج عبر منصاتك الإلكترونية."}</li>
                    <li>{"شارك مع جمهورك بأن الكود يتيح لهم خصم 20% عند حجز خدمة فحص السيارات."}</li>
                    <li>{"احصل على عمولة 10% عن كل حجز يتم باستخدام كودك."}</li>
                  </ol>
                  <p className="text-[15px] leading-relaxed text-[#757575]">
                    {"انطلق في الترويج الآن وابدأ في جني الأرباح!"}
                  </p>
                  <p className="text-[15px] font-semibold leading-relaxed text-[#002623]">وفالك التوفيق!</p>
                  {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}
                </div>

                <DrawerFooter className="pt-2 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
                  <Button
                    className="w-full cursor-pointer rounded-4xl bg-[#174545] text-white hover:bg-[#174545]/90 disabled:cursor-not-allowed"
                    size="lg"
                    disabled={isAccepting}
                    onClick={handleFinish}
                  >
                    {isAccepting ? <Loader2 className="h-5 w-5 animate-spin" /> : "انضم الآن"}
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </DrawerContent>
        </Drawer>
      </DrawerContent>
    </Drawer>
  );
}

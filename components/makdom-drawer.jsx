"use client";

import { usePathname, useRouter } from "next/navigation";
import { ClipboardCheck, FileBadge, TriangleAlert, Truck, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const STEPS = [
  {
    title: "فحص السيارة",
    icon: ClipboardCheck,
    items: [
      "بعد طلب الخدمة سيصلك رقم الحجز، قم بإرساله لصاحب السيارة",
      "اطلب من صاحب السيارة التوجه الى الفرع المحدد",
      "بعد الانتهاء من الفحص، يتم إرفاق تقرير الفحص عبر الواتساب والموقع الالكتروني",
      "ملاحظة: يظهر التقرير فقط للرقم المسجل أثناء الدفع، ولن يتم عرض التقرير على صاحب السيارة (البائع).",
    ],
  },
  {
    title: "نقل الملكية والتأمين",
    icon: FileBadge,
    items: ["عند الرغبة بنقل الملكية أو التأمين، سيتم تزويدك برقم المسؤول ويتم النقل بشكل فوري."],
  },
  {
    title: "شحن السيارة",
    icon: Truck,
    iconClassName: "-scale-x-100",
    items: [
      "شحن السيارة من مدينة الفحص إلى مدينتك بكل سهولة، بالتعاون مع شركة البسامي الدولية للنقليات، دون الحاجة لوجودك.",
      "بعد إكمال الطلب عبر موقعنا الإلكتروني، يمكن لصاحب السيارة التوجه مباشرة إلى شركة البسامي للنقليات.",
      "أو يمكنه الانتظار حتى وصول السطحة التابعة لشركة البسامي للنقليات، لاستلام السيارة وشحنها إلى مدينتك.",
      "ملاحظة: مركز كاشف لا يستلم السيارة من صاحب السيارة.",
    ],
  },
];

const FAQS = [
  {
    q: "هل السعر يشمل الفحص والنقل والشحن؟",
    a: (
      <>
        <p>لا. السعر لا يشمل جميع الخدمات في مبلغ واحد.</p>
        <ul className="mt-3 list-disc space-y-1 pr-4">
          <li>الفحص له سعر مستقل</li>
          <li>نقل الملكية والتأمين خدمة اختيارية بسعر مستقل</li>
          <li>شحن السيارة يتم احتسابه بسعر مستقل حسب المدينة والمسافة</li>
        </ul>
      </>
    ),
  },
  {
    q: "هل يستلم مركز كاشف السيارة من البائع؟",
    a: "لا. مركز كاشف لا يستلم السيارة من صاحبها. يجب على مالك السيارة الحضور بها إلى الفرع المحدد لإجراء الفحص.",
  },
  {
    q: "متى أستلم تقرير الفحص؟",
    a: (
      <>
        <p>بعد الانتهاء من الفحص:</p>
        <ul className="mt-3 list-disc space-y-1 pr-4">
          <li>يصلك التقرير عبر واتساب</li>
          <li>ويمكن تحميله من الموقع في أي وقت</li>
        </ul>
      </>
    ),
  },
  {
    q: "هل يمكنني نقل الملكية والتأمين من خلالكم؟",
    a: "نعم. يتوفر موظف مختص لتسهيل إجراءات نقل الملكية والتأمين عند الرغبة.",
  },
  {
    q: "كيف يتم شحن السيارة؟",
    a: (
      <>
        <p>بعد اكمال الطلب عبر موقعنا الالكتروني:</p>
        <ul className="mt-3 list-disc space-y-1 pr-4">
          <li>يمكن لمالك السيارة التوجه مباشرة إلى شركة البسامي للنقل.</li>
          <li>أو الانتظار حتى وصول السطحة لاستلام السيارة ونقلها الى شركة البسامي.</li>
        </ul>
        <p className="mt-3">تنويه: مركز كاشف لا يستلم السيارة من صاحب السيارة «البائع»</p>
      </>
    ),
  },
];

const drawerContentClass =
  "sm:mx-auto sm:w-full sm:max-w-6xl sm:[--drawer-content-width:72rem] sm:data-[swipe-axis=y]:inset-x-0";

export function MakdomDrawer({ open, onOpenChange }) {
  const router = useRouter();
  const pathname = usePathname();

  function handleRequest() {
    onOpenChange?.(false);
    if (pathname !== "/") {
      router.push("/");
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent className={drawerContentClass}>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 pt-3 pb-2 text-right sm:px-6">
            <DrawerHeader className="relative gap-3 p-0 px-8 text-center md:text-center">
              <DrawerClose
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="إغلاق"
                    className="absolute top-0 left-0 cursor-pointer rounded-full text-[#002623] hover:bg-[#174545]/10"
                  />
                }
              >
                <X className="size-5" />
              </DrawerClose>

              <DrawerTitle className="font-display text-2xl text-[#002623] sm:text-3xl">
                <span className="relative inline-block">
                  خدمة مخدوم
                  <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
                </span>
              </DrawerTitle>
              <p className="font-display text-lg leading-8 text-[#002623] sm:text-xl sm:leading-9">
                وجدت سيارة مستعملة للبيع وأنت خارج الرياض، جدة الدمام القصيم أو خميس مشيط؟
              </p>
              <DrawerDescription className="text-sm leading-7 text-[#757575] sm:text-base">
                كاشف يقوم بفحص السيارة بدقة مع تسجيل مرئي وشرح تقرير الفحص بمقطع فيديو مسجل، ويسهّل عليك إجراءات نقل
                الملكية والتأمين وشحن المركبة
              </DrawerDescription>
            </DrawerHeader>

            <ol className="grid gap-4 lg:grid-cols-3">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li key={step.title} className="rounded-3xl bg-[#174545]/5 px-4 py-4">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#174545]/10 text-[#174545]">
                        <Icon className={`size-6 ${step.iconClassName ?? ""}`} aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1 text-right">
                        <p className="text-sm text-[#174545]">الخطوة {index + 1}</p>
                        <h3 className="mt-1 font-display text-lg text-[#002623]">{step.title}</h3>
                      </div>
                    </div>
                    <ol className="list-decimal space-y-2 pr-4 text-sm leading-6 text-[#757575]">
                      {step.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  </li>
                );
              })}
            </ol>

            <section className="mx-auto max-w-3xl">
              <h3 className="mb-3 text-center font-display text-lg text-[#002623]">الأسئلة الشائعة</h3>
              <Accordion className="overflow-hidden rounded-3xl border border-[#174545]/10 bg-white">
                {FAQS.map(({ q, a }, i) => (
                  <AccordionItem key={q} value={`faq-${i}`} className="border-b border-gray-200 last:border-b-0">
                    <AccordionTrigger
                      dir="rtl"
                      className="w-full cursor-pointer justify-between px-4 py-3.5 text-right text-sm font-semibold text-[#002623] **:data-[slot=accordion-trigger-icon]:ml-0 **:data-[slot=accordion-trigger-icon]:shrink-0"
                    >
                      <span className="min-w-0 flex-1">{q}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-sm leading-relaxed text-[#707171]" dir="rtl">
                      {a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="mx-auto flex max-w-3xl items-start gap-3 rounded-3xl bg-[#fff7ed] px-4 py-3.5 text-[#9a3412]">
              <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden />
              <p className="text-sm font-medium leading-6">
                تنويه: مركز كاشف لا يستلم السيارة من صاحب السيارة &quot;البائع&quot;
              </p>
            </div>
          </div>

          <DrawerFooter className="pt-2 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <Button
              type="button"
              size="lg"
              onClick={handleRequest}
              className="w-full cursor-pointer rounded-full bg-[#002623] text-base font-bold text-white hover:bg-[#1a292e]"
            >
              اطلب مخدوم
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

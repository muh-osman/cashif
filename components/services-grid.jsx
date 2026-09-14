"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const SERVICES = [
  {
    id: "inspection-before-buying",
    number: 1,
    title: "فحص الشراء",
    description: "فحص جميع أجزاء المركبة المستعملة لمعرفة واكتشاف الأعطال والعيوب قبل اتخاذ قرار الشراء.",
    points: ["فحص اجزاء السيارة", "تجربة السيارة ميدانًيا", "تقرير مفصل عن حالة السيارة", "نقاط ومكافئات"],
    cta: "plans/purchase-inspection",
    param: "purchaseInspection",
  },
  {
    id: "makhdoom",
    number: 2,
    title: "خدمة مخدوم",
    description: (
      <>
        في حال وجدت سيارة للبيع في <u>الرياض، جدة، الدمام، القصيم أو خميس مشيط</u> وأنت خارج هذه المدن، مركز كاشف يقوم بفحص شامل ودقيق للسيارة، مع تسهيل إجراءات نقل الملكية
        والتأمين وشحن السيارة إلى مدينتك.
      </>
    ),
    points: [
      "حضور مالك السيارة لأحد فروع كاشف",
      "فحص دقيق للسيارة مع تسجيل مرئي وشرح التقرير بمقطع فيديو مسجل",
      <>
        تحميل تقرير الفحص عبر{" "}
        <Link href="reports" className="underline">
          موقعنا
        </Link>
      </>,
      "إتمام نقل الملكية والتأمين وشحن السيارة",
    ],
    cta: "/makdom",
    ctaLabel: "المزيد من التفاصيل",
    param: "checkit",
  },
  {
    id: "passnger-check",
    number: 3,
    title: "فحص المسافر",
    description: (
      <>
        فحص مخصص <u>قبل السفر</u> للتأكد من سلامة السيارة على الطريق، يشمل أهم الفحوصات التي تضمن رحلة آمنة ومريحة.
      </>
    ),
    points: ["فحص الزيوت والسوائل", "فحص الكفرات والفرامل والأنوار", "فحص أدوات السلامة والمساحات", "تجربة السيارة على الطريق"],
    cta: "plans/passenger-check",
    param: "passengerCheck",
  },
];

const buttonClassName = cn(buttonVariants({ variant: "default", size: "lg" }), "w-full cursor-pointer rounded-full bg-[#002623] py-2 text-white hover:bg-[#1a292e]");

function ServicePoint({ point, compact }) {
  return (
    <li className={cn("flex items-start gap-2 font-medium text-[#757575]", compact ? "text-xs" : "items-center text-base")}>
      <ShieldCheck className={cn("shrink-0 text-[#4caf50]", compact ? "mt-0.5 h-4 w-4" : "h-[25px] w-[25px]")} />
      <span>{point}</span>
    </li>
  );
}

export function ServiceCard({ service, ctaLabel: ctaLabelOverride, selected = false, onSelect, compact = false, preview = false }) {
  const { id, number, title, description, points, cta, ctaLabel = "أطلب الأن", param } = service;
  const [expanded, setExpanded] = useState(false);
  const showDetails = !preview || expanded;
  const visiblePoints = showDetails ? points : points.slice(0, 1);
  const hiddenPoints = showDetails ? [] : points.slice(1);

  return (
    <Card
      id={id}
      className={cn(
        "flex h-full w-full flex-col justify-between rounded-[40px] shadow-[0_7px_29px_0_rgba(100,100,111,0.2)] transition",
        compact ? "p-4" : "min-h-[350px] p-6 sm:min-h-[415px] sm:p-11",
        onSelect ? (selected ? "border-2 border-[#174545]" : "border-2 border-transparent") : "border-none"
      )}
    >
      <CardContent className="flex flex-1 flex-col p-0">
        <div className={cn("mx-auto", compact ? "mb-3 h-20 w-20" : "mb-6 h-[164px] w-[164px]")}>
          <Image src={`/images/wheel-${number}.jpg`} alt={`${title} icon`} width={100} height={100} className="h-full w-full object-contain" />
        </div>
        <h4 className={cn("text-center font-bold text-[#002623]", compact ? "text-lg" : "text-2xl sm:text-[25px]")}>{title}</h4>
        {showDetails ? (
          <p className={cn("mt-1.5 text-center text-[#757575] font-heading-bold", compact ? "mb-3 text-xs" : "mb-4 text-sm")}>{description}</p>
        ) : (
          <div className={compact ? "mb-3" : "mb-4"} />
        )}
        <ul className={cn(compact ? "space-y-2" : "mb-0 space-y-4")}>
          {visiblePoints.map((point, i) => (
            <ServicePoint key={i} point={point} compact={compact} />
          ))}
        </ul>
        {hiddenPoints.length > 0 ? (
          <div className="relative mt-2">
            <ul className={cn("pointer-events-none select-none", compact ? "space-y-2" : "space-y-4")} aria-hidden>
              {hiddenPoints.map((point, i) => (
                <li key={i} className={cn("flex items-start gap-2 font-medium text-[#757575] blur-[3px]", compact ? "text-xs" : "items-center text-base")}>
                  <ShieldCheck className={cn("shrink-0 text-[#4caf50]", compact ? "mt-0.5 h-4 w-4" : "h-[25px] w-[25px]")} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-white" />
          </div>
        ) : null}
        {preview ? (
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            className="mx-auto mt-3 flex cursor-pointer items-center gap-1 text-sm font-medium text-[#174545] hover:text-[#002623]"
          >
            {expanded ? "أقل" : "المزيد"}
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        ) : null}
      </CardContent>
      <CardFooter className="mt-auto p-0 pt-4">
        {onSelect ? (
          <button type="button" onClick={() => onSelect(param)} className={buttonClassName}>
            {ctaLabelOverride ?? ctaLabel}
          </button>
        ) : (
          <Link href={cta} className={buttonClassName}>
            {ctaLabelOverride ?? ctaLabel}
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

export function ServicesGrid({ ctaLabel: ctaLabelOverride, selectedParam, onSelect, preview = false }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-6">
      {SERVICES.map((service) => (
        <div key={service.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
          <ServiceCard service={service} ctaLabel={ctaLabelOverride} selected={selectedParam === service.param} onSelect={onSelect} preview={preview} />
        </div>
      ))}
    </div>
  );
}

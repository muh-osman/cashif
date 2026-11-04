"use client";

import { Check, Info, SaudiRiyal, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CHECKLIST_ITEMS, DISCOUNT_PERCENT } from "@/lib/new-branch-plans";
import { cn } from "@/lib/utils";

function ChecklistItem({ checked, text, tooltip }) {
  return (
    <li
      className={cn(
        "flex items-start gap-1.5 text-[11px] leading-snug sm:text-xs",
        checked ? "text-[#002623]" : "text-[#b0b0b0]"
      )}
    >
      {checked ? (
        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#25d366]" strokeWidth={3} />
      ) : (
        <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#b0b0b0]" strokeWidth={3} />
      )}
      <span className="min-w-0 flex-1">{text}</span>
      <Popover>
        <PopoverTrigger
          className={cn(
            "mt-0.5 inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full transition hover:bg-[#174545]/10 hover:text-[#174545]",
            checked ? "text-[#757575]" : "text-[#b0b0b0]"
          )}
          aria-label={`معلومات عن ${text}`}
        >
          <Info className="h-3.5 w-3.5" />
        </PopoverTrigger>
        <PopoverContent align="center" side="top" className="w-56 p-3 text-right text-xs leading-relaxed text-[#002623]">
          {tooltip}
        </PopoverContent>
      </Popover>
    </li>
  );
}

export function InspectionPlanCard({ plan }) {
  return (
    <Card
      className={cn(
        "relative min-w-0 flex-1 gap-0 overflow-hidden rounded-3xl py-0 shadow-md ring-1 ring-[#002623]/8",
        plan.featured && "order-first ring-2 ring-[#174545] sm:order-none"
      )}
    >
      <div
        className={cn(
          "flex h-14 shrink-0 items-center justify-center border-b border-[#002623]/8 px-2 text-center sm:px-3",
          plan.featured ? "bg-[#174545] text-white" : "bg-[#f7f7f8] text-[#002623]"
        )}
      >
        <h3 className="font-display text-sm leading-none sm:text-base">{plan.title}</h3>
      </div>

      <CardContent className="flex flex-col gap-3 px-2 py-4 sm:px-3">
        <div className="text-center">
          <div className="mb-2 flex justify-end" dir="rtl">
            <span className="inline-flex items-center rounded-full bg-[#e5484d] px-2.5 py-[6px] text-[10px] font-bold leading-none text-white sm:text-xs">
              خصم {DISCOUNT_PERCENT}%
            </span>
          </div>
          <p className="flex items-center justify-center gap-1 text-2xl font-bold text-[#174545] sm:text-3xl">
            <span>{plan.price}</span>
            <SaudiRiyal className="h-5 w-5 sm:h-6 sm:w-6" />
          </p>

          {plan.youSave > 0 && (
            <div className="mt-2 inline-flex max-w-full overflow-hidden rounded-full text-[11px] font-bold sm:text-xs">
              <span className="inline-flex shrink-0 items-center justify-center gap-0.5 whitespace-nowrap bg-[#fce8e8] px-2 py-1 text-[#d32f2f] line-through sm:px-2.5">
                {plan.originalPrice}
                <SaudiRiyal className="h-3 w-3 shrink-0" />
              </span>
              <span className="inline-flex shrink-0 items-center justify-center gap-0.5 whitespace-nowrap bg-[#dff1d9] px-2 py-1 text-[#25d366] sm:px-2.5">
                وفر {plan.youSave}
                <SaudiRiyal className="h-3 w-3 shrink-0" />
              </span>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] font-semibold text-[#002623] sm:text-xs">تشمل فحص:</p>

        <ul className="space-y-1.5">
          {CHECKLIST_ITEMS.map((item, index) => (
            <ChecklistItem
              key={item.text}
              checked={index < plan.checkedCount}
              text={item.text}
              tooltip={item.tooltip}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function InspectionPlansGrid({ plans }) {
  if (!plans?.length) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-6 text-center font-display text-xl text-[#002623] sm:text-2xl">اختر الباقة المناسبة</h2>
      <div className="flex flex-col items-stretch gap-5 sm:flex-row sm:items-start sm:gap-5">
        {plans.map((plan) => (
          <InspectionPlanCard key={plan.key} plan={plan} />
        ))}
      </div>
    </section>
  );
}

"use client";

import { Check, Info, SaudiRiyal, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CHECKLIST_ITEMS } from "@/lib/new-branch-plans";
import { cn } from "@/lib/utils";

function ChecklistItem({ checked, text, tooltip }) {
  return (
    <li
      className={cn(
        "flex items-center gap-1.5 text-sm leading-snug",
        checked ? "text-[#002623]" : "text-[#b0b0b0]"
      )}
    >
      {checked ? (
        <Check className="size-4 shrink-0 text-[#25d366]" strokeWidth={3} />
      ) : (
        <X className="size-4 shrink-0 text-[#b0b0b0]" strokeWidth={3} />
      )}
      <span className="min-w-0">{text}</span>
      <Popover>
        <PopoverTrigger
          className={cn(
            "ms-auto inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full transition hover:bg-[#174545]/10 hover:text-[#174545]",
            checked ? "text-[#757575]" : "text-[#b0b0b0]"
          )}
          aria-label={`معلومات عن ${text}`}
        >
          <Info className="size-3.5" />
        </PopoverTrigger>
        <PopoverContent
          align="center"
          side="top"
          className="w-56 max-w-[calc(100vw-1.5rem)] p-3 text-right text-xs leading-relaxed text-[#002623]"
        >
          {tooltip}
        </PopoverContent>
      </Popover>
    </li>
  );
}

export function InspectionPlanCard({ plan, className }) {
  return (
    <Card
      className={cn(
        "@container relative min-w-0 gap-0 overflow-hidden rounded-3xl py-0 shadow-md ring-1 ring-[#002623]/8",
        plan.featured && "ring-2 ring-[#174545]",
        className
      )}
    >
      <div
        className={cn(
          "flex h-12 shrink-0 items-center justify-center border-b border-[#002623]/8 px-1.5 text-center @min-[220px]:h-14 @min-[220px]:px-3",
          plan.featured ? "bg-[#174545] text-white" : "bg-[#f7f7f8] text-[#002623]"
        )}
      >
        <h3 className="font-display text-sm leading-none whitespace-nowrap @min-[220px]:text-base">{plan.title}</h3>
      </div>

      <CardContent className="flex flex-col gap-3 px-1.5 py-3 @min-[188px]:px-2 @min-[240px]:px-3 @min-[240px]:py-4">
        <div className="text-center">
          {plan.discountPercent > 0 ? (
            <div className="mb-2 flex justify-end" dir="rtl">
              <span className="inline-flex items-center rounded-full bg-[#e5484d] px-2 py-[6px] text-[10px] font-bold leading-none whitespace-nowrap text-white @min-[220px]:px-2.5 @min-[220px]:text-xs">
                خصم {plan.discountPercent}%
              </span>
            </div>
          ) : null}
          <p className="flex items-center justify-center gap-1 text-xl font-bold whitespace-nowrap text-[#174545] @min-[188px]:text-2xl @min-[240px]:text-3xl">
            <span className="font-display font-normal">{plan.price}</span>
            <SaudiRiyal className="size-4 shrink-0 @min-[188px]:size-5 @min-[240px]:size-6" />
          </p>

          {plan.youSave > 0 && (
            <div className="mt-2 inline-flex max-w-full overflow-hidden rounded-full text-[10px] font-bold @min-[220px]:text-[11px] @min-[260px]:text-xs">
              <span className="inline-flex shrink-0 items-center justify-center gap-0.5 whitespace-nowrap bg-[#fce8e8] px-1.5 py-1 text-[#d32f2f] line-through @min-[220px]:px-2.5">
                {plan.originalPrice}
                <SaudiRiyal className="size-3 shrink-0" />
              </span>
              <span className="inline-flex shrink-0 items-center justify-center gap-0.5 whitespace-nowrap bg-[#dff1d9] px-1.5 py-1 text-[#25d366] @min-[220px]:px-2.5">
                وفر {plan.youSave}
                <SaudiRiyal className="size-3 shrink-0" />
              </span>
            </div>
          )}
        </div>

        <p className="text-center text-sm font-semibold text-[#002623]">
          تشمل فحص:
        </p>

        <ul className="space-y-2">
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
      <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
        {plans.map((plan, index) => {
          // Center a trailing odd card only while the 2-col layout is active (sm–lg).
          // Order follows source array; CSS order only affects the 1-col (xs) stack.
          const centerLastOnTwoCol = plans.length % 2 === 1 && index === plans.length - 1;

          return (
            <InspectionPlanCard
              key={plan.key}
              plan={plan}
              className={cn(
                plan.featured && "order-first sm:order-none",
                centerLastOnTwoCol &&
                  "sm:col-span-2 sm:w-[calc((100%-1rem)/2)] sm:justify-self-center lg:col-span-1 lg:w-auto lg:justify-self-stretch"
              )}
            />
          );
        })}
      </div>
    </section>
  );
}

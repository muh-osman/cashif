"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NumberFlow from "@number-flow/react";
import { SaudiRiyal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  CITIES,
  SHIPPING_FROM_BRANCHES,
  SHIPPING_TYPE_PRIVATE,
  SHIPPING_TYPE_PUBLIC,
  calculateShippingPrice,
  isAvailablePrice,
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

function SelectField({ id, label, value, onChange, placeholder, children }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-semibold text-[#002623]">{label}</span>
      <span className="relative block">
        <select
          id={id}
          required
          value={value}
          onChange={onChange}
          className="h-13 w-full cursor-pointer appearance-none rounded-full border border-[#002623]/10 bg-white px-4 pe-10 text-sm font-medium outline-none focus:border-[#174545]"
        >
          <option value="">{placeholder}</option>
          {children}
        </select>
        <span className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-xs text-[#757575]">▾</span>
      </span>
    </label>
  );
}

export function ShippingPricesList() {
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [shippingType, setShippingType] = useState("");
  const [displayPrice, setDisplayPrice] = useState(0);
  const priceRef = useRef(null);
  const wasShowingPrice = useRef(false);

  const price = calculateShippingPrice(selectedBranch, selectedCity, shippingType);
  const visibleOptions = SHIPPING_OPTIONS.filter((option) =>
    isAvailablePrice(calculateShippingPrice(selectedBranch, selectedCity, option.type))
  );
  const showPrice = Boolean(selectedCity && shippingType && isAvailablePrice(price));

  useEffect(() => {
    if (!showPrice) {
      wasShowingPrice.current = false;
      setDisplayPrice(0);
      return;
    }

    if (!wasShowingPrice.current) {
      wasShowingPrice.current = true;
      setDisplayPrice(0);
      let frame2 = 0;
      const frame1 = requestAnimationFrame(() => {
        frame2 = requestAnimationFrame(() => setDisplayPrice(price));
      });
      return () => {
        cancelAnimationFrame(frame1);
        cancelAnimationFrame(frame2);
      };
    }

    setDisplayPrice(price);
  }, [showPrice, price]);

  useEffect(() => {
    if (!showPrice || !priceRef.current) return;
    priceRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [showPrice, price]);

  function handleBranchChange(event) {
    setSelectedBranch(event.target.value);
    setShippingType("");
  }

  function handleCityChange(event) {
    setSelectedCity(event.target.value);
    setShippingType("");
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          أسعار الشحن
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
        <p className="text-sm leading-relaxed text-[#757575]">هذه الخدمة متاحة لعملاء مركز كاشف فقط</p>
      </div>

      <div className="mx-auto max-w-md space-y-5">
        <div className="rounded-[28px] bg-[#fbf6ea] px-4 py-4 text-sm leading-7 text-[#002623]">
          <p className="mb-2 font-semibold">طريقة طلب الشحن</p>
          <ol className="list-decimal space-y-2 pr-5">
            <li>
              في حال الرغبة بطلب خدمة شحن السيارة، بعد الانتهاء من الفحص سيصلك تقرير الفحص عبر الموقع الإلكتروني ضمن خانة{" "}
              <Link href="/reports" className="font-semibold text-[#174545] underline-offset-4 hover:underline">
                تقاريري
              </Link>
              .
            </li>
            <li>يوجد زر «شحن السيارة»، يرجى الضغط عليه، ثم اختيار المدينة المراد الشحن إليها، وإكمال الطلب من خلال الموقع الإلكتروني.</li>
          </ol>
        </div>

        <Card className="rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
          <CardContent className="space-y-5">
            <SelectField
              id="shipping-from"
              label="شحن السيارة من"
              value={selectedBranch}
              onChange={handleBranchChange}
              placeholder="اختر فرع"
            >
              {SHIPPING_FROM_BRANCHES.map((branch) => (
                <option key={branch.id} value={branch.nameAr}>
                  {branch.nameAr}
                </option>
              ))}
            </SelectField>

            <SelectField
              id="shipping-to"
              label="شحن السيارة الى"
              value={selectedCity}
              onChange={handleCityChange}
              placeholder="اختر المدينة"
            >
              {CITIES.map((city) => (
                <option key={city.id} value={city.nameAr}>
                  {city.nameAr}
                </option>
              ))}
            </SelectField>

            {selectedBranch && selectedCity ? (
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
                        <span className="mt-2 block text-xs font-semibold sm:mt-3 sm:text-sm">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-sm text-[#757575]">لا تتوفر خدمة شحن إلى هذه المدينة.</p>
              )
            ) : null}

            {showPrice ? (
              <div ref={priceRef} className="flex justify-center">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fbf6ea] px-6 py-3 text-[#174545]">
                  <NumberFlow
                    value={displayPrice}
                    locales="en-US"
                    format={{ maximumFractionDigits: 0 }}
                    className="text-2xl font-bold"
                    style={{ fontVariantNumeric: "tabular-nums", lineHeight: 0.85 }}
                  />
                  <SaudiRiyal className="h-5 w-5 shrink-0" />
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

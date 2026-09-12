"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PARTNER_OFFERS } from "@/data/partners";

export default function PartnersPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          عروض شركائنا
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
        <p className="text-lg text-[#002623]">
          خصم خاص <span className="text-[#174545]">لعملاء كاشف!</span>
        </p>
      </div>

      <ul className="grid gap-6 sm:grid-cols-2">
        {PARTNER_OFFERS.map((offer) => (
          <li key={offer.id}>
            <Card size="sm" className="h-full rounded-[40px] border-none pt-0 shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
              <div className="flex aspect-[958/444] items-center justify-center overflow-hidden rounded-t-[40px] bg-white px-5 pt-5">
                <Image src={offer.image} alt={offer.name} width={958} height={444} className="h-full w-full object-contain" />
              </div>

              <CardFooter className="mt-auto">
                <a
                  href={offer.image}
                  download={offer.file}
                  className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full cursor-pointer rounded-full bg-[#002623] py-2 text-white hover:bg-[#1a292e]")}
                >
                  <Download data-icon="inline-start" />
                  تحميل الكوبون
                </a>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-center text-[#757575]">اعرض الكوبونات لدى شركائنا عند وصولك</p>
    </main>
  );
}

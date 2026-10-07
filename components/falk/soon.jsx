"use client";

import { Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function FalkSoon() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          فالك
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
        <p className="text-[#757575]">{"'فالك' للتسويق بالعمولة"}</p>
      </div>

      <Card className="mx-auto max-w-3xl rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
        <CardContent className="space-y-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#174545]/10">
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
          <Button className="mt-2 w-full rounded-4xl bg-[#174545] text-white hover:bg-[#174545]/90" size="lg" disabled>
            قريبا
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

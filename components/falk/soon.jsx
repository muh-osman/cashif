"use client";

import { Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export function FalkSoonDrawer({ open, onOpenChange }) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent className="sm:mx-auto sm:w-[450px] sm:[--drawer-content-width:450px] sm:data-[swipe-axis=y]:inset-x-0">
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
            onClick={() => onOpenChange?.(false)}
          >
            قريبا
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

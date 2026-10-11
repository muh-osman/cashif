"use client";

import Link from "next/link";
import { Building2, ChevronLeft, UserRound } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const ACCOUNT_TYPES = [
  {
    label: "حساب أفراد",
    description: "للأفراد الراغبين في فحص سياراتهم",
    href: "/signup/individual",
    icon: UserRound,
  },
  {
    label: "حساب مؤسسات",
    description: "للشركات والمؤسسات وأصحاب الأساطيل",
    href: "/signup/organization",
    icon: Building2,
  },
];

export function SignupAccountTypeDrawer({ open, onOpenChange, from }) {
  const fromQuery = from && from !== "/" ? `?from=${encodeURIComponent(from)}` : "";

  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent className="sm:mx-auto sm:w-[450px] sm:[--drawer-content-width:450px] sm:data-[swipe-axis=y]:inset-x-0">
        <DrawerHeader className="text-right md:text-right">
          <DrawerTitle className="font-display text-[#002623]">إنشاء حساب</DrawerTitle>
          <DrawerDescription className="text-[#757575]">اختر نوع الحساب المناسب لك</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-2 p-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          {ACCOUNT_TYPES.map(({ label, description, href, icon: Icon }) => (
            <DrawerClose
              key={href}
              nativeButton={false}
              render={
                <Link
                  href={`${href}${fromQuery}`}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-[#002623] transition-colors hover:bg-[#428177]/10"
                  onClick={() => onOpenChange?.(false)}
                />
              }
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#174545]/10">
                <Icon className="h-5 w-5 text-[#174545]" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-right">
                <span className="text-base font-medium">{label}</span>
                <span className="text-sm text-[#757575]">{description}</span>
              </span>
              <ChevronLeft className="h-4 w-4 shrink-0 text-[#757575]" />
            </DrawerClose>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

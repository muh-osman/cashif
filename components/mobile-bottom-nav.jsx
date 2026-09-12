"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogIn, LogOut, ShoppingCart, MapPin, ExternalLink, Gift, ChevronLeft, Home as HomeIcon, FileText, SaudiRiyal, Handshake } from "lucide-react";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

const MOBILE_NAV = [
  { label: "حسابي", icon: Menu, action: "account" },
  { label: "الأسعار", icon: SaudiRiyal, href: "/" },
  { label: "الرئيسية", icon: HomeIcon, href: "/" },
  { label: "تقاريري", icon: FileText, href: "/" },
  { label: "فالك", icon: Handshake, href: "/" },
];

const ACCOUNT_LINKS = [
  { label: "فروعنا", href: "/branches", icon: MapPin, activatesAccount: true },
  { label: "المدونة", href: "https://cashif.cc/blog/", icon: FileText, external: true },
  { label: "طلباتي", href: "/", icon: ShoppingCart },
  { label: "عروض شركائنا", href: "/partners", icon: Gift, activatesAccount: true },
];

function isAccountPath(pathname) {
  if (pathname === "/login" || pathname.startsWith("/login/")) return true;
  return ACCOUNT_LINKS.some(({ href, activatesAccount }) => {
    if (!activatesAccount) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  });
}

function MobileNavItem({ icon: Icon, label, isActive }) {
  return (
    <>
      <span className="flex h-8 w-14 items-center justify-center">
        <span
          className={`flex h-8 w-14 items-center justify-center rounded-2xl transition-colors duration-200 ease-out ${
            isActive ? "bg-[#4281775e]" : "bg-transparent group-hover:bg-[#428177]/25"
          }`}
        >
          <Icon className="h-6 w-6 shrink-0 text-[#002623] transition-colors duration-200 group-hover:text-[#174545]" strokeWidth={isActive ? 2.2 : 1.8} />
        </span>
      </span>
      <span className="font-display text-[12px] font-medium leading-none tracking-wide text-[#002623] transition-colors duration-200 group-hover:text-[#174545]">{label}</span>
    </>
  );
}

export function MobileBottomNav({ initialActive = 2 }) {
  const pathname = usePathname();
  const [active, setActive] = useState(initialActive);
  const [accountOpen, setAccountOpen] = useState(false);
  const isLoggedIn = false;
  const isAccountPage = isAccountPath(pathname);

  return (
    <>
      <nav className="fixed bottom-0 left-1/2 z-50 w-full -translate-x-1/2 bg-[#f0f1f3cf] pt-3 pb-4 backdrop-blur-xl backdrop-saturate-150 sm:bottom-4 sm:w-[450px] sm:rounded-[40px]">
        <ul className="flex h-[52px] items-center">
          {MOBILE_NAV.map(({ label, icon: Icon, href, action }, i) => {
            const isActive = action === "account" ? isAccountPage : !isAccountPage && active === i;
            const itemClass = "group flex w-full cursor-pointer flex-col items-center justify-center gap-1";

            return (
              <li key={label} className="min-w-0 flex-1">
                {action === "account" ? (
                  <button
                    type="button"
                    onClick={() => setAccountOpen(true)}
                    className={`${itemClass} cursor-pointer`}
                  >
                    <MobileNavItem icon={Icon} label={label} isActive={isActive} />
                  </button>
                ) : (
                  <Link href={href} onClick={() => setActive(i)} className={itemClass}>
                    <MobileNavItem icon={Icon} label={label} isActive={isActive} />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <Drawer open={accountOpen} onOpenChange={setAccountOpen} showSwipeHandle>
        <DrawerContent className="sm:w-[450px] sm:[--drawer-content-width:450px] sm:data-[swipe-axis=y]:inset-x-0 sm:mx-auto">
          <DrawerHeader className="text-right md:text-right">
            <DrawerTitle className="font-display text-[#002623]">حسابي</DrawerTitle>
            <DrawerDescription className="sr-only">روابط الحساب والتنقل</DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-1 p-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            {ACCOUNT_LINKS.map(({ label, href, icon: Icon, external }) => (
              <DrawerClose
                key={label}
                nativeButton={false}
                render={
                  external ? (
                    <a href={href} target="_blank" rel="noreferrer" className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-[#002623] transition-colors hover:bg-[#428177]/10" />
                  ) : (
                    <Link href={href} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-[#002623] transition-colors hover:bg-[#428177]/10" />
                  )
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="flex-1 text-right text-base font-medium">{label}</span>
                {external ? <ExternalLink className="h-4 w-4 shrink-0 text-[#757575]" /> : <ChevronLeft className="h-4 w-4 shrink-0 text-[#757575]" />}
              </DrawerClose>
            ))}

            <DrawerClose
              nativeButton={false}
              render={<Link href="/login" className="mt-1 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-[#002623] transition-colors hover:bg-[#428177]/10" />}
            >
              {isLoggedIn ? <LogOut className="h-5 w-5 shrink-0" /> : <LogIn className="h-5 w-5 shrink-0" />}
              <span className="flex-1 text-right text-base font-medium">{isLoggedIn ? "تسجيل الخروج" : "تسجيل الدخول"}</span>
              <ChevronLeft className="h-4 w-4 shrink-0 text-[#757575]" />
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

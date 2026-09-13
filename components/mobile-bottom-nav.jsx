"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, LogIn, LogOut, ShoppingCart, MapPin, ExternalLink, Gift, ChevronLeft, Home as HomeIcon, FileText, SaudiRiyal, Handshake } from "lucide-react";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useAuth } from "@/components/auth-provider";
import { clearAuthCookies } from "@/lib/auth";
import { FALK_PARAGRAPHS, FALK_TITLE } from "@/data/falk";

const MOBILE_NAV = [
  { label: "حسابي", icon: Menu, action: "account" },
  { label: "الأسعار", icon: SaudiRiyal, href: "/" },
  { label: "الرئيسية", icon: HomeIcon, href: "/" },
  { label: "تقاريري", icon: FileText, action: "reports", href: "/reports" },
  { label: "فالك", icon: Handshake, action: "falk", href: "/falk" },
];

const ACCOUNT_NAV_INDEX = MOBILE_NAV.findIndex((item) => item.action === "account");
const REPORTS_NAV_INDEX = MOBILE_NAV.findIndex((item) => item.action === "reports");
const FALK_NAV_INDEX = MOBILE_NAV.findIndex((item) => item.action === "falk");
const HOME_NAV_INDEX = MOBILE_NAV.findIndex((item) => item.label === "الرئيسية");

const ACCOUNT_LINKS = [
  { label: "فروعنا", href: "/branches", icon: MapPin, activatesAccount: true },
  { label: "المدونة", href: "https://cashif.cc/blog/", icon: FileText, external: true },
  { label: "طلباتي", href: "/orders", icon: ShoppingCart, action: "orders", activatesAccount: true },
  { label: "عروض شركائنا", href: "/partners", icon: Gift, activatesAccount: true },
];

function isAccountPath(pathname) {
  if (pathname === "/login" || pathname.startsWith("/login/")) return true;
  return ACCOUNT_LINKS.some(({ href, activatesAccount }) => {
    if (!activatesAccount) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  });
}

function isReportsPath(pathname) {
  return pathname === "/reports" || pathname.startsWith("/reports/");
}

function isFalkPath(pathname) {
  return pathname === "/falk" || pathname.startsWith("/falk/");
}

function MobileNavItem({ icon: Icon, label, isActive, expandKey = 0 }) {
  return (
    <>
      <span className="flex h-8 w-14 items-center justify-center">
        <span
          className={`relative flex h-8 w-14 items-center justify-center overflow-hidden rounded-2xl transition-colors duration-200 ease-out ${
            isActive ? "bg-[#4281775e]" : "bg-transparent group-hover:bg-[#428177]/25"
          }`}
        >
          {expandKey > 0 && (
            <span
              key={expandKey}
              aria-hidden
              className="nav-bg-expand pointer-events-none absolute inset-0 rounded-2xl bg-[#428177]/25"
            />
          )}
          <Icon className="relative z-10 h-6 w-6 shrink-0 text-[#002623] transition-colors duration-200 group-hover:text-[#174545]" strokeWidth={isActive ? 2.2 : 1.8} />
        </span>
      </span>
      <span className="font-display text-[12px] font-medium leading-none tracking-wide text-[#002623] transition-colors duration-200 group-hover:text-[#174545]">{label}</span>
    </>
  );
}

function LoginRequiredDrawer({ open, onOpenChange, title, description, from, onBeforeNavigate, children }) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent className="sm:w-[450px] sm:[--drawer-content-width:450px] sm:data-[swipe-axis=y]:inset-x-0 sm:mx-auto">
        <DrawerHeader className="text-right md:text-right">
          <DrawerTitle className="font-display text-[#002623]">{title}</DrawerTitle>
          <DrawerDescription className={description ? "text-[#757575]" : "sr-only"}>{description || title}</DrawerDescription>
        </DrawerHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {children}
          <div className="flex flex-col gap-1 p-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <DrawerClose
              nativeButton={false}
              render={
                <Link
                  href={`/login?from=${from}`}
                  className="mt-1 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-[#002623] transition-colors hover:bg-[#428177]/10"
                  onClick={() => {
                    onBeforeNavigate?.();
                    onOpenChange(false);
                  }}
                />
              }
            >
              <LogIn className="h-5 w-5 shrink-0" />
              <span className="flex-1 text-right text-base font-medium">تسجيل الدخول</span>
              <ChevronLeft className="h-4 w-4 shrink-0 text-[#757575]" />
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export function MobileBottomNav({ initialActive = 2 }) {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState(initialActive);
  const [expanding, setExpanding] = useState({ index: null, key: 0 });
  const [accountOpen, setAccountOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [falkOpen, setFalkOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const keepAccountExpandRef = useRef(false);
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const isAccountPage = isAccountPath(pathname);
  const isReportsPage = isReportsPath(pathname);
  const isFalkPage = isFalkPath(pathname);

  const keepAccountExpand = () => {
    keepAccountExpandRef.current = true;
  };

  const clearAccountExpandIfNeeded = () => {
    if (keepAccountExpandRef.current || isAccountPath(pathname)) {
      keepAccountExpandRef.current = false;
      return;
    }
    setExpanding((prev) => (prev.index === ACCOUNT_NAV_INDEX ? { ...prev, index: null } : prev));
  };

  const clearReportsExpandIfNeeded = () => {
    if (isReportsPath(pathname)) return;
    setExpanding((prev) => (prev.index === REPORTS_NAV_INDEX ? { ...prev, index: null } : prev));
  };

  const clearFalkExpandIfNeeded = () => {
    if (isFalkPath(pathname)) return;
    setExpanding((prev) => (prev.index === FALK_NAV_INDEX ? { ...prev, index: null } : prev));
  };

  useEffect(() => {
    setAccountOpen(false);
    setReportsOpen(false);
    setFalkOpen(false);
    setOrdersOpen(false);

    setExpanding((prev) => {
      if (isAccountPath(pathname)) {
        return prev.index === ACCOUNT_NAV_INDEX ? prev : { index: ACCOUNT_NAV_INDEX, key: prev.key + 1 };
      }
      if (isReportsPath(pathname)) {
        return prev.index === REPORTS_NAV_INDEX ? prev : { index: REPORTS_NAV_INDEX, key: prev.key + 1 };
      }
      if (isFalkPath(pathname)) {
        return prev.index === FALK_NAV_INDEX ? prev : { index: FALK_NAV_INDEX, key: prev.key + 1 };
      }
      if (prev.index === ACCOUNT_NAV_INDEX || prev.index === REPORTS_NAV_INDEX || prev.index === FALK_NAV_INDEX) {
        return { index: HOME_NAV_INDEX, key: prev.key + 1 };
      }
      return prev;
    });
  }, [pathname]);

  return (
    <>
      <nav className="fixed bottom-0 left-1/2 z-50 w-full -translate-x-1/2 bg-[#f0f1f3cf] pt-3 pb-4 backdrop-blur-xl backdrop-saturate-150 sm:bottom-4 sm:w-[450px] sm:rounded-[40px]">
        <ul className="flex h-[52px] items-center">
          {MOBILE_NAV.map(({ label, icon: Icon, href, action }, i) => {
            const isActive =
              action === "account"
                ? isAccountPage
                : action === "reports"
                  ? isReportsPage
                  : action === "falk"
                    ? isFalkPage
                    : !isAccountPage && !isReportsPage && !isFalkPage && active === i;
            const itemClass = "group flex w-full cursor-pointer flex-col items-center justify-center gap-1";
            const expandKey = expanding.index === i ? expanding.key : 0;
            const isHighlighted = expanding.index === i || (isActive && expanding.index === null);
            const playExpand = () => {
              setExpanding((prev) => ({ index: i, key: prev.key + 1 }));
            };

            return (
              <li key={label} className="min-w-0 flex-1">
                {action === "account" ? (
                  <button
                    type="button"
                    onClick={() => {
                      playExpand();
                      setAccountOpen(true);
                    }}
                    className={`${itemClass} cursor-pointer`}
                  >
                    <MobileNavItem icon={Icon} label={label} isActive={isHighlighted} expandKey={expandKey} />
                  </button>
                ) : action === "reports" || action === "falk" ? (
                  <button
                    type="button"
                    onClick={() => {
                      playExpand();
                      if (isLoggedIn) {
                        setActive(i);
                        router.push(href);
                        return;
                      }
                      if (action === "reports") setReportsOpen(true);
                      else setFalkOpen(true);
                    }}
                    className={`${itemClass} cursor-pointer`}
                  >
                    <MobileNavItem icon={Icon} label={label} isActive={isHighlighted} expandKey={expandKey} />
                  </button>
                ) : (
                  <Link
                    href={href}
                    onClick={() => {
                      playExpand();
                      setActive(i);
                    }}
                    className={itemClass}
                  >
                    <MobileNavItem icon={Icon} label={label} isActive={isHighlighted} expandKey={expandKey} />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <Drawer
        open={accountOpen}
        onOpenChange={(open) => {
          setAccountOpen(open);
          if (!open) {
            setOrdersOpen(false);
            clearAccountExpandIfNeeded();
          }
        }}
        showSwipeHandle
      >
        <DrawerContent className="sm:w-[450px] sm:[--drawer-content-width:450px] sm:data-[swipe-axis=y]:inset-x-0 sm:mx-auto">
          <DrawerHeader className="text-right md:text-right">
            <DrawerTitle className="font-display text-[#002623]">حسابي</DrawerTitle>
            <DrawerDescription className="sr-only">روابط الحساب والتنقل</DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-1 p-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            {ACCOUNT_LINKS.map(({ label, href, icon: Icon, external, action, activatesAccount }) => {
              const itemClass = "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-[#002623] transition-colors hover:bg-[#428177]/10";

              if (action === "orders" && !isLoggedIn) {
                return (
                  <button key={label} type="button" onClick={() => setOrdersOpen(true)} className={`${itemClass} cursor-pointer`}>
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1 text-right text-base font-medium">{label}</span>
                    <ChevronLeft className="h-4 w-4 shrink-0 text-[#757575]" />
                  </button>
                );
              }

              return (
                <DrawerClose
                  key={label}
                  nativeButton={false}
                  render={
                    external ? (
                      <a href={href} target="_blank" rel="noreferrer" className={itemClass} />
                    ) : (
                      <Link
                        href={href}
                        className={itemClass}
                        onClick={() => {
                          if (activatesAccount) keepAccountExpand();
                        }}
                      />
                    )
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="flex-1 text-right text-base font-medium">{label}</span>
                  {external ? <ExternalLink className="h-4 w-4 shrink-0 text-[#757575]" /> : <ChevronLeft className="h-4 w-4 shrink-0 text-[#757575]" />}
                </DrawerClose>
              );
            })}

            {isLoggedIn ? (
              <DrawerClose
                nativeButton
                className="mt-1 flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-[#002623] transition-colors hover:bg-[#428177]/10"
                onClick={() => {
                  clearAuthCookies();
                  setIsLoggedIn(false);
                  router.refresh();
                  router.push("/");
                }}
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <span className="flex-1 text-right text-base font-medium">تسجيل الخروج</span>
                <ChevronLeft className="h-4 w-4 shrink-0 text-[#757575]" />
              </DrawerClose>
            ) : (
              <DrawerClose
                nativeButton={false}
                render={<Link href="/login" onClick={keepAccountExpand} className="mt-1 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-[#002623] transition-colors hover:bg-[#428177]/10" />}
              >
                <LogIn className="h-5 w-5 shrink-0" />
                <span className="flex-1 text-right text-base font-medium">تسجيل الدخول</span>
                <ChevronLeft className="h-4 w-4 shrink-0 text-[#757575]" />
              </DrawerClose>
            )}
          </div>

          <LoginRequiredDrawer
            open={ordersOpen}
            onOpenChange={setOrdersOpen}
            title="طلباتي"
            description="سجّل دخولك لعرض طلباتك."
            from="/orders"
            onBeforeNavigate={() => {
              keepAccountExpand();
              setAccountOpen(false);
            }}
          />
        </DrawerContent>
      </Drawer>

      <LoginRequiredDrawer
        open={reportsOpen}
        onOpenChange={(open) => {
          setReportsOpen(open);
          if (!open) clearReportsExpandIfNeeded();
        }}
        title="تقاريري"
        description="سجّل دخولك لعرض تقارير الفحص الخاصة بك."
        from="/reports"
      />

      <LoginRequiredDrawer
        open={falkOpen}
        onOpenChange={(open) => {
          setFalkOpen(open);
          if (!open) clearFalkExpandIfNeeded();
        }}
        title={FALK_TITLE}
        from="/falk"
      >
        <div className="space-y-3 px-4 pt-3 text-right text-[15px] leading-relaxed text-[#757575]">
          {FALK_PARAGRAPHS.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </LoginRequiredDrawer>
    </>
  );
}

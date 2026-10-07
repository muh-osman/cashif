"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Info, Loader2, SaudiRiyal, TrendingUp, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useFalkAccess } from "@/components/falk/falk-access-gate";
import { FalkCouponImages } from "@/components/falk/coupon-images";
import { FalkHowWorks } from "@/components/falk/how-works";
import { FalkInfoAboutCashif } from "@/components/falk/info-about-cashif";
import { FalkInstructions } from "@/components/falk/instructions";
import { FalkTermsContent } from "@/components/falk/terms-content";
import { FalkTop5UsersList } from "@/components/falk/top5-users-list";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

const MIN_WITHDRAWAL = 200;

const TABS = [
  { id: "info", label: "معلومات عن كاشف" },
  { id: "content", label: "المحتوى التسويقي" },
  { id: "how", label: "طريقة العمل" },
  { id: "instructions", label: "تعليمات قبل نشر المحتوى" },
];

function ProgressRing({ value }) {
  const size = 100;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(value, 0), 100);
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex h-[100px] w-[100px] items-center justify-center">
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E8EFED" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#174545"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <TrendingUp className="absolute h-8 w-8 text-[#174545]" />
    </div>
  );
}

export function FalkMarketerDashboard() {
  const router = useRouter();
  const { specialCode } = useFalkAccess();
  const [tab, setTab] = useState("info");
  const [marketer, setMarketer] = useState(null);
  const [settings, setSettings] = useState(null);
  const [monthlyBalance, setMonthlyBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [termsOpen, setTermsOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const [marketerRes, settingsRes, balanceRes] = await Promise.all([
          fetch("/api/falk/marketer", { cache: "no-store" }),
          fetch("/api/falk/settings", { cache: "no-store" }),
          fetch("/api/falk/monthly-balance", { cache: "no-store" }),
        ]);

        const settingsData = await settingsRes.json().catch(() => ({}));
        const balanceData = await balanceRes.json().catch(() => []);

        if (!cancelled && settingsRes.ok) {
          setSettings(Array.isArray(settingsData) ? settingsData[0] : settingsData);
        }

        let marketerData = null;

        if (marketerRes.ok) {
          marketerData = await marketerRes.json().catch(() => null);
        } else {
          const createRes = await fetch("/api/falk/marketer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ specialCode }),
            cache: "no-store",
          });

          if (!createRes.ok) {
            const createData = await createRes.json().catch(() => ({}));
            throw new Error(createData?.message || "تعذر إنشاء حساب المسوق");
          }

          const refreshed = await fetch("/api/falk/marketer", { cache: "no-store" });
          marketerData = await refreshed.json().catch(() => null);

          if (!refreshed.ok || !marketerData) {
            throw new Error("تعذر تحميل بيانات المسوق بعد الإنشاء");
          }
        }

        if (cancelled) return;

        setMarketer(marketerData);

        const userId = Number(marketerData?.clientId);
        const monthly = Array.isArray(balanceData)
          ? Math.trunc(balanceData.find((item) => Number(item.clientId) === userId)?.monthlyBalance || 0)
          : 0;
        setMonthlyBalance(monthly);
      } catch (err) {
        if (!cancelled) setError(err.message || "تعذر تحميل بيانات المسوق");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [specialCode]);

  const points = Math.trunc(marketer?.points || 0);
  const progress = (points / MIN_WITHDRAWAL) * 100;

  const handleWithdraw = () => {
    if (points >= MIN_WITHDRAWAL) {
      router.push("/falk/transfer");
      return;
    }
    toast.warning("الحد الأدنى لسحب الأرباح 200 ريال");
  };

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-6xl items-center justify-center px-4 pb-6 pt-4 sm:pb-36">
        <Loader2 className="h-10 w-10 animate-spin text-[#174545]" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-center sm:pb-36">
        <p className="text-[#757575]">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          فالك
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
        <p className="text-[#757575]">للتسويق بالعمولة</p>
      </div>

      <div className="mx-auto max-w-3xl space-y-5">
        <Card className="relative rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
          <CardContent className="space-y-5 p-6">
            <div className="absolute top-4 left-4">
              <button
                type="button"
                aria-label="الشروط والأحكام"
                onClick={() => setTermsOpen(true)}
                className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-[#174545] hover:bg-[#002623]/5"
              >
                <Info className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-start gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-[#174545]/10">
                <UserRound className="h-8 w-8 text-[#174545]" />
              </span>
              <div className="min-w-0 flex-1 pt-2 text-right">
                <h2 dir="ltr" className="truncate text-right text-xl font-semibold">
                  {marketer?.clientName || "—"}
                </h2>
                <p dir="ltr" className="mt-1 text-right text-sm text-[#757575]">
                  {marketer?.phoneNumber || "—"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-[#002623]/5 px-3 py-3 text-center">
                <p className="text-xs text-[#757575]">استخدام الكود</p>
                <p className="mt-1 text-lg font-semibold">{marketer?.cardCount || 0}</p>
              </div>
              <div className="rounded-2xl bg-[#002623]/5 px-3 py-3 text-center">
                <p className="text-xs text-[#757575]">الحالة</p>
                <p className={cn("mt-1 text-lg font-semibold", marketer?.isActive ? "text-[#25d366]" : "text-[#d32f2f]")}>
                  {marketer?.isActive ? "نشط" : "غير نشط"}
                </p>
              </div>
              <div className="rounded-2xl bg-[#002623]/5 px-3 py-3 text-center">
                <p className="text-xs text-[#757575]">كود التسويق</p>
                <p className="mt-1 text-lg font-semibold">{marketer?.code || "-"}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1 cursor-pointer rounded-4xl bg-[#174545] text-white hover:bg-[#174545]/90"
                onClick={handleWithdraw}
              >
                سحب الأرباح
              </Button>
              <Link
                href="/falk/history"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "flex-1 rounded-4xl border-[#174545]/30 text-[#174545]")}
              >
                السجل
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="overflow-hidden rounded-[40px] border-r-4 border-[#174545] bg-[linear-gradient(135deg,#cfe8e0_0%,#e8f0ee_50%,#f3ece2_100%)] shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
          <div className="space-y-5 bg-white/40 p-5 backdrop-blur-xl sm:p-8">
            <div className="flex items-start justify-between gap-4 sm:gap-16">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-[#174545]">الرصيد الحالي</h2>
                <div className="mt-2 flex items-center gap-1.5 font-display text-4xl text-[#174545] sm:text-5xl">
                  <span>{points.toLocaleString("en-US")}</span>
                  <SaudiRiyal className="h-7 w-7 shrink-0" />
                </div>
                <p className="mt-2 flex items-center gap-1 text-sm text-[#00000099]">
                  <span>الرصيد الشهري:</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#174545]">
                    {monthlyBalance.toLocaleString("en-US")}
                    <SaudiRiyal className="h-4 w-4 shrink-0" />
                  </span>
                </p>
              </div>
              <ProgressRing value={progress} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#17454517] bg-white/45 px-4 py-3 text-center">
                <p className="text-xs text-[#00000099]">نسبة العمولة</p>
                <p className="mt-1 text-lg font-semibold text-[#174545]">{settings?.marketerCommissionPercentage || 0}%</p>
              </div>
              <div className="rounded-2xl border border-[#17454517] bg-white/45 px-4 py-3 text-center">
                <p className="text-xs text-[#00000099]">نسبة الخصم</p>
                <p className="mt-1 text-lg font-semibold text-[#174545]">{settings?.codeDiscountPercentage || 0}%</p>
              </div>
            </div>
          </div>
        </div>

        <FalkTop5UsersList />

        <div>
          <h2 className="mb-3 text-base font-semibold text-[#002623]">حقيبة المسوق</h2>
          <div className="mb-4 h-px bg-[#002623]/10" />

          <div className="relative mb-4 overflow-hidden rounded-[24px] bg-white shadow-[0_7px_29px_0_rgba(100,100,111,0.12)]">
            <span
              className={cn(
                "pointer-events-none absolute inset-y-0 right-0 w-1/4 rounded-[24px] border-4 border-white bg-[#f0f1f3] transition-transform duration-300 ease-out",
                tab === "content" && "-translate-x-full",
                tab === "how" && "-translate-x-[200%]",
                tab === "instructions" && "-translate-x-[300%]"
              )}
            />
            <div className="relative z-10 grid grid-cols-4">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className="cursor-pointer px-1 py-3 text-center text-[11px] font-medium leading-4 text-[#174545] sm:text-sm sm:leading-5"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {tab === "info" ? <FalkInfoAboutCashif /> : null}
          {tab === "content" ? (
            <FalkCouponImages
              code={marketer?.code || "-"}
              percent={settings?.codeDiscountPercentage || 0}
            />
          ) : null}
          {tab === "how" ? <FalkHowWorks /> : null}
          {tab === "instructions" ? <FalkInstructions /> : null}
        </div>
      </div>

      <Drawer open={termsOpen} onOpenChange={setTermsOpen} showSwipeHandle>
        <DrawerContent className="sm:mx-auto sm:w-[450px] sm:[--drawer-content-width:450px] sm:data-[swipe-axis=y]:inset-x-0">
          <DrawerHeader className="text-right md:text-right">
            <DrawerTitle className="font-display text-[#002623]">الشروط والأحكام</DrawerTitle>
            <DrawerDescription className="sr-only">الشروط والأحكام</DrawerDescription>
          </DrawerHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-4">
            <FalkTermsContent />
          </div>

          <DrawerFooter className="pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <Button
              className="w-full cursor-pointer rounded-4xl bg-[#174545] text-white hover:bg-[#174545]/90"
              onClick={() => setTermsOpen(false)}
            >
              إغلاق
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </main>
  );
}

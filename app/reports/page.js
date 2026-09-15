"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Award,
  CalendarDays,
  Car,
  ClipboardList,
  CreditCard,
  ChevronDown,
  Download,
  Hash,
  Hourglass,
  Images,
  Info,
  Loader2,
  Shield,
  Tag,
  TriangleAlert,
  Truck,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const RANK_ROWS = [
  { name: "برونزي", min: 1, max: 100, percent: 5, color: "#E69546" },
  { name: "فضي", min: 101, max: 250, percent: 6, color: "#D4D4D4" },
  { name: "ذهبي", min: 251, max: 500, percent: 7, color: "#FFDF00" },
  { name: "بلاتيني", min: 501, max: 850, percent: 8, color: "#E5E4E2" },
  { name: "نخبة", min: 851, max: 100000, percent: 10, color: "#000000" },
];

const LEVEL_REQUIREMENTS = {
  إفتراضي: 0,
  برونزي: 1,
  فضي: 101,
  ذهبي: 251,
  بلاتيني: 501,
  نخبة: 851,
};

const LEVELS = ["إفتراضي", "برونزي", "فضي", "ذهبي", "بلاتيني", "نخبة"];

function formatDate(dateString) {
  if (!dateString) return "—";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}/${month}/${day}`;
}

function getClientColor(clientTypeAr) {
  switch (clientTypeAr) {
    case "برونزي":
      return "#CD7F32";
    case "فضي":
      return "#B8B8B8";
    case "ذهبي":
      return "#E6C200";
    case "بلاتيني":
      return "#BDBDBD";
    case "نخبة":
      return "#000000";
    default:
      return "#174545";
  }
}

function getNextLevel(currentLevel) {
  const currentIndex = LEVELS.indexOf(currentLevel);
  return currentIndex >= 0 && currentIndex < LEVELS.length - 1 ? LEVELS[currentIndex + 1] : null;
}

function calculateProgressValue(pointsData) {
  if (!pointsData) return 0;

  const currentPoints = (pointsData.points || 0) + (pointsData.pointsConsumed || 0);
  const currentLevel = pointsData.clientTypeAr || "إفتراضي";
  const nextLevel = getNextLevel(currentLevel);
  const nextLevelPoints = nextLevel ? LEVEL_REQUIREMENTS[nextLevel] : LEVEL_REQUIREMENTS["نخبة"];

  if (!nextLevel) return 100;

  return Math.min(Math.round((Math.max(currentPoints, 0) / nextLevelPoints) * 100), 100);
}

const DEFAULT_CARD_IMAGE = "/images/reports/card-image.jpg";
const GITHUB_LOGO_BASE =
  "https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/thumb";
const GITHUB_LOCAL_LOGO_BASE =
  "https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/local-logos";
const LOGO_SLUG_ALIASES = {
  mercedes: "mercedes-benz",
  vw: "volkswagen",
  chevy: "chevrolet",
  gwm: "great-wall",
  "ssang-yong": "ssangyong",
  amg: "mercedes-amg",
  li: "li-auto",
  "range-rover": "land-rover",
};

function makeLogoSlug(nameEn) {
  const slug = nameEn
    ?.trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug) return null;
  return LOGO_SLUG_ALIASES[slug] || slug;
}

function makeLogoSrc(nameEn) {
  const slug = makeLogoSlug(nameEn);
  return slug ? `${GITHUB_LOGO_BASE}/${slug}.png` : null;
}

function makeLocalLogoSrc(nameEn) {
  const slug = makeLogoSlug(nameEn);
  return slug ? `${GITHUB_LOCAL_LOGO_BASE}/${slug}.png` : null;
}

function CardMakeImage({ nameEn, carImageUrl }) {
  const logoSrc = makeLogoSrc(nameEn);
  const localLogoSrc = makeLocalLogoSrc(nameEn);
  const photoSrc = carImageUrl || DEFAULT_CARD_IMAGE;

  return (
    <img
      src={logoSrc || photoSrc}
      alt={logoSrc ? nameEn.trim() : ""}
      data-step={logoSrc ? "logo" : "photo"}
      className="w-full max-w-[220px] object-contain"
      onError={(event) => {
        const img = event.currentTarget;

        if (img.dataset.step === "logo") {
          img.dataset.step = localLogoSrc ? "local-logo" : "photo";
          if (!localLogoSrc) img.alt = "";
          img.src = localLogoSrc || photoSrc;
          return;
        }

        if (img.dataset.step === "local-logo") {
          img.dataset.step = "photo";
          img.alt = "";
          img.src = photoSrc;
          return;
        }

        img.onerror = null;
        if (img.dataset.step !== "default") {
          img.dataset.step = "default";
          img.src = DEFAULT_CARD_IMAGE;
        }
      }}
    />
  );
}

function PointsCardSkeleton() {
  return (
    <div aria-hidden>
      <div className="flex items-center justify-between gap-4 sm:gap-16">
        <div className="min-w-0 flex-1">
          <Skeleton className="h-7 w-28 bg-[#174545]/15" />
          <Skeleton className="mt-1 h-5 w-44 bg-[#174545]/15" />
          <Skeleton className="mt-2 h-9 w-32 bg-[#174545]/15 sm:h-12 sm:w-40" />
        </div>
        <Skeleton className="size-[148px] shrink-0 rounded-full bg-[#174545]/15" />
      </div>
      <div className="mt-4 hidden space-y-2 md:block">
        <Skeleton className="h-9 w-full rounded-lg bg-[#174545]/15" />
        <Skeleton className="mx-auto h-[18px] w-48 bg-[#174545]/15" />
      </div>
    </div>
  );
}

function RankRing({ value, color, children }) {
  const size = 148;
  const stroke = 15;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(Math.max(value, 0), 100) / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E8EFED" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

const ICON_SHAPES = {
  circle: {
    viewBox: "0 0 63 63",
    d: "M63 31.5C63 14.103 48.897 0 31.5 0C14.103 0 0 14.103 0 31.5C0 48.897 14.103 63 31.5 63C48.897 63 63 48.897 63 31.5Z",
  },
  clover: {
    viewBox: "0 0 62 62",
    d: "M7.78628 54.2125C-2.59542 43.8291 -2.59542 26.9941 7.78628 16.6107L16.6114 7.78754C26.9931 -2.59584 43.8287 -2.59584 54.2137 7.78754C64.5954 18.1709 64.5954 35.0059 54.2137 45.3893L45.3886 54.2125C35.0069 64.5958 18.1713 64.5958 7.78628 54.2125Z",
  },
  square: {
    viewBox: "0 0 59 59",
    d: "M1.3077 21.3393C-4.19593 8.66644 8.66702 -4.19605 21.3396 1.30784L23.4364 2.21791C27.3032 3.89848 31.6966 3.89848 35.5666 2.21791L37.6602 1.30784C50.3359 -4.19605 63.1957 8.66644 57.6921 21.3393L56.7817 23.4344C55.1036 27.3037 55.1036 31.6964 56.7817 35.5654L57.6921 37.6609C63.1957 50.3337 50.3359 63.1962 37.6602 57.692L35.5666 56.782C31.6966 55.1017 27.3032 55.1017 23.4364 56.782L21.3396 57.692C8.66702 63.1962 -4.19593 50.3337 1.3077 37.6609L2.21809 35.5654C3.89932 31.6964 3.89932 27.3037 2.21809 23.4344L1.3077 21.3393Z",
  },
  hex: {
    viewBox: "0 0 40 40",
    d: "M16.78 1.1c1.9-1.46 4.54-1.46 6.44 0l4.76 3.66c0.37 0.28 0.77 0.52 1.2 0.7l5.56 2.3c2.2 0.91 3.53 3.2 3.21 5.58l-0.78 5.97c-0.06 0.46-0.06 0.92 0 1.38l0.78 5.97c0.32 2.38-1 4.67-3.21 5.58l-5.56 2.3c-0.43 0.18-0.83 0.42-1.2 0.7l-4.76 3.67c-1.9 1.45-4.54 1.45-6.44 0l-4.76-3.67c-0.37-0.28-0.77-0.52-1.2-0.7l-5.56-2.3c-2.2-0.91-3.53-3.2-3.21-5.58l0.78-5.97c0.06-0.46 0.06-0.92 0-1.38l-0.78-5.97c-0.32-2.38 1-4.67 3.21-5.58l5.56-2.3c0.43-0.18 0.83-0.42 1.2-0.7l4.76-3.67Z",
  },
};

function ServiceIconShape({ shape, className }) {
  const iconShape = ICON_SHAPES[shape] ?? ICON_SHAPES.circle;

  return (
    <svg viewBox={iconShape.viewBox} className={cn("absolute inset-0 size-full", className)} aria-hidden>
      <path d={iconShape.d} fill="currentColor" />
    </svg>
  );
}

function ServiceIconBtn({ icon: Icon, caption, label, onClick, disabled, iconClassName, iconColor, iconShape = "circle" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-full min-h-[128px] w-full cursor-pointer flex-col items-start rounded-[22px] bg-[#F2F2F7] px-[18px] py-5 text-start transition-colors hover:bg-[#EAEAF0] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="relative flex size-11 shrink-0 items-center justify-center">
        <ServiceIconShape shape={iconShape} className={iconColor} />
        {disabled ? (
          <Loader2 className="relative z-10 size-[22px] animate-spin text-white" />
        ) : (
          <Icon className={cn("relative z-10 size-[22px] text-white", iconClassName)} strokeWidth={2.25} />
        )}
      </span>
      {caption ? <span className="mt-3.5 text-[13px] leading-none text-[#8e8e93]">{caption}</span> : null}
      <span className={cn("text-[16px] font-bold leading-tight tracking-tight text-[#1d1d1f]", caption ? "mt-1" : "mt-3.5")}>
        {label}
      </span>
    </button>
  );
}

function SpecRow({ icon: Icon, label, value, last, iconClassName }) {
  return (
    <div className={cn("flex items-center justify-between gap-2 px-3.5 py-2.5", !last && "border-b border-[#002623]/8")}>
      <div className="flex min-w-0 items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#002623]/5 text-[#757575]">
          <Icon className={cn("h-4 w-4", iconClassName)} />
        </span>
        <span className="text-[13px] font-semibold text-[#002623]">{label}</span>
      </div>
      <span className="max-w-[55%] truncate text-left text-[13px] text-[#757575]" dir="auto">
        {value || "—"}
      </span>
    </div>
  );
}

function getMojazStatus(status) {
  if (status === "ready") return { label: "جاهز للتحميل", className: "bg-[#e1f5ee] text-[#174545]" };
  if (status === "paid" || status === "processing") return { label: "جاري المعالجة", className: "bg-[#fff7ed] text-[#9a3412]" };
  return { label: "فشل", className: "bg-[#fce8e8] text-[#be1e2d]" };
}

function toList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export default function ReportsPage() {
  const router = useRouter();
  const [tab, setTab] = useState("cashif");
  const [pointsExpanded, setPointsExpanded] = useState(false);
  const [ranksOpen, setRanksOpen] = useState(false);

  const [points, setPoints] = useState(null);
  const [cards, setCards] = useState([]);
  const [mojaz, setMojaz] = useState([]);
  const [videoStatus, setVideoStatus] = useState({});

  const [loadingPoints, setLoadingPoints] = useState(true);
  const [loadingCards, setLoadingCards] = useState(true);
  const [loadingMojaz, setLoadingMojaz] = useState(true);
  const [cardsError, setCardsError] = useState("");
  const [mojazError, setMojazError] = useState("");
  const [loadingDownload, setLoadingDownload] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "1") setTab("mojaz");
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadPoints() {
      try {
        const response = await fetch("/api/reports/points", { cache: "no-store" });
        const data = await response.json().catch(() => ({}));
        if (!cancelled && response.ok) setPoints(data);
      } catch {
        // Points are optional; the reports list can still render.
      } finally {
        if (!cancelled) setLoadingPoints(false);
      }
    }

    async function loadCards() {
      setLoadingCards(true);
      setCardsError("");
      try {
        const response = await fetch("/api/reports/cards", { cache: "no-store" });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "تعذر تحميل التقارير");
        if (!cancelled) setCards(toList(data));
      } catch (error) {
        if (!cancelled) {
          setCards([]);
          setCardsError(error.message || "تعذر تحميل التقارير");
        }
      } finally {
        if (!cancelled) setLoadingCards(false);
      }
    }

    async function loadMojaz() {
      setLoadingMojaz(true);
      setMojazError("");
      try {
        const response = await fetch("/api/reports/mojaz", { cache: "no-store" });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "تعذر تحميل تقارير موجز");
        if (!cancelled) setMojaz(toList(data));
      } catch (error) {
        if (!cancelled) {
          setMojaz([]);
          setMojazError(error.message || "تعذر تحميل تقارير موجز");
        }
      } finally {
        if (!cancelled) setLoadingMojaz(false);
      }
    }

    loadPoints();
    loadCards();
    loadMojaz();

    return () => {
      cancelled = true;
    };
  }, []);

  const completedCards = useMemo(
    () =>
      cards
        .filter((card) => card.cardStatus === 5)
        .slice()
        .reverse(),
    [cards]
  );

  useEffect(() => {
    if (completedCards.length === 0) return;

    let cancelled = false;
    const cardNumbers = completedCards.map((card) => card.cardNumber);

    async function checkVideos() {
      try {
        const response = await fetch("/api/reports/videos/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ card_ids: cardNumbers }),
        });
        const data = await response.json().catch(() => ({}));
        if (!cancelled && response.ok) setVideoStatus(data?.data || {});
      } catch {
        // Video buttons stay hidden if the check fails.
      }
    }

    checkVideos();
    return () => {
      cancelled = true;
    };
  }, [completedCards]);

  const cardIdsWithMojazReport = useMemo(
    () =>
      new Set(
        mojaz
          .map((report) => report.main_report_number)
          .filter((value) => value !== null && value !== undefined)
          .map(Number)
      ),
    [mojaz]
  );

  const rankColor = getClientColor(points?.clientTypeAr);

  function handleTabChange(next) {
    if (next === tab) return;
    setTab(next);
    router.replace(next === "mojaz" ? "/reports?tab=1" : "/reports", { scroll: false });
  }

  async function handleDownloadCard(id, includeImage) {
    try {
      setLoadingDownload((prev) => ({ ...prev, [id]: true }));
      const query = includeImage ? "?images=1" : "";
      const response = await fetch(`/api/reports/cards/${id}/pdf${query}`);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "تعذر تحميل التقرير");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `card_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.open(blobUrl, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 5000);
    } catch (error) {
      toast.error(error.message || "تعذر تحميل التقرير");
    } finally {
      setLoadingDownload((prev) => ({ ...prev, [id]: false }));
    }
  }

  function handleInsurance(cardNumber) {
    const message = `*أرغب بنقل ملكية السيارة - كاشف*\n[رقم التقرير: ${cardNumber}]`;
    window.open(`https://wa.me/966548682102?text=${encodeURIComponent(message)}`, "_blank");
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          تقاريري
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
        <p className="text-[#757575]">تقارير فحص السيارات الخاصة بك</p>
      </div>

      <div className="mb-8 flex justify-center">
        <div
          className="relative w-full max-w-[670px] overflow-hidden rounded-[40px] border-r-4 border-[#174545] bg-[linear-gradient(135deg,#cfe8e0_0%,#e8f0ee_50%,#f3ece2_100%)] shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]"
          aria-busy={loadingPoints}
        >
          <div className="bg-white/40 p-5 backdrop-blur-xl sm:p-8">
            {loadingPoints ? (
              <PointsCardSkeleton />
            ) : (
              <>
                <div className="flex items-center justify-between gap-4 sm:gap-16">
                  <div>
                    <h2 className="text-lg font-semibold text-[#174545]">رصيد النقاط</h2>
                    <p className="text-sm text-[#00000099]">كل نقطة تساوي ريال واحد</p>
                    <p className="mt-2 font-display text-4xl text-[#174545] sm:text-5xl">
                      {(points?.points || 0).toLocaleString("en-US")}
                      <span className="mr-1.5 font-sans text-sm text-[#00000099]">نقطة</span>
                    </p>
                  </div>
                  <RankRing value={calculateProgressValue(points)} color={rankColor}>
                    <p className="text-sm font-semibold" style={{ color: rankColor }}>
                      الرتبة
                    </p>
                    <p className="text-base font-bold" style={{ color: rankColor }}>
                      {points?.clientTypeAr || "—"}
                    </p>
                  </RankRing>
                </div>

                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out md:grid-rows-[1fr]",
                    pointsExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div
                      className={cn(
                        "mt-4 space-y-2 transition-opacity duration-300 ease-out md:opacity-100",
                        pointsExpanded ? "opacity-100" : "opacity-0"
                      )}
                    >
                      <p title="جميع النقاط التي تم استخدامها من حسابك" className="rounded-lg border border-[#17454517] bg-white/45 px-3 py-1.5 text-center text-sm font-semibold text-[#174545]">
                        مجموع النقاط المستخدمة {points?.pointsConsumed ?? 0}
                      </p>
                      <p className="text-center text-[13px] text-[#00000099]">تستبدال النقاط في صفحة الدفع</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setRanksOpen(true)}
            className="absolute top-2 left-2 cursor-pointer rounded-full p-2 text-[#174545] transition-colors hover:bg-white/50"
            aria-label="فئات العملاء"
          >
            <Info className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setPointsExpanded(true)}
            className={cn(
              "absolute bottom-1 left-1/2 -translate-x-1/2 cursor-pointer rounded-full p-1 text-[#174545] transition-opacity duration-300 ease-out md:hidden",
              loadingPoints || pointsExpanded ? "pointer-events-none opacity-0" : "opacity-100"
            )}
            aria-label="عرض تفاصيل النقاط"
            aria-expanded={pointsExpanded}
            tabIndex={loadingPoints || pointsExpanded ? -1 : undefined}
          >
            <ChevronDown className="h-6 w-6" />
          </button>
        </div>
      </div>

      <Drawer open={ranksOpen} onOpenChange={setRanksOpen} showSwipeHandle>
        <DrawerContent
          dir="rtl"
          className="sm:max-w-3xl sm:[--drawer-content-width:48rem] sm:data-[swipe-axis=y]:inset-x-0 sm:mx-auto"
        >
          <DrawerHeader className="text-right md:text-right">
            <DrawerTitle className="font-display text-xl text-[#002623]">فئات العملاء</DrawerTitle>
            <DrawerDescription className="text-[#757575]">نسب النقاط حسب رتبة العميل</DrawerDescription>
          </DrawerHeader>
          <div className="min-h-0 flex-1 overflow-auto p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="overflow-x-auto rounded-[24px] ring-1 ring-[#002623]/10">
              <table className="w-full min-w-[520px] text-center text-sm">
                <thead className="bg-[#002623] text-white">
                  <tr>
                    <th className="px-3 py-3 font-medium">الرتبة</th>
                    <th className="px-3 py-3 font-medium">الحد الأدنى للنقاط</th>
                    <th className="px-3 py-3 font-medium">الحد الأعلى للنقاط</th>
                    <th className="px-3 py-3 font-medium">نسبة النقاط</th>
                  </tr>
                </thead>
                <tbody>
                  {RANK_ROWS.map((row, index) => (
                    <tr key={row.name} className={index % 2 === 0 ? "bg-[#f7f8f8]" : "bg-white"}>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-1.5 font-medium text-[#002623]">
                          {row.name}
                          <Award className="h-4 w-4" style={{ color: row.color }} />
                        </span>
                      </td>
                      <td className="px-3 py-3 text-[#757575]">{row.min}</td>
                      <td className="px-3 py-3 text-[#757575]">{row.max}</td>
                      <td className="px-3 py-3 text-[#757575]">{row.percent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <h2 className="mb-3 text-base font-semibold text-[#002623]">تقاريري</h2>
      <div className="mb-4 h-px bg-[#002623]/10" />

      <div className="relative mb-4 overflow-hidden rounded-[24px] bg-white shadow-[0_7px_29px_0_rgba(100,100,111,0.12)]">
        <span
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 w-1/2 rounded-[24px] border-4 border-white bg-[#f0f1f3] transition-transform duration-300 ease-out",
            tab === "mojaz" && "-translate-x-full"
          )}
        />
        <div className="relative z-10 grid grid-cols-2">
          <button
            type="button"
            onClick={() => handleTabChange("cashif")}
            className="cursor-pointer py-3 text-sm font-medium text-[#174545]"
          >
            كاشف
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("mojaz")}
            className="cursor-pointer py-3 text-sm font-medium text-[#174545]"
          >
            موجز
          </button>
        </div>
      </div>

      {tab === "cashif" ? (
        <CashifReports
          loading={loadingCards}
          error={cardsError}
          cards={completedCards}
          videoStatus={videoStatus}
          cardIdsWithMojazReport={cardIdsWithMojazReport}
          loadingDownload={loadingDownload}
          onDownload={handleDownloadCard}
          onInsurance={handleInsurance}
          onNavigate={(href) => router.push(href)}
        />
      ) : (
        <MojazReports loading={loadingMojaz} error={mojazError} reports={mojaz} />
      )}
    </main>
  );
}

function PostInspectionServices({ hasVideo, canAskMojaz, cardId, cardNumber, defaultOpen = false, onNavigate, onInsurance }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <Button
        type="button"
        size="lg"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="w-full cursor-pointer rounded-full bg-[#f0f1f3] px-8 py-2 text-[#174545] hover:bg-[#e6e8eb]"
      >
        خدمات ما بعد الفحص
        <ChevronDown className={cn("transition-transform duration-300 ease-out", open && "rotate-180")} />
      </Button>
      <div className={cn("grid transition-[grid-template-rows] duration-300 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="min-h-0 overflow-hidden">
          <div
            className={cn(
              "flex flex-wrap justify-center gap-2.5 pt-3.5 transition-opacity duration-300 ease-out",
              open ? "opacity-100" : "opacity-0"
            )}
          >
            {hasVideo ? (
              <div className="flex w-[calc(50%-5px)] sm:w-[calc(25%-8px)]">
                <ServiceIconBtn
                  icon={Video}
                  caption="تسجيل"
                  label="فيديو"
                  iconColor="text-[#34C759]"
                  iconShape="circle"
                  onClick={() => onNavigate(`/videos/${cardNumber}`)}
                />
              </div>
            ) : null}
            <div className="flex w-[calc(50%-5px)] sm:w-[calc(25%-8px)]">
              <ServiceIconBtn
                icon={Shield}
                caption="خدمة"
                label="تأمين ونقل ملكية"
                iconColor="text-[#174545]"
                iconShape="square"
                onClick={() => onInsurance(cardNumber)}
              />
            </div>
            <div className="flex w-[calc(50%-5px)] sm:w-[calc(25%-8px)]">
              <ServiceIconBtn
                icon={Truck}
                caption="توصيل"
                label="شحن السيارة"
                iconColor="text-[#E8C44A]"
                iconShape="clover"
                iconClassName="-scale-x-100"
                onClick={() => onNavigate(`/shipping/${cardId}`)}
              />
            </div>
            <div className="flex w-[calc(50%-5px)] sm:w-[calc(25%-8px)]">
              <ServiceIconBtn
                icon={Tag}
                caption="شركاء"
                label="عروض الشركات"
                iconColor="text-[#00999d]"
                iconShape="hex"
                onClick={() => onNavigate("/partners")}
              />
            </div>
            {canAskMojaz ? (
              <div className="flex w-[calc(50%-5px)] sm:w-[calc(25%-8px)]">
                <ServiceIconBtn
                  icon={ClipboardList}
                  caption="تقرير"
                  label="طلب تقرير موجز"
                  iconColor="text-[#FF3B30]"
                  iconShape="circle"
                  onClick={() => onNavigate(`/ask-mojaz-report/${cardId}`)}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function CashifReports({ loading, error, cards, videoStatus, cardIdsWithMojazReport, loadingDownload, onDownload, onInsurance, onNavigate }) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-9 w-9 animate-spin text-[#174545]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-lg items-start gap-3 rounded-[28px] bg-[#fff7ed] px-4 py-4 text-[#9a3412] shadow-[0_7px_29px_0_rgba(100,100,111,0.12)]">
        <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <Card className="mx-auto max-w-lg rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
        <CardContent className="flex flex-col items-center gap-5 py-6 text-center">
          <ClipboardList className="h-10 w-10 text-[#174545]" />
          <div className="space-y-2">
            <p className="text-lg font-semibold text-[#002623]">لا يوجد تقارير</p>
            <p className="text-sm leading-relaxed text-[#757575]">بعد اكتمال فحص سيارتك سيظهر التقرير هنا لتحميله والاستفادة من خدمات ما بعد الفحص.</p>
          </div>
          <Link
            href="/prices"
            className={cn(buttonVariants({ variant: "default", size: "lg" }), "cursor-pointer rounded-full bg-[#002623] px-8 py-2 text-white hover:bg-[#1a292e]")}
          >
            احجز الآن
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {cards.map((card, index) => {
        const specs = [
          { icon: Car, label: "الشركة", value: card.carManufacturerNameAr, iconClassName: "-scale-x-100" },
          { icon: Tag, label: "الفئة", value: card.carModelNameAr },
          { icon: ClipboardList, label: "نوع الفحص", value: card.servicesListNameAr?.join(", ") },
          { icon: CreditCard, label: "رقم الفحص", value: card.cardNumber },
          { icon: CalendarDays, label: "تاريخ الفحص", value: formatDate(card.createdDate) },
        ];
        const hasVideo = videoStatus?.[String(card.cardNumber)] === true;
        const canAskMojaz = !cardIdsWithMojazReport.has(card.id);

        return (
          <Card
            key={card.cardNumber}
            size="sm"
            className="relative w-full max-w-[670px] rounded-[40px] border-none pt-0 shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]"
          >
            {card.includeImage ? (
              <span title="تقرير مصور" className="absolute top-4 left-4 z-10 text-[#174545]">
                <Images className="h-5 w-5" />
              </span>
            ) : null}

            <CardContent className="space-y-5 pt-5">
              <div dir="ltr" className="grid items-center gap-4 sm:grid-cols-2 sm:gap-0">
                <div className="flex flex-col items-center justify-center gap-3">
                  <CardMakeImage nameEn={card.carManufacturerNameEn} carImageUrl={card.carImageUrl} />
                  <Button
                    size="lg"
                    dir="ltr"
                    disabled={loadingDownload[card.id]}
                    onClick={() => onDownload(card.id, card.includeImage)}
                    className="cursor-pointer rounded-full bg-[#002623] px-8 py-2 text-white hover:bg-[#1a292e]"
                  >
                    {loadingDownload[card.id] ? <Loader2 className="animate-spin" /> : <Download />}
                    تحميل التقرير
                  </Button>
                </div>

                <div dir="rtl" className="overflow-hidden rounded-xl border border-[#002623]/10">
                  {specs.map((row, index) => (
                    <SpecRow key={row.label} icon={row.icon} label={row.label} value={row.value} last={index === specs.length - 1} iconClassName={row.iconClassName} />
                  ))}
                </div>
              </div>

              <PostInspectionServices
                hasVideo={hasVideo}
                canAskMojaz={canAskMojaz}
                cardId={card.id}
                cardNumber={card.cardNumber}
                defaultOpen={index === 0}
                onNavigate={onNavigate}
                onInsurance={onInsurance}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function MojazReports({ loading, error, reports }) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-9 w-9 animate-spin text-[#174545]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-lg items-start gap-3 rounded-[28px] bg-[#fff7ed] px-4 py-4 text-[#9a3412] shadow-[0_7px_29px_0_rgba(100,100,111,0.12)]">
        <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <Card className="mx-auto max-w-lg rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
        <CardContent className="flex flex-col items-center gap-5 py-6 text-center">
          <ClipboardList className="h-10 w-10 text-[#174545]" />
          <div className="space-y-2">
            <p className="text-lg font-semibold text-[#002623]">لا يوجد تقارير</p>
            <p className="text-sm leading-relaxed text-[#757575]">تقارير موجز ستظهر هنا عند جاهزيتها</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {reports.map((report) => {
        const status = getMojazStatus(report.status);

        return (
          <Card key={report.id} size="sm" className="relative w-full rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)] sm:max-w-[329px]">
            <div className="absolute top-4 left-4 h-12 w-12 overflow-hidden rounded-md">
              <Image src="/images/reports/mojaz-logo.webp" alt="موجز" width={48} height={48} className="h-full w-full object-cover" />
            </div>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Hourglass className="h-4 w-4 text-[#002623]/80" />
                <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", status.className)}>{status.label}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#002623]">
                <ClipboardList className="h-4 w-4 text-[#002623]/80" />
                {report.lookup_type === "sequence" ? "الرقم التسلسلي" : "رقم الهيكل"}
              </div>
              <div className="flex items-center gap-2 text-sm text-[#002623]">
                <Hash className="h-4 w-4 text-[#002623]/80" />
                {report.lookup_value}
              </div>
              <div className="flex items-center gap-2 text-sm text-[#002623]">
                <CalendarDays className="h-4 w-4 text-[#002623]/80" />
                {formatDate(report.created_at)}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                size="lg"
                disabled={report.status !== "ready"}
                onClick={() => window.open(report.pdf_url, "_blank", "noopener,noreferrer")}
                className="w-full cursor-pointer rounded-full bg-[#002623] text-white hover:bg-[#1a292e]"
              >
                عرض التقرير
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

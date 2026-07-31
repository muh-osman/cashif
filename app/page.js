"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CarModelSearch } from "@/components/car-model-search";
import {
  Menu,
  LogIn,
  LogOut,
  Bookmark,
  ShoppingCart,
  MapPin,
  ExternalLink,
  Gift,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Star,
  Car,
  Wrench,
  Award,
  Calendar,
  Tag,
  Home as HomeIcon,
  FileText,
  Phone,
  Search,
  SaudiRiyal,
  UserRound,
  Handshake,
} from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bubble, BubbleContent, BubbleReactions } from "@/components/ui/bubble";

/* -------------------------------------------------------------------------- */
/*  DATA                                                                      */
/* -------------------------------------------------------------------------- */

const BRANCHES = [
  { name: "الرياض - القادسية", href: "https://maps.app.goo.gl/MiFGsgakfo62on7u8" },
  { name: "الرياض - الشفا", href: "https://maps.app.goo.gl/pXCnG7RPXJ2CDLqe7?g_st=aw" },
  { name: "القصيم", href: "https://maps.app.goo.gl/Gd7g3VScomNQP8DR7" },
  { name: "الدمام", href: "https://maps.app.goo.gl/9UiHq4kW7Mjh1Aik8" },
  { name: "جدة", href: "https://maps.app.goo.gl/697yXkaS4o6kYsos8" },
  { name: "خميس مشيط", href: "#" },
];

const CAROUSEL_SLIDES = Array.from({ length: 10 }, (_, i) => {
  const n = i + 50;
  return {
    desktop: `/images/desktop/${n}.jpg`,
    mobile: `/images/mobile/${n}.jpg`,
    alt: `Cashif Carousel ${n}`,
  };
});

const SERVICES = [
  {
    id: "inspection-before-buying",
    number: 1,
    title: "فحص الشراء",
    description: "فحص جميع أجزاء المركبة المستعملة لمعرفة واكتشاف الأعطال والعيوب قبل اتخاذ قرار الشراء.",
    points: ["فحص اجزاء السيارة", "تجربة السيارة ميدانًيا", "تقرير مفصل عن حالة السيارة", "نقاط ومكافئات"],
    cta: "plans/purchase-inspection",
  },
  {
    id: "makhdoom",
    number: 2,
    title: "خدمة مخدوم",
    description: (
      <>
        في حال وجدت سيارة للبيع في <u>الرياض، جدة، الدمام، القصيم أو خميس مشيط</u> وأنت خارج هذه المدن، مركز كاشف يقوم بفحص شامل ودقيق للسيارة، مع تسهيل إجراءات نقل الملكية
        والتأمين وشحن السيارة إلى مدينتك.
      </>
    ),
    points: [
      "حضور مالك السيارة لأحد فروع كاشف",
      "فحص دقيق للسيارة مع تسجيل مرئي وشرح التقرير بمقطع فيديو مسجل",
      <>
        تحميل تقرير الفحص عبر{" "}
        <Link href="reports" className="underline">
          موقعنا
        </Link>
      </>,
      "إتمام نقل الملكية والتأمين وشحن السيارة",
    ],
    cta: "makdom",
  },
  {
    id: "passnger-check",
    number: 3,
    title: "فحص المسافر",
    description: (
      <>
        فحص مخصص <u>قبل السفر</u> للتأكد من سلامة السيارة على الطريق، يشمل أهم الفحوصات التي تضمن رحلة آمنة ومريحة.
      </>
    ),
    points: ["فحص الزيوت والسوائل", "فحص الكفرات والفرامل والأنوار", "فحص أدوات السلامة والمساحات", "تجربة السيارة على الطريق"],
    cta: "plans/passenger-check",
  },
];

const STAGES = [
  { img: "/images/x1.png", label: "تسجيل بيانات المركبة" },
  { img: "/images/x2.png", label: "فحص ميكانيكا المحرك والقير" },
  { img: "/images/x3.png", label: "فحص الحساسات بالكمبيوتر" },
  { img: "/images/x4.png", label: "فحص سلامة الوسائد الهوائية" },
  { img: "/images/x5.png", label: "فحص ميكانيكا أسفل السيارة" },
  { img: "/images/x6.png", label: "فحص الزيوت والسوائل والتسريبات" },
  { img: "/images/x7.png", label: "فحص أنظمة الفرامل والتعليق" },
  { img: "/images/x8.png", label: "فحص الهيكل والسمكرة" },
  { img: "/images/x9.png", label: "فحص الديكور والداخلية" },
  { img: "/images/x10.png", label: "فحص سلامة الإطارات" },
  { img: "/images/x11.png", label: "تجربة المركبة على الطريق" },
  { img: "/images/x12.png", label: "طباعة التقرير وشرحه" },
];

const WHY_US = [
  {
    icon: Star,
    title: "خبرة اكثر من 10+",
    description: "تمتد خبرتنا لأكثر من 12 عامًا في فحص السيارات حيث نتميز بدقة الفحص والتقارير بشكل استثنائي",
  },
  {
    icon: Car,
    title: "فحص جميع السيارات",
    description: "نفحص جميع أنواع السيارات الكبيرة والصغيرة سواء كانت تعمل بالبنزين أو الكهرباء بدقة تامة",
  },
  {
    icon: Award,
    title: "نقاط ولاء للعملاء",
    description: "كل زيارة لمركز كاشف تحصل على رصيد مجاني تستفيد منه في الفحص القادم",
  },
  {
    icon: ShieldCheck,
    title: "ضمان صحة التقارير",
    description: "التزامًا بالجودة والموثوقية, نقدم ضمانًا لسلامة وصحة نتائج تقاريرنا في فحص السيارات",
  },
];

const FAQS = [
  {
    q: "من هو كاشف؟",
    a: "كاشف مركز متخصص في فحص السيارات المستعملة، يقدم فحصًا فنيًا دقيقًا ويصدر تقرير فحص ورقي وإلكتروني يوضح الحالة الفعلية للسيارة، لمساعدة المشتري على اتخاذ قرار الشراء بثقة.",
  },
  {
    q: "ما الذي يميّز كاشف عن غيره؟",
    a: "يمتلك كاشف فريقًا من الفنيين المختصين بخبرة تتجاوز 10 سنوات، ويقدّم ضمانًا على صحة تقرير الفحص.",
  },
  {
    q: "هل يوجد ضمان؟",
    a: "نعم، يوجد ضمان على صحة تقرير الفحص، ويتم تطبيقه وفق شروط محددة.",
  },
  {
    q: "ما هي خدمات كاشف الرئيسية؟",
    a: (
      <>
        <p className="font-semibold text-[#002623]">خدمة فحص الشراء</p>
        <p>فحص شامل لجميع أجزاء السيارة المستعملة لاكتشاف الأعطال والعيوب قبل اتخاذ قرار الشراء.</p>
        <p className="mt-4 font-semibold text-[#002623]">خدمة مخدوم</p>
        <p>
          في حال وجود سيارة للبيع في الرياض، جدة، القصيم، الدمام أو خميس مشيط وأنت خارج هذه المدن، يقوم مركز كاشف بفحص السيارة فحصًا شاملًا ودقيقًا، مع تسهيل إجراءات نقل الملكية
          والتأمين وشحن السيارة إلى مدينتك.
        </p>
        <p className="mt-4 font-semibold text-[#002623]">خدمة المسافر</p>
        <p>فحص مخصص قبل السفر للتأكد من جاهزية السيارة وسلامتها على الطريق، ويشمل أهم الفحوصات التي تضمن رحلة آمنة ومريحة.</p>
      </>
    ),
  },
  {
    q: "ما هي باقات الفحص؟",
    a: (
      <>
        <p className="font-semibold text-[#002623]">باقة الفحص الشامل تشمل:</p>
        <ul className="list-disc pr-4">
          {[
            "المحرك",
            "ناقل الحركة",
            "الدفرنس",
            "ميكانيكا أسفل السيارة",
            "الكمبيوتر والحساسات",
            "الهيكل الداخلي",
            "تجربة السيارة",
            "الهيكل الخارجي",
            "الوسائد الهوائية",
            "الديكورات الداخلية",
            "المزايا المخصصة للسيارة",
            "الملحقات الخارجية",
            "الزجاج",
            "الكفرات والجنوط",
            "الشمعات والأسطبات",
          ].map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <p className="mt-4 font-semibold text-[#002623]">باقة الفحص الأساسي تشمل:</p>
        <ul className="list-disc pr-4">
          {["المحرك", "ناقل الحركة", "الدفرنس", "ميكانيكا أسفل السيارة", "الكمبيوتر والحساسات", "الهيكل الداخلي", "تجربة السيارة", "الهيكل الخارجي", "الوسائد الهوائية"].map(
            (i) => (
              <li key={i}>{i}</li>
            )
          )}
        </ul>
        <p className="mt-4 font-semibold text-[#002623]">باقة فحص المحركات تشمل:</p>
        <ul className="list-disc pr-4">
          {["المحرك", "ناقل الحركة", "الدفرنس", "ميكانيكا أسفل السيارة", "الكمبيوتر والحساسات", "الهيكل الداخلي", "تجربة السيارة"].map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </>
    ),
  },
  {
    q: "ما هي خدمات كاشف الإضافية؟",
    a: (
      <>
        <p>بالتعاون مع شركائنا، يقدّم كاشف الخدمات التالية:</p>
        <ul className="list-disc pr-4">
          <li>نقل ملكية السيارة وإصدار التأمين</li>
          <li>خدمة مرتاح: استلام السيارة من موقعك عبر سطحة، فحصها في المركز، ثم إعادتها إلى نفس الموقع</li>
          <li>شحن السيارة إلى جميع مدن المملكة</li>
        </ul>
      </>
    ),
  },
  {
    q: "ما هي خدمات كاشف الإلكترونية؟",
    a: (
      <ul className="list-disc pr-4">
        <li>حجز موعد الفحص أونلاين</li>
        <li>الاطلاع على الأسعار والباقات أونلاين</li>
        <li>وسائل دفع متعددة</li>
        <li>تحميل تقرير الفحص أونلاين</li>
        <li>متابعة نقاط الرصيد المجاني (نقاط الولاء)</li>
      </ul>
    ),
  },
];

const TESTIMONIALS = [
  {
    text: "ماشاء الله تبارك الله فحص بطل واسعارهم حلوه ودقة في كل التفاصيل بالسيارة ومع ايدي سعودية الله يعطيهم العافية",
    name: "عبدالله الدوسري",
  },
  {
    text: "يفحصون السيارة من قلب لو تبي تشتري سيارة افحص عندهم شغلهم ذمة وأمانة وعندهم فني سعودي نصوح",
    name: "saud ali ibrahim",
  },
  {
    text: "فحص دقيق جدا ماشاء الله تبارك الله وتعاملهم ممتاز الله يبارك لهم بتعرف معنى دقة الفحص بعد التجربة",
    name: "ابو عبدالرحمن",
  },
  {
    text: "افضل تجربة مرت علي في مراكز الفحص الشامل كل الشكر للاخوة القائمين على الفحص بذمة يستاهلون المبلغ اللي يندفع لهم",
    name: "mhmad mhmad",
  },
  {
    text: "من افضل مراكز الفحص شباب بشوشين وطيبين وتفحص عندهم وانت مرتاح الله يرزقهم ويبارك لهم",
    name: "Abdullah Almutairi",
  },
];

const FOOTER_SERVICES = [
  { label: "فحص ما قبل الشراء", href: "#inspection-before-buying" },
  { label: "خدمة مخدوم", href: "https://cashif.cc/check-it/" },
  { label: "فحص المسافر", href: "#passnger-check" },
];

const FOOTER_LINKS = [
  { label: "الأحكام والخصوصية", href: "https://cashif.cc/terms-and-privacy-policy/" },
  { label: "الاسترجاع والاستبدال", href: "https://cashif.cc/return-policy/" },
  { label: "المدونة", href: "https://cashif.cc/blog/" },
];

const PAYMENT_LOGOS = [
  { src: "/images/mada.svg", alt: "mada" },
  { src: "/images/pay.svg", alt: "pay" },
  { src: "/images/samsung.png", alt: "samsung pay" },
  { src: "/images/visa.svg", alt: "visa" },
  { src: "/images/mastercard.svg", alt: "mastercard" },
  { src: "/images/tamara-logo.svg", alt: "tamara", light: true },
  { src: "/images/tabby.png", alt: "tabby", light: true },
];

const MOBILE_NAV = [
  { label: "حسابي", icon: Menu, href: "/" },
  { label: "الأسعار", icon: SaudiRiyal, href: "/" },
  { label: "الرئيسية", icon: HomeIcon, href: "/" },
  { label: "تقاريري", icon: FileText, href: "/" },
  { label: "فالك", icon: Handshake, href: "/" },
];

/* -------------------------------------------------------------------------- */
/*  SVG ICONS (brand-specific, not in lucide)                                 */
/* -------------------------------------------------------------------------- */

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
    </svg>
  );
}

function YoutubeIcon({ className }) {
  return (
    <svg viewBox="0 0 576 512" fill="currentColor" className={className}>
      <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
    </svg>
  );
}

function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 448 512" fill="currentColor" className={className}>
      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
    </svg>
  );
}

function TiktokIcon({ className }) {
  return (
    <svg viewBox="0 0 448 512" fill="currentColor" className={className}>
      <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
    </svg>
  );
}

function XIcon({ className }) {
  return (
    <svg viewBox="0 0 512 512" fill="currentColor" className={className}>
      <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
    </svg>
  );
}

function SnapchatIcon({ className }) {
  return (
    <svg viewBox="0 0 512 512" fill="currentColor" className={className}>
      <path d="M510.846 392.673c-5.211 12.157-27.239 21.089-67.36 27.318-2.064 2.786-3.775 14.686-6.507 23.956-1.625 5.566-5.623 8.869-12.128 8.869l-.297-.005c-9.395 0-19.203-4.323-38.852-4.323-26.521 0-35.662 6.043-56.254 20.588-21.832 15.438-42.771 28.764-74.027 27.399-31.646 2.334-58.025-16.908-72.871-27.404-20.714-14.643-29.828-20.582-56.241-20.582-18.864 0-30.736 4.72-38.852 4.72-8.073 0-11.213-4.922-12.422-9.04-2.703-9.189-4.404-21.263-6.523-24.13-20.679-3.209-67.31-11.344-68.498-32.15a10.627 10.627 0 0 1 8.877-11.069c69.583-11.455 100.924-82.901 102.227-85.934.074-.176.155-.344.237-.515 3.713-7.537 4.544-13.849 2.463-18.753-5.05-11.896-26.872-16.164-36.053-19.796-23.715-9.366-27.015-20.128-25.612-27.504 2.437-12.836 21.725-20.735 33.002-15.453 8.919 4.181 16.843 6.297 23.547 6.297 5.022 0 8.212-1.204 9.96-2.171-2.043-35.936-7.101-87.29 5.687-115.969C158.122 21.304 229.705 15.42 250.826 15.42c.944 0 9.141-.089 10.11-.089 52.148 0 102.254 26.78 126.723 81.643 12.777 28.65 7.749 79.792 5.695 116.009 1.582.872 4.357 1.942 8.599 2.139 6.397-.286 13.815-2.389 22.069-6.257 6.085-2.846 14.406-2.461 20.48.058l.029.01c9.476 3.385 15.439 10.215 15.589 17.87.184 9.747-8.522 18.165-25.878 25.018-2.118.835-4.694 1.655-7.434 2.525-9.797 3.106-24.6 7.805-28.616 17.271-2.079 4.904-1.256 11.211 2.46 18.748.087.168.166.342.239.515 1.301 3.03 32.615 74.46 102.23 85.934 6.427 1.058 11.163 7.877 7.725 15.859z" />
    </svg>
  );
}

const SOCIALS = [
  { icon: YoutubeIcon, href: "https://www.youtube.com/@cashifcc", label: "YouTube" },
  { icon: InstagramIcon, href: "https://www.instagram.com/cashif_sa", label: "Instagram" },
  { icon: TiktokIcon, href: "https://www.tiktok.com/@cashif_sa", label: "TikTok" },
  { icon: XIcon, href: "https://x.com/cashif_sa", label: "X" },
  { icon: SnapchatIcon, href: "https://www.snapchat.com/add/cashif_sa", label: "Snapchat" },
];

const WHATSAPP_HREF = "https://wa.me/966920019948?text=*اختر من القائمة الرئيسية*";

/* -------------------------------------------------------------------------- */
/*  ANIMATED BUBBLE WRAPPER                                                    */
/* -------------------------------------------------------------------------- */

function AnimatedBubble({ align, children }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // RTL: "start" sits on the right, "end" sits on the left
  const slideFrom = align === "start" ? "slide-in-from-right-8" : "slide-in-from-left-8";
  const justify = align === "start" ? "justify-start" : "justify-end";

  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full", // keeps the row, pushes Bubble to the correct side
        justify,
        "transition-opacity duration-500",
        isVisible ? cn("animate-in fade-in-0 duration-500 ease-out", slideFrom) : "opacity-0"
      )}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function Home() {
  const [isStuck, setIsStuck] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const STICKY_TOP = 16; // matches sticky top-[16px]
    const EARLY_TRIGGER = 32; // fire 16px before it actually sticks

    const observer = new IntersectionObserver(([entry]) => setIsStuck(!entry.isIntersecting), { threshold: 0, rootMargin: `-${STICKY_TOP + EARLY_TRIGGER + 1}px 0px 0px 0px` });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div dir="rtl">
      <div className="mx-auto lg:max-w-[1500px] lg:px-10 lg:pt-10">
        <HeroSection />
      </div>

      <div ref={sentinelRef} />

      <div className="sticky top-[16px] z-30">
        <div className="relative z-20 mx-auto -mt-8 w-full max-w-xl px-4">
          <CarModelSearch isStuck={isStuck} />
        </div>
      </div>

      <ImageCarousel />
      <ServicesSection />
      <StagesSection />
      <WhyUsSection />
      <FaqSection />
      <TestimonialsCarousel />
      <SiteFooter />
      <WhatsAppButton />
      <MobileBottomNav />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  HERO / HEADER                                                             */
/* -------------------------------------------------------------------------- */

function HeroSection() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|windows phone/.test(userAgent);
      setIsMobile(isMobileDevice);
    };
    checkMobile();

    const handleOrientation = (event) => {
      if (event.beta !== null && event.gamma !== null) {
        const x = Math.max(-30, Math.min(30, event.gamma * 0.6));
        const y = Math.max(-20, Math.min(20, event.beta * 0.4));
        setRotation({ x, y });
      }
    };

    const handleMouseMove = (event) => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;

      const x = Math.max(-15, Math.min(15, px * 20)); // was 60, now gentler
      const y = Math.max(-10, Math.min(10, py * 15)); // was 40, now gentler
      setRotation({ x, y });
    };

    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 });
    };

    let cleanupFallback = null;

    if (isMobile && window.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission()
          .then((state) => {
            if (state === "granted") {
              window.addEventListener("deviceorientation", handleOrientation);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener("deviceorientation", handleOrientation);
      }
    } else if (!isMobile) {
      const section = sectionRef.current;
      section?.addEventListener("mousemove", handleMouseMove);
      section?.addEventListener("mouseleave", handleMouseLeave);
      cleanupFallback = () => {
        section?.removeEventListener("mousemove", handleMouseMove);
        section?.removeEventListener("mouseleave", handleMouseLeave);
      };
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      if (cleanupFallback) cleanupFallback();
    };
  }, [isMobile]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden rounded-b-[40px] bg-[#002623] px-4 pb-32 pt-4 lg:rounded-[40px] lg:px-8 lg:pt-8">
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          transform: `perspective(800px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.12)`,
          transition: "transform 0.1s ease-out",
          transformOrigin: "center center",
        }}
      >
        <Image src="/images/cars-brands-abstract-background.jpg" alt="Cars brands abstract background" fill className="object-cover" priority />
      </div>

      {/* Gradient overlays - keep them on top */}
      <div className="pointer-events-none absolute -right-24 top-1/3 z-10 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-white/10 via-[#054239]/40 to-[#988561]/10 blur-2xl" />
      <div className="pointer-events-none absolute -left-16 top-4 z-10 hidden h-[250px] w-[250px] rounded-full bg-gradient-to-br from-white/10 via-[#428177]/25 to-[#988561]/10 blur-2xl sm:block" />

      <HeaderNav />

      <div className="relative z-20 mx-auto flex max-w-3xl flex-col items-center pt-16 text-center sm:pt-20">
        <div className="mb-10 h-24 w-40 sm:mb-16 sm:h-28 sm:w-44">
          <Image src="/images/logo.webp" alt="Cashif logo" width={180} height={115} className="h-full w-full object-contain" priority />
        </div>

        <h1 className="font-display w-full whitespace-nowrap text-[clamp(1.5rem,7vw,2.6875rem)] leading-tight text-[#edebe0]">كاشف لفحص السيارات</h1>
        <p className="font-body mt-4 max-w-xl text-base leading-relaxed text-[#b9a779] sm:text-lg sm:leading-[38px]">
          مركز متخصص في فحص السيارات المستعملة، يقدم مفهومًا جديدًا يواكب أحدث التقنيات ليساعدك في قرار الشراء
        </p>
      </div>
    </section>
  );
}

function HeaderNav() {
  return (
    <div className="relative z-20 flex items-center justify-start">
      <Link
        href="/"
        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#fef8fb] px-4 py-1.5 text-sm text-[#fef8fb] transition hover:bg-[#fef8fb] hover:text-[#002623]"
      >
        <span>دخول</span>
        <LogIn size={18} />
      </Link>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  IMAGE CAROUSEL                                                             */
/* -------------------------------------------------------------------------- */

function ImageCarousel() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);
  const autoplayRef = useRef(null);

  const goNext = () => setIndex((i) => (i + 1) % CAROUSEL_SLIDES.length);
  const goPrev = () => setIndex((i) => (i - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);

  const startAutoplay = () => {
    clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(goNext, 3000);
  };

  useEffect(() => {
    startAutoplay();
    return () => clearInterval(autoplayRef.current);
  }, []);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    clearInterval(autoplayRef.current); // pause autoplay while interacting
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    const SWIPE_THRESHOLD = 50;
    if (touchDeltaX.current > SWIPE_THRESHOLD) {
      // swiped right -> previous
      goPrev();
    } else if (touchDeltaX.current < -SWIPE_THRESHOLD) {
      // swiped left -> next
      goNext();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
    startAutoplay(); // resume autoplay
  };

  return (
    <div dir="rtl" className="mx-auto mt-20 max-w-[1000px] px-4 sm:mt-24">
      <div
        className="relative overflow-hidden rounded-[40px] shadow-lg touch-pan-y select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative aspect-square w-full sm:aspect-[16/9]">
          {CAROUSEL_SLIDES.map((slide, i) => (
            <div key={slide.desktop} className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}>
              <Image src={slide.mobile} alt={slide.alt} fill className="object-cover sm:hidden" draggable={false} />
              <Image src={slide.desktop} alt={slide.alt} fill className="hidden object-cover sm:block" draggable={false} />
            </div>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
          {CAROUSEL_SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => {
                setIndex(i);
                startAutoplay();
              }}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-[#e6d39c]" : "w-1.5 bg-white/60"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  SECTION TITLE                                                             */
/* -------------------------------------------------------------------------- */

function SectionTitle({ children }) {
  return (
    <div className="mb-8 mt-12 flex justify-center">
      <h2 className="relative inline-block text-center text-2xl font-semibold text-[#002623] font-display">
        {children}
        <span className="absolute bottom-[1px] left-0 h-[14px] w-full bg-[#e6d39c] -z-10" />
      </h2>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  SERVICES                                                                   */
/* -------------------------------------------------------------------------- */

function ServicesSection() {
  return (
    <section className="px-4 py-4">
      <SectionTitle>خدماتنا</SectionTitle>
      <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-6">
        {SERVICES.map(({ id, number, title, description, points, cta }) => (
          <Card
            id={id}
            key={id}
            className="flex min-h-[350px] w-full flex-col justify-between rounded-[40px] border-none p-6 shadow-[0_7px_29px_0_rgba(100,100,111,0.2)] transition sm:min-h-[415px] sm:w-[calc(50%-12px)] sm:p-11 lg:w-[calc(33.333%-16px)]"
          >
            <CardContent className="flex flex-1 flex-col p-0">
              <div className="mx-auto mb-6 h-[164px] w-[164px]">
                <Image src={`/images/wheel-${number}.jpg`} alt={`${title} icon`} width={100} height={100} className="h-full w-full object-contain" />
              </div>
              <h4 className="text-center font-bold text-2xl text-[#002623] sm:text-[25px]">{title}</h4>
              <p className="mt-1.5 mb-4 text-center text-sm text-[#757575] font-heading-bold">{description}</p>
              <ul className="mb-0 space-y-4">
                {points.map((point, i) => (
                  <li key={i} className="flex items-center gap-2 text-base font-medium text-[#757575]">
                    <ShieldCheck className="h-[25px] w-[25px] shrink-0 text-[#4caf50]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto p-0">
              <Link href={cta} className={cn(buttonVariants({ variant: "default" }), "w-full rounded-full bg-[#002623] py-2 text-white hover:bg-[#1a292e]")}>
                أطلب الأن
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  INSPECTION STAGES                                                         */
/* -------------------------------------------------------------------------- */

function StagesSection() {
  return (
    <section className="overflow-x-hidden px-4 h-[906px]">
      <SectionTitle>أجزاء ومراحل الفحص</SectionTitle>
      <div className="mx-auto max-w-[480px] rounded-lg bg-white m-auto">
        <div className="flex flex-col gap-4">
          {STAGES.map(({ img, label }, i) => {
            const isLast = i === STAGES.length - 1;
            return (
              <AnimatedBubble key={label} align={i % 2 === 0 ? "start" : "end"}>
                <Bubble align={i % 2 === 0 ? "start" : "end"} variant={i % 2 === 0 ? "secondary" : "tinted"}>
                  <BubbleContent className="flex items-center gap-3">
                    <Image src={img} alt={label} width={28} height={28} className="w-7 shrink-0" />
                    <span className="text-[#002623] text-sm sm:text-base">{label}</span>
                  </BubbleContent>

                  {isLast && (
                    <BubbleReactions align="start" role="img" aria-label="Reactions: thumbs up, surprised">
                      <span>🎉</span>
                      <span>🚀</span>
                    </BubbleReactions>
                  )}
                </Bubble>
              </AnimatedBubble>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  WHY US                                                                    */
/* -------------------------------------------------------------------------- */

function WhyUsSection() {
  return (
    <section className="px-4 py-4">
      <SectionTitle>لماذا تتعامل معنا ؟</SectionTitle>
      <div className="mx-auto flex max-w-6xl flex-wrap items-stretch justify-evenly gap-y-6">
        {WHY_US.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex w-[180px] flex-shrink-0 flex-col items-center overflow-hidden rounded-xl bg-white shadow-[0_0.25em_0_rgb(195,198,209)] sm:w-[228px]">
            <div className="flex h-[105px] w-full items-center justify-center bg-[#002623]">
              <Icon className="h-16 w-16 text-[#e6d39c]" strokeWidth={1.5} />
            </div>
            <h3 className="pt-5 px-4 text-center text-lg font-semibold text-[#002623]">{title}</h3>
            <p className="p-4 pt-0 text-center text-base font-light text-[#757575]">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  FAQ (custom accordion)                                                    */
/* -------------------------------------------------------------------------- */

function FaqSection() {
  return (
    <section className="px-4 py-4">
      <SectionTitle>الاسئلة الشائعة</SectionTitle>
      <div className="mx-auto max-w-3xl">
        <Accordion className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {FAQS.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`} className="border-b border-gray-200 last:border-b-0">
              <AccordionTrigger
                dir="rtl"
                className="cursor-pointer px-5 py-4 text-right font-semibold text-[#002623]
    **:data-[slot=accordion-trigger-icon]:ml-0
    **:data-[slot=accordion-trigger-icon]:shrink-0
    [&[data-panel-open]>svg]:rotate-0"
              >
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="px-1 pb-5 text-[15px] leading-relaxed text-[#707171]" dir="rtl">
                <div className="space-y-1">{item.a}</div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  TESTIMONIALS CAROUSEL                                                     */
/* -------------------------------------------------------------------------- */

function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const count = TESTIMONIALS.length;

  const next = () => setIndex((i) => (i + 1) % count);
  const prev = () => setIndex((i) => (i - 1 + count) % count);

  return (
    <section className="relative z-10 -mb-24 mt-8 px-4">
      <SectionTitle>آراء العملاء</SectionTitle>

      <div className="relative mx-auto max-w-[900px] overflow-hidden rounded-[22px] bg-[#f0f1f3b5] backdrop-saturate-150 backdrop-blur-xl px-6 py-10 sm:px-16 sm:py-16">
        <p className="text-center text-sm italic leading-6 text-[#002623] sm:text-xl sm:leading-8">{TESTIMONIALS[index].text}</p>
        <div className="mt-3 text-center text-xs text-[#002623] underline sm:mt-4 sm:text-base">{TESTIMONIALS[index].name}</div>

        <button
          onClick={prev}
          aria-label="السابق"
          className="cursor-pointer absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#e6d39c] text-[#002623] sm:h-11 sm:w-11"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          aria-label="التالي"
          className="cursor-pointer absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#e6d39c] text-[#002623] sm:h-11 sm:w-11"
        >
          <ChevronRight size={20} />
        </button>

        <div className="mt-6 flex justify-center gap-2 flex-row-reverse">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              aria-label={`رأي ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-[#e6d39c]" : "w-1.5 bg-white/50"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  FOOTER                                                                    */
/* -------------------------------------------------------------------------- */

function SiteFooter() {
  return (
    <footer className="relative bg-[#002623] pb-24 pt-52 text-white sm:pt-[210px] rounded-t-[40px] ">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-y-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mx-auto h-[83px] w-[125px] md:mx-0">
              <Image
                src="/images/logo.webp"
                alt="Cashif logo"
                width={125}
                height={83}
                className="h-full w-full object-contain brightness-0 invert"
              />
            </div>
            <p className="my-6 w-full text-center text-sm leading-7 md:w-[90%] md:text-right">
              نسعى في كاشف، لإبراز رسالة توعوية غاية في الأهمية؛ تتمثل في رفع الوعي لدى المستهلك بضرورة الكشف على المركبة المستعملة لدى مركز متخصص قبل الشروع في الشراء .
            </p>
            <div className="mb-8 flex justify-center gap-1.5 md:justify-start">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noreferrer" className="flex h-[38px] w-[38px] items-center justify-center rounded-full">
                  <Icon className="h-6 w-6 fill-[#e6d39c] text-[#e6d39c] transition hover:fill-yellow-400 hover:text-yellow-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Branches */}
          <FooterColumn title="فروعنا">
            {BRANCHES.map((b) => (
              <li key={b.name}>
                <a href={b.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 py-1.5 text-sm text-white transition hover:px-1 hover:text-[#e6d39c]">
                  {b.name} <ExternalLink size={12} />
                </a>
              </li>
            ))}
          </FooterColumn>

          {/* Services */}
          <FooterColumn title="خدمات كاشف">
            {FOOTER_SERVICES.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="inline-block py-1.5 text-sm text-white transition hover:px-1 hover:text-[#e6d39c]">
                  {s.label}
                </a>
              </li>
            ))}
          </FooterColumn>

          {/* Links + Contact */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:col-span-1 md:grid-cols-1">
            <FooterColumn title="روابط مهمة">
              {FOOTER_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="inline-block py-1.5 text-sm text-white transition hover:px-1 hover:text-[#e6d39c]">
                    {l.label}
                  </a>
                </li>
              ))}
            </FooterColumn>

            <div>
              <h4 className="relative mb-6 text-right text-lg font-medium text-[#e6d39c] after:mt-2.5 after:block after:h-[3px] after:w-[70px] after:rounded-sm after:bg-[#e6d39c] after:content-['']">
                تواصل معنا
              </h4>
              <div className="flex flex-col items-end gap-1 text-sm">
                <span className="text-white">خدمة العملاء</span>
                <a href="tel:920019948" className="flex items-center gap-1.5 text-white">
                  <Phone size={14} />
                  920019948
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col-reverse flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-6">
          <p className="text-sm text-white">جميع الحقوق محفوظة © 2026 مركز كاشف</p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {PAYMENT_LOGOS.map((p) => (
              <div key={p.alt} className={`flex h-[35px] w-[65px] items-center justify-center rounded-[3px] ${p.light ? "bg-white" : ""}`}>
                <Image src={p.src} alt={p.alt} width={65} height={35} className="h-full w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div>
      <h4 className="relative mb-6 text-right text-lg font-medium text-[#e6d39c] after:mt-2.5 after:block after:h-[3px] after:w-[70px] after:rounded-sm after:bg-[#e6d39c] after:content-['']">
        {title}
      </h4>
      <ul className="space-y-1 text-right">{children}</ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  WHATSAPP FLOATING BUTTON                                                  */
/* -------------------------------------------------------------------------- */

function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp Customer Service"
      className="fixed bottom-[100px] left-4 z-50 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition hover:scale-105 sm:bottom-8 sm:left-8 sm:h-14 sm:w-14"
    >
      <WhatsAppIcon className="h-6 w-6" />
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/*  MOBILE BOTTOM NAV                                                         */
/* -------------------------------------------------------------------------- */

function MobileBottomNav() {
  const [active, setActive] = useState(2); // "الرئيسية" active by default

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full -translate-x-1/2 bg-[#f0f1f3cf] backdrop-saturate-150 backdrop-blur-xl sm:w-[450px] sm:rounded-t-[10px] pt-3 pb-4">
      <ul className="flex h-[52px] items-center justify-evenly">
        {MOBILE_NAV.map(({ label, icon: Icon, href }, i) => {
          const isActive = active === i;
          return (
            <li key={label}>
              <Link href={href} onClick={() => setActive(i)} className="flex flex-col items-center justify-center gap-1">
                <span
                  className={`flex h-8 items-center justify-center rounded-2xl transition-all duration-200 ease-out ${isActive ? "w-14 bg-[#4281775e]" : "w-8 bg-transparent"}`}
                >
                  <Icon className={`h-6 w-6 shrink-0 ${isActive ? "text-[#054239]" : "text-[#444746]"}`} strokeWidth={isActive ? 2.2 : 1.8} />
                </span>
                <span className={`text-[11px] leading-none tracking-wide ${isActive ? "font-semibold text-[#054239]" : "font-medium text-[#444746]"}`}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Car, ClipboardList, Loader2, MapPin, SaudiRiyal, Tag, TriangleAlert } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PAYMENT_LOGOS = {
  Moyasar: { src: "/images/moyasar.png", width: 96, height: 42 },
  Tabby: { src: "/images/tabby.png", width: 96, height: 42 },
  Tamara: { src: "/images/tamara-logo.svg", width: 96, height: 32 },
};

function formatDate(dateString) {
  if (!dateString) return "—";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}/${month}/${day}`;
}

function formatPrice(price) {
  const value = Number.parseFloat(price);
  if (Number.isNaN(value)) return "—";
  return `${value} ريال`;
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Icon className="h-4 w-4 shrink-0 text-[#757575]" />
      <span className="shrink-0 text-sm text-[#757575]">{label}:</span>
      <span className="truncate text-sm font-semibold text-[#002623]">{value ?? "—"}</span>
    </div>
  );
}

function OrderCard({ order }) {
  const payment = PAYMENT_LOGOS[order.table_name];

  return (
    <Card size="sm" className="h-full rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
      <CardContent className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-[#174545]/20">
              <Car className="h-5 w-5 text-[#174545]" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-[#002623]">{order.model || "—"}</p>
              <p className="text-sm text-[#757575]">{order.full_year || "—"}</p>
            </div>
          </div>

          {payment ? (
            <Image src={payment.src} alt={order.table_name} width={payment.width} height={payment.height} className="h-9 w-auto shrink-0 object-contain" />
          ) : order.table_name ? (
            <span className="rounded-full bg-[#002623]/5 px-3 py-1 text-xs font-medium text-[#174545]">{order.table_name}</span>
          ) : null}
        </div>

        <div className="h-px bg-[#002623]/8" />

        <div className="grid gap-3 sm:grid-cols-2">
          <InfoRow icon={MapPin} label="الفرع" value={order.branch} />
          <InfoRow icon={ClipboardList} label="الخطة" value={order.plan} />
          <InfoRow icon={SaudiRiyal} label="السعر" value={formatPrice(order.price)} />
          <InfoRow icon={CalendarDays} label="تاريخ الطلب" value={formatDate(order.created_at)} />
          {order.discountCode ? <InfoRow icon={Tag} label="كود الخصم" value={String(order.discountCode).toUpperCase()} /> : null}
        </div>

        <p dir="ltr" className="mt-auto text-left text-[10px] tracking-wide text-[#c0cad8]">
          {order.paid_qr_code || "\u00a0"}
        </p>
      </CardContent>
    </Card>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/orders", { cache: "no-store" });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "لم يتم العثور على طلبات.");
        }

        if (!cancelled) setOrders(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        if (!cancelled) {
          setOrders([]);
          setError(err.message || "تعذر تحميل الطلبات");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOrders();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          طلباتي
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
        <p className="text-[#757575]">{orders.length > 0 ? `${orders.length} طلب مسجّل` : "طلبات الفحص الخاصة بك"}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-9 w-9 animate-spin text-[#174545]" />
        </div>
      ) : null}

      {!loading && error ? (
        <div className="mx-auto flex max-w-lg items-start gap-3 rounded-[28px] bg-[#fff7ed] px-4 py-4 text-[#9a3412] shadow-[0_7px_29px_0_rgba(100,100,111,0.12)]">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : null}

      {!loading && !error && orders.length === 0 ? (
        <Card className="mx-auto max-w-lg rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
          <CardContent className="flex flex-col items-center gap-5 py-6 text-center">
            <ClipboardList className="h-10 w-10 text-[#174545]" />
            <div className="space-y-2">
              <p className="text-lg font-semibold text-[#002623]">لا توجد طلبات حتى الآن</p>
              <p className="text-sm leading-relaxed text-[#757575]">
                بعد حجز فحص سيارتك ستظهر هنا تفاصيل الطلب: الفرع، الخطة، والسعر.
              </p>
            </div>
            <Link
              href="/prices"
              className={cn(buttonVariants({ variant: "default", size: "lg" }), "cursor-pointer rounded-full bg-[#002623] px-8 py-2 text-white hover:bg-[#1a292e]")}
            >
              احجز الآن
            </Link>
          </CardContent>
        </Card>
      ) : null}

      {!loading && !error && orders.length > 0 ? (
        <ul className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
          {orders.map((order) => (
            <li key={order.paid_qr_code ?? order.id} className="h-full">
              <OrderCard order={order} />
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}

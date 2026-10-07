"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  CreditCard,
  Landmark,
  Loader2,
  SaudiRiyal,
  Wallet,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function formatCreatedDate(isoDateString) {
  if (!isoDateString) return "—";
  const date = new Date(isoDateString);
  if (Number.isNaN(date.getTime())) return "—";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} at ${hours}:${minutes}`;
}

function HistoryRow({ icon: Icon, label, value, className, dir }) {
  return (
    <div className={`flex min-w-0 items-center gap-2 ${className || ""}`}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#002623]/5 text-[#757575]">
        <Icon className="h-4 w-4" />
      </span>
      <span className="shrink-0 text-[13px] font-semibold text-[#002623]">{label}:</span>
      <span dir={dir} className="truncate text-[13px] text-[#757575]">
        {value ?? "—"}
      </span>
    </div>
  );
}

export function FalkHistoryList() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/falk/history", { cache: "no-store" });
        const data = await response.json().catch(() => []);
        if (cancelled) return;

        setHistory(Array.isArray(data) ? data.slice().reverse() : []);
      } catch {
        if (!cancelled) setHistory([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          المعاملات المالية
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-[#174545]" />
        </div>
      ) : history.length === 0 ? (
        <p className="text-center text-[#757575]">لا يوجد بيانات</p>
      ) : (
        <div className="mx-auto grid max-w-3xl gap-4">
          {history.map((payment) => (
            <Card key={payment.id} className="rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
              <CardContent className="space-y-3 p-5">
                <HistoryRow
                  icon={Wallet}
                  label="المبلغ"
                  value={
                    <span className="inline-flex items-center gap-1">
                      {payment.point}
                      <SaudiRiyal className="h-4 w-4" />
                    </span>
                  }
                />
                <HistoryRow
                  icon={CheckCircle2}
                  label="الحالة"
                  value={payment.status}
                  className={payment?.status === "Accept" ? "[&_span:last-child]:text-[#4caf50]" : "[&_span:last-child]:text-[#ff9800]"}
                />
                {payment?.rejectReason ? (
                  <HistoryRow
                    icon={AlertTriangle}
                    label="السبب"
                    value={payment.rejectReason}
                    className="[&_span:last-child]:text-[#d32f2f]"
                  />
                ) : null}
                <HistoryRow
                  icon={CreditCard}
                  label="آلية الدفع"
                  value={payment.tranferPaymentTypeNameAr || payment.tranferPaymentTypeNameEn}
                />
                <HistoryRow icon={Landmark} label="الحساب" value={payment.accountNumber} />
                <HistoryRow icon={Clock3} label="التاريخ" value={formatCreatedDate(payment?.createdDate)} dir="ltr" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

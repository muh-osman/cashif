"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CircleCheck, CircleAlert } from "lucide-react";

function shippingClientId(data) {
  if (typeof data === "number" || typeof data === "string") return String(data);
  if (data && typeof data === "object") return data.database_id || data.id || "";
  return "";
}

export function ShippingThanks() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const message = searchParams.get("message");
  const paymentId = searchParams.get("id");
  const paid = status === "paid" && message === "APPROVED" && Boolean(paymentId);
  const [countdown, setCountdown] = useState(5);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!paid || !paymentId) return;

    let cancelled = false;

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    async function fetchShippingPaymentId() {
      const maxRetries = 5;
      const retryDelay = 3000;

      for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
        if (cancelled) return;

        try {
          const response = await fetch(`/api/shipping/payment/${encodeURIComponent(paymentId)}`, { cache: "no-store" });
          const data = await response.json().catch(() => null);
          const id = shippingClientId(data);

          if (!response.ok || !id || id === "null") {
            throw new Error("Shipping payment not found");
          }

          window.location.replace(`https://cashif.online/shipping-client/${id}`);
          return;
        } catch {
          if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          } else if (!cancelled) {
            setError("حدث خطأ أثناء تجهيز طلب الشحن");
          }
        }
      }
    }

    const redirectTimeout = setTimeout(() => {
      fetchShippingPaymentId();
    }, 5000);

    return () => {
      cancelled = true;
      clearInterval(countdownInterval);
      clearTimeout(redirectTimeout);
    };
  }, [paid, paymentId]);

  return (
    <main className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center text-[#002623]">
      {paid ? (
        <div className="flex flex-col items-center gap-3">
          <CircleCheck className="h-12 w-12 text-[#1fb952]" />
          <h1 className="text-2xl font-bold">تم الدفع</h1>
          {error ? <p className="text-sm text-[#757575]">{error}</p> : <p className="text-sm text-[#757575]">يرجى الانتظار.. سيتم تحويلك خلال {countdown} ثواني</p>}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <CircleAlert className="h-12 w-12 text-red-600" />
          <h1 className="text-2xl font-bold">خطأ في الدفع</h1>
          <Link href="/reports" className="text-sm font-medium text-[#174545] underline underline-offset-4">
            عودة
          </Link>
        </div>
      )}
    </main>
  );
}

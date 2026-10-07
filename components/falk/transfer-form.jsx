"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, SaudiRiyal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const MIN_WITHDRAWAL = 200;

export function FalkTransferForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [marketer, setMarketer] = useState(null);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [canSubmit, setCanSubmit] = useState(true);
  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [marketerRes, typesRes, lastRes] = await Promise.all([
          fetch("/api/falk/marketer", { cache: "no-store" }),
          fetch("/api/falk/payment-types", { cache: "no-store" }),
          fetch("/api/falk/last-payment", { cache: "no-store" }),
        ]);

        const marketerData = await marketerRes.json().catch(() => null);
        const typesData = await typesRes.json().catch(() => []);
        const lastData = await lastRes.json().catch(() => ({}));

        if (!marketerRes.ok || !marketerData?.id) {
          throw new Error(marketerData?.message || "تعذر تحميل بيانات المسوق");
        }

        if (cancelled) return;

        setMarketer(marketerData);
        setPaymentTypes(Array.isArray(typesData) ? typesData : []);
        setAccountNumber(lastData?.accountNumber || "");
        setAmount(String(Math.floor(marketerData?.points || 0)));

        const waitingRes = await fetch(
          `/api/falk/check-waiting?marketerId=${encodeURIComponent(marketerData.id)}`,
          { cache: "no-store" }
        );
        const waitingData = await waitingRes.json().catch(() => true);
        if (!cancelled) {
          setCanSubmit(Boolean(waitingData));
        }
      } catch (err) {
        if (!cancelled) {
          toast.error(err.message || "تعذر تحميل صفحة السحب");
          router.replace("/falk");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canSubmit || submitting) return;

    if (!selectedPaymentType || !accountNumber || amount === "") {
      toast.warning("يرجى تعبئة جميع الحقول");
      return;
    }

    if (!/^\d+$/.test(String(amount))) {
      toast.warning("يجب أن يكون المبلغ عددًا صحيحًا بدون أرقام عشرية");
      return;
    }

    const numericAmount = Number(amount);

    if (numericAmount < MIN_WITHDRAWAL || Number.isNaN(numericAmount)) {
      toast.warning("الحد الأدنى لسحب الأرباح 200 ريال");
      return;
    }

    if (numericAmount > Number(marketer?.points || 0)) {
      toast.warning("المبلغ المدخل أكبر من الرصيد المتاح في حسابك");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/falk/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marketerId: marketer.id,
          point: Math.floor(numericAmount),
          tranferPaymentTypeId: selectedPaymentType,
          accountNumber,
          marketerName: marketer?.clientName,
          marketerCode: marketer?.code,
        }),
        cache: "no-store",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "تعذر إرسال طلب السحب");
      }

      toast.success("تم ارسال الطلب");
      router.replace("/falk");
    } catch (err) {
      toast.error(err.message || "تعذر إرسال طلب السحب");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-6xl items-center justify-center px-4 pb-6 pt-4 sm:pb-36">
        <Loader2 className="h-10 w-10 animate-spin text-[#174545]" />
      </main>
    );
  }

  const disabled = submitting || !canSubmit;

  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          سحب الأرباح
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
      </div>

      <Card className="mx-auto max-w-md rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[#002623]">آلية الدفع</label>
              <select
                required
                value={selectedPaymentType}
                onChange={(event) => setSelectedPaymentType(event.target.value)}
                disabled={disabled}
                className="h-11 w-full cursor-pointer appearance-none rounded-2xl border border-[#002623]/10 bg-white bg-[length:1rem] bg-[left_0.875rem_center] bg-no-repeat py-0 pl-10 pr-3 text-sm text-[#002623] outline-none focus:border-[#174545] disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23757575' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                }}
              >
                <option value="" disabled>
                  {paymentTypes.length ? "اختر آلية الدفع" : "جاري التحميل.."}
                </option>
                {paymentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.nameAr || type.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[#002623]">رقم الحساب</label>
              <Input
                dir="ltr"
                required
                value={accountNumber}
                onChange={(event) => setAccountNumber(event.target.value)}
                disabled={disabled}
                className="h-11 rounded-2xl border border-[#002623]/10 bg-white"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[#002623]">المبلغ</label>
              <Input
                dir="ltr"
                required
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                disabled={disabled}
                className="h-11 rounded-2xl border border-[#002623]/10 bg-white"
              />
              <p className="inline-flex flex-wrap items-center gap-1 text-sm text-[#757575]">
                الرصيد المتاح للسحب {Math.floor(marketer?.points || 0)}
                <SaudiRiyal className="h-4 w-4" />
              </p>
            </div>

            <Button
              type="submit"
              disabled={disabled}
              className="mt-2 w-full cursor-pointer rounded-4xl bg-[#174545] text-white hover:bg-[#174545]/90"
              size="lg"
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : canSubmit ? (
                "إرسال الطلب"
              ) : (
                "يرجى انتظار الموافقة على الطلب السابق"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

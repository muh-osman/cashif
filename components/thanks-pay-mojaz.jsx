"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CircleAlert, CircleCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MojazStepper } from "@/components/mojaz-stepper";

export function ThanksPayMojaz() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const message = searchParams.get("message");
  const paid = status === "paid" && message === "APPROVED";
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    if (paid) setActiveStep(2);
  }, [paid]);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-4 text-[#002623] sm:pb-36">
      <div className="mx-auto max-w-md space-y-4">
        <Card className="rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
          <CardContent>
            <MojazStepper activeStep={activeStep} />
          </CardContent>
        </Card>

        <Card className="rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
          <CardContent>
            {paid ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CircleCheck className="h-12 w-12 text-[#1fb952]" />
                <h1 className="text-2xl font-bold">تم الدفع</h1>
                <p className="text-sm text-[#757575]">قد يستغرق إعداد التقرير 5 دقائق</p>
                <p className="text-sm text-[#757575]">
                  يمكنك تحميل التقرير من صفحة{" "}
                  <Link href="/reports?tab=1" className="font-medium text-[#174545] underline underline-offset-4">
                    تقاريري
                  </Link>
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CircleAlert className="h-12 w-12 text-red-600" />
                <h1 className="text-2xl font-bold">خطأ في الدفع</h1>
                <Link href="/reports" className="text-sm font-medium text-[#174545] underline underline-offset-4">
                  عودة
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 4;

function normalizeLocal(value) {
  let digits = String(value).replace(/\D/g, "");
  if (digits.startsWith("966")) digits = digits.slice(3);
  const strippedZero = digits.startsWith("0");
  if (strippedZero) digits = digits.slice(1);
  return { local: digits.slice(0, 9), strippedZero };
}

function isValidLocal(local) {
  return /^5\d{8}$/.test(local);
}

export default function LoginPage() {
  const [step, setStep] = useState("phone");
  const [local, setLocal] = useState("");
  const [otp, setOtp] = useState("");
  const [hint, setHint] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const phoneInvalid = Boolean(error);
  const displayPhone = local ? `+966 ${local}` : "";

  function handlePhoneChange(value) {
    const { local: next, strippedZero } = normalizeLocal(value);
    setLocal(next);
    setError("");
    setHint(strippedZero ? "لا داعي لإدخال 0 في بداية الرقم" : "");
  }

  function handleSendCode(event) {
    event.preventDefault();
    if (!isValidLocal(local)) {
      setError("أدخل رقم هاتف صالح");
      return;
    }

    setPending(true);
    setError("");
    window.setTimeout(() => {
      setPending(false);
      setOtp("");
      setStep("otp");
    }, 400);
  }

  function handleVerify(event) {
    event.preventDefault();
    if (otp.length !== OTP_LENGTH) {
      setError("أدخل كود التحقق");
      return;
    }

    setError("");
    setPending(true);
    window.setTimeout(() => {
      setPending(false);
    }, 400);
  }

  function handleResend() {
    setOtp("");
    setError("");
    setStep("phone");
  }

  return (
    <main className="flex min-h-[calc(100dvh-5.5rem)] flex-col items-center justify-center px-4 py-6 text-[#002623] sm:min-h-[calc(100dvh-8rem)]">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          {step === "phone" ? "تسجيل الدخول" : "كود التحقق"}
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
        <p className="text-[#757575]">
          {step === "phone" ? "أدخل رقم الجوال لإرسال رمز الدخول." : "أرسلنا رسالة الى رقمك تحوي كود التحقق"}
        </p>
      </div>

      <Card className="w-full max-w-lg rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
        {step === "otp" ? (
          <CardHeader className="gap-3">
            <button
              type="button"
              onClick={handleResend}
              className="inline-flex w-fit cursor-pointer items-center gap-1 text-sm text-[#174545] hover:text-[#002623]"
            >
              <ChevronRight className="size-4" />
              عودة
            </button>
            <p className="text-lg text-[#002623]" dir="ltr">
              {displayPhone}
            </p>
          </CardHeader>
        ) : null}

        {step === "phone" ? (
          <form onSubmit={handleSendCode}>
            <CardContent className="space-y-3">
              <label htmlFor="phoneNumber" className="block text-base font-medium text-[#002623]">
                رقم الجوال
              </label>
              <InputGroup
                dir="ltr"
                className={cn(
                  "h-14 rounded-full border-[#002623]/10 bg-white px-2 text-base shadow-none",
                  phoneInvalid && "border-destructive ring-3 ring-destructive/20"
                )}
              >
                <InputGroupAddon align="inline-start">
                  <InputGroupText className="gap-2 text-base text-[#002623]">
                    <img src="/images/saudi-flag.svg" alt="" className="h-5 w-[1.875rem] shrink-0 rounded-[3px] object-cover" />
                    +966
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  autoFocus
                  maxLength={9}
                  placeholder="5xxxxxxxx"
                  value={local}
                  disabled={pending}
                  aria-invalid={phoneInvalid}
                  onChange={(event) => handlePhoneChange(event.target.value)}
                  className="h-14 text-base text-[#002623] md:text-base"
                />
              </InputGroup>
              {hint ? <p className="text-sm text-[#174545]">{hint}</p> : null}
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
            </CardContent>
            <CardFooter className="flex-col gap-4 pt-6">
              <Button
                type="submit"
                size="lg"
                disabled={pending}
                className="w-full cursor-pointer rounded-full bg-[#002623] py-2 text-white hover:bg-[#1a292e]"
              >
                إرسال الرمز
              </Button>
              <p className="text-sm text-[#757575]">
                ليس لديك حساب؟ <span className="font-medium text-[#174545]">إنشاء حساب</span>
              </p>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <CardContent className="space-y-4">
              <label className="block text-base font-medium text-[#002623]">كود التحقق</label>
              <div dir="ltr" className="flex justify-center">
                <InputOTP
                  maxLength={OTP_LENGTH}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={otp}
                  onChange={(value) => {
                    setOtp(value);
                    setError("");
                  }}
                  disabled={pending}
                  containerClassName="justify-center"
                  aria-label="كود التحقق"
                >
                  <InputOTPGroup className="gap-2">
                    {Array.from({ length: OTP_LENGTH }, (_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        aria-invalid={Boolean(error)}
                        className="size-14 rounded-2xl border border-[#002623]/15 bg-white text-lg first:rounded-2xl first:border-l last:rounded-2xl data-[active=true]:border-[#002623] data-[active=true]:ring-[#428177]/30"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {error ? <p className="text-center text-sm text-destructive">{error}</p> : null}
            </CardContent>
            <CardFooter className="flex-col gap-4 pt-6">
              <Button
                type="submit"
                size="lg"
                disabled={pending || otp.length !== OTP_LENGTH}
                className="w-full cursor-pointer rounded-full bg-[#002623] py-2 text-white hover:bg-[#1a292e]"
              >
                تحقق
              </Button>
              <p className="text-sm text-[#757575]">
                لم يصلك الرمز؟{" "}
                <button type="button" onClick={handleResend} className="cursor-pointer font-medium text-[#174545] hover:text-[#002623]">
                  إعادة طلب
                </button>
              </p>
            </CardFooter>
          </form>
        )}
      </Card>
    </main>
  );
}

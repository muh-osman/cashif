"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { applyLoginSession, getApiErrorText, loginWithOtp, sendOtp } from "@/lib/auth";
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

function formatSaudiPhone(local) {
  if (!local) return "";
  const prefix = local.slice(0, 2);
  const mid = local.slice(2, 5);
  const last = local.slice(5);
  return [`+966`, prefix, mid, last].filter(Boolean).join(" ");
}

function toApiPhone(local) {
  return `0${local}`;
}

function redirectAfterLogin(from) {
  if (!from) return "/";
  return from.startsWith("/") ? from : `/${from}`;
}

export default function LoginPage() {
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();
  const [step, setStep] = useState("phone");
  const [local, setLocal] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [fromPath, setFromPath] = useState("/");

  const phoneInvalid = Boolean(error) && step === "phone";
  const displayPhone = formatSaudiPhone(local);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    const phone = params.get("phone");

    if (from) setFromPath(redirectAfterLogin(from));
    if (phone) setLocal(normalizeLocal(phone).local);
  }, []);

  function handlePhoneChange(value) {
    const { local: next, strippedZero } = normalizeLocal(value);
    setLocal(next);
    setError("");
    if (strippedZero) {
      toast.warning("لا داعي لإدخال 0 في بداية الرقم");
    }
  }

  function handlePhonePaste(event) {
    const pasted = event.clipboardData?.getData("text") ?? "";
    if (!pasted) return;
    event.preventDefault();
    handlePhoneChange(pasted);
  }

  async function handleSendCode(event) {
    event.preventDefault();
    if (!isValidLocal(local)) {
      setError("أدخل رقم هاتف صالح");
      toast.warning("أدخل رقم هاتف صالح");
      return;
    }

    setPending(true);
    setError("");

    try {
      const { ok, data } = await sendOtp(toApiPhone(local));

      if (!ok || data?.status === false) {
        const message = getApiErrorText(data) || "تعذر إرسال الرمز";
        setError(message);
        toast.error(message);
        return;
      }

      setOtp("");
      setStep("otp");
    } catch (err) {
      const message = getApiErrorText(err) || "تعذر إرسال الرمز";
      setError(message);
      toast.error(message);
    } finally {
      setPending(false);
    }
  }

  async function handleVerify(event) {
    event.preventDefault();
    if (otp.length !== OTP_LENGTH) {
      setError("أدخل كود التحقق");
      return;
    }

    setError("");
    setPending(true);

    try {
      const { ok, data } = await loginWithOtp({
        phoneNumber: toApiPhone(local),
        otp,
      });

      if (!ok || data?.status === false || !data?.token) {
        const message = getApiErrorText(data) || "كود التحقق غير صحيح";
        setError(message);
        toast.error(message);
        return;
      }

      applyLoginSession(data.token);
      setIsLoggedIn(true);
      router.replace(fromPath);
      router.refresh();
    } catch (err) {
      const message = getApiErrorText(err) || "كود التحقق غير صحيح";
      setError(message);
      toast.error(message);
    } finally {
      setPending(false);
    }
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
        {step === "otp" && displayPhone ? (
          <p
            dir="ltr"
            className="mx-auto inline-flex rounded-full border border-[#002623]/15 bg-white px-4 py-1.5 text-sm tracking-wide text-[#002623]"
          >
            {displayPhone}
          </p>
        ) : null}
      </div>

      <Card className="w-full max-w-lg rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">

        {step === "phone" ? (
          <form onSubmit={handleSendCode}>
            <CardContent className="space-y-3">
              <label htmlFor="phoneNumber" className="block text-base font-medium text-[#002623]">
                رقم الجوال
              </label>
              <InputGroup
                dir="ltr"
                data-disabled={pending}
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
                  maxLength={16}
                  placeholder="5xxxxxxxx"
                  value={local}
                  disabled={pending}
                  aria-invalid={phoneInvalid}
                  onChange={(event) => handlePhoneChange(event.target.value)}
                  onPaste={handlePhonePaste}
                  className="h-14 text-base text-[#002623] md:text-base"
                />
              </InputGroup>
            </CardContent>
            <CardFooter className="flex-col gap-4 pt-6">
              <Button
                type="submit"
                size="lg"
                disabled={pending || local.length !== 9}
                className="w-full cursor-pointer rounded-full bg-[#002623] py-2 text-white hover:bg-[#1a292e] disabled:pointer-events-auto disabled:cursor-not-allowed"
              >
                {pending ? "جاري الإرسال..." : "إرسال الرمز"}
              </Button>
              <p className="text-sm text-[#757575]">
                ليس لديك حساب؟ <span className="font-medium text-[#174545]">إنشاء حساب</span>
              </p>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <CardContent>
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
                  <InputOTPGroup className="gap-2 rounded-none has-aria-invalid:border-transparent has-aria-invalid:ring-0">
                    {Array.from({ length: OTP_LENGTH }, (_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        aria-invalid={Boolean(error)}
                        className="size-14 rounded-2xl border border-[#002623]/15 bg-white text-lg shadow-none first:rounded-2xl first:border-l last:rounded-2xl aria-invalid:border-destructive aria-invalid:ring-0 data-[active=true]:border-[#002623] data-[active=true]:ring-0 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-0"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4 pt-6">
              <Button
                type="submit"
                size="lg"
                disabled={pending || otp.length !== OTP_LENGTH}
                className="w-full cursor-pointer rounded-full bg-[#002623] py-2 text-white hover:bg-[#1a292e] disabled:pointer-events-auto disabled:cursor-not-allowed"
              >
                {pending ? "جاري التحقق..." : "تحقق"}
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

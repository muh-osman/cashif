"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { getApiErrorText, registerOrganizationAccount } from "@/lib/auth";
import { getRecaptchaToken, preloadRecaptcha } from "@/lib/recaptcha";
import { cn } from "@/lib/utils";

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

function toApiPhone(local) {
  return `0${local}`;
}

function redirectAfterLogin(from) {
  if (!from) return "/";
  return from.startsWith("/") ? from : `/${from}`;
}

const inputClass =
  "h-13 rounded-full border-[#002623]/10 bg-white px-4 text-base shadow-none md:text-base";

export default function OrganizationSignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [local, setLocal] = useState("");
  const [address, setAddress] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [commerialRecord, setCommerialRecord] = useState("");
  const [fromPath, setFromPath] = useState("/");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const phoneInvalid = error === "phone";
  const loginHref = `/login${fromPath !== "/" ? `?from=${encodeURIComponent(fromPath)}` : ""}`;
  const canSubmit =
    name.trim() && local.length === 9 && address.trim() && taxNumber.trim() && commerialRecord.trim();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    const phone = params.get("phone");

    if (from) setFromPath(redirectAfterLogin(from));
    if (phone) setLocal(normalizeLocal(phone).local);

    preloadRecaptcha();
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

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedAddress = address.trim();
    const trimmedTax = taxNumber.trim();
    const trimmedRecord = commerialRecord.trim();

    if (!trimmedName || !trimmedAddress || !trimmedTax || !trimmedRecord) {
      toast.warning("أكمل جميع الحقول المطلوبة");
      return;
    }

    if (!isValidLocal(local)) {
      setError("phone");
      toast.warning("أدخل رقم هاتف صالح");
      return;
    }

    const phoneNumber = toApiPhone(local);

    setPending(true);
    setError("");

    try {
      const recaptchaToken = await getRecaptchaToken("register_organization");
      const { ok, data: responseData } = await registerOrganizationAccount({
        name: trimmedName,
        phoneNumber,
        address: trimmedAddress,
        taxNumber: trimmedTax,
        commerialRecord: trimmedRecord,
        recaptchaToken,
      });

      const phoneExists = responseData?.code === 421;

      if (!ok || phoneExists) {
        const message = getApiErrorText(responseData) || "تعذر إنشاء الحساب";
        setError(phoneExists ? "phone" : message);
        toast.error(message);
        return;
      }

      toast.success(getApiErrorText(responseData) || "تم إنشاء الحساب بنجاح");

      const params = new URLSearchParams({ phone: phoneNumber });
      if (fromPath !== "/") params.set("from", fromPath);
      router.push(`/login?${params.toString()}`);
    } catch (err) {
      const message = getApiErrorText(err) || "تعذر إنشاء الحساب";
      setError(message);
      toast.error(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100dvh-5.5rem)] flex-col items-center justify-center px-4 pt-6 pb-28 text-[#002623] sm:min-h-[calc(100dvh-8rem)] sm:pb-36">
      <div className="mb-8 space-y-3 text-center">
        <h1 className="font-display relative inline-block text-3xl text-[#002623]">
          حساب مؤسسات
          <span className="absolute bottom-[1px] left-0 -z-10 h-[14px] w-full bg-[#e6d39c]" />
        </h1>
        <p className="text-[#757575]">أنشئ حساب مؤسستك للمتابعة</p>
      </div>

      <Card className="w-full max-w-lg rounded-[40px] border-none shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label htmlFor="name" className="block text-base font-medium text-[#002623]">
                اسم الشركة أو المؤسسة
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="organization"
                dir="auto"
                placeholder="اسم الشركة أو المؤسسة"
                value={name}
                disabled={pending}
                onChange={(event) => {
                  setName(event.target.value);
                  setError("");
                }}
                className={inputClass}
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="phoneNumber" className="block text-base font-medium text-[#002623]">
                رقم الجوال
              </label>
              <InputGroup
                dir="ltr"
                data-disabled={pending}
                className={cn(
                  "h-13 rounded-full border-[#002623]/10 bg-white px-2 text-base shadow-none",
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
                  className="h-13 text-base text-[#002623] md:text-base"
                />
              </InputGroup>
            </div>

            <div className="space-y-3">
              <label htmlFor="address" className="block text-base font-medium text-[#002623]">
                عنوان الشركة أو المؤسسة
              </label>
              <Input
                id="address"
                name="address"
                type="text"
                autoComplete="street-address"
                dir="auto"
                placeholder="العنوان"
                value={address}
                disabled={pending}
                onChange={(event) => {
                  setAddress(event.target.value);
                  setError("");
                }}
                className={inputClass}
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="taxNumber" className="block text-base font-medium text-[#002623]">
                الرقم الضريبي
              </label>
              <Input
                id="taxNumber"
                name="taxNumber"
                type="tel"
                inputMode="numeric"
                dir="auto"
                placeholder="الرقم الضريبي"
                value={taxNumber}
                disabled={pending}
                onChange={(event) => {
                  setTaxNumber(event.target.value);
                  setError("");
                }}
                className={inputClass}
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="commerialRecord" className="block text-base font-medium text-[#002623]">
                السجل التجاري
              </label>
              <Input
                id="commerialRecord"
                name="commerialRecord"
                type="text"
                dir="auto"
                placeholder="السجل التجاري"
                value={commerialRecord}
                disabled={pending}
                onChange={(event) => {
                  setCommerialRecord(event.target.value);
                  setError("");
                }}
                className={inputClass}
              />
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-4 pt-6">
            <Button
              type="submit"
              size="lg"
              disabled={pending || !canSubmit}
              className="w-full cursor-pointer rounded-full bg-[#002623] py-2 text-white hover:bg-[#1a292e] disabled:pointer-events-auto disabled:cursor-not-allowed"
            >
              {pending ? "جاري الإنشاء..." : "إنشاء حساب"}
            </Button>
            <p className="text-sm text-[#757575]">
              لديك حساب؟{" "}
              <Link href={loginHref} className="font-medium text-[#174545] hover:text-[#002623]">
                تسجيل الدخول
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}

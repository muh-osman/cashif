import { forwardApiResponse, getApiUrl } from "@/lib/api-url";
import { verifyRecaptchaToken } from "@/lib/recaptcha";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const phoneNumber = String(body?.phoneNumber ?? "").trim();
  const recaptchaToken = String(body?.recaptchaToken ?? "").trim();

  if (!phoneNumber) {
    return Response.json({ message: "رقم الجوال مطلوب" }, { status: 400 });
  }

  const captcha = await verifyRecaptchaToken(recaptchaToken, "send_otp");
  if (!captcha.ok) {
    return Response.json({ message: captcha.message || "فشل التحقق من reCAPTCHA" }, { status: 403 });
  }

  try {
    const response = await fetch(getApiUrl(`api/Account/sendOtp?phoneNumber=${encodeURIComponent(phoneNumber)}`), {
      cache: "no-store",
    });
    return forwardApiResponse(response);
  } catch (error) {
    return Response.json({ message: error.message || "حدث خطأ" }, { status: 500 });
  }
}

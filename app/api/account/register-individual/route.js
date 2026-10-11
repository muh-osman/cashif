import { forwardApiResponse, getApiUrl } from "@/lib/api-url";
import { verifyRecaptchaToken } from "@/lib/recaptcha";

export async function POST(request) {
  const body = await request.json().catch(() => null);

  const name = String(body?.name ?? "").trim();
  const phoneNumber = String(body?.phoneNumber ?? "").trim();
  const recaptchaToken = String(body?.recaptchaToken ?? "").trim();

  if (!name || !phoneNumber) {
    return Response.json({ message: "الاسم ورقم الجوال مطلوبان" }, { status: 400 });
  }

  const captcha = await verifyRecaptchaToken(recaptchaToken, "register_individual");
  if (!captcha.ok) {
    return Response.json({ message: captcha.message || "فشل التحقق من reCAPTCHA" }, { status: 403 });
  }

  try {
    const response = await fetch(getApiUrl("api/Clients/RegisterIndividualClient"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json-patch+json",
      },
      body: JSON.stringify({ name, phoneNumber }),
      cache: "no-store",
    });
    return forwardApiResponse(response);
  } catch (error) {
    return Response.json({ message: error.message || "حدث خطأ" }, { status: 500 });
  }
}

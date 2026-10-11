import { forwardApiResponse, getApiUrl } from "@/lib/api-url";
import { verifyRecaptchaToken } from "@/lib/recaptcha";

export async function POST(request) {
  const body = await request.json().catch(() => null);

  const name = String(body?.name ?? "").trim();
  const phoneNumber = String(body?.phoneNumber ?? "").trim();
  const address = String(body?.address ?? "").trim();
  const taxNumber = String(body?.taxNumber ?? "").trim();
  const commerialRecord = String(body?.commerialRecord ?? "").trim();
  const recaptchaToken = String(body?.recaptchaToken ?? "").trim();

  if (!name || !phoneNumber || !address || !taxNumber || !commerialRecord) {
    return Response.json({ message: "جميع الحقول مطلوبة" }, { status: 400 });
  }

  const captcha = await verifyRecaptchaToken(recaptchaToken, "register_organization");
  if (!captcha.ok) {
    return Response.json({ message: captcha.message || "فشل التحقق من reCAPTCHA" }, { status: 403 });
  }

  try {
    const response = await fetch(getApiUrl("api/Clients/RegisterCompanyClient"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json-patch+json",
      },
      body: JSON.stringify({ name, phoneNumber, address, taxNumber, commerialRecord }),
      cache: "no-store",
    });
    return forwardApiResponse(response);
  } catch (error) {
    return Response.json({ message: error.message || "حدث خطأ" }, { status: 500 });
  }
}

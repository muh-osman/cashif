import { forwardApiResponse, getApiUrl } from "@/lib/api-url";

export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (!body?.phoneNumber || !body?.otp) {
    return Response.json({ message: "رقم الجوال وكود التحقق مطلوبان" }, { status: 400 });
  }

  try {
    const response = await fetch(getApiUrl("api/Account/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json-patch+json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    return forwardApiResponse(response);
  } catch (error) {
    return Response.json({ message: error.message || "حدث خطأ" }, { status: 500 });
  }
}

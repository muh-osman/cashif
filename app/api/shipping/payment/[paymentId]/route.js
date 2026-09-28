const PAYMENT_ID = /^[a-zA-Z0-9-]{8,80}$/;

export async function GET(_request, { params }) {
  const { paymentId } = await params;

  if (!paymentId || !PAYMENT_ID.test(paymentId)) {
    return Response.json({ message: "معرّف الدفع غير صالح" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://cashif.cc/payment-system/back-end/public/api/get-shipping-payment-id-by-paymentId/${encodeURIComponent(paymentId)}`,
      { cache: "no-store", headers: { Accept: "application/json" } }
    );
    const text = await response.text();

    return new Response(text || "null", {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return Response.json({ message: error.message || "تعذر تجهيز طلب الشحن" }, { status: 500 });
  }
}

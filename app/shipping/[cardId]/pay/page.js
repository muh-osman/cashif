import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ShippingPay } from "@/components/shipping-pay";
import { hasAuthCookieFromStore } from "@/lib/auth";

export default async function ShippingPayPage({ params, searchParams }) {
  const { cardId } = await params;
  const query = await searchParams;
  const to = typeof query.to === "string" ? query.to : "";
  const shippingType = typeof query.shipping_type === "string" ? query.shipping_type : "";
  const deliveryMethod = typeof query.delivery_method === "string" ? query.delivery_method : "";
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    const from = `/shipping/${cardId}/pay?${new URLSearchParams({
      to,
      shipping_type: shippingType,
      delivery_method: deliveryMethod,
    }).toString()}`;
    redirect(`/login?from=${encodeURIComponent(from)}`);
  }

  return <ShippingPay cardId={cardId} to={to} shippingType={shippingType} deliveryMethod={deliveryMethod} />;
}

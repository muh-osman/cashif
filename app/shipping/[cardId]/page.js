import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ShippingForm } from "@/components/shipping-form";
import { hasAuthCookieFromStore } from "@/lib/auth";

export default async function ShippingPage({ params }) {
  const { cardId } = await params;
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    redirect(`/login?from=${encodeURIComponent(`/shipping/${cardId}`)}`);
  }

  return <ShippingForm cardId={cardId} />;
}

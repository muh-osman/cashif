import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hasAuthCookieFromStore } from "@/lib/auth";

export const metadata = {
  title: "طلباتي | كاشف لفحص السيارات",
  description: "عرض طلبات الفحص الخاصة بك.",
};

export default async function OrdersLayout({ children }) {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    redirect("/login?from=/orders");
  }

  return children;
}

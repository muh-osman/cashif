import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hasAuthCookieFromStore } from "@/lib/auth";

export const metadata = {
  title: "فالك | كاشف لفحص السيارات",
  description: "برنامج فالك للتسويق بالعمولة. روّج لخدمات فحص السيارات واكسب عمولة على كل عملية فحص.",
};

export default async function FalkLayout({ children }) {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    redirect("/login?from=/falk");
  }

  return children;
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hasAuthCookieFromStore } from "@/lib/auth";

export const metadata = {
  title: "تقاريري | كاشف لفحص السيارات",
  description: "عرض تقارير فحص السيارات الخاصة بك.",
};

export default async function ReportsLayout({ children }) {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    redirect("/login?from=/reports");
  }

  return children;
}

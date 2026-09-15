import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hasAuthCookieFromStore } from "@/lib/auth";

export const metadata = {
  title: "فيديو التقرير | كاشف لفحص السيارات",
  description: "عرض فيديو فحص السيارة الخاص بك.",
};

export default async function VideosLayout({ children }) {
  const cookieStore = await cookies();

  if (!hasAuthCookieFromStore(cookieStore)) {
    redirect("/login?from=/reports");
  }

  return children;
}

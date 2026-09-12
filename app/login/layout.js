import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hasAuthCookieFromStore } from "@/lib/auth";

export const metadata = {
  title: "تسجيل الدخول | كاشف لفحص السيارات",
  description: "سجّل دخولك برقم الجوال السعودي، ثم أدخل كود التحقق المرسل إليك.",
};

export default async function LoginLayout({ children }) {
  const cookieStore = await cookies();

  if (hasAuthCookieFromStore(cookieStore)) {
    redirect("/");
  }

  return children;
}

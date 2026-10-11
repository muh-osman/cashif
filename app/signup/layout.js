import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hasAuthCookieFromStore } from "@/lib/auth";

export const metadata = {
  title: "إنشاء حساب | كاشف لفحص السيارات",
  description: "أنشئ حسابك في كاشف كفرد أو كمؤسسة.",
};

export default async function SignupLayout({ children }) {
  const cookieStore = await cookies();

  if (hasAuthCookieFromStore(cookieStore)) {
    redirect("/");
  }

  return children;
}

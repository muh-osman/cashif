import { cookies } from "next/headers";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { hasAuthCookieFromStore } from "@/lib/auth";

export const metadata = {
  title: "كاشف لفحص السيارات",
  description: "مركز متخصص في فحص السيارات المستعملة، يقدم مفهومًا جديدًا يواكب أحدث التقنيات ليساعدك في قرار الشراء",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const isLoggedIn = hasAuthCookieFromStore(cookieStore);

  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
      <body className="font-sans antialiased">
        <SiteShell isLoggedIn={isLoggedIn}>{children}</SiteShell>
      </body>
    </html>
  );
}

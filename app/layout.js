import "./globals.css";
import { SiteShell } from "@/components/site-shell";

export const metadata = {
  title: "كاشف لفحص السيارات",
  description: "مركز متخصص في فحص السيارات المستعملة، يقدم مفهومًا جديدًا يواكب أحدث التقنيات ليساعدك في قرار الشراء",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
      <body className="font-sans antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}

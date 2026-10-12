import { cookies } from "next/headers";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { hasAuthCookieFromStore } from "@/lib/auth";

const SITE_URL = "https://cashif.cc";
const SITE_TITLE = "كاشف لفحص السيارات";
const SITE_DESCRIPTION =
  "مركز متخصص في فحص السيارات المستعملة، يقدم مفهومًا جديدًا يواكب أحدث التقنيات ليساعدك في قرار الشراء";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: SITE_URL,
    siteName: "كاشف",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/og.jpg",
        width: 1024,
        height: 576,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/images/og.jpg"],
  },
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

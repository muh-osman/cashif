import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Link from "next/link";

export const metadata = {
  title: "كاشف لفحص السيارات",
  description: "مركز متخصص في فحص السيارات المستعملة، يقدم مفهومًا جديدًا يواكب أحدث التقنيات ليساعدك في قرار الشراء",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans antialiased">
        {/* <nav style={{ display: "flex", gap: "12px" }}>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/posts">Posts</Link>
        </nav> */}

        {children}
      </body>
    </html>
  );
}

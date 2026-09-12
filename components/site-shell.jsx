"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { StickySearch } from "@/components/sticky-search";
import { WhatsAppButton } from "@/components/whatsapp-button";

export function SiteShell({ children }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const hideSearch = isHome || pathname === "/login" || pathname.startsWith("/login/");

  useEffect(() => {
    const toTop = () => window.scrollTo(0, 0);
    toTop();
    const frame = requestAnimationFrame(toTop);
    const timer = setTimeout(toTop, 450);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [pathname]);

  return (
    <>
      {!hideSearch && <StickySearch />}
      <div className={hideSearch ? undefined : "pt-24"}>{children}</div>
      <WhatsAppButton />
      <MobileBottomNav />
    </>
  );
}

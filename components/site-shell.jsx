"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { StickySearch } from "@/components/sticky-search";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { WhatsAppButton } from "@/components/whatsapp-button";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function scrollPageToTop() {
  const html = document.documentElement;
  const previous = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  // Chrome ignores a scroll-behavior change until the next layout.
  void html.offsetHeight;
  html.scrollTop = 0;
  document.body.scrollTop = 0;
  html.style.scrollBehavior = previous;
}

export function SiteShell({ children, isLoggedIn = false }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const hideSearch = isHome || pathname === "/login" || pathname.startsWith("/login/") || pathname === "/prices" || pathname.startsWith("/prices/");

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  useIsomorphicLayoutEffect(() => {
    scrollPageToTop();
    const frame = requestAnimationFrame(scrollPageToTop);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <AuthProvider initialLoggedIn={isLoggedIn}>
      {!hideSearch && <StickySearch />}
      <div className={hideSearch ? undefined : "pt-24"}>{children}</div>
      <WhatsAppButton />
      <MobileBottomNav />
      <Toaster position="top-center" richColors />
    </AuthProvider>
  );
}

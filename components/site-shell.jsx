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
  html.classList.add("routing-scroll-lock");
  // Chrome ignores a scroll-behavior change until the next layout.
  void html.offsetHeight;
  window.scrollTo(0, 0);
  html.scrollTop = 0;
  document.body.scrollTop = 0;
}

function unlockRoutingScroll() {
  document.documentElement.classList.remove("routing-scroll-lock");
}

function isRecaptchaPage(pathname) {
  return (
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/signup" ||
    pathname.startsWith("/signup/")
  );
}

export function SiteShell({ children, isLoggedIn = false }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const hideSearch = isHome || pathname === "/login" || pathname.startsWith("/login/") || pathname === "/prices" || pathname.startsWith("/prices/");

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("recaptcha-badge-visible", isRecaptchaPage(pathname));
    return () => {
      document.documentElement.classList.remove("recaptcha-badge-visible");
    };
  }, [pathname]);

  useIsomorphicLayoutEffect(() => {
    scrollPageToTop();

    let frame2 = 0;
    const frame1 = requestAnimationFrame(() => {
      scrollPageToTop();
      // Second frame catches post-paint layout (sticky search / loading swap).
      frame2 = requestAnimationFrame(scrollPageToTop);
    });

    // Retries cover async route content replacing app/loading.js after pathname updates.
    const timers = [0, 50, 120, 250].map((ms) => setTimeout(scrollPageToTop, ms));
    const unlockTimer = setTimeout(unlockRoutingScroll, 300);

    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
      timers.forEach(clearTimeout);
      clearTimeout(unlockTimer);
      unlockRoutingScroll();
    };
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

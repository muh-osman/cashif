const SITEVERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const DEFAULT_MIN_SCORE = 0.5;

export function getRecaptchaSiteKey() {
  return (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "").trim();
}

function getRecaptchaSecretKey() {
  return (process.env.RECAPTCHA_SECRET_KEY || "").trim();
}

function getMinScore() {
  const raw = Number(process.env.RECAPTCHA_MIN_SCORE);
  return Number.isFinite(raw) ? raw : DEFAULT_MIN_SCORE;
}

export async function verifyRecaptchaToken(token, expectedAction = "send_otp") {
  const secret = getRecaptchaSecretKey();

  if (!secret) {
    return { ok: false, message: "reCAPTCHA غير مهيأ" };
  }

  if (!token || typeof token !== "string") {
    return { ok: false, message: "تعذر التحقق من reCAPTCHA" };
  }

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret,
        response: token,
      }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!data?.success) {
      return { ok: false, message: "فشل التحقق من reCAPTCHA", data };
    }

    if (expectedAction && data.action && data.action !== expectedAction) {
      return { ok: false, message: "فشل التحقق من reCAPTCHA", data };
    }

    const score = typeof data.score === "number" ? data.score : 0;
    if (score < getMinScore()) {
      return { ok: false, message: "تعذر التحقق من أنك لست روبوتًا", data };
    }

    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: error.message || "فشل التحقق من reCAPTCHA" };
  }
}

function loadRecaptchaScript(siteKey) {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("reCAPTCHA متاح في المتصفح فقط"));
  }

  if (window.grecaptcha?.ready) {
    return new Promise((resolve) => {
      window.grecaptcha.ready(() => resolve(window.grecaptcha));
    });
  }

  const existing = document.querySelector("script[data-recaptcha-v3]");
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => {
        window.grecaptcha.ready(() => resolve(window.grecaptcha));
      });
      existing.addEventListener("error", () => reject(new Error("تعذر تحميل reCAPTCHA")));
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.dataset.recaptchaV3 = "true";
    script.onload = () => {
      if (!window.grecaptcha?.ready) {
        reject(new Error("تعذر تحميل reCAPTCHA"));
        return;
      }
      window.grecaptcha.ready(() => resolve(window.grecaptcha));
    };
    script.onerror = () => reject(new Error("تعذر تحميل reCAPTCHA"));
    document.head.appendChild(script);
  });
}

export async function preloadRecaptcha() {
  const siteKey = getRecaptchaSiteKey();

  if (!siteKey) {
    return;
  }

  try {
    await loadRecaptchaScript(siteKey);
  } catch {
    // Warm-up is best-effort; submit will surface a real error.
  }
}

export async function getRecaptchaToken(action = "send_otp") {
  const siteKey = getRecaptchaSiteKey();

  if (!siteKey) {
    throw new Error("reCAPTCHA غير مهيأ");
  }

  const grecaptcha = await loadRecaptchaScript(siteKey);
  return grecaptcha.execute(siteKey, { action });
}

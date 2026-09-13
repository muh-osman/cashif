const PHONE_NOT_FOUND = "This Phone Not Found | رقم الجوال غير موجود";

const AUTH_COOKIES = [
  { name: "username", path: "/" },
  { name: "userId", path: "/" },
  { name: "phoneNumber", path: "/" },
  { name: "auth", path: "/" },
  { name: "phone", path: "/" },
];

const LEGACY_COOKIES = [
  { name: "username", path: "/dashboard" },
  { name: "userId", path: "/dashboard" },
  { name: "phoneNumber", path: "/dashboard" },
  { name: "tokenApp", path: "/dashboard" },
  { name: "tokenApp", path: "/" },
];

export function decodeJwt(token) {
  const part = token.split(".")[1];

  if (!part) {
    throw new Error("Invalid token");
  }

  const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const json = decodeURIComponent(
    Array.from(atob(padded), (char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`).join("")
  );

  return JSON.parse(json);
}

function writeCookie(name, value, path, expires) {
  document.cookie = `${name}=${encodeURIComponent(value ?? "")}; path=${path}; expires=${expires.toUTCString()}; SameSite=Lax`;
}

export function setAuthCookies({ token, username, userId, phoneNumber, expirationDate }) {
  writeCookie("username", username, "/", expirationDate);
  writeCookie("userId", userId, "/", expirationDate);
  writeCookie("phoneNumber", phoneNumber, "/", expirationDate);
  writeCookie("auth", token, "/", expirationDate);
  writeCookie("phone", "", "/", new Date(0));
  LEGACY_COOKIES.forEach(({ name, path }) => writeCookie(name, "", path, new Date(0)));
}

export function clearAuthCookies() {
  const expired = new Date(0);

  AUTH_COOKIES.forEach(({ name, path }) => {
    writeCookie(name, "", path, expired);
  });
  LEGACY_COOKIES.forEach(({ name, path }) => writeCookie(name, "", path, expired));
}

export function hasAuthCookie() {
  return document.cookie.split("; ").some((row) => row.startsWith("auth="));
}

export function hasAuthCookieFromStore(cookieStore) {
  return Boolean(cookieStore.get("auth")?.value);
}

export function getPhoneNumberFromStore(cookieStore) {
  return cookieStore.get("phoneNumber")?.value ?? "";
}

async function parseApiResponse(response) {
  const text = await response.text().catch(() => "");
  let data = text;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = text;
  }

  return { ok: response.ok, data };
}

export async function sendOtp(phoneNumber) {
  const response = await fetch(`/api/account/send-otp?phoneNumber=${encodeURIComponent(phoneNumber)}`, {
    cache: "no-store",
  });

  return parseApiResponse(response);
}

export function getApiErrorText(data) {
  if (typeof data === "string" && data.trim()) return data;
  if (!data || typeof data !== "object") return "";

  return data.description || data.Message || data.message || data.title || "";
}

export async function loginWithOtp({ phoneNumber, otp }) {
  const response = await fetch("/api/account/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phoneNumber, otp }),
    cache: "no-store",
  });

  return parseApiResponse(response);
}

export function isPhoneNotFound(description) {
  return description === PHONE_NOT_FOUND;
}

export function applyLoginSession(token) {
  const decoded = decodeJwt(token);
  const expirationDate = new Date(decoded.exp * 1000);

  setAuthCookies({
    token,
    username: decoded.Name,
    userId: decoded.clientId,
    phoneNumber: decoded.PhoneNumber,
    expirationDate,
  });
}

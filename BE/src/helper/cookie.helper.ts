import type { CookieOptions } from "express";

const isProd = process.env.NODE_ENV === "production";

// Centralised cookie options. `secure` and `sameSite` switch on env so we
// stop hardcoding `secure: false` at the call sites (which leaks the JWT
// over plaintext HTTP in any non-localhost deploy).
export const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// For clearCookie we drop maxAge so the browser deletes immediately.
export const clearAuthCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "strict" : "lax",
};

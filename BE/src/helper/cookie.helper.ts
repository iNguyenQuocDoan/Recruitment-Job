import type { CookieOptions } from "express";

const isProd = process.env.NODE_ENV === "production";

export const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Spread authCookieOptions so secure/sameSite never silently diverge.
const { maxAge: _dropped, ...clearAuthCookieOptions } = authCookieOptions;
export { clearAuthCookieOptions };

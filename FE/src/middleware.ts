import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Nếu chưa đăng nhập (không có token)
  if (!token) {
    // Nếu đang cố truy cập company-manage, redirect về company login
    if (pathname.startsWith("/company-manage")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Nếu đang cố truy cập user-manage, redirect về user login
    if (pathname.startsWith("/user-manage")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Nếu đã đăng nhập hoặc truy cập route khác, cho phép tiếp tục
  return NextResponse.next();
}

export const config = {
  matcher: ["/company-manage/:path*", "/user-manage/:path*"],
};

"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserIcon,
  BuildingIcon,
  BriefcaseIcon,
  FileLinesIcon,
  LogoutIcon,
  ChevronDownIcon,
} from "@/app/components/icons/Icons";

export const HeaderAccount = () => {
  const { isLogin, infoUser, infoCompany } = useAuth();
  const router = useRouter();

  const handleLogout = async (url: string) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          router.push(url);
        }
      });
  };

  if (!isLogin) {
    return (
      <div className="hidden sm:flex items-center gap-2">
        <Link href="/user/login" className="btn btn-ghost btn-sm !text-white hover:!bg-primary-900">
          Đăng nhập
        </Link>
        <Link href="/user/register" className="btn btn-primary btn-sm">
          Đăng ký
        </Link>
      </div>
    );
  }

  const isUser = !!infoUser;
  const displayName = infoUser?.fullName || infoCompany?.companyName || "Tài khoản";
  const initial = displayName.charAt(0).toUpperCase();

  const userMenu = [
    { name: "Thông tin cá nhân", link: "/user-manage/profile", icon: UserIcon },
    { name: "CV đã gửi", link: "/user-manage/cv/list", icon: FileLinesIcon },
  ];
  const companyMenu = [
    { name: "Thông tin công ty", link: "/company-manage/profile", icon: BuildingIcon },
    { name: "Quản lý job", link: "/company-manage/job/list", icon: BriefcaseIcon },
    { name: "Quản lý CV", link: "/company-manage/cv/list", icon: FileLinesIcon },
  ];
  const menu = isUser ? userMenu : companyMenu;
  const logoutUrl = isUser ? "/user/login" : "/company/login";

  return (
    <div className="relative group">
      <button className="inline-flex items-center gap-2 text-white px-3 h-10 rounded hover:bg-primary-900 transition-colors">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent-500 text-white text-body-sm font-semibold">
          {initial}
        </span>
        <span className="hidden md:inline text-body-sm font-medium max-w-[140px] truncate">
          {displayName}
        </span>
        <ChevronDownIcon className="w-3 h-3 hidden md:inline" />
      </button>
      <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-md shadow-card-floating opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
        <div className="px-4 py-3 border-b border-neutral-100">
          <div className="text-body-sm font-semibold text-neutral-900 truncate">{displayName}</div>
          <div className="text-caption text-neutral-500 mt-0.5">
            {isUser ? "Ứng viên" : "Nhà tuyển dụng"}
          </div>
        </div>
        <ul className="py-1">
          {menu.map((item, idx) => (
            <li key={idx}>
              <Link
                href={item.link}
                className="flex items-center gap-3 px-4 py-2.5 text-body-sm text-neutral-700 hover:bg-neutral-100 hover:text-primary-800 transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t border-neutral-100 pt-1">
          <button
            onClick={() => handleLogout(logoutUrl)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-body-sm text-danger-500 hover:bg-danger-500/5 transition-colors"
          >
            <LogoutIcon className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

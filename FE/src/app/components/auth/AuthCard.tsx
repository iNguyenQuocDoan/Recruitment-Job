import Link from "next/link";
import { BriefcaseIcon } from "@/app/components/icons/Icons";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  role: "user" | "company";
  mode: "login" | "register";
  children: React.ReactNode;
}

export const AuthCard = ({ title, subtitle, role, mode, children }: AuthCardProps) => {
  const switchMode = mode === "login" ? "register" : "login";
  const switchModeLabel = mode === "login" ? "Đăng ký" : "Đăng nhập";
  const switchModeText = mode === "login" ? "Chưa có tài khoản?" : "Đã có tài khoản?";

  const roleSwitchLink = role === "user" ? "/company/login" : "/user/login";
  const roleSwitchLabel = role === "user" ? "Tôi là nhà tuyển dụng" : "Tôi là ứng viên";

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-800 font-extrabold text-heading-md mb-8"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded bg-accent-500">
              <BriefcaseIcon className="w-5 h-5 text-white" />
            </span>
            ITJobs
          </Link>

          <div className="card p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-heading-lg font-bold text-neutral-900">
                {title}
              </h1>
              {subtitle && (
                <p className="text-body-sm text-neutral-500 mt-1">{subtitle}</p>
              )}
            </div>

            {children}

            <div className="mt-6 pt-6 border-t border-neutral-100 text-center text-body-sm text-neutral-600">
              {switchModeText}{" "}
              <Link
                href={`/${role}/${switchMode}`}
                className="text-accent-500 hover:text-accent-600 font-semibold"
              >
                {switchModeLabel}
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href={roleSwitchLink}
              className="text-body-sm text-neutral-500 hover:text-primary-800 font-medium"
            >
              {roleSwitchLabel} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

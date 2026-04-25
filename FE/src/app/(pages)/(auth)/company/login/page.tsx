import { Metadata } from "next";
import FormLogin from "./FormLogin";
import { AuthCard } from "@/app/components/auth/AuthCard";

export const metadata: Metadata = {
  title: "Đăng nhập | Nhà tuyển dụng",
  description: "Đăng nhập tài khoản nhà tuyển dụng",
};

export default function CompanyLoginPage() {
  return (
    <AuthCard
      title="Đăng nhập nhà tuyển dụng"
      subtitle="Quản lý tin tuyển dụng và CV ứng viên"
      role="company"
      mode="login"
    >
      <FormLogin />
    </AuthCard>
  );
}

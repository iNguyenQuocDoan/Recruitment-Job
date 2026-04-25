import { Metadata } from "next";
import FormLogin from "./FormLogin";
import { AuthCard } from "@/app/components/auth/AuthCard";

export const metadata: Metadata = {
  title: "Đăng nhập | Ứng viên",
  description: "Đăng nhập tài khoản ứng viên",
};

export default function UserLoginPage() {
  return (
    <AuthCard
      title="Chào mừng trở lại"
      subtitle="Đăng nhập để tiếp tục tìm kiếm việc làm IT trong mơ"
      role="user"
      mode="login"
    >
      <FormLogin />
    </AuthCard>
  );
}

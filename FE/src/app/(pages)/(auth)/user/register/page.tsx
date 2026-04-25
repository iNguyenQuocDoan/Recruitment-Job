import { Metadata } from "next";
import FormRegister from "./FormRegister";
import { AuthCard } from "@/app/components/auth/AuthCard";

export const metadata: Metadata = {
  title: "Đăng ký | Ứng viên",
  description: "Tạo tài khoản ứng viên mới",
};

export default function UserRegisterPage() {
  return (
    <AuthCard
      title="Tạo tài khoản ứng viên"
      subtitle="Bắt đầu hành trình tìm việc làm IT của bạn"
      role="user"
      mode="register"
    >
      <FormRegister />
    </AuthCard>
  );
}

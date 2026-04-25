import { Metadata } from "next";
import FormRegister from "./FormRegister";
import { AuthCard } from "@/app/components/auth/AuthCard";

export const metadata: Metadata = {
  title: "Đăng ký | Nhà tuyển dụng",
  description: "Đăng ký tài khoản nhà tuyển dụng",
};

export default function CompanyRegisterPage() {
  return (
    <AuthCard
      title="Đăng ký nhà tuyển dụng"
      subtitle="Tiếp cận hàng nghìn ứng viên IT chất lượng"
      role="company"
      mode="register"
    >
      <FormRegister />
    </AuthCard>
  );
}

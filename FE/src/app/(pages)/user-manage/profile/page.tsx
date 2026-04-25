import { Metadata } from "next";
import { FormProfile } from "./FormProfile";

export const metadata: Metadata = {
  title: "Thông tin cá nhân",
  description: "Cập nhật thông tin cá nhân",
};

export default function UserManageProfilePage() {
  return (
    <section className="section-tight">
      <div className="container-page max-w-3xl">
        <div className="mb-6">
          <h1 className="text-heading-lg md:text-display-md font-bold text-neutral-900">
            Thông tin cá nhân
          </h1>
          <p className="text-body-sm text-neutral-500 mt-1">
            Cập nhật hồ sơ để nhà tuyển dụng dễ dàng tìm thấy bạn
          </p>
        </div>
        <div className="card p-6 md:p-8">
          <FormProfile />
        </div>
      </div>
    </section>
  );
}

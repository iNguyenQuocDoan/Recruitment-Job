import { Metadata } from "next";
import { FormProfile } from "./FormProfile";

export const metadata: Metadata = {
  title: "Thông tin công ty",
  description: "Cập nhật thông tin công ty",
};

export default function CompanyManageProfilePage() {
  return (
    <section className="py-10">
      <div className="container-page max-w-4xl">
        <div className="mb-6">
          <h1 className="text-heading-lg md:text-display-md font-bold text-neutral-900">
            Thông tin công ty
          </h1>
          <p className="text-body-sm text-neutral-500 mt-1">
            Cập nhật hồ sơ để thu hút ứng viên phù hợp
          </p>
        </div>
        <div className="card p-6 md:p-8">
          <FormProfile />
        </div>
      </div>
    </section>
  );
}

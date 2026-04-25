import { Metadata } from "next";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { FormCreate } from "./FormCreate";

export const metadata: Metadata = {
  title: "Đăng tin tuyển dụng",
  description: "Tạo tin tuyển dụng mới",
};

export default function CompanyManageJobCreatePage() {
  return (
    <section className="section-tight">
      <div className="container-page max-w-4xl">
        <Link
          href="/company-manage/job/list"
          className="inline-flex items-center gap-2 text-body-sm text-neutral-500 hover:text-accent-500 mb-4 transition-colors"
        >
          <FaArrowLeft className="text-xs" /> Quay lại danh sách
        </Link>

        <div className="card p-6 md:p-8">
          <div className="mb-6 pb-6 border-b border-neutral-100">
            <h1 className="text-heading-lg font-bold text-neutral-900">
              Đăng tin tuyển dụng
            </h1>
            <p className="text-body-sm text-neutral-500 mt-1">
              Điền thông tin chi tiết để thu hút ứng viên phù hợp
            </p>
          </div>

          <FormCreate />
        </div>
      </div>
    </section>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { JobList } from "./JobList";

export const metadata: Metadata = {
  title: "Quản lý công việc",
  description: "Quản lý tin tuyển dụng",
};

export default function CompanyManageJobListPage() {
  return (
    <section className="section-tight">
      <div className="container-page">
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-heading-lg md:text-display-md font-bold text-neutral-900">
              Quản lý việc làm
            </h1>
            <p className="text-body-sm text-neutral-500 mt-1">
              Tạo, chỉnh sửa và quản lý các tin tuyển dụng của bạn
            </p>
          </div>
          <Link href="/company-manage/job/create" className="btn-primary">
            <FaPlus /> Đăng tin mới
          </Link>
        </div>

        <JobList />
      </div>
    </section>
  );
}

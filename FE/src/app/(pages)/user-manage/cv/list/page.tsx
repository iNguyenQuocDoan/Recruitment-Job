import { Metadata } from "next";
import Link from "next/link";
import {
  BriefcaseIcon,
  UserTieIcon,
  CircleCheckIcon,
  TrashIcon,
  EyeIcon,
} from "@/app/components/icons/Icons";

export const metadata: Metadata = {
  title: "CV đã gửi",
  description: "Quản lý CV đã gửi",
};

const STATUS = {
  pending: { label: "Chờ duyệt", className: "tag bg-warning-500/10 border-warning-500/20 text-warning-500" },
  approved: { label: "Đã duyệt", className: "tag bg-success-500/10 border-success-500/20 text-success-600" },
  rejected: { label: "Từ chối", className: "tag bg-danger-500/10 border-danger-500/20 text-danger-500" },
};

export default function UserManageCVListPage() {
  const items = [
    { id: 1, title: "Frontend Engineer (ReactJS)", company: "Công ty ABC", salary: "1.000$ - 1.500$", position: "Fresher", workingForm: "Tại văn phòng", status: "pending" as const },
  ];

  return (
    <section className="section-tight">
      <div className="container-page">
        <div className="mb-8">
          <h1 className="text-heading-lg md:text-display-md font-bold text-neutral-900">
            CV đã gửi
          </h1>
          <p className="text-body-sm text-neutral-500 mt-1">
            Theo dõi trạng thái các CV bạn đã ứng tuyển
          </p>
        </div>

        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {items.map((item) => (
            <div key={item.id} className="card-hover p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <h3 className="text-body-lg font-bold text-neutral-900 line-clamp-2 leading-tight flex-1">
                  {item.title}
                </h3>
                <span className={STATUS[item.status].className}>
                  <CircleCheckIcon className="w-3 h-3 mr-1" /> {STATUS[item.status].label}
                </span>
              </div>

              <div className="text-body-sm text-neutral-500 mb-3">
                <span className="font-medium text-neutral-900">{item.company}</span>
              </div>

              <div className="text-heading-sm font-semibold text-accent-500 mb-3">
                {item.salary}
              </div>

              <div className="flex flex-col gap-2 text-body-sm text-neutral-600 mb-4">
                <div className="inline-flex items-center gap-2">
                  <UserTieIcon className="w-4 h-4 text-neutral-400" /> {item.position}
                </div>
                <div className="inline-flex items-center gap-2">
                  <BriefcaseIcon className="w-4 h-4 text-neutral-400" /> {item.workingForm}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex gap-2">
                <Link href="#" className="flex-1 btn-secondary btn-sm">
                  <EyeIcon className="w-4 h-4" /> Xem
                </Link>
                <button className="btn btn-sm bg-danger-500/10 text-danger-500 hover:bg-danger-500 hover:text-white">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import {
  BriefcaseIcon,
  EyeIcon,
  PhoneIcon,
  UserTieIcon,
  CheckIcon,
  CloseIcon,
  TrashIcon,
} from "@/app/components/icons/Icons";

export const metadata: Metadata = {
  title: "Quản lý CV",
  description: "Quản lý CV ứng viên",
};

export default function CompanyManageCVListPage() {
  const items = [
    {
      id: 1,
      title: "Frontend Engineer (ReactJS)",
      candidate: "Lê Văn A",
      email: "levana@gmail.com",
      phone: "0123456789",
      salary: "1.000$ - 1.500$",
      position: "Fresher",
      workingForm: "Tại văn phòng",
      isViewed: false,
      isApproved: false,
    },
  ];

  return (
    <section className="py-10">
      <div className="container-page">
        <div className="mb-6">
          <h1 className="text-heading-lg md:text-display-md font-bold text-neutral-900">
            Quản lý CV
          </h1>
          <p className="text-body-sm text-neutral-500 mt-1">
            Xem xét và phản hồi CV ứng viên
          </p>
        </div>

        {/* Filter tabs */}
        <div className="card p-2 mb-6 inline-flex flex-wrap gap-1">
          <button className="px-4 h-9 rounded text-body-sm font-medium bg-accent-500 text-white">Tất cả (1)</button>
          <button className="px-4 h-9 rounded text-body-sm font-medium text-neutral-700 hover:bg-neutral-100">Chưa xem</button>
          <button className="px-4 h-9 rounded text-body-sm font-medium text-neutral-700 hover:bg-neutral-100">Chờ duyệt</button>
          <button className="px-4 h-9 rounded text-body-sm font-medium text-neutral-700 hover:bg-neutral-100">Đã duyệt</button>
          <button className="px-4 h-9 rounded text-body-sm font-medium text-neutral-700 hover:bg-neutral-100">Từ chối</button>
        </div>

        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {items.map((item) => (
            <div key={item.id} className="card-hover p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-body-lg font-bold text-neutral-900 line-clamp-1 flex-1">
                  {item.title}
                </h3>
                {!item.isViewed && (
                  <span className="ml-2 inline-block w-2 h-2 rounded-full bg-accent-500" title="Chưa xem" />
                )}
              </div>

              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-neutral-100">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-800 inline-flex items-center justify-center font-semibold">
                  {item.candidate.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-body-sm font-semibold text-neutral-900 truncate">{item.candidate}</div>
                  <div className="text-caption text-neutral-500 truncate">{item.email}</div>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-body-sm text-neutral-600 mb-4">
                <div className="inline-flex items-center gap-2 text-accent-500 font-semibold">
                  <BriefcaseIcon className="w-4 h-4 text-neutral-400" /> {item.salary}
                </div>
                <div className="inline-flex items-center gap-2">
                  <UserTieIcon className="w-4 h-4 text-neutral-400" /> {item.position}
                </div>
                <div className="inline-flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4 text-neutral-400" /> {item.phone}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex flex-wrap gap-2">
                <Link href="#" className="flex-1 btn-secondary btn-sm">
                  <EyeIcon className="w-4 h-4" /> Xem CV
                </Link>
                <button className="btn btn-sm bg-success-500/10 text-success-600 hover:bg-success-500 hover:text-white">
                  <CheckIcon className="w-4 h-4" />
                </button>
                <button className="btn btn-sm bg-warning-500/10 text-warning-500 hover:bg-warning-500 hover:text-white">
                  <CloseIcon className="w-4 h-4" />
                </button>
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

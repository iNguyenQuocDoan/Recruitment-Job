import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeftIcon,
  CheckIcon,
  CloseIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  FilePdfIcon,
} from "@/app/components/icons/Icons";

export const metadata: Metadata = {
  title: "Chi tiết CV",
  description: "Xem chi tiết CV ứng viên",
};

export default function CompanyManageCVDetailPage() {
  return (
    <section className="py-10">
      <div className="container-page">
        <Link
          href="/company-manage/cv/list"
          className="inline-flex items-center gap-2 text-body-sm text-neutral-500 hover:text-accent-500 mb-4 transition-colors"
        >
          <ArrowLeftIcon className="w-3 h-3" /> Quay lại danh sách
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* CV preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                <h1 className="text-heading-md font-bold text-neutral-900">Hồ sơ ứng viên</h1>
                <div className="flex items-center gap-2">
                  <button className="btn btn-sm bg-success-500 text-white hover:bg-success-600">
                    <CheckIcon className="w-4 h-4" /> Duyệt
                  </button>
                  <button className="btn btn-sm bg-warning-500 text-white hover:opacity-90">
                    <CloseIcon className="w-4 h-4" /> Từ chối
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                <div className="flex items-center gap-3 p-3 rounded bg-neutral-50">
                  <UserIcon className="w-5 h-5 text-accent-500" />
                  <div className="min-w-0">
                    <div className="text-caption text-neutral-500">Họ tên</div>
                    <div className="text-body-sm font-semibold text-neutral-900 truncate">Lê Văn A</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded bg-neutral-50">
                  <EnvelopeIcon className="w-5 h-5 text-accent-500" />
                  <div className="min-w-0">
                    <div className="text-caption text-neutral-500">Email</div>
                    <div className="text-body-sm font-semibold text-neutral-900 truncate">levana@gmail.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded bg-neutral-50">
                  <PhoneIcon className="w-5 h-5 text-accent-500" />
                  <div className="min-w-0">
                    <div className="text-caption text-neutral-500">Điện thoại</div>
                    <div className="text-body-sm font-semibold text-neutral-900 truncate">0123 456 789</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-body-lg font-semibold text-neutral-900 inline-flex items-center gap-2">
                    <FilePdfIcon className="w-4 h-4 text-danger-500" /> CV.pdf
                  </h2>
                  <button className="btn-secondary btn-sm">Tải xuống</button>
                </div>
                <div className="aspect-[3/4] bg-neutral-100 rounded-md border border-neutral-200 flex items-center justify-center text-neutral-400 text-body-sm">
                  Preview PDF
                </div>
              </div>
            </div>
          </div>

          {/* Job info */}
          <div className="lg:col-span-1">
            <div className="card p-6 lg:sticky lg:top-20">
              <h2 className="text-heading-sm font-bold text-neutral-900 mb-4">Ứng tuyển vào</h2>

              <h3 className="text-body-md font-semibold text-accent-500 mb-3">
                Frontend Engineer (ReactJS)
              </h3>

              <ul className="space-y-3 text-body-sm">
                <li className="flex justify-between">
                  <span className="text-neutral-500">Mức lương</span>
                  <span className="font-semibold text-neutral-900">1.000$ - 1.500$</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-neutral-500">Cấp bậc</span>
                  <span className="font-semibold text-neutral-900">Fresher</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-neutral-500">Hình thức</span>
                  <span className="font-semibold text-neutral-900">Tại văn phòng</span>
                </li>
              </ul>

              <div className="mt-4 pt-4 border-t border-neutral-100">
                <div className="text-caption text-neutral-500 mb-2">Công nghệ</div>
                <div className="flex flex-wrap gap-2">
                  {["HTML5", "CSS3", "JavaScript", "ReactJS"].map((t) => (
                    <span key={t} className="tag-accent">{t}</span>
                  ))}
                </div>
              </div>

              <Link href="#" className="btn-secondary w-full mt-6">
                Xem chi tiết job
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

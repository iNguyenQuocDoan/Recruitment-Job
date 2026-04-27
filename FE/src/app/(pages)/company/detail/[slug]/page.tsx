/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next";
import Link from "next/link";
import { CardJobItem } from "@/app/components/card/CardJobItem";
import {
  MapPinIcon,
  BuildingIcon,
  UsersIcon,
  ClockIcon,
  BriefcaseIcon,
} from "@/app/components/icons/Icons";

export const metadata: Metadata = {
  title: "Chi tiết công ty",
  description: "Mô tả trang chi tiết công ty...",
};

export default function CompanyDetailPage() {
  return (
    <>
      {/* Cover */}
      <div className="h-40 md:h-56 bg-gradient-to-r from-primary-900 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500 rounded-full blur-3xl" />
        </div>
      </div>

      <section className="container-page -mt-20 md:-mt-24 pb-16 relative">
        {/* Profile */}
        <div className="card p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <img
              src="/assets/images/demo-cong-ty-2.jpg"
              alt="LG CNS Việt Nam"
              className="w-28 h-28 md:w-36 md:h-36 rounded-md object-cover border-4 border-white shadow-card -mt-16 md:-mt-20"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-display-md font-bold text-neutral-900 mb-2">
                LG CNS Việt Nam
              </h1>
              <div className="inline-flex items-center gap-2 text-body-sm text-neutral-500 mb-4">
                <MapPinIcon className="w-4 h-4 text-accent-500" />
                Tầng 15, Keangnam Landmark 72, Mễ Trì, Nam Từ Liêm, Hà Nội
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="tag-primary">Sản phẩm</span>
                <span className="tag-primary">151 - 300 nhân viên</span>
                <span className="tag-primary">6 việc làm</span>
              </div>
            </div>
            <Link href="#jobs" className="btn-primary md:self-center w-full md:w-auto">
              Xem việc làm <BriefcaseIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <InfoCard icon={BuildingIcon} label="Mô hình" value="Sản phẩm" />
          <InfoCard icon={UsersIcon} label="Quy mô" value="151 - 300 nhân viên" />
          <InfoCard icon={ClockIcon} label="Thời gian" value="Thứ 2 - Thứ 6" />
          <InfoCard icon={BriefcaseIcon} label="OT" value="Không có OT" />
        </div>

        {/* About */}
        <div className="card p-6 md:p-8 mt-6">
          <h2 className="text-heading-md font-bold text-neutral-900 mb-4">
            Về công ty
          </h2>
          <div className="text-body-md text-neutral-700 leading-relaxed space-y-3">
            <p>Mô tả chi tiết về công ty sẽ hiển thị tại đây — sứ mệnh, văn hoá làm việc, sản phẩm chính, đối tác, thành tựu nổi bật.</p>
            <p>Phần nội dung này render từ HTML editor (TinyMCE), hỗ trợ định dạng đầy đủ giúp công ty kể câu chuyện thương hiệu sinh động hơn.</p>
          </div>
        </div>

        {/* Jobs */}
        <div id="jobs" className="mt-10">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-heading-lg font-bold text-neutral-900">
                Công ty đang tuyển
              </h2>
              <p className="text-body-sm text-neutral-500 mt-1">
                6 vị trí đang mở
              </p>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            <CardJobItem />
            <CardJobItem />
            <CardJobItem />
          </div>
        </div>
      </section>
    </>
  );
}

const InfoCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) => (
  <div className="card p-4 flex items-center gap-3">
    <div className="w-11 h-11 rounded bg-accent-50 text-accent-500 inline-flex items-center justify-center shrink-0">
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <div className="text-caption text-neutral-500">{label}</div>
      <div className="text-body-sm font-semibold text-neutral-900 truncate">{value}</div>
    </div>
  </div>
);

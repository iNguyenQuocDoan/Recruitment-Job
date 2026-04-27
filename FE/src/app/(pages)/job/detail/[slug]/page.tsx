/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRightIcon,
  BriefcaseIcon,
  MapPinIcon,
  UserTieIcon,
  ClockIcon,
  BuildingIcon,
  UsersIcon,
  ShareIcon,
  BookmarkIcon,
} from "@/app/components/icons/Icons";

export const metadata: Metadata = {
  title: "Chi tiết công việc",
  description: "Mô tả trang chi tiết công việc...",
};

interface JobDetailDTO {
  _id: string;
  title: string;
  salaryMin?: number;
  salaryMax?: number;
  position?: string;
  workingForm?: string;
  technologies?: string[];
  description?: string;
  images?: string[];
  company?: {
    _id: string;
    companyName: string;
    logo?: string;
    city?: string;
    address?: string;
    companyModel?: string;
    companyEmployees?: string;
    workingTime?: string;
  };
}

const formatSalary = (min?: number, max?: number) => {
  if (!min && !max) return "Thoả thuận";
  const fmt = (v: number) =>
    v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}tr` : v.toLocaleString("vi-VN");
  if (min && max) return `${fmt(min)} - ${fmt(max)}đ`;
  return `${fmt((min ?? max)!)}đ+`;
};

async function getJob(id: string): Promise<JobDetailDTO | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // console.log("[job-detail] fetching", `${apiUrl}/job/detail/${id}`);
  const res = await fetch(`${apiUrl}/job/detail/${id}`, { cache: "no-store" });
  const json = await res.json();
  // console.log("[job-detail] response:", { status: res.status, code: json.code });

  if (res.status === 404 || json.code !== "success") return null;
  return json.data as JobDetailDTO;
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) notFound();

  const company = job.company;
  const logo = company?.logo || "/assets/images/demo-cong-ty-1.png";
  const companyName = company?.companyName || "—";
  const fullAddress = company?.address
    ? `${company.address}${company.city ? `, ${company.city}` : ""}`
    : company?.city || "—";

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-100">
        <div className="container-page py-4">
          <nav className="flex items-center gap-2 text-body-sm text-neutral-500">
            <Link href="/" className="hover:text-accent-500">Trang chủ</Link>
            <span>/</span>
            <Link href="/search" className="hover:text-accent-500">Việc làm</Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium truncate">{job.title}</span>
          </nav>
        </div>
      </div>

      <section className="py-10">
        <div className="container-page">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left col */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job header */}
              <div className="card p-6 md:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="shrink-0 w-20 h-20 rounded-md bg-white border border-neutral-200 p-2 flex items-center justify-center">
                    <img src={logo} alt={companyName} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-heading-md md:text-heading-lg font-bold text-neutral-900 leading-tight">
                      {job.title}
                    </h1>
                    {company?._id && (
                      <Link
                        href={`/company/detail/${company._id}`}
                        className="text-body-md text-neutral-600 hover:text-accent-500 mt-1 inline-block"
                      >
                        {companyName}
                      </Link>
                    )}
                  </div>
                  <div className="hidden md:flex flex-col gap-2">
                    <button
                      className="w-10 h-10 rounded border border-neutral-200 hover:border-accent-500 hover:text-accent-500 inline-flex items-center justify-center transition-colors"
                      aria-label="Save"
                    >
                      <BookmarkIcon className="w-4 h-4" />
                    </button>
                    <button
                      className="w-10 h-10 rounded border border-neutral-200 hover:border-accent-500 hover:text-accent-500 inline-flex items-center justify-center transition-colors"
                      aria-label="Share"
                    >
                      <ShareIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap mb-6">
                  <span className="text-display-md font-bold text-accent-500">
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </span>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded bg-neutral-50">
                    <UserTieIcon className="w-5 h-5 text-accent-500" />
                    <div>
                      <div className="text-caption text-neutral-500">Cấp bậc</div>
                      <div className="text-body-sm font-semibold text-neutral-900">
                        {job.position || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded bg-neutral-50">
                    <BriefcaseIcon className="w-5 h-5 text-accent-500" />
                    <div>
                      <div className="text-caption text-neutral-500">Hình thức</div>
                      <div className="text-body-sm font-semibold text-neutral-900">
                        {job.workingForm || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded bg-neutral-50">
                    <MapPinIcon className="w-5 h-5 text-accent-500" />
                    <div>
                      <div className="text-caption text-neutral-500">Địa điểm</div>
                      <div className="text-body-sm font-semibold text-neutral-900">
                        {company?.city || "—"}
                      </div>
                    </div>
                  </div>
                </div>

                {job.technologies && job.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.technologies.map((tech) => (
                      <span key={tech} className="tag-accent">{tech}</span>
                    ))}
                  </div>
                )}

                <Link href="#apply" className="btn-primary btn-lg w-full">
                  Ứng tuyển ngay <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>

              {/* Banner images */}
              {job.images && job.images.length > 0 && (
                <div className="card p-6">
                  <h2 className="text-heading-sm font-semibold text-neutral-900 mb-4">Hình ảnh công việc</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {job.images.slice(0, 3).map((src, i) => (
                      <img key={i} src={src} alt="" className="aspect-video object-cover rounded" />
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="card p-6 md:p-8">
                <h2 className="text-heading-md font-bold text-neutral-900 mb-4">Mô tả công việc</h2>
                {job.description ? (
                  <div
                    className="prose text-body-md text-neutral-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                ) : (
                  <p className="text-body-sm text-neutral-500">Chưa có mô tả.</p>
                )}
              </div>

              {/* Apply form (placeholder — sẽ wire POST /cv/submit ở Phase 5) */}
              <div id="apply" className="card p-6 md:p-8">
                <h2 className="text-heading-md font-bold text-neutral-900 mb-2">Ứng tuyển ngay</h2>
                <p className="text-body-sm text-neutral-500 mb-6">Điền thông tin bên dưới để gửi CV cho nhà tuyển dụng</p>
                <form className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-1">
                    <label htmlFor="fullName" className="label">Họ tên *</label>
                    <input id="fullName" type="text" className="input" placeholder="Nguyễn Văn A" />
                  </div>
                  <div className="sm:col-span-1">
                    <label htmlFor="email" className="label">Email *</label>
                    <input id="email" type="email" className="input" placeholder="email@example.com" />
                  </div>
                  <div className="sm:col-span-1">
                    <label htmlFor="phone" className="label">Số điện thoại *</label>
                    <input id="phone" type="tel" className="input" placeholder="0901234567" />
                  </div>
                  <div className="sm:col-span-1">
                    <label htmlFor="fileCV" className="label">CV (PDF) *</label>
                    <input id="fileCV" type="file" accept="application/pdf" className="input p-3 cursor-pointer file:mr-3 file:px-4 file:py-1 file:border-0 file:bg-accent-50 file:text-accent-700 file:rounded-full file:text-body-sm file:font-medium hover:file:bg-accent-100" />
                  </div>
                  <button type="submit" className="sm:col-span-2 btn-primary btn-lg">
                    Gửi CV ứng tuyển <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* Right col */}
            <div className="lg:col-span-1">
              <div className="card p-6 lg:sticky lg:top-20">
                <div className="flex items-center gap-4 pb-6 border-b border-neutral-100">
                  <img src={logo} alt={companyName} className="w-16 h-16 rounded-md object-contain" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-body-lg font-bold text-neutral-900 truncate">{companyName}</h3>
                    {company?._id && (
                      <Link
                        href={`/company/detail/${company._id}`}
                        className="text-body-sm text-accent-500 hover:text-accent-600 inline-flex items-center gap-1 mt-1"
                      >
                        Xem công ty <ArrowRightIcon className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>

                <ul className="py-4 space-y-3 text-body-sm">
                  <li className="flex items-start gap-3">
                    <BuildingIcon className="w-4 h-4 text-accent-500 mt-0.5 shrink-0" />
                    <div className="flex-1 flex justify-between gap-2">
                      <span className="text-neutral-500">Mô hình</span>
                      <span className="font-medium text-neutral-900">{company?.companyModel || "—"}</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <UsersIcon className="w-4 h-4 text-accent-500 mt-0.5 shrink-0" />
                    <div className="flex-1 flex justify-between gap-2">
                      <span className="text-neutral-500">Quy mô</span>
                      <span className="font-medium text-neutral-900">{company?.companyEmployees || "—"}</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ClockIcon className="w-4 h-4 text-accent-500 mt-0.5 shrink-0" />
                    <div className="flex-1 flex justify-between gap-2">
                      <span className="text-neutral-500">Thời gian</span>
                      <span className="font-medium text-neutral-900">{company?.workingTime || "—"}</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPinIcon className="w-4 h-4 text-accent-500 mt-0.5 shrink-0" />
                    <div className="flex-1 flex justify-between gap-2">
                      <span className="text-neutral-500">Địa điểm</span>
                      <span className="font-medium text-neutral-900 text-right">{fullAddress}</span>
                    </div>
                  </li>
                </ul>

                {company?._id && (
                  <Link href={`/company/detail/${company._id}`} className="btn-secondary w-full">
                    Xem chi tiết công ty <ArrowRightIcon className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

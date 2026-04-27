/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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

interface CompanyJobDTO {
  _id: string;
  title: string;
  salaryMin?: number;
  salaryMax?: number;
  position?: string;
  workingForm?: string;
  technologies?: string[];
  images?: string[];
}

interface CompanyDetailDTO {
  _id: string;
  companyName: string;
  logo?: string;
  phone?: string;
  city?: string;
  address?: string;
  companyModel?: string;
  companyEmployees?: string;
  workingTime?: string;
  workOvertime?: string;
  description?: string;
  jobs: CompanyJobDTO[];
}

const formatSalary = (min?: number, max?: number) => {
  if (!min && !max) return "Thoả thuận";
  const fmt = (v: number) =>
    v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}tr` : v.toLocaleString("vi-VN");
  if (min && max) return `${fmt(min)} - ${fmt(max)}đ`;
  return `${fmt((min ?? max)!)}đ+`;
};

async function getCompany(id: string): Promise<CompanyDetailDTO | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // console.log("[company-detail] fetching", `${apiUrl}/job/company/detail/${id}`);
  const res = await fetch(`${apiUrl}/job/company/detail/${id}`, { cache: "no-store" });
  const json = await res.json();
  // console.log("[company-detail] response:", { status: res.status, code: json.code, jobs: json.data?.jobs?.length });

  if (res.status === 404 || json.code !== "success") return null;
  return json.data as CompanyDetailDTO;
}

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await getCompany(slug);
  if (!company) notFound();

  const logo = company.logo || "/assets/images/demo-cong-ty-1.png";
  const fullAddress = company.address
    ? `${company.address}${company.city ? `, ${company.city}` : ""}`
    : company.city || "—";
  const jobCount = company.jobs?.length ?? 0;

  return (
    <>
      {/* Cover */}
      <div className="h-40 md:h-56 bg-gradient-to-r from-primary-900 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500 rounded-full blur-3xl" />
        </div>
      </div>

      <section className="container-page -mt-20 md:-mt-24 pb-12 relative">
        {/* Profile */}
        <div className="card p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <img
              src={logo}
              alt={company.companyName}
              className="w-28 h-28 md:w-36 md:h-36 rounded-md object-contain bg-white border-4 border-white shadow-card -mt-16 md:-mt-20"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-display-md font-bold text-neutral-900 mb-2">
                {company.companyName}
              </h1>
              {fullAddress !== "—" && (
                <div className="inline-flex items-center gap-2 text-body-sm text-neutral-500 mb-4">
                  <MapPinIcon className="w-4 h-4 text-accent-500" />
                  {fullAddress}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {company.companyModel && (
                  <span className="tag-primary">{company.companyModel}</span>
                )}
                {company.companyEmployees && (
                  <span className="tag-primary">{company.companyEmployees} nhân viên</span>
                )}
                <span className="tag-primary">{jobCount} việc làm</span>
              </div>
            </div>
            <Link href="#jobs" className="btn-primary md:self-center w-full md:w-auto">
              Xem việc làm <BriefcaseIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <InfoCard icon={BuildingIcon} label="Mô hình" value={company.companyModel || "—"} />
          <InfoCard icon={UsersIcon} label="Quy mô" value={company.companyEmployees || "—"} />
          <InfoCard icon={ClockIcon} label="Thời gian" value={company.workingTime || "—"} />
          <InfoCard icon={BriefcaseIcon} label="OT" value={company.workOvertime || "—"} />
        </div>

        {/* About */}
        <div className="card p-6 md:p-8 mt-6">
          <h2 className="text-heading-md font-bold text-neutral-900 mb-4">
            Về công ty
          </h2>
          {company.description ? (
            <div
              className="prose text-body-md text-neutral-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: company.description }}
            />
          ) : (
            <p className="text-body-sm text-neutral-500">Chưa có mô tả.</p>
          )}
        </div>

        {/* Jobs */}
        <div id="jobs" className="mt-8">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-heading-lg font-bold text-neutral-900">
                Công ty đang tuyển
              </h2>
              <p className="text-body-sm text-neutral-500 mt-1">
                {jobCount} vị trí đang mở
              </p>
            </div>
          </div>
          {jobCount === 0 ? (
            <p className="text-body-sm text-neutral-500 text-center py-8">
              Công ty chưa đăng tin tuyển dụng nào.
            </p>
          ) : (
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
              {company.jobs.map((j) => (
                <CardJobItem
                  key={j._id}
                  slug={`/job/detail/${j._id}`}
                  logo={company.logo || undefined}
                  title={j.title}
                  companyName={company.companyName}
                  salary={formatSalary(j.salaryMin, j.salaryMax)}
                  position={j.position}
                  workingForm={j.workingForm}
                  city={company.city}
                  technologies={j.technologies}
                />
              ))}
            </div>
          )}
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

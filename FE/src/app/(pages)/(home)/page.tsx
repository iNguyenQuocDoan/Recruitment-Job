import Link from "next/link";
import { CardCompanyItem } from "@/app/components/card/CardCompanyItem";
import { CardJobItem } from "@/app/components/card/CardJobItem";
import {
  ArrowRightIcon,
  SearchIcon,
  BriefcaseIcon,
  BuildingIcon,
  UsersIcon,
} from "@/app/components/icons/Icons";

const HOT_KEYWORDS = ["ReactJS", "NodeJS", "Java", "Python", "DevOps", "AI/ML"];
const STATS = [
  { value: "10K+", label: "Việc làm IT", icon: BriefcaseIcon },
  { value: "500+", label: "Công ty IT", icon: BuildingIcon },
  { value: "50K+", label: "Ứng viên", icon: UsersIcon },
];

interface CompanyDTO {
  _id: string;
  companyName: string;
  logo?: string;
  city?: string;
}

interface JobDTO {
  _id: string;
  title: string;
  salaryMin?: number;
  salaryMax?: number;
  position?: string;
  workingForm?: string;
  technologies?: string[];
  companyName?: string;
  companyLogo?: string;
  companyCity?: string;
}

const formatSalary = (min?: number, max?: number) => {
  if (!min && !max) return "Thoả thuận";
  const fmt = (v: number) =>
    v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}tr` : v.toLocaleString("vi-VN");
  if (min && max) return `${fmt(min)} - ${fmt(max)}đ`;
  return `${fmt((min ?? max)!)}đ+`;
};

async function getHomeData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log("[home] fetching from", apiUrl);

  const [companiesRes, jobsRes] = await Promise.all([
    fetch(`${apiUrl}/job/company/list?limit=3`, { cache: "no-store" }),
    fetch(`${apiUrl}/job/list?limit=6`, { cache: "no-store" }),
  ]);

  const companies = await companiesRes.json();
  const jobs = await jobsRes.json();

  console.log("[home] companies:", {
    code: companies.code,
    count: companies.data?.length,
    total: companies.total,
  });
  console.log("[home] jobs:", {
    code: jobs.code,
    count: jobs.data?.length,
    total: jobs.total,
  });

  return {
    companies: (companies.data ?? []) as CompanyDTO[],
    jobs: (jobs.data ?? []) as JobDTO[],
  };
}

export default async function Home() {
  const { companies, jobs } = await getHomeData();
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-72 h-72 bg-accent-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
        </div>

        <div className="container-page relative py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-body-sm text-white/90 mb-6">
              <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
              Hơn 10.000 việc làm IT đang chờ bạn
            </div>
            <h1 className="text-white font-bold md:text-display-xl text-display-md leading-tight mb-4">
              Tìm việc làm IT <span className="text-accent-400">trong mơ</span> của bạn
            </h1>
            <p className="text-white/80 text-body-lg mb-6 max-w-2xl mx-auto">
              Kết nối với hàng trăm nhà tuyển dụng IT hàng đầu Việt Nam. Khám phá cơ hội nghề nghiệp phù hợp chỉ trong vài cú click.
            </p>

            <form className="bg-white rounded-md shadow-card-floating p-2 flex flex-col md:flex-row gap-2">
              <select className="md:w-56 input bg-neutral-50 border-transparent">
                <option value="">Tất cả thành phố</option>
                <option value="hanoi">Hà Nội</option>
                <option value="hcm">Hồ Chí Minh</option>
                <option value="danang">Đà Nẵng</option>
                <option value="other">Khác</option>
              </select>
              <input
                type="text"
                placeholder="Vị trí, kỹ năng, công ty..."
                className="flex-1 input border-transparent"
              />
              <button type="submit" className="btn-primary md:w-auto w-full">
                <SearchIcon className="w-4 h-4" /> Tìm kiếm
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <span className="text-body-sm text-white/70">Từ khoá hot:</span>
              {HOT_KEYWORDS.map((kw) => (
                <Link
                  key={kw}
                  href={`/search?keyword=${kw}`}
                  className="text-body-sm text-white/90 hover:text-accent-400 px-3 py-1 rounded-full border border-white/20 hover:border-accent-400 transition-colors"
                >
                  {kw}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="container-page relative pb-8">
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center text-white">
                <stat.icon className="w-8 h-8 md:w-10 md:h-10 text-accent-400 mx-auto mb-2" />
                <div className="font-bold md:text-display-md text-heading-md">{stat.value}</div>
                <div className="text-body-sm text-white/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-10">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-heading-lg md:text-display-md text-neutral-900 font-bold">
                Nhà tuyển dụng hàng đầu
              </h2>
              <p className="text-body-md text-neutral-500 mt-2">
                Khám phá các công ty IT đang tuyển dụng tích cực nhất
              </p>
            </div>
            <Link
              href="/company/list"
              className="hidden md:inline-flex items-center gap-2 text-body-md font-medium text-accent-500 hover:text-accent-600 transition-colors shrink-0"
            >
              Xem tất cả <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            {companies.length === 0 ? (
              <p className="col-span-full text-center text-body-sm text-neutral-500 py-8">
                Chưa có công ty nào.
              </p>
            ) : (
              companies.map((c) => (
                <CardCompanyItem
                  key={c._id}
                  slug={`/company/detail/${c._id}`}
                  logo={c.logo || undefined}
                  companyName={c.companyName}
                  city={c.city}
                />
              ))
            )}
          </div>
          <div className="md:hidden mt-6 text-center">
            <Link href="/company/list" className="btn-secondary">
              Xem tất cả công ty <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Hot Jobs */}
      <section className="py-10 bg-white border-t border-neutral-100">
        <div className="container-page">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-heading-lg md:text-display-md text-neutral-900 font-bold">
                Việc làm IT mới nhất
              </h2>
              <p className="text-body-md text-neutral-500 mt-2">
                Cơ hội nghề nghiệp được cập nhật mỗi ngày
              </p>
            </div>
            <Link
              href="/search"
              className="hidden md:inline-flex items-center gap-2 text-body-md font-medium text-accent-500 hover:text-accent-600 transition-colors shrink-0"
            >
              Xem tất cả <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            {jobs.length === 0 ? (
              <p className="col-span-full text-center text-body-sm text-neutral-500 py-8">
                Chưa có việc làm nào.
              </p>
            ) : (
              jobs.map((j) => (
                <CardJobItem
                  key={j._id}
                  slug={`/job/detail/${j._id}`}
                  logo={j.companyLogo || undefined}
                  title={j.title}
                  companyName={j.companyName}
                  salary={formatSalary(j.salaryMin, j.salaryMax)}
                  position={j.position}
                  workingForm={j.workingForm}
                  city={j.companyCity}
                  technologies={j.technologies}
                />
              ))
            )}
          </div>
          <div className="md:hidden mt-6 text-center">
            <Link href="/search" className="btn-secondary">
              Xem tất cả việc làm <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA cho NTD */}
      <section className="py-10">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary-800 to-primary-700 p-8 md:p-12">
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-heading-lg md:text-display-md text-white font-bold leading-tight">
                  Bạn là nhà tuyển dụng?
                </h3>
                <p className="text-body-lg text-white/80 mt-3">
                  Tiếp cận hàng nghìn ứng viên IT chất lượng cao. Đăng tin tuyển dụng và quản lý CV ngay hôm nay.
                </p>
              </div>
              <div className="flex flex-wrap md:justify-end gap-3">
                <Link href="/company/register" className="btn-primary btn-lg">
                  Đăng ký miễn phí
                </Link>
                <Link
                  href="/company/login"
                  className="btn btn-lg !bg-white/10 !text-white border border-white/20 hover:!bg-white/20 backdrop-blur-sm"
                >
                  Đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

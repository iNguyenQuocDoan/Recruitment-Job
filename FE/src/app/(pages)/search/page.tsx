import { Metadata } from "next";
import Link from "next/link";
import { CardJobItem } from "@/app/components/card/CardJobItem";
import {
  SearchIcon,
  SlidersIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/app/components/icons/Icons";

export const metadata: Metadata = {
  title: "Kết quả tìm kiếm",
  description: "Kết quả tìm kiếm công việc...",
};

interface JobDTO {
  _id: string;
  title: string;
  salaryMin?: number;
  salaryMax?: number;
  position?: string;
  workingForm?: string;
  technologies?: string[];
  images?: string[];
  companyName?: string;
  companyLogo?: string;
  companyCity?: string;
}

interface CityDTO {
  _id: string;
  name: string;
}

interface SearchFilters {
  keyword: string;
  city: string;
  position: string;
  workingForm: string;
  page: number;
}

const PAGE_LIMIT = 12;
const POSITION_OPTIONS = ["Intern", "Fresher", "Junior", "Middle", "Senior", "Manager"];
const WORKING_FORM_OPTIONS = ["Toàn thời gian", "Bán thời gian", "Từ xa", "Linh hoạt"];

const formatSalary = (min?: number, max?: number) => {
  if (!min && !max) return "Thoả thuận";
  const fmt = (v: number) =>
    v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}tr` : v.toLocaleString("vi-VN");
  if (min && max) return `${fmt(min)} - ${fmt(max)}đ`;
  return `${fmt((min ?? max)!)}đ+`;
};

async function getJobs(filters: SearchFilters) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const qs = new URLSearchParams({
    page: String(filters.page),
    limit: String(PAGE_LIMIT),
  });
  if (filters.keyword) qs.set("keyword", filters.keyword);
  if (filters.city) qs.set("city", filters.city);
  if (filters.position) qs.set("position", filters.position);
  if (filters.workingForm) qs.set("workingForm", filters.workingForm);

  // console.log("[search] fetching", `${apiUrl}/job/list?${qs}`);
  const res = await fetch(`${apiUrl}/job/list?${qs}`, { cache: "no-store" });
  const json = await res.json();
  // console.log("[search] response:", { code: json.code, total: json.total, page: json.page, count: json.data?.length });

  return {
    items: (json.data ?? []) as JobDTO[],
    total: json.total ?? 0,
    page: json.page ?? filters.page,
    limit: json.limit ?? PAGE_LIMIT,
  };
}

async function getCities(): Promise<CityDTO[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/city/list`, { next: { revalidate: 3600 } });
  const json = await res.json();
  return (json.cityList ?? []) as CityDTO[];
}

const buildHref = (filters: SearchFilters, page: number) => {
  const qs = new URLSearchParams();
  if (filters.keyword) qs.set("keyword", filters.keyword);
  if (filters.city) qs.set("city", filters.city);
  if (filters.position) qs.set("position", filters.position);
  if (filters.workingForm) qs.set("workingForm", filters.workingForm);
  if (page > 1) qs.set("page", String(page));
  const s = qs.toString();
  return s ? `/search?${s}` : "/search";
};

const buildPageList = (current: number, total: number): number[] => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(1, Math.min(current - 2, total - 4));
  return Array.from({ length: 5 }, (_, i) => start + i);
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    keyword?: string;
    city?: string;
    position?: string;
    workingForm?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const filters: SearchFilters = {
    keyword: sp.keyword?.trim() || "",
    city: sp.city || "",
    position: sp.position || "",
    workingForm: sp.workingForm || "",
    page: Math.max(1, parseInt(sp.page || "1", 10) || 1),
  };

  const [data, cities] = await Promise.all([getJobs(filters), getCities()]);
  const totalPages = Math.max(1, Math.ceil(data.total / data.limit));
  const page = Math.min(filters.page, totalPages);
  const pages = buildPageList(page, totalPages);

  const headlineKeyword = filters.keyword || filters.position || "tất cả";

  return (
    <>
      {/* Search bar */}
      <section className="bg-primary-800">
        <div className="container-page py-5">
          <form
            action="/search"
            method="GET"
            className="bg-white rounded-md shadow-card-floating p-2 flex flex-col md:flex-row gap-2"
          >
            <select
              name="city"
              defaultValue={filters.city}
              className="md:w-56 input bg-neutral-50 border-transparent"
            >
              <option value="">Tất cả thành phố</option>
              {cities.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="keyword"
              placeholder="Vị trí, kỹ năng, công ty..."
              defaultValue={filters.keyword}
              className="flex-1 input border-transparent"
            />
            {/* Preserve other filters when submitting search */}
            {filters.position && (
              <input type="hidden" name="position" value={filters.position} />
            )}
            {filters.workingForm && (
              <input type="hidden" name="workingForm" value={filters.workingForm} />
            )}
            <button type="submit" className="btn-primary">
              <SearchIcon className="w-4 h-4" /> Tìm kiếm
            </button>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="pt-6 pb-10">
        <div className="container-page">
          {/* Header */}
          <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
            <div>
              <h1 className="text-heading-md md:text-heading-lg font-bold text-neutral-900">
                {data.total} việc làm{" "}
                <span className="text-accent-500">{headlineKeyword}</span>
              </h1>
              <p className="text-body-sm text-neutral-500 mt-1">
                {data.total > 0
                  ? "Kết quả phù hợp với bộ lọc của bạn"
                  : "Thử điều chỉnh từ khoá hoặc bộ lọc"}
              </p>
            </div>
            <select className="input md:w-52 h-10 text-body-sm" disabled>
              <option>Mới nhất</option>
              <option>Lương cao nhất</option>
              <option>Liên quan nhất</option>
            </select>
          </div>

          {/* Filters — submit cùng URL khi đổi để tự re-fetch */}
          <form
            action="/search"
            method="GET"
            id="filter-form"
            className="card p-4 mb-6 flex flex-wrap items-center gap-3"
          >
            <div className="inline-flex items-center gap-2 text-body-sm font-medium text-neutral-700">
              <SlidersIcon className="w-4 h-4 text-neutral-500" /> Bộ lọc:
            </div>
            {/* Preserve keyword + city when changing filter dropdowns */}
            {filters.keyword && (
              <input type="hidden" name="keyword" value={filters.keyword} />
            )}
            {filters.city && (
              <input type="hidden" name="city" value={filters.city} />
            )}
            <select
              name="position"
              defaultValue={filters.position}
              className="input h-9 w-auto px-4 text-body-sm rounded-full"
            >
              <option value="">Cấp bậc</option>
              {POSITION_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              name="workingForm"
              defaultValue={filters.workingForm}
              className="input h-9 w-auto px-4 text-body-sm rounded-full"
            >
              <option value="">Hình thức</option>
              {WORKING_FORM_OPTIONS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
            <select
              className="input h-9 w-auto px-4 text-body-sm rounded-full"
              disabled
              title="Lọc theo mức lương sẽ được hỗ trợ ở phiên bản sau"
            >
              <option value="">Mức lương</option>
            </select>
            <button
              type="submit"
              className="btn-primary btn-sm"
              title="Áp dụng bộ lọc"
            >
              Áp dụng
            </button>
            {(filters.keyword ||
              filters.city ||
              filters.position ||
              filters.workingForm) && (
              <Link
                href="/search"
                className="ml-auto text-body-sm text-accent-500 hover:text-accent-600 font-medium"
              >
                Xoá bộ lọc
              </Link>
            )}
          </form>

          {/* Job grid */}
          {data.items.length === 0 ? (
            <p className="text-body-sm text-neutral-500 text-center py-12">
              Không tìm thấy việc làm phù hợp.
            </p>
          ) : (
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
              {data.items.map((j) => (
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
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {page > 1 ? (
                <Link
                  href={buildHref(filters, page - 1)}
                  className="w-10 h-10 inline-flex items-center justify-center rounded border border-neutral-200 bg-white text-neutral-500 hover:border-accent-500 hover:text-accent-500 transition-colors"
                  aria-label="Trang trước"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </Link>
              ) : (
                <span className="w-10 h-10 inline-flex items-center justify-center rounded border border-neutral-200 bg-neutral-50 text-neutral-300 cursor-not-allowed">
                  <ChevronLeftIcon className="w-4 h-4" />
                </span>
              )}
              {pages.map((p) => (
                <Link
                  key={p}
                  href={buildHref(filters, p)}
                  className={
                    "w-10 h-10 inline-flex items-center justify-center rounded text-body-sm font-medium transition-colors " +
                    (p === page
                      ? "bg-accent-500 text-white"
                      : "border border-neutral-200 bg-white text-neutral-700 hover:border-accent-500 hover:text-accent-500")
                  }
                >
                  {p}
                </Link>
              ))}
              {page < totalPages ? (
                <Link
                  href={buildHref(filters, page + 1)}
                  className="w-10 h-10 inline-flex items-center justify-center rounded border border-neutral-200 bg-white text-neutral-500 hover:border-accent-500 hover:text-accent-500 transition-colors"
                  aria-label="Trang sau"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
              ) : (
                <span className="w-10 h-10 inline-flex items-center justify-center rounded border border-neutral-200 bg-neutral-50 text-neutral-300 cursor-not-allowed">
                  <ChevronRightIcon className="w-4 h-4" />
                </span>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { CardCompanyItem } from "@/app/components/card/CardCompanyItem";
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/app/components/icons/Icons";

export const metadata: Metadata = {
  title: "Danh sách công ty",
  description: "Khám phá các nhà tuyển dụng IT hàng đầu",
};

interface CompanyDTO {
  _id: string;
  companyName: string;
  logo?: string;
  city?: string;
}

interface PaginatedCompanies {
  items: CompanyDTO[];
  total: number;
  page: number;
  limit: number;
}

const PAGE_LIMIT = 12;

async function getCompanies(page: number): Promise<PaginatedCompanies> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // console.log("[company-list] fetching", `${apiUrl}/job/company/list?page=${page}&limit=${PAGE_LIMIT}`);
  const res = await fetch(
    `${apiUrl}/job/company/list?page=${page}&limit=${PAGE_LIMIT}`,
    { cache: "no-store" },
  );
  const json = await res.json();
  // console.log("[company-list] response:", { code: json.code, total: json.total, page: json.page, count: json.data?.length });

  return {
    items: (json.data ?? []) as CompanyDTO[],
    total: json.total ?? 0,
    page: json.page ?? page,
    limit: json.limit ?? PAGE_LIMIT,
  };
}

const buildPageHref = (p: number) => `/company/list?page=${p}`;

const buildPageList = (current: number, total: number): number[] => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  // Always show 5 pages around current
  const start = Math.max(1, Math.min(current - 2, total - 4));
  return Array.from({ length: 5 }, (_, i) => start + i);
};

export default async function CompanyListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const requestedPage = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const data = await getCompanies(requestedPage);
  const totalPages = Math.max(1, Math.ceil(data.total / data.limit));
  const page = Math.min(requestedPage, totalPages);
  const pages = buildPageList(page, totalPages);

  return (
    <>
      {/* Hero header */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-700 py-6 md:py-8">
        <div className="container-page text-center">
          <h1 className="text-heading-lg md:text-display-sm font-bold text-white mb-1.5">
            Khám phá nhà tuyển dụng
          </h1>
          <p className="text-body-sm md:text-body-md text-white/80 max-w-2xl mx-auto">
            500+ công ty IT đang tuyển dụng tích cực, từ startup đến tập đoàn đa quốc gia
          </p>
          <form className="bg-white rounded-md shadow-card-floating p-2 flex gap-2 mt-5 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Tìm kiếm công ty..."
              className="flex-1 input border-transparent"
              disabled
            />
            <button
              type="submit"
              className="btn-primary"
              disabled
              title="Tìm kiếm theo từ khoá sẽ được hỗ trợ ở phiên bản sau"
            >
              <SearchIcon className="w-4 h-4" /> Tìm kiếm
            </button>
          </form>
        </div>
      </section>

      <section className="pt-6 pb-10">
        <div className="container-page">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="text-body-md text-neutral-600">
              <span className="font-semibold text-neutral-900">{data.total} công ty</span> được tìm thấy
            </div>
            <select className="input md:w-52 h-10 text-body-sm" disabled>
              <option>Mới nhất</option>
              <option>Nhiều việc làm nhất</option>
              <option>A → Z</option>
            </select>
          </div>

          {data.items.length === 0 ? (
            <p className="text-body-sm text-neutral-500 text-center py-12">
              Chưa có công ty nào.
            </p>
          ) : (
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
              {data.items.map((c) => (
                <CardCompanyItem
                  key={c._id}
                  slug={`/company/detail/${c._id}`}
                  logo={c.logo || undefined}
                  companyName={c.companyName}
                  city={c.city}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {page > 1 ? (
                <Link
                  href={buildPageHref(page - 1)}
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
                  href={buildPageHref(p)}
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
                  href={buildPageHref(page + 1)}
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

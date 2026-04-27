import { Metadata } from "next";
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

export default function SearchPage() {
  return (
    <>
      {/* Search bar */}
      <section className="bg-primary-800">
        <div className="container-page py-8">
          <form className="bg-white rounded-md shadow-card-floating p-2 flex flex-col md:flex-row gap-2">
            <select className="md:w-56 input bg-neutral-50 border-transparent">
              <option value="">Tất cả thành phố</option>
              <option value="hanoi">Hà Nội</option>
              <option value="hcm">Hồ Chí Minh</option>
              <option value="danang">Đà Nẵng</option>
            </select>
            <input
              type="text"
              placeholder="Vị trí, kỹ năng, công ty..."
              defaultValue="reactjs"
              className="flex-1 input border-transparent"
            />
            <button type="submit" className="btn-primary">
              <SearchIcon className="w-4 h-4" /> Tìm kiếm
            </button>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="section-tight">
        <div className="container-page">
          {/* Header */}
          <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
            <div>
              <h1 className="text-heading-md md:text-heading-lg font-bold text-neutral-900">
                76 việc làm <span className="text-accent-500">ReactJS</span>
              </h1>
              <p className="text-body-sm text-neutral-500 mt-1">
                Kết quả phù hợp nhất với từ khóa của bạn
              </p>
            </div>
            <select className="input md:w-52 h-10 text-body-sm">
              <option>Mới nhất</option>
              <option>Lương cao nhất</option>
              <option>Liên quan nhất</option>
            </select>
          </div>

          {/* Filters */}
          <div className="card p-4 mb-8 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 text-body-sm font-medium text-neutral-700">
              <SlidersIcon className="w-4 h-4 text-neutral-500" /> Bộ lọc:
            </div>
            <select className="input h-9 w-auto px-4 text-body-sm rounded-full">
              <option value="">Cấp bậc</option>
              <option>Intern</option>
              <option>Fresher</option>
              <option>Junior</option>
              <option>Middle</option>
              <option>Senior</option>
            </select>
            <select className="input h-9 w-auto px-4 text-body-sm rounded-full">
              <option value="">Hình thức</option>
              <option>Tại văn phòng</option>
              <option>Làm từ xa</option>
              <option>Linh hoạt</option>
            </select>
            <select className="input h-9 w-auto px-4 text-body-sm rounded-full">
              <option value="">Mức lương</option>
              <option>Dưới 1.000$</option>
              <option>1.000$ - 2.000$</option>
              <option>Trên 2.000$</option>
            </select>
            <button className="ml-auto text-body-sm text-accent-500 hover:text-accent-600 font-medium">
              Xoá bộ lọc
            </button>
          </div>

          {/* Job grid */}
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            <CardJobItem />
            <CardJobItem />
            <CardJobItem />
            <CardJobItem />
            <CardJobItem />
            <CardJobItem />
          </div>

          {/* Pagination */}
          <div className="mt-10 flex items-center justify-center gap-2">
            <button className="w-10 h-10 inline-flex items-center justify-center rounded border border-neutral-200 bg-white text-neutral-500 hover:border-accent-500 hover:text-accent-500 transition-colors">
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            {[1, 2, 3, 4, 5].map((p) => (
              <button
                key={p}
                className={
                  "w-10 h-10 inline-flex items-center justify-center rounded text-body-sm font-medium transition-colors " +
                  (p === 1
                    ? "bg-accent-500 text-white"
                    : "border border-neutral-200 bg-white text-neutral-700 hover:border-accent-500 hover:text-accent-500")
                }
              >
                {p}
              </button>
            ))}
            <button className="w-10 h-10 inline-flex items-center justify-center rounded border border-neutral-200 bg-white text-neutral-500 hover:border-accent-500 hover:text-accent-500 transition-colors">
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

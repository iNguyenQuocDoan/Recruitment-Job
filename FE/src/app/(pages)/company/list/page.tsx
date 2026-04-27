import { Metadata } from "next";
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

export default function CompanyListPage() {
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
            />
            <button type="submit" className="btn-primary">
              <SearchIcon className="w-4 h-4" /> Tìm kiếm
            </button>
          </form>
        </div>
      </section>

      <section className="pt-6 pb-10">
        <div className="container-page">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="text-body-md text-neutral-600">
              <span className="font-semibold text-neutral-900">86 công ty</span> được tìm thấy
            </div>
            <select className="input md:w-52 h-10 text-body-sm">
              <option>Mới nhất</option>
              <option>Nhiều việc làm nhất</option>
              <option>A → Z</option>
            </select>
          </div>

          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            <CardCompanyItem />
            <CardCompanyItem />
            <CardCompanyItem />
            <CardCompanyItem />
            <CardCompanyItem />
            <CardCompanyItem />
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            <button className="w-10 h-10 inline-flex items-center justify-center rounded border border-neutral-200 bg-white text-neutral-500 hover:border-accent-500 hover:text-accent-500 transition-colors">
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            {[1, 2, 3, 4].map((p) => (
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

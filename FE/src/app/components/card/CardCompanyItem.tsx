/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FaLocationDot, FaUserTie } from "react-icons/fa6";

interface CardCompanyItemProps {
  slug?: string;
  logo?: string;
  companyName?: string;
  city?: string;
  jobCount?: number;
}

export const CardCompanyItem = ({
  slug = "#",
  logo = "/assets/images/demo-cong-ty-1.png",
  companyName = "LG Electronics Development Vietnam (LGEDV)",
  city = "Hồ Chí Minh",
  jobCount = 5,
}: CardCompanyItemProps) => {
  return (
    <Link
      href={slug}
      className="card-hover group flex flex-col items-center text-center p-6 overflow-hidden"
    >
      <div className="w-32 h-32 rounded-md bg-white border border-neutral-200 p-3 flex items-center justify-center mb-4">
        <img
          src={logo}
          alt={companyName}
          className="w-full h-full object-contain"
        />
      </div>

      <h3 className="text-body-lg font-bold text-neutral-900 line-clamp-2 group-hover:text-accent-500 transition-colors mb-3">
        {companyName}
      </h3>

      <div className="mt-auto w-full pt-4 border-t border-neutral-100 flex items-center justify-between gap-3 text-body-sm text-neutral-600">
        <span className="inline-flex items-center gap-1.5">
          <FaLocationDot className="text-neutral-400 text-xs" />
          {city}
        </span>
        <span className="inline-flex items-center gap-1.5 font-medium text-primary-800">
          <FaUserTie className="text-accent-500" />
          {jobCount} việc làm
        </span>
      </div>
    </Link>
  );
};

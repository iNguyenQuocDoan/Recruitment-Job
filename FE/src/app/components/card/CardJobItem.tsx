/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FaBriefcase, FaLocationDot, FaUserTie, FaArrowRight } from "react-icons/fa6";

interface CardJobItemProps {
  slug?: string;
  logo?: string;
  title?: string;
  companyName?: string;
  salary?: string;
  position?: string;
  workingForm?: string;
  city?: string;
  technologies?: string[];
}

export const CardJobItem = ({
  slug = "#",
  logo = "/assets/images/demo-cong-ty-1.png",
  title = "Frontend Engineer (ReactJS)",
  companyName = "LG CNS Việt Nam",
  salary = "1.000$ - 1.500$",
  position = "Fresher",
  workingForm = "Tại văn phòng",
  city = "Hà Nội",
  technologies = ["ReactJS", "NextJS", "Javascript"],
}: CardJobItemProps) => {
  return (
    <Link
      href={slug}
      className="card-hover group flex flex-col h-full overflow-hidden"
    >
      {/* Header với logo */}
      <div className="relative bg-gradient-to-br from-primary-50 to-white p-6 pb-4 border-b border-neutral-100">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-16 h-16 rounded-md bg-white border border-neutral-200 p-2 flex items-center justify-center">
            <img src={logo} alt={companyName} className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-body-lg font-bold text-neutral-900 line-clamp-2 leading-tight group-hover:text-accent-500 transition-colors">
              {title}
            </h3>
            <div className="text-body-sm text-neutral-500 mt-1 truncate">
              {companyName}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 pt-4 flex-1 flex flex-col">
        <div className="text-heading-sm font-semibold text-accent-500 mb-3">
          {salary}
        </div>

        <div className="flex flex-col gap-2 text-body-sm text-neutral-600">
          <div className="inline-flex items-center gap-2">
            <FaUserTie className="text-neutral-400 shrink-0" /> {position}
          </div>
          <div className="inline-flex items-center gap-2">
            <FaBriefcase className="text-neutral-400 shrink-0" /> {workingForm}
          </div>
          <div className="inline-flex items-center gap-2">
            <FaLocationDot className="text-neutral-400 shrink-0" /> {city}
          </div>
        </div>

        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {technologies.slice(0, 4).map((tech, idx) => (
              <span key={idx} className="tag-accent">
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4 inline-flex items-center gap-1.5 text-body-sm font-medium text-primary-800 group-hover:gap-2 transition-all">
          Xem chi tiết
          <FaArrowRight className="text-xs group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

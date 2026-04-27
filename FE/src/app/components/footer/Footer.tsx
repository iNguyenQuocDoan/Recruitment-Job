import Link from "next/link";
import {
  BriefcaseIcon,
  FacebookIcon,
  LinkedinIcon,
  GithubIcon,
} from "@/app/components/icons/Icons";

export const Footer = () => {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="container-page py-12">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-heading-md text-white mb-4">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded bg-accent-500">
                <BriefcaseIcon className="w-5 h-5 text-white" />
              </span>
              ITJobs
            </Link>
            <p className="text-body-sm text-white/70 leading-relaxed">
              Trang tuyển dụng IT hàng đầu, kết nối ứng viên với các nhà tuyển dụng công nghệ uy tín tại Việt Nam.
            </p>
          </div>

          {/* Cho ứng viên */}
          <div>
            <h4 className="text-body-md font-semibold mb-4">Cho ứng viên</h4>
            <ul className="space-y-2.5">
              <li><Link href="/search" className="text-body-sm text-white/70 hover:text-white transition-colors">Tìm việc làm</Link></li>
              <li><Link href="/company/list" className="text-body-sm text-white/70 hover:text-white transition-colors">Khám phá công ty</Link></li>
              <li><Link href="/user-manage/profile" className="text-body-sm text-white/70 hover:text-white transition-colors">Hồ sơ của tôi</Link></li>
              <li><Link href="/user-manage/cv/list" className="text-body-sm text-white/70 hover:text-white transition-colors">CV đã gửi</Link></li>
            </ul>
          </div>

          {/* Cho nhà tuyển dụng */}
          <div>
            <h4 className="text-body-md font-semibold mb-4">Cho nhà tuyển dụng</h4>
            <ul className="space-y-2.5">
              <li><Link href="/company/register" className="text-body-sm text-white/70 hover:text-white transition-colors">Đăng tuyển</Link></li>
              <li><Link href="/company-manage/job/list" className="text-body-sm text-white/70 hover:text-white transition-colors">Quản lý job</Link></li>
              <li><Link href="/company-manage/cv/list" className="text-body-sm text-white/70 hover:text-white transition-colors">Quản lý CV</Link></li>
              <li><Link href="/company-manage/profile" className="text-body-sm text-white/70 hover:text-white transition-colors">Hồ sơ công ty</Link></li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h4 className="text-body-md font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-2.5 text-body-sm text-white/70">
              <li>support@itjobs.vn</li>
              <li>(+84) 28 1234 5678</li>
            </ul>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="w-9 h-9 inline-flex items-center justify-center rounded bg-white/10 hover:bg-accent-500 transition-colors" aria-label="Facebook">
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 inline-flex items-center justify-center rounded bg-white/10 hover:bg-accent-500 transition-colors" aria-label="LinkedIn">
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 inline-flex items-center justify-center rounded bg-white/10 hover:bg-accent-500 transition-colors" aria-label="GitHub">
                <GithubIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-caption text-white/60">
            © {new Date().getFullYear()} ITJobs. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-caption text-white/60">
            <Link href="#" className="hover:text-white transition-colors">Điều khoản</Link>
            <Link href="#" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

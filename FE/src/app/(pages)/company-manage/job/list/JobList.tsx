/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaLocationDot,
  FaUserTie,
  FaPenToSquare,
  FaTrash,
  FaBoxOpen,
} from "react-icons/fa6";
import { toast } from "sonner";

export const JobList = () => {
  const [jobList, setJobList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/job/list`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          setJobList(data.data || []);
        } else if (data.code === "error") {
          toast.error("Lấy danh sách công việc thất bại!");
        }
        setLoading(false);
      });
  }, []);

  const handleDelete = (jobId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa công việc này?")) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/job/delete/${jobId}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          toast.success("Xóa công việc thành công!");
          setJobList(jobList.filter((job) => job._id !== jobId));
        } else {
          toast.error("Xóa công việc thất bại!");
        }
      })
      .catch(() => toast.error("Đã xảy ra lỗi!"));
  };

  if (loading) {
    return (
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-32 bg-neutral-100 rounded mb-4" />
            <div className="h-4 bg-neutral-100 rounded mb-2" />
            <div className="h-4 bg-neutral-100 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (jobList.length === 0) {
    return (
      <div className="empty-state card p-12">
        <div className="w-16 h-16 rounded-full bg-accent-50 text-accent-500 inline-flex items-center justify-center mb-4">
          <FaBoxOpen className="text-2xl" />
        </div>
        <h3 className="text-heading-sm font-semibold text-neutral-900 mb-2">
          Chưa có việc làm nào
        </h3>
        <p className="text-body-sm text-neutral-500 mb-6 max-w-md">
          Bắt đầu đăng tin tuyển dụng đầu tiên của bạn để tiếp cận hàng nghìn ứng viên IT
        </p>
        <Link href="/company-manage/job/create" className="btn-primary">
          Đăng tin ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
      {jobList.map((job) => (
        <div key={job._id} className="card-hover flex flex-col overflow-hidden">
          <div className="bg-gradient-to-br from-primary-50 to-white p-6 pb-4 border-b border-neutral-100">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-14 h-14 rounded-md bg-white border border-neutral-200 p-2 flex items-center justify-center">
                <img
                  src={job.images?.[0] || "/assets/images/demo-cong-ty-1.png"}
                  alt={job.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-body-lg font-bold text-neutral-900 line-clamp-2 leading-tight">
                  {job.title}
                </h3>
                <div className="text-body-sm text-neutral-500 mt-1 truncate">
                  {job.companyName || "Công ty"}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 pt-4 flex-1 flex flex-col">
            <div className="text-heading-sm font-semibold text-accent-500 mb-3">
              {job.salaryMin}$ - {job.salaryMax}$
            </div>

            <div className="flex flex-col gap-2 text-body-sm text-neutral-600 mb-4">
              <div className="inline-flex items-center gap-2">
                <FaUserTie className="text-neutral-400" /> {job.position}
              </div>
              <div className="inline-flex items-center gap-2">
                <FaBriefcase className="text-neutral-400" /> {job.workingForm}
              </div>
              <div className="inline-flex items-center gap-2">
                <FaLocationDot className="text-neutral-400" /> {job.companyCity || "N/A"}
              </div>
            </div>

            {job.technologies && job.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {job.technologies.slice(0, 4).map((tech: string, idx: number) => (
                  <span key={idx} className="tag">{tech}</span>
                ))}
              </div>
            )}

            <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center gap-2">
              <Link
                href={`/company-manage/job/edit/${job._id}`}
                className="flex-1 btn-secondary btn-sm"
              >
                <FaPenToSquare /> Sửa
              </Link>
              <button
                onClick={() => handleDelete(job._id)}
                className="btn btn-sm bg-danger-500/10 text-danger-500 hover:bg-danger-500 hover:text-white"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

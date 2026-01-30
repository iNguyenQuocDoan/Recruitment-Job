/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBriefcase, FaLocationDot, FaUserTie } from "react-icons/fa6";
import { toast } from "sonner";

export const JobList = () => {
  const [jobList, setJobList] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/job/list`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          console.log("Job List:", data.data);
          setJobList(data.data || []);
        }

        if (data.code === "error") {
          toast.error("Lấy danh sách công việc thất bại!");
        }
      });
  }, []);

  return (
    <>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
        {jobList.map((job) => (
          <div
            key={job._id}
            className="border border-[#DEDEDE] rounded-[8px] flex flex-col relative truncate"
            style={{
              background:
                "linear-gradient(180deg, #F6F6F6 2.38%, #FFFFFF 70.43%)",
            }}
          >
            <img
              src="/assets/images/card-bg.svg"
              alt=""
              className="absolute top-[0px] left-[0px] w-[100%] h-auto"
            />
            <div
              className="relative mt-[20px] w-[116px] h-[116px] bg-white mx-auto rounded-[8px] p-[10px]"
              style={{
                boxShadow: "0px 4px 24px 0px #0000001F",
              }}
            >
              <img
                src={job.images?.[0] || "/assets/images/demo-cong-ty-1.png"}
                alt={job.title}
                className="w-[100%] h-[100%] object-contain"
              />
            </div>
            <h3 className="mt-[20px] mx-[16px] font-[700] text-[18px] text-[#121212] text-center flex-1 whitespace-normal line-clamp-2">
              {job.title}
            </h3>
            <div className="mt-[6px] text-center font-[400] text-[14px] text-[#121212]">
              {job.companyName || "Công ty"}
            </div>
            <div className="mt-[12px] text-center font-[600] text-[16px] text-[#0088FF]">
              {job.salaryMin}$ - {job.salaryMax}$
            </div>
            <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
              <FaUserTie className="text-[16px]" /> {job.position}
            </div>
            <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
              <FaBriefcase className="text-[16px]" />{" "}
              {job.workingForm === "office"
                ? "Tại văn phòng"
                : job.workingForm === "remote"
                  ? "Làm từ xa"
                  : "Linh hoạt"}
            </div>
            <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
              <FaLocationDot className="text-[16px]" />{" "}
              {job.companyCity || "N/A"}
            </div>
            <div className="mt-[12px] mb-[20px] mx-[16px] flex flex-wrap justify-center gap-[8px]">
              {job.technologies?.map((tech: string, index: number) => (
                <div
                  key={index}
                  className="border border-[#DEDEDE] rounded-[20px] py-[6px] px-[16px] font-[400] text-[12px] text-[#414042]"
                >
                  {tech}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-[12px] mb-[20px]">
              <Link
                href={`/company-manage/job/edit/${job._id}`}
                className="bg-[#FFB200] rounded-[4px] font-[400] text-[14px] text-black inline-block py-[8px] px-[20px]"
              >
                Sửa
              </Link>
              <button
                onClick={() => handleDelete(job._id)}
                className="bg-[#FF0000] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-[30px]">
        <select
          name=""
          className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042]"
        >
          <option value="">Trang 1</option>
          <option value="">Trang 2</option>
          <option value="">Trang 3</option>
        </select>
      </div>
    </>
  );

  function handleDelete(jobId: string) {
    if (!confirm("Bạn có chắc chắn muốn xóa công việc này?")) {
      return;
    }

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
      .catch(() => {
        toast.error("Đã xảy ra lỗi!");
      });
  }
};

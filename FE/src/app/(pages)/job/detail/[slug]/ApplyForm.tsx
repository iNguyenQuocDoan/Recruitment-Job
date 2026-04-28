"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRightIcon } from "@/app/components/icons/Icons";

interface ApplyFormProps {
  jobId: string;
}

export const ApplyForm = ({ jobId }: ApplyFormProps) => {
  const { isLogin, infoUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.append("jobId", jobId);

    const file = fd.get("file") as File | null;
    if (!file || file.size === 0) {
      toast.error("Vui lòng chọn file CV (PDF)");
      return;
    }
    if (file.type !== "application/pdf") {
      toast.error("Chỉ chấp nhận file PDF");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File CV phải ≤ 5 MB");
      return;
    }

    setSubmitting(true);
    // console.log("[apply] submitting CV for job", jobId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cv/submit`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      // console.log("[apply] response:", { status: res.status, code: data.code });

      if (data.code === "success") {
        toast.success(data.message || "Đã gửi CV thành công!");
        form.reset();
      } else {
        toast.error(data.message || "Gửi CV thất bại");
      }
    } catch {
      toast.error("Lỗi kết nối, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLogin || !infoUser) {
    return (
      <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
        <p className="text-body-sm text-neutral-600 mb-4">
          Đăng nhập với tài khoản ứng viên để ứng tuyển vào job này.
        </p>
        <Link href="/user/login" className="btn-primary btn-sm">
          Đăng nhập <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
      <div className="sm:col-span-1">
        <label htmlFor="fullName" className="label">Họ tên *</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          minLength={3}
          maxLength={50}
          defaultValue={infoUser.fullName || ""}
          className="input"
          placeholder="Nguyễn Văn A"
        />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor="email" className="label">Email *</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={infoUser.email || ""}
          className="input"
          placeholder="email@example.com"
        />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor="phone" className="label">Số điện thoại *</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          minLength={10}
          maxLength={15}
          defaultValue={infoUser.phone || ""}
          className="input"
          placeholder="0901234567"
        />
      </div>
      <div className="sm:col-span-1">
        <label htmlFor="fileCV" className="label">CV (PDF, ≤ 5 MB) *</label>
        <input
          id="fileCV"
          name="file"
          type="file"
          accept="application/pdf"
          required
          className="input p-3 cursor-pointer file:mr-3 file:px-4 file:py-1 file:border-0 file:bg-accent-50 file:text-accent-700 file:rounded-full file:text-body-sm file:font-medium hover:file:bg-accent-100"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="sm:col-span-2 btn-primary btn-lg disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Đang gửi..." : "Gửi CV ứng tuyển"}
        {!submitting && <ArrowRightIcon className="w-4 h-4" />}
      </button>
    </form>
  );
};

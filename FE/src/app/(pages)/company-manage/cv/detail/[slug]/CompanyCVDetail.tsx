"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  CloseIcon,
  EnvelopeIcon,
  FilePdfIcon,
  PhoneIcon,
  TrashIcon,
  UserIcon,
} from "@/app/components/icons/Icons";

type CVStatus = "pending" | "approved" | "rejected";

interface CVDetail {
  _id: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  fileUrl: string;
  status: CVStatus;
  viewed: boolean;
  note: string;
  createdAt: string;
}

const STATUS_META: Record<CVStatus, { label: string; className: string }> = {
  pending: {
    label: "Chờ duyệt",
    className: "tag bg-warning-500/10 border-warning-500/20 text-warning-500",
  },
  approved: {
    label: "Đã duyệt",
    className: "tag bg-success-500/10 border-success-500/20 text-success-600",
  },
  rejected: {
    label: "Từ chối",
    className: "tag bg-danger-500/10 border-danger-500/20 text-danger-500",
  },
};

interface Props {
  cvId: string;
}

export const CompanyCVDetail = ({ cvId }: Props) => {
  const { isLogin, infoCompany } = useAuth();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [cv, setCv] = useState<CVDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<"approve" | "reject" | "delete" | null>(null);

  useEffect(() => {
    if (!isLogin || !infoCompany) {
      setLoading(false);
      return;
    }
    setLoading(true);
    // console.log("[company-cv-detail] fetching", cvId);
    fetch(`${apiUrl}/company/cv/detail/${cvId}`, { credentials: "include" })
      .then((r) => r.json().then((d) => ({ status: r.status, body: d })))
      .then(({ status, body }) => {
        if (body.code === "success") {
          setCv(body.data as CVDetail);
          setNote(body.data?.note || "");
        } else if (status === 404) {
          setNotFound(true);
        } else {
          toast.error(body.message || "Không tải được CV");
        }
      })
      .catch(() => toast.error("Lỗi kết nối"))
      .finally(() => setLoading(false));
  }, [apiUrl, isLogin, infoCompany, cvId]);

  const decide = async (action: "approve" | "reject") => {
    if (!cv) return;
    if (note.length > 500) {
      toast.error("Phản hồi không quá 500 ký tự");
      return;
    }
    setBusy(action);
    try {
      const res = await fetch(`${apiUrl}/company/cv/${cv._id}/${action}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ note }),
      });
      const d = await res.json();
      if (d.code === "success") {
        toast.success(d.message || (action === "approve" ? "Đã duyệt" : "Đã từ chối"));
        setCv({ ...cv, status: action === "approve" ? "approved" : "rejected", note });
      } else {
        toast.error(d.message || "Thao tác thất bại");
      }
    } catch {
      toast.error("Lỗi kết nối");
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async () => {
    if (!cv) return;
    if (!confirm(`Xoá CV của "${cv.fullName}"?`)) return;
    setBusy("delete");
    try {
      const res = await fetch(`${apiUrl}/company/cv/${cv._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const d = await res.json();
      if (d.code === "success") {
        toast.success(d.message || "Đã xoá CV");
        router.push("/company-manage/cv/list");
      } else {
        toast.error(d.message || "Xoá thất bại");
        setBusy(null);
      }
    } catch {
      toast.error("Lỗi kết nối");
      setBusy(null);
    }
  };

  if (!isLogin || !infoCompany) {
    return (
      <section className="py-10">
        <div className="container-page">
          <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center max-w-xl mx-auto">
            <p className="text-body-sm text-neutral-600 mb-4">
              Đăng nhập với tài khoản nhà tuyển dụng để xem CV.
            </p>
            <Link href="/company/login" className="btn-primary btn-sm">
              Đăng nhập <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="py-10">
        <div className="container-page">
          <div className="card p-8 animate-pulse">
            <div className="h-6 bg-neutral-100 rounded w-1/3 mb-4" />
            <div className="h-4 bg-neutral-100 rounded mb-2" />
            <div className="h-4 bg-neutral-100 rounded w-2/3" />
          </div>
        </div>
      </section>
    );
  }

  if (notFound || !cv) {
    return (
      <section className="py-10">
        <div className="container-page">
          <Link
            href="/company-manage/cv/list"
            className="inline-flex items-center gap-2 text-body-sm text-neutral-500 hover:text-accent-500 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-3 h-3" /> Quay lại danh sách
          </Link>
          <p className="text-body-md text-neutral-500 text-center py-12">
            CV không tồn tại hoặc đã bị xoá.
          </p>
        </div>
      </section>
    );
  }

  const meta = STATUS_META[cv.status];
  const isPending = cv.status === "pending";

  return (
    <section className="py-10">
      <div className="container-page">
        <Link
          href="/company-manage/cv/list"
          className="inline-flex items-center gap-2 text-body-sm text-neutral-500 hover:text-accent-500 mb-4 transition-colors"
        >
          <ArrowLeftIcon className="w-3 h-3" /> Quay lại danh sách
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* CV preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                <div className="flex items-center gap-3">
                  <h1 className="text-heading-md font-bold text-neutral-900">Hồ sơ ứng viên</h1>
                  <span className={meta.className}>{meta.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decide("approve")}
                    disabled={!isPending || busy !== null}
                    title={isPending ? "Duyệt CV" : "CV đã được xử lý"}
                    className="btn btn-sm bg-success-500 text-white hover:bg-success-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-success-500"
                  >
                    <CheckIcon className="w-4 h-4" /> {busy === "approve" ? "Đang duyệt..." : "Duyệt"}
                  </button>
                  <button
                    onClick={() => decide("reject")}
                    disabled={!isPending || busy !== null}
                    title={isPending ? "Từ chối CV" : "CV đã được xử lý"}
                    className="btn btn-sm bg-warning-500 text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <CloseIcon className="w-4 h-4" /> {busy === "reject" ? "Đang xử lý..." : "Từ chối"}
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={busy !== null}
                    title="Xoá CV"
                    className="btn btn-sm bg-danger-500/10 text-danger-500 hover:bg-danger-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                <div className="flex items-center gap-3 p-3 rounded bg-neutral-50">
                  <UserIcon className="w-5 h-5 text-accent-500" />
                  <div className="min-w-0">
                    <div className="text-caption text-neutral-500">Họ tên</div>
                    <div className="text-body-sm font-semibold text-neutral-900 truncate">
                      {cv.fullName}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded bg-neutral-50">
                  <EnvelopeIcon className="w-5 h-5 text-accent-500" />
                  <div className="min-w-0">
                    <div className="text-caption text-neutral-500">Email</div>
                    <div className="text-body-sm font-semibold text-neutral-900 truncate">
                      {cv.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded bg-neutral-50">
                  <PhoneIcon className="w-5 h-5 text-accent-500" />
                  <div className="min-w-0">
                    <div className="text-caption text-neutral-500">Điện thoại</div>
                    <div className="text-body-sm font-semibold text-neutral-900 truncate">
                      {cv.phone}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="note" className="label">
                  Phản hồi cho ứng viên (tuỳ chọn, tối đa 500 ký tự)
                </label>
                <textarea
                  id="note"
                  rows={3}
                  maxLength={500}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Hồ sơ phù hợp, hẹn phỏng vấn lúc..."
                  className="input min-h-[88px] py-3"
                />
                <div className="text-caption text-neutral-500 mt-1 text-right">
                  {note.length}/500
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-body-lg font-semibold text-neutral-900 inline-flex items-center gap-2">
                    <FilePdfIcon className="w-4 h-4 text-danger-500" /> CV ứng viên
                  </h2>
                  <a
                    href={cv.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary btn-sm"
                  >
                    Mở tab mới
                  </a>
                </div>
                <iframe
                  src={cv.fileUrl}
                  className="w-full aspect-[3/4] bg-neutral-100 rounded-md border border-neutral-200"
                  title="CV PDF preview"
                />
              </div>
            </div>
          </div>

          {/* Job info */}
          <div className="lg:col-span-1">
            <div className="card p-6 lg:sticky lg:top-20">
              <h2 className="text-heading-sm font-bold text-neutral-900 mb-4">Ứng tuyển vào</h2>

              <h3 className="text-body-md font-semibold text-accent-500 mb-3">
                {cv.jobTitle || "Job đã xoá"}
              </h3>

              <ul className="space-y-3 text-body-sm">
                <li className="flex justify-between">
                  <span className="text-neutral-500">Trạng thái</span>
                  <span className={meta.className}>{meta.label}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-neutral-500">Đã xem</span>
                  <span className="font-semibold text-neutral-900">
                    {cv.viewed ? "Đã xem" : "Chưa xem"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-neutral-500">Ngày gửi</span>
                  <span className="font-semibold text-neutral-900">
                    {new Date(cv.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </li>
              </ul>

              {cv.jobId && (
                <Link
                  href={`/job/detail/${cv.jobId}`}
                  className="btn-secondary w-full mt-6"
                >
                  Xem chi tiết job <ArrowRightIcon className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

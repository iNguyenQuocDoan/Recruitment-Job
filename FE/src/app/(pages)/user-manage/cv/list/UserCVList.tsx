"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  EyeIcon,
  TrashIcon,
} from "@/app/components/icons/Icons";

interface UserCV {
  _id: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  fileUrl: string;
  status: "pending" | "approved" | "rejected";
  note: string;
  createdAt: string;
}

const STATUS_META: Record<UserCV["status"], { label: string; className: string }> = {
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

const PAGE_LIMIT = 12;

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

export const UserCVList = () => {
  const { isLogin, infoUser } = useAuth();
  const [items, setItems] = useState<UserCV[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!isLogin || !infoUser) {
      setLoading(false);
      return;
    }
    setLoading(true);
    // console.log("[user-cv-list] fetching page", page);
    fetch(`${apiUrl}/user/cv/list?page=${page}&limit=${PAGE_LIMIT}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => {
        // console.log("[user-cv-list] response", { code: d.code, total: d.total, count: d.data?.length });
        if (d.code === "success") {
          setItems((d.data ?? []) as UserCV[]);
          setTotal(d.total ?? 0);
        } else {
          toast.error(d.message || "Không tải được danh sách CV");
        }
      })
      .catch(() => toast.error("Lỗi kết nối, vui lòng thử lại"))
      .finally(() => setLoading(false));
  }, [apiUrl, isLogin, infoUser, page]);

  const handleDelete = async (cv: UserCV) => {
    if (cv.status !== "pending") {
      toast.error("Chỉ xoá được CV đang chờ duyệt");
      return;
    }
    if (!confirm(`Xoá CV đã ứng tuyển vào "${cv.jobTitle}"?`)) return;

    setDeleting(cv._id);
    try {
      const res = await fetch(`${apiUrl}/user/cv/${cv._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const d = await res.json();
      if (d.code === "success") {
        toast.success(d.message || "Đã xoá CV");
        setItems((prev) => prev.filter((x) => x._id !== cv._id));
        setTotal((t) => Math.max(0, t - 1));
      } else {
        toast.error(d.message || "Xoá CV thất bại");
      }
    } catch {
      toast.error("Lỗi kết nối, vui lòng thử lại");
    } finally {
      setDeleting(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  if (!isLogin || !infoUser) {
    return (
      <section className="py-10">
        <div className="container-page">
          <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center max-w-xl mx-auto">
            <h1 className="text-heading-md font-bold text-neutral-900 mb-2">
              CV đã gửi
            </h1>
            <p className="text-body-sm text-neutral-600 mb-4">
              Đăng nhập với tài khoản ứng viên để xem CV bạn đã gửi.
            </p>
            <Link href="/user/login" className="btn-primary btn-sm">
              Đăng nhập <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="container-page">
        <div className="mb-6">
          <h1 className="text-heading-lg md:text-display-md font-bold text-neutral-900">
            CV đã gửi
          </h1>
          <p className="text-body-sm text-neutral-500 mt-1">
            Theo dõi trạng thái các CV bạn đã ứng tuyển
            {total > 0 && (
              <span className="text-neutral-900 font-semibold"> · {total} CV</span>
            )}
          </p>
        </div>

        {loading ? (
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-5 bg-neutral-100 rounded mb-3" />
                <div className="h-4 bg-neutral-100 rounded w-2/3 mb-2" />
                <div className="h-4 bg-neutral-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-body-md text-neutral-500 mb-4">
              Bạn chưa gửi CV nào.
            </p>
            <Link href="/search" className="btn-primary btn-sm">
              Tìm việc làm <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            {items.map((cv) => {
              const meta = STATUS_META[cv.status];
              const canDelete = cv.status === "pending";
              return (
                <div key={cv._id} className="card-hover p-6 flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-body-lg font-bold text-neutral-900 line-clamp-2 leading-tight flex-1">
                      {cv.jobTitle || "Job đã xoá"}
                    </h3>
                    <span className={meta.className}>
                      <CircleCheckIcon className="w-3 h-3 mr-1" />
                      {meta.label}
                    </span>
                  </div>

                  <div className="text-caption text-neutral-500 mb-3">
                    Gửi ngày {formatDate(cv.createdAt)}
                  </div>

                  {cv.note && cv.status !== "pending" && (
                    <div className="text-body-sm text-neutral-600 mb-3 p-3 rounded bg-neutral-50 border border-neutral-100">
                      <span className="font-medium text-neutral-900">Phản hồi: </span>
                      {cv.note}
                    </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-neutral-100 flex gap-2">
                    <a
                      href={cv.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 btn-secondary btn-sm"
                    >
                      <EyeIcon className="w-4 h-4" /> Xem CV
                    </a>
                    <button
                      onClick={() => handleDelete(cv)}
                      disabled={!canDelete || deleting === cv._id}
                      title={
                        canDelete
                          ? "Xoá CV"
                          : "Chỉ CV đang chờ duyệt mới xoá được"
                      }
                      className="btn btn-sm bg-danger-500/10 text-danger-500 hover:bg-danger-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-danger-500/10 disabled:hover:text-danger-500"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="w-10 h-10 inline-flex items-center justify-center rounded border border-neutral-200 bg-white text-neutral-500 hover:border-accent-500 hover:text-accent-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Trang trước"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <span className="text-body-sm text-neutral-600 px-3">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="w-10 h-10 inline-flex items-center justify-center rounded border border-neutral-200 bg-white text-neutral-500 hover:border-accent-500 hover:text-accent-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Trang sau"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

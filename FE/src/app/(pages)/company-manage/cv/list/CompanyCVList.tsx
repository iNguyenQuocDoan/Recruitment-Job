"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  CloseIcon,
  EyeIcon,
  PhoneIcon,
  TrashIcon,
} from "@/app/components/icons/Icons";

type CVStatus = "pending" | "approved" | "rejected";

interface CompanyCV {
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

const STATUS_TABS: { value: "" | CVStatus; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
];

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

const PAGE_LIMIT = 12;

export const CompanyCVList = () => {
  const { isLogin, infoCompany } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [statusFilter, setStatusFilter] = useState<"" | CVStatus>("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<CompanyCV[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!isLogin || !infoCompany) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const qs = new URLSearchParams({ page: String(page), limit: String(PAGE_LIMIT) });
    if (statusFilter) qs.set("status", statusFilter);
    // console.log("[company-cv-list] fetching", qs.toString());
    fetch(`${apiUrl}/company/cv/list?${qs}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.code === "success") {
          setItems((d.data ?? []) as CompanyCV[]);
          setTotal(d.total ?? 0);
        } else {
          toast.error(d.message || "Không tải được danh sách CV");
        }
      })
      .catch(() => toast.error("Lỗi kết nối"))
      .finally(() => setLoading(false));
  }, [apiUrl, isLogin, infoCompany, page, statusFilter]);

  const callDecision = async (
    cv: CompanyCV,
    action: "approve" | "reject",
    successMessage: string,
  ) => {
    setBusy(cv._id);
    try {
      const res = await fetch(`${apiUrl}/company/cv/${cv._id}/${action}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });
      const d = await res.json();
      if (d.code === "success") {
        toast.success(d.message || successMessage);
        setItems((prev) =>
          prev.map((x) =>
            x._id === cv._id
              ? { ...x, status: action === "approve" ? "approved" : "rejected" }
              : x,
          ),
        );
      } else {
        toast.error(d.message || "Thao tác thất bại");
      }
    } catch {
      toast.error("Lỗi kết nối");
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async (cv: CompanyCV) => {
    if (!confirm(`Xoá CV của "${cv.fullName}"?`)) return;
    setBusy(cv._id);
    try {
      const res = await fetch(`${apiUrl}/company/cv/${cv._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const d = await res.json();
      if (d.code === "success") {
        toast.success(d.message || "Đã xoá CV");
        setItems((prev) => prev.filter((x) => x._id !== cv._id));
        setTotal((t) => Math.max(0, t - 1));
      } else {
        toast.error(d.message || "Xoá thất bại");
      }
    } catch {
      toast.error("Lỗi kết nối");
    } finally {
      setBusy(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  if (!isLogin || !infoCompany) {
    return (
      <section className="py-10">
        <div className="container-page">
          <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center max-w-xl mx-auto">
            <h1 className="text-heading-md font-bold text-neutral-900 mb-2">Quản lý CV</h1>
            <p className="text-body-sm text-neutral-600 mb-4">
              Đăng nhập với tài khoản nhà tuyển dụng để xem CV ứng viên.
            </p>
            <Link href="/company/login" className="btn-primary btn-sm">
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
            Quản lý CV
          </h1>
          <p className="text-body-sm text-neutral-500 mt-1">
            Xem xét và phản hồi CV ứng viên
            {total > 0 && (
              <span className="text-neutral-900 font-semibold"> · {total} CV</span>
            )}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="card p-2 mb-6 inline-flex flex-wrap gap-1">
          {STATUS_TABS.map((tab) => {
            const active = statusFilter === tab.value;
            return (
              <button
                key={tab.label}
                onClick={() => {
                  setStatusFilter(tab.value);
                  setPage(1);
                }}
                className={
                  "px-4 h-9 rounded text-body-sm font-medium transition-colors " +
                  (active
                    ? "bg-accent-500 text-white"
                    : "text-neutral-700 hover:bg-neutral-100")
                }
              >
                {tab.label}
              </button>
            );
          })}
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
          <p className="text-body-sm text-neutral-500 text-center py-12">
            Không có CV nào.
          </p>
        ) : (
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            {items.map((cv) => {
              const meta = STATUS_META[cv.status];
              const isPending = cv.status === "pending";
              return (
                <div key={cv._id} className="card-hover p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <h3 className="text-body-lg font-bold text-neutral-900 line-clamp-1 flex-1">
                      {cv.jobTitle || "Job đã xoá"}
                    </h3>
                    {!cv.viewed && (
                      <span
                        className="inline-block w-2 h-2 rounded-full bg-accent-500 shrink-0"
                        title="Chưa xem"
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-neutral-100">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-800 inline-flex items-center justify-center font-semibold">
                      {cv.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-body-sm font-semibold text-neutral-900 truncate">
                        {cv.fullName}
                      </div>
                      <div className="text-caption text-neutral-500 truncate">{cv.email}</div>
                    </div>
                    <span className={meta.className}>{meta.label}</span>
                  </div>

                  <div className="flex flex-col gap-2 text-body-sm text-neutral-600 mb-4">
                    <div className="inline-flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4 text-neutral-400" /> {cv.phone}
                    </div>
                    {cv.note && (
                      <div className="text-caption text-neutral-500 line-clamp-2">
                        Ghi chú: <span className="italic">{cv.note}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-neutral-100 flex flex-wrap gap-2">
                    <Link
                      href={`/company-manage/cv/detail/${cv._id}`}
                      className="flex-1 btn-secondary btn-sm"
                    >
                      <EyeIcon className="w-4 h-4" /> Chi tiết
                    </Link>
                    <button
                      onClick={() => callDecision(cv, "approve", "Đã duyệt CV")}
                      disabled={!isPending || busy === cv._id}
                      title={isPending ? "Duyệt nhanh" : "Đã xử lý"}
                      className="btn btn-sm bg-success-500/10 text-success-600 hover:bg-success-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-success-500/10 disabled:hover:text-success-600"
                    >
                      <CheckIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => callDecision(cv, "reject", "Đã từ chối CV")}
                      disabled={!isPending || busy === cv._id}
                      title={isPending ? "Từ chối nhanh" : "Đã xử lý"}
                      className="btn btn-sm bg-warning-500/10 text-warning-500 hover:bg-warning-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-warning-500/10 disabled:hover:text-warning-500"
                    >
                      <CloseIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cv)}
                      disabled={busy === cv._id}
                      title="Xoá CV (soft delete)"
                      className="btn btn-sm bg-danger-500/10 text-danger-500 hover:bg-danger-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
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
};

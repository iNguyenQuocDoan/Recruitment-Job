import { Metadata } from "next";
import { CompanyCVDetail } from "./CompanyCVDetail";

export const metadata: Metadata = {
  title: "Chi tiết CV",
  description: "Xem chi tiết CV ứng viên",
};

export default async function CompanyManageCVDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CompanyCVDetail cvId={slug} />;
}

import { Metadata } from "next";
import { CompanyCVList } from "./CompanyCVList";

export const metadata: Metadata = {
  title: "Quản lý CV",
  description: "Quản lý CV ứng viên",
};

export default function CompanyManageCVListPage() {
  return <CompanyCVList />;
}

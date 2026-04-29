import { Metadata } from "next";
import { UserCVList } from "./UserCVList";

export const metadata: Metadata = {
  title: "CV đã gửi",
  description: "Quản lý CV đã gửi",
};

export default function UserManageCVListPage() {
  return <UserCVList />;
}

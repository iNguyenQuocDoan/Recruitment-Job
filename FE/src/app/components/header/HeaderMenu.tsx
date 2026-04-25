"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { FaAngleDown } from "react-icons/fa6";

interface MenuItem {
  name: string;
  link: string;
  isLogin?: boolean;
  children?: MenuItem[];
}

export const HeaderMenu = (props: { showMenu: boolean; onClose?: () => void }) => {
  const { showMenu, onClose } = props;
  const { isLogin } = useAuth();

  const menuList: MenuItem[] = [
    {
      name: "Việc làm IT",
      link: "/search",
      children: [
        { name: "Theo kỹ năng", link: "/search?skill=reactjs" },
        { name: "Theo công ty", link: "/company/list" },
        { name: "Theo thành phố", link: "/search?city=hcm" },
      ],
    },
    {
      name: "Top công ty",
      link: "/company/list",
    },
    {
      name: "Nhà tuyển dụng",
      link: "#",
      isLogin: false,
      children: [
        { name: "Đăng nhập", link: "/company/login" },
        { name: "Đăng ký", link: "/company/register" },
      ],
    },
  ];

  return (
    <nav
      className={
        "lg:flex lg:static lg:bg-transparent lg:w-auto lg:h-auto lg:translate-x-0 fixed top-16 left-0 w-72 h-[calc(100vh-64px)] bg-primary-900 z-50 transition-transform duration-300 lg:transition-none " +
        (showMenu ? "translate-x-0" : "-translate-x-full lg:translate-x-0")
      }
    >
      <ul className="flex lg:flex-row flex-col lg:items-center lg:gap-2 gap-0 lg:p-0 p-4">
        {menuList.map((menu, index) => {
          if (menu.isLogin !== undefined && menu.isLogin !== isLogin) return null;
          return (
            <li
              key={index}
              className="relative group lg:py-0 py-1"
            >
              <Link
                href={menu.link}
                onClick={onClose}
                className="inline-flex items-center gap-2 px-4 py-2 rounded text-white text-body-md font-medium hover:bg-primary-900 transition-colors"
              >
                {menu.name}
                {menu.children && (
                  <FaAngleDown className="text-sm transition-transform group-hover:rotate-180" />
                )}
              </Link>
              {menu.children && (
                <ul className="lg:absolute lg:top-full lg:left-0 lg:w-64 lg:mt-2 lg:bg-white lg:shadow-card-floating lg:rounded-md lg:opacity-0 lg:invisible lg:group-hover:opacity-100 lg:group-hover:visible transition-all duration-200 lg:py-2 ml-4 mt-1">
                  {menu.children.map((sub, idx) => (
                    <li key={idx}>
                      <Link
                        href={sub.link}
                        onClick={onClose}
                        className="block px-4 py-2 lg:text-neutral-700 text-white/80 lg:hover:bg-neutral-100 hover:bg-primary-900 lg:hover:text-primary-800 text-body-sm font-medium transition-colors lg:rounded"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

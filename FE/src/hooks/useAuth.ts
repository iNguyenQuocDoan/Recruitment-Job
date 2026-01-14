import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const useAuth = () => {
  console.log("useAuth hook");
  const [isLogin, setIsLogin] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [infoUser, setInfoUser] = useState<any>(null);
  const pathName = usePathname();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check`, {
      credentials: "include", // gửi kèm cookie
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          setIsLogin(true);
          setInfoUser(data.infoUser);
        }

        if (data.code == "unauthenticated") {
          setIsLogin(false);
        }
      });
  }, [pathName]);

  return { isLogin, infoUser };
};

"use client";

import JustValidate from "just-validate";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function FormLogin() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validatorRef = useRef<any>(null);

  useEffect(() => {
    const formElement = document.querySelector("#loginForm");
    if (!formElement) return;

    if (validatorRef.current) {
      validatorRef.current.destroy();
    }

    const validator = new JustValidate("#loginForm");
    validatorRef.current = validator;

    validator
      .addField("#email", [
        {
          rule: "required",
          errorMessage: "Email không được để trống",
        },
        {
          rule: "email",
          errorMessage: "Email không hợp lệ",
        },
      ])
      .addField("#password", [
        {
          rule: "required",
          errorMessage: "Mật khẩu không được để trống",
        },
        {
          rule: "minLength",
          value: 6,
          errorMessage: "Mật khẩu phải có ít nhất 6 ký tự",
        },
        {
          rule: "maxLength",
          value: 30,
          errorMessage: "Mật khẩu không được vượt quá 30 ký tự",
        },
      ])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .onSuccess((event: any) => {
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;

        const dataFinal = {
          email,
          password,
        };

        console.log("Data to submit:", dataFinal);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataFinal),
          credentials: "include",
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.code === "success") {
              toast.success(data.message || "Đăng nhập thành công!");
              router.push("/");
            } else {
              toast.error(data.message || "Đăng nhập thất bại!");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
          });
      });

    return () => {
      if (validatorRef.current) {
        validatorRef.current.destroy();
      }
    };
  }, [router]);

  return (
    <form id="loginForm" className="space-y-4">
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input type="email" name="email" id="email" placeholder="email@example.com" className="input" />
      </div>
      <div>
        <label htmlFor="password" className="label">Mật khẩu</label>
        <input type="password" name="password" id="password" placeholder="••••••••" className="input" />
      </div>
      <button type="submit" className="btn-primary w-full">
        Đăng nhập
      </button>
    </form>
  );
}

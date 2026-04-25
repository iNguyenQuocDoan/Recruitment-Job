"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import JustValidate from "just-validate";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function FormRegister() {
  const router = useRouter();
  const validatorRef = useRef<any>(null);

  useEffect(() => {
    const formElement = document.querySelector("#registerForm");
    if (!formElement) return;

    if (validatorRef.current) {
      validatorRef.current.destroy();
    }

    const validator = new JustValidate("#registerForm");
    validatorRef.current = validator;

    validator
      .addField("#fullName", [
        {
          rule: "required",
          errorMessage: "Họ tên không được để trống",
        },
        {
          rule: "minLength",
          value: 3,
          errorMessage: "Họ tên phải có ít nhất 3 ký tự",
        },
        {
          rule: "maxLength",
          value: 50,
          errorMessage: "Họ tên không được vượt quá 50 ký tự",
        },
      ])
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
      .onSuccess((event: any) => {
        event.preventDefault();

        const fullName = event.target.fullName.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        const dataFinal = {
          fullName,
          email,
          password,
        };

        console.log("Data to submit:", dataFinal);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataFinal),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.code === "success") {
              toast.success(data.message || "Đăng ký thành công!");
              router.push("/user/login");
            } else {
              toast.error(data.message || "Đăng ký thất bại!");
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
    <form id="registerForm" className="space-y-4">
      <div>
        <label htmlFor="fullName" className="label">Họ tên</label>
        <input type="text" name="fullName" id="fullName" placeholder="Nguyễn Văn A" className="input" />
      </div>
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input type="email" name="email" id="email" placeholder="email@example.com" className="input" />
      </div>
      <div>
        <label htmlFor="password" className="label">Mật khẩu</label>
        <input type="password" name="password" id="password" placeholder="Tối thiểu 6 ký tự" className="input" />
      </div>
      <button type="submit" className="btn-primary w-full">
        Đăng ký
      </button>
    </form>
  );
}

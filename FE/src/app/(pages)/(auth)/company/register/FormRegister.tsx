"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import JustValidate from "just-validate";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function CompanyRegisterPage() {
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
      .addField("#companyName", [
        {
          rule: "required",
          errorMessage: "Tên công ty không được để trống",
        },
        {
          rule: "minLength",
          value: 3,
          errorMessage: "Tên công ty phải có ít nhất 3 ký tự",
        },
        {
          rule: "maxLength",
          value: 50,
          errorMessage: "Tên công ty không được vượt quá 50 ký tự",
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

        const companyName = event.target.companyName.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        const dataFinal = {
          companyName,
          email,
          password,
        };

        console.log("Data to submit:", dataFinal);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataFinal),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.code === "success") {
              alert(data.message || "Đăng ký thành công!");
              router.push("/company/login");
            } else {
              alert(data.message || "Đăng ký thất bại!");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
          });
      });

    return () => {
      if (validatorRef.current) {
        validatorRef.current.destroy();
      }
    };
  }, [router]);

  return (
    <>
      <form
        id="registerForm"
        action=""
        className="grid grid-cols-1 gap-y-[15px]"
      >
        <div className="">
          <label
            htmlFor="companyName"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Tên công ty *
          </label>
          <input
            type="text"
            name="companyName"
            id="companyName"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <label
            htmlFor="email"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Email *
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <label
            htmlFor="password"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Mật khẩu *
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <button className="bg-[#0088FF] rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white">
            Đăng ký
          </button>
        </div>
      </form>
    </>
  );
}

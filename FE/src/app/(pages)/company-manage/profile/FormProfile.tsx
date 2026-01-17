"use client";

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { Toaster, toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import JustValidate from "just-validate";
import { useEffect, useState } from "react";

//filepond
registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

export const FormProfile = () => {
  const { infoCompany } = useAuth();

  // lay avatar
  const [logo, setLogo] = useState<any[]>([]);
  const [cityList, setCityList] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/city/list`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("city data", data);
        if (data.code === "success" && data.cityList) {
          setCityList(data.cityList);
        } else {
          // Nếu chưa có dữ liệu từ DB, dùng mặc định
          setCityList([
            { _id: "1", name: "Hà Nội" },
            { _id: "2", name: "Đà Nẵng" },
            { _id: "3", name: "Hồ Chí Minh" },
          ]);
        }
      })
      .catch(() => {
        // Nếu lỗi, dùng danh sách mặc định
        setCityList([
          { _id: "1", name: "Hà Nội" },
          { _id: "2", name: "Đà Nẵng" },
          { _id: "3", name: "Hồ Chí Minh" },
        ]);
      });
  }, []);

  useEffect(() => {
    if (infoCompany) {
      // hiển thị logo mặc định
      if (infoCompany.logo) {
        setLogo([
          {
            source: infoCompany.logo,
          },
        ]);
      }

      // validate form
      const validator = new JustValidate("#profileForm");

      validator
        .addField("#companyName", [
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
            errorMessage: "Email không đúng định dạng",
          },
        ])
        .addField("#phone", [
          {
            rule: "minLength",
            value: 10,
            errorMessage: "Số điện thoại phải có ít nhất 10 ký tự",
          },
          {
            rule: "maxLength",
            value: 15,
            errorMessage: "Số điện thoại không được vượt quá 15 ký tự",
          },
        ])
        .addField("#address", [
          {
            rule: "required",
            errorMessage: "Địa chỉ không được để trống",
          },
          {
            rule: "minLength",
            value: 5,
            errorMessage: "Địa chỉ phải có ít nhất 5 ký tự",
          },
        ])
        .addField("#companyModel", [
          {
            rule: "required",
            errorMessage: "Mô hình công ty không được để trống",
          },
        ])
        .addField("#companyEmployees", [
          {
            rule: "required",
            errorMessage: "Quy mô công ty không được để trống",
          },
        ])
        .addField("#workingTime", [
          {
            rule: "required",
            errorMessage: "Thời gian làm việc không được để trống",
          },
        ])
        .addField("#description", [
          {
            rule: "required",
            errorMessage: "Mô tả chi tiết không được để trống",
          },
          {
            rule: "minLength",
            value: 20,
            errorMessage: "Mô tả chi tiết phải có ít nhất 20 ký tự",
          },
        ]);
    }
  }, [infoCompany]);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // xu lí form
    const companyName = event.target.companyName.value;
    const email = event.target.email.value;
    const phone = event.target.phone.value;
    const city = event.target.city.value;
    const address = event.target.address.value;
    const companyModel = event.target.companyModel.value;
    const companyEmployees = event.target.companyEmployees.value;
    const workingTime = event.target.workingTime.value;
    const workOvertime = event.target.workOvertime.value;
    const description = event.target.description.value;

    let logoFile = null;
    if (logo.length > 0) {
      logoFile = logo[0].file;
    }

    //form
    const formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("city", city);
    formData.append("address", address);
    formData.append("companyModel", companyModel);
    formData.append("companyEmployees", companyEmployees);
    formData.append("workingTime", workingTime);
    formData.append("workOvertime", workOvertime);
    formData.append("description", description);
    formData.append("logo", logoFile);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/profile`, {
      method: "PATCH",
      body: formData,
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.code === "success") {
          toast.success("Cập nhật hồ sơ thành công");
        } else {
          toast.error("Cập nhật hồ sơ thất bại");
        }
      });
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      {infoCompany && (
        <form
          id="profileForm"
          action=""
          onSubmit={handleSubmit}
          className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]"
        >
          <div className="sm:col-span-2">
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
              defaultValue={infoCompany.companyName}
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="logo"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Logo
            </label>
            <FilePond
              name="logo"
              allowMultiple={false}
              allowRemove={true}
              labelIdle="+"
              acceptedFileTypes={["image/*"]}
              onupdatefiles={setLogo}
              files={logo}
            />
          </div>
          <div className="">
            <label
              htmlFor="city"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Thành phố
            </label>
            <select
              name="city"
              id="city"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.city}
            >
              {cityList && cityList.map((city) => (
                <option key={city._id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <div className="">
            <label
              htmlFor="address"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Địa chỉ
            </label>
            <input
              type="text"
              name="address"
              id="address"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.address}
            />
          </div>
          <div className="">
            <label
              htmlFor="companyModel"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Mô hình công ty
            </label>
            <input
              type="text"
              name="companyModel"
              id="companyModel"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.companyModel}
            />
          </div>
          <div className="">
            <label
              htmlFor="companyEmployees"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Quy mô công ty
            </label>
            <input
              type="text"
              name="companyEmployees"
              id="companyEmployees"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.companyEmployees}
            />
          </div>
          <div className="">
            <label
              htmlFor="workingTime"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Thời gian làm việc
            </label>
            <input
              type="text"
              name="workingTime"
              id="workingTime"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.workingTime}
            />
          </div>
          <div className="">
            <label
              htmlFor="workOvertime"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Làm việc ngoài giờ
            </label>
            <input
              type="text"
              name="workOvertime"
              id="workOvertime"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.workOvertime}
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
              defaultValue={infoCompany.email}
            />
          </div>
          <div className="">
            <label
              htmlFor="phone"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.phone}
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="description"
              className="block font-[500] text-[14px] text-black mb-[5px]"
            >
              Mô tả chi tiết
            </label>
            <textarea
              name="description"
              id="description"
              className="w-[100%] h-[350px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.description}
            />
          </div>
          <div className="sm:col-span-2">
            <button className="bg-[#0088FF] rounded-[4px] h-[48px] px-[20px] font-[700] text-[16px] text-white">
              Cập nhật
            </button>
          </div>
        </form>
      )}
    </>
  );
};

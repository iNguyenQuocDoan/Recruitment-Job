/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { Toaster, toast } from "sonner";
import { Editor } from "@tinymce/tinymce-react";

import { useAuth } from "@/hooks/useAuth";
import JustValidate from "just-validate";
import { useEffect, useState, useRef } from "react";

//filepond
registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

export const FormProfile = () => {
  const editorRef = useRef(null);

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

    // Lấy nội dung từ TinyMCE Editor
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const description = editorRef.current
      ? (editorRef.current as any).getContent()
      : "";

    // Validate description
    if (!description || description.trim().length < 20) {
      toast.error("Mô tả chi tiết phải có ít nhất 20 ký tự");
      return;
    }

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
        <form id="profileForm" onSubmit={handleSubmit} className="grid sm:grid-cols-2 grid-cols-1 gap-5">
          <div className="sm:col-span-2">
            <label className="label">Logo công ty</label>
            <FilePond
              name="logo"
              allowMultiple={false}
              allowRemove
              labelIdle='Kéo & thả ảnh hoặc <span class="filepond--label-action">chọn file</span>'
              acceptedFileTypes={["image/*"]}
              onupdatefiles={setLogo}
              files={logo}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="companyName" className="label">Tên công ty *</label>
            <input type="text" name="companyName" id="companyName" className="input" defaultValue={infoCompany.companyName} />
          </div>
          <div>
            <label htmlFor="city" className="label">Thành phố</label>
            <select name="city" id="city" className="input" defaultValue={infoCompany.city}>
              {cityList?.map((city) => (
                <option key={city._id} value={city.name}>{city.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="address" className="label">Địa chỉ</label>
            <input type="text" name="address" id="address" className="input" defaultValue={infoCompany.address} />
          </div>
          <div>
            <label htmlFor="companyModel" className="label">Mô hình công ty</label>
            <input type="text" name="companyModel" id="companyModel" className="input" defaultValue={infoCompany.companyModel} />
          </div>
          <div>
            <label htmlFor="companyEmployees" className="label">Quy mô công ty</label>
            <input type="text" name="companyEmployees" id="companyEmployees" className="input" defaultValue={infoCompany.companyEmployees} />
          </div>
          <div>
            <label htmlFor="workingTime" className="label">Thời gian làm việc</label>
            <input type="text" name="workingTime" id="workingTime" className="input" defaultValue={infoCompany.workingTime} />
          </div>
          <div>
            <label htmlFor="workOvertime" className="label">Làm việc ngoài giờ</label>
            <input type="text" name="workOvertime" id="workOvertime" className="input" defaultValue={infoCompany.workOvertime} />
          </div>
          <div>
            <label htmlFor="email" className="label">Email *</label>
            <input type="email" name="email" id="email" className="input" defaultValue={infoCompany.email} />
          </div>
          <div>
            <label htmlFor="phone" className="label">Số điện thoại</label>
            <input type="text" name="phone" id="phone" className="input" defaultValue={infoCompany.phone} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className="label">Mô tả công ty</label>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_API_TINY}
              onInit={(_evt, editor) => (editorRef.current = editor)}
              initialValue={infoCompany.description}
              init={{
                height: 400,
                menubar: false,
                plugins: ["advlist", "autolink", "lists", "link", "image", "charmap", "anchor", "searchreplace", "visualblocks", "code", "fullscreen", "insertdatetime", "media", "table", "preview", "help", "wordcount"],
                toolbar: "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                content_style: "body { font-family: Lexend, sans-serif; font-size: 14px }",
              }}
            />
          </div>
          <div className="sm:col-span-2 pt-2">
            <button type="submit" className="btn-primary btn-lg">
              Cập nhật thông tin
            </button>
          </div>
        </form>
      )}
    </>
  );
};

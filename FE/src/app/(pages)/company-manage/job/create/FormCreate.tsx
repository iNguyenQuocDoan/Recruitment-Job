/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { Toaster, toast } from "sonner";

import { Editor } from "@tinymce/tinymce-react";
import JustValidate from "just-validate";
import { useEffect, useRef, useState } from "react";
import { positionList, workingFormList } from "@/config/variable";

// Register the FilePond plugins
registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

export const FormCreate = () => {
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [images, setImages] = useState<any>([]);

  useEffect(() => {
    const validator = new JustValidate("#createForm");

    validator
      .addField("#title", [
        {
          rule: "required",
          errorMessage: "Vui lòng nhập tên công việc",
        },
        {
          rule: "maxLength",
          value: 100,
          errorMessage: "Tên công việc không được vượt quá 100 ký tự",
        },
      ])
      .addField("#salaryMin", [
        {
          rule: "number",
          errorMessage: "Mức lương tối thiểu phải là số",
        },
      ])
      .addField("#salaryMax", [
        {
          rule: "number",
          errorMessage: "Mức lương tối đa phải là số",
        },
      ])
      .addField("#position", [
        {
          rule: "required",
          errorMessage: "Vui lòng chọn cấp bậc",
        },
      ])
      .addField("#workingForm", [
        {
          rule: "required",
          errorMessage: "Vui lòng chọn hình thức làm việc",
        },
      ]);
  }, []);

  const handleSubmit = (event: any) => {
    event.preventDefault();

    // Validate images manually since FilePond is not a standard input
    if (images.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ảnh");
      return;
    }

    const title = event.target.title.value;
    const salaryMin = event.target.salaryMin.value;
    const salaryMax = event.target.salaryMax.value;
    const position = event.target.position.value;
    const workingForm = event.target.workingForm.value;
    const technologies = event.target.technologies.value;
    const description = editorInstance ? editorInstance.getContent() : "";

    console.log({
      title,
      salaryMin,
      salaryMax,
      position,
      workingForm,
      technologies,
      images,
      description,
    });

    const formData = new FormData();
    formData.append("title", title);
    formData.append("salaryMin", salaryMin);
    formData.append("salaryMax", salaryMax);
    formData.append("position", position);
    formData.append("workingForm", workingForm);
    formData.append("technologies", technologies);
    formData.append("description", description);

    // Append images
    if (images.length > 0) {
      const imageFile = images[0].file;
      formData.append("images", imageFile);
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    fetch(`${apiUrl}/company/job/create`, {
      method: "PATCH",
      body: formData,
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        toast.success("Tạo công việc thành công!");
        console.log("Success:", data);
        event.target.reset();
        setImages([]);
      })
      .catch((error) => {
        toast.error("Đã xảy ra lỗi khi tạo công việc.");
        console.error("Error:", error);
      });
  };

  return (
    <>
      <form
        id="createForm"
        action=""
        className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]"
        onSubmit={handleSubmit}
      >
        <div className="sm:col-span-2">
          <label
            htmlFor="title"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Tên công việc *
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <label
            htmlFor="salaryMin"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Mức lương tối thiểu ($)
          </label>
          <input
            type="number"
            name="salaryMin"
            id="salaryMin"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <label
            htmlFor="salaryMax"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Mức lương tối đa ($)
          </label>
          <input
            type="number"
            name="salaryMax"
            id="salaryMax"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="">
          <label
            htmlFor="position"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Cấp bậc *
          </label>
          <select
            name="position"
            id="position"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          >
            {positionList.map((pos) => (
              <option key={pos.value} value={pos.value}>
                {pos.label}
              </option>
            ))}
          </select>
        </div>
        <div className="">
          <label
            htmlFor="workingForm"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Hình thức làm việc *
          </label>
          <select
            name="workingForm"
            id="workingForm"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          >
            {workingFormList.map((form) => (
              <option key={form.value} value={form.value}>
                {form.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="technologies"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Các công nghệ
          </label>
          <input
            type="text"
            name="technologies"
            id="technologies"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="images"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Danh sách ảnh *
          </label>
          <FilePond
            name="images"
            allowMultiple={true}
            allowRemove={true}
            maxFiles={8} // số lượng file tối đa được upload
            labelIdle="+"
            acceptedFileTypes={["image/*"]}
            onupdatefiles={setImages}
            files={images}
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="description"
            className="block font-[500] text-[14px] text-black mb-[5px]"
          >
            Mô tả chi tiết
          </label>
          <Editor
            apiKey={process.env.NEXT_PUBLIC_API_TINY}
            onInit={(_evt, editor) => setEditorInstance(editor)}
            id="description"
          />
        </div>
        <div className="sm:col-span-2">
          <button className="bg-[#0088FF] rounded-[4px] h-[48px] px-[20px] font-[700] text-[16px] text-white">
            Tạo mới
          </button>
        </div>
      </form>
    </>
  );
};

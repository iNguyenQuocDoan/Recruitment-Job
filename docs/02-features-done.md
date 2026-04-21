# Tính năng đã hoàn thành

> Khi hoàn thành một task, di chuyển từ `03-features-todo.md` sang đây. Thêm ngày hoàn thành và file liên quan.

## Backend

- [x] **Kết nối MongoDB + cấu hình CORS/cookie** — `BE/index.ts`, `BE/src/config/database.config.ts`
- [x] **Model account_user** — `BE/src/models/account-user.model.ts`
- [x] **Model account_company** — `BE/src/models/account-company.model.ts`
- [x] **Model jobs** — `BE/src/models/jobs.model.ts`
- [x] **Model city** — `BE/src/models/city.model.ts`
- [x] **User register** (hash password, check trùng email) — `user.controller.ts:registerPostController`
- [x] **User login** (JWT + cookie) — `user.controller.ts:loginPostController` ⚠️ có bug không check isPasswordValid
- [x] **Company register** — `company.controller.ts:registerPostController`
- [x] **Company login** (JWT + cookie, có check password) — `company.controller.ts:loginPostController`
- [x] **Auth check** (phân biệt user/company từ token) — `auth.controller.ts:check`
- [x] **Logout** (clear cookie) — `auth.controller.ts:logout`
- [x] **Middleware verifyTokenUser / verifyTokenCompany** — `auth.middleware.ts`
- [x] **Validate Joi** register/login/profile cho user và company
- [x] **User update profile** (upload avatar → Cloudinary) — `user.controller.ts:profilePatchController`
- [x] **Company update profile** (upload logo → Cloudinary) — `company.controller.ts:profilePatchController`
- [x] **Company create job** (upload nhiều ảnh) — `company.controller.ts:createJobPost`
- [x] **Company list job của chính mình** — `company.controller.ts:listJob`
- [x] **City list** — `city.controller.ts:list`

## Frontend

- [x] **Layout + Header + Footer** — `FE/src/app/layout.tsx`, `components/header/*`, `components/footer/Footer.tsx`
- [x] **Hook useAuth** (gọi `/auth/check`) — `FE/src/hooks/useAuth.ts`
- [x] **Axios instance** — `FE/src/lib/axios.ts`
- [x] **Middleware FE chặn route protected** — `FE/src/middleware.ts`
- [x] **User register/login form** (just-validate) — `(auth)/user/{register,login}/FormRegister.tsx`, `FormLogin.tsx`
- [x] **Company register/login form** — `(auth)/company/{register,login}/`
- [x] **Logout dropdown** — `components/header/HeaderAccount.tsx`
- [x] **User profile form** (upload avatar) — `user-manage/profile/FormProfile.tsx`
- [x] **Company profile form** (upload logo, TinyMCE description) — `company-manage/profile/FormProfile.tsx`
- [x] **Form tạo job** (FilePond nhiều ảnh + TinyMCE) — `company-manage/job/create/FormCreate.tsx`
- [x] **Danh sách job của company** — `company-manage/job/list/JobList.tsx`
- [x] **Pages tĩnh (UI only, chưa nối API)**: Home, Search, Job Detail, Company List, Company Detail, CV management (user + company)

## Infrastructure

- [x] **Folder `docs/` tracking context + features** — tạo ngày 2026-04-21

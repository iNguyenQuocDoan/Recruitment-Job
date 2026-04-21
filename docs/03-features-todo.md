# Tính năng sẽ phát triển

> Sắp xếp theo thứ tự ưu tiên. Mỗi tính năng có: mô tả, file cần sửa/tạo, acceptance criteria.
> Khi hoàn thành: tick `[x]`, ghi chú ngày, di chuyển sang `02-features-done.md`.

---

## 🔴 PHASE 1 — Fix bug & hoàn thiện Job CRUD (cấp thiết)

### 1.1 Fix bug bảo mật: User login không check password
- [ ] Sửa `BE/src/controllers/user.controller.ts:58-85`
- Hiện tại: tính `isPasswordValid` nhưng không dùng → ai có email đúng cũng login được
- **AC:** Sai mật khẩu → trả `{ code: "error", message: "Mật khẩu không đúng" }` với status 400

### 1.2 API xóa job
- [ ] `BE/src/routes/company.routes.ts` — thêm `DELETE /company/job/delete/:id`
- [ ] `BE/src/controllers/company.controller.ts` — thêm `deleteJob`
- [ ] Middleware `verifyTokenCompany` + kiểm tra `companyId` của job trùng `req.account._id` (tránh xóa job của company khác)
- **AC:** FE `JobList.tsx` xóa được job, job không thuộc company → 403

### 1.3 API sửa job + page FE
- [ ] BE: `PATCH /company/job/edit/:id` — validate giống create, cho phép thay ảnh
- [ ] BE: `GET /company/job/detail/:id` — lấy 1 job để fill form
- [ ] FE: tạo `FE/src/app/(pages)/company-manage/job/edit/[id]/page.tsx` + `FormEdit.tsx`
- **AC:** Click "Sửa" ở JobList → vào form có sẵn data → submit update thành công

---

## 🟡 PHASE 2 — API public cho trang User

### 2.1 API list job (public, có filter + phân trang)
- [ ] `BE/src/routes/` — thêm `job.routes.ts` với `GET /job/list`
- [ ] Query params: `keyword`, `city`, `position`, `workingForm`, `technologies`, `page`, `limit`
- [ ] Join với `account_company` để trả về `companyName`, `companyLogo`, `companyCity`
- **AC:** Gọi `/job/list?page=1&limit=12` trả về `{ code, data: [...], total, page }`

### 2.2 API chi tiết job
- [ ] `GET /job/detail/:id` — trả về job + thông tin company
- **AC:** Dùng cho FE `job/detail/[slug]/page.tsx`

### 2.3 API list company (public, có phân trang)
- [ ] `GET /company/public/list` (hoặc đổi prefix để tránh đụng `/company/login`)
- **AC:** Dùng cho FE `company/list/page.tsx`

### 2.4 API chi tiết company + job của company
- [ ] `GET /company/public/detail/:id` — trả info company + list job của company đó
- **AC:** Dùng cho FE `company/detail/[slug]/page.tsx`

### 2.5 Nối API vào trang FE public
- [ ] Home page — Section 1 search bar submit về `/search`, Section 2 top companies fetch real
- [ ] Search page — filter thật + phân trang thật
- [ ] Job detail page — fetch theo slug/id
- [ ] Company list/detail — fetch thật

---

## 🟢 PHASE 3 — CV / Ứng tuyển

### 3.1 Model CV
- [ ] `BE/src/models/cv.model.ts` — fields: `jobId`, `userId`, `fullName`, `email`, `phone`, `fileUrl` (PDF trên Cloudinary), `status` (`pending|approved|rejected`), `viewed` (boolean)
- **AC:** Lưu được CV, query theo `jobId` hoặc `userId`

### 3.2 API user gửi CV
- [ ] `POST /cv/submit` (không bắt buộc login user — cho phép guest apply?)
- [ ] Upload PDF lên Cloudinary (cần cấu hình resource_type: "raw" hoặc "auto")
- **AC:** FE form ứng tuyển ở job detail submit thành công

### 3.3 API company quản lý CV
- [ ] `GET /company/cv/list` — tất cả CV của các job thuộc company, có filter theo `jobId`, `status`
- [ ] `GET /company/cv/detail/:id` — chi tiết CV + đánh dấu `viewed = true`
- [ ] `PATCH /company/cv/:id/approve` và `/reject`
- [ ] `DELETE /company/cv/:id`
- **AC:** FE `company-manage/cv/list` + `cv/detail/[slug]` hoạt động đầy đủ

### 3.4 API user xem CV đã gửi
- [ ] `GET /user/cv/list` — CV mà userId (hoặc email) đã gửi
- [ ] `DELETE /user/cv/:id` — chỉ xóa khi `status = pending`
- **AC:** FE `user-manage/cv/list` hoạt động

### 3.5 Preview PDF trong FE
- [ ] Dùng `<iframe>` hoặc `react-pdf` để preview file CV
- [ ] Thay thế div placeholder ở `company-manage/cv/detail/[slug]/page.tsx:46`

---

## 🔵 PHASE 4 — UX & bảo mật

### 4.1 Quên mật khẩu
- [ ] BE: `POST /user/forgot-password`, `POST /user/reset-password` (gửi email token qua nodemailer)
- [ ] FE: trang forgot password + reset password form

### 4.2 Đổi mật khẩu (đã login)
- [ ] BE: `PATCH /user/change-password` (check mật khẩu cũ)
- [ ] FE: section trong trang profile

### 4.3 Verify email khi register
- [ ] Gửi OTP/link verify sau khi đăng ký
- [ ] Block login nếu chưa verify

### 4.4 Refresh token
- [ ] Tách access token (ngắn hạn) + refresh token (dài hạn, httpOnly cookie)

### 4.5 Hardcode secure cookie khi production
- [ ] `secure: process.env.NODE_ENV === "production"` thay cho `false`

### 4.6 Rate limit + helmet
- [ ] `express-rate-limit` cho `/user/login`, `/company/login`, `/user/register`
- [ ] `helmet()` middleware

---

## ⚪ PHASE 5 — Mở rộng

### 5.1 Admin panel
- [ ] Role `admin` — duyệt company, ẩn job spam, xem thống kê

### 5.2 Thông báo (notification)
- [ ] Model notification + realtime qua socket.io hoặc SSE
- [ ] Company được thông báo khi có CV mới
- [ ] User được thông báo khi CV được duyệt/từ chối

### 5.3 SEO slug
- [ ] Thêm field `slug` cho `jobs` và `account_company` (unique, auto-gen từ title)
- [ ] Route FE đổi sang dùng slug thay vì id

### 5.4 Header menu động
- [ ] `FE/src/app/components/header/HeaderMenu.tsx` — lấy list skill + city + top company từ API

### 5.5 Pagination component chung
- [ ] Thay thế `<select>` tĩnh ở các trang bằng component `<Pagination />` dùng Next.js Link

### 5.6 Thống kê cho company
- [ ] Số lượng CV theo job, tỉ lệ duyệt

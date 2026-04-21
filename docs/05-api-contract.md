# API Contract

> Tài liệu các endpoint BE. Mỗi khi thêm/sửa API, cập nhật file này.
>
> Base URL dev: `http://localhost:3001`
> Mọi response có dạng chung: `{ code: "success" | "error", message?: string, ...data }`
> Mọi request cần auth đều gửi cookie `token` (FE dùng `credentials: "include"`).

## Auth

### `GET /auth/check`
Kiểm tra login, trả về info user hoặc company.
- **Response (user):** `{ code: "success", infoUser: { id, email, fullName, phone, avatar } }`
- **Response (company):** `{ code: "success", infoCompany: { id, email, companyName, logo, phone, city, address, companyModel, companyEmployees, workingTime, workOvertime, description } }`
- **Response (chưa login):** `{ code: "unauthenticated", message }`

### `POST /auth/logout`
Clear cookie `token`. Response: `{ code: "success", message }`

---

## User

### `POST /user/register`
- **Body:** `{ fullName, email, password }`
- Password policy: min 8, có hoa/thường/số/ký tự đặc biệt

### `POST /user/login`
- **Body:** `{ email, password }`
- Set cookie `token` (JWT, 7d)
- ⚠️ **Bug chưa fix:** Không check `isPasswordValid` — sẽ fix ở task 1.1

### `PATCH /user/profile` 🔒
- **Auth:** user
- **Body (multipart/form-data):** `fullName, email, phone?, avatar?` (file)

---

## Company

### `POST /company/register`
- **Body:** `{ companyName, email, password }`

### `POST /company/login`
- **Body:** `{ email, password }`
- Set cookie `token`

### `PATCH /company/profile` 🔒
- **Auth:** company
- **Body (multipart/form-data):** `companyName, email, phone?, city?, address, companyModel, companyEmployees, workingTime, workOvertime?, description, logo?` (file)

### `PATCH /company/job/create` 🔒
- **Auth:** company
- **Body (multipart/form-data):** `title, salaryMin?, salaryMax?, position, workingForm, technologies` (CSV string), `description, images[]` (tối đa 8 file)
- ⚠️ Method là `PATCH` nhưng logic là tạo mới — cân nhắc đổi thành `POST`

### `GET /company/job/list` 🔒
- **Auth:** company
- **Response:** `{ code: "success", data: [{ _id, companyLogo, title, companyName, salaryMin, salaryMax, position, workingForm, technologies, companyCity, images, description }] }`

---

## City

### `GET /city/list`
- **Response:** `{ code: "success", cityList: [{ _id, name }] }`

---

## API sẽ thêm (Phase 1-3)

### `DELETE /company/job/delete/:id` 🔒 — task 1.2
### `PATCH /company/job/edit/:id` 🔒 — task 1.3
### `GET /company/job/detail/:id` 🔒 — task 1.3
### `GET /job/list` (public) — task 2.1
### `GET /job/detail/:id` (public) — task 2.2
### `GET /company/public/list` — task 2.3
### `GET /company/public/detail/:id` — task 2.4
### `POST /cv/submit` — task 3.2
### `GET /company/cv/list` 🔒 — task 3.3
### `GET /company/cv/detail/:id` 🔒 — task 3.3
### `PATCH /company/cv/:id/approve|reject` 🔒 — task 3.3
### `DELETE /company/cv/:id` 🔒 — task 3.3
### `GET /user/cv/list` 🔒 — task 3.4
### `DELETE /user/cv/:id` 🔒 — task 3.4

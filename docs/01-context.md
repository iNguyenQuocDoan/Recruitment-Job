# Context kỹ thuật

## Tên dự án
**28.ITJobs** — Website tuyển dụng việc làm IT cho Developer (Job Board).

## Hai loại tài khoản
- **User** (ứng viên) — tìm việc, gửi CV
- **Company** (nhà tuyển dụng) — đăng tin tuyển dụng, quản lý CV ứng viên

## Stack

### Backend (`BE/`)
- Node.js + **Express 5** + TypeScript
- MongoDB + Mongoose
- Auth: **JWT** lưu trong **httpOnly cookie** (`token`), hết hạn 7 ngày
- Validate: **Joi**
- Upload: **Multer** + **Cloudinary** (`multer-storage-cloudinary`)
- Hash: **bcryptjs**
- Dev: `nodemon index.ts` (port **3001**)

### Frontend (`FE/`)
- **Next.js 15** (App Router) + React 19 + TypeScript
- **Tailwind CSS**
- Editor: **TinyMCE** (`@tinymce/tinymce-react`)
- Upload UI: **FilePond** (`react-filepond`)
- Validate: **just-validate**
- Toast: **sonner**
- Icons: **react-icons** (fa6)
- Dev: `next dev` (port **3000**)

## Cấu trúc thư mục

```
BE/
  index.ts                         # entry, bật express + cors + cookieParser
  src/
    config/database.config.ts      # kết nối MongoDB
    controllers/                   # auth, city, company, user
    models/                        # account-user, account-company, jobs, city
    routes/                        # index, auth, user, company, city
    middleware/auth.middleware.ts  # verifyTokenUser, verifyTokenCompany
    validates/                     # Joi schemas
    helper/cloudinary.helper.ts    # storage config
    interfaces/request.interface.ts

FE/src/
  app/
    layout.tsx
    (pages)/
      (home)/page.tsx
      (auth)/user/{login,register}/
      (auth)/company/{login,register}/
      job/detail/[slug]/
      company/{list,detail/[slug]}/
      search/
      user-manage/{profile,cv/list}/
      company-manage/{profile,job/create,job/list,cv/list,cv/detail/[slug]}/
    components/{header,footer,card}/
  hooks/useAuth.ts
  lib/axios.ts
  middleware.ts                    # chặn /company-manage, /user-manage khi chưa login
  config/variable.tsx              # positionList, workingFormList
```

## Biến môi trường

### BE/.env
```
JWT_SECRET=...
MONGO_URL=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### FE/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_TINY=...            # TinyMCE API key
```

## Quy ước code

- **Response format BE**: `{ code: "success" | "error", message?, data? | infoUser? | infoCompany? | cityList? }`
- **Cookie auth**: FE luôn gọi fetch với `credentials: "include"`
- **Route pattern**: BE dùng `/user/*`, `/company/*`, `/auth/*`, `/city/*`. Trong `/company/*` có sub `/job/*`
- **FE auth redirect**: `FE/src/middleware.ts` chặn `/company-manage/*` và `/user-manage/*` nếu không có cookie `token`
- **Model naming**: collection MongoDB dùng snake_case (`account_user`, `account_company`, `jobs`, `cities`), Mongoose model dùng PascalCase
- **Controller hiện tại** trả về field `_id` của MongoDB, FE dùng `_id` làm key

## Bug / nợ kỹ thuật cần nhớ

1. **[BUG BẢO MẬT]** `BE/src/controllers/user.controller.ts:58` — login user có `bcrypt.compare` nhưng **không check `isPasswordValid`**, đăng nhập được với mật khẩu sai. Company login đã fix đúng.
2. **Cookie `secure: false`** ở cả auth/user/company controller — đúng cho dev HTTP, nhớ đổi `true` khi lên production HTTPS.
3. **FE gọi API chưa tồn tại**: `DELETE /company/job/delete/:id` ở `FE/src/app/(pages)/company-manage/job/list/JobList.tsx:129`.
4. **HeaderAccount logout hardcode redirect** `/user/login` — kể cả khi tài khoản là company (nên redirect `/company/login`).

## Ghi chú thư viện (để khỏi quên khi debug)

### Joi 18 (`BE/node_modules/joi@18.0.2`)
- `helpers.error(code, local?)` — `code` là ĐỊNH DANH (vd: `"password.uppercase"`), KHÔNG phải message text. Message phải định nghĩa trong `.messages({ "<code>": "text" })` riêng.
- `helpers.message(messages, local?)` — tồn tại ở runtime (`lib/validator.js:313`) nhưng KHÔNG có trong TS type `CustomHelpers` (`lib/index.d.ts`). Code hardcoded là `'custom'`. Dùng cần `// @ts-expect-error` hoặc cast.
- `throw new Error("...")` trong `.custom()` sẽ bị wrap thành `"<field>" failed custom validation because <msg>` (message mặc định của `any.custom`).
- Custom message phân biệt `any.required` (field undefined) vs `string.empty` (field = "").

### Multer v2 (`BE/node_modules/multer@2.x`)
- Version 2 có breaking change so với v1 — docs official mới chính xác. Dùng `multer-storage-cloudinary` cho upload trực tiếp lên Cloudinary.

### Express 5 (`BE/node_modules/express@5.2.1`)
- Async handler **tự catch** error (khác Express 4 — không cần wrap `try/catch` nếu chỉ cần next(err)).
- Router đổi tên: dùng named param `:id` giống v4.

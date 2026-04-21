# 28.ITJobs — Tài liệu dự án

Folder này là **bộ nhớ dài hạn** cho dự án. Khi mở phiên chat Claude mới, yêu cầu Claude đọc toàn bộ folder `docs/` trước khi làm việc để không mất context.

## Mục lục

| File | Nội dung |
|------|----------|
| [01-context.md](./01-context.md) | Stack, kiến trúc, quy ước code, biến môi trường |
| [02-features-done.md](./02-features-done.md) | Các tính năng đã hoàn thành (checklist + file liên quan) |
| [03-features-todo.md](./03-features-todo.md) | Danh sách tính năng sẽ làm, sắp xếp theo ưu tiên |
| [04-progress.md](./04-progress.md) | Nhật ký tiến độ — đang làm gì, đã xong phase nào |
| [05-api-contract.md](./05-api-contract.md) | Tài liệu các API endpoint (request/response) |

## Quy tắc cập nhật

**BẮT BUỘC** cập nhật khi:
- Hoàn thành một tính năng → move từ `03-features-todo.md` sang `02-features-done.md`
- Thêm/sửa API → cập nhật `05-api-contract.md`
- Phát sinh quyết định kiến trúc mới → bổ sung vào `01-context.md`
- Kết thúc mỗi phiên làm việc → ghi 1 dòng vào `04-progress.md`

## 📚 Rule DẠY HỌC — QUAN TRỌNG

> **Người dùng đang học cả BE lẫn FE.** Với MỌI tính năng trong `03-features-todo.md`, Claude **KHÔNG được** tự code hết rồi đưa diff. Phải:

1. **Chỉ từng bước** — chia task thành các bước nhỏ (Bước 1, Bước 2...), mỗi bước làm 1 việc rõ ràng.
2. **Giải thích WHY** — với MỖI đoạn code (cả BE và FE), phải giải thích:
   - *Tại sao* dùng cú pháp/pattern này (ví dụ: tại sao `async/await` thay vì callback, tại sao `multer.single` thay vì `multer.array`, tại sao `useEffect` deps rỗng, tại sao `credentials: "include"`...)
   - *Tại sao* đặt ở file này, thư mục này (ví dụ: tại sao validate ở `validates/` chứ không nhét vào controller)
   - *Tại sao* chọn HTTP method / status code này
   - *Tại sao* trả về field này mà không phải field khác
3. **BE trước, FE sau** — mỗi tính năng làm BE hoàn chỉnh + test bằng Postman/curl → rồi mới sang FE. Không code song song để tránh rối.
4. **Người dùng tự gõ** — Claude chỉ ĐƯA code + giải thích, để người dùng copy/gõ lại. Chỉ dùng `Edit`/`Write` khi người dùng yêu cầu rõ "code giúp tôi".
5. **Sau mỗi bước**: hỏi *"Bạn đã hiểu phần này chưa? Có muốn tôi giải thích sâu hơn chỗ nào không?"* trước khi sang bước tiếp theo.
6. **Đối chiếu pattern cũ** — khi code cái mới, so sánh với code đã có trong repo (ví dụ: "giống pattern của `loginPostController` ở dòng X, nhưng khác ở chỗ...") để củng cố kiến thức.
7. **ĐỌC SOURCE THƯ VIỆN TRƯỚC KHI ĐỀ XUẤT CODE** — với thư viện bên thứ 3 (Joi, Mongoose, Multer, bcrypt...), Claude PHẢI đọc `node_modules/<lib>/lib/*.js` hoặc `node_modules/<lib>/lib/index.d.ts` để xác minh API cho đúng version đang dùng. KHÔNG được tư vấn theo trí nhớ hay Stack Overflow cũ. Version trong `package.json` phải đối chiếu với source. Khi lỗi xuất hiện từ thư viện, grep error message trong `node_modules/<lib>` để tìm root cause.
   - Ví dụ: Joi 18 có `helpers.message()` trong runtime (`node_modules/joi/lib/validator.js:313`) nhưng KHÔNG có trong TypeScript types (`lib/index.d.ts`). Phải đọc mới biết.
   - Ví dụ khác: Multer v2 có API khác v1 (breaking change storage config). Trước khi sửa upload phải đọc `node_modules/multer/README.md`.
8. **KÉO DOC MỚI NHẤT VỀ ĐỂ HỌC VÀ CHỈ** — ngoài đọc source trong `node_modules`, Claude PHẢI dùng WebFetch lấy **official documentation mới nhất** của thư viện (đúng version đang dùng) TRƯỚC khi hướng dẫn tính năng mới. Source `node_modules` cho biết API tồn tại thế nào; official docs cho biết **cách dùng đúng pattern, migration notes, best practice**.
   - Nguồn chính thức ưu tiên:
     - Joi: `https://joi.dev/api/`
     - Mongoose: `https://mongoosejs.com/docs/`
     - Express 5: `https://expressjs.com/en/5x/api.html`
     - Multer: `https://github.com/expressjs/multer`
     - Cloudinary: `https://cloudinary.com/documentation/node_integration`
     - Next.js 15 App Router: `https://nextjs.org/docs/app`
     - TinyMCE React: `https://www.tiny.cloud/docs/tinymce/latest/react-cloud/`
     - FilePond: `https://pqina.nl/filepond/docs/`
   - Quy trình: (1) check version ở `package.json` → (2) WebFetch docs cùng version → (3) đối chiếu với `node_modules` → (4) đề xuất code.
   - Kết quả fetch ghi lại vào `docs/01-context.md` section "Ghi chú thư viện" để không phải fetch lại.

**Ví dụ ĐÚNG** khi hướng dẫn API xóa job:
> Bước 1: Thêm route `DELETE /job/delete/:id` trong `company.routes.ts`.
> ```ts
> router.delete("/job/delete/:id", authMiddleware.verifyTokenCompany, companyController.deleteJob);
> ```
> **Tại sao `DELETE`?** REST convention: GET=đọc, POST=tạo, PATCH=sửa 1 phần, DELETE=xóa. Dùng đúng method giúp FE/BE nói cùng ngôn ngữ và cache tầng middle (CDN, proxy) hiểu được là request này không idempotent-safe.
> **Tại sao `:id` trong URL thay vì body?** DELETE theo RFC không nên có body (nhiều proxy strip bỏ). ID là định danh tài nguyên → đặt trong path chuẩn REST.
> **Tại sao middleware trước controller?** Express chạy middleware theo thứ tự — phải xác thực TRƯỚC khi chạm DB để chặn request không hợp lệ sớm, tiết kiệm tài nguyên.

**Ví dụ SAI:**
> "Đây là code xóa job, bạn copy vào nhé: [dump 30 dòng code]"

## Prompt gợi ý mở đầu phiên chat mới

```
Đọc toàn bộ folder docs/ trước, đặc biệt rule DẠY HỌC trong README.md.
Sau đó tiếp tục từ task đang làm dở trong 04-progress.md, chỉ tôi từng bước và giải thích tại sao.
```

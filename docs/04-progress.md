# Nhật ký tiến độ

> Mỗi entry ghi 1-3 dòng: đang làm gì, trạng thái, file đang động vào. Entry mới nhất ở TRÊN CÙNG.

## 2026-04-21

- **Khởi tạo folder `docs/`** để track context + features dài hạn qua nhiều phiên chat.
- **Phase hiện tại:** PHASE 1 — chuẩn bị fix bug user login (task 1.1 trong `03-features-todo.md`).
- **Task kế tiếp:** `BE/src/controllers/user.controller.ts:58-85` — thêm check `isPasswordValid`, chưa bắt đầu code.
- **Lưu ý:** Chưa chạy `yarn start` để xác minh BE running; khi resume cần check DB kết nối và `.env` có `JWT_SECRET`.

---

## Template cho entry mới

```
## YYYY-MM-DD

- **Vừa xong:** ... (file: ...)
- **Đang làm:** ... (trong phase ... / task ...)
- **Vướng mắc:** ...
- **Task kế tiếp:** ...
```

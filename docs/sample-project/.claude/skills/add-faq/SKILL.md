---
name: add-faq
description: Thêm hoặc cập nhật một chính sách/câu hỏi thường gặp cho agent CSKH. Dùng khi người dùng muốn bổ sung chính sách mới (đổi trả, giao hàng, thanh toán...) hoặc agent trả lời sai về chính sách.
---

# Thêm chính sách / FAQ

1. Xác định chủ đề và chọn file trong `knowledge/` (tạo file mới nếu chủ đề chưa có, tên file dạng `kebab-case.md`).
2. Viết nội dung ngắn gọn, mỗi quy định một gạch đầu dòng, có số liệu cụ thể (số ngày, số tiền).
3. Thêm ít nhất 2 test case vào `evals/cases.jsonl`: một câu hỏi có đáp án trong chính sách mới, một câu hỏi bẫy không có.
4. Chạy `pytest -q`. Nhắc người dùng chạy eval trước khi merge (eval tốn phí API).

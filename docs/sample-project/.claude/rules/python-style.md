---
paths:
  - "src/**/*.py"
  - "tests/**/*.py"
---

# Quy tắc Python (chỉ nạp khi Claude đọc file Python)

- Hàm tool trả về `str`, lỗi thì raise `ToolError` với thông báo hướng dẫn cách sửa.
- Không gọi API Claude trong `tests/`: test tool bằng dữ liệu giả.
- Đọc cấu hình từ biến môi trường, không viết cứng key hay đường dẫn tuyệt đối.

# ai-agent

Trang học **lộ trình 6 tháng đạt chứng chỉ Claude Certified Architect – Foundations (CCAR-F)** cho người mới bắt đầu. Trang viết bằng HTML/CSS/JS thuần, không cần build.

**Xem trang học:** https://nguyentungducbk96.github.io/ai-agent/

## Nội dung

| Trang | Chức năng |
| --- | --- |
| `docs/index.html` | Tổng quan lộ trình, tiến độ học, thông tin kỳ thi |
| `docs/lesson.html` | 24 bài học (6 tháng × 4 tuần): lý thuyết, code mẫu, bài tập kèm gợi ý và lời giải, quiz |
| `docs/exam.html` | Cách đăng ký thi, cấu trúc đề, chiến lược làm bài, đề thi thử có bấm giờ và chấm điểm theo domain |

Tiến độ (bài đã học, bài tập, lịch sử thi thử) được lưu trong `localStorage` của trình duyệt.

## Xem trang

```bash
python3 -m http.server -d docs 8000
# mở http://localhost:8000
```

Bạn cũng có thể mở trực tiếp file `docs/index.html` bằng trình duyệt.

## Cấu trúc

```
docs/
├── index.html, lesson.html, exam.html
└── assets/
    ├── css/style.css
    └── js/
        ├── app.js            # tiện ích dùng chung: header, lưu tiến độ, code block, quiz
        ├── exam-data.js      # ngân hàng câu hỏi thi thử
        ├── data/month1..6.js # nội dung bài học
        └── pages/*.js        # script riêng của từng trang
```

Muốn thêm bài học, thêm một object vào `window.LESSONS` trong file `data/monthN.js` tương ứng.

> Tài liệu này do nhóm tự biên soạn để học tập, không phải tài liệu chính thức của Anthropic. Thông tin về kỳ thi có thể thay đổi, nên kiểm tra lại trên Pearson VUE và Anthropic Partner Academy.

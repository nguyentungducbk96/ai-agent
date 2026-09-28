# ai-agent

Trang học **lộ trình 6 tháng đạt chứng chỉ Claude Certified Architect – Foundations (CCAR-F)** cho người mới bắt đầu. Trang viết bằng HTML/CSS/JS thuần, không cần build.

**Xem trang học:** https://nguyentungducbk96.github.io/ai-agent/

## Nội dung

| Trang | Chức năng |
| --- | --- |
| `docs/index.html` | Tổng quan lộ trình, tiến độ học, thông tin kỳ thi |
| `docs/lesson.html` | 37 bài học (6 tháng + chuyên đề Claude cho Fullstack): lý thuyết, sơ đồ, ví dụ thực tế, bài tập có hướng dẫn giải, quiz, **ngân hàng 100 câu mỗi bài** (3.700 câu, độ khó tăng dần) và **111 bài thực hành** NestJS / Next.js / AWS / GitHub Actions |
| `docs/project.html` | Project mẫu `shop-support-agent`: cấu trúc thư mục, Claude nạp file nào trước, vòng xử lý của Claude Code và agent API, kèm sơ đồ và mẹo nhớ |
| `docs/sample-project/` | Mã nguồn project mẫu (CLAUDE.md, .claude/, .mcp.json, agent, MCP server, eval, test) |
| `docs/exam.html` | Cách đăng ký thi, cấu trúc đề, chiến lược làm bài, ngân hàng 91 câu: luyện nhanh, đề đầy đủ 60 câu/120 phút, luyện theo domain |

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
        ├── exam/extra-m*.js  # câu hỏi thi thử bổ sung theo tháng
        ├── data/month1..7.js # nội dung bài học
        ├── data/qbank/*.js   # 100 câu mỗi bài, tải khi mở bài
        ├── data/labs/*.js    # bài thực hành fullstack, tải khi mở bài
        └── pages/*.js        # script riêng của từng trang
```

Muốn thêm bài học, thêm một object vào `window.LESSONS` trong file `data/monthN.js` tương ứng.

> Tài liệu này do nhóm tự biên soạn để học tập, không phải tài liệu chính thức của Anthropic. Thông tin về kỳ thi có thể thay đổi, nên kiểm tra lại trên Pearson VUE và Anthropic Partner Academy.

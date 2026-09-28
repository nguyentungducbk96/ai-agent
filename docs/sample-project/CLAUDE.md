# shop-support-agent

Agent chăm sóc khách hàng cho shop sách online "Sách Hay". Agent trả lời câu hỏi về đơn hàng và chính sách bằng Claude API và tool use. Dữ liệu đơn hàng được cung cấp qua một MCP server nội bộ.

Kiến trúc chi tiết: @docs/architecture.md

## Lệnh
- Cài đặt: `pip install -r requirements.txt`
- Chạy agent: `python src/agent.py "Đơn SH1024 của tôi đang ở đâu?"`
- Test: `pytest -q`
- Eval (tốn phí API): `python evals/run_evals.py`

## Quy ước
- Python 3.11+, có type hint, format bằng `ruff format` (hook tự chạy sau mỗi lần sửa file `.py`).
- System prompt nằm trong `prompts/system.md`. Chính sách nằm trong `knowledge/`. Không viết cứng hai phần này vào code.
- Tool mới: khai báo trong `src/tools.py` (gồm schema, hàm xử lý và test trong `tests/`).
- Model mặc định là `claude-opus-5`. Chỉ đổi model khi eval chứng minh chất lượng vẫn giữ được.

## Không hiển nhiên
- `data/orders.json` là dữ liệu giả để phát triển; môi trường thật dùng API kho.
- Không đọc hoặc sửa `.env`, `.mcp.json` có token thật (đã chặn trong `.claude/settings.json`).
- Eval gọi API thật: chạy trước khi merge thay đổi prompt, không chạy trong vòng lặp.

# shop-support-agent – project mẫu

Project mẫu cho lộ trình chứng chỉ Claude: agent chăm sóc khách hàng cho shop sách "Sách Hay". Project dùng đủ các thành phần sẽ gặp trong kỳ thi: Claude API với tool use, prompt caching, MCP server, cấu hình Claude Code (CLAUDE.md, settings, hooks, skills, subagent, rules) và eval.

Giải thích bằng sơ đồ: https://nguyentungducbk96.github.io/ai-agent/project.html

## Cấu trúc

```
shop-support-agent/
├── CLAUDE.md                  # Claude Code nạp khi mở phiên: lệnh, quy ước, @import kiến trúc
├── .mcp.json                  # MCP server "orders" (stdio) + GitHub (HTTP, token từ biến môi trường)
├── .env.example               # mẫu biến môi trường, file .env thật bị .gitignore
├── .gitignore
├── requirements.txt
├── .claude/
│   ├── settings.json          # permissions allow/ask/deny + đăng ký hooks
│   ├── hooks/
│   │   ├── protect-secrets.sh # PreToolUse: chặn sửa .env / .mcp.json (exit 2)
│   │   └── format-python.sh   # PostToolUse: ruff format file .py vừa sửa
│   ├── skills/add-faq/SKILL.md  # quy trình thêm chính sách; chỉ mô tả được nạp lúc đầu
│   ├── agents/code-reviewer.md  # subagent review, chỉ có tool đọc
│   └── rules/python-style.md    # rule theo đường dẫn, chỉ nạp khi Claude đọc file .py
├── docs/architecture.md       # được CLAUDE.md @import
├── prompts/system.md          # system prompt của agent (không viết cứng trong code)
├── knowledge/                 # chính sách: đổi trả, giao hàng (đưa vào system + cache)
├── data/orders.json           # dữ liệu đơn hàng giả
├── src/
│   ├── tools.py               # schema tool + hàm xử lý + ToolError có hướng dẫn
│   ├── agent.py               # vòng lặp tool use, cache_control, MAX_TURNS, xử lý stop_reason
│   └── orders_mcp.py          # cùng tool đó nhưng mở qua MCP (FastMCP, stdio)
├── evals/
│   ├── cases.jsonl            # 6 test case, có câu bẫy và câu yêu cầu hoàn tiền
│   └── run_evals.py           # chạy agent thật và chấm (tốn phí API)
└── tests/test_tools.py        # unit test tool, không gọi API
```

## Chạy thử

```bash
cd docs/sample-project
pip install -r requirements.txt
cp .env.example .env               # điền ANTHROPIC_API_KEY, sau đó export các biến trong .env
pytest -q                          # test tool, không tốn phí
python src/agent.py "Đơn SH1024 của tôi đang ở đâu?"
python evals/run_evals.py          # eval, gọi API thật
```

Dùng với Claude Code: mở `claude` trong thư mục này, duyệt MCP server trong `.mcp.json` khi được hỏi, rồi thử các lệnh:
- "Tra đơn SH1025": dùng MCP `orders`.
- "Thêm chính sách thanh toán COD": skill `add-faq` được nạp.
- "Dùng code-reviewer kiểm tra thay đổi": gọi subagent.
- "Sửa file .env": bị hook và permission chặn.

# Kiến trúc

```
Khách hàng ──► src/agent.py ──► Claude API (Messages)
                   │                 │ tool_use
                   │◄────────────────┘
                   ├── src/tools.py ── lookup_order ──► data/orders.json
                   │                └─ search_policy ─► knowledge/*.md
                   └── (cùng dữ liệu cũng được mở qua MCP: src/orders_mcp.py)
```

- **System prompt** = `prompts/system.md` + toàn bộ `knowledge/*.md`. Phần này ổn định, được đánh dấu `cache_control` để tận dụng prompt caching.
- **Vòng lặp agent**: tối đa `MAX_TURNS = 8` lượt. Lỗi tool được trả về với `is_error: true` và thông báo có hướng dẫn cách sửa.
- **Hành động rủi ro** (hoàn tiền) không có tool. Agent chỉ tạo yêu cầu chuyển cho nhân viên duyệt.
- **MCP server** `orders_mcp.py` mở cùng dữ liệu đơn hàng cho Claude Code và Claude Desktop dùng khi hỗ trợ nội bộ.

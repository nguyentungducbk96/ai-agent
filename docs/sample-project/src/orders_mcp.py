"""MCP server (stdio) mở dữ liệu đơn hàng cho Claude Code / Claude Desktop.

Đăng ký: đã khai báo sẵn trong .mcp.json (server "orders").
Test riêng: mcp dev src/orders_mcp.py
"""

from mcp.server.fastmcp import FastMCP

from tools import ToolError, lookup_order as _lookup_order, search_policy as _search_policy

mcp = FastMCP("orders")


@mcp.tool()
def lookup_order(order_id: str) -> str:
    """Tra trạng thái đơn hàng theo mã (dạng SH + 4 chữ số, ví dụ SH1024)."""
    try:
        return _lookup_order(order_id)
    except ToolError as e:
        return f"Lỗi: {e}"


@mcp.tool()
def search_policy(keyword: str) -> str:
    """Tìm đoạn chính sách của shop chứa từ khoá (đổi trả, giao hàng, thanh toán)."""
    try:
        return _search_policy(keyword)
    except ToolError as e:
        return f"Lỗi: {e}"


if __name__ == "__main__":
    mcp.run()  # transport mặc định: stdio

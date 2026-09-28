"""Tool definitions (schema for Claude) and their Python implementations."""

import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ORDERS_FILE = ROOT / os.environ.get("ORDERS_FILE", "data/orders.json")
KNOWLEDGE_DIR = ROOT / "knowledge"
ORDER_ID = re.compile(r"^SH\d{4}$")


class ToolError(Exception):
    """Lỗi có thông báo hướng dẫn, được trả về cho Claude với is_error=True."""


TOOLS = [
    {
        "name": "lookup_order",
        "description": (
            "Tra trạng thái một đơn hàng của shop Sách Hay theo mã đơn. "
            "Dùng khi khách hỏi đơn đang ở đâu, khi nào giao, đã thanh toán chưa. "
            "Trả về trạng thái, ngày dự kiến giao, danh sách sách. Không dùng để tìm chính sách."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "order_id": {"type": "string", "description": "Mã đơn dạng SH + 4 chữ số, ví dụ SH1024"}
            },
            "required": ["order_id"],
            "additionalProperties": False,
        },
        "strict": True,
    },
    {
        "name": "search_policy",
        "description": (
            "Tìm đoạn chính sách của shop (đổi trả, giao hàng, thanh toán) chứa từ khoá. "
            "Dùng khi câu hỏi cần trích dẫn chính xác quy định. Trả tối đa 3 đoạn kèm tên file nguồn."
        ),
        "input_schema": {
            "type": "object",
            "properties": {"keyword": {"type": "string", "description": "Từ khoá ngắn, ví dụ 'đổi trả'"}},
            "required": ["keyword"],
            "additionalProperties": False,
        },
        "strict": True,
    },
]


def lookup_order(order_id: str) -> str:
    order_id = order_id.strip().upper()
    if not ORDER_ID.match(order_id):
        raise ToolError(f"Mã đơn '{order_id}' sai định dạng. Mã đúng có dạng SH + 4 chữ số, ví dụ SH1024.")
    orders = json.loads(ORDERS_FILE.read_text(encoding="utf-8"))
    order = orders.get(order_id)
    if order is None:
        raise ToolError(f"Không tìm thấy đơn {order_id}. Hãy hỏi lại khách mã đơn trong email xác nhận.")
    return json.dumps({"order_id": order_id, **order}, ensure_ascii=False)


def search_policy(keyword: str) -> str:
    keyword = keyword.strip().lower()
    if len(keyword) < 2:
        raise ToolError("Từ khoá quá ngắn, hãy dùng ít nhất 2 ký tự, ví dụ 'đổi trả'.")
    hits = []
    for path in sorted(KNOWLEDGE_DIR.glob("*.md")):
        for para in path.read_text(encoding="utf-8").split("\n\n"):
            if keyword in para.lower():
                hits.append(f"[{path.name}]\n{para.strip()}")
    if not hits:
        return f"Không có đoạn chính sách nào chứa '{keyword}'. Chính sách có thể không đề cập vấn đề này."
    return "\n\n".join(hits[:3])


HANDLERS = {"lookup_order": lookup_order, "search_policy": search_policy}


def run_tool(name: str, args: dict) -> str:
    if name not in HANDLERS:
        raise ToolError(f"Tool '{name}' không tồn tại. Các tool có sẵn: {', '.join(HANDLERS)}.")
    return HANDLERS[name](**args)

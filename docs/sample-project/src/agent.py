"""Agent CSKH: vòng lặp tool use với Claude API, có prompt caching và giới hạn lượt.

Chạy: python src/agent.py "Đơn SH1024 của tôi đang ở đâu?"
"""

import sys
from pathlib import Path

import anthropic

from tools import TOOLS, ToolError, run_tool

ROOT = Path(__file__).resolve().parent.parent
MODEL = "claude-opus-5"
MAX_TURNS = 8

client = anthropic.Anthropic()  # đọc ANTHROPIC_API_KEY từ biến môi trường


def build_system() -> list[dict]:
    """System prompt = chỉ dẫn + kiến thức. Phần này ổn định nên được cache."""
    instructions = (ROOT / "prompts" / "system.md").read_text(encoding="utf-8")
    knowledge = "\n\n".join(
        f'<document source="{p.name}">\n{p.read_text(encoding="utf-8")}\n</document>'
        for p in sorted((ROOT / "knowledge").glob("*.md"))
    )
    return [
        {"type": "text", "text": instructions},
        {"type": "text", "text": f"<knowledge>\n{knowledge}\n</knowledge>", "cache_control": {"type": "ephemeral"}},
    ]


def answer(question: str) -> str:
    system = build_system()
    messages = [{"role": "user", "content": question}]

    for turn in range(MAX_TURNS):
        response = client.messages.create(
            model=MODEL,
            max_tokens=4096,
            system=system,
            tools=TOOLS,
            messages=messages,
        )
        u = response.usage
        print(f"[lượt {turn + 1}] stop={response.stop_reason} in={u.input_tokens} "
              f"cache_read={u.cache_read_input_tokens} out={u.output_tokens}", file=sys.stderr)

        if response.stop_reason == "refusal":
            return "Xin lỗi, mình không thể hỗ trợ yêu cầu này. Mình sẽ chuyển cho nhân viên."
        if response.stop_reason == "max_tokens":
            return "Câu trả lời quá dài, vui lòng hỏi cụ thể hơn."

        messages.append({"role": "assistant", "content": response.content})
        if response.stop_reason != "tool_use":
            return "".join(b.text for b in response.content if b.type == "text")

        results = []
        for block in response.content:
            if block.type != "tool_use":
                continue
            try:
                results.append({"type": "tool_result", "tool_use_id": block.id,
                                 "content": run_tool(block.name, block.input)})
            except ToolError as e:
                results.append({"type": "tool_result", "tool_use_id": block.id,
                                "content": str(e), "is_error": True})
        messages.append({"role": "user", "content": results})  # mọi kết quả trong MỘT lượt

    return f"Đã vượt {MAX_TURNS} lượt xử lý, mình sẽ chuyển yêu cầu cho nhân viên."


if __name__ == "__main__":
    print(answer(" ".join(sys.argv[1:]) or "Chính sách đổi trả thế nào?"))

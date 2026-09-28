import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))
from tools import ToolError, lookup_order, run_tool, search_policy  # noqa: E402


def test_lookup_order_found():
    assert "Đang giao" in lookup_order("sh1024")


def test_lookup_order_bad_format_gives_hint():
    with pytest.raises(ToolError, match="SH \\+ 4 chữ số"):
        lookup_order("1024")


def test_lookup_order_missing():
    with pytest.raises(ToolError, match="Không tìm thấy"):
        lookup_order("SH9999")


def test_search_policy_hit_has_source():
    assert "[doi-tra.md]" in search_policy("7 ngày")


def test_search_policy_miss_is_not_error():
    assert "không đề cập" in search_policy("audiobook")


def test_unknown_tool():
    with pytest.raises(ToolError, match="không tồn tại"):
        run_tool("delete_all", {})

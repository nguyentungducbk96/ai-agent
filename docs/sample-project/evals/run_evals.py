"""Eval đơn giản: kiểm tra câu trả lời có chứa cụm từ bắt buộc. Gọi API thật (tốn phí).

Chạy: python evals/run_evals.py
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))
from agent import answer  # noqa: E402

cases = [json.loads(line) for line in (Path(__file__).parent / "cases.jsonl").read_text(encoding="utf-8").splitlines() if line]
passed = 0
for case in cases:
    reply = answer(case["question"])
    ok = all(k.lower() in reply.lower() for k in case["must_include"])
    passed += ok
    print(f"{'PASS' if ok else 'FAIL'} [{case['kind']}] {case['question']}\n    → {reply[:160]}")

print(f"\nKết quả: {passed}/{len(cases)} ({passed / len(cases):.0%})")

#!/usr/bin/env bash
# PostToolUse: tự format file Python vừa được sửa.
path=$(jq -r '.tool_input.file_path // empty')
case "$path" in
  *.py) ruff format "$path" >/dev/null 2>&1 || true ;;
esac
exit 0

#!/usr/bin/env bash
# PreToolUse: chặn Claude sửa file chứa secret. Exit 2 = chặn tool, stderr được gửi cho Claude.
path=$(jq -r '.tool_input.file_path // empty')
case "$path" in
  *.env|*.mcp.json)
    echo "Không được sửa file chứa secret: $path. Hãy sửa .env.example thay thế." >&2
    exit 2
    ;;
esac
exit 0

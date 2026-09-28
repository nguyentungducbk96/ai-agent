(function () {
  App.renderHeader('project');
  const esc = App.escapeHtml;

  // ---------- Folder tree ----------
  const TREE = [
    ['shop-support-agent/', '', 0, true],
    ['CLAUDE.md', 'Claude Code nạp khi mở phiên: lệnh, quy ước', 1],
    ['.mcp.json', 'MCP: orders (stdio) + github (HTTP, token từ env)', 1],
    ['.env.example', 'mẫu biến môi trường (.env thật bị ignore)', 1],
    ['.gitignore', '', 1],
    ['requirements.txt', '', 1],
    ['.claude/', '', 1, true],
    ['settings.json', 'permissions + đăng ký hooks (harness áp dụng)', 2],
    ['hooks/', '', 2, true],
    ['protect-secrets.sh', 'PreToolUse: chặn sửa .env/.mcp.json', 3],
    ['format-python.sh', 'PostToolUse: ruff format', 3],
    ['skills/add-faq/SKILL.md', 'lúc đầu chỉ nạp mô tả', 2],
    ['agents/code-reviewer.md', 'subagent, chỉ có tool đọc', 2],
    ['rules/python-style.md', 'chỉ nạp khi đọc file .py', 2],
    ['docs/architecture.md', 'được CLAUDE.md @import', 1],
    ['prompts/system.md', 'system prompt của agent API', 1],
    ['knowledge/', 'chính sách → system + cache', 1, true],
    ['doi-tra.md', '', 2],
    ['giao-hang.md', '', 2],
    ['data/orders.json', 'dữ liệu đơn hàng giả', 1],
    ['src/', '', 1, true],
    ['tools.py', 'schema tool + hàm xử lý + ToolError', 2],
    ['agent.py', 'vòng lặp tool use, cache, MAX_TURNS', 2],
    ['orders_mcp.py', 'cùng tool, mở qua MCP (FastMCP)', 2],
    ['evals/', '', 1, true],
    ['cases.jsonl', '6 case, có câu bẫy', 2],
    ['run_evals.py', 'chạy agent thật và chấm', 2],
    ['tests/test_tools.py', 'unit test, không gọi API', 1]
  ];
  const GH = 'https://github.com/nguyentungducbk96/ai-agent/blob/main/docs/sample-project/';
  // Build tree prefixes and GitHub links
  const lastAt = (i) => {
    const d = TREE[i][2];
    for (let j = i + 1; j < TREE.length; j++) {
      if (TREE[j][2] < d) return true;
      if (TREE[j][2] === d) return false;
    }
    return true;
  };
  const dirs = [];
  const open = []; // open[depth] = true nếu thư mục ở depth đó còn anh em phía sau
  const lines = TREE.map(([name, note, depth, dir], i) => {
    dirs.length = depth;
    const full = dirs.join('') + name;
    if (dir) dirs[depth] = name;
    const last = lastAt(i);
    let prefix = '';
    for (let d = 1; d < depth; d++) prefix += open[d] ? '│   ' : '    ';
    if (depth > 0) prefix += last ? '└── ' : '├── ';
    open[depth] = !last;
    const label = dir
      ? `<span class="d">${esc(name)}</span>`
      : `<a href="${GH}${full}" target="_blank" rel="noopener">${esc(name)}</a>`;
    const pad = ' '.repeat(Math.max(2, 36 - (prefix.length + name.length)));
    return `${prefix}${label}${note ? `${pad}<span class="c"># ${esc(note)}</span>` : ''}`;
  });
  document.getElementById('tree').innerHTML = lines.join('\n');

  // ---------- Flows ----------
  const put = (id, flow) => {
    const fig = App.renderFlow(flow);
    if (fig) document.getElementById(id).appendChild(fig);
  };

  put('flow-start', {
    title: 'Mở phiên: gộp luật trước, nạp kiến thức sau',
    steps: [
      { kind: 'start', label: 'Gõ claude trong thư mục' },
      { kind: 'step', label: 'Gộp settings', detail: 'managed › --settings › local › project › user', note: 'Harness áp dụng, model không cần “đọc”' },
      { kind: 'step', label: 'Nạp CLAUDE.md', detail: 'managed → user → project → CLAUDE.local', note: 'Kèm @docs/architecture.md (≤ 4 tầng)' },
      { kind: 'step', label: 'Nạp rules không có paths', detail: '.claude/rules/*.md', note: 'python-style.md có paths nên chờ' },
      { kind: 'step', label: 'Kết nối MCP server', detail: 'orders (stdio), github (HTTP)', note: 'Lần đầu hỏi duyệt; ${VAR} lấy từ env' },
      { kind: 'step', label: 'Nạp mô tả skill, subagent', detail: 'chỉ name + description', note: 'Nội dung đầy đủ chỉ nạp khi dùng' },
      { kind: 'step', label: 'Hook SessionStart', note: 'Có thể chèn thêm ngữ cảnh ban đầu' },
      { kind: 'end', label: 'Sẵn sàng nhận prompt' }
    ]
  });

  put('flow-lifecycle', {
    title: 'Vòng đời: khởi động một lần, lặp mỗi lượt, compact khi đầy',
    steps: [
      { kind: 'start', label: 'Gõ claude', note: 'Giai đoạn 1: khởi động' },
      { kind: 'step', label: 'Gộp settings (luật)', detail: 'managed › local › project › user', note: 'Quyết định được làm gì, bị chặn gì' },
      { kind: 'step', label: 'Nạp CLAUDE.md + rules', detail: 'user → project → CLAUDE.local.md', note: 'Kiến thức nền, luôn nằm trong context' },
      { kind: 'step', label: 'Kết nối MCP (.mcp.json)', note: 'Thêm tool: DB, GitHub, Jira…' },
      { kind: 'step', label: 'Mô tả skill + subagent', detail: 'chỉ name + description', note: 'Như đọc menu, chưa nấu món' },
      { kind: 'step', label: 'Hook SessionStart', note: 'Chèn bối cảnh: nhánh git, ticket' },
      { kind: 'step', label: 'Bạn gửi prompt', detail: 'hook UserPromptSubmit', note: 'Giai đoạn 2: mỗi lượt' },
      { kind: 'step', label: 'Model đọc file, gọi tool', detail: 'PreToolUse → permission → PostToolUse', note: 'Nạp thêm: CLAUDE.md con, rule paths, SKILL.md' },
      { kind: 'decision', label: 'Context gần đầy?', note: 'Có → PreCompact → tóm tắt → PostCompact' },
      { kind: 'step', label: 'Trả lời, hook Stop', loopTo: 6, loopLabel: 'lượt mới' },
      { kind: 'end', label: 'Thoát: hook SessionEnd', note: 'Giai đoạn 4: kết thúc phiên' }
    ]
  });

  put('flow-turn', {
    title: 'Một lượt: hook chặn trước, permission hỏi sau',
    steps: [
      { kind: 'start', label: 'Bạn gửi prompt' },
      { kind: 'step', label: 'Hook UserPromptSubmit', note: 'Có thể chặn hoặc thêm ngữ cảnh' },
      { kind: 'step', label: 'Model chọn tool', detail: 'ví dụ Edit src/tools.py', note: 'rule python-style.md được nạp lúc này' },
      { kind: 'step', label: 'Hook PreToolUse', detail: 'protect-secrets.sh', note: 'Exit 2 → chặn, lý do gửi cho Claude' },
      { kind: 'decision', label: 'Permission: deny/ask/allow?', note: 'ask → hook PermissionRequest, hỏi bạn' },
      { kind: 'step', label: 'Chạy tool' },
      { kind: 'step', label: 'Hook PostToolUse', detail: 'format-python.sh → ruff format', note: 'Tool lỗi → PostToolUseFailure' },
      { kind: 'decision', label: 'Còn cần tool nữa?', loopTo: 2, loopLabel: 'có → lặp' },
      { kind: 'end', label: 'Trả lời, hook Stop chạy' }
    ]
  });

  put('flow-agent', {
    title: 'agent.py: model xin tool, code của bạn chạy tool',
    steps: [
      { kind: 'start', label: 'Khách hỏi về đơn SH1024' },
      { kind: 'step', label: 'build_system()', detail: 'prompts/system.md + knowledge/*.md', note: 'Khối knowledge có cache_control' },
      { kind: 'step', label: 'messages.create()', detail: 'model, system, tools, messages', note: 'Từ lượt 2: cache_read_input_tokens > 0' },
      { kind: 'decision', label: 'stop_reason = tool_use?', note: 'Không → end_turn / refusal / max_tokens' },
      { kind: 'step', label: 'Code chạy run_tool()', detail: 'lookup_order đọc data/orders.json', note: 'ToolError → is_error: true' },
      { kind: 'step', label: 'Gửi mọi tool_result', detail: 'trong MỘT lượt user', loopTo: 2, loopLabel: 'lượt mới' },
      { kind: 'end', label: 'Trả lời khách', detail: 'hoặc chuyển nhân viên sau 8 lượt' }
    ]
  });

  put('flow-mcp', {
    title: 'Viết tool một lần, dùng ở hai nơi',
    steps: [
      { kind: 'start', label: 'Hàm lõi trong src/tools.py', detail: 'lookup_order, search_policy' },
      { kind: 'step', label: 'Đường 1: agent.py', detail: 'gửi TOOLS (schema) qua Messages API', note: 'Phục vụ khách hàng' },
      { kind: 'step', label: 'Đường 2: orders_mcp.py', detail: 'FastMCP bọc cùng hàm, chạy stdio', note: 'Phục vụ nhân viên trong Claude Code' },
      { kind: 'step', label: 'Claude Code đọc .mcp.json', detail: 'initialize → tools/list', note: 'Tool có tên mcp__orders__lookup_order' },
      { kind: 'end', label: 'tools/call khi model cần' }
    ]
  });

  // ---------- Context layers ----------
  const layers = [
    ['1. Tools', 'Định nghĩa tool: built-in, MCP, TOOLS của bạn', 'ít đổi nhất', true],
    ['2. System', 'Chỉ dẫn + CLAUDE.md (Claude Code) / knowledge (API)', 'điểm cache_control', true],
    ['3. Lịch sử messages', 'Các lượt user/assistant, tool_use, tool_result', 'chỉ nối thêm', false],
    ['4. Tin nhắn mới', 'Câu hỏi hiện tại của bạn / khách hàng', 'đổi mỗi lượt', false]
  ];
  const Y0 = 56, H = 64, G = 14, W = 520, X = 24;
  let svg = `<svg viewBox="0 0 760 ${Y0 + layers.length * (H + G) + 16}" role="img" aria-label="Thứ tự ghép context" class="flow-svg">
    <text x="24" y="32" font-size="16" font-weight="700" fill="var(--text)">Context ghép từ trên xuống: phần trên ổn định nên được cache</text>`;
  layers.forEach(([name, desc, note, cached], i) => {
    const y = Y0 + i * (H + G);
    svg += `<rect x="${X}" y="${y}" width="${W}" height="${H}" rx="8" fill="${cached ? 'var(--accent-soft)' : 'var(--surface)'}" stroke="${cached ? 'var(--accent)' : 'var(--border-strong)'}" stroke-width="${cached ? 2 : 1.25}"/>
      <text x="${X + 16}" y="${y + 26}" font-size="14" font-weight="700" fill="var(--text)">${esc(name)}</text>
      <text x="${X + 16}" y="${y + 47}" font-size="12.5" fill="var(--muted)">${esc(desc)}</text>
      <text x="${X + W + 20}" y="${y + H / 2 + 5}" font-size="12.5" fill="${cached ? 'var(--accent)' : 'var(--muted)'}">${esc(note)}</text>`;
  });
  const yb = Y0 + 2 * (H + G) - G / 2;
  svg += `<line x1="${X - 8}" y1="${yb}" x2="${X + W + 8}" y2="${yb}" stroke="var(--accent)" stroke-width="2" stroke-dasharray="6 4"/>
    <text x="${X + W + 20}" y="${yb + 4}" font-size="11.5" font-weight="700" fill="var(--accent)">▲ phần được cache</text></svg>`;
  document.getElementById('layers').innerHTML = svg;
})();

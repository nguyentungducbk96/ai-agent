/* Tháng 4 – Claude Code */
window.LESSONS = window.LESSONS || [];
window.MONTHS = window.MONTHS || [];

window.MONTHS.push({
  month: 4,
  period: '01/2027',
  title: 'Claude Code',
  domain: 'Claude Code',
  goal: 'Dùng và cấu hình Claude Code cho dự án thật, cho cả team dùng chung.'
});

window.LESSONS.push(
  {
    id: 'm4w1', month: 4, week: 1, duration: '6 giờ', domain: 'Claude Code',
    title: 'Làm việc với Claude Code và CLAUDE.md',
    objectives: [
      'Nắm luồng làm việc: khám phá → lập kế hoạch → code → kiểm tra',
      'Viết CLAUDE.md hiệu quả ở cấp project và user',
      'Dùng plan mode, memory và quản lý context trong phiên'
    ],
    sections: [
      {
        h: '1. Claude Code là gì',
        html: `<p>Claude Code là agent lập trình: đọc code, chạy lệnh, sửa file, dùng git, gọi MCP. Có trên terminal (CLI), IDE (VS Code, JetBrains), app desktop và web. Bạn ra yêu cầu bằng ngôn ngữ tự nhiên; Claude Code tự lên kế hoạch và dùng tool.</p>
<p>Luồng hiệu quả:</p>
<ol>
<li><strong>Khám phá</strong>: yêu cầu đọc các phần liên quan trước khi sửa.</li>
<li><strong>Lập kế hoạch</strong>: dùng plan mode (Shift+Tab) cho thay đổi lớn, duyệt kế hoạch trước.</li>
<li><strong>Thực hiện</strong> theo từng bước nhỏ.</li>
<li><strong>Kiểm chứng</strong>: chạy test, lint, xem diff – cho Claude cách tự kiểm tra kết quả.</li>
</ol>`
      },
      {
        h: '2. CLAUDE.md – bộ nhớ của dự án',
        html: `<div class="table-wrap"><table>
<tr><th>Vị trí</th><th>Phạm vi</th></tr>
<tr><td><code>./CLAUDE.md</code></td><td>Project – commit để cả team dùng</td></tr>
<tr><td><code>./CLAUDE.local.md</code></td><td>Project, chỉ bạn (không commit)</td></tr>
<tr><td><code>~/.claude/CLAUDE.md</code></td><td>User – áp dụng cho mọi project của bạn</td></tr>
<tr><td>CLAUDE.md trong thư mục con</td><td>Nạp khi Claude làm việc trong thư mục đó</td></tr>
</table></div>
<p>Nên có: lệnh build/test/lint, cấu trúc thư mục chính, quy ước code, những điều <em>không hiển nhiên</em> (ví dụ “test tích hợp cần Docker chạy”). Tránh: nội dung dài dòng lặp lại những gì đọc code là biết. Chạy <code>/init</code> để Claude tự tạo bản đầu tiên.</p>`
      },
      {
        h: '3. Quản lý context trong phiên',
        html: `<ul>
<li><code>/clear</code> khi chuyển sang việc mới không liên quan.</li>
<li><code>/compact</code> để tóm tắt hội thoại dài; Claude Code cũng tự compact khi gần đầy.</li>
<li>Tham chiếu file bằng <code>@duong/dan</code> để đưa đúng file vào context.</li>
<li>Giao việc tìm kiếm rộng cho subagent để giữ context chính gọn (tuần 4).</li>
</ul>`
      }
    ],
    code: [
      {
        title: 'CLAUDE.md mẫu cho repo ai-agent', lang: 'markdown',
        src: `
# ai-agent

Trang học chứng chỉ Claude (HTML/CSS/JS thuần, không build step) trong \`docs/\`.

## Lệnh
- Xem trang: \`python3 -m http.server -d docs 8000\` rồi mở http://localhost:8000
- Kiểm tra cú pháp JS: \`node --check docs/assets/js/**/*.js\`

## Quy ước
- Nội dung bài học nằm trong \`docs/assets/js/data/monthN.js\`, mỗi bài một object trong \`window.LESSONS\`.
- Nội dung tiếng Việt; code mẫu dùng model \`claude-opus-5\`.
- Không commit secret. \`.mcp.json\` dùng \${GITHUB_PERSONAL_ACCESS_TOKEN}.`
      }
    ],
    exercises: [
      {
        title: 'Bài 1 – /init và tinh chỉnh CLAUDE.md',
        task: `<p>Trong repo <code>ai-agent</code>, chạy <code>/init</code>, sau đó chỉnh CLAUDE.md sao cho ngắn gọn (≤ 40 dòng), chỉ giữ thông tin không hiển nhiên. Commit.</p>`,
        hint: 'Tự hỏi với mỗi dòng: “Nếu xoá dòng này, Claude có làm sai không?” Nếu không → xoá.',
        solution: `<p>CLAUDE.md tốt ngắn, cụ thể và luôn đúng. Cập nhật mỗi khi phát hiện Claude lặp lại cùng một lỗi – đó là tín hiệu thiếu thông tin trong CLAUDE.md.</p>`
      },
      {
        title: 'Bài 2 – Plan mode cho một tính năng',
        task: `<p>Dùng plan mode yêu cầu Claude Code thêm tính năng “tìm kiếm bài học theo từ khoá” vào trang lesson.html. Duyệt kế hoạch, yêu cầu chỉnh ít nhất 1 điểm, rồi cho thực hiện.</p>`,
        hint: 'Shift+Tab để chuyển chế độ.',
        solution: `<p>Quan sát: kế hoạch nêu file sẽ sửa, cách làm và cách kiểm tra. Duyệt kế hoạch sớm rẻ hơn nhiều so với sửa code sai.</p>`
      }
    ],
    quiz: [
      {
        q: 'Thông tin nào nên có trong CLAUDE.md của project?',
        options: ['Toàn bộ mã nguồn', 'Lệnh build/test, quy ước, điều không hiển nhiên của dự án', 'API key', 'Lịch sử commit'],
        answer: 1,
        explain: 'CLAUDE.md ngắn, chứa những gì Claude không tự suy ra được từ code.'
      },
      {
        q: 'Ghi chú riêng của bạn cho project, không muốn commit, đặt ở đâu?',
        options: ['CLAUDE.md', 'CLAUDE.local.md', 'README.md', '.mcp.json'],
        answer: 1,
        explain: 'CLAUDE.local.md dành cho ghi chú cá nhân trong project.'
      }
    ],
    resources: [
      { t: 'Anthropic Academy – Claude Code in Action', url: 'https://anthropic.skilljar.com' },
      { t: 'Claude Code best practices', url: 'https://code.claude.com/docs' }
    ]
  },

  {
    id: 'm4w2', month: 4, week: 2, duration: '6 giờ', domain: 'Claude Code',
    title: 'Settings và permissions',
    objectives: [
      'Hiểu thứ tự ưu tiên các file settings',
      'Viết rule allow / ask / deny cho tool và lệnh Bash',
      'Chọn permission mode phù hợp'
    ],
    sections: [
      {
        h: '1. Các file settings',
        html: `<div class="table-wrap"><table>
<tr><th>File</th><th>Phạm vi</th></tr>
<tr><td>Managed settings (do IT/tổ chức cấp)</td><td>Ưu tiên cao nhất, người dùng không ghi đè được</td></tr>
<tr><td><code>.claude/settings.local.json</code></td><td>Project, chỉ bạn (không commit)</td></tr>
<tr><td><code>.claude/settings.json</code></td><td>Project, commit cho cả team</td></tr>
<tr><td><code>~/.claude/settings.json</code></td><td>User, mọi project</td></tr>
</table></div>
<p>Thiết lập cụ thể hơn ghi đè thiết lập chung hơn; rule <code>deny</code> luôn thắng <code>allow</code>.</p>`
      },
      {
        h: '2. Permission rules',
        html: `<ul>
<li><code>allow</code> – chạy không cần hỏi, ví dụ <code>"Bash(npm run test:*)"</code>, <code>"Read"</code>.</li>
<li><code>ask</code> – luôn hỏi trước khi chạy.</li>
<li><code>deny</code> – chặn hoàn toàn, ví dụ <code>"Bash(rm -rf:*)"</code>, <code>"Read(./.env)"</code>.</li>
<li>Tool MCP có dạng <code>mcp__&lt;server&gt;__&lt;tool&gt;</code>.</li>
</ul>
<p><strong>Permission mode</strong>: default (hỏi khi cần), acceptEdits (tự chấp nhận sửa file), plan (chỉ lên kế hoạch, không sửa), và các chế độ tự động hơn cho môi trường sandbox. Chọn chế độ theo mức rủi ro của môi trường.</p>`
      }
    ],
    code: [
      {
        title: '.claude/settings.json mẫu', lang: 'json',
        src: `
{
  "permissions": {
    "allow": [
      "Bash(npm run test:*)",
      "Bash(npm run lint)",
      "Bash(git status)",
      "Bash(git diff:*)",
      "mcp__github__get_issue"
    ],
    "ask": [
      "Bash(git push:*)",
      "mcp__github__create_issue"
    ],
    "deny": [
      "Bash(rm -rf:*)",
      "Read(./.env)",
      "Read(./.mcp.json)"
    ]
  },
  "env": {
    "NODE_ENV": "development"
  }
}`
      }
    ],
    exercises: [
      {
        title: 'Bài 1 – Chính sách permission cho repo ai-agent',
        task: `<p>Tạo <code>.claude/settings.json</code>: cho phép lệnh xem trang và kiểm tra cú pháp; hỏi trước khi <code>git push</code> và tạo issue; chặn đọc <code>.mcp.json</code> (chứa token). Kiểm tra bằng cách yêu cầu Claude đọc <code>.mcp.json</code>.</p>`,
        hint: 'Dùng /permissions trong phiên để xem rule đang áp dụng.',
        solution: `<p>Claude sẽ bị chặn đọc file. Đây là lớp bảo vệ bổ sung ngoài <code>.gitignore</code>: secret không lọt vào context (và không lọt vào log hội thoại).</p>`
      },
      {
        title: 'Bài 2 – Giảm số lần bị hỏi quyền',
        task: `<p>Làm việc 30 phút, ghi lại các lệnh bị hỏi nhiều nhất. Thêm rule allow cho các lệnh <em>chỉ đọc</em> an toàn.</p>`,
        hint: 'Chỉ allow lệnh không gây tác dụng phụ; lệnh ghi/xoá vẫn nên ask.',
        solution: `<p>Cân bằng giữa năng suất và an toàn: allow đọc, ask ghi ra ngoài, deny phá huỷ. Kỳ thi hay hỏi chọn cấu hình phù hợp cho một tình huống team cụ thể.</p>`
      }
    ],
    quiz: [
      {
        q: 'Một lệnh vừa khớp rule allow vừa khớp rule deny. Kết quả?',
        options: ['Được chạy', 'Bị chặn – deny thắng', 'Hỏi người dùng', 'Tuỳ thứ tự trong file'],
        answer: 1,
        explain: 'deny luôn được ưu tiên.'
      },
      {
        q: 'Công ty muốn cấm mọi nhân viên dùng một MCP server, người dùng không được ghi đè. Dùng gì?',
        options: ['CLAUDE.md', 'Managed settings của tổ chức', 'settings.local.json', '.gitignore'],
        answer: 1,
        explain: 'Managed settings có ưu tiên cao nhất.'
      }
    ],
    resources: [
      { t: 'Claude Code – Settings & permissions', url: 'https://code.claude.com/docs' }
    ]
  },

  {
    id: 'm4w3', month: 4, week: 3, duration: '8 giờ', domain: 'Claude Code',
    title: 'Hooks, slash command và skills',
    objectives: [
      'Dùng hooks để tự động hoá chắc chắn (deterministic)',
      'Tạo slash command / skill cho quy trình lặp lại',
      'Phân biệt khi nào dùng CLAUDE.md, hook, skill'
    ],
    sections: [
      {
        h: '1. Hooks',
        html: `<p>Hook là lệnh shell mà <strong>harness</strong> chạy tại các thời điểm cố định – khác với chỉ dẫn trong CLAUDE.md (model có thể quên), hook luôn chạy.</p>
<div class="table-wrap"><table>
<tr><th>Sự kiện</th><th>Khi nào</th><th>Ví dụ</th></tr>
<tr><td><code>PreToolUse</code></td><td>Trước khi chạy tool – có thể chặn</td><td>Chặn sửa file trong <code>migrations/</code></td></tr>
<tr><td><code>PostToolUse</code></td><td>Sau khi tool chạy xong</td><td>Tự format file vừa sửa</td></tr>
<tr><td><code>UserPromptSubmit</code></td><td>Khi người dùng gửi prompt</td><td>Chèn thêm ngữ cảnh</td></tr>
<tr><td><code>Stop</code></td><td>Khi Claude trả lời xong</td><td>Gửi thông báo, chạy test</td></tr>
<tr><td><code>SessionStart</code></td><td>Khi bắt đầu phiên</td><td>Nạp trạng thái dự án</td></tr>
</table></div>
<p>Hook nhận dữ liệu sự kiện dạng JSON qua stdin (ví dụ <code>tool_input.file_path</code>). Exit code 2 ở <code>PreToolUse</code> sẽ chặn tool và gửi stderr cho Claude.</p>`
      },
      {
        h: '2. Skills và slash command',
        html: `<ul>
<li><strong>Skill</strong>: thư mục <code>.claude/skills/&lt;tên&gt;/SKILL.md</code> với frontmatter <code>name</code>, <code>description</code>. Claude tự nạp skill khi yêu cầu khớp mô tả, hoặc bạn gọi bằng <code>/&lt;tên&gt;</code>. Skill có thể kèm script, template.</li>
<li><strong>Slash command</strong> tuỳ biến: file markdown trong <code>.claude/commands/</code> – prompt dựng sẵn, nhận tham số qua <code>$ARGUMENTS</code>.</li>
<li>Chỉ phần mô tả của skill luôn nằm trong context; nội dung đầy đủ chỉ nạp khi dùng → tiết kiệm context (progressive disclosure).</li>
</ul>
<div class="callout tip"><strong>Chọn công cụ nào?</strong> Kiến thức luôn cần → CLAUDE.md. Việc phải xảy ra 100% → hook. Quy trình chuyên biệt dùng thỉnh thoảng → skill. Công cụ/dữ liệu bên ngoài → MCP.</div>`
      }
    ],
    code: [
      {
        title: '.claude/settings.json – hook tự format sau khi sửa', lang: 'json',
        src: `
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
          }
        ]
      }
    ]
  }
}`
      },
      {
        title: '.claude/skills/new-lesson/SKILL.md', lang: 'markdown',
        src: `
---
name: new-lesson
description: Tạo một bài học mới cho trang học chứng chỉ Claude. Dùng khi người dùng muốn thêm bài, tuần hoặc chủ đề mới vào docs/.
---

# Tạo bài học mới

1. Hỏi tháng, tuần, tiêu đề, domain nếu chưa có.
2. Thêm object vào docs/assets/js/data/monthN.js theo đúng schema:
   id, month, week, duration, domain, title, objectives, sections, code, exercises, quiz, resources.
3. Mỗi bài có ít nhất 2 bài tập (kèm hint, solution) và 2 câu quiz (kèm explain).
4. Chạy node --check trên file vừa sửa.`
      }
    ],
    exercises: [
      {
        title: 'Bài 1 – Hook chặn sửa file nhạy cảm',
        task: `<p>Viết hook <code>PreToolUse</code> cho <code>Edit|Write</code>: nếu <code>file_path</code> chứa <code>.mcp.json</code> hoặc <code>.env</code>, thoát với exit code 2 và in lý do ra stderr.</p>`,
        hint: 'Viết script bash đọc stdin bằng jq, so khớp đường dẫn, exit 2 kèm echo "..." >&2.',
        solution: `<pre><code>#!/usr/bin/env bash
# .claude/hooks/protect-secrets.sh
path=$(jq -r '.tool_input.file_path // empty')
case "$path" in
  *.mcp.json|*.env) echo "Không được sửa file chứa secret: $path" >&2; exit 2 ;;
esac
exit 0</code></pre>
<p>Đăng ký trong <code>hooks.PreToolUse</code> với <code>matcher: "Edit|Write"</code> và <code>command: ".claude/hooks/protect-secrets.sh"</code> (nhớ <code>chmod +x</code>).</p>`
      },
      {
        title: 'Bài 2 – Skill tạo bài học',
        task: `<p>Tạo skill <code>new-lesson</code> như mẫu, rồi yêu cầu Claude “thêm bài bonus về Batch API vào tháng 2”. Kiểm tra skill có được tự động dùng không.</p>`,
        hint: 'Mô tả skill quyết định khi nào nó được nạp – viết cụ thể các từ khoá người dùng hay nói.',
        solution: `<p>Nếu Claude không dùng skill, chỉnh <code>description</code> cụ thể hơn. Bài học: mô tả skill giống mô tả tool – là prompt để model chọn đúng.</p>`
      }
    ],
    quiz: [
      {
        q: 'Muốn chắc chắn formatter chạy sau mỗi lần sửa file, dùng gì?',
        options: ['Ghi vào CLAUDE.md', 'Hook PostToolUse', 'Skill', 'Nhắc Claude mỗi lần'],
        answer: 1,
        explain: 'Hook do harness chạy nên luôn xảy ra; chỉ dẫn trong prompt có thể bị bỏ qua.'
      },
      {
        q: 'Hook PreToolUse thoát với exit code 2. Điều gì xảy ra?',
        options: ['Tool vẫn chạy', 'Tool bị chặn, stderr được gửi cho Claude', 'Phiên kết thúc', 'Hook chạy lại'],
        answer: 1,
        explain: 'Exit 2 là tín hiệu chặn; Claude nhận lý do để điều chỉnh.'
      },
      {
        q: 'Quy trình “release checklist” dùng vài lần/tháng, nhiều bước và có script. Nên đóng gói thành?',
        options: ['CLAUDE.md', 'Skill', 'Hook SessionStart', 'MCP resource'],
        answer: 1,
        explain: 'Skill chỉ nạp khi cần, có thể kèm script – không chiếm context thường xuyên.'
      }
    ],
    resources: [
      { t: 'Claude Code – Hooks', url: 'https://code.claude.com/docs' },
      { t: 'Claude Code – Skills', url: 'https://code.claude.com/docs' }
    ]
  },

  {
    id: 'm4w4', month: 4, week: 4, duration: '8 giờ', domain: 'Claude Code',
    title: 'Subagent, headless và Claude Code trong CI',
    objectives: [
      'Tạo subagent chuyên biệt với tool giới hạn',
      'Chạy Claude Code không tương tác (claude -p)',
      'Tích hợp Claude Code vào GitHub Actions'
    ],
    sections: [
      {
        h: '1. Subagent',
        html: `<p>Subagent là một phiên Claude riêng với <strong>context riêng</strong>, system prompt riêng và bộ tool giới hạn. Agent chính giao việc, subagent làm xong trả về kết quả tóm tắt.</p>
<ul>
<li>Lợi ích: giữ context chính gọn (subagent đọc 50 file, chỉ trả kết luận), chuyên môn hoá, chạy song song.</li>
<li>Định nghĩa trong <code>.claude/agents/&lt;tên&gt;.md</code>: frontmatter <code>name</code>, <code>description</code>, <code>tools</code>, (tuỳ chọn) <code>model</code>; phần thân là system prompt.</li>
<li>Giới hạn tool theo nguyên tắc quyền tối thiểu: subagent review code chỉ cần Read, Grep, Glob.</li>
</ul>`
      },
      {
        h: '2. Headless và CI',
        html: `<ul>
<li><code>claude -p "prompt"</code> chạy một lần rồi thoát – dùng trong script.</li>
<li><code>--output-format json</code> hoặc <code>stream-json</code> để đọc kết quả bằng máy.</li>
<li><code>--allowedTools</code> giới hạn tool khi chạy tự động.</li>
<li>GitHub Actions: có action chính thức để Claude review PR, trả lời khi được @mention, tự sửa lỗi CI. Cài nhanh bằng <code>/install-github-app</code> trong Claude Code.</li>
</ul>
<div class="callout warn">Nhớ giới hạn phút Actions của repo private (gói Free: 2.000 phút/tháng) và lưu API key trong GitHub Secrets.</div>`
      }
    ],
    code: [
      {
        title: '.claude/agents/code-reviewer.md', lang: 'markdown',
        src: `
---
name: code-reviewer
description: Review thay đổi code để tìm lỗi, lỗ hổng bảo mật và vi phạm quy ước. Dùng sau khi hoàn thành một tính năng hoặc trước khi tạo PR.
tools: Read, Grep, Glob, Bash(git diff:*)
---

Bạn là reviewer cẩn thận. Chạy git diff để xem thay đổi, đọc các file liên quan.
Báo cáo theo mức độ: Nghiêm trọng / Nên sửa / Gợi ý. Mỗi mục có file:dòng và lý do.
Không sửa code – chỉ báo cáo.`
      },
      {
        title: 'Headless – review nhanh trong script', lang: 'bash',
        src: `
claude -p "Review git diff hiện tại, liệt kê tối đa 5 vấn đề quan trọng nhất" \\
  --allowedTools "Read,Grep,Glob,Bash(git diff:*)" \\
  --output-format json > review.json`
      }
    ],
    exercises: [
      {
        title: 'Bài 1 – Subagent review',
        task: `<p>Tạo subagent <code>code-reviewer</code>, sửa một file JS trong <code>docs/</code> có lỗi cố ý, rồi yêu cầu “dùng code-reviewer kiểm tra thay đổi”. Kiểm tra subagent không sửa file.</p>`,
        hint: 'Gõ /agents để xem và quản lý subagent.',
        solution: `<p>Subagent chỉ có Read/Grep/Glob/git diff nên không thể sửa. Kết quả trả về agent chính dưới dạng tóm tắt – context chính không bị đầy bởi nội dung file.</p>`
      },
      {
        title: 'Bài 2 – Workflow GitHub Actions kiểm tra cú pháp',
        task: `<p>Tạo <code>.github/workflows/check.yml</code> chạy <code>node --check</code> trên mọi file JS trong <code>docs/</code> khi push. Ước tính số phút Actions dùng mỗi tháng.</p>`,
        hint: 'runs-on: ubuntu-latest (hệ số ×1). Một job ngắn vẫn bị làm tròn lên 1 phút.',
        solution: `<pre><code>name: check
on: [push, pull_request]
jobs:
  syntax:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: for f in $(find docs -name "*.js"); do node --check "$f"; done</code></pre>
<p>Khoảng 1 phút/lần × 100 lần push/tháng ≈ 100 phút – rất xa giới hạn 2.000 phút.</p>`
      }
    ],
    quiz: [
      {
        q: 'Lợi ích chính của subagent khi cần tìm kiếm trong 200 file?',
        options: ['Rẻ hơn luôn luôn', 'Context riêng: đọc nhiều nhưng chỉ trả kết quả tóm tắt, giữ context chính gọn', 'Không cần permission', 'Chạy offline'],
        answer: 1,
        explain: 'Cô lập context là lý do quan trọng nhất; chuyên môn hoá và song song là lợi ích thêm.'
      },
      {
        q: 'Chạy Claude Code trong CI cần gì?',
        options: ['Chế độ tương tác', 'claude -p với --allowedTools giới hạn và secret lưu an toàn', 'Quyền admin repo', 'Tắt mọi permission'],
        answer: 1,
        explain: 'Headless + giới hạn tool + secret trong GitHub Secrets.'
      }
    ],
    resources: [
      { t: 'Claude Code – Subagents', url: 'https://code.claude.com/docs' },
      { t: 'Claude Code – GitHub Actions', url: 'https://code.claude.com/docs' }
    ]
  }
);

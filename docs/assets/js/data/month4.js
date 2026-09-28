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
<p>Nên có: lệnh build/test/lint, cấu trúc thư mục chính, quy ước code, những điều <em>không hiển nhiên</em> (ví dụ “test tích hợp cần Docker chạy”). Tránh: nội dung dài dòng lặp lại những gì đọc code là biết. Chạy <code>/init</code> để Claude tự tạo bản đầu tiên.</p>
<p>CLAUDE.md có thể nhập file khác bằng cú pháp <code>@duong/dan/file.md</code> – tiện để tách hướng dẫn dài (ví dụ quy ước API) ra file riêng mà vẫn được nạp.</p>`
      },
      {
        h: '3. Quản lý context trong phiên',
        html: `<ul>
<li><code>/clear</code> khi chuyển sang việc mới không liên quan.</li>
<li><code>/compact</code> để tóm tắt hội thoại dài; Claude Code cũng tự compact khi gần đầy.</li>
<li>Tham chiếu file bằng <code>@duong/dan</code> để đưa đúng file vào context.</li>
<li>Giao việc tìm kiếm rộng cho subagent để giữ context chính gọn (tuần 4).</li>
<li>Nhấn <kbd>Esc</kbd> để dừng Claude giữa chừng khi thấy nó đi sai hướng; nhấn <kbd>Esc</kbd> hai lần để quay lại một tin nhắn trước và sửa yêu cầu.</li>
</ul>`
      },
      {
        h: '4. Viết yêu cầu tốt cho Claude Code',
        html: `<ul>
<li><strong>Cụ thể về phạm vi</strong>: “sửa hàm <code>renderQuiz</code> trong <code>docs/assets/js/app.js</code> để…” tốt hơn “sửa quiz”.</li>
<li><strong>Đưa tiêu chí kiểm chứng</strong>: “sau khi sửa, chạy <code>node --check</code> và mở trang để xác nhận”.</li>
<li><strong>Cho ví dụ hoặc ảnh chụp</strong> khi làm giao diện – Claude đọc được ảnh.</li>
<li><strong>Chia nhỏ</strong> việc lớn: một phiên, một mục tiêu rõ ràng.</li>
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
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Mở terminal tại thư mục repo, chạy <code>claude</code>, gõ <code>/init</code>. Claude đọc repo và tạo <code>CLAUDE.md</code>.</li>
<li>Mở file vừa tạo. Xoá các đoạn mô tả lại cấu trúc mà nhìn cây thư mục là biết (ví dụ “thư mục docs chứa file html”).</li>
<li>Giữ lại: lệnh chạy/kiểm tra, quy ước đặt nội dung bài học, quy tắc bảo mật (không commit secret).</li>
<li>Đếm dòng: <code>wc -l CLAUDE.md</code> phải ≤ 40.</li>
<li>Commit: <code>git add CLAUDE.md &amp;&amp; git commit -m "Add CLAUDE.md"</code>.</li>
</ol>
<p><strong>Kiểm tra kết quả:</strong> mở phiên mới, hỏi “Làm sao kiểm tra cú pháp JS trong repo này?” – Claude phải trả lời đúng lệnh trong CLAUDE.md mà không cần tìm kiếm.</p>
<p><strong>Lỗi thường gặp:</strong> giữ nguyên bản <code>/init</code> dài hàng trăm dòng (tốn context mỗi phiên); ghi thông tin sai hoặc lỗi thời khiến Claude làm theo sai.</p>`
      },
      {
        title: 'Bài 2 – Plan mode cho một tính năng',
        task: `<p>Dùng plan mode yêu cầu Claude Code thêm tính năng “tìm kiếm bài học theo từ khoá” vào trang lesson.html. Duyệt kế hoạch, yêu cầu chỉnh ít nhất 1 điểm, rồi cho thực hiện.</p>`,
        hint: 'Shift+Tab để chuyển chế độ.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Trong phiên Claude Code, nhấn Shift+Tab cho tới khi thấy chế độ plan.</li>
<li>Gõ: “Thêm ô tìm kiếm bài học theo từ khoá ở sidebar của lesson.html, lọc theo tiêu đề và domain.”</li>
<li>Đọc kế hoạch: file sẽ sửa (<code>lesson.js</code>, <code>style.css</code>), cách lọc, cách kiểm tra.</li>
<li>Yêu cầu chỉnh, ví dụ: “Tìm cả trong mục tiêu bài học, không phân biệt dấu tiếng Việt.”</li>
<li>Chấp nhận kế hoạch để Claude thực hiện, rồi xem diff bằng <code>git diff</code>.</li>
</ol>
<p><strong>Kiểm tra kết quả:</strong> mở trang, gõ “mcp” – sidebar chỉ còn các bài MCP; gõ “hook” – còn bài tuần 3 tháng 4.</p>
<p><strong>Lỗi thường gặp:</strong> duyệt kế hoạch mà không đọc; để Claude code ngay không qua plan với thay đổi nhiều file.</p>`
      },
      {
        title: 'Bài 3 – Tách hướng dẫn dài bằng @import',
        task: `<p>Viết file <code>docs/CONTENT_GUIDE.md</code> mô tả schema một bài học (các trường, yêu cầu tối thiểu). Nhập nó vào CLAUDE.md bằng <code>@</code> và kiểm tra Claude đã “biết” schema.</p>`,
        hint: 'Trong CLAUDE.md thêm một dòng dạng @docs/CONTENT_GUIDE.md.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Tạo file hướng dẫn:
<pre><code># Schema bài học
- id: 'mXwY', month, week, duration, domain, title
- objectives: 3–4 mục
- sections: [{h, html}]
- code: [{title, lang, src}]
- exercises: [{title, task, hint, solution}] – tối thiểu 4
- quiz: [{q, options, answer, explain}] – tối thiểu 6</code></pre></li>
<li>Thêm vào cuối CLAUDE.md: <code>Xem schema bài học: @docs/CONTENT_GUIDE.md</code>.</li>
<li>Mở phiên mới, hỏi: “Một bài học cần tối thiểu bao nhiêu câu quiz?”</li>
</ol>
<p><strong>Kiểm tra kết quả:</strong> Claude trả lời “6” mà không cần mở file bằng tool.</p>
<p><strong>Lỗi thường gặp:</strong> sai đường dẫn tương đối (đường dẫn tính từ vị trí file CLAUDE.md); nhập file quá lớn làm tốn context mọi phiên.</p>`
      },
      {
        title: 'Bài 4 – Viết lại yêu cầu mơ hồ',
        task: `<p>Viết lại 3 yêu cầu sau cho Claude Code: (a) “sửa lỗi giao diện”; (b) “làm trang đẹp hơn”; (c) “thêm test”.</p>`,
        hint: 'Mỗi yêu cầu cần: phạm vi file, kết quả mong muốn, cách kiểm chứng.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Xác định phạm vi: file hoặc thành phần nào.</li>
<li>Mô tả kết quả đo được.</li>
<li>Thêm bước kiểm chứng.</li>
</ol>
<p>Ví dụ:</p>
<ul>
<li>(a) “Trên màn hình rộng 500px, khối code trong lesson.html làm trang cuộn ngang. Sửa CSS trong <code>docs/assets/css/style.css</code> để không cuộn ngang; chụp màn hình lại để xác nhận.”</li>
<li>(b) “Tăng khoảng cách giữa các thẻ tháng ở index.html lên 24px và đổi màu tiêu đề thẻ sang màu nhấn; giữ hỗ trợ dark mode.”</li>
<li>(c) “Viết script Node dùng jsdom kiểm tra lesson.html render đủ số bài tập và quiz cho bài m1w1; chạy script và báo kết quả.”</li>
</ul>
<p><strong>Kiểm tra kết quả:</strong> mỗi yêu cầu đọc xong biết ngay khi nào là “xong”.</p>
<p><strong>Lỗi thường gặp:</strong> dùng tính từ (“đẹp”, “tốt”) thay vì tiêu chí đo được.</p>`
      }
    ],
    quiz: [
      {
        q: 'Thông tin nào nên có trong CLAUDE.md của project?',
        options: ['Toàn bộ mã nguồn', 'Lệnh build/test, quy ước, điều không hiển nhiên của dự án', 'API key', 'Lịch sử commit'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> CLAUDE.md được nạp vào mỗi phiên, nên chỉ chứa thứ Claude không tự suy ra được từ code: lệnh, quy ước, lưu ý đặc thù.<br><strong>Vì sao các lựa chọn khác sai:</strong> mã nguồn Claude tự đọc được khi cần; API key là secret, không được đưa vào file; lịch sử commit đã có trong git.'
      },
      {
        q: 'Ghi chú riêng của bạn cho project, không muốn commit, đặt ở đâu?',
        options: ['CLAUDE.md', 'CLAUDE.local.md', 'README.md', '.mcp.json'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> CLAUDE.local.md là bộ nhớ cấp project dành riêng cho bạn và không nên commit.<br><strong>Vì sao các lựa chọn khác sai:</strong> CLAUDE.md và README.md được commit cho cả team; .mcp.json là cấu hình MCP server, không phải nơi ghi chú.'
      },
      {
        q: 'Bạn sắp sửa 8 file để thêm một tính năng. Bước đầu tiên hợp lý nhất?',
        options: ['Cho Claude sửa ngay', 'Dùng plan mode để Claude đề xuất kế hoạch và duyệt trước', 'Tắt mọi permission', 'Xoá CLAUDE.md'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> với thay đổi lớn, duyệt kế hoạch sớm rẻ hơn nhiều so với sửa code sai sau đó.<br><strong>Vì sao các lựa chọn khác sai:</strong> sửa ngay dễ đi sai hướng; tắt permission làm tăng rủi ro chứ không giúp lập kế hoạch; xoá CLAUDE.md làm mất ngữ cảnh dự án.'
      },
      {
        q: 'Bạn chuyển từ sửa CSS sang một việc hoàn toàn khác (viết script backup). Nên làm gì với phiên?',
        options: ['Giữ nguyên để Claude nhớ hết', 'Dùng /clear để bắt đầu context sạch', 'Mở thêm 3 phiên song song', 'Tăng max_tokens'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> context cũ không liên quan làm tốn token và có thể gây nhiễu; /clear cho khởi đầu sạch.<br><strong>Vì sao các lựa chọn khác sai:</strong> giữ context thừa không có lợi; mở nhiều phiên không giải quyết context; max_tokens là giới hạn output, không liên quan.'
      },
      {
        q: 'Muốn tách quy ước API dài 200 dòng khỏi CLAUDE.md mà vẫn để Claude biết khi cần. Cách hợp lý?',
        options: ['Dán cả 200 dòng vào CLAUDE.md', 'Để file riêng và nhập bằng @duong/dan, hoặc đóng gói thành skill nếu chỉ dùng thỉnh thoảng', 'Gửi qua chat mỗi lần', 'Ghi vào .gitignore'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> @import giúp tổ chức file gọn; nếu nội dung chỉ cần thỉnh thoảng thì skill còn tiết kiệm context hơn vì chỉ nạp khi dùng.<br><strong>Vì sao các lựa chọn khác sai:</strong> dán trực tiếp làm CLAUDE.md khó bảo trì; gửi qua chat mỗi lần dễ quên; .gitignore chỉ quyết định commit, không liên quan tới nạp context.'
      },
      {
        q: 'Claude đang sửa sai hướng giữa chừng. Cách phản ứng tốt nhất?',
        options: ['Đợi Claude làm xong rồi git reset', 'Nhấn Esc để dừng, rồi đưa chỉ dẫn điều chỉnh', 'Đóng terminal', 'Gửi thêm yêu cầu khác không liên quan'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> Esc dừng ngay lượt hiện tại, bạn giữ được context và chỉ việc sửa hướng.<br><strong>Vì sao các lựa chọn khác sai:</strong> đợi xong tốn thời gian và token; đóng terminal mất phiên; yêu cầu không liên quan làm rối thêm.'
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
      },
      {
        h: '3. Thiết kế chính sách theo mức rủi ro',
        html: `<div class="table-wrap"><table>
<tr><th>Nhóm hành động</th><th>Ví dụ</th><th>Chính sách gợi ý</th></tr>
<tr><td>Chỉ đọc</td><td><code>git status</code>, <code>git diff</code>, đọc file code</td><td>allow</td></tr>
<tr><td>Ghi cục bộ, đảo ngược được</td><td>Sửa file trong repo, chạy test</td><td>allow hoặc acceptEdits</td></tr>
<tr><td>Tác động ra ngoài</td><td><code>git push</code>, tạo issue, gửi tin nhắn</td><td>ask</td></tr>
<tr><td>Phá huỷ / lộ secret</td><td><code>rm -rf</code>, đọc <code>.env</code></td><td>deny</td></tr>
</table></div>
<p>Gõ <code>/permissions</code> trong phiên để xem và chỉnh rule đang áp dụng.</p>`
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
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Tạo thư mục và file: <code>mkdir -p .claude</code>.</li>
<li>Ghi nội dung:
<pre><code>{
  "permissions": {
    "allow": [
      "Bash(python3 -m http.server:*)",
      "Bash(node --check:*)",
      "Bash(git status)",
      "Bash(git diff:*)"
    ],
    "ask": [
      "Bash(git push:*)",
      "mcp__github__create_issue"
    ],
    "deny": [
      "Read(./.mcp.json)",
      "Edit(./.mcp.json)"
    ]
  }
}</code></pre></li>
<li>Khởi động lại phiên Claude Code, gõ <code>/permissions</code> để xác nhận rule đã nạp.</li>
<li>Yêu cầu: “Đọc file .mcp.json và cho tôi biết nội dung.”</li>
</ol>
<p><strong>Kiểm tra kết quả:</strong> Claude báo bị chặn đọc file; <code>node --check</code> chạy không bị hỏi; <code>git push</code> thì bị hỏi.</p>
<p><strong>Lỗi thường gặp:</strong> JSON sai cú pháp (dấu phẩy thừa) khiến cả file bị bỏ qua; quên rằng deny <code>Read</code> không chặn được lệnh Bash như <code>cat .mcp.json</code> – nên deny thêm <code>Bash(cat .mcp.json)</code> hoặc dùng hook.</p>`
      },
      {
        title: 'Bài 2 – Giảm số lần bị hỏi quyền',
        task: `<p>Làm việc 30 phút, ghi lại các lệnh bị hỏi nhiều nhất. Thêm rule allow cho các lệnh <em>chỉ đọc</em> an toàn.</p>`,
        hint: 'Chỉ allow lệnh không gây tác dụng phụ; lệnh ghi/xoá vẫn nên ask.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Trong 30 phút làm việc, mỗi lần bị hỏi quyền, ghi lại lệnh vào một file nháp.</li>
<li>Phân loại theo bảng ở mục 3 của bài: chỉ đọc / ghi cục bộ / ra ngoài / phá huỷ.</li>
<li>Chỉ thêm nhóm “chỉ đọc” vào <code>allow</code>, ví dụ <code>"Bash(ls:*)"</code>, <code>"Bash(git log:*)"</code>.</li>
<li>Nếu là thiết lập riêng bạn, đặt trong <code>.claude/settings.local.json</code> thay vì file của team.</li>
</ol>
<p><strong>Kiểm tra kết quả:</strong> làm việc thêm 30 phút, số lần bị hỏi giảm rõ nhưng lệnh push/xoá vẫn bị hỏi.</p>
<p><strong>Lỗi thường gặp:</strong> allow quá rộng như <code>"Bash(*)"</code>; đưa thiết lập cá nhân vào file commit cho cả team.</p>`
      },
      {
        title: 'Bài 3 – Thiết lập riêng không ảnh hưởng team',
        task: `<p>Bạn muốn tự động cho phép <code>npm run dev</code> trên máy mình nhưng team không muốn allow lệnh này. Cấu hình ở đâu và thế nào?</p>`,
        hint: 'Có một file settings ở cấp project nhưng không commit.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Tạo <code>.claude/settings.local.json</code>:
<pre><code>{
  "permissions": {
    "allow": ["Bash(npm run dev)"]
  }
}</code></pre></li>
<li>Kiểm tra file này đã nằm trong <code>.gitignore</code> (Claude Code thường tự thêm; nếu chưa, thêm dòng <code>.claude/settings.local.json</code>).</li>
<li>Chạy <code>git status</code> – file không được xuất hiện trong danh sách cần commit.</li>
</ol>
<p><strong>Kiểm tra kết quả:</strong> trên máy bạn, <code>npm run dev</code> chạy không hỏi; đồng đội clone repo vẫn bị hỏi.</p>
<p><strong>Lỗi thường gặp:</strong> sửa nhầm <code>.claude/settings.json</code> và commit, áp thay đổi cho cả team.</p>`
      },
      {
        title: 'Bài 4 – Chọn permission mode',
        task: `<p>Chọn permission mode cho 3 tình huống: (a) khám phá codebase lạ, chưa muốn sửa gì; (b) refactor lớn trên nhánh riêng, bạn theo dõi sát; (c) chạy tự động trong container CI dùng một lần.</p>`,
        hint: 'Nghĩ về mức rủi ro của môi trường và ai đang giám sát.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>(a) Rủi ro thấp nhất khi không sửa gì → <strong>plan</strong>: Claude chỉ đọc và đề xuất.</li>
<li>(b) Bạn giám sát, nhánh riêng, dễ rollback → <strong>acceptEdits</strong> để khỏi xác nhận từng lần sửa file; lệnh ra ngoài vẫn ask.</li>
<li>(c) Môi trường cô lập, dùng một lần → chế độ tự động hơn có thể chấp nhận, nhưng vẫn giới hạn tool bằng <code>--allowedTools</code> và không cấp secret thừa.</li>
</ol>
<p><strong>Kiểm tra kết quả:</strong> lý do chọn luôn gắn với “nếu sai thì hậu quả gì, khắc phục được không”.</p>
<p><strong>Lỗi thường gặp:</strong> dùng chế độ bỏ qua mọi quyền trên máy cá nhân có secret và quyền push thật.</p>`
      }
    ],
    quiz: [
      {
        q: 'Một lệnh vừa khớp rule allow vừa khớp rule deny. Kết quả?',
        options: ['Được chạy', 'Bị chặn – deny thắng', 'Hỏi người dùng', 'Tuỳ thứ tự trong file'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> deny luôn được ưu tiên hơn allow, bất kể thứ tự.<br><strong>Vì sao các lựa chọn khác sai:</strong> “được chạy” và “tuỳ thứ tự” mâu thuẫn quy tắc ưu tiên; “hỏi người dùng” là hành vi của ask, không phải khi có deny.'
      },
      {
        q: 'Công ty muốn cấm mọi nhân viên dùng một MCP server, người dùng không được ghi đè. Dùng gì?',
        options: ['CLAUDE.md', 'Managed settings của tổ chức', 'settings.local.json', '.gitignore'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> managed settings do IT triển khai có ưu tiên cao nhất và người dùng không ghi đè được.<br><strong>Vì sao các lựa chọn khác sai:</strong> CLAUDE.md chỉ là hướng dẫn cho model, không phải chính sách cưỡng chế; settings.local.json do chính người dùng kiểm soát; .gitignore không liên quan tới quyền.'
      },
      {
        q: 'Bạn muốn allow một lệnh chỉ trên máy mình, không ảnh hưởng team. Đặt ở file nào?',
        options: ['.claude/settings.json', '.claude/settings.local.json', 'CLAUDE.md', '.mcp.json'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> settings.local.json là thiết lập cấp project dành riêng cho bạn, không commit.<br><strong>Vì sao các lựa chọn khác sai:</strong> settings.json được commit cho cả team; CLAUDE.md không cấu hình quyền; .mcp.json chỉ cấu hình MCP server.'
      },
      {
        q: 'Rule deny "Read(./.env)" đã có. Rủi ro nào vẫn còn?',
        options: ['Không còn rủi ro nào', 'Lệnh Bash như cat .env vẫn có thể đọc file nếu không bị chặn riêng', 'Claude không thể sửa code nữa', 'MCP bị tắt'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> rule Read áp dụng cho tool Read; lệnh Bash là tool khác, cần rule deny Bash hoặc hook chặn riêng.<br><strong>Vì sao các lựa chọn khác sai:</strong> “không còn rủi ro” bỏ qua đường Bash; rule này không ảnh hưởng việc sửa code hay MCP.'
      },
      {
        q: 'Tên rule đúng để allow tool get_issue của MCP server tên github?',
        options: ['github.get_issue', 'mcp__github__get_issue', 'MCP(github:get_issue)', 'get_issue'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> tool MCP trong Claude Code có dạng mcp__&lt;server&gt;__&lt;tool&gt;.<br><strong>Vì sao các lựa chọn khác sai:</strong> các dạng dấu chấm, MCP(...) hay chỉ tên tool không khớp quy ước đặt tên nên rule không có tác dụng.'
      },
      {
        q: 'Khám phá một codebase lạ, chưa muốn thay đổi gì. Permission mode phù hợp?',
        options: ['acceptEdits', 'plan', 'Chế độ bỏ qua mọi quyền', 'Không quan trọng'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> plan mode cho Claude đọc và đề xuất nhưng không sửa file – đúng mục tiêu khám phá.<br><strong>Vì sao các lựa chọn khác sai:</strong> acceptEdits tự chấp nhận sửa file; chế độ bỏ qua quyền quá rủi ro; mode ảnh hưởng trực tiếp tới việc Claude được làm gì nên rất quan trọng.'
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
      },
      {
        h: '3. Viết hook an toàn',
        html: `<ul>
<li>Hook chạy lệnh shell với quyền của bạn – chỉ dùng script bạn hiểu và tin tưởng.</li>
<li>Luôn trích dẫn biến (<code>"$path"</code>) để tránh lỗi khi đường dẫn có dấu cách.</li>
<li>Hook nên chạy nhanh; việc lâu (test toàn bộ) phù hợp với <code>Stop</code> hơn là <code>PostToolUse</code> sau mỗi lần sửa.</li>
<li>Kiểm tra hook độc lập bằng cách tự đưa JSON mẫu vào stdin trước khi đăng ký.</li>
</ul>`
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
3. Mỗi bài có ít nhất 4 bài tập (kèm hint, solution) và 6 câu quiz (kèm explain).
4. Chạy node --check trên file vừa sửa.`
      }
    ],
    exercises: [
      {
        title: 'Bài 1 – Hook chặn sửa file nhạy cảm',
        task: `<p>Viết hook <code>PreToolUse</code> cho <code>Edit|Write</code>: nếu <code>file_path</code> chứa <code>.mcp.json</code> hoặc <code>.env</code>, thoát với exit code 2 và in lý do ra stderr.</p>`,
        hint: 'Viết script bash đọc stdin bằng jq, so khớp đường dẫn, exit 2 kèm echo "..." >&2.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Tạo script:
<pre><code>#!/usr/bin/env bash
# .claude/hooks/protect-secrets.sh
path=$(jq -r '.tool_input.file_path // empty')
case "$path" in
  *.mcp.json|*.env) echo "Không được sửa file chứa secret: $path" &gt;&amp;2; exit 2 ;;
esac
exit 0</code></pre></li>
<li>Cấp quyền chạy: <code>chmod +x .claude/hooks/protect-secrets.sh</code>.</li>
<li>Thử độc lập: <code>echo '{"tool_input":{"file_path":"a/.env"}}' | .claude/hooks/protect-secrets.sh; echo $?</code> → in thông báo và <code>2</code>.</li>
<li>Đăng ký trong <code>.claude/settings.json</code>:
<pre><code>{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": ".claude/hooks/protect-secrets.sh" }] }
    ]
  }
}</code></pre></li>
<li>Trong phiên mới, yêu cầu Claude thêm một dòng vào <code>.env</code>.</li>
</ol>
<p><strong>Kiểm tra kết quả:</strong> Claude báo bị chặn kèm lý do từ stderr; file không đổi.</p>
<p><strong>Lỗi thường gặp:</strong> quên <code>chmod +x</code>; dùng <code>exit 1</code> (không chặn, chỉ báo lỗi); máy chưa cài <code>jq</code>.</p>`
      },
      {
        title: 'Bài 2 – Skill tạo bài học',
        task: `<p>Tạo skill <code>new-lesson</code> như mẫu, rồi yêu cầu Claude “thêm bài bonus về Batch API vào tháng 2”. Kiểm tra skill có được tự động dùng không.</p>`,
        hint: 'Mô tả skill quyết định khi nào nó được nạp – viết cụ thể các từ khoá người dùng hay nói.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li><code>mkdir -p .claude/skills/new-lesson</code> rồi tạo <code>SKILL.md</code> với nội dung mẫu ở trên.</li>
<li>Mở phiên mới (skill được phát hiện khi khởi động phiên).</li>
<li>Gõ: “Thêm bài bonus về Batch API vào tháng 2.”</li>
<li>Quan sát Claude có thông báo dùng skill <code>new-lesson</code> không; nếu không, gọi trực tiếp <code>/new-lesson</code>.</li>
<li>Nếu phải gọi tay, sửa <code>description</code>: thêm các cụm “thêm bài”, “bài học mới”, “bonus”.</li>
</ol>
<p><strong>Kiểm tra kết quả:</strong> bài mới có đủ 4 bài tập, 6 quiz và <code>node --check</code> đã chạy.</p>
<p><strong>Lỗi thường gặp:</strong> frontmatter thiếu dấu <code>---</code>; mô tả quá chung (“hỗ trợ nội dung”) nên Claude không chọn.</p>`
      },
      {
        title: 'Bài 3 – Slash command có tham số',
        task: `<p>Tạo lệnh <code>/quiz-review</code> nhận id bài học (ví dụ <code>/quiz-review m2w4</code>) và yêu cầu Claude kiểm tra các câu quiz của bài đó: đáp án đúng, giải thích đầy đủ, không có lựa chọn trùng.</p>`,
        hint: 'File markdown trong .claude/commands/, dùng $ARGUMENTS để nhận id.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Tạo <code>.claude/commands/quiz-review.md</code>:
<pre><code>---
description: Kiểm tra chất lượng quiz của một bài học theo id
---
Tìm bài học có id $ARGUMENTS trong docs/assets/js/data/.
Với từng câu quiz, kiểm tra:
1. answer trỏ đúng vào lựa chọn đúng.
2. explain có cả "Vì sao đúng" và "Vì sao các lựa chọn khác sai".
3. Không có hai lựa chọn trùng hoặc gần trùng nghĩa.
Báo cáo dạng bảng: câu · vấn đề · đề xuất sửa. Không tự sửa file.</code></pre></li>
<li>Mở phiên mới, gõ <code>/quiz-review m2w4</code>.</li>
</ol>
<p><strong>Kiểm tra kết quả:</strong> nhận được bảng báo cáo cho đúng bài m2w4.</p>
<p><strong>Lỗi thường gặp:</strong> quên <code>$ARGUMENTS</code> nên lệnh không biết bài nào; đặt file sai thư mục.</p>`
      },
      {
        title: 'Bài 4 – Chọn đúng công cụ',
        task: `<p>Với mỗi nhu cầu, chọn CLAUDE.md / hook / skill / MCP: (a) luôn chạy <code>node --check</code> sau khi sửa file JS; (b) team dùng tab 2 dấu cách; (c) quy trình xuất bản bài học mới 7 bước, vài lần/tháng; (d) đọc lịch Google Calendar của team.</p>`,
        hint: 'Hỏi: có bắt buộc 100% không? có cần thường xuyên không? có phải dữ liệu bên ngoài không?',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>(a) Bắt buộc 100% → <strong>hook</strong> <code>PostToolUse</code> với matcher <code>Edit|Write</code>, lọc file <code>.js</code>.</li>
<li>(b) Kiến thức luôn cần, ngắn → <strong>CLAUDE.md</strong>.</li>
<li>(c) Quy trình dài, dùng thỉnh thoảng → <strong>skill</strong>.</li>
<li>(d) Dữ liệu bên ngoài → <strong>MCP</strong> (connector Google Calendar).</li>
</ol>
<p><strong>Kiểm tra kết quả:</strong> mỗi lựa chọn giải thích được bằng tiêu chí “bắt buộc / luôn cần / thỉnh thoảng / bên ngoài”.</p>
<p><strong>Lỗi thường gặp:</strong> nhét mọi thứ vào CLAUDE.md, khiến file dài và Claude vẫn có thể bỏ qua các bước bắt buộc.</p>`
      }
    ],
    quiz: [
      {
        q: 'Muốn chắc chắn formatter chạy sau mỗi lần sửa file, dùng gì?',
        options: ['Ghi vào CLAUDE.md', 'Hook PostToolUse', 'Skill', 'Nhắc Claude mỗi lần'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> hook do harness chạy nên luôn xảy ra, không phụ thuộc model nhớ hay quên.<br><strong>Vì sao các lựa chọn khác sai:</strong> CLAUDE.md và việc nhắc mỗi lần chỉ là chỉ dẫn, model có thể bỏ sót; skill chỉ nạp khi phù hợp, không đảm bảo chạy sau mỗi lần sửa.'
      },
      {
        q: 'Hook PreToolUse thoát với exit code 2. Điều gì xảy ra?',
        options: ['Tool vẫn chạy', 'Tool bị chặn, stderr được gửi cho Claude', 'Phiên kết thúc', 'Hook chạy lại'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> exit code 2 ở PreToolUse là tín hiệu chặn; nội dung stderr được đưa cho Claude để điều chỉnh.<br><strong>Vì sao các lựa chọn khác sai:</strong> tool không chạy; phiên không kết thúc; hook không tự chạy lại.'
      },
      {
        q: 'Quy trình “release checklist” dùng vài lần/tháng, nhiều bước và có script. Nên đóng gói thành?',
        options: ['CLAUDE.md', 'Skill', 'Hook SessionStart', 'MCP resource'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> skill chỉ nạp mô tả vào context, nội dung và script chỉ nạp khi cần.<br><strong>Vì sao các lựa chọn khác sai:</strong> CLAUDE.md làm tốn context mọi phiên; hook SessionStart chạy mỗi lần mở phiên dù không release; MCP resource dùng cho dữ liệu, không phải quy trình nhiều bước có script.'
      },
      {
        q: 'Hook nhận thông tin về tool sắp chạy (ví dụ đường dẫn file) bằng cách nào?',
        options: ['Đọc biến môi trường ngẫu nhiên', 'Dữ liệu sự kiện dạng JSON qua stdin', 'Tham số dòng lệnh do Claude tự nghĩ', 'Đọc CLAUDE.md'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> harness gửi JSON mô tả sự kiện (vd. tool_input.file_path) qua stdin của hook.<br><strong>Vì sao các lựa chọn khác sai:</strong> không có cơ chế biến môi trường ngẫu nhiên hay tham số do model tự nghĩ; CLAUDE.md không chứa dữ liệu sự kiện.'
      },
      {
        q: 'Muốn chạy toàn bộ test (mất 3 phút) mỗi khi Claude trả lời xong, không phải sau mỗi lần sửa file. Sự kiện hook phù hợp?',
        options: ['PreToolUse', 'PostToolUse', 'Stop', 'UserPromptSubmit'],
        answer: 2,
        explain: '<strong>Vì sao đúng:</strong> Stop chạy khi Claude kết thúc lượt trả lời – phù hợp việc tốn thời gian chỉ cần chạy một lần.<br><strong>Vì sao các lựa chọn khác sai:</strong> PreToolUse/PostToolUse chạy quanh từng lần gọi tool, quá thường xuyên; UserPromptSubmit chạy khi bạn gửi prompt, trước khi có thay đổi.'
      },
      {
        q: 'Vì sao skill tiết kiệm context hơn so với đưa cùng nội dung vào CLAUDE.md?',
        options: ['Skill được nén', 'Chỉ mô tả skill luôn nằm trong context; nội dung đầy đủ chỉ nạp khi dùng', 'Skill không tính token', 'Skill chạy trên server riêng'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> đây là progressive disclosure – mô tả ngắn giúp Claude biết khi nào cần, phần thân chỉ nạp khi dùng.<br><strong>Vì sao các lựa chọn khác sai:</strong> skill không được nén hay miễn tính token; skill chạy trong cùng phiên, không phải server riêng.'
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
<div class="callout warn">Lưu API key trong GitHub Secrets. Repo private trên gói Free có 2.000 phút Actions/tháng; repo public dùng runner chuẩn miễn phí.</div>`
      },
      {
        h: '3. Viết mô tả subagent tốt',
        html: `<ul>
<li><code>description</code> quyết định khi nào agent chính giao việc – ghi rõ “dùng khi…”.</li>
<li>System prompt nêu: mục tiêu, phạm vi, định dạng kết quả trả về, điều không được làm.</li>
<li>Kết quả trả về nên ngắn và có cấu trúc để agent chính dùng tiếp (danh sách, bảng, file:dòng).</li>
<li>Subagent việc đơn giản có thể dùng model nhanh/rẻ hơn qua trường <code>model</code>.</li>
</ul>`
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
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li><code>mkdir -p .claude/agents</code>, tạo <code>code-reviewer.md</code> theo mẫu.</li>
<li>Mở phiên mới, gõ <code>/agents</code> để xác nhận subagent xuất hiện.</li>
<li>Tạo lỗi cố ý, ví dụ trong <code>docs/assets/js/pages/index.js</code> đổi <code>state.done</code> thành <code>state.dnoe</code>.</li>
<li>Yêu cầu: “Dùng code-reviewer kiểm tra thay đổi hiện tại.”</li>
<li>Sau khi có báo cáo, chạy <code>git diff</code> để chắc chỉ có thay đổi bạn tự tạo.</li>
</ol>
<p><strong>Kiểm tra kết quả:</strong> báo cáo chỉ ra <code>state.dnoe</code> kèm file:dòng; không có file nào bị subagent sửa.</p>
<p><strong>Lỗi thường gặp:</strong> cấp <code>Edit</code>/<code>Write</code> cho reviewer; mô tả không có “dùng khi” nên agent chính không tự giao việc.</p>`
      },
      {
        title: 'Bài 2 – Workflow GitHub Actions kiểm tra cú pháp',
        task: `<p>Tạo <code>.github/workflows/check.yml</code> chạy <code>node --check</code> trên mọi file JS trong <code>docs/</code> khi push. Ước tính số phút Actions dùng mỗi tháng.</p>`,
        hint: 'runs-on: ubuntu-latest (hệ số ×1). Một job ngắn vẫn bị làm tròn lên 1 phút.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Tạo file:
<pre><code>name: check
on: [push, pull_request]
jobs:
  syntax:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: for f in $(find docs -name "*.js"); do node --check "$f"; done</code></pre></li>
<li>Commit và push, mở tab Actions trên GitHub xem job chạy.</li>
<li>Ước tính: khoảng 1 phút/lần × số lần push trong tháng.</li>
</ol>
<p><strong>Kiểm tra kết quả:</strong> job xanh; thử cố ý tạo lỗi cú pháp và push lên nhánh thử – job đỏ.</p>
<p><strong>Lỗi thường gặp:</strong> sai thụt lề YAML; <code>node --check</code> gặp lỗi nhưng vòng lặp vẫn tiếp tục – thêm <code>set -e</code> hoặc <code>|| exit 1</code> để job thất bại đúng.</p>`
      },
      {
        title: 'Bài 3 – Headless lấy kết quả JSON',
        task: `<p>Viết script bash chạy <code>claude -p</code> để tóm tắt thay đổi của commit gần nhất, xuất <code>--output-format json</code>, rồi dùng <code>jq</code> lấy phần kết quả văn bản ghi ra <code>SUMMARY.md</code>.</p>`,
        hint: 'Xem cấu trúc JSON đầu ra trước bằng cách in ra màn hình, rồi mới viết biểu thức jq.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Chạy thử và xem cấu trúc:
<pre><code>claude -p "Tóm tắt thay đổi của commit HEAD trong 5 gạch đầu dòng" \\
  --allowedTools "Bash(git show:*)" --output-format json | jq 'keys'</code></pre></li>
<li>Tìm trường chứa văn bản kết quả trong JSON (thường là <code>result</code>; kiểm tra tài liệu mới nhất vì định dạng có thể thay đổi).</li>
<li>Viết script:
<pre><code>#!/usr/bin/env bash
set -euo pipefail
claude -p "Tóm tắt thay đổi của commit HEAD trong 5 gạch đầu dòng" \\
  --allowedTools "Bash(git show:*)" --output-format json \\
  | jq -r '.result' &gt; SUMMARY.md
echo "Đã ghi SUMMARY.md"</code></pre></li>
</ol>
<p><strong>Kiểm tra kết quả:</strong> <code>SUMMARY.md</code> có 5 gạch đầu dòng mô tả đúng commit gần nhất.</p>
<p><strong>Lỗi thường gặp:</strong> không cho phép <code>git show</code> nên Claude không đọc được commit; đoán sai tên trường JSON.</p>`
      },
      {
        title: 'Bài 4 – Hai subagent chạy song song',
        task: `<p>Tạo thêm subagent <code>content-checker</code> (kiểm tra chính tả và tính nhất quán nội dung tiếng Việt, chỉ Read/Grep/Glob). Yêu cầu Claude dùng song song <code>code-reviewer</code> và <code>content-checker</code> cho cùng một thay đổi, rồi tổng hợp.</p>`,
        hint: 'Yêu cầu rõ “chạy song song hai subagent rồi gộp báo cáo”.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Tạo <code>.claude/agents/content-checker.md</code>:
<pre><code>---
name: content-checker
description: Kiểm tra chính tả, thuật ngữ và tính nhất quán của nội dung tiếng Việt trong docs/. Dùng khi có thay đổi nội dung bài học.
tools: Read, Grep, Glob
---
Kiểm tra lỗi chính tả, thuật ngữ không thống nhất (vd. "subagent" và "sub-agent"),
câu quá dài. Trả danh sách file:dòng · vấn đề · đề xuất. Không sửa file.</code></pre></li>
<li>Sửa nội dung một bài học (thêm một lỗi chính tả và một lỗi code).</li>
<li>Yêu cầu: “Chạy song song code-reviewer và content-checker trên thay đổi hiện tại, gộp thành một báo cáo theo mức độ.”</li>
</ol>
<p><strong>Kiểm tra kết quả:</strong> báo cáo có cả lỗi code và lỗi chính tả; context chính chỉ chứa phần tóm tắt.</p>
<p><strong>Lỗi thường gặp:</strong> hai subagent có mô tả chồng chéo khiến agent chính chọn nhầm; yêu cầu kết quả không có định dạng thống nhất nên khó gộp.</p>`
      }
    ],
    quiz: [
      {
        q: 'Lợi ích chính của subagent khi cần tìm kiếm trong 200 file?',
        options: ['Rẻ hơn luôn luôn', 'Context riêng: đọc nhiều nhưng chỉ trả kết quả tóm tắt, giữ context chính gọn', 'Không cần permission', 'Chạy offline'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> cô lập context là lý do quan trọng nhất; chuyên môn hoá và chạy song song là lợi ích thêm.<br><strong>Vì sao các lựa chọn khác sai:</strong> subagent không phải lúc nào cũng rẻ hơn (vẫn tốn token đọc file); vẫn chịu permission; vẫn cần gọi model qua mạng.'
      },
      {
        q: 'Chạy Claude Code trong CI cần gì?',
        options: ['Chế độ tương tác', 'claude -p với --allowedTools giới hạn và secret lưu an toàn', 'Quyền admin repo', 'Tắt mọi permission'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> CI không có người tương tác nên dùng headless, giới hạn tool và giữ API key trong GitHub Secrets.<br><strong>Vì sao các lựa chọn khác sai:</strong> chế độ tương tác không chạy được trong CI; quyền admin và tắt mọi permission vi phạm nguyên tắc quyền tối thiểu.'
      },
      {
        q: 'Subagent review code nên được cấp những tool nào?',
        options: ['Tất cả tool', 'Chỉ các tool đọc như Read, Grep, Glob (và git diff)', 'Edit và Write', 'Chỉ Bash không giới hạn'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> reviewer chỉ cần đọc và xem diff; giới hạn tool đảm bảo nó không sửa code.<br><strong>Vì sao các lựa chọn khác sai:</strong> cấp tất cả hay Edit/Write cho phép sửa file ngoài ý muốn; Bash không giới hạn có thể làm mọi thứ.'
      },
      {
        q: 'Trường nào trong file subagent quyết định khi nào agent chính giao việc cho nó?',
        options: ['name', 'description', 'tools', 'model'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> description giống mô tả tool – là prompt để agent chính quyết định dùng subagent nào.<br><strong>Vì sao các lựa chọn khác sai:</strong> name chỉ là định danh; tools quy định quyền; model chọn model chạy subagent.'
      },
      {
        q: 'Script cần đọc kết quả của claude -p bằng máy. Tuỳ chọn phù hợp?',
        options: ['--verbose', '--output-format json', '--interactive', 'Không cần gì'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> đầu ra JSON có cấu trúc, dễ xử lý bằng jq hoặc code.<br><strong>Vì sao các lựa chọn khác sai:</strong> --verbose chỉ tăng log; không có chế độ tương tác trong script; văn bản thô khó tách tin cậy.'
      },
      {
        q: 'Workflow chạy node --check trong vòng lặp for nhưng job vẫn xanh dù có file lỗi. Nguyên nhân khả năng cao?',
        options: ['GitHub Actions lỗi', 'Vòng lặp tiếp tục sau lệnh lỗi và chỉ lấy exit code của lệnh cuối', 'node không cài', 'Repo là public'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> trong bash, vòng lặp trả exit code của lệnh cuối cùng; cần set -e hoặc || exit 1 để dừng khi lỗi.<br><strong>Vì sao các lựa chọn khác sai:</strong> nếu node không cài thì job sẽ đỏ; việc repo public hay private không ảnh hưởng exit code.'
      }
    ],
    resources: [
      { t: 'Claude Code – Subagents', url: 'https://code.claude.com/docs' },
      { t: 'Claude Code – GitHub Actions', url: 'https://code.claude.com/docs' }
    ]
  },

  {
    id: 'm4b1', month: 4, week: 5, bonus: true, duration: '6 giờ', domain: 'Claude Code',
    title: 'Bonus: Plugin và triển khai Claude Code cho cả team',
    objectives: [
      'Hiểu plugin gói những gì: skills, subagents, slash command, hooks, MCP server',
      'Chia sẻ plugin cho team qua marketplace',
      'Dùng managed settings để áp chính sách cho cả tổ chức',
      'Biết các tuỳ biến trải nghiệm: statusline và output style'
    ],
    sections: [
      {
        h: '1. Plugin là gì',
        html: `<p>Khi team đã có nhiều skill, subagent, hook và cấu hình MCP, việc copy từng file sang mọi repo rất dễ lệch phiên bản. <strong>Plugin</strong> đóng gói các thành phần đó thành một đơn vị cài đặt, có tên và phiên bản.</p>
<p>Cấu trúc thường gặp của một plugin (kiểm tra tài liệu mới nhất vì chi tiết có thể thay đổi theo phiên bản):</p>
<ul>
<li><code>.claude-plugin/plugin.json</code> – metadata: tên, mô tả, phiên bản.</li>
<li><code>commands/</code> – slash command.</li>
<li><code>agents/</code> – subagent.</li>
<li><code>skills/</code> – skill (mỗi skill một thư mục có <code>SKILL.md</code>).</li>
<li><code>hooks/hooks.json</code> – cấu hình hook.</li>
<li><code>.mcp.json</code> – MCP server đi kèm.</li>
</ul>`
      },
      {
        h: '2. Marketplace và cài đặt',
        html: `<ul>
<li><strong>Marketplace</strong> là danh mục plugin, thường là một repo git có file <code>.claude-plugin/marketplace.json</code> liệt kê các plugin.</li>
<li>Thêm marketplace: <code>/plugin marketplace add &lt;owner&gt;/&lt;repo&gt;</code>. Cài plugin: <code>/plugin install &lt;tên&gt;@&lt;marketplace&gt;</code>. Gõ <code>/plugin</code> để quản lý.</li>
<li>Để cả team dùng chung, khai báo marketplace và plugin cần bật trong <code>.claude/settings.json</code> của repo (các khoá như <code>extraKnownMarketplaces</code>, <code>enabledPlugins</code> – kiểm tra tài liệu mới nhất).</li>
<li>Plugin chạy hook và MCP server với quyền của bạn – chỉ cài từ nguồn tin cậy và đọc mã nguồn trước.</li>
</ul>`
      },
      {
        h: '3. Managed settings cho tổ chức',
        html: `<p>IT có thể triển khai file <strong>managed settings</strong> lên máy nhân viên (trên macOS thường ở <code>/Library/Application Support/ClaudeCode/</code>; kiểm tra tài liệu mới nhất cho từng hệ điều hành). Thiết lập ở đây có ưu tiên cao nhất, người dùng không ghi đè được. Dùng để:</p>
<ul>
<li>Chặn lệnh hoặc tool nguy hiểm cho mọi người (<code>deny</code>).</li>
<li>Giới hạn MCP server hoặc marketplace được phép.</li>
<li>Bắt buộc một số hook bảo mật hoặc cấu hình ghi log.</li>
</ul>`
      },
      {
        h: '4. Tuỳ biến trải nghiệm (tuỳ chọn)',
        html: `<ul>
<li><strong>Statusline</strong>: dòng trạng thái dưới ô nhập, cấu hình bằng khoá <code>statusLine</code> trỏ tới một lệnh in ra nội dung (vd. nhánh git, model đang dùng).</li>
<li><strong>Output style</strong>: thay đổi phong cách trả lời (vd. giải thích nhiều hơn khi học) qua lệnh <code>/output-style</code>.</li>
<li>Đây là tiện ích cá nhân, nên đặt ở cấp user thay vì ép cả team.</li>
</ul>`
      }
    ],
    code: [
      {
        title: '.claude-plugin/plugin.json – metadata plugin', lang: 'json',
        src: `
{
  "name": "study-site-tools",
  "description": "Skill tạo bài học, subagent review nội dung và hook bảo vệ secret cho repo ai-agent",
  "version": "1.0.0"
}`
      },
      {
        title: 'Cấu trúc thư mục plugin', lang: 'text',
        src: `
study-site-tools/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   └── new-lesson/SKILL.md
├── agents/
│   ├── code-reviewer.md
│   └── content-checker.md
├── commands/
│   └── quiz-review.md
└── hooks/
    └── hooks.json`
      },
      {
        title: '~/.claude/settings.json – statusline đơn giản', lang: 'json',
        src: `
{
  "statusLine": {
    "type": "command",
    "command": "echo \\"$(git branch --show-current 2>/dev/null)\\""
  }
}`
      }
    ],
    exercises: [
      {
        title: 'Bài 1 – Đóng gói plugin từ các file đã có',
        task: `<p>Gom skill <code>new-lesson</code>, subagent <code>code-reviewer</code>, <code>content-checker</code>, lệnh <code>/quiz-review</code> và hook bảo vệ secret thành plugin <code>study-site-tools</code>.</p>`,
        hint: 'Bắt đầu từ cấu trúc thư mục mẫu; hook của plugin dùng cùng định dạng khoá "hooks" như settings.json.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Tạo thư mục theo cấu trúc mẫu và <code>.claude-plugin/plugin.json</code>.</li>
<li>Copy file: <code>.claude/skills/new-lesson</code> → <code>skills/</code>; <code>.claude/agents/*.md</code> → <code>agents/</code>; <code>.claude/commands/quiz-review.md</code> → <code>commands/</code>.</li>
<li>Tạo <code>hooks/hooks.json</code>:
<pre><code>{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Edit|Write",
        "hooks": [{ "type": "command",
                    "command": "\${CLAUDE_PLUGIN_ROOT}/scripts/protect-secrets.sh" }] }
    ]
  }
}</code></pre>
và đặt script vào <code>scripts/protect-secrets.sh</code> (biến trỏ tới thư mục gốc plugin – kiểm tra tài liệu mới nhất về tên biến).</li>
<li>Tăng <code>version</code> mỗi khi thay đổi plugin.</li>
</ol>
<p><strong>Kiểm tra kết quả:</strong> cây thư mục khớp mẫu; <code>plugin.json</code> là JSON hợp lệ (<code>jq . .claude-plugin/plugin.json</code>).</p>
<p><strong>Lỗi thường gặp:</strong> dùng đường dẫn tương đối trong hook (plugin được cài ở thư mục khác); quên copy script đi kèm.</p>`
      },
      {
        title: 'Bài 2 – Tạo marketplace nội bộ',
        task: `<p>Tạo repo <code>team-claude-plugins</code> chứa plugin trên và file marketplace. Thêm marketplace vào Claude Code và cài plugin.</p>`,
        hint: 'File marketplace liệt kê tên plugin và nơi chứa (source) của từng plugin.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Trong repo mới, đặt plugin vào <code>plugins/study-site-tools/</code>.</li>
<li>Tạo <code>.claude-plugin/marketplace.json</code> (định dạng minh hoạ, kiểm tra tài liệu mới nhất):
<pre><code>{
  "name": "team-claude-plugins",
  "owner": { "name": "Team ai-agent" },
  "plugins": [
    { "name": "study-site-tools",
      "source": "./plugins/study-site-tools",
      "description": "Công cụ cho repo trang học" }
  ]
}</code></pre></li>
<li>Push repo lên GitHub.</li>
<li>Trong Claude Code: <code>/plugin marketplace add &lt;owner&gt;/team-claude-plugins</code>, rồi <code>/plugin install study-site-tools@team-claude-plugins</code>.</li>
<li>Khởi động lại phiên.</li>
</ol>
<p><strong>Kiểm tra kết quả:</strong> <code>/agents</code> thấy <code>code-reviewer</code>; gõ <code>/quiz-review</code> có trong danh sách lệnh.</p>
<p><strong>Lỗi thường gặp:</strong> đường dẫn <code>source</code> sai; repo marketplace private mà đồng đội không có quyền đọc.</p>`
      },
      {
        title: 'Bài 3 – Bật plugin cho cả team qua settings của repo',
        task: `<p>Cấu hình <code>.claude/settings.json</code> của repo <code>ai-agent</code> để khi đồng đội mở project, Claude Code biết marketplace và gợi ý bật plugin.</p>`,
        hint: 'Khai báo marketplace và danh sách plugin cần bật.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Thêm vào <code>.claude/settings.json</code> (tên khoá minh hoạ, kiểm tra tài liệu mới nhất):
<pre><code>{
  "extraKnownMarketplaces": {
    "team-claude-plugins": {
      "source": { "source": "github", "repo": "&lt;owner&gt;/team-claude-plugins" }
    }
  },
  "enabledPlugins": {
    "study-site-tools@team-claude-plugins": true
  }
}</code></pre></li>
<li>Commit, nhờ một đồng đội clone và mở Claude Code trong repo.</li>
<li>Đồng đội xác nhận tin cậy thư mục và đồng ý cài plugin khi được hỏi.</li>
</ol>
<p><strong>Kiểm tra kết quả:</strong> đồng đội dùng được <code>/quiz-review</code> mà không cần cài tay.</p>
<p><strong>Lỗi thường gặp:</strong> gộp khoá mới vào file settings nhưng làm hỏng JSON; quên rằng người dùng vẫn phải chấp nhận tin cậy trước khi plugin chạy.</p>`
      },
      {
        title: 'Bài 4 – Thiết kế chính sách managed settings',
        task: `<p>Bạn là người phụ trách công cụ AI của công ty 50 dev. Viết (chỉ nội dung, không cần triển khai) chính sách managed settings: chặn gì, bắt buộc gì, và cái gì để team tự quyết.</p>`,
        hint: 'Chia 3 lớp: tổ chức (bắt buộc) · project (team) · cá nhân.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Liệt kê rủi ro chung: lộ secret, lệnh phá huỷ, MCP server không rõ nguồn gốc.</li>
<li>Đưa vào managed settings (bắt buộc):
<pre><code>{
  "permissions": {
    "deny": [
      "Bash(rm -rf:*)",
      "Read(./.env)",
      "Read(./**/*.pem)"
    ]
  }
}</code></pre>
cùng giới hạn marketplace/MCP được phép (kiểm tra tài liệu mới nhất về khoá cấu hình tương ứng).</li>
<li>Để cấp project quyết định: lệnh build/test được allow, skill và subagent của từng repo.</li>
<li>Để cá nhân: statusline, output style, allow lệnh tiện ích trên máy mình (<code>settings.local.json</code>).</li>
</ol>
<p><strong>Kiểm tra kết quả:</strong> chính sách trả lời được “ai quyết định cái gì” và không chặn công việc bình thường của dev.</p>
<p><strong>Lỗi thường gặp:</strong> đưa mọi thứ vào managed settings khiến team không tự chủ; hoặc ngược lại không có lớp bắt buộc nào cho secret.</p>`
      }
    ],
    quiz: [
      {
        q: 'Team có 6 repo cùng dùng một bộ skill, subagent và hook. Cách chia sẻ bền vững nhất?',
        options: ['Copy thư mục .claude sang từng repo bằng tay', 'Đóng gói thành plugin, phân phối qua marketplace và bật trong settings của từng repo', 'Gửi file qua chat', 'Ghi vào CLAUDE.md từng repo'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> plugin có tên và phiên bản, cập nhật một nơi, cài được cho mọi repo.<br><strong>Vì sao các lựa chọn khác sai:</strong> copy tay và gửi qua chat dễ lệch phiên bản; CLAUDE.md không đóng gói được hook hay subagent.'
      },
      {
        q: 'Thành phần nào KHÔNG phải thứ plugin thường đóng gói?',
        options: ['Skills', 'Subagents', 'Hooks', 'API key của từng người dùng'],
        answer: 3,
        explain: '<strong>Vì sao đúng:</strong> secret không bao giờ nên nằm trong plugin – mỗi người tự cấp qua biến môi trường.<br><strong>Vì sao các lựa chọn khác sai:</strong> skills, subagents và hooks đều là thành phần plugin thường chứa (cùng với slash command và MCP server).'
      },
      {
        q: 'Rủi ro bảo mật chính khi cài plugin từ nguồn lạ?',
        options: ['Plugin làm chậm máy', 'Hook và MCP server của plugin chạy lệnh với quyền của bạn', 'Plugin tốn thêm phí', 'Không có rủi ro'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> hook là lệnh shell và MCP server là tiến trình chạy trên máy bạn – mã độc có thể đọc secret hoặc gửi dữ liệu ra ngoài.<br><strong>Vì sao các lựa chọn khác sai:</strong> hiệu năng và phí không phải rủi ro chính; nói “không có rủi ro” là sai vì plugin thực thi mã.'
      },
      {
        q: 'Công ty muốn chặn mọi nhân viên đọc file *.pem, người dùng không được ghi đè. Đặt rule ở đâu?',
        options: ['Plugin của team', 'Managed settings của tổ chức', '.claude/settings.json của từng repo', 'CLAUDE.md'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> managed settings có ưu tiên cao nhất và người dùng không ghi đè được.<br><strong>Vì sao các lựa chọn khác sai:</strong> plugin có thể bị tắt; settings của repo chỉ áp dụng cho repo đó và có thể bị sửa; CLAUDE.md không cưỡng chế được.'
      },
      {
        q: 'Muốn thấy tên nhánh git dưới ô nhập của Claude Code trên máy mình. Dùng gì và đặt ở cấp nào?',
        options: ['Hook Stop ở cấp project', 'statusLine ở ~/.claude/settings.json', 'Managed settings', 'Skill'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> statusLine là tuỳ biến hiển thị cá nhân, nên đặt ở settings cấp user.<br><strong>Vì sao các lựa chọn khác sai:</strong> hook Stop chạy sau mỗi lượt trả lời, không phải để hiển thị; managed settings dành cho chính sách tổ chức; skill là quy trình, không phải giao diện.'
      },
      {
        q: 'Khi hook trong plugin gọi một script đi kèm, nên tham chiếu đường dẫn thế nào?',
        options: ['Đường dẫn tuyệt đối trên máy người viết plugin', 'Đường dẫn dựa trên biến trỏ tới thư mục gốc của plugin', 'Đường dẫn tương đối từ thư mục project đang mở', 'Không cần đường dẫn'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> plugin được cài ở vị trí khác nhau trên mỗi máy, nên cần biến trỏ tới thư mục gốc plugin.<br><strong>Vì sao các lựa chọn khác sai:</strong> đường dẫn tuyệt đối chỉ đúng trên máy người viết; tương đối từ project sai vì script nằm trong plugin; hook luôn cần lệnh cụ thể để chạy.'
      }
    ],
    resources: [
      { t: 'Claude Code – Plugins', url: 'https://code.claude.com/docs' },
      { t: 'Claude Code – Settings (managed settings, statusline)', url: 'https://code.claude.com/docs' }
    ]
  }
);

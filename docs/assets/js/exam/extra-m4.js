/* Câu hỏi thi thử bổ sung – Claude Code (tình huống P4). Tự biên soạn, không phải đề chính thức. */
window.EXAM_BANK = window.EXAM_BANK || [];
window.EXAM_BANK.push(
  {
    scenario: 'P4', domain: 'Claude Code',
    q: 'Tình huống P4: Công ty 40 dev dùng Claude Code trên 8 repo. Mỗi repo tự copy cùng một bộ skill, subagent review và hook bảo vệ secret, nay các bản đã lệch nhau. Cách khắc phục bền vững nhất?',
    options: [
      'Gửi email yêu cầu mọi người copy lại bản mới nhất',
      'Ghi toàn bộ nội dung skill vào CLAUDE.md của từng repo',
      'Đóng gói thành plugin có phiên bản, phân phối qua marketplace nội bộ và bật trong settings của từng repo',
      'Xoá hết để mỗi dev tự viết'
    ],
    answer: 2,
    explain: '<strong>Vì sao đúng:</strong> plugin gom skill, subagent, hook thành một đơn vị có phiên bản; cập nhật một nơi, mọi repo dùng chung.<br><strong>Vì sao các lựa chọn khác sai:</strong> copy tay qua email sẽ lại lệch; CLAUDE.md không đóng gói được hook hay subagent và làm tốn context; xoá hết làm mất chuẩn chung.'
  },
  {
    scenario: 'P4', domain: 'Claude Code',
    q: 'Tình huống P4: Bộ phận bảo mật yêu cầu không nhân viên nào được để Claude Code đọc file *.pem và .env, kể cả khi họ tự sửa settings. Giải pháp?',
    options: [
      'Rule deny trong managed settings do IT triển khai',
      'Thêm *.pem và .env vào .gitignore',
      'Ghi yêu cầu vào CLAUDE.md của mọi repo',
      'Rule deny trong .claude/settings.local.json'
    ],
    answer: 0,
    explain: '<strong>Vì sao đúng:</strong> managed settings có ưu tiên cao nhất và người dùng không ghi đè được.<br><strong>Vì sao các lựa chọn khác sai:</strong> .gitignore chỉ ngăn commit, không ngăn đọc; CLAUDE.md là chỉ dẫn, không cưỡng chế; settings.local.json do chính người dùng kiểm soát và có thể xoá.'
  },
  {
    scenario: 'P4', domain: 'Claude Code',
    q: 'Tình huống P4: Team yêu cầu mọi file TypeScript phải qua eslint --fix ngay sau khi Claude sửa. Dù CLAUDE.md đã ghi rõ, Claude vẫn đôi lúc bỏ qua. Cách đảm bảo 100%?',
    options: [
      'Viết yêu cầu bằng chữ hoa trong CLAUDE.md',
      'Hook PostToolUse với matcher Edit|Write chạy eslint --fix trên file vừa sửa',
      'Tạo skill tên "lint"',
      'Chuyển sang plan mode'
    ],
    answer: 1,
    explain: '<strong>Vì sao đúng:</strong> hook do harness chạy sau mỗi lần tool Edit/Write hoàn thành, không phụ thuộc model nhớ.<br><strong>Vì sao các lựa chọn khác sai:</strong> chữ hoa vẫn chỉ là chỉ dẫn; skill chỉ được nạp khi phù hợp; plan mode ngăn sửa file chứ không chạy lint.'
  },
  {
    scenario: 'P4', domain: 'Claude Code',
    q: 'Tình huống P4: Khi điều tra một bug khó, Claude Code phải đọc log của 120 service khiến context chính đầy và chất lượng trả lời giảm. Thay đổi nào hiệu quả nhất?',
    options: [
      'Tăng max_tokens',
      'Dùng /compact mỗi 5 phút',
      'Giao việc đọc log cho subagent chỉ có tool đọc, yêu cầu trả về tóm tắt có cấu trúc',
      'Dán log vào CLAUDE.md'
    ],
    answer: 2,
    explain: '<strong>Vì sao đúng:</strong> subagent có context riêng – đọc nhiều nhưng chỉ trả kết luận, giữ context chính gọn.<br><strong>Vì sao các lựa chọn khác sai:</strong> max_tokens giới hạn output, không giải quyết context; compact liên tục làm mất chi tiết và vẫn phải đọc log trong context chính; đưa log vào CLAUDE.md làm tốn context mọi phiên.'
  },
  {
    scenario: 'P4', domain: 'Claude Code',
    q: 'Tình huống P4: Team muốn Claude tự review mọi pull request trên GitHub và comment kết quả. Cấu hình nào phù hợp?',
    options: [
      'Mỗi dev chạy Claude Code tương tác cho từng PR',
      'Commit API key vào file workflow để tiện',
      'GitHub Actions chạy Claude Code headless với tool giới hạn, API key trong GitHub Secrets',
      'Cấp token admin:org cho workflow để chắc chắn đủ quyền'
    ],
    answer: 2,
    explain: '<strong>Vì sao đúng:</strong> CI chạy headless, giới hạn tool theo quyền tối thiểu và lưu secret an toàn.<br><strong>Vì sao các lựa chọn khác sai:</strong> chạy tay không tự động; commit API key làm lộ secret; admin:org vượt xa quyền cần thiết để comment PR.'
  },
  {
    scenario: 'P4', domain: 'Claude Code',
    q: 'Tình huống P4: Một dev muốn Claude Code tự chạy "npm run storybook" không cần hỏi trên máy mình, nhưng team không muốn allow lệnh này cho tất cả. Cách làm đúng?',
    options: [
      'Thêm vào allow trong .claude/settings.local.json',
      'Thêm vào allow trong .claude/settings.json rồi commit',
      'Thêm vào managed settings',
      'Tắt toàn bộ permission'
    ],
    answer: 0,
    explain: '<strong>Vì sao đúng:</strong> settings.local.json là thiết lập project dành riêng cho một người, không commit.<br><strong>Vì sao các lựa chọn khác sai:</strong> settings.json áp cho cả team; managed settings dành cho chính sách toàn tổ chức; tắt permission quá rủi ro.'
  },
  {
    scenario: 'P4', domain: 'Claude Code',
    q: 'Tình huống P4: Quy trình phát hành gồm 11 bước và 3 script, chỉ chạy 2 lần mỗi tháng. Team không muốn nó chiếm context trong các phiên thường ngày. Nên đóng gói thành?',
    options: [
      'Đoạn dài trong CLAUDE.md',
      'Hook SessionStart in quy trình mỗi khi mở phiên',
      'MCP resource',
      'Skill có SKILL.md mô tả rõ khi nào dùng, kèm các script'
    ],
    answer: 3,
    explain: '<strong>Vì sao đúng:</strong> skill chỉ đưa mô tả vào context, nội dung và script chỉ nạp khi cần (progressive disclosure).<br><strong>Vì sao các lựa chọn khác sai:</strong> CLAUDE.md và hook SessionStart đều nạp nội dung vào mọi phiên; MCP resource dùng để cung cấp dữ liệu, không phải quy trình nhiều bước có script.'
  },
  {
    scenario: 'P4', domain: 'Claude Code',
    q: 'Tình huống P4: Hook PreToolUse chặn sửa thư mục migrations/ nhưng Claude vẫn sửa được. Script hook in cảnh báo rồi kết thúc bằng exit 1. Nguyên nhân?',
    options: [
      'Claude Code không hỗ trợ hook PreToolUse',
      'Phải dùng exit code 2 để chặn tool; exit 1 chỉ báo lỗi không chặn',
      'Matcher phải là "*"',
      'Hook chỉ chạy trên repo public'
    ],
    answer: 1,
    explain: '<strong>Vì sao đúng:</strong> ở PreToolUse, exit code 2 là tín hiệu chặn và stderr được gửi cho Claude; mã lỗi khác không chặn tool.<br><strong>Vì sao các lựa chọn khác sai:</strong> PreToolUse được hỗ trợ; matcher "*" không liên quan tới việc chặn; hook không phụ thuộc repo public hay private.'
  }
);

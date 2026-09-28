/* Bổ sung ngân hàng thi thử – tình huống P6 (tự biên soạn, không phải đề chính thức). */
window.EXAM_BANK = window.EXAM_BANK || [];

window.EXAM_BANK.push(
  {
    scenario: 'P6', domain: 'Context Management',
    q: 'Tình huống P6: Công ty bảo hiểm VietCare triển khai Claude cho 60 nhân viên hỗ trợ và 30 kỹ sư. Trợ lý hỗ trợ dùng một system prompt 12.000 token (quy định bồi thường, cố định trong tháng) cho khoảng 20.000 hội thoại/ngày. Hoá đơn API cao hơn dự kiến. Nên làm gì trước tiên?',
    options: [
      'Đặt cache_control cho system prompt cố định và kiểm tra usage.cache_read_input_tokens',
      'Chuyển toàn bộ sang model nhỏ nhất',
      'Cắt system prompt còn 2.000 token',
      'Dùng Batch API cho hội thoại'
    ],
    answer: 0,
    explain: '<strong>Vì sao đúng:</strong> 12.000 token giống hệt nhau ở mọi request là trường hợp lý tưởng cho prompt caching. Đọc cache chỉ tốn khoảng 10% giá input, chất lượng không đổi – đây là việc “miễn phí” nên làm trước.<br><strong>Vì sao các lựa chọn khác sai:</strong> Đổi sang model nhỏ nhất là đánh đổi chất lượng khi chưa có eval. Cắt quy định bồi thường làm mất thông tin quan trọng. Batch API xử lý bất đồng bộ, không dùng được cho hội thoại trực tiếp.<br><strong>Xem lại:</strong> Tháng 5 tuần 1 và tuần 4.'
  },
  {
    scenario: 'P6', domain: 'Prompt Engineering',
    q: 'Tình huống P6: Nhân viên phàn nàn trợ lý của VietCare trả lời dài dòng, nhiều gạch đầu dòng, trong khi câu trả lời được dán thẳng vào tin nhắn SMS cho khách. Cách chỉnh prompt tốt nhất?',
    options: [
      'Thêm “ĐỪNG DÀI DÒNG!!!” vào cuối prompt',
      'Giảm max_tokens xuống 50',
      'Nêu rõ bối cảnh và định dạng: câu trả lời được gửi qua SMS, tối đa 2 câu văn xuôi, không markdown, câu đầu là kết luận',
      'Đổi sang model khác'
    ],
    answer: 2,
    explain: '<strong>Vì sao đúng:</strong> Giải thích bối cảnh (dùng cho SMS) và mô tả tích cực, đo được định dạng mong muốn giúp Claude hiểu lý do và làm đúng cả những trường hợp không liệt kê.<br><strong>Vì sao các lựa chọn khác sai:</strong> Chỉ dẫn viết hoa mang tính cấm đoán, mơ hồ, có thể khiến model phản ứng thái quá. max_tokens quá thấp làm câu bị cắt giữa chừng. Đổi model không giải quyết việc prompt thiếu thông tin.<br><strong>Xem lại:</strong> Tháng 1 tuần 2.'
  },
  {
    scenario: 'P6', domain: 'Tool Design & MCP',
    q: 'Tình huống P6: VietCare muốn trợ lý tra trạng thái hồ sơ bồi thường qua API nội bộ. Kỹ sư đề xuất tool get_claim(claim_id) trả về nguyên bản ghi JSON 8.000 token có hàng chục trường nội bộ. Cải tiến nào tốt nhất?',
    options: [
      'Giữ nguyên, model tự lọc',
      'Tăng context window',
      'Trả về base64 để gọn hơn',
      'Chỉ trả các trường cần cho việc trả lời khách (trạng thái, ngày cập nhật, bước tiếp theo), kèm thông báo lỗi có hướng dẫn khi claim_id sai'
    ],
    answer: 3,
    explain: '<strong>Vì sao đúng:</strong> Kết quả tool nên gọn và có nghĩa: ít token hơn, ít nhiễu hơn, ít nguy cơ lộ trường nội bộ. Lỗi có hướng dẫn giúp model tự sửa hoặc hỏi lại khách.<br><strong>Vì sao các lựa chọn khác sai:</strong> Để model tự lọc thì mỗi lần gọi tốn 8.000 token và dễ làm lộ dữ liệu không cần thiết. Context window không phải là thứ tăng tuỳ ý, và cũng không giải quyết chi phí. Base64 làm dữ liệu khó đọc hơn với model và thường tốn token hơn.<br><strong>Xem lại:</strong> Tháng 3 tuần 3.'
  },
  {
    scenario: 'P6', domain: 'Tool Design & MCP',
    q: 'Tình huống P6: Tool get_claim sẽ được dùng bởi trợ lý hỗ trợ, Claude Code của kỹ sư và một agent báo cáo. Cách cung cấp và xác thực phù hợp?',
    options: [
      'MCP server HTTP dùng chung, xác thực theo từng người dùng, token để trong biến môi trường hoặc OAuth',
      'Copy định nghĩa tool vào từng ứng dụng, dùng chung một API key ghi trong code',
      'MCP server stdio trên laptop của một kỹ sư',
      'Đưa toàn bộ dữ liệu hồ sơ vào system prompt'
    ],
    answer: 0,
    explain: '<strong>Vì sao đúng:</strong> Nhiều host cùng dùng thì một MCP server là hợp lý. Chạy tập trung thì dùng HTTP; xác thực theo từng người dùng và giữ secret ngoài code là nguyên tắc bảo mật.<br><strong>Vì sao các lựa chọn khác sai:</strong> Copy vào từng ứng dụng sinh ra nhiều bản dễ lệch nhau, còn API key trong code sẽ bị lộ. stdio trên laptop một người thì người khác không dùng được. Đưa dữ liệu hồ sơ vào system prompt vừa lộ dữ liệu vừa không cập nhật được.<br><strong>Xem lại:</strong> Tháng 3 tuần 1–2.'
  },
  {
    scenario: 'P6', domain: 'Claude Code',
    q: 'Tình huống P6: Kỹ sư VietCare muốn mọi thao tác Edit trên file trong thư mục migrations/ đều bị chặn, kèm lý do để Claude đề xuất cách khác. Cách làm chắc chắn nhất?',
    options: [
      'Ghi “không sửa migrations” vào CLAUDE.md',
      'Tạo skill “migrations”',
      'Hook PreToolUse cho Edit|Write kiểm tra đường dẫn, thoát với exit code 2 và in lý do ra stderr',
      'Thêm migrations/ vào .gitignore'
    ],
    answer: 2,
    explain: '<strong>Vì sao đúng:</strong> Hook PreToolUse chạy trước mỗi lần sửa file. Exit code 2 chặn tool và gửi stderr cho Claude, nên Claude biết lý do và điều chỉnh. (Một deny rule trên Edit cho đường dẫn đó cũng chặn được, còn hook cho phép kèm theo thông điệp tuỳ biến.)<br><strong>Vì sao các lựa chọn khác sai:</strong> CLAUDE.md và skill là chỉ dẫn cho model, không đảm bảo. .gitignore thuộc về git, không chặn được việc sửa file, và còn làm migrations không được commit.<br><strong>Xem lại:</strong> Tháng 4 tuần 2–3.'
  },
  {
    scenario: 'P6', domain: 'Claude Code',
    q: 'Tình huống P6: Trưởng nhóm muốn mọi kỹ sư có cùng lệnh test và rule cho phép "Bash(npm run test:*)", nhưng mỗi người vẫn giữ được ghi chú riêng. Cách bố trí file?',
    options: [
      'Tất cả vào ~/.claude/settings.json của từng người',
      'CLAUDE.md và .claude/settings.json commit vào repo; ghi chú riêng trong CLAUDE.local.md',
      'Chỉ dùng CLAUDE.local.md',
      'Gửi file cấu hình qua email'
    ],
    answer: 1,
    explain: '<strong>Vì sao đúng:</strong> File ở cấp project được commit nên cả team dùng chung, còn CLAUDE.local.md dành cho ghi chú cá nhân không commit.<br><strong>Vì sao các lựa chọn khác sai:</strong> Cấu hình user của từng người sẽ lệch nhau và không review được. Chỉ dùng CLAUDE.local.md thì không chia sẻ được gì. Email không phải cơ chế cấu hình.<br><strong>Xem lại:</strong> Tháng 4 tuần 1–2.'
  },
  {
    scenario: 'P6', domain: 'Agentic Architecture',
    q: 'Tình huống P6: VietCare muốn tự động xét duyệt các hồ sơ bồi thường nhỏ. Quyết định chi tiền không đảo ngược được, và sai sót gây thiệt hại tài chính. Thiết kế phù hợp?',
    options: [
      'Agent tự động chi tiền cho mọi hồ sơ để tiết kiệm nhân lực',
      'Không dùng AI',
      'Agent chạy với effort max và tự quyết',
      'Agent phân tích và đề xuất kèm lý do; nhân viên duyệt trước khi chi tiền; log đầy đủ để kiểm toán'
    ],
    answer: 3,
    explain: '<strong>Vì sao đúng:</strong> Cost of error cao và hành động không đảo ngược được, nên cần con người duyệt. Agent vẫn tạo giá trị bằng cách chuẩn bị phân tích và đề xuất.<br><strong>Vì sao các lựa chọn khác sai:</strong> Tự động chi tiền bỏ qua cổng phê duyệt. Không dùng AI thì bỏ lỡ lợi ích trong khi rủi ro vẫn kiểm soát được. Effort cao làm tăng chất lượng nhưng không thay thế được bước phê duyệt.<br><strong>Xem lại:</strong> Tháng 5 tuần 2 và tuần 4.'
  },
  {
    scenario: 'P6', domain: 'Agentic Architecture',
    q: 'Tình huống P6: Mỗi đêm cần tóm tắt khoảng 15.000 hội thoại hỗ trợ trong ngày để làm báo cáo chất lượng, kết quả cần trước 9h sáng. Cách tiết kiệm chi phí nhất mà vẫn đạt yêu cầu?',
    options: [
      'Gọi lần lượt từng request với fast mode',
      'Message Batches API với structured output cho phần tóm tắt',
      'Multi-agent cho mỗi hội thoại',
      'Một request chứa cả 15.000 hội thoại'
    ],
    answer: 1,
    explain: '<strong>Vì sao đúng:</strong> Việc không cần realtime và có hạn chót tới sáng hôm sau rất hợp với Batch API (giảm khoảng 50%). Structured output giúp gộp báo cáo dễ dàng.<br><strong>Vì sao các lựa chọn khác sai:</strong> Fast mode đắt hơn. Multi-agent quá tay cho việc tóm tắt từng hội thoại độc lập. Gộp 15.000 hội thoại vào một request thì vượt context và rất dễ bỏ sót.<br><strong>Xem lại:</strong> Tháng 5 tuần 4.'
  },
  {
    scenario: 'P6', domain: 'Context Management',
    q: 'Tình huống P6: Agent điều tra sự cố của kỹ sư chạy hàng giờ, gọi hàng trăm lệnh đọc log trả kết quả lớn. Context đầy dần dù các log cũ không còn cần. Kỹ thuật phù hợp nhất?',
    options: [
      'Tăng max_tokens',
      'Prompt caching',
      'Context editing để xoá kết quả tool cũ, kết hợp giao việc đọc log cho subagent chỉ trả kết luận',
      'Dùng model có context nhỏ hơn'
    ],
    answer: 2,
    explain: '<strong>Vì sao đúng:</strong> Context editing xoá kết quả tool cũ không còn cần. Subagent đọc log trong context riêng và chỉ trả kết luận, nên context chính luôn gọn.<br><strong>Vì sao các lựa chọn khác sai:</strong> max_tokens chỉ giới hạn output. Prompt caching giảm chi phí đọc tiền tố nhưng không làm context nhỏ đi. Model có context nhỏ hơn còn đầy nhanh hơn.<br><strong>Xem lại:</strong> Tháng 5 tuần 1 và Tháng 4 tuần 4.'
  },
  {
    scenario: 'P6', domain: 'Prompt Engineering',
    q: 'Tình huống P6: Trước khi chuyển trợ lý hỗ trợ sang effort thấp hơn để giảm chi phí, trưởng nhóm muốn chắc chất lượng không giảm. Cách làm đúng?',
    options: [
      'Xây bộ eval 50 hội thoại thật có tiêu chí chấm (đúng quy định, đúng định dạng SMS), chạy cả hai cấu hình và so sánh điểm cùng chi phí trên mỗi hội thoại',
      'Hỏi 3 nhân viên thấy thế nào sau một ngày dùng',
      'Tin vào bảng giá',
      'Thử trên 2 câu hỏi'
    ],
    answer: 0,
    explain: '<strong>Vì sao đúng:</strong> Quyết định chất lượng phải dựa trên eval: tập test đại diện, tiêu chí rõ ràng, so sánh cùng điều kiện, đo cả chi phí trên mỗi hội thoại hoàn thành.<br><strong>Vì sao các lựa chọn khác sai:</strong> Hỏi cảm nhận của vài người là cảm tính và mẫu nhỏ. Bảng giá chỉ cho biết chi phí, không cho biết chất lượng. 2 câu hỏi quá ít vì output có tính ngẫu nhiên.<br><strong>Xem lại:</strong> Tháng 1 tuần 4 và Tháng 5 tuần 4.'
  }
);

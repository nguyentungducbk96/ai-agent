/* Câu hỏi thi thử bổ sung – Tháng 3: Tool Design & MCP (tự biên soạn, không phải đề chính thức). */
window.EXAM_BANK = window.EXAM_BANK || [];
window.EXAM_BANK.push(
  {
    scenario: 'P3', domain: 'Tool Design & MCP',
    q: 'Tình huống P3: Công ty SaaS muốn khách hàng doanh nghiệp dùng dữ liệu sản phẩm của họ trong Claude Code, Claude Desktop và các agent tự viết. Mỗi khách có tài khoản riêng. Cách cung cấp phù hợp nhất?',
    options: [
      'Gửi cho khách file Python để tự thêm tool vào từng ứng dụng',
      'Một MCP server từ xa qua Streamable HTTP, xác thực OAuth theo tài khoản từng khách',
      'Một MCP server stdio mỗi khách tự chạy với khoá admin chung',
      'Đưa toàn bộ dữ liệu vào system prompt'
    ],
    answer: 1,
    explain: '<strong>Vì sao đúng:</strong> nhiều host khác nhau cùng dùng được một server MCP; chạy từ xa với OAuth giúp mỗi khách chỉ thấy dữ liệu của mình và không phải giữ secret dùng chung.<br><strong>Vì sao các lựa chọn khác sai:</strong> file Python phải tích hợp lại cho từng ứng dụng; khoá admin chung phát cho khách là thảm hoạ bảo mật; nhồi dữ liệu vào system prompt không mở rộng được và không phân quyền.'
  },
  {
    scenario: 'P3', domain: 'Tool Design & MCP',
    q: 'Tình huống P3: Ứng dụng backend của công ty (chạy trên cloud) cần Claude dùng tool của MCP server SaaS ở trên với ít code nhất. Server có URL HTTPS công khai. Cách phù hợp?',
    options: [
      'Tự viết MCP client, chuyển tool sang tool use thủ công',
      'Dùng Claude Code headless',
      'MCP connector của Messages API: mcp_servers + mcp_toolset với beta mcp-client-2025-11-20',
      'Batch API'
    ],
    answer: 2,
    explain: '<strong>Vì sao đúng:</strong> server công khai qua HTTPS nên MCP connector cho phép API tự kết nối và gọi tool, không cần viết client hay vòng lặp tool use.<br><strong>Vì sao các lựa chọn khác sai:</strong> tự viết client làm được nhưng nhiều code hơn – chỉ cần khi server nằm trong mạng nội bộ; Claude Code headless là agent lập trình, không phải cách gọi tool từ backend; Batch API là chế độ xử lý bất đồng bộ, không liên quan kết nối MCP.'
  },
  {
    scenario: 'P3', domain: 'Tool Design & MCP',
    q: 'Tình huống P3: Server có tool get_account trả về toàn bộ object tài khoản khoảng 8.000 token (lịch sử, cấu hình, log). Agent thường chỉ cần tên gói và ngày hết hạn. Cải tiến nào tốt nhất?',
    options: [
      'Tăng context window',
      'Thêm tham số chọn trường hoặc tool riêng trả bản tóm tắt ngắn, mặc định chỉ trả trường thường dùng',
      'Nén kết quả bằng gzip rồi base64',
      'Dùng model có context lớn hơn'
    ],
    answer: 1,
    explain: '<strong>Vì sao đúng:</strong> kết quả tool đi thẳng vào context; trả đúng trường cần thiết giảm token, chi phí và nhiễu.<br><strong>Vì sao các lựa chọn khác sai:</strong> context window không phải thứ tuỳ chỉnh để giải quyết thiết kế kém; nén base64 làm model không đọc được và còn dài hơn; đổi model không làm kết quả gọn đi.'
  },
  {
    scenario: 'P3', domain: 'Tool Design & MCP',
    q: 'Tình huống P3: Trong log, agent gọi tool create_ticket với priority="rất gấp" trong khi hệ thống chỉ nhận low/medium/high, gây lỗi 500. Cách sửa đúng ở tầng thiết kế tool?',
    options: [
      'Thêm câu “viết đúng priority” vào system prompt',
      'Khai báo priority với enum [low, medium, high] trong schema, bật strict và trả lỗi có hướng dẫn khi sai',
      'Tự động đổi mọi giá trị lạ thành high',
      'Bỏ tham số priority'
    ],
    answer: 1,
    explain: '<strong>Vì sao đúng:</strong> enum + strict đảm bảo input khớp schema; lỗi có hướng dẫn giúp model tự sửa nếu vẫn sai.<br><strong>Vì sao các lựa chọn khác sai:</strong> chỉ dẫn trong prompt không bảo đảm; đổi ngầm thành high tạo dữ liệu sai âm thầm; bỏ tham số làm mất thông tin nghiệp vụ.'
  },
  {
    scenario: 'P3', domain: 'Tool Design & MCP',
    q: 'Tình huống P3: Team 8 dev dùng chung server MCP nội bộ trong Claude Code, token cá nhân mỗi người khác nhau. Cấu hình nào đúng?',
    options: [
      'Mỗi người tự thêm ở scope local, không chia sẻ gì',
      '.mcp.json commit trong repo, header "Authorization: Bearer ${INTERNAL_MCP_TOKEN}", mỗi dev tự đặt biến môi trường',
      '.mcp.json chứa token của trưởng nhóm',
      'Đặt token trong CLAUDE.md'
    ],
    answer: 1,
    explain: '<strong>Vì sao đúng:</strong> project scope chia sẻ cấu hình qua git, mở rộng biến môi trường giữ token riêng cho từng người.<br><strong>Vì sao các lựa chọn khác sai:</strong> scope local chạy được nhưng mỗi người tự cấu hình, dễ lệch nhau; token của một người trong repo làm lộ secret và sai danh tính; CLAUDE.md được đưa vào context và commit, không phải chỗ để secret.'
  },
  {
    scenario: 'P3', domain: 'Tool Design & MCP',
    q: 'Tình huống P3: Agent hỗ trợ đọc ticket do khách gửi (dữ liệu không tin cậy), có tool đọc thông tin thanh toán của khách và tool gửi email ra ngoài. Biện pháp quan trọng nhất cần thêm?',
    options: [
      'Tăng effort để model cẩn thận hơn',
      'Yêu cầu người duyệt trước khi gửi email ra ngoài, giới hạn người nhận, và nêu rõ nội dung ticket là dữ liệu',
      'Dùng model rẻ hơn',
      'Bật prompt caching'
    ],
    answer: 1,
    explain: '<strong>Vì sao đúng:</strong> có đủ ba yếu tố gây rò rỉ (dữ liệu riêng tư, nội dung không tin cậy, kênh gửi ra ngoài); chặn kênh gửi bằng phê duyệt và allowlist là lớp bảo vệ quyết định, kèm tách dữ liệu và chỉ dẫn.<br><strong>Vì sao các lựa chọn khác sai:</strong> effort cao không phòng được injection; model rẻ hơn không liên quan; caching chỉ ảnh hưởng chi phí.'
  },
  {
    scenario: 'P3', domain: 'Tool Design & MCP',
    q: 'Tình huống P3: Dev viết MCP server stdio bằng Python, chạy tay thì không lỗi nhưng Claude Code báo “Failed to connect”. Trong mã có nhiều lệnh print("debug …"). Nguyên nhân khả dĩ nhất?',
    options: [
      'Claude Code không hỗ trợ Python',
      'print ghi ra stdout – kênh dành cho JSON-RPC – làm hỏng giao thức; cần log ra stderr',
      'Thiếu API key Anthropic',
      'Server phải dùng HTTP'
    ],
    answer: 1,
    explain: '<strong>Vì sao đúng:</strong> với stdio, mọi thứ trên stdout được hiểu là thông điệp JSON-RPC; dòng debug khiến client không phân tích được.<br><strong>Vì sao các lựa chọn khác sai:</strong> Python được hỗ trợ đầy đủ qua SDK chính thức; server MCP không cần API key Anthropic; stdio là transport hợp lệ cho server local.'
  },
  {
    scenario: 'P3', domain: 'Tool Design & MCP',
    q: 'Tình huống P3: Muốn hiển thị “Checklist release của công ty” như một mẫu mà dev chủ động chọn dùng trong Claude Code, và “Danh sách service + chủ sở hữu” như dữ liệu tham khảo. Nên cung cấp mỗi thứ dưới dạng primitive MCP nào?',
    options: [
      'Cả hai là tool',
      'Checklist là resource, danh sách service là prompt',
      'Checklist là prompt, danh sách service là resource',
      'Cả hai là prompt'
    ],
    answer: 2,
    explain: '<strong>Vì sao đúng:</strong> prompt là mẫu dựng sẵn người dùng kích hoạt; resource là dữ liệu có địa chỉ để đọc vào context.<br><strong>Vì sao các lựa chọn khác sai:</strong> tool dành cho hành động do model gọi; đảo ngược hai loại khiến người dùng không gọi được checklist như mẫu và dữ liệu tham khảo không có URI để đọc; hai prompt thì danh sách service không được đọc như dữ liệu.'
  }
);

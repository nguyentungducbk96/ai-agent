/* Câu hỏi thi thử bổ sung – Tháng 5 (Agentic Architecture, Context Management). Tự biên soạn, không phải đề chính thức. */
window.EXAM_BANK = window.EXAM_BANK || [];
window.EXAM_BANK.push(
  {
    scenario: 'P5', domain: 'Agentic Architecture',
    q: 'Một startup muốn tự động tạo release note từ danh sách commit mỗi tuần. Các bước luôn giống nhau: đọc commit → nhóm theo loại → viết tóm tắt. Kiến trúc phù hợp nhất?',
    options: [
      'Multi-agent với orchestrator và 3 worker',
      'Agent tự do có quyền chạy Bash trên repo',
      'Workflow prompt chaining (hoặc một lần gọi) do code điều khiển',
      'Managed Agents với outcomes'
    ],
    answer: 2,
    explain: '<strong>Vì sao đúng:</strong> các bước biết trước và cố định nên code điều khiển luồng là đủ, rẻ và dễ kiểm soát.<br><strong>Vì sao các lựa chọn khác sai:</strong> multi-agent và agent tự do thêm chi phí, độ phức tạp và rủi ro không cần thiết; Managed Agents là hạ tầng để chạy agent, không giải quyết việc chọn sai tầng kiến trúc.'
  },
  {
    scenario: 'P5', domain: 'Agentic Architecture',
    q: 'Agent hỗ trợ khách hàng được phép tự hoàn tiền dưới 500.000đ. Ban quản lý lo ngại rủi ro. Thiết kế nào cân bằng tốt nhất giữa tự động hoá và an toàn?',
    options: [
      'Agent chỉ soạn đề xuất hoàn tiền; hoàn tiền thực hiện sau khi nhân viên duyệt, kèm log và giới hạn số tiền ở tầng tool',
      'Cho agent toàn quyền vì số tiền nhỏ',
      'Không dùng agent, làm thủ công hoàn toàn',
      'Dùng model mạnh nhất để không bao giờ sai'
    ],
    answer: 0,
    explain: '<strong>Vì sao đúng:</strong> hoàn tiền không đảo ngược được; để agent đề xuất và con người duyệt vẫn tự động phần lớn công việc mà kiểm soát được rủi ro. Giới hạn ở tầng tool là lớp bảo vệ không phụ thuộc prompt.<br><strong>Vì sao các lựa chọn khác sai:</strong> toàn quyền bỏ qua “chi phí sai” và có thể bị lợi dụng qua prompt injection; thủ công hoàn toàn bỏ lỡ lợi ích; không model nào đảm bảo không bao giờ sai.'
  },
  {
    scenario: 'P5', domain: 'Agentic Architecture',
    q: 'Team cần agent chạy mỗi 2 giờ để kiểm tra lỗi trong log và mở ticket; họ không muốn quản lý server, container hay cron. Lựa chọn phù hợp?',
    options: [
      'Vòng lặp thủ công chạy trên laptop của một kỹ sư',
      'Claude Code ở chế độ tương tác',
      'Tool Runner trong một script tự host',
      'Managed Agents với scheduled deployment'
    ],
    answer: 3,
    explain: '<strong>Vì sao đúng:</strong> Managed Agents cung cấp cả vòng lặp agent lẫn hạ tầng, và deployment theo lịch tự tạo session mỗi lần chạy.<br><strong>Vì sao các lựa chọn khác sai:</strong> laptop không phải hạ tầng tin cậy; Claude Code tương tác cần người ngồi trước màn hình; Tool Runner vẫn cần bạn tự host và tự lập lịch.'
  },
  {
    scenario: 'P5', domain: 'Agentic Architecture',
    q: 'Agent nghiên cứu dùng một orchestrator và 6 worker. Kết quả các worker thường trùng nhau và định dạng khác nhau. Nguyên nhân gốc có khả năng nhất?',
    options: [
      'Worker dùng model quá yếu',
      'Delegation brief thiếu phạm vi (điều không làm) và định dạng kết quả cố định',
      'Thiếu prompt caching',
      'max_tokens quá thấp'
    ],
    answer: 1,
    explain: '<strong>Vì sao đúng:</strong> worker chỉ biết những gì brief nói; không khoanh phạm vi thì trùng việc, không có schema thì mỗi worker trả một kiểu.<br><strong>Vì sao các lựa chọn khác sai:</strong> model mạnh hơn vẫn trùng việc nếu brief mơ hồ; caching và max_tokens không liên quan tới phạm vi hay định dạng.'
  },
  {
    scenario: 'P5', domain: 'Agentic Architecture',
    q: 'Hai cấu hình agent: X tốn 0,05 USD/lần, thành công 98%; Y tốn 0,03 USD/lần, thành công 55%, mỗi lần thất bại cần nhân viên kiểm tra (0,20 USD). Nên chọn?',
    options: [
      'Y vì giá mỗi lần chạy thấp hơn',
      'Không so sánh được',
      'X vì chi phí trên mỗi nhiệm vụ hoàn thành (kể cả chi phí kiểm tra thất bại) thấp hơn',
      'Chạy cả hai rồi lấy kết quả nhanh hơn'
    ],
    answer: 2,
    explain: '<strong>Vì sao đúng:</strong> X ≈ 0,05/0,98 + 0,20 × 0,02 ≈ 0,055 USD; Y ≈ 0,03/0,55 + 0,20 × 0,82 ≈ 0,22 USD mỗi nhiệm vụ hoàn thành.<br><strong>Vì sao các lựa chọn khác sai:</strong> so sánh giá mỗi request là sai thước đo; hoàn toàn so sánh được bằng chi phí kỳ vọng; chạy cả hai làm tăng gấp đôi chi phí.'
  },
  {
    scenario: 'P5', domain: 'Agentic Architecture',
    q: 'Agent sửa lỗi code cần được đánh giá trước khi triển khai cho cả công ty. Cách đánh giá đáng tin nhất?',
    options: [
      'Xem 2–3 lần chạy mẫu thấy tốt là được',
      'Bộ test case với bug thật, chấm theo kết quả cuối (test pass), chạy nhiều lần mỗi case, đo cả token và thời gian',
      'So sánh từng bước với lời giải mẫu của kỹ sư',
      'Hỏi agent tự đánh giá mình'
    ],
    answer: 1,
    explain: '<strong>Vì sao đúng:</strong> kết quả cuối phản ánh giá trị thật; chạy nhiều lần đo được độ ổn định; đo chi phí giúp ra quyết định.<br><strong>Vì sao các lựa chọn khác sai:</strong> vài lần chạy mẫu không đại diện; chấm từng bước phạt cách làm đúng nhưng khác; agent tự đánh giá thiếu khách quan.'
  },
  {
    scenario: 'P5', domain: 'Agentic Architecture',
    q: 'Agent gọi API bên thứ ba hay bị lỗi 503 tạm thời, khiến model gọi lại cùng tool nhiều lần và tốn lượt. Cải tiến tốt nhất?',
    options: [
      'Tăng max_turns lên 100',
      'Đổi sang model mạnh hơn',
      'Tắt tool đó',
      'Retry có backoff ở tầng tool; hết lượt thì trả tool_result is_error có hướng dẫn'
    ],
    answer: 3,
    explain: '<strong>Vì sao đúng:</strong> lỗi tạm thời nên được xử lý bằng code ở tầng tool – rẻ hơn và ổn định hơn để model tự thử lại; thông báo rõ khi hết lượt giúp model báo người dùng.<br><strong>Vì sao các lựa chọn khác sai:</strong> tăng max_turns chỉ cho phép lãng phí nhiều hơn; model mạnh hơn không sửa được lỗi API; tắt tool làm mất chức năng.'
  },
  {
    scenario: 'P5', domain: 'Agentic Architecture',
    q: 'Agent đa bước thỉnh thoảng bị cắt giữa chừng khi làm nhiệm vụ lớn và để lại công việc dở dang. Muốn model tự điều tiết để kết thúc gọn trong ngân sách token. Dùng gì?',
    options: [
      'Task budget (beta) trong output_config',
      'Giảm max_tokens',
      'Prompt caching',
      'Batch API'
    ],
    answer: 0,
    explain: '<strong>Vì sao đúng:</strong> task budget cho model biết ngân sách token của cả vòng lặp để tự phân bổ và kết thúc gọn.<br><strong>Vì sao các lựa chọn khác sai:</strong> max_tokens là trần cứng model không biết, giảm nó làm cắt sớm hơn; caching giảm chi phí chứ không điều tiết công việc; Batch API là xử lý bất đồng bộ.'
  },
  {
    scenario: 'P5', domain: 'Context Management',
    q: 'Agent phân tích dữ liệu gọi tool truy vấn 60 lần, mỗi kết quả 8.000 token; sau khi rút kết luận, các kết quả cũ không còn cần. Context tăng nhanh. Kỹ thuật phù hợp nhất?',
    options: [
      'Memory tool',
      'Tăng context window',
      'Context editing với clear_tool_uses_20250919',
      'Prompt caching với TTL 1 giờ'
    ],
    answer: 2,
    explain: '<strong>Vì sao đúng:</strong> context editing xoá kết quả tool cũ đã hết giá trị, giữ lịch sử gọn mà không cần tóm tắt.<br><strong>Vì sao các lựa chọn khác sai:</strong> memory để nhớ qua phiên; không thể tuỳ ý tăng context window; caching giảm chi phí đọc lại nhưng không làm context nhỏ đi.'
  },
  {
    scenario: 'P5', domain: 'Context Management',
    q: 'Đã bật compaction nhưng sau vài lượt, Claude “quên” toàn bộ phần đầu hội thoại. Code nối lịch sử bằng messages.append({"role": "assistant", "content": response.content[0].text}). Nguyên nhân?',
    options: [
      'Compaction không hoạt động với tiếng Việt',
      'Chỉ nối text nên compaction block bị mất; phải nối nguyên response.content',
      'Thiếu cache_control',
      'Model quá nhỏ'
    ],
    answer: 1,
    explain: '<strong>Vì sao đúng:</strong> compaction block thay thế phần lịch sử đã tóm tắt; bỏ nó đi thì cả phần tóm tắt lẫn lịch sử gốc đều mất.<br><strong>Vì sao các lựa chọn khác sai:</strong> compaction không phụ thuộc ngôn ngữ; cache_control không liên quan tới việc giữ nội dung; kích thước model không phải nguyên nhân.'
  },
  {
    scenario: 'P5', domain: 'Context Management',
    q: 'Trợ lý học tập cần nhớ tiến độ và điểm yếu của từng học viên qua nhiều tuần. Thiết kế phù hợp?',
    options: [
      'Memory tool với backend lưu trữ riêng cho từng học viên, giới hạn đường dẫn',
      'Compaction',
      'Prompt caching TTL 1 giờ',
      'Đưa toàn bộ lịch sử các buổi học vào mỗi request'
    ],
    answer: 0,
    explain: '<strong>Vì sao đúng:</strong> memory tool lưu thông tin ngoài phiên, bạn kiểm soát nơi lưu và phân tách dữ liệu từng người.<br><strong>Vì sao các lựa chọn khác sai:</strong> compaction chỉ trong một phiên; cache TTL ngắn và không phải bộ nhớ; gửi toàn bộ lịch sử nhiều tuần tốn kém và sẽ vượt context.'
  },
  {
    scenario: 'P5', domain: 'Context Management',
    q: 'Agent dùng một model mạnh cho vòng lặp chính. Nhóm muốn các tác vụ đọc/tóm tắt file chạy bằng model rẻ hơn mà không làm mất cache của vòng lặp chính. Cách làm?',
    options: [
      'Đổi model của vòng lặp chính sang model rẻ hơn ở các lượt đọc file',
      'Giao tác vụ đọc/tóm tắt cho subagent dùng model rẻ hơn; vòng lặp chính giữ nguyên một model',
      'Tắt caching',
      'Xoá system prompt ở các lượt đọc file'
    ],
    answer: 1,
    explain: '<strong>Vì sao đúng:</strong> cache gắn với model; tách model rẻ ra subagent giữ prefix của vòng chính không đổi, đồng thời cô lập context đọc file.<br><strong>Vì sao các lựa chọn khác sai:</strong> đổi model giữa phiên làm mất cache; tắt caching tăng chi phí; sửa system prompt làm mất cache toàn bộ.'
  }
);

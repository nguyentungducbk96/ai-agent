/* Câu hỏi thi thử bổ sung – chủ đề sử dụng Claude API (tháng 2). Tự biên soạn, không phải đề chính thức. */
window.EXAM_BANK = window.EXAM_BANK || [];
window.EXAM_BANK.push(
  {
    scenario: 'P2', domain: 'Agentic Architecture',
    q: 'Tình huống P2: Một startup chạy tác vụ tóm tắt 300.000 bài đánh giá sản phẩm mỗi tuần, kết quả dùng cho báo cáo sáng thứ Hai. Hiện họ gọi messages.create song song và thường xuyên gặp lỗi 429, chi phí cao. Thay đổi nào phù hợp nhất?',
    options: [
      'Tăng số luồng song song để xong nhanh hơn',
      'Tắt retry của SDK để tránh gọi lặp',
      'Chuyển sang Message Batches API, ghép kết quả theo custom_id',
      'Đổi sang streaming cho mọi request'
    ],
    answer: 2,
    explain: '<strong>Vì sao đúng:</strong> công việc không cần realtime, khối lượng lớn: batch giảm 50% chi phí, xử lý bất đồng bộ (thường dưới 1 giờ, tối đa 24 giờ) và tránh việc tự bắn song song gây 429.<br><strong>Vì sao các lựa chọn khác sai:</strong> tăng luồng song song làm 429 nặng hơn; tắt retry khiến lỗi tạm thời thành lỗi hẳn; streaming cải thiện độ trễ cảm nhận, không giảm chi phí hay rate limit.'
  },
  {
    scenario: 'P2', domain: 'Agentic Architecture',
    q: 'Tình huống P2: Sau khi chạy batch, đội dữ liệu ghép kết quả theo thứ tự vòng lặp duyệt kết quả và phát hiện nhiều bản tóm tắt gắn nhầm sản phẩm. Nguyên nhân và cách sửa?',
    options: [
      'Kết quả batch trả về theo thứ tự bất kỳ – phải ghép theo custom_id',
      'Model bị lỗi – đổi model',
      'Batch chưa xong – chờ thêm',
      'Cần bật prompt caching'
    ],
    answer: 0,
    explain: '<strong>Vì sao đúng:</strong> Batches API không đảm bảo thứ tự; <code>custom_id</code> là khoá duy nhất để ghép kết quả với dữ liệu gốc.<br><strong>Vì sao các lựa chọn khác sai:</strong> nội dung tóm tắt đúng, chỉ gắn nhầm chỗ nên không phải lỗi model; batch đã <code>ended</code> thì chờ thêm không thay đổi thứ tự; caching không liên quan việc ghép kết quả.'
  },
  {
    scenario: 'P2', domain: 'Prompt Engineering',
    q: 'Tình huống P2: Service lưu kết quả phân loại vào database, cần JSON có đúng các trường category (một trong 4 giá trị) và confidence (số). Thỉnh thoảng model trả thêm lời dẫn trước JSON khiến parser lỗi. Model dùng là Claude đời mới. Giải pháp tốt nhất?',
    options: [
      'Thêm "Chỉ trả JSON, không nói gì thêm" bằng chữ hoa',
      'Prefill dấu { ở lượt assistant',
      'Tách JSON bằng regex rồi retry khi lỗi',
      'Dùng output_config.format với json_schema có enum và additionalProperties: false'
    ],
    answer: 3,
    explain: '<strong>Vì sao đúng:</strong> structured outputs ràng buộc output là JSON hợp lệ theo schema, gồm enum cho category.<br><strong>Vì sao các lựa chọn khác sai:</strong> chỉ dẫn viết hoa không đảm bảo tuyệt đối; prefill trả lỗi 400 trên các model đời mới; regex + retry là giải pháp chắp vá, tốn thêm request.'
  },
  {
    scenario: 'P2', domain: 'Tool Design & MCP',
    q: 'Tình huống P2: Agent đặt lịch gọi tool create_event, nhưng đôi khi tham số date sai định dạng hoặc thiếu trường bắt buộc, khiến API lịch trả lỗi. Cách đảm bảo tham số tool luôn khớp schema?',
    options: [
      'Đặt "strict": true trên định nghĩa tool, schema có required và additionalProperties: false',
      'Đặt tool_choice: strict',
      'Thêm ví dụ vào system prompt là đủ',
      'Chuyển tham số sang một trường chuỗi tự do'
    ],
    answer: 0,
    explain: '<strong>Vì sao đúng:</strong> strict tool use bảo đảm <code>tool_use.input</code> khớp chính xác input_schema.<br><strong>Vì sao các lựa chọn khác sai:</strong> tool_choice không có chế độ strict; ví dụ trong prompt giúp nhưng không bảo đảm; chuỗi tự do làm mất hẳn khả năng kiểm tra kiểu.'
  },
  {
    scenario: 'P2', domain: 'Tool Design & MCP',
    q: 'Tình huống P2: Trong vòng lặp tool use, Claude trả về 3 khối tool_use. Dev gửi 3 lượt user riêng, mỗi lượt một tool_result. Theo thời gian, Claude hầu như không còn gọi tool song song. Cách sửa?',
    options: [
      'Đặt disable_parallel_tool_use: false',
      'Gửi cả 3 tool_result trong một lượt user duy nhất, mỗi kết quả có tool_use_id tương ứng',
      'Đổi sang model lớn hơn',
      'Gộp 3 tool thành một tool'
    ],
    answer: 1,
    explain: '<strong>Vì sao đúng:</strong> mọi kết quả của một lượt assistant phải nằm chung một lượt user; tách ra khiến model dần ngừng gọi song song.<br><strong>Vì sao các lựa chọn khác sai:</strong> gọi song song vốn đã bật mặc định, vấn đề nằm ở cách trả kết quả; model lớn hơn không sửa được cấu trúc hội thoại sai; gộp tool làm thiết kế tệ đi mà không giải quyết nguyên nhân.'
  },
  {
    scenario: 'P2', domain: 'Agentic Architecture',
    q: 'Tình huống P2: Ứng dụng log thấy nhiều lỗi 429 và 529 lúc cao điểm, cùng vài lỗi 400 do tham số sai. Dev định viết vòng retry 10 lần cho mọi lỗi. Nhận xét nào đúng?',
    options: [
      'Retry 10 lần cho mọi lỗi là an toàn nhất',
      'Không retry lỗi nào để tiết kiệm chi phí',
      'SDK đã tự retry lỗi tạm thời (408/409/429/5xx, lỗi kết nối) với backoff; chỉ tăng max_retries nếu cần, còn lỗi 400 phải sửa request',
      'Chuyển mọi request sang streaming để hết 429'
    ],
    answer: 2,
    explain: '<strong>Vì sao đúng:</strong> SDK mặc định retry 2 lần cho lỗi tạm thời, có thể chỉnh <code>max_retries</code>; lỗi 400 là do request sai, retry vô ích.<br><strong>Vì sao các lựa chọn khác sai:</strong> retry lỗi 400 chỉ tốn thêm request và chồng lên retry sẵn có của SDK; không retry khiến lỗi tạm thời thành lỗi cho người dùng; streaming không thay đổi rate limit.'
  },
  {
    scenario: 'P2', domain: 'Prompt Engineering',
    q: 'Tình huống P2: Trợ lý viết báo cáo dài 8.000–15.000 từ hay bị lỗi timeout HTTP và người dùng phải chờ rất lâu mới thấy chữ. Cách xử lý phù hợp?',
    options: [
      'Giảm max_tokens xuống 1.000',
      'Dùng streaming (messages.stream) với max_tokens đủ lớn, lấy message cuối bằng get_final_message()',
      'Chuyển sang Batch API',
      'Tăng timeout lên 24 giờ'
    ],
    answer: 1,
    explain: '<strong>Vì sao đúng:</strong> streaming tránh timeout với output dài và hiển thị chữ ngay khi được sinh; SDK yêu cầu streaming khi max_tokens rất lớn.<br><strong>Vì sao các lựa chọn khác sai:</strong> giảm max_tokens làm báo cáo bị cắt (<code>stop_reason: max_tokens</code>); batch không phù hợp với người dùng đang chờ; tăng timeout không cải thiện trải nghiệm và vẫn phải chờ toàn bộ.'
  },
  {
    scenario: 'P2', domain: 'Agentic Architecture',
    q: 'Tình huống P2: Trước khi đưa tính năng “tóm tắt hợp đồng” lên production, quản lý muốn biết chi phí trung bình mỗi hợp đồng và chặn các file vượt quá giới hạn ngân sách. Cách làm chính xác nhất?',
    options: [
      'Ước lượng số ký tự chia 4',
      'Dùng tiktoken để đếm',
      'Dùng count_tokens với đúng model sẽ dùng để đếm input, kết hợp output ước tính và bảng giá chính thức',
      'Chạy thử một hợp đồng rồi nhân lên'
    ],
    answer: 2,
    explain: '<strong>Vì sao đúng:</strong> count_tokens trả số token input chính xác theo tokenizer của model, dùng được để chặn trước khi gửi và ước tính chi phí.<br><strong>Vì sao các lựa chọn khác sai:</strong> chia 4 và tiktoken sai lệch lớn với Claude (đặc biệt tiếng Việt, văn bản pháp lý); một mẫu duy nhất không đại diện cho độ dài hợp đồng khác nhau và không giúp chặn từng file.'
  }
);

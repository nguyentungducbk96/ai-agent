/* Tháng 6 – Ôn tập, thi thử và thi */
window.LESSONS = window.LESSONS || [];
window.MONTHS = window.MONTHS || [];

window.MONTHS.push({
  month: 6,
  period: '03/2027',
  title: 'Ôn tập, thi thử và thi',
  domain: 'Cả 5 domain',
  goal: 'Đạt ≥ 80% ở ít nhất 2 đề thi thử liên tiếp rồi mới đăng ký thi thật.'
});

window.LESSONS.push(
  {
    id: 'm6w1', month: 6, week: 1, duration: '8 giờ', domain: 'Ôn tập',
    title: 'Ôn tập theo domain và tìm điểm yếu',
    objectives: [
      'Hệ thống lại kiến thức 5 domain trên một trang',
      'Tự đánh giá mức độ nắm vững từng chủ đề',
      'Lập kế hoạch ôn tập tập trung vào điểm yếu'
    ],
    sections: [
      {
        h: '1. Bản đồ kiến thức 5 domain',
        html: `<div class="table-wrap"><table>
<tr><th>Domain</th><th>Chủ đề cốt lõi</th><th>Bài</th></tr>
<tr><td><strong>Prompt Engineering</strong></td><td>Chỉ dẫn rõ ràng, system prompt, few-shot, XML tag, thinking/effort, giảm ảo giác, structured output, eval</td><td>T1, T2</td></tr>
<tr><td><strong>Tool Design &amp; MCP</strong></td><td>Tool use loop, parallel tool, is_error, strict, thiết kế tool, MCP host/client/server, transport, scope, bảo mật</td><td>T2, T3</td></tr>
<tr><td><strong>Claude Code</strong></td><td>CLAUDE.md, settings/permissions, hooks, skills, slash command, subagent, MCP config, headless/CI</td><td>T4</td></tr>
<tr><td><strong>Context Management</strong></td><td>Context window, prompt caching (prefix, breakpoint, invalidation), RAG, compaction, context editing, memory</td><td>T5</td></tr>
<tr><td><strong>Agentic Architecture</strong></td><td>Workflow vs agent, 5 mẫu, multi-agent, 4 cách xây agent, độ tin cậy, eval, tối ưu chi phí</td><td>T5</td></tr>
</table></div>`
      },
      {
        h: '2. Phương pháp ôn',
        html: `<ul>
<li><strong>Tự giải thích</strong> (Feynman): chọn một khái niệm, giải thích thành tiếng như dạy người mới. Chỗ nào ấp úng là chỗ cần ôn.</li>
<li><strong>Làm lại bài tập</strong> không nhìn lời giải, đặc biệt: vòng lặp tool use, MCP server, hook, prompt caching.</li>
<li><strong>Quiz từng bài</strong> trên trang này – làm lại tới khi đúng 100%.</li>
<li><strong>Thẻ ghi nhớ</strong> cho các chi tiết dễ nhầm: <code>output_config.format</code>, <code>strict</code>, <code>is_error</code>, thứ tự cache <code>tools → system → messages</code>, deny thắng allow, exit code 2.</li>
</ul>`
      }
    ],
    code: [],
    exercises: [
      {
        title: 'Bài 1 – Tự chấm mức độ nắm vững',
        task: `<p>Với mỗi chủ đề trong bảng, tự chấm 1–5 (1 = chưa hiểu, 5 = dạy lại được). Chủ đề ≤ 3 điểm: làm lại bài tập và quiz tương ứng trong tuần này.</p>`,
        hint: 'Trung thực với bản thân – mục tiêu là tìm điểm yếu trước kỳ thi, không phải điểm cao.',
        solution: `<p>Lập bảng ôn: chủ đề · điểm tự chấm · bài cần làm lại · ngày hoàn thành. Ưu tiên Agentic Architecture vì đây là domain nặng nhất.</p>`
      },
      {
        title: 'Bài 2 – Dự án tổng hợp',
        task: `<p>Kết hợp mọi thứ: agent (Agent SDK hoặc vòng lặp thủ công) dùng MCP GitHub để phân loại issue, có prompt caching cho system prompt, structured output cho kết quả phân loại, giới hạn vòng lặp, phê duyệt trước khi ghi, và eval 10 test case.</p>`,
        hint: 'Đây là “đồ án tốt nghiệp” – viết README mô tả quyết định kiến trúc và lý do.',
        solution: `<p>README nên trả lời các câu kiểu đề thi: vì sao chọn cách xây agent này, vì sao model/effort này, cách xử lý lỗi, cách bảo vệ token, chi phí ước tính mỗi issue. Viết được là bạn đã sẵn sàng cho các câu hỏi tình huống.</p>`
      }
    ],
    quiz: [
      {
        q: 'Domain nào được nhận định là chiếm tỉ trọng lớn nhất trong CCAR-F?',
        options: ['Claude Code', 'Agentic Architecture', 'Prompt Engineering', 'Context Management'],
        answer: 1,
        explain: 'Theo các nguồn ôn thi, đề nghiêng nhiều về Agentic Architecture. Kiểm tra exam guide chính thức để biết tỉ trọng chính xác.'
      }
    ],
    resources: [
      { t: 'Claude Certification Guide (không chính thức)', url: 'https://claudecertificationguide.com' }
    ]
  },

  {
    id: 'm6w2', month: 6, week: 2, duration: '8 giờ', domain: 'Kỹ năng làm bài',
    title: 'Chiến lược làm đề thi tình huống',
    objectives: [
      'Hiểu cấu trúc đề: 60 câu, 4 tình huống, 120 phút',
      'Áp dụng quy trình đọc – loại trừ – chọn đáp án',
      'Phân tích câu sai để rút kinh nghiệm'
    ],
    sections: [
      {
        h: '1. Cấu trúc đề CCAR-F',
        html: `<ul>
<li>60 câu theo tình huống; mỗi lần thi gặp 4 tình huống lấy từ ngân hàng 6 tình huống.</li>
<li>120 phút → khoảng 2 phút/câu.</li>
<li>Điểm đạt 720/1000 (thang quy đổi).</li>
<li>Có cả câu chọn một và chọn nhiều đáp án – đọc kỹ yêu cầu.</li>
</ul>`
      },
      {
        h: '2. Quy trình trả lời câu tình huống',
        html: `<ol>
<li><strong>Đọc bối cảnh</strong>: gạch chân ràng buộc – chi phí, độ trễ, bảo mật, quy mô, ai là người dùng.</li>
<li><strong>Đọc câu hỏi</strong>: hỏi “tốt nhất”, “đầu tiên”, hay “không nên”?</li>
<li><strong>Loại trừ</strong> đáp án vi phạm nguyên tắc: phức tạp hơn cần thiết, quyền quá rộng, lộ secret, không đo lường.</li>
<li><strong>Chọn</strong> đáp án đơn giản nhất đáp ứng đủ ràng buộc.</li>
<li>Câu khó: đánh dấu, làm tiếp, quay lại sau.</li>
</ol>
<div class="callout tip"><strong>Các “la bàn” khi phân vân:</strong> đơn giản trước phức tạp · đo trước tối ưu · quyền tối thiểu · con người duyệt hành động không đảo ngược được · cache nội dung ổn định · dùng tính năng chính thức thay vì mẹo (structured output thay vì “hãy trả JSON”).</div>`
      },
      {
        h: '3. Phân tích câu sai',
        html: `<p>Sau mỗi đề thi thử, với mỗi câu sai ghi lại: chủ đề · vì sao chọn sai (thiếu kiến thức / đọc nhầm / phân vân 2 đáp án) · kiến thức đúng. Nhóm theo nguyên nhân để biết cần ôn kiến thức hay luyện kỹ năng đọc đề.</p>`
      }
    ],
    code: [],
    exercises: [
      {
        title: 'Bài 1 – Đề thi thử lần 1',
        task: `<p>Làm đề thi thử đầy đủ trên trang <a href="exam.html">Cách thi &amp; thi thử</a> trong điều kiện như thi thật (bấm giờ, không tra tài liệu). Ghi điểm và danh sách câu sai.</p>`,
        hint: 'Chọn chế độ “Đề đầy đủ” để có đồng hồ đếm ngược.',
        solution: `<p>Phân tích từng câu sai theo mẫu ở mục 3. Điểm dưới 70%: quay lại ôn domain yếu trước khi thi thử lần 2.</p>`
      },
      {
        title: 'Bài 2 – Tự viết câu hỏi tình huống',
        task: `<p>Viết 5 câu hỏi tình huống (bối cảnh + 4 đáp án + giải thích) cho domain bạn yếu nhất. Tự viết câu hỏi buộc bạn hiểu vì sao các đáp án sai là sai.</p>`,
        hint: 'Đáp án nhiễu tốt thường “nghe hợp lý” nhưng vi phạm một nguyên tắc (quá phức tạp, sai thứ tự, thiếu bảo mật).',
        solution: `<p>Trao đổi câu hỏi với bạn cùng học (nếu có) để thi chéo.</p>`
      }
    ],
    quiz: [
      {
        q: 'Hai đáp án đều giải quyết được vấn đề; một đáp án dùng multi-agent, một dùng một lần gọi API với structured output. Đề không yêu cầu gì thêm. Nên chọn?',
        options: ['Multi-agent vì mạnh hơn', 'Một lần gọi API – đơn giản nhất đáp ứng yêu cầu', 'Chọn ngẫu nhiên', 'Không chọn cái nào'],
        answer: 1,
        explain: 'Nguyên tắc “start simple” xuất hiện rất nhiều trong đề.'
      }
    ],
    resources: []
  },

  {
    id: 'm6w3', month: 6, week: 3, duration: '6 giờ', domain: 'Đăng ký thi',
    title: 'Điều kiện và quy trình đăng ký thi',
    objectives: [
      'Kiểm tra điều kiện đăng ký (Claude Partner Network)',
      'Nắm quy trình đăng ký qua Partner Academy / Pearson VUE',
      'Hiểu chính sách thi lại và hiệu lực chứng chỉ'
    ],
    sections: [
      {
        h: '1. Điều kiện',
        html: `<ul>
<li>Đăng ký bằng <strong>email công ty</strong> thuộc tên miền của một tổ chức trong <strong>Claude Partner Network</strong>.</li>
<li>Không bắt buộc có chứng chỉ trước; khuyến nghị khoảng 6 tháng thực hành với Claude.</li>
<li>Hỏi bộ phận phụ trách đối tác / đào tạo của công ty xem công ty đã tham gia Partner Network chưa và cách được cấp quyền vào Partner Academy.</li>
</ul>`
      },
      {
        h: '2. Quy trình',
        html: `<ol>
<li>Truy cập <strong>Anthropic Partner Academy</strong> bằng tài khoản công ty; hoàn thành các khoá ôn thi (khuyến khích).</li>
<li>Chọn kỳ thi Claude Certified Architect – Foundations và lên lịch thi qua <strong>Pearson VUE</strong>.</li>
<li>Chuẩn bị giấy tờ tuỳ thân theo yêu cầu của Pearson VUE; nếu thi online, kiểm tra máy tính, webcam, phòng thi trước.</li>
<li>Thi và nhận kết quả; chứng chỉ có hiệu lực 12 tháng.</li>
</ol>`
      },
      {
        h: '3. Thi lại',
        html: `<p>Tối đa 4 lần mỗi kỳ thi trong 12 tháng. Thời gian chờ: 14 ngày sau lần 1, 30 ngày sau lần 2, 90 ngày sau lần 3. Vì vậy nên thi khi đã đạt ổn định ≥ 80% đề thử.</p>
<div class="callout warn">Lệ phí, hình thức (tại trung tâm hay online) và quy định chi tiết có thể thay đổi – luôn kiểm tra trên trang Pearson VUE và Partner Academy trước khi đăng ký.</div>`
      }
    ],
    code: [],
    exercises: [
      {
        title: 'Bài 1 – Checklist đăng ký',
        task: `<p>Hoàn thành: (1) xác nhận công ty thuộc Partner Network; (2) truy cập được Partner Academy; (3) đọc exam guide chính thức, ghi lại tỉ trọng domain; (4) chọn ngày thi dự kiến.</p>`,
        hint: 'Nếu công ty chưa là partner, hỏi quản lý về kế hoạch tham gia hoặc chờ các đợt mở rộng điều kiện.',
        solution: `<p>So sánh tỉ trọng domain chính thức với lộ trình này và điều chỉnh thời gian ôn tuần 4 cho phù hợp.</p>`
      }
    ],
    quiz: [
      {
        q: 'Thi trượt lần 1, sớm nhất khi nào được thi lại?',
        options: ['Ngay hôm sau', 'Sau 14 ngày', 'Sau 30 ngày', 'Sau 90 ngày'],
        answer: 1,
        explain: '14 → 30 → 90 ngày cho các lần thi lại tiếp theo.'
      }
    ],
    resources: [
      { t: 'Pearson VUE – Claude Certification Program', url: 'https://www.pearsonvue.com/us/en/anthropic.html' }
    ]
  },

  {
    id: 'm6w4', month: 6, week: 4, duration: '4 giờ', domain: 'Ngày thi',
    title: 'Tuần thi: chuẩn bị cuối cùng',
    objectives: [
      'Ôn nhẹ và giữ phong độ trước ngày thi',
      'Chuẩn bị hậu cần cho ngày thi',
      'Kế hoạch sau khi có kết quả'
    ],
    sections: [
      {
        h: '1. Trước ngày thi',
        html: `<ul>
<li>2–3 ngày trước: làm thêm một đề thử, chỉ ôn lại thẻ ghi nhớ và câu sai – không học nội dung mới.</li>
<li>Ngày trước: nghỉ ngơi, kiểm tra lịch thi, giấy tờ, đường đi hoặc thiết bị thi online.</li>
</ul>`
      },
      {
        h: '2. Trong phòng thi',
        html: `<ul>
<li>Phân bổ thời gian: sau 60 phút nên xong khoảng 30 câu.</li>
<li>Không dừng quá lâu ở một câu; đánh dấu và quay lại.</li>
<li>Dành 10–15 phút cuối xem lại câu đã đánh dấu.</li>
</ul>`
      },
      {
        h: '3. Sau khi có kết quả',
        html: `<ul>
<li><strong>Đạt</strong>: cập nhật hồ sơ, chia sẻ với team; cân nhắc các chứng chỉ tiếp theo (Developer – Foundations, Architect – Professional). Nhớ chứng chỉ có hiệu lực 12 tháng.</li>
<li><strong>Chưa đạt</strong>: xem báo cáo theo domain, ôn đúng phần yếu trong thời gian chờ 14 ngày, thi thử lại rồi đăng ký.</li>
</ul>`
      }
    ],
    code: [],
    exercises: [
      {
        title: 'Bài 1 – Đề thi thử cuối cùng',
        task: `<p>Làm đề thi thử đầy đủ lần cuối. Nếu ≥ 80% và lần trước cũng ≥ 80%: sẵn sàng thi.</p>`,
        hint: 'Kết quả các lần thi thử được lưu trong trình duyệt ở trang thi thử.',
        solution: `<p>Chúc bạn thi tốt!</p>`
      }
    ],
    quiz: [],
    resources: []
  }
);

/* Tháng 1 – Nền tảng Claude và Prompt Engineering */
window.LESSONS = window.LESSONS || [];
window.MONTHS = window.MONTHS || [];

window.MONTHS.push({
  month: 1,
  period: '10/2026',
  title: 'Nền tảng Claude và Prompt Engineering',
  domain: 'Prompt Engineering',
  goal: 'Hiểu các model Claude và viết được prompt rõ ràng, cho kết quả ổn định.'
});

window.LESSONS.push(
  {
    id: 'm1w1', month: 1, week: 1, duration: '6 giờ', domain: 'Prompt Engineering',
    title: 'Làm quen Claude: model, token và context window',
    objectives: [
      'Phân biệt các dòng model Claude (Opus, Sonnet, Haiku) và chọn model theo bài toán',
      'Hiểu token, context window, giới hạn output và cách tính chi phí',
      'Biết các bề mặt sử dụng Claude: claude.ai, Claude Code, Claude API, nền tảng cloud'
    ],
    sections: [
      {
        h: '1. Claude là gì và dùng ở đâu',
        html: `<p>Claude là họ mô hình ngôn ngữ lớn (LLM) của Anthropic. Bạn có thể dùng Claude qua nhiều “bề mặt” khác nhau:</p>
<ul>
  <li><strong>claude.ai / ứng dụng desktop, mobile</strong> – giao diện chat cho người dùng cuối, có Projects, Artifacts, Connectors (Gmail, Drive…).</li>
  <li><strong>Claude Code</strong> – agent lập trình chạy trong terminal, IDE, desktop và web.</li>
  <li><strong>Claude API</strong> – gọi trực tiếp qua HTTP hoặc SDK (Python, TypeScript, Java, Go…) để xây ứng dụng.</li>
  <li><strong>Nền tảng cloud</strong> – Amazon Bedrock, Google Vertex AI, Microsoft Foundry.</li>
</ul>
<p>Kỳ thi Architect tập trung vào 3 bề mặt dành cho người xây hệ thống: <strong>Claude API, Claude Agent SDK, Claude Code</strong> và giao thức <strong>MCP</strong>.</p>`
      },
      {
        h: '2. Các dòng model và cách chọn',
        html: `<div class="table-wrap"><table>
<tr><th>Dòng</th><th>Đặc điểm</th><th>Khi nào dùng</th></tr>
<tr><td><strong>Opus</strong></td><td>Thông minh nhất trong nhóm phổ biến, suy luận sâu, làm việc dài</td><td>Agent phức tạp, lập trình khó, phân tích nhiều bước</td></tr>
<tr><td><strong>Sonnet</strong></td><td>Cân bằng chất lượng – tốc độ – giá</td><td>Phần lớn ứng dụng sản phẩm, chatbot, xử lý tài liệu</td></tr>
<tr><td><strong>Haiku</strong></td><td>Nhanh, rẻ nhất</td><td>Phân loại, trích xuất hàng loạt, subagent đơn giản, yêu cầu độ trễ thấp</td></tr>
</table></div>
<p>Nguyên tắc chọn model: <strong>bắt đầu với model mạnh để chứng minh bài toán làm được</strong>, sau đó mới thử model rẻ hơn hoặc giảm <code>effort</code> và đo xem chất lượng có giữ được không. Đừng tối ưu chi phí trước khi có bộ đánh giá (eval).</p>
<div class="callout tip">Model ID luôn là chuỗi chính xác, ví dụ <code>claude-opus-5</code>, <code>claude-sonnet-5</code>, <code>claude-haiku-4-5</code>. Tra danh sách mới nhất tại trang Models của tài liệu Claude hoặc gọi <code>client.models.list()</code>.</div>`
      },
      {
        h: '3. Token, context window và chi phí',
        html: `<ul>
  <li><strong>Token</strong> là đơn vị model đọc và viết (một phần của từ). Tiếng Việt có dấu thường tốn nhiều token hơn tiếng Anh cho cùng lượng ý.</li>
  <li><strong>Context window</strong> là tổng số token model “nhìn thấy” trong một request: system prompt + lịch sử hội thoại + tài liệu + định nghĩa tool + output.</li>
  <li><strong>max_tokens</strong> là giới hạn token output của một lần trả lời. Đặt quá thấp sẽ bị cắt giữa chừng (<code>stop_reason = "max_tokens"</code>).</li>
  <li><strong>Chi phí</strong> = token input × giá input + token output × giá output. Output thường đắt gấp ~5 lần input.</li>
</ul>
<p>Mỗi response trả về <code>usage</code> gồm <code>input_tokens</code>, <code>output_tokens</code> (và các trường cache). Hãy luôn log <code>usage</code> để theo dõi chi phí.</p>`
      },
      {
        h: '4. Cấu trúc một lượt hội thoại',
        html: `<p>Mọi tương tác với Claude API đi qua một endpoint: <code>POST /v1/messages</code>. Request gồm:</p>
<ul>
  <li><code>model</code> – model ID</li>
  <li><code>max_tokens</code> – giới hạn output</li>
  <li><code>system</code> – chỉ dẫn vai trò, quy tắc (tuỳ chọn)</li>
  <li><code>messages</code> – danh sách lượt <code>user</code> / <code>assistant</code> xen kẽ</li>
</ul>
<p>API là <strong>stateless</strong>: server không nhớ hội thoại. Muốn hội thoại nhiều lượt, bạn phải gửi lại toàn bộ lịch sử trong mỗi request.</p>`
      }
    ],
    code: [
      {
        title: 'Python – request đầu tiên', lang: 'python',
        src: `
import anthropic

client = anthropic.Anthropic()  # đọc ANTHROPIC_API_KEY từ biến môi trường

response = client.messages.create(
    model="claude-opus-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Giải thích token là gì trong 3 câu."}],
)

for block in response.content:
    if block.type == "text":
        print(block.text)

print("stop_reason:", response.stop_reason)
print("usage:", response.usage.input_tokens, "in /", response.usage.output_tokens, "out")`
      }
    ],
    exercises: [
      {
        title: 'Bài 1 – Chọn model cho 5 tình huống',
        task: `<p>Với mỗi tình huống, chọn dòng model phù hợp (Opus / Sonnet / Haiku) và giải thích 1 câu:</p>
<ol>
<li>Phân loại 2 triệu email hỗ trợ khách hàng mỗi ngày thành 8 nhóm.</li>
<li>Agent tự sửa bug trong repo lớn, chạy test, mở pull request.</li>
<li>Chatbot tư vấn sản phẩm trên website, cần trả lời trong 2–3 giây.</li>
<li>Phân tích hợp đồng 200 trang để tìm điều khoản rủi ro.</li>
<li>Subagent chỉ đọc file và tóm tắt cho agent chính.</li>
</ol>`,
        hint: 'Cân nhắc 3 yếu tố: độ khó suy luận, khối lượng request, yêu cầu độ trễ.',
        solution: `<ol>
<li><strong>Haiku</strong> – khối lượng rất lớn, bài toán đơn giản, cần rẻ. Nên dùng Batch API để giảm thêm 50%.</li>
<li><strong>Opus</strong> – nhiều bước, dài, cần suy luận và lập trình tốt.</li>
<li><strong>Sonnet</strong> (hoặc Haiku nếu eval cho thấy đủ tốt) – cân bằng chất lượng và tốc độ; bật streaming.</li>
<li><strong>Opus</strong> – tài liệu dài, rủi ro cao nếu bỏ sót; ưu tiên chính xác.</li>
<li><strong>Haiku</strong> hoặc <strong>Sonnet</strong> – việc đọc/tóm tắt đơn giản, tiết kiệm chi phí cho agent chính.</li>
</ol>`
      },
      {
        title: 'Bài 2 – Gọi API lần đầu và đo token',
        task: `<p>Tạo API key trên Claude Console, đặt biến môi trường <code>ANTHROPIC_API_KEY</code>, chạy đoạn code mẫu. Sau đó gửi cùng một câu hỏi bằng tiếng Việt và tiếng Anh, so sánh <code>input_tokens</code> và <code>output_tokens</code>.</p>`,
        hint: 'Dùng pip install anthropic. Không bao giờ ghi API key thẳng vào code hoặc commit lên git.',
        solution: `<p>Bạn sẽ thấy câu tiếng Việt thường tốn nhiều token hơn. Ghi lại bảng: ngôn ngữ · input_tokens · output_tokens · chi phí ước tính. Đây là thói quen quan trọng khi thiết kế hệ thống: <strong>luôn đo token thật</strong>, không đoán.</p>`
      }
    ],
    quiz: [
      {
        q: 'Claude API lưu lịch sử hội thoại như thế nào?',
        options: ['Server tự lưu theo session ID', 'Không lưu – client phải gửi lại toàn bộ lịch sử trong mỗi request', 'Lưu 24 giờ rồi xoá', 'Chỉ lưu khi bật prompt caching'],
        answer: 1,
        explain: 'Messages API là stateless. Prompt caching chỉ giảm chi phí xử lý phần lặp lại, không thay thế việc gửi lịch sử.'
      },
      {
        q: 'Response bị cắt giữa câu và stop_reason là "max_tokens". Cách xử lý đúng nhất?',
        options: ['Đổi sang model khác', 'Tăng max_tokens (và dùng streaming nếu output dài)', 'Giảm độ dài system prompt', 'Bật prompt caching'],
        answer: 1,
        explain: 'max_tokens giới hạn output. Output dài nên dùng streaming để tránh timeout HTTP.'
      },
      {
        q: 'Cách tiếp cận chọn model được khuyến nghị?',
        options: ['Luôn dùng model rẻ nhất', 'Bắt đầu với model mạnh để chứng minh khả thi, rồi đo xem model rẻ hơn có giữ chất lượng không', 'Luôn dùng model mạnh nhất cho mọi việc', 'Chọn ngẫu nhiên rồi điều chỉnh'],
        answer: 1,
        explain: 'Tối ưu chi phí cần dựa trên eval. Chứng minh bài toán làm được trước, tối ưu sau.'
      }
    ],
    resources: [
      { t: 'Anthropic Academy – Claude 101', url: 'https://anthropic.skilljar.com' },
      { t: 'Tài liệu Claude – Models overview', url: 'https://docs.claude.com' }
    ]
  },

  {
    id: 'm1w2', month: 1, week: 2, duration: '7 giờ', domain: 'Prompt Engineering',
    title: 'Prompt cơ bản: rõ ràng, có ngữ cảnh, có vai trò',
    objectives: [
      'Viết chỉ dẫn rõ ràng, cụ thể như giao việc cho một đồng nghiệp mới',
      'Dùng system prompt để đặt vai trò và quy tắc',
      'Cung cấp ngữ cảnh và lý do (why) để Claude tự suy ra hành vi đúng'
    ],
    sections: [
      {
        h: '1. Nguyên tắc “đồng nghiệp mới giỏi nhưng chưa biết gì”',
        html: `<p>Hãy tưởng tượng Claude là một nhân viên rất giỏi nhưng <strong>không có bối cảnh</strong> về dự án của bạn. Prompt tốt trả lời được:</p>
<ul>
<li><strong>Nhiệm vụ là gì?</strong> Động từ cụ thể: tóm tắt, phân loại, viết lại, trích xuất…</li>
<li><strong>Cho ai, để làm gì?</strong> Người đọc là ai, kết quả được dùng vào đâu.</li>
<li><strong>Tiêu chí hoàn thành?</strong> Độ dài, định dạng, giọng văn, điều cần tránh.</li>
<li><strong>Tại sao?</strong> Giải thích lý do giúp Claude xử lý đúng cả những trường hợp bạn không liệt kê.</li>
</ul>
<div class="callout">Ví dụ lý do: thay vì “KHÔNG BAO GIỜ dùng dấu ba chấm”, hãy viết “Câu trả lời sẽ được đọc bằng công cụ text-to-speech, nên tránh dấu ba chấm vì công cụ không phát âm được.”</div>`
      },
      {
        h: '2. System prompt',
        html: `<p><code>system</code> là nơi đặt vai trò, phạm vi và quy tắc ổn định cho toàn bộ hội thoại. Nội dung thay đổi theo từng lượt (câu hỏi, dữ liệu) nên để trong <code>messages</code>.</p>
<ul>
<li>Vai trò cụ thể giúp tăng chất lượng: “Bạn là kỹ sư bảo mật review code Python cho fintech” tốt hơn “Bạn là trợ lý”.</li>
<li>Giữ system prompt <strong>ổn định</strong> để tận dụng prompt caching (học ở tháng 5).</li>
<li>Model hiện đại tuân thủ chỉ dẫn rất sát – viết điều bạn <em>muốn</em> thay vì liệt kê dài điều cấm, và tránh viết HOA, “CRITICAL” quá mức vì có thể khiến model phản ứng thái quá.</li>
</ul>`
      },
      {
        h: '3. Nói điều cần làm, không chỉ điều cần tránh',
        html: `<div class="table-wrap"><table>
<tr><th>Kém</th><th>Tốt hơn</th></tr>
<tr><td>Đừng viết dài dòng.</td><td>Trả lời tối đa 3 câu, câu đầu là kết luận.</td></tr>
<tr><td>Đừng dùng markdown.</td><td>Viết thành các đoạn văn liền mạch, không dùng gạch đầu dòng hay tiêu đề.</td></tr>
<tr><td>Viết email hay.</td><td>Viết email 120–150 từ gửi khách hàng doanh nghiệp, giọng lịch sự, kết thúc bằng một câu hỏi mời phản hồi.</td></tr>
</table></div>`
      },
      {
        h: '4. Tách dữ liệu và chỉ dẫn',
        html: `<p>Khi đưa tài liệu vào prompt, đặt <strong>tài liệu dài ở đầu</strong>, câu hỏi và chỉ dẫn ở cuối – thường cho kết quả tốt hơn với ngữ cảnh dài. Bao dữ liệu trong thẻ (ví dụ <code>&lt;document&gt;</code>) để Claude phân biệt đâu là dữ liệu, đâu là chỉ dẫn. Chi tiết về XML tag ở bài tuần 3.</p>`
      }
    ],
    code: [
      {
        title: 'Python – system prompt có vai trò và lý do', lang: 'python',
        src: `
import anthropic

client = anthropic.Anthropic()

SYSTEM = """Bạn là chuyên viên chăm sóc khách hàng của một cửa hàng sách online.
Khách hàng thường đọc trên điện thoại, nên câu trả lời cần ngắn: tối đa 4 câu.
Nếu câu hỏi liên quan đến hoàn tiền, hãy hướng dẫn khách gửi mã đơn hàng,
vì bộ phận hoàn tiền cần mã đơn để tra cứu."""

response = client.messages.create(
    model="claude-opus-5",
    max_tokens=1024,
    system=SYSTEM,
    messages=[{"role": "user", "content": "Sách giao bị rách bìa, tôi muốn trả lại."}],
)
print(response.content[0].text)`
      }
    ],
    exercises: [
      {
        title: 'Bài 1 – Viết lại 3 prompt kém',
        task: `<p>Viết lại 3 prompt sau cho rõ ràng, có ngữ cảnh, có tiêu chí:</p>
<ol><li>“Tóm tắt bài này.”</li><li>“Viết code đăng nhập.”</li><li>“Dịch sang tiếng Anh cho hay.”</li></ol>`,
        hint: 'Với mỗi prompt, bổ sung: người đọc là ai, dùng để làm gì, định dạng và độ dài, điều gì quan trọng nhất.',
        solution: `<ol>
<li>“Tóm tắt bài báo dưới đây cho quản lý không chuyên kỹ thuật, đọc trong 1 phút. Viết 5 gạch đầu dòng, mỗi dòng ≤ 20 từ, dòng đầu là kết luận chính. Giữ nguyên số liệu quan trọng.”</li>
<li>“Viết API đăng nhập bằng FastAPI (Python 3.12): nhận email + mật khẩu, kiểm tra mật khẩu bằng bcrypt, trả JWT hết hạn sau 1 giờ. Không log mật khẩu. Kèm 3 unit test bằng pytest.”</li>
<li>“Dịch đoạn giới thiệu sản phẩm sau sang tiếng Anh Mỹ cho trang landing page B2B. Giọng chuyên nghiệp, ngắn gọn; giữ nguyên tên sản phẩm; có thể đổi cấu trúc câu cho tự nhiên thay vì dịch từng chữ.”</li>
</ol>`
      },
      {
        title: 'Bài 2 – Thử nghiệm vai trò',
        task: `<p>Gửi cùng câu hỏi “Đoạn code này có vấn đề gì?” (kèm một đoạn code có lỗ hổng SQL injection) với 3 system prompt: không có, “Bạn là trợ lý”, “Bạn là kỹ sư bảo mật ứng dụng web”. So sánh kết quả.</p>`,
        hint: 'Ví dụ code: query = "SELECT * FROM users WHERE name = \'" + name + "\'"',
        solution: `<p>Vai trò cụ thể thường khiến Claude tập trung vào khía cạnh bảo mật, chỉ ra SQL injection, đề xuất parameterized query. Kết luận: <strong>vai trò cụ thể + tiêu chí rõ</strong> cho kết quả nhất quán hơn.</p>`
      }
    ],
    quiz: [
      {
        q: 'Nội dung nào nên đặt trong system prompt?',
        options: ['Câu hỏi hiện tại của người dùng', 'Vai trò, phạm vi và quy tắc ổn định cho cả hội thoại', 'Kết quả tool vừa chạy', 'Timestamp của request'],
        answer: 1,
        explain: 'Nội dung thay đổi mỗi lượt nên ở messages; system giữ ổn định (cũng tốt cho caching).'
      },
      {
        q: 'Vì sao nên giải thích lý do của một quy tắc trong prompt?',
        options: ['Để prompt dài hơn', 'Giúp Claude khái quát hoá và xử lý đúng các trường hợp không liệt kê', 'Bắt buộc theo API', 'Để giảm token'],
        answer: 1,
        explain: 'Hiểu “tại sao” giúp model áp dụng tinh thần của quy tắc thay vì chỉ khớp từng chữ.'
      },
      {
        q: 'Chỉ dẫn nào hiệu quả hơn để có câu trả lời ngắn?',
        options: ['ĐỪNG VIẾT DÀI!!!', 'Trả lời tối đa 3 câu, câu đầu là kết luận.', 'Hãy ngắn gọn nếu có thể.', 'Không cần chỉ dẫn'],
        answer: 1,
        explain: 'Chỉ dẫn tích cực, đo được, cụ thể – tốt hơn lời cấm mơ hồ hoặc viết hoa.'
      }
    ],
    resources: [
      { t: 'Prompt engineering overview – docs.claude.com', url: 'https://docs.claude.com' }
    ]
  },

  {
    id: 'm1w3', month: 1, week: 3, duration: '7 giờ', domain: 'Prompt Engineering',
    title: 'Few-shot, XML tag và cho Claude suy nghĩ',
    objectives: [
      'Dùng ví dụ (few-shot) để định hình định dạng và giọng văn',
      'Dùng XML tag để cấu trúc prompt và tách dữ liệu',
      'Hiểu adaptive thinking và tham số effort'
    ],
    sections: [
      {
        h: '1. Few-shot examples',
        html: `<p>Ví dụ là cách mạnh nhất để chỉ cho Claude định dạng mong muốn. Nguyên tắc:</p>
<ul>
<li>3–5 ví dụ <strong>đa dạng</strong>, bao cả trường hợp biên – tránh để các ví dụ giống nhau khiến Claude bắt chước chi tiết không mong muốn.</li>
<li>Ví dụ phải <strong>đúng với quy tắc</strong> bạn viết – nếu ví dụ và chỉ dẫn mâu thuẫn, Claude thường theo ví dụ.</li>
<li>Bọc mỗi ví dụ trong <code>&lt;example&gt;</code> để tách khỏi chỉ dẫn.</li>
</ul>`
      },
      {
        h: '2. XML tag',
        html: `<p>Claude được huấn luyện để hiểu tốt cấu trúc dạng thẻ. Không có tên thẻ “ma thuật” – quan trọng là <strong>đặt tên có nghĩa và dùng nhất quán</strong>.</p>
<ul>
<li>Tách phần: <code>&lt;instructions&gt;</code>, <code>&lt;context&gt;</code>, <code>&lt;document&gt;</code>, <code>&lt;examples&gt;</code>.</li>
<li>Nhiều tài liệu: <code>&lt;documents&gt;&lt;document index="1"&gt;&lt;source&gt;…&lt;/source&gt;&lt;content&gt;…&lt;/content&gt;&lt;/document&gt;…</code></li>
<li>Yêu cầu output có thẻ để dễ tách bằng code, ví dụ đặt câu trả lời trong <code>&lt;answer&gt;</code>. Khi cần JSON chắc chắn đúng schema, dùng structured outputs (tháng 2).</li>
</ul>
<div class="callout warn">Dữ liệu người dùng hoặc tài liệu bên ngoài có thể chứa chỉ dẫn độc hại (prompt injection). Bọc chúng trong thẻ và nói rõ trong system prompt rằng nội dung trong thẻ là <em>dữ liệu</em>, không phải chỉ dẫn.</div>`
      },
      {
        h: '3. Cho Claude thời gian suy nghĩ',
        html: `<p>Với bài toán nhiều bước (toán, phân tích, lập kế hoạch), để Claude suy luận trước khi trả lời giúp tăng độ chính xác.</p>
<ul>
<li><strong>Adaptive thinking</strong>: <code>thinking={"type": "adaptive"}</code> – Claude tự quyết định khi nào và suy nghĩ bao nhiêu. Trên các model mới, đây là cách được khuyến nghị (tham số cũ <code>budget_tokens</code> đã bị bỏ trên các model đời mới).</li>
<li><strong>Effort</strong>: <code>output_config={"effort": "low" | "medium" | "high" | "xhigh" | "max"}</code> – điều chỉnh mức độ kỹ lưỡng và lượng token tiêu tốn. <code>low</code> cho việc đơn giản/subagent, <code>high</code>–<code>xhigh</code> cho lập trình và agent.</li>
<li><code>display: "summarized"</code> để nhận bản tóm tắt suy nghĩ; mặc định trên model mới là <code>"omitted"</code> (khối thinking có text rỗng).</li>
</ul>`
      }
    ],
    code: [
      {
        title: 'Prompt – few-shot + XML tag', lang: 'text',
        src: `
<instructions>
Phân loại phản hồi khách hàng vào đúng một nhóm: giao_hang, thanh_toan, san_pham, khac.
Chỉ trả về tên nhóm trong thẻ <label>.
</instructions>

<examples>
<example>
<feedback>Đơn hàng của tôi 5 ngày chưa tới</feedback>
<label>giao_hang</label>
</example>
<example>
<feedback>Thẻ bị trừ tiền 2 lần</feedback>
<label>thanh_toan</label>
</example>
<example>
<feedback>Áo mặc 1 lần đã bung chỉ</feedback>
<label>san_pham</label>
</example>
</examples>

<feedback>{{FEEDBACK}}</feedback>`
      },
      {
        title: 'Python – adaptive thinking + effort', lang: 'python',
        src: `
response = client.messages.create(
    model="claude-opus-5",
    max_tokens=16000,
    thinking={"type": "adaptive", "display": "summarized"},
    output_config={"effort": "high"},
    messages=[{"role": "user", "content": "Một cửa hàng giảm 20% rồi giảm tiếp 15%. Tổng giảm bao nhiêu %?"}],
)

for block in response.content:
    if block.type == "thinking":
        print("[Tóm tắt suy nghĩ]", block.thinking)
    elif block.type == "text":
        print("[Trả lời]", block.text)`
      }
    ],
    exercises: [
      {
        title: 'Bài 1 – Bộ phân loại few-shot',
        task: `<p>Dùng prompt mẫu ở trên, viết script Python phân loại 20 câu phản hồi (tự viết, có 4–5 câu mơ hồ). Tách nhãn từ thẻ <code>&lt;label&gt;</code> bằng regex và tính tỉ lệ đúng so với nhãn bạn gán tay.</p>`,
        hint: 're.search(r"<label>(.*?)</label>", text)',
        solution: `<pre><code>import re, anthropic
client = anthropic.Anthropic()
PROMPT = open("classify_prompt.txt", encoding="utf-8").read()

def classify(feedback):
    r = client.messages.create(
        model="claude-haiku-4-5", max_tokens=50,
        messages=[{"role": "user", "content": PROMPT.replace("{{FEEDBACK}}", feedback)}],
    )
    m = re.search(r"&lt;label&gt;(.*?)&lt;/label&gt;", r.content[0].text)
    return m.group(1).strip() if m else "khac"

data = [("Shipper giao nhầm địa chỉ", "giao_hang"), ...]
correct = sum(classify(f) == y for f, y in data)
print(f"Độ chính xác: {correct}/{len(data)}")</code></pre>
<p>Với câu sai, thêm 1 ví dụ tương tự vào <code>&lt;examples&gt;</code> rồi chạy lại – đây chính là vòng lặp cải tiến prompt dựa trên eval.</p>`
      },
      {
        title: 'Bài 2 – So sánh effort',
        task: `<p>Chạy một bài toán logic nhiều bước với <code>effort</code> = low, medium, high. Ghi lại: đúng/sai, <code>output_tokens</code>, thời gian phản hồi.</p>`,
        hint: 'Dùng time.perf_counter() để đo thời gian.',
        solution: `<p>Thường thấy: effort cao → nhiều token và chậm hơn nhưng chính xác hơn với bài khó; với bài dễ, low đã đủ. Kết luận cho kỳ thi: <strong>effort là đòn bẩy cân bằng chất lượng – chi phí trong cùng một model</strong>, nên thử trước khi đổi sang model rẻ hơn.</p>`
      }
    ],
    quiz: [
      {
        q: 'Ví dụ few-shot mâu thuẫn với chỉ dẫn. Claude thường làm gì?',
        options: ['Bỏ qua ví dụ', 'Thường làm theo ví dụ', 'Báo lỗi', 'Chọn ngẫu nhiên'],
        answer: 1,
        explain: 'Ví dụ có sức ảnh hưởng rất mạnh – hãy đảm bảo ví dụ tuân đúng quy tắc.'
      },
      {
        q: 'Cách cấu hình suy nghĩ được khuyến nghị trên các model Claude đời mới?',
        options: ['thinking={"type":"enabled","budget_tokens":8000}', 'thinking={"type":"adaptive"} kết hợp output_config.effort', 'temperature=0', 'Thêm "hãy suy nghĩ kỹ" 5 lần'],
        answer: 1,
        explain: 'budget_tokens đã bị bỏ/không dùng trên model mới; adaptive + effort là cách điều chỉnh chính.'
      },
      {
        q: 'Mục đích chính của XML tag trong prompt?',
        options: ['Bắt buộc theo cú pháp API', 'Tách rõ chỉ dẫn, dữ liệu, ví dụ và giúp tách output bằng code', 'Giảm chi phí token', 'Mã hoá dữ liệu'],
        answer: 1,
        explain: 'Tag giúp cấu trúc rõ ràng; tên thẻ không có ý nghĩa đặc biệt, chỉ cần nhất quán.'
      }
    ],
    resources: [
      { t: 'Prompting best practices – docs.claude.com', url: 'https://docs.claude.com' }
    ]
  },

  {
    id: 'm1w4', month: 1, week: 4, duration: '7 giờ', domain: 'Prompt Engineering',
    title: 'Output ổn định, giảm ảo giác và đánh giá prompt',
    objectives: [
      'Điều khiển định dạng output và độ dài',
      'Giảm ảo giác (hallucination) bằng trích dẫn và cho phép “không biết”',
      'Xây bộ eval nhỏ để so sánh các phiên bản prompt'
    ],
    sections: [
      {
        h: '1. Điều khiển định dạng',
        html: `<ul>
<li>Mô tả định dạng mong muốn một cách tích cực, và cho ví dụ.</li>
<li>Kiểu văn trong prompt ảnh hưởng kiểu văn output: prompt viết thành đoạn văn thì output cũng ít gạch đầu dòng hơn.</li>
<li>Các model Claude 4.6+ <strong>không hỗ trợ prefill</strong> (điền sẵn đầu câu trả lời của assistant). Muốn JSON chắc chắn đúng, dùng <strong>structured outputs</strong> (<code>output_config.format</code>) – học tháng 2.</li>
</ul>`
      },
      {
        h: '2. Giảm ảo giác',
        html: `<ul>
<li><strong>Cho phép nói “không biết”</strong>: “Nếu tài liệu không chứa thông tin, hãy trả lời ‘Không tìm thấy trong tài liệu’.”</li>
<li><strong>Trích dẫn trước, trả lời sau</strong>: yêu cầu Claude trích nguyên văn đoạn liên quan vào <code>&lt;quotes&gt;</code> rồi mới trả lời dựa trên các trích dẫn đó.</li>
<li><strong>Citations API</strong>: bật <code>citations: {enabled: true}</code> trên document block để nhận trích dẫn có vị trí chính xác.</li>
<li><strong>Kiểm chứng</strong>: với việc quan trọng, dùng request thứ hai để kiểm tra từng khẳng định có nguồn hay không.</li>
</ul>`
      },
      {
        h: '3. Eval – đánh giá prompt bằng dữ liệu',
        html: `<p>Không thể cải thiện điều bạn không đo. Một bộ eval tối thiểu gồm:</p>
<ol>
<li><strong>Tập test</strong>: 20–50 input thật, bao cả trường hợp khó, kèm kết quả mong đợi.</li>
<li><strong>Cách chấm</strong>: so khớp chính xác (phân loại), kiểm tra bằng code (JSON hợp lệ, có trường bắt buộc), hoặc <strong>LLM-as-judge</strong> với rubric rõ ràng (câu trả lời mở).</li>
<li><strong>Chạy và so sánh</strong>: mỗi thay đổi prompt/model/effort đều chạy lại toàn bộ tập test và ghi điểm.</li>
</ol>
<div class="callout tip">Tách tập “dev” để tinh chỉnh và tập “test” chỉ dùng để báo cáo, tránh prompt bị “học thuộc” tập test.</div>`
      }
    ],
    code: [
      {
        title: 'Prompt – trả lời dựa trên trích dẫn', lang: 'text',
        src: `
<document>{{POLICY_DOC}}</document>

Trả lời câu hỏi của nhân viên dựa trên chính sách ở trên.
1. Trích nguyên văn các câu liên quan vào thẻ <quotes>.
2. Trả lời trong thẻ <answer>, chỉ dựa trên các trích dẫn.
3. Nếu không có câu nào liên quan, trả lời: "Chính sách không đề cập vấn đề này."

Câu hỏi: {{QUESTION}}`
      },
      {
        title: 'Python – eval tối thiểu với LLM-as-judge', lang: 'python',
        src: `
import json, anthropic
client = anthropic.Anthropic()

RUBRIC = """Chấm câu trả lời theo thang 1-5:
5 = đúng hoàn toàn, chỉ dựa trên tài liệu; 1 = sai hoặc bịa thông tin.
Trả về JSON: {"score": <1-5>, "reason": "<1 câu>"}"""

def judge(question, expected, answer):
    r = client.messages.create(
        model="claude-opus-5", max_tokens=300,
        output_config={"format": {"type": "json_schema", "schema": {
            "type": "object",
            "properties": {"score": {"type": "integer"}, "reason": {"type": "string"}},
            "required": ["score", "reason"], "additionalProperties": False}}},
        messages=[{"role": "user", "content":
            f"{RUBRIC}\\n\\nCâu hỏi: {question}\\nĐáp án chuẩn: {expected}\\nCâu trả lời: {answer}"}],
    )
    return json.loads(r.content[0].text)`
      }
    ],
    exercises: [
      {
        title: 'Bài 1 – Chatbot hỏi đáp chính sách không bịa',
        task: `<p>Lấy một văn bản chính sách (nghỉ phép, hoàn tiền…) ~2 trang. Viết prompt trả lời dựa trên trích dẫn. Tạo 10 câu hỏi: 7 câu có trong tài liệu, 3 câu không có. Kiểm tra Claude có trả lời “không đề cập” cho 3 câu kia không.</p>`,
        hint: 'Câu hỏi bẫy nên gần chủ đề nhưng không có trong tài liệu, ví dụ hỏi về chính sách nghỉ thai sản khi tài liệu chỉ nói nghỉ phép năm.',
        solution: `<p>Nếu Claude vẫn bịa, tăng cường: đặt tài liệu ở đầu, câu hỏi ở cuối; nói rõ lý do (“nhân viên sẽ dựa vào câu trả lời để ra quyết định, thông tin sai gây hậu quả”); yêu cầu bước trích dẫn bắt buộc.</p>`
      },
      {
        title: 'Bài 2 – Eval so sánh 2 phiên bản prompt',
        task: `<p>Dùng hàm <code>judge</code> ở trên, chấm 10 câu hỏi cho 2 phiên bản prompt (có/không có bước trích dẫn). Tính điểm trung bình mỗi phiên bản.</p>`,
        hint: 'Lưu kết quả ra file CSV: prompt_version, question, answer, score, reason.',
        solution: `<p>Kết quả mong đợi: phiên bản có trích dẫn cho điểm cao hơn ở các câu bẫy. Ghi lại để dùng lại ở tháng 6 khi ôn phần “đánh giá và độ tin cậy”.</p>`
      }
    ],
    quiz: [
      {
        q: 'Trên Claude 4.6+ muốn output luôn là JSON hợp lệ theo schema, cách đúng là?',
        options: ['Prefill "{" ở lượt assistant', 'Dùng structured outputs (output_config.format với json_schema)', 'Viết "CHỈ TRẢ JSON" bằng chữ hoa', 'Đặt temperature=0'],
        answer: 1,
        explain: 'Prefill trả lỗi 400 trên các model đời mới; structured outputs đảm bảo đúng schema.'
      },
      {
        q: 'Kỹ thuật nào giúp giảm ảo giác khi hỏi đáp tài liệu?',
        options: ['Yêu cầu trích dẫn nguyên văn trước rồi trả lời dựa trên trích dẫn', 'Tăng max_tokens', 'Dùng model rẻ hơn', 'Bỏ system prompt'],
        answer: 0,
        explain: 'Trích dẫn trước buộc câu trả lời bám vào nội dung có thật; cho phép “không biết” cũng quan trọng.'
      },
      {
        q: 'Vì sao nên tách tập dev và tập test trong eval?',
        options: ['Để chạy nhanh hơn', 'Tránh tối ưu prompt “khớp” riêng tập test, khiến điểm báo cáo không phản ánh thực tế', 'API yêu cầu', 'Để giảm chi phí'],
        answer: 1,
        explain: 'Giống machine learning: tinh chỉnh trên dev, báo cáo trên test.'
      }
    ],
    resources: [
      { t: 'Reduce hallucinations – docs.claude.com', url: 'https://docs.claude.com' },
      { t: 'Define success criteria & build evals – docs.claude.com', url: 'https://docs.claude.com' }
    ]
  }
);

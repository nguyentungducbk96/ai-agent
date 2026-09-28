/* Tháng 2 – Claude API, structured output và tool use */
window.LESSONS = window.LESSONS || [];
window.MONTHS = window.MONTHS || [];

window.MONTHS.push({
  month: 2,
  period: '11/2026',
  title: 'Claude API, structured output và tool use',
  domain: 'Tool Design & MCP · Agentic Architecture',
  goal: 'Tự gọi Claude API bằng code và cho Claude sử dụng tool.'
});

window.LESSONS.push(
  {
    id: 'm2w1', month: 2, week: 1, duration: '6 giờ', domain: 'Claude API',
    title: 'Messages API và SDK',
    objectives: [
      'Cài SDK Python/TypeScript và cấu hình API key an toàn',
      'Hiểu đầy đủ request/response của Messages API',
      'Đọc content block, stop_reason và usage',
      'Cấu hình retry, timeout và xử lý lỗi theo từng loại'
    ],
    flow: {
      title: 'Một request đi qua SDK, API rồi trả về content block và usage',
      steps: [
        { kind: 'start', label: 'Code gọi messages.create()', detail: 'model, max_tokens, system, messages' },
        { kind: 'step', label: 'SDK đọc API key từ env', detail: 'ANTHROPIC_API_KEY, không ghi trong code', note: 'Key lộ → revoke ngay trên Console' },
        { kind: 'step', label: 'POST /v1/messages', detail: 'Timeout mặc định 10 phút' },
        { kind: 'decision', label: 'Lỗi 408/409/429/5xx?', note: 'Có → SDK tự retry (mặc định 2 lần)' },
        { kind: 'step', label: 'Retry có backoff', loopTo: 2, loopLabel: 'gửi lại' },
        { kind: 'step', label: 'Nhận response', detail: 'content[], stop_reason, usage', note: '400 → sửa request, không retry' },
        { kind: 'step', label: 'Duyệt block theo type', detail: 'text / thinking / tool_use' },
        { kind: 'end', label: 'Log usage và trả text' }
      ]
    },
    realExamples: [
      {
        title: 'Shop mỹ phẩm viết mô tả sản phẩm tự động',
        html: `<p>Một shop mỹ phẩm ở TP.HCM có 1.200 sản phẩm, mỗi mô tả do nhân viên viết mất khoảng 15 phút. Team viết script Python gọi <code>messages.create()</code> với system prompt “copywriter mỹ phẩm, 80–120 từ, không hứa hẹn công dụng y tế”, còn thông số sản phẩm đi trong <code>messages</code>.</p>
<p><strong>Trước:</strong> script ghi API key thẳng vào code rồi đẩy lên GitHub, và bị lộ key sau 2 ngày. <strong>Sau:</strong> key được đặt trong biến môi trường, còn hàm <code>ask()</code> ghi <code>usage</code> ra file <code>logs.jsonl</code>. Nhờ log, team biết mỗi mô tả tốn khoảng 400 token input và 250 token output, nên ước tính được chi phí cho cả 1.200 sản phẩm trước khi chạy.</p>
<p>Có lần mạng chập chờn, SDK tự retry khi gặp lỗi 429 và 529, script không bị dừng giữa chừng. Kết quả: xong trong một buổi chiều thay vì 3 tuần, nhân viên chỉ còn phải duyệt và sửa khoảng 10% số mô tả.</p>`
      },
      {
        title: 'Ứng dụng đặt lịch spa bị cắt câu trả lời',
        html: `<p>Chatbot đặt lịch của một chuỗi spa ở Hà Nội thỉnh thoảng trả lời cụt lủn kiểu “Chị có thể chọn khung giờ 9h, 10h và”. Dev kiểm tra log thì thấy <code>stop_reason = "max_tokens"</code>, vì trước đó đã đặt <code>max_tokens=100</code> cho “tiết kiệm”.</p>
<p><strong>Cách sửa:</strong> tăng <code>max_tokens</code> lên 1024. Độ dài câu trả lời được kiểm soát bằng chỉ dẫn trong system prompt (“tối đa 3 câu”), không dùng <code>max_tokens</code> để cắt. Code cũng in cảnh báo mỗi khi gặp <code>max_tokens</code> để phát hiện sớm.</p>
<pre><code>if r.stop_reason == "max_tokens":
    logger.warning("Output bị cắt: %s", r.id)</code></pre>
<p>Bài học: <code>max_tokens</code> là trần an toàn chứ không phải công cụ điều chỉnh độ dài. Chi phí chỉ tính trên số token thực sự sinh ra, nên đặt trần cao hơn không làm tốn thêm tiền.</p>`
      }
    ],
    recap: {
      summary: [
        'Mọi thứ đi qua một endpoint: POST /v1/messages với model, max_tokens, messages (system tuỳ chọn).',
        'Response gồm content (danh sách block), stop_reason và usage; luôn kiểm tra block.type trước khi đọc.',
        'SDK tự retry 408/409/429/5xx và lỗi kết nối; lỗi 400 phải sửa request.',
        'API key để trong biến môi trường, tuyệt đối không commit.',
        'Log usage mỗi request để tính chi phí thật.'
      ],
      tips: [
        'Nhớ “M-M-M”: Model, Max_tokens, Messages là 3 trường bắt buộc.',
        '4xx là lỗi của mình (trừ 408/409/429), 5xx là lỗi của server: gặp 5xx thì retry, gặp 400 thì sửa code.',
        'stop_reason giống đèn giao thông: end_turn là xanh, max_tokens là vàng (bị cắt), tool_use là “rẽ phải chạy tool”.',
        'max_tokens là trần nhà chứ không phải chiều cao người: đặt cao không tốn thêm tiền.',
        'Bẫy đề thi: “retry mọi lỗi” là sai, vì 400 retry bao nhiêu lần vẫn lỗi.'
      ]
    },
    sections: [
      {
        h: '1. Chuẩn bị',
        html: `<ol>
<li>Tạo tài khoản và API key tại Claude Console.</li>
<li>Lưu key vào biến môi trường <code>ANTHROPIC_API_KEY</code> (trong <code>~/.zshrc</code> hoặc file <code>.env</code> đã được <code>.gitignore</code>).</li>
<li>Cài SDK: <code>pip install anthropic</code> hoặc <code>npm install @anthropic-ai/sdk</code>.</li>
</ol>
<div class="callout warn">Không commit API key. Nếu lỡ lộ, vào Console thu hồi (revoke) ngay và tạo key mới – giống cách xử lý GitHub token.</div>`
      },
      {
        h: '2. Response gồm những gì',
        html: `<div class="table-wrap"><table>
<tr><th>Trường</th><th>Ý nghĩa</th></tr>
<tr><td><code>content</code></td><td>Danh sách content block: <code>text</code>, <code>thinking</code>, <code>tool_use</code>… Luôn kiểm tra <code>block.type</code> trước khi đọc.</td></tr>
<tr><td><code>stop_reason</code></td><td><code>end_turn</code> (xong), <code>max_tokens</code> (bị cắt), <code>tool_use</code> (muốn gọi tool), <code>pause_turn</code> (server tool tạm dừng), <code>refusal</code> (từ chối vì an toàn)…</td></tr>
<tr><td><code>usage</code></td><td>Số token input/output, token ghi/đọc cache.</td></tr>
<tr><td><code>id</code>, <code>model</code></td><td>ID message và model đã xử lý – nên log để truy vết.</td></tr>
</table></div>`
      },
      {
        h: '3. Tham số thường dùng',
        html: `<ul>
<li><code>max_tokens</code>: đừng đặt quá thấp. Non-streaming khoảng 16000 là mặc định an toàn; output rất dài thì dùng streaming.</li>
<li><code>system</code>: chuỗi hoặc danh sách text block (khi cần <code>cache_control</code>).</li>
<li><code>output_config</code>: chứa <code>effort</code> và <code>format</code> (structured outputs).</li>
<li><code>thinking</code>: <code>{"type": "adaptive"}</code> trên model mới.</li>
<li>Model ID dùng đúng chuỗi trong bảng Models (ví dụ <code>claude-opus-5</code>), không tự thêm hậu tố ngày tháng.</li>
</ul>`
      },
      {
        h: '4. Retry, timeout và lỗi',
        html: `<ul>
<li>SDK tự retry lỗi kết nối và mã 408, 409, 429, 5xx với backoff luỹ thừa, mặc định <strong>2 lần</strong>. Chỉnh bằng <code>max_retries</code> trên client hoặc <code>client.with_options(max_retries=5)</code> cho một request.</li>
<li>Timeout mặc định 10 phút. Python tính bằng <strong>giây</strong> (<code>timeout=20.0</code>), TypeScript tính bằng <strong>mili giây</strong>.</li>
<li>Bắt lỗi theo chuỗi từ cụ thể đến chung: <code>BadRequestError</code> (400, sửa request, không retry) → <code>RateLimitError</code> (429) → <code>APIStatusError</code> (mã HTTP khác) → <code>APIConnectionError</code> (mạng).</li>
<li>Timeout cũng được retry, nên thời gian chờ tối đa có thể là <code>timeout × (max_retries + 1)</code>.</li>
</ul>`
      }
    ],
    code: [
      {
        title: 'TypeScript – request cơ bản', lang: 'typescript',
        src: `
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // đọc ANTHROPIC_API_KEY

const response = await client.messages.create({
  model: "claude-opus-5",
  max_tokens: 1024,
  system: "Bạn là trợ lý viết tài liệu kỹ thuật, trả lời bằng tiếng Việt.",
  messages: [{ role: "user", content: "REST API là gì? Trả lời trong 3 câu." }],
});

for (const block of response.content) {
  if (block.type === "text") console.log(block.text);
}
console.log(response.stop_reason, response.usage);`
      },
      {
        title: 'Python – xử lý lỗi theo từng loại', lang: 'python',
        src: `
import anthropic

client = anthropic.Anthropic(max_retries=3, timeout=60.0)

try:
    response = client.messages.create(
        model="claude-opus-5", max_tokens=1024,
        messages=[{"role": "user", "content": "Xin chào"}],
    )
except anthropic.BadRequestError as e:      # 400 – request sai, không retry
    print("Request không hợp lệ:", e.message)
except anthropic.RateLimitError:            # 429 – SDK đã retry, vẫn quá giới hạn
    print("Quá rate limit, thử lại sau")
except anthropic.APIStatusError as e:       # các lỗi HTTP khác
    print("Lỗi API", e.status_code)
except anthropic.APIConnectionError:        # mất mạng, DNS...
    print("Không kết nối được")`
      }
    ],
    exercises: [
      {
        title: 'Bài 1 – Hàm ask() dùng lại được',
        task: `<p>Viết hàm <code>ask(prompt, system=None, model="claude-opus-5")</code> trả về text, log <code>usage</code> và thời gian ra file <code>logs.jsonl</code>. Xử lý trường hợp <code>stop_reason == "max_tokens"</code> bằng cách in cảnh báo.</p>`,
        hint: 'Ghi mỗi request một dòng JSON: {"ts":..., "model":..., "in":..., "out":..., "ms":...}',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Tạo client một lần ở cấp module (không tạo lại trong mỗi lần gọi hàm).</li>
<li>Đo thời gian bằng <code>time.perf_counter()</code> quanh lời gọi <code>messages.create</code>.</li>
<li>Chỉ truyền <code>system</code> khi có giá trị, bằng cách dựng dict <code>kwargs</code>.</li>
<li>Ghi một dòng JSON vào <code>logs.jsonl</code> gồm model, token vào/ra, thời gian, stop_reason.</li>
<li>Kiểm tra <code>stop_reason</code>, rồi ghép text từ các block có <code>type == "text"</code>.</li>
</ol>
<pre><code>import json, time, anthropic

client = anthropic.Anthropic()

def ask(prompt, system=None, model="claude-opus-5", max_tokens=4096):
    t0 = time.perf_counter()
    kwargs = {"system": system} if system else {}
    r = client.messages.create(
        model=model, max_tokens=max_tokens,
        messages=[{"role": "user", "content": prompt}], **kwargs,
    )
    ms = int((time.perf_counter() - t0) * 1000)
    with open("logs.jsonl", "a", encoding="utf-8") as f:
        f.write(json.dumps({
            "ts": time.time(), "model": model,
            "in": r.usage.input_tokens, "out": r.usage.output_tokens,
            "ms": ms, "stop": r.stop_reason,
        }) + "\\n")
    if r.stop_reason == "max_tokens":
        print("Cảnh báo: output bị cắt, hãy tăng max_tokens")
    return "".join(b.text for b in r.content if b.type == "text")

if __name__ == "__main__":
    print(ask("Giải thích HTTP 429 trong 2 câu."))
    print(ask("Viết 1 câu chào.", max_tokens=5))  # cố ý gây max_tokens</code></pre>
<p><strong>Kiểm tra kết quả:</strong> file <code>logs.jsonl</code> có 2 dòng; dòng thứ hai có <code>"stop": "max_tokens"</code> và màn hình in cảnh báo.</p>
<p><strong>Lỗi thường gặp:</strong> đọc thẳng <code>r.content[0].text</code> (lỗi khi block đầu là <code>thinking</code>); quên <code>encoding="utf-8"</code> khiến tiếng Việt lỗi trên Windows; tạo client mới mỗi lần gọi làm mất connection pool.</p>`
      },
      {
        title: 'Bài 2 – Tính chi phí',
        task: `<p>Từ file <code>logs.jsonl</code>, viết script tính tổng chi phí theo bảng giá model bạn dùng (tra trang Pricing). In ra chi phí trung bình mỗi request.</p>`,
        hint: 'Giá tính theo 1 triệu token (MTok): cost = in/1e6 × giá_in + out/1e6 × giá_out.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Mở trang Pricing chính thức, ghi giá input/output (USD/MTok) của từng model bạn dùng vào dict <code>PRICES</code>.</li>
<li>Đọc từng dòng của <code>logs.jsonl</code> bằng <code>json.loads</code>.</li>
<li>Tính chi phí từng dòng theo công thức; model không có trong bảng thì báo lỗi rõ ràng thay vì bỏ qua.</li>
<li>Cộng dồn, in tổng, trung bình, và chi phí theo từng model.</li>
</ol>
<pre><code>import json
from collections import defaultdict

# USD cho 1 triệu token (input, output) – điền theo trang Pricing hiện tại
PRICES = {
    "claude-opus-5": (5.00, 25.00),
    "claude-sonnet-5": (2.00, 10.00),
    "claude-haiku-4-5": (1.00, 5.00),
}

total, count = 0.0, 0
by_model = defaultdict(float)
for line in open("logs.jsonl", encoding="utf-8"):
    row = json.loads(line)
    if row["model"] not in PRICES:
        raise KeyError(f"Chưa có giá cho model {row['model']}")
    p_in, p_out = PRICES[row["model"]]
    cost = row["in"] / 1e6 * p_in + row["out"] / 1e6 * p_out
    total += cost
    count += 1
    by_model[row["model"]] += cost

print(f"Tổng: {total:.6f} USD cho {count} request")
print(f"Trung bình: {total / max(count, 1):.6f} USD/request")
for m, c in by_model.items():
    print(f"  {m}: {c:.6f} USD")</code></pre>
<p><strong>Kiểm tra kết quả:</strong> tính tay một dòng bất kỳ và so với script. Ví dụ 1.000 token vào, 500 token ra trên model giá (5, 25) thì chi phí là 0,005 + 0,0125 = 0,0175 USD.</p>
<p><strong>Lỗi thường gặp:</strong> nhầm giá theo 1K token với giá theo 1M token; quên cộng token cache (nếu dùng caching, cần thêm cột <code>cache_read_input_tokens</code> và giá đọc cache riêng); dùng giá nhớ từ trí nhớ thay vì tra trang Pricing.</p>`
      },
      {
        title: 'Bài 3 – Cấu hình retry và timeout',
        task: `<p>Tạo client với <code>max_retries=4</code>, <code>timeout=30.0</code>. Sau đó gọi một request với <code>client.with_options(timeout=5.0, max_retries=0)</code>. Giải thích khi nào nên tắt retry cho một request cụ thể.</p>`,
        hint: 'with_options trả về client mới cho một lần gọi, không thay đổi client gốc.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Tạo client mặc định cho toàn ứng dụng với <code>max_retries</code> và <code>timeout</code> hợp lý.</li>
<li>Với request cần phản hồi nhanh (ví dụ gợi ý tự động khi người dùng gõ), dùng <code>with_options</code> để đặt timeout ngắn và tắt retry.</li>
<li>Bắt <code>APITimeoutError</code> để có phương án dự phòng (hiện kết quả mặc định, không chặn giao diện).</li>
</ol>
<pre><code>import anthropic

client = anthropic.Anthropic(max_retries=4, timeout=30.0)

def quick_suggest(text):
    try:
        r = client.with_options(timeout=5.0, max_retries=0).messages.create(
            model="claude-haiku-4-5", max_tokens=100,
            messages=[{"role": "user", "content": f"Gợi ý 1 tiêu đề ngắn cho: {text}"}],
        )
        return r.content[0].text
    except anthropic.APITimeoutError:
        return None  # giao diện hiển thị không có gợi ý, không chờ thêm

print(quick_suggest("Hướng dẫn cài MCP GitHub cho Claude Code"))</code></pre>
<p><strong>Kiểm tra kết quả:</strong> thử đặt <code>timeout=0.01</code> để chắc chắn nhánh <code>APITimeoutError</code> chạy và hàm trả về <code>None</code> ngay, không bị treo.</p>
<p><strong>Lỗi thường gặp:</strong> tự viết vòng retry chồng lên retry của SDK (số lần thử nhân lên); đặt timeout TypeScript bằng giây (TS dùng mili giây); quên rằng mỗi lần retry cũng chờ đủ timeout nên tổng thời gian có thể dài hơn dự kiến.</p>`
      },
      {
        title: 'Bài 4 – Gọi song song với AsyncAnthropic',
        task: `<p>Dịch 10 câu sang tiếng Anh. Làm theo 2 cách: gọi tuần tự bằng client đồng bộ và gọi song song bằng <code>AsyncAnthropic</code> + <code>asyncio.gather</code>. So sánh tổng thời gian. Giới hạn tối đa 5 request đồng thời.</p>`,
        hint: 'Dùng asyncio.Semaphore(5) để không vượt rate limit.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Tạo <code>AsyncAnthropic()</code>; mọi lời gọi dùng <code>await</code>.</li>
<li>Bọc mỗi lời gọi trong <code>async with sem:</code> để giới hạn số request chạy cùng lúc.</li>
<li>Dùng <code>asyncio.gather</code> để chạy tất cả; kết quả trả về đúng thứ tự đầu vào.</li>
<li>Đo thời gian cả hai cách để so sánh.</li>
</ol>
<pre><code>import asyncio, time, anthropic

SENTENCES = [f"Câu số {i}: Hôm nay trời đẹp." for i in range(10)]
aclient = anthropic.AsyncAnthropic()
sem = asyncio.Semaphore(5)

async def translate(text):
    async with sem:
        r = await aclient.messages.create(
            model="claude-haiku-4-5", max_tokens=200,
            messages=[{"role": "user", "content": f"Dịch sang tiếng Anh, chỉ trả bản dịch: {text}"}],
        )
        return r.content[0].text

async def main():
    t0 = time.perf_counter()
    results = await asyncio.gather(*(translate(s) for s in SENTENCES))
    print(f"Song song: {time.perf_counter() - t0:.1f}s")
    for r in results:
        print(" -", r)

asyncio.run(main())</code></pre>
<p><strong>Kiểm tra kết quả:</strong> thời gian song song thường chỉ bằng khoảng 1/3 đến 1/5 so với tuần tự; 10 kết quả đúng thứ tự đầu vào.</p>
<p><strong>Lỗi thường gặp:</strong> dùng client đồng bộ bên trong hàm <code>async</code> (chặn event loop, mất tác dụng song song); không giới hạn đồng thời dẫn tới lỗi 429; với khối lượng lớn không cần realtime, nên dùng Batch API (bài bonus) thay vì bắn song song.</p>`
      }
    ],
    quiz: [
      {
        q: 'stop_reason = "tool_use" nghĩa là gì?',
        options: ['Có lỗi tool', 'Claude muốn gọi một tool; client cần chạy tool và gửi lại tool_result', 'Hội thoại kết thúc', 'Hết token'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> đây là tín hiệu để vòng lặp agent chạy tool rồi gửi <code>tool_result</code> để Claude tiếp tục.<br><strong>Vì sao các lựa chọn khác sai:</strong> lỗi tool được báo qua <code>is_error</code> trong tool_result, không phải stop_reason; hội thoại kết thúc là <code>end_turn</code>; hết token là <code>max_tokens</code>.'
      },
      {
        q: 'Lỗi nào KHÔNG nên retry tự động?',
        options: ['429 Rate limit', '529/503 quá tải', '400 Bad request', 'Lỗi mất kết nối'],
        answer: 2,
        explain: '<strong>Vì sao đúng:</strong> 400 do request sai (tham số, schema, model ID…). Gửi lại y hệt sẽ lỗi y hệt – phải sửa request.<br><strong>Vì sao các lựa chọn khác sai:</strong> rate limit, quá tải server và mất kết nối đều là lỗi tạm thời, retry có backoff thường thành công – SDK tự retry các lỗi này.'
      },
      {
        q: 'Cách lưu API key đúng?',
        options: ['Ghi thẳng vào code', 'Biến môi trường hoặc secret manager, không commit lên git', 'Để trong README', 'Gửi qua chat cho đồng đội'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> biến môi trường/secret manager giữ key ngoài mã nguồn; SDK tự đọc <code>ANTHROPIC_API_KEY</code>.<br><strong>Vì sao các lựa chọn khác sai:</strong> key trong code hay README sẽ bị lộ khi commit; gửi qua chat để lại bản sao ở nơi khó kiểm soát và khó thu hồi.'
      },
      {
        q: 'Mặc định SDK Anthropic retry một request lỗi tạm thời bao nhiêu lần?',
        options: ['0 lần', '2 lần', '5 lần', 'Không giới hạn'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> <code>max_retries</code> mặc định là 2, áp dụng cho lỗi kết nối và mã 408/409/429/5xx, có backoff luỹ thừa.<br><strong>Vì sao các lựa chọn khác sai:</strong> không retry là khi bạn tự đặt <code>max_retries=0</code>; 5 lần chỉ khi bạn tự cấu hình; retry không giới hạn sẽ nguy hiểm nên SDK không làm vậy.'
      },
      {
        q: 'Response có content gồm một khối thinking rồi một khối text. Cách đọc câu trả lời an toàn?',
        options: ['response.content[0].text', 'Lọc các block có type == "text" rồi ghép lại', 'response.text', 'response.content[-1]'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> content là danh sách block nhiều loại; lọc theo <code>type</code> luôn đúng dù thứ tự hay số block thay đổi.<br><strong>Vì sao các lựa chọn khác sai:</strong> phần tử đầu có thể là thinking (không có text trả lời); Messages API không có thuộc tính <code>response.text</code>; phần tử cuối là object block chứ không phải chuỗi, và có thể là tool_use.'
      },
      {
        q: 'Trong SDK Python, timeout=20.0 nghĩa là gì?',
        options: ['20 mili giây', '20 giây', '20 phút', '20 lần retry'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> SDK Python (và Ruby) tính timeout bằng giây.<br><strong>Vì sao các lựa chọn khác sai:</strong> mili giây là đơn vị của SDK TypeScript; 10 phút là giá trị mặc định chứ không liên quan tới số 20; timeout và số lần retry là hai tham số khác nhau.'
      }
    ],
    resources: [
      { t: 'Anthropic Academy – Building with the Claude API', url: 'https://anthropic.skilljar.com' },
      { t: 'API reference – Messages', url: 'https://docs.claude.com' }
    ]
  },

  {
    id: 'm2w2', month: 2, week: 2, duration: '6 giờ', domain: 'Claude API',
    title: 'Hội thoại nhiều lượt và streaming',
    objectives: [
      'Quản lý lịch sử hội thoại đúng cách',
      'Stream output theo thời gian thực',
      'Hiểu vì sao phải nối nguyên response.content vào lịch sử'
    ],
    flow: {
      title: 'Mỗi lượt: thêm user, gọi API, stream chữ, nối nguyên content',
      steps: [
        { kind: 'start', label: 'Người dùng gõ câu hỏi' },
        { kind: 'step', label: 'Append lượt user', detail: 'history.append({role: user, ...})' },
        { kind: 'step', label: 'messages.stream(history)', detail: 'Gửi lại TOÀN BỘ lịch sử', note: 'API stateless, không tự nhớ' },
        { kind: 'step', label: 'Nhận sự kiện SSE', detail: 'text_stream in từng đoạn chữ', note: 'Lặp tới khi message_stop' },
        { kind: 'step', label: 'get_final_message()', detail: 'Message hoàn chỉnh + usage' },
        { kind: 'step', label: 'Append nguyên content', detail: 'role assistant, giữ mọi block', note: 'Không chỉ lấy text' },
        { kind: 'decision', label: 'Lịch sử quá dài?', note: 'Có → tóm tắt / compaction' },
        { kind: 'end', label: 'Chờ câu hỏi tiếp theo' }
      ]
    },
    realExamples: [
      {
        title: 'Trợ lý tư vấn bảo hiểm trên Zalo OA',
        html: `<p>Một công ty bảo hiểm làm chatbot tư vấn trên Zalo OA. Bản đầu chỉ gửi câu hỏi mới nhất lên API, nên khi khách hỏi “gói đó phí bao nhiêu?”, Claude không biết “gói đó” là gói nào, vì API không lưu hội thoại.</p>
<p><strong>Sửa:</strong> lưu <code>history</code> theo từng khách trong Redis, mỗi lượt gửi lại toàn bộ lịch sử và nối nguyên <code>final.content</code> vào lịch sử. Thêm streaming nên chữ bắt đầu hiện ra sau khoảng 1 giây, thay vì khách phải chờ 8 giây mới thấy cả đoạn.</p>
<p><strong>Vấn đề tiếp theo:</strong> khách nói chuyện 60 lượt khiến mỗi request tốn hơn 30.000 token input. Team đặt ngưỡng: quá 20 lượt thì tóm tắt 10 lượt đầu. Chi phí trung bình mỗi hội thoại giảm khoảng 40%, còn thông tin quan trọng (tuổi, gói quan tâm) được giữ trong bản tóm tắt.</p>`
      },
      {
        title: 'Công cụ viết báo cáo nội bộ bị timeout',
        html: `<p>Phòng tài chính dùng script yêu cầu Claude viết báo cáo quý dài khoảng 6.000 từ. Khi gọi không streaming với <code>max_tokens</code> rất lớn, SDK báo phải dùng streaming, vì request dài dễ vượt timeout HTTP.</p>
<p><strong>Sửa:</strong> chuyển sang <code>client.messages.stream(...)</code> và dùng <code>get_final_message()</code> để lấy kết quả hoàn chỉnh. Cách này không cần xử lý từng sự kiện, vẫn nhận đủ <code>usage</code> và <code>stop_reason</code>.</p>
<pre><code>with client.messages.stream(model="claude-opus-5", max_tokens=64000,
                            messages=msgs) as s:
    final = s.get_final_message()</code></pre>
<p>Kết quả: không còn lỗi timeout, và giá vẫn như cũ vì streaming không thay đổi cách tính tiền. Sau đó team làm thêm một bước: in từng đoạn chữ ra giao diện nội bộ để người duyệt đọc trước phần đầu báo cáo trong lúc Claude vẫn đang viết phần sau. Nhờ vậy vòng duyệt sửa rút từ khoảng 40 phút xuống còn khoảng 25 phút mỗi báo cáo. Team cũng ghi lại <code>usage.output_tokens</code> của từng báo cáo để biết báo cáo nào dài bất thường và cần chia nhỏ yêu cầu.</p>`
      }
    ],
    recap: {
      summary: [
        'API không lưu trạng thái: mỗi lượt phải gửi lại toàn bộ lịch sử.',
        'Luôn nối nguyên response.content (không chỉ text) vào lịch sử với role assistant.',
        'Các lượt phải xen kẽ user → assistant.',
        'Streaming cho người dùng thấy chữ sớm và tránh timeout với output dài; giá không đổi.',
        'Lịch sử dài thì đắt: tóm tắt, compaction hoặc context editing, và giữ lịch sử chỉ nối thêm để cache hiệu quả.'
      ],
      tips: [
        'API như người mất trí nhớ ngắn hạn: mỗi lần gặp phải kể lại từ đầu.',
        '“Nối nguyên hộp, đừng bóc quà”: nối cả content, đừng chỉ lấy .text.',
        'Stream như xem phim online: xem được ngay, không phải tải hết mới xem, và giá vé như nhau.',
        'get_final_message() giống nút “tải về khi xem xong”: vừa stream vừa có bản đầy đủ.',
        'Bẫy đề thi: “streaming rẻ hơn” là sai.'
      ]
    },
    sections: [
      {
        h: '1. Hội thoại nhiều lượt',
        html: `<p>Mỗi lượt: thêm tin nhắn <code>user</code>, gọi API, rồi thêm <strong>nguyên</strong> <code>response.content</code> vào lịch sử dưới role <code>assistant</code>. Lý do: content có thể chứa khối <code>thinking</code>, <code>tool_use</code> hoặc khối compaction – chỉ lấy text sẽ làm mất trạng thái.</p>
<ul>
<li>Các lượt phải xen kẽ <code>user</code> → <code>assistant</code>.</li>
<li>Lịch sử càng dài càng tốn token: cần chiến lược cắt, tóm tắt hoặc compaction (tháng 5).</li>
<li>Giữ lịch sử <strong>append-only</strong> (chỉ nối thêm, không sửa lượt cũ) để prompt caching hoạt động hiệu quả.</li>
</ul>`
      },
      {
        h: '2. Streaming',
        html: `<p>Streaming trả từng phần output qua Server-Sent Events. Lợi ích:</p>
<ul>
<li>Người dùng thấy chữ xuất hiện ngay – trải nghiệm tốt hơn nhiều so với chờ toàn bộ.</li>
<li>Tránh timeout HTTP với output dài; SDK yêu cầu streaming khi <code>max_tokens</code> rất lớn.</li>
<li>Python: <code>client.messages.stream(...)</code> + <code>stream.text_stream</code>; lấy message hoàn chỉnh bằng <code>get_final_message()</code>.</li>
<li>TypeScript: <code>client.messages.stream(...)</code>, lắng nghe <code>.on("text", ...)</code> và lấy kết quả bằng <code>await stream.finalMessage()</code>.</li>
<li>Giá token như nhau dù stream hay không.</li>
</ul>`
      }
    ],
    code: [
      {
        title: 'Python – chatbot CLI có streaming', lang: 'python',
        src: `
import anthropic

client = anthropic.Anthropic()
history = []

while True:
    user_input = input("\\nBạn: ").strip()
    if user_input in {"exit", "quit"}:
        break
    history.append({"role": "user", "content": user_input})

    print("Claude: ", end="", flush=True)
    with client.messages.stream(
        model="claude-opus-5",
        max_tokens=64000,
        system="Bạn là trợ lý thân thiện, trả lời ngắn gọn bằng tiếng Việt.",
        messages=history,
    ) as stream:
        for text in stream.text_stream:
            print(text, end="", flush=True)
        final = stream.get_final_message()

    # Nối nguyên content (không chỉ text) để giữ đúng trạng thái
    history.append({"role": "assistant", "content": final.content})`
      }
    ],
    exercises: [
      {
        title: 'Bài 1 – Chatbot có lưu lịch sử ra file',
        task: `<p>Mở rộng chatbot: lưu <code>history</code> ra <code>chat.json</code> sau mỗi lượt và nạp lại khi khởi động. Thêm lệnh <code>/reset</code> để xoá lịch sử và <code>/tokens</code> in tổng token đã dùng.</p>`,
        hint: 'Content block của SDK là object – dùng block.model_dump() để chuyển thành dict trước khi json.dump.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Khi khởi động: nếu <code>chat.json</code> tồn tại thì nạp vào <code>history</code>.</li>
<li>Trước khi gọi API, xử lý lệnh đặc biệt <code>/reset</code>, <code>/tokens</code>.</li>
<li>Sau mỗi lượt, chuyển content block sang dict bằng <code>model_dump()</code> rồi lưu file.</li>
<li>Cộng dồn <code>usage.input_tokens + usage.output_tokens</code> vào biến đếm.</li>
</ol>
<pre><code>import json, os, anthropic

client = anthropic.Anthropic()
PATH = "chat.json"
history = json.load(open(PATH, encoding="utf-8")) if os.path.exists(PATH) else []
used = 0

def save():
    json.dump(history, open(PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

while True:
    text = input("\\nBạn: ").strip()
    if text == "/reset":
        history.clear(); save(); print("Đã xoá lịch sử."); continue
    if text == "/tokens":
        print(f"Đã dùng {used} token trong phiên này."); continue
    if text in {"exit", "quit"}:
        break
    history.append({"role": "user", "content": text})
    with client.messages.stream(model="claude-opus-5", max_tokens=64000, messages=history) as s:
        for chunk in s.text_stream:
            print(chunk, end="", flush=True)
        final = s.get_final_message()
    used += final.usage.input_tokens + final.usage.output_tokens
    history.append({"role": "assistant",
                    "content": [b.model_dump() for b in final.content]})
    save()</code></pre>
<p><strong>Kiểm tra kết quả:</strong> hỏi “Tên tôi là Đức”, thoát, chạy lại và hỏi “Tên tôi là gì?” – Claude trả lời đúng vì lịch sử đã được nạp lại.</p>
<p><strong>Lỗi thường gặp:</strong> <code>json.dump</code> trực tiếp object SDK (lỗi “not JSON serializable”); quên <code>ensure_ascii=False</code> khiến file khó đọc; lưu user message nhưng request lỗi, dẫn tới hai lượt user liên tiếp – nên chỉ lưu sau khi gọi API thành công.</p>`
      },
      {
        title: 'Bài 2 – Giới hạn độ dài lịch sử',
        task: `<p>Khi lịch sử vượt 20 lượt, hãy tóm tắt 10 lượt đầu thành một đoạn ngắn bằng Claude và thay thế chúng bằng một lượt <code>user</code> chứa bản tóm tắt. Thảo luận: cách này ảnh hưởng gì tới prompt caching?</p>`,
        hint: 'Đảm bảo lượt đầu tiên sau khi thay vẫn là role "user" và các lượt vẫn xen kẽ.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Khi <code>len(history) &gt; 20</code>, tách 10 phần tử đầu (5 cặp user/assistant) ra.</li>
<li>Chuyển phần đó thành văn bản thuần và nhờ Claude tóm tắt.</li>
<li>Thay bằng một lượt user chứa tóm tắt, rồi một lượt assistant xác nhận, để giữ xen kẽ.</li>
</ol>
<pre><code>def to_text(msgs):
    out = []
    for m in msgs:
        c = m["content"]
        if isinstance(c, list):
            c = " ".join(b.get("text", "") for b in c if b.get("type") == "text")
        out.append(f"{m['role']}: {c}")
    return "\\n".join(out)

def shrink(history):
    if len(history) &lt;= 20:
        return history
    old, rest = history[:10], history[10:]
    summary = client.messages.create(
        model="claude-haiku-4-5", max_tokens=500,
        messages=[{"role": "user", "content":
                   "Tóm tắt các ý chính và dữ kiện cần nhớ của đoạn hội thoại sau:\\n" + to_text(old)}],
    ).content[0].text
    return [
        {"role": "user", "content": f"Tóm tắt phần trước của cuộc trò chuyện: {summary}"},
        {"role": "assistant", "content": "Đã hiểu, tôi sẽ tiếp tục dựa trên tóm tắt này."},
    ] + rest</code></pre>
<p><strong>Kiểm tra kết quả:</strong> sau khi rút gọn, <code>history[0]["role"] == "user"</code> và các lượt vẫn xen kẽ; Claude vẫn nhớ dữ kiện quan trọng (ví dụ tên người dùng).</p>
<p><strong>Lỗi thường gặp:</strong> cắt số lẻ phần tử khiến hai lượt cùng role đứng cạnh nhau; rút gọn mỗi lượt (phá cache liên tục). Về caching: tóm tắt thay đổi tiền tố nên cache cũ mất hiệu lực – chấp nhận được nếu làm thưa. API còn có compaction phía server (beta) và context editing – xem tháng 5.</p>`
      },
      {
        title: 'Bài 3 – Streaming bằng TypeScript',
        task: `<p>Viết script Node.js stream câu trả lời ra terminal và cuối cùng in <code>usage</code> của message hoàn chỉnh.</p>`,
        hint: 'stream.on("text", ...) nhận từng đoạn text; await stream.finalMessage() trả message đầy đủ.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li><code>npm install @anthropic-ai/sdk</code>, tạo file <code>stream.mjs</code>.</li>
<li>Gọi <code>client.messages.stream({...})</code>, đăng ký <code>.on("text")</code> để in từng đoạn.</li>
<li>Dùng <code>await stream.finalMessage()</code> để lấy message đầy đủ – không tự bọc sự kiện trong <code>new Promise</code>.</li>
</ol>
<pre><code>import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const stream = client.messages
  .stream({
    model: "claude-opus-5",
    max_tokens: 64000,
    messages: [{ role: "user", content: "Viết một đoạn giới thiệu 150 từ về MCP." }],
  })
  .on("text", (text) =&gt; process.stdout.write(text));

const message = await stream.finalMessage();
console.log("\\n\\nstop_reason:", message.stop_reason);
console.log("usage:", message.usage);</code></pre>
<p><strong>Kiểm tra kết quả:</strong> chạy <code>node stream.mjs</code>, chữ hiện dần; cuối cùng in stop_reason <code>end_turn</code> và số token.</p>
<p><strong>Lỗi thường gặp:</strong> dùng <code>console.log</code> cho từng đoạn (mỗi đoạn một dòng); tự viết Promise quanh sự kiện thay vì dùng <code>finalMessage()</code>; đặt file đuôi <code>.js</code> mà không có <code>"type": "module"</code> nên không dùng được <code>import</code>/top-level await.</p>`
      },
      {
        title: 'Bài 4 – Đo thời gian tới chữ đầu tiên',
        task: `<p>Đo và so sánh: (a) thời gian tới đoạn text đầu tiên khi stream; (b) tổng thời gian khi không stream, cho cùng một prompt dài. Giải thích vì sao streaming cải thiện trải nghiệm dù tổng thời gian gần như không đổi.</p>`,
        hint: 'Ghi thời điểm lần đầu vòng lặp text_stream trả dữ liệu.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Ghi <code>t0</code> trước khi gọi, <code>first</code> khi nhận đoạn text đầu tiên, <code>end</code> khi xong.</li>
<li>Gọi lại cùng prompt không stream, đo tổng thời gian.</li>
<li>So sánh ba con số.</li>
</ol>
<pre><code>import time, anthropic
client = anthropic.Anthropic()
PROMPT = [{"role": "user", "content": "Viết bài 600 từ về lịch sử Internet."}]

t0 = time.perf_counter(); first = None
with client.messages.stream(model="claude-opus-5", max_tokens=64000, messages=PROMPT) as s:
    for _ in s.text_stream:
        if first is None:
            first = time.perf_counter() - t0
    s.get_final_message()
stream_total = time.perf_counter() - t0

t0 = time.perf_counter()
client.messages.create(model="claude-opus-5", max_tokens=16000, messages=PROMPT)
plain_total = time.perf_counter() - t0

print(f"Stream: chữ đầu sau {first:.1f}s, xong sau {stream_total:.1f}s")
print(f"Không stream: người dùng chờ {plain_total:.1f}s mới thấy gì")</code></pre>
<p><strong>Kiểm tra kết quả:</strong> thời gian tới chữ đầu thường chỉ vài giây, trong khi bản không stream bắt người dùng chờ toàn bộ thời gian sinh output.</p>
<p><strong>Lỗi thường gặp:</strong> kết luận streaming “nhanh hơn” – thực ra tổng thời gian gần như bằng nhau; streaming giảm <em>độ trễ cảm nhận</em> và tránh timeout, không giảm chi phí.</p>`
      }
    ],
    quiz: [
      {
        q: 'Sau mỗi lượt, nên thêm gì vào lịch sử?',
        options: ['Chỉ response.content[0].text', 'Nguyên response.content dưới role assistant', 'Chỉ usage', 'Không cần thêm gì'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> content có thể chứa thinking, tool_use hoặc compaction block cần được giữ nguyên cho lượt sau.<br><strong>Vì sao các lựa chọn khác sai:</strong> chỉ lấy text đầu tiên làm mất các block khác (và có thể lỗi nếu block đầu không phải text); usage chỉ là số liệu thống kê; API stateless nên không thêm gì thì Claude “quên” lượt trước.'
      },
      {
        q: 'Lợi ích quan trọng nhất của streaming với output dài?',
        options: ['Rẻ hơn', 'Tránh timeout HTTP và người dùng thấy kết quả sớm', 'Chính xác hơn', 'Không tính token output'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> streaming giữ kết nối hoạt động liên tục và hiển thị chữ ngay khi được sinh ra.<br><strong>Vì sao các lựa chọn khác sai:</strong> giá token như nhau; chất lượng câu trả lời không phụ thuộc cách truyền; token output vẫn được tính bình thường.'
      },
      {
        q: 'Vì sao Messages API cần client gửi lại toàn bộ lịch sử mỗi lượt?',
        options: ['Để tăng chi phí', 'API là stateless – server không lưu hội thoại giữa các request', 'Vì streaming yêu cầu', 'Chỉ khi dùng tool'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> mỗi request độc lập; ngữ cảnh chỉ gồm những gì bạn gửi.<br><strong>Vì sao các lựa chọn khác sai:</strong> việc tốn thêm token là hệ quả, không phải mục đích (và giảm được bằng caching); streaming không liên quan; tool hay không tool thì API vẫn stateless.'
      },
      {
        q: 'Muốn prompt caching hiệu quả trong hội thoại dài, lịch sử nên được quản lý thế nào?',
        options: ['Sắp xếp lại các lượt theo độ quan trọng', 'Append-only: chỉ nối thêm lượt mới, không sửa lượt cũ', 'Xoá system prompt sau lượt đầu', 'Đảo ngược thứ tự'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> cache dựa trên tiền tố giống hệt từng byte; chỉ nối thêm thì phần đầu luôn khớp cache.<br><strong>Vì sao các lựa chọn khác sai:</strong> sắp xếp lại hoặc đảo thứ tự làm thay đổi tiền tố nên cache mất hiệu lực; xoá system prompt đổi toàn bộ tiền tố và làm Claude mất chỉ dẫn.'
      },
      {
        q: 'Trong SDK TypeScript, cách lấy message hoàn chỉnh sau khi stream được khuyến nghị?',
        options: ['Tự bọc các sự kiện trong new Promise', 'await stream.finalMessage()', 'Gọi lại messages.create', 'Đọc response.text'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> <code>finalMessage()</code> là helper chính thức, trả message đầy đủ gồm content, stop_reason và usage.<br><strong>Vì sao các lựa chọn khác sai:</strong> tự bọc Promise là viết lại tính năng SDK đã có, dễ sót lỗi; gọi lại create tốn gấp đôi chi phí; không có thuộc tính <code>response.text</code>.'
      },
      {
        q: 'Hai lượt role "user" liên tiếp xuất hiện trong lịch sử do lượt trước bị lỗi mạng. Cách xử lý đúng?',
        options: ['Bỏ qua, API tự xử lý', 'Chỉ lưu lượt user vào lịch sử sau khi request thành công, hoặc gộp/xoá lượt user bị treo', 'Chèn một lượt assistant rỗng', 'Đổi role thành system'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> giữ lịch sử nhất quán ngay từ code ứng dụng: chỉ ghi nhận lượt khi có phản hồi, hoặc dọn lượt user bị treo trước khi gửi lại.<br><strong>Vì sao các lựa chọn khác sai:</strong> không nên trông chờ API “tự sửa” dữ liệu lịch sử sai của bạn; lượt assistant rỗng là nội dung giả gây nhiễu; đổi sang role system làm sai ý nghĩa tin nhắn của người dùng.'
      }
    ],
    resources: [
      { t: 'Streaming messages – docs.claude.com', url: 'https://docs.claude.com' }
    ]
  },

  {
    id: 'm2w3', month: 2, week: 3, duration: '7 giờ', domain: 'Claude API',
    title: 'Structured outputs, ảnh và PDF',
    objectives: [
      'Nhận JSON đúng schema bằng structured outputs',
      'Dùng Pydantic với client.messages.parse()',
      'Bật strict tool use để tham số tool luôn hợp lệ',
      'Gửi ảnh và PDF cho Claude phân tích'
    ],
    flow: {
      title: 'Schema chặt ở đầu vào nên nhận được JSON hợp lệ ở đầu ra',
      steps: [
        { kind: 'start', label: 'Định nghĩa schema', detail: 'Pydantic hoặc JSON Schema', note: 'additionalProperties: false + required' },
        { kind: 'step', label: 'Chuẩn bị content blocks', detail: 'document (PDF) / image + text' },
        { kind: 'step', label: 'Gọi messages.parse()', detail: 'hoặc create() + output_config.format' },
        { kind: 'step', label: 'Claude sinh output', detail: 'Bị ràng buộc đúng schema' },
        { kind: 'decision', label: 'stop_reason = end_turn?', note: 'max_tokens → JSON bị cắt, tăng trần' },
        { kind: 'step', label: 'Đọc parsed_output', detail: 'Object đã được validate' },
        { kind: 'end', label: 'Ghi vào database / hệ thống' }
      ]
    },
    realExamples: [
      {
        title: 'Kế toán nhập hoá đơn VAT từ PDF',
        html: `<p>Một công ty logistics mỗi tháng nhận khoảng 3.000 hoá đơn VAT dạng PDF từ nhà cung cấp. Trước đây 2 kế toán nhập tay mất khoảng 5 ngày và hay gõ nhầm mã số thuế.</p>
<p><strong>Giải pháp:</strong> định nghĩa Pydantic <code>Invoice</code> với các trường mã số thuế, ngày, tổng tiền và danh sách dòng hàng. Gửi PDF dạng <code>document</code> block rồi gọi <code>messages.parse(..., output_format=Invoice)</code>. Output luôn đúng schema nên ghi thẳng vào ERP được, không cần regex hay kiểm tra “JSON có hợp lệ không”.</p>
<p><strong>Kiểm soát chất lượng:</strong> code tự kiểm tra tổng các dòng hàng có khớp tổng tiền không. Hoá đơn nào lệch thì đẩy sang hàng đợi cho người duyệt, chiếm khoảng 4%. Thời gian xử lý còn 1 ngày, lỗi mã số thuế gần như không còn.</p>`
      },
      {
        title: 'Hỗ trợ kỹ thuật đọc ảnh chụp màn hình lỗi',
        html: `<p>Khách hàng của một phần mềm bán hàng thường gửi ảnh chụp màn hình lỗi qua email. Hệ thống gửi ảnh cho Claude dưới dạng <code>image</code> block, kèm schema <code>{error_message, likely_cause, fix_steps[]}</code> trong <code>output_config.format</code>.</p>
<pre><code>output_config={"format": {"type": "json_schema", "schema": ERROR_SCHEMA}}</code></pre>
<p>JSON trả về được dùng để tự tạo ticket với tiêu đề là <code>error_message</code> và gợi ý các bước khắc phục cho nhân viên. Nhân viên hỗ trợ không phải gõ lại nội dung lỗi từ ảnh, nên thời gian phản hồi đầu tiên giảm từ khoảng 2 giờ xuống 15 phút.</p>
<p><strong>Lưu ý:</strong> <code>media_type</code> phải khớp với định dạng ảnh (<code>image/png</code>, <code>image/jpeg</code>). Không cần trích dẫn nguồn ở đây vì citations không dùng chung được với structured outputs.</p>`
      }
    ],
    recap: {
      summary: [
        'JSON outputs: output_config.format với type json_schema; tham số output_format cũ trên create() đã deprecated.',
        'Python: messages.parse(output_format=PydanticModel) rồi đọc response.parsed_output.',
        'Strict tool use: "strict": true trên định nghĩa tool để input khớp schema.',
        'Schema cần additionalProperties: false và danh sách required.',
        'Ảnh dùng image block, PDF dùng document block (đặt trước text); file dùng nhiều lần thì upload qua Files API.'
      ],
      tips: [
        'Nhớ cặp “format cho câu trả lời, strict cho tool”.',
        'Structured output như biểu mẫu có ô sẵn: Claude chỉ được điền vào đúng ô.',
        'PDF thì “document”, ảnh thì “image”, và luôn đặt tài liệu trước câu hỏi.',
        'Bẫy đề thi: prefill “{” hoặc viết “CHỈ TRẢ JSON” bằng chữ hoa đều không phải cách đúng trên model mới.',
        'Trường không có dữ liệu thì để None, không để model tự bịa.'
      ]
    },
    sections: [
      {
        h: '1. Structured outputs',
        html: `<p>Có hai cơ chế:</p>
<ul>
<li><strong>JSON outputs</strong>: <code>output_config={"format": {"type": "json_schema", "schema": {...}}}</code> – câu trả lời là JSON hợp lệ theo schema. Tham số cũ <code>output_format</code> trên <code>messages.create()</code> đã deprecated.</li>
<li><strong>Strict tool use</strong>: đặt <code>"strict": true</code> trên định nghĩa tool – đảm bảo <code>tool_use.input</code> khớp schema.</li>
</ul>
<p>Schema cần <code>"additionalProperties": false</code> và liệt kê <code>required</code>. Với Python, cách gọn nhất là <code>client.messages.parse(..., output_format=MyPydanticModel)</code> rồi đọc <code>response.parsed_output</code>.</p>
<div class="callout">Structured outputs không dùng chung được với Citations (trả lỗi 400). Nếu cần cả trích dẫn và JSON, tách thành hai bước.</div>`
      },
      {
        h: '2. Ảnh và PDF',
        html: `<ul>
<li><strong>Ảnh</strong>: content block <code>{"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": ...}}</code> hoặc source dạng URL.</li>
<li><strong>PDF</strong>: <code>{"type": "document", "source": {"type": "base64", "media_type": "application/pdf", "data": ...}}</code>, đặt trước text block. Chuỗi base64 không được có ký tự xuống dòng. Claude đọc cả chữ lẫn hình trong PDF.</li>
<li>File dùng nhiều lần: upload qua <strong>Files API</strong> rồi tham chiếu bằng <code>file_id</code> (xem bài bonus).</li>
</ul>`
      }
    ],
    code: [
      {
        title: 'Python – trích xuất hoá đơn bằng Pydantic', lang: 'python',
        src: `
import base64
from pydantic import BaseModel
import anthropic

class LineItem(BaseModel):
    name: str
    quantity: int
    unit_price: float

class Invoice(BaseModel):
    vendor: str
    invoice_date: str
    total: float
    items: list[LineItem]

client = anthropic.Anthropic()
pdf_b64 = base64.standard_b64encode(open("invoice.pdf", "rb").read()).decode()

response = client.messages.parse(
    model="claude-opus-5",
    max_tokens=16000,
    messages=[{
        "role": "user",
        "content": [
            {"type": "document", "source": {"type": "base64",
             "media_type": "application/pdf", "data": pdf_b64}},
            {"type": "text", "text": "Trích xuất thông tin hoá đơn này."},
        ],
    }],
    output_format=Invoice,
)

invoice = response.parsed_output
print(invoice.vendor, invoice.total, len(invoice.items))`
      }
    ],
    exercises: [
      {
        title: 'Bài 1 – Trích xuất CV',
        task: `<p>Định nghĩa schema <code>Candidate</code> (họ tên, email, số năm kinh nghiệm, danh sách kỹ năng, học vấn). Trích xuất từ 3 file CV PDF khác nhau và lưu thành <code>candidates.json</code>.</p>`,
        hint: 'Trường có thể thiếu → khai báo Optional[str] = None trong Pydantic.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Định nghĩa model Pydantic; trường có thể không có trong CV khai báo <code>Optional</code>.</li>
<li>Viết hàm đọc PDF → base64 → gọi <code>messages.parse</code> với <code>output_format=Candidate</code>.</li>
<li>Thêm chỉ dẫn: thông tin không có trong CV thì để trống, không suy đoán.</li>
<li>Lặp qua 3 file, gom kết quả bằng <code>model_dump()</code> rồi ghi JSON.</li>
</ol>
<pre><code>import base64, json
from typing import Optional
from pydantic import BaseModel
import anthropic

class Candidate(BaseModel):
    full_name: str
    email: Optional[str] = None
    years_experience: Optional[float] = None
    skills: list[str]
    education: Optional[str] = None

client = anthropic.Anthropic()

def extract(path):
    data = base64.standard_b64encode(open(path, "rb").read()).decode()
    r = client.messages.parse(
        model="claude-opus-5", max_tokens=16000,
        messages=[{"role": "user", "content": [
            {"type": "document", "source": {"type": "base64",
             "media_type": "application/pdf", "data": data}},
            {"type": "text", "text": "Trích xuất thông tin ứng viên. "
             "Thông tin nào CV không nêu thì để trống, không suy đoán."},
        ]}],
        output_format=Candidate,
    )
    return r.parsed_output

results = [extract(p).model_dump() for p in ["cv1.pdf", "cv2.pdf", "cv3.pdf"]]
json.dump(results, open("candidates.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)</code></pre>
<p><strong>Kiểm tra kết quả:</strong> dùng một CV cố ý bỏ email – trường <code>email</code> phải là <code>null</code> chứ không phải email bịa.</p>
<p><strong>Lỗi thường gặp:</strong> khai báo mọi trường bắt buộc khiến model buộc phải điền giá trị bịa; đặt text block trước document block (nên đặt tài liệu trước); base64 có ký tự xuống dòng (dùng <code>standard_b64encode</code> như trên là an toàn).</p>`
      },
      {
        title: 'Bài 2 – Mô tả ảnh chụp màn hình lỗi',
        task: `<p>Gửi ảnh chụp màn hình thông báo lỗi và yêu cầu Claude trả về JSON: <code>{"error_message", "likely_cause", "fix_steps": []}</code>.</p>`,
        hint: 'media_type phải khớp định dạng file (image/png, image/jpeg…).',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Đọc ảnh, mã hoá base64, chọn <code>media_type</code> theo đuôi file.</li>
<li>Khai báo JSON schema 3 trường, <code>additionalProperties: false</code>.</li>
<li>Gọi <code>messages.create</code> với <code>output_config.format</code>, rồi <code>json.loads</code> block text.</li>
</ol>
<pre><code>import base64, json, mimetypes, anthropic

client = anthropic.Anthropic()
path = "error.png"
media_type = mimetypes.guess_type(path)[0]  # "image/png"
img = base64.standard_b64encode(open(path, "rb").read()).decode()

schema = {
    "type": "object",
    "properties": {
        "error_message": {"type": "string"},
        "likely_cause": {"type": "string"},
        "fix_steps": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["error_message", "likely_cause", "fix_steps"],
    "additionalProperties": False,
}

r = client.messages.create(
    model="claude-opus-5", max_tokens=4096,
    output_config={"format": {"type": "json_schema", "schema": schema}},
    messages=[{"role": "user", "content": [
        {"type": "image", "source": {"type": "base64", "media_type": media_type, "data": img}},
        {"type": "text", "text": "Phân tích lỗi trong ảnh chụp màn hình này."},
    ]}],
)
text = next(b.text for b in r.content if b.type == "text")
print(json.dumps(json.loads(text), ensure_ascii=False, indent=2))</code></pre>
<p><strong>Kiểm tra kết quả:</strong> output luôn là JSON hợp lệ có đủ 3 trường; <code>fix_steps</code> là mảng các bước cụ thể.</p>
<p><strong>Lỗi thường gặp:</strong> <code>media_type</code> không khớp nội dung file; thiếu <code>additionalProperties: false</code>; parse bằng regex thay vì <code>json.loads</code>.</p>`
      },
      {
        title: 'Bài 3 – Phân loại ticket với enum',
        task: `<p>Dùng <code>output_config.format</code> với schema có <code>category</code> là enum (<code>billing</code>, <code>bug</code>, <code>feature_request</code>, <code>other</code>) và <code>priority</code> là số nguyên 1–3. Chạy với 5 ticket mẫu.</p>`,
        hint: 'Mô tả ý nghĩa từng mức priority trong prompt để kết quả nhất quán.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Khai báo schema với <code>enum</code> cho category và priority.</li>
<li>Trong prompt, định nghĩa rõ: 1 = khẩn (hệ thống ngừng), 2 = ảnh hưởng một phần, 3 = thấp.</li>
<li>Lặp qua ticket, parse JSON, in bảng kết quả.</li>
</ol>
<pre><code>import json, anthropic
client = anthropic.Anthropic()

SCHEMA = {"type": "json_schema", "schema": {
    "type": "object",
    "properties": {
        "category": {"type": "string", "enum": ["billing", "bug", "feature_request", "other"]},
        "priority": {"type": "integer", "enum": [1, 2, 3]},
        "reason": {"type": "string"},
    },
    "required": ["category", "priority", "reason"],
    "additionalProperties": False,
}}

GUIDE = ("Phân loại ticket. priority: 1 = hệ thống ngừng hoạt động hoặc mất tiền, "
         "2 = ảnh hưởng một phần người dùng, 3 = câu hỏi hoặc đề xuất.")

tickets = ["Không đăng nhập được, toàn bộ công ty bị chặn!",
           "Bị trừ tiền 2 lần tháng này",
           "Nên có chế độ tối (dark mode)",
           "Nút Xuất PDF thỉnh thoảng không phản hồi",
           "Văn phòng mở cửa mấy giờ?"]

for t in tickets:
    r = client.messages.create(
        model="claude-opus-5", max_tokens=1024, output_config={"format": SCHEMA},
        messages=[{"role": "user", "content": f"{GUIDE}\\n&lt;ticket&gt;{t}&lt;/ticket&gt;"}],
    )
    d = json.loads(r.content[0].text)
    print(f"[{d['category']:&lt;15}] P{d['priority']} – {t}")</code></pre>
<p><strong>Kiểm tra kết quả:</strong> ticket đăng nhập thường là bug P1; trừ tiền hai lần là billing P1; dark mode là feature_request P3.</p>
<p><strong>Lỗi thường gặp:</strong> không định nghĩa các mức priority khiến kết quả dao động; quên trường <code>reason</code> nên khó debug khi phân loại sai.</p>`
      },
      {
        title: 'Bài 4 – Strict tool use đặt vé',
        task: `<p>Định nghĩa tool <code>book_flight</code> với <code>"strict": true</code>, tham số <code>destination</code>, <code>date</code> (định dạng date), <code>passengers</code> (enum 1–8). Gửi yêu cầu “Đặt vé đi Tokyo cho 2 người ngày 15/3/2027” và in <code>tool_use.input</code>.</p>`,
        hint: 'strict là trường cấp cao nhất trên tool, cạnh name/description/input_schema.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Khai báo tool có <code>strict: True</code>, schema có <code>required</code> và <code>additionalProperties: False</code>.</li>
<li>Gọi API với <code>tools=[...]</code>.</li>
<li>Tìm block <code>tool_use</code> và in <code>block.input</code> (đã là dict, không cần parse chuỗi).</li>
</ol>
<pre><code>import anthropic
client = anthropic.Anthropic()

tool = {
    "name": "book_flight",
    "description": "Đặt vé máy bay tới một điểm đến vào một ngày cụ thể.",
    "strict": True,
    "input_schema": {
        "type": "object",
        "properties": {
            "destination": {"type": "string"},
            "date": {"type": "string", "format": "date"},
            "passengers": {"type": "integer", "enum": [1, 2, 3, 4, 5, 6, 7, 8]},
        },
        "required": ["destination", "date", "passengers"],
        "additionalProperties": False,
    },
}

r = client.messages.create(
    model="claude-opus-5", max_tokens=4096, tools=[tool],
    messages=[{"role": "user", "content": "Đặt vé đi Tokyo cho 2 người ngày 15/3/2027"}],
)
for b in r.content:
    if b.type == "tool_use":
        print(b.name, b.input)  # {'destination': 'Tokyo', 'date': '2027-03-15', 'passengers': 2}</code></pre>
<p><strong>Kiểm tra kết quả:</strong> <code>date</code> ở dạng YYYY-MM-DD, <code>passengers</code> là số nguyên; stop_reason là <code>tool_use</code>.</p>
<p><strong>Lỗi thường gặp:</strong> đặt <code>strict</code> trong <code>tool_choice</code> thay vì trên tool; so khớp chuỗi JSON thô của input (luôn đọc như object vì cách escape có thể khác nhau).</p>`
      }
    ],
    quiz: [
      {
        q: 'Tham số đúng để nhận JSON theo schema trên messages.create()?',
        options: ['output_format', 'output_config.format với type json_schema', 'response_format', 'json_mode=True'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> <code>output_config: {format: {type: "json_schema", schema: ...}}</code> là cách hiện tại trên <code>messages.create()</code>.<br><strong>Vì sao các lựa chọn khác sai:</strong> <code>output_format</code> trên create() đã deprecated (chỉ còn dùng với helper <code>messages.parse</code>); <code>response_format</code> và <code>json_mode</code> không phải tham số của Claude API.'
      },
      {
        q: 'Muốn tham số tool luôn khớp schema, bạn đặt gì?',
        options: ['"strict": true trên định nghĩa tool', 'tool_choice strict', 'temperature=0', 'Không làm được'],
        answer: 0,
        explain: '<strong>Vì sao đúng:</strong> strict là trường cấp cao nhất trên tool, cạnh name/description/input_schema, đảm bảo input hợp lệ.<br><strong>Vì sao các lựa chọn khác sai:</strong> tool_choice chỉ điều khiển việc có gọi tool hay không, không có chế độ strict; temperature không đảm bảo schema (và bị bỏ trên nhiều model mới); strict tool use là tính năng có thật.'
      },
      {
        q: 'Schema dùng cho structured outputs cần có gì?',
        options: ['additionalProperties: false và danh sách required', 'Chỉ cần type: object', 'Trường default cho mọi thuộc tính', 'Không cần gì'],
        answer: 0,
        explain: '<strong>Vì sao đúng:</strong> các ràng buộc này giúp output khớp chính xác các trường bạn khai báo.<br><strong>Vì sao các lựa chọn khác sai:</strong> chỉ khai báo object thì không giới hạn các trường; default không bắt buộc; schema lỏng khiến dữ liệu khó tin cậy.'
      },
      {
        q: 'Trong messages.parse() của Python, đọc kết quả đã validate ở đâu?',
        options: ['response.content[0].text', 'response.parsed_output', 'response.json()', 'response.data'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> <code>parsed_output</code> là instance Pydantic đã được kiểm tra theo model bạn truyền.<br><strong>Vì sao các lựa chọn khác sai:</strong> text block chỉ là chuỗi JSON chưa kiểm tra kiểu; <code>json()</code> và <code>data</code> không phải thuộc tính của response này.'
      },
      {
        q: 'Muốn vừa có trích dẫn (citations) vừa có JSON theo schema. Điều gì đúng?',
        options: ['Bật cả hai trong một request là được', 'Citations không dùng chung được với output_config.format (400) – tách thành hai bước', 'Citations tự sinh JSON', 'Chỉ dùng được với Haiku'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> hai tính năng này không tương thích trong cùng một request; cách làm là bước 1 lấy câu trả lời có trích dẫn, bước 2 chuyển sang JSON.<br><strong>Vì sao các lựa chọn khác sai:</strong> bật cả hai trả lỗi 400; citations trả text chia block kèm vị trí, không phải JSON theo schema; không có giới hạn theo model như vậy.'
      },
      {
        q: 'Gửi PDF dạng base64 cho Claude, điều nào cần lưu ý?',
        options: ['Đặt document block trước text block và chuỗi base64 không có ký tự xuống dòng', 'Phải chuyển PDF thành ảnh trước', 'Chỉ đọc được chữ, không đọc hình', 'PDF phải dưới 1 trang'],
        answer: 0,
        explain: '<strong>Vì sao đúng:</strong> đó là hai yêu cầu định dạng quan trọng; tài liệu đặt trước câu hỏi cũng cho kết quả tốt hơn.<br><strong>Vì sao các lựa chọn khác sai:</strong> Claude nhận PDF trực tiếp, không cần chuyển thành ảnh; Claude đọc được cả chữ lẫn hình; giới hạn thực tế là hàng trăm trang và 32 MB mỗi request.'
      }
    ],
    resources: [
      { t: 'Structured outputs – docs.claude.com', url: 'https://docs.claude.com' },
      { t: 'Vision & PDF support – docs.claude.com', url: 'https://docs.claude.com' }
    ]
  },

  {
    id: 'm2w4', month: 2, week: 4, duration: '8 giờ', domain: 'Tool Design & MCP',
    title: 'Tool use: vòng lặp tool_use → tool_result',
    objectives: [
      'Định nghĩa tool với name, description, input_schema',
      'Tự viết vòng lặp agent thủ công',
      'Xử lý nhiều tool gọi song song và lỗi tool'
    ],
    flow: {
      title: 'Tool use: Claude xin gọi tool, code của bạn chạy và trả kết quả',
      steps: [
        { kind: 'start', label: 'Gửi messages + tools', detail: 'name, description, input_schema' },
        { kind: 'step', label: 'Claude trả response', detail: 'Có thể chứa nhiều tool_use block' },
        { kind: 'decision', label: 'stop_reason = tool_use?', note: 'end_turn → đọc text, kết thúc' },
        { kind: 'step', label: 'Code của bạn chạy tool', detail: 'Chạy song song được', note: 'Claude không tự chạy client tool' },
        { kind: 'step', label: 'Gom mọi tool_result', detail: 'tool_use_id khớp; lỗi → is_error' },
        { kind: 'step', label: 'Append assistant + 1 lượt user', detail: 'Tất cả kết quả trong MỘT lượt', loopTo: 1, loopLabel: 'gọi lại API' },
        { kind: 'end', label: 'Trả lời cuối cho người dùng', note: 'Luôn có giới hạn số vòng' }
      ]
    },
    realExamples: [
      {
        title: 'Chatbot tra đơn hàng của sàn thương mại điện tử',
        html: `<p>Khách hỏi: “Đơn A123 và B456 của tôi tới đâu rồi?”. Claude trả về <strong>2 khối <code>tool_use</code></strong> gọi <code>lookup_order</code> trong cùng một response. Code chạy 2 truy vấn song song rồi trả cả 2 <code>tool_result</code> trong <strong>một</strong> lượt user.</p>
<p><strong>Lỗi team từng mắc:</strong> gửi mỗi kết quả trong một lượt riêng. Sau một thời gian, Claude dần chuyển sang gọi tool tuần tự từng cái, nên thời gian trả lời tăng gấp đôi.</p>
<p><strong>Tình huống lỗi:</strong> đơn B456 không tồn tại. Code trả <code>is_error: true</code> kèm thông báo “Không tìm thấy B456. Mã đơn có dạng 1 chữ cái và 3 số”. Claude báo trạng thái đơn A123 và lịch sự hỏi lại khách mã đơn thứ hai, thay vì tự bịa ra một trạng thái.</p>`
      },
      {
        title: 'Agent đặt phòng họp bị lặp vô hạn',
        html: `<p>Một startup làm agent đặt phòng họp có tool <code>book_room</code>. Một hôm API lịch của Google bị lỗi, tool liên tục trả lỗi, và agent thử lại 140 lần trong 10 phút, đốt khoảng 2 triệu token.</p>
<p><strong>Sửa:</strong> thêm <code>MAX_TURNS = 10</code>, retry có backoff ở tầng tool, và thông báo lỗi rõ ràng (“Dịch vụ lịch tạm thời không khả dụng, hãy báo người dùng thử lại sau”). Sau khi vượt giới hạn, agent dừng và báo người dùng.</p>
<pre><code>for turn in range(MAX_TURNS):
    ...
else:
    raise RuntimeError("Vượt giới hạn vòng lặp")</code></pre>
<p>Bài học: agent chạy production <strong>luôn</strong> phải có giới hạn số vòng lặp, timeout và log cho từng lần gọi tool. Team còn đặt cảnh báo khi một hội thoại vượt 50.000 token để phát hiện sớm những vòng lặp bất thường như lần sự cố này.</p>`
      }
    ],
    recap: {
      summary: [
        'Tool = name + description + input_schema; description là prompt quyết định khi nào dùng tool.',
        'stop_reason = tool_use thì code của bạn chạy tool, gửi tool_result với tool_use_id khớp, rồi lặp lại.',
        'Nhiều tool_use trong một response thì trả tất cả tool_result trong MỘT lượt user.',
        'Tool lỗi thì trả is_error: true kèm thông báo có hướng dẫn, không bỏ qua.',
        'Tool Runner (beta) tự chạy vòng lặp; vòng lặp thủ công cho toàn quyền kiểm soát. Luôn có giới hạn số vòng.'
      ],
      tips: [
        'Nhớ “Xin – Làm – Báo”: Claude xin (tool_use), bạn làm (chạy tool), bạn báo lại (tool_result).',
        '“Một khay, nhiều món”: bao nhiêu tool_result cũng bưng ra một lượt user.',
        'Lỗi tool như biển báo công trường: ghi rõ “đường cấm, đi lối kia” để Claude tự đổi hướng.',
        'Client tool chạy ở máy bạn, server tool (web search, code execution) chạy ở Anthropic.',
        'Bẫy đề thi: “Claude tự chạy tool của bạn” là sai.'
      ]
    },
    sections: [
      {
        h: '1. Tool use hoạt động thế nào',
        html: `<ol>
<li>Bạn gửi danh sách <code>tools</code> cùng request.</li>
<li>Claude quyết định gọi tool → response có <code>stop_reason: "tool_use"</code> và khối <code>tool_use</code> (id, name, input).</li>
<li><strong>Code của bạn</strong> chạy tool (Claude không tự chạy client tool).</li>
<li>Bạn gửi lại một lượt <code>user</code> chứa <code>tool_result</code> với <code>tool_use_id</code> khớp.</li>
<li>Lặp lại đến khi <code>stop_reason: "end_turn"</code>.</li>
</ol>`
      },
      {
        h: '2. Quy tắc quan trọng',
        html: `<ul>
<li><strong>Nhiều tool song song</strong>: một response có thể chứa nhiều <code>tool_use</code>. Chạy chúng (song song được) rồi trả <strong>tất cả</strong> <code>tool_result</code> trong <strong>một</strong> lượt user.</li>
<li><strong>Lỗi tool</strong>: trả <code>tool_result</code> với <code>"is_error": true</code> và thông báo lỗi có ích – đừng bỏ qua. Claude sẽ tự điều chỉnh.</li>
<li>Parse <code>tool.input</code> như object JSON, không so khớp chuỗi thô.</li>
<li><code>tool_choice</code>: <code>auto</code> (mặc định), <code>none</code>; một số model mới không hỗ trợ ép buộc (<code>any</code>/<code>tool</code>) – khi đó dùng <code>auto</code> + chỉ dẫn trong prompt.</li>
<li>SDK có <strong>Tool Runner</strong> (beta) tự chạy vòng lặp; tự viết vòng lặp thủ công giúp bạn hiểu bản chất – rất quan trọng cho kỳ thi.</li>
</ul>`
      }
    ],
    code: [
      {
        title: 'Python – vòng lặp agent thủ công với 2 tool', lang: 'python',
        src: `
import json
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "get_weather",
        "description": "Lấy thời tiết hiện tại của một thành phố. Dùng khi người dùng hỏi về thời tiết.",
        "input_schema": {
            "type": "object",
            "properties": {"city": {"type": "string", "description": "Tên thành phố, ví dụ: Hà Nội"}},
            "required": ["city"],
        },
    },
    {
        "name": "calculate",
        "description": "Tính một biểu thức số học đơn giản, ví dụ '(12 + 8) * 3'.",
        "input_schema": {
            "type": "object",
            "properties": {"expression": {"type": "string"}},
            "required": ["expression"],
        },
    },
]

def run_tool(name, args):
    if name == "get_weather":
        fake = {"Hà Nội": "28°C, nắng", "Đà Nẵng": "30°C, có mây"}
        return fake.get(args["city"], "Không có dữ liệu")
    if name == "calculate":
        allowed = set("0123456789+-*/(). ")
        if not set(args["expression"]) <= allowed:
            raise ValueError("Biểu thức chứa ký tự không hợp lệ")
        return str(eval(args["expression"]))  # chỉ cho ví dụ học tập
    raise ValueError(f"Tool không tồn tại: {name}")

messages = [{"role": "user", "content": "Thời tiết Hà Nội và Đà Nẵng? Rồi tính (28 + 30) / 2."}]

while True:
    response = client.messages.create(
        model="claude-opus-5", max_tokens=16000, tools=tools, messages=messages,
    )
    messages.append({"role": "assistant", "content": response.content})

    if response.stop_reason != "tool_use":
        break

    results = []
    for block in response.content:
        if block.type != "tool_use":
            continue
        try:
            output = run_tool(block.name, block.input)
            results.append({"type": "tool_result", "tool_use_id": block.id, "content": output})
        except Exception as e:
            results.append({"type": "tool_result", "tool_use_id": block.id,
                            "content": f"Lỗi: {e}", "is_error": True})
    messages.append({"role": "user", "content": results})  # tất cả kết quả trong MỘT lượt

print(next(b.text for b in response.content if b.type == "text"))`
      }
    ],
    exercises: [
      {
        title: 'Bài 1 – Thêm tool tra cứu đơn hàng',
        task: `<p>Thêm tool <code>lookup_order(order_id)</code> đọc từ một dict giả lập. Thử các câu: “Đơn A123 đang ở đâu?”, “Đơn XYZ?” (không tồn tại). Đảm bảo lỗi được trả về với <code>is_error: true</code> và Claude trả lời người dùng lịch sự.</p>`,
        hint: 'Thông báo lỗi nên gợi ý cách sửa: “Không tìm thấy đơn XYZ. Mã đơn có dạng 1 chữ cái + 3 số, ví dụ A123.”',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Thêm định nghĩa tool vào danh sách <code>tools</code>, mô tả rõ định dạng mã đơn.</li>
<li>Trong <code>run_tool</code>, kiểm tra định dạng bằng regex; sai định dạng hoặc không tồn tại thì <code>raise ValueError</code> với thông báo có hướng dẫn.</li>
<li>Vòng lặp chính đã có sẵn nhánh <code>except</code> trả <code>is_error: True</code>.</li>
</ol>
<pre><code>import re

ORDERS = {"A123": "Đang giao, dự kiến tới ngày mai", "B456": "Đã giao ngày 20/11"}

tools.append({
    "name": "lookup_order",
    "description": "Tra trạng thái đơn hàng theo mã. Mã đơn gồm 1 chữ cái in hoa và 3 chữ số, ví dụ A123.",
    "input_schema": {
        "type": "object",
        "properties": {"order_id": {"type": "string", "description": "Mã đơn, ví dụ A123"}},
        "required": ["order_id"],
    },
})

def lookup_order(order_id):
    if not re.fullmatch(r"[A-Z]\\d{3}", order_id):
        raise ValueError(f"Mã '{order_id}' sai định dạng. Mã đơn có dạng 1 chữ cái + 3 số, ví dụ A123. Hãy hỏi lại khách.")
    if order_id not in ORDERS:
        raise ValueError(f"Không tìm thấy đơn {order_id}. Hãy đề nghị khách kiểm tra lại email xác nhận.")
    return ORDERS[order_id]

# trong run_tool:
#     if name == "lookup_order":
#         return lookup_order(args["order_id"])</code></pre>
<p><strong>Kiểm tra kết quả:</strong> với “Đơn XYZ?”, Claude không bịa trạng thái mà xin khách mã đúng định dạng.</p>
<p><strong>Lỗi thường gặp:</strong> trả chuỗi rỗng khi lỗi (Claude tưởng thành công); thông báo lỗi chung chung như “error” khiến Claude không biết cách sửa; quên thêm nhánh cho tool mới trong <code>run_tool</code>.</p>`
      },
      {
        title: 'Bài 2 – Giới hạn số vòng lặp',
        task: `<p>Thêm <code>MAX_TURNS = 10</code> vào vòng lặp. Khi vượt, dừng lại và trả thông báo. Vì sao đây là yêu cầu bắt buộc với agent chạy production?</p>`,
        hint: 'Nghĩ về chi phí và trường hợp tool luôn trả lỗi.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Thay <code>while True</code> bằng <code>for turn in range(MAX_TURNS)</code>.</li>
<li>Dùng nhánh <code>else</code> của vòng for (chỉ chạy khi không <code>break</code>) để xử lý trường hợp vượt giới hạn.</li>
<li>Kiểm tra thêm <code>stop_reason == "max_tokens"</code> để không chạy tool với input bị cắt dở.</li>
</ol>
<pre><code>MAX_TURNS = 10

for turn in range(MAX_TURNS):
    response = client.messages.create(model="claude-opus-5", max_tokens=16000,
                                      tools=tools, messages=messages)
    messages.append({"role": "assistant", "content": response.content})
    if response.stop_reason == "max_tokens":
        raise RuntimeError("Output bị cắt giữa chừng – tăng max_tokens")
    if response.stop_reason != "tool_use":
        break
    results = [handle(b) for b in response.content if b.type == "tool_use"]
    messages.append({"role": "user", "content": results})
else:
    print(f"Dừng sau {MAX_TURNS} lượt để tránh vòng lặp vô hạn")</code></pre>
<p><strong>Kiểm tra kết quả:</strong> cho một tool luôn raise lỗi – chương trình phải dừng sau 10 lượt và in thông báo, không chạy mãi.</p>
<p><strong>Lỗi thường gặp:</strong> đếm lượt nhưng không dừng; chỉ dựa vào model tự dừng. Không có giới hạn, agent có thể lặp vô hạn khi tool lỗi liên tục → tốn tiền và treo hệ thống.</p>`
      },
      {
        title: 'Bài 3 – Dùng Tool Runner của SDK',
        task: `<p>Viết lại ví dụ bằng Tool Runner: đánh dấu hàm Python với <code>@beta_tool</code> và dùng <code>client.beta.messages.tool_runner(...)</code>. So sánh số dòng code với vòng lặp thủ công.</p>`,
        hint: 'Xem mục Tool Runner trong tài liệu SDK Python; docstring của hàm trở thành description của tool.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Import <code>beta_tool</code>, viết hàm Python có type hint và docstring – SDK tự sinh schema.</li>
<li>Gọi <code>client.beta.messages.tool_runner(...)</code> với danh sách hàm.</li>
<li><code>runner.until_done()</code> chạy vòng lặp tới khi xong và trả message cuối.</li>
</ol>
<pre><code>import anthropic
from anthropic import beta_tool

client = anthropic.Anthropic()

@beta_tool
def get_weather(city: str) -&gt; str:
    """Lấy thời tiết hiện tại của một thành phố."""
    return {"Hà Nội": "28°C, nắng", "Đà Nẵng": "30°C, có mây"}.get(city, "Không có dữ liệu")

runner = client.beta.messages.tool_runner(
    model="claude-opus-5", max_tokens=16000,
    tools=[get_weather],
    messages=[{"role": "user", "content": "Thời tiết Hà Nội và Đà Nẵng?"}],
)
final = runner.until_done()
print(next(b.text for b in final.content if b.type == "text"))</code></pre>
<p><strong>Kiểm tra kết quả:</strong> câu trả lời cuối có thời tiết của cả hai thành phố; code ngắn hơn khoảng một nửa.</p>
<p><strong>Lỗi thường gặp:</strong> thiếu docstring hoặc type hint (schema kém rõ ràng); nhầm Tool Runner với Claude Agent SDK – Tool Runner chỉ lặp qua tool bạn định nghĩa, không có tool file/bash tích hợp.</p>`
      },
      {
        title: 'Bài 4 – Chạy nhiều tool song song',
        task: `<p>Giả lập tool <code>get_weather</code> chậm 2 giây. Hỏi thời tiết 4 thành phố và chạy các khối <code>tool_use</code> song song bằng <code>ThreadPoolExecutor</code>, rồi gửi tất cả kết quả trong một lượt user. So sánh thời gian với chạy tuần tự.</p>`,
        hint: 'executor.map giữ nguyên thứ tự đầu vào, dễ ghép lại với tool_use_id.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Lấy tất cả khối <code>tool_use</code> trong response.</li>
<li>Viết hàm <code>handle(block)</code> trả dict <code>tool_result</code> (bắt lỗi, đặt <code>is_error</code>).</li>
<li>Chạy <code>handle</code> song song bằng <code>ThreadPoolExecutor</code>.</li>
<li>Gửi <strong>một</strong> lượt user chứa đủ các tool_result.</li>
</ol>
<pre><code>import time
from concurrent.futures import ThreadPoolExecutor

def slow_weather(city):
    time.sleep(2)  # giả lập API chậm
    return f"{city}: 28°C"

def handle(block):
    try:
        return {"type": "tool_result", "tool_use_id": block.id,
                "content": slow_weather(block.input["city"])}
    except Exception as e:
        return {"type": "tool_result", "tool_use_id": block.id,
                "content": f"Lỗi: {e}", "is_error": True}

calls = [b for b in response.content if b.type == "tool_use"]
t0 = time.perf_counter()
with ThreadPoolExecutor(max_workers=8) as ex:
    results = list(ex.map(handle, calls))
print(f"{len(calls)} tool trong {time.perf_counter() - t0:.1f}s")

messages.append({"role": "assistant", "content": response.content})
messages.append({"role": "user", "content": results})  # MỘT lượt chứa tất cả</code></pre>
<p><strong>Kiểm tra kết quả:</strong> 4 tool mất khoảng 2 giây thay vì 8 giây; số tool_result bằng số tool_use và mỗi <code>tool_use_id</code> khớp.</p>
<p><strong>Lỗi thường gặp:</strong> gửi mỗi kết quả trong một lượt riêng (khiến Claude dần ngừng gọi song song); để exception trong thread làm mất kết quả của tool đó – luôn trả tool_result kể cả khi lỗi.</p>`
      }
    ],
    quiz: [
      {
        q: 'Claude trả về 3 khối tool_use trong một response. Bạn gửi kết quả thế nào?',
        options: ['3 lượt user riêng, mỗi lượt 1 tool_result', 'Một lượt user chứa cả 3 tool_result', 'Chỉ gửi kết quả đầu tiên', 'Gửi trong system prompt'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> mọi tool_result của một lượt assistant phải nằm chung trong một lượt user, mỗi kết quả có <code>tool_use_id</code> tương ứng.<br><strong>Vì sao các lựa chọn khác sai:</strong> tách nhiều lượt khiến Claude dần “học” rằng không nên gọi song song; thiếu kết quả làm request không hợp lệ; system prompt không phải nơi chứa kết quả tool.'
      },
      {
        q: 'Tool thất bại (API bên thứ ba timeout). Cách xử lý đúng?',
        options: ['Bỏ qua, không trả tool_result', 'Trả tool_result với is_error: true và thông báo lỗi rõ ràng', 'Dừng chương trình', 'Tự bịa kết quả'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> Claude cần biết tool lỗi để thử lại, dùng cách khác hoặc báo người dùng.<br><strong>Vì sao các lựa chọn khác sai:</strong> thiếu tool_result làm request tiếp theo không hợp lệ; dừng chương trình bỏ lỡ cơ hội tự phục hồi; bịa kết quả dẫn tới câu trả lời sai.'
      },
      {
        q: 'Ai chạy client tool (tool bạn tự định nghĩa)?',
        options: ['Server Anthropic', 'Code ứng dụng của bạn', 'Claude tự chạy trong sandbox', 'Trình duyệt người dùng'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> Claude chỉ trả khối tool_use mô tả lời gọi; ứng dụng của bạn thực thi và gửi kết quả.<br><strong>Vì sao các lựa chọn khác sai:</strong> chỉ server tool (web search, code execution…) chạy trên hạ tầng Anthropic; Claude không tự chạy tool của bạn; trình duyệt không liên quan trừ khi bạn tự thiết kế như vậy.'
      },
      {
        q: 'Khối tool_result phải tham chiếu tới lời gọi tool bằng trường nào?',
        options: ['name của tool', 'tool_use_id khớp với id của khối tool_use', 'Thứ tự trong mảng', 'Không cần tham chiếu'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> <code>tool_use_id</code> nối chính xác mỗi kết quả với lời gọi tương ứng, kể cả khi cùng tool được gọi nhiều lần.<br><strong>Vì sao các lựa chọn khác sai:</strong> tên tool không phân biệt được hai lời gọi cùng tool; dựa vào thứ tự rất dễ sai; thiếu tham chiếu thì API không biết kết quả thuộc lời gọi nào.'
      },
      {
        q: 'Vòng lặp nhận stop_reason = "max_tokens" giữa lúc Claude đang viết khối tool_use. Nên làm gì?',
        options: ['Chạy tool với input hiện có', 'Không chạy tool; tăng max_tokens hoặc chia nhỏ nhiệm vụ rồi gửi lại', 'Bỏ qua và tiếp tục vòng lặp', 'Đổi sang model khác'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> input của tool có thể bị cắt dở, chạy tool với dữ liệu không đầy đủ rất nguy hiểm; phải kiểm tra stop_reason trước khi chạy tool.<br><strong>Vì sao các lựa chọn khác sai:</strong> chạy với input dở có thể gây hành động sai; bỏ qua làm lịch sử không nhất quán; đổi model không giải quyết giới hạn max_tokens.'
      },
      {
        q: 'Trên model không hỗ trợ tool_choice ép buộc (any/tool), muốn Claude chắc chắn trả dữ liệu có cấu trúc. Cách phù hợp?',
        options: ['Vẫn dùng tool_choice any', 'Dùng tool_choice auto kèm chỉ dẫn trong prompt, strict: true trên tool, hoặc structured outputs', 'Dùng prefill', 'Không có cách'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> đây là các thay thế chính thức khi ép buộc tool bị trả lỗi 400.<br><strong>Vì sao các lựa chọn khác sai:</strong> tool_choice any trả lỗi 400 trên các model đó; prefill cũng bị bỏ trên các model đời mới; structured outputs hoặc strict tool chính là cách làm.'
      }
    ],
    resources: [
      { t: 'Tool use overview – docs.claude.com', url: 'https://docs.claude.com' }
    ]
  },

  {
    id: 'm2b1', month: 2, week: 5, bonus: true, duration: '5 giờ', domain: 'Claude API',
    title: 'Bonus: Batch API, đếm token và Files API',
    objectives: [
      'Ước tính token và chi phí trước khi gửi bằng count_tokens',
      'Xử lý khối lượng lớn với Message Batches API (giảm 50% chi phí)',
      'Upload file một lần và dùng lại bằng file_id qua Files API',
      'Kết hợp batch với prompt caching'
    ],
    flow: {
      title: 'Batch: đếm token, gửi lô, chờ xử lý, lấy kết quả theo custom_id',
      steps: [
        { kind: 'start', label: 'Chuẩn bị N request', detail: 'Mỗi request có custom_id riêng' },
        { kind: 'step', label: 'count_tokens ước tính', detail: 'Tính chi phí trước khi chạy' },
        { kind: 'step', label: 'Upload file dùng chung', detail: 'files.upload → file_id', note: 'Không phải gửi lại base64 nhiều lần' },
        { kind: 'step', label: 'batches.create(requests)', detail: 'Giá khoảng 50% so với gọi thường' },
        { kind: 'decision', label: 'processing_status = ended?', note: 'Chưa → chờ rồi retrieve lại' },
        { kind: 'step', label: 'Chờ rồi kiểm tra lại', loopTo: 4, loopLabel: 'poll lại' },
        { kind: 'step', label: 'Đọc results()', detail: 'succeeded / errored / expired', note: 'Kết quả không theo thứ tự gửi' },
        { kind: 'end', label: 'Ghép kết quả theo custom_id' }
      ]
    },
    realExamples: [
      {
        title: 'Phân loại 200.000 đánh giá sản phẩm mỗi đêm',
        html: `<p>Một sàn thương mại điện tử cần gán cảm xúc và chủ đề cho khoảng 200.000 đánh giá mỗi ngày. Không ai cần kết quả ngay lập tức, chỉ cần có trước 8 giờ sáng để đưa lên dashboard.</p>
<p><strong>Trước:</strong> chạy 200.000 request realtime, hay bị rate limit và tốn chi phí đầy đủ. <strong>Sau:</strong> mỗi đêm gửi các lô qua <code>messages.batches.create</code>, mỗi request có <code>custom_id</code> là mã đánh giá. System prompt chung được đặt <code>cache_control</code> để tiết kiệm thêm. Buổi sáng chỉ cần đọc <code>results()</code> và ghép kết quả theo <code>custom_id</code>.</p>
<p>Chi phí giảm khoảng một nửa và không còn lỗi 429. Có lần một dev ghép kết quả theo thứ tự trong danh sách, khiến nhãn bị gán lệch sang đánh giá khác. Từ đó team luôn ghép theo <code>custom_id</code>.</p>`
      },
      {
        title: 'Dùng lại một hợp đồng mẫu 80 trang cho nhiều câu hỏi',
        html: `<p>Phòng pháp chế có một hợp đồng khung 80 trang và phải trả lời khoảng 50 câu hỏi về nó. Nếu mỗi request gửi lại PDF dạng base64, payload rất nặng và chậm.</p>
<p><strong>Cách làm:</strong> upload một lần bằng <code>client.files.upload(...)</code> để lấy <code>file_id</code>, sau đó tham chiếu bằng <code>{"type": "document", "source": {"type": "file", "file_id": ...}}</code>. Trước khi chạy cả loạt, dùng <code>messages.count_tokens</code> đếm token của một request mẫu để ước tính chi phí và báo cáo cho trưởng phòng.</p>
<pre><code>n = client.messages.count_tokens(model="claude-opus-5", messages=msgs)
print(n.input_tokens)</code></pre>
<p>Kết quả: request nhẹ hơn và chi phí được dự báo trước, không còn bất ngờ khi xem hoá đơn cuối tháng. Khi hợp đồng khung có phiên bản mới, team upload file mới để lấy <code>file_id</code> mới rồi chạy lại cả bộ 50 câu hỏi, nên so sánh được câu trả lời giữa hai phiên bản mà không phải chỉnh lại code.</p>`
      }
    ],
    recap: {
      summary: [
        'count_tokens đếm token input trước khi gửi để ước tính chi phí; dùng nó, không dùng tiktoken.',
        'Message Batches: gửi nhiều request bất đồng bộ, giá khoảng 50%, hợp với việc không cần realtime.',
        'Poll processing_status cho tới khi là ended, rồi đọc results(); mỗi kết quả có type succeeded / errored / canceled / expired.',
        'Kết quả về không theo thứ tự: luôn ghép theo custom_id.',
        'Files API: upload một lần lấy file_id, dùng lại trong nhiều request (client.files.*, không cần beta).'
      ],
      tips: [
        'Batch như gửi đồ giặt ở tiệm: rẻ hơn, nhưng sáng mai mới lấy.',
        '“Có tên mới nhận được đồ”: custom_id là phiếu nhận đồ giặt.',
        'Đếm trước, tiêu sau: count_tokens trước mỗi đợt chạy lớn.',
        'Files API như Google Drive: upload một lần, gửi link nhiều lần.',
        'Bẫy đề thi: chatbot cần trả lời ngay thì KHÔNG dùng Batch.'
      ]
    },
    sections: [
      {
        h: '1. Đếm token trước khi gửi',
        html: `<p>Endpoint <code>POST /v1/messages/count_tokens</code> (SDK: <code>client.messages.count_tokens(...)</code>) trả số token input <strong>chính xác</strong> cho một model, mà không sinh output.</p>
<ul>
<li>Token phụ thuộc model – luôn truyền đúng model ID bạn sẽ dùng.</li>
<li><strong>Không dùng tiktoken</strong> hay tokenizer của hãng khác: chúng đếm thiếu đáng kể với Claude, nhất là code và tiếng Việt.</li>
<li>Dùng để: chặn tài liệu quá dài trước khi gửi, ước tính chi phí, so sánh độ dài hai phiên bản prompt.</li>
</ul>`
      },
      {
        h: '2. Message Batches API',
        html: `<div class="table-wrap"><table>
<tr><th>Đặc điểm</th><th>Giá trị</th></tr>
<tr><td>Chi phí</td><td>Giảm 50% cho mọi token</td></tr>
<tr><td>Quy mô</td><td>Tối đa 100.000 request hoặc 256 MB mỗi batch</td></tr>
<tr><td>Thời gian</td><td>Phần lớn xong trong 1 giờ, tối đa 24 giờ</td></tr>
<tr><td>Kết quả</td><td>Lấy được trong 29 ngày; trả về <strong>không theo thứ tự</strong> – ghép bằng <code>custom_id</code></td></tr>
<tr><td>Tính năng</td><td>Hỗ trợ mọi tính năng của Messages API (vision, tools, caching…)</td></tr>
</table></div>
<p>Quy trình: <code>batches.create(requests=[...])</code> → thăm dò <code>batches.retrieve(id).processing_status</code> tới khi <code>"ended"</code> → duyệt <code>batches.results(id)</code>. Mỗi kết quả có loại <code>succeeded</code>, <code>errored</code>, <code>canceled</code> hoặc <code>expired</code>.</p>
<div class="callout tip">Dùng batch cho việc <strong>không cần realtime</strong>: phân loại dữ liệu cũ, sinh mô tả sản phẩm hàng loạt, chạy eval. Chatbot cần trả lời ngay thì không dùng batch.</div>`
      },
      {
        h: '3. Files API',
        html: `<ul>
<li>Upload một lần (<code>client.files.upload(...)</code>), nhận <code>file_id</code>, dùng lại trong nhiều request: <code>{"type": "document", "source": {"type": "file", "file_id": ...}}</code> cho PDF/text hoặc <code>{"type": "image", ...}</code> cho ảnh.</li>
<li>File tối đa 500 MB, tổng dung lượng 100 GB mỗi tổ chức; file tồn tại đến khi bạn xoá.</li>
<li>Upload, liệt kê, xoá file miễn phí; nội dung file dùng trong message vẫn tính như token input.</li>
<li>Files API đã ra khỏi beta: dùng <code>client.files.*</code>, không cần beta header. Không có trên Amazon Bedrock và Google Vertex AI.</li>
</ul>`
      },
      {
        h: '4. Kết hợp để tối ưu chi phí',
        html: `<ol>
<li><strong>Đếm token</strong> trước để ước tính và chặn input quá lớn.</li>
<li><strong>Batch</strong> cho khối lượng lớn không cần realtime (−50%).</li>
<li><strong>Prompt caching</strong> cho phần dùng chung giữa các request trong batch (system prompt, tài liệu tham chiếu).</li>
<li><strong>Files API</strong> để không phải gửi lại base64 của cùng một file nhiều lần.</li>
</ol>`
      }
    ],
    code: [
      {
        title: 'Python – đếm token trước khi gửi', lang: 'python',
        src: `
import anthropic
client = anthropic.Anthropic()

doc = open("report.md", encoding="utf-8").read()
count = client.messages.count_tokens(
    model="claude-opus-5",
    messages=[{"role": "user", "content": f"Tóm tắt tài liệu sau:\\n{doc}"}],
)
print("Token input:", count.input_tokens)

if count.input_tokens > 150_000:
    raise ValueError("Tài liệu quá dài – hãy chia nhỏ trước khi gửi")`
      },
      {
        title: 'Python – batch phân loại đánh giá sản phẩm', lang: 'python',
        src: `
import time, anthropic
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

client = anthropic.Anthropic()
reviews = ["Sản phẩm tuyệt vời!", "Giao hàng quá chậm.", "Tạm được, không có gì đặc biệt."]

batch = client.messages.batches.create(requests=[
    Request(
        custom_id=f"review-{i}",
        params=MessageCreateParamsNonStreaming(
            model="claude-haiku-4-5", max_tokens=50,
            messages=[{"role": "user", "content":
                f"Phân loại cảm xúc (tich_cuc/tieu_cuc/trung_tinh), chỉ trả 1 từ: {text}"}],
        ),
    )
    for i, text in enumerate(reviews)
])

while client.messages.batches.retrieve(batch.id).processing_status != "ended":
    time.sleep(30)

labels = {}
for result in client.messages.batches.results(batch.id):   # thứ tự bất kỳ
    if result.result.type == "succeeded":
        msg = result.result.message
        labels[result.custom_id] = next(b.text for b in msg.content if b.type == "text")
    else:
        labels[result.custom_id] = f"LỖI: {result.result.type}"

for i, text in enumerate(reviews):
    print(labels[f"review-{i}"], "|", text)`
      },
      {
        title: 'Python – upload file một lần, hỏi nhiều lần', lang: 'python',
        src: `
from pathlib import Path
import anthropic

client = anthropic.Anthropic()
uploaded = client.files.upload(file=Path("contract.pdf"))
print("file_id:", uploaded.id)

for question in ["Thời hạn hợp đồng?", "Điều khoản chấm dứt?", "Phạt vi phạm bao nhiêu?"]:
    r = client.messages.create(
        model="claude-opus-5", max_tokens=4096,
        messages=[{"role": "user", "content": [
            {"type": "document", "source": {"type": "file", "file_id": uploaded.id}},
            {"type": "text", "text": question},
        ]}],
    )
    print(question, "→", next(b.text for b in r.content if b.type == "text"))

client.files.delete(uploaded.id)  # dọn dẹp khi không cần nữa`
      }
    ],
    exercises: [
      {
        title: 'Bài 1 – Ước tính chi phí một tác vụ trước khi chạy',
        task: `<p>Bạn cần tóm tắt 200 bài báo (file .txt trong thư mục <code>articles/</code>). Dùng <code>count_tokens</code> cho từng bài, cộng tổng, giả định output 300 token/bài, và ước tính chi phí theo hai phương án: gọi thường và Batch API.</p>`,
        hint: 'Batch giảm 50% cả token input lẫn output. Tra giá model tại trang Pricing.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Duyệt thư mục, đọc từng file.</li>
<li>Gọi <code>count_tokens</code> với đúng prompt bạn sẽ dùng (gồm cả phần chỉ dẫn).</li>
<li>Cộng tổng input; output ước tính = số bài × 300.</li>
<li>Tính chi phí thường và chi phí batch (× 0,5).</li>
</ol>
<pre><code>from pathlib import Path
import anthropic

client = anthropic.Anthropic()
MODEL, PRICE_IN, PRICE_OUT = "claude-haiku-4-5", 1.00, 5.00  # USD/MTok – kiểm tra trang Pricing
PROMPT = "Tóm tắt bài báo sau trong 5 gạch đầu dòng:\\n"

total_in = 0
files = sorted(Path("articles").glob("*.txt"))
for f in files:
    total_in += client.messages.count_tokens(
        model=MODEL,
        messages=[{"role": "user", "content": PROMPT + f.read_text(encoding="utf-8")}],
    ).input_tokens

total_out = 300 * len(files)
normal = total_in / 1e6 * PRICE_IN + total_out / 1e6 * PRICE_OUT
print(f"{len(files)} bài · input {total_in:,} token · output ước tính {total_out:,}")
print(f"Gọi thường: {normal:.4f} USD · Batch: {normal * 0.5:.4f} USD")</code></pre>
<p><strong>Kiểm tra kết quả:</strong> chi phí batch đúng bằng một nửa; nếu bạn chạy thật một bài, <code>usage.input_tokens</code> của request thật phải khớp với số đã đếm.</p>
<p><strong>Lỗi thường gặp:</strong> đếm bằng <code>len(text) / 4</code> hoặc tiktoken (sai với Claude, nhất là tiếng Việt); đếm với model khác model sẽ dùng; quên phần chỉ dẫn trong prompt khi đếm.</p>`
      },
      {
        title: 'Bài 2 – Batch có xử lý lỗi và gửi lại',
        task: `<p>Chạy batch 20 request, trong đó cố ý có 2 request sai (ví dụ <code>max_tokens</code> âm hoặc model ID sai). Thu thập kết quả, phân loại theo <code>result.type</code>, và tạo batch thứ hai chỉ gồm các request lỗi do server (có thể thử lại).</p>`,
        hint: 'Lỗi errored có error.type; invalid_request cần sửa request, lỗi khác thường gửi lại được.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Lưu dict <code>params_by_id</code> để có thể dựng lại request theo <code>custom_id</code>.</li>
<li>Sau khi batch <code>ended</code>, duyệt kết quả và chia thành: thành công, cần sửa (invalid_request), có thể thử lại (lỗi khác, expired).</li>
<li>Tạo batch mới chỉ với nhóm có thể thử lại.</li>
</ol>
<pre><code>succeeded, fix_needed, retry = {}, [], []
for res in client.messages.batches.results(batch.id):
    kind = res.result.type
    if kind == "succeeded":
        succeeded[res.custom_id] = res.result.message
    elif kind == "errored" and res.result.error.type == "invalid_request":
        fix_needed.append(res.custom_id)       # request sai – sửa code, không gửi lại y hệt
    else:                                       # lỗi server, expired, canceled
        retry.append(res.custom_id)

print(f"OK {len(succeeded)} · cần sửa {fix_needed} · thử lại {retry}")

if retry:
    retry_batch = client.messages.batches.create(requests=[
        Request(custom_id=cid, params=params_by_id[cid]) for cid in retry
    ])
    print("Batch thử lại:", retry_batch.id)</code></pre>
<p><strong>Kiểm tra kết quả:</strong> 2 request sai rơi vào nhóm “cần sửa”, 18 request còn lại thành công; batch thử lại chỉ tạo khi có lỗi tạm thời.</p>
<p><strong>Lỗi thường gặp:</strong> ghép kết quả theo vị trí (kết quả trả về không theo thứ tự); gửi lại request <code>invalid_request</code> y hệt (sẽ lỗi lại); dùng trùng <code>custom_id</code>.</p>`
      },
      {
        title: 'Bài 3 – Batch kết hợp prompt caching',
        task: `<p>Có một bộ hướng dẫn phong cách viết dài (~5.000 token) dùng chung cho 100 yêu cầu viết mô tả sản phẩm. Thiết kế batch sao cho phần hướng dẫn được cache.</p>`,
        hint: 'Đặt phần dùng chung trong system với cache_control, giữ y hệt giữa mọi request.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Tạo <code>shared_system</code> gồm một đoạn ngắn và bộ hướng dẫn dài có <code>cache_control</code>.</li>
<li>Dùng chính xác cùng một object <code>shared_system</code> cho mọi request (không chèn timestamp hay ID).</li>
<li>Phần thay đổi (thông số sản phẩm) đặt trong <code>messages</code>.</li>
</ol>
<pre><code>STYLE_GUIDE = open("style_guide.md", encoding="utf-8").read()
shared_system = [
    {"type": "text", "text": "Bạn viết mô tả sản phẩm cho website bán hàng."},
    {"type": "text", "text": STYLE_GUIDE, "cache_control": {"type": "ephemeral"}},
]

batch = client.messages.batches.create(requests=[
    Request(
        custom_id=f"product-{p['sku']}",
        params=MessageCreateParamsNonStreaming(
            model="claude-opus-5", max_tokens=1024,
            system=shared_system,
            messages=[{"role": "user", "content": f"Viết mô tả cho: {p['name']} – {p['specs']}"}],
        ),
    )
    for p in products
])</code></pre>
<p><strong>Kiểm tra kết quả:</strong> trong <code>usage</code> của các kết quả thành công, nhiều request có <code>cache_read_input_tokens &gt; 0</code>.</p>
<p><strong>Lỗi thường gặp:</strong> chèn tên sản phẩm vào system (mỗi request một tiền tố khác, không cache được); hướng dẫn quá ngắn, dưới ngưỡng tối thiểu để cache. Lưu ý: các request trong batch được xử lý không đồng thời theo thứ tự, nên tỉ lệ cache hit không đảm bảo 100%.</p>`
      },
      {
        title: 'Bài 4 – Hỏi đáp nhiều lần trên một file bằng Files API',
        task: `<p>Upload một file PDF quy chế công ty, hỏi 5 câu khác nhau bằng <code>file_id</code>, sau đó liệt kê các file đã upload và xoá file này.</p>`,
        hint: 'Duyệt trực tiếp kết quả client.files.list() – SDK tự phân trang.',
        solution: `<p><strong>Hướng dẫn giải từng bước</strong></p>
<ol>
<li>Upload bằng <code>client.files.upload(file=Path(...))</code>, lưu <code>uploaded.id</code>.</li>
<li>Với mỗi câu hỏi, gửi document block có <code>source.type = "file"</code>.</li>
<li>Liệt kê file bằng vòng for trên <code>client.files.list()</code>.</li>
<li>Xoá bằng <code>client.files.delete(file_id)</code> khi xong.</li>
</ol>
<pre><code>from pathlib import Path
import anthropic

client = anthropic.Anthropic()
up = client.files.upload(file=Path("quy_che.pdf"))

questions = ["Giờ làm việc?", "Số ngày phép năm?", "Chính sách làm việc từ xa?",
             "Quy trình xin nghỉ ốm?", "Chế độ thưởng Tết?"]
for q in questions:
    r = client.messages.create(
        model="claude-opus-5", max_tokens=2048,
        messages=[{"role": "user", "content": [
            {"type": "document", "source": {"type": "file", "file_id": up.id}},
            {"type": "text", "text": q + " Nếu quy chế không đề cập, hãy nói rõ."},
        ]}],
    )
    print("•", q, "→", next(b.text for b in r.content if b.type == "text")[:200])

for f in client.files.list():
    print(f.id, f.filename, f.size_bytes)

client.files.delete(up.id)</code></pre>
<p><strong>Kiểm tra kết quả:</strong> 5 câu trả lời dựa trên nội dung PDF; sau khi xoá, file không còn trong danh sách.</p>
<p><strong>Lỗi thường gặp:</strong> nghĩ rằng dùng <code>file_id</code> thì không tốn token (nội dung vẫn tính token input mỗi request – kết hợp caching nếu hỏi nhiều); dùng loại block không khớp kiểu file (PDF phải là <code>document</code>, ảnh là <code>image</code>); quên xoá file nhạy cảm.</p>`
      }
    ],
    quiz: [
      {
        q: 'Cách đếm token chính xác cho Claude trước khi gửi request?',
        options: ['Dùng tiktoken', 'client.messages.count_tokens với đúng model sẽ dùng', 'Số ký tự chia 4', 'Không đếm được'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> endpoint count_tokens trả số token chính xác theo tokenizer của model đó.<br><strong>Vì sao các lựa chọn khác sai:</strong> tiktoken là tokenizer của hãng khác, đếm thiếu đáng kể với Claude; chia 4 chỉ là ước lượng thô, rất sai với tiếng Việt và code; Claude API có hỗ trợ đếm token.'
      },
      {
        q: 'Batch API giảm chi phí bao nhiêu so với gọi thường?',
        options: ['10%', '25%', '50%', '90%'],
        answer: 2,
        explain: '<strong>Vì sao đúng:</strong> mọi token trong batch được tính 50% giá chuẩn.<br><strong>Vì sao các lựa chọn khác sai:</strong> 10% và 25% không phải mức giảm của batch; mức ~90% là mức tiết kiệm khi <em>đọc cache</em>, là tính năng khác (có thể kết hợp với batch).'
      },
      {
        q: 'Ghép kết quả batch với dữ liệu gốc thế nào cho đúng?',
        options: ['Theo thứ tự trả về', 'Theo custom_id', 'Theo thời gian hoàn thành', 'Theo độ dài câu trả lời'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> kết quả batch trả về theo thứ tự bất kỳ; <code>custom_id</code> là khoá duy nhất bạn đặt cho mỗi request.<br><strong>Vì sao các lựa chọn khác sai:</strong> thứ tự trả về và thời gian hoàn thành không khớp thứ tự gửi; độ dài câu trả lời không phải định danh.'
      },
      {
        q: 'Tình huống nào KHÔNG phù hợp với Batch API?',
        options: ['Phân loại 500.000 email cũ qua đêm', 'Chatbot trả lời khách hàng trong 2 giây', 'Chạy bộ eval 2.000 câu', 'Sinh mô tả 10.000 sản phẩm'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> batch có thể mất tới 24 giờ (thường dưới 1 giờ), không đáp ứng yêu cầu realtime.<br><strong>Vì sao các lựa chọn khác sai:</strong> phân loại dữ liệu cũ, chạy eval và sinh nội dung hàng loạt đều không cần kết quả tức thì – đúng trường hợp nên dùng batch để giảm 50% chi phí.'
      },
      {
        q: 'Một kết quả batch có type "errored" với error.type "invalid_request". Nên làm gì?',
        options: ['Gửi lại y hệt', 'Sửa request (tham số/schema) rồi mới gửi lại', 'Bỏ qua mãi mãi', 'Tăng thời gian chờ'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> invalid_request nghĩa là request sai; phải sửa nguyên nhân rồi mới gửi lại.<br><strong>Vì sao các lựa chọn khác sai:</strong> gửi lại y hệt sẽ lỗi y hệt; bỏ qua làm mất dữ liệu cần xử lý; chờ lâu hơn không sửa được request sai (chỉ lỗi server hoặc expired mới nên thử lại nguyên bản).'
      },
      {
        q: 'Điều nào đúng về Files API?',
        options: ['Dùng file_id thì nội dung file không tính token', 'Upload một lần, dùng lại bằng file_id; nội dung vẫn tính token input khi dùng trong message', 'File tự xoá sau 1 giờ', 'Có trên mọi nền tảng cloud'],
        answer: 1,
        explain: '<strong>Vì sao đúng:</strong> Files API tránh gửi lại file nhiều lần; thao tác upload/list/delete miễn phí nhưng nội dung dùng trong message vẫn tính như token input.<br><strong>Vì sao các lựa chọn khác sai:</strong> file_id không miễn phí token; file tồn tại đến khi bạn xoá; Files API không có trên Amazon Bedrock và Google Vertex AI.'
      }
    ],
    resources: [
      { t: 'Batch processing – docs.claude.com', url: 'https://docs.claude.com' },
      { t: 'Token counting – docs.claude.com', url: 'https://docs.claude.com' },
      { t: 'Files API – docs.claude.com', url: 'https://docs.claude.com' }
    ]
  }
);

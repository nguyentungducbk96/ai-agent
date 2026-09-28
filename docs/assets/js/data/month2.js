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
      'Đọc content block, stop_reason và usage'
    ],
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
<li>SDK tự retry lỗi 408/409/429/5xx và lỗi kết nối (mặc định 2 lần); timeout mặc định 10 phút.</li>
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

client = anthropic.Anthropic()

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
        solution: `<pre><code>import json, time, anthropic
client = anthropic.Anthropic()

def ask(prompt, system=None, model="claude-opus-5", max_tokens=4096):
    t0 = time.perf_counter()
    kwargs = {"system": system} if system else {}
    r = client.messages.create(model=model, max_tokens=max_tokens,
                               messages=[{"role": "user", "content": prompt}], **kwargs)
    ms = int((time.perf_counter() - t0) * 1000)
    with open("logs.jsonl", "a", encoding="utf-8") as f:
        f.write(json.dumps({"ts": time.time(), "model": model, "in": r.usage.input_tokens,
                            "out": r.usage.output_tokens, "ms": ms, "stop": r.stop_reason}) + "\\n")
    if r.stop_reason == "max_tokens":
        print("Cảnh báo: output bị cắt, hãy tăng max_tokens")
    return "".join(b.text for b in r.content if b.type == "text")</code></pre>`
      },
      {
        title: 'Bài 2 – Tính chi phí',
        task: `<p>Từ file <code>logs.jsonl</code>, viết script tính tổng chi phí theo bảng giá model bạn dùng (tra trang Pricing). In ra chi phí trung bình mỗi request.</p>`,
        hint: 'Giá tính theo 1 triệu token (MTok): cost = in/1e6 × giá_in + out/1e6 × giá_out.',
        solution: `<p>Giữ bảng giá trong một dict <code>PRICES = {"claude-opus-5": (in_price, out_price), ...}</code> lấy từ trang Pricing chính thức. Kết quả giúp bạn quen với việc <strong>ước tính chi phí trước khi đưa lên production</strong> – một câu hỏi hay gặp trong đề thi tình huống.</p>`
      }
    ],
    quiz: [
      {
        q: 'stop_reason = "tool_use" nghĩa là gì?',
        options: ['Có lỗi tool', 'Claude muốn gọi một tool; client cần chạy tool và gửi lại tool_result', 'Hội thoại kết thúc', 'Hết token'],
        answer: 1,
        explain: 'Đây là tín hiệu để vòng lặp agent chạy tool rồi tiếp tục.'
      },
      {
        q: 'Lỗi nào KHÔNG nên retry tự động?',
        options: ['429 Rate limit', '529/503 quá tải', '400 Bad request', 'Lỗi mất kết nối'],
        answer: 2,
        explain: '400 do request sai – retry sẽ lỗi y hệt. Sửa request thay vì retry.'
      },
      {
        q: 'Cách lưu API key đúng?',
        options: ['Ghi thẳng vào code', 'Biến môi trường hoặc secret manager, không commit lên git', 'Để trong README', 'Gửi qua chat cho đồng đội'],
        answer: 1,
        explain: 'Nguyên tắc chung cho mọi secret, kể cả GitHub token.'
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
<li>Dùng <code>client.messages.stream(...)</code> + <code>stream.text_stream</code>; lấy message hoàn chỉnh bằng <code>get_final_message()</code>.</li>
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
        solution: `<p>Khi lưu: <code>{"role": "assistant", "content": [b.model_dump() for b in final.content]}</code>. Khi nạp lại, danh sách dict gửi thẳng vào <code>messages</code> được. Cộng dồn <code>final.usage.input_tokens + final.usage.output_tokens</code> cho lệnh <code>/tokens</code>.</p>`
      },
      {
        title: 'Bài 2 – Giới hạn độ dài lịch sử',
        task: `<p>Khi lịch sử vượt 20 lượt, hãy tóm tắt 10 lượt đầu thành một đoạn ngắn bằng Claude và thay thế chúng bằng một lượt <code>user</code> chứa bản tóm tắt. Thảo luận: cách này ảnh hưởng gì tới prompt caching?</p>`,
        hint: 'Đảm bảo lượt đầu tiên sau khi thay vẫn là role "user" và các lượt vẫn xen kẽ.',
        solution: `<p>Cách tự tóm tắt làm thay đổi tiền tố (prefix) của hội thoại, nên cache của phần cũ bị vô hiệu – chấp nhận được nếu làm thưa (mỗi 10 lượt). Trên API còn có <strong>compaction phía server</strong> (beta) tự làm việc này; và với agent, <strong>context editing</strong> xoá kết quả tool cũ. Ôn kỹ ở tháng 5.</p>`
      }
    ],
    quiz: [
      {
        q: 'Sau mỗi lượt, nên thêm gì vào lịch sử?',
        options: ['Chỉ response.content[0].text', 'Nguyên response.content dưới role assistant', 'Chỉ usage', 'Không cần thêm gì'],
        answer: 1,
        explain: 'Content có thể chứa thinking/tool_use/compaction block cần được giữ nguyên.'
      },
      {
        q: 'Lợi ích quan trọng nhất của streaming với output dài?',
        options: ['Rẻ hơn', 'Tránh timeout HTTP và người dùng thấy kết quả sớm', 'Chính xác hơn', 'Không tính token output'],
        answer: 1,
        explain: 'Giá như nhau; streaming cải thiện trải nghiệm và độ bền của kết nối.'
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
      'Gửi ảnh và PDF cho Claude phân tích'
    ],
    sections: [
      {
        h: '1. Structured outputs',
        html: `<p>Có hai cơ chế:</p>
<ul>
<li><strong>JSON outputs</strong>: <code>output_config={"format": {"type": "json_schema", "schema": {...}}}</code> – câu trả lời là JSON hợp lệ theo schema. Tham số cũ <code>output_format</code> trên <code>messages.create()</code> đã deprecated.</li>
<li><strong>Strict tool use</strong>: đặt <code>"strict": true</code> trên định nghĩa tool – đảm bảo <code>tool_use.input</code> khớp schema.</li>
</ul>
<p>Schema cần <code>"additionalProperties": false</code> và liệt kê <code>required</code>. Với Python, cách gọn nhất là <code>client.messages.parse(..., output_format=MyPydanticModel)</code> rồi đọc <code>response.parsed_output</code>.</p>`
      },
      {
        h: '2. Ảnh và PDF',
        html: `<ul>
<li><strong>Ảnh</strong>: content block <code>{"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": ...}}</code> hoặc source dạng URL.</li>
<li><strong>PDF</strong>: <code>{"type": "document", "source": {"type": "base64", "media_type": "application/pdf", "data": ...}}</code>, đặt trước text block. Claude đọc cả chữ lẫn hình trong PDF.</li>
<li>File dùng nhiều lần: upload qua <strong>Files API</strong> rồi tham chiếu bằng <code>file_id</code>.</li>
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
        solution: `<p>Điểm cần chú ý: trường không có trong CV phải là <code>None</code> chứ không phải giá trị bịa ra. Thêm vào prompt: “Nếu CV không nêu thông tin, để trống trường đó.” Kiểm tra bằng một CV thiếu email.</p>`
      },
      {
        title: 'Bài 2 – Mô tả ảnh chụp màn hình lỗi',
        task: `<p>Gửi ảnh chụp màn hình thông báo lỗi và yêu cầu Claude trả về JSON: <code>{"error_message", "likely_cause", "fix_steps": []}</code>.</p>`,
        hint: 'media_type phải khớp định dạng file (image/png, image/jpeg…).',
        solution: `<p>Dùng <code>output_config.format</code> với schema 3 trường. Đây là mẫu cho các hệ thống hỗ trợ kỹ thuật tự động – kết hợp vision + structured output.</p>`
      }
    ],
    quiz: [
      {
        q: 'Tham số đúng để nhận JSON theo schema trên messages.create()?',
        options: ['output_format', 'output_config.format với type json_schema', 'response_format', 'json_mode=True'],
        answer: 1,
        explain: 'output_format trên create() đã deprecated; dùng output_config.format.'
      },
      {
        q: 'Muốn tham số tool luôn khớp schema, bạn đặt gì?',
        options: ['"strict": true trên định nghĩa tool', 'tool_choice strict', 'temperature=0', 'Không làm được'],
        answer: 0,
        explain: 'strict là trường cấp cao nhất trên tool, cạnh name/description/input_schema.'
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
        solution: `<p>Thông báo lỗi có hướng dẫn giúp Claude tự sửa (hỏi lại người dùng mã đúng) thay vì bỏ cuộc. Đây là nguyên tắc thiết kế tool quan trọng sẽ gặp lại ở tháng 3.</p>`
      },
      {
        title: 'Bài 2 – Giới hạn số vòng lặp',
        task: `<p>Thêm <code>MAX_TURNS = 10</code> vào vòng lặp. Khi vượt, dừng lại và trả thông báo. Vì sao đây là yêu cầu bắt buộc với agent chạy production?</p>`,
        hint: 'Nghĩ về chi phí và trường hợp tool luôn trả lỗi.',
        solution: `<p>Không có giới hạn, agent có thể lặp vô hạn (tool lỗi liên tục, model hiểu sai) → tốn tiền và treo hệ thống. Các biện pháp: giới hạn số vòng, task budget (beta), timeout, và log mọi lần gọi tool.</p>`
      },
      {
        title: 'Bài 3 – Dùng Tool Runner của SDK',
        task: `<p>Viết lại ví dụ bằng Tool Runner: đánh dấu hàm Python với <code>@beta_tool</code> và dùng <code>client.beta.messages.tool_runner(...)</code>. So sánh số dòng code với vòng lặp thủ công.</p>`,
        hint: 'Xem mục Tool Runner trong tài liệu SDK Python; docstring của hàm trở thành description của tool.',
        solution: `<pre><code>from anthropic import beta_tool

@beta_tool
def get_weather(city: str) -> str:
    """Lấy thời tiết hiện tại của một thành phố."""
    return {"Hà Nội": "28°C, nắng"}.get(city, "Không có dữ liệu")

runner = client.beta.messages.tool_runner(
    model="claude-opus-5", max_tokens=16000,
    tools=[get_weather],
    messages=[{"role": "user", "content": "Thời tiết Hà Nội?"}],
)
final = runner.until_done()</code></pre>
<p>Tool Runner gọn hơn; vòng lặp thủ công cho toàn quyền kiểm soát (log, phê duyệt, retry tuỳ biến).</p>`
      }
    ],
    quiz: [
      {
        q: 'Claude trả về 3 khối tool_use trong một response. Bạn gửi kết quả thế nào?',
        options: ['3 lượt user riêng, mỗi lượt 1 tool_result', 'Một lượt user chứa cả 3 tool_result', 'Chỉ gửi kết quả đầu tiên', 'Gửi trong system prompt'],
        answer: 1,
        explain: 'Tách ra nhiều lượt khiến Claude “học” rằng không nên gọi song song.'
      },
      {
        q: 'Tool thất bại (API bên thứ ba timeout). Cách xử lý đúng?',
        options: ['Bỏ qua, không trả tool_result', 'Trả tool_result với is_error: true và thông báo lỗi rõ ràng', 'Dừng chương trình', 'Tự bịa kết quả'],
        answer: 1,
        explain: 'Claude cần biết tool lỗi để thử lại, dùng cách khác hoặc báo người dùng.'
      },
      {
        q: 'Ai chạy client tool (tool bạn tự định nghĩa)?',
        options: ['Server Anthropic', 'Code ứng dụng của bạn', 'Claude tự chạy trong sandbox', 'Trình duyệt người dùng'],
        answer: 1,
        explain: 'Chỉ server tool (web search, code execution…) chạy trên hạ tầng Anthropic.'
      }
    ],
    resources: [
      { t: 'Tool use overview – docs.claude.com', url: 'https://docs.claude.com' }
    ]
  }
);

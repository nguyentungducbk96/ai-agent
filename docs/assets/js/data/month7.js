/* Tháng 7 (chuyên đề) – Claude cho Fullstack: workflow tự động */
window.LESSONS = window.LESSONS || [];
window.MONTHS = window.MONTHS || [];

window.MONTHS.push({
  "month": 7,
  "period": "Chuyên đề",
  "title": "Claude cho Fullstack: workflow tự động",
  "domain": "Ứng dụng thực tế · cả 5 domain",
  "goal": "Xây workflow tự động với Claude cho team fullstack NestJS/Next.js/AWS/GitHub Actions."
});

window.LESSONS.push({
  "id": "m7w1",
  "month": 7,
  "week": 1,
  "duration": "8 giờ",
  "domain": "Agentic Architecture · Claude Code",
  "title": "Kiến trúc workflow tự động với Claude cho team fullstack",
  "objectives": [
    "Xác định 4 vị trí đặt Claude trong vòng đời phát triển: Claude Code local, headless trong CI, Agent SDK service, Messages API trong NestJS",
    "Tổ chức monorepo pnpm + Turborepo sẵn sàng cho Claude: CLAUDE.md theo app, .claude/, .mcp.json",
    "Quản lý secret đúng chỗ: GitHub Secrets, AWS Secrets Manager, OIDC thay cho access key dài hạn",
    "Kiểm soát chi phí: chọn model, effort, caching, giới hạn lượt và đo chi phí mỗi PR"
  ],
  "flow": {
    "title": "Một thay đổi đi qua 4 điểm có Claude trước khi lên AWS",
    "steps": [
      {
        "kind": "start",
        "label": "Dev nhận ticket",
        "detail": "GitHub Issue trong repo monorepo"
      },
      {
        "kind": "step",
        "label": "Claude Code local",
        "detail": "đọc CLAUDE.md, code apps/api + apps/web",
        "note": "Hook format, deny đọc .env"
      },
      {
        "kind": "step",
        "label": "Mở pull request",
        "detail": "branch feature/*"
      },
      {
        "kind": "step",
        "label": "GitHub Actions chạy CI",
        "detail": "turbo run test --filter=...[origin/main]",
        "note": "Chỉ build app bị ảnh hưởng"
      },
      {
        "kind": "step",
        "label": "Claude review headless",
        "detail": "claude -p, tool chỉ đọc",
        "note": "Key lấy từ GitHub Secrets"
      },
      {
        "kind": "decision",
        "label": "Reviewer người duyệt?",
        "note": "Không → sửa, push lại",
        "loopTo": 1,
        "loopLabel": "sửa tiếp"
      },
      {
        "kind": "step",
        "label": "Deploy qua OIDC lên AWS",
        "detail": "ECS Fargate / Lambda, RDS migrate",
        "note": "Không lưu AWS key trong repo"
      },
      {
        "kind": "end",
        "label": "API NestJS gọi Claude",
        "detail": "key từ AWS Secrets Manager"
      }
    ]
  },
  "realExamples": [
    {
      "title": "Startup giao đồ ăn ở Đà Nẵng: 5 dev, 3 app trong một monorepo",
      "html": "<p>Team có <code>apps/api</code> (NestJS), <code>apps/web</code> (Next.js) và <code>apps/admin</code>. Trước đây mỗi PR chờ review trung bình 1,5 ngày vì chỉ có 1 senior. Sau khi thêm bước review headless bằng Claude Code trong GitHub Actions (tool chỉ đọc, bình luận tóm tắt rủi ro), senior chỉ còn đọc các PR được gắn nhãn “rủi ro cao”.</p><p>Kết quả sau 6 tuần: thời gian chờ review giảm còn khoảng nửa ngày, số bug lọt lên staging giảm khoảng 30%. Chi phí API khoảng vài chục USD mỗi tháng nhờ chỉ review file thay đổi và dùng <code>--filter</code> của Turborepo để giới hạn phạm vi. Điểm mấu chốt: Claude không merge, chỉ bình luận; người vẫn là người quyết định.</p>"
    },
    {
      "title": "Công ty fintech ở TP.HCM: chuyển từ access key sang OIDC",
      "html": "<p>Workflow deploy cũ lưu <code>AWS_ACCESS_KEY_ID</code> trong GitHub Secrets, key không bao giờ hết hạn và có quyền admin. Team dùng Claude Code phân tích các workflow YAML, liệt kê quyền thực sự cần (ECR push, ECS update-service, đọc 1 secret), rồi viết lại bằng OIDC với role quyền tối thiểu.</p><pre><code>permissions:\n  id-token: write\n  contents: read\nsteps:\n  - uses: aws-actions/configure-aws-credentials@v4\n    with:\n      role-to-assume: arn:aws:iam::123456789012:role/gha-deploy-api\n      aws-region: ap-southeast-1</code></pre><p>Sau thay đổi, không còn key dài hạn nào trong repo, và API key Claude của service NestJS được đọc từ AWS Secrets Manager lúc khởi động container.</p>"
    }
  ],
  "recap": {
    "summary": [
      "Có 4 vị trí đặt Claude: Claude Code local (dev), headless trong GitHub Actions (CI), Agent SDK service (tác vụ nền), Messages API trong NestJS (tính năng cho người dùng).",
      "Monorepo nên có CLAUDE.md ở gốc cho quy ước chung và CLAUDE.md trong từng app cho lệnh và kiến trúc riêng; CLAUDE.md thư mục con chỉ nạp khi Claude đọc file ở đó.",
      "Secret: ANTHROPIC_API_KEY cho CI ở GitHub Secrets, cho runtime ở AWS Secrets Manager; deploy dùng OIDC thay cho access key.",
      "Trong CI, Claude chạy headless với tool giới hạn và không có quyền merge.",
      "Chi phí kiểm soát bằng: giới hạn phạm vi (affected), model/effort phù hợp, prompt caching, max turns và đo chi phí mỗi PR."
    ],
    "tips": [
      "“<strong>4 chỗ: Máy – CI – Nền – Sản phẩm</strong>”: Claude Code local, headless CI, Agent SDK, Messages API.",
      "“<strong>Key ở két, không ở code</strong>”: GitHub Secrets cho CI, Secrets Manager cho runtime.",
      "“<strong>OIDC = vé một lần</strong>”: token ngắn hạn thay cho chìa khoá vĩnh viễn.",
      "“<strong>CI chỉ đọc, người mới merge</strong>”: headless review dùng tool đọc, không auto-merge.",
      "Bẫy đề thi: đáp án “cho Claude quyền admin để tiện” luôn sai; chọn đáp án quyền tối thiểu."
    ]
  },
  "sections": [
    {
      "h": "1. Bốn vị trí đặt Claude trong vòng đời phát triển",
      "html": "<div class=\"table-wrap\"><table>\n<tr><th>Vị trí</th><th>Công cụ</th><th>Ví dụ trong monorepo</th><th>Ai chịu trách nhiệm</th></tr>\n<tr><td>Máy dev</td><td>Claude Code (CLI, IDE)</td><td>Viết module NestJS, trang Next.js, sửa test</td><td>Dev review từng diff</td></tr>\n<tr><td>CI</td><td>Claude Code headless (<code>claude -p</code>) trong GitHub Actions</td><td>Review PR, phân tích ảnh hưởng, tóm tắt thay đổi</td><td>Reviewer người duyệt</td></tr>\n<tr><td>Service nền</td><td>Claude Agent SDK hoặc Messages API + tool</td><td>Worker đọc SQS, phân loại ticket, sinh báo cáo đêm</td><td>Owner service, có log và giới hạn</td></tr>\n<tr><td>Sản phẩm</td><td>Messages API (<code>@anthropic-ai/sdk</code>) hoặc Amazon Bedrock</td><td>Chatbot hỗ trợ trong <code>apps/web</code> gọi <code>apps/api</code></td><td>Team sản phẩm, có eval</td></tr>\n</table></div>\n<p>Nguyên tắc chọn: việc lặp lại, có tiêu chí rõ và kiểm chứng được (test, lint, schema) thì tự động hoá; quyết định kiến trúc, merge, migrate production vẫn cần người duyệt.</p>"
    },
    {
      "h": "2. Bố cục repo sẵn sàng cho Claude",
      "html": "<pre><code>repo/\n├── CLAUDE.md                 # quy ước chung: pnpm, turbo, cách chạy test, quy tắc commit\n├── .mcp.json                 # github (HTTP), postgres dev (stdio) – token qua ${VAR}\n├── .claude/\n│   ├── settings.json         # allow pnpm test/lint, deny Read(./.env*), ask git push\n│   ├── agents/code-reviewer.md\n│   └── skills/new-endpoint/SKILL.md\n├── apps/\n│   ├── api/   CLAUDE.md      # NestJS: module/controller/service, DTO + class-validator\n│   └── web/   CLAUDE.md      # Next.js App Router: server component mặc định\n├── packages/\n│   ├── db/                   # Prisma schema + migrations\n│   └── shared/               # type/zod dùng chung api ↔ web\n└── .github/workflows/        # ci.yml, claude-review.yml, deploy.yml</code></pre><p>CLAUDE.md ở gốc nạp khi mở phiên; <code>apps/api/CLAUDE.md</code> chỉ nạp khi Claude đọc file trong <code>apps/api</code>, giúp context gọn.</p>"
    },
    {
      "h": "3. Secret và quyền truy cập",
      "html": "<ul>\n<li><strong>CI</strong>: <code>ANTHROPIC_API_KEY</code> lưu trong GitHub Secrets (hoặc Environment secrets có reviewer bắt buộc cho production).</li>\n<li><strong>Deploy AWS</strong>: dùng OIDC (<code>permissions: id-token: write</code> + <code>aws-actions/configure-aws-credentials</code>) với IAM role quyền tối thiểu, không lưu access key.</li>\n<li><strong>Runtime</strong>: service NestJS đọc key từ AWS Secrets Manager (hoặc dùng Claude trên Amazon Bedrock với IAM role của task, không cần API key Anthropic).</li>\n<li><strong>Claude Code</strong>: <code>deny</code> đọc <code>.env*</code>; hook <code>PreToolUse</code> chặn sửa file secret – hook chạy <em>trước</em> bước kiểm tra permission.</li>\n</ul>"
    },
    {
      "h": "4. Kiểm soát chi phí",
      "html": "<div class=\"table-wrap\"><table>\n<tr><th>Đòn bẩy</th><th>Áp dụng</th></tr>\n<tr><td>Giới hạn phạm vi</td><td>Chỉ gửi diff và file bị ảnh hưởng (<code>turbo ... --filter=...[origin/main]</code>)</td></tr>\n<tr><td>Prompt caching</td><td>System prompt + quy ước cố định ở đầu, có <code>cache_control</code></td></tr>\n<tr><td>Model / effort</td><td>Review thường: effort thấp hơn; phân tích kiến trúc: effort cao. Đo bằng eval trước khi đổi</td></tr>\n<tr><td>Giới hạn lượt</td><td><code>--max-turns</code> / <code>max_turns</code>, timeout job CI</td></tr>\n<tr><td>Đo lường</td><td>Log <code>usage</code> → chi phí mỗi PR, mỗi ticket</td></tr>\n</table></div>"
    }
  ],
  "code": [
    {
      "title": "apps/api/src/ai/claude.service.ts – NestJS service gọi Claude",
      "lang": "typescript",
      "src": "\nimport { Injectable, OnModuleInit } from \"@nestjs/common\";\nimport Anthropic from \"@anthropic-ai/sdk\";\nimport { SecretsManagerClient, GetSecretValueCommand } from \"@aws-sdk/client-secrets-manager\";\n\n@Injectable()\nexport class ClaudeService implements OnModuleInit {\n  private client!: Anthropic;\n\n  async onModuleInit() {\n    // Đọc key từ AWS Secrets Manager khi container khởi động\n    const sm = new SecretsManagerClient({ region: process.env.AWS_REGION });\n    const secret = await sm.send(new GetSecretValueCommand({ SecretId: \"prod/anthropic-api-key\" }));\n    this.client = new Anthropic({ apiKey: secret.SecretString });\n  }\n\n  async summarizeTicket(text: string): Promise<string> {\n    const res = await this.client.messages.create({\n      model: \"claude-opus-5\",\n      max_tokens: 2048,\n      system: \"Bạn tóm tắt ticket hỗ trợ cho kỹ sư, tối đa 5 gạch đầu dòng.\",\n      messages: [{ role: \"user\", content: text }],\n    });\n    return res.content.map((b) => (b.type === \"text\" ? b.text : \"\")).join(\"\");\n  }\n}"
    },
    {
      "title": ".github/workflows/claude-review.yml – review PR headless",
      "lang": "yaml",
      "src": "\nname: claude-review\non:\n  pull_request:\n    types: [opened, synchronize]\npermissions:\n  contents: read\n  pull-requests: write\njobs:\n  review:\n    runs-on: ubuntu-latest\n    timeout-minutes: 10\n    steps:\n      - uses: actions/checkout@v4\n        with: { fetch-depth: 0 }\n      - uses: actions/setup-node@v4\n        with: { node-version: 22 }\n      - name: Claude review (chỉ đọc)\n        env:\n          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}\n        run: |\n          git diff origin/${{ github.base_ref }}...HEAD > diff.patch\n          npx -y @anthropic-ai/claude-code -p \"Review diff.patch theo CLAUDE.md. Liệt kê tối đa 5 vấn đề, mỗi vấn đề có file:dòng.\" \\\n            --allowedTools \"Read,Grep,Glob\" --output-format json > review.json\n      - name: Bình luận lên PR\n        env: { GH_TOKEN: \"${{ github.token }}\" }\n        run: gh pr comment ${{ github.event.pull_request.number }} --body \"$(jq -r '.result' review.json)\"\n# Có thể dùng action chính thức anthropics/claude-code-action – kiểm tra README của action để biết input chính xác."
    },
    {
      "title": "Claude trên Amazon Bedrock (không cần API key Anthropic)",
      "lang": "typescript",
      "src": "\nimport { AnthropicBedrockMantle } from \"@anthropic-ai/bedrock-sdk\";\n\n// Dùng IAM role của ECS task / Lambda, không có secret nào trong code\nconst client = new AnthropicBedrockMantle({ awsRegion: \"us-east-1\" });\n\nconst res = await client.messages.create({\n  model: \"anthropic.claude-opus-5\",\n  max_tokens: 1024,\n  messages: [{ role: \"user\", content: \"Viết mô tả ngắn cho endpoint GET /orders/:id\" }],\n});"
    }
  ],
  "exercises": [
    {
      "title": "Bài 1 – Vẽ bản đồ Claude cho dự án của bạn",
      "task": "<p>Với dự án hiện tại (hoặc monorepo mẫu), liệt kê 6 công việc lặp lại của team và đặt mỗi việc vào 1 trong 4 vị trí (local, CI, service nền, sản phẩm). Ghi rõ tiêu chí kiểm chứng và ai duyệt.</p>",
      "hint": "Việc có tiêu chí đúng/sai rõ ràng (test pass, schema hợp lệ) dễ tự động hoá nhất.",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Liệt kê việc lặp lại: viết CRUD endpoint, viết test, review PR, cập nhật changelog, phân loại bug, trả lời câu hỏi docs.</li><li>Gán vị trí: CRUD + test → Claude Code local; review PR + changelog → headless CI; phân loại bug → service nền (SQS worker); hỏi docs → sản phẩm (chatbot nội bộ).</li><li>Với mỗi việc, ghi tiêu chí kiểm chứng: test pass, lint pass, nhãn đúng so với tập mẫu, câu trả lời có trích dẫn.</li><li>Ghi người duyệt cuối: dev, reviewer, owner service hoặc PM.</li></ol><p><strong>Kiểm tra kết quả:</strong> Bảng 6 dòng, mỗi dòng có vị trí, tiêu chí kiểm chứng và người duyệt.</p><p><strong>Lỗi thường gặp:</strong> Đưa việc không kiểm chứng được (quyết định kiến trúc) vào tự động hoàn toàn; bỏ trống cột người duyệt.</p>"
    },
    {
      "title": "Bài 2 – Thiết lập .claude/settings.json cho monorepo",
      "task": "<p>Viết <code>.claude/settings.json</code> ở gốc monorepo: cho phép <code>pnpm test</code>, <code>pnpm lint</code>, <code>pnpm turbo run</code>; hỏi trước <code>git push</code> và <code>prisma migrate</code>; chặn đọc <code>.env*</code>.</p>",
      "hint": "deny luôn thắng; PreToolUse hook chạy trước bước kiểm tra permission.",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Tạo file <code>.claude/settings.json</code> ở gốc repo và commit để cả team dùng.</li><li>Thêm rule allow cho lệnh chỉ đọc hoặc an toàn; ask cho lệnh thay đổi trạng thái bên ngoài; deny cho secret.</li><li>Chạy thử: yêu cầu Claude đọc <code>apps/api/.env</code> → bị chặn; yêu cầu chạy test → không bị hỏi.</li></ol><pre><code>{\n  \"permissions\": {\n    \"allow\": [\"Bash(pnpm test:*)\", \"Bash(pnpm lint:*)\", \"Bash(pnpm turbo run:*)\", \"Bash(git diff:*)\"],\n    \"ask\": [\"Bash(git push:*)\", \"Bash(pnpm prisma migrate:*)\"],\n    \"deny\": [\"Read(./.env)\", \"Read(./.env.*)\", \"Read(./apps/*/.env)\", \"Read(./apps/*/.env.*)\"]\n  }\n}</code></pre><p><strong>Kiểm tra kết quả:</strong> Dùng /permissions trong phiên để xem rule đang áp dụng; thử cả 3 loại lệnh.</p><p><strong>Lỗi thường gặp:</strong> Chỉ chặn <code>./.env</code> mà quên <code>.env</code> trong từng app; allow <code>Bash(*)</code> cho tiện.</p>"
    },
    {
      "title": "Bài 3 – Chuyển deploy sang OIDC",
      "task": "<p>Viết lại job deploy <code>apps/api</code> lên ECS: bỏ access key, dùng OIDC với role <code>gha-deploy-api</code>. Liệt kê quyền IAM tối thiểu.</p>",
      "hint": "Cần permissions id-token: write ở job; trust policy của role giới hạn theo repo và branch.",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Tạo IAM OIDC provider cho <code>token.actions.githubusercontent.com</code> (một lần cho tài khoản AWS).</li><li>Tạo role <code>gha-deploy-api</code> với trust policy chỉ cho <code>repo:org/repo:ref:refs/heads/main</code>.</li><li>Gán quyền tối thiểu: ECR push vào repo image của api, <code>ecs:UpdateService</code> và <code>ecs:DescribeServices</code> cho service api, <code>iam:PassRole</code> cho task role.</li><li>Sửa workflow dùng <code>aws-actions/configure-aws-credentials@v4</code> với <code>role-to-assume</code>.</li></ol><pre><code>jobs:\n  deploy-api:\n    runs-on: ubuntu-latest\n    permissions: { id-token: write, contents: read }\n    environment: production\n    steps:\n      - uses: actions/checkout@v4\n      - uses: aws-actions/configure-aws-credentials@v4\n        with:\n          role-to-assume: arn:aws:iam::123456789012:role/gha-deploy-api\n          aws-region: ap-southeast-1\n      - run: ./scripts/deploy-api.sh</code></pre><p><strong>Kiểm tra kết quả:</strong> Xoá secret AWS_ACCESS_KEY_ID khỏi repo, workflow vẫn deploy thành công; chạy từ branch khác bị từ chối.</p><p><strong>Lỗi thường gặp:</strong> Trust policy dùng <code>repo:org/*</code> quá rộng; quên <code>id-token: write</code> nên lấy token thất bại.</p>"
    },
    {
      "title": "Bài 4 – Đo chi phí Claude mỗi PR",
      "task": "<p>Mở rộng workflow review: lưu <code>usage</code> (nếu dùng Messages API) hoặc <code>total_cost_usd</code> trong kết quả JSON của <code>claude -p</code> vào artifact, và cộng dồn theo tuần.</p>",
      "hint": "Kết quả --output-format json của Claude Code có các trường tổng hợp; kiểm tra tên trường bằng cách in toàn bộ JSON một lần.",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Chạy <code>claude -p ... --output-format json</code> và in toàn bộ file để xem các trường có sẵn (kết quả, chi phí, số lượt).</li><li>Dùng <code>jq</code> trích trường chi phí và số lượt, ghi ra <code>metrics.json</code> kèm số PR.</li><li>Upload artifact bằng <code>actions/upload-artifact@v4</code>; một workflow hằng tuần gom artifact và tính tổng.</li></ol><pre><code>- name: Lưu số liệu\n  run: jq '{pr: ${{ github.event.pull_request.number }}, cost: .total_cost_usd, turns: .num_turns}' review.json &gt; metrics.json\n- uses: actions/upload-artifact@v4\n  with: { name: claude-metrics-${{ github.run_id }}, path: metrics.json }</code></pre><p><strong>Kiểm tra kết quả:</strong> Sau 1 tuần có bảng chi phí trung bình mỗi PR; so sánh trước/sau khi giới hạn phạm vi diff.</p><p><strong>Lỗi thường gặp:</strong> Đoán tên trường thay vì in JSON thật để kiểm tra; không giới hạn timeout nên job treo tốn phút Actions.</p>"
    }
  ],
  "quiz": [
    {
      "q": "Team muốn Claude tự bình luận rủi ro trên mọi PR. Cách phù hợp nhất?",
      "options": [
        "Chạy Claude Code headless trong GitHub Actions với tool chỉ đọc, key từ GitHub Secrets, người vẫn duyệt merge",
        "Cho Claude quyền merge để xử lý nhanh",
        "Mỗi dev tự copy diff vào claude.ai",
        "Lưu API key trong file workflow cho dễ debug"
      ],
      "answer": 0,
      "explain": "<strong>Vì sao đúng:</strong> Headless trong CI tự động, lặp lại được, quyền tối thiểu và giữ người duyệt cuối.<br><strong>Vì sao các lựa chọn khác sai:</strong> Quyền merge vi phạm nguyên tắc người duyệt hành động khó đảo ngược; copy thủ công không tự động; key trong workflow bị lộ trong git."
    },
    {
      "q": "Service NestJS chạy trên ECS cần gọi Claude mà không muốn quản lý API key Anthropic. Lựa chọn tốt?",
      "options": [
        "Ghi key vào biến môi trường trong Dockerfile",
        "Dùng Claude trên Amazon Bedrock với IAM role của ECS task",
        "Gọi Claude từ trình duyệt người dùng",
        "Dùng chung key cá nhân của một dev"
      ],
      "answer": 1,
      "explain": "<strong>Vì sao đúng:</strong> Bedrock xác thực bằng IAM, task role cấp quyền, không có secret trong code.<br><strong>Vì sao các lựa chọn khác sai:</strong> Key trong Dockerfile nằm trong image; gọi từ trình duyệt làm lộ key; key cá nhân không kiểm soát được và vi phạm bảo mật."
    },
    {
      "q": "Vì sao nên đặt CLAUDE.md riêng trong <code>apps/api</code> và <code>apps/web</code>?",
      "options": [
        "Claude Code bắt buộc mỗi thư mục một file",
        "Để tăng số token cache",
        "CLAUDE.md thư mục con chỉ nạp khi Claude làm việc với file ở đó, giữ context gọn và đúng ngữ cảnh",
        "Để thay thế settings.json"
      ],
      "answer": 2,
      "explain": "<strong>Vì sao đúng:</strong> Nạp theo nhu cầu giúp hướng dẫn NestJS không chiếm context khi sửa Next.js và ngược lại.<br><strong>Vì sao các lựa chọn khác sai:</strong> Không bắt buộc; không liên quan cache; CLAUDE.md là kiến thức, settings.json là luật do harness áp dụng."
    },
    {
      "q": "Deploy từ GitHub Actions lên AWS an toàn nhất bằng cách nào?",
      "options": [
        "Access key admin lưu trong GitHub Secrets",
        "Access key trong file .env commit lên repo private",
        "Tạo user IAM chung cho cả team",
        "OIDC với IAM role quyền tối thiểu, trust policy giới hạn repo và branch"
      ],
      "answer": 3,
      "explain": "<strong>Vì sao đúng:</strong> OIDC cấp token ngắn hạn, không có key dài hạn, giới hạn được nguồn gọi.<br><strong>Vì sao các lựa chọn khác sai:</strong> Key admin dài hạn rủi ro cao khi lộ; repo private không phải kho secret; user chung không truy vết được."
    },
    {
      "q": "Chi phí review PR bằng Claude tăng mạnh. Việc nên làm đầu tiên?",
      "options": [
        "Giới hạn phạm vi gửi cho Claude (chỉ diff, file bị ảnh hưởng) và đo chi phí mỗi PR",
        "Tắt tính năng",
        "Đổi ngay sang model rẻ nhất mà không đo",
        "Tăng max_tokens"
      ],
      "answer": 0,
      "explain": "<strong>Vì sao đúng:</strong> Giảm input thừa là đòn bẩy không làm giảm chất lượng; đo để biết hiệu quả.<br><strong>Vì sao các lựa chọn khác sai:</strong> Tắt làm mất lợi ích; đổi model không đo có thể giảm chất lượng; tăng max_tokens làm tăng chi phí."
    },
    {
      "q": "Hook PreToolUse chặn sửa <code>.env</code> và rule allow <code>Edit</code> cùng tồn tại. Khi Claude sửa <code>.env</code> điều gì xảy ra?",
      "options": [
        "Sửa thành công vì allow",
        "Hook chạy trước kiểm tra permission, exit 2 nên tool bị chặn và lý do được gửi cho Claude",
        "Claude Code dừng phiên",
        "Hook chạy sau khi file đã bị sửa"
      ],
      "answer": 1,
      "explain": "<strong>Vì sao đúng:</strong> PreToolUse chạy trước bước permission và có thể chặn tool.<br><strong>Vì sao các lựa chọn khác sai:</strong> allow không vượt qua hook chặn; phiên không dừng; PostToolUse mới chạy sau."
    }
  ],
  "resources": [
    {
      "t": "Claude Code – GitHub Actions",
      "url": "https://code.claude.com/docs"
    },
    {
      "t": "Claude on Amazon Bedrock – docs.claude.com",
      "url": "https://docs.claude.com"
    },
    {
      "t": "GitHub – OIDC với AWS",
      "url": "https://docs.github.com/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services"
    }
  ]
},
{
  "id": "m7w2",
  "month": 7,
  "week": 2,
  "duration": "8 giờ",
  "domain": "Prompt Engineering · Agentic Architecture",
  "title": "Tự động thiết kế database từ yêu cầu",
  "objectives": [
    "Biến yêu cầu nghiệp vụ thành mô hình entity có cấu trúc bằng structured outputs",
    "Sinh ERD (mermaid) và Prisma schema có index, ràng buộc, quy ước đặt tên",
    "Dùng subagent review schema và cổng phê duyệt của người trước khi migrate",
    "Tích hợp vào monorepo: packages/db, migration trong CI, deploy an toàn lên RDS"
  ],
  "flow": {
    "title": "Từ yêu cầu tới migration: máy đề xuất, người duyệt",
    "steps": [
      {
        "kind": "start",
        "label": "Yêu cầu nghiệp vụ",
        "detail": "user story, form, báo cáo cần có"
      },
      {
        "kind": "step",
        "label": "Trích entity (JSON)",
        "detail": "output_config.format = json_schema",
        "note": "Entity, field, quan hệ, ràng buộc"
      },
      {
        "kind": "step",
        "label": "Sinh ERD mermaid",
        "note": "PM/BA xem và góp ý nhanh"
      },
      {
        "kind": "step",
        "label": "Sinh schema.prisma",
        "detail": "packages/db/prisma/schema.prisma"
      },
      {
        "kind": "step",
        "label": "Subagent review schema",
        "detail": "index, FK, naming, soft delete",
        "note": "Chỉ có tool đọc"
      },
      {
        "kind": "decision",
        "label": "Người duyệt đồng ý?",
        "note": "Không → sửa theo góp ý",
        "loopTo": 1,
        "loopLabel": "sửa lại"
      },
      {
        "kind": "step",
        "label": "prisma migrate dev",
        "detail": "sinh migration SQL, commit"
      },
      {
        "kind": "end",
        "label": "CI: migrate deploy lên RDS",
        "detail": "environment production có reviewer"
      }
    ]
  },
  "realExamples": [
    {
      "title": "Phòng khám nha khoa ở Hà Nội: từ file Excel sang PostgreSQL",
      "html": "<p>Phòng khám quản lý lịch hẹn bằng 4 sheet Excel. Dev đưa tên cột và 20 dòng mẫu (đã ẩn thông tin bệnh nhân) cho Claude, yêu cầu trả JSON gồm entity, field, kiểu dữ liệu và quan hệ. Claude đề xuất 6 bảng: <code>Patient</code>, <code>Dentist</code>, <code>Appointment</code>, <code>Treatment</code>, <code>Invoice</code>, <code>InvoiceItem</code>, phát hiện cột “Bác sĩ” đang chứa cả tên và chuyên khoa nên tách ra.</p><p>Subagent review chỉ ra thiếu unique constraint cho <code>(dentistId, startAt)</code> để chặn đặt trùng lịch và thiếu index cho tra cứu theo số điện thoại. Dev duyệt, chạy migration trên RDS staging, import dữ liệu thử. Tổng thời gian thiết kế từ 3 ngày còn khoảng nửa ngày, nhưng quyết định cuối về quan hệ và ràng buộc vẫn do dev và bác sĩ trưởng xác nhận.</p>"
    },
    {
      "title": "Sàn thương mại điện tử: thêm tính năng voucher mà không phá schema cũ",
      "html": "<p>Schema có 80 bảng. Thay vì đưa toàn bộ, dev cho Claude Code đọc <code>packages/db/prisma/schema.prisma</code> và mô tả tính năng voucher. Claude đề xuất 2 bảng mới <code>Voucher</code>, <code>VoucherRedemption</code> và 1 cột nullable <code>voucherId</code> trên <code>Order</code>, kèm lý do chọn nullable để migration không khoá bảng lớn.</p><pre><code>model VoucherRedemption {\n  id         String   @id @default(cuid())\n  voucherId  String\n  orderId    String   @unique\n  userId     String\n  redeemedAt DateTime @default(now())\n  voucher    Voucher  @relation(fields: [voucherId], references: [id])\n  @@index([userId, redeemedAt])\n}</code></pre><p>Review người phát hiện cần giới hạn mỗi user dùng 1 lần/voucher, thêm <code>@@unique([voucherId, userId])</code> trước khi merge.</p>"
    }
  ],
  "recap": {
    "summary": [
      "Luồng chuẩn: yêu cầu → entity JSON (structured outputs) → ERD → Prisma schema → review → người duyệt → migration.",
      "Structured outputs đảm bảo mô hình entity đúng schema, dễ kiểm tra bằng code trước khi sinh Prisma.",
      "Review phải có checklist: khoá chính, khoá ngoại, unique, index theo truy vấn, kiểu tiền tệ (Decimal), thời gian (UTC), soft delete, quy ước tên.",
      "Migration production chạy trong CI với environment có reviewer, không để agent tự migrate.",
      "Schema cũ lớn: cho Claude đọc file schema thật thay vì mô tả bằng lời, và ưu tiên thay đổi tương thích ngược (cột nullable, bảng mới)."
    ],
    "tips": [
      "“<strong>Y-E-E-P-R-M</strong>”: Yêu cầu → Entity → ERD → Prisma → Review → Migrate.",
      "“<strong>Tiền dùng Decimal, giờ dùng UTC</strong>”: 2 lỗi thiết kế DB hay gặp nhất.",
      "“<strong>Index theo câu hỏi, không theo cảm giác</strong>”: liệt kê truy vấn trước rồi mới đặt index.",
      "“<strong>Máy vẽ, người ký</strong>”: Claude đề xuất, người duyệt trước khi migrate deploy.",
      "Bẫy đề thi: chọn đáp án cho agent tự chạy migrate trên production là sai."
    ]
  },
  "sections": [
    {
      "h": "1. Trích mô hình entity bằng structured outputs",
      "html": "<p>Bước đầu tiên không phải sinh Prisma ngay, mà là một mô hình trung gian dạng JSON có schema cố định. Lợi ích: kiểm tra được bằng code (tên trùng, quan hệ trỏ tới entity không tồn tại), hiển thị được cho BA, và sinh được nhiều đầu ra (ERD, Prisma, tài liệu).</p><div class=\"table-wrap\"><table>\n<tr><th>Trường</th><th>Ý nghĩa</th></tr>\n<tr><td><code>entities[].name</code></td><td>Tên PascalCase số ít: <code>Order</code>, <code>OrderItem</code></td></tr>\n<tr><td><code>fields[]</code></td><td>name, type (String, Int, Decimal, DateTime, Boolean, Json, Enum), required, unique</td></tr>\n<tr><td><code>relations[]</code></td><td>from, to, kind (1-1, 1-n, n-n), onDelete</td></tr>\n<tr><td><code>indexes[]</code></td><td>field list + lý do (truy vấn nào dùng)</td></tr>\n<tr><td><code>openQuestions[]</code></td><td>Điểm yêu cầu chưa rõ – hỏi lại BA thay vì đoán</td></tr>\n</table></div>"
    },
    {
      "h": "2. Từ entity sang ERD và Prisma",
      "html": "<p>ERD dạng mermaid dán thẳng vào PR hoặc tài liệu để BA đọc. Prisma schema đặt trong <code>packages/db</code>, được <code>apps/api</code> dùng qua Prisma Client và <code>packages/shared</code> xuất type cho <code>apps/web</code>.</p><pre><code>erDiagram\n  User ||--o{ Order : places\n  Order ||--|{ OrderItem : contains\n  Product ||--o{ OrderItem : \"is in\"</code></pre>"
    },
    {
      "h": "3. Checklist review schema",
      "html": "<ul>\n<li>Khoá chính thống nhất (<code>cuid()</code>/<code>uuid()</code> hoặc số tự tăng) trong toàn repo.</li>\n<li>Khoá ngoại có <code>onDelete</code> rõ ràng; bảng lớn tránh cascade xoá dây chuyền ngoài ý muốn.</li>\n<li>Unique cho ràng buộc nghiệp vụ (email, mã đơn, một voucher một lần mỗi user).</li>\n<li>Index theo truy vấn thực tế (lọc, sắp xếp, join).</li>\n<li>Tiền: <code>Decimal</code>; thời gian: <code>DateTime</code> lưu UTC; enum cho trạng thái.</li>\n<li>Migration tương thích ngược khi bảng đang có dữ liệu: thêm cột nullable → backfill → đặt NOT NULL ở migration sau.</li>\n</ul>"
    },
    {
      "h": "4. Cổng phê duyệt và migration trong CI",
      "html": "<p><code>prisma migrate dev</code> chạy ở máy dev để sinh file migration và commit. Trên CI: <code>prisma migrate deploy</code> chạy trong job dùng GitHub Environment <code>production</code> có reviewer bắt buộc, kết nối RDS qua secret hoặc IAM. Claude Code local nên để <code>prisma migrate</code> ở mức <code>ask</code>.</p>"
    }
  ],
  "code": [
    {
      "title": "packages/db/scripts/design-entities.ts – trích entity bằng structured outputs",
      "lang": "typescript",
      "src": "\nimport Anthropic from \"@anthropic-ai/sdk\";\nimport { readFileSync, writeFileSync } from \"node:fs\";\n\nconst client = new Anthropic();\n\nconst schema = {\n  type: \"object\",\n  properties: {\n    entities: {\n      type: \"array\",\n      items: {\n        type: \"object\",\n        properties: {\n          name: { type: \"string\" },\n          fields: {\n            type: \"array\",\n            items: {\n              type: \"object\",\n              properties: {\n                name: { type: \"string\" },\n                type: { type: \"string\", enum: [\"String\", \"Int\", \"Decimal\", \"DateTime\", \"Boolean\", \"Json\", \"Enum\"] },\n                required: { type: \"boolean\" },\n                unique: { type: \"boolean\" },\n              },\n              required: [\"name\", \"type\", \"required\", \"unique\"],\n              additionalProperties: false,\n            },\n          },\n        },\n        required: [\"name\", \"fields\"],\n        additionalProperties: false,\n      },\n    },\n    relations: {\n      type: \"array\",\n      items: {\n        type: \"object\",\n        properties: {\n          from: { type: \"string\" },\n          to: { type: \"string\" },\n          kind: { type: \"string\", enum: [\"1-1\", \"1-n\", \"n-n\"] },\n        },\n        required: [\"from\", \"to\", \"kind\"],\n        additionalProperties: false,\n      },\n    },\n    openQuestions: { type: \"array\", items: { type: \"string\" } },\n  },\n  required: [\"entities\", \"relations\", \"openQuestions\"],\n  additionalProperties: false,\n};\n\nconst requirement = readFileSync(\"docs/requirements/booking.md\", \"utf8\");\n\nconst res = await client.messages.create({\n  model: \"claude-opus-5\",\n  max_tokens: 16000,\n  system: \"Bạn là kiến trúc sư dữ liệu PostgreSQL. Không đoán điều yêu cầu chưa nêu: đưa vào openQuestions.\",\n  messages: [{ role: \"user\", content: `<requirement>\\n${requirement}\\n</requirement>\\nTrích mô hình entity.` }],\n  output_config: { format: { type: \"json_schema\", schema } },\n});\n\nconst text = res.content.find((b) => b.type === \"text\");\nif (text && text.type === \"text\") writeFileSync(\"entities.json\", text.text);"
    },
    {
      "title": "packages/db/prisma/schema.prisma – kết quả sau review",
      "lang": "prisma",
      "src": "\nmodel Appointment {\n  id        String            @id @default(cuid())\n  patientId String\n  dentistId String\n  startAt   DateTime\n  endAt     DateTime\n  status    AppointmentStatus @default(BOOKED)\n  patient   Patient           @relation(fields: [patientId], references: [id])\n  dentist   Dentist           @relation(fields: [dentistId], references: [id])\n  createdAt DateTime          @default(now())\n\n  @@unique([dentistId, startAt])\n  @@index([patientId, startAt])\n}\n\nenum AppointmentStatus {\n  BOOKED\n  DONE\n  CANCELLED\n}"
    }
  ],
  "exercises": [
    {
      "title": "Bài 1 – Trích entity cho tính năng đặt lịch",
      "task": "<p>Viết <code>docs/requirements/booking.md</code> (khách đặt lịch với nhân viên, huỷ trước 2 giờ, nhắc lịch qua email). Chạy script <code>design-entities.ts</code> và kiểm tra JSON bằng code: tên entity không trùng, mọi relation trỏ tới entity tồn tại.</p>",
      "hint": "Dùng structured outputs nên JSON luôn đúng schema; phần còn lại (logic) vẫn phải tự kiểm tra.",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Viết yêu cầu ngắn gọn, mỗi quy tắc một dòng, có số liệu (2 giờ, 24 giờ nhắc lịch).</li><li>Chạy script bằng <code>pnpm tsx packages/db/scripts/design-entities.ts</code>.</li><li>Viết hàm kiểm tra: tập tên entity, duyệt relations xem <code>from</code>/<code>to</code> có trong tập không.</li><li>Đọc <code>openQuestions</code> và gửi lại BA những câu chưa rõ.</li></ol><pre><code>import { readFileSync } from \"node:fs\";\nconst m = JSON.parse(readFileSync(\"entities.json\", \"utf8\"));\nconst names = new Set(m.entities.map((e: { name: string }) =&gt; e.name));\nif (names.size !== m.entities.length) throw new Error(\"Trùng tên entity\");\nfor (const r of m.relations) {\n  if (!names.has(r.from) || !names.has(r.to)) throw new Error(`Quan hệ lỗi: ${r.from} → ${r.to}`);\n}\nconsole.log(\"OK\", [...names], \"Câu hỏi mở:\", m.openQuestions);</code></pre><p><strong>Kiểm tra kết quả:</strong> Script in OK và danh sách câu hỏi mở; nếu có lỗi quan hệ, sửa prompt hoặc yêu cầu.</p><p><strong>Lỗi thường gặp:</strong> Tin JSON đúng schema nghĩa là đúng nghiệp vụ; bỏ qua openQuestions.</p>"
    },
    {
      "title": "Bài 2 – Sinh Prisma schema và ERD",
      "task": "<p>Từ <code>entities.json</code>, nhờ Claude Code sinh <code>schema.prisma</code> và ERD mermaid. Chạy <code>prisma validate</code> và <code>prisma format</code>.</p>",
      "hint": "Để Claude Code chạy prisma validate trong vòng lặp để tự sửa lỗi cú pháp.",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Prompt Claude Code: “Từ entities.json, viết packages/db/prisma/schema.prisma theo quy ước trong packages/db/CLAUDE.md, rồi chạy pnpm prisma validate đến khi pass.”</li><li>Cho phép <code>Bash(pnpm prisma validate)</code> và <code>Bash(pnpm prisma format)</code> trong settings để không bị hỏi.</li><li>Yêu cầu sinh thêm ERD mermaid vào <code>docs/erd.md</code>.</li></ol><p><strong>Kiểm tra kết quả:</strong> <code>pnpm prisma validate</code> pass; ERD hiển thị đúng trên GitHub.</p><p><strong>Lỗi thường gặp:</strong> Cho phép luôn <code>prisma migrate</code> ở bước này; không đặt quy ước tên trong CLAUDE.md nên mỗi lần sinh một kiểu.</p>"
    },
    {
      "title": "Bài 3 – Subagent review schema",
      "task": "<p>Tạo <code>.claude/agents/schema-reviewer.md</code> với tool chỉ đọc, checklist ở mục 3 của bài. Chạy trên schema vừa sinh và sửa các vấn đề Nghiêm trọng.</p>",
      "hint": "Subagent có context riêng nên đọc được nhiều file mà không làm đầy context chính.",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Viết frontmatter: name, description (dùng khi thay đổi schema.prisma), tools: Read, Grep, Glob.</li><li>Phần thân: checklist khoá chính, FK/onDelete, unique nghiệp vụ, index theo truy vấn, Decimal cho tiền, UTC, migration tương thích ngược.</li><li>Yêu cầu định dạng báo cáo: mức độ, model, field, lý do, đề xuất sửa.</li></ol><pre><code>---\nname: schema-reviewer\ndescription: Review thay đổi packages/db/prisma/schema.prisma. Dùng trước khi tạo migration.\ntools: Read, Grep, Glob\n---\nKiểm tra theo checklist: @id thống nhất; @relation có onDelete; @@unique cho ràng buộc nghiệp vụ;\n@@index cho truy vấn trong apps/api (grep prisma.&lt;model&gt;.findMany); tiền dùng Decimal; thời gian UTC.\nBáo cáo: Nghiêm trọng / Nên sửa / Gợi ý, mỗi mục ghi model.field và lý do. Không sửa file.</code></pre><p><strong>Kiểm tra kết quả:</strong> Báo cáo liệt kê ít nhất 1 vấn đề nếu schema cố ý thiếu unique; sau sửa không còn mục Nghiêm trọng.</p><p><strong>Lỗi thường gặp:</strong> Cho subagent quyền Edit; checklist chung chung nên review không phát hiện gì.</p>"
    },
    {
      "title": "Bài 4 – Migration production có cổng duyệt",
      "task": "<p>Viết job GitHub Actions chạy <code>prisma migrate deploy</code> lên RDS, chỉ chạy sau khi reviewer duyệt environment <code>production</code>.</p>",
      "hint": "Dùng environment protection rules; DATABASE_URL lấy từ environment secret.",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Tạo environment <code>production</code> trong Settings → Environments, bật Required reviewers.</li><li>Thêm secret <code>DATABASE_URL</code> ở cấp environment (không ở cấp repo).</li><li>Job migrate phụ thuộc job test, dùng <code>environment: production</code>.</li></ol><pre><code>migrate:\n  needs: test\n  runs-on: ubuntu-latest\n  environment: production\n  steps:\n    - uses: actions/checkout@v4\n    - uses: pnpm/action-setup@v4\n    - run: pnpm install --frozen-lockfile\n    - run: pnpm --filter @repo/db exec prisma migrate deploy\n      env:\n        DATABASE_URL: ${{ secrets.DATABASE_URL }}</code></pre><p><strong>Kiểm tra kết quả:</strong> Job dừng chờ duyệt; sau khi duyệt migration áp dụng lên RDS staging trước, production sau.</p><p><strong>Lỗi thường gặp:</strong> Chạy migrate deploy trên mọi push; secret DB ở cấp repo nên job khác cũng đọc được.</p>"
    }
  ],
  "quiz": [
    {
      "q": "Vì sao nên trích mô hình entity dạng JSON có schema trước khi sinh Prisma?",
      "options": [
        "Prisma không đọc được văn bản",
        "Để tốn ít token hơn trong mọi trường hợp",
        "Kiểm tra được bằng code, tái sử dụng cho ERD/tài liệu và giảm lỗi định dạng nhờ structured outputs",
        "Vì Claude không viết được Prisma"
      ],
      "answer": 2,
      "explain": "<strong>Vì sao đúng:</strong> Mô hình trung gian có cấu trúc giúp validate và sinh nhiều đầu ra.<br><strong>Vì sao các lựa chọn khác sai:</strong> Prisma là file văn bản; token không phải lý do chính; Claude viết được Prisma nhưng thiếu bước kiểm tra."
    },
    {
      "q": "Cột tiền trong bảng đơn hàng nên dùng kiểu gì trong Prisma/PostgreSQL?",
      "options": [
        "Float",
        "String",
        "Int lưu đơn vị nghìn",
        "Decimal"
      ],
      "answer": 3,
      "explain": "<strong>Vì sao đúng:</strong> Decimal chính xác cho tiền tệ.<br><strong>Vì sao các lựa chọn khác sai:</strong> Float sai số làm tròn; String khó tính toán; Int nghìn mất độ chính xác khi có lẻ."
    },
    {
      "q": "Bảng <code>orders</code> có 50 triệu dòng. Thêm cột bắt buộc mới thế nào an toàn?",
      "options": [
        "Thêm cột nullable → backfill theo lô → migration sau đặt NOT NULL",
        "Thêm cột NOT NULL không default trong một migration",
        "Xoá bảng tạo lại",
        "Để agent tự quyết định lúc deploy"
      ],
      "answer": 0,
      "explain": "<strong>Vì sao đúng:</strong> Migration tương thích ngược tránh khoá bảng lâu và lỗi dữ liệu cũ.<br><strong>Vì sao các lựa chọn khác sai:</strong> NOT NULL không default thất bại hoặc khoá bảng; xoá bảng mất dữ liệu; agent tự quyết định vi phạm cổng duyệt."
    },
    {
      "q": "Ai nên chạy <code>prisma migrate deploy</code> lên production?",
      "options": [
        "Claude Code local của dev bất kỳ",
        "Job CI dùng environment production có reviewer bắt buộc",
        "Agent nền tự chạy mỗi đêm",
        "Bất kỳ ai có DATABASE_URL"
      ],
      "answer": 1,
      "explain": "<strong>Vì sao đúng:</strong> Có kiểm soát, truy vết và cổng duyệt người.<br><strong>Vì sao các lựa chọn khác sai:</strong> Máy dev và agent tự động không có cổng duyệt; chia sẻ DATABASE_URL rộng vi phạm quyền tối thiểu."
    },
    {
      "q": "Claude trả <code>openQuestions: [\"Một khách có đặt nhiều lịch cùng lúc không?\"]</code>. Nên làm gì?",
      "options": [
        "Bỏ qua để tiến độ nhanh",
        "Để Claude tự đoán",
        "Hỏi lại BA/chủ sản phẩm rồi cập nhật yêu cầu trước khi chốt ràng buộc",
        "Thêm mọi unique có thể"
      ],
      "answer": 2,
      "explain": "<strong>Vì sao đúng:</strong> Ràng buộc nghiệp vụ phải được xác nhận; đây là mục đích của openQuestions.<br><strong>Vì sao các lựa chọn khác sai:</strong> Bỏ qua hoặc đoán dẫn tới schema sai; thêm unique bừa chặn nghiệp vụ hợp lệ."
    },
    {
      "q": "Index nên được quyết định dựa trên gì?",
      "options": [
        "Đặt index cho mọi cột",
        "Chỉ khoá chính",
        "Theo thứ tự cột trong bảng",
        "Các truy vấn thực tế (lọc, sắp xếp, join) trong apps/api"
      ],
      "answer": 3,
      "explain": "<strong>Vì sao đúng:</strong> Index phục vụ truy vấn; grep các lời gọi Prisma để biết truy vấn nào dùng.<br><strong>Vì sao các lựa chọn khác sai:</strong> Index mọi cột làm chậm ghi và tốn dung lượng; chỉ khoá chính thiếu cho tra cứu; thứ tự cột không liên quan."
    }
  ],
  "resources": [
    {
      "t": "Structured outputs – docs.claude.com",
      "url": "https://docs.claude.com"
    },
    {
      "t": "Prisma – Migrate",
      "url": "https://www.prisma.io/docs/orm/prisma-migrate"
    }
  ]
},
{
  "id": "m7w3",
  "month": 7,
  "week": 3,
  "duration": "8 giờ",
  "domain": "Agentic Architecture · Context Management",
  "title": "Phân tích task và phạm vi ảnh hưởng trong monorepo",
  "objectives": [
    "Kết hợp dependency graph (Turborepo/Nx) với agentic search để tìm phạm vi ảnh hưởng",
    "Sinh báo cáo ảnh hưởng dạng JSON có cấu trúc: file, API, bảng DB, test, mức rủi ro",
    "Tự động đăng báo cáo lên PR/issue bằng GitHub Actions",
    "Đánh giá độ chính xác của báo cáo bằng eval trên các PR cũ"
  ],
  "flow": {
    "title": "Ticket vào, báo cáo ra: graph cho phạm vi, Claude cho chi tiết",
    "steps": [
      {
        "kind": "start",
        "label": "Ticket hoặc PR mới",
        "detail": "mô tả + diff (nếu có)"
      },
      {
        "kind": "step",
        "label": "Lấy dependency graph",
        "detail": "turbo ls --affected / nx affected",
        "note": "Biết package nào phụ thuộc nhau"
      },
      {
        "kind": "step",
        "label": "Claude tìm code liên quan",
        "detail": "Grep, Glob, Read theo từ khoá",
        "note": "Agentic search, không nhồi cả repo"
      },
      {
        "kind": "step",
        "label": "Truy vết API và bảng DB",
        "detail": "controller → service → prisma.model"
      },
      {
        "kind": "decision",
        "label": "Đủ bằng chứng chưa?",
        "note": "Chưa → tìm thêm file",
        "loopTo": 2,
        "loopLabel": "tìm tiếp"
      },
      {
        "kind": "step",
        "label": "Báo cáo JSON có cấu trúc",
        "detail": "files, apis, tables, tests, risk"
      },
      {
        "kind": "step",
        "label": "Chạy test bị ảnh hưởng",
        "detail": "turbo run test --filter=...[origin/main]"
      },
      {
        "kind": "end",
        "label": "Bình luận lên PR",
        "detail": "reviewer quyết định phạm vi test"
      }
    ]
  },
  "realExamples": [
    {
      "title": "Đổi định dạng mã đơn hàng ở công ty logistics",
      "html": "<p>Ticket: đổi mã vận đơn từ 10 lên 12 ký tự. Dev nghĩ chỉ sửa <code>packages/shared/src/order-code.ts</code>. Báo cáo ảnh hưởng của Claude chỉ ra thêm: validation DTO trong <code>apps/api</code>, cột <code>VARCHAR(10)</code> trong migration cũ, component nhập mã trong <code>apps/web</code> có <code>maxLength=10</code>, và 1 Lambda đối soát đọc file CSV cố định độ rộng.</p><p>Nhờ vậy team thêm migration đổi độ dài cột, cập nhật Lambda và viết thêm 4 test trước khi release. Trước đây, lỗi kiểu này thường chỉ lộ ra ở production sau 1–2 ngày.</p>"
    },
    {
      "title": "Nâng cấp thư viện xác thực trong monorepo 14 package",
      "html": "<p>Nâng cấp <code>@repo/auth</code> lên phiên bản mới có thay đổi phá vỡ. <code>turbo ls --affected</code> cho biết 6 package bị ảnh hưởng; Claude đọc cách từng package dùng API cũ và phân loại: 4 chỗ đổi tên hàm đơn giản, 2 chỗ dùng callback đã bị bỏ cần sửa logic.</p><pre><code>{\n  \"risk\": \"medium\",\n  \"packages\": [\"apps/api\", \"apps/web\", \"apps/admin\", \"packages/auth-ui\", \"packages/sdk\", \"services/billing\"],\n  \"breaking\": [{ \"file\": \"apps/api/src/auth/jwt.strategy.ts\", \"reason\": \"onTokenRefresh đã bị bỏ\" }],\n  \"testsToRun\": [\"apps/api:test:e2e\", \"apps/web:test\"]\n}</code></pre><p>Tech lead chia việc theo báo cáo, 2 dev xong trong 1 ngày thay vì ước tính 3 ngày.</p>"
    }
  ],
  "recap": {
    "summary": [
      "Dependency graph của Turborepo/Nx cho phạm vi ở mức package; Claude bổ sung chi tiết ở mức file, API, bảng DB.",
      "Claude Code tìm code bằng agentic search (Grep, Glob, Read) thay vì nhồi toàn bộ repo vào context.",
      "Báo cáo nên có cấu trúc JSON cố định để hiển thị, lọc và đánh giá tự động.",
      "Chạy test theo phạm vi ảnh hưởng (<code>--filter=...[origin/main]</code>) để tiết kiệm phút CI.",
      "Đánh giá báo cáo bằng PR cũ đã biết kết quả: đo tỉ lệ bắt đúng file và bỏ sót."
    ],
    "tips": [
      "“<strong>Graph cho khung, Claude cho chi tiết</strong>”.",
      "“<strong>F-A-T-T-R</strong>”: Files – APIs – Tables – Tests – Risk, 5 mục của báo cáo.",
      "“<strong>Tìm, đừng nhồi</strong>”: agentic search thay vì đưa cả repo vào context.",
      "“<strong>Ba chấm trước ngoặc</strong>”: <code>...[origin/main]</code> gồm cả package phụ thuộc vào thay đổi.",
      "Bẫy đề thi: báo cáo ảnh hưởng là thông tin cho người quyết định, không tự động bỏ qua test."
    ]
  },
  "sections": [
    {
      "h": "1. Hai nguồn thông tin bổ sung cho nhau",
      "html": "<div class=\"table-wrap\"><table>\n<tr><th></th><th>Dependency graph (Turborepo/Nx)</th><th>Claude (agentic search)</th></tr>\n<tr><td>Mức chi tiết</td><td>Package / project</td><td>File, hàm, endpoint, bảng DB</td></tr>\n<tr><td>Độ chắc chắn</td><td>Tất định, dựa trên import và package.json</td><td>Suy luận, cần bằng chứng (file:dòng)</td></tr>\n<tr><td>Phát hiện được</td><td>Package nào cần build/test lại</td><td>Chỗ dùng gián tiếp: chuỗi SQL, config, Lambda ngoài monorepo, tài liệu</td></tr>\n<tr><td>Chi phí</td><td>Gần như 0</td><td>Token – cần giới hạn lượt và phạm vi</td></tr>\n</table></div>"
    },
    {
      "h": "2. Cấu trúc báo cáo ảnh hưởng",
      "html": "<p>Dùng schema cố định để báo cáo so sánh được giữa các PR và chấm điểm được:</p><pre><code>{\n  \"summary\": \"string\",\n  \"risk\": \"low | medium | high\",\n  \"files\": [{ \"path\": \"string\", \"reason\": \"string\" }],\n  \"apis\": [{ \"method\": \"GET|POST|PUT|PATCH|DELETE\", \"path\": \"string\", \"change\": \"string\" }],\n  \"tables\": [{ \"name\": \"string\", \"change\": \"string\" }],\n  \"tests\": [{ \"target\": \"string\", \"why\": \"string\" }],\n  \"openQuestions\": [\"string\"]\n}</code></pre>"
    },
    {
      "h": "3. Chạy trong GitHub Actions",
      "html": "<p>Job chạy khi mở PR: lấy danh sách package bị ảnh hưởng, gọi Claude Code headless với tool chỉ đọc và prompt yêu cầu trả JSON theo schema, rồi bình luận dạng bảng lên PR. Với ticket chưa có code, chạy tương tự trên nhánh main với mô tả ticket.</p><div class=\"callout warn\">Báo cáo là đầu vào cho người quyết định. Không dùng báo cáo để bỏ qua test bắt buộc; test theo phạm vi ảnh hưởng chỉ bổ sung cho bộ test đầy đủ chạy định kỳ.</div>"
    },
    {
      "h": "4. Đo độ chính xác",
      "html": "<p>Lấy 20 PR cũ đã merge: file thực sự thay đổi và bug phát sinh sau đó là “đáp án”. Chạy phân tích trên mô tả ticket gốc, đo <strong>recall</strong> (tỉ lệ file thật sự bị ảnh hưởng được liệt kê) và <strong>precision</strong> (tỉ lệ file liệt kê thực sự liên quan). Cải tiến prompt/CLAUDE.md dựa trên các ca bỏ sót.</p>"
    }
  ],
  "code": [
    {
      "title": "scripts/impact.ts – phân tích ảnh hưởng bằng Messages API + tool đọc file",
      "lang": "typescript",
      "src": "\nimport Anthropic from \"@anthropic-ai/sdk\";\nimport { execFileSync } from \"node:child_process\";\nimport { readFileSync } from \"node:fs\";\nimport path from \"node:path\";\n\nconst client = new Anthropic();\nconst ROOT = process.cwd();\n\nconst tools: Anthropic.Tool[] = [\n  {\n    name: \"grep\",\n    description: \"Tìm chuỗi trong repo (git grep). Trả tối đa 50 dòng dạng file:dòng:nội dung.\",\n    input_schema: { type: \"object\", properties: { pattern: { type: \"string\" } }, required: [\"pattern\"] },\n  },\n  {\n    name: \"read_file\",\n    description: \"Đọc một file trong repo theo đường dẫn tương đối.\",\n    input_schema: { type: \"object\", properties: { path: { type: \"string\" } }, required: [\"path\"] },\n  },\n];\n\nfunction runTool(name: string, input: Record<string, string>): string {\n  if (name === \"grep\") {\n    try {\n      return execFileSync(\"git\", [\"grep\", \"-n\", \"--\", input.pattern], { encoding: \"utf8\" }).split(\"\\n\").slice(0, 50).join(\"\\n\");\n    } catch {\n      return \"Không tìm thấy.\";\n    }\n  }\n  const p = path.resolve(ROOT, input.path);\n  if (!p.startsWith(ROOT + path.sep)) throw new Error(\"Đường dẫn nằm ngoài repo\");\n  return readFileSync(p, \"utf8\").slice(0, 20000);\n}\n\nexport async function analyze(ticket: string, affected: string[]) {\n  const messages: Anthropic.MessageParam[] = [{\n    role: \"user\",\n    content: `<ticket>${ticket}</ticket>\\n<affected_packages>${affected.join(\", \")}</affected_packages>\\nTìm phạm vi ảnh hưởng, mỗi mục kèm bằng chứng file:dòng.`,\n  }];\n  for (let turn = 0; turn < 15; turn++) {\n    const res = await client.messages.create({ model: \"claude-opus-5\", max_tokens: 8000, tools, messages });\n    messages.push({ role: \"assistant\", content: res.content });\n    if (res.stop_reason !== \"tool_use\") return res;\n    const results: Anthropic.ToolResultBlockParam[] = [];\n    for (const b of res.content) {\n      if (b.type !== \"tool_use\") continue;\n      try {\n        results.push({ type: \"tool_result\", tool_use_id: b.id, content: runTool(b.name, b.input as Record<string, string>) });\n      } catch (e) {\n        results.push({ type: \"tool_result\", tool_use_id: b.id, content: String(e), is_error: true });\n      }\n    }\n    messages.push({ role: \"user\", content: results });\n  }\n  throw new Error(\"Vượt 15 lượt\");\n}"
    },
    {
      "title": ".github/workflows/impact.yml – bình luận báo cáo lên PR",
      "lang": "yaml",
      "src": "\nname: impact-analysis\non: { pull_request: { types: [opened, synchronize] } }\npermissions: { contents: read, pull-requests: write }\njobs:\n  impact:\n    runs-on: ubuntu-latest\n    timeout-minutes: 10\n    steps:\n      - uses: actions/checkout@v4\n        with: { fetch-depth: 0 }\n      - uses: pnpm/action-setup@v4\n      - run: pnpm install --frozen-lockfile\n      - name: Package bị ảnh hưởng\n        run: pnpm turbo ls --affected --output=json > affected.json   # kiểm tra cú pháp theo phiên bản Turborepo\n      - name: Phân tích bằng Claude\n        env: { ANTHROPIC_API_KEY: \"${{ secrets.ANTHROPIC_API_KEY }}\" }\n        run: |\n          npx -y @anthropic-ai/claude-code -p \"Đọc affected.json và git diff origin/${{ github.base_ref }}...HEAD. \\\n          Trả JSON theo schema trong docs/impact-schema.json, mỗi mục có bằng chứng file:dòng.\" \\\n            --allowedTools \"Read,Grep,Glob,Bash(git diff:*)\" --output-format json > impact.json\n      - run: gh pr comment ${{ github.event.pull_request.number }} --body \"$(jq -r '.result' impact.json)\"\n        env: { GH_TOKEN: \"${{ github.token }}\" }"
    }
  ],
  "exercises": [
    {
      "title": "Bài 1 – Chạy test theo phạm vi ảnh hưởng",
      "task": "<p>Trong monorepo Turborepo, cấu hình CI chỉ chạy lint và test cho package thay đổi và package phụ thuộc vào chúng so với <code>origin/main</code>.</p>",
      "hint": "Cú pháp filter <code>...[origin/main]</code> gồm package thay đổi và các package phụ thuộc vào chúng; cần fetch-depth: 0.",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Checkout với <code>fetch-depth: 0</code> để có lịch sử so sánh.</li><li>Chạy <code>pnpm turbo run lint test --filter=...[origin/main]</code>.</li><li>Thêm job chạy toàn bộ test theo lịch hằng đêm để bắt các phụ thuộc mà graph không thấy.</li></ol><pre><code>- uses: actions/checkout@v4\n  with: { fetch-depth: 0 }\n- run: pnpm turbo run lint test --filter=...[origin/main]</code></pre><p><strong>Kiểm tra kết quả:</strong> PR chỉ sửa <code>apps/web</code> không chạy test <code>apps/api</code>; PR sửa <code>packages/shared</code> chạy cả hai.</p><p><strong>Lỗi thường gặp:</strong> Quên fetch-depth nên so sánh sai; dùng <code>--filter=[origin/main]</code> (thiếu ba chấm) nên bỏ sót package phụ thuộc.</p>"
    },
    {
      "title": "Bài 2 – Báo cáo JSON theo schema",
      "task": "<p>Viết <code>docs/impact-schema.json</code> và sửa script <code>impact.ts</code> để lượt cuối trả JSON đúng schema bằng structured outputs.</p>",
      "hint": "Sau khi vòng lặp tool xong, gọi thêm một request với output_config.format và nội dung tóm tắt các bằng chứng.",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Tách hai giai đoạn: (a) vòng lặp tool để thu thập bằng chứng; (b) một request tổng hợp dùng <code>output_config.format</code>.</li><li>Trong (b), đưa lịch sử hội thoại đã có và yêu cầu “Tổng hợp thành báo cáo theo schema”.</li><li>Parse JSON và render bảng markdown để bình luận lên PR.</li></ol><pre><code>const report = await client.messages.create({\n  model: \"claude-opus-5\",\n  max_tokens: 8000,\n  messages: [...messages, { role: \"user\", content: \"Tổng hợp thành báo cáo ảnh hưởng theo schema.\" }],\n  output_config: { format: { type: \"json_schema\", schema: impactSchema } },\n});</code></pre><p><strong>Kiểm tra kết quả:</strong> JSON parse được, mọi mục có trường reason/evidence; bảng markdown hiển thị trên PR.</p><p><strong>Lỗi thường gặp:</strong> Gộp tool use và structured output trong cùng lượt đầu nên model trả JSON khi chưa tìm đủ; schema thiếu additionalProperties: false.</p>"
    },
    {
      "title": "Bài 3 – Eval trên 10 PR cũ",
      "task": "<p>Chọn 10 PR đã merge, dùng mô tả issue gốc làm input và danh sách file thay đổi thực tế làm đáp án. Tính recall và precision của báo cáo.</p>",
      "hint": "gh pr view <số> --json files để lấy danh sách file thật.",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Lấy dữ liệu: <code>gh pr view N --json title,body,files</code> cho 10 PR.</li><li>Checkout commit trước PR, chạy phân tích với mô tả issue.</li><li>Tính recall = |dự đoán ∩ thật| / |thật|, precision = |dự đoán ∩ thật| / |dự đoán|.</li><li>Đọc các ca bỏ sót, bổ sung CLAUDE.md (ví dụ: “Lambda đối soát nằm ở services/reconcile đọc file CSV”).</li></ol><p><strong>Kiểm tra kết quả:</strong> Bảng 10 dòng có recall/precision; mục tiêu ban đầu recall ≥ 0,8.</p><p><strong>Lỗi thường gặp:</strong> Chạy phân tích trên code đã có thay đổi (lộ đáp án); chỉ đo precision mà bỏ qua bỏ sót.</p>"
    },
    {
      "title": "Bài 4 – Giới hạn chi phí phân tích",
      "task": "<p>Thêm 3 giới hạn cho job phân tích: số lượt tối đa, timeout job, và bỏ qua PR chỉ sửa tài liệu.</p>",
      "hint": "paths-ignore trong trigger pull_request; --max-turns cho claude -p (kiểm tra tên cờ theo phiên bản).",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Trigger: <code>paths-ignore: ['**/*.md', 'docs/**']</code>.</li><li>Job: <code>timeout-minutes: 10</code>.</li><li>Claude Code: giới hạn số lượt (cờ max turns) và tool chỉ đọc; script tự viết: vòng for có giới hạn như ví dụ.</li></ol><p><strong>Kiểm tra kết quả:</strong> PR sửa README không chạy job; PR lớn dừng đúng giới hạn và vẫn bình luận kết quả một phần.</p><p><strong>Lỗi thường gặp:</strong> Không có timeout nên job treo tốn phút Actions; bỏ qua cả PR sửa file config quan trọng.</p>"
    }
  ],
  "quiz": [
    {
      "q": "Turborepo cho biết <code>apps/web</code> và <code>apps/admin</code> bị ảnh hưởng. Claude bổ sung giá trị gì?",
      "options": [
        "Chi tiết ở mức file, endpoint, bảng DB và chỗ dùng gián tiếp mà graph không thấy",
        "Không có giá trị gì thêm",
        "Thay thế hoàn toàn dependency graph",
        "Tự động bỏ qua test không cần"
      ],
      "answer": 0,
      "explain": "<strong>Vì sao đúng:</strong> Graph tất định ở mức package; Claude tìm chi tiết và phụ thuộc gián tiếp.<br><strong>Vì sao các lựa chọn khác sai:</strong> Hai nguồn bổ sung nhau, không thay thế; báo cáo không nên dùng để bỏ test bắt buộc."
    },
    {
      "q": "Cách để Claude tìm code liên quan trong repo 2 triệu dòng?",
      "options": [
        "Nhồi toàn bộ repo vào context",
        "Agentic search: cho tool grep/read và để Claude tìm theo từ khoá, giới hạn số lượt",
        "Chỉ đọc README",
        "Fine-tune model trên repo"
      ],
      "answer": 1,
      "explain": "<strong>Vì sao đúng:</strong> Tìm đúng phần cần thiết, giữ context gọn và có bằng chứng.<br><strong>Vì sao các lựa chọn khác sai:</strong> Nhồi toàn bộ vượt context và tốn kém; README không đủ; fine-tune không phải cách tiếp cận cho bài toán này."
    },
    {
      "q": "Filter nào chạy test cho package thay đổi <em>và</em> package phụ thuộc vào chúng?",
      "options": [
        "--filter=[origin/main]",
        "--filter=apps/*",
        "--filter=...[origin/main]",
        "--all"
      ],
      "answer": 2,
      "explain": "<strong>Vì sao đúng:</strong> Ba chấm phía trước bao gồm các dependents.<br><strong>Vì sao các lựa chọn khác sai:</strong> Không có ba chấm chỉ gồm package thay đổi; apps/* không dựa vào diff; --all chạy toàn bộ."
    },
    {
      "q": "Vì sao báo cáo ảnh hưởng nên có schema JSON cố định?",
      "options": [
        "Để đẹp hơn",
        "Vì GitHub yêu cầu",
        "Để giảm số lượt tool",
        "Để render, lọc, so sánh giữa các PR và chấm điểm tự động"
      ],
      "answer": 3,
      "explain": "<strong>Vì sao đúng:</strong> Cấu trúc cố định cho phép tự động hoá và eval.<br><strong>Vì sao các lựa chọn khác sai:</strong> Thẩm mỹ không phải lý do chính; GitHub không yêu cầu; không liên quan số lượt."
    },
    {
      "q": "Tool <code>read_file</code> tự viết nhận path từ model. Rủi ro cần xử lý?",
      "options": [
        "Path traversal: phải chuẩn hoá và chặn đường dẫn ra ngoài repo",
        "Không có rủi ro vì model đáng tin",
        "File quá ngắn",
        "Encoding UTF-8"
      ],
      "answer": 0,
      "explain": "<strong>Vì sao đúng:</strong> Input từ model là không tin cậy, có thể bị prompt injection điều khiển.<br><strong>Vì sao các lựa chọn khác sai:</strong> Model có thể bị dữ liệu độc hại điều khiển; độ dài và encoding không phải rủi ro bảo mật chính."
    },
    {
      "q": "Đo chất lượng phân tích ảnh hưởng thế nào?",
      "options": [
        "Hỏi dev có thích không",
        "Chạy trên PR cũ đã biết file thay đổi thật, đo recall và precision",
        "Đếm số file trong báo cáo",
        "So sánh độ dài báo cáo"
      ],
      "answer": 1,
      "explain": "<strong>Vì sao đúng:</strong> Có đáp án thật nên đo khách quan được cả bỏ sót lẫn báo nhầm.<br><strong>Vì sao các lựa chọn khác sai:</strong> Cảm nhận chủ quan; số file hay độ dài không phản ánh đúng/sai."
    }
  ],
  "resources": [
    {
      "t": "Turborepo – Filtering",
      "url": "https://turborepo.com/docs/reference/run#--filter-string"
    },
    {
      "t": "Nx – affected",
      "url": "https://nx.dev/ci/features/affected"
    }
  ]
},
{
  "id": "m7w4",
  "month": 7,
  "week": 4,
  "duration": "7 giờ",
  "domain": "Agentic Architecture · Prompt Engineering",
  "title": "Chọn tech stack cho dự án mới",
  "objectives": [
    "Lập ma trận quyết định có trọng số: kỹ năng team, thời gian ra mắt, chi phí AWS, quy mô, tuyển dụng",
    "Dùng Claude sinh ADR (Architecture Decision Record) có lựa chọn thay thế và hệ quả",
    "Áp dụng evaluator–optimizer để phản biện lựa chọn trước khi chốt",
    "Biết khi nào NestJS + Next.js phù hợp và khi nào nên chọn giải pháp nhẹ hơn"
  ],
  "flow": {
    "title": "Chốt stack bằng dữ liệu và phản biện, không bằng sở thích",
    "steps": [
      {
        "kind": "start",
        "label": "Yêu cầu dự án mới",
        "detail": "người dùng, tải, deadline, ngân sách"
      },
      {
        "kind": "step",
        "label": "Liệt kê ràng buộc",
        "detail": "team, compliance, hạ tầng hiện có"
      },
      {
        "kind": "step",
        "label": "Đề xuất 2–3 phương án",
        "note": "Có cả phương án đơn giản nhất"
      },
      {
        "kind": "step",
        "label": "Chấm ma trận có trọng số",
        "detail": "structured output: điểm + lý do"
      },
      {
        "kind": "step",
        "label": "Claude phản biện",
        "detail": "evaluator tìm rủi ro, giả định sai",
        "note": "Model/prompt khác bước đề xuất"
      },
      {
        "kind": "decision",
        "label": "Còn rủi ro chưa xử lý?",
        "note": "Có → spike thử 1–2 ngày",
        "loopTo": 3,
        "loopLabel": "chấm lại"
      },
      {
        "kind": "step",
        "label": "Viết ADR",
        "detail": "docs/adr/0001-stack.md"
      },
      {
        "kind": "end",
        "label": "Tech lead + PO duyệt",
        "detail": "commit ADR, khởi tạo monorepo"
      }
    ]
  },
  "realExamples": [
    {
      "title": "Cổng đăng ký sự kiện cho trường đại học: không cần NestJS",
      "html": "<p>Yêu cầu: form đăng ký, 3.000 người dùng mỗi năm, 1 dev, cần xong trong 3 tuần. Claude chấm ma trận và phản biện: NestJS + Next.js + ECS là quá sức cho quy mô này; phương án Next.js (route handlers) + PostgreSQL managed + deploy serverless đạt điểm cao nhất về thời gian ra mắt và chi phí vận hành.</p><p>Evaluator chỉ ra rủi ro: nếu sau này cần API cho app mobile thì route handlers vẫn đáp ứng được, không cần tách backend ngay. Team chọn phương án nhẹ, ghi rõ điều kiện tách backend riêng vào ADR (khi có hơn 2 client hoặc cần xử lý nền phức tạp).</p>"
    },
    {
      "title": "Nền tảng B2B quản lý kho cho chuỗi 200 cửa hàng",
      "html": "<p>Yêu cầu: nhiều module (kho, đơn, báo cáo), 6 dev, tích hợp ERP, job nền đồng bộ mỗi 5 phút. Ma trận cho thấy NestJS (module rõ ràng, DI, queue với SQS) + Next.js (admin) trong monorepo Turborepo phù hợp nhất; ECS Fargate cho API và worker, RDS PostgreSQL.</p><pre><code>| Tiêu chí (trọng số)   | NestJS+Next (ECS) | Next.js full-stack (serverless) | Go + React |\n| Kỹ năng team (0.3)    | 9                 | 7                               | 4          |\n| Ra mắt nhanh (0.2)    | 7                 | 8                               | 5          |\n| Chi phí AWS (0.15)    | 6                 | 8                               | 7          |\n| Job nền/quy mô (0.2)  | 9                 | 5                               | 9          |\n| Tuyển dụng (0.15)     | 8                 | 8                               | 5          |\n| Tổng                  | 8.0               | 7.1                             | 5.8        |</code></pre><p>ADR ghi lại lý do và hệ quả: chi phí ECS cố định cao hơn serverless, chấp nhận vì cần worker chạy liên tục.</p>"
    }
  ],
  "recap": {
    "summary": [
      "Ra quyết định stack bằng ma trận có trọng số, luôn có một phương án đơn giản nhất để so sánh.",
      "Claude giúp sinh phương án, chấm điểm có lý do (structured output) và viết ADR; người quyết định cuối.",
      "Evaluator–optimizer: một bước phản biện độc lập tìm rủi ro và giả định sai trước khi chốt.",
      "Rủi ro chưa rõ → làm spike ngắn để có dữ liệu thật thay vì tranh luận.",
      "NestJS + Next.js phù hợp khi nhiều module, nhiều client, job nền, team đông; dự án nhỏ nên chọn nhẹ hơn."
    ],
    "tips": [
      "“<strong>Đơn giản là ứng viên bắt buộc</strong>” trong mọi ma trận.",
      "“<strong>ADR = Bối cảnh – Quyết định – Hệ quả</strong>”.",
      "“<strong>Một bên đề xuất, một bên phản biện</strong>”: evaluator–optimizer.",
      "“<strong>Tranh luận quá 30 phút → spike 1 ngày</strong>”.",
      "Bẫy đề thi: chọn giải pháp phức tạp nhất vì “mạnh hơn” khi yêu cầu không cần."
    ]
  },
  "sections": [
    {
      "h": "1. Ma trận quyết định có trọng số",
      "html": "<p>Trọng số phản ánh ưu tiên của dự án, được PO và tech lead thống nhất <em>trước</em> khi chấm để tránh chọn trọng số theo kết quả mong muốn.</p>\n<div class=\"table-wrap\"><table>\n<tr><th>Tiêu chí</th><th>Câu hỏi kiểm tra</th></tr>\n<tr><td>Kỹ năng team</td><td>Bao nhiêu người đã ship production với stack này?</td></tr>\n<tr><td>Thời gian ra mắt</td><td>Có boilerplate, thư viện sẵn cho auth, admin, form?</td></tr>\n<tr><td>Chi phí AWS</td><td>Chi phí cố định/tháng ở tải dự kiến và tải ×10</td></tr>\n<tr><td>Quy mô / job nền</td><td>Có cần worker liên tục, WebSocket, xử lý dài không?</td></tr>\n<tr><td>Tuyển dụng / bảo trì</td><td>Dễ tuyển người thay thế sau 2 năm không?</td></tr>\n</table></div>"
    },
    {
      "h": "2. Khi nào chọn gì",
      "html": "<div class=\"table-wrap\"><table>\n<tr><th>Tình huống</th><th>Gợi ý</th></tr>\n<tr><td>CRUD nhỏ, 1–2 dev, cần nhanh</td><td>Next.js full-stack (route handlers/server actions) + PostgreSQL managed, deploy serverless</td></tr>\n<tr><td>Nhiều module, nhiều client (web, mobile, đối tác), job nền</td><td>NestJS API + Next.js trong monorepo, ECS Fargate + SQS worker, RDS</td></tr>\n<tr><td>Tải không đều, sự kiện theo đợt</td><td>Lambda + API Gateway cho phần xử lý theo sự kiện, giữ Next.js cho frontend</td></tr>\n<tr><td>Tính năng AI là trọng tâm</td><td>Thêm module AI trong NestJS gọi Claude API hoặc Bedrock; eval từ ngày đầu</td></tr>\n</table></div>"
    },
    {
      "h": "3. Evaluator–optimizer cho quyết định",
      "html": "<p>Bước đề xuất và bước phản biện nên tách riêng: prompt phản biện yêu cầu tìm giả định chưa kiểm chứng, chi phí ẩn, rủi ro tuyển dụng và kịch bản tải ×10. Dừng khi không còn rủi ro mức cao hoặc sau tối đa 3 vòng.</p>"
    },
    {
      "h": "4. ADR – ghi lại để người sau hiểu",
      "html": "<pre><code># ADR 0001: Chọn stack cho nền tảng quản lý kho\n\n## Bối cảnh\n6 dev (4 người đã dùng NestJS), tích hợp ERP, đồng bộ mỗi 5 phút, 200 cửa hàng.\n\n## Quyết định\nNestJS (apps/api, apps/worker) + Next.js (apps/admin) trong monorepo Turborepo; ECS Fargate, RDS PostgreSQL, SQS.\n\n## Phương án đã cân nhắc\n- Next.js full-stack serverless: đơn giản hơn nhưng job nền 5 phút và tích hợp ERP phức tạp.\n- Go + React: hiệu năng tốt nhưng team ít kinh nghiệm.\n\n## Hệ quả\n+ Module rõ ràng, dùng chung type qua packages/shared.\n- Chi phí cố định ECS cao hơn serverless; xem lại khi tải thấp hơn dự kiến.</code></pre>"
    }
  ],
  "code": [
    {
      "title": "scripts/stack-decision.ts – chấm ma trận bằng structured outputs",
      "lang": "typescript",
      "src": "\nimport Anthropic from \"@anthropic-ai/sdk\";\n\nconst client = new Anthropic();\n\nconst schema = {\n  type: \"object\",\n  properties: {\n    options: {\n      type: \"array\",\n      items: {\n        type: \"object\",\n        properties: {\n          name: { type: \"string\" },\n          scores: {\n            type: \"array\",\n            items: {\n              type: \"object\",\n              properties: { criterion: { type: \"string\" }, score: { type: \"integer\" }, reason: { type: \"string\" } },\n              required: [\"criterion\", \"score\", \"reason\"],\n              additionalProperties: false,\n            },\n          },\n          risks: { type: \"array\", items: { type: \"string\" } },\n        },\n        required: [\"name\", \"scores\", \"risks\"],\n        additionalProperties: false,\n      },\n    },\n  },\n  required: [\"options\"],\n  additionalProperties: false,\n};\n\nconst weights = { team: 0.3, speed: 0.2, cost: 0.15, scale: 0.2, hiring: 0.15 };\n\nconst res = await client.messages.create({\n  model: \"claude-opus-5\",\n  max_tokens: 8000,\n  thinking: { type: \"adaptive\" },\n  system: \"Bạn là kiến trúc sư phần mềm. Chấm 0–10 cho từng tiêu chí: team, speed, cost, scale, hiring. Luôn có phương án đơn giản nhất.\",\n  messages: [{ role: \"user\", content: \"<project>... mô tả dự án ...</project>\\nĐánh giá 3 phương án stack.\" }],\n  output_config: { format: { type: \"json_schema\", schema } },\n});\n\nconst block = res.content.find((b) => b.type === \"text\");\nif (block && block.type === \"text\") {\n  const data = JSON.parse(block.text) as { options: { name: string; scores: { criterion: keyof typeof weights; score: number }[] }[] };\n  for (const o of data.options) {\n    const total = o.scores.reduce((s, x) => s + (weights[x.criterion] ?? 0) * x.score, 0);\n    console.log(o.name, total.toFixed(2));\n  }\n}"
    },
    {
      "title": "Prompt phản biện (evaluator)",
      "lang": "text",
      "src": "\n<decision>{{KẾT QUẢ MA TRẬN + PHƯƠNG ÁN ĐANG DẪN ĐẦU}}</decision>\n\nBạn là reviewer kiến trúc khó tính. Hãy tìm:\n1. Giả định chưa được kiểm chứng (ví dụ \"team đã quen NestJS\").\n2. Chi phí ẩn trên AWS ở tải hiện tại và tải ×10.\n3. Rủi ro vận hành và tuyển dụng sau 2 năm.\n4. Điều kiện nào khiến phương án khác tốt hơn.\nMỗi rủi ro ghi mức low/medium/high và cách kiểm chứng (spike, benchmark, hỏi khách hàng)."
    }
  ],
  "exercises": [
    {
      "title": "Bài 1 – Ma trận cho dự án thật",
      "task": "<p>Chọn một dự án sắp làm. Thống nhất trọng số với PO trước, chạy <code>stack-decision.ts</code> cho 3 phương án (bắt buộc có phương án đơn giản nhất), rồi so với cảm nhận ban đầu của team.</p>",
      "hint": "Ghi trọng số vào file trước khi chạy để không bị điều chỉnh theo kết quả.",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Viết mô tả dự án: người dùng, tải, deadline, ngân sách, tích hợp, yêu cầu tuân thủ.</li><li>Chốt trọng số với PO, commit vào <code>docs/adr/weights.json</code>.</li><li>Chạy script, đọc lý do từng điểm, sửa điểm nào sai sự thật (ví dụ kỹ năng team).</li><li>Ghi lại khác biệt giữa kết quả và cảm nhận ban đầu, cùng lý do.</li></ol><p><strong>Kiểm tra kết quả:</strong> Bảng điểm có lý do cho từng ô, tổng điểm tính bằng code chứ không do model tự cộng.</p><p><strong>Lỗi thường gặp:</strong> Để model tự tính tổng (dễ sai số học); không có phương án đơn giản để đối chứng.</p>"
    },
    {
      "title": "Bài 2 – Vòng phản biện",
      "task": "<p>Viết vòng lặp tối đa 3 vòng: bước phản biện trả danh sách rủi ro JSON; nếu còn rủi ro <code>high</code>, bước đề xuất điều chỉnh phương án và chấm lại.</p>",
      "hint": "Giữ hai system prompt khác nhau cho đề xuất và phản biện.",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Hàm <code>propose(context, feedback)</code> trả phương án + ma trận.</li><li>Hàm <code>critique(decision)</code> dùng structured output trả <code>{risks: [{level, text, howToVerify}]}</code>.</li><li>Lặp tối đa 3 lần; dừng khi không còn rủi ro high.</li><li>Rủi ro cần dữ liệu thật → chuyển thành task spike thay vì lặp thêm.</li></ol><pre><code>for (let i = 0; i &lt; 3; i++) {\n  const decision = await propose(context, feedback);\n  const { risks } = await critique(decision);\n  if (!risks.some((r) =&gt; r.level === \"high\")) return decision;\n  feedback = risks.filter((r) =&gt; r.level === \"high\").map((r) =&gt; r.text).join(\"\\n\");\n}</code></pre><p><strong>Kiểm tra kết quả:</strong> Log mỗi vòng số rủi ro high giảm dần; kết thúc trong 3 vòng.</p><p><strong>Lỗi thường gặp:</strong> Không giới hạn vòng; dùng chung prompt nên bước phản biện luôn đồng ý.</p>"
    },
    {
      "title": "Bài 3 – Sinh ADR và khởi tạo monorepo",
      "task": "<p>Từ kết quả cuối, nhờ Claude Code viết <code>docs/adr/0001-stack.md</code> theo mẫu, sau đó khởi tạo khung monorepo pnpm + Turborepo với <code>apps/api</code> (NestJS), <code>apps/web</code> (Next.js), <code>packages/shared</code>.</p>",
      "hint": "Tạo skill “new-adr” để các ADR sau có cùng định dạng.",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Tạo <code>.claude/skills/new-adr/SKILL.md</code> với mẫu Bối cảnh – Quyết định – Phương án – Hệ quả.</li><li>Yêu cầu Claude Code viết ADR 0001 từ kết quả ma trận và phản biện.</li><li>Khởi tạo repo: <code>pnpm dlx create-turbo@latest</code> rồi thay app mẫu bằng NestJS (<code>pnpm dlx @nestjs/cli new api</code>) và Next.js.</li><li>Viết CLAUDE.md gốc và CLAUDE.md cho từng app.</li></ol><p><strong>Kiểm tra kết quả:</strong> <code>pnpm turbo run build</code> pass; ADR được commit cùng PR khởi tạo.</p><p><strong>Lỗi thường gặp:</strong> ADR thiếu phần phương án đã cân nhắc; không ghi điều kiện xem lại quyết định.</p>"
    },
    {
      "title": "Bài 4 – Spike đo chi phí AWS",
      "task": "<p>Với rủi ro “chi phí ECS cao”, ước tính chi phí hằng tháng của 2 phương án ở tải dự kiến và tải ×10, rồi cập nhật ma trận.</p>",
      "hint": "Dùng AWS Pricing Calculator; Claude giúp lập bảng giả định, bạn nhập số liệu giá thật.",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Liệt kê thành phần: ECS task (vCPU, RAM, số task), RDS instance, NAT gateway, ALB; hoặc Lambda (số request, thời gian chạy), API Gateway.</li><li>Nhập số liệu vào AWS Pricing Calculator, ghi link kết quả.</li><li>Cập nhật điểm tiêu chí chi phí bằng số liệu thật, chạy lại tổng điểm.</li></ol><p><strong>Kiểm tra kết quả:</strong> ADR có bảng chi phí ở 2 mức tải kèm link calculator.</p><p><strong>Lỗi thường gặp:</strong> Để Claude đoán giá AWS thay vì lấy từ calculator; quên NAT gateway và data transfer.</p>"
    }
  ],
  "quiz": [
    {
      "q": "Form đăng ký 3.000 người/năm, 1 dev, deadline 3 tuần. Lựa chọn hợp lý nhất?",
      "options": [
        "NestJS + Next.js + ECS + SQS",
        "Microservices trên Kubernetes",
        "Next.js full-stack với PostgreSQL managed, deploy serverless",
        "Viết backend Go riêng"
      ],
      "answer": 2,
      "explain": "<strong>Vì sao đúng:</strong> Đơn giản nhất đáp ứng đủ yêu cầu và deadline.<br><strong>Vì sao các lựa chọn khác sai:</strong> NestJS+ECS và Kubernetes quá phức tạp cho quy mô; Go tăng thời gian khi team không cần."
    },
    {
      "q": "Vì sao phải chốt trọng số trước khi chấm điểm?",
      "options": [
        "Để chạy nhanh hơn",
        "Claude yêu cầu",
        "Để giảm token",
        "Tránh điều chỉnh trọng số theo kết quả mong muốn"
      ],
      "answer": 3,
      "explain": "<strong>Vì sao đúng:</strong> Trọng số là ưu tiên của dự án, phải độc lập với phương án.<br><strong>Vì sao các lựa chọn khác sai:</strong> Không liên quan tốc độ, token hay yêu cầu của model."
    },
    {
      "q": "Trong ma trận, ai nên tính tổng điểm có trọng số?",
      "options": [
        "Code tính từ điểm thành phần mà Claude trả về có cấu trúc",
        "Claude tự cộng trong câu trả lời",
        "Không cần tổng",
        "PM ước lượng"
      ],
      "answer": 0,
      "explain": "<strong>Vì sao đúng:</strong> Phép tính tất định nên làm bằng code; model lo phần đánh giá có lý do.<br><strong>Vì sao các lựa chọn khác sai:</strong> Model có thể sai số học; không có tổng khó so sánh; ước lượng tay thiếu nhất quán."
    },
    {
      "q": "Mẫu nào phù hợp để “phản biện” lựa chọn stack trước khi chốt?",
      "options": [
        "Routing",
        "Evaluator–optimizer",
        "Prompt caching",
        "Batch API"
      ],
      "answer": 1,
      "explain": "<strong>Vì sao đúng:</strong> Một bước tạo, một bước chấm và phản hồi, lặp có giới hạn.<br><strong>Vì sao các lựa chọn khác sai:</strong> Routing phân loại input; caching và Batch là tối ưu chi phí, không phải mẫu phản biện."
    },
    {
      "q": "Phản biện nêu rủi ro “chưa chắc SQS đáp ứng đồng bộ 5 phút với ERP”. Nên làm gì?",
      "options": [
        "Lặp thêm 10 vòng phản biện",
        "Bỏ qua",
        "Làm spike ngắn để có dữ liệu thật rồi chấm lại",
        "Đổi sang stack khác ngay"
      ],
      "answer": 2,
      "explain": "<strong>Vì sao đúng:</strong> Rủi ro cần dữ liệu thật thì tranh luận thêm không giải quyết được.<br><strong>Vì sao các lựa chọn khác sai:</strong> Lặp thêm tốn chi phí mà không có dữ liệu mới; bỏ qua hoặc đổi vội đều thiếu căn cứ."
    },
    {
      "q": "ADR tốt cần có những phần nào?",
      "options": [
        "Chỉ tên stack",
        "Mã nguồn đầy đủ",
        "Bảng lương team",
        "Bối cảnh, quyết định, phương án đã cân nhắc, hệ quả (tốt và xấu)"
      ],
      "answer": 3,
      "explain": "<strong>Vì sao đúng:</strong> Người sau hiểu vì sao chọn và khi nào nên xem lại.<br><strong>Vì sao các lựa chọn khác sai:</strong> Chỉ tên stack thiếu lý do; mã nguồn và lương không thuộc ADR."
    }
  ],
  "resources": [
    {
      "t": "ADR – Architecture Decision Records",
      "url": "https://adr.github.io"
    },
    {
      "t": "AWS Pricing Calculator",
      "url": "https://calculator.aws"
    }
  ]
},
{
  "id": "m7b1",
  "month": 7,
  "week": 5,
  "duration": "8 giờ",
  "domain": "Claude Code · Agentic Architecture",
  "title": "Dự án bảo trì: hiểu codebase cũ và thêm tính năng an toàn",
  "objectives": [
    "Onboard codebase cũ nhanh với /init, CLAUDE.md và subagent khảo sát kiến trúc",
    "Viết characterization test để “khoá” hành vi hiện tại trước khi sửa",
    "Thêm tính năng mới sau feature flag, chia nhỏ PR, có review subagent",
    "Duy trì regression suite trong CI để thay đổi không phá tính năng cũ"
  ],
  "flow": {
    "title": "Hiểu trước, khoá hành vi, rồi mới sửa từng bước nhỏ",
    "steps": [
      {
        "kind": "start",
        "label": "Nhận dự án bảo trì",
        "detail": "codebase cũ, ít tài liệu"
      },
      {
        "kind": "step",
        "label": "/init và khảo sát",
        "detail": "subagent đọc từng app song song",
        "note": "Kết quả: CLAUDE.md + sơ đồ kiến trúc"
      },
      {
        "kind": "step",
        "label": "Characterization test",
        "detail": "ghi lại hành vi hiện tại",
        "note": "Test pass trên code cũ trước khi sửa"
      },
      {
        "kind": "step",
        "label": "Code tính năng sau flag",
        "detail": "flag tắt mặc định"
      },
      {
        "kind": "step",
        "label": "Review subagent + CI",
        "detail": "regression suite, lint, type check"
      },
      {
        "kind": "decision",
        "label": "Có test cũ nào đỏ?",
        "note": "Có → sửa hoặc hỏi nghiệp vụ",
        "loopTo": 3,
        "loopLabel": "sửa lại"
      },
      {
        "kind": "step",
        "label": "Merge PR nhỏ",
        "detail": "≤ 400 dòng thay đổi"
      },
      {
        "kind": "end",
        "label": "Bật flag dần theo nhóm",
        "detail": "theo dõi CloudWatch, sẵn sàng tắt"
      }
    ]
  },
  "realExamples": [
    {
      "title": "Hệ thống đặt vé xe khách 6 năm tuổi, dev cũ đã nghỉ",
      "html": "<p>Team mới nhận một backend NestJS 4 năm không cập nhật, không có tài liệu. Họ chạy <code>/init</code>, sau đó giao 3 subagent khảo sát song song: module thanh toán, module đặt chỗ, các job cron. Mỗi subagent trả tóm tắt 1 trang: entry point, bảng DB dùng, điểm rủi ro (ví dụ giao dịch không có transaction khi trừ ghế).</p><p>Trước khi thêm tính năng “giữ chỗ 10 phút”, team viết 25 characterization test ghi lại hành vi hiện tại của API đặt vé (kể cả hành vi kỳ quặc). Nhờ vậy khi sửa, 2 test đỏ cho thấy app mobile cũ phụ thuộc vào mã lỗi 409 hiện tại. Tính năng mới được bật cho 5% người dùng trong 3 ngày trước khi bật toàn bộ.</p>"
    },
    {
      "title": "Next.js Pages Router cũ: thêm trang mới mà không di chuyển toàn bộ",
      "html": "<p>Ứng dụng web dùng Pages Router, 120 trang. Thay vì yêu cầu “chuyển hết sang App Router”, tech lead dùng Claude Code lập kế hoạch: trang mới viết trong <code>app/</code>, trang cũ giữ nguyên, hai router cùng tồn tại. CLAUDE.md của <code>apps/web</code> ghi rõ quy tắc để Claude không tự ý di chuyển trang cũ.</p><pre><code>## apps/web/CLAUDE.md\n- Trang MỚI: app/ (App Router, server component mặc định).\n- Trang CŨ trong pages/: chỉ sửa lỗi, KHÔNG di chuyển sang app/ nếu ticket không yêu cầu.\n- Dùng chung component trong packages/ui.</code></pre><p>Sau 2 tháng, 15 trang mới ra mắt mà không có sự cố hồi quy nào từ trang cũ.</p>"
    }
  ],
  "recap": {
    "summary": [
      "Bắt đầu bằng hiểu: /init sinh CLAUDE.md, subagent khảo sát từng phần song song và trả tóm tắt.",
      "Characterization test ghi lại hành vi hiện tại (kể cả hành vi lạ) để phát hiện hồi quy khi sửa.",
      "Tính năng mới đặt sau feature flag, bật dần theo nhóm người dùng, có đường lui.",
      "PR nhỏ, có review subagent (chỉ đọc) và regression suite trong CI.",
      "CLAUDE.md ghi quy tắc “không làm” (không refactor ngoài phạm vi, không di chuyển code cũ) để Claude không mở rộng phạm vi."
    ],
    "tips": [
      "“<strong>Hiểu – Khoá – Sửa – Bật dần</strong>”: 4 bước với dự án bảo trì.",
      "“<strong>Test chụp ảnh hiện trạng</strong>”: characterization test không đánh giá đúng sai, chỉ ghi lại.",
      "“<strong>Flag là phanh</strong>”: bật dần, tắt ngay khi có lỗi.",
      "“<strong>PR nhỏ dễ nuốt</strong>”: dưới 400 dòng để review kỹ được.",
      "Bẫy đề thi: “refactor toàn bộ trước khi thêm tính năng” thường là đáp án sai với dự án bảo trì có deadline."
    ]
  },
  "sections": [
    {
      "h": "1. Onboard codebase cũ",
      "html": "<ol>\n<li>Chạy <code>/init</code> để Claude tạo CLAUDE.md đầu tiên: lệnh build/test, cấu trúc thư mục.</li>\n<li>Giao subagent khảo sát theo vùng (mỗi app/module một subagent, tool chỉ đọc). Subagent có context riêng nên đọc nhiều file mà context chính vẫn gọn.</li>\n<li>Gom kết quả thành <code>docs/architecture.md</code> và import vào CLAUDE.md bằng <code>@docs/architecture.md</code>.</li>\n<li>Ghi “điều không hiển nhiên”: job cron, tích hợp ngoài, dữ liệu đặc biệt, phần không được sửa.</li>\n</ol>"
    },
    {
      "h": "2. Characterization test",
      "html": "<p>Mục tiêu: chụp lại hành vi hiện tại của API/hàm trước khi thay đổi. Với NestJS, dùng e2e test bằng <code>supertest</code> gọi endpoint thật trên DB test, lưu response (snapshot) và mã lỗi. Test phải <strong>pass trên code cũ</strong> trước khi sửa dòng nào.</p>"
    },
    {
      "h": "3. Feature flag và PR nhỏ",
      "html": "<div class=\"table-wrap\"><table>\n<tr><th>Kỹ thuật</th><th>Cách làm trong monorepo</th></tr>\n<tr><td>Feature flag</td><td>Bảng <code>FeatureFlag</code> hoặc AWS AppConfig; service <code>FlagsService</code> dùng chung ở <code>apps/api</code>, hook <code>useFlag</code> ở <code>apps/web</code></td></tr>\n<tr><td>Bật dần</td><td>Theo % người dùng hoặc danh sách tenant; theo dõi lỗi trên CloudWatch</td></tr>\n<tr><td>PR nhỏ</td><td>Tách: (1) migration tương thích ngược, (2) backend sau flag, (3) frontend sau flag, (4) bật flag</td></tr>\n<tr><td>Review</td><td>Subagent <code>code-reviewer</code> chỉ đọc + reviewer người</td></tr>\n</table></div>"
    },
    {
      "h": "4. Giữ Claude trong phạm vi",
      "html": "<p>Với codebase cũ, rủi ro lớn là Claude “tiện tay” refactor. Ghi rõ trong CLAUDE.md và trong prompt: chỉ sửa file liên quan ticket, không đổi tên hàm công khai, không nâng cấp dependency nếu không được yêu cầu. Dùng plan mode để duyệt danh sách file sẽ sửa trước.</p>"
    }
  ],
  "code": [
    {
      "title": "apps/api/test/booking.characterization.e2e-spec.ts",
      "lang": "typescript",
      "src": "\nimport { Test } from \"@nestjs/testing\";\nimport { INestApplication } from \"@nestjs/common\";\nimport request from \"supertest\";\nimport { AppModule } from \"../src/app.module\";\n\ndescribe(\"Booking API – hành vi hiện tại (characterization)\", () => {\n  let app: INestApplication;\n\n  beforeAll(async () => {\n    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();\n    app = mod.createNestApplication();\n    await app.init();\n  });\n\n  afterAll(() => app.close());\n\n  it(\"đặt ghế đã có người trả 409 với mã lỗi SEAT_TAKEN\", async () => {\n    const res = await request(app.getHttpServer())\n      .post(\"/bookings\")\n      .send({ tripId: \"trip-1\", seat: \"A1\", phone: \"0900000000\" });\n    expect(res.status).toBe(409);\n    expect(res.body).toMatchSnapshot();\n  });\n});"
    },
    {
      "title": "apps/api/src/flags/flags.service.ts – feature flag đơn giản",
      "lang": "typescript",
      "src": "\nimport { Injectable } from \"@nestjs/common\";\nimport { createHash } from \"node:crypto\";\nimport { PrismaService } from \"../prisma/prisma.service\";\n\n@Injectable()\nexport class FlagsService {\n  constructor(private readonly prisma: PrismaService) {}\n\n  async isEnabled(key: string, userId: string): Promise<boolean> {\n    const flag = await this.prisma.featureFlag.findUnique({ where: { key } });\n    if (!flag || !flag.enabled) return false;\n    // Chia người dùng ổn định theo hash để bật dần theo %\n    const bucket = parseInt(createHash(\"sha256\").update(`${key}:${userId}`).digest(\"hex\").slice(0, 8), 16) % 100;\n    return bucket < flag.rolloutPercent;\n  }\n}"
    }
  ],
  "exercises": [
    {
      "title": "Bài 1 – Khảo sát codebase bằng subagent",
      "task": "<p>Tạo subagent <code>explorer</code> (tool: Read, Grep, Glob) và yêu cầu Claude Code khảo sát song song <code>apps/api</code>, <code>apps/web</code>, các job nền. Gom kết quả vào <code>docs/architecture.md</code>.</p>",
      "hint": "Mô tả nhiệm vụ subagent cụ thể: cần trả về entry point, bảng DB, tích hợp ngoài, rủi ro.",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Viết <code>.claude/agents/explorer.md</code> với description “Khảo sát một vùng code và trả tóm tắt kiến trúc”.</li><li>Prompt Claude Code: “Dùng explorer khảo sát 3 vùng song song, mỗi báo cáo ≤ 1 trang theo mẫu: entry point, luồng chính, bảng DB, tích hợp ngoài, rủi ro.”</li><li>Yêu cầu tổng hợp vào <code>docs/architecture.md</code> và thêm dòng <code>@docs/architecture.md</code> vào CLAUDE.md.</li></ol><p><strong>Kiểm tra kết quả:</strong> Context chính còn gọn (subagent đọc file); docs/architecture.md có đủ 3 vùng.</p><p><strong>Lỗi thường gặp:</strong> Mô tả nhiệm vụ mơ hồ nên mỗi subagent trả một kiểu; cho subagent quyền Edit.</p>"
    },
    {
      "title": "Bài 2 – Viết characterization test",
      "task": "<p>Chọn 1 endpoint quan trọng, nhờ Claude viết 10 characterization test (kể cả trường hợp lỗi) và chạy trên code hiện tại.</p>",
      "hint": "Nhấn mạnh trong prompt: ghi lại hành vi hiện tại, KHÔNG sửa code để test pass.",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Prompt: “Viết characterization test cho POST /bookings: ghi lại status code, body, side effect trong DB. Không sửa code ứng dụng.”</li><li>Chạy <code>pnpm --filter api test:e2e</code>; test phải pass trên code cũ.</li><li>Nếu phát hiện hành vi lạ (ví dụ trả 200 khi thiếu phone), ghi chú vào issue thay vì sửa ngay.</li></ol><p><strong>Kiểm tra kết quả:</strong> 10 test pass trên nhánh main hiện tại, snapshot được commit.</p><p><strong>Lỗi thường gặp:</strong> Claude “sửa luôn” hành vi lạ làm mất ý nghĩa characterization; test phụ thuộc thứ tự chạy.</p>"
    },
    {
      "title": "Bài 3 – Tính năng sau feature flag, chia PR",
      "task": "<p>Thêm tính năng “giữ chỗ 10 phút”: lập kế hoạch 4 PR bằng plan mode, code PR backend sau flag <code>seat-hold</code>.</p>",
      "hint": "PR 1 migration tương thích ngược; PR 2 backend sau flag; PR 3 frontend sau flag; PR 4 bật flag.",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Plan mode: yêu cầu kế hoạch 4 PR, mỗi PR liệt kê file và test.</li><li>PR 1: thêm bảng <code>SeatHold</code> (migration), chưa dùng.</li><li>PR 2: trong <code>BookingsService</code>, nếu <code>flags.isEnabled('seat-hold', userId)</code> thì tạo hold thay vì đặt ngay; characterization test cũ vẫn pass khi flag tắt.</li><li>PR 3, 4: frontend hiển thị đồng hồ đếm ngược sau flag; bật 5% → 50% → 100%.</li></ol><p><strong>Kiểm tra kết quả:</strong> Khi flag tắt, toàn bộ test cũ pass; khi flag bật cho user test, luồng mới chạy.</p><p><strong>Lỗi thường gặp:</strong> Gộp tất cả vào 1 PR lớn; migration xoá/đổi cột cũ trong cùng PR với code mới.</p>"
    },
    {
      "title": "Bài 4 – Regression suite trong CI",
      "task": "<p>Thêm job CI chạy characterization + e2e test với PostgreSQL service container cho mọi PR chạm <code>apps/api</code>.</p>",
      "hint": "services: postgres trong GitHub Actions; chạy prisma migrate deploy lên DB test trước khi test.",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Khai báo service postgres với health check.</li><li>Đặt <code>DATABASE_URL</code> trỏ tới service, chạy migrate deploy lên DB test.</li><li>Chạy <code>pnpm turbo run test:e2e --filter=api...</code>.</li></ol><pre><code>e2e-api:\n  runs-on: ubuntu-latest\n  services:\n    postgres:\n      image: postgres:16\n      env: { POSTGRES_PASSWORD: test, POSTGRES_DB: app_test }\n      ports: [\"5432:5432\"]\n      options: &gt;-\n        --health-cmd \"pg_isready -U postgres\" --health-interval 5s --health-retries 10\n  env:\n    DATABASE_URL: postgresql://postgres:test@localhost:5432/app_test\n  steps:\n    - uses: actions/checkout@v4\n    - uses: pnpm/action-setup@v4\n    - run: pnpm install --frozen-lockfile\n    - run: pnpm --filter @repo/db exec prisma migrate deploy\n    - run: pnpm turbo run test:e2e --filter=api...</code></pre><p><strong>Kiểm tra kết quả:</strong> PR làm đổi mã lỗi 409 bị job e2e chặn.</p><p><strong>Lỗi thường gặp:</strong> Dùng DB production cho test; không chờ health check nên test lỗi kết nối ngẫu nhiên.</p>"
    }
  ],
  "quiz": [
    {
      "q": "Bước đầu tiên hợp lý khi nhận codebase cũ không tài liệu?",
      "options": [
        "/init + subagent khảo sát, ghi kết quả vào CLAUDE.md/architecture.md",
        "Refactor toàn bộ theo chuẩn mới",
        "Nâng cấp mọi dependency",
        "Viết lại từ đầu"
      ],
      "answer": 0,
      "explain": "<strong>Vì sao đúng:</strong> Hiểu trước khi sửa; subagent giữ context chính gọn.<br><strong>Vì sao các lựa chọn khác sai:</strong> Refactor, nâng cấp hay viết lại khi chưa hiểu đều rủi ro cao và tốn thời gian."
    },
    {
      "q": "Characterization test khác unit test thông thường ở điểm nào?",
      "options": [
        "Chỉ chạy trên production",
        "Ghi lại hành vi hiện tại (kể cả lạ) để phát hiện thay đổi, không phán xét đúng sai",
        "Không cần assert",
        "Chỉ dùng cho frontend"
      ],
      "answer": 1,
      "explain": "<strong>Vì sao đúng:</strong> Mục tiêu là khoá hành vi trước khi sửa.<br><strong>Vì sao các lựa chọn khác sai:</strong> Không chạy trên production; vẫn có assert/snapshot; dùng được cho mọi lớp."
    },
    {
      "q": "Claude đề xuất “tiện đổi tên 30 hàm cho đẹp” trong PR sửa bug. Nên làm gì?",
      "options": [
        "Đồng ý vì code đẹp hơn",
        "Merge rồi sửa sau",
        "Từ chối, giữ PR trong phạm vi ticket; ghi quy tắc vào CLAUDE.md",
        "Tắt review"
      ],
      "answer": 2,
      "explain": "<strong>Vì sao đúng:</strong> Thay đổi ngoài phạm vi làm tăng rủi ro và khó review.<br><strong>Vì sao các lựa chọn khác sai:</strong> Đẹp không phải mục tiêu của ticket; merge trước sửa sau hoặc tắt review đều tăng rủi ro."
    },
    {
      "q": "Vì sao nên đặt tính năng mới sau feature flag trong dự án bảo trì?",
      "options": [
        "Để code dài hơn",
        "Vì NestJS bắt buộc",
        "Để tránh viết test",
        "Bật dần, đo lỗi và tắt ngay được mà không cần deploy lại"
      ],
      "answer": 3,
      "explain": "<strong>Vì sao đúng:</strong> Flag giảm rủi ro phát hành và cho đường lui nhanh.<br><strong>Vì sao các lựa chọn khác sai:</strong> Không liên quan độ dài hay framework; vẫn cần test."
    },
    {
      "q": "Thêm cột mới cho tính năng giữ chỗ trong bảng đang chạy. Cách chia PR tốt?",
      "options": [
        "PR migration tương thích ngược trước, PR code sau flag, PR dọn dẹp cuối",
        "Migration + code mới + xoá cột cũ cùng 1 PR",
        "Sửa trực tiếp DB production",
        "Không cần migration"
      ],
      "answer": 0,
      "explain": "<strong>Vì sao đúng:</strong> Từng bước đảo ngược được, review được.<br><strong>Vì sao các lựa chọn khác sai:</strong> Gộp tất cả khó rollback; sửa trực tiếp production không truy vết; thiếu migration làm lệch schema."
    },
    {
      "q": "Regression suite cho API NestJS trong CI nên chạy với DB nào?",
      "options": [
        "DB production để dữ liệu thật",
        "PostgreSQL service container riêng cho job, migrate trước khi test",
        "SQLite in-memory luôn giống Postgres",
        "Không cần DB"
      ],
      "answer": 1,
      "explain": "<strong>Vì sao đúng:</strong> Cô lập, lặp lại được, cùng engine với production.<br><strong>Vì sao các lựa chọn khác sai:</strong> Production rủi ro dữ liệu; SQLite khác hành vi Postgres; e2e cần DB."
    }
  ],
  "resources": [
    {
      "t": "Claude Code – Common workflows",
      "url": "https://code.claude.com/docs"
    },
    {
      "t": "NestJS – Testing",
      "url": "https://docs.nestjs.com/fundamentals/testing"
    }
  ]
},
{
  "id": "m7b2",
  "month": 7,
  "week": 6,
  "duration": "8 giờ",
  "domain": "Agentic Architecture · Tool Design & MCP",
  "title": "Đồng bộ dữ liệu, quy trình và đo hiệu quả team",
  "objectives": [
    "Đồng bộ issue, spec, tài liệu qua MCP và GitHub Actions thay vì copy tay",
    "Giữ schema DB và type dùng chung đồng bộ giữa apps/api và apps/web",
    "Chia sẻ CLAUDE.md, skills, agents nhất quán cho nhiều repo/app",
    "Đo hiệu quả bằng số liệu thật và đặt kỳ vọng đúng về tự động hoá"
  ],
  "flow": {
    "title": "Một nguồn sự thật: đồng bộ bằng máy, quyết định bằng người",
    "steps": [
      {
        "kind": "start",
        "label": "Thay đổi ở nguồn",
        "detail": "schema.prisma, spec, issue"
      },
      {
        "kind": "step",
        "label": "CI phát hiện thay đổi",
        "detail": "paths filter trong GitHub Actions"
      },
      {
        "kind": "step",
        "label": "Sinh artefact dẫn xuất",
        "detail": "prisma generate → packages/shared",
        "note": "Type, zod, OpenAPI client"
      },
      {
        "kind": "step",
        "label": "Claude cập nhật tài liệu",
        "detail": "docs, changelog, issue liên quan",
        "note": "Qua MCP GitHub, tool giới hạn"
      },
      {
        "kind": "decision",
        "label": "Build + test toàn repo pass?",
        "note": "Không → mở issue cho owner",
        "loopTo": 2,
        "loopLabel": "sửa sinh"
      },
      {
        "kind": "step",
        "label": "Mở PR đồng bộ",
        "detail": "bot tạo PR, người review"
      },
      {
        "kind": "step",
        "label": "Ghi số liệu",
        "detail": "lead time, PR cycle, chi phí/PR"
      },
      {
        "kind": "end",
        "label": "Retro hằng tháng",
        "detail": "giữ tự động hoá có ích, bỏ phần thừa"
      }
    ]
  },
  "realExamples": [
    {
      "title": "Agency 12 người: bỏ bước copy yêu cầu từ Google Docs sang GitHub Issues",
      "html": "<p>BA viết spec trong tài liệu, dev copy thủ công thành issue, thường thiếu tiêu chí nghiệm thu. Team dựng workflow: khi spec được đánh dấu “Sẵn sàng”, Claude (qua MCP GitHub) tạo issue theo mẫu: mô tả, tiêu chí nghiệm thu, ước lượng phạm vi ảnh hưởng, nhãn app. BA duyệt danh sách issue trước khi publish.</p><p>Sau 2 tháng, thời gian từ spec đến issue sẵn sàng giảm từ khoảng 2 ngày xuống vài giờ; không còn issue thiếu tiêu chí nghiệm thu. Team không giảm người, mà chuyển thời gian copy sang viết test và làm việc với khách hàng.</p>"
    },
    {
      "title": "Type lệch giữa API và web gây lỗi production",
      "html": "<p>Backend đổi <code>price</code> từ number sang string (Decimal) nhưng frontend vẫn cộng số, hiển thị sai tổng tiền. Giải pháp: <code>packages/shared</code> xuất type và schema zod sinh từ một nguồn; CI chạy type check toàn repo mỗi khi <code>packages/db</code> thay đổi.</p><pre><code>on:\n  pull_request:\n    paths: [\"packages/db/prisma/**\", \"packages/shared/**\"]\njobs:\n  typecheck-all:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: pnpm/action-setup@v4\n      - run: pnpm install --frozen-lockfile\n      - run: pnpm --filter @repo/db exec prisma generate\n      - run: pnpm turbo run typecheck</code></pre><p>Lỗi tương tự lần sau bị chặn ngay ở PR.</p>"
    }
  ],
  "recap": {
    "summary": [
      "Mỗi loại dữ liệu có một nguồn sự thật (schema.prisma, spec, ADR); mọi thứ khác được sinh ra hoặc đồng bộ tự động.",
      "Type dùng chung sinh từ schema và kiểm tra bằng type check toàn repo trong CI khi nguồn thay đổi.",
      "Đồng bộ issue/tài liệu qua MCP với tool giới hạn; bot mở PR hoặc bản nháp, người duyệt.",
      "CLAUDE.md, skills, agents dùng chung nên được quản lý tập trung (repo gốc hoặc plugin) để các app nhất quán.",
      "Đo hiệu quả bằng lead time, PR cycle time, tỉ lệ lỗi hồi quy, chi phí/PR; tự động hoá giảm việc lặp lại, không thay người ra quyết định."
    ],
    "tips": [
      "“<strong>Một nguồn, nhiều bản sinh</strong>”: đừng bao giờ sửa file được sinh ra.",
      "“<strong>Bot đề xuất, người bấm merge</strong>”.",
      "“<strong>Đo trước khi khoe</strong>”: có số liệu trước và sau.",
      "“<strong>Giảm việc lặp, không giảm trách nhiệm</strong>”: mục tiêu thực tế của tự động hoá.",
      "Bẫy đề thi: đáp án “agent tự động sửa dữ liệu production để đồng bộ” là sai; chọn đáp án có cổng duyệt."
    ]
  },
  "sections": [
    {
      "h": "1. Nguồn sự thật và dữ liệu dẫn xuất",
      "html": "<div class=\"table-wrap\"><table>\n<tr><th>Nguồn sự thật</th><th>Dẫn xuất tự động</th><th>Công cụ</th></tr>\n<tr><td><code>packages/db/prisma/schema.prisma</code></td><td>Prisma Client, type/zod trong <code>packages/shared</code>, ERD</td><td><code>prisma generate</code>, generator, CI</td></tr>\n<tr><td>Controller NestJS + DTO</td><td>OpenAPI spec, client cho <code>apps/web</code></td><td><code>@nestjs/swagger</code>, openapi generator</td></tr>\n<tr><td>Spec nghiệp vụ</td><td>GitHub Issues có tiêu chí nghiệm thu</td><td>Claude + MCP GitHub, BA duyệt</td></tr>\n<tr><td>Commit/PR</td><td>Changelog, release note</td><td>Claude headless trong release workflow</td></tr>\n</table></div>"
    },
    {
      "h": "2. Đồng bộ cấu hình Claude giữa các app",
      "html": "<ul><li>Quy ước chung ở CLAUDE.md gốc; khác biệt từng app ở CLAUDE.md của app.</li><li>Skills và agents dùng chung đặt ở <code>.claude/</code> gốc monorepo; nhiều repo thì đóng gói thành plugin nội bộ (kiểm tra tài liệu plugin mới nhất).</li><li>Managed settings của tổ chức cho các luật bắt buộc (ví dụ chặn đọc secret).</li></ul>"
    },
    {
      "h": "3. Đo hiệu quả",
      "html": "<div class=\"table-wrap\"><table>\n<tr><th>Chỉ số</th><th>Cách lấy</th><th>Ý nghĩa</th></tr>\n<tr><td>Lead time (ticket → production)</td><td>GitHub API: thời điểm issue mở và deploy</td><td>Tốc độ giao giá trị</td></tr>\n<tr><td>PR cycle time</td><td>Mở PR → merge</td><td>Nút thắt review</td></tr>\n<tr><td>Tỉ lệ lỗi hồi quy</td><td>Issue nhãn <code>regression</code> / số release</td><td>Chất lượng</td></tr>\n<tr><td>Chi phí Claude / PR</td><td>Log usage hoặc kết quả JSON của headless</td><td>Hiệu quả chi phí</td></tr>\n<tr><td>Thời gian làm việc lặp lại</td><td>Khảo sát team + log workflow</td><td>Việc được giải phóng</td></tr>\n</table></div>\n<div class=\"callout\">Kỳ vọng thực tế: tự động hoá giảm việc lặp lại (copy, tóm tắt, review sơ bộ, viết boilerplate), giúp cùng số người làm được nhiều hơn. Quyết định kiến trúc, nghiệp vụ và review cuối vẫn cần người.</div>"
    }
  ],
  "code": [
    {
      "title": "scripts/spec-to-issues.ts – tạo bản nháp issue từ spec (người duyệt trước khi tạo)",
      "lang": "typescript",
      "src": "\nimport Anthropic from \"@anthropic-ai/sdk\";\nimport { readFileSync, writeFileSync } from \"node:fs\";\n\nconst client = new Anthropic();\n\nconst schema = {\n  type: \"object\",\n  properties: {\n    issues: {\n      type: \"array\",\n      items: {\n        type: \"object\",\n        properties: {\n          title: { type: \"string\" },\n          body: { type: \"string\" },\n          acceptanceCriteria: { type: \"array\", items: { type: \"string\" } },\n          labels: { type: \"array\", items: { type: \"string\", enum: [\"api\", \"web\", \"db\", \"infra\"] } },\n        },\n        required: [\"title\", \"body\", \"acceptanceCriteria\", \"labels\"],\n        additionalProperties: false,\n      },\n    },\n  },\n  required: [\"issues\"],\n  additionalProperties: false,\n};\n\nconst spec = readFileSync(process.argv[2], \"utf8\");\nconst res = await client.messages.create({\n  model: \"claude-opus-5\",\n  max_tokens: 16000,\n  system: \"Chia spec thành issue nhỏ (≤ 2 ngày công), mỗi issue có tiêu chí nghiệm thu kiểm chứng được.\",\n  messages: [{ role: \"user\", content: `<spec>\\n${spec}\\n</spec>` }],\n  output_config: { format: { type: \"json_schema\", schema } },\n});\nconst block = res.content.find((b) => b.type === \"text\");\nif (block && block.type === \"text\") writeFileSync(\"issues.draft.json\", block.text);\n// Bước tiếp: BA xem issues.draft.json, sau đó script khác gọi `gh issue create` cho các issue được duyệt."
    },
    {
      "title": "packages/shared/src/order.ts – type và schema dùng chung",
      "lang": "typescript",
      "src": "\nimport { z } from \"zod\";\n\n// Decimal từ Prisma được serialize thành string qua API\nexport const OrderDto = z.object({\n  id: z.string(),\n  status: z.enum([\"PENDING\", \"PAID\", \"SHIPPED\", \"CANCELLED\"]),\n  total: z.string().regex(/^\\d+(\\.\\d{1,2})?$/),\n  createdAt: z.string().datetime(),\n});\nexport type OrderDto = z.infer<typeof OrderDto>;\n\n// apps/api dùng để kiểm tra response trong test, apps/web dùng để parse dữ liệu nhận về"
    }
  ],
  "exercises": [
    {
      "title": "Bài 1 – Spec thành issue có cổng duyệt",
      "task": "<p>Chạy <code>spec-to-issues.ts</code> trên một spec thật, BA duyệt file nháp, sau đó viết script tạo issue bằng <code>gh issue create</code> chỉ cho các issue có <code>approved: true</code>.</p>",
      "hint": "Tách 2 bước: sinh nháp (Claude) và tạo thật (script tất định sau khi người duyệt).",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Sinh <code>issues.draft.json</code>, BA thêm trường <code>approved</code> cho từng issue.</li><li>Script đọc file, lọc approved, gọi <code>gh issue create --title ... --body ... --label ...</code>.</li><li>Ghi link issue đã tạo ngược lại vào spec.</li></ol><pre><code>import { execFileSync } from \"node:child_process\";\nimport { readFileSync } from \"node:fs\";\nconst { issues } = JSON.parse(readFileSync(\"issues.draft.json\", \"utf8\"));\nfor (const i of issues.filter((x: { approved?: boolean }) =&gt; x.approved)) {\n  const body = `${i.body}\\n\\n### Tiêu chí nghiệm thu\\n${i.acceptanceCriteria.map((c: string) =&gt; `- [ ] ${c}`).join(\"\\n\")}`;\n  execFileSync(\"gh\", [\"issue\", \"create\", \"--title\", i.title, \"--body\", body, ...i.labels.flatMap((l: string) =&gt; [\"--label\", l])], { stdio: \"inherit\" });\n}</code></pre><p><strong>Kiểm tra kết quả:</strong> Chỉ issue được duyệt xuất hiện trên GitHub, đủ tiêu chí nghiệm thu.</p><p><strong>Lỗi thường gặp:</strong> Cho Claude tạo issue trực tiếp không qua duyệt; nối chuỗi lệnh shell từ dữ liệu model (nguy cơ injection) thay vì execFile với mảng tham số.</p>"
    },
    {
      "title": "Bài 2 – Type dùng chung và type check toàn repo",
      "task": "<p>Tạo <code>packages/shared</code> với schema zod cho Order, dùng ở cả <code>apps/api</code> (test response) và <code>apps/web</code> (parse dữ liệu). Thêm job CI type check khi <code>packages/db</code> hoặc <code>packages/shared</code> đổi.</p>",
      "hint": "Workspace dependency: \"@repo/shared\": \"workspace:*\".",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Tạo package <code>@repo/shared</code>, export <code>OrderDto</code>.</li><li>Thêm dependency <code>workspace:*</code> vào api và web.</li><li>Trong web: <code>OrderDto.parse(await res.json())</code>; trong api e2e test: parse response.</li><li>Job CI với <code>paths</code> filter chạy <code>pnpm turbo run typecheck</code>.</li></ol><p><strong>Kiểm tra kết quả:</strong> Đổi <code>total</code> sang number ở một phía làm CI đỏ ngay.</p><p><strong>Lỗi thường gặp:</strong> Copy type sang từng app (lệch dần); sửa tay file được sinh ra.</p>"
    },
    {
      "title": "Bài 3 – Changelog tự động khi release",
      "task": "<p>Khi tạo tag <code>v*</code>, workflow dùng Claude headless tóm tắt các PR đã merge từ tag trước thành release note tiếng Việt, tạo bản nháp release.</p>",
      "hint": "gh release create --draft để người duyệt trước khi publish.",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Trigger <code>on: push: tags: ['v*']</code>.</li><li>Lấy danh sách PR: <code>gh pr list --state merged --search \"merged:>=DATE\" --json title,number,labels</code>.</li><li>Chạy <code>claude -p</code> với tool chỉ đọc, yêu cầu nhóm theo Tính năng / Sửa lỗi / Hạ tầng.</li><li>Tạo release nháp với <code>gh release create $TAG --draft --notes-file notes.md</code>.</li></ol><p><strong>Kiểm tra kết quả:</strong> Release nháp xuất hiện, PM sửa và publish.</p><p><strong>Lỗi thường gặp:</strong> Publish thẳng không qua duyệt; đưa cả diff lớn vào prompt thay vì tiêu đề và mô tả PR.</p>"
    },
    {
      "title": "Bài 4 – Dashboard hiệu quả",
      "task": "<p>Viết script lấy lead time và PR cycle time 8 tuần gần nhất bằng GitHub API, so sánh 4 tuần trước và 4 tuần sau khi áp dụng workflow Claude.</p>",
      "hint": "gh api graphql hoặc gh pr list --json createdAt,mergedAt.",
      "solution": "<p><strong>Hướng dẫn giải từng bước</strong></p><ol><li>Lấy PR đã merge: <code>gh pr list --state merged --limit 500 --json number,createdAt,mergedAt</code>.</li><li>Tính cycle time = mergedAt − createdAt, gom theo tuần, lấy trung vị.</li><li>So sánh 2 giai đoạn; kèm số PR và số lỗi hồi quy để tránh kết luận sai.</li></ol><p><strong>Kiểm tra kết quả:</strong> Bảng 8 tuần có trung vị cycle time, số PR, số lỗi hồi quy.</p><p><strong>Lỗi thường gặp:</strong> Dùng trung bình (bị PR bất thường kéo lệch); chỉ đo tốc độ mà bỏ qua chất lượng.</p>"
    }
  ],
  "quiz": [
    {
      "q": "Type <code>Order</code> đang được định nghĩa lại ở cả apps/api và apps/web. Cách tốt nhất?",
      "options": [
        "Nhắc dev cập nhật cả hai",
        "Để Claude đồng bộ tay mỗi tuần",
        "Một nguồn trong packages/shared (sinh từ schema), cả hai app import, CI type check toàn repo",
        "Bỏ type"
      ],
      "answer": 2,
      "explain": "<strong>Vì sao đúng:</strong> Một nguồn sự thật + kiểm tra tự động ngăn lệch type.<br><strong>Vì sao các lựa chọn khác sai:</strong> Nhắc nhở và đồng bộ định kỳ vẫn lệch giữa các lần; bỏ type mất an toàn."
    },
    {
      "q": "Workflow tạo GitHub Issues từ spec nên có bước nào để an toàn?",
      "options": [
        "Claude tạo issue trực tiếp",
        "Dev copy tay",
        "Không cần duyệt vì issue dễ xoá",
        "Claude sinh bản nháp có cấu trúc, BA duyệt, script tạo issue cho mục được duyệt"
      ],
      "answer": 3,
      "explain": "<strong>Vì sao đúng:</strong> Tách sinh (model) và thực thi (tất định) với cổng duyệt người.<br><strong>Vì sao các lựa chọn khác sai:</strong> Tạo trực tiếp bỏ qua kiểm soát chất lượng; copy tay là việc cần tự động hoá; issue sai vẫn gây nhiễu cho team."
    },
    {
      "q": "Kỳ vọng thực tế khi tự động hoá với Claude cho team fullstack?",
      "options": [
        "Giảm việc lặp lại, cùng số người làm được nhiều hơn; người vẫn quyết định và review",
        "Thay toàn bộ dev",
        "Không cần test nữa",
        "Không cần đo lường"
      ],
      "answer": 0,
      "explain": "<strong>Vì sao đúng:</strong> Đây là cách mô tả đúng giá trị và giới hạn.<br><strong>Vì sao các lựa chọn khác sai:</strong> Thay toàn bộ người, bỏ test hay bỏ đo lường đều là kỳ vọng sai."
    },
    {
      "q": "Chỉ số nào nên đi kèm khi báo cáo “PR cycle time giảm 40%”?",
      "options": [
        "Số dòng code",
        "Tỉ lệ lỗi hồi quy và số PR cùng kỳ",
        "Số lần commit",
        "Màu giao diện"
      ],
      "answer": 1,
      "explain": "<strong>Vì sao đúng:</strong> Tốc độ phải đi cùng chất lượng và khối lượng để kết luận đúng.<br><strong>Vì sao các lựa chọn khác sai:</strong> Số dòng, số commit không phản ánh hiệu quả; màu giao diện không liên quan."
    },
    {
      "q": "Script tạo issue nhận title từ output của model. Cách gọi <code>gh</code> an toàn?",
      "options": [
        "Ghép chuỗi vào execSync(`gh issue create --title ${title}`)",
        "Dùng eval",
        "execFileSync với mảng tham số, không qua shell",
        "Ghi ra file .sh rồi chạy"
      ],
      "answer": 2,
      "explain": "<strong>Vì sao đúng:</strong> Không qua shell nên ký tự đặc biệt trong title không thành lệnh.<br><strong>Vì sao các lựa chọn khác sai:</strong> Ghép chuỗi vào shell, eval hay file .sh đều có nguy cơ command injection từ dữ liệu model."
    },
    {
      "q": "Nhiều repo cần cùng skills và agents cho Claude Code. Cách quản lý phù hợp?",
      "options": [
        "Copy tay sang từng repo",
        "Mỗi dev tự viết",
        "Ghi vào README",
        "Đóng gói dùng chung (repo gốc/monorepo hoặc plugin nội bộ) và cập nhật một nơi"
      ],
      "answer": 3,
      "explain": "<strong>Vì sao đúng:</strong> Một nguồn giúp nhất quán và cập nhật dễ.<br><strong>Vì sao các lựa chọn khác sai:</strong> Copy tay và tự viết gây lệch; README không được Claude Code nạp như skill."
    }
  ],
  "resources": [
    {
      "t": "Claude Code – Plugins",
      "url": "https://code.claude.com/docs"
    },
    {
      "t": "GitHub CLI manual",
      "url": "https://cli.github.com/manual"
    },
    {
      "t": "DORA metrics",
      "url": "https://dora.dev"
    }
  ]
});

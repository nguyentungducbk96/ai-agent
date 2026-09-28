(function () {
  App.renderHeader('lesson');
  const state = App.loadState();
  const all = App.lessons();
  const params = new URLSearchParams(location.search);
  const current = all.find((l) => l.id === params.get('id'))
    || all.find((l) => !state.done[l.id])
    || all[0];
  const idx = all.indexOf(current);

  // ---------- Sidebar ----------
  const sidebar = document.getElementById('sidebar');
  (window.MONTHS || []).slice().sort((a, b) => a.month - b.month).forEach((m) => {
    const d = App.el('details');
    if (m.month === current.month) d.open = true;
    d.innerHTML = `<summary>Tháng ${m.month}: ${m.title}</summary><ol>${
      all.filter((l) => l.month === m.month).map((l) =>
        `<li class="${state.done[l.id] ? 'done' : ''}"><a href="lesson.html?id=${l.id}" class="${l.id === current.id ? 'active' : ''}">
          ${l.bonus ? 'BS' : `T${l.week}`}. ${l.title}</a></li>`).join('')}</ol>`;
    sidebar.appendChild(d);
  });
  document.getElementById('toggle-sidebar').addEventListener('click', () => sidebar.classList.toggle('collapsed'));

  // ---------- Lesson ----------
  document.title = `${current.title} · Chứng chỉ Claude`;
  const root = document.getElementById('lesson');
  root.innerHTML = `
    <div class="lesson-meta">
      <span class="tag accent">Tháng ${current.month} · ${current.bonus ? 'Bài bổ sung' : `Tuần ${current.week}`}</span>
      <span class="tag">${current.domain}</span>
      <span class="tag">⏱ ${current.duration}</span>
    </div>
    <h1>${current.title}</h1>
    <div class="objectives"><h2>Mục tiêu bài học</h2><ul>${current.objectives.map((o) => `<li>${o}</li>`).join('')}</ul></div>`;

  const LEGEND = `<div class="legend"><span class="l-start">Bắt đầu</span><span class="l-step">Bước xử lý</span>
    <span class="l-dec">Điểm rẽ nhánh / kiểm tra</span><span class="l-end">Kết thúc</span><span class="l-loop">Vòng lặp</span></div>`;
  if (current.flow) {
    const sec = App.el('section', {}, '<h2>Sơ đồ: cách nó hoạt động</h2>');
    const fig = App.renderFlow(current.flow);
    if (fig) { sec.appendChild(fig); sec.insertAdjacentHTML('beforeend', LEGEND); root.appendChild(sec); }
  }

  current.sections.forEach((s) => {
    const sec = App.el('section');
    sec.innerHTML = `<h2>${s.h}</h2>${s.html}`;
    root.appendChild(sec);
  });

  if (current.code && current.code.length) {
    const sec = App.el('section', {}, '<h2>Code mẫu</h2>');
    current.code.forEach((c) => sec.appendChild(App.codeBlock(c)));
    root.appendChild(sec);
  }

  if (current.realExamples && current.realExamples.length) {
    const sec = App.el('section', {}, '<h2>Ví dụ thực tế</h2>');
    current.realExamples.forEach((ex, i) => {
      const card = App.el('div', { class: 'card example-card' });
      card.innerHTML = `<span class="tag accent">Ví dụ ${i + 1}</span><h3>${ex.title}</h3>${ex.html}`;
      sec.appendChild(card);
    });
    root.appendChild(sec);
  }

  if (current.recap) {
    const box = App.el('section', { class: 'recap' });
    box.innerHTML = `<h2>Tóm tắt &amp; mẹo nhớ</h2><div class="cols">
      <div><h3>Ghi nhớ cốt lõi</h3><ul>${(current.recap.summary || []).map((x) => `<li>${x}</li>`).join('')}</ul></div>
      <div><h3>Mẹo nhớ nhanh</h3><ul class="tips">${(current.recap.tips || []).map((x) => `<li>${x}</li>`).join('')}</ul></div></div>`;
    root.appendChild(box);
  }

  if (current.exercises && current.exercises.length) {
    const sec = App.el('section', {}, '<h2>Bài tập thực hành</h2>');
    current.exercises.forEach((ex, i) => {
      const key = `${current.id}-ex${i}`;
      const card = App.el('div', { class: 'card exercise' });
      card.innerHTML = `
        <div class="exercise-head">
          <input type="checkbox" id="${key}" ${state.exercises[key] ? 'checked' : ''} aria-label="Đánh dấu đã làm">
          <h3><label for="${key}">${ex.title}</label></h3>
        </div>
        <div>${ex.task}</div>
        ${ex.hint ? `<details><summary>Gợi ý</summary><div>${App.escapeHtml(ex.hint)}</div></details>` : ''}
        ${ex.solution ? `<details><summary>Lời giải / đáp án tham khảo</summary><div>${ex.solution}</div></details>` : ''}`;
      card.querySelector('input').addEventListener('change', (e) => {
        state.exercises[key] = e.target.checked;
        App.saveState(state);
      });
      sec.appendChild(card);
    });
    root.appendChild(sec);
  }

  if (current.quiz && current.quiz.length) {
    const sec = App.el('section', {}, '<h2>Quiz kiểm tra</h2>');
    const box = App.el('div', { class: 'card' });
    sec.appendChild(box);
    root.appendChild(sec);
    App.renderQuiz(box, current.quiz, current.id, (correct, total) => {
      state.quiz[current.id] = { correct, total, at: Date.now() };
      App.saveState(state);
    });
  }

  // ---------- Lazy-loaded: fullstack labs + 100-question bank ----------
  const loadScript = (src) => new Promise((resolve) => {
    const tag = document.createElement('script');
    tag.src = src;
    tag.onload = resolve;
    tag.onerror = resolve; // file chưa có thì bỏ qua
    document.body.appendChild(tag);
  });
  const labsSec = App.el('section', { id: 'labs' });
  const bankSec = App.el('section', { id: 'qbank' });
  root.appendChild(labsSec);
  root.appendChild(bankSec);
  Promise.all([
    loadScript(`assets/js/data/labs/${current.id}.js`),
    loadScript(`assets/js/data/qbank/${current.id}.js`)
  ]).then(() => {
    renderLabs(labsSec, (window.LABS || {})[current.id]);
    renderBank(bankSec, (window.QBANK || {})[current.id]);
  });

  function renderLabs(sec, labs) {
    if (!labs || !labs.length) return;
    sec.innerHTML = '<h2>Thực hành code Fullstack (NestJS · Next.js · AWS · GitHub Actions)</h2>';
    labs.forEach((lab, i) => {
      const key = `${current.id}-lab${i}`;
      const card = App.el('div', { class: 'card exercise' });
      card.innerHTML = `
        <div class="exercise-head">
          <input type="checkbox" id="${key}" ${state.exercises[key] ? 'checked' : ''} aria-label="Đánh dấu đã làm">
          <h3><label for="${key}">${lab.title}</label></h3>
        </div>
        <div class="lesson-meta" style="margin:8px 0">${(lab.stack || []).map((t) => `<span class="tag">${t}</span>`).join('')}
          ${lab.level ? `<span class="tag accent">${lab.level}</span>` : ''}</div>
        <div>${lab.task}</div>
        ${lab.hint ? `<details><summary>Gợi ý</summary><div>${App.escapeHtml(lab.hint)}</div></details>` : ''}
        <details><summary>Lời giải chi tiết</summary><div>${lab.solution}</div></details>`;
      card.querySelector('input').addEventListener('change', (e) => {
        state.exercises[key] = e.target.checked;
        App.saveState(state);
      });
      sec.appendChild(card);
    });
  }

  function renderBank(sec, bank) {
    if (!bank || !bank.length) return;
    const LEVELS = [
      { key: 0, label: 'Tất cả' },
      { key: 1, label: 'Cơ bản' },
      { key: 2, label: 'Trung bình' },
      { key: 3, label: 'Nâng cao' }
    ];
    const PER_PAGE = 10;
    state.qbank = state.qbank || {};
    const record = state.qbank[current.id] = state.qbank[current.id] || {};
    let level = 0;
    let page = 0;

    sec.innerHTML = `<h2>Ngân hàng ${bank.length} câu hỏi (độ khó tăng dần)</h2>
      <p class="muted">Câu 1–30 là cơ bản, 31–70 trung bình, 71–100 nâng cao theo tình huống. Chấm từng trang; kết quả được lưu lại.</p>
      <div class="card">
        <div class="bank-bar">
          <div class="bank-levels" role="tablist"></div>
          <div class="bank-stats" aria-live="polite"></div>
        </div>
        <div class="progress" style="margin:10px 0 4px"><span class="bank-progress"></span></div>
        <div class="bank-list"></div>
        <div class="bank-actions">
          <button class="btn small secondary" type="button" data-act="prev">← Trang trước</button>
          <button class="btn small" type="button" data-act="check">Chấm trang này</button>
          <button class="btn small secondary" type="button" data-act="next">Trang sau →</button>
          <span class="bank-page muted"></span>
          <button class="btn small secondary" type="button" data-act="reset" style="margin-left:auto">Xoá kết quả</button>
        </div>
      </div>`;
    const levelsEl = sec.querySelector('.bank-levels');
    const listEl = sec.querySelector('.bank-list');
    const statsEl = sec.querySelector('.bank-stats');
    const pageEl = sec.querySelector('.bank-page');
    const barEl = sec.querySelector('.bank-progress');
    let shown = [];

    const items = () => bank.map((q, i) => ({ ...q, idx: i })).filter((q) => !level || q.level === level);

    function stats() {
      const done = Object.keys(record).length;
      const correct = Object.values(record).filter(Boolean).length;
      statsEl.innerHTML = `Đã làm <strong>${done}/${bank.length}</strong> · Đúng <strong>${correct}</strong>` +
        (done ? ` (${Math.round((correct / done) * 100)}%)` : '');
      barEl.style.width = `${(done / bank.length) * 100}%`;
    }

    function draw() {
      levelsEl.innerHTML = LEVELS.map((l) => {
        const n = l.key ? bank.filter((q) => q.level === l.key).length : bank.length;
        return `<button type="button" class="chip ${l.key === level ? 'active' : ''}" data-level="${l.key}">${l.label} (${n})</button>`;
      }).join('');
      const all = items();
      const pages = Math.max(1, Math.ceil(all.length / PER_PAGE));
      page = Math.min(page, pages - 1);
      shown = all.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE).map((q) => ({ ...App.shuffleOptions(q), idx: q.idx, level: q.level }));
      const tagOf = (lv) => ['', 'Cơ bản', 'Trung bình', 'Nâng cao'][lv] || '';
      listEl.innerHTML = shown.map((q) => {
        const prev = record[q.idx];
        const mark = prev === undefined ? '' : prev ? ' <span class="tag good">đã đúng</span>' : ' <span class="tag">đã sai</span>';
        return `<div class="quiz-q" data-idx="${q.idx}">
          <div class="q">Câu ${q.idx + 1} <span class="tag ${q.level === 3 ? 'accent' : ''}">${tagOf(q.level)}</span>${mark}<div>${q.q}</div></div>
          ${q.options.map((o, j) => `<label><input type="radio" name="qb-${q.idx}" value="${j}"><span>${o}</span></label>`).join('')}
          <div class="explain">${q.explain || ''}</div></div>`;
      }).join('');
      pageEl.textContent = `Trang ${page + 1}/${pages}`;
      sec.querySelector('[data-act="prev"]').disabled = page === 0;
      sec.querySelector('[data-act="next"]').disabled = page >= pages - 1;
      stats();
    }

    levelsEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-level]');
      if (!b) return;
      level = Number(b.dataset.level);
      page = 0;
      draw();
    });
    sec.querySelector('.bank-actions').addEventListener('click', (e) => {
      const act = e.target.dataset && e.target.dataset.act;
      if (act === 'prev') { page--; draw(); sec.scrollIntoView({ behavior: 'smooth' }); }
      if (act === 'next') { page++; draw(); sec.scrollIntoView({ behavior: 'smooth' }); }
      if (act === 'reset' && confirm('Xoá toàn bộ kết quả ngân hàng câu hỏi của bài này?')) {
        Object.keys(record).forEach((k) => delete record[k]);
        App.saveState(state);
        draw();
      }
      if (act === 'check') {
        listEl.querySelectorAll('.quiz-q').forEach((box, i) => {
          const q = shown[i];
          box.classList.add('revealed');
          const labels = box.querySelectorAll('label');
          labels.forEach((l) => l.classList.remove('correct', 'wrong'));
          labels[q.answer].classList.add('correct');
          const picked = box.querySelector('input:checked');
          if (picked) {
            const ok = Number(picked.value) === q.answer;
            if (!ok) picked.closest('label').classList.add('wrong');
            record[q.idx] = ok;
          }
        });
        App.saveState(state);
        stats();
      }
    });
    draw();
  }

  if (current.resources && current.resources.length) {
    const sec = App.el('section');
    sec.innerHTML = `<h2>Tài liệu đọc thêm</h2><ul>${current.resources.map((r) =>
      `<li><a href="${r.url}" target="_blank" rel="noopener">${r.t}</a></li>`).join('')}</ul>`;
    root.appendChild(sec);
  }

  // ---------- Footer: complete + prev/next ----------
  const prev = all[idx - 1];
  const next = all[idx + 1];
  const foot = App.el('div', { class: 'lesson-footer' });
  foot.innerHTML = `
    <div>${prev ? `<a class="btn secondary" href="lesson.html?id=${prev.id}">← ${prev.title}</a>` : ''}</div>
    <button class="btn" type="button" id="done-btn"></button>
    <div>${next ? `<a class="btn secondary" href="lesson.html?id=${next.id}">${next.title} →</a>`
                : '<a class="btn secondary" href="exam.html">Đến trang thi thử →</a>'}</div>`;
  root.appendChild(foot);

  const doneBtn = document.getElementById('done-btn');
  const paint = () => { doneBtn.textContent = state.done[current.id] ? '✓ Đã hoàn thành' : 'Đánh dấu hoàn thành'; };
  paint();
  doneBtn.addEventListener('click', () => {
    state.done[current.id] = !state.done[current.id];
    App.saveState(state);
    paint();
    const link = sidebar.querySelector(`a[href="lesson.html?id=${current.id}"]`);
    if (link) link.parentElement.classList.toggle('done', !!state.done[current.id]);
  });
})();

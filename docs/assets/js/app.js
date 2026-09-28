/* Shared helpers: storage, header, theme, rendering for lessons and quizzes. */
(function () {
  const STORE_KEY = 'claude-cert-progress-v1';

  // ---------- Storage (localStorage may be unavailable) ----------
  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : { done: {}, exercises: {}, quiz: {}, exams: [] };
    } catch (e) {
      return { done: {}, exercises: {}, quiz: {}, exams: [] };
    }
  }
  function saveState(state) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  // ---------- Utilities ----------
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function el(tag, attrs, html) {
    const node = document.createElement(tag);
    if (attrs) Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    if (html !== undefined) node.innerHTML = html;
    return node;
  }
  function lessons() {
    return (window.LESSONS || []).slice().sort((a, b) => a.month - b.month || a.week - b.week);
  }

  // ---------- Theme ----------
  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem('claude-cert-theme'); } catch (e) { /* ignore */ }
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme')
        || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('claude-cert-theme', next); } catch (e) { /* ignore */ }
    });
  }

  // ---------- Header ----------
  function renderHeader(active) {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const link = (href, key, label) =>
      `<a href="${href}" class="${active === key ? 'active' : ''}">${label}</a>`;
    header.innerHTML = `
      <div class="inner">
        <a class="brand" href="index.html"><span class="dot"></span>Lộ trình chứng chỉ Claude</a>
        <nav class="nav">
          ${link('index.html', 'home', 'Tổng quan')}
          ${link('lesson.html', 'lesson', 'Bài học')}
          ${link('project.html', 'project', 'Project mẫu')}
          ${link('exam.html', 'exam', 'Cách thi &amp; thi thử')}
        </nav>
        <button class="theme-toggle" type="button" aria-label="Đổi giao diện sáng/tối">◐</button>
      </div>`;
    initTheme();
  }

  // ---------- Code blocks ----------
  function codeBlock(c) {
    const wrap = el('div', { class: 'code-block' });
    wrap.innerHTML = `
      <div class="code-head"><span>${escapeHtml(c.title || c.lang || 'code')}</span>
      <button class="copy-btn" type="button">Sao chép</button></div>
      <pre><code>${escapeHtml(c.src.replace(/^\n/, ''))}</code></pre>`;
    wrap.querySelector('.copy-btn').addEventListener('click', (ev) => {
      const text = c.src.replace(/^\n/, '');
      const done = () => { ev.target.textContent = 'Đã chép'; setTimeout(() => (ev.target.textContent = 'Sao chép'), 1500); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done); else done();
    });
    return wrap;
  }

  // ---------- Quiz ----------
  // Returns a copy of the question with options in random order and `answer` remapped.
  function shuffleOptions(item) {
    const order = item.options.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return { ...item, options: order.map((i) => item.options[i]), answer: order.indexOf(item.answer) };
  }

  // questions: [{q, options[], answer, explain}]; onScore(correct,total)
  function renderQuiz(container, source, prefix, onScore) {
    const questions = source.map(shuffleOptions);
    container.innerHTML = '';
    questions.forEach((item, i) => {
      const box = el('div', { class: 'quiz-q' });
      const name = `${prefix}-q${i}`;
      box.innerHTML = `<div class="q">Câu ${i + 1}. ${item.q}</div>` +
        item.options.map((o, j) =>
          `<label><input type="radio" name="${name}" value="${j}"><span>${o}</span></label>`).join('') +
        `<div class="explain">${item.explain || ''}</div>`;
      container.appendChild(box);
    });
    const actions = el('div', { class: 'quiz-actions' });
    actions.innerHTML = `<button class="btn small" type="button">Chấm điểm</button>
      <button class="btn small secondary" type="button">Làm lại</button>
      <div class="quiz-result" aria-live="polite"></div>`;
    container.appendChild(actions);
    const [checkBtn, resetBtn] = actions.querySelectorAll('button');
    const result = actions.querySelector('.quiz-result');

    checkBtn.addEventListener('click', () => {
      let correct = 0;
      container.querySelectorAll('.quiz-q').forEach((box, i) => {
        box.classList.add('revealed');
        const labels = box.querySelectorAll('label');
        labels.forEach((l) => l.classList.remove('correct', 'wrong'));
        const picked = box.querySelector('input:checked');
        labels[questions[i].answer].classList.add('correct');
        if (picked) {
          if (Number(picked.value) === questions[i].answer) correct++;
          else picked.closest('label').classList.add('wrong');
        }
      });
      result.textContent = `Kết quả: ${correct}/${questions.length} câu đúng`;
      if (onScore) onScore(correct, questions.length);
    });
    resetBtn.addEventListener('click', () => renderQuiz(container, source, prefix, onScore));
  }

  // ---------- Flow diagram (SVG) ----------
  // flow: {title, steps:[{kind:'start'|'step'|'decision'|'end', label, detail?, note?, loopTo?, loopLabel?}]}
  function wrap(text, max) {
    const words = String(text || '').split(/\s+/).filter(Boolean);
    const lines = [];
    let cur = '';
    words.forEach((w) => {
      if ((cur + ' ' + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim();
    });
    if (cur) lines.push(cur);
    return lines;
  }

  function renderFlow(flow) {
    const steps = (flow && flow.steps) || [];
    if (!steps.length) return null;
    const W = 760, BOX_W = 300, CX = 290, NOTE_X = 470, NOTE_MAX = 40, GAP = 30;
    const loops = steps.map((s, i) => (Number.isInteger(s.loopTo) && s.loopTo < i ? i : -1)).filter((i) => i >= 0);
    const loopLane = {};
    loops.forEach((i, k) => { loopLane[i] = 118 - k * 16; });

    let y = flow.title ? 64 : 24;
    const rows = steps.map((s) => {
      const detail = s.detail ? wrap(s.detail, 44) : [];
      const h = Math.max(48, 34 + detail.length * 16 + (s.kind === 'decision' ? 8 : 0));
      const row = { s, y, h, detail, note: s.note ? wrap(s.note, NOTE_MAX) : [] };
      y += h + GAP;
      return row;
    });
    const H = y - GAP + 24;
    const esc = escapeHtml;
    const fill = { start: 'var(--accent-soft)', end: 'var(--good-soft)', step: 'var(--surface)', decision: 'var(--surface-2)' };
    const stroke = { start: 'var(--accent)', end: 'var(--good)', step: 'var(--border-strong)', decision: 'var(--accent)' };
    const x0 = CX - BOX_W / 2;

    const shape = (r) => {
      const k = r.s.kind || 'step';
      if (k === 'decision') {
        const d = 16;
        return `<polygon points="${x0 + d},${r.y} ${x0 + BOX_W - d},${r.y} ${x0 + BOX_W},${r.y + r.h / 2} ${x0 + BOX_W - d},${r.y + r.h} ${x0 + d},${r.y + r.h} ${x0},${r.y + r.h / 2}"
          fill="${fill.decision}" stroke="${stroke.decision}" stroke-width="1.5" stroke-dasharray="5 3"/>`;
      }
      const rx = k === 'start' || k === 'end' ? r.h / 2 : 8;
      return `<rect x="${x0}" y="${r.y}" width="${BOX_W}" height="${r.h}" rx="${rx}" fill="${fill[k] || fill.step}"
        stroke="${stroke[k] || stroke.step}" stroke-width="${k === 'step' ? 1.25 : 2}"/>`;
    };

    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(flow.title || 'Sơ đồ flow')}" class="flow-svg" font-family="inherit">
      <defs><marker id="fa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" fill="var(--muted)"/></marker>
        <marker id="fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" fill="var(--accent)"/></marker></defs>`;
    if (flow.title) svg += `<text x="24" y="34" font-size="16" font-weight="700" fill="var(--text)">${esc(flow.title)}</text>`;

    rows.forEach((r, i) => {
      const next = rows[i + 1];
      if (next) svg += `<line x1="${CX}" y1="${r.y + r.h}" x2="${CX}" y2="${next.y - 2}" stroke="var(--muted)" stroke-width="1.25" marker-end="url(#fa)"/>`;
    });
    loops.forEach((i) => {
      const from = rows[i], to = rows[steps[i].loopTo], lx = loopLane[i];
      const fy = from.y + from.h / 2, ty = to.y + to.h / 2;
      svg += `<path d="M${x0} ${fy} H${lx} V${ty} H${x0 - 2}" fill="none" stroke="var(--accent)" stroke-width="1.5" marker-end="url(#fl)"/>`;
      if (steps[i].loopLabel) {
        svg += `<text x="${lx - 6}" y="${(fy + ty) / 2}" font-size="11.5" fill="var(--accent)" text-anchor="end">${esc(steps[i].loopLabel)}</text>`;
      }
    });
    rows.forEach((r, i) => {
      const s = r.s;
      const textTop = r.y + r.h / 2 - (r.detail.length * 16) / 2 + 5;
      svg += `<g>${shape(r)}
        <text x="${CX}" y="${textTop}" text-anchor="middle" font-size="14" font-weight="600" fill="var(--text)">${esc(s.label)}</text>`;
      r.detail.forEach((line, j) => {
        svg += `<text x="${CX}" y="${textTop + 18 + j * 16}" text-anchor="middle" font-size="12.5" fill="var(--muted)">${esc(line)}</text>`;
      });
      svg += '</g>';
      svg += `<text x="${x0 + BOX_W - 10}" y="${r.y + 14}" text-anchor="end" font-size="10.5" font-weight="700" fill="var(--muted)">${i + 1}</text>`;
      if (r.note.length) {
        const ny = r.y + r.h / 2 - ((r.note.length - 1) * 15) / 2 + 4;
        svg += `<line x1="${x0 + BOX_W + 4}" y1="${r.y + r.h / 2}" x2="${NOTE_X - 8}" y2="${r.y + r.h / 2}" stroke="var(--border-strong)" stroke-dasharray="3 3"/>`;
        r.note.forEach((line, j) => {
          svg += `<text x="${NOTE_X}" y="${ny + j * 15}" font-size="12.5" fill="var(--muted)">${esc(line)}</text>`;
        });
      }
    });
    svg += '</svg>';
    const wrapEl = el('figure', { class: 'flow' });
    wrapEl.innerHTML = svg;
    return wrapEl;
  }

  window.App = { loadState, saveState, escapeHtml, el, lessons, renderHeader, codeBlock, renderQuiz, shuffleOptions, renderFlow };
})();

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

  window.App = { loadState, saveState, escapeHtml, el, lessons, renderHeader, codeBlock, renderQuiz, shuffleOptions };
})();

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
          T${l.week}. ${l.title}</a></li>`).join('')}</ol>`;
    sidebar.appendChild(d);
  });
  document.getElementById('toggle-sidebar').addEventListener('click', () => sidebar.classList.toggle('collapsed'));

  // ---------- Lesson ----------
  document.title = `${current.title} · Chứng chỉ Claude`;
  const root = document.getElementById('lesson');
  root.innerHTML = `
    <div class="lesson-meta">
      <span class="tag accent">Tháng ${current.month} · Tuần ${current.week}</span>
      <span class="tag">${current.domain}</span>
      <span class="tag">⏱ ${current.duration}</span>
    </div>
    <h1>${current.title}</h1>
    <div class="objectives"><h2>Mục tiêu bài học</h2><ul>${current.objectives.map((o) => `<li>${o}</li>`).join('')}</ul></div>`;

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

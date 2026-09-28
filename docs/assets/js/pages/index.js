(function () {
  App.renderHeader('home');
  const state = App.loadState();
  const all = App.lessons();

  // Progress stats
  const doneCount = all.filter((l) => state.done[l.id]).length;
  const exerciseCount = Object.values(state.exercises).filter(Boolean).length;
  const best = state.exams.length ? Math.max(...state.exams.map((e) => e.scaled)) : null;
  document.getElementById('stat-lessons').textContent = `${doneCount}/${all.length}`;
  document.getElementById('stat-exercises').textContent = exerciseCount;
  document.getElementById('stat-exam').textContent = best === null ? '–' : best;
  document.getElementById('progress-bar').style.width = `${all.length ? (doneCount / all.length) * 100 : 0}%`;

  // Continue button → first unfinished lesson
  const next = all.find((l) => !state.done[l.id]);
  const btn = document.getElementById('continue-btn');
  if (next) {
    btn.href = `lesson.html?id=${next.id}`;
    btn.textContent = doneCount ? 'Học tiếp' : 'Bắt đầu học';
  } else {
    btn.href = 'exam.html';
    btn.textContent = 'Làm đề thi thử';
  }

  // Month cards
  const wrap = document.getElementById('months');
  (window.MONTHS || []).slice().sort((a, b) => a.month - b.month).forEach((m) => {
    const items = all.filter((l) => l.month === m.month);
    const done = items.filter((l) => state.done[l.id]).length;
    const card = App.el('div', { class: 'card month-card' });
    card.innerHTML = `
      <span class="tag ${done === items.length && items.length ? 'good' : 'accent'}">Tháng ${m.month} · ${m.period}</span>
      <h3>${m.title}</h3>
      <div class="muted" style="font-size:14px">${m.domain}</div>
      <p style="margin:8px 0 0;font-size:15px">${m.goal}</p>
      <ul>${items.map((l) => `<li class="${state.done[l.id] ? 'done' : ''}">
        <a href="lesson.html?id=${l.id}">Tuần ${l.week}: ${l.title}</a></li>`).join('')}</ul>
      <div class="progress"><span style="width:${items.length ? (done / items.length) * 100 : 0}%"></span></div>`;
    wrap.appendChild(card);
  });
})();

(function () {
  App.renderHeader('exam');
  const state = App.loadState();
  const bank = window.EXAM_BANK || [];
  const PASS = 720;
  let questions = [];
  let timerId = null;
  let deadline = 0;

  const FULL = Math.min(60, bank.length);
  document.getElementById('full-desc').textContent =
    `${FULL} câu ngẫu nhiên, bấm giờ ${FULL * 2} phút – giống đề thật`;
  const domains = [...new Set(bank.map((q) => q.domain))].sort();
  document.getElementById('domain-select').innerHTML = domains.map((d) =>
    `<option value="${d}">${d} (${bank.filter((q) => q.domain === d).length} câu)</option>`).join('');
  document.getElementById('bank-size').textContent = `Ngân hàng hiện có ${bank.length} câu hỏi.`;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function fmt(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function updateProgress() {
    const answered = document.querySelectorAll('#exam-questions input:checked').length;
    document.getElementById('exam-progress').textContent = `${answered} / ${questions.length} đã trả lời`;
  }

  function start() {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    let pool;
    if (mode === 'quick') pool = shuffle(bank).slice(0, 15);
    else if (mode === 'full') pool = shuffle(bank).slice(0, FULL);
    else {
      const d = document.getElementById('domain-select').value;
      pool = shuffle(bank.filter((q) => q.domain === d));
    }
    questions = pool.map(App.shuffleOptions);
    const wrap = document.getElementById('exam-questions');
    wrap.innerHTML = '';
    questions.forEach((item, i) => {
      const box = App.el('div', { class: 'card quiz-q' });
      box.innerHTML = `<div class="q">Câu ${i + 1} <span class="tag">${item.domain}</span><br>${item.q}</div>` +
        item.options.map((o, j) =>
          `<label><input type="radio" name="ex-q${i}" value="${j}"><span>${o}</span></label>`).join('') +
        `<div class="explain">${item.explain}</div>`;
      wrap.appendChild(box);
    });
    wrap.addEventListener('change', updateProgress);
    updateProgress();

    document.getElementById('exam-setup').hidden = true;
    document.getElementById('exam-result').hidden = true;
    document.getElementById('exam-area').hidden = false;
    document.getElementById('submit-btn').disabled = false;

    const timer = document.getElementById('timer');
    clearInterval(timerId);
    if (mode === 'full') {
      deadline = Date.now() + questions.length * 120 * 1000;
      const tick = () => {
        const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
        timer.textContent = `⏱ ${fmt(left)}`;
        timer.classList.toggle('low', left < 300);
        if (left === 0) submit(true);
      };
      tick();
      timerId = setInterval(tick, 1000);
    } else {
      timer.textContent = 'Không bấm giờ';
      timer.classList.remove('low');
    }
    window.scrollTo({ top: document.getElementById('mock').offsetTop - 70, behavior: 'smooth' });
  }

  function submit(timeout) {
    clearInterval(timerId);
    document.getElementById('submit-btn').disabled = true;
    const byDomain = {};
    let correct = 0;
    document.querySelectorAll('#exam-questions .quiz-q').forEach((box, i) => {
      const item = questions[i];
      box.classList.add('revealed');
      box.querySelectorAll('input').forEach((inp) => { inp.disabled = true; });
      const labels = box.querySelectorAll('label');
      labels[item.answer].classList.add('correct');
      const picked = box.querySelector('input:checked');
      const ok = picked && Number(picked.value) === item.answer;
      if (picked && !ok) picked.closest('label').classList.add('wrong');
      if (ok) correct++;
      byDomain[item.domain] = byDomain[item.domain] || { c: 0, t: 0 };
      byDomain[item.domain].t++;
      if (ok) byDomain[item.domain].c++;
    });

    const pct = questions.length ? correct / questions.length : 0;
    const scaled = Math.round(100 + pct * 900); // quy đổi tuyến tính sang thang 100–1000 (ước lượng)
    const passed = scaled >= PASS;

    state.exams.push({ at: Date.now(), correct, total: questions.length, scaled });
    App.saveState(state);

    const res = document.getElementById('exam-result');
    res.hidden = false;
    res.innerHTML = `
      <div class="card" style="margin:16px 0">
        ${timeout ? '<p class="fail"><strong>Hết giờ – bài đã được nộp tự động.</strong></p>' : ''}
        <div class="score-big ${passed ? 'pass' : 'fail'}">${scaled} / 1000</div>
        <p><strong>${passed ? 'Đạt mốc 720' : 'Chưa đạt mốc 720'}</strong> · ${correct}/${questions.length} câu đúng (${Math.round(pct * 100)}%)</p>
        <div class="table-wrap"><table>
          <tr><th>Domain</th><th>Đúng</th><th>Tỉ lệ</th></tr>
          ${Object.entries(byDomain).sort((a, b) => a[1].c / a[1].t - b[1].c / b[1].t).map(([d, v]) =>
            `<tr><td>${d}</td><td>${v.c}/${v.t}</td><td>${Math.round((v.c / v.t) * 100)}%</td></tr>`).join('')}
        </table></div>
        <p class="muted" style="font-size:14px">Domain được xếp từ yếu đến mạnh. Hãy xem giải thích dưới từng câu, rồi ôn lại các bài của domain yếu nhất. Điểm quy đổi chỉ là ước lượng, không phải cách chấm chính thức.</p>
        <button class="btn" type="button" id="again-btn">Làm đề mới</button>
      </div>`;
    document.getElementById('again-btn').addEventListener('click', () => {
      document.getElementById('exam-area').hidden = true;
      res.hidden = true;
      document.getElementById('exam-setup').hidden = false;
    });
    renderHistory();
    res.scrollIntoView({ behavior: 'smooth' });
  }

  function renderHistory() {
    const box = document.getElementById('history');
    if (!state.exams.length) {
      box.innerHTML = '<p class="muted">Chưa có lần thi thử nào.</p>';
      return;
    }
    box.innerHTML = `<div class="table-wrap"><table>
      <tr><th>Thời gian</th><th>Số câu đúng</th><th>Điểm quy đổi</th><th>Kết quả</th></tr>
      ${state.exams.slice().reverse().map((e) => `<tr>
        <td>${new Date(e.at).toLocaleString('vi-VN')}</td>
        <td>${e.correct}/${e.total}</td>
        <td>${e.scaled}</td>
        <td class="${e.scaled >= PASS ? 'pass' : 'fail'}">${e.scaled >= PASS ? 'Đạt' : 'Chưa đạt'}</td></tr>`).join('')}
    </table></div>`;
  }

  document.getElementById('start-btn').addEventListener('click', start);
  document.getElementById('submit-btn').addEventListener('click', () => {
    const unanswered = questions.length - document.querySelectorAll('#exam-questions input:checked').length;
    if (unanswered > 0 && !confirm(`Còn ${unanswered} câu chưa trả lời. Vẫn nộp bài?`)) return;
    submit(false);
  });
  renderHistory();
})();

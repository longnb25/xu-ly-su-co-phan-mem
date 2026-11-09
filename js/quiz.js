/* ===== Trắc nghiệm ===== */
async function allQuizzes() {
  const db = await DB.list('quizzes');
  return [...DEFAULT_QUIZZES, ...Object.entries(db).map(([k, v]) => ({...v, id: k, questions: v.questions || []}))];
}
const KIND = {'15p': 'Kiểm tra 15 phút', '1t': 'Kiểm tra 1 tiết', 'ht': 'Luyện tập'};
const colName = k => (COLS.find(c => c.k === k) || {}).t || '';

route('quizzes', ['student', 'admin'], async () => {
  const [qs, meta, res] = await Promise.all([allQuizzes(), DB.list('quizMeta'), DB.list('quizResults')]);
  const isOpen = id => (meta[id] || {}).open !== false;
  $('#app').innerHTML = `<div class="row"><h2>📝 Bài kiểm tra trắc nghiệm</h2><span class="sp"></span>${isAdmin() ? '<button class="btn pri" id="add">➕ Tạo bài trắc nghiệm</button>' : ''}</div>
  <div class="grid">${qs.map(q => { const r = (res[q.id] || {})[S.user.id]; const n = Object.keys(res[q.id] || {}).length;
    return `<div class="card" style="margin:0"><span class="tag ${q.kind === '15p' ? 'k15' : q.kind === '1t' ? 'k1t' : ''}">${KIND[q.kind] || 'Luyện tập'}</span> ${isOpen(q.id) ? '' : '<span class="tag">🔒 Đã đóng</span>'}${(meta[q.id] || {}).once ? '<span class="tag">1 lần</span>' : ''}
    <h3 style="margin:8px 0">${esc(q.title)}</h3><p class="muted" style="margin:0">${q.questions.length} câu · ${q.minutes || 15} phút${q.col ? ' · cột ' + colName(q.col) : ''}</p>
    ${r ? `<p>Kết quả của bạn: <b>${r.score}</b>/10 (${r.correct}/${r.total} câu)</p>` : ''}
    <div class="row"><button class="btn pri sm" data-t="${esc(q.id)}" ${!isOpen(q.id) && !isAdmin() ? 'disabled' : ''}>Làm bài</button>
    ${isAdmin() ? `<button class="btn sm" data-r="${esc(q.id)}">📋 Kết quả (${n})</button><button class="btn sm" data-o="${esc(q.id)}">${isOpen(q.id) ? '🔒 Đóng' : '🔓 Mở'}</button><button class="btn sm" data-once="${esc(q.id)}">${(meta[q.id] || {}).once ? 'Cho làm lại' : 'Chỉ 1 lần'}</button><button class="btn sm" data-c="${esc(q.id)}">⧉ Nhân bản</button>${q.builtin ? '' : `<button class="btn sm" data-e="${esc(q.id)}">✏️ Sửa</button><button class="btn sm bad" data-d="${esc(q.id)}">🗑</button>`}` : ''}</div></div>`; }).join('')}</div>`;
  $$('[data-t]').forEach(b => b.onclick = () => { location.hash = '#/quiz/' + b.dataset.t; });
  if (!isAdmin()) return;
  const by = id => qs.find(q => q.id === id);
  $$('[data-o]').forEach(b => b.onclick = async () => { await DB.patch('quizMeta/' + b.dataset.o, {open: !isOpen(b.dataset.o)}); router(); });
  $$('[data-once]').forEach(b => b.onclick = async () => { await DB.patch('quizMeta/' + b.dataset.once, {once: !(meta[b.dataset.once] || {}).once}); router(); });
  $$('[data-c]').forEach(b => b.onclick = async () => { const q = by(b.dataset.c); const {id, builtin, ...rest} = q; await DB.set('quizzes/q' + Date.now(), {...rest, title: q.title + ' (bản sao)'}); toast('Đã nhân bản – bấm Sửa để chỉnh'); router(); });
  $$('[data-d]').forEach(b => b.onclick = async () => { if (await ask('Xóa bài trắc nghiệm này cùng kết quả?', 'Xóa')) { await Promise.all([DB.del('quizzes/' + b.dataset.d), DB.del('quizResults/' + b.dataset.d)]); router(); } });
  $$('[data-e]').forEach(b => b.onclick = () => quizEditor(by(b.dataset.e)));
  $('#add').onclick = () => quizEditor();
  $$('[data-r]').forEach(b => b.onclick = async () => {
    const q = by(b.dataset.r), us = await students(), rr = res[q.id] || {};
    const m = modal(`<h3>Kết quả: ${esc(q.title)}</h3><div class="tw" style="max-height:50vh"><table><tr><th>Sinh viên</th><th class="c">Điểm</th><th class="c">Đúng</th><th class="c">Lần làm</th></tr>${us.map(s => { const r = rr[s.id]; return `<tr><td>${esc(fullName(s))}</td><td class="c"><b>${r ? r.score : ''}</b></td><td class="c">${r ? r.correct + '/' + r.total : ''}</td><td class="c">${r ? r.tries || 1 : ''}</td></tr>`; }).join('')}</table></div>
    <div class="row" style="margin-top:12px">${q.col ? `<button class="btn ok" id="push">⬆ Đưa điểm vào cột "${colName(q.col)}" của bảng điểm</button>` : '<span class="muted">Bài này chưa gắn cột điểm (chọn khi sửa).</span>'}<span class="sp"></span><button class="btn" id="x">Đóng</button></div>`);
    $('#x', m).onclick = m.close;
    if (q.col) $('#push', m).onclick = async () => { if (!await ask(`Ghi đè cột "${colName(q.col)}" của ${Object.keys(rr).length} sinh viên đã làm bài?`, 'Ghi điểm')) return; await Promise.all(Object.entries(rr).map(([uid, r]) => DB.patch('scores/' + uid, {[q.col]: r.score}))); toast('Đã cập nhật bảng điểm'); m.close(); };
  });
});

function quizEditor(q) {
  const data = q ? JSON.parse(JSON.stringify(q)) : {title: '', kind: 'ht', col: '', minutes: 15, questions: [{q: '', o: ['', '', '', ''], a: 0, code: ''}]};
  const m = modal(`<h3>${q ? 'Sửa' : 'Tạo'} bài trắc nghiệm</h3><label>Tiêu đề</label><input id="q_t" value="${esc(data.title)}">
    <div class="row"><div class="sp"><label>Loại</label><select id="q_k">${Object.entries(KIND).map(([k, v]) => `<option value="${k}" ${data.kind === k ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
    <div class="sp"><label>Thời gian (phút)</label><input id="q_m" type="number" value="${data.minutes || 15}"></div>
    <div class="sp"><label>Gắn cột điểm</label><select id="q_c"><option value="">(không)</option>${COLS.map(c => `<option value="${c.k}" ${data.col === c.k ? 'selected' : ''}>${c.t}</option>`).join('')}</select></div></div>
    <label>Câu hỏi</label><div id="qs"></div><button class="btn sm" id="addq">+ Thêm câu</button>
    <div class="row" style="margin-top:12px;justify-content:flex-end"><button class="btn" id="c">Hủy</button><button class="btn pri" id="s">Lưu</button></div>`);
  m.firstElementChild.style.width = 'min(760px,100%)';
  const draw = () => { $('#qs', m).innerHTML = data.questions.map((x, i) => `<div class="q"><div class="row"><b>Câu ${i + 1}</b><span class="sp"></span><button class="btn sm bad" data-rm="${i}">Xóa câu</button></div>
    <textarea rows="2" data-i="${i}" data-f="q" placeholder="Nội dung câu hỏi">${esc(x.q)}</textarea><textarea rows="2" data-i="${i}" data-f="code" placeholder="(Tuỳ chọn) đoạn code C kèm theo" style="font-family:var(--mono);margin-top:4px">${esc(x.code || '')}</textarea>
    ${x.o.map((o, j) => `<div class="row" style="margin-top:4px"><input type="radio" name="ans${i}" data-i="${i}" data-ans="${j}" ${x.a === j ? 'checked' : ''} title="Đáp án đúng"><input class="sp" data-i="${i}" data-o="${j}" value="${esc(o)}" placeholder="Đáp án ${'ABCD'[j]}"></div>`).join('')}</div>`).join('');
    $$('#qs [data-f]', m).forEach(e => e.oninput = () => data.questions[e.dataset.i][e.dataset.f] = e.value); $$('#qs [data-o]', m).forEach(e => e.oninput = () => data.questions[e.dataset.i].o[e.dataset.o] = e.value);
    $$('#qs [data-ans]', m).forEach(e => e.onchange = () => data.questions[e.dataset.i].a = +e.dataset.ans); $$('[data-rm]', m).forEach(b => b.onclick = () => { data.questions.splice(b.dataset.rm, 1); draw(); }); };
  draw(); $('#addq', m).onclick = () => { data.questions.push({q: '', o: ['', '', '', ''], a: 0, code: ''}); draw(); }; $('#c', m).onclick = m.close;
  $('#s', m).onclick = async () => {
    const qsv = data.questions.filter(x => x.q.trim() && x.o.filter(o => o.trim()).length >= 2).map(x => ({q: x.q, o: x.o.filter(o => o.trim()), a: Math.min(x.a, x.o.filter(o => o.trim()).length - 1), code: x.code || ''}));
    if (!$('#q_t', m).value.trim() || !qsv.length) return toast('Cần tiêu đề và ít nhất 1 câu hợp lệ (≥2 đáp án)');
    const rec = {title: $('#q_t', m).value.trim(), kind: $('#q_k', m).value, minutes: +$('#q_m', m).value || 15, col: $('#q_c', m).value, questions: qsv, ts: Date.now()};
    await DB.set('quizzes/' + (q ? q.id : 'q' + Date.now()), rec); m.close(); toast('Đã lưu'); router();
  };
}

route('quiz', ['student', 'admin'], async id => {
  const qs = await allQuizzes(); const q = qs.find(x => x.id === id); if (!q) throw new Error('Không có bài này');
  const [meta, prev] = await Promise.all([DB.get('quizMeta/' + id), DB.get(`quizResults/${id}/${S.user.id}`)]);
  if (isStudent() && meta && meta.open === false) throw new Error('Bài kiểm tra đang đóng.');
  if (isStudent() && meta && meta.once && prev) throw new Error('Bài này chỉ được làm 1 lần – bạn đã làm rồi (điểm ' + prev.score + ').');
  let left = (q.minutes || 15) * 60, timer, done = false;
  $('#app').innerHTML = `<a href="#/quizzes">← Danh sách</a><div class="card"><div class="row"><h2 style="margin:0">${esc(q.title)}</h2><span class="sp"></span><span class="tag" style="font-size:16px" id="clock"></span></div><p class="muted">${q.questions.length} câu · chọn 1 đáp án đúng cho mỗi câu.</p></div>
  <div id="qa">${q.questions.map((x, i) => `<div class="q" data-i="${i}"><b>Câu ${i + 1}.</b> ${esc(x.q)}${x.code ? `<pre>${hl(x.code)}</pre>` : ''}${x.o.map((o, j) => `<label class="opt"><input type="radio" name="q${i}" value="${j}"> ${'ABCD'[j]}. ${esc(o)}</label>`).join('')}</div>`).join('')}</div>
  <div class="center"><button class="btn pri" id="fin" style="font-size:16px;padding:12px 30px">Nộp bài</button></div><div id="result"></div>`;
  const tick = () => { const c = $('#clock'); if (!c) return clearInterval(timer); c.textContent = '⏱ ' + String(Math.floor(left / 60)).padStart(2, '0') + ':' + String(left % 60).padStart(2, '0'); if (left-- <= 0) { clearInterval(timer); finish(true); } };
  timer = setInterval(tick, 1000); tick();
  async function finish(auto) {
    if (done) return;
    const ans = q.questions.map((_, i) => { const r = $(`input[name="q${i}"]:checked`); return r ? +r.value : -1; });
    if (!auto && ans.includes(-1) && !await ask(`Còn ${ans.filter(a => a < 0).length} câu chưa trả lời. Vẫn nộp bài?`, 'Nộp bài')) return;
    done = true; clearInterval(timer);
    let correct = 0; q.questions.forEach((x, i) => { const box = $(`.q[data-i="${i}"]`); $$('.opt', box).forEach((o, j) => { o.querySelector('input').disabled = true; if (j === x.a) o.classList.add('right'); else if (j === ans[i]) o.classList.add('wrong'); }); if (ans[i] === x.a) correct++; });
    const score = Math.round(correct / q.questions.length * 100) / 10;
    $('#fin').style.display = 'none';
    $('#result').innerHTML = `<div class="card center"><h2>Kết quả: ${score}/10</h2><p>Đúng ${correct}/${q.questions.length} câu. Đáp án đúng được tô xanh, câu bạn chọn sai tô đỏ.</p></div>`;
    window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
    try { const best = prev && prev.score > score; await DB.set(`quizResults/${id}/${S.user.id}`, {score: best ? prev.score : score, last: score, correct: best ? prev.correct : correct, total: q.questions.length, tries: (prev ? prev.tries || 1 : 0) + 1, ts: Date.now()}); toast('Đã lưu kết quả'); } catch (e) { toast(e.message); }
  }
  $('#fin').onclick = () => finish(false);
});

/* ===== Bài học, Học liệu, Trình soạn code C (IDE), Thực hành ===== */

/* ---------- Tô màu cú pháp C ---------- */
function hl(code) {
  return esc(code).replace(/(\/\/.*|\/\*[\s\S]*?\*\/)|(&quot;(?:(?!&quot;).)*&quot;|'(?:\\.|[^'\\])')|(^[ \t]*#.*$)|\b(int|char|float|double|void|long|short|unsigned|signed|const|static)\b|\b(if|else|for|while|do|switch|case|default|break|continue|return|sizeof)\b|\b(\d+\.?\d*)\b/gm,
    (m, c, s, p, t, k, n) => c ? `<span class="cm">${c}</span>` : s ? `<span class="st">${s}</span>` : p ? `<span class="pp">${p}</span>` : t ? `<span class="ty">${t}</span>` : k ? `<span class="kw">${k}</span>` : `<span class="nm">${n}</span>`);
}
function runC(code, input) {
  const r = CInterp.run(code, input || '');
  let out = r.out, log = '';
  if (r.err) { log = `[Lỗi]${r.line ? ' Dòng ' + r.line + ':' : ''} ${r.err}`; }
  else log = 'Biên dịch & chạy thành công.';
  return {out, err: r.err, line: r.line, exit: r.exit, log};
}
const outHtml = r => esc(r.out) + (r.err ? `\n<span style="color:#ff8a8a">⛔ ${r.line ? 'Dòng ' + r.line + ': ' : ''}${esc(r.err)}</span>` : `\n<span style="color:#7aa">--------------------------------\nProcess exited with return value ${r.exit}</span>`);

/* ---------- Bộ soạn thảo có số dòng + tô màu ---------- */
function editorHTML(id) { return `<div class="edwrap" id="${id}"><div class="gut"></div><div class="edarea"><pre aria-hidden="true"></pre><textarea spellcheck="false" autocapitalize="off" autocomplete="off"></textarea></div></div>`; }
function initEditor(root, code, onChange) {
  const ta = $('textarea', root), pre = $('pre', root), gut = $('.gut', root);
  const paint = () => { pre.innerHTML = hl(ta.value) + '\n'; const n = ta.value.split('\n').length; gut.textContent = Array.from({length: n}, (_, i) => i + 1).join('\n'); };
  ta.value = code || ''; paint();
  ta.addEventListener('input', () => { paint(); onChange && onChange(); });
  ta.addEventListener('scroll', () => { pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft; gut.scrollTop = ta.scrollTop; });
  ta.addEventListener('keydown', e => {
    const s = ta.selectionStart, en = ta.selectionEnd, v = ta.value;
    const ins = (t, back = 0) => { ta.setRangeText(t, s, en, 'end'); ta.selectionStart = ta.selectionEnd = s + t.length - back; paint(); onChange && onChange(); };
    if (e.key === 'Tab') { e.preventDefault(); ins('    '); }
    else if (e.key === 'Enter') {
      e.preventDefault(); const ls = v.lastIndexOf('\n', s - 1) + 1; const line = v.slice(ls, s); let ind = line.match(/^\s*/)[0];
      if (/\{\s*$/.test(line)) { if (v[s] === '}') ins('\n' + ind + '    \n' + ind, ind.length + 1); else ins('\n' + ind + '    '); } else ins('\n' + ind);
    }
    else if ('({["\''.includes(e.key) && s === en && !e.ctrlKey) {
      const pair = {'(': ')', '[': ']', '{': '}', '"': '"', "'": "'"}[e.key];
      if (e.key === '"' || e.key === "'") { if (v[s] === e.key) { e.preventDefault(); ta.selectionStart = ta.selectionEnd = s + 1; return; } }
      e.preventDefault(); ins(e.key + pair, 1);
    }
    else if (')]}'.includes(e.key) && v[s] === e.key && s === en) { e.preventDefault(); ta.selectionStart = ta.selectionEnd = s + 1; }
  });
  return {get: () => ta.value, set: v => { ta.value = v; paint(); }, ta, focus: () => ta.focus()};
}

/* ---------- Danh sách bài học ---------- */
route('lessons', ['student', 'admin'], async () => {
  $('#app').innerHTML = `<h2>📚 Bài học (18 buổi)</h2><p class="muted">Mỗi buổi 3 giờ gồm lý thuyết, ví dụ chạy thử và bài tập thực tế.</p><div class="lesson-grid">${LESSONS.map(lessonCard).join('')}</div>`;
});
route('lesson', ['student', 'admin'], async id => {
  const l = LESSONS.find(x => x.n == id); if (!l) throw new Error('Không có buổi học này');
  const [mats, labsDb] = await Promise.all([DB.list('materials'), DB.list('labs')]);
  const extra = Object.entries(mats).filter(([, m]) => +m.lesson === l.n);
  const labs = [...DEFAULT_LABS, ...Object.entries(labsDb).map(([k, v]) => ({...v, id: k}))].filter(x => +x.lesson === l.n);
  $('#app').innerHTML = `<div class="row"><a href="#/lessons">← Danh sách</a><span class="sp"></span>${l.n > 1 ? `<a class="btn sm" href="#/lesson/${l.n - 1}">◀ Buổi ${l.n - 1}</a>` : ''}${l.n < 18 ? `<a class="btn sm" href="#/lesson/${l.n + 1}">Buổi ${l.n + 1} ▶</a>` : ''}</div>
  <div class="lh"><div class="kick">BUỔI ${l.n} / 18 · 3 GIỜ (LÝ THUYẾT + THỰC HÀNH)</div><h1>${esc(l.title)}</h1><p>${esc(l.sub)}</p></div>
  <div class="lgrid"><div class="lmain">
  <div class="card" id="s-goal"><h3>🎯 Mục tiêu</h3><ul>${l.goals.map(g => `<li>${esc(g)}</li>`).join('')}</ul></div>
  <div class="card lessonbody" id="s-theory"><h2>📖 Lý thuyết</h2>${l.theory}${l.diagram || ''}</div>
  <div class="card" id="s-code"><h2>💡 Ví dụ minh họa (chạy thử ngay)</h2>${l.codes.map((c, i) => `<div class="ex-code" data-i="${i}" style="margin-bottom:18px"><b>Ví dụ ${i + 1}: ${esc(c.t)}</b><pre><code>${hl(c.c)}</code></pre>
    ${c.input != null ? `<div class="muted" style="font-size:12.5px">Dữ liệu nhập (stdin):</div><textarea rows="${Math.min(4, c.input.split('\n').length)}" class="inp" style="font-family:var(--mono)">${esc(c.input)}</textarea>` : ''}
    <div class="row" style="margin-top:6px"><button class="btn pri sm run">▶ Chạy thử</button><button class="btn sm ide">💻 Mở trong trình soạn code</button></div><div class="runout hide"></div></div>`).join('')}</div>
  <div class="card" id="s-ex"><h2>🛠 Bài tập thực tế</h2>${l.ex.map((e, i) => `<div class="ex"><b>${i + 1}.</b><div>${esc(e)}</div></div>`).join('')}<p><a class="btn pri" href="#/ide">💻 Làm bài trong trình soạn code</a></p></div>
  ${labs.length ? `<div class="card"><h2>🧪 Bài thực hành có chấm tự động</h2>${labs.map(x => `<div class="ex"><b>▸</b><div><a href="#/lab/${esc(x.id)}">${esc(x.title)}</a></div></div>`).join('')}</div>` : ''}
  ${extra.length ? `<div class="card"><h2>📎 Học liệu bổ sung của giảng viên</h2>${extra.map(([k, m]) => `<div class="ex"><b>▸</b><div><a href="#/material/${k}">${esc(m.title)}</a></div></div>`).join('')}</div>` : ''}</div>
  <aside class="toc"><b>Nội dung buổi ${l.n}</b><a href="#" data-s="s-goal">🎯 Mục tiêu</a><a href="#" data-s="s-theory">📖 Lý thuyết</a><a href="#" data-s="s-code">💡 Ví dụ (${l.codes.length})</a><a href="#" data-s="s-ex">🛠 Bài tập (${l.ex.length})</a></aside></div>`;
  initAnims($('#app'));
  $$('.toc a').forEach(a => a.onclick = e => { e.preventDefault(); document.getElementById(a.dataset.s).scrollIntoView({behavior: 'smooth', block: 'start'}); });
  $$('.ex-code').forEach(box => {
    const c = l.codes[box.dataset.i], out = $('.runout', box);
    $('.run', box).onclick = () => { const inp = $('.inp', box); const r = runC(c.c, inp ? inp.value : ''); out.classList.remove('hide'); out.innerHTML = outHtml(r); };
    $('.ide', box).onclick = () => { sessionStorage.setItem('ide_open', JSON.stringify({code: c.c, input: ($('.inp', box) || {}).value || '', name: `Buoi${l.n}_vd${+box.dataset.i + 1}.c`})); location.hash = '#/ide'; };
  });
});

/* ---------- Học liệu ---------- */
route('materials', ['student', 'admin'], async () => {
  const mats = await DB.list('materials'); const entries = Object.entries(mats).sort((a, b) => (b[1].ts || 0) - (a[1].ts || 0));
  $('#app').innerHTML = `<div class="row"><h2>📖 Học liệu</h2><span class="sp"></span>${isAdmin() ? '<button class="btn pri" id="add">➕ Tạo học liệu</button>' : ''}</div>
  <h3>Giáo trình lập trình C (18 buổi)</h3><div class="grid">${LESSONS.map(l => `<a class="card lcard" href="#/lesson/${l.n}" style="color:inherit;text-decoration:none;margin:0"><b>Buổi ${l.n}</b><br>${esc(l.title)}</a>`).join('')}</div>
  <h3 style="margin-top:22px">Học liệu bổ sung</h3>${entries.length ? `<div class="grid">${entries.map(([k, m]) => `<div class="card" style="margin:0"><b>${esc(m.title)}</b><br><span class="muted">${m.lesson ? 'Buổi ' + esc(m.lesson) : 'Chung'}</span><div class="row" style="margin-top:8px"><a class="btn sm pri" href="#/material/${k}">Xem</a>${isAdmin() ? `<button class="btn sm" data-e="${k}">Sửa</button><button class="btn sm bad" data-d="${k}">Xóa</button>` : ''}</div></div>`).join('')}</div>` : '<p class="muted">Chưa có học liệu bổ sung.</p>'}`;
  if (!isAdmin()) return;
  const form = (id, m = {}) => {
    const mo = modal(`<h3>${id ? 'Sửa' : 'Tạo'} học liệu</h3><label>Tiêu đề</label><input id="m_t" value="${esc(m.title || '')}"><label>Thuộc buổi (1–18, để trống = chung)</label><input id="m_l" type="number" min="1" max="18" value="${esc(m.lesson || '')}">
    <label>Nội dung (hỗ trợ: # tiêu đề, **đậm**, \`code\`, - danh sách, \`\`\` khối code \`\`\`, ![ảnh](url), [liên kết](url))</label><textarea id="m_b" rows="12" style="font-family:var(--mono)">${esc(m.body || '')}</textarea>
    <div class="row" style="margin-top:12px;justify-content:flex-end"><button class="btn" id="c">Hủy</button><button class="btn pri" id="s">Lưu</button></div>`);
    $('#c', mo).onclick = mo.close;
    $('#s', mo).onclick = async () => { const t = $('#m_t', mo).value.trim(); if (!t) return toast('Nhập tiêu đề'); const rec = {title: t, lesson: $('#m_l', mo).value || '', body: $('#m_b', mo).value, ts: Date.now()}; if (id) await DB.patch('materials/' + id, rec); else await DB.set('materials/m' + Date.now(), rec); mo.close(); router(); };
  };
  $('#add').onclick = () => form(); $$('[data-e]').forEach(b => b.onclick = () => form(b.dataset.e, mats[b.dataset.e]));
  $$('[data-d]').forEach(b => b.onclick = async () => { if (await ask('Xóa học liệu này?', 'Xóa')) { await DB.del('materials/' + b.dataset.d); router(); } });
});
route('material', ['student', 'admin'], async id => {
  const m = await DB.get('materials/' + id); if (!m) throw new Error('Học liệu không tồn tại');
  $('#app').innerHTML = `<a href="#/materials">← Học liệu</a><div class="card lessonbody"><h1>${esc(m.title)}</h1>${md(m.body)}</div>`;
});

/* ---------- Trình soạn code C (như Dev-C++) ---------- */
route('ide', ['student', 'admin'], async () => {
  const uid = S.user.id; let files = await DB.list('codes/' + uid);
  let cur = null, dirty = false;
  const open = JSON.parse(sessionStorage.getItem('ide_open') || 'null'); sessionStorage.removeItem('ide_open');
  $('#app').innerHTML = `<div class="ide"><div class="side"><div class="row" style="margin-bottom:6px"><b>📁 Bài đã lưu</b></div><div id="fl"></div></div>
   <div class="main"><div class="tool"><button class="btn sm" id="new">📄 Mới</button><button class="btn sm" id="save">💾 Lưu (Ctrl+S)</button><button class="btn sm" id="dl">⬇ Tải .c</button><button class="btn sm" id="smp">📋 Mẫu</button><span class="sp"></span><span id="fn" class="tag">Chưa đặt tên</span><button class="btn ok sm" id="run">▶ Biên dịch &amp; Chạy (F9)</button></div>
   ${editorHTML('ed')}<div class="bottom"><div><h4>Dữ liệu nhập (stdin)</h4><textarea id="stdin" placeholder="Gõ dữ liệu cho scanf ở đây, VD: 5 7"></textarea></div><div><h4>Kết quả chạy / Compile log</h4><div class="runout" id="out">Nhấn F9 để chạy…</div></div></div></div></div>
   <p class="muted">Trình thông dịch C chạy ngay trên trình duyệt: hỗ trợ int/float/double/char, mảng 1–2 chiều, con trỏ, hàm, đệ quy, printf/scanf, math.h, string.h cơ bản. Chưa hỗ trợ struct, file, malloc nâng cao.</p>`;
  const ed = initEditor($('#ed'), open ? open.code : SAMPLE_CODE, () => { dirty = true; });
  if (open) { $('#stdin').value = open.input || ''; $('#fn').textContent = open.name || 'Chưa đặt tên'; cur = {name: open.name}; }
  const list = () => { const e = Object.entries(files).sort((a, b) => b[1].ts - a[1].ts); $('#fl').innerHTML = e.map(([k, f]) => `<div class="f ${cur && cur.id === k ? 'on' : ''}" data-k="${k}"><span>📄 ${esc(f.name)}</span><span data-x="${k}" title="Xóa">✖</span></div>`).join('') || '<span class="muted">Chưa có bài nào</span>';
    $$('#fl .f').forEach(d => d.onclick = async ev => { const k = d.dataset.k; if (ev.target.dataset.x) { if (await ask('Xóa file này?', 'Xóa')) { await DB.del(`codes/${uid}/${k}`); delete files[k]; if (cur && cur.id === k) cur = null; list(); } return; } cur = {id: k, name: files[k].name}; ed.set(files[k].code); $('#fn').textContent = files[k].name; dirty = false; list(); }); };
  list();
  const save = async () => {
    let name = cur && cur.name; if (!name) { name = prompt('Đặt tên file (VD: bai1.c):', 'bai1.c'); if (!name) return; }
    if (!/\.c$/i.test(name)) name += '.c'; const id = (cur && cur.id) || 'f' + Date.now();
    const rec = {name, code: ed.get(), ts: Date.now()}; await DB.set(`codes/${uid}/${id}`, rec); files[id] = rec; cur = {id, name}; $('#fn').textContent = name; dirty = false; list(); toast('Đã lưu "' + name + '"');
  };
  const run = () => { const r = runC(ed.get(), $('#stdin').value); const o = $('#out'); o.innerHTML = `<span style="color:#9ad">${esc(r.log)}</span>\n\n` + outHtml(r); o.classList.toggle('err', !!r.err); };
  $('#save').onclick = () => save().catch(e => toast(e.message)); $('#run').onclick = run;
  $('#new').onclick = () => { cur = null; ed.set(SAMPLE_CODE); $('#fn').textContent = 'Chưa đặt tên'; list(); };
  $('#smp').onclick = () => ed.set(SAMPLE_CODE);
  $('#dl').onclick = () => download((cur && cur.name) || 'bai.c', ed.get());
  const keys = e => { if (!$('#ed')) return document.removeEventListener('keydown', keys); if (e.key === 'F9' || e.key === 'F11') { e.preventDefault(); run(); } if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); save().catch(x => toast(x.message)); } };
  document.addEventListener('keydown', keys);
});

/* ---------- Thực hành có chấm tự động ---------- */
const normOut = s => String(s).replace(/\r/g, '').split('\n').map(l => l.replace(/\s+$/, '')).join('\n').trim();
async function allLabs() { const db = await DB.list('labs'); return [...DEFAULT_LABS, ...Object.entries(db).map(([k, v]) => ({...v, id: k, tests: v.tests || []}))]; }
route('labs', ['student', 'admin'], async () => {
  const [labs, subs, us] = await Promise.all([allLabs(), DB.list('labSubs'), isAdmin() ? students() : Promise.resolve([])]);
  const mine = id => (subs[id] || {})[S.user.id];
  $('#app').innerHTML = `<div class="row"><h2>🧪 Bài thực hành</h2><span class="sp"></span>${isAdmin() ? '<button class="btn pri" id="add">➕ Tạo bài thực hành</button>' : ''}</div>
   <p class="muted">Viết code C trực tiếp trên web; hệ thống chạy với các bộ test và báo kết quả. Bài của bạn được lưu lại.</p>
   <div class="grid">${labs.map(x => { const m = mine(x.id); return `<div class="card" style="margin:0"><span class="tag">Buổi ${x.lesson || '–'}</span> ${m ? (m.passed === m.total ? '<span class="tag" style="color:var(--ok)">✔ Đạt</span>' : `<span class="tag">${m.passed}/${m.total} test</span>`) : ''}<h3 style="margin:8px 0">${esc(x.title)}</h3><div class="row"><a class="btn pri sm" href="#/lab/${esc(x.id)}">Làm bài</a>${isAdmin() && !x.id.startsWith('l-') ? `<button class="btn sm" data-e="${esc(x.id)}">Sửa</button><button class="btn sm bad" data-d="${esc(x.id)}">Xóa</button>` : ''}</div></div>`; }).join('')}</div>
   ${isAdmin() ? `<h3 style="margin-top:22px">Kết quả nộp bài (đạt / tổng test)</h3><div class="card tw"><table><tr><th>Sinh viên</th>${labs.map((x, i) => `<th class="c" title="${esc(x.title)}">B${i + 1}</th>`).join('')}</tr>${us.map(s => `<tr><td>${esc(fullName(s))}</td>${labs.map(x => { const m = (subs[x.id] || {})[s.id]; return `<td class="c ${m ? (m.passed === m.total ? 'st-co' : 'st-phep') : ''}">${m ? m.passed + '/' + m.total : ''}</td>`; }).join('')}</tr>`).join('')}</table></div>` : ''}`;
  if (!isAdmin()) return;
  const form = (lab = {}) => {
    const tests = (lab.tests && lab.tests.length) ? lab.tests : [{in: '', out: ''}];
    const m = modal(`<h3>${lab.id ? 'Sửa' : 'Tạo'} bài thực hành</h3><label>Tiêu đề</label><input id="l_t" value="${esc(lab.title || '')}"><label>Thuộc buổi</label><input id="l_n" type="number" min="1" max="18" value="${esc(lab.lesson || '')}">
      <label>Đề bài (HTML đơn giản)</label><textarea id="l_d" rows="4">${esc(lab.desc || '')}</textarea><label>Code khởi tạo</label><textarea id="l_s" rows="6" style="font-family:var(--mono)">${esc(lab.starter || SAMPLE_CODE)}</textarea>
      <label>Bộ test (dữ liệu nhập → kết quả mong đợi)</label><div id="tests"></div><button class="btn sm" id="addt">+ Thêm test</button>
      <div class="row" style="margin-top:12px;justify-content:flex-end"><button class="btn" id="c">Hủy</button><button class="btn pri" id="s">Lưu</button></div>`);
    const drawT = () => { $('#tests', m).innerHTML = tests.map((t, i) => `<div class="row" style="margin:4px 0;align-items:flex-start"><textarea rows="2" placeholder="Input" data-i="${i}" data-f="in" style="flex:1;font-family:var(--mono)">${esc(t.in)}</textarea><textarea rows="2" placeholder="Output" data-i="${i}" data-f="out" style="flex:1;font-family:var(--mono)">${esc(t.out)}</textarea><button class="btn sm bad" data-rm="${i}">✖</button></div>`).join('');
      $$('#tests textarea', m).forEach(a => a.oninput = () => tests[a.dataset.i][a.dataset.f] = a.value); $$('[data-rm]', m).forEach(b => b.onclick = () => { tests.splice(b.dataset.rm, 1); drawT(); }); };
    drawT(); $('#addt', m).onclick = () => { tests.push({in: '', out: ''}); drawT(); }; $('#c', m).onclick = m.close;
    $('#s', m).onclick = async () => { const t = $('#l_t', m).value.trim(); if (!t) return toast('Nhập tiêu đề'); const rec = {title: t, lesson: $('#l_n', m).value, desc: $('#l_d', m).value, starter: $('#l_s', m).value, tests: tests.filter(x => x.out.trim() !== ''), ts: Date.now()}; if (!rec.tests.length) return toast('Cần ít nhất 1 test có Output'); await DB.set('labs/' + (lab.id || 'lab' + Date.now()), rec); m.close(); router(); };
  };
  $('#add').onclick = () => form(); $$('[data-e]').forEach(b => b.onclick = () => form(labs.find(x => x.id === b.dataset.e)));
  $$('[data-d]').forEach(b => b.onclick = async () => { if (await ask('Xóa bài thực hành này?', 'Xóa')) { await DB.del('labs/' + b.dataset.d); router(); } });
});
route('lab', ['student', 'admin'], async id => {
  const labs = await allLabs(); const lab = labs.find(x => x.id === id); if (!lab) throw new Error('Không có bài thực hành này');
  const prev = await DB.get(`labSubs/${id}/${S.user.id}`);
  $('#app').innerHTML = `<a href="#/labs">← Danh sách bài</a><div class="split" style="margin-top:8px"><div class="card"><span class="tag">Buổi ${lab.lesson || '–'}</span><h2>${esc(lab.title)}</h2><div>${lab.desc}</div><h3>Ví dụ test</h3>${lab.tests.slice(0, 2).map(t => `<div class="muted" style="font-size:12.5px">Input:</div><pre style="margin:2px 0">${esc(t.in) || '(không có)'}</pre><div class="muted" style="font-size:12.5px">Output:</div><pre style="margin:2px 0">${esc(t.out)}</pre>`).join('')}<div id="res"></div></div>
  <div><div class="ide" style="grid-template-columns:1fr;height:620px"><div class="main"><div class="tool"><button class="btn sm" id="rst">↺ Code ban đầu</button><span class="sp"></span><button class="btn sm" id="try">▶ Chạy thử</button><button class="btn pri sm" id="sub">✅ Nộp &amp; chấm</button></div>${editorHTML('ed')}<div class="bottom" style="height:150px"><div><h4>Input chạy thử</h4><textarea id="stdin"></textarea></div><div><h4>Kết quả</h4><div class="runout" id="out"></div></div></div></div></div></div></div>`;
  const ed = initEditor($('#ed'), (prev && prev.code) || lab.starter);
  $('#stdin').value = lab.tests[0] ? lab.tests[0].in : '';
  $('#rst').onclick = () => ed.set(lab.starter);
  $('#try').onclick = () => { const r = runC(ed.get(), $('#stdin').value); $('#out').innerHTML = outHtml(r); };
  if (prev) $('#res').innerHTML = `<div class="note">Lần nộp trước: <b>${prev.passed}/${prev.total}</b> test đạt.</div>`;
  $('#sub').onclick = async () => {
    let passed = 0, html = '';
    lab.tests.forEach((t, i) => {
      const r = runC(ed.get(), t.in), ok = !r.err && normOut(r.out) === normOut(t.out); if (ok) passed++;
      html += `<div class="note ${ok ? 'tip' : 'warn'}"><b>Test ${i + 1}: ${ok ? '✔ Đúng' : '✘ Sai'}</b>${!ok && i < 2 ? `<br><small>Input: <code>${esc(t.in) || '(trống)'}</code><br>Mong đợi: <code>${esc(t.out)}</code><br>Nhận được: <code>${r.err ? esc('Lỗi: ' + r.err) : esc(r.out)}</code></small>` : ''}</div>`;
    });
    $('#res').innerHTML = `<h3>Kết quả: ${passed}/${lab.tests.length} test đạt ${passed === lab.tests.length ? '🎉' : ''}</h3>${html}`;
    try { await DB.set(`labSubs/${id}/${S.user.id}`, {code: ed.get(), passed, total: lab.tests.length, ts: Date.now()}); toast('Đã lưu bài nộp'); } catch (e) { toast(e.message); }
  };
});

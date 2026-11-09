/* ===== Sinh viên, Bảng điểm, Xếp hạng, Điểm danh ===== */

/* ---------- Quản lí sinh viên (CRUD) ---------- */
route('students', ['admin'], async () => {
  const list = await students();
  $('#app').innerHTML = `<div class="row"><h2>👥 Danh sách lớp (${list.length} sinh viên)</h2><span class="sp"></span>
    <button class="btn" id="seed">📥 Nhập K19IT mẫu</button><label class="btn">📂 Nhập từ Excel<input type="file" id="xl" accept=".xlsx,.xls" hidden></label><button class="btn pri" id="add">➕ Thêm sinh viên</button></div>
    <p class="muted">Mỗi sinh viên có tài khoản: <b>tên đăng nhập = Mã HSSV</b>, mật khẩu mặc định = Mã HSSV. Excel cần các cột: <i>Mã HSSV, Họ và, Tên, Hệ, Ghi Chú</i>.</p>
    <div class="card tw"><table><tr><th class="c">STT</th><th>Mã HSSV</th><th>Họ và</th><th>Tên</th><th>Hệ</th><th>Ghi chú</th><th class="c">Thao tác</th></tr>
    ${list.map((s, i) => `<tr><td class="c">${i + 1}</td><td>${esc(s.id)}</td><td>${esc(s.ho)}</td><td><b>${esc(s.ten)}</b></td><td>${esc(s.he)}</td><td>${esc(s.note)}</td>
    <td class="c"><button class="btn sm" data-e="${esc(s.id)}">✏️ Sửa</button> <button class="btn sm" data-r="${esc(s.id)}">🔑 Đặt lại MK</button> <button class="btn sm bad" data-d="${esc(s.id)}">🗑 Xóa</button></td></tr>`).join('') || '<tr><td colspan="7" class="center muted">Chưa có sinh viên. Bấm "Nhập K19IT mẫu" hoặc "Thêm sinh viên".</td></tr>'}</table></div>`;
  const reload = () => router();
  async function upsert(rec, isNew) {
    const id = keyOf(rec.id.toUpperCase());
    if (!id) return toast('Thiếu Mã HSSV');
    const ex = await DB.get('users/' + id);
    if (isNew && ex) return toast('Mã HSSV đã tồn tại');
    if (ex) await DB.patch('users/' + id, {ho: rec.ho, ten: rec.ten, name: (rec.ho + ' ' + rec.ten).trim(), he: rec.he, note: rec.note});
    else await DB.set('users/' + id, await makeAccount({role: 'student', ho: rec.ho, ten: rec.ten, name: (rec.ho + ' ' + rec.ten).trim(), he: rec.he, note: rec.note, ord: Date.now() % 1e9}, id));
    return true;
  }
  const form = (s = {}, isNew = true) => {
    const m = modal(`<h3>${isNew ? 'Thêm' : 'Sửa'} sinh viên</h3><label>Mã HSSV</label><input id="f_id" value="${esc(s.id || '')}" ${isNew ? '' : 'disabled'}>
      <label>Họ và (đệm)</label><input id="f_ho" value="${esc(s.ho || '')}"><label>Tên</label><input id="f_ten" value="${esc(s.ten || '')}">
      <label>Hệ</label><select id="f_he">${['Cao đẳng', 'Trung Cấp'].map(h => `<option ${s.he === h ? 'selected' : ''}>${h}</option>`).join('')}</select>
      <label>Ghi chú</label><input id="f_note" value="${esc(s.note || '')}"><div class="row" style="margin-top:14px;justify-content:flex-end"><button class="btn" id="c">Hủy</button><button class="btn pri" id="s">Lưu</button></div>`);
    $('#c', m).onclick = m.close;
    $('#s', m).onclick = async () => { if (await upsert({id: $('#f_id', m).value, ho: $('#f_ho', m).value.trim(), ten: $('#f_ten', m).value.trim(), he: $('#f_he', m).value, note: $('#f_note', m).value.trim()}, isNew)) { m.close(); toast('Đã lưu'); reload(); } };
  };
  $('#add').onclick = () => form();
  $$('[data-e]').forEach(b => b.onclick = () => form(list.find(s => s.id === b.dataset.e), false));
  $$('[data-r]').forEach(b => b.onclick = async () => { if (await ask(`Đặt lại mật khẩu của <b>${esc(b.dataset.r)}</b> về mặc định (= Mã HSSV)?`)) { const salt = Math.random().toString(36).slice(2, 10); await DB.patch('users/' + b.dataset.r, {salt, hash: await sha(salt + b.dataset.r)}); toast('Đã đặt lại mật khẩu'); } });
  $$('[data-d]').forEach(b => b.onclick = async () => { if (await ask(`Xóa sinh viên <b>${esc(b.dataset.d)}</b> cùng điểm số, code đã lưu? Không thể hoàn tác.`, 'Xóa')) { await Promise.all([DB.del('users/' + b.dataset.d), DB.del('scores/' + b.dataset.d), DB.del('codes/' + b.dataset.d)]); toast('Đã xóa'); reload(); } });
  $('#seed').onclick = async () => {
    if (!await ask('Nhập 14 sinh viên lớp K19IT từ file Excel mẫu? (Mã đã tồn tại sẽ được bỏ qua)', 'Nhập')) return;
    let i = 0; for (const [id, ho, ten, he, note] of SEED_STUDENTS) { if (!await DB.get('users/' + id)) await DB.set('users/' + id, await makeAccount({role: 'student', ho, ten, name: ho + ' ' + ten, he, note, ord: i}, id)); i++; }
    toast('Đã nhập danh sách'); reload();
  };
  $('#xl').onchange = async e => {
    const f = e.target.files[0]; if (!f) return; await loadXLSX();
    const wb = XLSX.read(await f.arrayBuffer()), rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {header: 1});
    const hi = rows.findIndex(r => r.some(c => /m[ãa]\s*hssv/i.test(String(c)))); if (hi < 0) return toast('Không thấy dòng tiêu đề có "Mã HSSV"');
    const H = rows[hi].map(c => String(c || '').toLowerCase()); const col = re => H.findIndex(c => re.test(c));
    const cid = col(/m[ãa]/), cho = col(/h[ọo] v[àa]|họ/), cten = H.findIndex((c, i) => /^t[êe]n$/.test(c.trim())), che = col(/^h[ệe]$/), cnote = col(/ghi/);
    let n = 0, ord = Date.now() % 1e9;
    for (const r of rows.slice(hi + 1)) { if (!r[cid]) continue; const ok = await upsert({id: String(r[cid]), ho: String(r[cho] || '').trim(), ten: String(r[cten] || '').trim(), he: String(r[che] || ''), note: String(r[cnote] || '')}, false); if (ok) n++; }
    toast(`Đã nhập ${n} dòng`); reload();
  };
});

/* ---------- Bảng điểm ---------- */
route('scores', ['guest', 'student', 'admin'], async () => {
  const [list, scores] = await Promise.all([students(), DB.list('scores')]);
  const edit = isAdmin(), me = S.user && S.user.id;
  const cell = (s, c) => { const v = (scores[s.id] || {})[c.k]; return edit ? `<td class="c"><input class="sc" data-id="${esc(s.id)}" data-k="${c.k}" value="${v ?? ''}" inputmode="decimal"></td>` : `<td class="c">${v ?? ''}</td>`; };
  let mineBox = '';
  if (isStudent()) {
    const sc = scores[me] || {};
    mineBox = `<div class="card"><h3>📌 Điểm của tôi</h3><div class="split"><div>${D.table(COLS.map(c => c.t), [COLS.map(c => sc[c.k] ?? '–')], '')}<p>Điểm trung bình tạm tính: <b>${fmt(average(sc)) || '–'}</b> ${xepLoai(average(sc))}<br><small class="muted">(Hệ số: 15 phút ×1, 1 tiết ×2, thi ×3 – chỉ tính cột đã có điểm)</small></p></div>
    <div>${COLS.some(c => sc[c.k] != null) ? D.bars('Điểm các cột', COLS.map(c => c.t), COLS.map(c => sc[c.k] ?? 0), '') : '<p class="muted">Chưa có điểm.</p>'}</div></div></div>`;
  }
  $('#app').innerHTML = `${mineBox}<div class="row"><h2>📊 Bảng điểm lớp K19IT</h2><span class="sp"></span>${edit ? '<span class="muted">Gõ điểm rồi nhấn ra ngoài/Enter để tự lưu</span> ' : ''}<button class="btn" id="exp">⬇ Xuất Excel</button></div>
    <div class="card tw"><table><tr><th class="c" rowspan="2">STT</th><th rowspan="2">Mã HSSV</th><th rowspan="2">Họ và tên</th><th class="c" colspan="2">15 phút</th><th class="c" colspan="2">1 tiết</th><th class="c" rowspan="2">Thi</th></tr>
    <tr><th class="c">Lần 1</th><th class="c">Lần 2</th><th class="c">Lần 1</th><th class="c">Lần 2</th></tr>
    ${list.map((s, i) => `<tr style="${s.id === me ? 'outline:2px solid var(--pri)' : ''}"><td class="c">${i + 1}</td><td>${esc(s.id)}</td><td>${esc(fullName(s))} ${s.note ? `<span class="tag">${esc(s.note)}</span>` : ''}</td>${COLS.map(c => cell(s, c)).join('')}</tr>`).join('')}</table></div>`;
  $('#exp').onclick = () => saveExcel('BangDiem_K19IT.xlsx', [['Bảng điểm', [['STT', 'Mã HSSV', 'Họ và', 'Tên', ...COLS.map(c => c.t)], ...list.map((s, i) => [i + 1, s.id, s.ho, s.ten, ...COLS.map(c => (scores[s.id] || {})[c.k] ?? '')])]]]).catch(e => toast(e.message));
  if (edit) $$('input.sc').forEach(inp => {
    inp.onkeydown = e => { if (e.key === 'Enter') { const all = $$('input.sc'); const nx = all[all.indexOf(inp) + (e.shiftKey ? -1 : 5)]; inp.blur(); if (nx) nx.focus(); } };
    inp.onchange = async () => {
      const v = num(inp.value);
      if (inp.value.trim() !== '' && (v === null || v < 0 || v > 10)) { inp.style.outline = '2px solid var(--bad)'; return toast('Điểm phải từ 0 đến 10'); }
      inp.style.outline = ''; try { await DB.patch('scores/' + inp.dataset.id, {[inp.dataset.k]: v}); inp.style.background = 'color-mix(in srgb,var(--ok) 25%,transparent)'; setTimeout(() => inp.style.background = '', 700); (scores[inp.dataset.id] ||= {})[inp.dataset.k] = v; } catch (e) { toast(e.message); }
    };
  });
});

/* ---------- Xếp hạng ---------- */
route('rank', ['student', 'admin'], async () => {
  const [list, scores] = await Promise.all([students(), DB.list('scores')]);
  const rows = list.map(s => ({s, avg: average(scores[s.id]), sc: scores[s.id] || {}})).filter(r => r.avg != null).sort((a, b) => b.avg - a.avg);
  let rk = 0, prev = null;
  rows.forEach((r, i) => { if (prev === null || r.avg !== prev) rk = i + 1; r.rank = rk; prev = r.avg; });
  const medal = r => r === 1 ? '🥇' : r === 2 ? '🥈' : r === 3 ? '🥉' : r;
  const top = rows.slice(0, 8);
  $('#app').innerHTML = `<h2>🏆 Bảng xếp hạng điểm của lớp</h2><p class="muted">Xếp theo điểm trung bình có hệ số (15 phút ×1, 1 tiết ×2, thi ×3 – chỉ tính cột đã có điểm). Chỉ hiển thị sinh viên đã có điểm.</p>
  ${top.length ? D.bars('Top ' + top.length + ' điểm trung bình', top.map(r => r.s.ten), top.map(r => Math.round(r.avg * 100) / 100), '') : ''}
  <div class="card tw"><table><tr><th class="c">Hạng</th><th>Họ và tên</th>${COLS.map(c => `<th class="c">${c.t}</th>`).join('')}<th class="c">TB</th><th>Xếp loại</th></tr>
  ${rows.map(r => `<tr style="${S.user && r.s.id === S.user.id ? 'outline:2px solid var(--pri);font-weight:700' : ''}"><td class="c medal">${medal(r.rank)}</td><td>${esc(fullName(r.s))}${S.user && r.s.id === S.user.id ? ' <span class="tag">Bạn</span>' : ''}</td>${COLS.map(c => `<td class="c">${r.sc[c.k] ?? ''}</td>`).join('')}<td class="c"><b>${fmt(r.avg)}</b></td><td>${xepLoai(r.avg)}</td></tr>`).join('') || '<tr><td colspan="9" class="center muted">Chưa có điểm.</td></tr>'}</table></div>`;
});

/* ---------- Điểm danh ---------- */
const ST = {C: ['Có', 'st-co'], V: ['Vắng', 'st-vang'], P: ['Phép', 'st-phep'], T: ['Đi trễ', 'st-tre']};
const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const vnDate = d => d.split('-').reverse().join('/');
route('attendance', ['guest', 'student', 'admin'], async () => {
  const [list, att] = await Promise.all([students(), DB.list('attendance')]);
  const dates = Object.keys(att).sort();
  const count = (id, k) => dates.filter(d => (att[d] || {})[id] === k).length;
  let editor = '';
  if (isAdmin()) {
    editor = `<div class="card"><div class="row"><h3 style="margin:0">✍️ Điểm danh ngày</h3><input type="date" id="dt" value="${today()}"><button class="btn sm" id="allC">Tất cả "Có"</button><span class="sp"></span><button class="btn pri" id="sv">💾 Lưu điểm danh</button><button class="btn" id="delD">🗑 Xóa ngày này</button></div><div class="tw" style="margin-top:10px"><table id="et"></table></div></div>`;
  }
  $('#app').innerHTML = `${editor}<div class="row"><h2>🗓 Danh sách điểm danh</h2><span class="sp"></span><button class="btn" id="exp">⬇ Xuất Excel</button></div>
  <div class="card tw"><table><tr><th class="c">STT</th><th>Họ và tên</th>${dates.map(d => `<th class="c">${vnDate(d).slice(0, 5)}</th>`).join('')}<th class="c st-co">Có</th><th class="c st-vang">Vắng</th><th class="c st-phep">Phép</th><th class="c st-tre">Trễ</th></tr>
  ${list.map((s, i) => `<tr style="${S.user && s.id === S.user.id ? 'outline:2px solid var(--pri)' : ''}"><td class="c">${i + 1}</td><td>${esc(fullName(s))}</td>${dates.map(d => { const v = (att[d] || {})[s.id]; return `<td class="c ${v ? ST[v][1] : ''}" title="${v ? ST[v][0] : ''}">${v || ''}</td>`; }).join('')}${['C', 'V', 'P', 'T'].map(k => `<td class="c">${count(s.id, k)}</td>`).join('')}</tr>`).join('')}</table></div>
  <p class="muted">Ký hiệu: <b class="st-co">C</b> = Có, <b class="st-vang">V</b> = Vắng, <b class="st-phep">P</b> = Phép, <b class="st-tre">T</b> = Đi trễ. Tổng ${dates.length} buổi đã điểm danh.</p>`;
  $('#exp').onclick = () => saveExcel('DiemDanh_K19IT.xlsx', [['Điểm danh', [['STT', 'Mã HSSV', 'Họ và tên', ...dates.map(vnDate), 'Có', 'Vắng', 'Phép', 'Trễ'], ...list.map((s, i) => [i + 1, s.id, fullName(s), ...dates.map(d => ((att[d] || {})[s.id] ? ST[att[d][s.id]][0] : '')), ...['C', 'V', 'P', 'T'].map(k => count(s.id, k))])]]]).catch(e => toast(e.message));
  if (!isAdmin()) return;
  const draw = () => {
    const d = $('#dt').value, cur = att[d] || {};
    $('#et').innerHTML = `<tr><th class="c">STT</th><th>Họ và tên</th>${Object.entries(ST).map(([k, v]) => `<th class="c ${v[1]}">${v[0]}</th>`).join('')}</tr>` +
      list.map((s, i) => `<tr><td class="c">${i + 1}</td><td>${esc(fullName(s))} ${s.note ? `<span class="tag">${esc(s.note)}</span>` : ''}</td>${Object.keys(ST).map(k => `<td class="c"><input type="radio" name="a_${esc(s.id)}" value="${k}" ${cur[s.id] === k ? 'checked' : ''}></td>`).join('')}</tr>`).join('');
    $('#delD').style.display = att[d] ? '' : 'none';
  };
  draw(); $('#dt').onchange = draw;
  $('#allC').onclick = () => $$('#et input[value="C"]').forEach(r => r.checked = true);
  $('#sv').onclick = async () => {
    const d = $('#dt').value; if (!d) return toast('Chọn ngày');
    const data = {}; list.forEach(s => { const r = $(`#et input[name="a_${CSS.escape(s.id)}"]:checked`); if (r) data[s.id] = r.value; });
    if (!Object.keys(data).length) return toast('Chưa chọn trạng thái nào');
    await DB.set('attendance/' + d, data); toast('Đã lưu điểm danh ngày ' + vnDate(d)); router();
  };
  $('#delD').onclick = async () => { const d = $('#dt').value; if (await ask(`Xóa điểm danh ngày ${vnDate(d)}?`, 'Xóa')) { await DB.del('attendance/' + d); router(); } };
});

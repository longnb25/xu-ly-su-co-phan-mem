/* ===== Lõi: Firebase REST, xác thực, giao diện chung, router ===== */
const FB = 'https://tengicungduoc-b0965-default-rtdb.firebaseio.com';
const ROOT = 'k19it';
const DB = {
  async req(method, path, body) {
    const r = await fetch(`${FB}/${ROOT}/${path}.json`, {method, headers: body !== undefined ? {'Content-Type': 'application/json'} : undefined, body: body !== undefined ? JSON.stringify(body) : undefined});
    if (!r.ok) throw new Error('Lỗi kết nối Firebase (' + r.status + ')');
    const j = await r.json();
    if (j && j.error) throw new Error(j.error);
    return j;
  },
  get: p => DB.req('GET', p), set: (p, v) => DB.req('PUT', p, v), patch: (p, v) => DB.req('PATCH', p, v), del: p => DB.req('DELETE', p),
  async list(p) { const o = await DB.get(p); return o || {}; }
};
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const keyOf = s => String(s).trim().replace(/[.#$\[\]\/]/g, '_');
const fullName = u => ((u.ho || '') + ' ' + (u.ten || '')).trim() || u.name || '';

async function sha(txt) {
  try {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(txt));
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
  } catch (e) { let h = 5381; for (const c of txt) h = ((h << 5) + h + c.charCodeAt(0)) >>> 0; return 'x' + h.toString(16); }
}
async function makeAccount(rec, pw) {
  const salt = Math.random().toString(36).slice(2, 10);
  return {...rec, salt, hash: await sha(salt + pw)};
}

/* ----- Trạng thái ----- */
const S = {user: null};
try { S.user = JSON.parse(localStorage.getItem('vb_user') || 'null'); } catch (e) {}
const role = () => S.user ? S.user.role : 'guest';
const isAdmin = () => role() === 'admin';
const isStudent = () => role() === 'student';
const isGuest = () => role() === 'guest' ;

/* ----- Theme ----- */
function setTheme(t) { document.documentElement.setAttribute('data-theme', t); try { localStorage.setItem('vb_theme', t); } catch (e) {} $$('#seg button').forEach(b => b.classList.toggle('on', b.dataset.t === t)); }
setTheme((() => { try { return localStorage.getItem('vb_theme') || 'light'; } catch (e) { return 'light'; } })());

/* ----- Tiện ích UI ----- */
function toast(msg, ms = 2400) { const d = document.createElement('div'); d.className = 'toast'; d.textContent = msg; document.body.appendChild(d); setTimeout(() => d.remove(), ms); }
function modal(html, onMount) {
  const m = document.createElement('div'); m.className = 'modal'; m.innerHTML = `<div>${html}</div>`;
  m.addEventListener('mousedown', e => { if (e.target === m) m.remove(); }); document.body.appendChild(m);
  m.close = () => m.remove(); if (onMount) onMount(m); return m;
}
function ask(msg, okText = 'Đồng ý') {
  return new Promise(res => { const m = modal(`<p>${msg}</p><div class="row" style="justify-content:flex-end"><button class="btn" id="n">Hủy</button><button class="btn bad" id="y">${okText}</button></div>`);
    $('#n', m).onclick = () => { m.close(); res(false); }; $('#y', m).onclick = () => { m.close(); res(true); }; });
}
const loading = () => { $('#app').innerHTML = '<div class="card center muted">Đang tải dữ liệu…</div>'; };
const num = v => { if (v === '' || v == null) return null; const n = parseFloat(String(v).replace(',', '.')); return isNaN(n) ? null : n; };
const fmt = v => v == null ? '' : (Math.round(v * 100) / 100).toString();
function download(name, text, type = 'text/plain') { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], {type})); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }
let xlsxLoading;
function loadXLSX() {
  if (window.XLSX) return Promise.resolve();
  return xlsxLoading || (xlsxLoading = new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'; s.onload = res; s.onerror = () => rej(new Error('Không tải được thư viện Excel (kiểm tra mạng)')); document.head.appendChild(s); }));
}
async function saveExcel(name, sheets) {
  await loadXLSX(); const wb = XLSX.utils.book_new();
  for (const [t, rows] of sheets) { const ws = XLSX.utils.aoa_to_sheet(rows); ws['!cols'] = rows[0].map((_, i) => ({wch: Math.max(8, ...rows.map(r => String(r[i] ?? '').length)) + 2})); XLSX.utils.book_append_sheet(wb, ws, t); }
  XLSX.writeFile(wb, name);
}
/* Markdown rút gọn cho học liệu do admin tạo */
function md(src) {
  const parts = String(src || '').split(/```/); let out = '';
  parts.forEach((p, i) => {
    if (i % 2) { out += `<pre><code>${esc(p.replace(/^[a-z]*\n/, ''))}</code></pre>`; return; }
    let t = esc(p).replace(/!\[([^\]]*)\]\((https?:[^)\s]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px">')
      .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>');
    t = t.split(/\n{2,}/).map(b => {
      if (/^#{1,3} /.test(b)) return b.replace(/^(#{1,3}) (.*)$/m, (m, h, x) => `<h${h.length + 1}>${x}</h${h.length + 1}>`);
      if (/^\s*[-*] /.test(b)) return '<ul>' + b.split('\n').map(l => `<li>${l.replace(/^\s*[-*] /, '')}</li>`).join('') + '</ul>';
      return b.trim() ? `<p>${b.replace(/\n/g, '<br>')}</p>` : '';
    }).join(''); out += t;
  });
  return out;
}

/* ----- Điểm ----- */
function average(sc) {
  if (!sc) return null; let s = 0, w = 0;
  for (const c of COLS) { const v = sc[c.k]; if (v != null && v !== '') { s += v * c.w; w += c.w; } }
  return w ? s / w : null;
}
const xepLoai = d => d == null ? '' : d >= 8 ? 'Giỏi' : d >= 6.5 ? 'Khá' : d >= 5 ? 'Trung bình' : 'Yếu';
async function students() {
  const u = await DB.list('users');
  return Object.entries(u).filter(([, v]) => v.role === 'student').map(([id, v]) => ({id, ...v})).sort((a, b) => (a.ord ?? 999) - (b.ord ?? 999) || a.ten.localeCompare(b.ten, 'vi'));
}

/* ----- Router & khung trang ----- */
const ROUTES = {};
function route(path, roles, fn) { ROUTES[path] = {roles, fn}; }
const IC = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>', book: '<path d="M4 4h6a3 3 0 013 3v13a2 2 0 00-2-2H4z"/><path d="M20 4h-6a3 3 0 00-3 3"/><path d="M20 4v14h-7"/>',
  folder: '<path d="M3 6a2 2 0 012-2h4l2 3h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>', code: '<path d="M8 8l-5 4 5 4"/><path d="M16 8l5 4-5 4"/><path d="M14 5l-4 14"/>',
  quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 114 2c-.9.7-1.5 1.2-1.5 2.5"/><path d="M12 17.5v.01"/>', flask: '<path d="M9 3h6"/><path d="M10 3v6L4.5 19a1.5 1.5 0 001.3 2.2h12.4a1.5 1.5 0 001.3-2.2L14 9V3"/><path d="M7.5 15h9"/>',
  chart: '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/>', trophy: '<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 01-10 0z"/><path d="M17 5h3v2a3 3 0 01-3 3"/><path d="M7 5H4v2a3 3 0 003 3"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M8 15l2.5 2.5L16 13"/>', users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><path d="M16 4.5a3.5 3.5 0 010 7"/><path d="M18 14a6 6 0 013.5 6"/>'
};
const isOn = (h, cur) => h === '#/' ? cur === '#/' : (cur === h || cur.startsWith(h + '/') || cur.startsWith(h.slice(0, -1) + '/'));
const icon = k => `<svg viewBox="0 0 24 24">${IC[k]}</svg>`;
const NAV = [
  ['Tổng quan', '#/', 'Trang chủ', 'home', ['guest', 'student', 'admin']],
  ['Học tập', '#/lessons', 'Bài học 18 buổi', 'book', ['student', 'admin']],
  ['', '#/materials', 'Học liệu', 'folder', ['student', 'admin']],
  ['', '#/ide', 'Lập trình C', 'code', ['student', 'admin']],
  ['Kiểm tra', '#/quizzes', 'Trắc nghiệm', 'quiz', ['student', 'admin']],
  ['', '#/labs', 'Thực hành', 'flask', ['student', 'admin']],
  ['Lớp học', '#/scores', 'Bảng điểm', 'chart', ['guest', 'student', 'admin']],
  ['', '#/rank', 'Xếp hạng', 'trophy', ['student', 'admin']],
  ['', '#/attendance', 'Điểm danh', 'cal', ['guest', 'student', 'admin']],
  ['Quản trị', '#/students', 'Sinh viên', 'users', ['admin']]
];
function renderShell() {
  const r = role(), cur = location.hash || '#/';
  $('#nav').innerHTML = NAV.filter(n => n[4].includes(r)).map(n => `${n[0] ? `<div class="navg">${n[0]}</div>` : ''}<a href="${n[1]}" class="${isOn(n[1], cur) ? 'on' : ''}">${icon(n[3])}${n[2]}</a>`).join('');
  const pg = NAV.find(n => n[1] !== '#/' && cur.startsWith(n[1])) || NAV[0]; const lessonLike = /^#\/(lesson|material|quiz|lab)\//.test(cur);
  $('#crumb').innerHTML = `${esc(cur === '#/login' ? 'Đăng nhập' : (lessonLike ? ({lesson: 'Bài học', material: 'Học liệu', quiz: 'Trắc nghiệm', lab: 'Thực hành'})[cur.split('/')[1]] : pg[2]))}<small>XỬ LÍ SỰ CỐ PHẦN MỀM · Lập trình C</small>`;
  $('#side').classList.remove('open');
  const ini = S.user ? (S.user.name || '?').trim().split(' ').pop()[0].toUpperCase() : '👤';
  $('#who').innerHTML = S.user
    ? `<div class="user"><div class="av">${isAdmin() ? '★' : esc(ini)}</div><span class="n">${isAdmin() ? 'Admin' : esc(S.user.name)}</span></div><button class="btn sm" id="hdrPw" title="Đổi mật khẩu">🔑</button><button class="btn sm" id="hdrOut">Thoát</button>`
    : `<div class="user"><div class="av">👤</div><span class="n">Khách</span></div><a class="btn pri sm" href="#/login">Đăng nhập</a>`;
  if (S.user) { $('#hdrPw').onclick = changePw; $('#hdrOut').onclick =() => { S.user = null; localStorage.removeItem('vb_user'); location.hash = '#/login'; }; }
}
async function router() {
  const hash = location.hash || '#/';
  if (hash === '#/login') { renderShell(); return viewLogin(); }
  const seg = hash.split('/'); const key = seg[1] || ''; const rt = ROUTES[key];
  renderShell();
  if (!rt) { $('#app').innerHTML = '<div class="card">Không tìm thấy trang. <a href="#/">Về trang chủ</a></div>'; return; }
  if (!rt.roles.includes(role())) { $('#app').innerHTML = `<div class="card warn note">Bạn cần đăng nhập với quyền phù hợp để xem trang này. <a href="#/login">Đăng nhập</a></div>`; return; }
  window.scrollTo(0, 0); loading();
  try { await rt.fn(decodeURIComponent(seg.slice(2).join('/'))); if (window.revealAll) revealAll(); }
  catch (e) { console.error(e); $('#app').innerHTML = `<div class="card note warn"><b>Có lỗi:</b> ${esc(e.message)}<br><small>Kiểm tra kết nối mạng và Firebase (Rules đã mở read/write chưa).</small></div>`; }
}
window.addEventListener('hashchange', router);

async function changePw() {
  const m = modal(`<h3>Đổi mật khẩu</h3><label>Mật khẩu hiện tại</label><input type="password" id="p0"><label>Mật khẩu mới (≥ 4 ký tự)</label><input type="password" id="p1"><div class="row" style="margin-top:14px;justify-content:flex-end"><button class="btn" id="c">Hủy</button><button class="btn pri" id="s">Lưu</button></div>`);
  $('#c', m).onclick = m.close;
  $('#s', m).onclick = async () => {
    const u = await DB.get('users/' + S.user.id); const p0 = $('#p0', m).value, p1 = $('#p1', m).value;
    if (await sha(u.salt + p0) !== u.hash) return toast('Mật khẩu hiện tại sai');
    if (p1.length < 4) return toast('Mật khẩu mới quá ngắn');
    const salt = Math.random().toString(36).slice(2, 10); await DB.patch('users/' + S.user.id, {salt, hash: await sha(salt + p1)}); m.close(); toast('Đã đổi mật khẩu');
  };
}

/* ----- Đăng nhập ----- */
async function ensureAdmin() {
  let a = await DB.get('users/admin');
  if (!a) { await DB.set('users/admin', await makeAccount({role: 'admin', name: 'Giảng viên', ho: 'Giảng', ten: 'viên'}, 'admin123')); }
}
async function viewLogin() {
  $('#app').innerHTML = `<div class="card" style="max-width:420px;margin:30px auto">
    <h2 class="center">Đăng nhập</h2><p class="muted center">Sinh viên: tài khoản & mật khẩu mặc định là <b>Mã HSSV</b>.</p>
    <label>Tài khoản</label><input id="u" style="width:100%" placeholder="VD: 190CIT0321 hoặc admin" autofocus>
    <label style="margin-top:8px;display:block">Mật khẩu</label><input id="p" type="password" style="width:100%">
    <div class="row" style="margin-top:14px"><button class="btn pri sp" id="go">Đăng nhập</button><button class="btn" id="gst">Vào xem với tư cách Khách</button></div><div id="msg" class="muted center" style="margin-top:10px"></div></div>`;
  $('#gst').onclick = () => { S.user = null; localStorage.removeItem('vb_user'); location.hash = '#/'; };
  const go = async () => {
    const msg = $('#msg'); msg.textContent = 'Đang kiểm tra…';
    try {
      await ensureAdmin();
      let id = $('#u').value.trim(); id = id.toLowerCase() === 'admin' ? 'admin' : keyOf(id.toUpperCase());
      const u = id ? await DB.get('users/' + id) : null;
      if (!u || await sha(u.salt + $('#p').value) !== u.hash) { msg.textContent = '❌ Sai tài khoản hoặc mật khẩu'; return; }
      S.user = {id, role: u.role, name: fullName(u)}; localStorage.setItem('vb_user', JSON.stringify(S.user)); location.hash = '#/';
    } catch (e) { msg.textContent = '⚠ ' + e.message; }
  };
  $('#go').onclick = go; $('#p').onkeydown = e => { if (e.key === 'Enter') go(); }; $('#u').onkeydown = e => { if (e.key === 'Enter') $('#p').focus(); };
}

/* ----- Trang chủ ----- */
const lessonCard = l => `<a class="card lcard" href="#/lesson/${l.n}"><div class="num">${String(l.n).padStart(2, '0')}</div><h3>Buổi ${l.n}</h3><b>${esc(l.title)}</b><p class="muted" style="margin:8px 0 10px;font-size:13.5px">${esc(l.sub.split('·')[0])}</p><span class="tag">⏱ 3 giờ</span> ${l.test ? `<span class="tag ${l.test === '15p' ? 'k15' : 'k1t'}">📝 KT ${l.test}</span>` : ''}</a>`;
const qk = (href, ic, t, d) => `<a class="card lcard qk" href="${href}"><div class="ic">${icon(ic)}</div><div><b>${t}</b><p class="muted" style="margin:3px 0 0;font-size:13.5px">${d}</p></div></a>`;
route('', ['guest', 'student', 'admin'], async () => {
  let mine = '';
  if (isStudent()) {
    const sc = await DB.get('scores/' + S.user.id) || {}; const avg = average(sc);
    mine = `<div class="card"><h3>📌 Điểm của bạn</h3><div class="row">${COLS.map(c => `<div class="tag" style="font-size:14px;padding:7px 16px">${c.t}: <b>${sc[c.k] ?? '–'}</b></div>`).join('')}<div class="tag" style="font-size:14px;padding:7px 16px;background:var(--grad);color:#fff;border:0">TB tạm tính: <b>${avg == null ? '–' : fmt(avg)}</b> ${xepLoai(avg)}</div></div></div>`;
  }
  const code = `<span class="pp">#include</span> <span class="st">&lt;stdio.h&gt;</span>\n\n<span class="ty">int</span> main() {\n    <span class="kw">for</span> (<span class="ty">int</span> i = <span class="nm">1</span>; i &lt;= <span class="nm">3</span>; i++)\n        printf(<span class="st">"Buoi %d\\n"</span>, i);\n    <span class="kw">return</span> <span class="nm">0</span>;\n}<span class="cursor"></span>`;
  $('#app').innerHTML = `<section class="hero"><div><span class="badge">LẬP TRÌNH C · 18 BUỔI · K19IT</span><h1>XỬ LÍ SỰ CỐ<br>PHẦN MỀM</h1>
    <p>Học lập trình C từ con số 0: lý thuyết trực quan, ví dụ chạy ngay trên trình duyệt, bài tập thực tế và chấm điểm tự động.</p>
    <p style="margin-top:14px">${S.user ? `Xin chào, <b>${esc(S.user.name)}</b> 👋` : 'Bạn đang xem với tư cách khách (chỉ xem điểm & điểm danh).'}</p>
    <div class="stats"><div class="stat"><b>18</b><small>buổi học</small></div><div class="stat"><b>${DEFAULT_QUIZZES.length}+</b><small>đề trắc nghiệm</small></div><div class="stat"><b>${DEFAULT_LABS.length}</b><small>bài thực hành</small></div><div class="stat"><b>C</b><small>chạy trên web</small></div></div></div>
    <div class="win"><div class="dots"><i></i><i></i><i></i><span>main.c</span></div><pre>${code}</pre></div></section>${mine}
    ${isGuest() ? `<div class="grid">${qk('#/scores', 'chart', 'Bảng điểm', 'Xem điểm 15 phút, 1 tiết, thi của cả lớp.')}${qk('#/attendance', 'cal', 'Điểm danh', 'Xem danh sách điểm danh theo ngày.')}${qk('#/login', 'users', 'Đăng nhập', 'Sinh viên đăng nhập để học & làm bài.')}</div>` : `
    <h2 class="sec">🚀 Truy cập nhanh</h2><div class="grid">${qk('#/ide', 'code', 'Lập trình C', 'Soạn, chạy, lưu code C như Dev-C++.')}${qk('#/quizzes', 'quiz', 'Trắc nghiệm', 'Kiểm tra 15 phút & 1 tiết.')}${qk('#/labs', 'flask', 'Thực hành', 'Bài tập code chấm tự động.')}${qk('#/rank', 'trophy', 'Xếp hạng', 'Bảng xếp hạng điểm của lớp.')}</div>
    <h2 class="sec">📚 Lộ trình 18 buổi</h2><div class="lesson-grid">${LESSONS.map(lessonCard).join('')}</div>`}`;
});

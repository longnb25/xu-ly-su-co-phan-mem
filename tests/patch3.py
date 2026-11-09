def edit(path, pairs):
    s = open(path, encoding='utf-8').read()
    for a, b in pairs:
        assert a in s, a[:60]
        s = s.replace(a, b, 1)
    open(path, 'w', encoding='utf-8').write(s)

# 1) Lịch dạy: Thứ 3 + Thứ 4, từ tuần 09/11/2026, 18 buổi
edit('js/data.js', [("const SAMPLE_CODE", """/* Lịch dạy: Thứ 3 và Thứ 4 hằng tuần, bắt đầu tuần 09/11/2026 (18 buổi) */
const SCHEDULE = (() => {
  const out = [], iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  for (let w = 0; out.length < 18; w++) for (const off of [1, 2]) { if (out.length >= 18) break; const d = new Date(2026, 10, 9 + w * 7 + off); out.push({n: out.length + 1, date: iso(d), wd: d.getDay() === 2 ? 'Thứ 3' : 'Thứ 4'}); }
  return out;
})();
const schedOf = date => SCHEDULE.find(x => x.date === date);

const SAMPLE_CODE""")])

# 2) Điểm danh: cột = ngày theo lịch + ngày đã lưu; chọn nhanh buổi
edit('js/admin.js', [
 ("const dates = Object.keys(att).sort();",
  "const dates = [...new Set([...Object.keys(att), ...SCHEDULE.map(x => x.date)])].sort();\n  const dlabel = d => { const s = schedOf(d); return s ? `<small>${s.wd === 'Thứ 3' ? 'T3' : 'T4'}</small><br>${vnDate(d).slice(0, 5)}<br><small>B${s.n}</small>` : vnDate(d).slice(0, 5); };"),
 ("${dates.map(d => `<th class=\"c\">${vnDate(d).slice(0, 5)}</th>`).join('')}", "${dates.map(d => `<th class=\"c\" style=\"line-height:1.2\">${dlabel(d)}</th>`).join('')}"),
 ("<input type=\"date\" id=\"dt\" value=\"${today()}\">",
  "<select id=\"ss\" title=\"Chọn nhanh theo lịch dạy\"><option value=\"\">Chọn buổi…</option>${SCHEDULE.map(x => `<option value=\"${x.date}\">Buổi ${x.n} · ${x.wd} ${vnDate(x.date)}${att[x.date] ? ' ✔' : ''}</option>`).join('')}</select><input type=\"date\" id=\"dt\" value=\"${defaultDate()}\">"),
 ("draw(); $('#dt').onchange = draw;", "draw(); $('#dt').onchange = () => { $('#ss').value = schedOf($('#dt').value) ? $('#dt').value : ''; draw(); }; $('#ss').onchange = e => { if (e.target.value) { $('#dt').value = e.target.value; draw(); } }; $('#ss').value = schedOf($('#dt').value) ? $('#dt').value : '';"),
 ("const vnDate = d => d.split('-').reverse().join('/');",
  "const vnDate = d => d.split('-').reverse().join('/');\nconst defaultDate = () => { const t = today(); if (schedOf(t)) return t; const nx = SCHEDULE.find(x => x.date >= t); return nx ? nx.date : SCHEDULE[SCHEDULE.length - 1].date; };"),
 ("  $('#exp').onclick = () => saveExcel('DiemDanh_K19IT.xlsx'", "  $('#exp').onclick = () => saveExcel('DiemDanh_K19IT.xlsx'"),
])

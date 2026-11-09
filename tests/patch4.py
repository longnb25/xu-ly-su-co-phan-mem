def edit(path, pairs):
    s = open(path, encoding='utf-8').read()
    for a, b in pairs:
        assert a in s, a[:60]
        s = s.replace(a, b, 1)
    open(path, 'w', encoding='utf-8').write(s)

edit('js/learn.js', [("BUỔI ${l.n} / 18 · 3 GIỜ (LÝ THUYẾT + THỰC HÀNH)", "BUỔI ${l.n} / 18 · ${schedOf0(l.n)} · 3 GIỜ")])
edit('js/data.js', [("const schedOf = ", "const schedOf0 = n => { const s = SCHEDULE[n - 1]; return s ? s.wd.toUpperCase() + ' ' + s.date.split('-').reverse().join('/') : ''; };\nconst schedOf = ")])
edit('js/admin.js', [("Tổng ${dates.length} buổi đã điểm danh.</p>`;",
 "Đã điểm danh ${Object.keys(att).length}/${SCHEDULE.length} buổi theo lịch.</p>\n  <div class=\"card\"><h3>📅 Lịch dạy: Thứ 3 &amp; Thứ 4 hằng tuần (18 buổi)</h3><div class=\"grid\" style=\"grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px\">${SCHEDULE.map(x => { const l = LESSONS[x.n - 1]; return `<div class=\"ex\" style=\"margin:0;flex-direction:column;gap:2px\"><div><b>Buổi ${x.n}</b> · ${x.wd} ${vnDate(x.date)} ${att[x.date] ? '<span class=\"st-co\">✔</span>' : ''}</div><small class=\"muted\">${esc(l.title)}${l.test ? ' · KT ' + l.test : ''}</small></div>`; }).join('')}</div></div>`;")])

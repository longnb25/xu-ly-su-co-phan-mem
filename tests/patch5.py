p = 'js/admin.js'
L = open(p, encoding='utf-8').read().split('\n')
assert L[98].lstrip().startswith('const dlabel')
L[98] = "  const dlabel = d => { const s = schedOf(d); return s ? `<span class=\"dw ${s.wd === 'Thứ 3' ? 't3' : 't4'}\">${s.wd}</span><span class=\"dd\">${vnDate(d).slice(0, 5)}</span><span class=\"db\">Buổi ${s.n}</span>` : `<span class=\"dd\">${vnDate(d).slice(0, 5)}</span>`; };\n  const tdy = today();"
# dòng 106-107 (chỉ số 105,106 -> sau khi chèn thêm 1 dòng ở trên là 106,107)
i = next(k for k, l in enumerate(L) if l.startswith('  <div class="card tw"><table><tr><th class="c">STT</th><th>Họ và tên</th>'))
L[i] = ("  <div class=\"card tw att\"><table><tr><th class=\"c\">STT</th><th>Họ và tên</th>"
        "<th class=\"c st-co\" title=\"Có mặt\">Có</th><th class=\"c st-vang\" title=\"Vắng\">Vắng</th><th class=\"c st-phep\" title=\"Phép\">Phép</th><th class=\"c st-tre\" title=\"Đi trễ\">Trễ</th>"
        "${dates.map(d => `<th class=\"c dh ${d === tdy ? 'today' : ''}\">${dlabel(d)}</th>`).join('')}</tr>")
L[i + 1] = ("  ${list.map((s, i) => `<tr class=\"${S.user && s.id === S.user.id ? 'me' : ''}\"><td class=\"c\">${i + 1}</td><td class=\"nm\">${esc(fullName(s))}${s.note ? ` <span class=\"tag\">${esc(s.note)}</span>` : ''}</td>"
            "${['C', 'V', 'P', 'T'].map(k => `<td class=\"c cnt\">${count(s.id, k) || '<span class=\"muted\">0</span>'}</td>`).join('')}"
            "${dates.map(d => { const v = (att[d] || {})[s.id]; return `<td class=\"c ${d === tdy ? 'today' : ''}\" title=\"${v ? ST[v][0] : ''}\">${v ? `<span class=\"chip ${v}\">${v}</span>` : '<span class=\"dot\">·</span>'}</td>`; }).join('')}</tr>`).join('')}</table></div>")
open(p, 'w', encoding='utf-8').write('\n'.join(L))

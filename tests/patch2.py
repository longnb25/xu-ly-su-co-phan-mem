p = 'js/learn.js'
s = open(p, encoding='utf-8').read()
def rep(a, b):
    global s
    assert a in s, a[:50]
    s = s.replace(a, b, 1)
rep('<div class="card"><h3>🎯 Mục tiêu</h3>', '<div class="lgrid"><div class="lmain">\n  <div class="card" id="s-goal"><h3>🎯 Mục tiêu</h3>')
rep('<div class="card lessonbody"><h2>📖 Lý thuyết</h2>', '<div class="card lessonbody" id="s-theory"><h2>📖 Lý thuyết</h2>')
rep('<div class="card"><h2>💡 Ví dụ minh họa', '<div class="card" id="s-code"><h2>💡 Ví dụ minh họa')
rep('<div class="card"><h2>🛠 Bài tập thực tế</h2>', '<div class="card" id="s-ex"><h2>🛠 Bài tập thực tế</h2>')
tail = "</div>` : ''}`;"
i = s.index("Học liệu bổ sung của giảng viên")
j = s.index(tail, i) + len(tail)
new_tail = ("</div></div>` : ''}</div>\n"
  "  <aside class=\"toc\"><b>Nội dung buổi ${l.n}</b><a href=\"#\" data-s=\"s-goal\">🎯 Mục tiêu</a><a href=\"#\" data-s=\"s-theory\">📖 Lý thuyết</a><a href=\"#\" data-s=\"s-code\">💡 Ví dụ (${l.codes.length})</a><a href=\"#\" data-s=\"s-ex\">🛠 Bài tập (${l.ex.length})</a></aside></div>`;\n"
  "  initAnims($('#app'));\n"
  "  $$('.toc a').forEach(a => a.onclick = e => { e.preventDefault(); document.getElementById(a.dataset.s).scrollIntoView({behavior: 'smooth', block: 'start'}); });")
s = s[:j - len(tail)] + new_tail + s[j:]
open(p, 'w', encoding='utf-8').write(s)

/* Bộ vẽ sơ đồ/đồ thị SVG dùng trong học liệu (tự đổi màu theo theme) */
const D = (() => {
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const wrap = (svg, cap) => `<div class="diag">${svg}${cap ? `<div class="cap">${esc(cap)}</div>` : ''}</div>`;
  const C = {st: 'var(--pri)', tx: 'var(--tx)', bg: 'var(--bg2)', ok: 'var(--ok)', bad: 'var(--bad)', acc: 'var(--acc)', mut: 'var(--tx2)'};
  const defs = `<defs><marker id="ar" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="${C.st}"/></marker></defs>`;
  /* Lưu đồ dọc: steps = [{t, k:'start'|'io'|'proc'|'dec', yes:'..', no:'..'}] */
  function flow(steps, cap) {
    const W = 340, H = steps.length * 74 + 20; let g = '';
    steps.forEach((s, i) => {
      const y = 14 + i * 74, cx = 150, k = s.k || 'proc';
      if (i < steps.length - 1) g += `<line x1="${cx}" y1="${y + 46}" x2="${cx}" y2="${y + 72}" stroke="${C.st}" stroke-width="2" marker-end="url(#ar)"/>`;
      if (k === 'start') g += `<rect x="${cx - 70}" y="${y}" width="140" height="42" rx="21" fill="${C.st}"/><text x="${cx}" y="${y + 26}" text-anchor="middle" fill="#fff" font-weight="700" font-size="14">${esc(s.t)}</text>`;
      else if (k === 'io') g += `<polygon points="${cx - 60},${y + 42} ${cx - 45},${y} ${cx + 75},${y} ${cx + 60},${y + 42}" fill="${C.bg}" stroke="${C.st}" stroke-width="2"/><text x="${cx + 7}" y="${y + 26}" text-anchor="middle" fill="${C.tx}" font-size="13">${esc(s.t)}</text>`;
      else if (k === 'dec') g += `<polygon points="${cx},${y - 4} ${cx + 100},${y + 21} ${cx},${y + 46} ${cx - 100},${y + 21}" fill="${C.bg}" stroke="${C.acc}" stroke-width="2"/><text x="${cx}" y="${y + 26}" text-anchor="middle" fill="${C.tx}" font-size="13" font-weight="700">${esc(s.t)}</text>` +
        (s.yes ? `<text x="${cx + 108}" y="${y + 16}" fill="${C.ok}" font-size="12" font-weight="700">Đúng: ${esc(s.yes)}</text>` : '') + (s.no ? `<text x="${cx + 108}" y="${y + 34}" fill="${C.bad}" font-size="12" font-weight="700">Sai: ${esc(s.no)}</text>` : '');
      else g += `<rect x="${cx - 70}" y="${y}" width="140" height="42" rx="6" fill="${C.bg}" stroke="${C.st}" stroke-width="2"/><text x="${cx}" y="${y + 26}" text-anchor="middle" fill="${C.tx}" font-size="13">${esc(s.t)}</text>`;
    });
    return wrap(`<svg viewBox="0 0 ${W + 120} ${H}" width="${W + 120}" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,sans-serif">${defs}${g}</svg>`, cap);
  }
  /* Ô nhớ: vars = [{n:'tuoi', v:20, t:'int', a:'0x1000'}] */
  function mem(vars, cap) {
    const h = vars.map(v => `<div style="min-width:90px"><i>${esc(v.t || '')} ${esc(v.n || '')}</i>${esc(v.v)}<i>${esc(v.a || '')}</i></div>`).join('');
    return wrap(`<div class="boxes">${h}</div>`, cap);
  }
  /* Mảng 1 chiều */
  function arr(vals, name, hl, cap) {
    hl = hl || [];
    const h = vals.map((v, i) => `<div class="${hl.includes(i) ? 'hl' : ''}"><i>${esc(name || 'a')}[${i}]</i>${esc(v)}</div>`).join('');
    return wrap(`<div class="boxes">${h}</div>`, cap);
  }
  /* Mảng 2 chiều */
  function grid(m, name, cap) {
    let h = '<table style="width:auto;margin:auto"><tr><th></th>' + m[0].map((_, j) => `<th class="c">[${j}]</th>`).join('') + '</tr>';
    m.forEach((r, i) => { h += `<tr><th>[${i}]</th>` + r.map((v, j) => `<td class="c"><b>${esc(v)}</b><br><small class="muted">${name || 'a'}[${i}][${j}]</small></td>`).join('') + '</tr>'; });
    return wrap(h + '</table>', cap);
  }
  /* Đồ thị cột */
  function bars(title, labels, vals, cap, unit) {
    const W = 520, H = 250, L = 46, B = 40, mx = Math.max(...vals) * 1.15 || 1, bw = (W - L - 20) / vals.length;
    let g = `<text x="${W / 2}" y="18" text-anchor="middle" fill="${C.tx}" font-weight="700" font-size="14">${esc(title)}</text>`;
    for (let i = 0; i <= 4; i++) { const y = H - B - (H - B - 30) * i / 4; g += `<line x1="${L}" x2="${W - 10}" y1="${y}" y2="${y}" stroke="${C.mut}" stroke-opacity=".25"/><text x="${L - 6}" y="${y + 4}" text-anchor="end" fill="${C.mut}" font-size="11">${Math.round(mx * i / 4 * 10) / 10}</text>`; }
    vals.forEach((v, i) => {
      const h = (H - B - 30) * v / mx, x = L + i * bw + bw * .15;
      g += `<rect x="${x}" y="${H - B - h}" width="${bw * .7}" height="${h}" rx="4" fill="${C.st}" opacity=".9"/><text x="${x + bw * .35}" y="${H - B - h - 5}" text-anchor="middle" fill="${C.tx}" font-size="12" font-weight="700">${v}${unit || ''}</text><text x="${x + bw * .35}" y="${H - B + 16}" text-anchor="middle" fill="${C.tx}" font-size="11">${esc(labels[i])}</text>`;
    });
    return wrap(`<svg viewBox="0 0 ${W} ${H}" width="${W}" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,sans-serif">${g}</svg>`, cap);
  }
  /* Đồ thị đường: series = [{name, pts:[y...]}] */
  function line(title, xs, series, cap) {
    const W = 520, H = 260, L = 46, B = 40, all = series.flatMap(s => s.pts), mx = Math.max(...all) * 1.1 || 1, cols = [C.st, C.bad, C.ok, C.acc];
    const px = i => L + (W - L - 20) * i / Math.max(1, xs.length - 1), py = v => H - B - (H - B - 34) * v / mx;
    let g = `<text x="${W / 2}" y="18" text-anchor="middle" fill="${C.tx}" font-weight="700" font-size="14">${esc(title)}</text>`;
    for (let i = 0; i <= 4; i++) { const y = H - B - (H - B - 34) * i / 4; g += `<line x1="${L}" x2="${W - 10}" y1="${y}" y2="${y}" stroke="${C.mut}" stroke-opacity=".25"/><text x="${L - 6}" y="${y + 4}" text-anchor="end" fill="${C.mut}" font-size="11">${Math.round(mx * i / 4)}</text>`; }
    xs.forEach((x, i) => g += `<text x="${px(i)}" y="${H - B + 16}" text-anchor="middle" fill="${C.tx}" font-size="11">${esc(x)}</text>`);
    series.forEach((s, k) => {
      g += `<polyline fill="none" stroke="${cols[k % 4]}" stroke-width="3" points="${s.pts.map((v, i) => px(i) + ',' + py(v)).join(' ')}"/>` + s.pts.map((v, i) => `<circle cx="${px(i)}" cy="${py(v)}" r="4" fill="${cols[k % 4]}"/>`).join('');
      g += `<text x="${L + 10 + k * 130}" y="${H - 6}" fill="${cols[k % 4]}" font-size="12" font-weight="700">● ${esc(s.name)}</text>`;
    });
    return wrap(`<svg viewBox="0 0 ${W} ${H}" width="${W}" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,sans-serif">${g}</svg>`, cap);
  }
  /* Bảng nhỏ */
  function table(head, rows, cap) {
    return wrap(`<table style="width:auto;margin:auto"><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr>${rows.map(r => '<tr>' + r.map(c => `<td>${esc(c)}</td>`).join('') + '</tr>').join('')}</table>`, cap);
  }
  /* Hình vẽ bằng ký tự (vòng lặp lồng) */
  function ascii(txt, cap) { return wrap(`<pre style="display:inline-block;text-align:left;margin:0">${esc(txt)}</pre>`, cap); }
  /* Trạng thái từng bước (bubble sort...) */
  function steps(list, cap) {
    return wrap(list.map(([label, vals, hl]) => `<div style="margin:6px 0"><span class="muted" style="display:inline-block;min-width:90px;text-align:right;margin-right:8px">${esc(label)}</span><span class="boxes">${vals.map((v, i) => `<div class="${(hl || []).includes(i) ? 'hl' : ''}" style="min-width:40px">${v}</div>`).join('')}</span></div>`).join(''), cap);
  }
  return {flow, mem, arr, grid, bars, line, table, ascii, steps, esc};
})();

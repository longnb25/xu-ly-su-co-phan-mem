/* ===== Minh họa chuyển động từng bước (thuật toán, mảng, vòng lặp...) ===== */
const ANIMS = [];
const AW = 66; // bề rộng mỗi ô (px)
D.anim = (title, frames, opts) => { ANIMS.push({title, frames, opts: opts || {}}); return `<div class="anim" data-a="${ANIMS.length - 1}"></div>`; };
const mk = (a, cls, lift) => a.map((x, i) => ({id: x.id, v: x.v, l: x.l, c: (cls && cls[i]) || '', up: lift && lift.includes(i)}));
const rng = n => Array.from({length: n}, (_, i) => i);

/* Sắp xếp nổi bọt */
D.bubble = (arr, title) => {
  const a = arr.map((v, i) => ({id: 'e' + i, v})), n = a.length, F = [], done = new Set(); let sw = 0, cmp = 0;
  const snap = (cls, o = {}) => { const c = {}; done.forEach(i => c[i] = 'ok'); Object.assign(c, cls); F.push({items: mk(a, c, o.up), ...o, up: undefined}); };
  snap({}, {msg: 'Mảng ban đầu. Bubble sort so sánh từng cặp phần tử kề nhau.', vars: {n}});
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      cmp++; snap({[j]: 'cmp', [j + 1]: 'cmp'}, {ptr: [{i: j, t: 'j'}, {i: j + 1, t: 'j+1'}], vars: {lượt: i + 1, j, 'so sánh': cmp, 'hoán đổi': sw}, msg: `So sánh a[${j}] = ${a[j].v} với a[${j + 1}] = ${a[j + 1].v}`, up: [j, j + 1]});
      if (a[j].v > a[j + 1].v) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; sw++; snap({[j]: 'swap', [j + 1]: 'swap'}, {ptr: [{i: j, t: 'j'}, {i: j + 1, t: 'j+1'}], vars: {lượt: i + 1, j, 'so sánh': cmp, 'hoán đổi': sw}, msg: `${a[j + 1].v} > ${a[j].v} → hoán đổi hai ô (ô bay đổi chỗ)`, up: [j, j + 1]}); }
    }
    done.add(n - 1 - i); snap({}, {vars: {lượt: i + 1, 'so sánh': cmp, 'hoán đổi': sw}, msg: `Hết lượt ${i + 1}: phần tử lớn nhất đã "nổi" về vị trí ${n - 1 - i}`});
  }
  done.add(0); snap({}, {vars: {'so sánh': cmp, 'hoán đổi': sw}, msg: '✔ Hoàn thành! Mảng đã được sắp xếp tăng dần.'});
  return D.anim(title || 'Bubble sort – nổi bọt', F);
};
/* Sắp xếp chọn */
D.selection = (arr, title) => {
  const a = arr.map((v, i) => ({id: 'e' + i, v})), n = a.length, F = [], done = new Set();
  const snap = (cls, o = {}) => { const c = {}; done.forEach(i => c[i] = 'ok'); Object.assign(c, cls); F.push({items: mk(a, c, o.up), ...o, up: undefined}); };
  snap({}, {msg: 'Mỗi lượt: tìm phần tử NHỎ NHẤT của phần chưa sắp xếp rồi đưa về đầu.'});
  for (let i = 0; i < n - 1; i++) {
    let m = i; snap({[i]: 'min'}, {ptr: [{i, t: 'i'}], vars: {i, min: m}, msg: `Lượt ${i + 1}: giả sử a[${i}] = ${a[i].v} là nhỏ nhất`});
    for (let j = i + 1; j < n; j++) {
      snap({[m]: 'min', [j]: 'cmp'}, {ptr: [{i, t: 'i'}, {i: j, t: 'j'}], vars: {i, j, min: m}, msg: `So sánh a[${j}] = ${a[j].v} với min = ${a[m].v}`, up: [j]});
      if (a[j].v < a[m].v) { m = j; snap({[m]: 'min'}, {ptr: [{i, t: 'i'}, {i: j, t: 'j'}], vars: {i, j, min: m}, msg: `${a[m].v} nhỏ hơn → min = ${m}`}); }
    }
    if (m !== i) { [a[i], a[m]] = [a[m], a[i]]; snap({[i]: 'swap', [m]: 'swap'}, {ptr: [{i, t: 'i'}], vars: {i, min: m}, msg: `Đổi chỗ a[${i}] ↔ a[${m}]`, up: [i, m]}); }
    done.add(i); snap({}, {msg: `a[${i}] = ${a[i].v} đã đúng vị trí`});
  }
  done.add(n - 1); snap({}, {msg: '✔ Hoàn thành! Mảng đã sắp xếp tăng dần.'});
  return D.anim(title || 'Selection sort – chọn', F);
};
/* Tìm max */
D.findMax = (arr, title) => {
  const a = arr.map((v, i) => ({id: 'e' + i, v})), F = []; let m = 0;
  F.push({items: mk(a, {0: 'max'}), ptr: [{i: 0, t: 'max'}], vars: {max: a[0].v, 'vị trí': 0}, msg: 'Giả sử phần tử đầu là lớn nhất.'});
  for (let i = 1; i < a.length; i++) {
    F.push({items: mk(a, {[m]: 'max', [i]: 'cmp'}, [i]), ptr: [{i: m, t: 'max'}, {i, t: 'i'}], vars: {i, max: a[m].v, 'vị trí': m}, msg: `So sánh a[${i}] = ${a[i].v} với max = ${a[m].v}`});
    if (a[i].v > a[m].v) { m = i; F.push({items: mk(a, {[m]: 'max'}), ptr: [{i: m, t: 'max'}], vars: {i, max: a[m].v, 'vị trí': m}, msg: `${a[m].v} lớn hơn → cập nhật max = ${a[m].v} (vị trí ${m})`}); }
  }
  F.push({items: mk(a, {[m]: 'ok'}), ptr: [{i: m, t: 'max'}], vars: {max: a[m].v, 'vị trí': m}, msg: `✔ Giá trị lớn nhất là ${a[m].v} tại chỉ số ${m}.`});
  return D.anim(title || 'Tìm phần tử lớn nhất', F);
};
/* Tìm kiếm tuyến tính */
D.search = (arr, x, title) => {
  const a = arr.map((v, i) => ({id: 'e' + i, v})), F = [];
  for (let i = 0; i < a.length; i++) {
    F.push({items: mk(a, {[i]: 'cmp'}, [i]), ptr: [{i, t: 'i'}], vars: {x, i, 'a[i]': a[i].v}, msg: `a[${i}] = ${a[i].v} ${a[i].v === x ? '== ' : '≠ '}${x}`});
    if (a[i].v === x) { F.push({items: mk(a, {[i]: 'ok'}), ptr: [{i, t: 'i'}], vars: {x, 'trả về': i}, msg: `✔ Tìm thấy ${x} tại chỉ số ${i} → return ${i}`}); return D.anim(title || 'Tìm kiếm tuyến tính', F); }
  }
  F.push({items: mk(a, {}), vars: {x, 'trả về': -1}, msg: `✘ Duyệt hết mảng không thấy ${x} → return -1`});
  return D.anim(title || 'Tìm kiếm tuyến tính', F);
};
/* Duyệt mảng + cộng dồn */
D.sumArr = (arr, title) => {
  const a = arr.map((v, i) => ({id: 'e' + i, v})), F = []; let t = 0;
  F.push({items: mk(a, {}), vars: {tong: 0}, msg: 'tong = 0. Duyệt từng phần tử bằng for (i = 0; i < n; i++).'});
  a.forEach((x, i) => { t += x.v; F.push({items: mk(a, {[i]: 'cmp'}, [i]), ptr: [{i, t: 'i'}], vars: {i, 'a[i]': x.v, tong: t}, msg: `tong = tong + a[${i}] = ${t}`}); });
  F.push({items: mk(a, rng(a.length).reduce((o, i) => (o[i] = 'ok', o), {})), vars: {tong: t, 'TB': Math.round(t / a.length * 100) / 100}, msg: `✔ Tổng = ${t}, trung bình = ${Math.round(t / a.length * 100) / 100}`});
  return D.anim(title || 'Duyệt mảng & tính tổng', F);
};
/* Vòng for cộng dồn 1..n */
D.sumLoop = (n, title) => {
  const a = rng(n).map(i => ({id: 'e' + i, v: i + 1})), F = []; let t = 0;
  F.push({items: mk(a, {}), vars: {i: '?', tong: 0}, msg: 'Khởi tạo: tong = 0. Vòng for chạy i từ 1 đến n.', out: ''});
  a.forEach((x, i) => { F.push({items: mk(a, {[i]: 'cmp'}, [i]), ptr: [{i, t: 'i'}], vars: {i: i + 1, tong: t}, msg: `i = ${i + 1} ≤ ${n}: điều kiện đúng → vào thân vòng lặp`}); t += x.v; F.push({items: mk(a, {[i]: 'ok'}), ptr: [{i, t: 'i'}], vars: {i: i + 1, tong: t}, msg: `tong += ${i + 1}  →  tong = ${t}`}); });
  F.push({items: mk(a, {}), vars: {i: n + 1, tong: t}, msg: `i = ${n + 1} > ${n}: điều kiện sai → thoát vòng lặp. Kết quả tong = ${t}`, out: `Tong = ${t}`});
  return D.anim(title || 'Vòng lặp for từng bước', F);
};
/* Tách chữ số bằng % và / */
D.digits = (n0, title) => {
  let ds = String(n0).split('').map((v, i) => ({id: 'd' + i, v: +v})), F = [], n = n0, tong = 0, dem = 0;
  F.push({items: mk(ds, {}), vars: {n, tong, 'đếm': dem}, msg: `Số n = ${n0}. Lặp khi n > 0: lấy chữ số cuối bằng n % 10, bỏ bằng n / 10.`});
  while (n > 0) {
    const c = n % 10; F.push({items: mk(ds, {[ds.length - 1]: 'cmp'}, [ds.length - 1]), vars: {n, 'n % 10': c, tong, 'đếm': dem}, msg: `${n} % 10 = ${c} → chữ số cuối là ${c}`});
    tong += c; dem++; F.push({items: mk(ds, {[ds.length - 1]: 'ok'}), vars: {n, 'n % 10': c, tong, 'đếm': dem}, msg: `tong = ${tong}, đếm = ${dem}`});
    n = Math.floor(n / 10); ds = ds.slice(0, -1); F.push({items: mk(ds, {}), vars: {n, tong, 'đếm': dem}, msg: `n = n / 10 = ${n}  (chữ số cuối đã bị bỏ)`});
  }
  F.push({items: [], vars: {n: 0, tong, 'đếm': dem}, msg: `✔ n = 0 → dừng. Có ${dem} chữ số, tổng các chữ số = ${tong}.`});
  return D.anim(title || 'Tách chữ số: n % 10 và n / 10', F);
};
/* Hoán đổi 2 biến */
D.swapVars = (x, y, title) => {
  const it = (a, b, t, cls) => [{id: 'a', v: a, l: 'a', c: (cls || {}).a || ''}, {id: 'b', v: b, l: 'b', c: (cls || {}).b || ''}, {id: 't', v: t, l: 'tạm', c: (cls || {}).t || ''}];
  const F = [{items: it(x, y, '?'), msg: `Ban đầu a = ${x}, b = ${y}. Cần một biến tạm.`},
    {items: it(x, y, x, {t: 'swap', a: 'cmp'}), msg: `t = a  →  t = ${x} (cất giá trị a vào biến tạm)`, ptr: [{i: 2, t: '←a'}]},
    {items: it(y, y, x, {a: 'swap', b: 'cmp'}), msg: `a = b  →  a = ${y}`, ptr: [{i: 0, t: '←b'}]},
    {items: it(y, x, x, {b: 'swap', t: 'cmp'}), msg: `b = t  →  b = ${x}`, ptr: [{i: 1, t: '←t'}]},
    {items: it(y, x, x, {a: 'ok', b: 'ok'}), msg: `✔ Xong: a = ${y}, b = ${x}. Nếu thiếu biến tạm, giá trị cũ bị mất!`}];
  return D.anim(title || 'Hoán đổi hai biến bằng biến tạm', F);
};
/* Xóa phần tử */
D.deleteAt = (arr, k, title) => {
  const a = arr.map((v, i) => ({id: 'p' + i, v})), F = [], n = a.length;
  F.push({items: mk(a, {[k]: 'cmp'}), ptr: [{i: k, t: 'k'}], vars: {n, k}, msg: `Cần xóa phần tử a[${k}] = ${a[k].v}. Ta dồn các phần tử bên phải sang trái.`});
  for (let i = k; i < n - 1; i++) { a[i] = {...a[i], v: a[i + 1].v}; F.push({items: mk(a, {[i]: 'swap'}, [i]), ptr: [{i, t: 'i'}], vars: {n, k, i}, msg: `a[${i}] = a[${i + 1}]  →  ${a[i].v}`}); }
  F.push({items: mk(a.slice(0, n - 1), {}), vars: {n: n - 1, k}, msg: `n = n - 1 = ${n - 1}. Ô cuối bị loại khỏi mảng.`});
  F.push({items: mk(a.slice(0, n - 1), rng(n - 1).reduce((o, i) => (o[i] = 'ok', o), {})), vars: {n: n - 1}, msg: '✔ Đã xóa xong.'});
  return D.anim(title || 'Xóa phần tử khỏi mảng', F);
};
/* Vòng lặp lồng nhau in hình */
D.nested = (n, title) => {
  const F = []; let out = '';
  F.push({vars: {n, i: '?', j: '?'}, out: '', msg: 'Vòng ngoài i điều khiển HÀNG, vòng trong j điều khiển số ký tự trên hàng.'});
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= i; j++) { out += '* '; F.push({vars: {n, i, j}, out, msg: `i = ${i}, j = ${j} → in "* " (hàng ${i} cần ${i} dấu *)`, cur: true}); }
    out += '\n'; F.push({vars: {n, i, j: '—'}, out, msg: `Hết vòng trong → printf("\\n") xuống dòng, sang i = ${i + 1}`});
  }
  F.push({vars: {n, i: n + 1}, out, msg: `✔ Xong: vòng ngoài chạy ${n} lần, tổng ${n * (n + 1) / 2} dấu *.`});
  return D.anim(title || 'Vòng lặp lồng nhau in tam giác', F);
};
/* Duyệt ma trận */
D.matrix = (m, title) => {
  const F = [], done = []; const R = m.length, C = m[0].length;
  F.push({grid: m, hl: [], cur: null, vars: {}, msg: `Ma trận ${R}×${C}. Vòng ngoài duyệt hàng i, vòng trong duyệt cột j.`});
  for (let i = 0; i < R; i++) {
    let th = 0;
    for (let j = 0; j < C; j++) { th += m[i][j]; F.push({grid: m, hl: done.map(x => x.slice()), cur: [i, j], vars: {i, j, 'a[i][j]': m[i][j], 'tổng hàng': th}, msg: `a[${i}][${j}] = ${m[i][j]} → tổng hàng ${i} = ${th}`}); done.push([i, j]); }
    F.push({grid: m, hl: done.map(x => x.slice()), cur: null, vars: {i, 'tổng hàng': th}, msg: `✔ Tổng hàng ${i} = ${th}`});
  }
  return D.anim(title || 'Duyệt mảng 2 chiều theo hàng', F);
};
/* Chuyển vị */
D.transpose = (m, title) => {
  const R = m.length, C = m[0].length, F = [], t = Array.from({length: C}, () => Array(R).fill('')); const hl = [], hl2 = [];
  F.push({grid: m, grid2: t, hl: [], hl2: [], cur: null, vars: {}, msg: 'Chuyển vị: t[j][i] = a[i][j] (đổi hàng thành cột).'});
  for (let i = 0; i < R; i++) for (let j = 0; j < C; j++) { t[j][i] = m[i][j]; hl.push([i, j]); F.push({grid: m, grid2: t.map(r => r.slice()), hl: hl.slice(0, -1).map(x => x.slice()), hl2: hl.slice(0, -1).map(([a, b]) => [b, a]), cur: [i, j], cur2: [j, i], vars: {i, j}, msg: `t[${j}][${i}] = a[${i}][${j}] = ${m[i][j]}`}); }
  F.push({grid: m, grid2: t.map(r => r.slice()), hl: hl.map(x => x.slice()), hl2: hl.map(([a, b]) => [b, a]), cur: null, vars: {}, msg: '✔ Hoàn thành ma trận chuyển vị.'});
  return D.anim(title || 'Chuyển vị ma trận', F);
};

/* ----- Bộ phát ----- */
function gridHTML(m, hl, cur, label) {
  const done = new Set((hl || []).map(x => x.join(',')));
  return `<table class="agrid"><tr><th></th>${m[0].map((_, j) => `<th>${j}</th>`).join('')}</tr>${m.map((r, i) => `<tr><th>${i}</th>${r.map((v, j) => `<td class="${cur && cur[0] === i && cur[1] === j ? 'cur' : done.has(i + ',' + j) ? 'dn' : ''}">${v}</td>`).join('')}</tr>`).join('')}</table>`;
}
function initAnims(root) {
  $$('.anim:not([data-ready])', root || document).forEach(el => {
    const A = ANIMS[+el.dataset.a]; if (!A) return; el.dataset.ready = 1;
    const F = A.frames; let k = 0, timer = null, speed = 1100, prevVars = {};
    el.innerHTML = `<div class="an-head"><span class="an-dot"></span><b>${esc(A.title)}</b><span class="sp"></span><span class="an-step"></span></div>
      <div class="an-stage"></div><div class="an-grids"></div><div class="an-vars"></div><pre class="an-out hide"></pre><div class="an-msg"></div><div class="an-bar"><i></i></div>
      <div class="an-ctl"><button class="btn sm" data-c="reset" title="Về đầu">⏮</button><button class="btn sm" data-c="prev" title="Lùi">◀</button><button class="btn pri sm" data-c="play">▶ Phát</button><button class="btn sm" data-c="next" title="Tiến">▶▏</button><span class="sp"></span><label class="muted" style="font-size:12px">Tốc độ <select data-c="sp"><option value="1800">Chậm</option><option value="1100" selected>Vừa</option><option value="500">Nhanh</option><option value="220">Rất nhanh</option></select></label></div>`;
    const stage = $('.an-stage', el), nodes = {}, ptrs = {};
    const maxN = Math.max(1, ...F.map(f => (f.items || []).length)); stage.style.width = Math.max(maxN * AW, 120) + 'px';
    if (!F.some(f => f.items)) stage.style.display = 'none';
    function render() {
      const f = F[k];
      if (f.items) {
        const seen = new Set();
        f.items.forEach((it, i) => {
          seen.add(it.id); let n = nodes[it.id];
          if (!n) { n = nodes[it.id] = document.createElement('div'); n.className = 'it'; n.style.transform = `translate(${i * AW}px,40px)`; stage.appendChild(n); requestAnimationFrame(() => n.classList.add('in')); }
          const txt = `${it.l ? `<i>${esc(it.l)}</i>` : `<i>[${i}]</i>`}<b>${esc(it.v)}</b>`;
          if (n.dataset.h !== txt) { if (n.dataset.h !== undefined && n.querySelector('b') && n.querySelector('b').textContent != it.v) { n.classList.remove('flash'); void n.offsetWidth; n.classList.add('flash'); } n.innerHTML = txt; n.dataset.h = txt; }
          n.className = 'it in ' + (it.c || '') + (n.classList.contains('flash') ? ' flash' : '');
          n.style.transform = `translate(${i * AW}px,${it.up ? 24 : 40}px)`;
        });
        Object.keys(nodes).forEach(id => { if (!seen.has(id)) { nodes[id].classList.add('gone'); const d = nodes[id]; delete nodes[id]; setTimeout(() => d.remove(), 500); } });
        const pset = new Set();
        (f.ptr || []).forEach(p => { pset.add(p.t); let n = ptrs[p.t]; if (!n) { n = ptrs[p.t] = document.createElement('div'); n.className = 'ptr'; n.style.transform = `translate(${p.i * AW}px,112px)`; stage.appendChild(n); } n.innerHTML = `<span>▲</span><em>${esc(p.t)}</em>`; n.style.transform = `translate(${p.i * AW}px,112px)`; n.style.opacity = 1; });
        Object.keys(ptrs).forEach(t => { if (!pset.has(t)) ptrs[t].style.opacity = 0; });
      }
      $('.an-grids', el).innerHTML = f.grid ? `<div class="agw"><small>a</small>${gridHTML(f.grid, f.hl, f.cur)}</div>${f.grid2 ? `<div class="agw"><small>t</small>${gridHTML(f.grid2, f.hl2, f.cur2)}</div>` : ''}` : '';
      const vars = f.vars || {}; $('.an-vars', el).innerHTML = Object.entries(vars).map(([n, v]) => `<span class="vchip ${prevVars[n] !== undefined && prevVars[n] != v ? 'chg' : ''}"><i>${esc(n)}</i> = <b>${esc(v)}</b></span>`).join(''); prevVars = vars;
      const o = $('.an-out', el); if (f.out !== undefined) { o.classList.remove('hide'); o.textContent = '▸ Kết quả:\n' + f.out + '█'; } else o.classList.add('hide');
      $('.an-msg', el).textContent = f.msg || ''; $('.an-step', el).textContent = `Bước ${k + 1} / ${F.length}`; $('.an-bar i', el).style.width = ((k + 1) / F.length * 100) + '%';
      const pb = $('[data-c=play]', el); pb.textContent = timer ? '⏸ Dừng' : (k >= F.length - 1 ? '↺ Phát lại' : '▶ Phát');
    }
    const stop = () => { clearInterval(timer); timer = null; render(); };
    const play = () => { if (k >= F.length - 1) k = 0; render(); clearInterval(timer); timer = setInterval(() => { if (k >= F.length - 1) return stop(); k++; render(); }, speed); render(); };
    el.addEventListener('click', e => { const c = e.target.closest('[data-c]'); if (!c || c.tagName === 'SELECT') return; const a = c.dataset.c;
      if (a === 'play') timer ? stop() : play(); else { clearInterval(timer); timer = null; if (a === 'next') k = Math.min(F.length - 1, k + 1); if (a === 'prev') k = Math.max(0, k - 1); if (a === 'reset') k = 0; render(); } });
    $('[data-c=sp]', el).onchange = e => { speed = +e.target.value; if (timer) play(); };
    render();
    if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { io.disconnect(); setTimeout(() => { if (!timer && k === 0) play(); }, 500); } }, {threshold: .6}); io.observe(el); }
  });
}

/* Trình thông dịch C mini chạy trực tiếp trên trình duyệt (không cần server).
   Hỗ trợ: int/char/float/double/long, biến, hằng, #define, printf/scanf, if/else, switch,
   for/while/do-while, hàm (đệ quy), con trỏ, mảng 1-2 chiều, chuỗi, <math.h>, <string.h>, <ctype.h>, <stdlib.h>. */
(function (root) {
'use strict';
const TYPEW = new Set(['int','char','float','double','void','long','short','unsigned','signed','const','static','extern','register']);
const isF = t => t === 'float' || t === 'double';
const cells = t => (t && t.a) ? t.n * cells(t.a) : 1;
const bytes = t => { if (t && t.a) return t.n * bytes(t.a); if (t && t.p) return 8; return ({char:1,int:4,uint:4,float:4,double:8,long:4,void:1})[t] || 4; };
const cerr = (m, l) => { const e = new Error(m); e.cerr = true; e.line = l; return e; };
const HEAP = 1e7;

function esc(c) { return ({n:'\n',t:'\t',r:'\r','0':'\0',a:'\x07',b:'\b','\\':'\\',"'":"'",'"':'"'})[c] ?? c; }

function lex(src, startLn, macros) {
  const top = !macros;
  if (top) {
    macros = {};
    src = src.replace(/^[ \t]*#[ \t]*define[ \t]+(\w+)[ \t]+(.*)$/gm, (m, a, b) => { macros[a] = b.trim(); return ''; });
    src = src.replace(/^[ \t]*#.*$/gm, '');
  }
  const T = []; let i = 0, ln = startLn || 1; const n = src.length;
  const ops = ['<<=','>>=','++','--','->','<<','>>','<=','>=','==','!=','&&','||','+=','-=','*=','/=','%=','&=','|=','^='];
  while (i < n) {
    const c = src[i];
    if (c === '\n') { ln++; i++; continue; }
    if (/\s/.test(c)) { i++; continue; }
    if (c === '/' && src[i+1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i+1] === '*') { i += 2; while (i < n && !(src[i] === '*' && src[i+1] === '/')) { if (src[i] === '\n') ln++; i++; } i += 2; continue; }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i+1] || ''))) {
      const m = /^(0[xX][0-9a-fA-F]+|(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?)([fFlLuU]*)/.exec(src.slice(i));
      const body = m[1]; i += m[0].length;
      if (/^0[xX]/.test(body)) T.push({t:'num', v:parseInt(body,16), ty:'int', ln});
      else if (/[.eE]/.test(body) || /[fF]/.test(m[4])) T.push({t:'num', v:parseFloat(body), ty:'double', ln});
      else T.push({t:'num', v:parseInt(body,10), ty:(/[lL]/.test(m[4]) || parseInt(body) > 2147483647) ? 'long' : 'int', ln});
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      const m = /^\w+/.exec(src.slice(i))[0]; i += m.length;
      if (macros[m] !== undefined) { for (const t of lex(macros[m], ln, macros)) T.push({...t, ln}); }
      else T.push({t:'id', v:m, ln});
      continue;
    }
    if (c === '"') {
      let s = ''; i++;
      while (i < n && src[i] !== '"') { if (src[i] === '\n') throw cerr('Chuỗi "..." chưa đóng', ln); if (src[i] === '\\') { s += esc(src[i+1]); i += 2; } else s += src[i++]; }
      i++; T.push({t:'str', v:s, ln}); continue;
    }
    if (c === "'") {
      i++; let ch;
      if (src[i] === '\\') { ch = esc(src[i+1]); i += 2; } else ch = src[i++];
      if (src[i] !== "'") throw cerr("Ký tự '...' sai cú pháp", ln);
      i++; T.push({t:'num', v:ch.charCodeAt(0), ty:'char', ln}); continue;
    }
    let op = ops.find(o => src.startsWith(o, i));
    if (!op) { if (!'+-*/%=<>!&|^~?:;,.(){}[]'.includes(c)) throw cerr(`Ký tự lạ '${c}'`, ln); op = c; }
    i += op.length; T.push({t:'op', v:op, ln});
  }
  if (top) T.push({t:'eof', v:'(hết file)', ln});
  return T;
}

class Parser {
  constructor(toks) { this.T = toks; this.p = 0; }
  get cur() { return this.T[this.p]; }
  is(v) { const t = this.cur; return (t.t === 'op' || t.t === 'id') && t.v === v; }
  eat(v) { if (this.is(v)) { this.p++; return true; } return false; }
  expect(v) {
    if (this.eat(v)) return;
    const c = this.cur, prev = this.T[this.p-1];
    const ln = (v === ';' || v === ')' || v === '}') && prev ? prev.ln : c.ln;
    throw cerr(`Thiếu '${v}' (gặp '${c.v}')`, ln);
  }
  isType(off = 0) { const t = this.T[this.p+off]; return t && t.t === 'id' && TYPEW.has(t.v); }
  parseBase() {
    let uns = false, lng = 0, base = null, any = false;
    while (this.isType()) {
      const w = this.cur.v; this.p++; any = true;
      if (w === 'unsigned') uns = true; else if (w === 'long') lng++; else if (w === 'int' || w === 'short') base = base || 'int';
      else if (['char','float','double','void'].includes(w)) base = w;
    }
    if (!any) throw cerr(`Kiểu dữ liệu không hợp lệ '${this.cur.v}'`, this.cur.ln);
    let t = base || 'int';
    if (lng && t === 'int') t = 'long'; if (lng && t === 'double') t = 'double';
    if (uns && t === 'int') t = 'uint';
    return t;
  }
  parseProgram() {
    const prog = {funcs: {}, globals: []};
    while (this.cur.t !== 'eof') {
      const ln = this.cur.ln;
      const base = this.parseBase();
      let t = base; while (this.eat('*')) t = {p: t};
      if (this.cur.t !== 'id') throw cerr(`Thiếu tên sau kiểu dữ liệu (gặp '${this.cur.v}')`, this.cur.ln);
      const name = this.cur.v; this.p++;
      if (this.is('(')) {
        this.p++; const params = [];
        if (this.is('void') && this.T[this.p+1].v === ')') this.p++;
        while (!this.is(')')) {
          let pb = this.parseBase(); while (this.eat('*')) pb = {p: pb};
          let pn = ''; if (this.cur.t === 'id') { pn = this.cur.v; this.p++; }
          const dims = [];
          while (this.eat('[')) { dims.push(this.is(']') ? null : this.parseAssign()); this.expect(']'); }
          if (dims.length) { let et = pb; for (let k = dims.length - 1; k >= 1; k--) et = {a: et, n: dims[k] ? dims[k].v : 1}; pb = {p: et}; }
          params.push({n: pn, t: pb}); if (!this.eat(',')) break;
        }
        this.expect(')');
        if (this.eat(';')) continue;
        const body = this.parseBlock();
        prog.funcs[name] = {name, ret: t, params, body, ln};
      } else {
        this.p--; prog.globals.push(this.parseDeclRest(base, ln)); this.expect(';');
      }
    }
    return prog;
  }
  parseDeclRest(base, ln) {
    const items = [];
    do {
      let t = base; while (this.eat('*')) t = {p: t};
      if (this.cur.t !== 'id') throw cerr(`Thiếu tên biến (gặp '${this.cur.v}')`, this.cur.ln);
      const name = this.cur.v; this.p++;
      const dims = [];
      while (this.eat('[')) { dims.push(this.is(']') ? null : this.parseAssign()); this.expect(']'); }
      let init = null;
      if (this.eat('=')) init = this.is('{') ? this.parseInitList() : this.parseAssign();
      items.push({n: name, t, dims, init});
    } while (this.eat(','));
    return {k:'decl', items, ln};
  }
  parseInitList() {
    this.expect('{'); const items = [];
    while (!this.is('}')) { items.push(this.is('{') ? this.parseInitList() : this.parseAssign()); if (!this.eat(',')) break; }
    this.expect('}'); return {k:'initlist', items};
  }
  parseBlock() {
    const ln = this.cur.ln; this.expect('{'); const body = [];
    while (!this.is('}')) { if (this.cur.t === 'eof') throw cerr("Thiếu '}' đóng khối lệnh", ln); body.push(this.parseStmt()); }
    this.p++; return {k:'block', body, ln};
  }
  parseStmt() {
    const t = this.cur, ln = t.ln;
    if (t.t === 'op') {
      if (t.v === '{') return this.parseBlock();
      if (t.v === ';') { this.p++; return {k:'empty'}; }
    }
    if (t.t === 'id') {
      switch (t.v) {
        case 'if': { this.p++; this.expect('('); const c = this.parseExpr(); this.expect(')'); const a = this.parseStmt(); let b = null; if (this.eat('else')) b = this.parseStmt(); return {k:'if', c, a, b, ln}; }
        case 'while': { this.p++; this.expect('('); const c = this.parseExpr(); this.expect(')'); return {k:'while', c, b: this.parseStmt(), ln}; }
        case 'do': { this.p++; const b = this.parseStmt(); this.expect('while'); this.expect('('); const c = this.parseExpr(); this.expect(')'); this.expect(';'); return {k:'do', c, b, ln}; }
        case 'for': {
          this.p++; this.expect('('); let init = null, c = null, st = null;
          if (!this.is(';')) { if (this.isType()) init = this.parseDeclRest(this.parseBase(), ln); else init = {k:'expr', e: this.parseExpr(), ln}; }
          this.expect(';'); if (!this.is(';')) c = this.parseExpr(); this.expect(';');
          if (!this.is(')')) st = this.parseExpr(); this.expect(')');
          return {k:'for', init, c, st, b: this.parseStmt(), ln};
        }
        case 'switch': { this.p++; this.expect('('); const e = this.parseExpr(); this.expect(')'); this.expect('{'); const body = [];
          while (!this.is('}')) { if (this.cur.t === 'eof') throw cerr("Thiếu '}' của switch", ln); body.push(this.parseStmt()); }
          this.p++; return {k:'switch', e, body, ln}; }
        case 'case': { this.p++; const e = this.parseTernary(); this.expect(':'); return {k:'case', e, ln}; }
        case 'default': { this.p++; this.expect(':'); return {k:'default', ln}; }
        case 'break': this.p++; this.expect(';'); return {k:'break', ln};
        case 'continue': this.p++; this.expect(';'); return {k:'continue', ln};
        case 'return': { this.p++; let e = null; if (!this.is(';')) e = this.parseExpr(); this.expect(';'); return {k:'return', e, ln}; }
      }
      if (this.isType()) { const d = this.parseDeclRest(this.parseBase(), ln); this.expect(';'); return d; }
    }
    const e = this.parseExpr(); this.expect(';'); return {k:'expr', e, ln};
  }
  parseExpr() { let e = this.parseAssign(); while (this.is(',')) { this.p++; e = {k:'seq', a: e, b: this.parseAssign(), ln: e.ln}; } return e; }
  parseAssign() {
    const l = this.parseTernary(); const t = this.cur;
    if (t.t === 'op' && ['=','+=','-=','*=','/=','%=','&=','|=','^=','<<=','>>='].includes(t.v)) {
      this.p++; return {k:'asg', op: t.v.slice(0, -1), l, r: this.parseAssign(), ln: t.ln};
    }
    return l;
  }
  parseTernary() {
    const c = this.parseBin(0);
    if (this.eat('?')) { const a = this.parseAssign(); this.expect(':'); const b = this.parseTernary(); return {k:'cond', c, a, b, ln: c.ln}; }
    return c;
  }
  parseBin(lv) {
    const L = [['||'],['&&'],['|'],['^'],['&'],['==','!='],['<','>','<=','>='],['<<','>>'],['+','-'],['*','/','%']];
    if (lv >= L.length) return this.parseUnary();
    let l = this.parseBin(lv + 1);
    while (this.cur.t === 'op' && L[lv].includes(this.cur.v)) { const op = this.cur; this.p++; l = {k:'bin', op: op.v, l, r: this.parseBin(lv + 1), ln: op.ln}; }
    return l;
  }
  parseUnary() {
    const t = this.cur, ln = t.ln;
    if (t.t === 'op') {
      if (['-','+','!','~','*','&'].includes(t.v)) { this.p++; return {k:'un', op: t.v, e: this.parseUnary(), ln}; }
      if (t.v === '++' || t.v === '--') { this.p++; return {k:'inc', op: t.v, pre: true, e: this.parseUnary(), ln}; }
      if (t.v === '(' && this.isType(1)) {
        this.p++; let ty = this.parseBase(); while (this.eat('*')) ty = {p: ty}; this.expect(')');
        return {k:'cast', t: ty, e: this.parseUnary(), ln};
      }
    }
    if (t.t === 'id' && t.v === 'sizeof') {
      this.p++;
      if (this.is('(') && this.isType(1)) { this.p++; let ty = this.parseBase(); while (this.eat('*')) ty = {p: ty}; this.expect(')'); return {k:'sizeof', t: ty, ln}; }
      return {k:'sizeof', e: this.parseUnary(), ln};
    }
    return this.parsePostfix();
  }
  parsePostfix() {
    let e = this.parsePrimary();
    for (;;) {
      const t = this.cur;
      if (this.is('[')) { this.p++; const i = this.parseExpr(); this.expect(']'); e = {k:'idx', a: e, i, ln: t.ln}; }
      else if (this.is('(')) {
        this.p++; const args = [];
        while (!this.is(')')) { args.push(this.parseAssign()); if (!this.eat(',')) break; }
        this.expect(')'); if (e.k !== 'id') throw cerr('Chỉ gọi được hàm theo tên', t.ln);
        e = {k:'call', n: e.n, args, ln: t.ln};
      }
      else if (t.t === 'op' && (t.v === '++' || t.v === '--')) { this.p++; e = {k:'inc', op: t.v, pre: false, e, ln: t.ln}; }
      else break;
    }
    return e;
  }
  parsePrimary() {
    const t = this.cur; this.p++;
    if (t.t === 'num') return {k:'num', v: t.v, t: t.ty, ln: t.ln};
    if (t.t === 'str') { let s = t.v; while (this.cur.t === 'str') { s += this.cur.v; this.p++; } return {k:'str', v: s, ln: t.ln}; }
    if (t.t === 'id') {
      if (TYPEW.has(t.v)) throw cerr(`Không thể dùng kiểu '${t.v}' ở đây`, t.ln);
      return {k:'id', n: t.v, ln: t.ln};
    }
    if (t.t === 'op' && t.v === '(') { const e = this.parseExpr(); this.expect(')'); return e; }
    this.p--; throw cerr(`Cú pháp sai gần '${t.v}'`, t.ln);
  }
}

const BRK = {s: 'break'}, CNT = {s: 'continue'};

class VM {
  constructor(prog, input, opt) {
    this.prog = prog; this.inp = input || ''; this.ip = 0; this.out = ''; this.opt = opt || {};
    this.mem = [0]; this.heap = []; this.sp = 1; this.hp = 0; this.steps = 0; this.max = this.opt.maxSteps || 4e6;
    this.globals = new Map(); this.scopes = []; this.depth = 0; this.strs = new Map(); this.seed = 12345; this.ln = 0;
  }
  rd(a) { if (a >= HEAP) return this.heap[a - HEAP] || 0; if (!(a >= 1) || a >= this.sp) throw cerr('Truy cập vùng nhớ không hợp lệ (con trỏ sai / mảng vượt chỉ số)', this.ln); return this.mem[a]; }
  wr(a, v) { if (a >= HEAP) { this.heap[a - HEAP] = v; return; } if (!(a >= 1) || a >= this.sp) throw cerr('Ghi vào vùng nhớ không hợp lệ (con trỏ sai / mảng vượt chỉ số)', this.ln); this.mem[a] = v; }
  alloc(n) { const a = this.sp; this.sp += n; if (this.sp > 3e6) throw cerr('Tràn bộ nhớ ngăn xếp', this.ln); for (let i = a; i < this.sp; i++) this.mem[i] = 0; return a; }
  emit(s) { this.out += s; if (this.out.length > 300000) throw cerr('Xuất quá nhiều dữ liệu (có thể vòng lặp vô hạn)', this.ln); }
  strLit(s) {
    if (this.strs.has(s)) return this.strs.get(s);
    const a = HEAP + this.hp; this.hp += s.length + 1;
    for (let i = 0; i < s.length; i++) this.heap[a - HEAP + i] = s.charCodeAt(i);
    this.heap[a - HEAP + s.length] = 0; this.strs.set(s, a); return a;
  }
  cstr(a) { let s = ''; for (let k = 0; k < 100000; k++) { const c = this.rd(a + k); if (!c) break; s += String.fromCharCode(c & 255); } return s; }
  look(n, node) {
    for (let i = this.scopes.length - 1; i >= 0; i--) { const b = this.scopes[i].get(n); if (b) return b; }
    const g = this.globals.get(n); if (g) return g;
    throw cerr(`Biến '${n}' chưa được khai báo`, node.ln);
  }
  coerce(v, t) {
    if (t === 'int') return v | 0; if (t === 'char') return (v << 24) >> 24; if (t === 'uint') return v >>> 0;
    if (t === 'long') return Math.trunc(v); if (t === 'float') return Math.fround(v);
    if (t === 'double') return +v; return v;
  }
  run() {
    const P = this.prog;
    for (const d of P.globals) this.declare(d, this.globals);
    if (!P.funcs.main) throw cerr('Chương trình thiếu hàm main()', 1);
    const r = this.callFn(P.funcs.main, []);
    return r ? r[0] | 0 : 0;
  }
  declare(d, scope) {
    this.ln = d.ln;
    for (const it of d.items) {
      let t = it.t;
      if (it.dims.length) {
        const ns = it.dims.map(e => e ? this.ev(e)[0] | 0 : null);
        if (ns[0] === null) {
          const init = it.init;
          ns[0] = init ? (init.k === 'str' ? init.v.length + 1 : init.items.length) : 1;
        }
        for (let k = ns.length - 1; k >= 0; k--) { if (ns[k] === null || ns[k] <= 0) throw cerr(`Kích thước mảng '${it.n}' không hợp lệ`, d.ln); t = {a: t, n: ns[k]}; }
      }
      const addr = this.alloc(cells(t)); scope.set(it.n, {addr, t});
      if (it.init) {
        if (t.a) {
          if (it.init.k === 'str' && t.a === 'char') { const s = it.init.v; for (let i = 0; i < Math.min(s.length, t.n - 0); i++) this.mem[addr + i] = s.charCodeAt(i); }
          else if (it.init.k === 'initlist') this.fillList(addr, t, it.init, d.ln);
          else throw cerr(`Khởi tạo mảng '${it.n}' phải dùng {...}`, d.ln);
        } else {
          if (it.init.k === 'initlist') throw cerr(`Biến '${it.n}' không phải mảng`, d.ln);
          const [v, vt] = this.ev(it.init); this.wr(addr, this.coerce(v, t));
        }
      }
    }
  }
  fillList(addr, t, list, ln) {
    const stride = cells(t.a);
    if (list.items.length > t.n) throw cerr('Quá nhiều giá trị khởi tạo cho mảng', ln);
    list.items.forEach((it, i) => {
      if (t.a.a) { if (it.k === 'initlist') this.fillList(addr + i * stride, t.a, it, ln); else this.wr(addr + i * stride, this.coerce(this.ev(it)[0], 'int')); }
      else { if (it.k === 'initlist') throw cerr('Khởi tạo mảng sai cú pháp', ln); this.wr(addr + i, this.coerce(this.ev(it)[0], t.a)); }
    });
  }
  callFn(f, args) {
    if (++this.depth > 350) throw cerr('Tràn ngăn xếp: đệ quy quá sâu (thiếu điều kiện dừng?)', this.ln);
    const sp0 = this.sp, saved = this.scopes; this.scopes = [new Map()];
    f.params.forEach((p, i) => { const a = this.alloc(1); this.scopes[0].set(p.n, {addr: a, t: p.t}); this.wr(a, this.coerce(args[i] ? args[i][0] : 0, p.t)); });
    let res = null;
    try { const r = this.exec(f.body); if (r && r.ret) res = r.ret; }
    finally { this.sp = sp0; this.scopes = saved; this.depth--; }
    if (res && f.ret !== 'void') return [this.coerce(res[0], f.ret), f.ret];
    return res || [0, 'int'];
  }
  exec(n) {
    if (++this.steps > this.max) throw cerr('Chương trình chạy quá lâu (có thể vòng lặp vô hạn)', n.ln || this.ln);
    if (n.ln) this.ln = n.ln;
    switch (n.k) {
      case 'empty': return;
      case 'expr': this.ev(n.e); return;
      case 'decl': this.declare(n, this.scopes[this.scopes.length - 1]); return;
      case 'block': return this.execBlock(n.body);
      case 'if': { if (this.truthy(this.ev(n.c))) return this.exec(n.a); if (n.b) return this.exec(n.b); return; }
      case 'while': { while (this.truthy(this.ev(n.c))) { const r = this.exec(n.b); if (r === BRK) break; if (r && r.ret) return r; } return; }
      case 'do': { do { const r = this.exec(n.b); if (r === BRK) break; if (r && r.ret) return r; } while (this.truthy(this.ev(n.c))); return; }
      case 'for': {
        const sp0 = this.sp; this.scopes.push(new Map());
        try {
          if (n.init) this.exec(n.init);
          while (!n.c || this.truthy(this.ev(n.c))) {
            const r = this.exec(n.b); if (r === BRK) break; if (r && r.ret) return r;
            if (n.st) this.ev(n.st);
            if (++this.steps > this.max) throw cerr('Chương trình chạy quá lâu (có thể vòng lặp vô hạn)', n.ln);
          }
        } finally { this.scopes.pop(); this.sp = sp0; }
        return;
      }
      case 'switch': {
        const v = this.ev(n.e)[0]; let start = -1;
        for (let i = 0; i < n.body.length; i++) { const s = n.body[i]; if (s.k === 'case' && this.ev(s.e)[0] === v) { start = i; break; } }
        if (start < 0) start = n.body.findIndex(s => s.k === 'default');
        if (start < 0) return;
        const sp0 = this.sp; this.scopes.push(new Map());
        try { for (let i = start; i < n.body.length; i++) { const r = this.exec(n.body[i]); if (r === BRK) break; if (r) return r; } }
        finally { this.scopes.pop(); this.sp = sp0; }
        return;
      }
      case 'case': case 'default': return;
      case 'break': return BRK;
      case 'continue': return CNT;
      case 'return': return {ret: n.e ? this.ev(n.e) : null};
    }
    throw cerr('Câu lệnh không hỗ trợ', n.ln);
  }
  execBlock(body) {
    const sp0 = this.sp; this.scopes.push(new Map());
    try { for (const s of body) { const r = this.exec(s); if (r) return r; } }
    finally { this.scopes.pop(); this.sp = sp0; }
  }
  truthy(r) { return r[0] !== 0; }
  lv(n) {
    this.ln = n.ln || this.ln;
    if (n.k === 'id') return this.look(n.n, n);
    if (n.k === 'un' && n.op === '*') { const [v, t] = this.ev(n.e); if (!t.p) throw cerr("Toán tử '*' chỉ dùng cho con trỏ", n.ln); if (!v) throw cerr('Truy cập con trỏ NULL', n.ln); return {addr: v, t: t.p}; }
    if (n.k === 'idx') {
      const [b, bt] = this.ev(n.a); const [i] = this.ev(n.i);
      if (!bt.p) throw cerr("Chỉ dùng [] với mảng hoặc con trỏ", n.ln);
      return {addr: b + Math.trunc(i) * cells(bt.p), t: bt.p};
    }
    throw cerr('Vế trái phép gán không hợp lệ', n.ln);
  }
  rv(l) { return l.t.a ? [l.addr, {p: l.t.a}] : [this.rd(l.addr), l.t]; }
  ev(n) {
    if (++this.steps > this.max) throw cerr('Chương trình chạy quá lâu (có thể vòng lặp vô hạn)', n.ln || this.ln);
    switch (n.k) {
      case 'num': return [n.v, n.t];
      case 'str': return [this.strLit(n.v), {p: 'char'}];
      case 'id': case 'idx': return this.rv(this.lv(n));
      case 'seq': this.ev(n.a); return this.ev(n.b);
      case 'cond': return this.truthy(this.ev(n.c)) ? this.ev(n.a) : this.ev(n.b);
      case 'cast': { const [v, t] = this.ev(n.e); return [this.coerce(isF(t) && !isF(n.t) && !n.t.p ? Math.trunc(v) : v, n.t), n.t]; }
      case 'sizeof': {
        if (n.t) return [bytes(n.t), 'long'];
        if (n.e.k === 'id') { const b = this.look(n.e.n, n.e); return [bytes(b.t), 'long']; }
        return [bytes(this.ev(n.e)[1]), 'long'];
      }
      case 'un': {
        if (n.op === '&') { const l = this.lv(n.e); return [l.addr, {p: l.t}]; }
        if (n.op === '*') return this.rv(this.lv(n));
        const [v, t] = this.ev(n.e);
        if (n.op === '-') return [-v, isF(t) ? t : (t === 'long' ? 'long' : 'int')];
        if (n.op === '+') return [v, t];
        if (n.op === '!') return [v === 0 ? 1 : 0, 'int'];
        if (n.op === '~') return [~v, 'int'];
        break;
      }
      case 'bin': {
        if (n.op === '&&') return [this.truthy(this.ev(n.l)) && this.truthy(this.ev(n.r)) ? 1 : 0, 'int'];
        if (n.op === '||') return [this.truthy(this.ev(n.l)) || this.truthy(this.ev(n.r)) ? 1 : 0, 'int'];
        return this.binop(n.op, this.ev(n.l), this.ev(n.r), n.ln);
      }
      case 'asg': {
        const l = this.lv(n.l); if (l.t.a) throw cerr('Không thể gán cho cả mảng', n.ln);
        let r = this.ev(n.r);
        if (n.op) r = this.binop(n.op, this.rv(l), r, n.ln);
        const v = this.coerce(isF(r[1]) && !isF(l.t) && !l.t.p ? Math.trunc(r[0]) : r[0], l.t);
        this.wr(l.addr, v); return [v, l.t];
      }
      case 'inc': {
        const l = this.lv(n.e); const old = this.rd(l.addr); const step = l.t.p ? cells(l.t.p) : 1;
        const nv = this.coerce(old + (n.op === '++' ? step : -step), l.t); this.wr(l.addr, nv);
        return [n.pre ? nv : old, l.t];
      }
      case 'call': return this.call(n);
    }
    throw cerr('Biểu thức không hỗ trợ', n.ln);
  }
  binop(op, [a, ta], [b, tb], ln) {
    const pa = ta && ta.p, pb = tb && tb.p;
    if (pa || pb) {
      if (op === '+' && pa && !pb) return [a + Math.trunc(b) * cells(ta.p), ta];
      if (op === '+' && pb && !pa) return [b + Math.trunc(a) * cells(tb.p), tb];
      if (op === '-' && pa && !pb) return [a - Math.trunc(b) * cells(ta.p), ta];
      if (op === '-' && pa && pb) return [Math.trunc((a - b) / cells(ta.p)), 'int'];
    }
    switch (op) {
      case '==': return [a === b ? 1 : 0, 'int']; case '!=': return [a !== b ? 1 : 0, 'int'];
      case '<': return [a < b ? 1 : 0, 'int']; case '>': return [a > b ? 1 : 0, 'int'];
      case '<=': return [a <= b ? 1 : 0, 'int']; case '>=': return [a >= b ? 1 : 0, 'int'];
    }
    if (isF(ta) || isF(tb)) {
      switch (op) {
        case '+': return [a + b, 'double']; case '-': return [a - b, 'double']; case '*': return [a * b, 'double'];
        case '/': return [a / b, 'double'];
        default: throw cerr(`Không dùng được '${op}' với số thực`, ln);
      }
    }
    const big = ta === 'long' || tb === 'long', uns = ta === 'uint' || tb === 'uint';
    const rt = big ? 'long' : (uns ? 'uint' : 'int'); let r;
    switch (op) {
      case '+': r = a + b; break; case '-': r = a - b; break; case '*': r = (big ? a * b : Math.imul(a, b)); break;
      case '/': if (b === 0) throw cerr('Lỗi chia cho 0', ln); r = Math.trunc(a / b); break;
      case '%': if (b === 0) throw cerr('Lỗi chia lấy dư cho 0', ln); r = a % b; break;
      case '&': r = a & b; break; case '|': r = a | b; break; case '^': r = a ^ b; break;
      case '<<': r = a << b; break; case '>>': r = a >> b; break;
      default: throw cerr(`Toán tử '${op}' không hỗ trợ`, ln);
    }
    return [this.coerce(r, rt), rt];
  }
  call(n) {
    const args = n.args.map(a => this.ev(a)); this.ln = n.ln;
    const f = this.prog.funcs[n.n];
    if (f) return this.callFn(f, args);
    const B = this.builtins()[n.n];
    if (B) return B(args, n);
    throw cerr(`Hàm '${n.n}' chưa được định nghĩa`, n.ln);
  }
  builtins() {
    if (this._b) return this._b;
    const m1 = fn => a => [fn(a[0][0]), 'double'];
    const ch = fn => a => [fn(String.fromCharCode(a[0][0])) ? 1 : 0, 'int'];
    this._b = {
      printf: a => { const s = this.format(this.cstr(a[0][0]), a.slice(1)); this.emit(s); return [s.length, 'int']; },
      puts: a => { this.emit(this.cstr(a[0][0]) + '\n'); return [1, 'int']; },
      putchar: a => { this.emit(String.fromCharCode(a[0][0])); return [a[0][0], 'int']; },
      getchar: () => [this.ip < this.inp.length ? this.inp.charCodeAt(this.ip++) : -1, 'int'],
      scanf: a => this.scanf(a),
      strlen: a => [this.cstr(a[0][0]).length, 'long'],
      strcpy: a => { const s = this.cstr(a[1][0]); for (let i = 0; i <= s.length; i++) this.wr(a[0][0] + i, i < s.length ? s.charCodeAt(i) : 0); return a[0]; },
      strcat: a => { const d = this.cstr(a[0][0]), s = this.cstr(a[1][0]); for (let i = 0; i <= s.length; i++) this.wr(a[0][0] + d.length + i, i < s.length ? s.charCodeAt(i) : 0); return a[0]; },
      strcmp: a => { const x = this.cstr(a[0][0]), y = this.cstr(a[1][0]); return [x < y ? -1 : x > y ? 1 : 0, 'int']; },
      abs: a => [Math.abs(a[0][0]) | 0, 'int'], labs: a => [Math.abs(a[0][0]), 'long'],
      fabs: m1(Math.abs), sqrt: m1(Math.sqrt), sin: m1(Math.sin), cos: m1(Math.cos), tan: m1(Math.tan), exp: m1(Math.exp),
      floor: m1(Math.floor), ceil: m1(Math.ceil), round: m1(x => Math.sign(x) * Math.round(Math.abs(x))), log: m1(Math.log), log10: m1(Math.log10),
      pow: a => [Math.pow(a[0][0], a[1][0]), 'double'],
      rand: () => { this.seed = (Math.imul(this.seed, 1103515245) + 12345) & 0x7fffffff; return [this.seed % 32768, 'int']; },
      srand: a => { this.seed = a[0][0] | 0; return [0, 'int']; },
      time: () => [Math.floor(Date.now() / 1000), 'long'],
      toupper: a => [String.fromCharCode(a[0][0]).toUpperCase().charCodeAt(0), 'int'], tolower: a => [String.fromCharCode(a[0][0]).toLowerCase().charCodeAt(0), 'int'],
      isdigit: ch(c => /[0-9]/.test(c)), isalpha: ch(c => /[A-Za-z]/.test(c)), isalnum: ch(c => /[A-Za-z0-9]/.test(c)),
      isupper: ch(c => /[A-Z]/.test(c)), islower: ch(c => /[a-z]/.test(c)), isspace: ch(c => /\s/.test(c)),
      atoi: a => [parseInt(this.cstr(a[0][0])) | 0, 'int'], atof: a => [parseFloat(this.cstr(a[0][0])) || 0, 'double'],
      malloc: a => { const c = Math.max(1, a[0][0] | 0); const p = HEAP + this.hp; this.hp += c; return [p, {p: 'void'}]; },
      calloc: a => { const c = Math.max(1, (a[0][0] | 0) * (a[1][0] | 0)); const p = HEAP + this.hp; this.hp += c; return [p, {p: 'void'}]; },
      free: () => [0, 'int'], system: () => [0, 'int'], fflush: () => [0, 'int'],
      exit: a => { const e = new Error('exit'); e.exit = a[0][0] | 0; throw e; },
    };
    return this._b;
  }
  format(f, args) {
    let ai = 0, out = '';
    for (let i = 0; i < f.length; i++) {
      if (f[i] !== '%') { out += f[i]; continue; }
      const m = /^%([-+ 0#]*)(\d+|\*)?(?:\.(\d+|\*))?(?:hh|h|ll|l|L|z)?([diuoxXfFeEgGcsp%])/.exec(f.slice(i));
      if (!m) { out += '%'; continue; }
      i += m[0].length - 1;
      const fl = m[1], cv = m[4];
      let w = m[2] === '*' ? args[ai++][0] : (m[2] ? +m[2] : 0), pr = m[3] === '*' ? args[ai++][0] : (m[3] !== undefined ? +m[3] : null);
      if (cv === '%') { out += '%'; continue; }
      if (ai >= args.length) { out += '(thiếu đối số)'; continue; }
      const [v] = args[ai++]; let s;
      switch (cv) {
        case 'd': case 'i': s = String(Math.trunc(v)); if (v >= 0 && fl.includes('+')) s = '+' + s; else if (v >= 0 && fl.includes(' ')) s = ' ' + s; break;
        case 'u': s = String(Math.trunc(v) >>> 0); break;
        case 'x': s = (Math.trunc(v) >>> 0).toString(16); break; case 'X': s = (Math.trunc(v) >>> 0).toString(16).toUpperCase(); break;
        case 'o': s = (Math.trunc(v) >>> 0).toString(8); break;
        case 'c': s = String.fromCharCode(v & 255); break;
        case 's': s = this.cstr(v); if (pr !== null) s = s.slice(0, pr); break;
        case 'p': s = '0x' + (v >>> 0).toString(16).padStart(8, '0'); break;
        case 'f': case 'F': s = (+v).toFixed(pr === null ? 6 : pr); if (v >= 0 && fl.includes('+')) s = '+' + s; break;
        case 'e': case 'E': s = (+v).toExponential(pr === null ? 6 : pr).replace(/e([+-])(\d)$/, 'e$10$2'); if (cv === 'E') s = s.toUpperCase(); break;
        case 'g': case 'G': { const p = pr === null ? 6 : (pr || 1); s = (+v).toPrecision(p); if (s.includes('e')) s = (+v).toExponential(p - 1).replace(/\.?0+e/, 'e').replace(/e([+-])(\d)$/, 'e$10$2'); else if (s.includes('.')) s = s.replace(/\.?0+$/, ''); break; }
      }
      if (w && s.length < w) {
        if (fl.includes('-')) s = s.padEnd(w);
        else if (fl.includes('0') && !'cs'.includes(cv)) { const sg = /^[+-]/.test(s) ? s[0] : ''; s = sg + s.slice(sg.length).padStart(w - sg.length, '0'); }
        else s = s.padStart(w);
      }
      out += s;
    }
    return out;
  }
  scanf(a) {
    const f = this.cstr(a[0][0]); let ai = 1, cnt = 0; const inp = this.inp;
    const skip = () => { while (this.ip < inp.length && /\s/.test(inp[this.ip])) this.ip++; };
    for (let i = 0; i < f.length; i++) {
      if (/\s/.test(f[i])) { skip(); continue; }
      if (f[i] !== '%') { skip(); if (inp[this.ip] === f[i]) this.ip++; else return [cnt, 'int']; continue; }
      const m = /^%(\d+)?(?:hh|h|ll|l|L)?([dioufeEgGcsx])/.exec(f.slice(i)); if (!m) continue; i += m[0].length - 1;
      const cv = m[2], arg = a[ai++]; if (!arg) break; const addr = arg[0], et = arg[1] && arg[1].p;
      if (cv !== 'c') skip();
      if (this.ip >= inp.length) return [cnt || -1, 'int'];
      if (cv === 'c') { this.wr(addr, inp.charCodeAt(this.ip++)); cnt++; continue; }
      if (cv === 's') { let s = ''; while (this.ip < inp.length && !/\s/.test(inp[this.ip])) s += inp[this.ip++]; for (let k = 0; k <= s.length; k++) this.wr(addr + k, k < s.length ? s.charCodeAt(k) : 0); cnt++; continue; }
      const rx = (cv === 'f' || cv === 'e' || cv === 'E' || cv === 'g' || cv === 'G') ? /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/ : (cv === 'x' ? /^[+-]?(0[xX])?[0-9a-fA-F]+/ : /^[+-]?\d+/);
      const mm = rx.exec(inp.slice(this.ip)); if (!mm) return [cnt, 'int'];
      this.ip += mm[0].length;
      const num = cv === 'x' ? parseInt(mm[0], 16) : parseFloat(mm[0]);
      this.wr(addr, this.coerce((cv === 'f' || cv === 'e' || cv === 'E' || cv === 'g' || cv === 'G') ? num : Math.trunc(num), et || 'int')); cnt++;
    }
    return [cnt, 'int'];
  }
}

root.CInterp = {
  run(code, input, opt) {
    let vm;
    try {
      const prog = new Parser(lex(code)).parseProgram();
      vm = new VM(prog, input, opt);
      const exit = vm.run();
      return {out: vm.out, exit, err: null};
    } catch (e) {
      if (e.exit !== undefined) return {out: vm.out, exit: e.exit, err: null};
      if (e instanceof RangeError) return {out: vm ? vm.out : '', err: 'Tràn ngăn xếp (đệ quy quá sâu)', line: vm && vm.ln};
      if (e.cerr) return {out: vm ? vm.out : '', err: e.message, line: e.line, exit: -1};
      return {out: vm ? vm.out : '', err: 'Lỗi nội bộ: ' + e.message, exit: -1};
    }
  }
};
})(typeof window !== 'undefined' ? window : globalThis);

const fs = require('fs'), vm = require('vm');
const ctx = {console, globalThis: null}; ctx.globalThis = ctx; ctx.window = ctx; vm.createContext(ctx);
const load = f => vm.runInContext(fs.readFileSync(__dirname + '/../js/' + f, 'utf8'), ctx, {filename: f});
['cint.js', 'diagrams.js', 'anim.js', 'lessons1.js', 'lessons2.js', 'data.js'].forEach(load);
const get = n => vm.runInContext(n, ctx);
const LESSONS = get('LESSONS'), LABS = get('DEFAULT_LABS'), CI = get('CInterp');
let bad = 0;
for (const l of LESSONS) l.codes.forEach((c, i) => { const r = CI.run(c.c, c.input || ''); if (r.err) { bad++; console.log('LESSON', l.n, i + 1, r.err, 'line', r.line); } else if (!r.out) console.log('empty out', l.n, i + 1); });
console.log('lessons', LESSONS.length, 'bad', bad);
// lab solutions check: ensure starters at least compile/parse path & tests exist
for (const lab of LABS) { if (!lab.tests.length) console.log('no tests', lab.id); }
// reference solutions
const SOL = {
 'l-01': 'int main(){printf("Xin chao K19IT\\n");return 0;}',
 'l-02': 'int main(){int a,b;scanf("%d %d",&a,&b);printf("%d",a+b);}',
 'l-03': 'int main(){int n;scanf("%d",&n);if(n%2==0)printf("CHAN");else printf("LE");}',
 'l-04': 'int main(){float d;scanf("%f",&d);if(d>=8)printf("Gioi");else if(d>=6.5)printf("Kha");else if(d>=5)printf("Trung binh");else printf("Yeu");}',
 'l-05': 'int main(){float a,b;char op;scanf("%f %c %f",&a,&op,&b);if(op==\'/\'&&b==0){printf("Loi");return 0;}float r=op==\'+\'?a+b:op==\'-\'?a-b:op==\'*\'?a*b:a/b;printf("%.2f",r);}',
 'l-06': 'int main(){int n,s=0;scanf("%d",&n);for(int i=1;i<=n;i++)s+=i;printf("%d",s);}',
 'l-07': 'int main(){int n,ok=1;scanf("%d",&n);if(n<2)ok=0;for(int i=2;i*i<=n;i++)if(n%i==0)ok=0;printf(ok?"YES":"NO");}',
 'l-08': 'int main(){int n,r=0;scanf("%d",&n);while(n>0){r=r*10+n%10;n/=10;}printf("%d",r);}',
 'l-09': 'int main(){int n;scanf("%d",&n);for(int i=1;i<=n;i++){for(int j=0;j<i;j++)printf("*");printf("\\n");}}',
 'l-10': 'int ucln(int a,int b){while(b){int r=a%b;a=b;b=r;}return a;}int main(){int a,b;scanf("%d %d",&a,&b);printf("%d\\n",ucln(a,b));}',
 'l-11': 'int main(){int n,a[100];scanf("%d",&n);int m=0;for(int i=0;i<n;i++){scanf("%d",&a[i]);if(a[i]>a[m])m=i;}printf("%d %d",a[m],m);}',
 'l-12': 'int main(){int n,a[100];scanf("%d",&n);for(int i=0;i<n;i++)scanf("%d",&a[i]);for(int i=0;i<n;i++)for(int j=i+1;j<n;j++)if(a[j]<a[i]){int t=a[i];a[i]=a[j];a[j]=t;}for(int i=0;i<n;i++)printf(i?" %d":"%d",a[i]);}',
 'l-13': 'int main(){int n,a[10][10],s=0;scanf("%d",&n);for(int i=0;i<n;i++)for(int j=0;j<n;j++){scanf("%d",&a[i][j]);if(i==j)s+=a[i][j];}printf("%d",s);}'
};
const norm = s => s.replace(/\r/g, '').split('\n').map(l => l.replace(/\s+$/, '')).join('\n').trim();
for (const lab of LABS) for (const t of lab.tests) { const r = CI.run(SOL[lab.id], t.in); if (r.err || norm(r.out) !== norm(t.out)) { bad++; console.log('LAB', lab.id, JSON.stringify(t), '->', JSON.stringify(r.out), r.err); } }
console.log('total bad', bad);

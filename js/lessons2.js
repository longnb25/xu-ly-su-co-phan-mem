LESSONS.push({
  n: 10, title: 'Vòng lặp lồng nhau & vẽ hình', sub: 'In hình tam giác, hình chữ nhật, bảng cửu chương  ·  KIỂM TRA 15 PHÚT (lần 2)', test: '15p',
  goals: ['Hiểu vòng lặp lồng: vòng ngoài – vòng trong', 'In hình bằng ký tự *', 'Đếm số lần chạy của vòng lặp lồng', 'Giải bài toán dạng bảng'],
  theory: `
<p>Đặt một vòng lặp <b>bên trong</b> vòng lặp khác. Vòng ngoài chạy 1 lần thì vòng trong chạy đủ hết một lượt. Với n hàng × m cột, thân vòng trong chạy <b>n × m</b> lần.</p>
<pre><code>for (int i = 1; i &lt;= 4; i++) {      // hàng
    for (int j = 1; j &lt;= i; j++)    // cột
        printf("*");
    printf("\\n");
}</code></pre>
${D.ascii('*\n**\n***\n****', 'Kết quả: tam giác vuông (cột j chạy đến i)')}
${D.nested(4)}
<div class="note"><b>Mẹo:</b> luôn tự hỏi "hàng i cần in mấy ký tự?" – đó chính là điều kiện của vòng trong. Cây thông cân: hàng i cần (n - i) dấu cách và (2i - 1) dấu *.</div>`,
  diagram: '',
  codes: [
    {t: 'Hình chữ nhật & tam giác (nhập: 4)', c: R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= 2 * n; j++) printf("#");
        printf("\n");
    }
    printf("\n");
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++) printf("* ");
        printf("\n");
    }
    return 0;
}`, input: '4'},
    {t: 'Cây thông cân (nhập: 5)', c: R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) {
        for (int s = 1; s <= n - i; s++) printf(" ");
        for (int j = 1; j <= 2 * i - 1; j++) printf("*");
        printf("\n");
    }
    return 0;
}`, input: '5'}],
  ex: ['In hình vuông rỗng n × n (chỉ viền).', 'In tam giác ngược: n hàng, hàng đầu n sao.', 'In bảng cửu chương 2→9 dạng lưới.', 'In tam giác số: hàng i in 1 2 ... i.', 'Đếm và in tất cả cặp (a,b) với 1 ≤ a < b ≤ 10 và a + b = 10.']
});
LESSONS.push({
  n: 11, title: 'Hàm trong C (1): khai báo & gọi hàm', sub: 'Chia nhỏ chương trình, tham số, giá trị trả về',
  goals: ['Hiểu vì sao cần chia chương trình thành hàm', 'Khai báo hàm: kiểu trả về, tên, tham số', 'Gọi hàm và nhận giá trị trả về', 'Phân biệt hàm void và hàm có return'],
  theory: `
<p><b>Hàm</b> là khối lệnh có tên, làm một việc cụ thể và có thể tái sử dụng. Chia nhỏ chương trình bằng hàm giúp code <b>dễ đọc, dễ test, dễ sửa lỗi</b> – kỹ năng cốt lõi của người xử lí sự cố phần mềm.</p>
<pre><code>kiểu_trả_về tên_hàm(kiểu a, kiểu b) {
    ...
    return giá_trị;
}</code></pre>
${D.flow([{t: 'main() gọi binhPhuong(5)', k: 'proc'}, {t: 'Hàm nhận n = 5', k: 'io'}, {t: 'return n * n  (25)', k: 'proc'}, {t: 'main() nhận 25', k: 'proc'}], 'Dòng chảy khi gọi hàm')}
<ul><li><b>Tham số</b>: dữ liệu đưa vào hàm. <b>Giá trị trả về</b>: kết quả hàm gửi lại.</li><li>Hàm <code>void</code> không trả giá trị (chỉ thực hiện việc, ví dụ in).</li><li>Hàm phải được <b>định nghĩa (hoặc khai báo nguyên mẫu) trước khi gọi</b>.</li></ul>
<div class="note"><b>Biến cục bộ:</b> biến khai báo trong hàm chỉ sống trong hàm đó. Hai hàm có thể có hai biến cùng tên mà không ảnh hưởng nhau.</div>`,
  diagram: '',
  codes: [
    {t: 'Hàm tính toán cơ bản', c: R`#include <stdio.h>

int binhPhuong(int n) {
    return n * n;
}

int max2(int a, int b) {
    return (a > b) ? a : b;
}

void chaoMung(char ten[]) {
    printf("Xin chao %s!\n", ten);
}

int main() {
    chaoMung("K19IT");
    printf("5 binh phuong = %d\n", binhPhuong(5));
    printf("max(8, 13) = %d\n", max2(8, 13));
    return 0;
}`},
    {t: 'Hàm kiểm tra số nguyên tố (nhập: 29)', c: R`#include <stdio.h>

int laNguyenTo(int n) {
    if (n < 2) return 0;
    for (int i = 2; i * i <= n; i++)
        if (n % i == 0) return 0;
    return 1;
}

int main() {
    int n;
    scanf("%d", &n);
    if (laNguyenTo(n)) printf("%d la so nguyen to\n", n);
    else printf("%d khong phai so nguyen to\n", n);
    printf("Cac so nguyen to <= 30: ");
    for (int i = 1; i <= 30; i++) if (laNguyenTo(i)) printf("%d ", i);
    printf("\n");
    return 0;
}`, input: '29'}],
  ex: ['Viết hàm tinhChuVi(dai, rong) và tinhDienTich(dai, rong) cho hình chữ nhật.', 'Viết hàm xepLoai(float diem) trả về ký tự A/B/C/D.', 'Viết hàm giaiThua(n) và dùng nó tính tổ hợp C(n,k).', 'Viết hàm laNamNhuan(nam) rồi in các năm nhuận từ 2000 đến 2030.']
});
LESSONS.push({
  n: 12, title: 'Hàm trong C (2): truyền tham trị, con trỏ & swap', sub: 'Vì sao hàm swap "thường" không hoạt động?',
  goals: ['Hiểu truyền tham trị (bản sao)', 'Làm quen con trỏ: &, *', 'Viết hàm swap đúng bằng con trỏ', 'Hiểu đệ quy cơ bản'],
  theory: `
<p>Mặc định C <b>truyền tham trị</b>: hàm nhận <u>bản sao</u> của đối số. Sửa bản sao không làm đổi biến gốc.</p>
${D.mem([{n: 'a (main)', v: 5, t: 'int', a: '0x1000'}, {n: 'b (main)', v: 9, t: 'int', a: '0x1004'}, {n: 'a (hàm)', v: 5, t: 'copy', a: '0x2000'}, {n: 'b (hàm)', v: 9, t: 'copy', a: '0x2004'}], 'Hàm swap(int a, int b) làm việc trên bản sao ở vùng nhớ khác')}
<h3>Con trỏ</h3>
<ul><li><code>int *p;</code> – p là con trỏ, lưu <b>địa chỉ</b> của một biến int.</li><li><code>p = &amp;a;</code> – p trỏ đến a.</li><li><code>*p</code> – giá trị tại địa chỉ p trỏ tới (đọc/ghi được).</li></ul>
${D.mem([{n: 'a', v: 5, t: 'int', a: '0x1000'}, {n: 'p', v: '0x1000', t: 'int*', a: '0x1008'}], 'p lưu địa chỉ của a → *p chính là a')}
<h3>swap đúng</h3><p>Truyền <b>địa chỉ</b> <code>swap(&amp;a, &amp;b)</code>, hàm nhận <code>int *x, int *y</code> và hoán đổi <code>*x</code>, <code>*y</code>. Đây cũng là lý do <code>scanf</code> cần dấu &amp;!</p>
<h3>Đệ quy</h3><p>Hàm tự gọi chính nó, cần <b>điều kiện dừng</b>: n! = n × (n-1)!, 0! = 1.</p>`,
  diagram: D.swapVars(5, 9),
  codes: [
    {t: 'Swap sai và swap đúng', c: R`#include <stdio.h>

void swapSai(int a, int b) { int t = a; a = b; b = t; }
void swapDung(int *a, int *b) { int t = *a; *a = *b; *b = t; }

int main() {
    int x = 5, y = 9;
    swapSai(x, y);
    printf("Sau swapSai : x=%d y=%d\n", x, y);
    swapDung(&x, &y);
    printf("Sau swapDung: x=%d y=%d\n", x, y);
    return 0;
}`},
    {t: 'Con trỏ & đệ quy (nhập: 6)', c: R`#include <stdio.h>

long giaiThua(int n) {
    if (n <= 1) return 1;
    return n * giaiThua(n - 1);
}

int main() {
    int a = 10;
    int *p = &a;
    *p = *p + 5;
    printf("a = %d, *p = %d\n", a, *p);
    int n;
    scanf("%d", &n);
    printf("%d! = %ld\n", n, giaiThua(n));
    return 0;
}`, input: '6'}],
  ex: ['Viết hàm hoanDoi để đổi chỗ hai số thực.', 'Viết hàm tinhTongHieu(a, b, *tong, *hieu) trả hai kết quả qua con trỏ.', 'Dùng đệ quy tính tổng 1 + 2 + ... + n.', 'Dùng đệ quy tính số Fibonacci thứ n.']
});
LESSONS.push({
  n: 13, title: 'Mảng một chiều (1): khai báo & duyệt mảng', sub: 'Nhập, xuất, tổng, trung bình',
  goals: ['Hiểu mảng là dãy ô nhớ liên tiếp cùng kiểu', 'Khai báo, khởi tạo, truy cập phần tử', 'Duyệt mảng bằng for', 'Hiểu lỗi tràn chỉ số'],
  theory: `
<p>Cần lưu điểm của 40 sinh viên? Không ai khai báo 40 biến. <b>Mảng</b> là dãy các phần tử <b>cùng kiểu</b>, nằm liên tiếp trong bộ nhớ, truy cập bằng chỉ số bắt đầu từ <b>0</b>.</p>
<pre><code>int a[5] = {8, 6, 9, 4, 7};
a[0] = 10;       // phần tử đầu
a[4]             // phần tử cuối (chỉ số = n - 1)</code></pre>
${D.arr([8, 6, 9, 4, 7], 'a', [], 'Mảng 5 phần tử: chỉ số 0 → 4')}
${D.bars('Điểm của 5 sinh viên (lưu trong mảng diem[5])', ['SV0', 'SV1', 'SV2', 'SV3', 'SV4'], [8, 6, 9, 4, 7], 'Mỗi cột là một phần tử mảng')}
${D.sumArr([8, 6, 9, 4, 7])}
<div class="warn"><b>Tràn chỉ số:</b> <code>a[5]</code> hay <code>a[-1]</code> với mảng 5 phần tử là lỗi nghiêm trọng – ghi đè vùng nhớ khác, gây treo/ hỏng dữ liệu. Chương trình thật không báo lỗi, nên phải tự kiểm soát.</div>
<h3>Duyệt mảng</h3><pre><code>for (int i = 0; i &lt; n; i++) { /* dùng a[i] */ }</code></pre>`,
  diagram: '',
  codes: [
    {t: 'Nhập – xuất – tổng – trung bình (nhập: 5  8 6 9 4 7)', c: R`#include <stdio.h>

int main() {
    int n, a[100];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    int tong = 0;
    printf("Mang: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", a[i]);
        tong += a[i];
    }
    printf("\nTong = %d\nTrung binh = %.2f\n", tong, (float)tong / n);
    return 0;
}`, input: '5\n8 6 9 4 7'},
    {t: 'Đếm phần tử thỏa điều kiện', c: R`#include <stdio.h>

int main() {
    float diem[8] = {8.5, 4, 7, 9.5, 3.5, 6, 10, 5};
    int dat = 0;
    for (int i = 0; i < 8; i++)
        if (diem[i] >= 5) dat++;
    printf("Co %d/8 sinh vien dat\n", dat);
    printf("Phan tram dat: %.1f%%\n", dat * 100.0 / 8);
    return 0;
}`}],
  ex: ['Nhập n số nguyên, in các số chẵn trong mảng.', 'Đếm số phần tử dương, âm, bằng 0.', 'Tính tổng các phần tử ở vị trí chỉ số chẵn.', 'Nhập điểm n sinh viên, tính % sinh viên đạt (≥5).']
});
LESSONS.push({
  n: 14, title: 'Mảng một chiều (2): tìm kiếm, max/min, thêm xóa', sub: 'Thuật toán cơ bản trên mảng  ·  KIỂM TRA 1 TIẾT (lần 2)', test: '1 tiết',
  goals: ['Tìm giá trị lớn nhất / nhỏ nhất và vị trí', 'Tìm kiếm tuyến tính', 'Thêm và xóa phần tử', 'Truyền mảng vào hàm'],
  theory: `
<h3>Tìm max</h3><p>Giả sử phần tử đầu là lớn nhất, duyệt các phần tử còn lại, gặp số lớn hơn thì cập nhật.</p>
${D.findMax([4, 9, 2, 7, 5, 11, 3])}
<h3>Tìm kiếm tuyến tính</h3><p>Duyệt từ đầu, gặp x thì trả về chỉ số; hết mảng không thấy trả về -1.</p>
${D.search([4, 9, 2, 7, 5], 7)}
<h3>Xóa phần tử tại vị trí k</h3><p>Dồn các phần tử sau k lên một ô rồi giảm n: <code>for (i = k; i &lt; n-1; i++) a[i] = a[i+1]; n--;</code></p>
${D.deleteAt([1, 2, 3, 4, 5], 2)}
<div class="note"><b>Mảng truyền vào hàm</b> thực chất truyền <u>địa chỉ</u>: hàm sửa mảng thì mảng gốc đổi theo (khác với biến thường!). Phải truyền thêm kích thước n.</div>`,
  diagram: '',
  codes: [
    {t: 'Max, min và tìm kiếm', c: R`#include <stdio.h>

int timMax(int a[], int n) {
    int vt = 0;
    for (int i = 1; i < n; i++) if (a[i] > a[vt]) vt = i;
    return vt;
}

int timKiem(int a[], int n, int x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return i;
    return -1;
}

int main() {
    int a[8] = {4, 9, 2, 7, 5, 11, 3, 6};
    int vt = timMax(a, 8);
    printf("Max = %d tai vi tri %d\n", a[vt], vt);
    printf("Tim 7: vi tri %d\n", timKiem(a, 8, 7));
    printf("Tim 100: vi tri %d\n", timKiem(a, 8, 100));
    return 0;
}`},
    {t: 'Xóa & chèn phần tử', c: R`#include <stdio.h>

void in(int a[], int n) {
    for (int i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\n");
}

int main() {
    int a[10] = {1, 2, 3, 4, 5};
    int n = 5;
    for (int i = 2; i < n - 1; i++) a[i] = a[i + 1];
    n--;
    printf("Sau khi xoa vi tri 2: "); in(a, n);
    for (int i = n; i > 1; i--) a[i] = a[i - 1];
    a[1] = 99; n++;
    printf("Sau khi chen 99 vao vi tri 1: "); in(a, n);
    return 0;
}`}],
  ex: ['Tìm số lớn thứ hai trong mảng.', 'Đếm số lần x xuất hiện và in tất cả vị trí của nó.', 'Đảo ngược mảng tại chỗ.', 'Kiểm tra mảng có đối xứng không.', 'Tìm phần tử âm đầu tiên và phần tử dương cuối cùng.']
});
LESSONS.push({
  n: 15, title: 'Sắp xếp mảng một chiều', sub: 'Bubble sort, Selection sort, Insertion sort',
  goals: ['Hiểu bài toán sắp xếp tăng/giảm', 'Cài đặt Bubble sort và Selection sort', 'Quan sát từng bước để hiểu thuật toán', 'Biết so sánh hiệu quả (số lần so sánh)'],
  theory: `
<h3>Bubble sort (nổi bọt)</h3><p>Duyệt nhiều lượt, so sánh <b>hai phần tử kề nhau</b>, sai thứ tự thì đổi chỗ. Sau mỗi lượt, phần tử lớn nhất "nổi" về cuối.</p>
${D.bubble([5, 3, 8, 1, 4])}
<h3>Selection sort (chọn)</h3><p>Mỗi lượt chọn phần tử <b>nhỏ nhất</b> của phần chưa sắp xếp, đổi chỗ vào đầu phần đó.</p>
<pre><code>for (i = 0; i &lt; n-1; i++)
  for (j = i+1; j &lt; n; j++)
    if (a[j] &lt; a[i]) swap(a[i], a[j]);</code></pre>
${D.selection([6, 2, 9, 4, 1])}
${D.line('Số phép so sánh tối đa theo n (độ phức tạp O(n²))', ['n=5', 'n=10', 'n=20', 'n=40', 'n=80'], [{name: 'Bubble/Selection', pts: [10, 45, 190, 780, 3160]}, {name: 'Tuyến tính', pts: [5, 10, 20, 40, 80]}], 'Mảng gấp đôi → công việc gấp ~4: vì vậy thuật toán tốt hơn rất quan trọng với dữ liệu lớn')}
<div class="note"><b>Giảm dần:</b> chỉ cần đổi dấu so sánh từ &gt; thành &lt;.</div>`,
  diagram: '',
  codes: [
    {t: 'Bubble sort với in từng lượt', c: R`#include <stdio.h>

void in(int a[], int n) {
    for (int i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\n");
}

int main() {
    int a[6] = {5, 3, 8, 1, 4, 7};
    int n = 6;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (a[j] > a[j + 1]) {
                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
            }
        }
        printf("Luot %d: ", i + 1); in(a, n);
    }
    return 0;
}`},
    {t: 'Selection sort (nhập: 6  9 2 7 4 8 1)', c: R`#include <stdio.h>

int main() {
    int n, a[50];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    for (int i = 0; i < n - 1; i++) {
        int min = i;
        for (int j = i + 1; j < n; j++)
            if (a[j] < a[min]) min = j;
        int t = a[i]; a[i] = a[min]; a[min] = t;
    }
    printf("Tang dan : ");
    for (int i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\nGiam dan : ");
    for (int i = n - 1; i >= 0; i--) printf("%d ", a[i]);
    printf("\n");
    return 0;
}`, input: '6\n9 2 7 4 8 1'}],
  ex: ['Sắp xếp điểm của lớp giảm dần và in "Top 3".', 'Sắp xếp mảng chỉ các số chẵn tăng dần (số lẻ giữ nguyên vị trí).', 'Chèn một số vào mảng đã sắp xếp mà vẫn giữ thứ tự.', 'Đếm số lần hoán đổi của Bubble sort với một mảng cho trước.']
});
LESSONS.push({
  n: 16, title: 'Mảng hai chiều (1): khai báo & duyệt', sub: 'Ma trận, bảng điểm, hàng – cột',
  goals: ['Hiểu mảng 2 chiều như một bảng (hàng × cột)', 'Khai báo, khởi tạo, truy cập a[i][j]', 'Nhập, xuất ma trận bằng vòng for lồng', 'Tính tổng hàng, tổng cột'],
  theory: `
<p>Mảng hai chiều là "mảng của mảng": dùng để biểu diễn bảng, ma trận, bàn cờ, bảng điểm nhiều môn.</p>
<pre><code>int a[3][4] = { {1,2,3,4}, {5,6,7,8}, {9,10,11,12} };
// a[i][j]: hàng i, cột j  (bắt đầu từ 0)</code></pre>
${D.grid([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]], 'a', 'Mảng a[3][4]: 3 hàng, 4 cột. Phần tử a[1][2] = 7')}
<ul><li>Duyệt: vòng ngoài là <b>hàng i</b>, vòng trong là <b>cột j</b>.</li><li>Tổng hàng i: cộng a[i][0..m-1]. Tổng cột j: cộng a[0..n-1][j].</li></ul>
${D.matrix([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])}
${D.bars('Tổng từng hàng của ma trận trên', ['Hàng 0', 'Hàng 1', 'Hàng 2'], [10, 26, 42], 'Kết quả tổng hàng: 10, 26, 42')}
<div class="note"><b>Ứng dụng thực tế:</b> bảng điểm 5 sinh viên × 3 môn, sơ đồ chỗ ngồi rạp chiếu phim, bảng cửu chương, bàn cờ caro.</div>`,
  diagram: '',
  codes: [
    {t: 'In ma trận và tổng hàng/cột', c: R`#include <stdio.h>

int main() {
    int a[3][4] = { {1, 2, 3, 4}, {5, 6, 7, 8}, {9, 10, 11, 12} };
    for (int i = 0; i < 3; i++) {
        int th = 0;
        for (int j = 0; j < 4; j++) {
            printf("%4d", a[i][j]);
            th += a[i][j];
        }
        printf("  | tong hang = %d\n", th);
    }
    printf("Tong cot:");
    for (int j = 0; j < 4; j++) {
        int tc = 0;
        for (int i = 0; i < 3; i++) tc += a[i][j];
        printf("%4d", tc);
    }
    printf("\n");
    return 0;
}`},
    {t: 'Bảng điểm 3 SV × 3 môn (nhập 9 số)', c: R`#include <stdio.h>

int main() {
    float d[3][3];
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++)
            scanf("%f", &d[i][j]);
    printf("SV   Toan   Ly   Hoa   TB\n");
    for (int i = 0; i < 3; i++) {
        float s = 0;
        printf("%-4d", i + 1);
        for (int j = 0; j < 3; j++) { printf("%5.1f ", d[i][j]); s += d[i][j]; }
        printf("%5.2f\n", s / 3);
    }
    return 0;
}`, input: '8 7 9\n6 5.5 7\n9 9.5 10'}],
  ex: ['Nhập ma trận 3×3, in ma trận và tổng đường chéo chính.', 'Tìm phần tử lớn nhất của ma trận và vị trí của nó.', 'Đếm số phần tử chẵn trong ma trận.', 'Nhập bảng điểm 5 SV × 3 môn, in điểm trung bình môn của cả lớp.']
});
LESSONS.push({
  n: 17, title: 'Mảng hai chiều (2): ma trận ứng dụng', sub: 'Chuyển vị, cộng – nhân ma trận, đường chéo',
  goals: ['Cộng hai ma trận', 'Chuyển vị ma trận', 'Nhân ma trận', 'Xử lí đường chéo chính, phụ; truyền mảng 2 chiều vào hàm'],
  theory: `
<h3>Các phép toán ma trận</h3>
<ul><li><b>Cộng</b>: c[i][j] = a[i][j] + b[i][j] (hai ma trận cùng cỡ).</li><li><b>Chuyển vị</b>: t[j][i] = a[i][j] (đổi hàng thành cột).</li><li><b>Nhân</b> A(m×n) · B(n×p): c[i][j] = Σ a[i][k]·b[k][j].</li></ul>
${D.transpose([[1, 2, 3], [4, 5, 6]])}

<h3>Đường chéo</h3><p>Ma trận vuông n×n: đường chéo chính có <b>i == j</b>, đường chéo phụ có <b>i + j == n - 1</b>.</p>
<div class="note">Khi truyền mảng hai chiều vào hàm phải ghi rõ số cột: <code>void in(int a[][3], int n)</code>.</div>`,
  diagram: '',
  codes: [
    {t: 'Chuyển vị & đường chéo', c: R`#include <stdio.h>

int main() {
    int a[3][3] = { {1, 2, 3}, {4, 5, 6}, {7, 8, 9} };
    int t[3][3];
    int cheo1 = 0, cheo2 = 0;
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++) {
            t[j][i] = a[i][j];
            if (i == j) cheo1 += a[i][j];
            if (i + j == 2) cheo2 += a[i][j];
        }
    printf("Chuyen vi:\n");
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) printf("%3d", t[i][j]);
        printf("\n");
    }
    printf("Duong cheo chinh = %d, duong cheo phu = %d\n", cheo1, cheo2);
    return 0;
}`},
    {t: 'Nhân hai ma trận', c: R`#include <stdio.h>

int main() {
    int a[2][3] = { {1, 2, 3}, {4, 5, 6} };
    int b[3][2] = { {7, 8}, {9, 10}, {11, 12} };
    int c[2][2];
    for (int i = 0; i < 2; i++)
        for (int j = 0; j < 2; j++) {
            c[i][j] = 0;
            for (int k = 0; k < 3; k++) c[i][j] += a[i][k] * b[k][j];
        }
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 2; j++) printf("%5d", c[i][j]);
        printf("\n");
    }
    return 0;
}`}],
  ex: ['Cộng hai ma trận 3×3 nhập từ bàn phím.', 'Kiểm tra ma trận vuông có đối xứng qua đường chéo chính không.', 'In ma trận tam giác dưới (các phần tử i ≥ j).', 'Tìm hàng có tổng lớn nhất.', 'Mô phỏng sơ đồ ghế rạp phim 5×8, nhập chỗ đặt và in lại sơ đồ (X = đã đặt).']
});
LESSONS.push({
  n: 18, title: 'Tổng kết & dự án nhỏ: Quản lí điểm sinh viên', sub: 'Kết hợp: hàm + mảng + vòng lặp + switch (menu)',
  goals: ['Ôn tập toàn bộ kiến thức đã học', 'Viết chương trình hoàn chỉnh có menu', 'Chia chương trình thành các hàm', 'Biết cách gỡ lỗi (debug) khi chương trình sai'],
  theory: `
<p>Buổi cuối: ghép mọi kiến thức thành một ứng dụng nhỏ <b>Quản lí điểm</b>: nhập điểm, in danh sách, tìm điểm cao nhất, xếp hạng. Cấu trúc điển hình của chương trình có menu:</p>
${D.flow([{t: 'Bắt đầu', k: 'start'}, {t: 'In menu', k: 'io'}, {t: 'Nhập lựa chọn', k: 'io'}, {t: 'switch(lựa chọn)', k: 'dec', yes: 'gọi hàm', no: 'thoát'}, {t: 'Lặp lại đến khi chọn 0', k: 'proc'}], 'Khung chương trình menu: do-while + switch + hàm')}
<h3>Kỹ năng xử lí sự cố (debug)</h3>
<ul><li><b>Đọc kỹ thông báo lỗi</b>: dòng nào, lỗi gì.</li><li><b>In giá trị trung gian</b> bằng printf để xem biến thay đổi thế nào.</li><li><b>Thu hẹp phạm vi</b>: tắt/ cắt bớt code đến khi tìm ra đoạn gây lỗi.</li><li><b>Kiểm tra giá trị biên</b>: n = 0, n = 1, mảng đầy, số âm.</li><li>Chạy với nhiều bộ dữ liệu mẫu (test case).</li></ul>
${D.table(['Triệu chứng', 'Nguyên nhân hay gặp'], [['Ra kết quả 0 hoặc số lạ', 'Biến chưa gán giá trị / quên &'], ['Chia sai (3 thay vì 3.5)', 'Chia hai số nguyên'], ['Chương trình treo', 'Vòng lặp vô hạn'], ['Kết quả nhảy lung tung', 'Tràn chỉ số mảng'], ['Rớt nhánh switch', 'Quên break']], 'Bảng chẩn đoán lỗi nhanh')}`,
  diagram: '',
  codes: [
    {t: 'Dự án: menu quản lí điểm (nhập: 1  5  8 6 9 4 7  2  3  0)', c: R`#include <stdio.h>

int n = 0;
float d[100];

void nhap() {
    printf("So SV: "); scanf("%d", &n);
    for (int i = 0; i < n; i++) { printf("Diem SV %d: ", i + 1); scanf("%f", &d[i]); }
}
void in() {
    for (int i = 0; i < n; i++) printf("SV %d: %.1f\n", i + 1, d[i]);
}
void thongKe() {
    float max = d[0], min = d[0], s = 0;
    for (int i = 0; i < n; i++) {
        if (d[i] > max) max = d[i];
        if (d[i] < min) min = d[i];
        s += d[i];
    }
    printf("Cao nhat %.1f | Thap nhat %.1f | TB %.2f\n", max, min, s / n);
}

int main() {
    int c;
    do {
        printf("\n--- MENU ---\n1.Nhap 2.In 3.Thong ke 0.Thoat\nChon: ");
        scanf("%d", &c);
        switch (c) {
            case 1: nhap(); break;
            case 2: in(); break;
            case 3: thongKe(); break;
            case 0: printf("Tam biet!\n"); break;
            default: printf("Chon sai!\n");
        }
    } while (c != 0);
    return 0;
}`, input: '1\n5\n8 6 9 4 7\n2\n3\n0'}],
  ex: ['Thêm chức năng xếp hạng (sắp xếp giảm dần) vào dự án.', 'Thêm chức năng tìm sinh viên theo số thứ tự và sửa điểm.', 'Thêm thống kê: đếm số SV Giỏi, Khá, Trung bình, Yếu.', 'Xuất kết quả dạng bảng đẹp bằng printf với độ rộng cột.']
});

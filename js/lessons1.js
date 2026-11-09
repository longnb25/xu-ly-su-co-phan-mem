const R = String.raw;
const LESSONS = [];
LESSONS.push({
  n: 1, title: 'Làm quen ngôn ngữ C & chương trình đầu tiên', sub: 'Cấu trúc chương trình, printf, chú thích',
  goals: ['Biết C là gì, dùng để làm gì', 'Hiểu cấu trúc một chương trình C', 'Viết, biên dịch và chạy chương trình Hello World', 'Biết dùng printf và các ký tự điều khiển \\n, \\t'],
  theory: `
<p>Ngôn ngữ <b>C</b> do Dennis Ritchie tạo ra năm 1972. C nhanh, gọn và là nền tảng của hệ điều hành (Linux, Windows), vi điều khiển, trò chơi... Học C giúp bạn hiểu máy tính hoạt động thế nào – rất hợp với việc <b>xử lí sự cố phần mềm</b>: muốn sửa lỗi phải đọc hiểu chương trình trước.</p>
<h3>Quy trình từ mã nguồn đến chương trình chạy</h3>
<p>Soạn mã (.c) → <b>Biên dịch</b> (compile, bắt lỗi cú pháp) → <b>Liên kết</b> (link) → file .exe → <b>Chạy</b>. Trên web này, nút <b>Biên dịch &amp; Chạy</b> làm cả chuỗi đó cho bạn.</p>
<h3>Cấu trúc một chương trình C</h3>
<ul><li><code>#include &lt;stdio.h&gt;</code>: nạp thư viện nhập/xuất.</li><li><code>int main()</code>: hàm chính – chương trình bắt đầu chạy từ đây.</li><li>Mỗi câu lệnh kết thúc bằng dấu <code>;</code>. Khối lệnh nằm trong <code>{ }</code>.</li><li><code>return 0;</code>: báo chương trình kết thúc bình thường.</li></ul>
<div class="note"><b>Chú thích</b>: <code>// một dòng</code> hoặc <code>/* nhiều dòng */</code> – trình biên dịch bỏ qua, dùng để giải thích code.</div>
<h3>Ký tự điều khiển trong printf</h3>
${D.table(['Ký tự', 'Ý nghĩa'], [['\\n', 'xuống dòng'], ['\\t', 'thụt tab'], ['\\\\', 'in dấu \\'], ['\\"', 'in dấu "'], ['%%', 'in dấu %']], '')}
<div class="warn"><b>Lỗi thường gặp:</b> quên dấu <code>;</code>, quên đóng <code>}</code>, viết <code>Printf</code> hoa chữ P (C phân biệt hoa/thường).</div>`,
  diagram: D.flow([{t: 'Bắt đầu', k: 'start'}, {t: 'Soạn mã .c', k: 'proc'}, {t: 'Biên dịch', k: 'proc'}, {t: 'Có lỗi?', k: 'dec', yes: 'sửa mã', no: 'tiếp'}, {t: 'Chạy chương trình', k: 'proc'}, {t: 'Kết thúc', k: 'start'}], 'Lưu đồ quy trình viết chương trình C'),
  codes: [
    {t: 'Hello World', c: R`#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    printf("Xin chao lop K19IT\n");
    return 0;
}`},
    {t: 'In danh thiếp bằng ký tự điều khiển', c: R`#include <stdio.h>

int main() {
    printf("=============================\n");
    printf("Ho ten\t: Nguyen Van A\n");
    printf("Lop\t: K19IT\n");
    printf("Mon\t: \"Xu ly su co phan mem\"\n");
    printf("=============================\n");
    return 0;
}`}],
  ex: ['In ra màn hình lời chào kèm tên và lớp của bạn.', 'In bảng thời khóa biểu 3 dòng (Thứ – Môn – Phòng) căn cột bằng \\t.', 'In hình tam giác bằng dấu * gồm 4 dòng.', 'Cố ý xóa dấu ; ở một dòng, biên dịch và đọc thông báo lỗi – ghi lại lỗi nói gì.']
});
LESSONS.push({
  n: 2, title: 'Kiểu dữ liệu & biến', sub: 'int, float, double, char – khai báo, gán giá trị',
  goals: ['Phân biệt các kiểu dữ liệu cơ bản', 'Khai báo biến, đặt tên đúng quy tắc', 'Hiểu biến là một ô nhớ có tên', 'Dùng sizeof để xem kích thước kiểu'],
  theory: `
<p><b>Biến</b> là vùng nhớ có tên dùng để lưu dữ liệu. Trước khi dùng phải <b>khai báo</b> kiểu: <code>kiểu tên_biến;</code> hoặc vừa khai báo vừa gán <code>int tuoi = 20;</code>.</p>
${D.table(['Kiểu', 'Ý nghĩa', 'Kích thước', 'Ví dụ'], [['int', 'số nguyên', '4 byte', '25, -7'], ['float', 'số thực (7 chữ số)', '4 byte', '3.14f'], ['double', 'số thực (15 chữ số)', '8 byte', '3.14159265'], ['char', 'một ký tự', '1 byte', "'A'"], ['long', 'số nguyên lớn', '4–8 byte', '1000000']], '')}
${D.bars('Kích thước các kiểu dữ liệu (byte)', ['char', 'int', 'float', 'long', 'double'], [1, 4, 4, 4, 8], 'Kiểu càng "to" càng tốn bộ nhớ', ' B')}
<h3>Quy tắc đặt tên biến</h3>
<ul><li>Gồm chữ, số, dấu <code>_</code>; <b>không</b> bắt đầu bằng số; không chứa khoảng trắng.</li><li>Không trùng từ khóa (<code>int</code>, <code>if</code>, <code>for</code>...).</li><li>Phân biệt hoa/thường: <code>diem</code> khác <code>Diem</code>.</li><li>Đặt tên có nghĩa: <code>diemToan</code> tốt hơn <code>x1</code>.</li></ul>
${D.mem([{n: 'tuoi', v: 20, t: 'int', a: '0x1000'}, {n: 'diem', v: 8.5, t: 'float', a: '0x1004'}, {n: 'xep', v: "'A'", t: 'char', a: '0x1008'}], 'Mỗi biến là một ô nhớ có tên, kiểu, địa chỉ và giá trị')}
<div class="note"><b>Chia số nguyên:</b> <code>7 / 2</code> cho kết quả <b>3</b> (cắt phần thập phân). Muốn 3.5 phải có ít nhất một số thực: <code>7 / 2.0</code>.</div>`,
  diagram: '',
  codes: [
    {t: 'Khai báo & in biến', c: R`#include <stdio.h>

int main() {
    int tuoi = 20;
    float diem = 8.5;
    char xep = 'A';
    printf("Tuoi: %d\n", tuoi);
    printf("Diem: %.1f\n", diem);
    printf("Xep loai: %c\n", xep);
    return 0;
}`},
    {t: 'Kích thước kiểu dữ liệu', c: R`#include <stdio.h>

int main() {
    printf("char   : %d byte\n", (int)sizeof(char));
    printf("int    : %d byte\n", (int)sizeof(int));
    printf("float  : %d byte\n", (int)sizeof(float));
    printf("double : %d byte\n", (int)sizeof(double));
    printf("7/2   = %d\n", 7 / 2);
    printf("7/2.0 = %.1f\n", 7 / 2.0);
    return 0;
}`}],
  ex: ['Khai báo biến lưu tên viết tắt (char), tuổi (int), chiều cao 1.65 (float) và in ra.', 'Một món hàng giá 15000, mua 3 cái. Dùng biến tính và in tổng tiền.', 'Đổi 100 độ C sang độ F: F = C * 9 / 5 + 32. Thử viết 9/5 và 9.0/5 xem khác gì.', 'Tìm vì sao khai báo int 2lop; bị lỗi và sửa lại cho đúng.']
});
LESSONS.push({
  n: 3, title: 'Hằng, toán tử & biểu thức', sub: 'const, #define, + - * / %, ++ --, ép kiểu',
  goals: ['Khai báo hằng bằng const và #define', 'Dùng thành thạo toán tử số học', 'Hiểu ++, --, +=, -=', 'Ép kiểu và độ ưu tiên toán tử'],
  theory: `
<p><b>Hằng</b> là giá trị không đổi trong suốt chương trình. Có 2 cách: <code>const float PI = 3.14159;</code> và <code>#define VAT 10</code> (không có dấu ; và dấu =).</p>
${D.table(['Toán tử', 'Ý nghĩa', 'Ví dụ', 'Kết quả'], [['+ - *', 'cộng trừ nhân', '5 * 3', '15'], ['/', 'chia', '9 / 2', '4 (nguyên)'], ['%', 'chia lấy dư', '9 % 2', '1'], ['++', 'tăng 1', 'i++', 'i = i + 1'], ['+=', 'cộng dồn', 'x += 5', 'x = x + 5']], '')}
<h3>Ứng dụng của %</h3>
<ul><li>Kiểm tra chẵn/lẻ: <code>n % 2 == 0</code>.</li><li>Lấy chữ số cuối: <code>n % 10</code>; bỏ chữ số cuối: <code>n / 10</code>.</li><li>Đổi giây ra giờ–phút–giây.</li></ul>
<h3>Độ ưu tiên</h3><p>Ngoặc <code>( )</code> → <code>* / %</code> → <code>+ -</code>. Khi không chắc, hãy dùng ngoặc.</p>
<div class="note"><b>i++ và ++i:</b> <code>a = i++</code> gán trước rồi mới tăng; <code>a = ++i</code> tăng trước rồi mới gán.</div>
<h3>Ép kiểu</h3><p><code>(float)a / b</code> ép <code>a</code> thành số thực trước khi chia – cách chuẩn để tính trung bình.</p>`,
  diagram: D.digits(4125),
  codes: [
    {t: 'Hằng và toán tử', c: R`#include <stdio.h>
#define VAT 10

int main() {
    const float PI = 3.14159;
    float r = 5;
    printf("Chu vi   = %.2f\n", 2 * PI * r);
    printf("Dien tich= %.2f\n", PI * r * r);
    int gia = 200000;
    printf("Gia sau VAT = %d\n", gia + gia * VAT / 100);
    return 0;
}`},
    {t: 'Tách số & đổi thời gian', c: R`#include <stdio.h>

int main() {
    int n = 4125;
    printf("Chu so cuoi: %d\n", n % 10);
    printf("Bo chu so cuoi: %d\n", n / 10);
    int giay = 3725;
    printf("%d giay = %d gio %d phut %d giay\n", giay, giay / 3600, giay % 3600 / 60, giay % 60);
    int a = 5, b = 2;
    printf("Trung binh: %.2f\n", (float)(a + b) / 2);
    return 0;
}`}],
  ex: ['Tính diện tích hình tròn bán kính 7 với PI là hằng.', 'Hóa đơn điện: 150 kWh × 2500đ + 8% VAT. In tổng tiền.', 'Cho số 3 chữ số 539, in ra từng chữ số hàng trăm, chục, đơn vị.', 'Đổi 9000 giây ra giờ:phút:giây.']
});
LESSONS.push({
  n: 4, title: 'Nhập xuất dữ liệu: printf & scanf', sub: 'Định dạng %d %f %c %s, nhập từ bàn phím  ·  KIỂM TRA 15 PHÚT (lần 1)', test: '15p',
  goals: ['Dùng scanf nhập số nguyên, số thực, ký tự', 'Định dạng số: độ rộng, số lẻ', 'Hiểu dấu & trước tên biến', 'Viết chương trình nhập – xử lí – xuất'],
  theory: `
<p>Chương trình hữu ích phải <b>nhận dữ liệu từ người dùng</b>. Hàm <code>scanf("%d", &amp;n);</code> đọc một số nguyên vào biến <code>n</code>. Dấu <code>&amp;</code> là "địa chỉ của" – scanf cần biết ghi vào ô nhớ nào.</p>
${D.table(['Mã', 'Kiểu', 'scanf', 'printf'], [['%d', 'int', 'có', 'có'], ['%f', 'float', 'có', 'có (%.2f: 2 số lẻ)'], ['%lf', 'double', 'có (bắt buộc)', 'có'], ['%c', 'char', 'có', 'có'], ['%s', 'chuỗi', 'có (không &)', 'có'], ['%5d', 'rộng 5', '-', 'căn phải'], ['%-5d', 'rộng 5', '-', 'căn trái']], '')}
<div class="warn"><b>Quên dấu &amp;</b> trong scanf là lỗi kinh điển, làm chương trình hỏng. Riêng chuỗi (<code>%s</code>) thì không cần &amp;.</div>
<div class="note"><b>Nhập ký tự:</b> sau khi nhập số bằng Enter, ký tự '\\n' còn lại trong bộ đệm. Dùng <code>scanf(" %c", &amp;ch);</code> (có khoảng trắng trước %c) để bỏ qua nó.</div>
<p>Trên web này, hãy gõ dữ liệu vào ô <b>"Dữ liệu nhập (stdin)"</b> trước khi bấm chạy, mỗi giá trị cách nhau bởi khoảng trắng hoặc xuống dòng.</p>`,
  diagram: D.flow([{t: 'Bắt đầu', k: 'start'}, {t: 'Nhập a, b', k: 'io'}, {t: 'tong = a + b', k: 'proc'}, {t: 'In tong', k: 'io'}, {t: 'Kết thúc', k: 'start'}], 'Mô hình Nhập → Xử lí → Xuất'),
  codes: [
    {t: 'Cộng hai số (nhập: 7 5)', c: R`#include <stdio.h>

int main() {
    int a, b;
    printf("Nhap a, b: ");
    scanf("%d %d", &a, &b);
    printf("%d + %d = %d\n", a, b, a + b);
    printf("Trung binh = %.2f\n", (a + b) / 2.0);
    return 0;
}`, input: '7 5'},
    {t: 'Phiếu điểm (nhập: Nam 8.5)', c: R`#include <stdio.h>

int main() {
    char ten[30];
    float diem;
    scanf("%s %f", ten, &diem);
    printf("+----------+-------+\n");
    printf("| %-8s | %5.1f |\n", ten, diem);
    printf("+----------+-------+\n");
    return 0;
}`, input: 'Nam 8.5'}],
  ex: ['Nhập chiều dài, chiều rộng; in chu vi và diện tích hình chữ nhật.', 'Nhập 3 điểm (Toán, Lý, Hóa) kiểu float, in điểm trung bình với 2 số lẻ.', 'Nhập số tiền VNĐ và tỉ giá, in số USD quy đổi.', 'Nhập họ tên (không dấu, 1 từ) và năm sinh, in ra tuổi hiện tại.']
});
LESSONS.push({
  n: 5, title: 'Câu lệnh rẽ nhánh if – else', sub: 'Toán tử so sánh, logic, if, else, else if',
  goals: ['Dùng toán tử so sánh & logic', 'Viết if, if-else, else-if nhiều nhánh', 'Đọc lưu đồ rẽ nhánh', 'Giải bài toán xếp loại, so sánh'],
  theory: `
<p>Chương trình cần <b>ra quyết định</b>: nếu điều kiện đúng thì làm việc này, ngược lại làm việc khác.</p>
<pre><code>if (điều_kiện) { ... } else { ... }</code></pre>
${D.table(['So sánh', 'Ý nghĩa', 'Logic', 'Ý nghĩa'], [['==', 'bằng', '&&', 'và (cả hai đúng)'], ['!=', 'khác', '||', 'hoặc (một đúng)'], ['> >=', 'lớn hơn', '!', 'phủ định'], ['< <=', 'nhỏ hơn', '', '']], '')}
<div class="warn"><b>Nhầm lẫn kinh điển:</b> <code>if (a = 5)</code> là <u>gán</u> (luôn đúng), phải viết <code>if (a == 5)</code> để <u>so sánh</u>.</div>
<h3>else if – nhiều nhánh</h3><p>Xếp loại học lực: ≥8 Giỏi, ≥6.5 Khá, ≥5 Trung bình, còn lại Yếu. Điều kiện được kiểm tra từ trên xuống, nhánh đầu đúng sẽ chạy rồi thoát.</p>`,
  diagram: D.flow([{t: 'Bắt đầu', k: 'start'}, {t: 'Nhập diem', k: 'io'}, {t: 'diem >= 5 ?', k: 'dec', yes: 'DAT', no: 'KHONG DAT'}, {t: 'In kết quả', k: 'io'}, {t: 'Kết thúc', k: 'start'}], 'Lưu đồ if – else'),
  codes: [
    {t: 'Đạt / Không đạt (nhập: 6.5)', c: R`#include <stdio.h>

int main() {
    float diem;
    printf("Nhap diem: ");
    scanf("%f", &diem);
    if (diem >= 5) {
        printf("DAT\n");
    } else {
        printf("KHONG DAT\n");
    }
    return 0;
}`, input: '6.5'},
    {t: 'Xếp loại học lực (nhập: 7.2)', c: R`#include <stdio.h>

int main() {
    float d;
    scanf("%f", &d);
    if (d < 0 || d > 10) printf("Diem khong hop le\n");
    else if (d >= 8) printf("Gioi\n");
    else if (d >= 6.5) printf("Kha\n");
    else if (d >= 5) printf("Trung binh\n");
    else printf("Yeu\n");
    return 0;
}`, input: '7.2'}],
  ex: ['Nhập số nguyên, cho biết chẵn hay lẻ.', 'Nhập 2 số, in số lớn hơn.', 'Nhập tuổi: <18 "Vị thành niên", 18–59 "Trưởng thành", ≥60 "Cao tuổi".', 'Nhập 3 cạnh, kiểm tra có tạo thành tam giác không (tổng 2 cạnh > cạnh còn lại).']
});
LESSONS.push({
  n: 6, title: 'if lồng nhau & toán tử ?:', sub: 'Giải phương trình, năm nhuận, tính tiền điện',
  goals: ['Viết if lồng nhau hợp lí', 'Kết hợp điều kiện bằng && ||', 'Dùng toán tử ba ngôi ?:', 'Giải các bài toán thực tế có nhiều điều kiện'],
  theory: `
<p>if có thể đặt <b>trong</b> if khác để kiểm tra điều kiện theo tầng. Tuy nhiên nên dùng <code>&amp;&amp;</code> khi có thể để code gọn.</p>
<h3>Bài toán điển hình</h3>
<ul><li><b>Giải phương trình bậc nhất</b> ax + b = 0: nếu a ≠ 0 → x = -b/a; nếu a = 0: b = 0 vô số nghiệm, b ≠ 0 vô nghiệm.</li><li><b>Năm nhuận</b>: chia hết cho 400, hoặc chia hết cho 4 mà không chia hết cho 100.</li><li><b>Tiền điện bậc thang</b>: mỗi bậc một đơn giá.</li></ul>
<h3>Toán tử ba ngôi</h3><pre><code>max = (a > b) ? a : b;</code></pre><p>Đọc là: "nếu a &gt; b thì lấy a, ngược lại lấy b".</p>
${D.bars('Tiền điện bậc thang (đơn giá đ/kWh)', ['Bậc 1', 'Bậc 2', 'Bậc 3', 'Bậc 4'], [1800, 2000, 2400, 3000], 'Dùng càng nhiều, giá mỗi kWh càng cao → cần if / else if')}`,
  diagram: '',
  codes: [
    {t: 'Năm nhuận (nhập: 2024)', c: R`#include <stdio.h>

int main() {
    int nam;
    scanf("%d", &nam);
    if ((nam % 400 == 0) || (nam % 4 == 0 && nam % 100 != 0))
        printf("%d la nam nhuan\n", nam);
    else
        printf("%d khong phai nam nhuan\n", nam);
    return 0;
}`, input: '2024'},
    {t: 'Tiền điện (nhập: 130)', c: R`#include <stdio.h>

int main() {
    int kwh;
    float tien;
    scanf("%d", &kwh);
    if (kwh <= 50) tien = kwh * 1800;
    else if (kwh <= 100) tien = 50 * 1800 + (kwh - 50) * 2000;
    else tien = 50 * 1800 + 50 * 2000 + (kwh - 100) * 2400;
    printf("Tien dien: %.0f dong\n", tien);
    int a = 7, b = 12;
    printf("So lon hon: %d\n", (a > b) ? a : b);
    return 0;
}`, input: '130'}],
  ex: ['Giải phương trình bậc nhất ax + b = 0 (nhập a, b).', 'Giải phương trình bậc hai ax² + bx + c = 0 (dùng sqrt, cần delta).', 'Nhập tháng 1–12, in số ngày của tháng (chú ý tháng 2).', 'Viết chương trình tính cước taxi: 0–1km: 12000đ; 1–10km: 11000đ/km; trên 10km: 9500đ/km.']
});
LESSONS.push({
  n: 7, title: 'Cấu trúc switch – case', sub: 'Menu lựa chọn, máy tính bỏ túi',
  goals: ['Dùng switch-case thay cho chuỗi else if', 'Hiểu vai trò của break và default', 'Viết menu lựa chọn', 'Biết khi nào nên dùng if, khi nào dùng switch'],
  theory: `
<p><code>switch</code> chọn nhánh theo <b>giá trị cụ thể</b> của một biểu thức nguyên/ký tự – rất hợp cho menu và máy tính.</p>
<pre><code>switch (biểu_thức) {
    case giá_trị_1: ...; break;
    case giá_trị_2: ...; break;
    default: ...;
}</code></pre>
<div class="warn"><b>Quên break</b> → chương trình chạy "rớt" xuống các case bên dưới (fall-through). Đây là lỗi hay gặp nhất.</div>
<div class="note"><b>Khi nào dùng?</b> So sánh bằng với nhiều giá trị rời rạc (1, 2, 3, 'a', '+') → switch. Điều kiện theo khoảng (điểm ≥ 8) → if / else if.</div>
${D.flow([{t: 'Nhập thu (2–8)', k: 'io'}, {t: 'switch(thu)', k: 'dec', yes: 'case khớp', no: 'default'}, {t: 'In tên thứ + break', k: 'io'}], 'Switch chọn đúng nhánh rồi thoát nhờ break')}`,
  diagram: '',
  codes: [
    {t: 'Tên thứ (nhập: 4)', c: R`#include <stdio.h>

int main() {
    int thu;
    scanf("%d", &thu);
    switch (thu) {
        case 2: printf("Thu Hai\n"); break;
        case 3: printf("Thu Ba\n"); break;
        case 4: printf("Thu Tu\n"); break;
        case 5: printf("Thu Nam\n"); break;
        case 6: printf("Thu Sau\n"); break;
        case 7: printf("Thu Bay\n"); break;
        case 8: printf("Chu Nhat\n"); break;
        default: printf("Khong hop le\n");
    }
    return 0;
}`, input: '4'},
    {t: 'Máy tính bỏ túi (nhập: 12 * 3)', c: R`#include <stdio.h>

int main() {
    float a, b;
    char op;
    scanf("%f %c %f", &a, &op, &b);
    switch (op) {
        case '+': printf("%.2f\n", a + b); break;
        case '-': printf("%.2f\n", a - b); break;
        case '*': printf("%.2f\n", a * b); break;
        case '/':
            if (b != 0) printf("%.2f\n", a / b);
            else printf("Khong chia duoc cho 0\n");
            break;
        default: printf("Phep toan sai\n");
    }
    return 0;
}`, input: '12 * 3'}],
  ex: ['Nhập tháng, in tên quý (1–3: Quý I...) bằng switch với case chồng nhau.', 'Menu quán cà phê: 1-Cà phê 20k, 2-Trà 15k, 3-Nước ép 25k, nhập món và số ly, in tiền.', 'Nhập điểm chữ A/B/C/D/F, in nhận xét tương ứng.', 'Nâng cấp máy tính: thêm phép % cho số nguyên.']
});
LESSONS.push({
  n: 8, title: 'Vòng lặp for', sub: 'Lặp theo số lần biết trước, tổng, tích, bảng cửu chương  ·  KIỂM TRA 1 TIẾT (lần 1)', test: '1 tiết',
  goals: ['Hiểu cấu trúc for (khởi tạo; điều kiện; bước nhảy)', 'Tính tổng, tích, đếm bằng vòng lặp', 'In bảng cửu chương, dãy số', 'Tránh lỗi vòng lặp vô hạn'],
  theory: `
<p>Khi cần lặp lại việc theo <b>số lần biết trước</b>, dùng <code>for</code>:</p>
<pre><code>for (int i = 1; i &lt;= 10; i++) {
    // thân vòng lặp
}</code></pre>
<p>Ba phần: <b>khởi tạo</b> (chạy 1 lần) → <b>kiểm tra điều kiện</b> (đúng thì chạy thân) → <b>bước nhảy</b> (sau mỗi vòng) → quay lại kiểm tra.</p>
${D.flow([{t: 'i = 1', k: 'proc'}, {t: 'i <= 5 ?', k: 'dec', yes: 'chạy thân', no: 'thoát'}, {t: 'tong += i', k: 'proc'}, {t: 'i++  → quay lại', k: 'proc'}], 'Lưu đồ vòng for: tổng 1 + 2 + ... + 5')}
${D.line('Tổng S = 1+2+...+n tăng nhanh theo n', ['n=1', 'n=2', 'n=3', 'n=4', 'n=5', 'n=6', 'n=7', 'n=8'], [{name: 'S(n)', pts: [1, 3, 6, 10, 15, 21, 28, 36]}, {name: 'n', pts: [1, 2, 3, 4, 5, 6, 7, 8]}], 'Đồ thị minh họa: mỗi vòng lặp cộng dồn thêm i vào tổng')}
<h3>Mẫu thuật toán hay dùng</h3>
<ul><li><b>Tổng:</b> <code>tong = 0; ... tong += i;</code></li><li><b>Tích (giai thừa):</b> <code>t = 1; ... t *= i;</code></li><li><b>Đếm:</b> <code>dem = 0; if (điều kiện) dem++;</code></li></ul>
<div class="warn"><b>Vòng lặp vô hạn:</b> <code>for (i = 1; i &gt;= 1; i++)</code> không bao giờ dừng. Web sẽ tự dừng sau số bước lớn và báo lỗi.</div>`,
  diagram: '',
  codes: [
    {t: 'Tổng & giai thừa (nhập: 5)', c: R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int tong = 0;
    long gt = 1;
    for (int i = 1; i <= n; i++) {
        tong += i;
        gt *= i;
    }
    printf("1+2+...+%d = %d\n", n, tong);
    printf("%d! = %ld\n", n, gt);
    return 0;
}`, input: '5'},
    {t: 'Bảng cửu chương (nhập: 7)', c: R`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= 10; i++)
        printf("%d x %2d = %3d\n", n, i, n * i);
    int dem = 0;
    for (int i = 1; i <= 100; i++)
        if (i % 7 == 0) dem++;
    printf("Co %d so chia het cho 7 trong 1..100\n", dem);
    return 0;
}`, input: '7'}],
  ex: ['In các số chẵn từ 1 đến 50.', 'Tính tổng các số lẻ từ 1 đến n.', 'Đếm số ước của n (nhập n).', 'Nhập n, kiểm tra n có phải số nguyên tố không (dùng for và biến cờ).', 'Tính lãi kép: gửi 10 triệu, lãi 6%/năm, in số tiền từng năm trong 5 năm.']
});
LESSONS.push({
  n: 9, title: 'Vòng lặp while & do – while', sub: 'Lặp theo điều kiện, break, continue, kiểm tra dữ liệu nhập',
  goals: ['Phân biệt while và do-while', 'Dùng break, continue', 'Kiểm tra dữ liệu nhập bằng vòng lặp', 'Giải bài toán chưa biết trước số lần lặp'],
  theory: `
<p>Khi <b>không biết trước số lần lặp</b> (ví dụ nhập đến khi người dùng nhập 0), dùng <code>while</code>:</p>
<pre><code>while (điều_kiện) { ... }       // kiểm tra trước, có thể không chạy lần nào
do { ... } while (điều_kiện);   // chạy ít nhất 1 lần</code></pre>
${D.digits(2579, 'while: tách chữ số cho đến khi n = 0')}
<ul><li><code>break</code>: thoát hẳn khỏi vòng lặp.</li><li><code>continue</code>: bỏ qua phần còn lại của vòng này, sang vòng kế.</li></ul>
<div class="tip note"><b>Mẹo thực tế:</b> do-while rất hợp để bắt người dùng nhập lại đến khi hợp lệ (điểm 0–10, mật khẩu đúng...).</div>
<h3>Bài toán kinh điển</h3><ul><li>Đếm / tổng các chữ số của một số.</li><li>Đảo ngược số.</li><li>Ước chung lớn nhất (thuật toán Euclid): while (b != 0) { r = a % b; a = b; b = r; }</li></ul>`,
  diagram: '',
  codes: [
    {t: 'Tổng chữ số (nhập: 2579)', c: R`#include <stdio.h>

int main() {
    int n, tong = 0, dem = 0;
    scanf("%d", &n);
    int goc = n;
    while (n > 0) {
        tong += n % 10;
        n /= 10;
        dem++;
    }
    printf("So %d co %d chu so, tong = %d\n", goc, dem, tong);
    return 0;
}`, input: '2579'},
    {t: 'Nhập điểm hợp lệ + UCLN (nhập: -3 11 7.5 48 36)', c: R`#include <stdio.h>

int main() {
    float d;
    do {
        printf("Nhap diem (0-10): ");
        scanf("%f", &d);
    } while (d < 0 || d > 10);
    printf("\nDiem hop le: %.1f\n", d);
    int a, b;
    scanf("%d %d", &a, &b);
    while (b != 0) { int r = a % b; a = b; b = r; }
    printf("UCLN = %d\n", a);
    return 0;
}`, input: '-3 11 7.5 48 36'}],
  ex: ['Đảo ngược số nguyên (1234 → 4321).', 'Cho tới khi người dùng nhập 0 thì dừng, in tổng các số đã nhập.', 'Kiểm tra số đối xứng (121, 1331...).', 'Trò chơi đoán số: máy chọn số cố định, người chơi nhập đến khi đúng, báo "lớn hơn/nhỏ hơn" và đếm số lần.']
});

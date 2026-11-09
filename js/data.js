/* Đề trắc nghiệm & bài thực hành mẫu (có sẵn). Admin có thể tạo thêm trên web. */
const Q = (q, o, a, code) => ({q, o, a, code});
const DEFAULT_QUIZZES = [
  {id: 'd-15p-1', title: 'Kiểm tra 15 phút lần 1 (Buổi 4)', kind: '15p', col: 'k15_1', minutes: 15, builtin: true, questions: [
    Q('Kiểu dữ liệu nào dùng để lưu số nguyên?', ['float', 'int', 'char', 'double'], 1),
    Q('Hàm nào dùng để nhập dữ liệu từ bàn phím?', ['printf', 'scanf', 'main', 'return'], 1),
    Q('Kết quả của biểu thức 7 / 2 (hai số nguyên) là?', ['3.5', '4', '3', '2'], 2),
    Q('Mã định dạng in số thực với 2 chữ số lẻ là?', ['%d', '%2f', '%.2f', '%c'], 2),
    Q('Đoạn nào khai báo hằng đúng?', ['const int N = 5;', 'int const;', 'constant N = 5;', 'N := 5;'], 0),
    Q('Ký tự điều khiển xuống dòng trong printf là?', ['\\t', '\\n', '\\r\\n', '\\\\'], 1),
    Q('Khi dùng scanf cho biến int a, ta viết?', ['scanf("%d", a);', 'scanf("%d", &a);', 'scanf("%f", &a);', 'scanf(a);'], 1),
    Q('Biến nào đặt tên SAI quy tắc?', ['diem_toan', 'so1', '1so', '_tong'], 2),
    Q('Giá trị của 17 % 5 là?', ['3', '2', '1', '0'], 1),
    Q('Kích thước kiểu char là?', ['1 byte', '2 byte', '4 byte', '8 byte'], 0)]},
  {id: 'd-15p-2', title: 'Kiểm tra 15 phút lần 2 (Buổi 10)', kind: '15p', col: 'k15_2', minutes: 15, builtin: true, questions: [
    Q('Cấu trúc nào dùng khi biết trước số lần lặp?', ['for', 'switch', 'if', 'case'], 0),
    Q('Đoạn lệnh in bao nhiêu chữ *?', ['5', '6', '3', '2'], 0, 'for (int i = 1; i <= 5; i++)\n    printf("*");'),
    Q('Từ khóa nào thoát khỏi vòng lặp ngay lập tức?', ['continue', 'break', 'exit', 'stop'], 1),
    Q('do – while khác while ở điểm nào?', ['Chạy ít nhất 1 lần', 'Chạy nhanh hơn', 'Không cần điều kiện', 'Không có khác biệt'], 0),
    Q('Kết quả của đoạn code?', ['6', '5', '10', '15'], 3, 'int s = 0;\nfor (int i = 1; i <= 5; i++) s += i;\nprintf("%d", s);'),
    Q('Thiếu câu lệnh nào trong case làm switch "rớt" xuống case dưới?', ['return', 'break', 'default', 'continue'], 1),
    Q('Điều kiện kiểm tra n là số chẵn?', ['n / 2 == 0', 'n % 2 == 0', 'n % 2 = 0', 'n == 2'], 1),
    Q('Vòng lặp lồng 3 × 4 chạy thân vòng trong bao nhiêu lần?', ['7', '12', '34', '3'], 1),
    Q('Đoạn code in ra gì?', ['1 2 4 5', '1 2 3 4 5', '1 2', '2 4'], 0, 'for (int i = 1; i <= 5; i++) {\n    if (i == 3) continue;\n    printf("%d ", i);\n}'),
    Q('Lỗi nào gây vòng lặp vô hạn?', ['for(i=0;i<5;i++)', 'while(1){}', 'for(i=5;i>0;i--)', 'while(i<5)i++;'], 1)]},
  {id: 'd-1t-1', title: 'Kiểm tra 1 tiết lần 1 (Buổi 8)', kind: '1t', col: 't1_1', minutes: 45, builtin: true, questions: [
    Q('printf("%d", 10 / 4) in ra?', ['2.5', '2', '3', '2.0'], 1),
    Q('printf("%.1f", 10 / 4.0) in ra?', ['2.0', '2.5', '3.0', '2'], 1),
    Q('Toán tử nào là so sánh bằng?', ['=', '==', '!=', '=>'], 1),
    Q('if (a = 5) có vấn đề gì?', ['Phép gán, luôn đúng', 'Không biên dịch được', 'So sánh a với 5', 'Không có vấn đề'], 0),
    Q('Điều kiện "x nằm trong khoảng 1 đến 10" viết đúng là?', ['1 <= x <= 10', 'x >= 1 && x <= 10', 'x >= 1 || x <= 10', 'x > 1 & < 10'], 1),
    Q('Kết quả đoạn code?', ['B', 'A', 'C', 'Không in gì'], 0, 'int d = 7;\nif (d >= 8) printf("A");\nelse if (d >= 6) printf("B");\nelse printf("C");'),
    Q('Toán tử ?: thuộc loại?', ['Một ngôi', 'Hai ngôi', 'Ba ngôi', 'Không có'], 2),
    Q('Năm nào là năm nhuận?', ['1900', '2023', '2000', '2100'], 2),
    Q('Kết quả đoạn code?', ['10', '15', '5', '0'], 1, 'int s = 0;\nfor (int i = 1; i <= 5; i++) s += i;\nprintf("%d", s);'),
    Q('Vòng for(int i=0;i<n;i++) lặp mấy lần?', ['n - 1', 'n', 'n + 1', 'vô hạn'], 1),
    Q('Muốn tính giai thừa, biến tích khởi tạo bằng?', ['0', '1', '-1', 'n'], 1),
    Q('Kết quả của 5 + 3 * 2 là?', ['16', '11', '10', '13'], 1),
    Q('Đoạn code in ra gì?', ['2 4 6 8 10', '1 3 5 7 9', '2 4 6 8', '0 2 4 6 8 10'], 0, 'for (int i = 2; i <= 10; i += 2)\n    printf("%d ", i);'),
    Q('Cách tách chữ số cuối của n là?', ['n / 10', 'n % 10', 'n * 10', 'n - 10'], 1),
    Q('Lệnh nào kết thúc lần lặp hiện tại và sang lần tiếp?', ['break', 'continue', 'return', 'goto'], 1)]},
  {id: 'd-1t-2', title: 'Kiểm tra 1 tiết lần 2 (Buổi 14)', kind: '1t', col: 't1_2', minutes: 45, builtin: true, questions: [
    Q('Chỉ số phần tử đầu tiên của mảng trong C là?', ['0', '1', '-1', 'tùy ý'], 0),
    Q('Mảng int a[10] có chỉ số hợp lệ từ?', ['1 đến 10', '0 đến 10', '0 đến 9', '1 đến 9'], 2),
    Q('Kết quả đoạn code?', ['8', '6', '9', '3'], 2, 'int a[4] = {5, 9, 2, 8};\nint max = a[0];\nfor (int i = 1; i < 4; i++)\n    if (a[i] > max) max = a[i];\nprintf("%d", max);'),
    Q('Hàm void swap(int a, int b) không đổi được biến gốc vì?', ['Truyền tham trị', 'Thiếu return', 'Sai kiểu', 'Do tên hàm'], 0),
    Q('Muốn hàm đổi giá trị biến gốc ta truyền?', ['Giá trị', 'Địa chỉ (con trỏ)', 'Tên hàm', 'Hằng'], 1),
    Q('*p nghĩa là gì khi p là con trỏ?', ['Địa chỉ của p', 'Giá trị tại địa chỉ p trỏ tới', 'p nhân p', 'Kích thước p'], 1),
    Q('Mảng 2 chiều int a[3][4] có bao nhiêu phần tử?', ['7', '12', '34', '3'], 1),
    Q('Phần tử ở hàng 1, cột 2 của mảng a viết là?', ['a[1,2]', 'a[2][1]', 'a[1][2]', 'a(1)(2)'], 2),
    Q('Đường chéo chính của ma trận vuông thỏa?', ['i == j', 'i + j == n', 'i > j', 'i != j'], 0),
    Q('Bubble sort so sánh?', ['Hai phần tử kề nhau', 'Phần tử đầu và cuối', 'Mọi cặp bất kì ở lượt đầu', 'Chỉ so với 0'], 0),
    Q('Để sắp xếp GIẢM dần bằng bubble sort ta đổi điều kiện hoán đổi thành?', ['a[j] > a[j+1]', 'a[j] < a[j+1]', 'a[j] == a[j+1]', 'a[j] >= 0'], 1),
    Q('Hàm có kiểu trả về void nghĩa là?', ['Trả về 0', 'Không trả về giá trị', 'Trả về chuỗi', 'Không có tham số'], 1),
    Q('Đệ quy cần có?', ['Điều kiện dừng', 'Vòng for', 'Mảng', 'Con trỏ'], 0),
    Q('Kết quả đoạn code?', ['2', '3', '4', '5'], 1, 'int a[5] = {1, 3, 3, 7, 3};\nint dem = 0;\nfor (int i = 0; i < 5; i++)\n    if (a[i] == 3) dem++;\nprintf("%d", dem);'),
    Q('Khai báo hàm nhận mảng 1 chiều nào ĐÚNG?', ['void in(int a[], int n)', 'void in(a[], n)', 'void in(int[] a)', 'void in(array a)'], 0)]}
];

const DEFAULT_LABS = [
  {id: 'l-01', title: 'Bài 1 · Hello + họ tên', lesson: 1, desc: 'In ra đúng dòng chữ: <b>Xin chao K19IT</b> (xuống dòng ở cuối).', starter: '#include <stdio.h>\n\nint main() {\n    // Viết code ở đây\n    return 0;\n}\n', tests: [{in: '', out: 'Xin chao K19IT'}]},
  {id: 'l-02', title: 'Bài 2 · Tổng hai số', lesson: 4, desc: 'Nhập hai số nguyên a, b. In ra <b>tổng</b> của chúng.', starter: '#include <stdio.h>\n\nint main() {\n    int a, b;\n    // Nhập a, b rồi in tổng\n    return 0;\n}\n', tests: [{in: '3 4', out: '7'}, {in: '-5 12', out: '7'}, {in: '100 250', out: '350'}]},
  {id: 'l-03', title: 'Bài 3 · Chẵn hay lẻ', lesson: 5, desc: 'Nhập số nguyên n. In <b>CHAN</b> nếu n chẵn, ngược lại in <b>LE</b>.', starter: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    return 0;\n}\n', tests: [{in: '4', out: 'CHAN'}, {in: '7', out: 'LE'}, {in: '0', out: 'CHAN'}, {in: '-3', out: 'LE'}]},
  {id: 'l-04', title: 'Bài 4 · Xếp loại học lực', lesson: 6, desc: 'Nhập điểm (số thực). In: <b>Gioi</b> (≥8), <b>Kha</b> (≥6.5), <b>Trung binh</b> (≥5), ngược lại <b>Yeu</b>.', starter: '#include <stdio.h>\n\nint main() {\n    float d;\n    scanf("%f", &d);\n    return 0;\n}\n', tests: [{in: '9', out: 'Gioi'}, {in: '7', out: 'Kha'}, {in: '5.5', out: 'Trung binh'}, {in: '3', out: 'Yeu'}]},
  {id: 'l-05', title: 'Bài 5 · Máy tính bỏ túi', lesson: 7, desc: 'Nhập <code>a op b</code> (op là + - * /). In kết quả với 2 chữ số lẻ. Nếu chia cho 0 in <b>Loi</b>.', starter: '#include <stdio.h>\n\nint main() {\n    float a, b;\n    char op;\n    scanf("%f %c %f", &a, &op, &b);\n    return 0;\n}\n', tests: [{in: '6 + 4', out: '10.00'}, {in: '7 / 2', out: '3.50'}, {in: '5 * 3', out: '15.00'}, {in: '1 / 0', out: 'Loi'}]},
  {id: 'l-06', title: 'Bài 6 · Tổng 1..n', lesson: 8, desc: 'Nhập n. In tổng 1 + 2 + ... + n.', starter: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    return 0;\n}\n', tests: [{in: '5', out: '15'}, {in: '10', out: '55'}, {in: '1', out: '1'}, {in: '100', out: '5050'}]},
  {id: 'l-07', title: 'Bài 7 · Số nguyên tố', lesson: 8, desc: 'Nhập n. In <b>YES</b> nếu n là số nguyên tố, ngược lại <b>NO</b>.', starter: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    return 0;\n}\n', tests: [{in: '7', out: 'YES'}, {in: '1', out: 'NO'}, {in: '15', out: 'NO'}, {in: '97', out: 'YES'}]},
  {id: 'l-08', title: 'Bài 8 · Đảo ngược số', lesson: 9, desc: 'Nhập số nguyên dương n, in số đảo ngược (123 → 321).', starter: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    return 0;\n}\n', tests: [{in: '123', out: '321'}, {in: '4005', out: '5004'}, {in: '7', out: '7'}]},
  {id: 'l-09', title: 'Bài 9 · Tam giác sao', lesson: 10, desc: 'Nhập n. In tam giác vuông gồm n hàng, hàng i có i dấu <b>*</b> (không có khoảng trắng).', starter: '#include <stdio.h>\n\nint main() {\n    int n;\n    scanf("%d", &n);\n    return 0;\n}\n', tests: [{in: '3', out: '*\n**\n***'}, {in: '1', out: '*'}, {in: '4', out: '*\n**\n***\n****'}]},
  {id: 'l-10', title: 'Bài 10 · Hàm UCLN', lesson: 11, desc: 'Viết hàm <code>int ucln(int a, int b)</code>. Nhập a, b, in UCLN.', starter: '#include <stdio.h>\n\nint ucln(int a, int b) {\n    // viết hàm\n}\n\nint main() {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    printf("%d\\n", ucln(a, b));\n    return 0;\n}\n', tests: [{in: '48 36', out: '12'}, {in: '17 5', out: '1'}, {in: '100 25', out: '25'}]},
  {id: 'l-11', title: 'Bài 11 · Max & vị trí', lesson: 14, desc: 'Nhập n rồi n số nguyên. In: <b>giá trị lớn nhất</b> và <b>chỉ số đầu tiên</b> của nó cách nhau một khoảng trắng.', starter: '#include <stdio.h>\n\nint main() {\n    int n, a[100];\n    scanf("%d", &n);\n    return 0;\n}\n', tests: [{in: '5\n3 9 2 9 1', out: '9 1'}, {in: '3\n-5 -2 -9', out: '-2 1'}, {in: '1\n8', out: '8 0'}]},
  {id: 'l-12', title: 'Bài 12 · Sắp xếp tăng dần', lesson: 15, desc: 'Nhập n và n số nguyên. In dãy sau khi sắp xếp <b>tăng dần</b>, cách nhau bởi một khoảng trắng.', starter: '#include <stdio.h>\n\nint main() {\n    int n, a[100];\n    scanf("%d", &n);\n    return 0;\n}\n', tests: [{in: '5\n5 3 8 1 4', out: '1 3 4 5 8'}, {in: '3\n9 9 1', out: '1 9 9'}, {in: '1\n2', out: '2'}]},
  {id: 'l-13', title: 'Bài 13 · Tổng đường chéo chính', lesson: 17, desc: 'Nhập n rồi ma trận vuông n×n. In tổng đường chéo chính.', starter: '#include <stdio.h>\n\nint main() {\n    int n, a[10][10];\n    scanf("%d", &n);\n    return 0;\n}\n', tests: [{in: '2\n1 2\n3 4', out: '5'}, {in: '3\n1 2 3\n4 5 6\n7 8 9', out: '15'}]}
];

/* Lịch dạy: Thứ 3 và Thứ 4 hằng tuần, bắt đầu tuần 09/11/2026 (18 buổi) */
const SCHEDULE = (() => {
  const out = [], iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  for (let w = 0; out.length < 18; w++) for (const off of [1, 2]) { if (out.length >= 18) break; const d = new Date(2026, 10, 9 + w * 7 + off); out.push({n: out.length + 1, date: iso(d), wd: d.getDay() === 2 ? 'Thứ 3' : 'Thứ 4'}); }
  return out;
})();
const schedOf0 = n => { const s = SCHEDULE[n - 1]; return s ? s.wd.toUpperCase() + ' ' + s.date.split('-').reverse().join('/') : ''; };
const schedOf = date => SCHEDULE.find(x => x.date === date);

const SAMPLE_CODE = '#include <stdio.h>\n\nint main() {\n    printf("Xin chao K19IT!\\n");\n    return 0;\n}\n';

const COLS = [
  {k: 'k15_1', t: '15p #1', g: '15 phút', w: 1}, {k: 'k15_2', t: '15p #2', g: '15 phút', w: 1},
  {k: 't1_1', t: '1 tiết #1', g: '1 tiết', w: 2}, {k: 't1_2', t: '1 tiết #2', g: '1 tiết', w: 2},
  {k: 'thi', t: 'Thi', g: 'Thi', w: 3}
];

const SEED_STUDENTS = [
  ['190CIT0321', 'Trịnh Đỗ Xuân', 'Hòa', 'Cao đẳng', ''], ['190CIT0271', 'Trần Nhựt', 'Khanh', 'Cao đẳng', ''],
  ['190CIT0395', 'Bàn Gia', 'Lâm', 'Cao đẳng', 'Nghỉ Học'], ['191TIT0246', 'Trần Quang', 'Duy', 'Trung Cấp', ''],
  ['191TIT0208', 'Tô Vỹ', 'Khang', 'Trung Cấp', ''], ['191TIT0213', 'Đặng Hoàng Gia', 'Khánh', 'Trung Cấp', ''],
  ['191TIT0191', 'Trần Hữu', 'Nhàn', 'Trung Cấp', ''], ['191TIT0259', 'Đặng Văn', 'Tài', 'Trung Cấp', ''],
  ['191TIT0285', 'Nguyễn Xuân', 'Tặng', 'Trung Cấp', ''], ['191TIT0220', 'Vũ Chí', 'Thanh', 'Trung Cấp', ''],
  ['191TIT0241', 'Huỳnh Hữu', 'Thịnh', 'Trung Cấp', ''], ['191TIT0301', 'Phan Như', 'Thuật', 'Trung Cấp', ''],
  ['191TIT0264', 'Bùi Đức', 'Trọng', 'Trung Cấp', ''], ['191TIT0407', 'Huỳnh Văn', 'Đủ', 'Trung Cấp', '']
];

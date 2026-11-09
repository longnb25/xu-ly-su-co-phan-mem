import re
def patch(path, edits):
    L = open(path, encoding='utf-8').read().split('\n')
    for ln, fn in sorted(edits.items(), reverse=True):
        L[ln - 1] = fn(L[ln - 1])
    open(path, 'w', encoding='utf-8').write('\n'.join(L))

patch('js/lessons1.js', {
    85: lambda s: "  diagram: D.digits(4125),",
    328: lambda s: "${D.digits(2579, 'while: tách chữ số cho đến khi n = 0')}",
})
L2 = open('js/lessons2.js', encoding='utf-8').read().split('\n')
line_of = lambda key: next(i + 1 for i, l in enumerate(L2) if l.startswith(key))
sel = line_of("${D.line('Số phép so sánh")
patch('js/lessons2.js', {
    12: lambda s: "${D.nested(4)}",
    112: lambda s: "  diagram: D.swapVars(5, 9),",
    155: lambda s: s + "\n${D.sumArr([8, 6, 9, 4, 7])}",
    193: lambda s: "${D.findMax([4, 9, 2, 7, 5, 11, 3])}",
    194: lambda s: s + "\n${D.search([4, 9, 2, 7, 5], 7)}",
    196: lambda s: "${D.deleteAt([1, 2, 3, 4, 5], 2)}",
    246: lambda s: "${D.bubble([5, 3, 8, 1, 4])}",
    sel: lambda s: "${D.selection([6, 2, 9, 4, 1])}\n" + s,
    305: lambda s: "${D.matrix([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])}\n" + s,
    354: lambda s: "${D.transpose([[1, 2, 3], [4, 5, 6]])}",
    355: lambda s: "",
})

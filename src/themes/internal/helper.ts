export function cleaningScriptFuncToString<T>(script: T): string {
  if (!script) return "";

  return (
    String(script)
      .replace(/\/\/.*(?=[\n\r])/g, "") // Hapus komentar satu baris
      .replace(/\/\*[\s\S]*?\*\//g, "") // Hapus komentar multi-baris
      .replace(/(?<=\S)[ \t]{2,}(?=\S)/g, " ") // Hapus spasi/tab ekstra antar kata
      // eslint-disable-next-line no-useless-escape
      .replace(/\s*([\(\)\{\};,?:=<>!&|+\-*\/])\s*/g, "$1") // Hapus spasi sebelum & sesudah operator dan tanda baca
      .replace(/\[\s*([^\]]*?)\s*\]/g, "[$1]") // Hapus spasi dalam array tanpa menghapus string di dalamnya
      .replace(/\s*(=>|===|!==|==|!=|>=|<=|\+|-|\*|\/|&&|\|\|)\s*/g, "$1") // Hapus spasi di sekitar operator
      .replace(
        /\b(return|if|else|for|while|do|try|catch|finally|switch|case|default|break|continue|throw|typeof|instanceof|in|void|yield|async|await|new|delete|import|export|class|extends|static|get|set)\s+/g,
        "$1 "
      ) // Pastikan 1 spasi setelah keyword penting
      .replace(/\b(var|let|const|function)\s+/g, "$1 ") // Pastikan 1 spasi setelah deklarasi variabel & fungsi
      .replace(/\b(\d+)\s+([a-zA-Z_$])/g, "$1$2") // Hapus spasi antara angka dan huruf (contoh: 100 px -> 100px)
      .replace(/([a-zA-Z_$])\s*\(\s*/g, "$1(") // Hapus spasi sebelum dan sesudah tanda kurung buka (function calls)
      .replace(/\)\s*\{\s*/g, "){") // Hapus spasi sebelum dan sesudah `{` setelah `)`
      .replace(/;}/g, "}") // Hapus `;` sebelum `}`
      .replace(/([{[])\s*,/g, "$1") // hapus koma setelah { atau [
      .replace(/,(\s*[}\]])/g, "$1") // hapus koma sebelum } atau ]
      .replace(/(["'`])\s*\+\s*(["'`])/g, "$1$2") // Hapus `+` yang tidak perlu dalam string concatenation
      .replace(/\bconsole\.log\s*\(.*?\);?/g, "") // Hapus semua console.log()
      .replace(/\bconsole\.info\s*\(.*?\);?/g, "") // Hapus semua console.info()
      .replace(/\bconsole\.warn\s*\(.*?\);?/g, "") // Hapus semua console.warn()
      .replace(/\bconsole\.error\s*\(.*?\);?/g, "") // Hapus semua console.error()
      .replace(/\bconsole\.debug\s*\(.*?\);?/g, "") // Hapus semua console.debug()
      .replace(/\bconsole\.trace\s*\(.*?\);?/g, "") // Hapus semua console.trace()
      .replace(/\bconsole\.assert\s*\(.*?\);?/g, "") // Hapus semua console.assert()
      .replace(/\bconsole\.time\s*\(.*?\);?/g, "") // Hapus semua console.time()
      .replace(/\bconsole\.timeEnd\s*\(.*?\);?/g, "") // Hapus semua console.timeEnd()
      .replace(/\bconsole\.timeLog\s*\(.*?\);?/g, "") // Hapus semua console.timeLog()
      .replace(/\bconsole\.count\s*\(.*?\);?/g, "") // Hapus semua console.count()
      .replace(/\bconsole\.countReset\s*\(.*?\);?/g, "") // Hapus semua console.countReset()
      .replace(/\s{2,}/g, " ") // Hapus spasi berlebihan yang masih tersisa
      .trim()
  );
}

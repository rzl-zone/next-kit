import { isNil } from "@rzl-zone/utils-js/predicates";

export function cleaningScriptFuncToString<T>(script: T): string {
  if (isNil(script)) return "";

  return (
    String(script)
      .replace(/\/\/.*(?=[\n\r])/g, "") // Remove single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
      .replace(/(?<=\S)[ \t]{2,}(?=\S)/g, " ") // Remove extra spaces/tabs between words
      // eslint-disable-next-line no-useless-escape
      .replace(/\s*([\(\)\{\};,?:=<>!&|+\-*\/])\s*/g, "$1") // Remove spaces before & after operators and punctuation
      .replace(/\[\s*([^\]]*?)\s*\]/g, "[$1]") // Remove spaces inside arrays without touching strings inside
      .replace(/\s*(=>|===|!==|==|!=|>=|<=|\+|-|\*|\/|&&|\|\|)\s*/g, "$1") // Remove spaces around operators
      .replace(
        /\b(return|if|else|for|while|do|try|catch|finally|switch|case|default|break|continue|throw|typeof|instanceof|in|void|yield|async|await|new|delete|import|export|class|extends|static|get|set)\s+/g,
        "$1 "
      ) // Ensure one space after important keywords
      .replace(/\b(var|let|const|function)\s+/g, "$1 ") // Ensure one space after variable & function declarations
      .replace(/\b(\d+)\s+([a-zA-Z_$])/g, "$1$2") // Remove space between number and letter (e.g., 100 px -> 100px)
      .replace(/([a-zA-Z_$])\s*\(\s*/g, "$1(") // Remove spaces before/after opening parentheses in function calls
      .replace(/\)\s*\{\s*/g, "){") // Remove spaces before/after `{` following `)`
      .replace(/;}/g, "}") // Remove `;` before `}`
      .replace(/([{[])\s*,/g, "$1") // Remove commas right after { or [
      .replace(/,(\s*[}\]])/g, "$1") // Remove commas before } or ]
      .replace(/(["'`])\s*\+\s*(["'`])/g, "$1$2") // Remove unnecessary `+` in string concatenation
      .replace(/\bconsole\.log\s*\(.*?\);?/g, "") // Remove all console.log()
      .replace(/\bconsole\.info\s*\(.*?\);?/g, "") // Remove all console.info()
      .replace(/\bconsole\.warn\s*\(.*?\);?/g, "") // Remove all console.warn()
      .replace(/\bconsole\.error\s*\(.*?\);?/g, "") // Remove all console.error()
      .replace(/\bconsole\.debug\s*\(.*?\);?/g, "") // Remove all console.debug()
      .replace(/\bconsole\.trace\s*\(.*?\);?/g, "") // Remove all console.trace()
      .replace(/\bconsole\.assert\s*\(.*?\);?/g, "") // Remove all console.assert()
      .replace(/\bconsole\.time\s*\(.*?\);?/g, "") // Remove all console.time()
      .replace(/\bconsole\.timeEnd\s*\(.*?\);?/g, "") // Remove all console.timeEnd()
      .replace(/\bconsole\.timeLog\s*\(.*?\);?/g, "") // Remove all console.timeLog()
      .replace(/\bconsole\.count\s*\(.*?\);?/g, "") // Remove all console.count()
      .replace(/\bconsole\.countReset\s*\(.*?\);?/g, "") // Remove all console.countReset()
      .replace(/\s{2,}/g, " ") // Remove remaining excessive spaces
      .trim()
  );
}

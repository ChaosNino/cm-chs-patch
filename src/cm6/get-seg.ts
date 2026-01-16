import type { EditorState, SelectionRange } from "@codemirror/state";
import { EditorSelection } from "@codemirror/state";

import type CMChsPatch from "../chsp-main";

const cm6GetChsSeg = (
  plugin: CMChsPatch,
  pos: number,
  srcRange: { from: number; to: number } | null,
  state: EditorState,
): SelectionRange | null => {
  // --- 新增代码开始 ---
  // 1. 获取当前行的文本
  const line = state.doc.lineAt(pos);
  const lineText = line.text;

  // 2. 定义书名号匹配正则 (匹配成对的书名号，中间不包含换行或其他书名号)
  const bookTitlePattern = /《[^《》\n]*》/g;
  let match;

  // 3. 遍历当前行所有的书名号
  while ((match = bookTitlePattern.exec(lineText)) !== null) {
    const start = line.from + match.index;
    const end = start + match[0].length;

    // 4. 判断当前光标位置是否在书名号范围内（包含边界）
    if (pos >= start && pos <= end) {
      // 如果在范围内，直接返回整个书名号作为选区
      return EditorSelection.range(start, end);
    }
  }
  // --- 新增代码结束 ---

  if (!srcRange) return null;
  const { from, to } = srcRange,
    text = state.doc.sliceString(from, to);

  const chsSegResult = plugin.getSegRangeFromCursor(pos, { from, to, text });
  if (chsSegResult) {
    return EditorSelection.range(chsSegResult.from, chsSegResult.to);
  } else {
    return null;
  }
};

export default cm6GetChsSeg;

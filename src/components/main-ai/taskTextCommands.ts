import type { Message } from "../chat/data";
import type { TaskHubKind } from "./task-detail/TaskDetailCard";

/** 与 MainAIChatWindow 中 marker 一致；JSON 负载中含 `id` 的卡片用于推断「当前任务」 */
const TASK_ID_MARKERS = [
  "<<<RENDER_TASK_DETAIL_CARD>>>",
  "<<<RENDER_TASK_HUB_SESSION_CARD>>>",
  "<<<RENDER_EDIT_TASK_FORM>>>",
  "<<<RENDER_TASK_EDIT_FEEDBACK_DETAIL>>>",
  "<<<RENDER_SUBTASK_FORM>>>",
  "<<<RENDER_HANDOVER_TASK_CARD>>>",
  "<<<RENDER_LINK_SUBTASK_CARD>>>",
  "<<<RENDER_TASK_EVAL_RECORDS_CARD>>>",
  "<<<RENDER_EXECUTION_CONTENT_FORM>>>",
  "<<<RENDER_EXECUTION_DIVISION_LIST_CARD>>>",
  "<<<RENDER_KANBAN_SCOPE_LIST_CARD>>>",
] as const;

function parseTaskIdFromMessageContent(content: string): string | undefined {
  for (const marker of TASK_ID_MARKERS) {
    if (!content.startsWith(marker)) continue;
    try {
      const rest = content.slice(marker.length);
      const jsonStr = rest.startsWith(":") ? rest.slice(1) : "{}";
      const p = JSON.parse(jsonStr) as { id?: string };
      if (p.id?.trim()) return p.id.trim();
    } catch {
      /* ignore */
    }
  }
  return undefined;
}

export type TaskTextCommand =
  | { type: "task_table"; filterHint: string }
  | { type: "static_marker"; marker: "create_task" | "filter" | "settings" }
  | { type: "task_hub"; taskId: string; hub: TaskHubKind };

/** 与 taskAppData.getTaskRowsForFilter 的 key 一致 */
const FILTER_HINT_KEYS = [
  "全部任务",
  "仅看逾期",
  "我执行过的",
  "近期完成的",
  "我执行的",
  "我负责的",
  "我参与的",
  "我关注的",
  "下属的",
] as const;

/** 口语/同义 → 列表筛选项（不含「全部任务」，见下方总览兜底） */
const SEMANTIC_TO_FILTER: Array<{ re: RegExp; filterHint: string }> = [
  {
    re: /近期完成的|最近完成|刚完成的任务|查看刚完成|查看刚完成的任务|刚完成的任务|^近期完成$/,
    filterHint: "近期完成的",
  },
  { re: /仅看逾期|逾期任务|逾期的任务/, filterHint: "仅看逾期" },
  { re: /我执行过的|执行过的任务/, filterHint: "我执行过的" },
  { re: /查看我的任务|^我的任务$|我执行的任务|我要看我执行的/, filterHint: "我执行的" },
  { re: /我负责的|负责的任务/, filterHint: "我负责的" },
  { re: /我参与的|参与的任务/, filterHint: "我参与的" },
  { re: /我关注的|关注的任务/, filterHint: "我关注的" },
  { re: /下属的|下属任务/, filterHint: "下属的" },
];

/** 从「书名号」、"引号" 或入口标签解析筛选项 */
function parseFilterHintFromQuotesAndLabels(text: string): string | undefined {
  const corner = text.match(/「([^」]+)」/g);
  if (corner) {
    for (const seg of corner) {
      const inner = seg.replace(/[「」]/g, "").trim();
      const hit = normalizeLabelToFilterHint(inner);
      if (hit) return hit;
    }
  }
  const ascii = text.match(/"([^"]+)"|'([^']+)'/);
  if (ascii) {
    const inner = (ascii[1] ?? ascii[2] ?? "").trim();
    const hit = normalizeLabelToFilterHint(inner);
    if (hit) return hit;
  }
  return undefined;
}

function normalizeLabelToFilterHint(label: string): string | undefined {
  const s = label.trim().replace(/\s+/g, "");
  for (const key of FILTER_HINT_KEYS) {
    if (s === key.replace(/\s+/g, "")) return key;
  }
  if (/^近期/.test(s)) return "近期完成的";
  if (s.includes("逾期")) return "仅看逾期";
  if (s.includes("刚完成") || s.includes("最近完成")) return "近期完成的";
  return undefined;
}

/** 语义匹配列表视图：书名号/引号优先，再具体筛选项，最后「总览/全部」兜底 */
function matchTaskTableFilterSemantic(t: string): string | undefined {
  const fromQuotes = parseFilterHintFromQuotesAndLabels(t);
  if (fromQuotes) return fromQuotes;

  for (const { re, filterHint } of SEMANTIC_TO_FILTER) {
    if (re.test(t)) return filterHint;
  }

  if (/全部任务|所有任务|^打开列表$|打开任务列表|任务列表/.test(t)) {
    return "全部任务";
  }
  if (/任务总览/.test(t)) {
    return "全部任务";
  }

  return undefined;
}

/** 从会话中解析「当前任务」：取最近一次带任务 id 的任务类卡片的 id */
export function findLatestTaskContextId(messages: Message[]): string | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    const id = parseTaskIdFromMessageContent(messages[i].content);
    if (id) return id;
  }
  return undefined;
}

/**
 * 解析任务模式下的自然语言指令（演示：关键词匹配，无后端）。
 * 未匹配时返回 null，由上层展示「暂无该技能」类提示与可尝试说法。
 */
export function parseTaskTextCommand(
  raw: string,
  ctx: { latestTaskId?: string }
): TaskTextCommand | null {
  const t = raw.trim();
  if (!t) return null;

  const has = (re: RegExp) => re.test(t);
  const includes = (s: string) => t.includes(s);

  // 需上下文的指令优先
  const wantsOutputStrict =
    has(/在当前任务[^。！？\n]*创建产出/) ||
    has(/当前任务[^。！？\n]*创建产出/) ||
    (includes("创建产出") && includes("当前任务")) ||
    (includes("新建产出") && includes("当前任务")) ||
    (includes("添加产出") && includes("当前任务"));

  const wantsOutputLoose =
    includes("创建产出") ||
    includes("新建产出") ||
    (includes("产出") && (includes("创建") || includes("新建") || includes("添加")));

  if (wantsOutputStrict || wantsOutputLoose) {
    const id = ctx.latestTaskId;
    if (!id) return null;
    return { type: "task_hub", taskId: id, hub: "output" };
  }

  if (includes("新建任务") || includes("创建任务") || includes("打开新建任务")) {
    return { type: "static_marker", marker: "create_task" };
  }

  if (includes("筛选任务") || (includes("筛选") && includes("任务"))) {
    return { type: "static_marker", marker: "filter" };
  }

  if (includes("任务设置") || (includes("设置") && includes("任务") && !includes("组织"))) {
    return { type: "static_marker", marker: "settings" };
  }

  const tableFilter = matchTaskTableFilterSemantic(t);
  if (tableFilter) {
    return { type: "task_table", filterHint: tableFilter };
  }

  return null;
}

export function buildTaskCommandFallbackReply(): string {
  return [
    "我暂时无法识别这条指令，当前演示里还没有对应的自动化技能。",
    "",
    "你可以试试这样说：",
    "· 查看我的任务",
    "· 打开全部任务",
    "· 新建任务",
    "· 在当前任务创建产出（需先在对话里打开某个任务详情或任务模块）",
    "· 我想在任务总览里用「近期完成的」",
    "",
    "也可以通过底部「任务总览」「我的」等入口打开列表与表单。",
  ].join("\n");
}

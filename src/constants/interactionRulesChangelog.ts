/**
 * 交互规范文档页「更新日志」（研发向）条目：按时间 **新 → 旧** 排列；首条为默认展示的最新版本。
 * `body` 使用与规范正文相同的子集 Markdown（见 `specDocBodyRender.tsx`）。
 *
 * **何时写、怎么写（与 `interactionRulesSpecData.ts` 维护约定第 7 条一致）**：
 * **仅当** 需求方以 **整段（大段）** 规范正文驱动合并更新并落库时，协作者才须做 **新旧对比** 并写入本数组**最前**；零散修补、单点措辞、与规范无关的工程改动等 **不要求** 记日志。内容须 **精炼**、合并同类、**不过细**；过滤无研发阅读价值的改动。
 *
 * **暗号「以下是修改日志参考」**（与弹窗标题「更新日志」独立）：若另附该段，仅作写本条时的 **参考话术**；整理进 `body` 时须再提炼，且 **绝不** 把参考原文写入 `interactionRulesSpecData.ts` 等设计文档（见该文件维护约定第 8 条）。
 */
export type InteractionRulesChangelogEntry = {
  id: string
  /** Unix 毫秒时间戳，用于标题「年月日时分」与排序 */
  at: number
  /** 正文 */
  body: string
}

export const INTERACTION_RULES_CHANGELOG_ENTRIES: readonly InteractionRulesChangelogEntry[] = [
  {
    id: "cl-2026-04-21-2",
    at: new Date(2026, 3, 21, 16, 30).getTime(),
    body: `- **对话区**：主 AI 列表项间距与规范对齐，用户消息与系统消息之间为 **--space-600**（24px）。
- **自然语言演示**：规范文档内「自然语言对话」演示改为预填输入框 + 发送后示例回复。
- **更新日志**：顶栏入口与弹窗初版（研发向）。`,
  },
  {
    id: "cl-2026-04-21-1",
    at: new Date(2026, 3, 21, 10, 0).getTime(),
    body: `- 发布 **V0.5** 规范正文结构，支持 Markdown 子集渲染（列表、引用、加粗等）。
- 演示链：左侧单行摘要 + 正文末「本节演示」；多演示时左侧跳转至文末。
- 首页入口更名为「交互规范文档 - 持续更新中」。`,
  },
] as const

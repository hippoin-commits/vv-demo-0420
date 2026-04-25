/**
 * # 文档演示区域（Naming）
 *
 * 本文件与 `InteractionRulesDocShell.tsx` 共同构成「交互规范文档」页上的 **文档演示区域**
 *（左侧大纲 + 同区正文 + 演示链接；**不含**右侧实景产品 `VVAppShell`）。
 *
 * **用语**：之后若只说「演示区域」且无其他限定，**默认即指「文档演示区域」**。
 *
 * # 维护约定（更新文档 / 协作时必须遵守）
 *
 * 1. **改正文必须同步改左侧节点**：动 `INTERACTION_RULES_SPEC_ROOT` 时，章节 `num` / `title` / `body` / 层级 / `children`
 *    与左侧大纲展示保持一致，避免「有文无纲」或序号错位。（大纲平铺；`demoLinks` 相对大纲区**最左缘**再缩进 12px，见 `InteractionRulesDocShell`。）
 * 2. **演示按钮（`demoLinks`）**：更新文档时 **尽量保留在原 `num` 节点下**（对位时以序号为准即可）。
 *    左侧大纲每节点 **最多一行** 演示入口（单条：`演示：{名}`；多条：`N个演示链接` 并滚动至正文末尾演示区）；**具体链接按钮** 一律排在对应章节正文末 `data-spec-demos` 区域。
 * 3. **若某 `num` 小节被删或合并**：将该节点下 **既有** `demoLinks` **整体迁到相邻或语义最近的序号节点**，
 *    **禁止**在未获指令的情况下删除或丢弃任何演示项。
 * 4. **删除演示（仅当需求方明确下达删除某条演示时）**：
 *    - **「移除演示」的默认含义**：移除该演示的**全部入口**——从所属 `SpecNode` 的 `demoLinks` 中删除对应项；左侧大纲该节点的演示摘要行与正文末「本节演示」区均由 `InteractionRulesDocShell` **据 `demoLinks` 自动生成**，**勿**只改 `body` 却漏改 `demoLinks`，也**勿**只删文档侧不打数据。
 *    - **同节多条演示**：若删除后该 `SpecNode` 仍留有其它 `demoLinks`，左侧应自动反映剩余项（单条 `演示：…` 或「N个演示链接」等），**禁止**不加区分地清空整节大纲演示以致误伤同节点下其它演示。
 *    - 若某 `DemoInstructionCommand` 分支已无任一 `demoLinks` 引用，可同步删除类型与 `handleDemoInstructionCommand` 等实现侧分支，避免死代码。
 *    - 不得以「整理」「精简」为由擅自删演示。
 * 5. **正文 `body`（子集 Markdown）**：由 `specDocBodyRender.tsx` 渲染，支持 `**加粗**`、`-` / `  -` 列表、`1.` 有序列表、`>` 引用、单独一行的 `---`。
 * 6. **约定（持续更新规范时）**：日后继续改规范正文 / 大纲 / 序号时，**千万不要删除演示**；须 **保持每条演示仍挂在原语义对应的 `SpecNode` 上**（改 `num`/`title`/`body` 不动或整体迁移 `demoLinks`，见第 3 条，**禁止丢链**）。
 *    左侧大纲的演示摘要行与正文末尾「本节演示」区块均由 `InteractionRulesDocShell` **按该节点 `demoLinks` 自动生成**——数据层对位正确，界面上的演示入口即正确；**切勿**只改文档却清空、遗漏或错挂 `demoLinks`。
 * 7. **整段（大段）规范粘贴更新时（在遵守第 1–6 条之外）**：**仅当** 需求方以 **整段大段** 规范正文驱动合并更新并完成落库时，才须对 **新旧版本做对比**（如本文件 `INTERACTION_RULES_SPEC_ROOT` 及同期改动的壳层/渲染文件 diff），将 **有研发阅读价值的变更** 写入 `interactionRulesChangelog.ts`（面向研发，**非**每次小改、局部修补、无关工程调整都要记）。须写成 **精炼** 的更新日志（可多条合并一条），**不要过于细碎**；**过滤**无价值条目（纯措辞、仅空格换行、与规范无关的重排等）。新条目插在 `INTERACTION_RULES_CHANGELOG_ENTRIES` **数组最前**；`at` / `id` / `body` 约定见该文件头注释。
 * 8. **更新日志参考（暗号）**：若需求方在整段规范 **之外** 另附一段以 **「以下是修改日志参考」** 开头的说明（与规范正文 **明确分隔**），该段 **仅供** 撰写 `interactionRulesChangelog.ts` 时对照：须结合 diff / 规范理解 **整理成最贴切** 的更新日志，且仍遵守第 7 条。**严禁** 将该暗号行及其后参考写入 `INTERACTION_RULES_SPEC_ROOT` 或任一章节 `body`。未附该暗号时，仅按第 7 条与 diff 归纳即可。
 *
 * @see `InteractionRulesDocShell.tsx` 壳层布局与联动
 * @see `specDocBodyRender.tsx` 正文渲染
 * @see `interactionRulesChangelog.ts` 更新日志（研发）数据
 */
import type { DemoInstructionCommand } from "./demoInstructionTypes"

/** 正式名称；无障碍与 UI 文案可引用 */
export const INTERACTION_RULES_DOC_DEMO_ZONE_DISPLAY_NAME = "文档演示区域" as const

export type SpecDemoLink = {
  id: string
  label: string
  command: DemoInstructionCommand
}

export type SpecNode = {
  id: string
  num: string
  title: string
  body: string
  /** 演示链：非经明确删除指令不得删；改文档时优先保留在本 `num` 下，否则整体迁移 */
  demoLinks?: SpecDemoLink[]
  children?: SpecNode[]
}

export const INTERACTION_RULES_SPEC_DOC_TITLE =
  "VV AI 对话式交互（CUI）规范框架（V0.5）"

export const INTERACTION_RULES_SPEC_ROOT: SpecNode[] = [
  {
    id: "ch-1",
    num: "1",
    title: "一、核心定位与界面形态",
    body: "",
    children: [
      {
        id: "ch-1-1",
        num: "1.1",
        title: "CUI 定义",
        body:
          "Chat User Interface，对话式业务交互界面。\n以对话流承载完整 B 端业务操作，实现**自然语言 + GUI 操作深度融合**。",
      },
      {
        id: "ch-1-2",
        num: "1.2",
        title: "与通用聊天 AI 差异",
        body: "不以纯问答为目标，核心是**自然语言驱动业务执行、多业务调度、状态化卡片展示**。",
        demoLinks: [
          {
            id: "demo-1-2-nl",
            label: "自然语言对话",
            command: { kind: "prefillNaturalDialogDemo" },
          },
          {
            id: "demo-1-2-biz-card",
            label: "通过自然语言发送业务指令",
            command: { kind: "prefillBusinessCardCommandDemo" },
          },
        ],
      },
      {
        id: "ch-1-3",
        num: "1.3",
        title: "界面结构",
        body: `- 顶部：标题栏导航栏
  - 左侧：切换对话记录入口、模型选择入口
  - 中间：租户选择/教育空间选择入口
  - 右侧：新对话入口、独立弹窗入口
- 中部：对话流（用户气泡 + 系统气泡 + 交互卡片）
- 中下部：快捷入口栏
  - 主AI模式下：展示各业务入口
  - 业务AI模式下：展示对应业务快捷菜单
  - 临时对话抽屉：不显示快捷入口栏
- 底部：指令输入框（支持语音输入、文件图片上传等功能）`,
      },
      {
        id: "ch-1-4",
        num: "1.4",
        title: "两级对话空间",
        body: `- **主 AI（全局空间）**
可调用所有业务能力，不同业务的对话与卡片在同一流中混排。
- **业务 AI（模块空间）**
从顶部导航进入某一业务（邮箱、日历、文件等），仅展示该业务相关对话。`,
      },
      {
        id: "ch-1-5",
        num: "1.5",
        title: "对话同步规则",
        body: `任意业务操作产生的可沉淀内容，**同时留存两份**：
- 一份留在当前对话空间（保证用户当下体验连贯）
- 一份同步归档至对应业务 AI（方便按业务维度回溯痕迹）

> 示例：在邮箱 AI 中发起日历查询，结果留在邮箱对话，同时同步一条到日历 AI。`,
      },
    ],
  },
  {
    id: "ch-2",
    num: "2",
    title: "二、用户输入体系（双路并行，无主副之分）",
    body: "",
    children: [
      {
        id: "ch-2-1",
        num: "2.1",
        title: "自然语言输入",
        body: `- 入口：底部指令输入框自由文本输入

**处理规则：**

1. 用户每发送一句话，都重新执行一次完整的业务意图判断与分配
2. 系统识别为：问答需求 / 业务执行需求
3. 可随时切换话题、切换业务，不受当前空间限制

> 示例：上一句查邮箱，下一句直接说“查看今天日程”，系统重新调度至日历业务。`,
      },
      {
        id: "ch-2-2",
        num: "2.2",
        title: "GUI 操作输入",
        body: `- 范围：卡片内按钮、选项、编辑、顶部导航、快捷入口、行动建议等点击行为

**处理规则：**

1. 点击事件自带明确业务属性，按固定交互逻辑直接执行
2. 不进入 AI 上下文理解流程，保证操作稳定可预期
3. 与自然语言输入地位平等，可任意交替使用`,
      },
    ],
  },
  {
    id: "ch-3",
    num: "3",
    title: "三、系统输出体系（文字叙事 + 状态卡片 + 行动建议）",
    body: "",
    children: [
      {
        id: "ch-3-1",
        num: "3.1",
        title: "文字气泡（对话叙事层）",
        body: `- 作用：记录关键行为与结果，让对话“有剧情、可看懂”
- 保留内容：
  - 用户关键指令（如：我要创建一个文件）
  - 系统关键结果（如：已为你创建文件）
  - 必要引导、追问、说明
- 不保留内容：中间编辑过程、反复操作提示`,
      },
      {
        id: "ch-3-2",
        num: "3.2",
        title: "交互卡片（业务状态层）",
        demoLinks: [
          {
            id: "demo-3-2-org-switcher",
            label: "主 AI 下展示组织/教育空间信息与切换入口",
            command: { kind: "showMainAiOrgManagementSwitcherDemo" },
          },
        ],
        body: `- 承载内容：列表、详情、表单、筛选、日历、流程等各类业务展示
- 核心规则：**同一数据对应同一张卡片，以状态切换替代不断新增卡片**
- 标准状态：浏览态 ↔ 编辑态 ↔ 提交态 ↔ 取消态

**展示规则：**

1. 卡片状态切换仅卡片自身变化，对话流不新增系统提示
2. 正常流程不删除、不消失，只更新内容与状态
3. 卡片内可显示轻量标记，如：更新于 2026-04-23

> 示例：查看文件卡片 → 点击编辑 → 卡片就地变为编辑态 → 保存 → 切回浏览态并更新时间，全程对话流无新增文字。`,
      },
      {
        id: "ch-3-3",
        num: "3.3",
        title: "行动建议",
        body: `- 位置：每轮对话最后一个卡片/气泡下方，横向按钮组
- 形式：纯操作按钮，无额外说明
- 补充规则：复杂场景可在前方增加系统文字气泡进行引导
- 生命周期：**一旦展示永久保留**，不受后续对话影响，可随时点击继续流程

> 示例：查完日程后，行动建议显示【创建会议】【查看下周】，用户中途切去处理邮件，回来仍可点击继续。`,
      },
    ],
  },
  {
    id: "ch-4",
    num: "4",
    title: "四、业务分配与调度规则",
    body: "",
    children: [
      {
        id: "ch-4-1",
        num: "4.1",
        title: "全局分诊分配",
        body: "所有自然语言统一分配至对应业务模块，类似 “分诊台” 机制。",
      },
      {
        id: "ch-4-2",
        num: "4.2",
        title: "轮次独占原则",
        body: "分配后，当前轮次由该业务独立处理，其他业务不干预。",
      },
      {
        id: "ch-4-3",
        num: "4.3",
        title: "唯一性处理",
        body: `- 可明确匹配 → 直接执行
- 匹配模糊 → 系统追问用户明确意图
- 非业务内容 → 通用文字回答`,
      },
      {
        id: "ch-4-4",
        num: "4.4",
        title: "跨空间调用",
        body: "在任意业务 AI 内，均可调用其他业务能力，无需手动切换空间。",
      },
    ],
  },
  {
    id: "ch-5",
    num: "5",
    title: "五、多意图 / 多业务处理规则",
    body: "",
    children: [
      {
        id: "ch-5-1",
        num: "5.1",
        title: "默认规则",
        body: "除非用户明确要求，一轮对话只返回一个业务的结果。",
      },
      {
        id: "ch-5-2",
        num: "5.2",
        title: "并列查询例外",
        body:
          "若用户同时查询多个同类信息，可一次性返回多个业务结果，并同步归档至所有相关业务 AI。",
      },
      {
        id: "ch-5-3",
        num: "5.3",
        title: "复杂任务处理",
        body: `多步骤任务拆分为多轮对话，通过行动建议逐步引导，不强行一次性完成。

> 示例：用户说“查看周日程并创建会议”，先展示日程卡片，再给出“创建会议”行动建议，引导分步完成。`,
      },
    ],
  },
  {
    id: "ch-6",
    num: "6",
    title: "六、上下文与对话生命周期",
    body: "",
    children: [
      {
        id: "ch-6-1",
        num: "6.1",
        title: "上下文管理",
        body: "按**用户意图边界**管理：同意图上下文延续，切换意图自动切割。",
      },
      {
        id: "ch-6-2",
        num: "6.2",
        title: "超时策略",
        body: "辅助以长时间无操作切割（如 24 小时 / 隔夜），类似 “开启新对话”。",
      },
      {
        id: "ch-6-3",
        num: "6.3",
        title: "断点恢复",
        body: "点击历史行动建议，可恢复当时上下文，继续未完成流程。",
      },
      {
        id: "ch-6-4",
        num: "6.4",
        title: "当前范围",
        body: "暂不做跨业务上下文共享，单业务内上下文有效。",
      },
    ],
  },
  {
    id: "ch-7",
    num: "7",
    title: "七、历史定位与操作回溯",
    body: "",
    children: [
      {
        id: "ch-7-1",
        num: "7.1",
        title: "操作来源定位",
        body: "当操作跨多条对话出现断档，新回复可附带「操作来源」入口。",
      },
      {
        id: "ch-7-2",
        num: "7.2",
        title: "跳转行为",
        body:
          "点击「操作来源」，直接滑动回到原卡片所在历史位置，不复制新卡片到当前对话底部。",
      },
      {
        id: "ch-7-3",
        num: "7.3",
        title: "痕迹查找",
        body: "所有业务操作痕迹均可在对应业务 AI 中统一查阅。",
      },
    ],
  },
  {
    id: "ch-8",
    num: "8",
    title: "八、整体体验原则",
    body: `1. 自然语言与 GUI 操作并行互补，同等重要
2. 对话轻量化，只展示结果，过程收敛在卡片内
3. 状态可预测、操作可追溯、结果可归档
4. 减少不必要提示，保持界面简洁、流程连贯、不打扰用户`,
  },
]

export function flattenSpecNodes(nodes: readonly SpecNode[], out: SpecNode[] = []): SpecNode[] {
  for (const n of nodes) {
    out.push(n)
    if (n.children?.length) flattenSpecNodes(n.children, out)
  }
  return out
}

export const INTERACTION_RULES_SPEC_FLAT = flattenSpecNodes(INTERACTION_RULES_SPEC_ROOT)

export function specAnchorDomId(nodeId: string): string {
  return `spec-doc-${nodeId}`
}

/** 正文末尾「本节演示」锚点，供左侧「N个演示链接」滚动定位 */
export function specDemoSectionDomId(nodeId: string): string {
  return `spec-doc-demos-${nodeId}`
}

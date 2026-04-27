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
 * 9. **`title` 不与 `num` 双写序号**：左侧大纲与正文标题行已单独展示 `num`，`title` 内 **不要** 再保留「一、」「二、」等与章节位次重复的中文序号前缀，也不要在 `title` 开头重复写与 `num` 相同的阿拉伯小节号（如 `num` 为 `2.1` 时标题不要以 `2.1、` 起头）。需求方 **整段粘贴** 规范入本树时，Agent 合并后须自检：用 `normalizeSpecTitleForDisplay(title, num)` 对照每一节，去重后写入 `title`；壳层展示亦使用该函数，避免偶发漏改时界面仍出现「1 + 一、」双编号。
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

const ZH_ORD_1_9 = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"] as const

/** 1–99 → 与规范稿「一、」「十二、」对齐的中文节号（非金额大写） */
function integerSectionToChineseOrdinal(n: number): string | null {
  if (n < 1 || n > 99) return null
  if (n < 10) return ZH_ORD_1_9[n]!
  if (n === 10) return "十"
  if (n < 20) return "十" + ZH_ORD_1_9[n % 10]!
  if (n % 10 === 0) return ZH_ORD_1_9[Math.floor(n / 10)]! + "十"
  return ZH_ORD_1_9[Math.floor(n / 10)]! + "十" + ZH_ORD_1_9[n % 10]!
}

/**
 * 展示用标题：去掉与 `num` 重复的前缀（见文件头维护约定第 9 条）。
 * 合并粘贴大段规范后写库前应对每个节点执行并落盘；壳层亦用此结果渲染。
 */
export function normalizeSpecTitleForDisplay(title: string, num: string): string {
  let t = title.trim()
  const numTrim = num.trim()

  if (/^\d+(\.\d+)+$/.test(numTrim)) {
    const esc = numTrim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    t = t.replace(new RegExp(`^\\s*${esc}\\s*[、,，.]\\s*`), "").trim()
    t = t.replace(new RegExp(`^\\s*${esc}\\s+`), "").trim()
  }

  if (/^\d+$/.test(numTrim)) {
    const n = parseInt(numTrim, 10)
    const cn = integerSectionToChineseOrdinal(n)
    if (cn) {
      for (const sep of ["、", "，", ",", "."] as const) {
        const p = cn + sep
        if (t.startsWith(p)) {
          t = t.slice(p.length).trim()
          break
        }
      }
    }
  }

  return t
}

export const INTERACTION_RULES_SPEC_DOC_TITLE =
  "VV AI 对话式交互（CUI）规范框架（V0.6）"

export const INTERACTION_RULES_SPEC_ROOT: SpecNode[] = [
  {
    id: "ch-1",
    num: "1",
    title: "核心定位与界面形态",
    body: "",
    children: [
      {
        id: "ch-1-1",
        num: "1.1",
        title: "CUI 定义",
        body: `Chat User Interface，对话式业务交互界面。
以对话流承载完整业务操作，实现**自然语言 + GUI 操作深度融合**，支撑一体化对话式业务交互。`,
      },
      {
        id: "ch-1-2",
        num: "1.2",
        title: "适用场景与产品差异",
        body: `- 区别于通用聊天AI，不以纯问答为目标，聚焦自然语言驱动业务执行、跨业务调度、状态化卡片展示。
- 规范全场景通用，兼容B端内部办公、学校管理、教育家长C端。
- 多场景仅快捷入口、导航视图做差异化，对话逻辑、卡片体系、调度规则完全统一。`,
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
        body: `- **顶部：标题栏 & 导航栏**
  - 左侧：对话记录切换、模型选择入口
  - 中间：租户、教育空间选择入口
  - 右侧：新对话入口、独立弹窗入口
- **中部：核心交互区**
  - 吸顶代办卡片，全局吸顶常驻，与对话流同属中部区域
  - 对话流：用户气泡、系统气泡、业务交互卡片
- **中下部：快捷入口栏**
  - 主AI：展示全局全业务应用入口
  - 业务AI：展示当前业务专属快捷菜单
  - 临时对话抽屉：隐藏快捷入口栏
- **底部：指令输入框**
  支持语音输入、文件/图片上传等扩展能力。`,
      },
      {
        id: "ch-1-4",
        num: "1.4",
        title: "三级对话容器",
        demoLinks: [
          {
            id: "demo-3-2-org-switcher",
            label: "主 AI 下展示组织/教育空间信息与切换入口",
            command: { kind: "showMainAiOrgManagementSwitcherDemo" },
          },
        ],
        body: `系统包含三类底层能力一致、场景分工不同的对话容器：

**主 AI（全局对话空间）**
- 为默认首页对话容器
- 承载全局自由对话、全业务跨模块调度
- 底部展示全域应用快捷分发入口

**应用 AI（业务专属空间）**
- 由主AI底部应用入口点击进入
- 聚焦单一业务模块，同时支持跨业务调用
- 底部展示当前业务高频专属快捷操作

**临时对话抽屉**
- 由列表查看、编辑、新增子项、深度表单操作唤起
- 仅支持单层抽屉，禁止抽屉内二次嵌套新抽屉
- 次级操作优先对话流输出，复杂场景可复用卡片组件以弹窗承载
- 弹窗提交自动关闭、数据自动回填，作为复杂交互兼容方案

**容器统一响应要求**
- 用户在任意容器发送自然语言指令，均在**当前容器就地响应**
- 跨业务、跨空间、抽屉内调用，不跳转、不迁移、不切换对话`,
      },
      {
        id: "ch-1-5",
        num: "1.5",
        title: "对话同步规则",
        body: `- 业务沉淀内容双轨留存：一份保留当前对话，保障即时体验连贯；一份同步归档至对应业务AI。
- 跨业务调用结果就地展示，同时自动归类归档，支持按业务维度回溯操作痕迹。`,
      },
    ],
  },
  {
    id: "ch-2",
    num: "2",
    title: "用户输入体系（双路并行，无主副之分）",
    body: "",
    children: [
      {
        id: "ch-2-1",
        num: "2.1",
        title: "自然语言输入",
        body: `- 以底部输入框为统一自由文本入口。
- 每轮消息独立完成意图重判与业务分配，可随时跨话题、跨业务切换。
- 统一区分通用问答、业务执行两类需求，分流调度处理。`,
      },
      {
        id: "ch-2-2",
        num: "2.2",
        title: "GUI 操作输入",
        body: `涵盖卡片按钮、编辑操作、顶部导航、快捷入口、行动建议等点击行为：
- 自带明确业务归属、租户/教育空间、数据权限维度。
- 逻辑确定性强，无需全量AI语义解析，执行稳定可预期。
- 与自然语言输入地位对等，可自由交替混用。`,
      },
      {
        id: "ch-2-3",
        num: "2.3",
        title: "对话基础操作边界",
        body: `- 复制、删除、分享：仅作用于单条对话，不延续业务上下文。
- 重新生成：继承原有对话上下文与业务链路，二次复现执行逻辑。
- 所有业务执行类操作，统一遵循上下文延续规则。`,
      },
    ],
  },
  {
    id: "ch-3",
    num: "3",
    title: "系统输出体系（文字叙事 + 状态卡片 + 行动建议）",
    body: "",
    children: [
      {
        id: "ch-3-1",
        num: "3.1",
        title: "文字气泡（对话叙事层）",
        body: `- 承载关键指令、执行结果、必要引导与补充说明。
- 收敛中间编辑、重复提示、过程性冗余信息。
- 保持对话流轻量化，仅保留有效叙事内容。`,
      },
      {
        id: "ch-3-2",
        num: "3.2",
        title: "交互卡片（业务状态层）",
        body: `- 作为列表、详情、表单、筛选、流程等业务统一展示载体。
- 同一份业务数据绑定唯一卡片，**以状态切换替代新增卡片**。
- 标准状态流转：浏览态 ↔ 编辑态 ↔ 提交态 ↔ 取消态。
- 卡片内部状态更新，不额外新增文字气泡，界面干净收敛。
- 无主动操作时历史卡片不自动刷新，仅人为操作触发内容更新。
- 提交校验失败停留编辑态，内部展示报错提示，不强制回滚。
- 加载/接口异常在卡片内展示错误视图，配套重试操作。
- 权限不足场景走独立申请链路，不阻断基础对话交互。`,
      },
      {
        id: "ch-3-3",
        num: "3.3",
        title: "行动建议",
        body: `- 固定展示在单轮对话末尾、卡片下方横向按钮组。
- 长期常驻展示，不受后续多轮对话覆盖影响。
- 卡片状态、业务数据变更时，行动建议可同步刷新适配。
- 复杂流程可搭配前置文字轻引导，分步承接业务闭环。`,
      },
    ],
  },
  {
    id: "ch-4",
    num: "4",
    title: "业务分配与调度规则",
    body: "",
    children: [
      {
        id: "ch-4-1",
        num: "4.1",
        title: "全局分诊分配",
        body: `- 所有自然语言指令统一进入全局意图分诊机制。
- 集中识别意图，智能调度至对应业务模块独立处理。`,
      },
      {
        id: "ch-4-2",
        num: "4.2",
        title: "轮次独占原则",
        body: `- 单轮对话匹配业务后，由该业务独立闭环。
- 其他模块不介入、不干扰，避免多业务逻辑冲突。`,
      },
      {
        id: "ch-4-3",
        num: "4.3",
        title: "意图处理逻辑",
        body: `- 意图明确：直接执行对应业务操作。
- 意图模糊：主动追问用户，明确需求范围。
- 非业务内容：交由通用大模型进行常规问答回复。
- 结合上下文收敛识别范围，提升匹配精准度。`,
      },
      {
        id: "ch-4-4",
        num: "4.4",
        title: "跨空间调用",
        body: `- 任意业务AI空间内，可直接调用全量业务能力。
- 无需手动切换应用或导航，实现跨模块无缝联动。`,
      },
      {
        id: "ch-4-5",
        num: "4.5",
        title: "权限管控规范",
        body: `- 应用权限：无权限可正常进入页面，展示权限申请卡片，支持申请、催办、进度查看。
- 数据权限：无权限数据直接隐藏，不额外增加冗余提示。
- 权限仅控制可视与可操作范围，不拦截对话调用入口。`,
      },
    ],
  },
  {
    id: "ch-5",
    num: "5",
    title: "多意图 / 多业务处理规则",
    body: "",
    children: [
      {
        id: "ch-5-1",
        num: "5.1",
        title: "基础处理原则",
        body: `- 无用户明确多需求指令时，单轮对话仅落地一项核心业务。
- 控制信息密度，避免多业务内容混排造成体验杂乱。`,
      },
      {
        id: "ch-5-2",
        num: "5.2",
        title: "并列查询特例",
        body: `- 同类同维度多条件查询，可聚合多项结果统一返回。
- 多业务结果分别归档至对应业务AI，便于分类回溯。`,
      },
      {
        id: "ch-5-3",
        num: "5.3",
        title: "复杂任务处理",
        body: `- 多步骤长链路任务自动拆解为多轮分步交互。
- 通过行动建议渐进引导完成，不一次性堆砌全流程内容。`,
      },
    ],
  },
  {
    id: "ch-6",
    num: "6",
    title: "上下文与对话生命周期",
    body: "",
    children: [
      {
        id: "ch-6-1",
        num: "6.1",
        title: "上下文管理",
        body: `- 同意图、同业务链路上下文自动延续。
- 业务意图切换时，自动切割上下文边界，避免信息干扰。`,
      },
      {
        id: "ch-6-2",
        num: "6.2",
        title: "超时与主动重置",
        body: `- 系统固定切断规则：跨天 + 间隔超4小时，自动断开上下文。
- 支持用户手动新建对话，强制清空上下文，重置对话链路。`,
      },
      {
        id: "ch-6-3",
        num: "6.3",
        title: "断点与范围限制",
        body: `- 未完成任务依托卡片操作、行动建议实现断点续接。
- 纯文本历史对话不做复杂回溯恢复。
- 上下文仅限单业务内生效，暂不支持跨业务共享。`,
      },
    ],
  },
  {
    id: "ch-7",
    num: "7",
    title: "历史定位与操作回溯",
    body: "",
    children: [
      {
        id: "ch-7-1",
        num: "7.1",
        title: "操作来源触发",
        body: "- 同一段对话内，卡片被无关内容隔断、流程断档时，自动展示操作来源入口。",
      },
      {
        id: "ch-7-2",
        num: "7.2",
        title: "回溯跳转规则",
        body: `- 点击来源，直接滑动定位至历史卡片位置。
- 仅视图跳转，不复制、不新增历史卡片。
- 切换对话或AI空间，自动关闭该能力。`,
      },
      {
        id: "ch-7-3",
        num: "7.3",
        title: "痕迹留存规范",
        body: `- 所有操作痕迹统一归档至对应业务AI，支持集中查阅。
- 历史卡片保留当时快照，同时支持二次编辑、实时更新数据。
- 无主动操作，历史内容不会被动自动刷新。`,
      },
    ],
  },
  {
    id: "ch-8",
    num: "8",
    title: "异常交互与整体体验原则",
    body: "",
    children: [
      {
        id: "ch-8-1",
        num: "8.1",
        title: "分层异常反馈",
        body: `- 卡片级异常：卡片内展示报错，提供重试按钮。
- AI生成异常：文字气泡提示错误，支持重新生成。
- 瞬时轻异常：采用GUI轻提示，不沉淀对话记录。`,
      },
      {
        id: "ch-8-2",
        num: "8.2",
        title: "多端同步规则",
        body: `- 以唯一卡片ID为同步基准。
- 多端冲突以**操作时间戳**判定，晚操作状态优先覆盖。
- 卡片内容、状态、行动建议联动同步。`,
      },
      {
        id: "ch-8-3",
        num: "8.3",
        title: "通用基础操作",
        body: `- 支持AI生成过程手动停止、重新生成、复制、分享。
- 统一基础操作体验，对齐通用交互认知。`,
      },
      {
        id: "ch-8-4",
        num: "8.4",
        title: "顶层体验原则",
        demoLinks: [
          {
            id: "demo-5-1-im-framework",
            label: "通过MCP实现IM界面框架",
            command: { kind: "openImFrameworkDemo" },
          },
        ],
        body: `- 自然语言与GUI操作并行互补、权重对等。
- 流程过程收敛于卡片，对话仅展示关键结果。
- 状态可预测、操作可追溯、内容可归档。
- 精简无效提示与过度弹窗，保持界面简洁。
- 全容器统一就地响应，保证交互连贯闭环。`,
      },
    ],
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

import * as React from "react"
import { Check, Copy } from "lucide-react"
import type { DemoInstructionCommand } from "./demoInstructionTypes"
import { SpecDocBody } from "./specDocBodyRender"
import { cn } from "../ui/utils"

type DemoScenario = {
  id: string
  title: string
  command: DemoInstructionCommand
  prompt: string
  logicMarkdown: string
  devPromptMarkdown: string
}

type DemoCategory = {
  id: string
  title: string
  demos: readonly DemoScenario[]
}

type DetailSection = {
  id: string
  title: string
  markdown: string
}

const DEMO_INSTRUCTION_CATEGORIES: readonly DemoCategory[] = [
  {
    id: "conversation-positioning",
    title: "对话流定位",
    demos: [
      {
        id: "new-round-positioning",
        title: "新对话定位逻辑",
        command: { kind: "prefillMainAiDemoPrompt", prompt: "组织管理" },
        prompt:
          "当用户发送会产生 CUI 卡片的新指令时，将本次用户消息作为新轮次起点；卡片出现后，将卡片首屏定位到主阅读区域顶部，并保留后续内容自然滚动。",
        logicMarkdown:
          "目标：每次用户发起新一轮对话时，无论最终返回文本还是 CUI 卡片，都应该进入一个新的展示槽位。槽位从本轮用户消息开始，而不是从 AI 卡片开始。\n\n**1. 新一轮判定**\n\n以下行为都算新一轮：\n\n- 用户在输入框发送一条消息。\n- 用户点击快捷指令。\n- 用户点击底部应用入口或应用内菜单。\n- 用户点击 CUI 卡片中的行动按钮，触发新的消息或卡片。\n- 主 AI、应用 AI、组织 AI、员工 AI、抽屉 AI 中任意一个上下文发起新的任务。\n- 连续发送多条普通文本，也必须视为多轮对话，而不是同一轮里的多条消息。\n\n**2. 槽位规则**\n\n每一轮新对话开始时，立即创建新的展示槽位。\n\n- 槽位起点是本轮用户消息。\n- AI 回复、CUI 卡片、后续提示都属于这一轮槽位的后续内容。\n- 新一轮开始时，旧槽位立即失效。\n- 新槽位只包裹当前轮，不允许把前一轮或后一轮消息混进去。\n- 多轮之间保持规范消息间距。\n\n**3. 滚动定位**\n\n新一轮出现时，不应简单滚到底部。\n\n推荐过程：\n\n1. 用户触发新一轮。\n2. 创建新槽位，记录当前上下文和当前消息列表长度。\n3. 用户消息进入槽位。\n4. 滚动容器自动定位到新槽位顶部。\n5. AI 回复或卡片进入同一槽位。\n6. 如果内容超过槽位高度，保持槽位顶部清晰，允许继续向下阅读。\n\n**4. 高度判断**\n\n槽位高度根据当前对话容器动态计算：\n\n- 当前聊天区域可视高度。\n- 顶部 pinned / sticky / header 区域。\n- 底部输入框、底部工具栏或浮层占用。\n- 是否处于文档演示嵌入页。\n- 当前所在上下文。\n\n原则：槽位高度接近当前可用阅读区，不超过容器高度；内容超出时优先保证顶部可见。\n\n**5. 多上下文隔离**\n\n每个上下文都有自己的新一轮定位：\n\n- 主 AI 是主 AI 的槽位。\n- 邮箱、任务、教育、组织、员工等应用 AI 各自独立。\n- 当前在哪个对话发起，就在哪个对话创建槽位。\n- 从主 AI 打开应用 AI 并触发欢迎语，也算应用 AI 的新一轮。\n- 从主 AI / 应用 AI 打开抽屉 AI 并发起对话，也要按抽屉 AI 的当前上下文创建槽位。\n- 切换上下文不能继承另一个上下文的槽位和滚动状态。",
        devPromptMarkdown:
          "请实现“新一轮对话定位”体验逻辑。\n\n要求：\n\n1. 每次用户发起新一轮对话时，立即创建展示槽位。新一轮包括：输入框发送、快捷指令、底部应用入口、应用菜单、CUI 卡片行动按钮、主 AI / 应用 AI / 组织 AI / 员工 AI / 抽屉 AI 中任意上下文发起任务。\n2. 槽位起点必须是本轮用户消息，不是 AI 卡片。用户消息先进入槽位，AI 回复或 CUI 卡片随后进入同一槽位。\n3. 每次新一轮开始，都必须刷新槽位。旧槽位立即失效，不能继续包裹后续消息。\n4. 严格区分每一轮。用户连续发送多条普通文本时，每条都是独立新轮次，不可以把多轮文本混在一个槽位里。多轮之间保持规范消息间距。\n5. 新槽位要绑定当前对话上下文。主 AI、各应用 AI、组织 AI、员工 AI、抽屉 AI 的消息列表、槽位状态和滚动定位互相隔离。\n6. 如果从一个上下文打开另一个上下文并触发对话或卡片，例如主 AI 进入应用 AI 的欢迎语，或主 AI / 应用 AI 打开抽屉 AI 并发起一轮对话，也必须在目标上下文中创建新槽位。\n7. 槽位高度根据当前聊天容器可视高度动态计算，扣除 pinned / sticky / header / 底部输入区等占用。嵌入式演示页应使用更保守高度，避免被外层裁切。\n8. 滚动定位不能简单滚到底部。新一轮出现后，应自动滚动到槽位顶部，让用户看到本轮开始位置；如果内容超出槽位，保持顶部可见，允许继续向下阅读。",
      },
      {
        id: "scroll-to-bottom-threshold",
        title: "去底部按钮逻辑",
        command: { kind: "prefillMainAiDemoPrompt", prompt: "演示：查看去底部按钮逻辑" },
        prompt:
          "当用户距离底部超过当前新轮槽位高度时显示去底部按钮；按钮阈值必须与槽位高度同源，槽位改为 70% 时按钮阈值同步变化。",
        logicMarkdown:
          "目标：当用户已经离开当前对话底部较远时，显示一个固定在滚动区域底部居中的“去底部”按钮；当用户接近底部或内容没有溢出时，不显示按钮。\n\n**1. 显示阈值**\n\n- 去底部按钮的显示阈值与新一轮对话槽位高度同源，统一调用 `computeNewRoundSlotHeightPx`。\n- 当前槽位高度 = max(200px, round((聊天滚动容器可视高度 - pinned / sticky 占用高度) × 0.7))。\n- 主聊天区会扣除 pinned / sticky 区域高度；独立浮窗聊天区没有 pinned 区域，按 0 处理。\n- 若调用方没有传入阈值函数，组件才退回默认阈值：max(96px, 可视高度 × 0.38)。当前主聊天区与浮窗聊天区均已传入同源阈值。\n\n**2. 显示判断**\n\n- 如果 `scrollHeight <= clientHeight + 2`，说明内容没有有效溢出，不显示按钮。\n- 否则计算距离底部：`scrollHeight - scrollTop - clientHeight`。\n- 当距离底部大于同源槽位高度阈值时，显示按钮。\n- 当距离底部小于或等于阈值时，隐藏按钮。\n\n**3. 重新计算时机**\n\n- 监听滚动容器的 `scroll` 事件，用户滚动时实时更新显示状态。\n- 使用 `ResizeObserver` 监听滚动容器尺寸变化，容器高度变化时重新计算。\n- 通过 `layoutSyncKey` 在消息数量、上下文、槽位信息变化时重新绑定与重算，避免内容增高但未触发滚动事件、或滚动区 remount 后监听仍挂在旧 DOM 上。\n\n**4. 点击行为**\n\n- 点击按钮后先执行一次 smooth 滚动到底部。\n- 随后使用双 `requestAnimationFrame` 再执行一次 auto 滚动，确保 DOM 更新后的真实高度被贴底。\n- 150ms 后再执行一次 auto 滚动作为兜底，避免新增内容或浏览器滚动动画导致未完全贴底。\n\n**5. 视觉与层级**\n\n- 按钮固定在当前滚动区域底部居中，容器使用 `pointer-events-none`，按钮自身恢复 `pointer-events-auto`。\n- 按钮使用圆形 outline 样式、背景 `bg-bg/95`、阴影和轻微 backdrop blur，避免遮挡对话内容时过重。",
        devPromptMarkdown:
          "请实现“去底部按钮”逻辑，并让它与新一轮对话的阅读槽位保持一致。\n\n要求：\n\n1. 在聊天滚动区域内提供一个“去底部”按钮。内容没有溢出时不显示；用户接近底部时不显示；用户离底部较远时显示。\n2. “离底部较远”的判断阈值要与新一轮对话槽位高度保持一致，不要再单独设置一套经验阈值。\n3. 槽位高度建议按当前可用阅读区的 70% 计算，并设置一个最低值，避免窗口很小时阈值过小。\n4. 当前可用阅读区应扣除顶部吸顶内容、固定提示、输入区、工具栏等会占用阅读空间的元素。没有这些元素时，直接使用聊天滚动区域可视高度。\n5. 距离底部的计算方式为：内容总高度 - 当前滚动位置 - 可视高度。只有这个距离超过槽位高度阈值时，才显示“去底部”按钮。\n6. 用户滚动、聊天区域尺寸变化、消息新增、上下文切换、槽位高度变化时，都要重新计算按钮是否显示。\n7. 点击按钮后先平滑滚动到底部；滚动后再做一次或多次即时贴底校正，避免新消息渲染、图片加载或动画导致没有真正到达底部。\n8. 按钮固定在聊天滚动区域底部居中，不能影响正常滚动，也不能挡住过多内容。建议使用轻量圆形按钮和向下箭头图标。\n9. 如果项目中有多个聊天上下文（主 AI、应用 AI、抽屉 AI、浮窗等），每个上下文都应基于自己的滚动容器和可用阅读区独立计算。",
      },
    ],
  },
  {
    id: "context-switching",
    title: "上下文切换",
    demos: [
      {
        id: "main-ai-scope-switcher",
        title: "主AI展示教育/空间切换入口",
        command: { kind: "prefillMainAiDemoPrompt", prompt: "组织管理" },
        prompt:
          "在主 AI 的业务卡片标题下方展示当前组织或教育空间，并提供切换入口；进入具体应用 AI 后不再重复展示。",
        logicMarkdown:
          "目标：主 AI 是全局对话容器，承载跨业务调度。因此，当主 AI 里出现与组织或教育空间相关的业务卡片时，需要在卡片标题下方补充当前上下文，并允许用户直接切换。\n\n**1. 显示位置**\n\n- 切换入口展示在业务卡片标题下方，作为标题区的一部分，而不是独立插入一条新消息。\n- 它应靠近卡片标题，用较弱的文字层级表达“当前上下文”。\n- 它不应抢占卡片主体内容，也不应影响卡片的主要操作按钮。\n\n**2. 显示条件**\n\n- 仅在主 AI 对话流中展示。\n- 当用户已经进入具体应用 AI、组织 AI、员工 AI、抽屉 AI 等上下文时，不再展示这个切换入口。\n- 如果卡片属于组织管理、权限、成员、流程等组织范围业务，展示组织切换入口。\n- 如果卡片属于课程、学生、教育空间等教育范围业务，展示教育空间切换入口。\n\n**3. 组织切换**\n\n- 展示当前组织名称，点击后打开组织列表。\n- 组织列表与产品顶部或全局组织选择保持同源数据。\n- 在卡片内使用时，应隐藏排序、新建、加入等管理动作，只保留选择能力。\n- 切换组织后，卡片应同步更新到新组织上下文，后续操作也应以新组织为准。\n\n**4. 教育空间切换**\n\n- 展示当前教育空间名称，点击后打开教育空间列表。\n- 教育空间可能包含机构空间、家庭空间，也可能按租户或机构树形组织。\n- 列表应支持搜索、展开上级节点、选择具体叶子空间。\n- 切换教育空间后，卡片应同步更新到新教育空间上下文，后续操作也应以新教育空间为准。\n\n**5. 上下文隔离**\n\n- 主 AI 中切换上下文，只影响当前主 AI 卡片和后续主 AI 操作。\n- 不应把主 AI 的卡片级上下文选择强行带入其他应用 AI 的独立对话状态。\n- 如果一张卡片自身携带了上下文信息，用户切换后应同步更新卡片记录，避免刷新或重新渲染后回到旧上下文。",
        devPromptMarkdown:
          "请实现“主 AI 业务卡片中的上下文切换入口”。\n\n要求：\n\n1. 当主 AI 对话流中出现需要组织或教育空间上下文的业务卡片时，在卡片标题下方展示当前上下文和切换入口。\n2. 该入口只在主 AI 中展示；进入具体应用 AI、组织 AI、员工 AI、抽屉 AI 等上下文后，不要重复展示。\n3. 组织类业务卡片展示组织切换入口；教育类业务卡片展示教育空间切换入口。\n4. 切换入口应属于卡片标题区的一部分，视觉层级弱于主标题，避免打断对话流。\n5. 组织切换列表应复用全局组织数据，但在卡片内只保留选择能力，不展示排序、新建、加入等管理动作。\n6. 教育空间切换列表应复用全局教育空间数据，并支持搜索、展开上级节点、选择具体空间。\n7. 用户切换组织或教育空间后，当前卡片需要同步更新到新的上下文；后续在该卡片上的操作也应使用新的上下文。\n8. 如果卡片消息或卡片状态中保存了上下文标识，切换后要同步更新这份记录，避免重新渲染后回到旧上下文。\n9. 主 AI 的卡片级上下文切换不应污染其他应用 AI 的独立对话状态；不同 AI 上下文各自管理自己的选择状态。\n10. 如果当前业务没有可切换的组织或教育空间，入口可以隐藏，或展示只读的当前上下文名称。",
      },
    ],
  },
]

const LEFT_DEFAULT_WIDTH_PX = 260
const RIGHT_DEFAULT_WIDTH_PX = 360
const SIDE_MIN_WIDTH_PX = 200
const SIDE_MAX_WIDTH_PX = 520
const SPLITTER_WIDTH_PX = 10
const OUTLINE_HIT_H = "30px"
const DOC_ZONE_PAD_X = "var(--space-400)"
const OUTLINE_DEMO_INDENT_FROM_EDGE = "var(--space-300)"
const COPY_RESET_MS = 3000

function clampSideWidth(next: number) {
  return Math.min(SIDE_MAX_WIDTH_PX, Math.max(SIDE_MIN_WIDTH_PX, next))
}

function CopyableMarkdownSection(props: {
  id: string
  title: string
  markdown: string
  sectionRef?: React.Ref<HTMLElement>
}) {
  const { id, title, markdown, sectionRef } = props
  const [copied, setCopied] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`## ${title}\n\n${markdown}`)
      if (timerRef.current) clearTimeout(timerRef.current)
      setCopied(true)
      timerRef.current = setTimeout(() => {
        setCopied(false)
        timerRef.current = null
      }, COPY_RESET_MS)
    } catch {
      /* clipboard failure should not interrupt the demo */
    }
  }, [markdown, title])

  return (
    <section
      id={id}
      ref={sectionRef}
      className="scroll-mt-[length:var(--space-1200)] border-t border-border/50 py-[length:var(--space-500)] first:border-t-0 first:pt-0"
    >
      <div className="mb-[length:var(--space-300)] flex min-w-0 items-center justify-start gap-[length:var(--space-200)]">
        <h2 className="min-w-0 shrink text-[length:var(--font-size-lg)] font-[var(--font-weight-semibold)] leading-snug text-text">
          {title}
        </h2>
        <button
          type="button"
          onClick={() => void handleCopy()}
          aria-label={copied ? "已复制" : `复制${title}`}
          title={copied ? "已复制" : `复制${title}`}
          className="flex size-[length:var(--space-800)] shrink-0 items-center justify-center rounded-[length:var(--radius-200)] border border-border bg-[var(--black-alpha-11)] text-text-secondary shadow-xs transition-colors hover:bg-[var(--black-alpha-12)] hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          {copied ? (
            <Check className="size-[length:var(--space-400)] text-text" strokeWidth={2} aria-hidden />
          ) : (
            <Copy className="size-[length:var(--space-400)]" strokeWidth={2} aria-hidden />
          )}
        </button>
      </div>
      <SpecDocBody markdown={markdown} />
    </section>
  )
}

function SectionDockBar(props: {
  sections: readonly DetailSection[]
  onJump: (id: string) => void
}) {
  const { sections, onJump } = props
  if (!sections.length) return null

  return (
    <div className="sticky bottom-0 z-20 -mx-[length:var(--space-400)] mb-[calc(var(--space-600)*-1)] border-t border-border/60 bg-bg-secondary px-[length:var(--space-300)] pb-[length:var(--space-800)] pt-[length:var(--space-300)] shadow-sm after:absolute after:inset-x-0 after:top-full after:h-[length:var(--space-600)] after:bg-bg-secondary">
      <div className="flex min-w-0 flex-wrap gap-[length:var(--space-150)]">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => onJump(section.id)}
            className="min-h-[length:var(--space-700)] max-w-full rounded-[length:var(--radius-200)] bg-[var(--black-alpha-11)] px-[length:var(--space-250)] py-[length:var(--space-100)] text-left text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] leading-snug text-text-secondary transition-colors hover:bg-[var(--black-alpha-12)] hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="line-clamp-2">{section.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function InteractionDemoInstructionSetShell(props: {
  children: React.ReactNode
  onCommand: (cmd: DemoInstructionCommand) => void
}) {
  const { children, onCommand } = props
  const [selectedId, setSelectedId] = React.useState(
    DEMO_INSTRUCTION_CATEGORIES[0]?.demos[0]?.id ?? "",
  )
  const [leftWidthPx, setLeftWidthPx] = React.useState(LEFT_DEFAULT_WIDTH_PX)
  const [rightWidthPx, setRightWidthPx] = React.useState(RIGHT_DEFAULT_WIDTH_PX)
  const leftDragRef = React.useRef<{ startX: number; startW: number } | null>(null)
  const rightDragRef = React.useRef<{ startX: number; startW: number } | null>(null)
  const detailScrollRef = React.useRef<HTMLElement | null>(null)
  const detailSectionRefs = React.useRef<Record<string, HTMLElement | null>>({})

  const selected = React.useMemo(() => {
    for (const category of DEMO_INSTRUCTION_CATEGORIES) {
      const hit = category.demos.find((demo) => demo.id === selectedId)
      if (hit) return hit
    }
    return DEMO_INSTRUCTION_CATEGORIES[0]?.demos[0] ?? null
  }, [selectedId])

  const detailSections = React.useMemo<DetailSection[]>(
    () =>
      selected
        ? [
            {
              id: `${selected.id}-dev-prompt`,
              title: "开发指令 prompt",
              markdown: selected.devPromptMarkdown,
            },
            {
              id: `${selected.id}-logic`,
              title: "交互逻辑说明",
              markdown: selected.logicMarkdown,
            },
          ]
        : [],
    [selected],
  )

  const scrollDetailSectionIntoView = React.useCallback((id: string) => {
    detailSectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  const handleDemoClick = React.useCallback(
    (demo: DemoScenario) => {
      setSelectedId(demo.id)
      onCommand(demo.command)
    },
    [onCommand],
  )

  const onLeftResizePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      leftDragRef.current = { startX: e.clientX, startW: leftWidthPx }
    },
    [leftWidthPx],
  )

  const onLeftResizePointerMove = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!leftDragRef.current) return
    setLeftWidthPx(clampSideWidth(leftDragRef.current.startW + e.clientX - leftDragRef.current.startX))
  }, [])

  const onRightResizePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      rightDragRef.current = { startX: e.clientX, startW: rightWidthPx }
    },
    [rightWidthPx],
  )

  const onRightResizePointerMove = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!rightDragRef.current) return
    setRightWidthPx(clampSideWidth(rightDragRef.current.startW - (e.clientX - rightDragRef.current.startX)))
  }, [])

  const onResizePointerUp = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    try {
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
    leftDragRef.current = null
    rightDragRef.current = null
  }, [])

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-row pt-[76px]">
      <nav
        className="flex min-h-0 shrink-0 flex-col gap-0 overflow-y-auto overflow-x-hidden border-r border-border/40 py-[length:var(--space-200)]"
        style={{ width: leftWidthPx }}
        aria-label="交互演示指令集·演示入口"
      >
        {DEMO_INSTRUCTION_CATEGORIES.map((category) => (
          <div key={category.id} className="min-w-0">
            <div
              style={{ paddingLeft: DOC_ZONE_PAD_X, height: OUTLINE_HIT_H, minHeight: OUTLINE_HIT_H }}
              className="flex w-full min-w-0 items-center gap-0 rounded-none border-0 py-0 pr-0 text-left text-text-secondary"
            >
              <span className="min-w-0 flex-1 truncate text-[length:var(--font-size-sm)] font-[var(--font-weight-regular)] leading-none">
                {category.title}
              </span>
            </div>
            {category.demos.map((demo) => {
              const active = demo.id === selectedId
              return (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => handleDemoClick(demo)}
                  style={{
                    paddingLeft: `calc(${DOC_ZONE_PAD_X} + ${OUTLINE_DEMO_INDENT_FROM_EDGE})`,
                    height: OUTLINE_HIT_H,
                    minHeight: OUTLINE_HIT_H,
                  }}
                  className={cn(
                    "flex w-full min-w-0 items-center gap-0 rounded-none border-0 py-0 pr-0 text-left text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] leading-none text-primary transition-colors hover:bg-[var(--black-alpha-11)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                    active && "bg-[var(--black-alpha-11)]",
                  )}
                >
                  <span className="min-w-0 flex-1 truncate text-left">演示：{demo.title}</span>
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="调整演示入口宽度"
        onPointerDown={onLeftResizePointerDown}
        onPointerMove={onLeftResizePointerMove}
        onPointerUp={onResizePointerUp}
        onPointerCancel={onResizePointerUp}
        className="group relative z-10 shrink-0 cursor-col-resize touch-none select-none"
        style={{ width: SPLITTER_WIDTH_PX }}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col pb-[length:var(--space-600)] pl-[length:var(--space-50)] pr-[length:var(--space-50)] pt-0">
        {children}
      </div>

      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="调整逻辑和指令区域宽度"
        onPointerDown={onRightResizePointerDown}
        onPointerMove={onRightResizePointerMove}
        onPointerUp={onResizePointerUp}
        onPointerCancel={onResizePointerUp}
        className="group relative z-10 shrink-0 cursor-col-resize touch-none select-none"
        style={{ width: SPLITTER_WIDTH_PX }}
      />

      <aside
        ref={detailScrollRef}
        className="min-h-0 shrink-0 overflow-y-auto overflow-x-hidden border-l border-border/40 pb-[length:var(--space-600)] pt-[length:var(--space-300)]"
        style={{ width: rightWidthPx, paddingLeft: DOC_ZONE_PAD_X, paddingRight: DOC_ZONE_PAD_X }}
        aria-label="交互演示指令集·逻辑和指令"
      >
        {selected ? (
          <article className="py-[length:var(--space-500)]">
            <h1 className="mb-[length:var(--space-300)] text-[length:var(--font-size-xl)] font-[var(--font-weight-semibold)] leading-snug text-text">
              {selected.title}
            </h1>
            <p className="mb-[length:var(--space-500)] text-[length:var(--font-size-sm)] leading-normal text-text-secondary">
              {selected.prompt}
            </p>
            {detailSections.map((section) => (
              <CopyableMarkdownSection
                key={section.id}
                id={section.id}
                title={section.title}
                markdown={section.markdown}
                sectionRef={(node) => {
                  detailSectionRefs.current[section.id] = node
                }}
              />
            ))}
          </article>
        ) : null}
        <SectionDockBar
          sections={detailSections}
          onJump={scrollDetailSectionIntoView}
        />
      </aside>
    </div>
  )
}

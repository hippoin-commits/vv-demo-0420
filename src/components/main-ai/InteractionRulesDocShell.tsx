/**
 * 「文档演示区域」壳层：大纲 + 正文 + 拖拽宽；维护约定见 `interactionRulesSpecData.ts` 文件头注释。
 * 持续更新规范时：**勿擅自删 `demoLinks`**，并保持其挂在正确 `SpecNode` 上，大纲与文末「本节演示」方与数据一致。
 * 章节 `body` 由 `specDocBodyRender.tsx` 渲染（子集 Markdown：加粗、列表、引用等）。
 *
 * 大纲：平铺无层级递进；**每章节节点下左侧最多一行演示**（单条 `演示：{名}` 直达动作；多条 `N个演示链接` 仅滚动至正文末演示区），递进缩进相对**大纲区最左缘** 12px（`--space-300`）。
 * 章节行与演示链行：整行热区高 30px、行间无额外间距；编号与文案间距 0。
 * 左侧大纲与正文之间可拖拽调整大纲列宽。
 */
import * as React from "react"
import type { DemoInstructionCommand } from "./demoInstructionTypes"
import {
  INTERACTION_RULES_DOC_DEMO_ZONE_DISPLAY_NAME,
  INTERACTION_RULES_SPEC_DOC_TITLE,
  INTERACTION_RULES_SPEC_FLAT,
  INTERACTION_RULES_SPEC_ROOT,
  type SpecNode,
  specAnchorDomId,
  specDemoSectionDomId,
  type SpecDemoLink,
} from "./interactionRulesSpecData"
import { SpecDocBody } from "./specDocBodyRender"

/** 默认总宽略收窄，便于给右侧实景界面留空；仍可拖拽调整 */
const PANEL_DEFAULT_WIDTH = 640
const PANEL_MIN_WIDTH = 380
const PANEL_MAX_WIDTH_RATIO = 0.62

/** 左侧大纲列默认 / 最小宽度；正文区最小保留宽度 */
const OUTLINE_DEFAULT_WIDTH_PX = 220
const OUTLINE_MIN_WIDTH_PX = 128
const DOC_BODY_MIN_WIDTH_PX = 200
/** 大纲与正文之间的分割条宽度（可拖拽热区） */
const INNER_SPLITTER_W_PX = 8

/** 大纲与正文区与容器左右内边距（16px） */
const DOC_ZONE_PAD_X = "var(--space-400)"
/** 演示链接相对大纲区最左缘的递进（12px），不含章节编号列宽 */
const OUTLINE_DEMO_INDENT_FROM_EDGE = "var(--space-300)"
/** 大纲行 / 演示链行热区高度（30px） */
const OUTLINE_HIT_H = "30px"
const OUTLINE_NUM_COL = "2.75rem"
/** 编号列与标题之间无间距 */
const OUTLINE_ROW_GAP_CLASS = "gap-0"

function stripLeadingDemoColonLabel(label: string): string {
  return label.replace(/^\s*演示：\s*/, "")
}

function outlineSingleDemoRowCaption(label: string): string {
  return `演示：${stripLeadingDemoColonLabel(label)}`
}

function ArticleDemoSection(props: {
  nodeId: string
  demos: readonly SpecDemoLink[]
  onDemoCommand: (cmd: DemoInstructionCommand) => void
}) {
  const { nodeId, demos, onDemoCommand } = props
  return (
    <section
      id={specDemoSectionDomId(nodeId)}
      data-spec-demos={nodeId}
      className="scroll-mt-[length:var(--space-300)] mt-[length:var(--space-500)] border-t border-border/50 pt-[length:var(--space-400)]"
      aria-label="本节演示"
    >
      <p className="mb-[length:var(--space-300)] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-tertiary">
        本节演示
      </p>
      <ul className="flex flex-col gap-[length:var(--space-200)]">
        {demos.map((d) => (
          <li key={d.id} className="min-w-0 list-none">
            <button
              type="button"
              onClick={() => onDemoCommand(d.command)}
              className="inline-flex w-full max-w-full min-w-0 items-center justify-start rounded-md border border-border bg-transparent px-[length:var(--space-300)] py-[length:var(--space-200)] text-left text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-primary transition-colors hover:bg-[var(--black-alpha-11)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="min-w-0 break-words">{d.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function useActiveSectionOnScroll(
  scrollRef: React.RefObject<HTMLDivElement | null>,
  flat: readonly SpecNode[],
) {
  const [activeId, setActiveId] = React.useState<string | null>(flat[0]?.id ?? null)

  React.useLayoutEffect(() => {
    const root = scrollRef.current
    if (!root) return

    const measure = () => {
      const probe = root.scrollTop + 28
      let cur = flat[0]?.id ?? null
      for (const n of flat) {
        const el = root.querySelector<HTMLElement>(`[data-spec-id="${n.id}"]`)
        if (!el) continue
        if (el.offsetTop <= probe) cur = n.id
      }
      setActiveId((prev) => (prev === cur ? prev : cur))
    }

    measure()
    root.addEventListener("scroll", measure, { passive: true })
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    return () => {
      root.removeEventListener("scroll", measure)
      ro.disconnect()
    }
  }, [scrollRef, flat])

  return [activeId, setActiveId] as const
}

function DocArticle(props: {
  node: SpecNode
  onDemoCommand: (cmd: DemoInstructionCommand) => void
}) {
  const { node, onDemoCommand } = props
  const demos = node.demoLinks
  return (
    <article
      id={specAnchorDomId(node.id)}
      data-spec-id={node.id}
      className="scroll-mt-[length:var(--space-300)] border-b border-border/50 py-[length:var(--space-500)] last:border-b-0"
    >
      <h2 className="mb-[length:var(--space-300)] text-[length:var(--font-size-lg)] font-[var(--font-weight-semibold)] leading-snug text-text">
        <span className="mr-[length:var(--space-200)] font-mono text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text-tertiary">
          {node.num}
        </span>
        {node.title}
      </h2>
      {node.body.trim() ? <SpecDocBody markdown={node.body} /> : null}
      {demos?.length ? (
        <ArticleDemoSection nodeId={node.id} demos={demos} onDemoCommand={onDemoCommand} />
      ) : null}
    </article>
  )
}

function DocRecursive(props: {
  nodes: readonly SpecNode[]
  onDemoCommand: (cmd: DemoInstructionCommand) => void
}) {
  return (
    <>
      {props.nodes.map((n) => (
        <React.Fragment key={n.id}>
          <DocArticle node={n} onDemoCommand={props.onDemoCommand} />
          {n.children?.length ? (
            <DocRecursive nodes={n.children} onDemoCommand={props.onDemoCommand} />
          ) : null}
        </React.Fragment>
      ))}
    </>
  )
}

function OutlineRow(props: {
  node: SpecNode
  activeId: string | null
  onJump: (id: string) => void
  onJumpToDemosSection: (nodeId: string) => void
  onDemoCommand: (cmd: DemoInstructionCommand) => void
}) {
  const { node, activeId, onJump, onJumpToDemosSection, onDemoCommand } = props
  const rowActive = activeId === node.id
  const demos = node.demoLinks
  const demoCount = demos?.length ?? 0

  return (
    <div className="min-w-0">
      <button
        type="button"
        onClick={() => onJump(node.id)}
        style={{ paddingLeft: DOC_ZONE_PAD_X, height: OUTLINE_HIT_H, minHeight: OUTLINE_HIT_H }}
        className={
          rowActive
            ? `flex w-full min-w-0 items-center ${OUTLINE_ROW_GAP_CLASS} rounded-none border-0 py-0 pr-0 text-left bg-[var(--black-alpha-11)] text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset`
            : `flex w-full min-w-0 items-center ${OUTLINE_ROW_GAP_CLASS} rounded-none border-0 py-0 pr-0 text-left text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset`
        }
      >
        <span
          className="shrink-0 font-mono text-[length:var(--font-size-xs)] text-text-tertiary"
          style={{ width: OUTLINE_NUM_COL, minWidth: OUTLINE_NUM_COL }}
        >
          {node.num}
        </span>
        <span className="min-w-0 flex-1 truncate text-[length:var(--font-size-sm)] font-[var(--font-weight-regular)] leading-none">
          {node.title}
        </span>
      </button>
      {demoCount === 1 && demos ? (
        <button
          type="button"
          onClick={() => onDemoCommand(demos[0]!.command)}
          style={{
            paddingLeft: `calc(${DOC_ZONE_PAD_X} + ${OUTLINE_DEMO_INDENT_FROM_EDGE})`,
            height: OUTLINE_HIT_H,
            minHeight: OUTLINE_HIT_H,
          }}
          className={`flex w-full min-w-0 items-center ${OUTLINE_ROW_GAP_CLASS} rounded-none border-0 py-0 pr-0 text-left text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] leading-none text-primary transition-colors hover:bg-[var(--black-alpha-11)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset`}
        >
          <span className="min-w-0 flex-1 truncate text-left">
            {outlineSingleDemoRowCaption(demos[0]!.label)}
          </span>
        </button>
      ) : null}
      {demoCount > 1 ? (
        <button
          type="button"
          onClick={() => onJumpToDemosSection(node.id)}
          style={{
            paddingLeft: `calc(${DOC_ZONE_PAD_X} + ${OUTLINE_DEMO_INDENT_FROM_EDGE})`,
            height: OUTLINE_HIT_H,
            minHeight: OUTLINE_HIT_H,
          }}
          className={`flex w-full min-w-0 items-center ${OUTLINE_ROW_GAP_CLASS} rounded-none border-0 py-0 pr-0 text-left text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] leading-none text-primary transition-colors hover:bg-[var(--black-alpha-11)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset`}
          aria-label={`跳转到 ${node.num} 本节演示`}
        >
          <span className="min-w-0 flex-1 truncate text-left">{demoCount}个演示链接</span>
        </button>
      ) : null}
      {node.children?.map((c) => (
        <OutlineRow
          key={c.id}
          node={c}
          activeId={activeId}
          onJump={onJump}
          onJumpToDemosSection={onJumpToDemosSection}
          onDemoCommand={onDemoCommand}
        />
      ))}
    </div>
  )
}

export function InteractionRulesDocShell(props: {
  onCommand: (cmd: DemoInstructionCommand) => void
}) {
  const { onCommand } = props
  const scrollRef = React.useRef<HTMLDivElement | null>(null)
  const [widthPx, setWidthPx] = React.useState(PANEL_DEFAULT_WIDTH)
  const [outlineWidthPx, setOutlineWidthPx] = React.useState(OUTLINE_DEFAULT_WIDTH_PX)
  const outerPanelDragRef = React.useRef<{ startX: number; startW: number } | null>(null)
  const outlineColDragRef = React.useRef<{ startX: number; startOutlineW: number } | null>(null)

  const [activeId, setActiveId] = useActiveSectionOnScroll(scrollRef, INTERACTION_RULES_SPEC_FLAT)

  const outlineMaxWidthPx = React.useCallback(
    (totalW: number) =>
      Math.max(
        OUTLINE_MIN_WIDTH_PX,
        totalW - DOC_BODY_MIN_WIDTH_PX - INNER_SPLITTER_W_PX,
      ),
    [],
  )

  React.useLayoutEffect(() => {
    setOutlineWidthPx((w) => {
      const max = outlineMaxWidthPx(widthPx)
      return Math.min(Math.max(OUTLINE_MIN_WIDTH_PX, w), max)
    })
  }, [widthPx, outlineMaxWidthPx])

  const onJump = React.useCallback(
    (id: string) => {
      setActiveId(id)
      const root = scrollRef.current
      const el = root?.querySelector<HTMLElement>(`[data-spec-id="${id}"]`)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    },
    [setActiveId],
  )

  const onJumpToDemosSection = React.useCallback(
    (nodeId: string) => {
      setActiveId(nodeId)
      const root = scrollRef.current
      const el = root?.querySelector<HTMLElement>(`[data-spec-demos="${nodeId}"]`)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" })
      }
    },
    [setActiveId],
  )

  const maxWidthPx = React.useCallback(() => {
    if (typeof window === "undefined") return 960
    return Math.max(PANEL_MIN_WIDTH, Math.floor(window.innerWidth * PANEL_MAX_WIDTH_RATIO))
  }, [])

  const onOuterResizePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      outerPanelDragRef.current = { startX: e.clientX, startW: widthPx }
    },
    [widthPx],
  )

  const onOuterResizePointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!outerPanelDragRef.current) return
      const delta = e.clientX - outerPanelDragRef.current.startX
      const next = Math.min(
        maxWidthPx(),
        Math.max(PANEL_MIN_WIDTH, outerPanelDragRef.current.startW + delta),
      )
      setWidthPx(next)
    },
    [maxWidthPx],
  )

  const onOuterResizePointerUp = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    try {
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
    outerPanelDragRef.current = null
  }, [])

  const onOutlineResizePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      outlineColDragRef.current = { startX: e.clientX, startOutlineW: outlineWidthPx }
    },
    [outlineWidthPx],
  )

  const onOutlineResizePointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!outlineColDragRef.current) return
      const delta = e.clientX - outlineColDragRef.current.startX
      const max = outlineMaxWidthPx(widthPx)
      const next = Math.min(
        max,
        Math.max(OUTLINE_MIN_WIDTH_PX, outlineColDragRef.current.startOutlineW + delta),
      )
      setOutlineWidthPx(next)
    },
    [outlineMaxWidthPx, widthPx],
  )

  const onOutlineResizePointerUp = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    try {
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
    outlineColDragRef.current = null
  }, [])

  return (
    <>
      <div
        className="flex min-h-0 shrink-0 flex-row overflow-hidden bg-transparent pr-0"
        style={{ width: widthPx }}
      >
        <nav
          className="flex min-h-0 shrink-0 flex-col gap-0 overflow-y-auto overflow-x-hidden border-r border-border/40 py-[length:var(--space-200)]"
          style={{ width: outlineWidthPx }}
          aria-label={`${INTERACTION_RULES_DOC_DEMO_ZONE_DISPLAY_NAME}·大纲`}
        >
          {INTERACTION_RULES_SPEC_ROOT.map((n) => (
            <OutlineRow
              key={n.id}
              node={n}
              activeId={activeId}
              onJump={onJump}
              onJumpToDemosSection={onJumpToDemosSection}
              onDemoCommand={onCommand}
            />
          ))}
        </nav>
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label={`调整${INTERACTION_RULES_DOC_DEMO_ZONE_DISPLAY_NAME}·大纲列宽`}
          onPointerDown={onOutlineResizePointerDown}
          onPointerMove={onOutlineResizePointerMove}
          onPointerUp={onOutlineResizePointerUp}
          onPointerCancel={onOutlineResizePointerUp}
          className="group relative z-[1] shrink-0 cursor-col-resize touch-none select-none bg-transparent"
          style={{ width: INNER_SPLITTER_W_PX }}
        >
          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-transparent" />
        </div>
        <div
          ref={scrollRef}
          className="relative min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden pb-[length:var(--space-600)] pt-[length:var(--space-300)]"
          style={{ paddingLeft: DOC_ZONE_PAD_X, paddingRight: DOC_ZONE_PAD_X }}
          tabIndex={0}
          aria-label={`${INTERACTION_RULES_DOC_DEMO_ZONE_DISPLAY_NAME}·正文`}
        >
          <h1 className="mb-[length:var(--space-500)] text-[length:var(--font-size-xl)] font-[var(--font-weight-semibold)] leading-snug text-text">
            {INTERACTION_RULES_SPEC_DOC_TITLE}
          </h1>
          <DocRecursive nodes={INTERACTION_RULES_SPEC_ROOT} onDemoCommand={onCommand} />
        </div>
      </div>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label={`调整${INTERACTION_RULES_DOC_DEMO_ZONE_DISPLAY_NAME}总宽度`}
        onPointerDown={onOuterResizePointerDown}
        onPointerMove={onOuterResizePointerMove}
        onPointerUp={onOuterResizePointerUp}
        onPointerCancel={onOuterResizePointerUp}
        className="group relative z-10 w-[10px] shrink-0 cursor-col-resize touch-none select-none"
      >
        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-transparent" />
      </div>
    </>
  )
}

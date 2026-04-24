import * as React from "react"
import { SquarePen } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import { cn } from "../ui/utils"
import type { Conversation } from "../chat/data"
import { AppIconSvg, type SecondaryAppSession } from "./SecondaryAppHistorySidebar"

/**
 * 0421-有组织无教育空间（`/main-ai-no-edu-space`）专用侧边栏。
 *
 * 设计要点：
 * - 整体壳体对齐 `0417-任务-原位置编辑更新` 使用的 `SecondaryAppHistorySidebar`（宽度 / 背景 / 动画 / push-overlay 双模式）。
 * - 顶部「新对话」按钮样式由 `HistorySidebar` 迁移而来（边框按钮 + `SquarePen` 图标），与 `0417-邮箱-在对话中查看邮件内容` 一致。
 * - 侧栏分为两组：
 *   1. 微微AI（主 AI 对话历史）
 *   2. 应用使用记录（展平显示各应用，不再按二级菜单展开）
 */

type Mode = "overlay" | "push"

interface NoEduSpaceCombinedSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: Mode

  /** 主 AI 对话列表 */
  conversations: Conversation[]
  selectedConversationId?: string
  onSelectConversation: (id: string) => void
  onNewConversation?: () => void

  /** 各应用使用记录（展平不分组，不展开二级菜单） */
  appSessions: SecondaryAppSession[]
  selectedAppSessionId?: string
  onSelectAppSession: (id: string) => void
}

/** 将 Conversation 标题与最后一条消息内容归一化为侧栏可展示字符串 */
function deriveConversationTitle(conversation: Conversation): string {
  const title = conversation.sessionTitle?.trim()
  if (title) return title
  const lastMsg = conversation.messages[conversation.messages.length - 1]?.content
  if (lastMsg?.trim()) return lastMsg
  return "新对话"
}

/** 按「今日 / 7 天内 / 更早」对主 AI 对话进行分组（对齐 `HistorySidebar` 时序分组的信息层级） */
function groupConversationsByTime(conversations: Conversation[]) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  const groups = {
    today: [] as Conversation[],
    within7Days: [] as Conversation[],
    earlier: [] as Conversation[],
  }

  conversations.forEach((c) => {
    const lastMsg = c.messages[c.messages.length - 1]
    const ts = lastMsg?.createdAt ?? now.getTime()
    const d = new Date(ts)
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    if (day.getTime() >= today.getTime()) groups.today.push(c)
    else if (day.getTime() >= sevenDaysAgo.getTime()) groups.within7Days.push(c)
    else groups.earlier.push(c)
  })

  return groups
}

export function NoEduSpaceCombinedSidebar({
  open,
  onOpenChange,
  mode = "push",
  conversations,
  selectedConversationId,
  onSelectConversation,
  onNewConversation,
  appSessions,
  selectedAppSessionId,
  onSelectAppSession,
}: NoEduSpaceCombinedSidebarProps) {
  const hasInteractedRef = React.useRef(false)
  const prevOpen = React.useRef(open)
  const prevMode = React.useRef(mode)

  if (prevMode.current !== mode) {
    hasInteractedRef.current = false
    prevMode.current = mode
  }
  if (prevOpen.current !== open) {
    hasInteractedRef.current = true
    prevOpen.current = open
  }

  const shouldAnimate = hasInteractedRef.current

  const grouped = React.useMemo(() => groupConversationsByTime(conversations), [conversations])

  return (
    <>
      {/* Backdrop */}
      {open && mode === "overlay" && (
        <div
          className="absolute inset-0 z-40 bg-[var(--black-alpha-4)] backdrop-blur-[2px] transition-opacity"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Sidebar Panel：宽度对齐 HistorySidebar(280) 以容纳较长对话标题 */}
      <div
        className={cn(
          "absolute top-0 left-0 bottom-0 w-[280px] bg-cui-bg z-50 flex flex-col border-r border-border overflow-hidden",
          mode === "push" ? "md:static md:h-full md:rounded-none md:border-r md:z-0 shrink-0" : "",
          shouldAnimate && "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          open
            ? cn("translate-x-0 shadow-none", mode === "push" && "md:shadow-none")
            : cn("-translate-x-full shadow-none", mode === "push" && "md:-ml-[280px] md:translate-x-0"),
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between pl-[var(--space-400)] pr-[var(--space-300)] py-[var(--space-300)] shrink-0">
          <h2 className="text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] leading-normal text-text m-0">
            历史 & 最近使用
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="w-[var(--space-800)] h-[var(--space-800)] flex items-center justify-center text-text-secondary hover:bg-[var(--black-alpha-11)] rounded-[var(--radius-md)] transition-colors p-0 bg-transparent border-none cursor-pointer"
            title="关闭"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 1L11 11M11 1L1 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* 新对话按钮（样式移植自 HistorySidebar，与 0417-邮箱-在对话中查看邮件内容 一致） */}
        {onNewConversation && (
          <div className="px-[var(--space-300)] pb-[var(--space-200)] shrink-0">
            <button
              onClick={() => {
                onNewConversation()
                if (mode === "overlay") onOpenChange(false)
              }}
              className="flex w-full items-center justify-center gap-[var(--space-150)] bg-bg hover:shadow-xs border border-border rounded-[var(--radius-md)] text-text transition-colors cursor-pointer py-[var(--space-200)] px-[var(--space-300)] group"
            >
              <SquarePen
                size={16}
                className="text-text-secondary group-hover:text-text transition-colors"
              />
              <span className="text-[length:var(--font-size-base)] font-[var(--font-weight-regular)] leading-normal">
                新对话
              </span>
            </button>
          </div>
        )}

        <ScrollArea className="flex-1 min-h-0">
          <div className="flex flex-col pb-[var(--space-500)] w-full overflow-hidden px-[var(--space-300)] gap-[var(--space-300)]">
            {/* ── 分组 1：微微AI 对话记录（按时间分组） ── */}
            <div className="flex flex-col gap-[var(--space-100)] w-full">
              <div className="px-[var(--space-200)] pt-[var(--space-200)] pb-[var(--space-100)]">
                <span className="text-[length:var(--font-size-xs)] text-text-secondary leading-normal font-[var(--font-weight-medium)]">
                  微微AI
                </span>
              </div>

              {grouped.today.length > 0 && (
                <TimeGroup label="今日">
                  {grouped.today.map((c) => (
                    <ConversationItem
                      key={c.id}
                      label={deriveConversationTitle(c)}
                      selected={selectedConversationId === c.id}
                      onClick={() => {
                        onSelectConversation(c.id)
                        if (mode === "overlay") onOpenChange(false)
                      }}
                    />
                  ))}
                </TimeGroup>
              )}

              {grouped.within7Days.length > 0 && (
                <TimeGroup label="7 天内">
                  {grouped.within7Days.map((c) => (
                    <ConversationItem
                      key={c.id}
                      label={deriveConversationTitle(c)}
                      selected={selectedConversationId === c.id}
                      onClick={() => {
                        onSelectConversation(c.id)
                        if (mode === "overlay") onOpenChange(false)
                      }}
                    />
                  ))}
                </TimeGroup>
              )}

              {grouped.earlier.length > 0 && (
                <TimeGroup label="更早">
                  {grouped.earlier.map((c) => (
                    <ConversationItem
                      key={c.id}
                      label={deriveConversationTitle(c)}
                      selected={selectedConversationId === c.id}
                      onClick={() => {
                        onSelectConversation(c.id)
                        if (mode === "overlay") onOpenChange(false)
                      }}
                    />
                  ))}
                </TimeGroup>
              )}

              {grouped.today.length === 0 &&
                grouped.within7Days.length === 0 &&
                grouped.earlier.length === 0 && (
                  <div className="px-[var(--space-200)] py-[var(--space-200)] text-[length:var(--font-size-sm)] text-text-tertiary">
                    暂无对话
                  </div>
                )}
            </div>

            {/* 分组分隔线 */}
            <div className="h-px w-full bg-border" aria-hidden />

            {/* ── 分组 2：应用使用记录（展平，不再展开） ── */}
            <div className="flex flex-col gap-[var(--space-100)] w-full">
              <div className="px-[var(--space-200)] pt-[var(--space-100)] pb-[var(--space-100)]">
                <span className="text-[length:var(--font-size-xs)] text-text-secondary leading-normal font-[var(--font-weight-medium)]">
                  应用使用记录
                </span>
              </div>

              {appSessions.length === 0 ? (
                <div className="px-[var(--space-200)] py-[var(--space-200)] text-[length:var(--font-size-sm)] text-text-tertiary">
                  暂无使用记录
                </div>
              ) : (
                appSessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => {
                      onSelectAppSession(session.id)
                      if (mode === "overlay") onOpenChange(false)
                    }}
                    className={cn(
                      "flex items-center gap-[var(--space-200)] w-full text-left px-[var(--space-200)] py-[var(--space-200)] transition-colors border-none cursor-pointer rounded-[var(--radius-md)] relative",
                      "hover:bg-[var(--black-alpha-11)]",
                      selectedAppSessionId === session.id ? "bg-[var(--blue-alpha-12)]" : "bg-transparent",
                    )}
                  >
                    <AppIconSvg iconKey={session.appIconKey} />
                    <span
                      className={cn(
                        "text-[length:var(--font-size-base)] leading-normal truncate block flex-1 font-[var(--font-weight-regular)]",
                        selectedAppSessionId === session.id ? "text-primary" : "text-text",
                      )}
                    >
                      {session.appName}
                    </span>
                    {session.hasUncompletedAction && (
                      <div
                        className="w-[var(--space-150)] h-[var(--space-150)] rounded-full bg-[var(--orange-6)] shrink-0"
                        aria-label="有未完成操作"
                      />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  )
}

/** 时段分组（今日 / 7 天内 / 更早） */
function TimeGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[var(--space-150)] w-full">
      <div className="px-[var(--space-200)] pt-[var(--space-200)] pb-[0px]">
        <span className="text-[length:var(--font-size-xs)] text-text-secondary leading-normal font-[var(--font-weight-regular)]">
          {label}
        </span>
      </div>
      {children}
    </div>
  )
}

/** 对话条目（对齐 HistorySidebar 的选中态 `blue-alpha-12` / `text-primary`） */
function ConversationItem({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "grid grid-cols-1 w-full text-left p-[var(--space-200)] transition-colors border-none cursor-pointer rounded-[var(--radius-md)]",
        "hover:bg-[var(--black-alpha-11)]",
        selected ? "bg-[var(--blue-alpha-12)] text-primary" : "bg-transparent text-text",
      )}
    >
      <span className="text-[length:var(--font-size-base)] leading-normal truncate block w-full">
        {label}
      </span>
    </button>
  )
}

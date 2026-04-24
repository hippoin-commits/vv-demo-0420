import * as React from "react"
import { Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "../ui/utils"
import {
  getMainNavIconSrc,
  vvAiFrameAppNav,
  vvAiFrameToolbar,
  vvAiFrameUserAvatar,
} from "./vv-ai-frame-assets"

/** 主导航项 id，供后续接入路由/业务态切换 */
export type VVAppShellPrimaryNavId =
  | "message"
  | "workspace"
  | "ai"
  | "contacts"
  | "profile"

/** 侧栏快捷应用 id（静态占位，后续可接跳转） */
export type VVAppShellShortcutId =
  | "todo"
  | "education"
  | "calendar"
  | "docs"
  | "phone"
  | "tasks"
  | "project"
  | "goal"
  | "more"

export interface VVAppShellProps {
  children: React.ReactNode
  className?: string
  /** 当前选中的主导航项，默认 AI（与设计稿一致） */
  selectedPrimaryNavId?: VVAppShellPrimaryNavId
  /** 点击主导航项时切换选中态 */
  onPrimaryNavChange?: (id: VVAppShellPrimaryNavId) => void
  /** 当前选中的底部应用（与主导航独立；切换主导航时建议由业务层置空） */
  selectedShortcutId?: VVAppShellShortcutId | null
  /** 点击底部应用图标 */
  onShortcutChange?: (id: VVAppShellShortcutId) => void
  /**
   * 0421-新用户-受邀加入组织：无组织时底栏仅保留教育 +「更多」；
   * 「更多」内分「已添加 / 未添加」，未添加项右上角展示「添加」角标，点击走主 AI 门闩引导。
   */
  invite0421NoOrgDock?: boolean
  /** 与主 AI `hasOrganization` 对齐；为 true 时恢复完整底栏快捷入口 */
  shellOrganizationActive?: boolean
  /** 用户在「更多 → 未添加」中点击某快捷应用 */
  onInvite0421UnaddedShortcutClick?: (id: VVAppShellShortcutId) => void
}

const PRIMARY_NAV: {
  id: VVAppShellPrimaryNavId
  label: string
}[] = [
  { id: "message", label: "消息" },
  { id: "workspace", label: "工作台" },
  { id: "ai", label: "AI" },
  { id: "contacts", label: "通讯录" },
  { id: "profile", label: "我的" },
]

const SHORTCUT_IDS: VVAppShellShortcutId[] = [
  "todo",
  "education",
  "calendar",
  "docs",
  "phone",
  "tasks",
  "project",
  "goal",
  "more",
]

/** 无组织时底栏常驻：教育 + 个人类（与 Guidelines「个人应用」对齐；`docs` 图标作微盘占位） */
const INVITE0421_DOCK_PERSONAL_IDS: VVAppShellShortcutId[] = ["calendar", "todo", "docs"]

/** 「更多 → 已添加」：底栏四项 + 电话（邮箱走主 AI 底栏） */
const INVITE0421_POPOVER_ADDED_IDS: VVAppShellShortcutId[] = [
  "education",
  "calendar",
  "todo",
  "docs",
  "phone",
]

/** 「更多 → 未添加」：工作台类壳入口 */
const INVITE0421_POPOVER_UNADDED_IDS: VVAppShellShortcutId[] = ["tasks", "project", "goal"]

const SHORTCUT_LABEL: Record<VVAppShellShortcutId, string> = {
  todo: "待办",
  education: "教育",
  calendar: "日程",
  docs: "文档",
  phone: "电话",
  tasks: "任务",
  project: "项目",
  goal: "目标",
  more: "更多应用",
}

function invite0421ShellDisplayLabel(id: VVAppShellShortcutId): string {
  if (id === "docs") return "微盘"
  return SHORTCUT_LABEL[id]
}

function FrameIcon({
  src,
  className,
}: {
  src: string
  className?: string
}) {
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      className={cn("pointer-events-none select-none object-contain", className)}
    />
  )
}

function MacWindowControls() {
  return (
    <div
      className="flex shrink-0 items-center gap-[length:var(--space-200)]"
      aria-hidden
    >
      <span
        className="size-[length:var(--icon-2xs)] rounded-[length:var(--radius-full)] bg-[var(--red-6)]"
      />
      <span
        className="size-[length:var(--icon-2xs)] rounded-[length:var(--radius-full)] bg-[var(--yellow-8)]"
      />
      <span
        className="size-[length:var(--icon-2xs)] rounded-[length:var(--radius-full)] bg-[var(--green-6)]"
      />
    </div>
  )
}

/** 主导航单行高 56px（Figma：h-[56px]） */
const NAV_ITEM_H =
  "h-[length:calc(var(--space-1000)+var(--space-400))] min-h-[length:calc(var(--space-1000)+var(--space-400))]"

/** 与单行外框同宽高的 AI 图标区域（56×56） */
const AI_ICON_BOX =
  "size-[length:calc(var(--space-1000)+var(--space-400))]"

function PrimaryNavButton({
  id,
  label,
  iconSrc,
  selected,
  onSelect,
}: {
  id: VVAppShellPrimaryNavId
  label: string
  iconSrc: string
  selected: boolean
  onSelect?: () => void
}) {
  const isAi = id === "ai"

  /** AI：仅图标、无标题；图标 56×56 与行高外框一致 */
  if (isAi) {
    return (
      <button
        type="button"
        className={cn(
          "flex w-full flex-col items-center justify-center overflow-hidden rounded-[length:var(--radius-200)]",
          NAV_ITEM_H,
        )}
        aria-current={selected ? "page" : undefined}
        aria-label={label}
        data-nav-id={id}
        data-selected={selected ? "true" : "false"}
        onClick={() => onSelect?.()}
      >
        <FrameIcon
          src={iconSrc}
          className={cn(
            AI_ICON_BOX,
            "shrink-0 object-contain",
            !selected && "opacity-60",
          )}
        />
      </button>
    )
  }

  return (
    <button
      type="button"
      className={cn(
        "flex w-full flex-col items-center justify-center gap-[length:var(--space-50)] overflow-hidden rounded-[length:var(--radius-200)] py-[length:var(--space-200)]",
        NAV_ITEM_H,
        selected && "bg-[var(--black-alpha-11)]",
      )}
      aria-current={selected ? "true" : undefined}
      data-nav-id={id}
      data-selected={selected ? "true" : "false"}
      onClick={() => onSelect?.()}
    >
      <FrameIcon
        src={iconSrc}
        className={cn(
          "size-[length:var(--icon-lg)] shrink-0",
          !selected && "opacity-60",
        )}
      />
      <span
        className={cn(
          "[font-family:var(--font-family-text)] w-full min-w-0 max-w-full overflow-hidden text-center text-[length:var(--font-size-xxs)] font-normal leading-[length:var(--line-height-4xs)] tracking-[var(--letter-spacing-base)] text-ellipsis whitespace-nowrap text-text-tertiary",
          selected && "text-text",
        )}
      >
        {label}
      </span>
    </button>
  )
}

function Invite0421AddBadge() {
  return (
    <span
      className="pointer-events-none absolute -right-0.5 -top-0.5 z-[1] flex size-[14px] items-center justify-center rounded-full border border-border bg-bg shadow-xs ring-2 ring-[var(--vv-ai-frame-background)]"
      aria-hidden
    >
      <Plus className="size-[9px] text-primary" strokeWidth={2.75} aria-hidden />
    </span>
  );
}

export function VVAppShell({
  children,
  className,
  selectedPrimaryNavId = "ai",
  onPrimaryNavChange,
  selectedShortcutId = null,
  onShortcutChange,
  invite0421NoOrgDock = false,
  shellOrganizationActive = true,
  onInvite0421UnaddedShortcutClick,
}: VVAppShellProps) {
  const [invite0421MoreOpen, setInvite0421MoreOpen] = React.useState(false)

  const useInvite0421Dock = invite0421NoOrgDock && !shellOrganizationActive

  const renderShortcutButton = (id: VVAppShellShortcutId, opts?: { showAddBadge?: boolean }) => {
    const selected = selectedShortcutId === id
    const showAddBadge = opts?.showAddBadge ?? false
    return (
      <button
        key={id}
        type="button"
        className={cn(
          "relative flex size-[length:var(--icon-md)] shrink-0 items-center justify-center rounded-[length:var(--radius-100)] transition-colors transition-opacity",
          "opacity-60 hover:bg-[var(--black-alpha-11)] hover:opacity-100",
          selected && "bg-[var(--black-alpha-11)] opacity-100",
        )}
        aria-pressed={selected}
        aria-label={SHORTCUT_LABEL[id]}
        data-shortcut-id={id}
        data-selected={selected ? "true" : "false"}
        onClick={() => onShortcutChange?.(id)}
      >
        {showAddBadge ? <Invite0421AddBadge /> : null}
        <FrameIcon
          src={selected ? vvAiFrameAppNav[id].on : vvAiFrameAppNav[id].off}
          className="size-[length:var(--icon-md)] object-contain"
        />
      </button>
    )
  }

  const renderInvite0421Dock = () => (
    <>
      {renderShortcutButton("education")}
      {INVITE0421_DOCK_PERSONAL_IDS.map((id) => renderShortcutButton(id))}
      <Popover open={invite0421MoreOpen} onOpenChange={setInvite0421MoreOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "relative flex size-[length:var(--icon-md)] shrink-0 items-center justify-center rounded-[length:var(--radius-100)] transition-colors transition-opacity",
              "opacity-60 hover:bg-[var(--black-alpha-11)] hover:opacity-100",
              selectedShortcutId === "more" && "bg-[var(--black-alpha-11)] opacity-100",
            )}
            aria-label={SHORTCUT_LABEL.more}
            data-shortcut-id="more"
          >
            <FrameIcon
              src={
                selectedShortcutId === "more"
                  ? vvAiFrameAppNav.more.on
                  : vvAiFrameAppNav.more.off
              }
              className="size-[length:var(--icon-md)] object-contain"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          align="end"
          sideOffset={8}
          className="w-[min(calc(100vw-2rem),260px)] border-border p-0 shadow-lg"
        >
          <div className="max-h-[min(70vh,22rem)] overflow-y-auto p-2">
            <p className="px-2 pb-1 text-[10px] font-[var(--font-weight-medium)] uppercase tracking-wide text-text-tertiary">
              已添加
            </p>
            <div className="flex flex-col gap-0.5 px-1 pb-2">
              {INVITE0421_POPOVER_ADDED_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  className="flex w-full items-center gap-2 rounded-[length:var(--radius-md)] px-2 py-2 text-left text-[length:var(--font-size-sm)] text-text hover:bg-[var(--black-alpha-08)]"
                  onClick={() => {
                    setInvite0421MoreOpen(false)
                    onShortcutChange?.(id)
                  }}
                >
                  <span className="relative inline-flex shrink-0">
                    <FrameIcon
                      src={vvAiFrameAppNav[id].off}
                      className="size-8 object-contain opacity-90"
                    />
                  </span>
                  <span>{invite0421ShellDisplayLabel(id)}</span>
                </button>
              ))}
            </div>
            <div className="mx-1 h-px bg-border" />
            <p className="px-2 pb-1 pt-2 text-[10px] font-[var(--font-weight-medium)] uppercase tracking-wide text-text-tertiary">
              未添加
            </p>
            <div className="flex flex-wrap gap-1 px-1 pb-1">
              {INVITE0421_POPOVER_UNADDED_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  className="relative flex w-[calc(33.333%-4px)] min-w-[72px] flex-col items-center gap-1 rounded-[length:var(--radius-md)] py-2 text-center hover:bg-[var(--black-alpha-08)]"
                  onClick={() => {
                    setInvite0421MoreOpen(false)
                    onInvite0421UnaddedShortcutClick?.(id)
                  }}
                >
                  <span className="relative inline-flex size-9 items-center justify-center">
                    <Invite0421AddBadge />
                    <FrameIcon src={vvAiFrameAppNav[id].off} className="size-8 object-contain opacity-90" />
                  </span>
                  <span className="line-clamp-2 w-full px-0.5 text-[10px] leading-tight text-text-secondary">
                    {invite0421ShellDisplayLabel(id)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )

  return (
    <div
      className={cn(
        "flex size-full min-h-0 overflow-hidden rounded-[length:var(--radius-300)] border-[length:var(--stroke-sm)] border-[color:var(--white-alpha-2)] bg-[var(--vv-ai-frame-background)] shadow-[var(--shadow-xl)] backdrop-blur-[length:var(--blur-400)]",
        className,
      )}
      data-vv-app-shell
    >
      {/* 侧栏 — 对齐 Figma「1. PC/侧导航_Mac」 */}
      <aside
        className="flex h-full min-h-[600px] w-[min-content] min-w-[calc(var(--space-1000)+var(--space-800))] shrink-0 flex-col items-center gap-[calc(var(--space-600)+var(--space-50))] px-[length:var(--space-200)] pb-[length:var(--space-500)] pt-[length:var(--space-300)]"
        data-name="sidebar"
      >
        <MacWindowControls />

        <div className="flex min-h-0 flex-1 flex-col items-center gap-[length:var(--space-1000)]">
          {/* 列宽 56px：与 Figma「主导航」w-[56px] 一致 */}
          <div className="flex w-[length:calc(var(--space-800)+var(--space-600))] flex-col items-center gap-[length:var(--space-300)]">
            <Avatar className="size-[length:var(--space-900)] rounded-[length:var(--radius-base)]">
              <AvatarImage
                src={vvAiFrameUserAvatar}
                alt="用户头像"
                className="object-cover"
              />
              <AvatarFallback className="rounded-[length:var(--radius-base)] text-[length:var(--font-size-xs)]">
                用户
              </AvatarFallback>
            </Avatar>

            <nav
              className="flex w-full flex-col gap-0"
              aria-label="主导航"
              data-name="primary-nav"
            >
              {PRIMARY_NAV.map((item) => {
                const selected = selectedPrimaryNavId === item.id
                return (
                  <PrimaryNavButton
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    iconSrc={getMainNavIconSrc(item.id, selected)}
                    selected={selected}
                    onSelect={() => onPrimaryNavChange?.(item.id)}
                  />
                )
              })}
            </nav>
          </div>

          <div
            className="flex min-h-0 flex-1 flex-col items-center justify-end gap-[length:var(--space-300)] overflow-hidden"
            data-name="shortcuts"
          >
            {useInvite0421Dock
              ? renderInvite0421Dock()
              : SHORTCUT_IDS.map((id) => renderShortcutButton(id))}
          </div>
        </div>
      </aside>

      {/* 右侧主体 */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col pr-[length:var(--space-150)] pb-[length:var(--space-150)]">
        <header
          className="flex h-[calc(var(--space-1000)+var(--space-250))] shrink-0 items-center gap-[length:var(--space-400)] pr-[length:var(--space-300)]"
          data-name="top-toolbar"
        >
          <div className="flex h-full min-w-0 flex-1 flex-col justify-center overflow-hidden py-[length:var(--space-250)]">
            <div className="flex items-center justify-center gap-[length:var(--space-300)]">
              <div
                className="flex shrink-0 items-center gap-[length:var(--space-100)] rounded-[length:var(--radius-200)] border-[length:var(--stroke-xs)] border-[color:var(--white-alpha-0)] bg-[var(--white-alpha-5)] px-[length:var(--space-250)] py-[length:var(--space-150)]"
                data-name="search"
              >
                <FrameIcon
                  src={vvAiFrameToolbar.search}
                  className="size-[length:var(--icon-sm)] shrink-0 opacity-60"
                />
                <span className="w-[15rem] max-w-full shrink-0 overflow-hidden [font-family:var(--font-family-text)] text-[length:var(--font-size-xs)] font-normal leading-[length:var(--line-height-2xs)] tracking-[var(--letter-spacing-base)] text-ellipsis whitespace-nowrap text-text-muted">
                  搜索
                </span>
              </div>
              <button
                type="button"
                className="flex size-[length:var(--icon-lg)] shrink-0 items-center justify-center rounded-[length:var(--radius-full)] bg-primary text-primary-foreground shadow-[var(--shadow-2xs)]"
                aria-label="新建"
              >
                <Plus className="size-[length:var(--icon-sm)]" aria-hidden />
              </button>
            </div>
          </div>

          <button
            type="button"
            className="flex size-[length:var(--icon-md)] shrink-0 items-center justify-center text-text-tertiary"
            aria-label="应用"
          >
            <FrameIcon src={vvAiFrameToolbar.apps} className="size-full" />
          </button>
          <button
            type="button"
            className="flex size-[length:var(--icon-md)] shrink-0 items-center justify-center text-text-tertiary"
            aria-label="设置"
          >
            <FrameIcon src={vvAiFrameToolbar.settings} className="size-full" />
          </button>
          <button
            type="button"
            className="flex size-[length:var(--icon-md)] shrink-0 items-center justify-center text-text-tertiary"
            aria-label="助手"
          >
            <FrameIcon src={vvAiFrameToolbar.robot} className="size-full" />
          </button>
        </header>

        <div
          className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[length:var(--radius-200)] bg-bg-secondary"
          data-name="content"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

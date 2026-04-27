import * as React from "react"
import {
  LayoutGrid,
  List,
  Mic,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Smile,
  UserPlus,
  Video,
  Bot,
  FolderOpen,
  Image as ImageIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { cn } from "../ui/utils"

const TAB_ITEMS = ["全部", "@我", "未读 6", "单聊", "群聊", "…"] as const

/** Figma 消息列表列宽 272px → 34×8px token */
const IM_LIST_W = "w-[length:calc(var(--space-200)*34)] min-w-[length:calc(var(--space-200)*34)] max-w-[length:calc(var(--space-200)*34)] shrink-0"

/** 顶栏高度 ≈50px（稿 h-[50px]） */
const IM_TOPBAR_H =
  "h-[length:calc(var(--space-1000)+var(--space-200)+var(--space-50))] min-h-[length:calc(var(--space-1000)+var(--space-200)+var(--space-50))]"

/** 会话标题栏 ≈60px（稿 h-[60px]） */
const IM_CHAT_HEADER_H =
  "h-[length:calc(var(--space-900)+var(--space-600))] min-h-[length:calc(var(--space-900)+var(--space-600))]"

type ConvRow = {
  id: string
  name: string
  time: string
  preview: string
  selected?: boolean
  unread?: number
  previewPrefix?: string
}

const MOCK_CONVERSATIONS: ConvRow[] = [
  {
    id: "1",
    name: "魏梦敏",
    time: "16:18",
    preview: "这是对方发送过来的消息内容",
    selected: true,
  },
  {
    id: "2",
    name: "外部群",
    time: "15:56",
    preview: "张三：对方发过来的消息内容",
    unread: 8,
  },
  {
    id: "3",
    name: "方明明",
    time: "13:48",
    preview: "设计稿已更新Rainbow了～",
    previewPrefix: "[未读]",
  },
]

/**
 * 交互规范文档演示：IM 主界面框架（Figma `2019:73546`）。
 * 顶栏搜索 + 加号 + 全局图标 **横跨** 会话列表与聊天区；下列为左 272px 白底列表 + 右 `#f6f7f8` 聊天列（与稿一致）。
 * 左侧主导航与底栏由外层 `VVAppShell` 提供。
 */
export function InteractionRulesImFrameworkModule({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = React.useState<(typeof TAB_ITEMS)[number]>("全部")

  return (
    <div
      className={cn(
        "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-bg-secondary",
        className,
      )}
      role="region"
      aria-label="消息（演示框架）"
      data-interaction-rules-im-framework
    >
      {/* 与稿一致：全局顶栏覆盖「列表 + 聊天」整块主区，而非仅右侧 */}
      <header
        className={cn(
          IM_TOPBAR_H,
          "flex shrink-0 items-center gap-[length:var(--space-400)] border-b border-border/60 bg-bg-secondary pl-[length:var(--space-500)] pr-[length:var(--space-500)]",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center justify-center">
          <div className="flex items-center gap-[length:var(--space-300)]">
            <div
              className={cn(
                "flex items-center gap-[length:var(--space-100)] rounded-[length:var(--radius-200)]",
                "border-[length:var(--stroke-sm)] border-white/80 bg-white/50 px-[length:var(--space-250)] py-[length:var(--space-100)] backdrop-blur-md",
              )}
            >
              <Search
                className="size-[length:var(--icon-sm)] shrink-0 text-text-tertiary"
                strokeWidth={2}
                aria-hidden
              />
              <span className="w-[length:calc(var(--space-800)*7.5)] truncate text-[length:var(--font-size-xs)] leading-[length:var(--line-height-2xs)] text-input-placeholder">
                搜索
              </span>
            </div>
            <button
              type="button"
              className="flex size-[length:var(--space-600)] shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elevation-sm transition-opacity hover:opacity-90"
              aria-label="新建（演示）"
            >
              <Plus className="size-[length:var(--icon-sm)]" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>
        <button
          type="button"
          className="shrink-0 text-text-tertiary opacity-70 transition-colors hover:text-text-secondary hover:opacity-100"
          aria-label="应用（演示）"
        >
          <LayoutGrid className="size-[length:var(--icon-md)]" strokeWidth={2} aria-hidden />
        </button>
        <button
          type="button"
          className="shrink-0 text-text-tertiary opacity-70 transition-colors hover:text-text-secondary hover:opacity-100"
          aria-label="设置（演示）"
        >
          <Settings className="size-[length:var(--icon-md)]" strokeWidth={2} aria-hidden />
        </button>
        <button
          type="button"
          className="shrink-0 text-text-tertiary opacity-70 transition-colors hover:text-text-secondary hover:opacity-100"
          aria-label="AI（演示）"
        >
          <Bot className="size-[length:var(--icon-md)]" strokeWidth={2} aria-hidden />
        </button>
      </header>

      {/* 下列：左列表 | 右聊天（稿中「消息」行） */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-row overflow-hidden p-[length:var(--space-150)] pt-[length:var(--space-100)]">
        <div
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-row overflow-hidden rounded-[length:var(--radius-200)] border border-border bg-bg shadow-elevation-sm",
          )}
        >
          <aside
            className={cn(
              IM_LIST_W,
              "flex flex-col overflow-hidden border-r border-border bg-bg",
            )}
          >
            <div
              className="flex shrink-0 items-stretch border-b border-border bg-bg px-[length:var(--space-100)] pt-[length:var(--space-100)]"
              role="tablist"
              aria-label="消息分类"
            >
              {TAB_ITEMS.map((tab) => {
                const on = activeTab === tab
                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActiveTab(tab)}
                    className="flex min-w-0 flex-1 flex-col items-center justify-end pb-0"
                  >
                    <span
                      className={cn(
                        "px-[length:var(--space-400)] pb-[length:var(--space-100)] pt-[length:var(--space-100)] text-center text-[length:var(--font-size-xs)] leading-[length:var(--line-height-2xs)]",
                        on
                          ? "font-[var(--font-weight-medium)] text-text"
                          : "font-[var(--font-weight-regular)] text-text-tertiary",
                      )}
                    >
                      {tab}
                    </span>
                    <span
                      className={cn(
                        "mb-[-2px] h-[length:var(--space-50)] w-[length:var(--space-600)] shrink-0 rounded-full",
                        on ? "bg-primary" : "bg-transparent",
                      )}
                      aria-hidden
                    />
                  </button>
                )
              })}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-[length:var(--space-200)] py-[length:var(--space-100)]">
              <ul className="flex flex-col gap-0">
                {MOCK_CONVERSATIONS.map((row) => (
                  <li key={row.id}>
                    <button
                      type="button"
                      className={cn(
                        "relative flex w-full items-start gap-[length:var(--space-200)] rounded-[length:var(--radius-200)] p-[length:var(--space-300)] text-left transition-colors",
                        row.selected ? "bg-bg-tertiary" : "hover:bg-bg-secondary",
                      )}
                    >
                      <div className="relative shrink-0">
                        <Avatar className="size-[length:var(--space-1000)] rounded-[length:var(--radius-100)]">
                          <AvatarImage src="" alt="" />
                          <AvatarFallback className="rounded-[length:var(--radius-100)] text-[length:var(--font-size-xs)]">
                            {row.name.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        {row.unread != null ? (
                          <span className="absolute -right-[length:var(--space-100)] -top-[length:var(--space-100)] flex h-[length:var(--space-400)] min-w-[length:var(--space-400)] items-center justify-center rounded-full bg-[var(--red-7)] px-[length:var(--space-100)] text-[length:var(--font-size-xxs)] font-[var(--font-weight-medium)] leading-[length:var(--line-height-4xs)] text-white">
                            {row.unread}
                          </span>
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-[length:var(--space-100)]">
                          <span className="min-w-0 flex-1 truncate text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] leading-[length:var(--line-height-xs)] text-text">
                            {row.name}
                          </span>
                          <span className="shrink-0 font-[var(--font-family-data)] text-[length:var(--font-size-xs)] leading-[length:var(--line-height-2xs)] text-text-muted">
                            {row.time}
                          </span>
                        </div>
                        <p className="mt-[length:var(--space-100)] truncate text-[length:var(--font-size-xs)] leading-[length:var(--line-height-3xs)] text-text-tertiary">
                          {row.previewPrefix ? (
                            <span className="text-primary">{row.previewPrefix}</span>
                          ) : null}
                          {row.preview}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* 右：单聊（稿 bg #f6f7f8 → gray-11 / bg-tertiary） */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-bg-tertiary">
            <div
              className={cn(
                IM_CHAT_HEADER_H,
                "flex shrink-0 items-center border-b border-border px-[length:var(--space-500)]",
              )}
            >
              <Avatar className="size-[length:var(--space-900)] shrink-0 rounded-[length:var(--radius-100)]">
                <AvatarImage src="" alt="" />
                <AvatarFallback className="rounded-[length:var(--radius-100)] text-[length:var(--font-size-xs)]">
                  魏
                </AvatarFallback>
              </Avatar>
              <div className="ml-[length:var(--space-400)] min-w-0 flex-1">
                <p className="truncate text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] leading-[length:var(--line-height-md)] text-text">
                  魏梦敏
                </p>
                <div className="mt-[length:var(--space-50)] flex min-w-0 items-center gap-[length:var(--space-200)] truncate text-[length:var(--font-size-xs)] leading-[length:var(--line-height-2xs)] text-text-tertiary">
                  <span className="truncate">高级UI设计师</span>
                  <span className="h-[length:var(--space-200)] w-px shrink-0 bg-border-divider" aria-hidden />
                  <span className="truncate">UI设计 - 微微集团</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-[length:var(--space-400)] text-text-tertiary opacity-70">
                <Video className="size-[length:var(--icon-md)]" strokeWidth={2} aria-hidden />
                <List className="size-[length:var(--icon-md)]" strokeWidth={2} aria-hidden />
                <UserPlus className="size-[length:var(--icon-md)]" strokeWidth={2} aria-hidden />
                <MoreHorizontal className="size-[length:var(--icon-md)]" strokeWidth={2} aria-hidden />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto bg-bg-tertiary px-[length:var(--space-500)] py-[length:var(--space-350)]">
              <p className="mb-[length:var(--space-800)] text-center text-[length:var(--font-size-xs)] leading-[length:var(--line-height-4xs)] text-text-tertiary">
                昨天 15:00
              </p>
              <div className="mb-[length:var(--space-800)] flex gap-[length:var(--space-350)] pl-[length:var(--space-100)]">
                <Avatar className="size-[length:var(--space-900)] shrink-0 rounded-[length:var(--radius-100)]">
                  <AvatarImage src="" alt="" />
                  <AvatarFallback className="rounded-[length:var(--radius-100)] text-[length:var(--font-size-xxs)]">
                    对
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-[min(100%,length:calc(var(--space-800)*11.25))] rounded-[length:var(--radius-200)] bg-bg px-[length:var(--space-300)] py-[length:var(--space-250)]">
                  <p className="text-[length:var(--font-size-base)] leading-[length:var(--line-height-xs)] text-text">
                    这是一条文本消息
                  </p>
                </div>
              </div>
              <div className="mb-[length:var(--space-800)] flex justify-end gap-[length:var(--space-350)] pr-[length:var(--space-100)]">
                <div className="flex max-w-[min(100%,length:calc(var(--space-800)*13.625))] flex-col items-end gap-[length:var(--space-100)]">
                  <div className="rounded-[length:var(--radius-200)] bg-[var(--blue-11)] px-[length:var(--space-300)] py-[length:var(--space-250)] dark:bg-[var(--blue-alpha-10)]">
                    <p className="text-[length:var(--font-size-base)] leading-[length:var(--line-height-xs)] text-text">
                      这是一条文本消息
                    </p>
                  </div>
                  <span className="text-[length:var(--font-size-xs)] leading-[length:var(--line-height-4xs)] text-text-tertiary">
                    已读
                  </span>
                </div>
                <Avatar className="size-[length:var(--space-900)] shrink-0 rounded-[length:var(--radius-100)]">
                  <AvatarImage src="" alt="" />
                  <AvatarFallback className="rounded-[length:var(--radius-100)] text-[length:var(--font-size-xxs)]">
                    我
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex gap-[length:var(--space-350)] pl-[length:var(--space-100)]">
                <Avatar className="size-[length:var(--space-900)] shrink-0 rounded-[length:var(--radius-100)]">
                  <AvatarImage src="" alt="" />
                  <AvatarFallback className="rounded-[length:var(--radius-100)] text-[length:var(--font-size-xxs)]">
                    对
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-[min(100%,length:calc(var(--space-800)*11.25))] rounded-[length:var(--radius-200)] bg-bg px-[length:var(--space-300)] py-[length:var(--space-250)]">
                  <p className="text-[length:var(--font-size-base)] leading-[length:var(--line-height-xs)] text-text">
                    这是一条文本消息
                  </p>
                </div>
              </div>
            </div>

            <div className="shrink-0 bg-bg-tertiary px-[length:var(--space-500)] pb-[length:var(--space-500)] pt-0">
              <div className="flex items-center justify-between gap-[length:var(--space-400)] rounded-[length:var(--radius-200)] border border-border bg-bg px-[length:var(--space-400)] py-[length:var(--space-250)]">
                <p className="min-w-0 flex-1 truncate text-[length:var(--vv-cui-font-size-base)] leading-[length:var(--line-height-sm)] text-input-placeholder">
                  请输入消息，Shift+Enter换行，Enter发送
                </p>
                <div className="flex shrink-0 items-center gap-[length:var(--space-400)] text-text-tertiary opacity-70">
                  <Mic className="size-[length:var(--icon-md)]" strokeWidth={2} aria-hidden />
                  <span className="h-[length:var(--space-300)] w-px bg-border-divider" aria-hidden />
                  <Smile className="size-[length:var(--icon-md)]" strokeWidth={2} aria-hidden />
                  <FolderOpen className="size-[length:var(--icon-md)]" strokeWidth={2} aria-hidden />
                  <ImageIcon className="size-[length:var(--icon-md)]" strokeWidth={2} aria-hidden />
                  <Video className="size-[length:var(--icon-md)]" strokeWidth={2} aria-hidden />
                  <Plus className="size-[length:var(--icon-md)]" strokeWidth={2} aria-hidden />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

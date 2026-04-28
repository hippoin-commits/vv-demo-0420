import * as React from "react"
import {
  FolderOpen,
  Image as ImageIcon,
  List,
  Mic,
  MoreHorizontal,
  Plus,
  Smile,
  UserPlus,
  Video,
} from "lucide-react"
import { cn } from "../ui/utils"

const TAB_ITEMS = ["全部", "@我", "未读 6", "单聊", "群聊"] as const

/** Figma 消息列表列宽 260px → 160 + 64 + 32 + 4 */
const IM_LIST_W =
  "w-[length:calc(var(--space-4000)+var(--space-1600)+var(--space-800)+var(--space-100))] min-w-[length:calc(var(--space-4000)+var(--space-1600)+var(--space-800)+var(--space-100))] max-w-[length:calc(var(--space-4000)+var(--space-1600)+var(--space-800)+var(--space-100))] shrink-0"

/** 会话标题栏 ≈58px（稿 h 约 56px） */
const IM_CHAT_HEADER_H =
  "h-[length:calc(var(--space-1000)+var(--space-400)+var(--space-50))] min-h-[length:calc(var(--space-1000)+var(--space-400)+var(--space-50))]"

type ConvRow = {
  id: string
  name: string
  time: string
  preview: string
  avatar: string
  avatarMembers?: string[]
  selected?: boolean
  unread?: number
  previewPrefix?: string
  tag?: string
  tagTone?: "primary" | "warning"
}

const MOCK_CONVERSATIONS: ConvRow[] = [
  {
    id: "1",
    name: "魏梦敏",
    time: "16:18",
    preview: "这是对方发送过来的消息内容",
    avatar: "魏",
    selected: true,
  },
  {
    id: "2",
    name: "外部群",
    time: "15:56",
    preview: "张三：对方发过来的消息内容",
    avatar: "群",
    avatarMembers: ["张", "W", "方", "李"],
    unread: 8,
  },
  {
    id: "3",
    name: "方明明",
    time: "13:48",
    preview: "设计稿已更新Rainbow了～",
    avatar: "方",
    previewPrefix: "[未读]",
    tag: "会议中",
  },
  {
    id: "4",
    name: "产品设计中心",
    time: "12:30",
    preview: "张三：消息内容",
    avatar: "产",
    avatarMembers: ["产", "研", "设", "运", "财"],
    tag: "组织",
    tagTone: "warning",
    previewPrefix: "[有人@你]",
  },
  {
    id: "5",
    name: "黄小玲",
    time: "09:18",
    preview: "帮我开下权限，谢谢！",
    avatar: "黄",
    unread: 8,
  },
  {
    id: "6",
    name: "智能群",
    time: "昨天",
    preview: "我发送的消息内容",
    avatar: "智",
    avatarMembers: ["智", "AI"],
  },
  {
    id: "7",
    name: "李玉海",
    time: "08-02",
    preview: "帮我开下权限，谢谢！",
    avatar: "李",
    previewPrefix: "[已读]",
  },
]

function ImAvatar({
  label,
  members,
  className,
}: {
  label: string
  members?: string[]
  className?: string
}) {
  if (members?.length) {
    const cells = members.slice(0, 9)
    const gridCols = cells.length <= 2 ? cells.length : cells.length <= 4 ? 2 : 3
    const gridRows = cells.length <= 2 ? 1 : cells.length <= 4 ? 2 : 3
    const groupColors = ["bg-primary", "bg-warning", "bg-success", "bg-text-secondary", "bg-primary", "bg-warning", "bg-success", "bg-text-tertiary", "bg-primary"]
    return (
      <span
        className={cn(
          "grid size-[length:var(--space-1000)] overflow-hidden rounded-[length:var(--radius-300)] bg-bg-secondary ring-1 ring-border",
          className,
        )}
        style={{
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`,
        }}
        aria-hidden
      >
        {cells.map((cell, idx) => (
          <span
            key={`${cell}-${idx}`}
            className={cn(
              "flex items-center justify-center text-[length:10px] leading-none text-primary-foreground",
              groupColors[idx],
            )}
          >
            {cell}
          </span>
        ))}
      </span>
    )
  }

  return (
    <span
      className={cn(
        "flex size-[length:var(--space-1000)] items-center justify-center overflow-hidden rounded-[length:var(--radius-300)] text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-primary-foreground ring-1 ring-border",
        "bg-primary",
        className,
      )}
      aria-hidden
    >
      {label.slice(0, 1)}
    </span>
  )
}

function ImIconButton({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "flex size-[length:var(--space-600)] shrink-0 items-center justify-center rounded-[length:var(--radius-100)] text-text-tertiary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text-secondary",
        className,
      )}
    >
      {children}
    </button>
  )
}

/**
 * 交互规范文档演示：IM 主界面框架（Figma `1:90807`）。
 * 外层 `VVAppShell` 提供左侧主导航；本组件实现 Figma 中「消息」工作区内容。
 * 左侧主导航与底栏由外层 `VVAppShell` 提供。
 */
export function InteractionRulesImFrameworkModule({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = React.useState<(typeof TAB_ITEMS)[number]>("全部")

  return (
    <div
      className={cn(
        "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[var(--gray-10)]",
        className,
      )}
      role="region"
      aria-label="消息（演示框架）"
      data-interaction-rules-im-framework
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-row overflow-hidden bg-bg">
        <aside
          className={cn(
            IM_LIST_W,
            "flex flex-col overflow-hidden rounded-tl-[length:var(--radius-200)] bg-bg",
          )}
        >
          <div className="flex h-[length:var(--space-1200)] shrink-0 items-start bg-bg px-[length:var(--space-200)] pt-[length:var(--space-200)]">
            <div
              className="scrollbar-hide flex min-w-0 flex-1 items-stretch overflow-x-auto overflow-y-hidden"
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
                    className="flex shrink-0 flex-col items-center justify-end"
                  >
                    <span
                      className={cn(
                        "whitespace-nowrap px-[length:var(--space-200)] pb-[length:var(--space-100)] pt-[length:var(--space-100)] text-center text-[length:var(--font-size-xs)] leading-[length:var(--line-height-2xs)]",
                        on
                          ? "font-[var(--font-weight-medium)] text-text"
                          : "font-[var(--font-weight-regular)] text-text-tertiary",
                      )}
                    >
                      {tab}
                    </span>
                    <span
                      className={cn("h-[length:var(--space-50)] w-[length:var(--space-600)] shrink-0 rounded-full", on ? "bg-primary" : "bg-transparent")}
                      aria-hidden
                    />
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              aria-label="更多分类（演示）"
              className="ml-[length:var(--space-100)] flex h-[length:calc(var(--line-height-2xs)+var(--space-200))] w-[length:var(--space-700)] shrink-0 items-center justify-center rounded-[length:var(--radius-100)] text-text-tertiary transition-colors hover:bg-bg-secondary hover:text-text-secondary"
            >
              <MoreHorizontal className="size-[length:var(--icon-sm)]" strokeWidth={2} aria-hidden />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-[length:var(--space-200)] pb-[length:var(--space-200)] pt-0">
            <ul className="flex flex-col gap-0">
              {MOCK_CONVERSATIONS.map((row, idx) => (
                <li key={row.id}>
                  <button
                    type="button"
                    className={cn(
                      "relative flex h-[length:calc(var(--space-1600)+var(--space-100))] w-full items-center gap-[length:var(--space-200)] rounded-[length:var(--radius-200)] px-[length:var(--space-200)] text-left transition-colors",
                      row.selected ? "bg-bg-secondary" : "hover:bg-bg-secondary",
                    )}
                  >
                      {row.selected ? (
                        <span className="absolute right-0 top-0 size-[length:var(--space-200)] rounded-bl-[length:var(--radius-50)] bg-[var(--blue-10)]" aria-hidden />
                      ) : null}
                      <div className="relative shrink-0">
                        <ImAvatar
                          label={row.avatar}
                          members={row.avatarMembers}
                          className={cn(
                            idx === 2 ? "bg-success" : idx === 4 || idx === 6 ? "bg-warning" : "",
                          )}
                        />
                        {row.unread != null ? (
                          <span className="absolute -right-[length:var(--space-100)] -top-[length:var(--space-100)] flex h-[length:var(--space-400)] min-w-[length:var(--space-400)] items-center justify-center rounded-full bg-[var(--red-7)] px-[length:var(--space-100)] text-[length:var(--font-size-xxs)] font-[var(--font-weight-medium)] leading-[length:var(--line-height-4xs)] text-white">
                            {row.unread}
                          </span>
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-[length:var(--space-100)]">
                          <span className="min-w-0 shrink truncate text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] leading-[length:var(--line-height-xs)] text-text">
                            {row.name}
                          </span>
                          {row.tag === "组织" ? (
                            <span
                              className={cn(
                                "shrink-0 rounded-[length:var(--radius-50)] px-[length:var(--space-100)] text-[length:var(--font-size-xxs)] leading-[length:var(--line-height-4xs)]",
                                row.tagTone === "warning"
                                  ? "bg-warning/15 text-warning"
                                  : "bg-primary/10 text-primary",
                              )}
                            >
                              {row.tag}
                            </span>
                          ) : null}
                          {row.tag === "会议中" ? (
                            <span className="inline-flex shrink-0 items-center gap-[length:var(--space-50)] text-[length:var(--font-size-xxs)] leading-[length:var(--line-height-4xs)] text-text-tertiary">
                              <Video className="size-[length:var(--icon-xs)]" strokeWidth={2} aria-hidden />
                              <span>会议中</span>
                            </span>
                          ) : null}
                          <span className="ml-auto shrink-0 font-[var(--font-family-data)] text-[length:var(--font-size-xs)] leading-[length:var(--line-height-2xs)] text-text-muted">
                            {row.time}
                          </span>
                        </div>
                        <p className="mt-[length:var(--space-50)] flex min-w-0 items-center gap-[length:var(--space-50)] truncate text-[length:var(--font-size-xs)] leading-[length:var(--line-height-3xs)] text-text-tertiary">
                          {row.previewPrefix ? (
                            <span
                              className={cn(
                                "shrink-0",
                                row.previewPrefix === "[有人@你]"
                                  ? "text-warning"
                                  : row.previewPrefix === "[已读]"
                                    ? "text-text-tertiary"
                                    : "text-primary",
                              )}
                            >
                              {row.previewPrefix}
                            </span>
                          ) : null}
                          <span className="min-w-0 truncate">{row.preview}</span>
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[var(--gray-11)]">
            <div
              className={cn(
                IM_CHAT_HEADER_H,
                "flex shrink-0 items-center border-b border-border bg-[var(--gray-11)] px-[length:var(--space-500)]",
              )}
            >
              <ImAvatar label="魏" />
              <div className="ml-[length:var(--space-300)] min-w-0 flex-1">
                <p className="truncate text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] leading-[length:var(--line-height-md)] text-text">
                  魏梦敏
                </p>
                <div className="mt-[length:var(--space-50)] flex min-w-0 items-center gap-[length:var(--space-200)] truncate text-[length:var(--font-size-xs)] leading-[length:var(--line-height-2xs)] text-text-tertiary">
                  <span className="truncate">高级UI设计师</span>
                  <span className="h-[length:var(--space-200)] w-px shrink-0 bg-border-divider" aria-hidden />
                  <span className="truncate">UI设计 - 微微集团</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-[length:var(--space-300)]">
                <ImIconButton label="语音/视频（演示）">
                  <Video className="size-[length:var(--icon-md)]" strokeWidth={2} aria-hidden />
                </ImIconButton>
                <ImIconButton label="聊天记录（演示）">
                  <List className="size-[length:var(--icon-md)]" strokeWidth={2} aria-hidden />
                </ImIconButton>
                <ImIconButton label="添加好友（演示）">
                  <UserPlus className="size-[length:var(--icon-md)]" strokeWidth={2} aria-hidden />
                </ImIconButton>
                <ImIconButton label="更多（演示）">
                  <MoreHorizontal className="size-[length:var(--icon-md)]" strokeWidth={2} aria-hidden />
                </ImIconButton>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--gray-11)] px-[length:var(--space-500)] py-[length:var(--space-500)]">
              <p className="mb-[length:var(--space-700)] text-center text-[length:var(--font-size-xs)] leading-[length:var(--line-height-4xs)] text-text-tertiary">
                昨天 15:00
              </p>
              <div className="mb-[length:var(--space-800)] flex gap-[length:var(--space-350)] pl-[length:var(--space-100)]">
                <ImAvatar label="魏" />
                <div className="max-w-[min(100%,length:calc(var(--space-800)*11.25))] rounded-[length:var(--radius-200)] bg-bg px-[length:var(--space-300)] py-[length:var(--space-250)]">
                  <p className="text-[length:var(--font-size-base)] leading-[length:var(--line-height-xs)] text-text">
                    这是一条文本消息
                  </p>
                </div>
              </div>
              <div className="mb-[length:var(--space-800)] flex justify-end gap-[length:var(--space-350)] pr-[length:var(--space-100)]">
                <div className="flex max-w-[min(100%,length:calc(var(--space-800)*13.625))] flex-col items-end gap-[length:var(--space-100)]">
                  <div className="rounded-[length:var(--radius-200)] bg-[var(--blue-11)] px-[length:var(--space-300)] py-[length:var(--space-250)]">
                    <p className="text-[length:var(--font-size-base)] leading-[length:var(--line-height-xs)] text-text">
                      这是一条文本消息
                    </p>
                  </div>
                  <span className="text-[length:var(--font-size-xs)] leading-[length:var(--line-height-4xs)] text-text-tertiary">
                    已读
                  </span>
                </div>
                <ImAvatar label="我" className="bg-text-secondary" />
              </div>
              <div className="flex gap-[length:var(--space-350)] pl-[length:var(--space-100)]">
                <ImAvatar label="魏" />
                <div className="max-w-[min(100%,length:calc(var(--space-800)*11.25))] rounded-[length:var(--radius-200)] bg-bg px-[length:var(--space-300)] py-[length:var(--space-250)]">
                  <p className="text-[length:var(--font-size-base)] leading-[length:var(--line-height-xs)] text-text">
                    这是一条文本消息
                  </p>
                </div>
              </div>
            </div>

            <div className="shrink-0 bg-[var(--gray-11)] px-[length:var(--space-500)] pb-[length:var(--space-500)] pt-0">
              <div className="flex h-[length:var(--space-1000)] items-center justify-between gap-[length:var(--space-400)] rounded-[length:var(--radius-200)] border border-border bg-bg px-[length:var(--space-400)]">
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
  )
}

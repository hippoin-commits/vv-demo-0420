import * as React from "react"
import { Bell, Check, ChevronLeft, ChevronUp, Clock3, Copy, FileText, MapPin, Plus, Trash2, User, Video, X } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { cn } from "../ui/utils"
import type { Schedule0422Item } from "./schedule0422Model"
import { SCHEDULE_0422_CURRENT_USER } from "./schedule0422Model"
import {
  attendeeInitials,
  formatMeetingNumberDisplay,
  formatScheduleDetailTimeLine,
  isScheduleItemPast,
  isScheduleSelfOrganizer,
  orderedScheduleAttendees,
  resolveAttendeeRsvpMap,
} from "./schedule0422ScheduleLogic"

type AttTab = "all" | "accepted" | "declined" | "tentative" | "pending"

const ATT_TABS: { id: AttTab; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "accepted", label: "接受" },
  { id: "declined", label: "拒绝" },
  { id: "tentative", label: "待定" },
  { id: "pending", label: "未响应" },
]

/** 来源 `VvAssistantBlocks` 内 `ScheduleDetailCard`；`variant="drawerCui"` 与业务入口抽屉顶栏 + ScrollArea 配套 */
export function Schedule0422DetailCard(props: {
  item: Schedule0422Item
  /** 抽屉内 CUI：外层 `ChatNavBar` 负责关闭；本卡顶部为状态 + 复制/删除 */
  variant?: "default" | "drawerCui"
  /** 旧形态：内嵌顶栏（返回 / 状态 / 复制 / 删除 / 关闭） */
  sheetToolbar?: boolean
  onToolbarDismiss?: () => void
  /** 抽屉形态下可选：与 `onToolbarDismiss` 一致，用于旧工具条「关闭」 */
  onRequestClose?: () => void
  hideOrganizationSubtitle?: boolean
  onItemUpdated: (item: Schedule0422Item) => void
}) {
  const {
    item: initial,
    variant = "default",
    sheetToolbar,
    onToolbarDismiss,
    onRequestClose,
    hideOrganizationSubtitle,
    onItemUpdated,
  } = props
  const dismissToolbar = onToolbarDismiss ?? onRequestClose
  const [liveItem, setLiveItem] = React.useState(initial)
  const [tab, setTab] = React.useState<AttTab>("all")
  const [attOpen, setAttOpen] = React.useState(true)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editTitle, setEditTitle] = React.useState(initial.title)
  const [editStart, setEditStart] = React.useState(initial.start)
  const [editEnd, setEditEnd] = React.useState(initial.end)
  const [editLocation, setEditLocation] = React.useState(initial.location ?? "")
  const [editReminder, setEditReminder] = React.useState(initial.reminder ?? "")
  const [editNotes, setEditNotes] = React.useState(initial.notes ?? "")

  React.useEffect(() => {
    setLiveItem(initial)
    setEditTitle(initial.title)
    setEditStart(initial.start)
    setEditEnd(initial.end)
    setEditLocation(initial.location ?? "")
    setEditReminder(initial.reminder ?? "")
    setEditNotes(initial.notes ?? "")
    setIsEditing(false)
  }, [initial])

  const orgName = liveItem.organization?.trim() || "名师教育"
  const trimmedOrganizerName = liveItem.organizerName?.trim() ?? ""
  const organizer = trimmedOrganizerName || liveItem.attendees[0] || "—"
  const orderedAttendees = React.useMemo(() => orderedScheduleAttendees(liveItem), [liveItem])
  const rsvpMap = React.useMemo(() => resolveAttendeeRsvpMap(liveItem), [liveItem])
  const counts = React.useMemo(() => {
    const list = orderedAttendees
    const c = (t: AttTab) =>
      t === "all" ? list.length : list.filter((n) => rsvpMap[n] === t).length
    return {
      all: c("all"),
      accepted: c("accepted"),
      declined: c("declined"),
      tentative: c("tentative"),
      pending: c("pending"),
    }
  }, [orderedAttendees, rsvpMap])

  const filteredNames = React.useMemo(() => {
    if (tab === "all") return orderedAttendees
    return orderedAttendees.filter((n) => rsvpMap[n] === tab)
  }, [orderedAttendees, tab, rsvpMap])

  const notesForDetail = React.useMemo(() => {
    const t = liveItem.notes?.trim() ?? ""
    if (!t || t === "由统一飞书助手创建。") return ""
    return t
  }, [liveItem.notes])
  const descriptionText = notesForDetail || "暂无描述"
  const descriptionMuted = !notesForDetail

  const meetingIdDisplay = formatMeetingNumberDisplay(liveItem.meetingNumber)
  const showMeetingBlock = Boolean(liveItem.linkedMeetingId || meetingIdDisplay)
  const itemPast = isScheduleItemPast(liveItem, new Date())
  const isSelfOrganizer = isScheduleSelfOrganizer(liveItem)
  const isSelfInvitedOnly =
    liveItem.attendees.includes(SCHEDULE_0422_CURRENT_USER) && !isSelfOrganizer
  const mySelfRsvp = liveItem.attendeeRsvp?.[SCHEDULE_0422_CURRENT_USER] ?? (isSelfOrganizer ? "accepted" : "pending")
  const selfRsvpFinalized = mySelfRsvp === "accepted" || mySelfRsvp === "declined"
  const isDeleted = liveItem.status === "deleted"
  const detailInertRemoved = liveItem.status === "cancelled" || isDeleted

  const copyMeetingId = () => {
    const digits = (liveItem.meetingNumber || "").replace(/\s/g, "")
    if (!digits) return
    void navigator.clipboard?.writeText(digits)
    toast.success("已复制会议号")
  }

  const copyScheduleSummary = () => {
    void navigator.clipboard?.writeText(
      [liveItem.title, formatScheduleDetailTimeLine(liveItem), orgName].filter(Boolean).join("\n"),
    )
    toast.success("已复制日程摘要")
  }

  const openDeleteConfirm = () => {
    if (detailInertRemoved) return
    setDeleteConfirmOpen(true)
  }

  const toolbarStatusLabel =
    liveItem.status === "deleted"
      ? "已删除"
      : liveItem.status === "cancelled"
        ? "已取消"
        : itemPast
          ? "已结束"
          : "进行中"

  const beginInlineEdit = () => {
    setEditTitle(liveItem.title)
    setEditStart(liveItem.start)
    setEditEnd(liveItem.end)
    setEditLocation(liveItem.location ?? "")
    setEditReminder(liveItem.reminder ?? "")
    setEditNotes(liveItem.notes ?? "")
    setIsEditing(true)
  }

  const cancelInlineEdit = () => {
    setIsEditing(false)
    setEditTitle(liveItem.title)
    setEditStart(liveItem.start)
    setEditEnd(liveItem.end)
    setEditLocation(liveItem.location ?? "")
    setEditReminder(liveItem.reminder ?? "")
    setEditNotes(liveItem.notes ?? "")
  }

  const saveInlineEdit = () => {
    const next: Schedule0422Item = {
      ...liveItem,
      title: editTitle.trim() || liveItem.title,
      start: editStart.trim() || liveItem.start,
      end: editEnd.trim() || liveItem.end,
      time: `${editStart.trim() || liveItem.start} - ${editEnd.trim() || liveItem.end}`,
      location: editLocation.trim(),
      reminder: editReminder.trim() || liveItem.reminder,
      notes: editNotes.trim(),
    }
    setLiveItem(next)
    onItemUpdated(next)
    setIsEditing(false)
    toast.success("日程已更新")
  }

  const showLegacySheetToolbar = variant === "default" && sheetToolbar
  const showDrawerTopBar = variant === "drawerCui"

  const detailRowIcon = "size-[18px] shrink-0 text-text-secondary mt-0.5"
  const iconBtnToolbar =
    "flex size-9 shrink-0 items-center justify-center rounded-[length:var(--radius-md)] text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"

  return (
    <>
      <div
        className={cn(
          "w-full overflow-hidden rounded-[length:var(--radius-lg)] border border-border bg-bg shadow-xs",
          showLegacySheetToolbar && "rounded-none border-0 shadow-none",
          detailInertRemoved && "pointer-events-none select-none opacity-[0.58] saturate-0",
        )}
        aria-disabled={detailInertRemoved || undefined}
      >
        {showLegacySheetToolbar ? (
          <div className="flex shrink-0 items-center justify-between gap-[var(--space-200)] border-b border-border px-[var(--space-200)] py-[var(--space-200)] sm:px-[var(--space-300)]">
            <div className="flex min-w-0 flex-1 items-center gap-[var(--space-100)]">
              <button type="button" className={iconBtnToolbar} aria-label="返回" onClick={dismissToolbar}>
                <ChevronLeft className="size-5" strokeWidth={2} />
              </button>
              <span
                className={cn(
                  "truncate text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)]",
                  itemPast || liveItem.status === "cancelled" || isDeleted ? "text-text-secondary" : "text-text",
                )}
              >
                {toolbarStatusLabel}
              </span>
            </div>
            <div className="flex shrink-0 items-center">
              <button type="button" className={iconBtnToolbar} aria-label="复制日程摘要" onClick={copyScheduleSummary}>
                <Copy className="size-[18px]" strokeWidth={2} />
              </button>
              {isSelfOrganizer && !detailInertRemoved ? (
                <button
                  type="button"
                  className={cn(iconBtnToolbar, "text-destructive hover:text-destructive")}
                  aria-label="删除日程"
                  onClick={openDeleteConfirm}
                >
                  <Trash2 className="size-[18px]" strokeWidth={2} />
                </button>
              ) : null}
              <button type="button" className={iconBtnToolbar} aria-label="关闭" onClick={dismissToolbar}>
                <X className="size-[18px]" strokeWidth={2} />
              </button>
            </div>
          </div>
        ) : null}

        {showDrawerTopBar ? (
          <div className="flex shrink-0 items-center justify-between gap-[var(--space-200)] border-b border-border px-[var(--space-300)] py-[var(--space-200)]">
            <span
              className={cn(
                "truncate text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)]",
                itemPast || liveItem.status === "cancelled" || isDeleted ? "text-text-secondary" : "text-text",
              )}
            >
              {toolbarStatusLabel}
            </span>
            <div className="flex shrink-0 items-center">
              <button type="button" className={iconBtnToolbar} aria-label="复制日程摘要" onClick={copyScheduleSummary}>
                <Copy className="size-[18px]" strokeWidth={2} />
              </button>
              {isSelfOrganizer && !detailInertRemoved ? (
                <button
                  type="button"
                  className={cn(iconBtnToolbar, "text-destructive hover:text-destructive")}
                  aria-label="删除日程"
                  onClick={openDeleteConfirm}
                >
                  <Trash2 className="size-[18px]" strokeWidth={2} />
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {isDeleted ? (
          <div className="border-b border-border bg-[var(--black-alpha-11)] px-[var(--space-400)] py-[var(--space-250)] text-center text-[length:var(--font-size-sm)] text-text-secondary">
            此日程已删除，无法继续操作。
          </div>
        ) : null}

        <div
          className={cn(
            "px-[var(--space-500)] pb-[var(--space-200)] pt-[var(--space-500)]",
            (showLegacySheetToolbar || showDrawerTopBar) && "pt-4",
          )}
        >
          <div className="flex items-center justify-between gap-[var(--space-300)]">
            <div className="flex min-w-0 flex-1 items-center gap-[var(--space-200)] text-primary">
              <span className="h-4 w-[3px] shrink-0 rounded-full bg-primary" aria-hidden />
              <span className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)]">我的日程</span>
            </div>
          </div>
          {isEditing ? (
            <div className="mt-[var(--space-250)] space-y-[var(--space-200)]">
              <Label className="text-[length:var(--font-size-xs)] text-text-secondary">标题</Label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-[length:var(--font-size-base)] font-[var(--font-weight-semi-bold)]"
              />
            </div>
          ) : (
            <h2 className="mt-[var(--space-250)] text-[length:var(--font-size-xl)] font-[var(--font-weight-semi-bold)] leading-snug tracking-tight text-text">
              {liveItem.title}
            </h2>
          )}
          {!hideOrganizationSubtitle ? (
            <p className="mt-[var(--space-100)] text-[length:var(--font-size-sm)] leading-normal text-text-secondary">
              {orgName}
            </p>
          ) : null}
        </div>

        <div className="space-y-[var(--space-500)] px-[var(--space-500)] pb-[var(--space-400)] pt-[var(--space-100)] text-[length:var(--font-size-sm)]">
          <div className="flex gap-[var(--space-300)]">
            <Clock3 className={detailRowIcon} strokeWidth={1.5} />
            {isEditing ? (
              <div className="flex min-w-0 flex-1 flex-col gap-[var(--space-200)] pt-0.5 sm:flex-row">
                <div className="min-w-0 flex-1 space-y-[var(--space-100)]">
                  <Label className="text-[length:var(--font-size-xs)] text-text-secondary">开始</Label>
                  <Input value={editStart} onChange={(e) => setEditStart(e.target.value)} />
                </div>
                <div className="min-w-0 flex-1 space-y-[var(--space-100)]">
                  <Label className="text-[length:var(--font-size-xs)] text-text-secondary">结束</Label>
                  <Input value={editEnd} onChange={(e) => setEditEnd(e.target.value)} />
                </div>
              </div>
            ) : (
              <span className="min-w-0 flex-1 pt-0.5 leading-relaxed text-text">
                {formatScheduleDetailTimeLine(liveItem)}
              </span>
            )}
          </div>

          {showMeetingBlock ? (
            <div className="flex gap-[var(--space-300)]">
              <Video className={detailRowIcon} strokeWidth={1.5} />
              <div className="min-w-0 flex-1 space-y-[var(--space-200)] pt-0.5">
                <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-x-[var(--space-300)] gap-y-[var(--space-200)]">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={!liveItem.linkedMeetingId}
                    className="h-8 shrink-0 rounded-full border border-[var(--blue-alpha-8)] bg-[var(--blue-alpha-11)] px-4 text-[length:var(--font-size-sm)] font-normal text-primary shadow-none hover:bg-[var(--blue-alpha-10)] disabled:opacity-50"
                    onClick={() => toast("开始会议（演示）")}
                  >
                    开始微微会议
                  </Button>
                </div>
                {meetingIdDisplay ? (
                  <div className="flex flex-wrap items-center gap-[var(--space-100)] text-[length:var(--font-size-xs)] text-text-secondary">
                    <span>会议号 {meetingIdDisplay}</span>
                    <button
                      type="button"
                      className="inline-flex rounded p-0.5 text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
                      aria-label="复制会议号"
                      onClick={copyMeetingId}
                    >
                      <Copy className="size-3.5" strokeWidth={2} />
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {isEditing || liveItem.location ? (
            <div className="flex gap-[var(--space-300)]">
              <MapPin className={detailRowIcon} strokeWidth={1.5} />
              <div className="min-w-0 flex-1 pt-0.5">
                {isEditing ? (
                  <div className="space-y-[var(--space-100)]">
                    <Label className="text-[length:var(--font-size-xs)] text-text-secondary">地点</Label>
                    <Input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} placeholder="地点" />
                  </div>
                ) : (
                  <span className="inline-flex max-w-full items-center gap-[var(--space-100)] rounded-full border border-border bg-bg-secondary px-[var(--space-200)] py-[var(--space-100)] text-[length:var(--font-size-xs)] text-text-secondary">
                    <MapPin className="size-3 shrink-0 opacity-80" strokeWidth={2} />
                    <span className="truncate">{liveItem.location}</span>
                  </span>
                )}
              </div>
            </div>
          ) : null}

          <div className="flex gap-[var(--space-300)]">
            <User className={detailRowIcon} strokeWidth={1.5} />
            <div className="flex min-w-0 flex-1 items-center gap-[var(--space-200)] pt-0.5">
              <Avatar className="size-8 shrink-0 rounded-full ring-1 ring-border">
                <AvatarFallback className="size-8 rounded-full bg-[var(--blue-alpha-11)] text-[11px] font-medium text-primary">
                  {attendeeInitials(organizer)}
                </AvatarFallback>
              </Avatar>
              <span className="text-[length:var(--font-size-sm)] text-text">
                {organizer}
                <span className="text-text-secondary">（组织人）</span>
              </span>
            </div>
          </div>

          <div className="flex gap-[var(--space-300)]">
            <Bell className={detailRowIcon} strokeWidth={1.5} />
            {isEditing ? (
              <div className="min-w-0 flex-1 space-y-[var(--space-100)] pt-0.5">
                <Label className="text-[length:var(--font-size-xs)] text-text-secondary">提醒</Label>
                <Input value={editReminder} onChange={(e) => setEditReminder(e.target.value)} placeholder="提醒" />
              </div>
            ) : (
              <span className="min-w-0 flex-1 pt-0.5 leading-relaxed text-text">{liveItem.reminder || "—"}</span>
            )}
          </div>

          <div className="flex gap-[var(--space-300)]">
            <FileText className={detailRowIcon} strokeWidth={1.5} />
            {isEditing ? (
              <div className="min-w-0 flex-1 space-y-[var(--space-100)] pt-0.5">
                <Label className="text-[length:var(--font-size-xs)] text-text-secondary">描述</Label>
                <Input value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="描述" />
              </div>
            ) : (
              <p
                className={cn(
                  "min-w-0 flex-1 whitespace-pre-wrap pt-0.5 text-[length:var(--font-size-sm)] leading-relaxed",
                  descriptionMuted ? "text-text-tertiary" : "text-text-secondary",
                )}
              >
                {descriptionText}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-border">
          <div className="flex items-end justify-between gap-[var(--space-200)] border-b border-border px-[var(--space-300)] pt-[var(--space-200)]">
            <div className="flex min-w-0 flex-1 gap-[var(--space-500)] overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {ATT_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "relative shrink-0 pb-[var(--space-250)] text-[length:var(--font-size-sm)] whitespace-nowrap transition-colors",
                    tab === t.id
                      ? "font-[var(--font-weight-semi-bold)] text-text"
                      : "font-[var(--font-weight-regular)] text-text-secondary",
                  )}
                >
                  {t.label} {counts[t.id]}
                  {tab === t.id ? (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-sm bg-text"
                      aria-hidden
                    />
                  ) : null}
                </button>
              ))}
            </div>
            {!detailInertRemoved ? (
              <button
                type="button"
                className="mb-1 flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
                aria-expanded={attOpen}
                aria-label={attOpen ? "收起参与人" : "展开参与人"}
                onClick={() => setAttOpen((o) => !o)}
              >
                <ChevronUp
                  className={cn("size-4 transition-transform duration-200", !attOpen && "rotate-180")}
                  strokeWidth={2}
                />
              </button>
            ) : null}
          </div>

          {detailInertRemoved || attOpen ? (
            <div className="flex items-start gap-[var(--space-400)] overflow-x-auto px-[var(--space-300)] py-[var(--space-400)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {isSelfOrganizer && !detailInertRemoved ? (
                <button
                  type="button"
                  className="flex w-[52px] shrink-0 flex-col items-center gap-[var(--space-150)] text-[length:var(--font-size-xs)] text-text-secondary transition-colors hover:text-text"
                >
                  <span className="flex size-11 items-center justify-center rounded-[length:var(--radius-md)] border border-dashed border-border bg-bg-secondary text-text-secondary">
                    <Plus className="size-5" strokeWidth={2} />
                  </span>
                  添加
                </button>
              ) : null}
              {filteredNames.map((name) => (
                <div key={name} className="flex w-[52px] shrink-0 flex-col items-center gap-[var(--space-150)]">
                  <div className="relative">
                    <Avatar className="size-11 rounded-full ring-1 ring-border">
                      <AvatarFallback className="size-11 rounded-full bg-[var(--blue-alpha-11)] text-[12px] font-medium text-primary">
                        {attendeeInitials(name)}
                      </AvatarFallback>
                    </Avatar>
                    {rsvpMap[name] === "accepted" ? (
                      <span
                        className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-white shadow-sm ring-2 ring-bg"
                        aria-label="已接受"
                      >
                        <Check className="size-2.5" strokeWidth={3} />
                      </span>
                    ) : null}
                  </div>
                  <span className="max-w-[52px] truncate text-center text-[length:var(--font-size-xs)] text-text">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-[var(--space-200)] border-t border-border px-[var(--space-400)] py-[var(--space-300)]",
            detailInertRemoved && "hidden",
          )}
        >
          <div className="flex flex-wrap gap-[var(--space-200)]">
            {isSelfInvitedOnly && !itemPast ? (
              selfRsvpFinalized ? (
                <Button size="sm" variant="secondary" disabled className="rounded-[length:var(--radius-md)]">
                  {mySelfRsvp === "accepted" ? "已接受" : "已拒绝"}
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    className="rounded-[length:var(--radius-md)]"
                    onClick={() => {
                      const next = {
                        ...liveItem,
                        attendeeRsvp: { ...liveItem.attendeeRsvp, [SCHEDULE_0422_CURRENT_USER]: "accepted" as const },
                      }
                      setLiveItem(next)
                      onItemUpdated(next)
                    }}
                  >
                    接受
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-[length:var(--radius-md)]"
                    onClick={() => {
                      const next = {
                        ...liveItem,
                        attendeeRsvp: { ...liveItem.attendeeRsvp, [SCHEDULE_0422_CURRENT_USER]: "declined" as const },
                      }
                      setLiveItem(next)
                      onItemUpdated(next)
                    }}
                  >
                    拒绝
                  </Button>
                </>
              )
            ) : null}
            <div className="flex flex-wrap items-center gap-[var(--space-200)]">
              {isEditing ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-[length:var(--radius-md)]"
                    type="button"
                    onClick={cancelInlineEdit}
                  >
                    取消
                  </Button>
                  <Button size="sm" className="rounded-[length:var(--radius-md)]" type="button" onClick={saveInlineEdit}>
                    保存
                  </Button>
                </>
              ) : (
                <>
                  {isSelfOrganizer && !detailInertRemoved ? (
                    <Button size="sm" className="rounded-[length:var(--radius-md)]" type="button" onClick={beginInlineEdit}>
                      编辑
                    </Button>
                  ) : null}
                  <Button
                    size="sm"
                    variant="secondary"
                    type="button"
                    className="rounded-[length:var(--radius-md)]"
                    onClick={() => toast("发起群聊（演示）")}
                  >
                    发起群聊
                  </Button>
                </>
              )}
            </div>
          </div>
          {isSelfOrganizer && !detailInertRemoved && !showLegacySheetToolbar && !showDrawerTopBar ? (
            <Button
              size="icon"
              type="button"
              variant="outline"
              className="rounded-[length:var(--radius-md)] text-destructive hover:border-destructive hover:bg-[var(--black-alpha-11)] hover:text-destructive"
              aria-label="删除日程"
              onClick={openDeleteConfirm}
            >
              <Trash2 className="size-4" strokeWidth={2} />
            </Button>
          ) : null}
        </div>
      </div>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>删除日程</DialogTitle>
          </DialogHeader>
          <p className="text-[length:var(--font-size-sm)] text-text-secondary">
            确定删除该日程？删除后将无法继续编辑或操作，列表中会显示为已删除。
          </p>
          <DialogFooter className="gap-[var(--space-200)]">
            <Button type="button" variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              返回
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                const next = { ...liveItem, status: "deleted" }
                setLiveItem(next)
                onItemUpdated(next)
                setDeleteConfirmOpen(false)
                setIsEditing(false)
                toast.success("日程已删除")
              }}
            >
              确定删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

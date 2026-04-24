import * as React from "react"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "../ui/utils"
import type { Schedule0422Item } from "./schedule0422Model"
import {
  formatListDayHeaderCal,
  hasPendingRsvpCal,
  isScheduleItemPast,
  pad2Cal,
  sortByStart,
} from "./schedule0422ScheduleLogic"
import {
  SCHEDULE0422_MANAGED_CALENDARS,
  SCHEDULE0422_SUBSCRIBED_CALENDARS,
} from "../../constants/schedule0422DemoQuickCommands"

const VIEW_TABS = [
  { id: "list" as const, label: "列表" },
  { id: "day" as const, label: "日" },
  { id: "week" as const, label: "周" },
  { id: "month" as const, label: "月" },
]

type OwnVis = Record<string, boolean>
type SubVis = Record<string, boolean>

export function Schedule0422AllListCard(props: {
  items: Schedule0422Item[]
  /** 顶栏当前组织上下文：名师教育 vs 个人 */
  currentOrgScope: "org" | "personal"
  onOpenItem: (item: Schedule0422Item) => void
}) {
  const { items: allItems, currentOrgScope, onOpenItem } = props
  const items = React.useMemo(() => {
    const orgName = currentOrgScope === "personal" ? "个人" : "名师教育"
    return allItems.filter((it) => (it.organization?.trim() || "名师教育") === orgName)
  }, [allItems, currentOrgScope])

  const [liveItems, setLiveItems] = React.useState(() => sortByStart(items))
  React.useEffect(() => {
    setLiveItems(sortByStart(items))
  }, [items])

  const n = new Date()
  const [{ y: viewY, m: viewM }, setYm] = React.useState(() => ({
    y: 2026,
    m: 4,
  }))
  const [viewMode, setViewMode] = React.useState<"list" | "day" | "week" | "month">("list")
  const [ownVis, setOwnVis] = React.useState<OwnVis>(() => {
    const o: OwnVis = {}
    for (const c of SCHEDULE0422_MANAGED_CALENDARS) o[c.id] = true
    return o
  })
  const [subVis, setSubVis] = React.useState<SubVis>(() => {
    const o: SubVis = {}
    for (const s of SCHEDULE0422_SUBSCRIBED_CALENDARS) o[s.id] = true
    return o
  })

  const prefix = `${viewY}-${pad2Cal(viewM)}`
  const filtered = React.useMemo(() => {
    const byCal = liveItems.filter((it) => ownVis[it.calendarTypeId ?? "cal-default"] !== false)
    return sortByStart(byCal)
  }, [liveItems, ownVis])

  const allByDay = React.useMemo(() => {
    const m = new Map<string, Schedule0422Item[]>()
    for (const it of filtered) {
      const k = it.calendarDate?.trim()
      if (!k) continue
      if (!m.has(k)) m.set(k, [])
      m.get(k)!.push(it)
    }
    const keys = [...m.keys()].sort()
    return keys.map((k) => ({ date: k, events: sortByStart(m.get(k)!) }))
  }, [filtered])

  const listByDayForMonth = React.useMemo(
    () => allByDay.filter((b) => b.date.startsWith(prefix)),
    [allByDay, prefix],
  )

  const todayIso = `${n.getFullYear()}-${pad2Cal(n.getMonth() + 1)}-${pad2Cal(n.getDate())}`

  const shiftMonth = (delta: number) => {
    setYm(({ y, m }) => {
      let nm = m + delta
      let ny = y
      while (nm > 12) {
        nm -= 12
        ny += 1
      }
      while (nm < 1) {
        nm += 12
        ny -= 1
      }
      return { y: ny, m: nm }
    })
  }

  const goToday = () => {
    const d = new Date()
    setYm({ y: d.getFullYear(), m: d.getMonth() + 1 })
  }

  return (
    <div className="w-full max-w-full overflow-hidden rounded-[length:var(--radius-lg)] border border-border bg-bg shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-200)] border-b border-border px-[var(--space-250)] py-[var(--space-200)] md:px-[var(--space-300)]">
        <div className="flex min-w-0 flex-wrap items-center gap-[var(--space-200)]">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-[var(--space-50)] rounded-[length:var(--radius-md)] px-[var(--space-200)] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)]"
              >
                {viewY}/{pad2Cal(viewM)}
                <ChevronDown className="size-3.5 text-text-tertiary" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-[var(--space-200)]" align="start">
              <div className="flex flex-col gap-[var(--space-100)]">
                <Button type="button" variant="ghost" size="sm" onClick={() => setYm({ y: 2026, m: 4 })}>
                  2026/04
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setYm({ y: 2026, m: 5 })}>
                  2026/05
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-px">
            <Button type="button" size="icon" variant="ghost" className="size-8" onClick={() => shiftMonth(-1)}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="size-8" onClick={() => shiftMonth(1)}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 rounded-[length:var(--radius-md)]"
            onClick={goToday}
          >
            今天
          </Button>
          <ManagedFilterPopover ownVis={ownVis} setOwnVis={setOwnVis} />
          <SubscribedFilterPopover subVis={subVis} setSubVis={setSubVis} />
        </div>
        <div className="inline-flex rounded-[length:var(--radius-md)] border border-border bg-bg-secondary p-[var(--space-50)]">
          {VIEW_TABS.map((t) => {
            const active = viewMode === t.id
            const disabled = t.id !== "list"
            return (
              <button
                key={t.id}
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (!disabled) setViewMode(t.id)
                }}
                className={cn(
                  "rounded-[var(--radius-sm)] px-[var(--space-200)] py-[var(--space-100)] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] transition-colors",
                  active ? "bg-bg text-text shadow-xs" : "text-text-tertiary",
                  disabled && "cursor-not-allowed opacity-50",
                )}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="overflow-x-hidden">
        {viewMode !== "list" ? (
          <p className="p-[var(--space-400)] text-center text-[length:var(--font-size-sm)] text-text-tertiary">
            日/周/月视图演示未开启（来源应用内支持）。
          </p>
        ) : listByDayForMonth.length === 0 ? (
          <p className="p-[var(--space-400)] text-center text-[length:var(--font-size-sm)] text-text-tertiary">
            该月暂无日程
          </p>
        ) : (
          listByDayForMonth.map(({ date, events }) => {
            const { day, week } = formatListDayHeaderCal(date)
            const isTodayCol = date === todayIso
            return (
              <div key={date} className="border-b border-border last:border-b-0">
                <div className="flex gap-0">
                  <div
                    className={cn(
                      "flex w-[5.25rem] shrink-0 flex-col items-center justify-start border-r border-border py-[var(--space-300)] md:w-24 md:py-[var(--space-400)]",
                      isTodayCol ? "bg-[var(--blue-alpha-11)]" : "bg-bg-secondary",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-full text-[length:var(--font-size-sm)] font-[var(--font-weight-semi-bold)]",
                        isTodayCol ? "bg-primary text-white shadow-xs" : "text-text",
                      )}
                    >
                      {day}
                    </span>
                    <span className="mt-[var(--space-100)] text-[length:var(--font-size-xs)] text-text-secondary">
                      {week}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 space-y-[var(--space-200)] bg-bg py-[var(--space-200)] pr-[var(--space-200)] pl-[var(--space-100)] md:py-[var(--space-300)] md:pr-[var(--space-300)]">
                    {events.map((ev) => {
                      const cancelled = ev.status === "cancelled"
                      const deleted = ev.status === "deleted"
                      const past = !cancelled && !deleted && isScheduleItemPast(ev)
                      const hint = ev.displayHint?.trim() ?? ""
                      const accentClass =
                        cancelled || past || deleted
                          ? "bg-border"
                          : hint === "进行中"
                            ? "bg-primary"
                            : hint === "待确认"
                              ? "bg-[color-mix(in_oklab,var(--color-amber-500)_88%,transparent)]"
                              : hint === "未开始"
                                ? "bg-[var(--blue-alpha-8)]"
                                : "bg-primary"
                      return (
                        <button
                          key={ev.id}
                          type="button"
                          onClick={() => onOpenItem(ev)}
                          className="flex w-full items-center gap-[var(--space-300)] rounded-[length:var(--radius-md)] px-[var(--space-200)] py-[var(--space-250)] text-left transition-colors hover:bg-bg-secondary md:px-[var(--space-300)] md:py-[var(--space-300)]"
                        >
                          <span
                            className={cn("h-10 w-1 shrink-0 self-center rounded-full", accentClass)}
                            aria-hidden
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-[var(--space-200)] gap-y-[var(--space-100)]">
                              <span
                                className={cn(
                                  "tabular-nums text-[length:var(--font-size-sm)]",
                                  past || cancelled || deleted ? "text-text-tertiary" : "text-text-secondary",
                                )}
                              >
                                {ev.start}–{ev.end}
                              </span>
                              <span
                                className={cn(
                                  "text-[length:var(--font-size-sm)] font-[var(--font-weight-semi-bold)] text-text",
                                  (cancelled || deleted) && "text-text-tertiary line-through",
                                  past && !cancelled && !deleted && "text-text-tertiary",
                                )}
                              >
                                {ev.title}
                              </span>
                              {deleted ? (
                                <span className="rounded-[var(--radius-sm)] bg-bg-secondary px-[var(--space-100)] py-px text-[length:var(--font-size-xs)] text-text-tertiary">
                                  已删除
                                </span>
                              ) : null}
                              {cancelled ? (
                                <span className="rounded-[var(--radius-sm)] bg-bg-secondary px-[var(--space-100)] py-px text-[length:var(--font-size-xs)] text-text-tertiary">
                                  已取消
                                </span>
                              ) : null}
                              {past ? (
                                <span className="rounded-[var(--radius-sm)] bg-bg-secondary px-[var(--space-100)] py-px text-[length:var(--font-size-xs)] text-text-tertiary">
                                  已结束
                                </span>
                              ) : null}
                              {!past && !cancelled && !deleted && hint ? (
                                <span
                                  className={cn(
                                    "rounded-[var(--radius-sm)] px-[var(--space-100)] py-px text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)]",
                                    hint === "进行中" &&
                                      "border border-[var(--blue-alpha-8)] bg-[var(--blue-alpha-11)] text-primary",
                                    hint === "待确认" &&
                                      "border border-[color-mix(in_oklab,var(--color-amber-500)_35%,var(--color-border))] bg-[color-mix(in_oklab,var(--color-amber-500)_12%,var(--color-bg))] text-[color-mix(in_oklab,var(--color-amber-950)_75%,var(--color-text))]",
                                    hint === "未开始" &&
                                      "border border-border bg-bg-secondary text-text-secondary",
                                    !["进行中", "待确认", "未开始"].includes(hint) &&
                                      "border border-border bg-bg-secondary text-text-secondary",
                                  )}
                                >
                                  {hint}
                                </span>
                              ) : null}
                              {!past && !cancelled && !deleted && !hint && hasPendingRsvpCal(ev) ? (
                                <span className="rounded-[var(--radius-sm)] border border-border bg-bg-secondary px-[var(--space-100)] py-px text-[length:var(--font-size-xs)] text-text-secondary">
                                  未响应
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function ManagedFilterPopover(props: {
  ownVis: OwnVis
  setOwnVis: React.Dispatch<React.SetStateAction<OwnVis>>
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-[var(--space-50)] rounded-[length:var(--radius-md)] px-[var(--space-200)] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)]"
        >
          我管理的
          <ChevronDown className={cn("size-3.5 text-text-tertiary transition-transform", open && "rotate-180")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[min(92vw,288px)] p-[var(--space-200)]">
        <div className="rounded-[length:var(--radius-md)] border border-border bg-bg">
          <div className="border-b border-border px-[var(--space-250)] py-[var(--space-200)] text-[length:var(--font-size-xs)] font-[var(--font-weight-semi-bold)] text-text">
            我管理的
          </div>
          <div className="space-y-[var(--space-150)] p-[var(--space-200)]">
            {SCHEDULE0422_MANAGED_CALENDARS.map((cal) => (
              <label key={cal.id} className="flex cursor-pointer items-center gap-[var(--space-200)]">
                <input
                  type="checkbox"
                  checked={props.ownVis[cal.id] !== false}
                  onChange={() =>
                    props.setOwnVis((prev) => ({
                      ...prev,
                      [cal.id]: prev[cal.id] === false ? true : false,
                    }))
                  }
                  className="size-3.5 shrink-0 rounded border-border"
                />
                <span className="min-w-0 flex-1 truncate text-[length:var(--font-size-xs)] text-text">
                  {cal.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function SubscribedFilterPopover(props: {
  subVis: SubVis
  setSubVis: React.Dispatch<React.SetStateAction<SubVis>>
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-[var(--space-50)] rounded-[length:var(--radius-md)] px-[var(--space-200)] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)]"
        >
          我订阅的
          <ChevronDown className={cn("size-3.5 text-text-tertiary transition-transform", open && "rotate-180")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[min(92vw,288px)] p-[var(--space-200)]">
        <div className="rounded-[length:var(--radius-md)] border border-border bg-bg">
          <div className="border-b border-border px-[var(--space-250)] py-[var(--space-200)] text-[length:var(--font-size-xs)] font-[var(--font-weight-semi-bold)] text-text">
            我订阅的
          </div>
          <div className="space-y-[var(--space-150)] p-[var(--space-200)]">
            {SCHEDULE0422_SUBSCRIBED_CALENDARS.map((sub) => (
              <label key={sub.id} className="flex cursor-pointer items-center gap-[var(--space-200)]">
                <input
                  type="checkbox"
                  checked={props.subVis[sub.id] !== false}
                  onChange={() =>
                    props.setSubVis((prev) => ({
                      ...prev,
                      [sub.id]: prev[sub.id] === false ? true : false,
                    }))
                  }
                  className="size-3.5 shrink-0 rounded border-border"
                />
                <span className="min-w-0 flex-1 truncate text-[length:var(--font-size-xs)] text-text">{sub.name}</span>
              </label>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

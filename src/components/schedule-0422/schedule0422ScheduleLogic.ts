import type { Schedule0422AttendeeRsvp, Schedule0422Item } from "./schedule0422Model"
import { SCHEDULE_0422_CURRENT_USER } from "./schedule0422Model"

export type IsScheduleItemPastOptions = {
  treatDateLabelTodayAsNotPast?: boolean
}

export function isScheduleItemPast(
  item: Schedule0422Item,
  ref: Date = new Date(),
  opts?: IsScheduleItemPastOptions,
): boolean {
  if (item.status === "cancelled") return false
  if (opts?.treatDateLabelTodayAsNotPast && item.dateLabel === "今天") return false
  const dateStr = item.calendarDate?.trim()
  const endHm = item.end?.trim() || "23:59"
  const [eh, em] = endHm.split(":").map((x) => Number(x) || 0)
  if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [yy, mm, dd] = dateStr.split("-").map(Number)
    const endMs = new Date(yy, mm - 1, dd, eh, em, 59, 999).getTime()
    return endMs < ref.getTime()
  }
  if (item.dateLabel === "今天") {
    const now = ref
    const endToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), eh, em, 59, 999).getTime()
    return endToday < now.getTime()
  }
  if (item.dateLabel === "昨天") return true
  return false
}

export function isScheduleSelfOrganizer(item: Schedule0422Item): boolean {
  const trimmed = item.organizerName?.trim() ?? ""
  return (
    (trimmed !== "" && trimmed === SCHEDULE_0422_CURRENT_USER) ||
    (trimmed === "" && item.attendees[0] === SCHEDULE_0422_CURRENT_USER)
  )
}

export function orderedScheduleAttendees(item: Schedule0422Item): string[] {
  const names = [...item.attendees]
  const org = item.organizerName?.trim() || names[0]
  if (!org) return names
  const i = names.indexOf(org)
  if (i <= 0) return names
  const next = [...names]
  next.splice(i, 1)
  return [org, ...next]
}

export function attendeeInitials(name: string): string {
  const t = name.trim()
  if (!t) return "?"
  if (t.length <= 2) return t
  return t.slice(0, 2)
}

export function pad2Cal(n: number) {
  return String(n).padStart(2, "0")
}

export function formatListDayHeaderCal(iso: string): { day: string; week: string } {
  const [y, mo, da] = iso.split("-").map(Number)
  const dt = new Date(y, mo - 1, da)
  const w = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][dt.getDay()]
  return { day: pad2Cal(da), week: w }
}

export function weekdayZhFromIso(iso: string): string {
  const d = new Date(`${iso}T12:00:00`)
  const WEEKDAY_ZH = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
  return WEEKDAY_ZH[d.getDay()] ?? ""
}

export function formatScheduleDetailTimeLine(item: Schedule0422Item): string {
  if (item.calendarDate) {
    const wd = weekdayZhFromIso(item.calendarDate)
    return `${item.calendarDate} ${wd} ${item.start}\u2013${item.end}`
  }
  return `${item.dateLabel} ${item.start}\u2013${item.end}`
}

export function formatMeetingNumberDisplay(raw?: string | null): string {
  if (!raw) return ""
  const clean = raw.replace(/\s/g, "")
  if (!clean) return ""
  const parts: string[] = []
  let i = clean.length
  while (i > 0) {
    parts.unshift(clean.slice(Math.max(0, i - 3), i))
    i -= 3
  }
  return parts.join(" ")
}

export function resolveAttendeeRsvpMap(item: Schedule0422Item): Record<string, Schedule0422AttendeeRsvp> {
  const out: Record<string, Schedule0422AttendeeRsvp> = {}
  const org = item.organizerName?.trim() || item.attendees[0] || ""
  for (const name of item.attendees) {
    out[name] = item.attendeeRsvp?.[name] ?? (name === org ? "accepted" : "pending")
  }
  return out
}

export function hasPendingRsvpCal(item: Schedule0422Item): boolean {
  const self = SCHEDULE_0422_CURRENT_USER
  const org = item.organizerName?.trim() || item.attendees[0]
  if (org === self) return false
  if (!item.attendees.includes(self)) return false
  const r = item.attendeeRsvp?.[self] ?? "pending"
  return r === "pending"
}

export function sortByStart(items: Schedule0422Item[]): Schedule0422Item[] {
  return [...items].sort((a, b) => {
    const ka = `${a.calendarDate ?? ""} ${a.start}`
    const kb = `${b.calendarDate ?? ""} ${b.start}`
    return ka.localeCompare(kb)
  })
}

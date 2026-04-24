/**
 * 与来源 `0422-tingkai-schedule/src/vv-assistant/generalQuickCommands.ts` 中
 * `SCHEDULE_APP_QUICK_COMMANDS` 及 `MainAIChatWindow` 内「日历设置」子项一致：
 * 展示 label 与点击后发送的 `sendText`（用于本页演示 toast / 状态行）。
 */
export type Schedule0422QuickCommand = { readonly label: string; readonly sendText: string }

/** 日程二级应用底栏三条（发送对话文案） */
export const SCHEDULE0422_APP_QUICK_COMMANDS: readonly Schedule0422QuickCommand[] = [
  { label: "我的日程", sendText: "全部日程" },
  { label: "今日日程", sendText: "查询今日日程" },
  { label: "新建日程", sendText: "新建日程" },
] as const

/** 「日历设置」下拉：label + 发送文案（与来源 ScheduleCalendarSettingsMenuButton 一致） */
export const SCHEDULE0422_CALENDAR_SETTINGS_MENU: readonly Schedule0422QuickCommand[] = [
  { label: "基础设置", sendText: "日历设置" },
  { label: "新建日历", sendText: "新建日历" },
  { label: "订阅日历", sendText: "订阅日历" },
] as const

/** 我管理的：与来源 seeds 中 DEFAULT_USER_CALENDAR_TYPES 名称一致（演示） */
export const SCHEDULE0422_MANAGED_CALENDARS: readonly { id: string; name: string }[] = [
  { id: "cal-default", name: "我的日程" },
  { id: "cal-fitness", name: "健身日历" },
] as const

/** 我订阅的：与来源 colleagueCalendarDirectorySeed / subscribedCalendarsSeed 对齐的展示名 */
export const SCHEDULE0422_SUBSCRIBED_CALENDARS: readonly { id: string; name: string }[] = [
  { id: "sub-chentingkai", name: "陈廷凯" },
  { id: "sub-col-liban", name: "李老板" },
  { id: "sub-col-lisi", name: "李四" },
  { id: "sub-col-wangwu", name: "王五" },
  { id: "sub-col-zhaoliu", name: "赵六" },
] as const

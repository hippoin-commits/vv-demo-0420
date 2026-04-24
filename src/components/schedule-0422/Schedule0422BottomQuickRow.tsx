import * as React from "react"
import { CalendarDays, ChevronDown } from "lucide-react"
import { toast } from "sonner"
import { ChatPromptButton } from "../chat/ChatPromptButton"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "../ui/utils"
import {
  SCHEDULE0422_APP_QUICK_COMMANDS,
  SCHEDULE0422_CALENDAR_SETTINGS_MENU,
  SCHEDULE0422_MANAGED_CALENDARS,
  SCHEDULE0422_SUBSCRIBED_CALENDARS,
} from "../../constants/schedule0422DemoQuickCommands"

function toastForSendText(sendText: string): void {
  switch (sendText) {
    case "全部日程":
      toast.info("已发送「全部日程」（与来源底栏「我的日程」按钮一致）。")
      return
    case "查询今日日程":
      toast.info("已发送「查询今日日程」。")
      return
    case "新建日程":
      toast.info("已发送「新建日程」。")
      return
    case "日历设置":
    case "新建日历":
    case "订阅日历":
      toast.info(`已发送「${sendText}」（日历设置子菜单，与来源一致）。`)
      return
    default:
      toast.info(`已发送「${sendText}」（演示）。`)
  }
}

export function Schedule0422BottomQuickRow(props: { onSendText: (text: string) => void }) {
  const { onSendText } = props
  const [calMenuOpen, setCalMenuOpen] = React.useState(false)

  return (
    <div className="scrollbar-hide flex w-full min-w-0 max-w-full flex-nowrap items-center justify-start gap-[length:var(--space-150)] overflow-x-auto overflow-y-hidden pb-[length:var(--space-50)]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="bg-bg/50 flex shrink-0 items-center gap-[length:var(--space-100)] rounded-full border border-solid border-bg px-[length:var(--space-300)] py-[length:var(--space-150)] shadow-xs transition-colors hover:bg-bg"
          >
            <span className="flex size-[18px] items-center justify-center rounded-full bg-[var(--blue-alpha-11)] text-primary">
              <CalendarDays className="size-3" />
            </span>
            <span className="text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] leading-[18px] text-primary">
              日程
            </span>
            <ChevronDown className="size-3 text-text-tertiary" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem disabled>当前：日程</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {SCHEDULE0422_APP_QUICK_COMMANDS.map((cmd) => (
        <ChatPromptButton
          key={cmd.label}
          type="button"
          onClick={() => {
            toastForSendText(cmd.sendText)
            onSendText(cmd.sendText)
          }}
        >
          {cmd.label}
        </ChatPromptButton>
      ))}
      <ManagedPickPopover onSendText={onSendText} />
      <SubscribedPickPopover onSendText={onSendText} />
      <Popover open={calMenuOpen} onOpenChange={setCalMenuOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="bg-bg/50 flex shrink-0 items-center gap-[var(--space-50)] rounded-full border border-solid border-bg px-[length:var(--space-300)] py-[length:var(--space-150)] shadow-xs transition-colors hover:bg-bg"
          >
            <span className="text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] leading-[18px] text-primary">
              日历设置
            </span>
            <ChevronDown className={cn("size-3 text-text-tertiary transition-transform", calMenuOpen && "rotate-180")} />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto min-w-[140px] p-[var(--space-150)]">
          <div className="flex flex-col overflow-hidden rounded-[length:var(--radius-md)] border border-border bg-bg shadow-elevation-sm">
            {SCHEDULE0422_CALENDAR_SETTINGS_MENU.map((it) => (
              <button
                key={it.label}
                type="button"
                className="w-full px-[var(--space-250)] py-[var(--space-200)] text-left text-[length:var(--font-size-sm)] text-text transition-colors hover:bg-[var(--black-alpha-11)] hover:text-primary"
                onClick={() => {
                  setCalMenuOpen(false)
                  toastForSendText(it.sendText)
                  onSendText(it.sendText)
                }}
              >
                {it.label}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

function ManagedPickPopover(props: { onSendText: (t: string) => void }) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="bg-bg/50 flex shrink-0 items-center gap-[var(--space-50)] rounded-full border border-solid border-bg px-[length:var(--space-300)] py-[length:var(--space-150)] shadow-xs transition-colors hover:bg-bg"
        >
          <span className="text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] leading-[18px] text-primary">
            我管理的
          </span>
          <ChevronDown className={cn("size-3 text-text-tertiary transition-transform", open && "rotate-180")} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[min(92vw,260px)] p-[var(--space-200)]">
        <div className="rounded-[length:var(--radius-md)] border border-border bg-bg">
          <div className="border-b border-border px-[var(--space-250)] py-[var(--space-200)] text-[length:var(--font-size-xs)] font-[var(--font-weight-semi-bold)] text-text">
            我管理的
          </div>
          <div className="p-[var(--space-150)]">
            {SCHEDULE0422_MANAGED_CALENDARS.map((cal) => (
              <Button
                key={cal.id}
                type="button"
                variant="ghost"
                className="h-auto w-full justify-start px-[var(--space-200)] py-[var(--space-200)] text-[length:var(--font-size-xs)]"
                onClick={() => {
                  setOpen(false)
                  toast.info(`已选择「我管理的 / ${cal.name}」（与来源追加卡片语义一致，演示 toast）。`)
                  props.onSendText("全部日程")
                }}
              >
                {cal.name}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function SubscribedPickPopover(props: { onSendText: (t: string) => void }) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="bg-bg/50 flex shrink-0 items-center gap-[var(--space-50)] rounded-full border border-solid border-bg px-[length:var(--space-300)] py-[length:var(--space-150)] shadow-xs transition-colors hover:bg-bg"
        >
          <span className="text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] leading-[18px] text-primary">
            我订阅的
          </span>
          <ChevronDown className={cn("size-3 text-text-tertiary transition-transform", open && "rotate-180")} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[min(92vw,260px)] p-[var(--space-200)]">
        <div className="rounded-[length:var(--radius-md)] border border-border bg-bg">
          <div className="border-b border-border px-[var(--space-250)] py-[var(--space-200)] text-[length:var(--font-size-xs)] font-[var(--font-weight-semi-bold)] text-text">
            我订阅的
          </div>
          <div className="p-[var(--space-150)]">
            {SCHEDULE0422_SUBSCRIBED_CALENDARS.map((sub) => (
              <Button
                key={sub.id}
                type="button"
                variant="ghost"
                className="h-auto w-full justify-start px-[var(--space-200)] py-[var(--space-200)] text-[length:var(--font-size-xs)]"
                onClick={() => {
                  setOpen(false)
                  toast.info(`已选择「我订阅的 / ${sub.name}」（演示）。`)
                  props.onSendText("全部日程")
                }}
              >
                {sub.name}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

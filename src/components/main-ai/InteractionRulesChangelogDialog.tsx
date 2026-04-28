import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import {
  Dialog,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "../ui/dialog"
import { cn } from "../ui/utils"
import { INTERACTION_RULES_CHANGELOG_ENTRIES } from "../../constants/interactionRulesChangelog"
import { SpecDocBody } from "./specDocBodyRender"

function formatChangelogDateTime(ts: number): string {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = d.getMonth() + 1
  const day = d.getDate()
  const hh = String(d.getHours()).padStart(2, "0")
  const mm = String(d.getMinutes()).padStart(2, "0")
  return `${y}年${m}月${day}日 ${hh}:${mm}`
}

const navBtnClass = cn(
  "flex size-[length:var(--space-900)] shrink-0 items-center justify-center rounded-[length:var(--radius-100)] text-text-secondary transition-colors",
  "hover:bg-[var(--black-alpha-11)] hover:text-text",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-bg",
  "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-secondary",
)

export function InteractionRulesChangelogLauncher() {
  const [open, setOpen] = React.useState(false)
  const [index, setIndex] = React.useState(0)
  const entries = INTERACTION_RULES_CHANGELOG_ENTRIES
  const len = entries.length

  React.useEffect(() => {
    if (open) setIndex(0)
  }, [open])

  const current = entries[index] ?? entries[0]
  /** 左箭头：较新的一条（数组下标减小） */
  const canGoNewer = index > 0
  /** 右箭头：较早的一条（数组下标增大） */
  const canGoOlder = index < len - 1

  return (
    <>
      <div className="mr-[length:var(--space-200)] flex h-[var(--space-900)] min-w-0 max-w-[min(100%,length:calc(var(--space-900)*5))] shrink-0 items-center justify-center rounded-full border border-border bg-bg shadow-elevation-sm transition-colors hover:bg-[var(--black-alpha-11)]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "flex h-[length:var(--space-800)] max-w-full min-w-0 items-center justify-center rounded-[length:var(--radius-200)]",
            "px-[length:var(--space-250)]",
            "text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] leading-none text-text-secondary transition-colors hover:text-text",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
          )}
          aria-haspopup="dialog"
          aria-expanded={open}
          title="更新日志"
        >
          <span className="truncate">更新日志</span>
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay className="z-[200]" />
          <DialogPrimitive.Content
            className={cn(
              "fixed left-1/2 top-1/2 z-[201] flex max-h-[80vh] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[length:var(--radius-400)] border border-border bg-bg shadow-[var(--shadow-md)] duration-200",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "w-[min(1000px,max(300px,50vw))]",
            )}
            onPointerDownOutside={() => setOpen(false)}
            onEscapeKeyDown={() => setOpen(false)}
          >
            <DialogDescription className="sr-only">
              当前为该次合并的更新说明，仅浏览。左箭头为较新版本，右箭头为较早版本。
            </DialogDescription>
            <div className="flex shrink-0 items-center gap-[length:var(--space-300)] border-b border-border px-[length:var(--space-400)] py-[length:var(--space-300)]">
              <div
                className="flex shrink-0 items-center gap-0 rounded-[length:var(--radius-200)] border border-border bg-bg p-0"
                role="group"
                aria-label="切换更新日志版本"
              >
                <button
                  type="button"
                  disabled={!canGoNewer}
                  onClick={() => canGoNewer && setIndex((i) => Math.max(0, i - 1))}
                  className={navBtnClass}
                  aria-label="较新版本"
                  title="较新"
                >
                  <ChevronLeft className="size-[length:var(--space-400)]" strokeWidth={2} aria-hidden />
                </button>
                <button
                  type="button"
                  disabled={!canGoOlder}
                  onClick={() => canGoOlder && setIndex((i) => Math.min(len - 1, i + 1))}
                  className={navBtnClass}
                  aria-label="较早版本"
                  title="较早"
                >
                  <ChevronRight className="size-[length:var(--space-400)]" strokeWidth={2} aria-hidden />
                </button>
              </div>
              <DialogTitle className="min-w-0 flex-1 truncate text-left text-[length:var(--font-size-sm)] font-[var(--font-weight-semibold)] leading-snug text-text">
                更新日志：{formatChangelogDateTime(current.at)}
              </DialogTitle>
              <DialogPrimitive.Close
                type="button"
                className="flex size-[length:var(--space-800)] shrink-0 items-center justify-center rounded-[length:var(--radius-200)] text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text focus:outline-none"
                aria-label="关闭"
              >
                <X className="size-[length:var(--space-400)]" strokeWidth={2} aria-hidden />
              </DialogPrimitive.Close>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-[length:var(--space-400)] py-[length:var(--space-400)]">
              <SpecDocBody markdown={current.body} />
            </div>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </>
  )
}

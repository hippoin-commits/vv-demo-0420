import * as React from "react"
import { Info } from "lucide-react"

/**
 * 页面中上「胶囊形」全局轻提示（无蒙层、不拦截点击）。
 * 规范见 `guidelines/Guidelines.md` — Top-center info nudge。
 */
export function TopCenterInfoNudgeBubble({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed left-1/2 top-[var(--space-600)] z-[200] max-w-[min(100vw-2rem,520px)] -translate-x-1/2 px-[var(--space-400)]"
    >
      <div className="flex items-center gap-[var(--space-200)] rounded-full border border-primary bg-[var(--blue-alpha-11)] px-[var(--space-400)] py-[var(--space-250)] shadow-md">
        <span
          className="flex h-[var(--space-400)] w-[var(--space-400)] shrink-0 items-center justify-center rounded-full bg-primary text-[var(--color-white)]"
          aria-hidden
        >
          <Info className="h-[14px] w-[14px]" strokeWidth={2.5} />
        </span>
        <span className="min-w-0 text-[length:var(--font-size-sm)] font-[var(--font-weight-regular)] leading-normal text-text">
          {message}
        </span>
      </div>
    </div>
  )
}

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";

export type ChatScrollToBottomFabProps = {
  /** 实际滚动的容器（overflow-y-auto） */
  scrollRootRef: React.RefObject<HTMLElement | null>;
  className?: string;
  /**
   * 变化时重新绑定滚动/尺寸监听并重算是否在底部（解决：仅内容增高不触发 scroll、或滚动区随 key remount 后监听挂在旧节点上的问题）。
   */
  layoutSyncKey?: string | number;
  /**
   * 每次重算时调用，返回值须与 `newRoundSlot.slotHeightPx` 使用同一套算法（见 `computeNewRoundSlotHeightPx`），
   * 以便「去底部」与槽位高度联动。未传时退回「约 0.38 屏或 96px」。
   */
  getDistanceThresholdPx?: () => number;
};

function computeAwayFromBottom(el: HTMLElement, getDistanceThresholdPx?: () => number): boolean {
  if (el.scrollHeight <= el.clientHeight + 2) return false;
  const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
  const h = el.clientHeight;
  const threshold = getDistanceThresholdPx
    ? Math.max(1, getDistanceThresholdPx())
    : Math.max(96, Math.round(h * 0.38));
  return dist > threshold;
}

/**
 * 对话未贴底时，在滚动区域靠下居中显示「回到底部」按钮（向下箭头）；已在底部或无溢出时不显示。
 */
export function ChatScrollToBottomFab({
  scrollRootRef,
  className,
  layoutSyncKey = 0,
  getDistanceThresholdPx,
}: ChatScrollToBottomFabProps) {
  const [awayFromBottom, setAwayFromBottom] = React.useState(false);
  const scrollRafRef = React.useRef<number | null>(null);
  const settleTimeoutRef = React.useRef<number | null>(null);

  const getThresholdRef = React.useRef(getDistanceThresholdPx);
  getThresholdRef.current = getDistanceThresholdPx;

  const cancelPendingScroll = React.useCallback(() => {
    if (scrollRafRef.current !== null) {
      cancelAnimationFrame(scrollRafRef.current);
      scrollRafRef.current = null;
    }
    if (settleTimeoutRef.current !== null) {
      window.clearTimeout(settleTimeoutRef.current);
      settleTimeoutRef.current = null;
    }
  }, []);

  const update = React.useCallback(() => {
    const el = scrollRootRef.current;
    if (!el) return;
    setAwayFromBottom(computeAwayFromBottom(el, getThresholdRef.current));
  }, [scrollRootRef]);

  React.useLayoutEffect(() => {
    const el = scrollRootRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [scrollRootRef, update, layoutSyncKey]);

  React.useEffect(() => cancelPendingScroll, [cancelPendingScroll]);

  const scrollToBottom = React.useCallback(() => {
    const el = scrollRootRef.current;
    if (!el) return;

    cancelPendingScroll();

    const getBottom = () => Math.max(0, el.scrollHeight - el.clientHeight);
    const settle = () => {
      el.scrollTop = getBottom();
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.scrollTop = getBottom();
        update();
      }));
      settleTimeoutRef.current = window.setTimeout(() => {
        el.scrollTop = getBottom();
        update();
        settleTimeoutRef.current = null;
      }, 120);
    };

    const reducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const startTop = el.scrollTop;
    const targetTop = getBottom();
    const distance = targetTop - startTop;

    if (reducedMotion || Math.abs(distance) < 1) {
      settle();
      return;
    }

    const durationMs = 300;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / durationMs);
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      el.scrollTop = startTop + distance * eased;
      if (progress < 1) {
        scrollRafRef.current = requestAnimationFrame(tick);
        return;
      }
      scrollRafRef.current = null;
      settle();
    };
    scrollRafRef.current = requestAnimationFrame(tick);
  }, [cancelPendingScroll, scrollRootRef, update]);

  if (!awayFromBottom) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-[var(--space-400)] z-[35] flex justify-center",
        className
      )}
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn(
          "pointer-events-auto rounded-full border-border bg-bg/95 shadow-md backdrop-blur-sm",
          "hover:bg-bg hover:text-primary"
        )}
        aria-label="回到底部"
        onClick={scrollToBottom}
      >
        <ChevronDown className="h-[var(--space-400)] w-[var(--space-400)] text-text-secondary" strokeWidth={2.5} />
      </Button>
    </div>
  );
}

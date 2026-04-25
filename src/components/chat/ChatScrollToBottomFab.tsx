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

  const getThresholdRef = React.useRef(getDistanceThresholdPx);
  getThresholdRef.current = getDistanceThresholdPx;

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

  const scrollToBottom = React.useCallback(() => {
    const el = scrollRootRef.current;
    if (!el) return;
    const run = (behavior: ScrollBehavior) => {
      el.scrollTo({ top: el.scrollHeight, behavior });
    };
    run("smooth");
    requestAnimationFrame(() => requestAnimationFrame(() => run("auto")));
    window.setTimeout(() => run("auto"), 150);
  }, [scrollRootRef]);

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

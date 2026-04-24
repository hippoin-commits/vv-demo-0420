import * as React from "react";
import { motion } from "motion/react";
import { cn } from "../ui/utils";

export type NewRoundSlotShellProps = {
  /** 槽位固定高度（一般为一屏对话区 clientHeight） */
  heightPx: number;
  /** 与主对话列表消息之间的纵向间距 token 一致（主 AI 用户↔系统为 `--space-600`） */
  messageGapClassName?: string;
  children: React.ReactNode;
  /** 当槽内内容高度超过槽位高度时调用，由父级解除槽位、恢复自然高度 */
  onContentExceedsSlot: () => void;
  /** 供父级做两阶段滚动的锚点 */
  shellRef?: React.Ref<HTMLDivElement>;
  /**
   * 与主窗槽位滚动总时长对齐：先滚到空槽，再延迟若干 ms 后子内容位移动效出现（避免与滚动抢同一帧）。
   * 0 或未传则不做延迟显现。
   */
  revealChildrenAfterMs?: number;
};

/**
 * 新一轮对话「底部槽位」：外层固定高度，内容在槽内向下生长，底部 flex 占位被压缩；
 * 在内容未超出槽高前，外层高度恒为 heightPx。超出后由父级 onContentExceedsSlot 解除。
 */
export function NewRoundSlotShell({
  heightPx,
  messageGapClassName = "gap-[var(--space-600)]",
  children,
  onContentExceedsSlot,
  shellRef,
  revealChildrenAfterMs = 0,
}: NewRoundSlotShellProps) {
  const innerRef = React.useRef<HTMLDivElement>(null);
  const setOuterRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (typeof shellRef === "function") {
        shellRef(node);
      } else if (shellRef && typeof shellRef === "object") {
        (shellRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    },
    [shellRef]
  );

  React.useLayoutEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    /**
     * 初始保护期（= 父级两阶段滚动窗口）：避免新卡片高度 > 槽位时立即 release，
     * 导致父级 runPhase2 读到 shellRef=null、跳过"顶对齐吸顶下缘"，视觉像没做空屏。
     * 到期后再评估；若此时仍 exceed 则交还自然高度（与原行为等价）。
     */
    const guardMs = Math.max(0, revealChildrenAfterMs) + 50;
    let armed = guardMs === 50 && revealChildrenAfterMs <= 0;
    const check = () => {
      if (!armed) return;
      if (inner.scrollHeight > heightPx) {
        onContentExceedsSlot();
      }
    };
    let armTimer: ReturnType<typeof setTimeout> | null = null;
    if (!armed) {
      armTimer = setTimeout(() => {
        armed = true;
        check();
      }, guardMs);
    } else {
      check();
    }
    const ro = new ResizeObserver(() => check());
    ro.observe(inner);
    return () => {
      ro.disconnect();
      if (armTimer !== null) clearTimeout(armTimer);
    };
  }, [heightPx, onContentExceedsSlot, revealChildrenAfterMs]);

  return (
    <div
      ref={setOuterRef}
      data-new-round-slot="true"
      style={{ height: heightPx }}
      className="flex w-full min-w-0 shrink-0 flex-col overflow-hidden"
    >
      <motion.div
        ref={innerRef}
        className={cn(
          "flex min-h-0 w-full flex-none flex-col overflow-x-clip pb-[var(--space-300)]",
          messageGapClassName
        )}
        initial={
          revealChildrenAfterMs > 0 ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }
        }
        animate={{ opacity: 1, y: 0 }}
        transition={{
          opacity: {
            duration: 0.32,
            delay: revealChildrenAfterMs / 1000,
            ease: [0.22, 1, 0.36, 1],
          },
          y: {
            duration: 0.32,
            delay: revealChildrenAfterMs / 1000,
            ease: [0.22, 1, 0.36, 1],
          },
        }}
      >
        {children}
      </motion.div>
      <div className="min-h-0 w-full flex-1 shrink-0 basis-0" aria-hidden />
    </div>
  );
}

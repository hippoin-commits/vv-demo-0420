import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../ui/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

export type OperationLogLine = { time: string; text: string };

/** 与任务详情「动态」列表一致：卡片首行「系统 · action」，必要时再显示 detail */
function formatOperationLine(text: string): { action: string; detail: string | null } {
  const t = text.trim();
  if (/^(创建任务|更新任务)$/.test(t)) {
    return { action: t, detail: null };
  }
  if (/^系统自动/.test(t)) {
    return { action: "同步", detail: t };
  }
  return { action: "记录", detail: t };
}

type TaskDescriptionDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description: string;
  operationLogs: OperationLogLine[];
};

/** 任务描述全文 + 操作日志；与沟通抽屉一致：全屏蒙层点击仅关闭，不穿透底层交互 */
export function TaskDescriptionDrawer({
  open,
  onOpenChange,
  title = "任务描述",
  description,
  operationLogs,
}: TaskDescriptionDrawerProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      {open && (
        <div
          role="presentation"
          className="fixed inset-0 z-[140] bg-[var(--color-overlay)]"
          onClick={() => onOpenChange(false)}
        />
      )}
      <div
        className={cn(
          "fixed top-0 right-0 z-[141] h-full w-[50vw] min-w-[min(50vw,100%)] max-w-[100vw] flex flex-col",
          "bg-bg border-l border-border shadow-[var(--shadow-md)]",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal={open}
        aria-label={title}
      >
        <header className="flex items-center justify-between gap-[var(--space-300)] px-[var(--space-400)] py-[var(--space-400)] border-b border-border shrink-0">
          <h2 className="text-[length:var(--font-size-md)] font-[var(--font-weight-semi-bold)] text-text leading-tight truncate">
            {title}
          </h2>
          <button
            type="button"
            title="关闭"
            className="p-[var(--space-150)] rounded-[var(--radius-md)] hover:bg-[var(--black-alpha-11)] text-text-secondary shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="关闭"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-[20px]" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-[var(--space-400)] py-[var(--space-400)] flex flex-col gap-[var(--space-600)]">
          <section>
            <h3 className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text mb-[var(--space-300)]">
              描述正文
            </h3>
            <p className="text-[length:var(--font-size-sm)] text-text leading-[var(--line-height-base)] whitespace-pre-wrap">
              {description}
            </p>
          </section>

          <section className="border-t border-border-divider pt-[var(--space-500)]">
            <h3 className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text mb-[var(--space-400)]">
              操作日志
            </h3>
            <ul className="flex flex-col gap-[var(--space-500)] w-full">
              {operationLogs.map((line, i) => {
                const { action, detail } = formatOperationLine(line.text);
                const seed = `oplog-${i}-${line.time}`;
                return (
                  <li key={`${line.time}-${i}`} className="relative">
                    <p className="text-[length:var(--font-size-xxs)] text-text-tertiary mb-[var(--space-200)] tabular-nums">
                      {line.time}
                    </p>
                    <div className="rounded-[var(--radius-md)] border border-border bg-bg p-[var(--space-300)] flex gap-[var(--space-300)] shadow-xs">
                      <Avatar className="size-[36px] shrink-0">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`}
                        />
                        <AvatarFallback>系</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-[length:var(--font-size-xs)] mb-[var(--space-150)]">
                          <span className="font-[var(--font-weight-medium)] text-text">系统</span>
                          <span className="text-text-secondary"> · {action}</span>
                        </p>
                        {detail != null && (
                          <p className="text-[length:var(--font-size-sm)] text-text leading-relaxed">{detail}</p>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </>,
    document.body
  );
}

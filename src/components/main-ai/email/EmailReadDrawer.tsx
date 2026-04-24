import * as React from "react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "../../ui/sheet";
import { Button } from "../../ui/button";
import { cn } from "../../ui/utils";
import type { DemoMailRow } from "./emailCuiData";
import { DemoMailRichBody } from "./DemoMailRichBody";
import {
  ChevronLeft,
  ChevronRight,
  CornerUpLeft,
  Forward,
  MailOpen,
  ReplyAll,
  Trash2,
} from "lucide-react";

/** 右侧抽屉内阅读邮件：宽度约 60% 视口；工具栏在正文上方，无底部按钮栏（关闭用 Sheet 自带右上角） */
export function EmailReadDrawer({
  open,
  onOpenChange,
  mail,
  onPrev,
  onNext,
  canPrev,
  canNext,
  /** 回复 / 全部回复 / 转发：由父级关闭抽屉并在会话中推入写信卡片 */
  onComposeAction,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mail: DemoMailRow | null;
  /** 上一封 / 下一封（演示：在当前列表顺序内切换） */
  onPrev?: () => void;
  onNext?: () => void;
  canPrev?: boolean;
  canNext?: boolean;
  onComposeAction?: (action: "reply" | "replyAll" | "forward", row: DemoMailRow) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "flex h-full max-h-full flex-col gap-0 border-l border-border bg-bg p-0 shadow-elevation-sm",
          "w-[60vw] max-w-[90vw] sm:max-w-none",
          "[&>button.absolute]:top-[var(--space-400)] [&>button.absolute]:right-[var(--space-400)]"
        )}
      >
        <div className="sr-only">
          <SheetTitle>{mail?.subject ?? "邮件"}</SheetTitle>
          <SheetDescription>邮件正文（演示）</SheetDescription>
        </div>
        {mail ? (
          <>
            <div className="shrink-0 border-b border-border px-[var(--space-500)] pb-[var(--space-300)] pr-[calc(var(--space-500)+40px)] pt-[var(--space-500)]">
              <p className="mb-[var(--space-150)] text-[length:var(--font-size-xxs)] text-text-tertiary">
                {mail.kind === "personal" ? "我的邮箱" : "业务邮箱"} · {mail.time}
              </p>
              <h2 className="m-0 text-[length:var(--font-size-lg)] font-[var(--font-weight-semibold)] leading-snug text-text">
                {mail.subject}
              </h2>
              <p className="mt-[var(--space-250)] m-0 text-[length:var(--font-size-sm)] text-text-secondary">
                发件人：{mail.from}
              </p>
            </div>

            <div className="shrink-0 border-b border-border bg-bg-secondary/40 px-[var(--space-400)] py-[var(--space-250)]">
              <div className="scrollbar-hide flex min-w-0 flex-nowrap items-center gap-[var(--space-150)] overflow-x-auto overflow-y-hidden pb-[var(--space-50)]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 shrink-0 gap-1 px-[var(--space-250)] text-[length:var(--font-size-xs)]"
                  onClick={() => mail && onComposeAction?.("reply", mail)}
                >
                  <CornerUpLeft className="size-3.5 shrink-0" />
                  回复
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 shrink-0 gap-1 px-[var(--space-250)] text-[length:var(--font-size-xs)]"
                  onClick={() => mail && onComposeAction?.("replyAll", mail)}
                >
                  <ReplyAll className="size-3.5 shrink-0" />
                  全部回复
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 shrink-0 gap-1 px-[var(--space-250)] text-[length:var(--font-size-xs)]"
                  onClick={() => mail && onComposeAction?.("forward", mail)}
                >
                  <Forward className="size-3.5 shrink-0" />
                  转发
                </Button>
                <span className="mx-[var(--space-100)] hidden h-4 w-px shrink-0 bg-border sm:inline-block" aria-hidden />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 shrink-0 gap-1 px-[var(--space-250)] text-[length:var(--font-size-xs)]"
                  onClick={() => {}}
                >
                  <MailOpen className="size-3.5 shrink-0" />
                  标为未读
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 shrink-0 gap-1 px-[var(--space-250)] text-[length:var(--font-size-xs)] text-destructive hover:text-destructive"
                  onClick={() => {}}
                >
                  <Trash2 className="size-3.5 shrink-0" />
                  删除
                </Button>
                <span className="mx-[var(--space-100)] hidden h-4 w-px shrink-0 bg-border sm:inline-block" aria-hidden />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 shrink-0 gap-1 px-[var(--space-200)] text-[length:var(--font-size-xs)]"
                  disabled={!canPrev}
                  onClick={() => onPrev?.()}
                >
                  <ChevronLeft className="size-4" />
                  上一封
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 shrink-0 gap-1 px-[var(--space-200)] text-[length:var(--font-size-xs)]"
                  disabled={!canNext}
                  onClick={() => onNext?.()}
                >
                  下一封
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-[var(--space-500)] py-[var(--space-400)]">
              <DemoMailRichBody mail={mail} />
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

import * as React from "react";
import { Button } from "../../ui/button";
import { GenericCard } from "../GenericCard";
import type { DemoMailRow, MailComposeAction } from "./emailCuiData";
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
/**
 * 会话内读信卡片：与 {@link EmailReadDrawer} 工具栏一致，回复/全部回复/转发仍调起写信卡片。
 */
export function MailReadInChatCard({
  mail,
  onComposeAction,
  onPrev,
  onNext,
  canPrev,
  canNext,
}: {
  mail: DemoMailRow;
  onComposeAction: (action: MailComposeAction, row: DemoMailRow) => void;
  onPrev?: () => void;
  onNext?: () => void;
  canPrev?: boolean;
  canNext?: boolean;
}) {
  return (
    <GenericCard
      title={mail.subject}
      subtitle={`${mail.kind === "personal" ? "我的邮箱" : "业务邮箱"} · ${mail.time} · 发件人：${mail.from}`}
    >
      <div className="flex w-full min-w-0 flex-col gap-0">
        <div className="shrink-0 border-b border-border bg-bg-secondary/40 px-[var(--space-300)] py-[var(--space-200)]">
          <div className="scrollbar-hide flex min-w-0 flex-nowrap items-center gap-[var(--space-150)] overflow-x-auto overflow-y-hidden pb-[var(--space-50)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 shrink-0 gap-1 px-[var(--space-250)] text-[length:var(--font-size-xs)]"
              onClick={() => onComposeAction("reply", mail)}
            >
              <CornerUpLeft className="size-3.5 shrink-0" />
              回复
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 shrink-0 gap-1 px-[var(--space-250)] text-[length:var(--font-size-xs)]"
              onClick={() => onComposeAction("replyAll", mail)}
            >
              <ReplyAll className="size-3.5 shrink-0" />
              全部回复
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 shrink-0 gap-1 px-[var(--space-250)] text-[length:var(--font-size-xs)]"
              onClick={() => onComposeAction("forward", mail)}
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

        <div className="px-[var(--space-300)] py-[var(--space-350)]">
          <DemoMailRichBody mail={mail} />
        </div>
      </div>
    </GenericCard>
  );
}

import * as React from "react";
import { ChatPromptButton } from "../../chat/ChatPromptButton";
import { MailMailboxListCard } from "./MailCuiCards";
import {
  DEMO_BUSINESS_MAILBOXES,
  type MailComposeEntryPayload,
  type MailScope,
} from "./emailCuiData";

type Props = {
  /** 用于列表过滤中的业务 scope（租户 id 等） */
  businessScope: MailScope;
  onOpenMail: (id: string) => void;
  /** 推入一条 MAIL_MAILBOX 卡片 */
  onAppendMailboxPayload: (payload: Record<string, unknown>) => void;
  /** 打开写信卡片（默认业务发件人） */
  onOpenCompose?: (payload?: MailComposeEntryPayload) => void;
};

export function BusinessMailHubCard({
  businessScope,
  onOpenMail,
  onAppendMailboxPayload,
  onOpenCompose,
}: Props) {
  const handleCompose = () => {
    const firstBiz = DEMO_BUSINESS_MAILBOXES[0]?.id;
    onOpenCompose?.(
      firstBiz ? { defaultBusinessMailboxId: firstBiz } : undefined
    );
  };

  const handleDrafts = () => {
    onAppendMailboxPayload({
      folder: "drafts",
      scope: businessScope,
    });
  };

  const handleSent = () => {
    onAppendMailboxPayload({
      folder: "sent",
      scope: businessScope,
    });
  };

  return (
    <div className="flex w-full flex-col gap-[var(--space-150)]">
      <MailMailboxListCard
        title="业务邮箱 · 收件箱"
        rows={[]}
        onOpenMail={onOpenMail}
        groupByBusinessMailboxes
        businessScope={businessScope}
        folder="inbox"
        listFilter="all"
      />
      <div className="scrollbar-hide flex w-full min-w-0 max-w-full flex-nowrap items-center justify-start gap-[var(--space-150)] overflow-x-auto overflow-y-hidden pb-[var(--space-50)]">
        <ChatPromptButton type="button" onClick={handleCompose}>
          写邮件
        </ChatPromptButton>
        <ChatPromptButton type="button" onClick={handleDrafts}>
          草稿箱
        </ChatPromptButton>
        <ChatPromptButton type="button" onClick={handleSent}>
          发件箱
        </ChatPromptButton>
      </div>
    </div>
  );
}

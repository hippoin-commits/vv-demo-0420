import * as React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { cn } from "../ui/utils";
import { OperationSourceBar } from "./GenericCard";
import {
  CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME,
  CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME,
  CHAT_MESSAGE_ASSISTANT_AVATAR_SPACER_CLASSNAME,
  CHAT_MESSAGE_OPERATION_SOURCE_WRAP_CLASSNAME,
  cnChatAssistantMessageRow,
} from "../chat/chatMessageLayout";

/** 任务/邮箱侧对话：与主对话相同断点规则（窄屏头像在上、md 起头像在左）；有操作来源时窄屏为头像+操作来源同一行，与卡片间距由行布局 gap 6px；操作来源条不换行；md 起有操作来源时，左侧头像顶部与「卡片」而非「操作来源」对齐（下移 36px 条高 + 6px 间距） */
export function TaskChatMessageRow({
  hideAvatar,
  /** 与上一条合并纵向间距（负 margin）；全宽卡片应设为 false，否则会叠到上一条气泡/卡片上 */
  collapseVerticallyWithPrevious = true,
  avatarSrc,
  operationSourceLabel,
  children,
}: {
  hideAvatar: boolean;
  collapseVerticallyWithPrevious?: boolean;
  avatarSrc: string;
  operationSourceLabel?: string;
  children: React.ReactNode;
}) {
  const hasOp = Boolean(operationSourceLabel);

  return (
    <div
      className={cnChatAssistantMessageRow({
        mergedWithPrevious: !!(hideAvatar && collapseVerticallyWithPrevious),
      })}
    >
      {/* md 起左侧头像列；窄屏若有操作来源则头像改到下方「头像+操作来源」行，此处不占位。
          md 起有操作来源时，下移 = 操作来源条高度（36px）+ 条下间距（--space-150=6px），保证头像与卡片顶对齐 */}
      <div
        className={cn(
          "shrink-0 self-start",
          hasOp
            ? "hidden md:flex md:flex-col md:mt-[calc(36px+var(--space-150))]"
            : "flex flex-col"
        )}
      >
        {!hideAvatar ? (
          <Avatar className={cn(CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME, "self-start")}>
            <AvatarImage src={avatarSrc} className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME} />
          </Avatar>
        ) : (
          <div
            className={cn(CHAT_MESSAGE_ASSISTANT_AVATAR_SPACER_CLASSNAME, "self-start")}
            aria-hidden
          />
        )}
      </div>

      {hasOp ? (
        <div
          className={cn(
            "flex w-full min-w-0 max-w-full flex-nowrap items-center gap-[var(--space-150)] self-start md:hidden"
          )}
        >
          {!hideAvatar ? (
            <Avatar className={cn(CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME, "shrink-0")}>
              <AvatarImage src={avatarSrc} className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME} />
            </Avatar>
          ) : null}
          <div className="flex min-w-0 flex-1 items-center justify-end overflow-x-auto overflow-y-visible">
            <OperationSourceBar label={operationSourceLabel} />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col w-full self-start">
        {hasOp ? (
          <div
            className={cn(
              CHAT_MESSAGE_OPERATION_SOURCE_WRAP_CLASSNAME,
              "hidden md:flex"
            )}
          >
            <OperationSourceBar label={operationSourceLabel} />
          </div>
        ) : null}
        <div className="min-w-0 w-full self-start">{children}</div>
      </div>
    </div>
  );
}

import * as React from "react";
import { cn } from "../ui/utils";
import { CHAT_MESSAGE_ASSISTANT_AVATAR_SPACER_CLASSNAME } from "../chat/chatMessageLayout";

/** 同组助手消息竖向间距（与 `DRAWER_CUI_GROUP_STACK_GAP` / 规范一致） */
export const INVITE0421_DRAWER_ASSISTANT_GROUP_STACK_CLASSNAME = "flex w-full min-w-0 flex-col gap-[6px]";

/** 助手头像列与内容区水平间距 8px（与 `DRAWER_CUI_ASSISTANT_ROW` 一致） */
const INVITE0421_DRAWER_ASSISTANT_INLINE_GAP = "gap-[8px]";

/**
 * 抽屉/CUI 内助手行：首条带头像，同组后续行用占位宽度 + 8px 与首条气泡左缘对齐，不重复头像。
 * 同组多行外层请使用 `INVITE0421_DRAWER_ASSISTANT_GROUP_STACK_CLASSNAME`（6px）。
 */
export function Invite0421DrawerAssistantRow({
  showAvatar,
  avatar,
  children,
  className,
}: {
  showAvatar: boolean;
  /** 仅在 `showAvatar` 为 true 时使用 */
  avatar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-row items-start",
        INVITE0421_DRAWER_ASSISTANT_INLINE_GAP,
        className,
      )}
    >
      {showAvatar ? avatar : <div className={CHAT_MESSAGE_ASSISTANT_AVATAR_SPACER_CLASSNAME} aria-hidden />}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

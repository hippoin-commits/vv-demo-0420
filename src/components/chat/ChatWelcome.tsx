import * as React from "react"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { cn } from "../ui/utils"
import {
  CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME,
  CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME,
  CHAT_MESSAGE_ROW_GAP_CLASSNAME,
} from "./chatMessageLayout"

/** 与 ChatWelcome 文案区样式一致，供 TaskChatMessageRow 等「左侧已有头像」场景复用 */
export function AssistantChatBubble({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bg p-[var(--space-300)_var(--space-350)] rounded-tl-sm rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-elevation-sm w-fit max-w-full min-w-0">
      {typeof children === "string" ? (
        <p className="m-0 whitespace-pre-wrap break-words text-[length:var(--font-size-base)] leading-normal text-text">
          {children}
        </p>
      ) : (
        children
      )}
    </div>
  );
}

interface ChatWelcomeProps {
  avatarSrc?: string;
  greeting?: string;
}

export function ChatWelcome({
  avatarSrc,
  greeting = "下午好，我是你的AI助手，请问有什么可以帮到你？",
}: ChatWelcomeProps) {
  return (
    <div
      className={cn(
        "flex w-full items-start",
        "flex-col md:flex-row",
        CHAT_MESSAGE_ROW_GAP_CLASSNAME,
      )}
    >
      <Avatar className={cn(CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME, "shrink-0")}>
        <AvatarImage src={avatarSrc} className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME} />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <AssistantChatBubble>{greeting}</AssistantChatBubble>
    </div>
  );
}

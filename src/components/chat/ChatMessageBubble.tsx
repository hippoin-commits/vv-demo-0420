import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { cn } from "../ui/utils"
import {
  CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME,
  CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME,
  CHAT_MESSAGE_ASSISTANT_AVATAR_SPACER_CLASSNAME,
  CHAT_MESSAGE_ROW_GAP_CLASSNAME,
  cnChatAssistantMessageRow,
} from "./chatMessageLayout"
import { PersonalInfoManager } from "./PersonalInfoManager"
import { CreateEmailForm } from "./CreateEmailForm"
import { ChatPromptButton } from "./ChatPromptButton"
import { AssistantChatBubble } from "./ChatWelcome"

interface ChatMessageBubbleProps {
  msg: any;
  isMe: boolean;
  userAvatar?: string;
  aiAvatar?: string;
  userName?: string;
  isSpecialComponent?: boolean;
  isPersonalInfo?: boolean;
  isCreateEmailForm?: boolean;
  isContinueEmail?: boolean;
  hideAvatar?: boolean;
  /** 已包在 `TaskChatMessageRow` 等外层里：不再渲染头像列与 `cnChatAssistantMessageRow`，避免双占位、与主对话对齐 */
  embeddedInAssistantRow?: boolean;
  className?: string;
  handleEmailFormSubmit?: (id: string, data: any) => void;
  handleContinueCreateEmail?: () => void;
}

export function ChatMessageBubble({
  msg,
  isMe,
  userAvatar,
  aiAvatar,
  userName = "User",
  isSpecialComponent,
  isPersonalInfo,
  isCreateEmailForm,
  isContinueEmail,
  hideAvatar = false,
  embeddedInAssistantRow = false,
  className,
  handleEmailFormSubmit,
  handleContinueCreateEmail
}: ChatMessageBubbleProps) {
  const assistantShell = !isMe && !embeddedInAssistantRow;

  return (
    <div
      className={cn(
        isMe
          ? cn(
              "flex w-full flex-col md:flex-row",
              "items-end justify-end md:items-start",
              CHAT_MESSAGE_ROW_GAP_CLASSNAME,
            )
          : embeddedInAssistantRow
            ? "flex w-full min-w-0 flex-col items-stretch"
            : cnChatAssistantMessageRow({ wideOnMd: !!isSpecialComponent }),
        className,
      )}
    >
      {assistantShell && !hideAvatar ? (
        <Avatar className={CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME}>
          <AvatarImage src={aiAvatar} className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME} />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      ) : null}
      {assistantShell && hideAvatar ? (
        <div className={CHAT_MESSAGE_ASSISTANT_AVATAR_SPACER_CLASSNAME} aria-hidden />
      ) : null}

      <div
        className={cn(
          "flex min-w-0 flex-col",
          isMe ? "items-end" : "items-start",
          isSpecialComponent
            ? "w-full"
            : embeddedInAssistantRow
              ? "w-full min-w-0"
              : "max-w-[min(100%,32rem)] md:max-w-[min(100%,40rem)]",
        )}
      >
        {isPersonalInfo ? (
          <PersonalInfoManager />
        ) : isCreateEmailForm ? (
          <CreateEmailForm 
            isReadonly={msg.isReadonly} 
            initialData={msg.formData}
            onSubmit={(data) => handleEmailFormSubmit?.(msg.id, data)}
          />
        ) : isContinueEmail ? (
          <ChatPromptButton onClick={handleContinueCreateEmail}>
            继续创建
          </ChatPromptButton>
        ) : (
          <div
            className={cn(
              "flex min-w-0 flex-col gap-[var(--space-200)]",
              isMe ? "items-end" : "items-start",
            )}
          >
            {msg.id === "m3" && (
              <div className="flex w-fit max-w-full min-w-0 items-center gap-[var(--space-300)] rounded-tl-[var(--radius-lg)] rounded-tr-[var(--radius-sm)] rounded-bl-[var(--radius-lg)] rounded-br-[var(--radius-lg)] border bg-bg p-[var(--space-300)] shadow-elevation-sm">
                <div className="flex h-[var(--space-900)] w-[var(--space-900)] shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-success text-[length:var(--font-size-lg)] font-bold text-[var(--color-white)]">
                  X
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text">
                    客户的课程内容.xlsx
                  </span>
                  <span className="text-[length:var(--font-size-xs)] text-text-secondary">100 KB</span>
                </div>
              </div>
            )}
            {isMe ? (
              <div
                className={cn(
                  "w-fit max-w-full min-w-0 self-end break-words rounded-tl-[var(--radius-lg)] rounded-tr-[var(--radius-sm)] rounded-br-[var(--radius-lg)] rounded-bl-[var(--radius-lg)] bg-gradient-to-r from-[#9187FF] to-[#2C98FC] p-[var(--space-300)_var(--space-350)] text-[length:var(--font-size-base)] leading-normal text-[var(--color-white)] shadow-elevation-sm",
                )}
              >
                {msg.content}
              </div>
            ) : (
              <AssistantChatBubble>{msg.content}</AssistantChatBubble>
            )}
          </div>
        )}
      </div>

      {isMe && !hideAvatar && (
        <Avatar className={CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME}>
          <AvatarImage src={userAvatar} />
          <AvatarFallback>{userName[0]}</AvatarFallback>
        </Avatar>
      )}
      {isMe && hideAvatar && (
        <div className={CHAT_MESSAGE_ASSISTANT_AVATAR_SPACER_CLASSNAME} />
      )}
    </div>
  )
}
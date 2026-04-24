import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AssistantChatBubble } from "../chat/ChatWelcome";
import { cn } from "../ui/utils";
import {
  CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME,
  CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME,
  CHAT_MESSAGE_ROW_GAP_CLASSNAME,
} from "../chat/chatMessageLayout";
import {
  INVITE0421_MAIN_AI_DOCK_WELCOME_EDU_STUDENT,
  INVITE0421_MAIN_AI_DOCK_WELCOME_ORG_INVITED,
} from "../../constants/invite0421MainAiDockWelcome";

export type Invite0421MainAiDockWelcomeVariant = "orgInvited" | "eduStudent";

export function Invite0421MainAiDockWelcome({
  variant,
  assistantAvatarSrc,
}: {
  variant: Invite0421MainAiDockWelcomeVariant;
  assistantAvatarSrc: string;
}) {
  const copy =
    variant === "eduStudent"
      ? INVITE0421_MAIN_AI_DOCK_WELCOME_EDU_STUDENT
      : INVITE0421_MAIN_AI_DOCK_WELCOME_ORG_INVITED;

  return (
    <div
      className={cn(
        "flex w-full items-start",
        "flex-col md:flex-row",
        CHAT_MESSAGE_ROW_GAP_CLASSNAME,
      )}
    >
      <Avatar className={cn(CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME, "shrink-0")}>
        <AvatarImage src={assistantAvatarSrc} className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME} />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <AssistantChatBubble>
        <div className="flex min-w-0 max-w-full flex-col gap-[length:var(--space-250)]">
          <p
            className={cn(
              "m-0 flex items-center gap-[length:var(--space-150)] border-l-[length:var(--stroke-lg)] border-primary pl-[length:var(--space-200)]",
              "text-[length:var(--font-size-base)] font-[var(--font-weight-semibold)] leading-snug text-text",
            )}
          >
            {copy.title}
          </p>
          {copy.paragraphs.map((line, i) => (
            <p
              key={i}
              className="m-0 text-[length:var(--font-size-base)] font-[var(--font-weight-regular)] leading-relaxed text-text"
            >
              {line}
            </p>
          ))}
        </div>
      </AssistantChatBubble>
    </div>
  );
}

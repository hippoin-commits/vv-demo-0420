import { cn } from "../ui/utils";

/**
 * 助手侧对话行布局（主 AI / 教育 / 任务卡片行等复用）：
 * - 窄于 `md`：纵向排列，头像在内容上方；
 * - `md` 及以上：横向，头像在左、内容在右。
 * 与 `ChatMessageBubble` 中非用户消息、`Guidelines` 中聊天卡片间距约定一致。
 */
export const CHAT_MESSAGE_ROW_GAP_CLASSNAME = "gap-[6px] md:gap-[8px]";

const CHAT_MESSAGE_ASSISTANT_ROW_CORE = cn(
  "flex flex-col md:flex-row items-start w-full",
  CHAT_MESSAGE_ROW_GAP_CLASSNAME,
  "justify-start group"
);

export function cnChatAssistantMessageRow(options?: {
  /** 与上一条合并头像区时的负边距（通常配合 `hideAvatar` + 桌面占位） */
  mergedWithPrevious?: boolean;
  /** 桌面端使用「减去左侧头像列」的通栏宽度（任务/教育等大卡片） */
  wideOnMd?: boolean;
}) {
  return cn(
    CHAT_MESSAGE_ASSISTANT_ROW_CORE,
    options?.wideOnMd !== false ? "md:w-[calc(100%-44px)]" : "",
    options?.mergedWithPrevious ? "-mt-[var(--space-600)]" : ""
  );
}

/** 助手头像 28×28 / 36×36 */
export const CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME =
  "h-[28px] w-[28px] md:h-[36px] md:w-[36px] shrink-0";

/**
 * 助手头像图（如 main-nav/AI.png）：素材四周留白较多，略放大以铺满圆形容器（由外层 Avatar `overflow-hidden` 裁切）。
 */
export const CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME =
  "origin-center scale-[1.26]";

/** `hideAvatar` 时保留与助手头像列同宽占位，窄屏与桌面都与首条气泡左缘对齐 */
export const CHAT_MESSAGE_ASSISTANT_AVATAR_SPACER_CLASSNAME =
  "w-[28px] shrink-0 md:w-[36px]";

/** 任务/邮箱卡片行顶部的「操作来源」条：与卡片同列、右对齐；与下方卡片间距 6px（--space-150），不换行 */
export const CHAT_MESSAGE_OPERATION_SOURCE_WRAP_CLASSNAME =
  "flex w-full min-w-0 max-w-full flex-nowrap items-center justify-end mb-[var(--space-150)] h-[36px] min-h-[36px] self-start";

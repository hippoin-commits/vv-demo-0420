import type { Message } from "../chat/data";

export type { MessageOperationSource } from "../chat/data";

/**
 * 是否展示「操作来源」文案。
 * - 无元数据：不展示（底部导航、输入指令、纯文字气泡等）
 * - 来源与当前消息不在同一会话：不展示（切换对话/租户后插入的卡片）
 * - **与来源在时间上紧挨**：当上一条消息的 `id === operationSource.sourceMessageId` 时不展示（中间无其它消息）。
 *   由某张**来源卡片**上的操作直接推入子卡片时，应把 `sourceMessageId` 设为**该来源卡片所在行的 `Message.id`**，
 *   而不是更上一条用户气泡 id，否则子卡与来源卡紧挨仍会误显示操作来源。
 */
export function resolveOperationSourceLabel(
  msg: Message,
  messageIndex: number,
  messages: Message[],
  currentConversationId?: string
): string | undefined {
  const os = msg.operationSource;
  if (!os?.cardTitle?.trim() || !os.sourceMessageId) return undefined;
  if (
    currentConversationId &&
    os.sourceConversationId &&
    os.sourceConversationId !== currentConversationId
  ) {
    return undefined;
  }
  const prev = messages[messageIndex - 1];
  if (prev?.id === os.sourceMessageId) return undefined;
  const title = os.cardTitle.trim();
  const detail = os.sourceDetailLabel?.trim();
  if (detail) return `${title}  ${detail}`;
  return title;
}

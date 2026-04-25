/** 0424-权限编辑卡片方案：主 AI 对话内触发词与消息标记 */

export const PERMISSION_EDIT_CARD_0424_USER_TRIGGER = "权限编辑卡片";

/** 0424 演示页主 AI 输入框默认预填（须含触发词，发送后即可出现权限编辑卡片） */
export const PERMISSION_EDIT_CARD_0424_DEFAULT_INPUT_PROMPT =
  "权限编辑卡片（演示：直接发送即可打开对话内编辑卡）";

export const PERMISSION_EDIT_CARD_0424_MARKER = "<<<PERMISSION_EDIT_CARD_0424>>>" as const;

export const PERMISSION_DETAIL_CARD_0424_MARKER_PREFIX = "<<<PERMISSION_DETAIL_CARD_0424>>>:" as const;

/** `修改于 MM-DD HH:MM`（月日 24h，与标题后缀展示一致） */
export function formatPermissionDetailSubmittedAt0424(ms: number): string {
  const d = new Date(ms);
  const MM = String(d.getMonth() + 1).padStart(2, "0");
  const DD = String(d.getDate()).padStart(2, "0");
  const HH = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `修改于 ${MM}-${DD} ${HH}:${mm}`;
}

/** 提交后写入消息 `content` 的 JSON 负载（演示） */
export type PermissionEditDetailPayload0424 = {
  /** 点击「提交」时刻，用于标题旁「修改于 …」 */
  submittedAtMs?: number;
  flowName: string;
  bizType: string;
  flowNumberPrefix: string;
  flowStatus: "enabled" | "disabled";
  company: string;
  coverSubsidiaries: boolean;
  processGroup: string;
  relatedPolicy: string;
  flowDescription: string;
  dedupeMode: "once" | "consecutive" | "none";
  revokeInProgress: boolean;
  revokeCompletedDays: number;
  revokeCompletedEnabled: boolean;
};

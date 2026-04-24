/** 0421 无组织壳：主 AI 首屏欢迎气泡（受邀加入组织 / 受邀加入教育空间-学生） */

import { INVITE0421_EDU_STUDENT_MAIN_AI_WELCOME_INVITE_SOURCE } from "./invite0421InvitedTodo";

export const INVITE0421_MAIN_AI_DOCK_WELCOME_ORG_INVITED = {
  title: "欢迎使用 V V AI",
  paragraphs: [
    "V V AI 你说我做！加入组织后，您可以使用全方位的协同办公和企业管理服务。",
    "您已收到来自 PG科技有限公司 的邀请，请点击下方按钮处理，或告诉我您的需求，我会协助您高效完成任务！",
  ],
} as const;

export const INVITE0421_MAIN_AI_DOCK_WELCOME_EDU_STUDENT = {
  title: "欢迎使用V V AI",
  paragraphs: [
    "V V AI 你说我做！加入教育空间，可与学校/教育机构互联互通，也可管理学习计划。",
    `您已收到来自 ${INVITE0421_EDU_STUDENT_MAIN_AI_WELCOME_INVITE_SOURCE} 的邀请，请点击下方按钮处理，或告诉我您的需求，我会协助您高效完成任务！`,
  ],
} as const;

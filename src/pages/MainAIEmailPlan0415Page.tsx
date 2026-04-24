import { MainAI } from "../components/main-ai/MainAI";

/** 首页「0415-邮箱-在抽屉查看邮件内容」：租户分桶会话、底栏「邮箱管理」与跨会话操作来源规则（与方案1 分流） */
export function MainAIEmailPlan0415Page() {
  return <MainAI initialActiveApp="mail" taskEntryVariant="email0415" />;
}

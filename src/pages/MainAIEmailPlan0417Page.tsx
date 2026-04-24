import { MainAI } from "../components/main-ai/MainAI";

/** 首页「0417-邮箱-在对话中查看邮件内容」：由「0415-邮箱-在抽屉查看邮件内容」复制，用于在对话中查看邮件内容等方案迭代 */
export function MainAIEmailPlan0417Page() {
  return <MainAI initialActiveApp="mail" taskEntryVariant="email0417" />;
}

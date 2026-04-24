import { MainAI } from "../components/main-ai/MainAI";

/** 首页「0413-邮箱-方案1」：由「0413-任务-方案2」思路分叉而来，用于邮箱入口/会话方案迭代（与 {@link MainAITaskPlan2Page} 并行） */
export function MainAIEmailPlan0413Page() {
  return <MainAI initialActiveApp="mail" taskEntryVariant="email0413" />;
}

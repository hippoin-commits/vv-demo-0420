import { MainAI } from "../components/main-ai/MainAI";

/** 首页「0413-任务-方案2」：与 {@link MainAITaskPage} 并行，用于迭代另一套任务入口/会话体验 */
export function MainAITaskPlan2Page() {
  return <MainAI initialActiveApp="task" taskEntryVariant="plan2" />;
}

import { MainAI } from "../components/main-ai/MainAI";

/** 首页「0412-任务-方案1」：与主入口相同壳，默认进入任务应用（底部「任务」已选中态） */
export function MainAITaskPage() {
  return <MainAI initialActiveApp="task" taskEntryVariant="default" />;
}

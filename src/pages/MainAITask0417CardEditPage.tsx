import { MainAI } from "../components/main-ai/MainAI";

/** 首页「0417-任务-新卡片编辑更新」：`task0417CardEdit` — 编辑任务确定后表单固化，并在反馈气泡下追加合并快照后的任务详情卡（与列表打开详情一致） */
export function MainAITask0417CardEditPage() {
  return <MainAI initialActiveApp="task" taskEntryVariant="task0417CardEdit" />;
}

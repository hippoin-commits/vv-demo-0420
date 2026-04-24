import { MainAI } from "../components/main-ai/MainAI";

/** 首页「0417-任务-原位置编辑更新」：`task0417InlineEdit`（详情卡内原位置进入编辑、确定后回浏览态并合并快照；标题后「（已更新）」；底栏对齐 Weekly / Figma 1176:3067） */
export function MainAITask0417InlineEditPage() {
  return <MainAI initialActiveApp="task" taskEntryVariant="task0417InlineEdit" />;
}

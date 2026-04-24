import { MainAI } from "../components/main-ai/MainAI";

/**
 * 「0419-方案探索-侧边栏」：由「0417-任务-新卡片编辑更新」复制入口，仅在 `task0419SidebarExplore` 下实验。
 * 本页：待办卡片在主 AI 与「业务能力」子层常驻，默认展开、可收起；切换组织仅影响后续动作，对话列表与主 `messages` 不断开（见 MainAIChatWindow `is0419Explore`）。
 * 欢迎语与行动建议（主 AI / 教育 / 任务 / 邮箱）统一为「你好，我是你的专属AI助手…」与主 AI 三按钮，切换业务能力不换装。
 * 「按新对话聚合侧栏 + 统一对话流」：切换应用只改底栏，会话不断开；仅点「新对话」才新建侧栏项。
 */
export function MainAI0419SidebarExplorePage() {
  return <MainAI initialActiveApp="task" taskEntryVariant="task0419SidebarExplore" />;
}

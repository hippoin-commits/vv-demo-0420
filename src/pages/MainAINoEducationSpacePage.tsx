import { MainAI } from "../components/main-ai/MainAI";

/** 0421-有组织无教育空间（路由 `/main-ai-no-edu-space`）
 *  复制自「主入口」（MainAIPage），并通过 `hasEducationSpace={false}` 将教育应用切换到空态：
 *  - 顶栏中间显示「创建教育空间」下拉按钮（创建机构 / 家庭教育空间）
 *  - 进入教育应用时，欢迎态显示创建引导文案及对应行动建议
 *
 *  叠加本场景差异化能力：
 *  - `alwaysShowIndependentWindow`：右上角「独立窗口」图标在每个子页（主 AI / 教育 / 任务 / 邮箱）都显示
 *  - `sidebarVariant="combinedNoEduSpace"`：左侧边栏合并为「微微AI 历史 + 应用使用记录」两段式
 *  - `noEduSpace0421ChatToolbar`：顶栏右侧——主 AI 固定「新对话 + 独立窗口」；业务子应用仅「独立窗口」（并隐藏子应用内模型选择）
 */
export function MainAINoEducationSpacePage() {
  return (
    <MainAI
      hasEducationSpace={false}
      sidebarVariant="combinedNoEduSpace"
      alwaysShowIndependentWindow
      noEduSpace0421ChatToolbar
    />
  );
}

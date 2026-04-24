import { MainAI } from "../components/main-ai/MainAI";

/**
 * 0421-有组织无教育空间-2（路由 `/main-ai-no-edu-space-2`）
 *
 * 在「0421-有组织无教育空间」基础上增加：
 * - 教育 AI 底栏在无教育空间时仍展示**机构**快捷入口的前 **3** 个一级按钮；
 * - 首次点选子菜单：顶部中上胶囊提示「创建您的教育空间，开启教育服务」；
 * - 再次点选子菜单：仅提示「请先创建教育空间」（无蒙层，约 3 秒消失）。
 */
export function MainAINoEducationSpacePage2() {
  return (
    <MainAI
      hasEducationSpace={false}
      sidebarVariant="combinedNoEduSpace"
      alwaysShowIndependentWindow
      noEduSpace0421ChatToolbar
      educationNoSpaceDockTeaser
    />
  );
}

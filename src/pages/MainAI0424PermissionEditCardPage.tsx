import { MainAI } from "../components/main-ai/MainAI";

/**
 * 0424-权限编辑卡片方案：基于「0421-新用户-受邀加入组织」壳层（主 AI 顶栏与底栏策略），主 AI 固定为**有组织**态；
 * 用户在输入框发送含「权限编辑卡片」的文案并开启新一轮后，出现权限编辑 CUI 卡片（表单 + 沉浸式入口 + 提交后切为详情卡）。
 */
export function MainAI0424PermissionEditCardPage() {
  return (
    <MainAI
      hasOrganization
      educationSpacePreset="familyOnly0421"
      alwaysShowIndependentWindow
      noEduSpace0421ChatToolbar
      permissionEditCard0424Demo
    />
  );
}

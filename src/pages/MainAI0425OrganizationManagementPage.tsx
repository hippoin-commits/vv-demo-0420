import { MainAI } from "../components/main-ai/MainAI";

/**
 * 0425-案例-组织管理+权限申请：复制 0424 对话卡片方案，主 AI 与组织应用输入「组织管理」后展示组织管理卡片。
 */
export function MainAI0425OrganizationManagementPage() {
  return (
    <MainAI
      hasOrganization
      educationSpacePreset="familyOnly0421"
      alwaysShowIndependentWindow
      noEduSpace0421ChatToolbar
      organizationManagement0425Demo
    />
  );
}


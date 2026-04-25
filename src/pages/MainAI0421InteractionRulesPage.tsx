import * as React from "react";
import { MainAI } from "../components/main-ai/MainAI";

/**
 * 交互规范文档（首页入口「交互规范文档 - 持续更新中」）：主 AI / 教育空态 / 学生邀请流与 Edu 学生页一致；左侧为 **文档演示区域**（见 `interactionRulesSpecData.ts` 约定），右侧为实景产品区。
 */
export function MainAI0421InteractionRulesPage() {
  return (
    <MainAI
      hasOrganization={false}
      hasEducationSpace={false}
      educationSpacePreset="eduStudentInvite0421"
      simpleOrgOnboarding0421
      invite0421EduStudentFlow
      alwaysShowIndependentWindow
      noEduSpace0421ChatToolbar
      demoInstructionShell
      organizationManagement0425Demo
    />
  );
}

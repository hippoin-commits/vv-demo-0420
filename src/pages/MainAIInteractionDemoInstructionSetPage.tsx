import * as React from "react";
import { MainAI } from "../components/main-ai/MainAI";

/**
 * 交互演示指令集：复制「交互规范文档」的实际产品区，外层改为左演示入口 / 中实际界面 / 右逻辑指令三栏。
 */
export function MainAIInteractionDemoInstructionSetPage() {
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
      demoInstructionSetShell
      organizationManagement0425Demo
    />
  );
}

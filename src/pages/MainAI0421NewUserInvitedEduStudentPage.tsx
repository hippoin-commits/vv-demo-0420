import * as React from "react";
import { MainAI } from "../components/main-ai/MainAI";

/**
 * 0421-新用户-受邀加入教育空间-学生：主 AI 始终无组织；教育 AI 初始为「无教育空间」态（对齐 `MainAINoEducationSpacePage` 的教育空态）。
 * 用户在流程内「确认创建」后即写入并选中该家庭空间；点「进入张小宝教育空间」会再打开教育应用并同步父级状态；底栏进入教育即可见有空间与家庭快捷入口。
 * 顶栏右侧与「0421-有组织无教育空间」一致：主 AI 新对话 + 独立窗口；业务子应用仅独立窗口。
 * 应用分类见 `src/guidelines/Guidelines.md` — **0421 · VV 壳层与主 AI 应用分类**（个人 / 工作台 / 教育）。
 */
export function MainAI0421NewUserInvitedEduStudentPage() {
  return (
    <MainAI
      hasOrganization={false}
      hasEducationSpace={false}
      educationSpacePreset="eduStudentInvite0421"
      simpleOrgOnboarding0421
      invite0421EduStudentFlow
      alwaysShowIndependentWindow
      noEduSpace0421ChatToolbar
    />
  );
}

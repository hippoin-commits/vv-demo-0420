import * as React from "react";
import { MainAI } from "../components/main-ai/MainAI";

/**
 * 0421-新用户-受邀加入组织：无组织底栏 / 全部应用 / 侧栏「更多」与 IM 受邀入组、主 AI 组织态联动演示。
 * 顶栏右侧与「0421-有组织无教育空间」一致：主 AI 新对话 + 独立窗口；业务子应用仅独立窗口（见 `noEduSpace0421ChatToolbar`）。
 * 应用分类见 `src/guidelines/Guidelines.md` — **0421 · VV 壳层与主 AI 应用分类**（个人 / 工作台 / 教育）。
 */
export function MainAI0421NewUserInvitedOrgPage() {
  const [demoHasOrganization, setDemoHasOrganization] = React.useState(false);
  const on0421EstablishOrganization = React.useCallback(() => {
    setDemoHasOrganization(true);
  }, []);

  return (
    <MainAI
      hasOrganization={demoHasOrganization}
      educationSpacePreset="familyOnly0421"
      simpleOrgOnboarding0421={!demoHasOrganization}
      on0421EstablishOrganization={on0421EstablishOrganization}
      invite0421NewUserFlow
      alwaysShowIndependentWindow
      noEduSpace0421ChatToolbar
    />
  );
}

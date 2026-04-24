import * as React from "react";
import { MainAI } from "../components/main-ai/MainAI";

/** 0421-无组织有教育空间：主 AI 无组织顶栏；教育应用仅两个家庭教育空间（默认张大宝）+ 家庭版底部快捷入口。
 * 顶栏右侧与「0421-有组织无教育空间」一致：主 AI 新对话 + 独立窗口；业务子应用仅独立窗口。
 */
export function MainAIPage() {
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
      alwaysShowIndependentWindow
      noEduSpace0421ChatToolbar
    />
  );
}
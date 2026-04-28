/**
 * 首页入口与「演示顶栏」标题一一对应。
 * - `DEMO_HOME_INTERACTION_DEMO_INSTRUCTIONS_ENTRY`：首页第一位「交互演示指令集」入口（`Home.tsx` 单独渲染）。
 * - `DEMO_HOME_INTERACTION_RULES_ENTRY`：首页第二位「交互规范文档」入口（`Home.tsx` 单独渲染）。
 * - `DEMO_HOME_PRIMARY_NAV_ENTRIES`：首页最后的蓝色场景入口按钮列（须与 `Home.tsx` 同步）。
 */

export type DemoHomeNavEntry = { readonly label: string; readonly path: string };

/** 首页第一位独立入口：与 `MainAIInteractionDemoInstructionSetPage` 对应 */
export const DEMO_HOME_INTERACTION_DEMO_INSTRUCTIONS_ENTRY: DemoHomeNavEntry = {
  label: "交互演示指令集",
  path: "/main-ai-interaction-demo-instructions",
} as const;

/** 首页第二位独立入口：与 `MainAI0421InteractionRulesPage` 对应 */
export const DEMO_HOME_INTERACTION_RULES_ENTRY: DemoHomeNavEntry = {
  label: "交互规范文档",
  path: "/main-ai-0421-interaction-rules",
} as const;

/** 首页主按钮对应的路由与标题 */
export const DEMO_HOME_PRIMARY_NAV_ENTRIES: readonly DemoHomeNavEntry[] = [
  { label: "0424-流程编辑卡片方案", path: "/main-ai-0424-permission-edit-card" },
  { label: "0425-案例-组织管理+权限申请", path: "/main-ai-0425-organization-management" },
] as const;

/** 首页「页面归档」列表 */
export const DEMO_HOME_ARCHIVED_NAV_ENTRIES: readonly DemoHomeNavEntry[] = [
  { label: "0412-任务-方案1", path: "/main-ai-task" },
  { label: "0413-任务-方案2", path: "/main-ai-task-plan2" },
  { label: "0413-邮箱-方案1", path: "/main-ai-email-plan-0413" },
  { label: "0415-邮箱-在抽屉查看邮件内容", path: "/main-ai-email-plan-0415" },
  { label: "0417-邮箱-在对话中查看邮件内容", path: "/main-ai-email-plan-0417" },
  { label: "0417-任务-原位置编辑更新", path: "/main-ai-task-0417-inline-edit" },
  { label: "0417-任务-新卡片编辑更新", path: "/main-ai-task-0417-card-edit" },
  { label: "0419-方案探索-侧边栏", path: "/main-ai-0419-sidebar-explore" },
  { label: "0421-新用户-受邀加入组织", path: "/main-ai-0421-new-user-invited-org" },
  { label: "0421-新用户-受邀加入教育空间-学生", path: "/main-ai-0421-new-user-invited-edu-student" },
  { label: "0421-无组织有教育空间", path: "/main-ai" },
  { label: "0421-有组织无教育空间", path: "/main-ai-no-edu-space" },
  { label: "0421-有组织无教育空间-2", path: "/main-ai-no-edu-space-2" },
  { label: "0422-日程-抽屉交互细节演示", path: "/main-ai-0422-schedule-drawer-demo" },
] as const;

const ALL_DEMO_NAV_ENTRIES: readonly DemoHomeNavEntry[] = [
  DEMO_HOME_INTERACTION_DEMO_INSTRUCTIONS_ENTRY,
  DEMO_HOME_INTERACTION_RULES_ENTRY,
  ...DEMO_HOME_PRIMARY_NAV_ENTRIES,
  ...DEMO_HOME_ARCHIVED_NAV_ENTRIES,
];

/** 演示顶栏中间标题：与首页对应按钮 label 一致 */
export function getDemoNavBarTitle(pathname: string): string {
  let p = pathname.replace(/\/+$/, "") || "/";
  if (!p.startsWith("/")) p = `/${p}`;
  const hit = ALL_DEMO_NAV_ENTRIES.find((e) => e.path === p);
  return hit?.label ?? "演示页面";
}

/**
 * 0421 演示：依赖企业/组织后才可进入的一级工作台应用（教育等不在此列）。
 * 与 MainAIChatWindow 门闩集合保持一致。
 */
export const INVITE0421_WORKBENCH_APP_IDS = new Set([
  "task",
  "finance",
  "salary",
  "company",
  "profile",
  "organization",
  "employee",
  "recruitment",
]);

/**
 * 个人应用：无组织时仍出现在主 AI 底栏 pill（及「全部应用 → 已添加」）。
 * 与 Guidelines「0421 · VV 壳层与主 AI 应用分类」一致。
 */
export const INVITE0421_PERSONAL_APP_IDS = new Set([
  "schedule",
  "todo",
  "disk",
  "mail",
]);

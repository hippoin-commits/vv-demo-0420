/** 0421 新用户受邀演示：主 AI 吸顶「受邀待办」与 IM 邀请文案对齐 */

/** 主 AI 吸顶待办卡标题（0421 受邀加入组织 / 受邀加入教育空间-学生） */
export const INVITE0421_MAIN_AI_PINNED_GREETING = "下午好，今天您有 2 件要处理的事情 👇";

export const INVITE0421_DEMO_INVITER = "张三";

export const INVITE0421_ORG_COMPANY_NAME = "PG北京科技有限公司";

/** 0421-新用户-受邀加入组织：主 AI 欢迎区行动建议 + 点击后用户气泡文案 */
export const INVITE0421_ORG_PROCESS_PG_INVITE_ACTION_LABEL = "处理来自PG科技的邀请";

/** 0421 受邀入组完成后顶栏切换器使用的演示组织 id（与列表仅一项一致） */
export const INVITE0421_JOINED_ORG_DEMO_ID = "invite0421-pg-org";

/** 与 `Invite0421EduStudentMessageModule` 中机构教育空间邀请语境一致 */
export const INVITE0421_EDU_SPACE_INVITE_NAME = "小测教育机构教育空间";

/** 0421-受邀加入教育空间-学生：主 AI 欢迎第二段中的邀请来源展示名 */
export const INVITE0421_EDU_STUDENT_MAIN_AI_WELCOME_INVITE_SOURCE = "小测教育科技教育空间";

/** 0421-受邀加入教育空间-学生：主 AI 欢迎区行动建议 + 点击待办/按钮后用户气泡文案 */
export const INVITE0421_EDU_PROCESS_XIAOCE_INVITE_ACTION_LABEL = "处理来自小测教育的邀请";

export function invite0421InvitedTodoOrgTitle() {
  return `${INVITE0421_DEMO_INVITER}邀请您加入${INVITE0421_ORG_COMPANY_NAME}`;
}

export function invite0421InvitedTodoEduTitle() {
  return `${INVITE0421_DEMO_INVITER}邀请您加入${INVITE0421_EDU_SPACE_INVITE_NAME}`;
}

/** 保留一条普通待办（点击仍打开原详情抽屉） */
export const INVITE0421_GENERIC_TODO_TITLE = "项目周会材料确认";

/** 0421-新用户-受邀加入教育空间-学生：教育应用尚无空间时顶栏下拉主按钮与二级菜单 */
export const INVITE0421_EDU_STUDENT_EMPTY_SPACE_NAV = {
  triggerLabel: "创建或加入教育空间",
  createInstitutionTitle: "创建教育空间",
  createInstitutionDescription: "适合教育机构、学校、培训组织",
  createFamilyTitle: "加入教育空间",
  createFamilyDescription: "通过邀请加入机构或学校已有的教育空间",
} as const;

/** 同上场景：教育空态欢迎区主文案 */
export const INVITE0421_EDU_STUDENT_EMPTY_WELCOME_GREETING =
  "欢迎使用教育。您还没有教育空间，可在顶部选择「创建或加入教育空间」，或点击下方快捷入口。";

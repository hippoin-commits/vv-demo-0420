import * as React from "react"
import { flushSync } from "react-dom"
import { ScrollArea } from "../ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Input } from "../ui/input";
import { AllAppsDrawer } from "./AllAppsDrawer";
import { Resizable } from 're-resizable';
import svgPathsFromCourse from "../../imports/svg-na9nwxl1b7";

import {
  Conversation,
  currentUser,
  Message,
  type MessageOperationSource,
  mailScopeToConversationId,
  conversationIdToMailScope,
} from "../chat/data"
import { cn } from "../ui/utils"
import { PersonalInfoManager } from "../chat/PersonalInfoManager"
import { HistorySidebar } from "../chat/HistorySidebar"
import { 
  TimestampSeparator
} from "../chat/ChatComponents"
import { SidebarIcon } from "../chat/SidebarIcons"
import { CreateEmailForm } from "../chat/CreateEmailForm"
import { Button } from "../ui/button"
import { GenericCard, OperationSourceBar } from "./GenericCard";
import {
  TaskManagementTableCard,
  CreateTaskFullFormCard,
  TaskDraftsTableCard,
  TaskDetailCard,
  TaskHubSessionCard,
  TASK_HUB_LABELS,
  FilteredExecutionDivisionListCard,
  KanbanScopeListCard,
  TaskFilterCard,
  TaskSettingsCard,
  EditTaskFormCard,
  CreateSubtaskFormCard,
  HandoverTaskCard,
  LinkSubtaskChatCard,
  TaskEvaluationRecordsCard,
  ExecutionContentFormCard,
  NewOutputFormCard,
  ExecutionDivisionDetailChatCard,
  type SubtaskRow,
  type TaskChatCardKind,
  type TaskHubKind,
  type TaskPushChatCardOptions,
} from "./TaskAppCards";
import {
  TASK_APPS,
  applyTaskEditSnapshotToDetail,
  getTaskDetailOrFallback,
  getTasksForLinkPicker,
  type ExecutionDivisionRow,
} from "./taskAppData";
import {
  buildTaskCommandFallbackReply,
  findLatestTaskContextId,
  parseTaskTextCommand,
} from "./taskTextCommands";
import { getTaskDraftById } from "./taskDraftStorage";
import type { ExecutionContentValues } from "./task-detail/ExecutionContentDrawer";
import type { TaskFormSnapshot } from "./task-detail/TaskFormFields";

import { AppDockEntryIcon, AppIcon } from './AppIcon';
import { ChatNavBar, type EducationSpaceNode } from "../chat/ChatNavBar"
import { AssistantChatBubble, ChatWelcome } from "../chat/ChatWelcome"
import { ChatScrollToBottomFab } from "../chat/ChatScrollToBottomFab"
import { computeNewRoundSlotHeightPx } from "../chat/newRoundSlotHeight"
import { NewRoundSlotShell } from "../chat/NewRoundSlotShell"
import { PinnedTaskCard } from "../chat/PinnedTaskCard"
import { TaskDetailDrawer } from "../chat/TaskDetailDrawer"
import { ChatMessageBubble } from "../chat/ChatMessageBubble"
import {
  CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME,
  CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME,
  CHAT_MESSAGE_ASSISTANT_AVATAR_SPACER_CLASSNAME,
  cnChatAssistantMessageRow,
} from "../chat/chatMessageLayout"
import { ChatSender } from "../chat/ChatSender"
import { OrganizationSwitcherCard, Organization } from "./OrganizationSwitcherCard"
import { ChatPromptButton } from "../chat/ChatPromptButton"
import { CreateOrgFormCard } from "./CreateOrgFormCard"
import { CreateOrgSuccessCard } from "./CreateOrgSuccessCard"
import { JoinOrgFormCard } from "./JoinOrgFormCard"
import { JoinOrgConfirmCard } from "./JoinOrgConfirmCard"
import {
  CreateInstitutionEducationSpaceCard,
  type CreateInstitutionEducationSpaceData,
} from "./CreateInstitutionEducationSpaceCard"
import {
  CreateFamilyEducationSpaceCard,
  type CreateFamilyEducationSpaceData,
} from "./CreateFamilyEducationSpaceCard"
import { OrganizationSwitcherButton } from "./OrganizationSwitcherButton"
import { SecondaryAppHistorySidebar, SecondaryAppSession } from "./SecondaryAppHistorySidebar"
import { NoEduSpaceCombinedSidebar } from "./NoEduSpaceCombinedSidebar"
import { AVAILABLE_MODEL_FAMILIES } from "./modelData"
import { resolveOperationSourceLabel } from "./operationSource"
import { OperationSourceNavContext } from "./operationSourceNavContext"
import { TaskChatMessageRow } from "./TaskChatMessageRow"
import { SCHEDULE_0422_ALL_LIST_MARKER } from "../../constants/schedule0422Markers"
import {
  SCHEDULE_0422_ORG_ID_MING_SHI,
  SCHEDULE_0422_ORG_ID_PERSONAL,
  schedule0422InitialItems,
  type Schedule0422Item,
} from "../schedule-0422/schedule0422Model"
import { Schedule0422AllListCard } from "../schedule-0422/Schedule0422AllListCard"
import { Schedule0422BottomQuickRow } from "../schedule-0422/Schedule0422BottomQuickRow"
import { Schedule0422BusinessDrawer } from "../schedule-0422/Schedule0422BusinessDrawer"
import {
  MAIL_MAILBOX_MARKER,
  MAIL_NEW_MAIL_DIGEST_MARKER,
  MAIL_SETTINGS_MARKER,
  MAIL_COMPOSE_ENTRY_MARKER,
  MAIL_READ_IN_CHAT_MARKER,
  MAIL_SIGNATURE_EDITOR_MARKER,
  MAIL_TENANT_PICK_FOR_ADMIN_MARKER,
  MAIL_MAIL_ADMIN_PANEL_MARKER,
  MAIL_DOCK_APPS,
  MAIL_DOCK_APPS_EMAIL0415,
  getDemoMailWelcomeGreeting,
  getDemoAnyUnreadMail,
  getDemoMyMailboxUnreadCount,
  getDemoBusinessUnreadTotal,
  type MailWelcomeActionKind,
  type MailSettingsPageId,
  type MailAdminPanelKind,
} from "./email/emailCuiData"
import { MailChatLayer } from "./email/MailChatLayer"
import type { MailDemoScenarioId } from "./MailDemoScenarioDropdown"
import { parseGenericCardPayloadJson } from "./chatCardPayloadSafety"
import {
  INVITE0421_NO_ORG_DOCK_APP_IDS_ORDERED,
  INVITE0421_PERSONAL_APP_IDS,
  INVITE0421_WORKBENCH_APP_IDS,
} from "../../constants/invite0421Workbench"
import {
  invite0421InvitedTodoEduTitle,
  invite0421InvitedTodoOrgTitle,
  INVITE0421_GENERIC_TODO_TITLE,
  INVITE0421_JOINED_ORG_DEMO_ID,
  INVITE0421_ORG_COMPANY_NAME,
  INVITE0421_EDU_STUDENT_EMPTY_SPACE_NAV,
  INVITE0421_EDU_STUDENT_EMPTY_WELCOME_GREETING,
  INVITE0421_MAIN_AI_PINNED_GREETING,
  INVITE0421_ORG_PROCESS_PG_INVITE_ACTION_LABEL,
  INVITE0421_EDU_PROCESS_XIAOCE_INVITE_ACTION_LABEL,
} from "../../constants/invite0421InvitedTodo"
import {
  Invite0421OrgEmployeeBasicInfoForm,
  Invite0421OrgEmployeeOnboardingIntroText,
  INVITE0421_ORG_EMPLOYEE_SUBMIT_SUCCESS_TEXT,
} from "../invite-0421/Invite0421OrgEmployeeOnboardingPanel"
import {
  INTERACTION_RULES_NATURAL_DIALOG_DEMO_BOT_REPLY,
  INTERACTION_RULES_NATURAL_DIALOG_DEMO_PROMPT,
} from "../../constants/interactionRulesNaturalDialogDemo"
import { INTERACTION_RULES_BUSINESS_CARD_COMMAND_DEMO_PROMPT } from "../../constants/interactionRulesBusinessCardCommandDemo"
import {
  INVITE0421_EDU_INVITE_FLOW_INITIAL,
  Invite0421EduStudentInviteFlowBody,
  type Invite0421EduInviteFlowState,
} from "../invite-0421/Invite0421EduStudentInviteFlowBody"
import { Invite0421MainAiDockWelcome } from "../invite-0421/Invite0421MainAiDockWelcome"
import type { VVAppShellShortcutId } from "../vv-app-shell/VVAppShell"
import {
  PERMISSION_EDIT_CARD_0424_MARKER,
  PERMISSION_EDIT_CARD_0424_DEFAULT_INPUT_PROMPT,
  PERMISSION_DETAIL_CARD_0424_MARKER_PREFIX,
  PERMISSION_EDIT_CARD_0424_USER_TRIGGER,
  type PermissionEditDetailPayload0424,
} from "../../constants/permissionEditCard0424"
import { PermissionEditCard0424, PermissionDetailCard0424 } from "./permission-edit-0424/PermissionEditCard0424"
import {
  ORGANIZATION_MANAGEMENT_0425_DEFAULT_INPUT_PROMPT,
  ORGANIZATION_MANAGEMENT_0425_MARKER,
  ORGANIZATION_MANAGEMENT_0425_USER_TRIGGER,
} from "../../constants/organizationManagement0425"
import { OrganizationManagementCard0425 } from "./organization-management-0425/OrganizationManagementCard0425"
import { OrganizationPermissionApplySection0425 } from "./organization-management-0425/OrganizationPermissionApplySection0425"
import {
  MainAiCardEducationSpaceSelectBar,
  MainAiCardOrgScopeSelectBar,
} from "./main-ai-card-scope/MainAiCardTitleScopeSwitcher"

import aiModelIcon from "../../assets/f165fadc65db69eb9ce3d5feeb2f6b4dc2638bd6.png";
import educationIcon from "../../assets/8449365f45bb140bf269f6769f74387249864ed8.png";
import calendarIcon from "../../assets/e653b0a7cada3ea08e52cb29bc4bd546be59d3d5.png";
import meetingIcon from "../../assets/88d3d6e7f0cac8b8bba0a46f8757585fe7cdaf9a.png";
import todoIcon from "../../assets/3598e566543c9c6ef7ab3cb268538a29b6bdb58d.png";
import diskIcon from "../../assets/78530a18370215c595d4c989d64c188f7450dbda.png";
import companyIcon from "../../assets/bc4adf9e89b5ade28461d7ae6da09053ea8bf0e1.png";
import profileIcon from "../../assets/a9b0f43698a9015397dc60f26d1ea217390fec97.png";
import organizationIcon from "../../assets/737725172f66f16b2662ff1ddc8ab69293de567f.png";
import employeeIcon from "../../assets/b07b1535d0d656029e5b3942f78ecf273f5852ee.png";
import recruitmentIcon from "../../assets/81759343e3c0735a95d3ee5a5e7cf7a767e83846.png";
import salaryIcon from "../../assets/776e838a4088fe446d0c5d29220b88ab1ad922bc.png";
import courseIcon from "../../assets/ac6e3391c1eb88804cbf0804668d449463a1e1a3.png";
import goodsIcon from "../../assets/d6c155d2820ba2910285fbcb066152b9efb7141c.png";
import membersIcon from "../../assets/ecb04190c46a6ecd790d2bc345d963ba9a4a8f0b.png";
import financeIcon from "../../assets/98e154a19d1590d43b04308d53726a30a29e972b.png";
import orgIcon from "../../assets/58a97c06b4ae6edfc613d20add2fb4ead0363c64.png";

import { Calculator, BookA, PenTool, Users, ArrowLeft, MoreHorizontal, Briefcase, ShoppingBag, DollarSign, GripHorizontal, ChevronDown, Boxes, Package, Upload, BadgeDollarSign, Clock, CalendarCheck, BarChart3, UserCog, Receipt, History, PieChart, BookOpen, ShoppingCart, GraduationCap, UserCheck, TrendingUp, TrendingDown, Landmark, FileSpreadsheet, PanelLeft, Square, X, AppWindow, Maximize2, ListTodo, List, UsersRound, UserPlus, Filter, Settings, Bell, Inbox, Send, User, PenLine, Building2, Search, Info, FileText, LayoutGrid } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence, useDragControls } from "motion/react"
import { usePopper } from "react-popper"
import { createPortal } from "react-dom"

// 统一的应用数据源 - 移自 appData.ts
export interface AppItem {
  id: string;
  name: string;
  icon: {
    gradient?: string;
    iconType?: string;
    imageSrc?: string;
  };
  order: number;
}

const DATA_VERSION = 20;

export const INITIAL_APPS: AppItem[] = [
  {
    id: 'education',
    name: '教育',
    icon: {
      imageSrc: educationIcon,
      iconType: 'education',
    },
    order: 2,
  },
  {
    id: 'task',
    name: '任务',
    icon: {
      imageSrc: todoIcon,
      iconType: 'task',
    },
    order: 3,
  },
  {
    id: 'schedule',
    name: '日程',
    icon: {
      imageSrc: calendarIcon,
      iconType: 'calendar',
    },
    order: 4,
  },
  {
    id: 'meeting',
    name: '会议',
    icon: {
      imageSrc: meetingIcon,
      iconType: 'meeting',
    },
    order: 5,
  },
  {
    id: 'todo',
    name: '待办',
    icon: {
      imageSrc: todoIcon,
      iconType: 'todo',
    },
    order: 6,
  },
  {
    id: 'disk',
    name: '微盘',
    icon: {
      imageSrc: diskIcon,
      iconType: 'disk',
    },
    order: 7,
  },
  {
    id: 'finance',
    name: '财务',
    icon: {
      imageSrc: salaryIcon,
      iconType: 'finance',
    },
    order: 9,
  },
  {
    id: 'salary',
    name: '薪酬',
    icon: {
      imageSrc: salaryIcon,
      iconType: 'salary',
    },
    order: 10,
  },
  {
    id: 'company',
    name: '公司',
    icon: {
      imageSrc: companyIcon,
      iconType: 'company',
    },
    order: 11,
  },
  {
    id: 'profile',
    name: '我的',
    icon: {
      imageSrc: profileIcon,
      iconType: 'profile',
    },
    order: 12,
  },
  {
    id: 'organization',
    name: '组织',
    icon: {
      imageSrc: organizationIcon,
      iconType: 'organization',
    },
    order: 13,
  },
  {
    id: 'employee',
    name: '员工',
    icon: {
      imageSrc: employeeIcon,
      iconType: 'employee',
    },
    order: 14,
  },
  {
    id: 'recruitment',
    name: '招聘',
    icon: {
      imageSrc: recruitmentIcon,
      iconType: 'recruitment',
    },
    order: 15,
  },
];

/** 仅「0413-邮箱-方案1」「0415-邮箱-在抽屉查看邮件内容」底栏插入，排在「任务」后；不入库默认 INITIAL_APPS，避免其它入口出现邮箱 */
const MAIL_APP_DOCK_ITEM: AppItem = {
  id: "mail",
  name: "邮箱",
  icon: {
    imageSrc: profileIcon,
    /** 仍用位图；`AppDockEntryIcon` 仅对 `docs` 等少数类型走矢量应用入口样式 */
    iconType: "mail",
  },
  order: 0,
};

/** 0421 无组织壳：文档 pill（与 `INITIAL_APPS` 分离，不入 localStorage 默认序列） */
const DOCS_APP_DOCK_ITEM: AppItem = {
  id: "docs",
  name: "文档",
  icon: {
    imageSrc: courseIcon,
    iconType: "docs",
  },
  order: 0,
};

function resolveDockAppItem(id: string, apps: AppItem[]): AppItem | undefined {
  if (id === "mail") return MAIL_APP_DOCK_ITEM
  if (id === "docs") return DOCS_APP_DOCK_ITEM
  return apps.find((a) => a.id === id) ?? INITIAL_APPS.find((a) => a.id === id)
}

/** 0421 无组织：主底栏与抽屉「已添加」共用此 7 项顺序 */
function buildInvite0421NoOrgDockApps(apps: AppItem[]): AppItem[] {
  return INVITE0421_NO_ORG_DOCK_APP_IDS_ORDERED.map((id) => resolveDockAppItem(id, apps)).filter(
    (x): x is AppItem => x != null,
  )
}

/** 从代码中的 INITIAL_APPS 合并图标 URL，避免 localStorage 中 imageSrc 丢失或旧版 figma 路径失效 */
function hydrateAppIcons(apps: AppItem[]): AppItem[] {
  const byId = new Map(INITIAL_APPS.map((a) => [a.id, a.icon.imageSrc]));
  return apps.map((app) => ({
    ...app,
    icon: {
      ...app.icon,
      imageSrc: byId.get(app.id) ?? app.icon.imageSrc,
    },
  }));
}

export function getAppsFromStorage(): AppItem[] {
  if (typeof window === 'undefined') return INITIAL_APPS;
  try {
    const stored = localStorage.getItem('main-ai-apps-order');
    const storedVersion = localStorage.getItem('main-ai-apps-version');
    if (stored && storedVersion === String(DATA_VERSION)) {
      return hydrateAppIcons(JSON.parse(stored) as AppItem[]);
    } else {
      localStorage.setItem('main-ai-apps-order', JSON.stringify(INITIAL_APPS));
      localStorage.setItem('main-ai-apps-version', String(DATA_VERSION));
      return INITIAL_APPS;
    }
  } catch (error) {
    console.error('Failed to load apps from storage:', error);
    return INITIAL_APPS;
  }
}

export function saveAppsToStorage(apps: AppItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('main-ai-apps-order', JSON.stringify(apps));
    localStorage.setItem('main-ai-apps-version', String(DATA_VERSION));
  } catch (error) {
    console.error('Failed to save apps to storage:', error);
  }
}

interface MainAIChatWindowProps {
  conversation: Conversation
  onToggleHistory: () => void
  historyOpen?: boolean
  onHistoryOpenChange?: (open: boolean) => void
  conversations?: Conversation[]
  selectedId?: string
  onSelect?: (id: string) => void
  /** 自首页「0412-任务-方案1」进入时默认打开任务应用；「0413-邮箱-方案1」等可默认打开邮箱 */
  initialActiveApp?: "education" | "task" | "mail" | null
  /** 任务入口方案（见首页「0413-任务-方案2」「0413-邮箱-方案1」）；默认 `default`，与原版行为一致 */
  taskEntryVariant?:
    | "default"
    | "plan2"
    | "task0417InlineEdit"
    | "task0417CardEdit"
    | "task0419SidebarExplore"
    | "email0413"
    | "email0415"
    | "email0417"
  /** 仅邮箱方案页：演示用初始场景，驱动邮箱会话种子数据 */
  mailDemoScenarioId?: MailDemoScenarioId
  /** 仅 `task0419SidebarExplore`：把当前会话消息同步回父级侧栏列表，并更新 `sessionTitle` */
  on0419SessionCommit?: (sessionId: string, payload: { messages: Message[] }) => void
  /** 仅 `task0419SidebarExplore`：用户点侧栏「新对话」时由父级插入新会话并选中 */
  on0419NewSession?: () => void
  /** 空态场景：用户没有组织/教育空间；教育应用顶栏改为「创建教育空间」，欢迎态显示创建引导 */
  hasEducationSpace?: boolean
  /** 侧栏形态：`default`（主 AI + 二级应用两栏切换）；`combinedNoEduSpace`（主 AI 历史 + 应用使用合并栏） */
  sidebarVariant?: "default" | "combinedNoEduSpace"
  /** 右上角「独立窗口」图标始终可见（无 `activeApp` 时也显示，无行为时走占位 toast） */
  alwaysShowIndependentWindow?: boolean
  /** 主 AI 是否有已加入的组织；`false` 时顶栏中间为「创建或加入企业/组织」 */
  hasOrganization?: boolean
  /** 教育空间演示数据：`familyOnly0421` 仅两个家庭教育空间；`eduStudentInvite0421` 学生受邀（可与 `hasEducationSpace={false}` 组合：先无空间，流程结束后写入张小宝教育空间） */
  educationSpacePreset?: "default" | "familyOnly0421" | "eduStudentInvite0421"
  /**
   * 0421-有组织无教育空间-2：无教育空间时教育底栏仍展示机构快捷入口的前 3 个一级按钮；
   * 点选子菜单时先提示创建空间，再次点选仅顶部胶囊气泡「请先创建教育空间」（无蒙层，3s）。
   */
  educationNoSpaceDockTeaser?: boolean
  /** 0421-无组织有教育空间：简化创建/加入组织演示（仅名称）及工作台门闩应用集合 */
  simpleOrgOnboarding0421?: boolean
  /** 0421 演示：简化流程完成建立组织后，由页面提升为「有组织」 */
  on0421EstablishOrganization?: () => void
  /** 0421-有组织无教育空间：顶栏右侧图标策略（主 AI 双按钮 / 业务态仅独立窗口） */
  noEduSpace0421ChatToolbar?: boolean
  /** 0421-新用户-受邀加入组织：主 AI 底栏仅教育；门闩文案与侧栏「未添加」联动 */
  invite0421NewUserFlow?: boolean
  /** 侧栏「更多 → 未添加」点击后由父级传入，消费后回调清空 */
  invite0421ShellGateRequest?: { id: VVAppShellShortcutId; nonce: number } | null
  onInvite0421ShellGateRequestConsumed?: () => void
  /** 侧栏点「教育」时递增，用于在无组织模式下打开教育子应用 */
  invite0421OpenEducationNonce?: number
  /** 0421-新用户-受邀加入教育空间-学生：与 `invite0421NewUserFlow` 共用无组织底栏逻辑 */
  invite0421EduStudentFlow?: boolean
  /** 学生邀请流程完成：写入「张小宝家庭教育」并可选自动进入教育应用 */
  invite0421EduStudentFamilyReady?: boolean
  /** 与 IM 抽屉共享：0421 学生教育邀请多步状态 */
  invite0421EduInviteFlow?: Invite0421EduInviteFlowState
  onInvite0421EduInviteFlowPatch?: (p: Partial<Invite0421EduInviteFlowState>) => void
  /** 主 AI 内完成「进入教育空间」后由父级触发（与 `invite0421EduStudentFamilyReady` 同源） */
  onInvite0421EduStudentFlowComplete?: () => void
  /** 0421：是否在演示顶栏展示「演示：审批通过」（由 `MainAI` 渲染，随 `activeApp` 等同步） */
  onInvite0421DemoApprovalInDemoNavVisibleChange?: (visible: boolean) => void
  /** 0422-日程-抽屉演示：保留主壳与对话区，仅注入日程列表卡 + 业务入口样式抽屉 */
  schedule0422DrawerDemo?: boolean
  /**
   * 交互规范文档页：递增时在主 AI 输入框预填自然语言演示句，并在用户下一次主 AI 发送（非结构化指令）后追加一条演示用文本回复。
   */
  interactionRulesNaturalDialogDemoNonce?: number
  /**
   * 交互规范文档页：递增时在主 AI 输入框预填「业务指令」演示句；用户下一次主 AI 发送后追加一条交互式通用卡片（演示）。
   */
  interactionRulesBusinessCardDemoNonce?: number
  /**
   * 交互规范文档「3.2」：递增时在主 AI 插入 0425 组织管理卡；默认在卡片内标题下展示组织切换（方案1），可通过行动建议切换为卡外左对齐切换条（方案2）。
   */
  interactionRulesMainAiOrgDemoNonce?: number
  /** 「交互规范文档 - 持续更新中」页：为 true 时启用文档页专用新一轮槽位高度策略（见 `armNewRoundForUserSend`） */
  demoInstructionShell?: boolean
  /** 0424-权限编辑卡片方案：主 AI 输入含触发词后出现权限编辑 CUI 卡片（演示） */
  permissionEditCard0424Demo?: boolean
  /** 0425-案例-组织管理+权限申请：主 AI / 组织应用输入含触发词后出现组织管理 CUI 卡片（演示） */
  organizationManagement0425Demo?: boolean
  /** 0425 页面右上角指令集：递增时将组织管理指令填入当前输入框 */
  organizationManagement0425CommandNonce?: number
}

function taskEntryIsMailDockFamily(
  v: MainAIChatWindowProps["taskEntryVariant"]
): boolean {
  return v === "email0413" || v === "email0415" || v === "email0417";
}

function taskEntryIsEmail0415ScopeFamily(
  v: MainAIChatWindowProps["taskEntryVariant"]
): boolean {
  return v === "email0415" || v === "email0417";
}

const PERSONAL_INFO_MARKER = "<<<RENDER_PERSONAL_INFO>>>"
const CREATE_EMAIL_MARKER = "<<<RENDER_CREATE_EMAIL_FORM>>>"
const CONTINUE_EMAIL_MARKER = "<<<RENDER_CONTINUE_EMAIL_FORM>>>"
const ORG_SWITCHER_MARKER = "<<<RENDER_ORG_SWITCHER>>>"
const CREATE_ORG_FORM_MARKER = "<<<RENDER_CREATE_ORG_FORM>>>"
const CREATE_ORG_SUCCESS_MARKER = "<<<RENDER_CREATE_ORG_SUCCESS>>>"
const JOIN_ORG_FORM_MARKER = "<<<RENDER_JOIN_ORG_FORM>>>"
const JOIN_ORG_CONFIRM_MARKER = "<<<RENDER_JOIN_ORG_CONFIRM>>>"
const ORG_EMPLOYEE_PERMISSION_GUIDE_0425_MARKER = "<<<RENDER_ORG_EMPLOYEE_PERMISSION_GUIDE_0425>>>"
const ORG_SETTINGS_PERMISSION_0425_MARKER = "<<<RENDER_ORG_SETTINGS_PERMISSION_0425>>>"
/** 创建机构教育空间表单 */
const CREATE_INSTITUTION_EDU_SPACE_MARKER = "<<<RENDER_CREATE_INSTITUTION_EDU_SPACE_FORM>>>"
/** 创建家庭教育空间流程（身份选择 + 表单一体卡） */
const CREATE_FAMILY_EDU_SPACE_MARKER = "<<<RENDER_CREATE_FAMILY_EDU_SPACE_FORM>>>"
/** 创建教育空间完成提示（与 CREATE_INSTITUTION/FAMILY 共用） */
const CREATE_EDU_SPACE_SUCCESS_MARKER = "<<<RENDER_CREATE_EDU_SPACE_SUCCESS>>>"
const TASK_TABLE_MARKER = "<<<RENDER_TASK_TABLE>>>"
const CREATE_TASK_FORM_MARKER = "<<<RENDER_CREATE_TASK_FORM>>>"
const TASK_DRAFTS_TABLE_MARKER = "<<<RENDER_TASK_DRAFTS_TABLE>>>"
const TASK_DETAIL_MARKER = "<<<RENDER_TASK_DETAIL_CARD>>>"
const TASK_FILTER_MARKER = "<<<RENDER_TASK_FILTER_CARD>>>"
const TASK_SETTINGS_MARKER = "<<<RENDER_TASK_SETTINGS_CARD>>>"
const EDIT_TASK_FORM_MARKER = "<<<RENDER_EDIT_TASK_FORM>>>"
/** 编辑提交后：同一条助手消息内「短反馈气泡 + 任务详情卡」，单头像、同组 6px、不写 operationSource（0417 新卡片编辑等） */
const TASK_EDIT_FEEDBACK_DETAIL_MARKER = "<<<RENDER_TASK_EDIT_FEEDBACK_DETAIL>>>"
const SUBTASK_FORM_MARKER = "<<<RENDER_SUBTASK_FORM>>>"
const HANDOVER_CARD_MARKER = "<<<RENDER_HANDOVER_TASK_CARD>>>"
const LINK_SUBTASK_CARD_MARKER = "<<<RENDER_LINK_SUBTASK_CARD>>>"
const EVAL_RECORDS_CARD_MARKER = "<<<RENDER_TASK_EVAL_RECORDS_CARD>>>"
const EXECUTION_CONTENT_FORM_MARKER = "<<<RENDER_EXECUTION_CONTENT_FORM>>>"
const NEW_OUTPUT_FORM_MARKER = "<<<RENDER_NEW_OUTPUT_FORM>>>"
const TASK_HUB_CARD_MARKER = "<<<RENDER_TASK_HUB_SESSION_CARD>>>"
const EXECUTION_DIVISION_LIST_MARKER = "<<<RENDER_EXECUTION_DIVISION_LIST_CARD>>>"
const KANBAN_SCOPE_LIST_MARKER = "<<<RENDER_KANBAN_SCOPE_LIST_CARD>>>"
const EXECUTION_CONTENT_DETAIL_MARKER = "<<<RENDER_EXECUTION_CONTENT_DETAIL_CARD>>>"
/** 无组织时点击工作台应用：主会话插入引导气泡（创建/加入组织后再进入子应用） */
const WORKBENCH_ORG_GATE_PROMPT_MARKER = "<<<WORKBENCH_ORG_GATE_PROMPT>>>"
/** 0421-无组织有教育空间：顶栏/门闩引导下的极简「创建组织」（仅名称） */
const SIMPLE_CREATE_ORG_0421_MARKER = "<<<SIMPLE_CREATE_ORG_0421>>>"
/** 0421：极简「加入组织」（仅名称；名称匹配已有组织则切换，否则演示为新建） */
const SIMPLE_JOIN_ORG_0421_MARKER = "<<<SIMPLE_JOIN_ORG_0421>>>"
/** 0421 受邀加入组织：与 IM 员工邀请抽屉一致的基本信息 onboarding */
const INVITE0421_ORG_EMPLOYEE_ONBOARD_MARKER = "<<<INVITE0421_ORG_EMPLOYEE_ONBOARD>>>"
/** 0421 受邀加入教育空间（学生）：与 IM 抽屉一致的多步邀请流 */
const INVITE0421_EDU_STUDENT_INVITE_FLOW_MARKER = "<<<INVITE0421_EDU_STUDENT_INVITE_FLOW>>>"

/** 0421 演示：依赖企业/组织后才可进入的一级工作台应用（与 invite0421Workbench 常量同源） */
const WORKBENCH_APP_IDS_REQUIRING_ORG_0421 = INVITE0421_WORKBENCH_APP_IDS

const INVITE0421_SHELL_SHORTCUT_LABEL: Partial<Record<VVAppShellShortcutId, string>> = {
  todo: "待办",
  education: "教育",
  calendar: "日程",
  docs: "文档",
  phone: "电话",
  tasks: "任务",
  project: "项目",
  goal: "目标",
  more: "更多应用",
}

function SimpleOrg0421NameCard({
  mode,
  onSubmit,
}: {
  mode: "create" | "join";
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = React.useState("");
  const [done, setDone] = React.useState(false);
  const defaultName = mode === "create" ? "我的企业" : "协同组织";
  if (done) {
    return (
      <p className="text-text-secondary text-[length:var(--font-size-sm)] leading-normal">已完成操作。</p>
    );
  }
  return (
    <div className="bg-bg border border-border rounded-[var(--radius-card)] p-[var(--space-400)] shadow-xs w-full md:max-w-[420px]">
      <p className="text-text font-[var(--font-weight-medium)] text-[length:var(--font-size-base)] leading-normal mb-[var(--space-300)]">
        {mode === "create" ? "创建企业/组织" : "加入企业/组织"}
      </p>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="请输入组织名称"
        className="mb-[var(--space-300)] w-full bg-bg-secondary border-border"
      />
      <Button
        type="button"
        variant="chat-submit"
        className="w-full sm:w-auto"
        onClick={() => {
          const v = name.trim() || defaultName;
          onSubmit(v);
          setDone(true);
        }}
      >
        {mode === "create" ? "创建" : "加入"}
      </Button>
    </div>
  );
}

/** 0421 主 AI：员工邀请 onboarding（与 IM 抽屉文案与表单一致） */
function Invite0421OrgEmployeeOnboardInChat({
  onBasicInfoSubmitted,
  assistantAvatarSrc,
  hideAvatar,
  basicInfoTitleBelowAccessory,
}: {
  /** 用户点击「确定」后：仅冻结表单并展示成功气泡；不切换有组织壳层（演示入组见顶栏按钮） */
  onBasicInfoSubmitted?: () => void;
  assistantAvatarSrc: string;
  hideAvatar: boolean;
  basicInfoTitleBelowAccessory?: React.ReactNode;
}) {
  const [frozen, setFrozen] = React.useState(false);
  return (
    <>
      <div className={cnChatAssistantMessageRow({ mergedWithPrevious: !!hideAvatar })}>
        {!hideAvatar ? (
          <Avatar className={CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME}>
            <AvatarImage src={assistantAvatarSrc} alt="" className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME} />
          </Avatar>
        ) : (
          <div className={CHAT_MESSAGE_ASSISTANT_AVATAR_SPACER_CLASSNAME} />
        )}
        <div className="flex w-full min-w-0 flex-col gap-[length:var(--space-200)]">
          <AssistantChatBubble>{Invite0421OrgEmployeeOnboardingIntroText()}</AssistantChatBubble>
          <Invite0421OrgEmployeeBasicInfoForm
            frozen={frozen}
            titleBelowAccessory={basicInfoTitleBelowAccessory}
            onSubmit={() => {
              setFrozen(true);
              onBasicInfoSubmitted?.();
            }}
          />
        </div>
      </div>
      {frozen ? (
        <div
          className={cn(
            cnChatAssistantMessageRow({ mergedWithPrevious: false }),
            "mt-[length:var(--space-600)]",
          )}
        >
          <Avatar className={CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME}>
            <AvatarImage src={assistantAvatarSrc} alt="" className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME} />
          </Avatar>
          <div className="min-w-0 w-full">
            <AssistantChatBubble>{INVITE0421_ORG_EMPLOYEE_SUBMIT_SUCCESS_TEXT}</AssistantChatBubble>
          </div>
        </div>
      ) : null}
    </>
  );
}

/** 是否为会话流中的「卡片类」消息（与 renderMessageList 中 isSpecialComponent 一致，用于滚动锚点） */
function messageContentIsInChatSurfaceCard(content: string): boolean {
  return (
    content === PERSONAL_INFO_MARKER ||
    content === CREATE_EMAIL_MARKER ||
    content === CONTINUE_EMAIL_MARKER ||
    content.startsWith("<<<RENDER_GENERIC_CARD>>>:") ||
    content === ORG_SWITCHER_MARKER ||
    content === CREATE_ORG_FORM_MARKER ||
    content.startsWith(`${CREATE_ORG_SUCCESS_MARKER}:`) ||
    content === JOIN_ORG_FORM_MARKER ||
    content.startsWith(`${JOIN_ORG_CONFIRM_MARKER}:`) ||
    content.startsWith(`${WORKBENCH_ORG_GATE_PROMPT_MARKER}:`) ||
    content === SIMPLE_CREATE_ORG_0421_MARKER ||
    content === SIMPLE_JOIN_ORG_0421_MARKER ||
    content === INVITE0421_ORG_EMPLOYEE_ONBOARD_MARKER ||
    content === INVITE0421_EDU_STUDENT_INVITE_FLOW_MARKER ||
    content === CREATE_INSTITUTION_EDU_SPACE_MARKER ||
    content === CREATE_FAMILY_EDU_SPACE_MARKER ||
    content.startsWith(`${CREATE_EDU_SPACE_SUCCESS_MARKER}:`) ||
    content.startsWith(TASK_TABLE_MARKER) ||
    content === CREATE_TASK_FORM_MARKER ||
    content.startsWith(`${CREATE_TASK_FORM_MARKER}:`) ||
    content === TASK_DRAFTS_TABLE_MARKER ||
    content.startsWith(TASK_DETAIL_MARKER) ||
    content === TASK_FILTER_MARKER ||
    content === TASK_SETTINGS_MARKER ||
    content.startsWith(EDIT_TASK_FORM_MARKER) ||
    content.startsWith(TASK_EDIT_FEEDBACK_DETAIL_MARKER) ||
    content.startsWith(SUBTASK_FORM_MARKER) ||
    content.startsWith(HANDOVER_CARD_MARKER) ||
    content.startsWith(LINK_SUBTASK_CARD_MARKER) ||
    content.startsWith(EVAL_RECORDS_CARD_MARKER) ||
    content.startsWith(EXECUTION_CONTENT_FORM_MARKER) ||
    content.startsWith(NEW_OUTPUT_FORM_MARKER) ||
    content.startsWith(TASK_HUB_CARD_MARKER) ||
    content.startsWith(EXECUTION_DIVISION_LIST_MARKER) ||
    content.startsWith(KANBAN_SCOPE_LIST_MARKER) ||
    content.startsWith(EXECUTION_CONTENT_DETAIL_MARKER) ||
    content.startsWith(MAIL_MAILBOX_MARKER) ||
    content.startsWith(MAIL_NEW_MAIL_DIGEST_MARKER) ||
    content.startsWith(MAIL_SETTINGS_MARKER) ||
    content.startsWith(MAIL_COMPOSE_ENTRY_MARKER) ||
    content.startsWith(MAIL_READ_IN_CHAT_MARKER) ||
    content.startsWith(MAIL_SIGNATURE_EDITOR_MARKER) ||
    content.startsWith(MAIL_TENANT_PICK_FOR_ADMIN_MARKER) ||
    content.startsWith(MAIL_MAIL_ADMIN_PANEL_MARKER) ||
    content === PERMISSION_EDIT_CARD_0424_MARKER ||
    content.startsWith(PERMISSION_DETAIL_CARD_0424_MARKER_PREFIX) ||
    content === ORGANIZATION_MANAGEMENT_0425_MARKER
  );
}

/** 点击「操作来源」回到原消息：滚动过渡固定时长 */
const OPERATION_SOURCE_SCROLL_DURATION_MS = 300;
/** 槽位两阶段滚动、卡片顶对齐等主对话区滚动动画时长 */
const CHAT_SCROLL_ALIGN_DURATION_MS = 300;

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

function animateContainerScrollTop(
  container: HTMLElement,
  targetScrollTop: number,
  durationMs: number,
  rafIdRef: React.MutableRefObject<number | null>,
  onDone?: () => void
) {
  if (rafIdRef.current !== null) {
    cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = null;
  }
  const maxTop = Math.max(0, container.scrollHeight - container.clientHeight);
  const target = Math.max(0, Math.min(targetScrollTop, maxTop));
  const start = container.scrollTop;
  const dist = target - start;
  if (Math.abs(dist) < 0.5) {
    onDone?.();
    return;
  }
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reducedMotion) {
    container.scrollTop = target;
    onDone?.();
    return;
  }
  const t0 = performance.now();
  const tick = (now: number) => {
    const u = Math.min(1, (now - t0) / durationMs);
    const eased = easeInOutQuad(u);
    container.scrollTop = start + dist * eased;
    if (u >= 1) {
      rafIdRef.current = null;
      onDone?.();
    } else {
      rafIdRef.current = requestAnimationFrame(tick);
    }
  };
  rafIdRef.current = requestAnimationFrame(tick);
}

function computeScrollTopToAlignElementTopBelowPin(
  container: HTMLElement,
  el: HTMLElement,
  pinEl: HTMLElement | null
): number {
  const usePin = pinEl != null && container.contains(pinEl);
  const anchorTop = usePin ? pinEl.getBoundingClientRect().bottom : container.getBoundingClientRect().top;
  const elRect = el.getBoundingClientRect();
  const raw = container.scrollTop + (elRect.top - anchorTop);
  const maxTop = Math.max(0, container.scrollHeight - container.clientHeight);
  return Math.max(0, Math.min(raw, maxTop));
}

/** 从消息行 DOM 读取 `renderMessageList` 写入的序号（用于同一轮内抑制二次自动滚动） */
function readMessageOrdinalFromRowEl(el: HTMLElement): number {
  let cur: HTMLElement | null = el;
  for (let depth = 0; depth < 14 && cur; depth++) {
    const v = cur.getAttribute("data-message-ordinal");
    if (v != null && v !== "") {
      const n = parseInt(v, 10);
      if (!Number.isNaN(n)) return n;
    }
    cur = cur.parentElement;
  }
  return -1;
}

// Command keywords
const PERSONAL_INFO_COMMANDS = [
  "管理个人信息",
  "manage personal information",
  "个人信息",
  "personal info",
  "个人信息管理"
]

const CREATE_EMAIL_COMMANDS = [
  "创建业务邮箱",
  "create business email",
  "业务邮箱",
  "邮箱",
  "business email"
]

const CREATE_ORG_COMMANDS = [
  "创建组织",
  "创建企业",
  "create organization",
  "创建企业/组织"
]

const JOIN_ORG_COMMANDS = [
  "加入组织",
  "加入企业",
  "join organization",
  "加入企业/组织"
]

const SWITCH_ORG_COMMANDS = [
  "切换组织",
  "切换企业",
  "switch organization",
  "组织切换"
]

const EMPLOYEE_PERMISSION_APPLY_COMMANDS_0425 = [
  "员工管理",
  "添加员工",
  "编辑员工",
  "员工权限",
  "申请权限",
];
const ORG_SETTINGS_COMMANDS_0425 = ["组织设置", "组织应用设置", "组织配置"];

// 可用模型列表
const AVAILABLE_MODELS = [
  {
    id: 'gpt-4',
    name: 'ChatGPT',
    description: '最强大的通用AI模型'
  },
  {
    id: 'gpt-3.5',
    name: 'GPT-3.5',
    description: '快速响应的轻量级模型'
  },
  {
    id: 'claude-3',
    name: 'Claude 3',
    description: 'Anthropic的先进AI助���'
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'Google的多模态AI模型'
  }
]

// 可用组织列表
const AVAILABLE_ORGANIZATIONS: Organization[] = [
  {
    id: 'xiaoce',
    name: '小测教育机构',
    icon: orgIcon,
    memberCount: 156,
    description: '专注K12在线教育的领先机构'
  },
  {
    id: 'default',
    name: '默认组织',
    icon: orgIcon,
    memberCount: 42,
    description: '系统默认组织'
  },
  {
    id: 'test',
    name: '测试机构',
    icon: orgIcon,
    memberCount: 8,
    description: '用于测试和演示的组织'
  }
];

/** 教育应用-教育空间树：租户（不可选，可展开）→ 机构教育空间（可选），另含「家庭空间」1 级叶子 */
const INITIAL_EDUCATION_SPACE_NODES: EducationSpaceNode[] = [
  {
    id: 'tenant-coffee',
    name: 'COFFEE 咖啡国际',
    kind: 'tenant' as const,
    icon: orgIcon,
    children: [
      { id: 'edu-coffee-main', name: '咖啡国际总部', kind: 'institution' as const },
    ],
  },
  {
    id: 'tenant-vvai',
    name: 'VVAI教育集团',
    kind: 'tenant' as const,
    icon: orgIcon,
    children: [
      { id: 'edu-vvai-hq', name: '大聪明培训学校', kind: 'institution' as const },
      { id: 'edu-vvai-train', name: '大聪明培训', kind: 'institution' as const },
      { id: 'edu-vvai-branch', name: '大聪明培训学校（分校）', kind: 'institution' as const },
      { id: 'edu-vvai-head', name: '123头部名称', kind: 'institution' as const },
      { id: 'edu-vvai-hightec', name: 'Hightec中心', kind: 'institution' as const },
    ],
  },
  {
    id: 'tenant-palogino',
    name: 'PaloGino环球科技集团',
    kind: 'tenant' as const,
    icon: orgIcon,
    children: [
      { id: 'edu-palogino-hq', name: 'PaloGino总部', kind: 'institution' as const },
    ],
  },
  {
    id: 'tenant-xiaoce',
    name: '「测试」小测集团',
    kind: 'tenant' as const,
    icon: orgIcon,
    children: [
      { id: 'edu-xiaoce-hq', name: '总部教学空间', kind: 'institution' as const },
      { id: 'edu-xiaoce-branch-sh', name: '上海分校', kind: 'institution' as const },
      { id: 'edu-xiaoce-branch-bj', name: '北京分校', kind: 'institution' as const },
    ],
  },
  {
    id: 'tenant-vv',
    name: 'VV教育测试集团（组织全称）',
    kind: 'tenant' as const,
    icon: orgIcon,
    children: [
      { id: 'edu-vv-main', name: 'VV主空间', kind: 'institution' as const },
    ],
  },
  {
    id: 'tenant-malay',
    name: '马来西亚的教育租户',
    kind: 'tenant' as const,
    icon: orgIcon,
    children: [
      { id: 'edu-malay-main', name: '马来西亚主校区', kind: 'institution' as const },
    ],
  },
  {
    id: 'space-family-1111',
    name: '1111',
    kind: 'family' as const,
  },
  {
    id: 'space-family-baby',
    name: '小宝宝快乐成长',
    kind: 'family' as const,
  },
];

/** 0421-无组织有教育空间：教育应用仅展示两个家庭教育空间（默认选中张大宝） */
const INITIAL_EDUCATION_SPACE_FAMILY_ONLY_0421: EducationSpaceNode[] = [
  { id: "edu-family-dabao", name: "张大宝家庭教育", kind: "family" as const },
  { id: "edu-family-xiaobao", name: "张小宝家庭教育", kind: "family" as const },
];

/**
 * 0421-受邀加入教育空间（学生）：仅当 `hasEducationSpace === true` 时作为初始演示数据（张大宝）。
 * 推荐页面传 `hasEducationSpace={false}`，教育 AI 先走无空间欢迎态；流程内「确认创建」后即写入张小宝家庭节点，点「进入张小宝教育空间」再 tryEnter + 通知父级 familyReady（IM 同步）。
 */
const INITIAL_EDUCATION_SPACE_EDU_STUDENT_INVITE_0421: EducationSpaceNode[] = [
  { id: "edu-family-dabao", name: "张大宝家庭教育", kind: "family" as const },
];

const EDU_STUDENT_ZHANG_FAMILY_SPACE_ID = "edu-family-zhangxiaobao-0421";

/** 主会话消息桶：无组织演示态使用固定 key，避免与真实组织 id 冲突 */
const NO_ORG_MESSAGE_SCOPE = "__no_org__";

function initialEducationSpaceNodesForPreset(
  hasEducationSpace: boolean,
  preset: "default" | "familyOnly0421" | "eduStudentInvite0421",
): EducationSpaceNode[] {
  if (!hasEducationSpace) return [];
  if (preset === "familyOnly0421") return INITIAL_EDUCATION_SPACE_FAMILY_ONLY_0421;
  if (preset === "eduStudentInvite0421") return INITIAL_EDUCATION_SPACE_EDU_STUDENT_INVITE_0421;
  return INITIAL_EDUCATION_SPACE_NODES;
}

function initialEducationSpaceIdForPreset(
  hasEducationSpace: boolean,
  preset: "default" | "familyOnly0421" | "eduStudentInvite0421",
): string {
  if (!hasEducationSpace) return "";
  if (preset === "familyOnly0421" || preset === "eduStudentInvite0421") return "edu-family-dabao";
  return "edu-xiaoce-hq";
}

const EDUCATION_APPS = [
  { 
    id: 'course', 
    name: '课程管理', 
    imageSrc: courseIcon, 
    menu: [
      { id: 'fulfillment', name: '课程履约', iconKey: 'fulfillment' },
      { id: 'schedule', name: '课程课表', iconKey: 'schedule' },
      { id: 'order', name: '订单排课', iconKey: 'order' }
    ] 
  },
  { 
    id: 'goods', 
    name: '商品管理', 
    imageSrc: goodsIcon, 
    menu: [
      { id: 'course_goods', name: '商品课程', iconKey: 'course_goods' },
      { id: 'material_goods', name: '物料商品', iconKey: 'material_goods' },
      { id: 'order_goods', name: '订单管理', iconKey: 'order_goods' }
    ] 
  },
  { 
    id: 'members', 
    name: '成员管理', 
    imageSrc: membersIcon, 
    menu: [
      { id: 'student_mgmt', name: '学生管理', iconKey: 'student_mgmt' },
      { id: 'teacher_mgmt', name: '老师管理', iconKey: 'teacher_mgmt' }
    ] 
  },
  { 
    id: 'finance', 
    name: '财务管理', 
    imageSrc: financeIcon, 
    menu: [
      { id: 'income_mgmt', name: '收入管理', iconKey: 'income_mgmt' },
      { id: 'expense_mgmt', name: '支出管理', iconKey: 'expense_mgmt' },
      { id: 'account_mgmt', name: '账号管理', iconKey: 'account_mgmt' },
      { id: 'financial_report', name: '财务报表', iconKey: 'financial_report' }
    ] 
  },
]

/**
 * 家庭教育空间-底部快捷入口：
 * - 课程管理：课程履约 / 全部课程
 * - 商品管理：我的订单 / 购物车
 * - 成员管理：无二级菜单（directClick）
 * - 奖励管理：无二级菜单（directClick）
 */
const FAMILY_EDUCATION_APPS = [
  {
    id: 'family_course',
    name: '课程管理',
    imageSrc: courseIcon,
    menu: [
      { id: 'fulfillment', name: '课程履约', iconKey: 'fulfillment' },
      { id: 'course_all', name: '全部课程', iconKey: 'course_all' },
    ],
  },
  {
    id: 'family_goods',
    name: '商品管理',
    imageSrc: goodsIcon,
    menu: [
      { id: 'my_orders', name: '我的订单', iconKey: 'my_orders' },
      { id: 'cart', name: '购物车', iconKey: 'cart' },
    ],
  },
  {
    id: 'family_members',
    name: '成员管理',
    imageSrc: membersIcon,
    menu: [],
    directClick: true,
  },
  {
    id: 'family_reward',
    name: '奖励管理',
    imageSrc: financeIcon,
    menu: [],
    directClick: true,
  },
]

function EducationMenuIcon({ iconKey }: { iconKey: string }) {
  if (iconKey === 'fulfillment') {
    return (
      <svg width="12" height="13" viewBox="0 0 12 13.3333" fill="none">
        <path d={svgPathsFromCourse.p2e8d5300} fill="currentColor" />
        <path d={svgPathsFromCourse.p320a2a00} fill="currentColor" />
        <path d={svgPathsFromCourse.p18316300} fill="currentColor" />
      </svg>
    );
  }
  if (iconKey === 'schedule') {
    return (
      <svg width="12" height="13" viewBox="0 0 11.6667 12.3333" fill="none">
        <path d={svgPathsFromCourse.p3a2c0c80} fill="currentColor" />
      </svg>
    );
  }
  if (iconKey === 'order') {
    return (
      <svg width="13" height="14" viewBox="0 0 12.6948 13.6667" fill="none">
        <path d={svgPathsFromCourse.p13fad580} fill="currentColor" />
        <path d={svgPathsFromCourse.p4d78200} fill="currentColor" />
        <path d={svgPathsFromCourse.p28d9a200} fill="currentColor" />
      </svg>
    );
  }
  
  const iconSize = 14;
  switch (iconKey) {
    case 'course_goods': return <BookOpen size={iconSize} />;
    case 'material_goods': return <Package size={iconSize} />;
    case 'order_goods': return <ShoppingCart size={iconSize} />;
    /** 家庭教育空间-子菜单图标 */
    case 'course_all': return <BookOpen size={iconSize} />;
    case 'my_orders': return <Receipt size={iconSize} />;
    case 'cart': return <ShoppingBag size={iconSize} />;
    case 'student_mgmt': return <GraduationCap size={iconSize} />;
    case 'teacher_mgmt': return <UserCheck size={iconSize} />;
    case 'income_mgmt': return <TrendingUp size={iconSize} />;
    case 'expense_mgmt': return <TrendingDown size={iconSize} />;
    case 'account_mgmt': return <Landmark size={iconSize} />;
    case 'financial_report': return <FileSpreadsheet size={iconSize} />;
    case 'task_all': return <List size={iconSize} />;
    case 'task_overdue': return <Clock size={iconSize} />;
    case 'task_executed': return <UserCheck size={iconSize} />;
    case 'task_recent_done': return <CalendarCheck size={iconSize} />;
    case 'task_my_exec': return <UserCheck size={iconSize} />;
    case 'task_my_owner': return <Briefcase size={iconSize} />;
    case 'task_my_part': return <Users size={iconSize} />;
    case 'task_my_follow': return <ListTodo size={iconSize} />;
    case 'task_mine_subs': return <UsersRound size={iconSize} />;
    case 'task_new': return <ListTodo size={iconSize} />;
    case 'task_drafts': return <FileSpreadsheet size={iconSize} />;
    case 'task_filter': return <Filter size={iconSize} />;
    case 'task_settings': return <Settings size={iconSize} />;
    case 'task_notify': return <Bell size={iconSize} />;
    case 'mail_inbox': return <Inbox size={iconSize} />;
    case 'mail_user': return <User size={iconSize} />;
    case 'mail_sent': return <Send size={iconSize} />;
    case 'mail_edit': return <PenLine size={iconSize} />;
    case 'mail_draft': return <FileSpreadsheet size={iconSize} />;
    case 'mail_building': return <Building2 size={iconSize} />;
    case 'mail_search': return <Search size={iconSize} />;
    case 'mail_settings_accounts': return <Settings size={iconSize} />;
    case 'mail_settings_signature': return <PenLine size={iconSize} />;
    case 'mail_settings_sender': return <User size={iconSize} />;
    case 'mail_admin_business': return <Building2 size={iconSize} />;
    case 'mail_admin_staff': return <UsersRound size={iconSize} />;
    default: return null;
  }
}

type SecondaryAppButtonApp = {
  id: string;
  name: string;
  imageSrc: string;
  /** 组织应用等需要用浅底深色前景的应用内图标时传入；未传入时沿用图片图标 */
  iconNode?: React.ReactNode;
  /**
   * 应用内子入口（主 AI / 应用 AI 底栏除「返回」「应用切换」外）：浅色底 + 同系深色图标。
   * 未传且存在 iconNode 时按 neutral（灰底）处理。
   */
  subEntryTint?: "neutral" | "orange" | "blue" | "green" | "brand";
  menu: Array<{ id?: string; name: string; iconKey?: string }>;
  /** 无二级菜单：主按钮单次点击即回调（如任务「筛选」「设置」） */
  directClick?: boolean;
};

type MailDockRow = (typeof MAIL_DOCK_APPS)[number];

function mapMailDockRowToSecondaryApp(row: MailDockRow): SecondaryAppButtonApp {
  const base: SecondaryAppButtonApp = {
    id: row.id,
    name: row.name,
    imageSrc: row.imageSrc,
    menu: row.menu,
    directClick: "directClick" in row ? Boolean((row as { directClick?: boolean }).directClick) : undefined,
  };
  switch (row.id) {
    case "mail_send_receive":
      return {
        ...base,
        iconNode: <FileText className="size-[13px]" strokeWidth={2} />,
        subEntryTint: "orange",
      };
    case "mail_my":
      return {
        ...base,
        iconNode: <User className="size-[13px]" strokeWidth={2} />,
        subEntryTint: "orange",
      };
    case "mail_business":
      return {
        ...base,
        iconNode: <Users className="size-[13px]" strokeWidth={2} />,
        subEntryTint: "blue",
      };
    case "mail_settings":
      return {
        ...base,
        iconNode: <Settings className="size-[13px]" strokeWidth={2} />,
        subEntryTint: "green",
      };
    case "mail_admin":
      return {
        ...base,
        iconNode: <Building2 className="size-[13px]" strokeWidth={2} />,
        subEntryTint: "blue",
      };
    default:
      return base;
  }
}

function enrichTaskAppForDock(app: (typeof TASK_APPS)[number]): SecondaryAppButtonApp {
  const base: SecondaryAppButtonApp = {
    id: app.id,
    name: app.name,
    imageSrc: app.imageSrc,
    menu: app.menu,
    directClick: app.directClick,
  };
  switch (app.id) {
    case "task_overview":
      return {
        ...base,
        iconNode: <FileText className="size-[13px]" strokeWidth={2} />,
        subEntryTint: "orange",
      };
    case "task_mine":
      return {
        ...base,
        iconNode: <LayoutGrid className="size-[13px]" strokeWidth={2} />,
        subEntryTint: "green",
      };
    case "task_new":
      return {
        ...base,
        iconNode: <Users className="size-[13px]" strokeWidth={2} />,
        subEntryTint: "blue",
      };
    case "task_filter":
      return {
        ...base,
        iconNode: <Filter className="size-[13px]" strokeWidth={2} />,
        subEntryTint: "green",
      };
    case "task_settings":
      return {
        ...base,
        iconNode: <Settings className="size-[13px]" strokeWidth={2} />,
        subEntryTint: "blue",
      };
    default:
      return base;
  }
}

const TASK_DOCK_SECONDARY_APPS: SecondaryAppButtonApp[] = TASK_APPS.map(enrichTaskAppForDock);

const ORGANIZATION_0425_APPS: SecondaryAppButtonApp[] = [
  {
    id: "org_structure",
    name: "组织架构",
    imageSrc: organizationIcon,
    iconNode: <UsersRound className="size-[13px]" strokeWidth={1.8} />,
    subEntryTint: "brand",
    menu: [],
    directClick: true,
  },
  {
    id: "org_management",
    name: "组织管理",
    imageSrc: orgIcon,
    iconNode: <Building2 className="size-[13px]" strokeWidth={1.8} />,
    subEntryTint: "brand",
    menu: [],
    directClick: true,
  },
  {
    id: "post_management",
    name: "岗位管理",
    imageSrc: employeeIcon,
    iconNode: <Briefcase className="size-[13px]" strokeWidth={1.8} />,
    subEntryTint: "brand",
    menu: [],
    directClick: true,
  },
  {
    id: "rank_management",
    name: "职级管理",
    imageSrc: recruitmentIcon,
    iconNode: <TrendingUp className="size-[13px]" strokeWidth={1.8} />,
    subEntryTint: "brand",
    menu: [],
    directClick: true,
  },
  {
    id: "position_management",
    name: "职位管理",
    imageSrc: profileIcon,
    iconNode: <UserCog className="size-[13px]" strokeWidth={1.8} />,
    subEntryTint: "brand",
    menu: [],
    directClick: true,
  },
  {
    id: "salary_quantile",
    name: "薪酬分位",
    imageSrc: salaryIcon,
    iconNode: <DollarSign className="size-[13px]" strokeWidth={1.8} />,
    subEntryTint: "brand",
    menu: [],
    directClick: true,
  },
  {
    id: "org_settings",
    name: "组织设置",
    imageSrc: companyIcon,
    iconNode: <Settings className="size-[13px]" strokeWidth={1.8} />,
    subEntryTint: "brand",
    menu: [],
    directClick: true,
  },
];

/** 0425 演示：员工应用内底栏快捷入口（浅底深标，与组织应用底栏一致模式） */
const EMPLOYEE_0425_APPS: SecondaryAppButtonApp[] = [
  {
    id: "emp_permission_apply",
    name: "权限申请",
    imageSrc: employeeIcon,
    iconNode: <UserCheck className="size-[13px]" strokeWidth={1.8} />,
    subEntryTint: "brand",
    menu: [],
    directClick: true,
  },
  {
    id: "emp_roster",
    name: "花名册",
    imageSrc: profileIcon,
    iconNode: <UsersRound className="size-[13px]" strokeWidth={1.8} />,
    subEntryTint: "blue",
    menu: [],
    directClick: true,
  },
  {
    id: "emp_onboard",
    name: "入职办理",
    imageSrc: recruitmentIcon,
    iconNode: <UserPlus className="size-[13px]" strokeWidth={1.8} />,
    subEntryTint: "green",
    menu: [],
    directClick: true,
  },
  {
    id: "emp_attendance",
    name: "考勤统计",
    imageSrc: calendarIcon,
    iconNode: <Clock className="size-[13px]" strokeWidth={1.8} />,
    subEntryTint: "orange",
    menu: [],
    directClick: true,
  },
];

function SecondaryAppButton({
  app,
  onMenuClick,
}: {
  app: SecondaryAppButtonApp;
  onMenuClick: (menu: string, appName: string, appId: string, menuItemId?: string) => void;
}) {
  const [referenceElement, setReferenceElement] = React.useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = React.useState<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const timeoutRef = React.useRef<any>(null);

  const isDirect = Boolean(app.directClick);

  const { styles, attributes, update } = usePopper(referenceElement, popperElement, {
    placement: 'top-start',
    strategy: 'fixed',
    modifiers: [
      { name: 'offset', options: { offset: [0, 10] } },
      { name: 'preventOverflow', options: { padding: 8 } },
      { name: 'flip', options: { fallbackPlacements: ['top-start', 'top-end', 'bottom'] } }
    ],
  });

  const handleMouseEnter = () => {
    if (isDirect) return;
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
    // Force popper to update position when it opens
    if (update) update();
  };

  const handleMouseLeave = () => {
    if (isDirect) return;
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    if (isDirect) return;
    // Enable mobile support by allowing toggle on click
    e.stopPropagation();
    setIsOpen(prev => !prev);
    if (update) update();
  };

  const handleMainButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDirect) {
      onMenuClick("__direct__", app.name, app.id, undefined);
      return;
    }
    handleToggleClick(e);
  };

  // Close popper if clicked outside (critical for mobile)
  React.useEffect(() => {
    const handleDocumentClick = (e: MouseEvent | TouchEvent) => {
      if (
        isOpen && 
        referenceElement && 
        !referenceElement.contains(e.target as Node) &&
        popperElement &&
        !popperElement.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('touchstart', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('touchstart', handleDocumentClick);
    };
  }, [isOpen, referenceElement, popperElement]);

  // Re-calculate position when open state changes, keeping it synced during parent animations
  React.useEffect(() => {
    let rafId: number;
    let startTime: number;

    const animateUpdate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      if (update) update();
      
      // Keep updating for 400ms to catch any layout animations (like slide-ins)
      if (timestamp - startTime < 400) {
        rafId = requestAnimationFrame(animateUpdate);
      }
    };

    if (isOpen) {
      rafId = requestAnimationFrame(animateUpdate);
    }

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isOpen, update]);

  return (
    <div className="relative inline-flex" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button
        ref={setReferenceElement}
        type="button"
        onClick={handleMainButtonClick}
        className={cn(
          "bg-bg flex gap-[var(--space-100)] h-[var(--space-800)] items-center px-[var(--space-300)] py-[var(--space-150)] rounded-full shrink-0 transition-all duration-300 ease-out border border-border group/btn outline-none",
          !isDirect && (isOpen ? "bg-[var(--black-alpha-11)]" : "hover:bg-[var(--black-alpha-11)]"),
          isDirect && "hover:bg-[var(--black-alpha-11)]"
        )}
      >
        {app.iconNode ? (
          <span
            className={cn(
              "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[var(--radius-sm)] transition-colors",
              app.subEntryTint === "orange" && "bg-[var(--orange-alpha-11)] text-[var(--orange-10)]",
              app.subEntryTint === "blue" && "bg-[var(--blue-alpha-11)] text-primary",
              app.subEntryTint === "green" && "bg-[var(--green-alpha-11)] text-success",
              app.subEntryTint === "brand" && "bg-primary/10 text-primary",
              (!app.subEntryTint || app.subEntryTint === "neutral") &&
                "bg-bg-secondary text-text-secondary group-hover/btn:bg-[var(--black-alpha-11)] group-hover/btn:text-text",
            )}
          >
            {app.iconNode}
          </span>
        ) : (
          <AppIcon imageSrc={app.imageSrc} className="w-[18px] h-[18px]" />
        )}
        <p className="text-[length:var(--font-size-xs)] leading-none text-[var(--color-text)] whitespace-nowrap font-[var(--font-weight-medium)]">
          {app.name}
        </p>
        {!isDirect && (
          <ChevronDown 
            className={cn(
              "size-[12px] text-text-tertiary transition-transform duration-300 ease-in-out",
              isOpen && "rotate-180"
            )} 
          />
        )}
      </button>

      {typeof document !== 'undefined' && createPortal(
        <div 
          ref={setPopperElement} 
          style={{ ...styles.popper, zIndex: 9999, pointerEvents: isOpen ? 'auto' : 'none' }} 
          {...attributes.popper}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <AnimatePresence>
            {isOpen && !isDirect && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                style={{ transformOrigin: "bottom left" }}
                className="bg-bg border border-border shadow-[0px_8px_32px_0px_rgba(22,24,30,0.1)] rounded-[8px] p-[6px] min-w-[140px] max-w-[min(100vw-24px,380px)] flex flex-col overflow-hidden"
              >
                {app.menu.map((m: any) => {
                  const name = typeof m === 'string' ? m : m.name;
                  const hasIcon = typeof m === 'object' && m.iconKey;
                  const menuItemId = typeof m === 'object' && m.id ? String(m.id) : undefined;
                  
                  return (
                    <button
                      key={menuItemId ?? name}
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onMenuClick(name, app.name, app.id, menuItemId);
                      }}
                      className="w-full flex items-center gap-[10px] px-[10px] py-[8px] hover:bg-[var(--black-alpha-11)] active:bg-[var(--black-alpha-9)] transition-colors rounded-[6px] text-left group"
                    >
                      {hasIcon && (
                        <div className="shrink-0 size-[16px] flex items-center justify-center text-text-secondary group-hover:text-primary transition-colors">
                          <EducationMenuIcon iconKey={m.iconKey} />
                        </div>
                      )}
                      <span
                        title={name}
                        className="font-['PingFang_SC:Regular',sans-serif] min-w-0 flex-1 leading-[20px] overflow-hidden text-text text-[14px] text-ellipsis whitespace-nowrap group-hover:text-primary transition-colors"
                      >
                        {name}
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </div>
  );
}

function parseTime(timeStr: string): Date | null {
  const today = new Date();
  const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (timeMatch) {
    let [_, h, m, amp] = timeMatch;
    let hours = parseInt(h);
    let minutes = parseInt(m);
    
    if (amp) {
      amp = amp.toUpperCase();
      if (amp === 'PM' && hours < 12) hours += 12;
      if (amp === 'AM' && hours === 12) hours = 0;
    }
    
    const date = new Date(today);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
  return null;
}

function shouldShowTimestamp(current: Message, previous: Message | null): boolean {
  if (!previous) return true;

  /** 「切换组织」卡片下方的行动建议与紧随其后的「任务管理」表之间不插时间分隔，避免空隙大于欢迎区行动建议→切换组织卡片 */
  if (
    previous.content === ORG_SWITCHER_MARKER &&
    typeof current.content === "string" &&
    current.content.startsWith(TASK_TABLE_MARKER)
  ) {
    return false;
  }

  const curDate = parseTime(current.timestamp);
  const prevDate = parseTime(previous.timestamp);
  
  if (!curDate || !prevDate) {
    return current.timestamp !== previous.timestamp;
  }
  
  const diffInMs = Math.abs(curDate.getTime() - prevDate.getTime());
  const diffInMins = diffInMs / (1000 * 60);
  
  return diffInMins > 20;
}

function FloatingAppWindow({
  appId,
  title,
  onClose,
  children,
  defaultPos
}: {
  appId: string;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  defaultPos?: { x: number, y: number };
}) {
  const controls = useDragControls()
  
  // Calculate initial size based on window size to ensure it fits the viewport
  const [size, setSize] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const maxWidth = window.innerWidth - 32; // 16px padding on both sides
      const maxHeight = window.innerHeight - 32; // 16px padding top and bottom
      return {
        width: Math.min(1200, maxWidth),
        // 随视口高度自适应，避免固定 800px 在矮屏裁切、高屏留白过多
        height: maxHeight,
      };
    }
    return { width: 1200, height: 800 };
  });

  // Add resize listener to keep size within viewport bounds when device size changes
  React.useEffect(() => {
    const handleResize = () => {
      const maxWidth = window.innerWidth - 32;
      const maxHeight = window.innerHeight - 32;
      setSize(prev => ({
        width: Math.min(prev.width, maxWidth),
        height: Math.min(prev.height, maxHeight)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-[16px] sm:p-[var(--space-400)] overflow-hidden">
      <motion.div
        drag
        dragControls={controls}
        dragListener={false}
        dragMomentum={false}
        dragConstraints={{ left: -9999, right: 9999, top: -9999, bottom: 9999 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="pointer-events-auto flex"
        style={{
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
        <Resizable
          size={{ width: size.width, height: size.height }}
          onResizeStop={(e, direction, ref, d) => {
            setSize({
              width: size.width + d.width,
              height: size.height + d.height,
            });
          }}
          minWidth={Math.min(320, typeof window !== 'undefined' ? window.innerWidth - 32 : 320)}
          minHeight={Math.min(400, typeof window !== 'undefined' ? window.innerHeight - 32 : 400)}
          maxWidth={typeof window !== 'undefined' ? window.innerWidth - 32 : 1600}
          maxHeight={typeof window !== 'undefined' ? window.innerHeight - 32 : 1000}
          className="bg-cui-bg rounded-[var(--radius-xl)] shadow-md border border-border flex flex-col overflow-hidden max-w-full max-h-full"
          handleStyles={{
            right: { width: '8px', right: '-4px', cursor: 'ew-resize' },
            bottom: { height: '8px', bottom: '-4px', cursor: 'ns-resize' },
            bottomRight: { width: '16px', height: '16px', right: '-8px', bottom: '-8px', cursor: 'nwse-resize' }
          }}
        >
          <div 
            onPointerDown={(e) => controls.start(e)}
            className="flex items-center justify-between px-[var(--space-300)] py-[var(--space-200)] border-b border-border bg-bg-secondary cursor-grab active:cursor-grabbing shrink-0"
          >
            <div className="flex items-center gap-[var(--space-200)] flex-1 min-w-0">
              <span className="text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] text-text truncate">{title}</span>
            </div>
            <div className="flex items-center gap-[var(--space-100)] shrink-0">
              <button
                onClick={onClose}
                className="w-[var(--space-600)] h-[var(--space-600)] flex items-center justify-center text-text-secondary hover:bg-[var(--black-alpha-11)] rounded-[var(--radius-md)] transition-colors border-none bg-transparent cursor-pointer"
                title="关闭独立窗口"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="flex-1 min-h-0 bg-cui-bg relative flex flex-col overflow-hidden">
            {children}
          </div>
        </Resizable>
      </motion.div>
    </div>
  );
}

export function MainAIChatWindow({ 
  conversation, 
  onToggleHistory, 
  historyOpen = false,
  onHistoryOpenChange,
  conversations = [],
  selectedId = "",
  onSelect,
  initialActiveApp = null,
  taskEntryVariant = "default",
  mailDemoScenarioId,
  on0419SessionCommit,
  on0419NewSession,
  hasEducationSpace = true,
  sidebarVariant = "default",
  alwaysShowIndependentWindow = false,
  hasOrganization = true,
  educationSpacePreset = "default",
  educationNoSpaceDockTeaser = false,
  simpleOrgOnboarding0421 = false,
  on0421EstablishOrganization,
  noEduSpace0421ChatToolbar = false,
  invite0421NewUserFlow = false,
  invite0421ShellGateRequest = null,
  onInvite0421ShellGateRequestConsumed,
  invite0421OpenEducationNonce = 0,
  invite0421EduStudentFlow = false,
  invite0421EduStudentFamilyReady = false,
  invite0421EduInviteFlow,
  onInvite0421EduInviteFlowPatch,
  onInvite0421EduStudentFlowComplete,
  onInvite0421DemoApprovalInDemoNavVisibleChange,
  schedule0422DrawerDemo = false,
  interactionRulesNaturalDialogDemoNonce = 0,
  interactionRulesBusinessCardDemoNonce = 0,
  interactionRulesMainAiOrgDemoNonce = 0,
  demoInstructionShell = false,
  permissionEditCard0424Demo = false,
  organizationManagement0425Demo = false,
  organizationManagement0425CommandNonce = 0,
}: MainAIChatWindowProps) {
  const invite0421DockFlow = invite0421NewUserFlow || invite0421EduStudentFlow;
  /** 避免 `tryEnterWorkbenchApp` 随 `activeApp` 变引用后，effect 误重复打开教育应用（如底栏「返回」后主 AI 立刻被拉回教育） */
  const invite0421OpenEducationHandledNonceRef = React.useRef(0);
  const invite0421EduStudentFamilyBootstrappedRef = React.useRef(false);
  const is0419Explore = taskEntryVariant === "task0419SidebarExplore"
  const [messages, setMessages] = React.useState<Message[]>(() =>
    invite0421DockFlow && !is0419Explore ? [] : conversation.messages,
  )
  const [schedule0422Items, setSchedule0422Items] = React.useState<Schedule0422Item[]>(() => schedule0422InitialItems())
  const [schedule0422DrawerOpen, setSchedule0422DrawerOpen] = React.useState(false)
  const [schedule0422DrawerItem, setSchedule0422DrawerItem] = React.useState<Schedule0422Item | null>(null)
  /** 0421 受邀员工：已提交基本信息、尚未点演示顶栏「演示：审批通过」，用于展示演示入组入口 */
  const [invite0421EmployeeAwaitingDemoApproval, setInvite0421EmployeeAwaitingDemoApproval] =
    React.useState(false);
  const [inputValue, setInputValue] = React.useState("")
  /** 交互规范文档「自然语言对话」：预填后下一次主 AI 非结构化发送时追加演示回复 */
  const interactionRulesNaturalDialogArmRef = React.useRef(false)
  /** 交互规范文档「业务指令→卡片」：预填后下一次主 AI 发送时追加演示用通用卡片 */
  const interactionRulesBusinessCardDemoArmRef = React.useRef(false)
  /** 0424 权限编辑演示：主 AI 输入框仅自动预填一次，避免与子应用往返时反复覆盖用户输入 */
  const permission0424InputPrefilledRef = React.useRef(false)
  /** 0425 组织管理演示：主 AI 输入框仅自动预填一次 */
  const organization0425InputPrefilledRef = React.useRef(false)
  const [interactionRulesOrgCardMessageId, setInteractionRulesOrgCardMessageId] = React.useState<
    string | null
  >(null)
  const [interactionRulesOrgCardResetKey, setInteractionRulesOrgCardResetKey] = React.useState(0)
  const lastInteractionRulesOrgSwitcherDemoNonceRef = React.useRef(0)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  /** 当前列表最后一条消息的外层容器，用于新卡片打开时滚至卡片顶部对齐视口 */
  const latestMessageRowRef = React.useRef<HTMLDivElement>(null)
  /**
   * 0417 原位置编辑等同条 `patchMessages`：跳过一次「按末条是否卡片」的 layout 滚动，
   * 避免末条非详情时误 `scrollToBottom`；随后由 `scrollToMessageById` 将本条卡片顶对齐视口。
   */
  const skipNextChatLayoutScrollRef = React.useRef(false)
  /** 独立浮窗内教育会话列表最后一条（与主会话分离，避免 ref 互相覆盖） */
  const floatingEducationRowRef = React.useRef<HTMLDivElement>(null)
  const chatContainerRef = React.useRef<HTMLDivElement>(null)
  /** 独立浮窗内对话滚动容器（与主窗 `chatContainerRef` 分离） */
  const floatingChatScrollRef = React.useRef<HTMLDivElement>(null)
  /** 新一轮对话底部槽位外框（两阶段滚动：先贴底再对齐槽顶） */
  const newRoundShellRef = React.useRef<HTMLDivElement>(null)
  /** 槽位武装后的首帧对齐是否已执行，避免随每条消息重复滚动 */
  const newRoundScrollAppliedRef = React.useRef(false)
  /** 槽位 / 卡片顶对齐滚动动画 rAF（与操作来源滚动 ref 分离） */
  const chatScrollAlignRafRef = React.useRef<number | null>(null)
  /**
   * 同一「轮」内（用户一条 + 随后系统在该轮内的所有回复）：抑制自动 scrollToBottom / scrollLatestCardRowToTop，
   * 避免把用户消息与系统消息当成两次定位。下一轮用户再发时由 arm 覆盖。
   */
  const sameRoundScrollSuppressRef = React.useRef<{
    minOrdinal: number;
    armedActiveApp: string | null;
    armedIs0419Explore: boolean;
  } | null>(null)
  /** 「操作来源」回跳滚动动画的 rAF，重复点击时取消上一段 */
  const operationSourceScrollRafRef = React.useRef<number | null>(null)

  type NewRoundSlotState = {
    startMessageIndex: number
    slotHeightPx: number
    /** 武装槽位时的 `activeApp`，主 AI 为 null */
    armedActiveApp: string | null
    armedIs0419Explore: boolean
  }
  const [newRoundSlot, setNewRoundSlot] = React.useState<NewRoundSlotState | null>(null)

  const releaseNewRoundSlot = React.useCallback(() => {
    setNewRoundSlot(null)
  }, [])

  /** 吸顶待办卡片外层（sticky），用于槽位可视高度扣除与滚动对齐 */
  const pinnedTaskStickyRef = React.useRef<HTMLDivElement>(null)

  // Apps state
  const [apps, setApps] = React.useState<AppItem[]>([]);
  const [isAllAppsOpen, setIsAllAppsOpen] = React.useState(false);
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [longPressIndex, setLongPressIndex] = React.useState<number | null>(null);
  const longPressTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Education Mode State
  const [activeApp, setActiveApp] = React.useState<string | null>(null);

  /** 切换子应用时清「同一轮抑制」，避免邮件/教育等列表与主会话序号串台 */
  React.useEffect(() => {
    sameRoundScrollSuppressRef.current = null;
  }, [activeApp]);

  React.useEffect(() => {
    const visible = Boolean(
      invite0421NewUserFlow &&
        !hasOrganization &&
        invite0421EmployeeAwaitingDemoApproval &&
        !activeApp &&
        on0421EstablishOrganization,
    );
    onInvite0421DemoApprovalInDemoNavVisibleChange?.(visible);
    return () => {
      onInvite0421DemoApprovalInDemoNavVisibleChange?.(false);
    };
  }, [
    invite0421NewUserFlow,
    hasOrganization,
    invite0421EmployeeAwaitingDemoApproval,
    activeApp,
    on0421EstablishOrganization,
    onInvite0421DemoApprovalInDemoNavVisibleChange,
  ]);

  // 改为按组织 ID 存储消息：{ orgId: Message[] }
  const [orgMessages, setOrgMessages] = React.useState<Record<string, Message[]>>({});

  // Organization State（无组织演示：`NO_ORG_MESSAGE_SCOPE`，主会话消息单独分桶）
  const [currentOrg, setCurrentOrg] = React.useState<string>(() =>
    hasOrganization ? "xiaoce" : NO_ORG_MESSAGE_SCOPE,
  );

  /**
   * 无组织时拦截「工作台应用」进入子应用；用户在本会话内创建/加入组织或切换到真实组织后解除。
   * `hasOrganization` 为 true 时始终放行（与 props 对齐）。
   */
  const [workbenchOrgGateReleased, setWorkbenchOrgGateReleased] = React.useState(() => hasOrganization);
  React.useEffect(() => {
    if (hasOrganization) setWorkbenchOrgGateReleased(true);
  }, [hasOrganization]);

  /**
   * 教育空间树：运行时可变，便于「创建机构/家庭教育空间」后把新空间加入下拉并自动选中。
   * `hasEducationSpace` 作为 props 仅决定初始是否有空间；空态后用户创建空间后会自动过渡到「有空间」视图。
   */
  const [educationSpaceNodes, setEducationSpaceNodes] = React.useState<EducationSpaceNode[]>(() =>
    initialEducationSpaceNodesForPreset(hasEducationSpace, educationSpacePreset),
  );

  /** 教育应用-当前教育空间：默认依 preset；空态下为空字符串，创建后由 handler 填入 */
  const [currentEducationSpaceId, setCurrentEducationSpaceId] = React.useState<string>(() =>
    initialEducationSpaceIdForPreset(hasEducationSpace, educationSpacePreset),
  );

  /** 是否至少存在一个教育空间（驱动顶栏显示「空间下拉」还是「创建教育空间」，以及欢迎态文案） */
  const effectiveHasEducationSpace = educationSpaceNodes.length > 0;

  /**
   * 当前选中的教育空间「类型」：
   * - `family` / `institution`：对应底部 dock 使用不同快捷入口集合
   * - `undefined`：未选中或空态下，底部仅保留「返回 + 教育应用切换」
   */
  const currentEducationSpaceKind = React.useMemo<'family' | 'institution' | undefined>(() => {
    if (!currentEducationSpaceId) return undefined;
    for (const node of educationSpaceNodes) {
      if (node.id === currentEducationSpaceId) return node.kind as 'family' | 'institution';
      if (node.children) {
        const hit = node.children.find((c) => c.id === currentEducationSpaceId);
        if (hit) return hit.kind as 'family' | 'institution';
      }
    }
    return undefined;
  }, [educationSpaceNodes, currentEducationSpaceId]);

  /**
   * 0421 学生受邀：主/IM 内「确认创建」后立即写入「张小宝教育空间」并选中，
   * 无需先点「进入…」即可从底栏进入教育应用看到有空间态（「进入」仍负责 tryEnter + 父级 familyReady / IM 同步）。
   */
  React.useEffect(() => {
    if (!invite0421EduStudentFlow) return;
    if (!invite0421EduInviteFlow?.submitted) return;
    setEducationSpaceNodes((prev) => {
      if (prev.some((n) => n.id === EDU_STUDENT_ZHANG_FAMILY_SPACE_ID)) return prev;
      return [
        ...prev,
        {
          id: EDU_STUDENT_ZHANG_FAMILY_SPACE_ID,
          name: "张小宝教育空间",
          kind: "family" as const,
        },
      ];
    });
    setCurrentEducationSpaceId((id) =>
      id === EDU_STUDENT_ZHANG_FAMILY_SPACE_ID ? id : EDU_STUDENT_ZHANG_FAMILY_SPACE_ID,
    );
  }, [invite0421EduStudentFlow, invite0421EduInviteFlow?.submitted]);

  
  // 获取当前组织的消息列表
  const educationMessages = React.useMemo(() => {
    return orgMessages[currentOrg] || [];
  }, [orgMessages, currentOrg]);

  // Model State - 默认使用 GPT-4 Turbo（推荐版本）
  const [currentModel, setCurrentModel] = React.useState<string>('gpt-4-turbo');

  // Task Drawer State
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<any>(null);

  /** 任务列表：用户点击整行打开详情后，该行名称变浅表示已查看（本会话内） */
  const [viewedTaskIdsFromList, setViewedTaskIdsFromList] = React.useState<string[]>([]);
  const viewedTaskIdSet = React.useMemo(() => new Set(viewedTaskIdsFromList), [viewedTaskIdsFromList]);

  /** 将指定滚动容器滚到底（主窗 / 浮窗等复用） */
  const scrollPanelToBottom = React.useCallback((container: HTMLElement | null) => {
    if (!container) return;
    const run = (behavior: ScrollBehavior = "smooth") => {
      container.scrollTo({ top: container.scrollHeight, behavior });
    };
    run("smooth");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => run("auto"));
    });
    window.setTimeout(() => run("auto"), 150);
    document.querySelectorAll(".fixed.inset-0.pointer-events-none").forEach((wrapper) => {
      if (wrapper instanceof HTMLElement && wrapper.scrollTop > 0) wrapper.scrollTop = 0;
    });
  }, []);

  /** 滚至列表底部锚点；含 rAF + 延时二次对齐，避免大卡片/DOM 晚布局导致未滚到位 */
  const scrollToBottom = React.useCallback(() => {
    const container = scrollRef.current?.closest(".overflow-y-auto") as HTMLElement | null;
    scrollPanelToBottom(container ?? chatContainerRef.current);
  }, [scrollPanelToBottom]);

  /**
   * 新出「对话区卡片」时：将该消息行顶部对齐到可视顶（0419/主 AI 下为吸顶卡片底边），300ms 过渡。
   */
  const scrollLatestCardRowToTop = React.useCallback((el: HTMLElement | null) => {
    if (!el) return;
    if (operationSourceScrollRafRef.current !== null) {
      cancelAnimationFrame(operationSourceScrollRafRef.current);
      operationSourceScrollRafRef.current = null;
    }
    const sup = sameRoundScrollSuppressRef.current;
    if (sup) {
      const ord = readMessageOrdinalFromRowEl(el);
      const listCtxOk =
        sup.armedIs0419Explore === is0419Explore && sup.armedActiveApp === activeApp;
      if (listCtxOk && ord >= sup.minOrdinal) {
        return;
      }
    }
    const container = el.closest(".overflow-y-auto") as HTMLElement | null;
    if (!container) {
      el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      return;
    }
    const pin = pinnedTaskStickyRef.current;
    const target = computeScrollTopToAlignElementTopBelowPin(container, el, pin);
    animateContainerScrollTop(
      container,
      target,
      CHAT_SCROLL_ALIGN_DURATION_MS,
      chatScrollAlignRafRef,
      () => {
        const t = computeScrollTopToAlignElementTopBelowPin(container, el, pinnedTaskStickyRef.current);
        if (Math.abs(container.scrollTop - t) > 1) {
          container.scrollTop = t;
        }
      }
    );
  }, [is0419Explore, activeApp]);

  /** 点击「操作来源」时滚动到对应消息行（依赖 data-message-id）；固定 300ms 插值过渡 */
  const scrollToMessageById = React.useCallback((messageId: string) => {
    if (!messageId) return;
    if (operationSourceScrollRafRef.current !== null) {
      cancelAnimationFrame(operationSourceScrollRafRef.current);
      operationSourceScrollRafRef.current = null;
    }
    if (chatScrollAlignRafRef.current !== null) {
      cancelAnimationFrame(chatScrollAlignRafRef.current);
      chatScrollAlignRafRef.current = null;
    }
    try {
      const escaped =
        typeof CSS !== "undefined" && typeof CSS.escape === "function"
          ? CSS.escape(messageId)
          : messageId.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      const sel = `[data-message-id="${escaped}"]`;
      const root = chatContainerRef.current;
      const el = (root?.querySelector(sel) ?? document.querySelector(sel)) as HTMLElement | null;
      if (!el) return;

      const container = el.closest(".overflow-y-auto") as HTMLElement | null;
      if (!container) {
        el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
        return;
      }

      const pin = pinnedTaskStickyRef.current;
      const targetScrollTop = computeScrollTopToAlignElementTopBelowPin(container, el, pin);
      const startScrollTop = container.scrollTop;
      const distance = targetScrollTop - startScrollTop;
      if (Math.abs(distance) < 1) return;

      const reducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
      if (reducedMotion) {
        container.scrollTop = targetScrollTop;
        return;
      }

      const t0 = performance.now();
      const tick = (now: number) => {
        const u = Math.min(1, (now - t0) / OPERATION_SOURCE_SCROLL_DURATION_MS);
        const eased = easeInOutQuad(u);
        container.scrollTop = startScrollTop + distance * eased;
        if (u < 1) {
          operationSourceScrollRafRef.current = requestAnimationFrame(tick);
        } else {
          operationSourceScrollRafRef.current = null;
        }
      };
      operationSourceScrollRafRef.current = requestAnimationFrame(tick);
    } catch {
      // 非法 id 等忽略
    }
  }, []);

  // Pinned Task State
  const [isPinnedTaskExpanded, setIsPinnedTaskExpanded] = React.useState(true);
  const [isTaskCardExpanded, setIsTaskCardExpanded] = React.useState(true);
  const isInitialMount = React.useRef(true);

  /**
   * 新一轮对话的「空屏槽位」底层实现：先收起吸顶卡片（同步布局便于测量），再武装槽位。
   * 槽高 = 滚动容器可视高 − 吸顶区高度；无吸顶时（非 0419 且非主 AI）用满高。
   * 调用约束（勿随意外调）：
   *  - 只在 **用户操作** 且该操作会 **在末尾追加一条新消息 / 新卡片** 的路径上调用；
   *  - **原位置切换卡片形态 / 更新卡片数据**（如「浏览 ↔ 编辑」「提交后转只读」）
   *    属于同一轮，请走 `scrollInPlaceMutatedCardToTop(id)`，**不要** 武装新一轮槽位。
   *  - 建议统一经由 `beginNewUserChatRound(surface)`，它会根据当前 `activeApp` / 0419 语境
   *    自动计算 `startMessageIndex`。
   */
  const armNewRoundForUserSend = React.useCallback(
    (armedActiveApp: string | null, startMessageIndex: number) => {
      newRoundScrollAppliedRef.current = false
      /** 与下方 `PinnedTaskCard` 挂载条件一致 */
      const showPinnedExplorer = is0419Explore || activeApp === null
      if (showPinnedExplorer) {
        flushSync(() => {
          setIsTaskCardExpanded(false)
        })
      }
      const c = chatContainerRef.current
      const pin = pinnedTaskStickyRef.current
      /** 对话滚动区可视高度（≈ 顶栏 ChatNavBar 之下到底栏输入/快捷栏之上的区域） */
      const fullH = c?.clientHeight ?? 480
      const pinH = showPinnedExplorer && pin ? pin.offsetHeight : 0
      const slotHeightPx = computeNewRoundSlotHeightPx({
        chatClientHeight: fullH,
        pinOverlayHeight: pinH,
        demoInstructionShell,
      })
      sameRoundScrollSuppressRef.current = {
        minOrdinal: startMessageIndex,
        armedActiveApp,
        armedIs0419Explore: is0419Explore,
      }
      setNewRoundSlot({
        startMessageIndex,
        slotHeightPx,
        armedActiveApp,
        armedIs0419Explore: is0419Explore,
      })
    },
    [is0419Explore, activeApp, demoInstructionShell]
  )

  // Floating Windows State
  const [floatingApps, setFloatingApps] = React.useState<string[]>([]);
  const [previousActiveApp, setPreviousActiveApp] = React.useState<string | null>(null);

  // Secondary App History Sidebar State
  const [secondaryHistoryOpen, setSecondaryHistoryOpen] = React.useState(false);
  
  // Mock data for secondary app sessions (教育应用的历史会话)
  const [secondaryAppSessions] = React.useState<SecondaryAppSession[]>([
    {
      id: 'session-1',
      appName: '教育',
      appIconKey: 'education',
      timestamp: new Date(), // 今天
      hasUncompletedAction: true
    },
    {
      id: 'session-2',
      appName: '日程',
      appIconKey: 'schedule',
      timestamp: new Date(), // 今天
      hasUncompletedAction: false
    },
    {
      id: 'session-3',
      appName: '会议',
      appIconKey: 'meeting',
      timestamp: new Date(), // 今天
      hasUncompletedAction: true
    },
    {
      id: 'session-4',
      appName: '待办',
      appIconKey: 'todo',
      timestamp: new Date(), // 今天
      hasUncompletedAction: true
    },
    {
      id: 'session-5',
      appName: '微盘',
      appIconKey: 'disk',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3天前
      hasUncompletedAction: false
    },
    {
      id: 'session-6',
      appName: '邮箱',
      appIconKey: 'mail',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5天前
      hasUncompletedAction: false
    },
    {
      id: 'session-7',
      appName: '会议',
      appIconKey: 'meeting',
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10天前
      hasUncompletedAction: false
    },
    {
      id: 'session-8',
      appName: '微盘',
      appIconKey: 'disk',
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15���前
      hasUncompletedAction: false
    },
  ]);
  
  // 默认选中"最近使用"分组中的第一个会话
  const [selectedSecondarySession, setSelectedSecondarySession] = React.useState<string>(() => {
    return secondaryAppSessions.length > 0 ? secondaryAppSessions[0].id : "";
  });

  React.useEffect(() => {
    const loadedApps = getAppsFromStorage();
    setApps([...loadedApps].sort((a, b) => a.order - b.order));
  }, []);

  const handleReorder = (reorderedApps: AppItem[]) => {
    setApps(reorderedApps);
    saveAppsToStorage(reorderedApps);
  };

  /** 「全部应用」抽屉：与底栏一致在「任务」后插入邮箱（邮箱方案页）；排序落库时剔除 mail */
  const appsForAllAppsDrawer = React.useMemo(() => {
    if (!taskEntryIsMailDockFamily(taskEntryVariant)) return apps;
    const taskIdx = apps.findIndex((a) => a.id === "task");
    if (taskIdx < 0) return [...apps, MAIL_APP_DOCK_ITEM];
    const next = [...apps];
    next.splice(taskIdx + 1, 0, MAIL_APP_DOCK_ITEM);
    return next;
  }, [apps, taskEntryVariant]);

  /** 0421 新用户：无组织时主底栏固定 7 项顺序（教育→待办→日程→会议→邮箱→文档→微盘）；有组织后恢复完整列表 */
  const appsForMainAIDockPills = React.useMemo(() => {
    if (!invite0421DockFlow || hasOrganization) return apps;
    return buildInvite0421NoOrgDockApps(apps);
  }, [apps, invite0421DockFlow, hasOrganization]);

  /** 0421：已添加 = 无组织 7 项（顺序同上）；未添加 = 工作台应用（与 Guidelines 分类一致） */
  const invite0421AllAppsSplit = React.useMemo(() => {
    if (!invite0421DockFlow || hasOrganization) return null;
    const added = buildInvite0421NoOrgDockApps(apps);
    const unadded = appsForAllAppsDrawer.filter((a) => INVITE0421_WORKBENCH_APP_IDS.has(a.id));
    return { added, unadded };
  }, [invite0421DockFlow, hasOrganization, apps, appsForAllAppsDrawer]);

  /** 0421 无组织壳：日程（非 0422 抽屉演示）与待办/会议/文档/微盘等占位应用底栏（返回 + 全部应用） */
  const invite0421NoOrgShellPersonalDock = React.useMemo(
    () =>
      Boolean(
        invite0421DockFlow &&
          !(hasOrganization || workbenchOrgGateReleased) &&
          (activeApp === "todo" ||
            activeApp === "meeting" ||
            activeApp === "disk" ||
            activeApp === "docs" ||
            (activeApp === "schedule" && !schedule0422DrawerDemo)),
      ),
    [
      invite0421DockFlow,
      hasOrganization,
      workbenchOrgGateReleased,
      activeApp,
      schedule0422DrawerDemo,
    ],
  );

  const handleAllAppsDrawerReorder = (reorderedApps: AppItem[]) => {
    handleReorder(reorderedApps.filter((a) => a.id !== "mail"));
  };

  /** 子应用底栏「全部应用」入口：展示当前一级应用图标与标题（与首页底栏 pill 一致） */
  const switcherCurrentApp = React.useMemo(() => {
    if (activeApp === "education") {
      const a = apps.find((x) => x.id === "education") ?? INITIAL_APPS.find((x) => x.id === "education");
      return a
        ? { name: a.name, imageSrc: a.icon.imageSrc ?? "", iconType: a.icon.iconType }
        : undefined;
    }
    if (activeApp === "task") {
      const a = apps.find((x) => x.id === "task") ?? INITIAL_APPS.find((x) => x.id === "task");
      return a
        ? { name: a.name, imageSrc: a.icon.imageSrc ?? "", iconType: a.icon.iconType }
        : undefined;
    }
    if (activeApp === "mail") {
      return {
        name: MAIL_APP_DOCK_ITEM.name,
        imageSrc: MAIL_APP_DOCK_ITEM.icon.imageSrc ?? "",
        iconType: MAIL_APP_DOCK_ITEM.icon.iconType,
      };
    }
    if (activeApp === "schedule") {
      const a = apps.find((x) => x.id === "schedule") ?? INITIAL_APPS.find((x) => x.id === "schedule");
      return a
        ? { name: a.name, imageSrc: a.icon.imageSrc ?? "", iconType: a.icon.iconType }
        : undefined;
    }
    if (activeApp === "organization") {
      const a = apps.find((x) => x.id === "organization") ?? INITIAL_APPS.find((x) => x.id === "organization");
      return a
        ? { name: a.name, imageSrc: a.icon.imageSrc ?? "", iconType: a.icon.iconType }
        : undefined;
    }
    if (activeApp === "employee") {
      const a = apps.find((x) => x.id === "employee") ?? INITIAL_APPS.find((x) => x.id === "employee");
      return a
        ? { name: a.name, imageSrc: a.icon.imageSrc ?? "", iconType: a.icon.iconType }
        : undefined;
    }
    if (activeApp === "todo") {
      const a = apps.find((x) => x.id === "todo") ?? INITIAL_APPS.find((x) => x.id === "todo");
      return a
        ? { name: a.name, imageSrc: a.icon.imageSrc ?? "", iconType: a.icon.iconType }
        : undefined;
    }
    if (activeApp === "meeting") {
      const a = apps.find((x) => x.id === "meeting") ?? INITIAL_APPS.find((x) => x.id === "meeting");
      return a
        ? { name: a.name, imageSrc: a.icon.imageSrc ?? "", iconType: a.icon.iconType }
        : undefined;
    }
    if (activeApp === "disk") {
      const a = apps.find((x) => x.id === "disk") ?? INITIAL_APPS.find((x) => x.id === "disk");
      return a
        ? { name: a.name, imageSrc: a.icon.imageSrc ?? "", iconType: a.icon.iconType }
        : undefined;
    }
    if (activeApp === "docs") {
      return {
        name: DOCS_APP_DOCK_ITEM.name,
        imageSrc: DOCS_APP_DOCK_ITEM.icon.imageSrc ?? "",
        iconType: DOCS_APP_DOCK_ITEM.icon.iconType,
      };
    }
    return undefined;
  }, [activeApp, apps]);

  // 辅助函数：更新当前组织的消息列表（0419 方案：与教育/任务共用主 `messages`，切换应用不断会话）
  const setEducationMessages = React.useCallback((updater: Message[] | ((prev: Message[]) => Message[])) => {
    if (is0419Explore) {
      setMessages((prev) =>
        typeof updater === "function" ? (updater as (p: Message[]) => Message[])(prev) : updater
      );
      return;
    }
    setOrgMessages(prev => {
      const currentMessages = prev[currentOrg] || [];
      const newMessages = typeof updater === 'function' ? updater(currentMessages) : updater;
      return {
        ...prev,
        [currentOrg]: newMessages
      };
    });
  }, [currentOrg, is0419Explore]);

  const [taskOrgMessages, setTaskOrgMessages] = React.useState<Record<string, Message[]>>({});
  const taskMessages = React.useMemo(() => {
    return taskOrgMessages[currentOrg] || [];
  }, [taskOrgMessages, currentOrg]);

  const setTaskMessages = React.useCallback((updater: Message[] | ((prev: Message[]) => Message[])) => {
    if (is0419Explore) {
      setMessages((prev) =>
        typeof updater === "function" ? (updater as (p: Message[]) => Message[])(prev) : updater
      );
      return;
    }
    setTaskOrgMessages((prev) => {
      const currentMessages = prev[currentOrg] || [];
      const newMessages = typeof updater === "function" ? (updater as (p: Message[]) => Message[])(currentMessages) : updater;
      return { ...prev, [currentOrg]: newMessages };
    });
  }, [currentOrg, is0419Explore]);

  /** 0425：主 AI、组织 AI、员工 AI 互相独立；组织/员工应用不复用主会话 `messages` */
  const [organizationMessages0425, setOrganizationMessages0425] = React.useState<Message[]>([]);
  const [employeeMessages0425, setEmployeeMessages0425] = React.useState<Message[]>([]);

  /**
   * 邮箱应用：email0413 单桶 `all`；email0415 / email0417 按「全部 / 个人 / 租户」分桶并与侧栏 mail-scope-* 会话对齐。
   */
  const [mailMessagesByScope, setMailMessagesByScope] = React.useState<Record<string, Message[]>>(() => {
    const seedDigestIfUnread = (): Message[] => {
      if (!getDemoAnyUnreadMail()) return [];
      const now = Date.now();
      const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      return [
        {
          id: `mail-seed-new-digest-${now}`,
          senderId: conversation.user.id,
          content: `${MAIL_NEW_MAIL_DIGEST_MARKER}:{}`,
          timestamp: ts,
          createdAt: now,
          isAfterPrompt: true,
          suppressAvatar: true,
        },
      ];
    };
    let initial: Message[];
    if (taskEntryIsMailDockFamily(taskEntryVariant)) {
      if (mailDemoScenarioId === "unread_on_open" || mailDemoScenarioId === undefined) {
        initial = seedDigestIfUnread();
      } else {
        initial = [];
      }
    } else {
      initial = seedDigestIfUnread();
    }
    return initial.length ? { all: initial } : {};
  });

  const [emailTenantScope, setEmailTenantScope] = React.useState<"all" | "personal" | string>("all");

  const getMailStorageKey = React.useCallback((): string => {
    if (!taskEntryIsEmail0415ScopeFamily(taskEntryVariant)) return "all";
    if (emailTenantScope === "all") return "all";
    if (emailTenantScope === "personal") return "personal";
    return emailTenantScope;
  }, [taskEntryVariant, emailTenantScope]);

  const mailMessages = React.useMemo(
    () =>
      is0419Explore ? messages : mailMessagesByScope[getMailStorageKey()] ?? [],
    [is0419Explore, messages, mailMessagesByScope, getMailStorageKey]
  );

  /**
   * 统一入口 ①：**用户点击 / 发送** 会 **在末尾追加新消息** 时调用（新一轮对话 → 空屏槽位）。
   *   - 必须在对应 `setMessages / setEducationMessages / setTaskMessages / updateMailMessages(append)` **之前** 调用。
   *   - 0419 语境下各子能力共用 `messages.length`；非 0419 按 surface 取对应列表长度。
   *   - **不要** 用于原位置卡片形态切换 / 数据更新（见 `scrollInPlaceMutatedCardToTop`）。
   */
  type NewRoundChatSurface =
    | "main"
    | "education"
    | "task"
    | "mail"
    | "schedule"
    | "organization"
    | "employee"
    | "todo"
    | "meeting"
    | "disk"
    | "docs";
  const beginNewUserChatRound = React.useCallback(
    (surface: NewRoundChatSurface) => {
      const prior = is0419Explore
        ? messages.length
        : surface === "education"
          ? educationMessages.length
          : surface === "task"
            ? taskMessages.length
            : surface === "mail"
              ? mailMessages.length
            : surface === "organization"
                ? organizationMessages0425.length
                : surface === "employee"
                  ? employeeMessages0425.length
                  : messages.length;
      armNewRoundForUserSend(surface === "main" ? null : surface, prior);
    },
    [
      is0419Explore,
      messages,
      educationMessages,
      taskMessages,
      mailMessages,
      organizationMessages0425,
      employeeMessages0425,
      armNewRoundForUserSend,
    ]
  );

  /** 0421 吸顶「受邀待办」：在当前主 AI 会话追加与 IM 点卡一致的后续流程 */
  const appendInvite0421InvitedTodoChat = React.useCallback(
    (kind: "org" | "edu") => {
      beginNewUserChatRound("main");
      const now = Date.now();
      const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages((prev) => [
        ...prev,
        {
          id: `u-invite0421-${kind}-${now}`,
          senderId: currentUser.id,
          content:
            kind === "org"
              ? INVITE0421_ORG_PROCESS_PG_INVITE_ACTION_LABEL
              : INVITE0421_EDU_PROCESS_XIAOCE_INVITE_ACTION_LABEL,
          timestamp: ts,
          createdAt: now,
          isAfterPrompt: true,
        },
        {
          id: `a-invite0421-${kind}-${now}`,
          senderId: conversation.user.id,
          content:
            kind === "org"
              ? INVITE0421_ORG_EMPLOYEE_ONBOARD_MARKER
              : INVITE0421_EDU_STUDENT_INVITE_FLOW_MARKER,
          timestamp: ts,
          createdAt: now + 1,
          isAfterPrompt: true,
        },
      ]);
      /** 0421 受邀页：待办点入后已在主会话插入新一轮，吸顶卡与 `armNewRoundForUserSend` 对齐收起 */
      if (invite0421DockFlow) {
        setIsTaskCardExpanded(false);
      }
    },
    [beginNewUserChatRound, conversation.user.id, invite0421DockFlow],
  );

  const invite0421ShowOrgInvitedChip = invite0421NewUserFlow && !hasOrganization;
  const invite0421ShowEduInvitedChip =
    invite0421EduStudentFlow && !invite0421EduInviteFlow?.joined;
  const invite0421PinnedInvitedTodos =
    invite0421ShowOrgInvitedChip || invite0421ShowEduInvitedChip;
  const invite0421OrgTodoTitle = invite0421InvitedTodoOrgTitle();
  const invite0421EduTodoTitle = invite0421InvitedTodoEduTitle();

  /** 0421-新用户-受邀加入组织：入组后顶栏下拉仅展示刚加入的这一家企业 */
  const invite0421JoinedOrganizationList = React.useMemo((): Organization[] => {
    if (invite0421NewUserFlow && hasOrganization) {
      return [
        {
          id: INVITE0421_JOINED_ORG_DEMO_ID,
          name: INVITE0421_ORG_COMPANY_NAME,
          icon: orgIcon,
          memberCount: 2,
          description: "演示：受邀加入的组织",
        },
      ];
    }
    return AVAILABLE_ORGANIZATIONS;
  }, [invite0421NewUserFlow, hasOrganization]);

  const schedule0422NavOrganizations = React.useMemo((): Organization[] => {
    if (!schedule0422DrawerDemo) return invite0421JoinedOrganizationList;
    return [
      {
        id: SCHEDULE_0422_ORG_ID_MING_SHI,
        name: "名师教育",
        icon: orgIcon,
        memberCount: 120,
        description: "演示组织",
      },
      {
        id: SCHEDULE_0422_ORG_ID_PERSONAL,
        name: "个人",
        icon: orgIcon,
        memberCount: 1,
        description: "个人",
      },
    ];
  }, [schedule0422DrawerDemo, invite0421JoinedOrganizationList]);

  const interactionRulesOrgNavDemo = React.useMemo(
    () => demoInstructionShell && organizationManagement0425Demo,
    [demoInstructionShell, organizationManagement0425Demo],
  );

  React.useEffect(() => {
    if (!interactionRulesOrgNavDemo || hasOrganization) return;
    setCurrentOrg((prev) => {
      if (prev !== NO_ORG_MESSAGE_SCOPE) return prev;
      return schedule0422NavOrganizations[0]?.id ?? "xiaoce";
    });
  }, [interactionRulesOrgNavDemo, hasOrganization, schedule0422NavOrganizations]);

  React.useEffect(() => {
    if (!schedule0422DrawerDemo) return;
    setCurrentOrg(SCHEDULE_0422_ORG_ID_MING_SHI);
  }, [schedule0422DrawerDemo]);

  const schedule0422OrgScope = React.useMemo(
    () => (currentOrg === SCHEDULE_0422_ORG_ID_PERSONAL ? "personal" as const : "org" as const),
    [currentOrg],
  );

  React.useEffect(() => {
    if (!(invite0421NewUserFlow && hasOrganization)) return;
    setCurrentOrg((prev) =>
      prev === INVITE0421_JOINED_ORG_DEMO_ID ? prev : INVITE0421_JOINED_ORG_DEMO_ID,
    );
  }, [invite0421NewUserFlow, hasOrganization]);

  const secondaryCtxToRoundSurface = React.useCallback(
    (ctx?: "education" | "task" | "mail"): NewRoundChatSurface =>
      ctx === "education" ? "education" : ctx === "task" ? "task" : ctx === "mail" ? "mail" : "main",
    []
  );

  const resolveWorkbenchServiceLabel = React.useCallback(
    (appId: string): string => {
      if (appId === "mail") return MAIL_APP_DOCK_ITEM.name;
      const fromAt = apps.find((a) => a.id === appId) ?? INITIAL_APPS.find((a) => a.id === appId);
      return fromAt?.name ?? appId;
    },
    [apps],
  );

  /**
   * 工作台应用入口：无组织且未解除门闩时，回到主对话并插入「创建/加入组织」引导，不进入子应用。
   * 抽屉内任意应用均走此逻辑；底栏仅教育 / 任务 /（邮箱方案下的）邮箱会调用。
   */
  const tryEnterWorkbenchApp = React.useCallback(
    (appId: string) => {
      const dockMail = taskEntryIsMailDockFamily(taskEntryVariant) && appId === "mail";
      const invite0421NoOrgPersonalSurface =
        invite0421DockFlow &&
        !(hasOrganization || workbenchOrgGateReleased) &&
        (appId === "schedule" ||
          appId === "todo" ||
          appId === "meeting" ||
          appId === "disk" ||
          appId === "docs" ||
          appId === "mail");
      const opensPrimarySurface =
        appId === "education" ||
        appId === "task" ||
        (organizationManagement0425Demo && appId === "employee") ||
        dockMail ||
        (organizationManagement0425Demo && appId === "organization") ||
        (schedule0422DrawerDemo && appId === "schedule") ||
        invite0421NoOrgPersonalSurface;

      const invite0421NoOrgBlock =
        invite0421DockFlow &&
        !(hasOrganization || workbenchOrgGateReleased) &&
        INVITE0421_WORKBENCH_APP_IDS.has(appId);
      const simple0421Block =
        !invite0421DockFlow &&
        simpleOrgOnboarding0421 &&
        !(hasOrganization || workbenchOrgGateReleased) &&
        WORKBENCH_APP_IDS_REQUIRING_ORG_0421.has(appId);
      const legacyNoOrgBlock =
        !invite0421DockFlow &&
        !simpleOrgOnboarding0421 &&
        !(hasOrganization || workbenchOrgGateReleased);
      const blockWithoutOrg =
        invite0421NoOrgBlock || simple0421Block || legacyNoOrgBlock;

      if (blockWithoutOrg) {
        beginNewUserChatRound("main");
        const now = Date.now();
        const label = resolveWorkbenchServiceLabel(appId);
        const payload = `${WORKBENCH_ORG_GATE_PROMPT_MARKER}:${JSON.stringify({
          appId,
          label,
          ...(invite0421DockFlow ? { invite0421NewUser: true as const } : {}),
        })}`;
        setMessages((prev) => [
          ...prev,
          {
            id: `wb-org-gate-${now}`,
            senderId: conversation.user.id,
            content: payload,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            createdAt: now,
            isAfterPrompt: true,
          },
        ]);
        setActiveApp(null);
        setSecondaryHistoryOpen(false);
        setIsAllAppsOpen(false);
        return false;
      }

      if (opensPrimarySurface) {
        setActiveApp(appId);
        setSecondaryHistoryOpen(false);
        setIsAllAppsOpen(false);
        return true;
      }

      setIsAllAppsOpen(false);
      return true;
    },
    [
      hasOrganization,
      workbenchOrgGateReleased,
      simpleOrgOnboarding0421,
      invite0421DockFlow,
      taskEntryVariant,
      organizationManagement0425Demo,
      schedule0422DrawerDemo,
      beginNewUserChatRound,
      conversation.user.id,
      resolveWorkbenchServiceLabel,
    ],
  );

  /**
   * 0421 学生受邀：打开教育应用（节点已由 `submitted` effect 写入时可幂等跳过写入）。
   * - 主 AI 点「进入张小宝教育空间」：先 `tryEnter`，再通知父级 `familyReady`；
   * - IM 完成入口：依赖下方 effect 在 `familyReady` 后调用；`ref` 防重复 tryEnter。
   */
  const bootstrapInvite0421EduStudentZhangFamilySpaceIfNeeded = React.useCallback(() => {
    if (!invite0421EduStudentFlow) return;
    if (invite0421EduStudentFamilyBootstrappedRef.current) return;
    invite0421EduStudentFamilyBootstrappedRef.current = true;
    setEducationSpaceNodes((prev) => {
      if (prev.some((n) => n.id === EDU_STUDENT_ZHANG_FAMILY_SPACE_ID)) return prev;
      return [
        ...prev,
        {
          id: EDU_STUDENT_ZHANG_FAMILY_SPACE_ID,
          name: "张小宝教育空间",
          kind: "family" as const,
        },
      ];
    });
    setCurrentEducationSpaceId(EDU_STUDENT_ZHANG_FAMILY_SPACE_ID);
    window.setTimeout(() => {
      tryEnterWorkbenchApp("education");
    }, 0);
  }, [invite0421EduStudentFlow, tryEnterWorkbenchApp]);

  React.useEffect(() => {
    if (!invite0421DockFlow || !invite0421ShellGateRequest) return;
    if (hasOrganization || workbenchOrgGateReleased) {
      onInvite0421ShellGateRequestConsumed?.();
      return;
    }
    const { id } = invite0421ShellGateRequest;
    if (id === "education" || id === "more") {
      onInvite0421ShellGateRequestConsumed?.();
      return;
    }
    beginNewUserChatRound("main");
    const now = Date.now();
    const label =
      INVITE0421_SHELL_SHORTCUT_LABEL[id] ?? String(id);
    const payload = `${WORKBENCH_ORG_GATE_PROMPT_MARKER}:${JSON.stringify({
      appId: "task",
      label,
      invite0421NewUser: true as const,
    })}`;
    setMessages((prev) => [
      ...prev,
      {
        id: `invite0421-shell-gate-${now}`,
        senderId: conversation.user.id,
        content: payload,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: now,
        isAfterPrompt: true,
      },
    ]);
    onInvite0421ShellGateRequestConsumed?.();
  }, [
    invite0421DockFlow,
    invite0421ShellGateRequest,
    hasOrganization,
    workbenchOrgGateReleased,
    beginNewUserChatRound,
    conversation.user.id,
    onInvite0421ShellGateRequestConsumed,
  ]);

  React.useEffect(() => {
    if (!invite0421DockFlow || invite0421OpenEducationNonce === 0) return;
    if (invite0421OpenEducationNonce === invite0421OpenEducationHandledNonceRef.current) return;
    invite0421OpenEducationHandledNonceRef.current = invite0421OpenEducationNonce;
    tryEnterWorkbenchApp("education");
  }, [invite0421DockFlow, invite0421OpenEducationNonce, tryEnterWorkbenchApp]);

  React.useEffect(() => {
    if (!invite0421EduStudentFlow) {
      invite0421EduStudentFamilyBootstrappedRef.current = false;
      return;
    }
    if (!invite0421EduStudentFamilyReady) return;
    bootstrapInvite0421EduStudentZhangFamilySpaceIfNeeded();
  }, [
    invite0421EduStudentFlow,
    invite0421EduStudentFamilyReady,
    bootstrapInvite0421EduStudentZhangFamilySpaceIfNeeded,
  ]);

  /**
   * 统一入口 ②：**原位置切换卡片形态 / 更新卡片数据**（非新一轮）。
   *   - 用法：`skip` 下一次列表级自动滚动，`patchMessages((p) => p.map(...))` 后两帧 rAF 将该卡片顶对齐可视顶。
   *   - 典型场景：任务卡「浏览 ↔ 编辑」内联切换、表单提交后变只读、卡片数据局部更新。
   *   - 该路径 **不武装新一轮槽位**；被更新的卡片仍在原轮次里，与上一条用户消息属同一「轮」。
   */
  const scrollInPlaceMutatedCardToTop = React.useCallback(
    (messageId: string) => {
      skipNextChatLayoutScrollRef.current = true;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollToMessageById(messageId));
      });
    },
    [scrollToMessageById]
  );

  const updateMailMessages = React.useCallback(
    (updater: Message[] | ((prev: Message[]) => Message[])) => {
      if (is0419Explore) {
        setMessages((prev) =>
          typeof updater === "function" ? (updater as (p: Message[]) => Message[])(prev) : updater
        );
        return;
      }
      const key = getMailStorageKey();
      setMailMessagesByScope((prev) => {
        const cur = prev[key] ?? [];
        const next = typeof updater === "function" ? (updater as (p: Message[]) => Message[])(cur) : updater;
        return { ...prev, [key]: next };
      });
    },
    [getMailStorageKey, is0419Explore]
  );

  const appendMailMessageToScopeKey = React.useCallback((storageKey: string, msg: Message) => {
    if (is0419Explore) {
      setMessages((prev) => [...prev, msg]);
      return;
    }
    setMailMessagesByScope((prev) => ({
      ...prev,
      [storageKey]: [...(prev[storageKey] ?? []), msg],
    }));
  }, [is0419Explore]);

  const defaultBusinessScopeForMail = React.useMemo(
    () =>
      emailTenantScope !== "all" && emailTenantScope !== "personal"
        ? emailTenantScope
        : AVAILABLE_ORGANIZATIONS[0]?.id ?? "xiaoce",
    [emailTenantScope]
  );

  const mailDockApps = React.useMemo(
    () =>
      taskEntryIsEmail0415ScopeFamily(taskEntryVariant)
        ? MAIL_DOCK_APPS_EMAIL0415
        : MAIL_DOCK_APPS,
    [taskEntryVariant]
  );

  const mailSecondaryDockApps = React.useMemo(
    () => mailDockApps.map(mapMailDockRowToSecondaryApp),
    [mailDockApps],
  );

  const appendMailAssistantMessage = React.useCallback(
    (msg: Message) => {
      updateMailMessages((prev) => [...prev, msg]);
    },
    [updateMailMessages]
  );

  const handlePickTenantForMailAdmin = React.useCallback(
    (
      tenantId: string,
      pending: MailAdminPanelKind,
      sourceMessageId: string,
      sourceConversationId: string
    ) => {
      const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const now = Date.now();
      const org = AVAILABLE_ORGANIZATIONS.find((o) => o.id === tenantId);
      setEmailTenantScope(tenantId);
      onSelect?.(mailScopeToConversationId(tenantId));
      const botMsg: Message = {
        id: `bot-mail-admin-panel-${now}`,
        senderId: conversation.user.id,
        content: `${MAIL_MAIL_ADMIN_PANEL_MARKER}:${JSON.stringify({
          kind: pending,
          tenantId,
          tenantName: org?.name ?? tenantId,
        })}`,
        timestamp: ts,
        createdAt: now,
        isAfterPrompt: true,
        operationSource: {
          cardTitle: "邮箱管理",
          sourceMessageId,
          sourceDetailLabel: pending === "business" ? "管理业务邮箱" : "管理员工邮箱",
          sourceConversationId,
        },
      };
      setTimeout(() => {
        appendMailMessageToScopeKey(tenantId, botMsg);
      }, 0);
    },
    [appendMailMessageToScopeKey, conversation.user.id, onSelect]
  );

  /** 进入邮箱应用（0415）：侧栏非 mail-scope 会话时，切到与顶栏租户一致的邮箱会话 */
  React.useEffect(() => {
    if (!taskEntryIsEmail0415ScopeFamily(taskEntryVariant) || activeApp !== "mail" || !onSelect)
      return;
    if (conversationIdToMailScope(selectedId ?? "") !== null) return;
    onSelect(mailScopeToConversationId(emailTenantScope));
  }, [activeApp, taskEntryVariant, emailTenantScope, selectedId, onSelect]);

  /** 侧栏切换 mail-scope 会话时同步顶栏租户 */
  React.useEffect(() => {
    if (!taskEntryIsEmail0415ScopeFamily(taskEntryVariant) || activeApp !== "mail") return;
    const mapped = conversationIdToMailScope(selectedId ?? "");
    if (mapped === null) return;
    setEmailTenantScope((prev) => (prev !== mapped ? mapped : prev));
  }, [selectedId, activeApp, taskEntryVariant]);

  /** 首屏行动建议：我的邮箱 / 业务邮箱 / 写邮件（与列表卡解耦） */
  const appendMailWelcomeAction = React.useCallback(
    (kind: MailWelcomeActionKind) => {
      beginNewUserChatRound("mail");
      const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const now = Date.now();
      const opFromDigest = (prev: Message[]): MessageOperationSource | undefined => {
        const digest = [...prev].reverse().find((m) => m.content.startsWith(MAIL_NEW_MAIL_DIGEST_MARKER));
        if (!digest) return undefined;
        return { cardTitle: "收到新邮件", sourceMessageId: digest.id };
      };
      if (kind === "personal_inbox") {
        updateMailMessages((prev) => {
          const op = opFromDigest(prev);
          return [
            ...prev,
            {
              id: `mail-welcome-personal-${now}`,
              senderId: conversation.user.id,
              content: `${MAIL_MAILBOX_MARKER}:${JSON.stringify({ folder: "inbox", scope: "personal" })}`,
              timestamp: ts,
              createdAt: now,
              isAfterPrompt: true,
              ...(op ? { operationSource: { ...op, sourceDetailLabel: "我的邮箱" } } : {}),
            },
          ];
        });
      } else if (kind === "business_inbox") {
        const bizScope =
          emailTenantScope !== "all" && emailTenantScope !== "personal"
            ? emailTenantScope
            : AVAILABLE_ORGANIZATIONS[0]?.id ?? "xiaoce";
        updateMailMessages((prev) => {
          const op = opFromDigest(prev);
          return [
            ...prev,
            {
              id: `mail-welcome-biz-${now}`,
              senderId: conversation.user.id,
              content: `${MAIL_MAILBOX_MARKER}:${JSON.stringify({
                variant: "business_hub",
                folder: "inbox",
                scope: bizScope,
              })}`,
              timestamp: ts,
              createdAt: now,
              isAfterPrompt: true,
              ...(op ? { operationSource: { ...op, sourceDetailLabel: "业务邮箱" } } : {}),
            },
          ];
        });
      } else {
        updateMailMessages((prev) => {
          const op = opFromDigest(prev);
          return [
            ...prev,
            {
              id: `mail-welcome-compose-${now}`,
              senderId: conversation.user.id,
              content: `${MAIL_COMPOSE_ENTRY_MARKER}:{}`,
              timestamp: ts,
              createdAt: now,
              isAfterPrompt: true,
              ...(op ? { operationSource: { ...op, sourceDetailLabel: "写邮件" } } : {}),
            },
          ];
        });
      }
    },
    [beginNewUserChatRound, conversation.user.id, emailTenantScope, updateMailMessages]
  );

  /** 对话卡片提交的子任务 / 关联子任务，合并回任务详情卡 */
  const [taskSubtaskExtrasById, setTaskSubtaskExtrasById] = React.useState<Record<string, SubtaskRow[]>>({});

  const appendTaskSubtasksForChat = React.useCallback((taskId: string, rows: SubtaskRow[]) => {
    setTaskSubtaskExtrasById((prev) => ({
      ...prev,
      [taskId]: [...(prev[taskId] ?? []), ...rows],
    }));
  }, []);

  const didApplyInitialApp = React.useRef(false);
  React.useEffect(() => {
    if (!initialActiveApp || didApplyInitialApp.current) return;
    tryEnterWorkbenchApp(initialActiveApp);
    didApplyInitialApp.current = true;
  }, [initialActiveApp, tryEnterWorkbenchApp]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (longPressIndex !== index) {
      e.preventDefault();
      return;
    }
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index.toString());
    }
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newApps = [...apps];
    const draggedApp = newApps[draggedIndex];
    newApps.splice(draggedIndex, 1);
    newApps.splice(index, 0, draggedApp);
    
    const reorderedApps = newApps.map((app, i) => ({
      ...app,
      order: i + 1,
    }));
    
    setApps(reorderedApps);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null) {
      saveAppsToStorage(apps);
    }
    setDraggedIndex(null);
  };

  /** 切换侧栏会话：始终按 id 拉取该会话的 messages */
  React.useEffect(() => {
    const next = invite0421DockFlow && !is0419Explore ? [] : conversation.messages;
    setMessages(next);
    if (next && next.length > 0) {
      setIsPinnedTaskExpanded(false);
    } else {
      setIsPinnedTaskExpanded(true);
    }
    setNewRoundSlot(null);
    newRoundScrollAppliedRef.current = false;
    sameRoundScrollSuppressRef.current = null;
    setInvite0421EmployeeAwaitingDemoApproval(false);
    setInteractionRulesOrgCardMessageId(null);
    setInteractionRulesOrgCardResetKey(0);
  }, [conversation.id, invite0421DockFlow, is0419Explore]);

  /**
   * 非 0419：外部 `conversation.messages` 变化时同步到本地。
   * 0419 下子窗为消息源，通过 `on0419SessionCommit` 写回父级，避免与 commit 形成 setState 环路。
   */
  React.useEffect(() => {
    if (is0419Explore) return;
    if (invite0421DockFlow) return;
    setMessages(conversation.messages);
    if (conversation.messages && conversation.messages.length > 0) {
      setIsPinnedTaskExpanded(false);
    } else {
      setIsPinnedTaskExpanded(true);
    }
  }, [conversation.messages, is0419Explore, invite0421DockFlow]);

  React.useLayoutEffect(() => {
    if (skipNextChatLayoutScrollRef.current) {
      skipNextChatLayoutScrollRef.current = false;
      return;
    }
    if (newRoundSlot) {
      const slotMatches =
        newRoundSlot.armedIs0419Explore === is0419Explore &&
        newRoundSlot.armedActiveApp === activeApp;
      if (slotMatches) {
        return;
      }
    }
    const list = is0419Explore
      ? messages
      : activeApp === "education"
        ? educationMessages
        : activeApp === "task"
          ? taskMessages
          : activeApp === "mail"
            ? mailMessages
            : activeApp === "organization" && organizationManagement0425Demo
              ? organizationMessages0425
              : activeApp === "employee" && organizationManagement0425Demo
                ? employeeMessages0425
                : messages;

    const sup = sameRoundScrollSuppressRef.current;
    if (sup && list.length > 0) {
      const listCtxOk =
        sup.armedIs0419Explore === is0419Explore && sup.armedActiveApp === activeApp;
      const lastIdx = list.length - 1;
      if (listCtxOk && lastIdx >= sup.minOrdinal) {
        return;
      }
    }

    const last = list[list.length - 1];
    if (last && messageContentIsInChatSurfaceCard(last.content)) {
      const anchor = latestMessageRowRef.current;
      if (anchor) {
        scrollLatestCardRowToTop(anchor);
      } else {
        /** 邮箱等子层 ref 偶发未挂载时退回底部，避免不滚动 */
        scrollToBottom();
      }
    } else {
      scrollToBottom();
    }
  }, [
    messages,
    educationMessages,
    taskOrgMessages,
    mailMessages,
    organizationMessages0425,
    employeeMessages0425,
    organizationManagement0425Demo,
    activeApp,
    is0419Explore,
    scrollToBottom,
    scrollLatestCardRowToTop,
    newRoundSlot,
    activeApp,
    is0419Explore,
  ]);

  /** 新一轮对话：先动画滚至槽内底（留白），再动画将槽顶对齐吸顶卡片底边（共 300ms） */
  React.useLayoutEffect(() => {
    if (!newRoundSlot) {
      newRoundScrollAppliedRef.current = false;
      if (chatScrollAlignRafRef.current !== null) {
        cancelAnimationFrame(chatScrollAlignRafRef.current);
        chatScrollAlignRafRef.current = null;
      }
      return;
    }
    if (
      newRoundSlot.armedIs0419Explore !== is0419Explore ||
      newRoundSlot.armedActiveApp !== activeApp
    ) {
      return;
    }
    const listLen = is0419Explore
      ? messages.length
      : activeApp === "education"
        ? educationMessages.length
        : activeApp === "task"
          ? taskMessages.length
          : activeApp === "mail"
            ? mailMessages.length
            : activeApp === "organization" && organizationManagement0425Demo
              ? organizationMessages0425.length
              : activeApp === "employee" && organizationManagement0425Demo
                ? employeeMessages0425.length
                : messages.length;
    if (listLen <= newRoundSlot.startMessageIndex) return;
    if (newRoundScrollAppliedRef.current) return;

    const container = chatContainerRef.current;
    const slotEl = newRoundShellRef.current;
    if (!container || !slotEl) return;

    const halfMs = CHAT_SCROLL_ALIGN_DURATION_MS / 2;
    const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);

    const runPhase2 = () => {
      const c = chatContainerRef.current;
      const s = newRoundShellRef.current;
      const p = pinnedTaskStickyRef.current;
      if (!c) {
        newRoundScrollAppliedRef.current = true;
        return;
      }
      /**
       * 保险：若槽位在 phase1 期间被 onContentExceedsSlot 释放，shellRef 已 null，
       * 退回「最后一条消息行顶对齐吸顶下缘」，保证本轮新卡片顶部对齐视口顶。
       */
      if (!s) {
        const anchor = latestMessageRowRef.current;
        if (anchor) scrollLatestCardRowToTop(anchor);
        newRoundScrollAppliedRef.current = true;
        return;
      }
      const alignTarget = computeScrollTopToAlignElementTopBelowPin(c, s, p);
      animateContainerScrollTop(c, alignTarget, halfMs, chatScrollAlignRafRef, () => {
        newRoundScrollAppliedRef.current = true;
      });
    };

    animateContainerScrollTop(container, maxScroll, halfMs, chatScrollAlignRafRef, runPhase2);
  }, [
    newRoundSlot,
    messages,
    educationMessages,
    taskMessages,
    mailMessages,
    organizationMessages0425,
    employeeMessages0425,
    organizationManagement0425Demo,
    activeApp,
    is0419Explore,
  ]);

  React.useEffect(() => {
    if (!is0419Explore || !on0419SessionCommit) return;
    on0419SessionCommit(conversation.id, { messages });
  }, [messages, conversation.id, is0419Explore, on0419SessionCommit]);

  /** 独立浮窗中的教育消息列表：与主界面 activeApp 无关，需单独对齐卡片顶部 */
  React.useLayoutEffect(() => {
    if (!floatingApps.some((id) => id === "education")) return;
    const last = educationMessages[educationMessages.length - 1];
    if (last && messageContentIsInChatSurfaceCard(last.content)) {
      scrollLatestCardRowToTop(floatingEducationRowRef.current);
    }
  }, [educationMessages, floatingApps, scrollLatestCardRowToTop]);

  // Auto-collapse task card when chat content fills the container
  React.useEffect(() => {
    if (is0419Explore) return;
    if (!chatContainerRef.current || activeApp !== null) return;
    
    // Skip auto-collapse on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Only auto-collapse if there are enough messages (at least 3)
    if (messages.length < 3) return;
    
    const container = chatContainerRef.current;
    const checkHeight = () => {
      // Check if content height exceeds visible height
      // Only auto-collapse if user hasn't manually interacted
      if (container.scrollHeight > container.clientHeight && isTaskCardExpanded) {
        setIsTaskCardExpanded(false);
      }
    };
    
    // Check immediately and after content changes
    checkHeight();
    const timeoutId = setTimeout(checkHeight, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages, activeApp, is0419Explore]) // Removed isTaskCardExpanded from dependency array to prevent loop

  React.useEffect(() => {
    if (!interactionRulesNaturalDialogDemoNonce) return
    setInputValue(INTERACTION_RULES_NATURAL_DIALOG_DEMO_PROMPT)
    interactionRulesNaturalDialogArmRef.current = true
    interactionRulesBusinessCardDemoArmRef.current = false
    const id = requestAnimationFrame(() => {
      document.getElementById("main-ai-composer-input")?.focus()
    })
    return () => cancelAnimationFrame(id)
  }, [interactionRulesNaturalDialogDemoNonce])

  React.useEffect(() => {
    if (!interactionRulesBusinessCardDemoNonce) return
    setInputValue(INTERACTION_RULES_BUSINESS_CARD_COMMAND_DEMO_PROMPT)
    interactionRulesBusinessCardDemoArmRef.current = true
    interactionRulesNaturalDialogArmRef.current = false
    const id = requestAnimationFrame(() => {
      document.getElementById("main-ai-composer-input")?.focus()
    })
    return () => cancelAnimationFrame(id)
  }, [interactionRulesBusinessCardDemoNonce])

  React.useEffect(() => {
    if (!permissionEditCard0424Demo) {
      permission0424InputPrefilledRef.current = false
      return
    }
    if (activeApp !== null) return
    if (permission0424InputPrefilledRef.current) return
    permission0424InputPrefilledRef.current = true
    setInputValue(PERMISSION_EDIT_CARD_0424_DEFAULT_INPUT_PROMPT)
    const id = requestAnimationFrame(() => {
      document.getElementById("main-ai-composer-input")?.focus()
    })
    return () => cancelAnimationFrame(id)
  }, [permissionEditCard0424Demo, activeApp])

  React.useEffect(() => {
    if (!organizationManagement0425Demo) {
      organization0425InputPrefilledRef.current = false
      return
    }
    if (activeApp !== null) return
    if (organization0425InputPrefilledRef.current) return
    organization0425InputPrefilledRef.current = true
    setInputValue(ORGANIZATION_MANAGEMENT_0425_DEFAULT_INPUT_PROMPT)
    const id = requestAnimationFrame(() => {
      document.getElementById("main-ai-composer-input")?.focus()
    })
    return () => cancelAnimationFrame(id)
  }, [organizationManagement0425Demo, activeApp])

  React.useEffect(() => {
    if (!organizationManagement0425Demo || !organizationManagement0425CommandNonce) return
    setInputValue(ORGANIZATION_MANAGEMENT_0425_USER_TRIGGER)
    const id = requestAnimationFrame(() => {
      document.getElementById("main-ai-composer-input")?.focus()
    })
    return () => cancelAnimationFrame(id)
  }, [organizationManagement0425Demo, organizationManagement0425CommandNonce])

  React.useEffect(() => {
    if (!demoInstructionShell || !organizationManagement0425Demo) return;
    if (!interactionRulesMainAiOrgDemoNonce) return;
    if (interactionRulesMainAiOrgDemoNonce <= lastInteractionRulesOrgSwitcherDemoNonceRef.current)
      return;
    lastInteractionRulesOrgSwitcherDemoNonceRef.current = interactionRulesMainAiOrgDemoNonce;

    setActiveApp(null);
    setSchedule0422DrawerOpen(false);
    setSecondaryHistoryOpen(false);
    setInteractionRulesOrgCardResetKey(0);

    const now = Date.now();
    const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const botId = `org-management-0425-bot-${now}`;
    setInteractionRulesOrgCardMessageId(botId);
    beginNewUserChatRound("main");
    setMessages((prev) => [
      ...prev,
      {
        id: `org-management-0425-user-${now}`,
        senderId: currentUser.id,
        content: ORGANIZATION_MANAGEMENT_0425_USER_TRIGGER,
        timestamp: ts,
        createdAt: now,
      },
      {
        id: botId,
        senderId: conversation.user.id,
        content: ORGANIZATION_MANAGEMENT_0425_MARKER,
        timestamp: ts,
        createdAt: now + 1,
        isAfterPrompt: true,
      },
    ]);
  }, [
    demoInstructionShell,
    organizationManagement0425Demo,
    interactionRulesMainAiOrgDemoNonce,
    beginNewUserChatRound,
    conversation.user.id,
  ]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    if (activeApp !== null) {
      interactionRulesNaturalDialogArmRef.current = false
      interactionRulesBusinessCardDemoArmRef.current = false
    }

    // Auto-collapse pinned task card when user sends a message
    setIsPinnedTaskExpanded(false);

    const newUserMessage: Message = {
      id: `new-${Date.now()}`,
      senderId: currentUser.id,
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now()
    }

    if (activeApp === null && interactionRulesBusinessCardDemoArmRef.current) {
      interactionRulesBusinessCardDemoArmRef.current = false
      beginNewUserChatRound("main")
      setMessages((prev) => [...prev, newUserMessage])
      setInputValue("")
      const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      const now = Date.now()
      setTimeout(() => {
        const cardData = JSON.stringify({
          title: "已识别：创建组织",
          description:
            "（规范文档演示）系统从自然语言中抽出业务意图后，可在同一对话流中挂载交互卡片，承载下一步的结构化操作。",
          detail:
            "下面为通用信息卡示例（演示数据，非真实提交）：\n• 与规范「3.2 交互卡片」层对应\n• 实际产品中此处常为表单卡、列表卡或任务卡等",
          imageSrc: organizationIcon,
        })
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-ir-biz-card-${now}`,
            senderId: conversation.user.id,
            content: `<<<RENDER_GENERIC_CARD>>>:${cardData}`,
            timestamp: ts,
            createdAt: now,
            isAfterPrompt: true,
          },
        ])
      }, 480)
      return
    }

    if (activeApp === 'education') {
      beginNewUserChatRound("education");
      const updatedMessages = [...educationMessages, newUserMessage];
      setEducationMessages(updatedMessages);
      setInputValue("");
      
      // Mock education response
      setTimeout(() => {
        const cardData = JSON.stringify({
          title: "教育助手欢迎您",
          description: "我是您的专属教育AI助手。我可以帮您排课、管理商品、处理成员信息以及财务报表。您可以直接点击下方的菜单开启高效管理。",
          detail: "🌟 推荐操作：\n1. 点击「课程管理」-「课程履约」\n2. 点击「成员管理」-「学生管理」",
          imageSrc: educationIcon
        });
        const botResponse: Message = {
          id: `bot-${Date.now()}`,
          senderId: conversation.user.id,
          content: `<<<RENDER_GENERIC_CARD>>>:${cardData}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          createdAt: Date.now()
        }
        setEducationMessages(prev => [...prev, botResponse])
      }, 600)
      return;
    }

    if (activeApp === "task") {
      beginNewUserChatRound("task");
      const latestTaskId = findLatestTaskContextId(taskMessages);
      const cmd = parseTaskTextCommand(inputValue, { latestTaskId });
      setTaskMessages((prev) => [...prev, newUserMessage]);
      setInputValue("");
      setTimeout(() => {
        const ts = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const now = Date.now();
        if (cmd) {
          let cardMsg: Message;
          if (cmd.type === "task_table") {
            cardMsg = {
              id: `bot-task-table-${now}`,
              senderId: conversation.user.id,
              content: `${TASK_TABLE_MARKER}:${JSON.stringify({ filterHint: cmd.filterHint })}`,
              timestamp: ts,
              createdAt: now,
              isAfterPrompt: true,
            };
          } else if (cmd.type === "static_marker") {
            const content =
              cmd.marker === "create_task"
                ? CREATE_TASK_FORM_MARKER
                : cmd.marker === "filter"
                  ? TASK_FILTER_MARKER
                  : TASK_SETTINGS_MARKER;
            cardMsg = {
              id: `bot-task-static-${now}`,
              senderId: conversation.user.id,
              content,
              timestamp: ts,
              createdAt: now,
              isAfterPrompt: true,
            };
          } else {
            cardMsg = {
              id: `bot-task-hub-${now}`,
              senderId: conversation.user.id,
              content: `${TASK_HUB_CARD_MARKER}:${JSON.stringify({ id: cmd.taskId, hub: cmd.hub })}`,
              timestamp: ts,
              createdAt: now,
              isAfterPrompt: true,
            };
          }
          setTaskMessages((prev) => [...prev, cardMsg]);
        } else {
          const botResponse: Message = {
            id: `bot-task-fallback-${now}`,
            senderId: conversation.user.id,
            content: buildTaskCommandFallbackReply(),
            timestamp: ts,
            createdAt: now,
            isAfterPrompt: true,
          };
          setTaskMessages((prev) => [...prev, botResponse]);
        }
      }, 450);
      return;
    }

    if (activeApp === "mail") {
      beginNewUserChatRound("mail");
      const userMailId = newUserMessage.id;
      updateMailMessages((prev) => [...prev, newUserMessage]);
      setInputValue("");
      setTimeout(() => {
        const ts = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const now = Date.now();
        const botResponse: Message = {
          id: `bot-mail-fallback-${now}`,
          senderId: conversation.user.id,
          content:
            taskEntryVariant === "email0417"
              ? "可以描述你要找的邮件，或使用底部快捷入口「收发邮件」「我的邮箱」「业务邮箱」「邮箱设置」「邮箱管理」；点击列表中的邮件会在对话中以卡片查看正文（演示）。"
              : taskEntryVariant === "email0415"
                ? "可以描述你要找的邮件，或使用底部快捷入口「收发邮件」「我的邮箱」「业务邮箱」「邮箱设置」「邮箱管理」；点击列表中的邮件会在右侧抽屉中查看正文（演示）。"
                : "可以描述你要找的邮件，或使用底部快捷入口「收发邮件」「我的邮箱」「业务邮箱」「邮箱设置」；点击列表中的邮件会在右侧抽屉中查看正文（演示）。",
          timestamp: ts,
          createdAt: now,
          isAfterPrompt: true,
          operationSource: {
            cardTitle: "对话",
            sourceMessageId: userMailId,
          },
        };
        updateMailMessages((prev) => [...prev, botResponse]);
      }, 450);
      return;
    }

    if (activeApp === "schedule" && schedule0422DrawerDemo) {
      beginNewUserChatRound("schedule");
      setMessages((prev) => [...prev, newUserMessage]);
      setInputValue("");
      return;
    }

    const updatedMessages = [...messages, newUserMessage];
    
    // Check for commands
    const isPersonalInfoCommand = PERSONAL_INFO_COMMANDS.some(cmd => 
      inputValue.toLowerCase().includes(cmd.toLowerCase())
    )
    const isCreateEmailCommand = CREATE_EMAIL_COMMANDS.some(cmd => 
      inputValue.toLowerCase().includes(cmd.toLowerCase())
    )
    const isCreateOrgCommand = CREATE_ORG_COMMANDS.some(cmd => 
      inputValue.toLowerCase().includes(cmd.toLowerCase())
    )
    const isJoinOrgCommand = JOIN_ORG_COMMANDS.some(cmd => 
      inputValue.toLowerCase().includes(cmd.toLowerCase())
    )
    const isSwitchOrgCommand = SWITCH_ORG_COMMANDS.some(cmd => 
      inputValue.toLowerCase().includes(cmd.toLowerCase())
    )

    const isPermissionEdit0424UserCommand =
      permissionEditCard0424Demo &&
      activeApp === null &&
      inputValue.includes(PERMISSION_EDIT_CARD_0424_USER_TRIGGER)
    const isOrganizationManagement0425UserCommand =
      organizationManagement0425Demo &&
      (activeApp === null || activeApp === "organization" || activeApp === "employee") &&
      inputValue.includes(ORGANIZATION_MANAGEMENT_0425_USER_TRIGGER)
    const isEmployeePermissionGuide0425UserCommand =
      organizationManagement0425Demo &&
      (activeApp === null || activeApp === "employee") &&
      EMPLOYEE_PERMISSION_APPLY_COMMANDS_0425.some((kw) => inputValue.includes(kw))
    const isOrgSettingsPermission0425UserCommand =
      organizationManagement0425Demo &&
      (activeApp === null || activeApp === "organization" || activeApp === "employee") &&
      ORG_SETTINGS_COMMANDS_0425.some((kw) => inputValue.includes(kw))
    const hadNaturalDialogArm =
      activeApp === null && interactionRulesNaturalDialogArmRef.current
    const shouldPlayNaturalDialogDemo =
      hadNaturalDialogArm &&
      !isPersonalInfoCommand &&
      !isCreateEmailCommand &&
      !isCreateOrgCommand &&
      !isJoinOrgCommand &&
      !isSwitchOrgCommand &&
      !isPermissionEdit0424UserCommand &&
      !isOrganizationManagement0425UserCommand &&
      !isEmployeePermissionGuide0425UserCommand &&
      !isOrgSettingsPermission0425UserCommand
    if (hadNaturalDialogArm) {
      interactionRulesNaturalDialogArmRef.current = false
    }

    if (
      organizationManagement0425Demo &&
      (activeApp === "organization" || activeApp === "employee")
    ) {
      const appSurface = activeApp;
      const patchAppMessages =
        appSurface === "organization" ? setOrganizationMessages0425 : setEmployeeMessages0425;
      beginNewUserChatRound(appSurface);
      patchAppMessages((prev) => [...prev, newUserMessage]);
      setInputValue("");

      const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const now = Date.now();
      const botContent = isOrganizationManagement0425UserCommand
        ? ORGANIZATION_MANAGEMENT_0425_MARKER
        : isEmployeePermissionGuide0425UserCommand
          ? ORG_EMPLOYEE_PERMISSION_GUIDE_0425_MARKER
          : isOrgSettingsPermission0425UserCommand
            ? ORG_SETTINGS_PERMISSION_0425_MARKER
            : "可以继续描述组织或员工相关事项，或使用底部快捷入口打开对应能力（演示）。";
      const botMsg: Message = {
        id: `${appSurface}-0425-bot-${now}`,
        senderId: conversation.user.id,
        content: botContent,
        timestamp: ts,
        createdAt: now,
        isAfterPrompt: true,
      };
      setTimeout(() => {
        patchAppMessages((prev) => [...prev, botMsg]);
      }, 500);
      return;
    }

    if (isPersonalInfoCommand) {
      const botResponse: Message = {
        id: `bot-${Date.now()}`,
        senderId: conversation.user.id,
        content: PERSONAL_INFO_MARKER,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: Date.now()
      }
      setTimeout(() => {
        setMessages(prev => [...prev, botResponse])
      }, 500)
    } else if (isCreateEmailCommand) {
      const botResponse: Message = {
        id: `bot-${Date.now()}`,
        senderId: conversation.user.id,
        content: CREATE_EMAIL_MARKER,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: Date.now()
      }
      setTimeout(() => {
        setMessages(prev => [...prev, botResponse])
      }, 500)
    } else if (isCreateOrgCommand) {
      const createMsg: Message = {
        id: `org-create-${Date.now()}`,
        senderId: conversation.user.id,
        content: CREATE_ORG_FORM_MARKER,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: Date.now(),
        isAfterPrompt: true
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, createMsg]);
      }, 500)
    } else if (isJoinOrgCommand) {
      const joinMsg: Message = {
        id: `org-join-${Date.now()}`,
        senderId: conversation.user.id,
        content: JOIN_ORG_FORM_MARKER,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: Date.now(),
        isAfterPrompt: true
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, joinMsg]);
      }, 500)
    } else if (isSwitchOrgCommand) {
      const switchMsg: Message = {
        id: `org-switcher-${Date.now()}`,
        senderId: conversation.user.id,
        content: ORG_SWITCHER_MARKER,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: Date.now(),
        isAfterPrompt: true
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, switchMsg]);
      }, 500)
    } else if (isPermissionEdit0424UserCommand) {
      const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      const now = Date.now()
      const permMsg: Message = {
        id: `perm-edit-0424-${now}`,
        senderId: conversation.user.id,
        content: PERMISSION_EDIT_CARD_0424_MARKER,
        timestamp: ts,
        createdAt: now,
        isAfterPrompt: true,
      }
      setTimeout(() => {
        setMessages((prev) => [...prev, permMsg])
      }, 500)
    } else if (isOrganizationManagement0425UserCommand) {
      const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      const now = Date.now()
      const orgMgmtMsg: Message = {
        id: `org-management-0425-${now}`,
        senderId: conversation.user.id,
        content: ORGANIZATION_MANAGEMENT_0425_MARKER,
        timestamp: ts,
        createdAt: now,
        isAfterPrompt: true,
      }
      setTimeout(() => {
        setMessages((prev) => [...prev, orgMgmtMsg])
      }, 500)
    } else if (isEmployeePermissionGuide0425UserCommand) {
      const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      const now = Date.now()
      const guideMsg: Message = {
        id: `employee-permission-guide-0425-${now}`,
        senderId: conversation.user.id,
        content: ORG_EMPLOYEE_PERMISSION_GUIDE_0425_MARKER,
        timestamp: ts,
        createdAt: now,
        isAfterPrompt: true,
      }
      setTimeout(() => {
        setMessages((prev) => [...prev, guideMsg])
      }, 500)
    } else if (isOrgSettingsPermission0425UserCommand) {
      const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      const now = Date.now()
      const orgSettingMsg: Message = {
        id: `org-settings-0425-${now}`,
        senderId: conversation.user.id,
        content: ORG_SETTINGS_PERMISSION_0425_MARKER,
        timestamp: ts,
        createdAt: now,
        isAfterPrompt: true,
      }
      setTimeout(() => {
        setMessages((prev) => [...prev, orgSettingMsg])
      }, 500)
    }

    let mainMessagesRoundSurface: NewRoundChatSurface = "main";
    if (
      invite0421DockFlow &&
      !(hasOrganization || workbenchOrgGateReleased) &&
      activeApp === "todo"
    ) {
      mainMessagesRoundSurface = "todo";
    } else if (
      invite0421DockFlow &&
      !(hasOrganization || workbenchOrgGateReleased) &&
      activeApp === "meeting"
    ) {
      mainMessagesRoundSurface = "meeting";
    } else if (
      invite0421DockFlow &&
      !(hasOrganization || workbenchOrgGateReleased) &&
      activeApp === "disk"
    ) {
      mainMessagesRoundSurface = "disk";
    } else if (
      invite0421DockFlow &&
      !(hasOrganization || workbenchOrgGateReleased) &&
      activeApp === "docs"
    ) {
      mainMessagesRoundSurface = "docs";
    } else if (
      invite0421DockFlow &&
      !(hasOrganization || workbenchOrgGateReleased) &&
      activeApp === "schedule" &&
      !schedule0422DrawerDemo
    ) {
      mainMessagesRoundSurface = "schedule";
    }
    beginNewUserChatRound(mainMessagesRoundSurface);
    setMessages(updatedMessages);
    setInputValue("");
    if (shouldPlayNaturalDialogDemo) {
      const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      const now = Date.now()
      setTimeout(() => {
        const bot: Message = {
          id: `bot-nl-demo-${now}`,
          senderId: conversation.user.id,
          content: INTERACTION_RULES_NATURAL_DIALOG_DEMO_BOT_REPLY,
          timestamp: ts,
          createdAt: now,
          isAfterPrompt: true,
        }
        setMessages((prev) => [...prev, bot])
      }, 480)
    }
  }

  const handleEmailFormSubmit = (msgId: string, data: any) => {
    /** 原位置将表单切为只读 + 写回填报数据：不算新一轮，定位当前卡片顶部 */
    scrollInPlaceMutatedCardToTop(msgId);
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isReadonly: true, formData: data } : m))

    setTimeout(() => {
      const successMsg: Message = {
        id: `bot-success-${Date.now()}`,
        senderId: conversation.user.id,
        content: `业务邮箱 ${data.emailPrefix}${data.domain} 创建成功，并已分配给 ${data.members.join('、')}。`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: Date.now(),
        isAfterPrompt: true
      }
      const continueMsg: Message = {
        id: `bot-continue-${Date.now()+1}`,
        senderId: conversation.user.id,
        content: CONTINUE_EMAIL_MARKER,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: Date.now() + 1
      }
      setMessages(prev => [...prev, successMsg, continueMsg])
    }, 600)
  }

  const handleContinueCreateEmail = () => {
    beginNewUserChatRound("main");
    const newFormMsg: Message = {
      id: `bot-${Date.now()}`,
      senderId: conversation.user.id,
      content: CREATE_EMAIL_MARKER,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
      isAfterPrompt: true
    }
    setMessages(prev => [...prev, newFormMsg])
  }

  const appendOrganizationManagement0425Card = React.useCallback((target?: "main" | "organization") => {
    const surface = target ?? (activeApp === "organization" ? "organization" : "main");
    const patchMessages = surface === "organization" ? setOrganizationMessages0425 : setMessages;
    beginNewUserChatRound(surface);
    const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const now = Date.now();
    patchMessages((prev) => [
      ...prev,
      {
        id: `org-management-0425-user-${now}`,
        senderId: currentUser.id,
        content: ORGANIZATION_MANAGEMENT_0425_USER_TRIGGER,
        timestamp: ts,
        createdAt: now,
      },
      {
        id: `org-management-0425-bot-${now}`,
        senderId: conversation.user.id,
        content: ORGANIZATION_MANAGEMENT_0425_MARKER,
        timestamp: ts,
        createdAt: now + 1,
        isAfterPrompt: true,
      },
    ]);
  }, [activeApp, beginNewUserChatRound, conversation.user.id]);

  const appendEmployeePermissionGuide0425Card = React.useCallback((target?: "main" | "employee") => {
    const surface = target ?? (activeApp === "employee" ? "employee" : "main");
    const patchMessages = surface === "employee" ? setEmployeeMessages0425 : setMessages;
    beginNewUserChatRound(surface);
    const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const now = Date.now();
    patchMessages((prev) => [
      ...prev,
      {
        id: `employee-permission-guide-0425-${now}`,
        senderId: conversation.user.id,
        content: ORG_EMPLOYEE_PERMISSION_GUIDE_0425_MARKER,
        timestamp: ts,
        createdAt: now,
        isAfterPrompt: true,
      },
    ]);
  }, [activeApp, beginNewUserChatRound, conversation.user.id]);

  const appendOrgSettingsPermission0425Card = React.useCallback((target?: "main" | "organization") => {
    const surface = target ?? (activeApp === "organization" ? "organization" : "main");
    const patchMessages = surface === "organization" ? setOrganizationMessages0425 : setMessages;
    beginNewUserChatRound(surface);
    const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const now = Date.now();
    patchMessages((prev) => [
      ...prev,
      {
        id: `org-settings-0425-${now}`,
        senderId: conversation.user.id,
        content: ORG_SETTINGS_PERMISSION_0425_MARKER,
        timestamp: ts,
        createdAt: now,
        isAfterPrompt: true,
      },
    ]);
  }, [activeApp, beginNewUserChatRound, conversation.user.id]);

  /**
   * 0425：从主 AI 进入「员工」应用时，顺带插入权限申请引导卡，避免用户再点一次底栏「员工权限申请」。
   */
  const tryEnterWorkbenchAppWith0425EmployeeAuto = React.useCallback(
    (appId: string) => {
      const result = tryEnterWorkbenchApp(appId);
      if (organizationManagement0425Demo && appId === "employee" && result === true) {
        appendEmployeePermissionGuide0425Card("employee");
      }
      return result;
    },
    [
      tryEnterWorkbenchApp,
      organizationManagement0425Demo,
      appendEmployeePermissionGuide0425Card,
    ],
  );

  // Organization handlers
  const handleOrgClick = () => {
    const orgSwitcherMsg: Message = {
      id: `org-switcher-${Date.now()}`,
      senderId: conversation.user.id,
      content: ORG_SWITCHER_MARKER,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
      isAfterPrompt: false
    };
    
    if (activeApp === "education") {
      beginNewUserChatRound("education");
      setEducationMessages((prev) => [...prev, orgSwitcherMsg]);
    } else if (activeApp === "task") {
      beginNewUserChatRound("task");
      setTaskMessages((prev) => [...prev, orgSwitcherMsg]);
    } else if (activeApp === "mail") {
      beginNewUserChatRound("mail");
      updateMailMessages((prev) => [...prev, orgSwitcherMsg]);
    } else if (activeApp === "schedule") {
      beginNewUserChatRound("schedule");
      setMessages((prev) => [...prev, orgSwitcherMsg]);
    } else if (activeApp === "organization" && organizationManagement0425Demo) {
      beginNewUserChatRound("organization");
      setOrganizationMessages0425((prev) => [...prev, orgSwitcherMsg]);
    } else if (activeApp === "employee" && organizationManagement0425Demo) {
      beginNewUserChatRound("employee");
      setEmployeeMessages0425((prev) => [...prev, orgSwitcherMsg]);
    } else {
      beginNewUserChatRound("main");
      setMessages((prev) => [...prev, orgSwitcherMsg]);
    }
    
  };

  const handleOrgSwitch = (orgId: string) => {
    const selectedOrg =
      schedule0422NavOrganizations.find((o) => o.id === orgId) ??
      AVAILABLE_ORGANIZATIONS.find((o) => o.id === orgId) ??
      invite0421JoinedOrganizationList.find((o) => o.id === orgId);
    if (!selectedOrg) return;

    setCurrentOrg(orgId);
    setWorkbenchOrgGateReleased(true);
    if (interactionRulesOrgNavDemo && interactionRulesOrgCardMessageId) {
      setInteractionRulesOrgCardResetKey((k) => k + 1);
    }
  };

  const handleCreateOrg = () => {
    const createMsg: Message = {
      id: `org-create-${Date.now()}`,
      senderId: conversation.user.id,
      content:
        simpleOrgOnboarding0421 && !hasOrganization
          ? SIMPLE_CREATE_ORG_0421_MARKER
          : CREATE_ORG_FORM_MARKER,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
      isAfterPrompt: true
    };
    
    if (activeApp === "education") {
      beginNewUserChatRound("education");
      setEducationMessages((prev) => [...prev, createMsg]);
    } else if (activeApp === "task") {
      beginNewUserChatRound("task");
      setTaskMessages((prev) => [...prev, createMsg]);
    } else if (activeApp === "mail") {
      beginNewUserChatRound("mail");
      updateMailMessages((prev) => [...prev, createMsg]);
    } else if (activeApp === "schedule") {
      beginNewUserChatRound("schedule");
      setMessages((prev) => [...prev, createMsg]);
    } else {
      beginNewUserChatRound("main");
      setMessages((prev) => [...prev, createMsg]);
    }
  };

  const handleJoinOrg = () => {
    /** 0421 已入组：顶栏「加入企业/组织」走主 AI 文字反馈，不插入完整加入表单卡 */
    if (invite0421NewUserFlow && hasOrganization) {
      setActiveApp(null);
      setSecondaryHistoryOpen(false);
      setIsAllAppsOpen(false);
      beginNewUserChatRound("main");
      const now = Date.now();
      const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const orgName = INVITE0421_ORG_COMPANY_NAME;
      setMessages((prev) => [
        ...prev,
        {
          id: `u-inv0421-joinorg-${now}`,
          senderId: currentUser.id,
          content: "加入企业/组织",
          timestamp: ts,
          createdAt: now,
          isAfterPrompt: true,
        },
        {
          id: `a-inv0421-joinorg-${now}`,
          senderId: conversation.user.id,
          content: `您已加入「${orgName}」企业组织。若需加入其他企业/组织，请向对方获取邀请链接或联系管理员；也可通过邀请邮件中的入口完成加入流程。`,
          timestamp: ts,
          createdAt: now + 1,
          isAfterPrompt: true,
        },
      ]);
      return;
    }

    const joinMsg: Message = {
      id: `org-join-${Date.now()}`,
      senderId: conversation.user.id,
      content:
        simpleOrgOnboarding0421 && !hasOrganization
          ? SIMPLE_JOIN_ORG_0421_MARKER
          : JOIN_ORG_FORM_MARKER,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
      isAfterPrompt: true
    };
    
    if (activeApp === "education") {
      beginNewUserChatRound("education");
      setEducationMessages((prev) => [...prev, joinMsg]);
    } else if (activeApp === "task") {
      beginNewUserChatRound("task");
      setTaskMessages((prev) => [...prev, joinMsg]);
    } else if (activeApp === "mail") {
      beginNewUserChatRound("mail");
      updateMailMessages((prev) => [...prev, joinMsg]);
    } else if (activeApp === "schedule") {
      beginNewUserChatRound("schedule");
      setMessages((prev) => [...prev, joinMsg]);
    } else {
      beginNewUserChatRound("main");
      setMessages((prev) => [...prev, joinMsg]);
    }
  };

  /**
   * 创建「机构教育空间」：切换到教育应用 → 在教育会话中插入表单卡。
   * 入口来自 ChatNavBar 教育空间下拉底部按钮 / 空态下拉 / 空态欢迎快捷提示。
   */
  const handleCreateInstitutionSpace = () => {
    if (activeApp !== "education") setActiveApp("education");
    beginNewUserChatRound("education");
    setEducationMessages((prev) => [
      ...prev,
      {
        id: `edu-space-inst-${Date.now()}`,
        senderId: conversation.user.id,
        content: CREATE_INSTITUTION_EDU_SPACE_MARKER,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: Date.now(),
        isAfterPrompt: true,
      },
    ]);
  };

  /** 空态欢迎行动建议：查看教育视频介绍（占位：后续接入视频播放卡片） */
  const handleViewEducationIntroVideo = () => {
    toast("即将为您播放教育视频介绍（占位）");
  };

  /** 家庭空间创建完成后的行动建议：购买课程 / 添加成员（占位） */
  const handleFamilyBuyCourse = () => {
    toast("即将进入购买课程流程（占位）");
  };
  const handleFamilyAddMember = () => {
    toast("即将进入添加成员流程（占位）");
  };

  /**
   * 创建「家庭教育空间」：切换到教育应用 → 在教育会话中插入「身份选择 + 表单」一体卡。
   */
  const handleCreateFamilySpace = () => {
    if (activeApp !== "education") setActiveApp("education");
    beginNewUserChatRound("education");
    setEducationMessages((prev) => [
      ...prev,
      {
        id: `edu-space-fam-${Date.now()}`,
        senderId: conversation.user.id,
        content: CREATE_FAMILY_EDU_SPACE_MARKER,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: Date.now(),
        isAfterPrompt: true,
      },
    ]);
  };

  /**
   * 机构教育空间创建完成：
   * - 若存在同名（行政公司）的租户：把新空间插入到该租户下；
   * - 否则：新建一个租户（以行政公司为名），把新空间作为其第一个子节点。
   * - 把 `currentEducationSpaceId` 设为新空间 id（自动选中）。
   */
  const handleCreateInstitutionSpaceSubmit = (data: CreateInstitutionEducationSpaceData) => {
    beginNewUserChatRound("education");
    const newInstId = `edu-inst-${Date.now()}`;
    const newInstName = data.shortName?.trim() || data.name.trim();
    const adminCompany = data.adminCompany?.trim();

    setEducationSpaceNodes((prev) => {
      const idx = adminCompany ? prev.findIndex((n) => n.kind === "tenant" && n.name === adminCompany) : -1;
      const newInstitution: EducationSpaceNode = {
        id: newInstId,
        name: newInstName,
        kind: "institution",
      };
      if (idx >= 0) {
        const next = prev.slice();
        const tenant = next[idx];
        next[idx] = { ...tenant, children: [...(tenant.children ?? []), newInstitution] };
        return next;
      }
      const newTenant: EducationSpaceNode = {
        id: `tenant-${Date.now()}`,
        name: adminCompany || newInstName,
        kind: "tenant",
        icon: orgIcon,
        children: [newInstitution],
      };
      // 插入在家庭空间之前，保证家庭空间始终位于列表末端
      const firstFamilyIdx = prev.findIndex((n) => n.kind === "family");
      if (firstFamilyIdx === -1) return [...prev, newTenant];
      return [...prev.slice(0, firstFamilyIdx), newTenant, ...prev.slice(firstFamilyIdx)];
    });
    setCurrentEducationSpaceId(newInstId);

    setEducationMessages((prev) => [
      ...prev,
      {
        id: `edu-space-inst-done-${Date.now()}`,
        senderId: conversation.user.id,
        content: `${CREATE_EDU_SPACE_SUCCESS_MARKER}:${JSON.stringify({
          type: "institution",
          name: newInstName,
          adminCompany: data.adminCompany,
          country: data.country,
        })}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: Date.now(),
      },
    ]);
  };

  /**
   * 家庭教育空间创建完成：
   * - 在列表末端追加新家庭空间节点（家庭空间统一置于最后）；
   * - 自动选中新空间。
   */
  const handleCreateFamilySpaceSubmit = (data: CreateFamilyEducationSpaceData) => {
    beginNewUserChatRound("education");
    const newFamilyId = `space-family-${Date.now()}`;
    const newFamilyName =
      data.identity === "parent" ? `${data.name}的家庭空间` : data.name;

    setEducationSpaceNodes((prev) => [
      ...prev,
      { id: newFamilyId, name: newFamilyName, kind: "family" },
    ]);
    setCurrentEducationSpaceId(newFamilyId);

    setEducationMessages((prev) => [
      ...prev,
      {
        id: `edu-space-fam-done-${Date.now()}`,
        senderId: conversation.user.id,
        content: `${CREATE_EDU_SPACE_SUCCESS_MARKER}:${JSON.stringify({
          type: "family",
          identity: data.identity,
          name: data.name,
          spaceName: newFamilyName,
        })}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: Date.now(),
      },
    ]);
  };

  const handleModelSwitch = (modelId: string) => {
    // 查找选中的模型版本
    let selectedVersion = null;
    for (const family of AVAILABLE_MODEL_FAMILIES) {
      const version = family.versions.find(v => v.id === modelId);
      if (version) {
        selectedVersion = version;
        break;
      }
    }
    
    if (!selectedVersion) return;
    
    setCurrentModel(modelId);
    
    console.log(`已切换到模型：${selectedVersion.name}`);
  };

  const handleCreateOrgSubmit = (orgData: { 
    country: string;
    industry: string;
    fullName: string;
    shortName: string;
    logo?: File;
    address: string;
    email: string;
    phoneCode: string;
    phone: string;
    description: string;
  }, secondaryCtx?: "education" | "task" | "mail") => {
    beginNewUserChatRound(secondaryCtxToRoundSurface(secondaryCtx));
    // 模拟创建新组织
    const newOrgId = `org-${Date.now()}`;
    
    // 添加到可用组织列表（实际应该调用后端API）
    const newOrg: Organization = {
      id: newOrgId,
      name: orgData.shortName || orgData.fullName,
      icon: orgIcon,
      memberCount: 1,
      description: orgData.description || `${orgData.industry}企业，位于${orgData.country}`
    };
    
    AVAILABLE_ORGANIZATIONS.push(newOrg);
    
    // 切换到新组织
    setCurrentOrg(newOrgId);
    setWorkbenchOrgGateReleased(true);
    
    // 显示创建成功卡片（包含组织详情）
    const successData = JSON.stringify({
      orgId: newOrgId,
      orgName: orgData.shortName || orgData.fullName,
      fullName: orgData.fullName,
      country: orgData.country,
      industry: orgData.industry,
      address: orgData.address,
      email: orgData.email,
      phone: `${orgData.phoneCode} ${orgData.phone}`,
      description: orgData.description,
      memberCount: 1
    });
    
    const successMsg: Message = {
      id: `org-create-success-${Date.now()}`,
      senderId: conversation.user.id,
      content: `${CREATE_ORG_SUCCESS_MARKER}:${successData}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
      isAfterPrompt: true
    };
    
    if (secondaryCtx === "education") {
      setEducationMessages((prev) => [...prev, successMsg]);
    } else if (secondaryCtx === "task") {
      setTaskMessages((prev) => [...prev, successMsg]);
    } else if (secondaryCtx === "mail") {
      updateMailMessages((prev) => [...prev, successMsg]);
    } else {
      setMessages((prev) => [...prev, successMsg]);
    }
  };

  const handleJoinOrgSubmit = (inviteCode: string, secondaryCtx?: "education" | "task" | "mail") => {
    beginNewUserChatRound(secondaryCtxToRoundSurface(secondaryCtx));
    // 模拟邀请码验证
    const validCodes: Record<string, { orgId: string; orgName: string }> = {
      'XIAOCE2024': { orgId: 'xiaoce', orgName: '小测教育机构' },
      'DEFAULT001': { orgId: 'default', orgName: '默认组织' },
      'TEST123': { orgId: 'test', orgName: '测试机构' }
    };
    
    const matchedOrg = validCodes[inviteCode.toUpperCase()];
    
    if (matchedOrg) {
      const targetOrg = AVAILABLE_ORGANIZATIONS.find(o => o.id === matchedOrg.orgId);
      
      if (targetOrg) {
        // 显示确认加入卡片
        const confirmData = JSON.stringify({
          orgId: targetOrg.id,
          orgName: targetOrg.name,
          orgIcon: targetOrg.icon,
          memberCount: targetOrg.memberCount,
          description: targetOrg.description
        });
        
        const confirmMsg: Message = {
          id: `org-join-confirm-${Date.now()}`,
          senderId: conversation.user.id,
          content: `${JOIN_ORG_CONFIRM_MARKER}:${confirmData}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          createdAt: Date.now(),
          isAfterPrompt: true
        };
        
        if (secondaryCtx === "education") {
          setEducationMessages((prev) => [...prev, confirmMsg]);
        } else if (secondaryCtx === "task") {
          setTaskMessages((prev) => [...prev, confirmMsg]);
        } else if (secondaryCtx === "mail") {
          updateMailMessages((prev) => [...prev, confirmMsg]);
        } else {
          setMessages((prev) => [...prev, confirmMsg]);
        }
      }
    } else {
      // 邀请码无效
      const errorMsg: Message = {
        id: `org-join-error-${Date.now()}`,
        senderId: conversation.user.id,
        content: `邀请码「${inviteCode}」无效或已过期，请检查后重试。您可以联系组织管理员获取有效的邀请码。`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: Date.now(),
        isAfterPrompt: true
      };
      
      if (secondaryCtx === "education") {
        setEducationMessages((prev) => [...prev, errorMsg]);
      } else if (secondaryCtx === "task") {
        setTaskMessages((prev) => [...prev, errorMsg]);
      } else if (secondaryCtx === "mail") {
        updateMailMessages((prev) => [...prev, errorMsg]);
      } else {
        setMessages((prev) => [...prev, errorMsg]);
      }
    }
  };

  const handleConfirmJoinOrg = (orgId: string, secondaryCtx?: "education" | "task" | "mail") => {
    beginNewUserChatRound(secondaryCtxToRoundSurface(secondaryCtx));
    const targetOrg = AVAILABLE_ORGANIZATIONS.find(o => o.id === orgId);
    if (!targetOrg) return;
    
    // 切换到该组织
    setCurrentOrg(orgId);
    setWorkbenchOrgGateReleased(true);
    
    // 显示加入成功消息
    const successMsg: Message = {
      id: `org-join-success-${Date.now()}`,
      senderId: conversation.user.id,
      content: `欢迎加入「${targetOrg.name}」！您现在可以访问该组织的所有资源，并与 ${targetOrg.memberCount} 位成员协作。`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
      isAfterPrompt: true
    };
    
    if (secondaryCtx === "education") {
      setEducationMessages((prev) => [...prev, successMsg]);
    } else if (secondaryCtx === "task") {
      setTaskMessages((prev) => [...prev, successMsg]);
    } else if (secondaryCtx === "mail") {
      updateMailMessages((prev) => [...prev, successMsg]);
    } else {
      setMessages((prev) => [...prev, successMsg]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleNewConversation = () => {
    if (is0419Explore && on0419NewSession) {
      on0419NewSession();
      return;
    }
    if (interactionRulesOrgNavDemo) {
      setInteractionRulesOrgCardMessageId(null);
      setInteractionRulesOrgCardResetKey(0);
    }
    setMessages([]);
    setNewRoundSlot(null);
    newRoundScrollAppliedRef.current = false;
    sameRoundScrollSuppressRef.current = null;
  };

  const handleSecondaryAppNewConversation = () => {
    // Clear education messages for new conversation
    setEducationMessages([]);
    setSecondaryHistoryOpen(false);
    setNewRoundSlot(null);
    newRoundScrollAppliedRef.current = false;
    sameRoundScrollSuppressRef.current = null;
  }

  const handleSecondarySessionSelect = (sessionId: string) => {
    setSelectedSecondarySession(sessionId);
    // Here you would load the messages for that session
    // For now, we'll just log it
    console.log('Selected secondary app session:', sessionId);
  }

  /** 0421 演示：名称创建/加入组织后写入演示列表、切换当前组织并通知页面变为「有组织」 */
  const establish0421Organization = React.useCallback(
    (mode: "create" | "join", trimmedName: string) => {
      const name =
        trimmedName.trim() || (mode === "create" ? "我的企业" : "协同组织");
      let targetOrgId: string;
      if (mode === "join") {
        const hit = AVAILABLE_ORGANIZATIONS.find(
          (o) => o.name.toLowerCase() === name.toLowerCase(),
        );
        if (hit) {
          targetOrgId = hit.id;
        } else {
          targetOrgId = `org-0421-${Date.now()}`;
          AVAILABLE_ORGANIZATIONS.push({
            id: targetOrgId,
            name,
            icon: orgIcon,
            memberCount: 1,
            description: "演示：通过名称加入的组织",
          });
        }
      } else {
        targetOrgId = `org-0421-${Date.now()}`;
        AVAILABLE_ORGANIZATIONS.push({
          id: targetOrgId,
          name,
          icon: orgIcon,
          memberCount: 1,
          description: "演示：新创建的组织",
        });
      }
      setCurrentOrg(targetOrgId);
      setWorkbenchOrgGateReleased(true);
      on0421EstablishOrganization?.();
      beginNewUserChatRound("main");
      const verb = mode === "create" ? "创建" : "加入";
      const now = Date.now();
      setMessages((prev) => [
        ...prev,
        {
          id: `org-0421-done-${now}`,
          senderId: conversation.user.id,
          content: `您已${verb}组织「${name}」，工作台相关应用已解锁，可直接进入使用。`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          createdAt: now,
          isAfterPrompt: true,
        },
      ]);
    },
    [beginNewUserChatRound, conversation.user.id, on0421EstablishOrganization],
  );

  const newRoundSlotWrapForActiveView = React.useMemo(() => {
    if (!newRoundSlot) return null;
    if (newRoundSlot.armedIs0419Explore !== is0419Explore) return null;
    if (newRoundSlot.armedActiveApp !== activeApp) return null;
    return {
      startMessageIndex: newRoundSlot.startMessageIndex,
      slotHeightPx: newRoundSlot.slotHeightPx,
      onOverflow: releaseNewRoundSlot,
      shellRef: newRoundShellRef,
      messageGapClassName:
        activeApp === "task" ||
        activeApp === "schedule" ||
        activeApp === "todo" ||
        activeApp === "meeting" ||
        activeApp === "disk" ||
        activeApp === "docs"
          ? "gap-[var(--space-500)]"
          : activeApp === "mail"
            ? "gap-[var(--space-150)]"
            : "gap-[var(--space-600)]",
      /** 与槽位两阶段滚动总时长一致：先到位空屏，再淡入本轮内容 */
      revealChildrenAfterMs: CHAT_SCROLL_ALIGN_DURATION_MS,
    };
  }, [newRoundSlot, is0419Explore, activeApp, releaseNewRoundSlot]);

  /** 驱动「去底部」在消息/槽位变化后重算，并避免滚动区 remount 后监听仍挂在旧 DOM 上 */
  const chatScrollFabLayoutKey = React.useMemo(() => {
    const len =
      activeApp === "education"
        ? educationMessages.length
        : activeApp === "task"
          ? taskMessages.length
          : activeApp === "mail"
            ? mailMessages.length
            : activeApp === "organization" && organizationManagement0425Demo
              ? organizationMessages0425.length
              : activeApp === "employee" && organizationManagement0425Demo
                ? employeeMessages0425.length
                : messages.length;
    const slotKey =
      newRoundSlot == null
        ? "0"
        : `${newRoundSlot.startMessageIndex}-${newRoundSlot.slotHeightPx}-${newRoundSlot.armedActiveApp ?? ""}`;
    return `${is0419Explore ? 1 : 0}|${activeApp ?? ""}|${len}|${slotKey}`;
  }, [
    activeApp,
    is0419Explore,
    messages.length,
    educationMessages.length,
    taskMessages.length,
    mailMessages.length,
    organizationMessages0425.length,
    employeeMessages0425.length,
    organizationManagement0425Demo,
    newRoundSlot,
  ]);

  /** 与 `newRoundSlot.slotHeightPx` 同源，供「去底部」距离阈值随槽位策略同步 */
  const getChatScrollFabDistanceThresholdPx = React.useCallback(() => {
    const c = chatContainerRef.current;
    const pin = pinnedTaskStickyRef.current;
    const showPinnedExplorer = is0419Explore || activeApp === null;
    const fullH = c?.clientHeight ?? 480;
    const pinH = showPinnedExplorer && pin ? pin.offsetHeight : 0;
    return computeNewRoundSlotHeightPx({
      chatClientHeight: fullH,
      pinOverlayHeight: pinH,
      demoInstructionShell,
    });
  }, [is0419Explore, activeApp, demoInstructionShell]);

  const getFloatingChatScrollFabDistanceThresholdPx = React.useCallback(() => {
    const c = floatingChatScrollRef.current;
    const fullH = c?.clientHeight ?? 480;
    return computeNewRoundSlotHeightPx({
      chatClientHeight: fullH,
      pinOverlayHeight: 0,
      demoInstructionShell,
    });
  }, [demoInstructionShell]);

  const renderMessageList = (
    messagesList: Message[],
    appContext: "main" | "education" | "task" | "mail" | "schedule" | "organization" | "employee",
    /** null：不在此列表挂锚点（如独立浮窗内列表，避免与主会话 ref 冲突） */
    listAnchorRef: React.MutableRefObject<HTMLDivElement | null> | null | undefined = undefined,
    slotWrapConfig: {
      startMessageIndex: number;
      slotHeightPx: number;
      onOverflow: () => void;
      shellRef: React.RefObject<HTMLDivElement | null>;
      messageGapClassName: string;
      revealChildrenAfterMs?: number;
    } | null = null
  ) => {
    const rowAnchorRef = listAnchorRef === undefined ? latestMessageRowRef : listAnchorRef;
    const isEducationContext = appContext === "education";
    const isTaskContext = appContext === "task";
    const secondaryCtx = isEducationContext
      ? ("education" as const)
      : isTaskContext
        ? ("task" as const)
        : appContext === "mail"
          ? ("mail" as const)
          : undefined;

    const mainAiScopeEnabled = appContext === "main" && activeApp === null;
    const mainAiOrgScopeBarEl = mainAiScopeEnabled ? (
      <MainAiCardOrgScopeSelectBar
        organizations={schedule0422NavOrganizations}
        currentOrgId={currentOrg}
        onOrgSelect={handleOrgSwitch}
        embedded
        hideTriggerOrgIcon
        textTone="subtle"
      />
    ) : null;
    const mainAiEducationScopeBarEl = mainAiScopeEnabled ? (
      <MainAiCardEducationSpaceSelectBar
        nodes={educationSpaceNodes}
        value={currentEducationSpaceId}
        onChange={setCurrentEducationSpaceId}
      />
    ) : null;

    if (appContext === "mail") {
      return (
        <MailChatLayer
          messages={messagesList}
          conversation={conversation}
          onAppendMailMessage={appendMailAssistantMessage}
          defaultBusinessScope={defaultBusinessScopeForMail}
          onMailWelcomeAction={appendMailWelcomeAction}
          lastMessageRowRef={rowAnchorRef ?? undefined}
          scrollToMessageById={scrollToMessageById}
          mailReadInChat={taskEntryVariant === "email0417"}
          mailAdminOrganizations={
            taskEntryIsEmail0415ScopeFamily(taskEntryVariant)
              ? AVAILABLE_ORGANIZATIONS.map((o) => ({ id: o.id, name: o.name, icon: o.icon }))
              : undefined
          }
          onPickTenantForMailAdmin={
            taskEntryIsEmail0415ScopeFamily(taskEntryVariant)
              ? handlePickTenantForMailAdmin
              : undefined
          }
        />
      );
    }

    const patchMessages = (fn: (prev: Message[]) => Message[]) => {
      if (appContext === "education") setEducationMessages(fn);
      else if (appContext === "task") setTaskMessages(fn);
      else if (appContext === "organization") setOrganizationMessages0425(fn);
      else if (appContext === "employee") setEmployeeMessages0425(fn);
      else setMessages(fn);
    };

    /**
     * 新一轮对话 append：在 `patchMessages` 末尾追加前统一武装空屏槽位。
     * 适用场景：用户点击卡片 / 表格行 / 行动建议等产生的「末尾追加新消息」。
     * 原位置切换 / 更新数据的 `patchMessages(.map)` 请走 `scrollInPlaceMutatedCardToTop`。
     */
    const pushNewRoundMessages = (fn: (prev: Message[]) => Message[]) => {
      const roundSurface: NewRoundChatSurface =
        appContext === "main"
          ? "main"
          : appContext === "education"
            ? "education"
            : appContext === "task"
              ? "task"
              : appContext === "mail"
                ? "mail"
                : appContext === "organization"
                  ? "organization"
                  : appContext === "employee"
                    ? "employee"
                    : "schedule";
      beginNewUserChatRound(roundSurface);
      patchMessages(fn);
    };

    const messageElements = messagesList.map((msg, index, arr) => {
      const isMe = msg.senderId === currentUser.id
      const isPersonalInfo = msg.content === PERSONAL_INFO_MARKER
      const isCreateEmailForm = msg.content === CREATE_EMAIL_MARKER
      const isContinueEmail = msg.content === CONTINUE_EMAIL_MARKER
      const isGenericCard = msg.content.startsWith("<<<RENDER_GENERIC_CARD>>>:");
      const isOrgSwitcher = msg.content === ORG_SWITCHER_MARKER;
      const isCreateOrgForm = msg.content === CREATE_ORG_FORM_MARKER;
      const isCreateOrgSuccess = msg.content.startsWith(`${CREATE_ORG_SUCCESS_MARKER}:`);
      const isJoinOrgForm = msg.content === JOIN_ORG_FORM_MARKER;
      const isJoinOrgConfirm = msg.content.startsWith(`${JOIN_ORG_CONFIRM_MARKER}:`);
      const isOrgEmployeePermissionGuide0425Card =
        organizationManagement0425Demo && msg.content === ORG_EMPLOYEE_PERMISSION_GUIDE_0425_MARKER;
      const isOrgSettingsPermission0425Card =
        organizationManagement0425Demo && msg.content === ORG_SETTINGS_PERMISSION_0425_MARKER;
      const isSimpleCreateOrg0421 = msg.content === SIMPLE_CREATE_ORG_0421_MARKER;
      const isSimpleJoinOrg0421 = msg.content === SIMPLE_JOIN_ORG_0421_MARKER;
      const isInvite0421OrgEmployeeOnboard = msg.content === INVITE0421_ORG_EMPLOYEE_ONBOARD_MARKER;
      const isInvite0421EduStudentInviteFlow = msg.content === INVITE0421_EDU_STUDENT_INVITE_FLOW_MARKER;
      const isWorkbenchOrgGatePrompt = msg.content.startsWith(`${WORKBENCH_ORG_GATE_PROMPT_MARKER}:`);
      const isCreateInstitutionEduSpace = msg.content === CREATE_INSTITUTION_EDU_SPACE_MARKER;
      const isCreateFamilyEduSpace = msg.content === CREATE_FAMILY_EDU_SPACE_MARKER;
      const isCreateEduSpaceSuccess = msg.content.startsWith(`${CREATE_EDU_SPACE_SUCCESS_MARKER}:`);
      const isTaskTable = msg.content.startsWith(TASK_TABLE_MARKER);
      const isTaskDraftsTable = msg.content === TASK_DRAFTS_TABLE_MARKER;
      const isCreateTaskForm =
        msg.content === CREATE_TASK_FORM_MARKER || msg.content.startsWith(`${CREATE_TASK_FORM_MARKER}:`);
      const isTaskDetail = msg.content.startsWith(TASK_DETAIL_MARKER);
      const isTaskFilterCard = msg.content === TASK_FILTER_MARKER;
      const isTaskSettingsCard = msg.content === TASK_SETTINGS_MARKER;
      const isEditTaskForm = msg.content.startsWith(EDIT_TASK_FORM_MARKER);
      const isTaskEditFeedbackDetail = msg.content.startsWith(TASK_EDIT_FEEDBACK_DETAIL_MARKER);
      const isSubtaskFormCard = msg.content.startsWith(SUBTASK_FORM_MARKER);
      const isHandoverCard = msg.content.startsWith(HANDOVER_CARD_MARKER);
      const isLinkSubtaskCard = msg.content.startsWith(LINK_SUBTASK_CARD_MARKER);
      const isEvalRecordsCard = msg.content.startsWith(EVAL_RECORDS_CARD_MARKER);
      const isExecutionContentForm = msg.content.startsWith(EXECUTION_CONTENT_FORM_MARKER);
      const isNewOutputForm = msg.content.startsWith(NEW_OUTPUT_FORM_MARKER);
      const isTaskHubCard = msg.content.startsWith(TASK_HUB_CARD_MARKER);
      const isExecutionDivisionListCard = msg.content.startsWith(EXECUTION_DIVISION_LIST_MARKER);
      const isKanbanScopeListCard = msg.content.startsWith(KANBAN_SCOPE_LIST_MARKER);
      const isExecutionDivisionDetailCard = msg.content.startsWith(EXECUTION_CONTENT_DETAIL_MARKER);
      const isSchedule0422AllList =
        schedule0422DrawerDemo &&
        (appContext === "main" || appContext === "schedule") &&
        msg.content === SCHEDULE_0422_ALL_LIST_MARKER;
      const isPermissionEdit0424Card =
        permissionEditCard0424Demo && msg.content === PERMISSION_EDIT_CARD_0424_MARKER;
      const isPermissionDetail0424Card =
        permissionEditCard0424Demo &&
        msg.content.startsWith(PERMISSION_DETAIL_CARD_0424_MARKER_PREFIX);
      const isOrganizationManagement0425Card =
        organizationManagement0425Demo && msg.content === ORGANIZATION_MANAGEMENT_0425_MARKER;
      const operationSourceLabel = resolveOperationSourceLabel(msg, index, arr, conversation.id);
      /** 任务侧全宽对话卡片：禁止与上一条合并头像区，否则连续卡片会套用 -mt 叠在一起 */
      const isTaskWideChatCard =
        isTaskTable ||
        isTaskDraftsTable ||
        isCreateTaskForm ||
        isTaskDetail ||
        isTaskFilterCard ||
        isTaskSettingsCard ||
        isEditTaskForm ||
        isTaskEditFeedbackDetail ||
        isSubtaskFormCard ||
        isHandoverCard ||
        isLinkSubtaskCard ||
        isEvalRecordsCard ||
        isExecutionContentForm ||
        isNewOutputForm ||
        isTaskHubCard ||
        isExecutionDivisionListCard ||
        isExecutionDivisionDetailCard ||
        isKanbanScopeListCard ||
        isSchedule0422AllList ||
        isPermissionEdit0424Card ||
        isPermissionDetail0424Card ||
        isOrgEmployeePermissionGuide0425Card ||
        isOrgSettingsPermission0425Card ||
        isOrganizationManagement0425Card ||
        isGenericCard ||
        isInvite0421OrgEmployeeOnboard ||
        isInvite0421EduStudentInviteFlow;
      const isSpecialComponent =
        isPersonalInfo ||
        isCreateEmailForm ||
        isContinueEmail ||
        isGenericCard ||
        isOrgSwitcher ||
        isCreateOrgForm ||
        isCreateOrgSuccess ||
        isJoinOrgForm ||
        isJoinOrgConfirm ||
        isOrgEmployeePermissionGuide0425Card ||
        isOrgSettingsPermission0425Card ||
        isSimpleCreateOrg0421 ||
        isSimpleJoinOrg0421 ||
        isInvite0421OrgEmployeeOnboard ||
        isInvite0421EduStudentInviteFlow ||
        isWorkbenchOrgGatePrompt ||
        isCreateInstitutionEduSpace ||
        isCreateFamilyEduSpace ||
        isCreateEduSpaceSuccess ||
        isTaskTable ||
        isTaskDraftsTable ||
        isCreateTaskForm ||
        isTaskDetail ||
        isTaskFilterCard ||
        isTaskSettingsCard ||
        isEditTaskForm ||
        isTaskEditFeedbackDetail ||
        isSubtaskFormCard ||
        isHandoverCard ||
        isLinkSubtaskCard ||
        isEvalRecordsCard ||
        isExecutionContentForm ||
        isNewOutputForm ||
        isTaskHubCard ||
        isExecutionDivisionListCard ||
        isExecutionDivisionDetailCard ||
        isKanbanScopeListCard ||
        isSchedule0422AllList ||
        isPermissionEdit0424Card ||
        isPermissionDetail0424Card ||
        isOrganizationManagement0425Card;
      const showTimestamp = shouldShowTimestamp(msg, index > 0 ? arr[index - 1] : null)
      const isSameSender = index > 0 && arr[index - 1].senderId === msg.senderId;
      const isWithin10Seconds = index > 0 && 
        (msg.createdAt !== undefined && arr[index - 1].createdAt !== undefined) 
          ? (msg.createdAt! - arr[index - 1].createdAt!) <= 10000 
          : false;
      const hideAvatar =
        !isTaskWideChatCard &&
        isSameSender &&
        !showTimestamp &&
        isWithin10Seconds &&
        !msg.isAfterPrompt;

      /** 工作台门闩：新一轮入口与上一条净距保持为 `--space-600`（在已有列表 gap 上补足至规范 24px） */
      const workbenchOrgGateNewRoundMarginTop =
        isWorkbenchOrgGatePrompt && index > 0
          ? appContext === "task"
            ? "mt-[calc(var(--space-600)-var(--space-500))]"
            : appContext === "mail"
              ? "mt-[calc(var(--space-600)-var(--space-150))]"
              : ""
          : "";

      return (
        <OperationSourceNavContext.Provider
          key={msg.id}
          value={{
            onNavigateToOperationSource: msg.operationSource?.sourceMessageId
              ? () => scrollToMessageById(msg.operationSource!.sourceMessageId!)
              : undefined,
          }}
        >
        <div
          className={cn("flex flex-col w-full min-w-0 shrink-0", workbenchOrgGateNewRoundMarginTop)}
          data-message-id={msg.id}
          data-message-ordinal={index}
          ref={
            index === arr.length - 1 && rowAnchorRef
              ? (node: HTMLDivElement | null) => {
                  rowAnchorRef.current = node;
                }
              : undefined
          }
        >
          {showTimestamp && <TimestampSeparator time={msg.timestamp} />}
          {isSchedule0422AllList ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
              <Schedule0422AllListCard
                items={schedule0422Items}
                currentOrgScope={schedule0422OrgScope}
                onOpenItem={(ev) => {
                  setSchedule0422DrawerItem(ev);
                  setSchedule0422DrawerOpen(true);
                }}
              />
            </TaskChatMessageRow>
          ) : isTaskTable ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
                {(() => {
                  try {
                    const rest = msg.content.slice(TASK_TABLE_MARKER.length);
                    const jsonStr = rest.startsWith(":") ? rest.slice(1) : "{}";
                    const parsed = JSON.parse(jsonStr) as { filterHint?: string };
                    return (
                      <TaskManagementTableCard
                        filterHint={parsed.filterHint}
                        viewedTaskIds={viewedTaskIdSet}
                        onRowClick={
                          appContext === "task"
                            ? (row) => {
                                setViewedTaskIdsFromList((prev) =>
                                  prev.includes(row.id) ? prev : [...prev, row.id]
                                );
                                pushNewRoundMessages((prev) => [
                                  ...prev,
                                  {
                                    id: `task-detail-${Date.now()}-${row.id}`,
                                    senderId: conversation.user.id,
                                    content: `${TASK_DETAIL_MARKER}:${JSON.stringify({ id: row.id })}`,
                                    timestamp: new Date().toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }),
                                    createdAt: Date.now(),
                                    isAfterPrompt: true,
                                    operationSource: {
                                      cardTitle: "任务管理",
                                      sourceMessageId: msg.id,
                                      sourceDetailLabel: row.name,
                                    },
                                  },
                                ]);
                              }
                            : undefined
                        }
                      />
                    );
                  } catch {
                    return (
                      <TaskManagementTableCard
                        viewedTaskIds={viewedTaskIdSet}
                        onRowClick={
                          appContext === "task"
                            ? (row) => {
                                setViewedTaskIdsFromList((prev) =>
                                  prev.includes(row.id) ? prev : [...prev, row.id]
                                );
                                pushNewRoundMessages((prev) => [
                                  ...prev,
                                  {
                                    id: `task-detail-${Date.now()}-${row.id}`,
                                    senderId: conversation.user.id,
                                    content: `${TASK_DETAIL_MARKER}:${JSON.stringify({ id: row.id })}`,
                                    timestamp: new Date().toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }),
                                    createdAt: Date.now(),
                                    isAfterPrompt: true,
                                    operationSource: {
                                      cardTitle: "任务管理",
                                      sourceMessageId: msg.id,
                                      sourceDetailLabel: row.name,
                                    },
                                  },
                                ]);
                              }
                            : undefined
                        }
                      />
                    );
                  }
                })()}
            </TaskChatMessageRow>
          ) : isTaskDraftsTable ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
                <TaskDraftsTableCard
                  onEditDraft={(draftId) => {
                    pushNewRoundMessages((prev) => [
                      ...prev,
                      {
                        id: `bot-task-edit-draft-${Date.now()}`,
                        senderId: conversation.user.id,
                        content: `${CREATE_TASK_FORM_MARKER}:${JSON.stringify({ draftId })}`,
                        timestamp: new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                        createdAt: Date.now(),
                        isAfterPrompt: true,
                        operationSource: {
                          cardTitle: "草稿箱",
                          sourceMessageId: msg.id,
                        },
                      },
                    ]);
                  }}
                />
            </TaskChatMessageRow>
          ) : isCreateTaskForm ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
                {(() => {
                  let editingDraftId: string | undefined;
                  let initialSnapshot: TaskFormSnapshot | undefined;
                  if (msg.content.startsWith(`${CREATE_TASK_FORM_MARKER}:`)) {
                    try {
                      const rest = msg.content.slice(CREATE_TASK_FORM_MARKER.length);
                      const jsonStr = rest.startsWith(":") ? rest.slice(1) : "{}";
                      const p = JSON.parse(jsonStr) as { draftId?: string };
                      const id = p.draftId?.trim();
                      if (id) {
                        const d = getTaskDraftById(id);
                        if (d) {
                          editingDraftId = d.id;
                          initialSnapshot = d.snapshot;
                        }
                      }
                    } catch {
                      /* ignore */
                    }
                  }
                  return (
                    <CreateTaskFullFormCard
                      editingDraftId={editingDraftId}
                      initialSnapshot={initialSnapshot}
                      onSaveDraft={({ title }) => {
                        pushNewRoundMessages((prev) => [
                          ...prev,
                          {
                            id: `task-draft-${Date.now()}`,
                            senderId: conversation.user.id,
                            content: `草稿「${title}」已保存，可在草稿箱中继续编辑。`,
                            timestamp: new Date().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            }),
                            createdAt: Date.now(),
                            isAfterPrompt: true,
                          },
                        ]);
                      }}
                      onConfirm={() => {
                        pushNewRoundMessages((prev) => [
                          ...prev,
                          {
                            id: `task-ok-${Date.now()}`,
                            senderId: conversation.user.id,
                            content: "任务已创建（演示数据）。",
                            timestamp: new Date().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            }),
                            createdAt: Date.now(),
                            isAfterPrompt: true,
                          },
                        ]);
                      }}
                    />
                  );
                })()}
            </TaskChatMessageRow>
          ) : isTaskDetail ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
                {(() => {
                  try {
                    const rest = msg.content.slice(TASK_DETAIL_MARKER.length);
                    const jsonStr = rest.startsWith(":") ? rest.slice(1) : "{}";
                    const parsed = JSON.parse(jsonStr) as {
                      id?: string;
                      snapshot?: Record<string, unknown>;
                      /** 0417 原位置编辑：同一条详情消息内切换为编辑表单 */
                      inlineEditing?: boolean;
                      /** 0417 原位置编辑：保存后标题后缀「（已更新）」 */
                      justUpdated?: boolean;
                    };
                    const baseDetail = getTaskDetailOrFallback(parsed.id ?? "");
                    const snap = parsed.snapshot;
                    const hasMergeSnap =
                      snap &&
                      typeof snap === "object" &&
                      typeof snap.name === "string" &&
                      typeof snap.assignee === "string" &&
                      typeof snap.owner === "string" &&
                      typeof snap.hours === "string" &&
                      typeof snap.dateStart === "string" &&
                      typeof snap.dateEnd === "string" &&
                      typeof snap.desc === "string" &&
                      typeof snap.priority === "string" &&
                      typeof snap.type === "string" &&
                      typeof snap.phase === "string";
                    const detail = hasMergeSnap
                      ? applyTaskEditSnapshotToDetail(baseDetail, {
                          name: snap!.name as string,
                          assignee: snap!.assignee as string,
                          owner: snap!.owner as string,
                          hours: snap!.hours as string,
                          dateStart: snap!.dateStart as string,
                          dateEnd: snap!.dateEnd as string,
                          desc: snap!.desc as string,
                          priority: snap!.priority as string,
                          type: snap!.type as string,
                          phase: snap!.phase as string,
                        })
                      : baseDetail;
                    const detailToolbarVariant0417 =
                      taskEntryVariant === "task0417InlineEdit" || taskEntryVariant === "task0417CardEdit"
                        ? ("figma0417" as const)
                        : ("default" as const);

                    const is0417InlineEditFlow = taskEntryVariant === "task0417InlineEdit";
                    const inlineEditing0417 = Boolean(parsed.inlineEditing);
                    const justUpdated0417 = Boolean(parsed.justUpdated);

                    if (is0417InlineEditFlow && inlineEditing0417) {
                      return (
                        <EditTaskFormCard
                          cardTitle="任务详情"
                          detail={detail}
                          onConfirm={(snap) => {
                            if (!snap) return;
                            /** 0417 原位置编辑：同条卡片切换到「只读 + 已更新」态，不算新一轮 */
                            scrollInPlaceMutatedCardToTop(msg.id);
                            patchMessages((prev) =>
                              prev.map((m) =>
                                m.id === msg.id
                                  ? {
                                      ...m,
                                      content: `${TASK_DETAIL_MARKER}:${JSON.stringify({
                                        id: parsed.id ?? detail.id,
                                        inlineEditing: false,
                                        justUpdated: true,
                                        snapshot: {
                                          name: snap.name,
                                          assignee: snap.assignee,
                                          owner: snap.owner,
                                          hours: snap.hours,
                                          dateStart: snap.dateStart,
                                          dateEnd: snap.dateEnd,
                                          desc: snap.desc,
                                          priority: snap.priority,
                                          type: snap.type,
                                          phase: snap.phase,
                                        },
                                      })}`,
                                    }
                                  : m
                              )
                            );
                          }}
                        />
                      );
                    }

                    return (
                      <TaskDetailCard
                        detail={detail}
                        detailToolbarVariant={detailToolbarVariant0417}
                        showTitleUpdatedSuffix={is0417InlineEditFlow && justUpdated0417}
                        onPushTaskChatCard={
                          appContext === "task"
                            ? (kind: TaskChatCardKind, options?: TaskPushChatCardOptions) => {
                                if (kind === "edit" && taskEntryVariant === "task0417InlineEdit") {
                                  /** 0417 原位置编辑：浏览 → 编辑，同条卡片切形态，不算新一轮 */
                                  scrollInPlaceMutatedCardToTop(msg.id);
                                  patchMessages((prev) =>
                                    prev.map((m) => {
                                      if (m.id !== msg.id) return m;
                                      try {
                                        const r = m.content.slice(TASK_DETAIL_MARKER.length);
                                        const j = r.startsWith(":") ? r.slice(1) : "{}";
                                        const payload0 = JSON.parse(j) as Record<string, unknown>;
                                        const nextPayload = {
                                          ...payload0,
                                          id: detail.id,
                                          inlineEditing: true,
                                          justUpdated: false,
                                        };
                                        return {
                                          ...m,
                                          content: `${TASK_DETAIL_MARKER}:${JSON.stringify(nextPayload)}`,
                                        };
                                      } catch {
                                        return m;
                                      }
                                    })
                                  );
                                  return;
                                }
                                const markers: Record<TaskChatCardKind, string> = {
                                  edit: EDIT_TASK_FORM_MARKER,
                                  subtask: SUBTASK_FORM_MARKER,
                                  handover: HANDOVER_CARD_MARKER,
                                  link_sub: LINK_SUBTASK_CARD_MARKER,
                                  eval: EVAL_RECORDS_CARD_MARKER,
                                  execution: EXECUTION_CONTENT_FORM_MARKER,
                                  execution_edit: EXECUTION_CONTENT_FORM_MARKER,
                                  task_hub: TASK_HUB_CARD_MARKER,
                                  execution_division_list: EXECUTION_DIVISION_LIST_MARKER,
                                  kanban_scope_list: KANBAN_SCOPE_LIST_MARKER,
                                  new_output: NEW_OUTPUT_FORM_MARKER,
                                  execution_content_detail: EXECUTION_CONTENT_DETAIL_MARKER,
                                };
                                let payload: Record<string, unknown>;
                                if (kind === "execution_edit" && options?.initial) {
                                  payload = { id: detail.id, mode: "edit", values: options.initial };
                                } else if (kind === "execution") {
                                  payload =
                                    options?.phase !== undefined
                                      ? { id: detail.id, phase: options.phase }
                                      : { id: detail.id };
                                } else if (kind === "task_hub" && options?.hub) {
                                  payload = { id: detail.id, hub: options.hub };
                                } else if (kind === "execution_division_list" && options?.executionDivisionScope) {
                                  payload = { id: detail.id, scope: options.executionDivisionScope };
                                } else if (kind === "kanban_scope_list" && options?.kanbanScope) {
                                  payload = { id: detail.id, scope: options.kanbanScope };
                                } else if (kind === "execution_content_detail" && options?.executionRow) {
                                  payload = { id: detail.id, row: options.executionRow };
                                } else {
                                  payload = { id: detail.id };
                                }
                                /** 操作来源：指向根「任务」卡片，而非当前子模块名（如执行内容分工/反馈） */
                                pushNewRoundMessages((prev) => [
                                  ...prev,
                                  {
                                    id: `task-chat-${kind}-${Date.now()}`,
                                    senderId: conversation.user.id,
                                    content: `${markers[kind]}:${JSON.stringify(payload)}`,
                                    timestamp: new Date().toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }),
                                    createdAt: Date.now(),
                                    isAfterPrompt: true,
                                    operationSource: {
                                      cardTitle: "任务",
                                      sourceMessageId: msg.id,
                                      sourceDetailLabel: detail.name,
                                    },
                                  },
                                ]);
                              }
                            : undefined
                        }
                      />
                    );
                  } catch {
                    return <div className="text-[length:var(--font-size-sm)] text-error">任务详情解析失败</div>;
                  }
                })()}
            </TaskChatMessageRow>
          ) : isTaskHubCard ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
                {(() => {
                  try {
                    const rest = msg.content.slice(TASK_HUB_CARD_MARKER.length);
                    const jsonStr = rest.startsWith(":") ? rest.slice(1) : "{}";
                    const parsed = JSON.parse(jsonStr) as { id?: string; hub?: TaskHubKind };
                    const hub = parsed.hub;
                    if (!hub || !TASK_HUB_LABELS[hub]) {
                      return (
                        <div className="text-[length:var(--font-size-sm)] text-error">任务模块卡片解析失败</div>
                      );
                    }
                    const detail = getTaskDetailOrFallback(parsed.id ?? "");
                    const rootTaskDetailMessageId =
                      msg.operationSource?.sourceMessageId ?? msg.id;
                    return (
                      <TaskHubSessionCard
                        hub={hub}
                        detail={detail}
                        extraSubtasks={appContext === "task" ? taskSubtaskExtrasById[detail.id] ?? [] : []}
                        onPushTaskChatCard={
                          appContext === "task"
                            ? (kind: TaskChatCardKind, options?: TaskPushChatCardOptions) => {
                                const markers: Record<TaskChatCardKind, string> = {
                                  edit: EDIT_TASK_FORM_MARKER,
                                  subtask: SUBTASK_FORM_MARKER,
                                  handover: HANDOVER_CARD_MARKER,
                                  link_sub: LINK_SUBTASK_CARD_MARKER,
                                  eval: EVAL_RECORDS_CARD_MARKER,
                                  execution: EXECUTION_CONTENT_FORM_MARKER,
                                  execution_edit: EXECUTION_CONTENT_FORM_MARKER,
                                  task_hub: TASK_HUB_CARD_MARKER,
                                  execution_division_list: EXECUTION_DIVISION_LIST_MARKER,
                                  kanban_scope_list: KANBAN_SCOPE_LIST_MARKER,
                                  new_output: NEW_OUTPUT_FORM_MARKER,
                                  execution_content_detail: EXECUTION_CONTENT_DETAIL_MARKER,
                                };
                                let payload: Record<string, unknown>;
                                if (kind === "execution_edit" && options?.initial) {
                                  payload = { id: detail.id, mode: "edit", values: options.initial };
                                } else if (kind === "execution") {
                                  payload =
                                    options?.phase !== undefined
                                      ? { id: detail.id, phase: options.phase }
                                      : { id: detail.id };
                                } else if (kind === "task_hub" && options?.hub) {
                                  payload = { id: detail.id, hub: options.hub };
                                } else if (kind === "execution_division_list" && options?.executionDivisionScope) {
                                  payload = { id: detail.id, scope: options.executionDivisionScope };
                                } else if (kind === "kanban_scope_list" && options?.kanbanScope) {
                                  payload = { id: detail.id, scope: options.kanbanScope };
                                } else if (kind === "execution_content_detail" && options?.executionRow) {
                                  payload = { id: detail.id, row: options.executionRow };
                                } else {
                                  payload = { id: detail.id };
                                }
                                /** 操作来源：始终为根任务「任务 + 任务名」，跳转定位到任务详情消息 */
                                pushNewRoundMessages((prev) => [
                                  ...prev,
                                  {
                                    id: `task-hub-chat-${kind}-${Date.now()}`,
                                    senderId: conversation.user.id,
                                    content: `${markers[kind]}:${JSON.stringify(payload)}`,
                                    timestamp: new Date().toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }),
                                    createdAt: Date.now(),
                                    isAfterPrompt: true,
                                    operationSource: {
                                      cardTitle: "任务",
                                      sourceMessageId: rootTaskDetailMessageId,
                                      sourceDetailLabel: detail.name,
                                    },
                                  },
                                ]);
                              }
                            : undefined
                        }
                      />
                    );
                  } catch {
                    return (
                      <div className="text-[length:var(--font-size-sm)] text-error">任务模块卡片解析失败</div>
                    );
                  }
                })()}
            </TaskChatMessageRow>
          ) : isExecutionDivisionListCard ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
                {(() => {
                  try {
                    const rest = msg.content.slice(EXECUTION_DIVISION_LIST_MARKER.length);
                    const jsonStr = rest.startsWith(":") ? rest.slice(1) : "{}";
                    const parsed = JSON.parse(jsonStr) as { id?: string; scope?: "mine" | "subordinate" };
                    const detail = getTaskDetailOrFallback(parsed.id ?? "");
                    const scope = parsed.scope === "subordinate" ? "subordinate" : "mine";
                    return (
                      <FilteredExecutionDivisionListCard
                        detail={detail}
                        scope={scope}
                        onViewExecutionDetail={
                          appContext === "task"
                            ? (row: ExecutionDivisionRow) => {
                                pushNewRoundMessages((prev) => [
                                  ...prev,
                                  {
                                    id: `exec-detail-${Date.now()}`,
                                    senderId: conversation.user.id,
                                    content: `${EXECUTION_CONTENT_DETAIL_MARKER}:${JSON.stringify({
                                      id: detail.id,
                                      row,
                                    })}`,
                                    timestamp: new Date().toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }),
                                    createdAt: Date.now(),
                                    isAfterPrompt: true,
                                    operationSource: {
                                      cardTitle: "任务",
                                      sourceMessageId: msg.id,
                                      sourceDetailLabel: detail.name,
                                    },
                                  },
                                ]);
                              }
                            : undefined
                        }
                      />
                    );
                  } catch {
                    return (
                      <div className="text-[length:var(--font-size-sm)] text-error">执行内容分工列表解析失败</div>
                    );
                  }
                })()}
            </TaskChatMessageRow>
          ) : isExecutionDivisionDetailCard ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
                {(() => {
                  try {
                    const rest = msg.content.slice(EXECUTION_CONTENT_DETAIL_MARKER.length);
                    const jsonStr = rest.startsWith(":") ? rest.slice(1) : "{}";
                    const parsed = JSON.parse(jsonStr) as {
                      id?: string;
                      row?: ExecutionDivisionRow;
                    };
                    const row = parsed.row;
                    if (!row) {
                      return (
                        <div className="text-[length:var(--font-size-sm)] text-error">执行内容详情解析失败</div>
                      );
                    }
                    return (
                      <ExecutionDivisionDetailChatCard
                        row={row}
                      />
                    );
                  } catch {
                    return (
                      <div className="text-[length:var(--font-size-sm)] text-error">执行内容详情解析失败</div>
                    );
                  }
                })()}
            </TaskChatMessageRow>
          ) : isKanbanScopeListCard ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
                {(() => {
                  try {
                    const rest = msg.content.slice(KANBAN_SCOPE_LIST_MARKER.length);
                    const jsonStr = rest.startsWith(":") ? rest.slice(1) : "{}";
                    const parsed = JSON.parse(jsonStr) as { id?: string; scope?: "mine" | "subordinate" };
                    const detail = getTaskDetailOrFallback(parsed.id ?? "");
                    const scope = parsed.scope === "subordinate" ? "subordinate" : "mine";
                    return (
                      <KanbanScopeListCard
                        detail={detail}
                        scope={scope}
                      />
                    );
                  } catch {
                    return (
                      <div className="text-[length:var(--font-size-sm)] text-error">看板列表解析失败</div>
                    );
                  }
                })()}
            </TaskChatMessageRow>
          ) : isEditTaskForm ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
                {(() => {
                  try {
                    const rest = msg.content.slice(EDIT_TASK_FORM_MARKER.length);
                    const jsonStr = rest.startsWith(":") ? rest.slice(1) : "{}";
                    const parsed = JSON.parse(jsonStr) as {
                      id?: string;
                      solidified?: boolean;
                      snapshot?: Record<string, unknown>;
                    };
                    const detail = getTaskDetailOrFallback(parsed.id ?? "");
                    const solidified = Boolean(parsed.solidified);
                    const snapRecord = parsed.snapshot;
                    const solidSnap =
                      snapRecord &&
                      typeof snapRecord.name === "string" &&
                      typeof snapRecord.assignee === "string"
                        ? (snapRecord as TaskFormSnapshot)
                        : undefined;

                    if (taskEntryVariant === "task0417CardEdit") {
                      return (
                        <EditTaskFormCard
                          detail={detail}
                          solidified={solidified}
                          solidifiedSnapshot={solidSnap}
                          onConfirm={(snap) => {
                            if (!snap) return;
                            const ts = new Date().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            });
                            const now = Date.now();
                            pushNewRoundMessages((prev) => {
                              const next = prev.map((m) =>
                                m.id === msg.id
                                  ? {
                                      ...m,
                                      content: `${EDIT_TASK_FORM_MARKER}:${JSON.stringify({
                                        id: parsed.id,
                                        solidified: true,
                                        snapshot: snap,
                                      })}`,
                                    }
                                  : m
                              );
                              return [
                                ...next,
                                {
                                  id: `edit-task-result-${now}`,
                                  senderId: conversation.user.id,
                                  content: `${TASK_EDIT_FEEDBACK_DETAIL_MARKER}:${JSON.stringify({
                                    id: parsed.id,
                                    snapshot: snap,
                                    feedbackText: "任务编辑已保存（演示数据）。",
                                  })}`,
                                  timestamp: ts,
                                  createdAt: now,
                                  isAfterPrompt: true,
                                },
                              ];
                            });
                          }}
                        />
                      );
                    }

                    return (
                      <EditTaskFormCard
                        detail={detail}
                        solidified={solidified}
                        solidifiedSnapshot={solidSnap}
                        onConfirm={() => {
                          pushNewRoundMessages((prev) => [
                            ...prev,
                            {
                              id: `edit-task-ok-${Date.now()}`,
                              senderId: conversation.user.id,
                              content: "任务编辑已保存（演示数据）。",
                              timestamp: new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              }),
                              createdAt: Date.now(),
                              isAfterPrompt: true,
                            },
                          ]);
                        }}
                      />
                    );
                  } catch {
                    return <div className="text-[length:var(--font-size-sm)] text-error">编辑任务卡片解析失败</div>;
                  }
                })()}
            </TaskChatMessageRow>
          ) : isTaskEditFeedbackDetail ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
              {(() => {
                try {
                  const rest = msg.content.slice(TASK_EDIT_FEEDBACK_DETAIL_MARKER.length);
                  const jsonStr = rest.startsWith(":") ? rest.slice(1) : "{}";
                  const parsed = JSON.parse(jsonStr) as {
                    id?: string;
                    feedbackText?: string;
                    snapshot?: Record<string, unknown>;
                  };
                  const snap = parsed.snapshot;
                  const hasMergeSnap =
                    snap &&
                    typeof snap === "object" &&
                    typeof snap.name === "string" &&
                    typeof snap.assignee === "string" &&
                    typeof snap.owner === "string" &&
                    typeof snap.hours === "string" &&
                    typeof snap.dateStart === "string" &&
                    typeof snap.dateEnd === "string" &&
                    typeof snap.desc === "string" &&
                    typeof snap.priority === "string" &&
                    typeof snap.type === "string" &&
                    typeof snap.phase === "string";
                  const baseDetail = getTaskDetailOrFallback(parsed.id ?? "");
                  const detail = hasMergeSnap
                    ? applyTaskEditSnapshotToDetail(baseDetail, {
                        name: snap!.name as string,
                        assignee: snap!.assignee as string,
                        owner: snap!.owner as string,
                        hours: snap!.hours as string,
                        dateStart: snap!.dateStart as string,
                        dateEnd: snap!.dateEnd as string,
                        desc: snap!.desc as string,
                        priority: snap!.priority as string,
                        type: snap!.type as string,
                        phase: snap!.phase as string,
                      })
                    : baseDetail;
                  const feedbackText =
                    typeof parsed.feedbackText === "string" && parsed.feedbackText.trim()
                      ? parsed.feedbackText.trim()
                      : "任务编辑已保存（演示数据）。";
                  const detailToolbarVariant0417 =
                    taskEntryVariant === "task0417InlineEdit" || taskEntryVariant === "task0417CardEdit"
                      ? ("figma0417" as const)
                      : ("default" as const);

                  return (
                    <div className="flex w-full min-w-0 flex-col gap-[var(--space-150)]">
                      <div
                        className={cn(
                          "self-start max-w-full break-words rounded-tl-[var(--radius-sm)] rounded-tr-[var(--radius-lg)] rounded-bl-[var(--radius-lg)] rounded-br-[var(--radius-lg)]",
                          "border border-transparent bg-bg p-[var(--space-300)_var(--space-350)] shadow-xs",
                          "text-[length:var(--font-size-base)] font-normal leading-normal text-text"
                        )}
                      >
                        {feedbackText}
                      </div>
                      <TaskDetailCard
                        detail={detail}
                        detailToolbarVariant={detailToolbarVariant0417}
                        onPushTaskChatCard={
                          appContext === "task"
                            ? (kind: TaskChatCardKind, options?: TaskPushChatCardOptions) => {
                                const markers: Record<TaskChatCardKind, string> = {
                                  edit: EDIT_TASK_FORM_MARKER,
                                  subtask: SUBTASK_FORM_MARKER,
                                  handover: HANDOVER_CARD_MARKER,
                                  link_sub: LINK_SUBTASK_CARD_MARKER,
                                  eval: EVAL_RECORDS_CARD_MARKER,
                                  execution: EXECUTION_CONTENT_FORM_MARKER,
                                  execution_edit: EXECUTION_CONTENT_FORM_MARKER,
                                  task_hub: TASK_HUB_CARD_MARKER,
                                  execution_division_list: EXECUTION_DIVISION_LIST_MARKER,
                                  kanban_scope_list: KANBAN_SCOPE_LIST_MARKER,
                                  new_output: NEW_OUTPUT_FORM_MARKER,
                                  execution_content_detail: EXECUTION_CONTENT_DETAIL_MARKER,
                                };
                                let payload: Record<string, unknown>;
                                if (kind === "execution_edit" && options?.initial) {
                                  payload = { id: detail.id, mode: "edit", values: options.initial };
                                } else if (kind === "execution") {
                                  payload =
                                    options?.phase !== undefined
                                      ? { id: detail.id, phase: options.phase }
                                      : { id: detail.id };
                                } else if (kind === "task_hub" && options?.hub) {
                                  payload = { id: detail.id, hub: options.hub };
                                } else if (kind === "execution_division_list" && options?.executionDivisionScope) {
                                  payload = { id: detail.id, scope: options.executionDivisionScope };
                                } else if (kind === "kanban_scope_list" && options?.kanbanScope) {
                                  payload = { id: detail.id, scope: options.kanbanScope };
                                } else if (kind === "execution_content_detail" && options?.executionRow) {
                                  payload = { id: detail.id, row: options.executionRow };
                                } else {
                                  payload = { id: detail.id };
                                }
                                pushNewRoundMessages((prev) => [
                                  ...prev,
                                  {
                                    id: `task-chat-${kind}-${Date.now()}`,
                                    senderId: conversation.user.id,
                                    content: `${markers[kind]}:${JSON.stringify(payload)}`,
                                    timestamp: new Date().toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }),
                                    createdAt: Date.now(),
                                    isAfterPrompt: true,
                                    operationSource: {
                                      cardTitle: "任务",
                                      sourceMessageId: msg.id,
                                      sourceDetailLabel: detail.name,
                                    },
                                  },
                                ]);
                              }
                            : undefined
                        }
                      />
                    </div>
                  );
                } catch {
                  return (
                    <div className="text-[length:var(--font-size-sm)] text-error">编辑反馈与详情解析失败</div>
                  );
                }
              })()}
            </TaskChatMessageRow>
          ) : isSubtaskFormCard ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
                {(() => {
                  try {
                    const rest = msg.content.slice(SUBTASK_FORM_MARKER.length);
                    const jsonStr = rest.startsWith(":") ? rest.slice(1) : "{}";
                    const parsed = JSON.parse(jsonStr) as { id?: string };
                    const parent = getTaskDetailOrFallback(parsed.id ?? "");
                    return (
                      <CreateSubtaskFormCard
                        parent={parent}
                        onConfirm={(snap) => {
                          if (!snap.name.trim()) return;
                          appendTaskSubtasksForChat(parent.id, [
                            {
                              id: `st-${Date.now()}`,
                              name: snap.name.trim(),
                              assignee: snap.assignee.trim() || "—",
                              owner: snap.owner.trim() || parent.owner,
                              status: "未开始",
                              progress: 0,
                              due: snap.dateEnd.trim() || parent.due,
                              risk: "无",
                            },
                          ]);
                          pushNewRoundMessages((prev) => [
                            ...prev,
                            {
                              id: `subtask-ok-${Date.now()}`,
                              senderId: conversation.user.id,
                              content: `已创建子任务「${snap.name.trim()}」（演示）。`,
                              timestamp: new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              }),
                              createdAt: Date.now(),
                              isAfterPrompt: true,
                            },
                          ]);
                        }}
                      />
                    );
                  } catch {
                    return <div className="text-[length:var(--font-size-sm)] text-error">创建子任务卡片解析失败</div>;
                  }
                })()}
            </TaskChatMessageRow>
          ) : isHandoverCard ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
                <HandoverTaskCard
                  onConfirm={() => {
                    pushNewRoundMessages((prev) => [
                      ...prev,
                      {
                        id: `handover-ok-${Date.now()}`,
                        senderId: conversation.user.id,
                        content: "交接已提交（演示）。",
                        timestamp: new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                        createdAt: Date.now(),
                        isAfterPrompt: true,
                      },
                    ]);
                  }}
                />
            </TaskChatMessageRow>
          ) : isLinkSubtaskCard ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
                {(() => {
                  try {
                    const rest = msg.content.slice(LINK_SUBTASK_CARD_MARKER.length);
                    const jsonStr = rest.startsWith(":") ? rest.slice(1) : "{}";
                    const parsed = JSON.parse(jsonStr) as { id?: string };
                    const taskId = parsed.id ?? "";
                    return (
                      <LinkSubtaskChatCard
                        taskId={taskId}
                        onConfirm={(ids) => {
                          const rows = getTasksForLinkPicker(taskId);
                          const added: SubtaskRow[] = [];
                          for (const id of ids) {
                            const r = rows.find((x) => x.id === id);
                            if (r) {
                              added.push({
                                id: `link-${r.id}-${Date.now()}`,
                                name: r.name,
                                assignee: r.assignee,
                                owner: r.owner,
                                status: r.status,
                                progress: r.progress,
                                due: r.due,
                                risk: r.risk,
                                linked: true,
                              });
                            }
                          }
                          if (added.length) appendTaskSubtasksForChat(taskId, added);
                          pushNewRoundMessages((prev) => [
                            ...prev,
                            {
                              id: `link-sub-ok-${Date.now()}`,
                              senderId: conversation.user.id,
                              content:
                                added.length > 0
                                  ? `已关联 ${added.length} 条子任务（演示）。`
                                  : "未选择关联项。",
                              timestamp: new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              }),
                              createdAt: Date.now(),
                              isAfterPrompt: true,
                            },
                          ]);
                        }}
                      />
                    );
                  } catch {
                    return <div className="text-[length:var(--font-size-sm)] text-error">关联子任务卡片解析失败</div>;
                  }
                })()}
            </TaskChatMessageRow>
          ) : isEvalRecordsCard ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
                <TaskEvaluationRecordsCard />
            </TaskChatMessageRow>
          ) : isExecutionContentForm ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
                {(() => {
                  try {
                    const rest = msg.content.slice(EXECUTION_CONTENT_FORM_MARKER.length);
                    const jsonStr = rest.startsWith(":") ? rest.slice(1) : "{}";
                    const parsed = JSON.parse(jsonStr) as {
                      id?: string;
                      phase?: string;
                      mode?: "edit";
                      values?: ExecutionContentValues;
                    };
                    const detail = getTaskDetailOrFallback(parsed.id ?? "");
                    const isEdit = parsed.mode === "edit" && parsed.values != null;
                    return (
                      <ExecutionContentFormCard
                        mode={isEdit ? "edit" : "create"}
                        initialValues={isEdit ? parsed.values : undefined}
                        defaultAssignee={detail.assignee}
                        defaultPhase={parsed.phase}
                        onConfirm={() => {
                          pushNewRoundMessages((prev) => [
                            ...prev,
                            {
                              id: `exec-ok-${Date.now()}`,
                              senderId: conversation.user.id,
                              content: isEdit
                                ? "执行内容已保存（演示数据）。"
                                : "执行内容已添加（演示数据）。",
                              timestamp: new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              }),
                              createdAt: Date.now(),
                              isAfterPrompt: true,
                            },
                          ]);
                        }}
                      />
                    );
                  } catch {
                    return (
                      <div className="text-[length:var(--font-size-sm)] text-error">执行内容卡片解析失败</div>
                    );
                  }
                })()}
            </TaskChatMessageRow>
          ) : isNewOutputForm ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
                {(() => {
                  try {
                    const rest = msg.content.slice(NEW_OUTPUT_FORM_MARKER.length);
                    const jsonStr = rest.startsWith(":") ? rest.slice(1) : "{}";
                    const parsed = JSON.parse(jsonStr) as { id?: string };
                    const detail = getTaskDetailOrFallback(parsed.id ?? "");
                    return (
                      <NewOutputFormCard
                        defaultProducer={detail.assignee}
                        onConfirm={({ title }) => {
                          pushNewRoundMessages((prev) => [
                            ...prev,
                            {
                              id: `output-ok-${Date.now()}`,
                              senderId: conversation.user.id,
                              content: `产出「${title}」已添加（演示数据）。`,
                              timestamp: new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              }),
                              createdAt: Date.now(),
                              isAfterPrompt: true,
                            },
                          ]);
                        }}
                      />
                    );
                  } catch {
                    return (
                      <div className="text-[length:var(--font-size-sm)] text-error">新建产出卡片解析失败</div>
                    );
                  }
                })()}
            </TaskChatMessageRow>
          ) : isTaskFilterCard ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
                <TaskFilterCard />
            </TaskChatMessageRow>
          ) : isTaskSettingsCard ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
                <TaskSettingsCard />
            </TaskChatMessageRow>
          ) : isPermissionEdit0424Card ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
              <PermissionEditCard0424
                titleBelowAccessory={mainAiOrgScopeBarEl ?? undefined}
                onScrollMutatedCardToTop={() => scrollInPlaceMutatedCardToTop(msg.id)}
                onReplaceWithDetail={(payload: PermissionEditDetailPayload0424) => {
                  scrollInPlaceMutatedCardToTop(msg.id);
                  patchMessages((prev) =>
                    prev.map((m) =>
                      m.id === msg.id
                        ? {
                            ...m,
                            content: `${PERMISSION_DETAIL_CARD_0424_MARKER_PREFIX}${JSON.stringify(payload)}`,
                          }
                        : m,
                    ),
                  );
                }}
              />
            </TaskChatMessageRow>
          ) : isPermissionDetail0424Card ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
              {(() => {
                try {
                  const raw = msg.content.slice(PERMISSION_DETAIL_CARD_0424_MARKER_PREFIX.length);
                  const payload = JSON.parse(raw) as PermissionEditDetailPayload0424;
                  return (
                    <PermissionDetailCard0424
                      payload={payload}
                      titleBelowAccessory={mainAiOrgScopeBarEl ?? undefined}
                    />
                  );
                } catch {
                  return (
                    <div className="text-[length:var(--font-size-sm)] text-[color:var(--color-error)]">
                      权限详情数据解析失败
                    </div>
                  );
                }
              })()}
            </TaskChatMessageRow>
          ) : isOrganizationManagement0425Card ? (
              <TaskChatMessageRow
                hideAvatar={hideAvatar}
                avatarSrc={conversation.user.avatar}
                operationSourceLabel={operationSourceLabel}
              >
                <div className="flex w-full min-w-0 flex-col gap-[var(--space-150)]">
                  <OrganizationManagementCard0425
                    key={`org0425-${msg.id}-${interactionRulesOrgCardResetKey}`}
                    mainAiTitleBelowAccessory={mainAiOrgScopeBarEl ?? undefined}
                    organizationHeadline={
                      currentOrg !== NO_ORG_MESSAGE_SCOPE
                        ? schedule0422NavOrganizations.find((o) => o.id === currentOrg)?.name ??
                          currentOrg
                        : undefined
                    }
                    hideSubtitle={
                      interactionRulesOrgNavDemo && interactionRulesOrgCardMessageId === msg.id
                    }
                  />
                </div>
              </TaskChatMessageRow>
          ) : isOrgEmployeePermissionGuide0425Card ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
              <OrganizationPermissionApplySection0425
                mode="guideOnly"
                mainAiGuideAndSettingsTitleBelow={mainAiOrgScopeBarEl ?? undefined}
              />
            </TaskChatMessageRow>
          ) : isOrgSettingsPermission0425Card ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
              <OrganizationPermissionApplySection0425
                mode="orgSettingsOnly"
                mainAiGuideAndSettingsTitleBelow={mainAiOrgScopeBarEl ?? undefined}
              />
            </TaskChatMessageRow>
          ) : isGenericCard ? (
            <TaskChatMessageRow
              hideAvatar={hideAvatar}
              avatarSrc={conversation.user.avatar}
              operationSourceLabel={operationSourceLabel}
            >
                {(() => {
                  try {
                    const jsonStr = msg.content.replace("<<<RENDER_GENERIC_CARD>>>:", "");
                    const cardData = parseGenericCardPayloadJson(jsonStr);
                    if (!cardData) {
                      return <div className="text-[length:var(--font-size-sm)] text-[color:var(--color-error)]">卡片数据解析失败</div>;
                    }
                    return (
                      <GenericCard title={cardData.title}>
                        {cardData.description ? (
                          <p className="text-[length:var(--font-size-base)] text-text-secondary mb-[var(--space-200)] leading-relaxed">
                            {cardData.description}
                          </p>
                        ) : null}
                        {cardData.detail && (
                          <div className="bg-bg-secondary border border-border rounded-md p-[var(--space-400)]">
                            <p className="text-[length:var(--font-size-sm)] text-text whitespace-pre-wrap">{cardData.detail}</p>
                          </div>
                        )}
                        <div className="flex flex-col sm:flex-row gap-[var(--space-200)] w-full mt-[var(--space-400)]">
                          <Button className="w-full sm:w-auto" variant="chat-submit" onClick={() => {
                            const userMsg: Message = {
                              id: `user-start-${Date.now()}`,
                              senderId: currentUser.id,
                              content: "我已经准备好了，请开始吧。",
                              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                              createdAt: Date.now()
                            };
                            pushNewRoundMessages((prev) => [...prev, userMsg]);
                          }}>开始学习</Button>
                          <Button className="w-full sm:w-auto" variant="chat-reset" onClick={() => {
                            const newCardData = JSON.stringify({
                              title: "更多推荐",
                              description: "这里是为您推荐的另外一些管理功能。",
                              detail: "🌟 推荐操作：\n1. 点击「商品管理」-「物料商品」\n2. 点击「财务管理」-「财务报表」",
                              imageSrc: cardData.imageSrc
                            });
                            const botMsg: Message = {
                              id: `bot-card-${Date.now()}`,
                              senderId: conversation.user.id,
                              content: `<<<RENDER_GENERIC_CARD>>>:${newCardData}`,
                              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                              createdAt: Date.now(),
                              isAfterPrompt: true,
                              operationSource: {
                                cardTitle: cardData.title,
                                sourceMessageId: msg.id,
                              },
                            };
                            pushNewRoundMessages((prev) => [...prev, botMsg]);
                          }}>换一个</Button>
                        </div>
                      </GenericCard>
                    )
                  } catch (e) {
                    return <div className="text-error">卡片数据解析失败</div>
                  }
                })()}
            </TaskChatMessageRow>
          ) : isSimpleCreateOrg0421 ? (
            <div className={cnChatAssistantMessageRow({ mergedWithPrevious: !!hideAvatar })}>
              {!hideAvatar ? (
                <Avatar className={CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME}>
                  <AvatarImage src={conversation.user.avatar} className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME} />
                </Avatar>
              ) : (
                <div className={CHAT_MESSAGE_ASSISTANT_AVATAR_SPACER_CLASSNAME} />
              )}
              <div className="w-full">
                <SimpleOrg0421NameCard
                  mode="create"
                  onSubmit={(n) => establish0421Organization("create", n)}
                />
              </div>
            </div>
          ) : isSimpleJoinOrg0421 ? (
            <div className={cnChatAssistantMessageRow({ mergedWithPrevious: !!hideAvatar })}>
              {!hideAvatar ? (
                <Avatar className={CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME}>
                  <AvatarImage src={conversation.user.avatar} className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME} />
                </Avatar>
              ) : (
                <div className={CHAT_MESSAGE_ASSISTANT_AVATAR_SPACER_CLASSNAME} />
              )}
              <div className="w-full">
                <SimpleOrg0421NameCard
                  mode="join"
                  onSubmit={(n) => establish0421Organization("join", n)}
                />
              </div>
            </div>
          ) : isInvite0421OrgEmployeeOnboard ? (
            <Invite0421OrgEmployeeOnboardInChat
              onBasicInfoSubmitted={() => setInvite0421EmployeeAwaitingDemoApproval(true)}
              assistantAvatarSrc={conversation.user.avatar}
              hideAvatar={!!hideAvatar}
              basicInfoTitleBelowAccessory={mainAiOrgScopeBarEl ?? undefined}
            />
          ) : isInvite0421EduStudentInviteFlow ? (
            <Invite0421EduStudentInviteFlowBody
              state={invite0421EduInviteFlow ?? INVITE0421_EDU_INVITE_FLOW_INITIAL}
              onPatch={(p) => onInvite0421EduInviteFlowPatch?.(p)}
              onEnterSpace={() => {
                bootstrapInvite0421EduStudentZhangFamilySpaceIfNeeded();
                onInvite0421EduStudentFlowComplete?.();
              }}
              roundStackGapClassName="gap-[length:var(--space-500)]"
              mainAiAssistantAvatarSrc={conversation.user.avatar}
              mainAiMergeFirstAssistantRoundWithPrevious={!!hideAvatar}
              mainAiGenericCardTitleBelow={mainAiEducationScopeBarEl ?? undefined}
            />
          ) : isWorkbenchOrgGatePrompt ? (
            <div className={cnChatAssistantMessageRow({ mergedWithPrevious: !!hideAvatar })}>
              {!hideAvatar ? (
                <Avatar className={CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME}>
                  <AvatarImage src={conversation.user.avatar} className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME} />
                </Avatar>
              ) : (
                <div className={CHAT_MESSAGE_ASSISTANT_AVATAR_SPACER_CLASSNAME} />
              )}
              <div className="w-full">
                {(() => {
                  try {
                    const jsonStr = msg.content.replace(`${WORKBENCH_ORG_GATE_PROMPT_MARKER}:`, "");
                    const parsed = JSON.parse(jsonStr) as {
                      label?: string;
                      invite0421NewUser?: boolean;
                    };
                    const invite0421Gate = parsed.invite0421NewUser === true;
                    const serviceLabel =
                      typeof parsed.label === "string" && parsed.label.trim()
                        ? parsed.label.trim()
                        : "该";
                    return (
                      <div className="flex w-full flex-col gap-[var(--space-200)] pb-[var(--space-300)]">
                        <div className="bg-bg p-[var(--space-350)] rounded-tl-sm rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-xs border border-transparent w-full md:max-w-[600px]">
                          <p className="text-text text-[length:var(--font-size-base)] leading-normal">
                            {invite0421Gate
                              ? "您还没有加入任何企业/组织，创建或加入企业/组织即可开启服务。"
                              : `创建或加入企业/组织，开启${serviceLabel}服务。`}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-[var(--space-200)]">
                          <ChatPromptButton type="button" onClick={handleCreateOrg}>
                            创建企业/组织
                          </ChatPromptButton>
                          <ChatPromptButton type="button" onClick={handleJoinOrg}>
                            加入企业/组织
                          </ChatPromptButton>
                        </div>
                      </div>
                    );
                  } catch {
                    return <div className="text-[length:var(--font-size-sm)] text-error">引导内容解析失败</div>;
                  }
                })()}
              </div>
            </div>
          ) : isOrgSwitcher ? (
            <div className={cnChatAssistantMessageRow({ mergedWithPrevious: !!hideAvatar })}>
              {!hideAvatar ? (
                <Avatar className={CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME}>
                  <AvatarImage src={conversation.user.avatar} className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME} />
                </Avatar>
              ) : (
                <div className={CHAT_MESSAGE_ASSISTANT_AVATAR_SPACER_CLASSNAME} />
              )}
              <div className="w-full">
                <OrganizationSwitcherCard
                  currentOrg={
                    invite0421JoinedOrganizationList.find((o) => o.id === currentOrg) ?? {
                      id: currentOrg,
                      name: "未加入组织",
                      icon: orgIcon,
                      memberCount: 0,
                      description: "创建或加入企业/组织后可在此切换",
                    }
                  }
                  organizations={invite0421JoinedOrganizationList}
                  onSelectOrg={handleOrgSwitch}
                  onCreateOrg={handleCreateOrg}
                  onJoinOrg={handleJoinOrg}
                  titleBelowAccessory={mainAiOrgScopeBarEl ?? undefined}
                />
              </div>
            </div>
          ) : isCreateOrgForm ? (
            <div className={cnChatAssistantMessageRow({ mergedWithPrevious: !!hideAvatar })}>
              {!hideAvatar ? (
                <Avatar className={CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME}>
                  <AvatarImage src={conversation.user.avatar} className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME} />
                </Avatar>
              ) : (
                <div className={CHAT_MESSAGE_ASSISTANT_AVATAR_SPACER_CLASSNAME} />
              )}
              <div className="w-full">
                <CreateOrgFormCard
                  onSubmit={(data) => handleCreateOrgSubmit(data, secondaryCtx)}
                  onCancel={() => {
                    // 可选：返回组织切换器
                  }}
                />
              </div>
            </div>
          ) : isCreateOrgSuccess ? (
            <div className={cnChatAssistantMessageRow({ mergedWithPrevious: !!hideAvatar })}>
              {!hideAvatar ? (
                <Avatar className={CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME}>
                  <AvatarImage src={conversation.user.avatar} className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME} />
                </Avatar>
              ) : (
                <div className={CHAT_MESSAGE_ASSISTANT_AVATAR_SPACER_CLASSNAME} />
              )}
              <div className="w-full">
                {(() => {
                  try {
                    const successData = JSON.parse(msg.content.replace(`${CREATE_ORG_SUCCESS_MARKER}:`, ""));
                    return (
                      <>
                        {/* 引导提示气泡 */}
                        <div className="bg-bg p-[var(--space-350)] rounded-tl-sm rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-xs border border-transparent w-full md:max-w-[600px] mb-[var(--space-300)]">
                          <p className="text-text text-[length:var(--font-size-base)] leading-normal">
                            💡 您可以通过邀请码邀请其他成员加入组织，或管理组织的各项设置。接下来您可以：
                          </p>
                        </div>
                        
                        <CreateOrgSuccessCard
                          orgId={successData.orgId}
                          orgName={successData.orgName}
                          fullName={successData.fullName}
                          country={successData.country}
                          industry={successData.industry}
                          address={successData.address}
                          email={successData.email}
                          phone={successData.phone}
                          description={successData.description}
                          memberCount={successData.memberCount}
                          titleBelowAccessory={mainAiOrgScopeBarEl ?? undefined}
                        />
                        
                        {/* 行动建议引导气泡 */}
                        <div className="bg-bg p-[var(--space-350)] rounded-tl-sm rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-xs border border-transparent w-fit max-w-full mt-[var(--space-300)] mb-[var(--space-200)]">
                          <p className="text-text text-[length:var(--font-size-base)] leading-normal min-w-0 break-words">
                            接下来您可以：
                          </p>
                        </div>
                        
                        {/* Prompt buttons outside the card */}
                        <div className="flex flex-wrap gap-[var(--space-200)]">
                          <ChatPromptButton 
                            onClick={() => {
                              const userMsg: Message = {
                                id: `user-invite-${Date.now()}`,
                                senderId: currentUser.id,
                                content: "生成邀请码",
                                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                createdAt: Date.now()
                              };
                              pushNewRoundMessages((prev) => [...prev, userMsg]);
                              
                              setTimeout(() => {
                                const inviteCode = `INVITE${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
                                const botMsg: Message = {
                                  id: `bot-invite-${Date.now()}`,
                                  senderId: conversation.user.id,
                                  content: `已为组织「${successData.orgName}」生成邀请码：**${inviteCode}**\n\n有效期：7天\n使用次数：不限\n\n您可以将此邀请码分享给需要加入组织的成员。`,
                                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                  createdAt: Date.now(),
                                  isAfterPrompt: true
                                };
                                pushNewRoundMessages((prev) => [...prev, botMsg]);
                              }, 500);
                            }}
                          >
                            生成邀请码
                          </ChatPromptButton>
                          <ChatPromptButton 
                            onClick={() => {
                              const userMsg: Message = {
                                id: `user-settings-${Date.now()}`,
                                senderId: currentUser.id,
                                content: "管理组织设置",
                                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                createdAt: Date.now()
                              };
                              pushNewRoundMessages((prev) => [...prev, userMsg]);
                              
                              setTimeout(() => {
                                const botMsg: Message = {
                                  id: `bot-settings-${Date.now()}`,
                                  senderId: conversation.user.id,
                                  content: `组织设置功能包括：\n\n1. **基本信息** - 修改组织名称、描述、Logo等\n2. **成员管理** - 查看、添加、移除成员\n3. **权限设置** - 配置角色和权限\n4. **邀请管理** - 创建和管理邀请码\n\n请问您想要管理哪一项？`,
                                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                  createdAt: Date.now(),
                                  isAfterPrompt: true
                                };
                                pushNewRoundMessages((prev) => [...prev, botMsg]);
                              }, 500);
                            }}
                          >
                            管理组织设置
                          </ChatPromptButton>
                          <ChatPromptButton 
                            onClick={() => {
                              const userMsg: Message = {
                                id: `user-view-${Date.now()}`,
                                senderId: currentUser.id,
                                content: "查看组织详情",
                                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                createdAt: Date.now()
                              };
                              pushNewRoundMessages((prev) => [...prev, userMsg]);
                              
                              setTimeout(() => {
                                handleOrgSwitch(successData.orgId);
                              }, 300);
                            }}
                          >
                            查看组织详情
                          </ChatPromptButton>
                        </div>
                      </>
                    )
                  } catch (e) {
                    return <div className="text-[length:var(--font-size-sm)] text-[color:var(--color-error)]">成功数据解析失败</div>
                  }
                })()}
              </div>
            </div>
          ) : isJoinOrgForm ? (
            <div className={cnChatAssistantMessageRow({ mergedWithPrevious: !!hideAvatar })}>
              {!hideAvatar ? (
                <Avatar className={CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME}>
                  <AvatarImage src={conversation.user.avatar} className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME} />
                </Avatar>
              ) : (
                <div className={CHAT_MESSAGE_ASSISTANT_AVATAR_SPACER_CLASSNAME} />
              )}
              <div className="w-full">
                <JoinOrgFormCard
                  onSubmit={(code) => handleJoinOrgSubmit(code, secondaryCtx)}
                  onCancel={() => {
                    // 可选：返回组织切换器
                  }}
                />
              </div>
            </div>
          ) : isJoinOrgConfirm ? (
            <div className={cnChatAssistantMessageRow({ mergedWithPrevious: !!hideAvatar })}>
              {!hideAvatar ? (
                <Avatar className={CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME}>
                  <AvatarImage src={conversation.user.avatar} className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME} />
                </Avatar>
              ) : (
                <div className={CHAT_MESSAGE_ASSISTANT_AVATAR_SPACER_CLASSNAME} />
              )}
              <div className="w-full">
                {(() => {
                  try {
                    const confirmData = JSON.parse(msg.content.replace(`${JOIN_ORG_CONFIRM_MARKER}:`, ""));
                    return (
                      <JoinOrgConfirmCard
                        orgId={confirmData.orgId}
                        orgName={confirmData.orgName}
                        orgIcon={confirmData.orgIcon}
                        memberCount={confirmData.memberCount}
                        description={confirmData.description}
                        onConfirm={(id) => handleConfirmJoinOrg(id, secondaryCtx)}
                        onCancel={() => {
                          // 可选：返回组织切换器
                        }}
                        titleBelowAccessory={mainAiOrgScopeBarEl ?? undefined}
                      />
                    )
                  } catch (e) {
                    return <div className="text-error">确认数据解析失败</div>
                  }
                })()}
              </div>
            </div>
          ) : isCreateInstitutionEduSpace ? (
            <div className={cnChatAssistantMessageRow({ mergedWithPrevious: !!hideAvatar })}>
              {!hideAvatar ? (
                <Avatar className={CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME}>
                  <AvatarImage src={conversation.user.avatar} className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME} />
                </Avatar>
              ) : (
                <div className={CHAT_MESSAGE_ASSISTANT_AVATAR_SPACER_CLASSNAME} />
              )}
              <div className="w-full">
                <CreateInstitutionEducationSpaceCard
                  onSubmit={handleCreateInstitutionSpaceSubmit}
                  mainAiTitleBelowAccessory={mainAiEducationScopeBarEl ?? undefined}
                />
              </div>
            </div>
          ) : isCreateFamilyEduSpace ? (
            <div className={cnChatAssistantMessageRow({ mergedWithPrevious: !!hideAvatar })}>
              {!hideAvatar ? (
                <Avatar className={CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME}>
                  <AvatarImage src={conversation.user.avatar} className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME} />
                </Avatar>
              ) : (
                <div className={CHAT_MESSAGE_ASSISTANT_AVATAR_SPACER_CLASSNAME} />
              )}
              <div className="w-full flex flex-col gap-[var(--space-300)]">
                {/* 先发一个引导气泡再展示选择/表单卡，贴合图 3/4/5 视觉 */}
                <div className="bg-bg p-[var(--space-350)] rounded-tl-sm rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-xs border border-transparent w-full md:max-w-[600px]">
                  <p className="text-text text-[length:var(--font-size-base)] leading-normal">
                    正在为您创建教育空间，请选择您的身份：
                  </p>
                </div>
                <CreateFamilyEducationSpaceCard
                  defaultStudentName={
                    currentUser.name && currentUser.name !== "我" ? currentUser.name : "yzhao"
                  }
                  onSubmit={handleCreateFamilySpaceSubmit}
                  mainAiTitleBelowAccessory={mainAiEducationScopeBarEl ?? undefined}
                />
              </div>
            </div>
          ) : isCreateEduSpaceSuccess ? (
            <div className={cnChatAssistantMessageRow({ mergedWithPrevious: !!hideAvatar })}>
              {!hideAvatar ? (
                <Avatar className={CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME}>
                  <AvatarImage src={conversation.user.avatar} className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME} />
                </Avatar>
              ) : (
                <div className={CHAT_MESSAGE_ASSISTANT_AVATAR_SPACER_CLASSNAME} />
              )}
              <div className="w-full">
                {(() => {
                  try {
                    const data = JSON.parse(
                      msg.content.replace(`${CREATE_EDU_SPACE_SUCCESS_MARKER}:`, ""),
                    );
                    if (data.type === "family") {
                      /** 家庭空间：反馈文案 + 行动建议（购买课程 / 添加成员） */
                      return (
                        <div className="flex flex-col gap-[var(--space-200)] w-full">
                          <div className="bg-bg p-[var(--space-350)] rounded-tl-sm rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-xs border border-transparent w-full md:max-w-[600px]">
                            <p className="text-text text-[length:var(--font-size-base)] leading-normal">
                              您的家庭教育空间已创建。
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-[var(--space-200)] w-full">
                            <ChatPromptButton onClick={handleFamilyBuyCourse}>
                              购买课程
                            </ChatPromptButton>
                            <ChatPromptButton onClick={handleFamilyAddMember}>
                              添加成员
                            </ChatPromptButton>
                          </div>
                        </div>
                      );
                    }
                    /** 机构空间：沿用原反馈气泡 */
                    const title = `已创建机构教育空间「${data.name}」`;
                    return (
                      <div className="bg-bg p-[var(--space-350)] rounded-tl-sm rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-xs border border-transparent w-full md:max-w-[600px]">
                        <p className="text-text text-[length:var(--font-size-base)] leading-normal">
                          ✅ {title}，你现在可以开始使用教育 AI 助手了。
                        </p>
                      </div>
                    );
                  } catch {
                    return <div className="text-error">创建结果解析失败</div>;
                  }
                })()}
              </div>
            </div>
          ) : (
            <ChatMessageBubble
              msg={msg}
              isMe={isMe}
              userAvatar={currentUser.avatar}
              aiAvatar={conversation.user.avatar}
              userName={isMe ? "Me" : conversation.user.name}
              isSpecialComponent={isSpecialComponent}
              isPersonalInfo={isPersonalInfo}
              isCreateEmailForm={isCreateEmailForm}
              isContinueEmail={isContinueEmail}
              hideAvatar={hideAvatar}
              className={cn(
                hideAvatar ? "-mt-[var(--space-600)]" : "",
                isMe ? "flex-col-reverse md:flex-row" : ""
              )}
              handleEmailFormSubmit={handleEmailFormSubmit}
              handleContinueCreateEmail={handleContinueCreateEmail}
            />
          )}
        </div>
        </OperationSourceNavContext.Provider>
      );
    });

    if (
      slotWrapConfig &&
      slotWrapConfig.startMessageIndex < messageElements.length
    ) {
      const head = messageElements.slice(0, slotWrapConfig.startMessageIndex);
      const tail = messageElements.slice(slotWrapConfig.startMessageIndex);
      return [
        ...head,
        <NewRoundSlotShell
          key="new-round-conversation-slot"
          heightPx={slotWrapConfig.slotHeightPx}
          messageGapClassName={slotWrapConfig.messageGapClassName}
          shellRef={slotWrapConfig.shellRef}
          onContentExceedsSlot={slotWrapConfig.onOverflow}
          revealChildrenAfterMs={slotWrapConfig.revealChildrenAfterMs ?? 0}
        >
          {tail}
        </NewRoundSlotShell>,
      ];
    }
    return messageElements;
  };

  /** 教育底栏：当前应渲染的一级快捷入口列表（含「无空间仅展示前 3 个」演示态；含独立浮窗内教育底栏） */
  const educationDockShortcutApps = React.useMemo(() => {
    const inEducationUi = activeApp === "education" || floatingApps.includes("education");
    if (!inEducationUi) return [] as typeof EDUCATION_APPS;
    if (educationNoSpaceDockTeaser && !effectiveHasEducationSpace) {
      return EDUCATION_APPS.slice(0, 3);
    }
    if (currentEducationSpaceKind === "family") {
      return FAMILY_EDUCATION_APPS as unknown as typeof EDUCATION_APPS;
    }
    if (currentEducationSpaceKind === "institution") return EDUCATION_APPS;
    return [] as typeof EDUCATION_APPS;
  }, [
    activeApp,
    floatingApps,
    educationNoSpaceDockTeaser,
    effectiveHasEducationSpace,
    currentEducationSpaceKind,
  ]);

  const eduDockTeaserMenuClickRef = React.useRef(0);
  React.useEffect(() => {
    if (effectiveHasEducationSpace) eduDockTeaserMenuClickRef.current = 0;
  }, [effectiveHasEducationSpace]);

  /** 0421-有组织无教育空间-2：一级按钮无下拉；首次点插入对话气泡，再次点 toast（无图标白圈） */
  const handleEducationTeaserFlatButtonClick = React.useCallback(
    (_appName: string, afterScroll?: () => void) => {
      if (eduDockTeaserMenuClickRef.current === 0) {
        beginNewUserChatRound("education");
        const now = Date.now();
        const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const bubbleMsg: Message = {
          id: `edu-teaser-first-${now}`,
          senderId: conversation.user.id,
          content: "创建您的教育空间，开启教育服务",
          timestamp: ts,
          createdAt: now,
          isAfterPrompt: true,
        };
        setEducationMessages((prev) => [...prev, bubbleMsg]);
        eduDockTeaserMenuClickRef.current = 1;
        window.requestAnimationFrame(() => afterScroll?.());
        return;
      }
      toast.custom(
        () => (
          <div className="flex max-w-[min(90vw,360px)] items-center gap-[var(--space-200)] rounded-[var(--radius-lg)] border border-border bg-popover px-[var(--space-400)] py-[var(--space-300)] text-[length:var(--font-size-sm)] font-[var(--font-weight-regular)] leading-normal text-text shadow-md">
            <Info className="size-[18px] shrink-0 text-primary" strokeWidth={2.2} aria-hidden />
            <span>请先创建教育空间</span>
          </div>
        ),
        { duration: 3000 },
      );
    },
    [beginNewUserChatRound, conversation.user.id, setEducationMessages],
  );

  const appendEducationShortcutDemoConversation = React.useCallback(
    (menu: string, appName: string, imageSrc: string, afterBot?: () => void) => {
      beginNewUserChatRound("education");
      const now = Date.now();
      const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const userMsg: Message = {
        id: `user-${now}`,
        senderId: currentUser.id,
        content: `我想使用${appName}的「${menu}」功能`,
        timestamp: ts,
        createdAt: now,
      };
      const cardData = JSON.stringify({
        title: `${appName} - ${menu}`,
        description: `这是关于「${menu}」的专属指导内容，请根据提示进行操作。`,
        detail: "1. 明确您的操作目标\n2. 跟着助手一步步完成管理流程\n3. 遇到不懂的问题随时向我提问",
        imageSrc,
      });
      const botMsg: Message = {
        id: `bot-card-${now + 1}`,
        senderId: conversation.user.id,
        content: `<<<RENDER_GENERIC_CARD>>>:${cardData}`,
        timestamp: ts,
        createdAt: now + 1,
      };
      setEducationMessages((prev) => [...prev, userMsg]);
      window.setTimeout(() => {
        setEducationMessages((prev) => [...prev, botMsg]);
        afterBot?.();
      }, 500);
    },
    [beginNewUserChatRound, conversation.user.id, setEducationMessages],
  );

  const handleEducationDockShortcutMenuClick = React.useCallback(
    (menu: string, appName: string, _appId: string, imageSrc: string, afterBot?: () => void) => {
      appendEducationShortcutDemoConversation(menu, appName, imageSrc, afterBot);
    },
    [appendEducationShortcutDemoConversation],
  );

  /** 「0419-方案探索-侧边栏」：主 AI / 各业务能力切换时欢迎语与行动建议保持同一套，不随上下文变 */
  const explore0419AssistantGreeting =
    "你好，我是你的专属AI助手。请问今天需要处理什么？";
  /** 有消息后整段收起，避免欢迎区夹在吸顶与新一轮槽位之间导致对齐错误 */
  const explore0419WelcomeSection =
    messages.length === 0 ? (
      <div className="flex w-full flex-col gap-[var(--space-200)]">
        <ChatWelcome avatarSrc={conversation.user.avatar} greeting={explore0419AssistantGreeting} />
        <div className="flex flex-wrap gap-[var(--space-200)] w-full md:ml-[44px]">
          <ChatPromptButton
            onClick={() => {
              setInputValue("查看我的个人信息");
              setTimeout(() => handleSendMessage(), 100);
            }}
          >
            查看个人信息
          </ChatPromptButton>
          <ChatPromptButton
            onClick={() => {
              setInputValue("帮我创建一封新邮件");
              setTimeout(() => handleSendMessage(), 100);
            }}
          >
            创建邮件
          </ChatPromptButton>
          <ChatPromptButton
            onClick={() => {
              setInputValue("今天的待办事项");
              setTimeout(() => handleSendMessage(), 100);
            }}
          >
            查看待办事项
          </ChatPromptButton>
        </div>
      </div>
    ) : null;

  /** 教育应用欢迎态行动建议：机构空间沿用原管理向入口；家庭空间与底栏 `FAMILY_EDUCATION_APPS` 对齐 */
  const renderEducationWelcomeActionChips = () => {
    if (currentEducationSpaceKind === "family") {
      return (
        <>
          <ChatPromptButton
            onClick={() =>
              handleEducationDockShortcutMenuClick("课程履约", "课程管理", "", courseIcon)
            }
          >
            课程管理
          </ChatPromptButton>
          <ChatPromptButton
            onClick={() =>
              handleEducationDockShortcutMenuClick("我的订单", "商品管理", "", goodsIcon)
            }
          >
            商品管理
          </ChatPromptButton>
          <ChatPromptButton
            onClick={() =>
              handleEducationDockShortcutMenuClick("成员管理", "成员管理", "", membersIcon)
            }
          >
            成员管理
          </ChatPromptButton>
          <ChatPromptButton
            onClick={() =>
              handleEducationDockShortcutMenuClick("奖励管理", "奖励管理", "", financeIcon)
            }
          >
            奖励管理
          </ChatPromptButton>
        </>
      );
    }
    return (
      <>
        <ChatPromptButton
          onClick={() => {
            setInputValue("查看课程管理");
            setTimeout(() => handleSendMessage(), 100);
          }}
        >
          课程管理
        </ChatPromptButton>
        <ChatPromptButton
          onClick={() => {
            setInputValue("学生管理");
            setTimeout(() => handleSendMessage(), 100);
          }}
        >
          学生管理
        </ChatPromptButton>
        <ChatPromptButton
          onClick={() => {
            setInputValue("查看财务报表");
            setTimeout(() => handleSendMessage(), 100);
          }}
        >
          财务报表
        </ChatPromptButton>
        <ChatPromptButton onClick={handleOrgClick}>切换组织</ChatPromptButton>
      </>
    );
  };

  return (
    <div
      className="absolute inset-0 flex flex-row w-full isolate overflow-hidden bg-cui-bg"
      data-task-entry-variant={taskEntryVariant}
    >
      {/** History Sidebar：
       * - `combinedNoEduSpace` 形态下两个独立侧栏都不再渲染，统一由下方合并栏接管。
       * - 其他形态沿用原有「主 AI + 二级应用」两栏切换。
       */}
      {sidebarVariant !== "combinedNoEduSpace" && onHistoryOpenChange && onSelect && (
        <HistorySidebar
          open={historyOpen}
          onOpenChange={onHistoryOpenChange}
          conversations={conversations}
          selectedId={selectedId}
          onSelect={onSelect}
          mode={activeApp ? 'push' : 'overlay'}
          onNewConversation={handleNewConversation}
        />
      )}

      {/* Secondary App History Sidebar（0419 关闭：历史仅按「新对话」走主侧栏，不按子应用拆分） */}
      {sidebarVariant !== "combinedNoEduSpace" &&
        !is0419Explore &&
        (activeApp === "education" || activeApp === "task") && (
          <SecondaryAppHistorySidebar
            open={secondaryHistoryOpen}
            onOpenChange={setSecondaryHistoryOpen}
            sessions={secondaryAppSessions}
            selectedId={selectedSecondarySession}
            onSelect={handleSecondarySessionSelect}
            onNewConversation={handleSecondaryAppNewConversation}
            mode="push"
          />
        )}

      {/** 合并侧栏：仅 `combinedNoEduSpace` 形态启用（用于 0421-有组织无教育空间）。
       * 顶栏汇总微微AI 对话历史 + 全局新对话；底栏展平显示各应用使用记录（不再展开）。
       */}
      {sidebarVariant === "combinedNoEduSpace" && onHistoryOpenChange && onSelect && (
        <NoEduSpaceCombinedSidebar
          open={historyOpen}
          onOpenChange={onHistoryOpenChange}
          mode="push"
          conversations={conversations}
          selectedConversationId={selectedId}
          onSelectConversation={onSelect}
          onNewConversation={handleNewConversation}
          appSessions={secondaryAppSessions}
          selectedAppSessionId={selectedSecondarySession}
          onSelectAppSession={handleSecondarySessionSelect}
        />
      )}

      {/* Main Content Wrapper */}
      <div className={cn(
        "flex flex-col flex-1 h-full w-full shrink-0 min-w-0 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] bg-cui-bg",
        activeApp ? "md:shrink" : "",
        /** Main history sidebar push effect：
         * - 默认形态：仅在主 AI 欢迎态下侧栏推挤内容（二级应用 push 模式由二级侧栏自行处理）
         * - `combinedNoEduSpace` 形态：不再区分是否 activeApp，始终按合并栏推挤主内容
         */
        sidebarVariant === "combinedNoEduSpace"
          ? historyOpen ? "translate-x-[280px] md:translate-x-0" : ""
          : historyOpen && !activeApp ? "translate-x-[280px] md:translate-x-0" : "",
        // Secondary app history sidebar push effect (for mobile in education mode)
        sidebarVariant !== "combinedNoEduSpace" &&
        !is0419Explore &&
        secondaryHistoryOpen &&
        (activeApp === "education" || activeApp === "task")
          ? "translate-x-[200px] md:translate-x-0"
          : ""
      )}>
        {/* Header - Fixed at top */}
      <ChatNavBar 
        title={
          is0419Explore
            ? activeApp === "education"
              ? "教育能力"
              : activeApp === "task"
                ? "任务能力"
                : activeApp === "mail"
                  ? "邮箱"
                  : activeApp === "schedule"
                    ? "日程"
                    : activeApp === "organization"
                      ? "组织"
                      : activeApp === "employee"
                        ? "员工"
                      : activeApp === "todo"
                        ? "待办"
                        : activeApp === "meeting"
                          ? "会议"
                          : activeApp === "disk"
                            ? "微盘"
                            : activeApp === "docs"
                              ? "文档"
                              : ""
            : activeApp === "education"
              ? "教育"
              : activeApp === "task"
                ? "任务"
                : activeApp === "mail"
                  ? "邮箱"
                  : activeApp === "schedule"
                    ? "日程"
                    : activeApp === "organization"
                      ? "组织"
                      : activeApp === "employee"
                        ? "员工"
                      : activeApp === "todo"
                        ? "待办"
                        : activeApp === "meeting"
                          ? "会议"
                          : activeApp === "disk"
                            ? "微盘"
                            : activeApp === "docs"
                              ? "文档"
                              : ""
        }
        onToggleHistory={() => {
          if (is0419Explore) {
            onToggleHistory();
            return;
          }
          /** `combinedNoEduSpace` 形态下没有二级历史栏，始终切换主侧栏（`historyOpen`） */
          if (sidebarVariant === "combinedNoEduSpace") {
            onToggleHistory();
            return;
          }
          if (activeApp === "education" || activeApp === "task") {
            setSecondaryHistoryOpen(!secondaryHistoryOpen);
          } else {
            onToggleHistory();
          }
        }}
        onNewMessage={activeApp ? undefined : handleNewConversation}
        showOrgSelect={
          (hasOrganization || interactionRulesOrgNavDemo) &&
          activeApp !== "mail" &&
          activeApp !== "education"
        }
        organizationOnboarding={
          !hasOrganization &&
          !interactionRulesOrgNavDemo &&
          activeApp !== "mail" &&
          activeApp !== "education"
            ? {
                onCreateOrganization: handleCreateOrg,
                onJoinOrganization: handleJoinOrg,
              }
            : undefined
        }
        currentOrg={currentOrg}
        organizations={schedule0422NavOrganizations}
        onOrgSelect={handleOrgSwitch}
        onCreateOrg={handleCreateOrg}
        onJoinOrg={handleJoinOrg}
        educationSpaceSelect={
          activeApp === "education" && effectiveHasEducationSpace
            ? {
                value: currentEducationSpaceId,
                onChange: setCurrentEducationSpaceId,
                nodes: educationSpaceNodes,
                onCreateInstitution: handleCreateInstitutionSpace,
                onCreateFamily: handleCreateFamilySpace,
              }
            : undefined
        }
        educationCreateSpace={
          activeApp === "education" && !effectiveHasEducationSpace
            ? {
                onCreateInstitution: handleCreateInstitutionSpace,
                onCreateFamily: handleCreateFamilySpace,
                ...(invite0421EduStudentFlow ? { ...INVITE0421_EDU_STUDENT_EMPTY_SPACE_NAV } : {}),
              }
            : undefined
        }
        onBack={
          activeApp === "education" ||
          activeApp === "task" ||
          activeApp === "mail" ||
          (organizationManagement0425Demo && activeApp === "employee") ||
          (organizationManagement0425Demo && activeApp === "organization") ||
          (schedule0422DrawerDemo && activeApp === "schedule") ||
          (invite0421DockFlow &&
            !(hasOrganization || workbenchOrgGateReleased) &&
            (activeApp === "todo" ||
              activeApp === "meeting" ||
              activeApp === "disk" ||
              activeApp === "docs" ||
              (activeApp === "schedule" && !schedule0422DrawerDemo)))
            ? () => setActiveApp(null)
            : undefined
        }
        showModelSelect={noEduSpace0421ChatToolbar ? !activeApp : true}
        currentModel={currentModel}
        modelFamilies={AVAILABLE_MODEL_FAMILIES}
        onModelSelect={handleModelSwitch}
        independentWindowAlwaysVisible={noEduSpace0421ChatToolbar && !activeApp}
        showIndependentWindow={
          alwaysShowIndependentWindow ||
          activeApp === "education" ||
          activeApp === "task" ||
          (schedule0422DrawerDemo && activeApp === "schedule") ||
          (organizationManagement0425Demo &&
            (activeApp === "organization" || activeApp === "employee"))
        }
        onIndependentWindow={() => {
          if (activeApp && !floatingApps.includes(activeApp)) {
            setPreviousActiveApp(activeApp); // 保存当前的 activeApp
            setFloatingApps([...floatingApps, activeApp]);
            setActiveApp(null); // return to main window
            return;
          }
          /** `alwaysShowIndependentWindow` 场景：在主 AI 欢迎态时点击图标——
           * 当前无主 AI 独立窗口实现，走占位反馈避免「点了没反应」。 */
          if (alwaysShowIndependentWindow && !activeApp) {
            toast("主 AI 独立窗口开发中（占位）");
          }
        }}
        emailMailboxSelect={
          taskEntryIsMailDockFamily(taskEntryVariant) && activeApp === "mail"
            ? {
                value: emailTenantScope,
                onChange: (v) => {
                  setEmailTenantScope(v);
                  if (taskEntryIsEmail0415ScopeFamily(taskEntryVariant)) {
                    onSelect?.(mailScopeToConversationId(v));
                  }
                },
                organizations: invite0421JoinedOrganizationList.map((o) => ({
                  id: o.id,
                  name: o.name,
                  icon: o.icon,
                })),
              }
            : undefined
        }
      />

      {/* Main Content Area with Entrance Animation */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <motion.div 
          key={is0419Explore ? "0419-explore-unified" : activeApp || "main"}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="min-h-0 flex-1 overflow-y-auto overflow-x-clip scrollbar-hide pb-[var(--space-200)]"
          ref={chatContainerRef}
        >
        
        {/* 待办卡片：0419 方案下主 AI 与「业务能力」子层均常驻，默认展开，可点底部中央收起；其它入口仍仅在主 AI 显示 */}
        {(is0419Explore || activeApp === null) && !schedule0422DrawerDemo && (
          <div
            ref={pinnedTaskStickyRef}
            className="sticky top-[-0px] z-30 flex w-full justify-center px-[max(20px,var(--cui-padding-max))] pointer-events-none"
          >
            <div className="pointer-events-auto w-full md:mx-[44px]">
              <PinnedTaskCard
                expanded={isTaskCardExpanded}
                onExpandedChange={setIsTaskCardExpanded}
                greeting={
                  invite0421PinnedInvitedTodos
                    ? INVITE0421_MAIN_AI_PINNED_GREETING
                    : "下午好，今天你有 2 件要处理的事情 👇"
                }
                chips={
                  invite0421PinnedInvitedTodos
                    ? [
                        {
                          iconSrc: invite0421ShowOrgInvitedChip ? organizationIcon : educationIcon,
                          alt: invite0421ShowOrgInvitedChip ? "组织邀请" : "教育空间邀请",
                          title: invite0421ShowOrgInvitedChip
                            ? invite0421OrgTodoTitle
                            : invite0421EduTodoTitle,
                        },
                        {
                          iconSrc: meetingIcon,
                          alt: "周会材料",
                          title: INVITE0421_GENERIC_TODO_TITLE,
                          time: "今天 18:00",
                        },
                      ]
                    : [
                        {
                          iconSrc: meetingIcon,
                          alt: "需求启动会议",
                          title: "需求启动会议",
                          time: "15:00 - 16:00",
                        },
                        {
                          iconSrc: calendarIcon,
                          alt: "项目评审",
                          title: "项目评审",
                          time: "17:00 - 18:00",
                        },
                        {
                          iconSrc: todoIcon,
                          alt: "待办事项",
                          title: "待办事项",
                          count: 28,
                        },
                      ]
                }
                onChipClick={(chip) => {
                  if (invite0421PinnedInvitedTodos) {
                    if (chip.title === invite0421OrgTodoTitle) {
                      appendInvite0421InvitedTodoChat("org");
                      return;
                    }
                    if (chip.title === invite0421EduTodoTitle) {
                      appendInvite0421InvitedTodoChat("edu");
                      return;
                    }
                  }
                  setSelectedTask({
                    iconSrc: chip.iconSrc,
                    title: chip.title,
                    time: chip.time,
                    description: "这是一个重要的任务，需要及时处理。请确保在截止日期前完成所有相关工作。",
                    members: [
                      {
                        id: "1",
                        name: "张三",
                        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang"
                      },
                      {
                        id: "2",
                        name: "李四",
                        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Li"
                      }
                    ]
                  });
                  setIsTaskDrawerOpen(true);
                }}
              />
            </div>
          </div>
        )}

        <div
          className={cn(
            "flex flex-col w-full px-[max(20px,var(--cui-padding-max))] pt-[var(--space-300)]",
            activeApp === "mail"
              ? "gap-[var(--space-150)] pb-[var(--space-600)]"
              : "gap-[var(--space-600)] pt-[var(--space-400)] pb-[var(--space-600)]"
          )}
        >
          {/* Welcome Message (Mock/Static as per design) */}
          {activeApp === null ? (
            is0419Explore ? (
              explore0419WelcomeSection
            ) : invite0421DockFlow ? (
              <div className="flex w-full flex-col gap-[length:var(--space-200)]">
                <Invite0421MainAiDockWelcome
                  variant={invite0421EduStudentFlow ? "eduStudent" : "orgInvited"}
                  assistantAvatarSrc={conversation.user.avatar}
                />
                <div className="scrollbar-hide flex w-full min-w-0 max-w-full flex-nowrap items-center justify-start gap-[length:var(--space-150)] overflow-x-auto overflow-y-hidden pb-[length:var(--space-50)] md:ml-[44px]">
                  <ChatPromptButton
                    type="button"
                    onClick={() => toast("即将为您播放 V V AI 介绍视频（占位）")}
                  >
                    V V AI 介绍视频
                  </ChatPromptButton>
                  {invite0421EduStudentFlow ? (
                    <ChatPromptButton
                      type="button"
                      onClick={() => appendInvite0421InvitedTodoChat("edu")}
                    >
                      {INVITE0421_EDU_PROCESS_XIAOCE_INVITE_ACTION_LABEL}
                    </ChatPromptButton>
                  ) : (
                    <ChatPromptButton
                      type="button"
                      onClick={() => appendInvite0421InvitedTodoChat("org")}
                    >
                      {INVITE0421_ORG_PROCESS_PG_INVITE_ACTION_LABEL}
                    </ChatPromptButton>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-[var(--space-200)] w-full">
                <ChatWelcome avatarSrc={conversation.user.avatar} greeting={`下午好，请问有什么可以帮到你？`} />
                {messages.length === 0 ? (
                  <div className="flex flex-wrap gap-[var(--space-200)] w-full md:ml-[44px]">
                    <ChatPromptButton
                      onClick={() => {
                        setInputValue("查看我的个人信息");
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                    >
                      查看个人信息
                    </ChatPromptButton>
                    <ChatPromptButton
                      onClick={() => {
                        setInputValue("帮我创建一封新邮件");
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                    >
                      创建邮件
                    </ChatPromptButton>
                    <ChatPromptButton
                      onClick={() => {
                        setInputValue("今天的待办事项");
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                    >
                      查看待办事项
                    </ChatPromptButton>
                  </div>
                ) : null}
              </div>
            )
          ) : activeApp === "education" ? (
            is0419Explore ? (
              explore0419WelcomeSection
            ) : !effectiveHasEducationSpace ? (
              <div className="flex flex-col gap-[var(--space-200)] w-full">
                <ChatWelcome
                  avatarSrc={conversation.user.avatar}
                  greeting={
                    invite0421EduStudentFlow
                      ? INVITE0421_EDU_STUDENT_EMPTY_WELCOME_GREETING
                      : `欢迎使用教育，您还没有创建任何教育空间。如果您是教育机构，请选择创建机构教育空间，如果您是学生或家长，请选择创建家庭教育空间。`
                  }
                />
                <div className="flex flex-wrap gap-[var(--space-200)] w-full md:ml-[44px]">
                  <ChatPromptButton onClick={handleCreateInstitutionSpace}>
                    {invite0421EduStudentFlow
                      ? INVITE0421_EDU_STUDENT_EMPTY_SPACE_NAV.createInstitutionTitle
                      : "创建机构教育空间"}
                  </ChatPromptButton>
                  <ChatPromptButton onClick={handleCreateFamilySpace}>
                    {invite0421EduStudentFlow
                      ? INVITE0421_EDU_STUDENT_EMPTY_SPACE_NAV.createFamilyTitle
                      : "创建家庭教育空间"}
                  </ChatPromptButton>
                  <ChatPromptButton onClick={handleViewEducationIntroVideo}>
                    查看教育视频介绍
                  </ChatPromptButton>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-[var(--space-200)] w-full">
                <ChatWelcome
                  avatarSrc={conversation.user.avatar}
                  greeting={`你好，我是你的教育专属AI助手。请问今天需要处理什么？`}
                />
                {educationMessages.length === 0 ? (
                  <div className="flex flex-wrap gap-[var(--space-200)] w-full md:ml-[44px]">
                    {renderEducationWelcomeActionChips()}
                  </div>
                ) : null}
              </div>
            )
          ) : activeApp === "task" ? (
            is0419Explore ? (
              explore0419WelcomeSection
            ) : (
              <div className="flex flex-col gap-[var(--space-200)] w-full">
                <ChatWelcome
                  avatarSrc={conversation.user.avatar}
                  greeting="你好，我是你的任务专属AI助手。请问今天需要处理什么？"
                />
                <div className="flex flex-wrap gap-[var(--space-200)] w-full md:ml-[44px]">
                  <ChatPromptButton
                    onClick={() => {
                      beginNewUserChatRound("task");
                      const botMsg: Message = {
                        id: `task-table-prompt-${Date.now()}`,
                        senderId: conversation.user.id,
                        content: `${TASK_TABLE_MARKER}:${JSON.stringify({ filterHint: "全部任务" })}`,
                        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        createdAt: Date.now(),
                      };
                      setTaskMessages((prev) => [...prev, botMsg]);
                    }}
                  >
                    打开任务列表
                  </ChatPromptButton>
                  <ChatPromptButton
                    onClick={() => {
                      beginNewUserChatRound("task");
                      const botMsg: Message = {
                        id: `task-form-prompt-${Date.now()}`,
                        senderId: conversation.user.id,
                        content: CREATE_TASK_FORM_MARKER,
                        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        createdAt: Date.now(),
                      };
                      setTaskMessages((prev) => [...prev, botMsg]);
                    }}
                  >
                    新建任务
                  </ChatPromptButton>
                  <ChatPromptButton onClick={handleOrgClick}>切换组织</ChatPromptButton>
                </div>
              </div>
            )
          ) : activeApp === "mail" ? (
            is0419Explore ? (
              explore0419WelcomeSection
            ) : mailMessages.length === 0 ? (
              <div className="flex w-full flex-col gap-[var(--space-150)]">
                <ChatWelcome
                  avatarSrc={conversation.user.avatar}
                  greeting={getDemoMailWelcomeGreeting()}
                />
                <div className="scrollbar-hide flex w-full min-w-0 max-w-full flex-nowrap items-center gap-[var(--space-150)] overflow-x-auto overflow-y-hidden pb-[var(--space-50)] md:ml-[44px]">
                  <ChatPromptButton type="button" onClick={() => appendMailWelcomeAction("personal_inbox")}>
                    我的邮箱
                  </ChatPromptButton>
                  <ChatPromptButton type="button" onClick={() => appendMailWelcomeAction("business_inbox")}>
                    业务邮箱
                  </ChatPromptButton>
                  <ChatPromptButton type="button" onClick={() => appendMailWelcomeAction("compose")}>
                    写邮件
                  </ChatPromptButton>
                </div>
              </div>
            ) : null
          ) : activeApp === "schedule" && schedule0422DrawerDemo ? (
            <div className="flex w-full flex-col gap-[var(--space-200)]">
              <ChatWelcome
                avatarSrc={conversation.user.avatar}
                greeting="你好，我是你的日程专属 AI 助手。可以用底部快捷入口打开列表，或直接描述你的安排。"
              />
              {messages.length === 0 ? (
                <div className="flex flex-wrap gap-[var(--space-200)] w-full md:ml-[44px]">
                  <ChatPromptButton
                    type="button"
                    onClick={() => {
                      beginNewUserChatRound("schedule");
                      const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                      const now = Date.now();
                      setMessages((prev) => [
                        ...prev,
                        {
                          id: `sch0422-open-all-${now}`,
                          senderId: currentUser.id,
                          content: "全部日程",
                          timestamp: ts,
                          createdAt: now,
                        },
                        {
                          id: `sch0422-open-all-bot-${now}`,
                          senderId: conversation.user.id,
                          content: SCHEDULE_0422_ALL_LIST_MARKER,
                          timestamp: ts,
                          createdAt: now + 1,
                          isAfterPrompt: true,
                        },
                      ]);
                    }}
                  >
                    打开全部日程
                  </ChatPromptButton>
                  <ChatPromptButton type="button" onClick={handleOrgClick}>
                    切换组织
                  </ChatPromptButton>
                </div>
              ) : null}
            </div>
          ) : activeApp === "organization" && organizationManagement0425Demo ? (
            <div className="flex w-full flex-col gap-[var(--space-200)]">
              <ChatWelcome
                avatarSrc={conversation.user.avatar}
                greeting="你好，我是你的组织专属 AI 助手。可以用快捷入口打开组织管理，或直接描述组织相关事项。"
              />
              {organizationMessages0425.length === 0 ? (
                <div className="flex flex-wrap gap-[var(--space-200)] w-full md:ml-[44px]">
                  <ChatPromptButton type="button" onClick={() => appendOrganizationManagement0425Card("organization")}>
                    组织管理
                  </ChatPromptButton>
                  <ChatPromptButton type="button" onClick={handleOrgClick}>
                    切换组织
                  </ChatPromptButton>
                </div>
              ) : null}
            </div>
          ) : activeApp === "employee" && organizationManagement0425Demo ? (
            <div className="flex w-full flex-col gap-[var(--space-200)]">
              <ChatWelcome
                avatarSrc={conversation.user.avatar}
                greeting="你好，我是你的员工专属 AI 助手。可用底部快捷入口发起权限申请，或直接描述员工相关事项。"
              />
              {employeeMessages0425.length === 0 ? (
                <div className="flex flex-wrap gap-[var(--space-200)] w-full md:ml-[44px]">
                  <ChatPromptButton type="button" onClick={() => appendEmployeePermissionGuide0425Card("employee")}>
                    员工权限申请
                  </ChatPromptButton>
                  <ChatPromptButton type="button" onClick={handleOrgClick}>
                    切换组织
                  </ChatPromptButton>
                </div>
              ) : null}
            </div>
          ) : invite0421DockFlow &&
            !(hasOrganization || workbenchOrgGateReleased) &&
            (activeApp === "todo" ||
              activeApp === "meeting" ||
              activeApp === "disk" ||
              activeApp === "docs" ||
              (activeApp === "schedule" && !schedule0422DrawerDemo)) ? (
            <div className="flex w-full flex-col gap-[var(--space-200)]">
              <ChatWelcome
                avatarSrc={conversation.user.avatar}
                greeting={
                  activeApp === "schedule"
                    ? "你好，我是你的日程助手。可直接描述安排，或使用底部能力入口（演示占位）。"
                    : activeApp === "todo"
                      ? "你好，我是你的待办助手。把事项口述给我，我会协助整理与跟进（演示占位）。"
                      : activeApp === "meeting"
                        ? "你好，我是你的会议助手。可说明会议主题与时间，我会协助记录与提醒（演示占位）。"
                        : activeApp === "disk"
                          ? "你好，我是你的微盘助手。可描述要存或找的文件（演示占位）。"
                          : activeApp === "docs"
                            ? "你好，我是你的文档助手。可说明要写的材料或要打开的文档（演示占位）。"
                            : "你好，我可以协助你处理当前应用中的事项（演示占位）。"
                }
              />
            </div>
          ) : null}

          {/* Conversation Messages；任务侧多卡片纵向间距 20px（--space-500），不改动单卡内「卡片↔行动建议」 */}
          {activeApp === "task" ? (
            <div className="flex flex-col gap-[var(--space-500)] w-full">
              {renderMessageList(
                is0419Explore ? messages : taskMessages,
                "task",
                undefined,
                newRoundSlotWrapForActiveView
              )}
            </div>
          ) : activeApp === "mail" ? (
            <div className="flex w-full min-w-0 flex-col gap-0">
              {renderMessageList(mailMessages, "mail", undefined, newRoundSlotWrapForActiveView)}
              <div ref={scrollRef} className="h-px w-full shrink-0" aria-hidden />
            </div>
          ) : activeApp === "schedule" && schedule0422DrawerDemo ? (
            <div className="flex w-full flex-col gap-[var(--space-500)]">
              {renderMessageList(messages, "schedule", undefined, newRoundSlotWrapForActiveView)}
            </div>
          ) : activeApp === "organization" && organizationManagement0425Demo ? (
            <div className="flex w-full flex-col gap-[var(--space-500)]">
              {renderMessageList(
                organizationMessages0425,
                "organization",
                undefined,
                newRoundSlotWrapForActiveView
              )}
            </div>
          ) : activeApp === "employee" && organizationManagement0425Demo ? (
            <div className="flex w-full flex-col gap-[var(--space-500)]">
              {renderMessageList(
                employeeMessages0425,
                "employee",
                undefined,
                newRoundSlotWrapForActiveView
              )}
            </div>
          ) : (
            renderMessageList(
              activeApp === "education" ? (is0419Explore ? messages : educationMessages) : messages,
              activeApp === "education" ? "education" : "main",
              undefined,
              newRoundSlotWrapForActiveView
            )
          )}
          {activeApp !== "mail" ? <div ref={scrollRef} /> : null}
        </div>
        </motion.div>
        <ChatScrollToBottomFab
          scrollRootRef={chatContainerRef}
          layoutSyncKey={chatScrollFabLayoutKey}
          getDistanceThresholdPx={getChatScrollFabDistanceThresholdPx}
        />
      </div>

      {/* Input Area and Bottom App Bar */}
      <div
        className={cn(
          "flex-none relative z-20 w-full pb-[var(--space-400)] px-[max(20px,var(--cui-padding-max))] min-px-[var(--space-500)] flex flex-col gap-[var(--space-200)]",
          activeApp === "mail" ? "pt-[var(--space-100)]" : "pt-[var(--space-200)]"
        )}
      >
        {/* 全部应用抽屉 */}
        <AllAppsDrawer
          apps={appsForAllAppsDrawer}
          isOpen={isAllAppsOpen}
          onClose={() => setIsAllAppsOpen(false)}
          onReorder={handleAllAppsDrawerReorder}
          excludeFromDragIds={taskEntryIsMailDockFamily(taskEntryVariant) ? ["mail"] : []}
          invite0421Split={invite0421AllAppsSplit != null}
          addedApps={invite0421AllAppsSplit?.added ?? []}
          unaddedApps={invite0421AllAppsSplit?.unadded ?? []}
          onAppClick={(appId) => {
            tryEnterWorkbenchAppWith0425EmployeeAuto(appId);
          }}
        />

        {/* Bottom App Bar */}
        <div className="flex items-center gap-[var(--space-200)] overflow-x-auto scrollbar-hide relative w-full p-[0px] min-h-[var(--space-800)]">
          <AnimatePresence mode="popLayout">
            {activeApp === 'education' ? (
              <motion.div
                key="education-mode"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-center gap-[var(--space-200)] flex-1 justify-start"
              >
                <button
                  onClick={() => setActiveApp(null)}
                  className="bg-bg flex gap-[var(--space-100)] h-[var(--space-800)] items-center px-[var(--space-300)] py-[var(--space-150)] rounded-full shrink-0 hover:bg-[var(--black-alpha-11)] transition-all duration-300 ease-out border border-border group"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-text-secondary group-hover:text-text transition-colors">
                    <path d="M8.75 3.5L5.25 7L8.75 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-[length:var(--font-size-xs)] leading-none text-text-secondary group-hover:text-text whitespace-nowrap font-[var(--font-weight-medium)] transition-colors">
                    返回
                  </p>
                </button>
                
                {/* Main App Entry - Right after Back Button */}
                <OrganizationSwitcherButton
                  onClick={() => setIsAllAppsOpen(true)}
                  isOpen={isAllAppsOpen}
                  currentApp={switcherCurrentApp}
                />
                
                {/**
                 * 底部快捷入口按当前教育空间类型切换：
                 * - 无空间 + `educationNoSpaceDockTeaser`：仅 3 个一级 pill，无 hover 展开子菜单；首次点对话气泡、再次 toast
                 * - 家庭空间：FAMILY_EDUCATION_APPS（含二级菜单）
                 * - 机构空间：EDUCATION_APPS（含二级菜单）
                 */}
                {educationDockShortcutApps.map((app) =>
                  educationNoSpaceDockTeaser && !effectiveHasEducationSpace ? (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => handleEducationTeaserFlatButtonClick(app.name)}
                      className="bg-bg flex gap-[var(--space-100)] h-[var(--space-800)] shrink-0 items-center rounded-full border border-border px-[var(--space-300)] py-[var(--space-150)] transition-all duration-300 ease-out hover:bg-[var(--black-alpha-11)]"
                    >
                      <AppDockEntryIcon icon={{ imageSrc: app.imageSrc }} className="h-[18px] w-[18px]" />
                      <span className="whitespace-nowrap text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] leading-none text-[var(--color-text)]">
                        {app.name}
                      </span>
                    </button>
                  ) : (
                    <SecondaryAppButton
                      key={app.id}
                      app={app}
                      onMenuClick={(menu, appName, _appId, _menuItemId) => {
                        handleEducationDockShortcutMenuClick(menu, appName, _appId, app.imageSrc);
                      }}
                    />
                  ),
                )}
              </motion.div>
            ) : activeApp === "task" ? (
              <motion.div
                key="task-mode"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-center gap-[var(--space-200)] flex-1 justify-start"
              >
                <button
                  type="button"
                  onClick={() => setActiveApp(null)}
                  className="bg-bg flex gap-[var(--space-100)] h-[var(--space-800)] items-center px-[var(--space-300)] py-[var(--space-150)] rounded-full shrink-0 hover:bg-[var(--black-alpha-11)] transition-all duration-300 ease-out border border-border group"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-text-secondary group-hover:text-text transition-colors">
                    <path d="M8.75 3.5L5.25 7L8.75 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-[length:var(--font-size-xs)] leading-none text-text-secondary group-hover:text-text whitespace-nowrap font-[var(--font-weight-medium)] transition-colors">
                    返回
                  </p>
                </button>

                <OrganizationSwitcherButton
                  onClick={() => setIsAllAppsOpen(true)}
                  isOpen={isAllAppsOpen}
                  currentApp={switcherCurrentApp}
                />

                {TASK_DOCK_SECONDARY_APPS.map((app) => (
                  <SecondaryAppButton
                    key={app.id}
                    app={app}
                    onMenuClick={(menu, appName, appId, _menuItemId) => {
                      beginNewUserChatRound("task");
                      const userMsg: Message = {
                        id: `user-task-${Date.now()}`,
                        senderId: currentUser.id,
                        content:
                          menu === "__direct__"
                            ? `我想打开${appName}`
                            : `我想在${appName}中使用「${menu}」`,
                        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        createdAt: Date.now(),
                      };
                      setTaskMessages((prev) => [...prev, userMsg]);
                      setTimeout(() => {
                        let botMsg: Message;
                        if (menu === "__direct__" && appId === "task_filter") {
                          botMsg = {
                            id: `bot-task-filter-${Date.now()}`,
                            senderId: conversation.user.id,
                            content: TASK_FILTER_MARKER,
                            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                            createdAt: Date.now(),
                          };
                        } else if (menu === "__direct__" && appId === "task_settings") {
                          botMsg = {
                            id: `bot-task-settings-${Date.now()}`,
                            senderId: conversation.user.id,
                            content: TASK_SETTINGS_MARKER,
                            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                            createdAt: Date.now(),
                          };
                        } else if (menu === "新建任务") {
                          botMsg = {
                            id: `bot-task-form-${Date.now()}`,
                            senderId: conversation.user.id,
                            content: CREATE_TASK_FORM_MARKER,
                            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                            createdAt: Date.now(),
                          };
                        } else if (menu === "草稿箱") {
                          botMsg = {
                            id: `bot-task-drafts-${Date.now()}`,
                            senderId: conversation.user.id,
                            content: TASK_DRAFTS_TABLE_MARKER,
                            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                            createdAt: Date.now(),
                          };
                        } else if (
                          [
                            "全部任务",
                            "仅看逾期",
                            "我执行过的",
                            "近期完成的",
                            "我执行的",
                            "我负责的",
                            "我参与的",
                            "我关注的",
                            "下属的",
                          ].includes(menu)
                        ) {
                          botMsg = {
                            id: `bot-task-table-${Date.now()}`,
                            senderId: conversation.user.id,
                            content: `${TASK_TABLE_MARKER}:${JSON.stringify({ filterHint: menu })}`,
                            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                            createdAt: Date.now(),
                          };
                        } else {
                          const cardData = JSON.stringify({
                            title: `${appName} - ${menu}`,
                            description: `这是关于「${menu}」的任务侧说明（演示）。`,
                            detail: "1. 在列表中筛选目标记录\n2. 使用行内操作更新状态\n3. 需要时新建子任务",
                            imageSrc: app.imageSrc,
                          });
                          botMsg = {
                            id: `bot-task-card-${Date.now()}`,
                            senderId: conversation.user.id,
                            content: `<<<RENDER_GENERIC_CARD>>>:${cardData}`,
                            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                            createdAt: Date.now(),
                          };
                        }
                        setTaskMessages((prev) => [...prev, botMsg]);
                      }, 500);
                    }}
                  />
                ))}
              </motion.div>
            ) : activeApp === "mail" ? (
              <motion.div
                key="mail-mode"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={cn(
                  "flex flex-1 min-w-0 justify-start gap-x-[var(--space-200)] gap-y-[var(--space-150)]",
                  taskEntryIsEmail0415ScopeFamily(taskEntryVariant)
                    ? "flex-wrap items-center content-start"
                    : "items-center gap-[var(--space-200)]"
                )}
              >
                <button
                  type="button"
                  onClick={() => setActiveApp(null)}
                  className="bg-bg flex gap-[var(--space-100)] h-[var(--space-800)] items-center px-[var(--space-300)] py-[var(--space-150)] rounded-full shrink-0 hover:bg-[var(--black-alpha-11)] transition-all duration-300 ease-out border border-border group"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-text-secondary group-hover:text-text transition-colors">
                    <path d="M8.75 3.5L5.25 7L8.75 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-[length:var(--font-size-xs)] leading-none text-text-secondary group-hover:text-text whitespace-nowrap font-[var(--font-weight-medium)] transition-colors">
                    返回
                  </p>
                </button>

                <OrganizationSwitcherButton
                  onClick={() => setIsAllAppsOpen(true)}
                  isOpen={isAllAppsOpen}
                  currentApp={switcherCurrentApp}
                />

                {mailSecondaryDockApps.map((app) => (
                  <SecondaryAppButton
                    key={app.id}
                    app={app}
                    onMenuClick={(menu, appName, appId, menuItemId) => {
                      beginNewUserChatRound("mail");
                      const userMsg: Message = {
                        id: `user-mail-${Date.now()}`,
                        senderId: currentUser.id,
                        content:
                          menu === "__direct__"
                            ? `我想打开${appName}`
                            : `我想在「${appName}」中使用「${menu}」`,
                        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        createdAt: Date.now(),
                      };
                      const mailOp = (detail?: string): MessageOperationSource => ({
                        cardTitle: appName,
                        sourceMessageId: userMsg.id,
                        ...(detail ? { sourceDetailLabel: detail } : {}),
                      });
                      updateMailMessages((prev) => [...prev, userMsg]);
                      setTimeout(() => {
                        const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                        const now = Date.now();
                        const bizScope =
                          emailTenantScope !== "all" && emailTenantScope !== "personal"
                            ? emailTenantScope
                            : AVAILABLE_ORGANIZATIONS[0]?.id ?? "xiaoce";

                        const mBox = (payload: Record<string, unknown>, msgId?: string): Message => ({
                          id: msgId ?? `bot-mail-box-${now}-${menuItemId ?? appId}`,
                          senderId: conversation.user.id,
                          content: `${MAIL_MAILBOX_MARKER}:${JSON.stringify(payload)}`,
                          timestamp: ts,
                          createdAt: now,
                          isAfterPrompt: true,
                          operationSource: mailOp(menu),
                        });

                        if (appId === "mail_send_receive" && menuItemId === "sub_fetch") {
                          const pu = getDemoMyMailboxUnreadCount();
                          const bu = getDemoBusinessUnreadTotal();
                          if (pu === 0 && bu === 0) {
                            toast("没有新邮件");
                            scrollToBottom();
                            return;
                          }
                          updateMailMessages((prev) => [
                            ...prev,
                            {
                              id: `bot-mail-new-digest-${now}`,
                              senderId: conversation.user.id,
                              content: `${MAIL_NEW_MAIL_DIGEST_MARKER}:{}`,
                              timestamp: ts,
                              createdAt: now,
                              isAfterPrompt: true,
                              suppressAvatar: true,
                              operationSource: mailOp("收邮件"),
                            },
                          ]);
                          return;
                        }

                        let botMsg: Message | undefined;

                        if (appId === "mail_send_receive" && menuItemId === "sub_compose") {
                          botMsg = {
                            id: `bot-mail-compose-entry-${now}`,
                            senderId: conversation.user.id,
                            content: `${MAIL_COMPOSE_ENTRY_MARKER}:{}`,
                            timestamp: ts,
                            createdAt: now,
                            isAfterPrompt: true,
                            operationSource: mailOp("写邮件"),
                          };
                        } else if (appId === "mail_my") {
                          if (menuItemId === "my_inbox") {
                            botMsg = mBox({ folder: "inbox", scope: "personal" });
                          } else if (menuItemId === "my_sent") {
                            botMsg = mBox({ folder: "sent", scope: "personal" });
                          } else if (menuItemId === "my_drafts") {
                            botMsg = mBox({ folder: "drafts", scope: "personal" });
                          } else {
                            botMsg = {
                              id: `bot-mail-fallback-${now}`,
                              senderId: conversation.user.id,
                              content: "（演示）请从菜单选择收件箱、发件箱或草稿箱。",
                              timestamp: ts,
                              createdAt: now,
                              isAfterPrompt: true,
                              operationSource: mailOp(),
                            };
                          }
                        } else if (appId === "mail_business") {
                          if (menuItemId === "biz_inbox") {
                            botMsg = mBox({ folder: "inbox", scope: bizScope });
                          } else if (menuItemId === "biz_sent") {
                            botMsg = mBox({ folder: "sent", scope: bizScope });
                          } else if (menuItemId === "biz_drafts") {
                            botMsg = mBox({ folder: "drafts", scope: bizScope });
                          } else {
                            botMsg = {
                              id: `bot-mail-fallback-${now}`,
                              senderId: conversation.user.id,
                              content: "（演示）请从菜单选择收件箱、发件箱或草稿箱。",
                              timestamp: ts,
                              createdAt: now,
                              isAfterPrompt: true,
                              operationSource: mailOp(),
                            };
                          }
                        } else if (appId === "mail_settings") {
                          const pageByMenuId: Record<string, MailSettingsPageId> = {
                            set_accounts: "accounts",
                            set_signature: "signature",
                            set_sender: "sender",
                          };
                          const page = menuItemId ? pageByMenuId[menuItemId] : undefined;
                          if (page) {
                            botMsg = {
                              id: `bot-mail-settings-${now}-${menuItemId}`,
                              senderId: conversation.user.id,
                              content: `${MAIL_SETTINGS_MARKER}:${JSON.stringify({ page })}`,
                              timestamp: ts,
                              createdAt: now,
                              isAfterPrompt: true,
                              operationSource: mailOp(menu),
                            };
                          } else {
                            botMsg = {
                              id: `bot-mail-fallback-${now}`,
                              senderId: conversation.user.id,
                              content: "（演示）未识别设置项。",
                              timestamp: ts,
                              createdAt: now,
                              isAfterPrompt: true,
                              operationSource: mailOp(),
                            };
                          }
                        } else if (appId === "mail_admin") {
                          const pending: MailAdminPanelKind =
                            menuItemId === "admin_staff_mail" ? "staff" : "business";
                          if (emailTenantScope === "all" || emailTenantScope === "personal") {
                            botMsg = {
                              id: `bot-mail-admin-pick-${now}-${menuItemId}`,
                              senderId: conversation.user.id,
                              content: `${MAIL_TENANT_PICK_FOR_ADMIN_MARKER}:${JSON.stringify({ pending })}`,
                              timestamp: ts,
                              createdAt: now,
                              isAfterPrompt: true,
                              operationSource: mailOp(menu),
                            };
                          } else {
                            const org = AVAILABLE_ORGANIZATIONS.find((o) => o.id === emailTenantScope);
                            botMsg = {
                              id: `bot-mail-admin-panel-${now}-${menuItemId}`,
                              senderId: conversation.user.id,
                              content: `${MAIL_MAIL_ADMIN_PANEL_MARKER}:${JSON.stringify({
                                kind: pending,
                                tenantId: emailTenantScope,
                                tenantName: org?.name ?? emailTenantScope,
                              })}`,
                              timestamp: ts,
                              createdAt: now,
                              isAfterPrompt: true,
                              operationSource: mailOp(menu),
                            };
                          }
                        } else {
                          botMsg = {
                            id: `bot-mail-fallback-${now}`,
                            senderId: conversation.user.id,
                            content:
                              taskEntryIsEmail0415ScopeFamily(taskEntryVariant)
                                ? "（演示）请使用收发邮件、我的邮箱、业务邮箱、邮箱设置或邮箱管理。"
                                : "（演示）请使用收发邮件、我的邮箱、业务邮箱或邮箱设置。",
                            timestamp: ts,
                            createdAt: now,
                            isAfterPrompt: true,
                            operationSource: mailOp(),
                          };
                        }

                        if (botMsg) {
                          updateMailMessages((prev) => [...prev, botMsg]);
                        }
                      }, 500);
                    }}
                  />
                ))}
              </motion.div>
            ) : invite0421NoOrgShellPersonalDock ? (
              <motion.div
                key="invite0421-shell-personal-dock"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex min-w-0 flex-1 items-center justify-start gap-[var(--space-200)]"
              >
                <button
                  type="button"
                  onClick={() => setActiveApp(null)}
                  className="bg-bg flex shrink-0 gap-[var(--space-100)] h-[var(--space-800)] items-center px-[var(--space-300)] py-[var(--space-150)] rounded-full hover:bg-[var(--black-alpha-11)] transition-all duration-300 ease-out border border-border group"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-text-secondary group-hover:text-text transition-colors">
                    <path d="M8.75 3.5L5.25 7L8.75 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-[length:var(--font-size-xs)] leading-none text-text-secondary group-hover:text-text whitespace-nowrap font-[var(--font-weight-medium)] transition-colors">
                    返回
                  </p>
                </button>
                <OrganizationSwitcherButton
                  onClick={() => setIsAllAppsOpen(true)}
                  isOpen={isAllAppsOpen}
                  currentApp={switcherCurrentApp}
                />
              </motion.div>
            ) : activeApp === "organization" && organizationManagement0425Demo ? (
              <motion.div
                key="organization-mode"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex min-w-0 flex-1 items-center justify-start gap-[var(--space-200)]"
              >
                <button
                  type="button"
                  onClick={() => setActiveApp(null)}
                  className="bg-bg flex shrink-0 gap-[var(--space-100)] h-[var(--space-800)] items-center px-[var(--space-300)] py-[var(--space-150)] rounded-full hover:bg-[var(--black-alpha-11)] transition-all duration-300 ease-out border border-border group"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-text-secondary group-hover:text-text transition-colors">
                    <path d="M8.75 3.5L5.25 7L8.75 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-[length:var(--font-size-xs)] leading-none text-text-secondary group-hover:text-text whitespace-nowrap font-[var(--font-weight-medium)] transition-colors">
                    返回
                  </p>
                </button>

                <OrganizationSwitcherButton
                  onClick={() => setIsAllAppsOpen(true)}
                  isOpen={isAllAppsOpen}
                  currentApp={switcherCurrentApp}
                />
                {ORGANIZATION_0425_APPS.map((app) => (
                  <SecondaryAppButton
                    key={app.id}
                    app={app}
                    onMenuClick={(_menu, appName, appId) => {
                      if (appId === "org_management") {
                        appendOrganizationManagement0425Card("organization");
                        return;
                      }
                      if (appId === "org_settings") {
                        appendOrgSettingsPermission0425Card("organization");
                        return;
                      }
                      toast(`${appName}入口已打开（演示占位）`);
                    }}
                  />
                ))}
              </motion.div>
            ) : activeApp === "employee" && organizationManagement0425Demo ? (
              <motion.div
                key="employee-mode"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex min-w-0 flex-1 items-center justify-start gap-[var(--space-200)]"
              >
                <button
                  type="button"
                  onClick={() => setActiveApp(null)}
                  className="bg-bg flex shrink-0 gap-[var(--space-100)] h-[var(--space-800)] items-center px-[var(--space-300)] py-[var(--space-150)] rounded-full hover:bg-[var(--black-alpha-11)] transition-all duration-300 ease-out border border-border group"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-text-secondary group-hover:text-text transition-colors">
                    <path d="M8.75 3.5L5.25 7L8.75 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-[length:var(--font-size-xs)] leading-none text-text-secondary group-hover:text-text whitespace-nowrap font-[var(--font-weight-medium)] transition-colors">
                    返回
                  </p>
                </button>

                <OrganizationSwitcherButton
                  onClick={() => setIsAllAppsOpen(true)}
                  isOpen={isAllAppsOpen}
                  currentApp={switcherCurrentApp}
                />
                {EMPLOYEE_0425_APPS.map((app) => (
                  <SecondaryAppButton
                    key={app.id}
                    app={app}
                    onMenuClick={(menu, appName, appId) => {
                      if (menu === "__direct__" && appId === "emp_permission_apply") {
                        appendEmployeePermissionGuide0425Card("employee");
                        return;
                      }
                      toast(`${appName}入口已打开（演示占位）`);
                    }}
                  />
                ))}
              </motion.div>
            ) : activeApp === "schedule" && schedule0422DrawerDemo ? (
              <motion.div
                key="schedule-mode"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex min-w-0 flex-1 items-center justify-start gap-[var(--space-200)]"
              >
                <button
                  type="button"
                  onClick={() => setActiveApp(null)}
                  className="bg-bg flex shrink-0 gap-[var(--space-100)] h-[var(--space-800)] items-center px-[var(--space-300)] py-[var(--space-150)] rounded-full hover:bg-[var(--black-alpha-11)] transition-all duration-300 ease-out border border-border group"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-text-secondary group-hover:text-text transition-colors">
                    <path d="M8.75 3.5L5.25 7L8.75 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-[length:var(--font-size-xs)] leading-none text-text-secondary group-hover:text-text whitespace-nowrap font-[var(--font-weight-medium)] transition-colors">
                    返回
                  </p>
                </button>

                <OrganizationSwitcherButton
                  onClick={() => setIsAllAppsOpen(true)}
                  isOpen={isAllAppsOpen}
                  currentApp={switcherCurrentApp}
                />

                <div className="scrollbar-hide flex min-w-0 flex-1 items-center gap-[var(--space-150)] overflow-x-auto overflow-y-hidden pb-[var(--space-50)]">
                  <Schedule0422BottomQuickRow
                    onSendText={(text) => {
                      beginNewUserChatRound("schedule");
                      const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                      const now = Date.now();
                      const userRow: Message = {
                        id: `sch0422-user-${now}`,
                        senderId: currentUser.id,
                        content: text,
                        timestamp: ts,
                        createdAt: now,
                      };
                      setMessages((prev) => [...prev, userRow]);
                      if (text === "全部日程") {
                        window.setTimeout(() => {
                          setMessages((prev) => [
                            ...prev,
                            {
                              id: `sch0422-bot-all-${Date.now()}`,
                              senderId: conversation.user.id,
                              content: SCHEDULE_0422_ALL_LIST_MARKER,
                              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                              createdAt: Date.now(),
                              isAfterPrompt: true,
                            },
                          ]);
                        }, 450);
                      }
                    }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="default-apps"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-center gap-[var(--space-200)]"
              >
                {appsForMainAIDockPills.map((app, index) => (
                  <React.Fragment key={app.id}>
                  <button
                    draggable={longPressIndex === index}
                    onClick={(e) => {
                      if (longPressIndex === index) {
                        e.preventDefault();
                        setLongPressIndex(null);
                        return;
                      }
                      if (
                        app.id === "education" ||
                        app.id === "task" ||
                        (organizationManagement0425Demo && app.id === "employee") ||
                        (organizationManagement0425Demo && app.id === "organization") ||
                        (schedule0422DrawerDemo && app.id === "schedule") ||
                        (invite0421DockFlow &&
                          !(hasOrganization || workbenchOrgGateReleased) &&
                          (INVITE0421_NO_ORG_DOCK_APP_IDS_ORDERED as readonly string[]).includes(app.id))
                      ) {
                        tryEnterWorkbenchAppWith0425EmployeeAuto(app.id);
                      }
                    }}
                    onMouseDown={(e) => {
                      longPressTimerRef.current = setTimeout(() => {
                        setLongPressIndex(index);
                      }, 500);
                    }}
                    onMouseUp={() => {
                      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
                    }}
                    onMouseLeave={() => {
                      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
                      if (draggedIndex === null) setLongPressIndex(null);
                    }}
                    onTouchStart={(e) => {
                      longPressTimerRef.current = setTimeout(() => {
                        setLongPressIndex(index);
                      }, 500);
                    }}
                    onTouchEnd={() => {
                      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
                    }}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={(e) => {
                      handleDragEnd();
                      setLongPressIndex(null);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                    }}
                    className={cn(
                      "bg-bg flex gap-[var(--space-100)] h-[var(--space-800)] items-center px-[var(--space-300)] py-[var(--space-150)] rounded-full shrink-0 hover:bg-[var(--black-alpha-11)] transition-all duration-300 ease-out border border-border select-none",
                      longPressIndex === index ? "cursor-grab active:cursor-grabbing scale-105 shadow-elevation-sm ring-2 ring-primary/20" : "cursor-pointer",
                      draggedIndex === index && 'opacity-20 scale-95'
                    )}
                  >
                    <AppDockEntryIcon icon={app.icon} className="size-[18px]" />
                    <p className="text-[length:var(--font-size-xs)] leading-none text-[var(--color-text)] whitespace-nowrap font-[var(--font-weight-medium)]">
                      {app.name}
                    </p>
                  </button>
                  {taskEntryIsMailDockFamily(taskEntryVariant) && app.id === "task" ? (
                    <button
                      type="button"
                      key="mail-dock-slot"
                      onClick={() => {
                        tryEnterWorkbenchAppWith0425EmployeeAuto("mail");
                      }}
                      className="bg-bg flex gap-[var(--space-100)] h-[var(--space-800)] items-center px-[var(--space-300)] py-[var(--space-150)] rounded-full shrink-0 hover:bg-[var(--black-alpha-11)] transition-all duration-300 ease-out border border-border select-none cursor-pointer"
                    >
                      <AppDockEntryIcon icon={MAIL_APP_DOCK_ITEM.icon} className="size-[18px]" />
                      <p className="text-[length:var(--font-size-xs)] leading-none text-[var(--color-text)] whitespace-nowrap font-[var(--font-weight-medium)]">
                        {MAIL_APP_DOCK_ITEM.name}
                      </p>
                    </button>
                  ) : null}
                  </React.Fragment>
                ))}

                {/* 全部应用入口 - 固定在最右侧或跟随��最后 */}
                <div className="sticky right-0 flex items-center bg-cui-bg z-10 before:content-[''] before:block before:w-[var(--space-300)] before:h-[var(--space-800)] before:bg-gradient-to-r before:from-transparent before:to-cui-bg">
                  <OrganizationSwitcherButton 
                    onClick={() => setIsAllAppsOpen(true)} 
                    isOpen={isAllAppsOpen}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Field */}
        <ChatSender
          inputId="main-ai-composer-input"
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
          handleKeyDown={handleKeyDown}
        />
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Floating Application Windows */}
      <AnimatePresence>
        {floatingApps.map((appId, idx) => {
          const app =
            [...INITIAL_APPS, MAIL_APP_DOCK_ITEM, ...EDUCATION_APPS].find((a) => a.id === appId) ||
            EDUCATION_APPS.find((a) => a.id === appId) ||
            { id: appId, name: appId };
          if (!app) return null;
          
          return (
            <FloatingAppWindow
              key={appId}
              appId={appId}
              title={app.name}
              onClose={() => {
                setFloatingApps(prev => prev.filter(id => id !== appId));
                // 关闭独立窗口后，恢复到之前的二级应用页面
                if (previousActiveApp === appId) {
                  setActiveApp(appId);
                  setSecondaryHistoryOpen(false);
                  setPreviousActiveApp(null);
                }
              }}
              defaultPos={{ x: 100 + idx * 20, y: 100 + idx * 20 }}
            >
              {/* 完全复用主界面的二级应用布局结构 */}
              <div className="absolute inset-0 flex flex-row w-full isolate overflow-hidden bg-cui-bg">
                {/* Secondary App History Sidebar */}
                {appId === "education" && !is0419Explore ? (
                  <SecondaryAppHistorySidebar
                    open={secondaryHistoryOpen}
                    onOpenChange={setSecondaryHistoryOpen}
                    sessions={secondaryAppSessions}
                    selectedId={selectedSecondarySession}
                    onSelect={handleSecondarySessionSelect}
                    onNewConversation={handleSecondaryAppNewConversation}
                    mode="push"
                  />
                ) : null}

                {/* Main Content Wrapper - no translate needed in push mode */}
                <div className="flex flex-col flex-1 h-full w-full shrink-0 min-w-0 bg-cui-bg">
                  {/* Header - 使用完整的 ChatNavBar 组件 */}
                  <ChatNavBar 
                    title=""
                    onToggleHistory={() => {
                      if (appId === 'education') {
                        setSecondaryHistoryOpen(!secondaryHistoryOpen);
                      }
                    }}
                    onNewMessage={undefined}
                    showOrgSelect={appId === 'education'}
                    currentOrg={currentOrg}
                    organizations={invite0421JoinedOrganizationList}
                    onOrgSelect={handleOrgSwitch}
                    onCreateOrg={handleCreateOrg}
                    onJoinOrg={handleJoinOrg}
                    showModelSelect={appId !== "education" && appId !== "task"}
                    currentModel={currentModel}
                    modelFamilies={AVAILABLE_MODEL_FAMILIES}
                    onModelSelect={handleModelSwitch}
                    showIndependentWindow={false}
                  />

                  {/* Main Content Area */}
                  <div className="relative z-10 flex min-h-0 flex-1 flex-col">
                    <motion.div 
                      key={`floating-${appId}`}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="min-h-0 flex-1 overflow-y-auto overflow-x-clip scrollbar-hide pb-[var(--space-200)]"
                      ref={floatingChatScrollRef}
                    >
                    <div className="flex flex-col gap-[var(--space-800)] w-full px-[var(--space-400)] py-[var(--space-400)] pt-[var(--space-300)]">
                      <div className="flex flex-col gap-[var(--space-200)] w-full">
                        <ChatWelcome
                          avatarSrc={conversation.user.avatar}
                          greeting={
                            is0419Explore
                              ? explore0419AssistantGreeting
                              : appId === "education"
                                ? `你好，我是你的专属AI助手。请问今天需要处理什么？`
                                : `你好，我是你的${app.name}专属AI助手。请问今天需要处理什么？`
                          }
                        />
                        {is0419Explore && messages.length === 0 ? (
                          <div className="flex flex-wrap gap-[var(--space-200)] w-full md:ml-[44px]">
                            <ChatPromptButton
                              onClick={() => {
                                setInputValue("查看我的个人信息");
                                setTimeout(() => handleSendMessage(), 100);
                              }}
                            >
                              查看个人信息
                            </ChatPromptButton>
                            <ChatPromptButton
                              onClick={() => {
                                setInputValue("帮我创建一封新邮件");
                                setTimeout(() => handleSendMessage(), 100);
                              }}
                            >
                              创建邮件
                            </ChatPromptButton>
                            <ChatPromptButton
                              onClick={() => {
                                setInputValue("今天的待办事项");
                                setTimeout(() => handleSendMessage(), 100);
                              }}
                            >
                              查看待办事项
                            </ChatPromptButton>
                          </div>
                        ) : !is0419Explore && appId === "education" && educationMessages.length === 0 ? (
                          <div className="flex flex-wrap gap-[var(--space-200)] w-full md:ml-[44px]">
                            {renderEducationWelcomeActionChips()}
                          </div>
                        ) : null}
                      </div>

                      {/* Conversation Messages */}
                      {appId === 'education' ? renderMessageList(educationMessages, 'education', floatingEducationRowRef) : null}
                      <div className="h-px w-full shrink-0" aria-hidden />
                    </div>
                    </motion.div>
                    <ChatScrollToBottomFab
                      scrollRootRef={floatingChatScrollRef}
                      layoutSyncKey={educationMessages.length}
                      getDistanceThresholdPx={getFloatingChatScrollFabDistanceThresholdPx}
                    />
                  </div>

                  {/* Input Area and Bottom App Bar */}
                  <div className="flex-none relative z-20 w-full pt-[var(--space-200)] pb-[var(--space-400)] px-[var(--space-400)] flex flex-col gap-[var(--space-200)]">
                    {/* Bottom App Bar - Education Apps：与主窗口一致，按当前教育空间类型切换 */}
                    {appId === 'education' && (
                      <div className="flex items-center gap-[var(--space-200)] overflow-x-auto scrollbar-hide relative w-full">
                        {educationDockShortcutApps.map((app) =>
                          educationNoSpaceDockTeaser && !effectiveHasEducationSpace ? (
                            <button
                              key={app.id}
                              type="button"
                              onClick={() =>
                                handleEducationTeaserFlatButtonClick(app.name, () =>
                                  scrollPanelToBottom(floatingChatScrollRef.current),
                                )
                              }
                              className="bg-bg flex gap-[var(--space-100)] h-[var(--space-800)] shrink-0 items-center rounded-full border border-border px-[var(--space-300)] py-[var(--space-150)] transition-all duration-300 ease-out hover:bg-[var(--black-alpha-11)]"
                            >
                              <AppDockEntryIcon icon={{ imageSrc: app.imageSrc }} className="h-[18px] w-[18px]" />
                              <span className="whitespace-nowrap text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] leading-none text-[var(--color-text)]">
                                {app.name}
                              </span>
                            </button>
                          ) : (
                            <SecondaryAppButton
                              key={app.id}
                              app={app}
                              onMenuClick={(menu, appName, _appId, _menuItemId) => {
                                handleEducationDockShortcutMenuClick(menu, appName, _appId, app.imageSrc, () =>
                                  scrollPanelToBottom(floatingChatScrollRef.current),
                                );
                              }}
                            />
                          ),
                        )}
                      </div>
                    )}

                    {/* Input for Floating Window */}
                    <ChatSender
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      handleSendMessage={handleSendMessage}
                      handleKeyDown={handleKeyDown}
                    />
                  </div>
                </div>
              </div>
            </FloatingAppWindow>
          );
        })}
      </AnimatePresence>

      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        isOpen={isTaskDrawerOpen}
        onClose={() => setIsTaskDrawerOpen(false)}
        task={selectedTask}
      />
      {schedule0422DrawerDemo && schedule0422DrawerItem ? (
        <Schedule0422BusinessDrawer
          open={schedule0422DrawerOpen}
          onOpenChange={(o) => {
            setSchedule0422DrawerOpen(o);
            if (!o) setSchedule0422DrawerItem(null);
          }}
          item={schedule0422DrawerItem}
          onItemUpdated={(it) => {
            setSchedule0422Items((prev) => prev.map((x) => (x.id === it.id ? it : x)));
            setSchedule0422DrawerItem(it);
          }}
        />
      ) : null}
      </div>
    </div>
  )
}
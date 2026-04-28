import * as React from "react"
import { useLocation, useNavigate } from "react-router"
import { ArrowLeft, Check, ChevronDown, Copy } from "lucide-react"
import { cn } from "../ui/utils"
import { Toaster } from "../ui/sonner"
import { NavModulePlaceholder } from "../vv-app-shell/NavModulePlaceholder"
import { ShortcutModulePlaceholder } from "../vv-app-shell/ShortcutModulePlaceholder"
import {
  VVAppShell,
  type VVAppShellPrimaryNavId,
  type VVAppShellShortcutId,
} from "../vv-app-shell/VVAppShell"
import { Invite0421MessageModule } from "../invite-0421/Invite0421MessageModule"
import { Invite0421EduStudentMessageModule } from "../invite-0421/Invite0421EduStudentMessageModule"
import {
  INVITE0421_EDU_INVITE_FLOW_INITIAL,
  type Invite0421EduInviteFlowState,
} from "../invite-0421/Invite0421EduStudentInviteFlowBody"
import { MainAIChatWindow } from "./MainAIChatWindow"
import {
  conversations,
  currentUser,
  type Conversation,
  type Message,
} from "../chat/data"
import {
  MailDemoScenarioDropdown,
  type MailDemoScenarioId,
} from "./MailDemoScenarioDropdown"
import { getDemoNavBarTitle } from "../../constants/demoHomeNavEntries"
import { InteractionRulesChangelogLauncher } from "./InteractionRulesChangelogDialog"
import { InteractionRulesDocShell } from "./InteractionRulesDocShell"
import { InteractionDemoInstructionSetShell } from "./InteractionDemoInstructionSetShell"
import { InteractionRulesImFrameworkModule } from "./InteractionRulesImFrameworkModule"
import type { DemoInstructionCommand } from "./demoInstructionTypes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  ORGANIZATION_MANAGEMENT_0425_SCHEME2_INPUT_PROMPT,
  ORGANIZATION_MANAGEMENT_0425_USER_TRIGGER,
} from "../../constants/organizationManagement0425"

/** 0419 演示：用首条用户发言模拟「AI 生成的侧栏标题」 */
function deriveMockAiSessionTitleFromUserText(text: string): string {
  const t = text.replace(/\s+/g, " ").trim()
  if (!t) return "新对话"
  return t.length > 28 ? `${t.slice(0, 28)}…` : t
}

export function MainAI(props: {
  initialActiveApp?: "education" | "task" | "mail" | null;
  /** 任务应用入口方案：`plan2` 对应「0413-任务-方案2」；`task0417InlineEdit` / `task0417CardEdit` 对应两个 0417 任务方案页；`email0413` / `email0415` / `email0417` 为邮箱演示分叉（0417 在对话内读信）；`task0419SidebarExplore` 为 0419 侧栏方案探索（仅该页） */
  taskEntryVariant?:
    | "default"
    | "plan2"
    | "task0417InlineEdit"
    | "task0417CardEdit"
    | "task0419SidebarExplore"
    | "email0413"
    | "email0415"
    | "email0417";
  /** 空态场景：用户没有组织/教育空间。教育应用顶栏改为「创建教育空间」，欢迎态显示创建引导 */
  hasEducationSpace?: boolean;
  /** 侧栏形态：`default`（主 AI + 二级应用两栏切换）；`combinedNoEduSpace`（主 AI 历史 + 应用使用合并栏） */
  sidebarVariant?: "default" | "combinedNoEduSpace";
  /** 右上角「独立窗口」图标始终可见（无 `activeApp` 时也显示，无行为时走占位 toast） */
  alwaysShowIndependentWindow?: boolean;
  /** 0421 等演示：主 AI 无组织（顶栏为「创建或加入企业/组织」） */
  hasOrganization?: boolean;
  /** 教育空间演示数据：`familyOnly0421` 两家庭空间；`eduStudentInvite0421` 学生受邀演示 */
  educationSpacePreset?: "default" | "familyOnly0421" | "eduStudentInvite0421";
  /** 无教育空间时教育底栏展示前 3 个一级入口并走顶部胶囊提示（见 0421-有组织无教育空间-2） */
  educationNoSpaceDockTeaser?: boolean;
  /**
   * 0421-无组织有教育空间：创建/加入组织走「仅名称 + 单按钮」演示流；工作台仅对部分应用拦截需组织。
   * 与 `hasOrganization` 同时为真时不应再传入（页面层在建立组织后应置为 false）。
   */
  simpleOrgOnboarding0421?: boolean;
  /** 0421 演示：用户完成简化创建/加入组织后回调，用于将页面切换为「有组织」态 */
  on0421EstablishOrganization?: () => void;
  /**
   * 0421-有组织无教育空间（及 -2）：ChatNavBar 右侧——主 AI 为「新对话 + 独立窗口」；
   * 教育/任务/邮箱等业务态仅「独立窗口」，并隐藏业务态顶栏模型选择。
   */
  noEduSpace0421ChatToolbar?: boolean;
  /** 0421-新用户-受邀加入组织：侧栏底栏 / 全部应用 / 消息 IM 与主 AI 组织态联动 */
  invite0421NewUserFlow?: boolean;
  /** 0421-新用户-受邀加入教育空间（学生）：无组织 + 教育 AI 初始无空间；IM 抽屉完成创建后写入并选中张小宝教育空间（家庭 dock） */
  invite0421EduStudentFlow?: boolean;
  /** 0422-日程-抽屉交互细节演示：主 AI 内嵌日程列表卡 + 业务入口样式抽屉 */
  schedule0422DrawerDemo?: boolean;
  /** 0422：进入页面时默认选中的会话 id（须存在于 `conversations`） */
  initialConversationId?: string;
  /**
   * 「交互规范文档」页：启用 **文档演示区域**（规范大纲 + 正文 + 演示链；可拖拽宽）+ 右侧实景产品区卡片化。
   * 「演示区域」无特别说明时即指文档演示区域；维护约定见 `interactionRulesSpecData.ts` 顶部注释。
   */
  demoInstructionShell?: boolean;
  /** 「交互演示指令集」页：左演示入口 + 中实际界面 + 右逻辑/指令三栏布局 */
  demoInstructionSetShell?: boolean;
  /** 0424-权限编辑卡片方案 */
  permissionEditCard0424Demo?: boolean;
  /** 0425-案例-组织管理+权限申请 */
  organizationManagement0425Demo?: boolean;
} = {}) {
  const {
    initialActiveApp = null,
    taskEntryVariant = "default",
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
    invite0421EduStudentFlow = false,
    schedule0422DrawerDemo = false,
    initialConversationId,
    demoInstructionShell = false,
    demoInstructionSetShell = false,
    permissionEditCard0424Demo = false,
    organizationManagement0425Demo = false,
  } = props;

  const invite0421ShellDockActive = invite0421NewUserFlow || invite0421EduStudentFlow;

  const [invite0421EduStudentFamilyReady, setInvite0421EduStudentFamilyReady] =
    React.useState(false);
  const [invite0421EduInviteFlow, setInvite0421EduInviteFlow] =
    React.useState<Invite0421EduInviteFlowState>(INVITE0421_EDU_INVITE_FLOW_INITIAL);
  const patchInvite0421EduInviteFlow = React.useCallback((p: Partial<Invite0421EduInviteFlowState>) => {
    setInvite0421EduInviteFlow((s) => ({ ...s, ...p }));
  }, []);
  const is0419 = taskEntryVariant === "task0419SidebarExplore";

  const [conv0419, setConv0419] = React.useState<Conversation[]>(() =>
    is0419
      ? [
          {
            id: "0419-session-1",
            user: conversations[0].user,
            unread: 0,
            messages: [],
            sessionTitle: "新对话",
          },
        ]
      : []
  );

  const [selectedId, setSelectedId] = React.useState(() =>
    is0419 ? "0419-session-1" : initialConversationId ?? conversations[0].id
  );
  const [historyOpen, setHistoryOpen] = React.useState(false)
  const [invite0421DemoApprovalNavVisible, setInvite0421DemoApprovalNavVisible] =
    React.useState(false)

  const [primaryNavId, setPrimaryNavId] =
    React.useState<VVAppShellPrimaryNavId>("ai")
  const [shortcutId, setShortcutId] =
    React.useState<VVAppShellShortcutId | null>(null)

  React.useEffect(() => {
    if (primaryNavId !== "ai") setInvite0421DemoApprovalNavVisible(false);
  }, [primaryNavId]);

  const [invite0421ShellGateRequest, setInvite0421ShellGateRequest] =
    React.useState<{ id: VVAppShellShortcutId; nonce: number } | null>(null)
  const [invite0421OpenEducationNonce, setInvite0421OpenEducationNonce] =
    React.useState(0)
  const [interactionRulesNaturalDialogDemoNonce, setInteractionRulesNaturalDialogDemoNonce] =
    React.useState(0)
  const [interactionRulesBusinessCardDemoNonce, setInteractionRulesBusinessCardDemoNonce] =
    React.useState(0)
  const [organizationManagement0425CommandNonce, setOrganizationManagement0425CommandNonce] =
    React.useState(0)
  const [organizationManagement0425Scheme2CommandNonce, setOrganizationManagement0425Scheme2CommandNonce] =
    React.useState(0)
  const [interactionRulesMainAiOrgDemoNonce, setInteractionRulesMainAiOrgDemoNonce] =
    React.useState(0)
  const [interactionRulesScrollToBottomDemoNonce, setInteractionRulesScrollToBottomDemoNonce] =
    React.useState(0)
  const [interactionRulesMainAiDemoPrefill, setInteractionRulesMainAiDemoPrefill] =
    React.useState({ nonce: 0, prompt: "" })
  const [interactionRulesImFrameworkDemoActive, setInteractionRulesImFrameworkDemoActive] =
    React.useState(false)

  const clearInvite0421ShellGateRequest = React.useCallback(() => {
    setInvite0421ShellGateRequest(null)
  }, [])

  const handleVVShortcutChange = React.useCallback(
    (id: VVAppShellShortcutId) => {
      if (invite0421ShellDockActive && id === "education") {
        setPrimaryNavId("ai")
        setShortcutId(null)
        setInvite0421OpenEducationNonce((n) => n + 1)
        return
      }
      setShortcutId(id)
    },
    [invite0421ShellDockActive],
  )

  const handleInvite0421UnaddedShortcut = React.useCallback(
    (id: VVAppShellShortcutId) => {
      setPrimaryNavId("ai")
      setShortcutId(null)
      setInvite0421ShellGateRequest({ id, nonce: Date.now() })
    },
    [],
  )

  const handlePrimaryNavChange = React.useCallback((id: VVAppShellPrimaryNavId) => {
    setPrimaryNavId(id)
    setShortcutId(null)
    if (id !== "message") setInteractionRulesImFrameworkDemoActive(false)
  }, [])

  const conversationList = is0419 ? conv0419 : conversations
  const selectedConversation =
    conversationList.find((c) => c.id === selectedId) || conversationList[0] || conversations[0]

  /** 仅邮箱方案页：演示用初始场景（后续可扩展「无未读」等并驱动 MainAIChatWindow 初始会话） */
  const [mailDemoScenarioId, setMailDemoScenarioId] =
    React.useState<MailDemoScenarioId>("unread_on_open")

  const handle0419SessionCommit = React.useCallback((sessionId: string, payload: { messages: Message[] }) => {
    setConv0419((prev) =>
      prev.map((c) => {
        if (c.id !== sessionId) return c
        const firstUserPlain = payload.messages.find(
          (m) =>
            m.senderId === currentUser.id &&
            m.content.trim() &&
            !m.content.trim().startsWith("<<<")
        )
        const sessionTitle = firstUserPlain
          ? deriveMockAiSessionTitleFromUserText(firstUserPlain.content)
          : payload.messages.length === 0
            ? "新对话"
            : c.sessionTitle ?? "新对话"
        return { ...c, messages: payload.messages, sessionTitle }
      })
    )
  }, [])

  const handle0419NewSession = React.useCallback(() => {
    const id = `0419-${Date.now()}`
    setConv0419((prev) => [
      {
        id,
        user: conversations[0].user,
        unread: 0,
        messages: [],
        sessionTitle: "新对话",
      },
      ...prev,
    ])
    setSelectedId(id)
  }, [])

  const navigate = useNavigate()
  const location = useLocation()
  const demoNavTitle = React.useMemo(
    () => getDemoNavBarTitle(location.pathname),
    [location.pathname],
  )

  const [demoNavCopied, setDemoNavCopied] = React.useState(false)
  const demoNavCopyTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    setDemoNavCopied(false)
    if (demoNavCopyTimerRef.current) {
      clearTimeout(demoNavCopyTimerRef.current)
      demoNavCopyTimerRef.current = null
    }
  }, [location.pathname])

  React.useEffect(() => {
    return () => {
      if (demoNavCopyTimerRef.current) clearTimeout(demoNavCopyTimerRef.current)
    }
  }, [])

  const copyDemoNavTitle = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(demoNavTitle)
      if (demoNavCopyTimerRef.current) clearTimeout(demoNavCopyTimerRef.current)
      setDemoNavCopied(true)
      demoNavCopyTimerRef.current = setTimeout(() => {
        setDemoNavCopied(false)
        demoNavCopyTimerRef.current = null
      }, 3000)
    } catch {
      // 静默失败，不打断演示
    }
  }, [demoNavTitle])

  const handleDemoInstructionCommand = React.useCallback(
    (cmd: DemoInstructionCommand) => {
      switch (cmd.kind) {
        case "prefillNaturalDialogDemo":
          setInteractionRulesImFrameworkDemoActive(false)
          setPrimaryNavId("ai")
          setShortcutId(null)
          setInteractionRulesNaturalDialogDemoNonce((n) => n + 1)
          break
        case "prefillBusinessCardCommandDemo":
          setInteractionRulesImFrameworkDemoActive(false)
          setPrimaryNavId("ai")
          setShortcutId(null)
          setInteractionRulesBusinessCardDemoNonce((n) => n + 1)
          break
        case "showMainAiOrgManagementSwitcherDemo":
          setInteractionRulesImFrameworkDemoActive(false)
          setPrimaryNavId("ai")
          setShortcutId(null)
          setInteractionRulesMainAiOrgDemoNonce((n) => n + 1)
          break
        case "openImFrameworkDemo":
          setPrimaryNavId("message")
          setShortcutId(null)
          setInteractionRulesImFrameworkDemoActive(true)
          break
        case "showScrollToBottomThresholdDemo":
          setInteractionRulesImFrameworkDemoActive(false)
          setPrimaryNavId("ai")
          setShortcutId(null)
          setInteractionRulesScrollToBottomDemoNonce((n) => n + 1)
          break
        case "prefillMainAiDemoPrompt":
          setInteractionRulesImFrameworkDemoActive(false)
          setPrimaryNavId("ai")
          setShortcutId(null)
          setInteractionRulesMainAiDemoPrefill((prev) => ({
            nonce: prev.nonce + 1,
            prompt: cmd.prompt,
          }))
          break
      }
    },
    [],
  )

  const showMailDemoScenario =
    taskEntryVariant === "email0413" ||
    taskEntryVariant === "email0415" ||
    taskEntryVariant === "email0417"

  const vvAppShellMain = (
    <>
      {shortcutId != null ? (
        <ShortcutModulePlaceholder shortcutId={shortcutId} />
      ) : primaryNavId === "ai" ? (
        <MainAIChatWindow
          conversation={selectedConversation}
          onToggleHistory={() => setHistoryOpen((prev) => !prev)}
          historyOpen={historyOpen}
          onHistoryOpenChange={setHistoryOpen}
          conversations={conversationList}
          selectedId={selectedId}
          onSelect={setSelectedId}
          initialActiveApp={initialActiveApp}
          taskEntryVariant={taskEntryVariant}
          mailDemoScenarioId={
            taskEntryVariant === "email0413" ||
            taskEntryVariant === "email0415" ||
            taskEntryVariant === "email0417"
              ? mailDemoScenarioId
              : undefined
          }
          on0419SessionCommit={is0419 ? handle0419SessionCommit : undefined}
          on0419NewSession={is0419 ? handle0419NewSession : undefined}
          hasEducationSpace={hasEducationSpace}
          sidebarVariant={sidebarVariant}
          alwaysShowIndependentWindow={alwaysShowIndependentWindow}
          hasOrganization={hasOrganization}
          educationSpacePreset={educationSpacePreset}
          educationNoSpaceDockTeaser={educationNoSpaceDockTeaser}
          simpleOrgOnboarding0421={simpleOrgOnboarding0421}
          on0421EstablishOrganization={on0421EstablishOrganization}
          noEduSpace0421ChatToolbar={noEduSpace0421ChatToolbar}
          invite0421NewUserFlow={invite0421NewUserFlow}
          invite0421ShellGateRequest={invite0421ShellGateRequest}
          onInvite0421ShellGateRequestConsumed={clearInvite0421ShellGateRequest}
          invite0421OpenEducationNonce={invite0421OpenEducationNonce}
          invite0421EduStudentFlow={invite0421EduStudentFlow}
          invite0421EduStudentFamilyReady={invite0421EduStudentFamilyReady}
          invite0421EduInviteFlow={invite0421EduInviteFlow}
          onInvite0421EduInviteFlowPatch={patchInvite0421EduInviteFlow}
          onInvite0421EduStudentFlowComplete={() => setInvite0421EduStudentFamilyReady(true)}
          onInvite0421DemoApprovalInDemoNavVisibleChange={setInvite0421DemoApprovalNavVisible}
          schedule0422DrawerDemo={schedule0422DrawerDemo}
          interactionRulesNaturalDialogDemoNonce={
            demoInstructionShell ? interactionRulesNaturalDialogDemoNonce : 0
          }
          interactionRulesBusinessCardDemoNonce={
            demoInstructionShell ? interactionRulesBusinessCardDemoNonce : 0
          }
          interactionRulesMainAiOrgDemoNonce={
            demoInstructionShell ? interactionRulesMainAiOrgDemoNonce : 0
          }
          interactionRulesScrollToBottomDemoNonce={
            demoInstructionShell ? interactionRulesScrollToBottomDemoNonce : 0
          }
          interactionRulesMainAiDemoPrefillNonce={
            demoInstructionShell ? interactionRulesMainAiDemoPrefill.nonce : 0
          }
          interactionRulesMainAiDemoPrefillPrompt={
            demoInstructionShell ? interactionRulesMainAiDemoPrefill.prompt : ""
          }
          demoInstructionShell={demoInstructionShell}
          permissionEditCard0424Demo={permissionEditCard0424Demo}
          organizationManagement0425Demo={organizationManagement0425Demo}
          organizationManagement0425CommandNonce={organizationManagement0425CommandNonce}
          organizationManagement0425Scheme2CommandNonce={organizationManagement0425Scheme2CommandNonce}
        />
      ) : primaryNavId === "message" &&
        demoInstructionShell &&
        interactionRulesImFrameworkDemoActive ? (
        <InteractionRulesImFrameworkModule />
      ) : primaryNavId === "message" && invite0421NewUserFlow ? (
        <Invite0421MessageModule
          hasOrganization={hasOrganization}
          onJoinOrganizationComplete={() => on0421EstablishOrganization?.()}
        />
      ) : primaryNavId === "message" && invite0421EduStudentFlow ? (
        <Invite0421EduStudentMessageModule
          inviteEduFlowState={invite0421EduInviteFlow}
          onInviteEduFlowPatch={patchInvite0421EduInviteFlow}
          eduStudentFlowCompleteFromMainAi={invite0421EduStudentFamilyReady}
          onFlowComplete={() => {
            setInvite0421EduStudentFamilyReady(true)
            setPrimaryNavId("ai")
            setInvite0421OpenEducationNonce((n) => n + 1)
          }}
        />
      ) : (
        <NavModulePlaceholder navId={primaryNavId} />
      )}
    </>
  )

  return (
    <div className="flex h-screen w-full bg-bg-secondary relative">
      <Toaster />
      {/* 顶栏：返回｜当前页标题（与首页入口一致）+ 复制｜（邮箱演示场景）｜指令集 */}
      <div className="absolute top-[var(--space-500)] left-[var(--space-500)] right-[var(--space-500)] z-50 flex items-center">
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="flex shrink-0 items-center justify-center w-[var(--space-900)] h-[var(--space-900)] rounded-full bg-bg shadow-elevation-sm hover:bg-[var(--black-alpha-11)] transition-colors border border-border"
        >
          <ArrowLeft className="w-[var(--space-400)] h-[var(--space-400)] text-text" />
        </button>
        <div className="ml-[length:var(--space-800)] flex min-w-0 flex-1 flex-col items-start justify-center gap-[length:var(--space-150)]">
          <div className="flex min-w-0 max-w-full items-center justify-start gap-[length:var(--space-200)]">
            <span
              className="min-w-0 max-w-[min(100%,length:calc(var(--space-800)*14))] truncate text-left text-[length:var(--font-size-xs)] font-[var(--font-weight-regular)] leading-snug text-text-tertiary"
              title={demoNavTitle}
            >
              {demoNavTitle}
            </span>
            <button
              type="button"
              onClick={() => void copyDemoNavTitle()}
              aria-label={demoNavCopied ? "已复制" : "复制页面标题"}
              title={demoNavCopied ? "已复制" : "复制页面标题"}
              className="flex shrink-0 items-center justify-center rounded-[length:var(--radius-100)] p-[length:var(--space-50)] text-text-tertiary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              {demoNavCopied ? (
                <Check
                  className="size-[length:var(--space-300)] text-text-secondary"
                  strokeWidth={2}
                  aria-hidden
                />
              ) : (
                <Copy className="size-[length:var(--space-300)]" strokeWidth={2} aria-hidden />
              )}
            </button>
          </div>
          {showMailDemoScenario ? (
            <MailDemoScenarioDropdown
              value={mailDemoScenarioId}
              onValueChange={setMailDemoScenarioId}
            />
          ) : null}
        </div>
        <div className="flex shrink-0 items-center">
          {invite0421DemoApprovalNavVisible && on0421EstablishOrganization ? (
            <button
              type="button"
              onClick={() => on0421EstablishOrganization()}
              className="mr-[length:var(--space-800)] max-w-[min(100%,length:calc(var(--space-800)*7))] shrink-0 truncate rounded-[length:var(--radius-100)] bg-transparent px-[length:var(--space-100)] py-[length:var(--space-50)] text-left text-[length:var(--font-size-xs)] font-[var(--font-weight-regular)] leading-snug text-text-tertiary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              title="演示：审批通过"
            >
              演示：审批通过
            </button>
          ) : null}
          {demoInstructionShell ? <InteractionRulesChangelogLauncher /> : null}
          {organizationManagement0425Demo ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-[var(--space-900)] shrink-0 items-center justify-center gap-[var(--space-100)] rounded-full border border-border bg-bg px-[var(--space-350)] text-[length:var(--font-size-xs)] text-text-secondary shadow-elevation-sm transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
                >
                  指令集
                  <ChevronDown className="size-[var(--icon-xs)]" aria-hidden />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[length:calc(var(--space-800)*5)]">
                <DropdownMenuItem
                  onSelect={() => {
                    setOrganizationManagement0425CommandNonce((n) => n + 1)
                  }}
                >
                  {ORGANIZATION_MANAGEMENT_0425_USER_TRIGGER}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setOrganizationManagement0425Scheme2CommandNonce((n) => n + 1)
                  }}
                >
                  {ORGANIZATION_MANAGEMENT_0425_SCHEME2_INPUT_PROMPT}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>

      {demoInstructionSetShell ? (
        <InteractionDemoInstructionSetShell onCommand={handleDemoInstructionCommand}>
          <VVAppShell
            className={cn(
              "h-full min-h-0 w-full min-w-0 flex-1 max-h-full overflow-hidden rounded-[length:var(--radius-400)] border border-border shadow-elevation-lg",
              interactionRulesImFrameworkDemoActive &&
                "[--vv-ai-frame-background:var(--vv-im-app-frame-background)]",
            )}
            selectedPrimaryNavId={primaryNavId}
            onPrimaryNavChange={handlePrimaryNavChange}
            selectedShortcutId={shortcutId}
            onShortcutChange={invite0421ShellDockActive ? handleVVShortcutChange : setShortcutId}
            invite0421NoOrgDock={invite0421ShellDockActive}
            shellOrganizationActive={hasOrganization}
            onInvite0421UnaddedShortcutClick={
              invite0421ShellDockActive ? handleInvite0421UnaddedShortcut : undefined
            }
          >
            {vvAppShellMain}
          </VVAppShell>
        </InteractionDemoInstructionSetShell>
      ) : demoInstructionShell ? (
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-row pt-[76px]">
          <InteractionRulesDocShell onCommand={handleDemoInstructionCommand} />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col pt-0 pb-[length:var(--space-600)] pr-[length:var(--space-600)] pl-[length:var(--space-50)]">
            <VVAppShell
              className={cn(
                "h-full min-h-0 w-full min-w-0 flex-1 max-h-full overflow-hidden rounded-[length:var(--radius-400)] border border-border shadow-elevation-lg",
                interactionRulesImFrameworkDemoActive &&
                  "[--vv-ai-frame-background:var(--vv-im-app-frame-background)]",
              )}
              selectedPrimaryNavId={primaryNavId}
              onPrimaryNavChange={handlePrimaryNavChange}
              selectedShortcutId={shortcutId}
              onShortcutChange={invite0421ShellDockActive ? handleVVShortcutChange : setShortcutId}
              invite0421NoOrgDock={invite0421ShellDockActive}
              shellOrganizationActive={hasOrganization}
              onInvite0421UnaddedShortcutClick={
                invite0421ShellDockActive ? handleInvite0421UnaddedShortcut : undefined
              }
            >
              {vvAppShellMain}
            </VVAppShell>
          </div>
        </div>
      ) : (
        <div className="relative flex min-h-0 flex-1 justify-center items-center p-[var(--space-600)] pt-[76px]">
          <VVAppShell
            className="h-full w-full min-h-0"
            selectedPrimaryNavId={primaryNavId}
            onPrimaryNavChange={handlePrimaryNavChange}
            selectedShortcutId={shortcutId}
            onShortcutChange={invite0421ShellDockActive ? handleVVShortcutChange : setShortcutId}
            invite0421NoOrgDock={invite0421ShellDockActive}
            shellOrganizationActive={hasOrganization}
            onInvite0421UnaddedShortcutClick={
              invite0421ShellDockActive ? handleInvite0421UnaddedShortcut : undefined
            }
          >
            {vvAppShellMain}
          </VVAppShell>
        </div>
      )}
    </div>
  )
}
